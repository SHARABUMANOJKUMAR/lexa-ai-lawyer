import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agent_name?: string;
  metadata?: any;
  created_at: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  hasReasoning?: boolean;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/legal-chat`;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const useChat = () => {
  const { user, session } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const createConversation = async (title?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title: title || 'New Legal Consultation',
        })
        .select()
        .single();

      if (error) throw error;
      setConversationId(data.id);
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  const saveMessage = async (
    convId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    agentName?: string,
    metadata?: any
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: convId,
          user_id: user.id,
          role,
          content,
          agent_name: agentName,
          metadata,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  };

  const extractConfidence = (content: string): 'HIGH' | 'MEDIUM' | 'LOW' | undefined => {
    const confidenceMatch = content.match(/\*\*Confidence Level\*\*:\s*\[?(HIGH|MEDIUM|LOW)\]?/i);
    if (confidenceMatch) {
      return confidenceMatch[1].toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW';
    }
    return undefined;
  };

  const extractAgentName = (content: string): string => {
    const agentMatch = content.match(/\*\*Responding Agent\*\*:\s*\[?([^\]\n]+)\]?/i);
    if (agentMatch) {
      return agentMatch[1].trim();
    }
    return 'Legal Analysis Agent';
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const sendMessage = useCallback(async (userInput: string, attachedFiles?: { name: string; type: string }[]) => {
    if (!userInput.trim() || isLoading) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    
    // Create conversation if needed
    let convId = conversationId;
    if (!convId && user) {
      convId = await createConversation();
    }

    // Build user message with file references
    let fullUserInput = userInput;
    if (attachedFiles && attachedFiles.length > 0) {
      const fileList = attachedFiles.map(f => `- ${f.name} (${f.type})`).join('\n');
      fullUserInput = `[User has attached the following files:\n${fileList}]\n\n${userInput}`;
    }

    // Add user message to state
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userInput,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Save user message
    if (convId) {
      await saveMessage(convId, 'user', fullUserInput);
    }

    let retryCount = 0;
    let success = false;

    while (retryCount < MAX_RETRIES && !success) {
      try {
        const accessToken = session?.access_token;
        if (!accessToken) {
          throw new Error('Please sign in to continue');
        }

        // Prepare messages for API
        const apiMessages = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));
        apiMessages.push({ role: 'user', content: fullUserInput });

        const response = await fetch(CHAT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ 
            messages: apiMessages,
            conversationId: convId,
            stream: true,
          }),
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          if (errorData.retry && retryCount < MAX_RETRIES - 1) {
            retryCount++;
            await delay(RETRY_DELAY * retryCount);
            continue;
          }
          
          throw new Error(errorData.error || 'Failed to get response');
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';
        let assistantMessageId = `temp-assistant-${Date.now()}`;

        // Add empty assistant message
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            agent_name: 'Legal Analysis Agent',
            created_at: new Date().toISOString(),
          },
        ]);

        if (reader) {
          let textBuffer = '';
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            textBuffer += decoder.decode(value, { stream: true });
            
            let newlineIndex: number;
            while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
              let line = textBuffer.slice(0, newlineIndex);
              textBuffer = textBuffer.slice(newlineIndex + 1);
              
              if (line.endsWith('\r')) line = line.slice(0, -1);
              if (line.startsWith(':') || line.trim() === '') continue;
              if (!line.startsWith('data: ')) continue;
              
              const jsonStr = line.slice(6).trim();
              if (jsonStr === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantContent += content;
                  const confidence = extractConfidence(assistantContent);
                  const agentName = extractAgentName(assistantContent);
                  
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessageId
                        ? { 
                            ...m, 
                            content: assistantContent,
                            confidence,
                            agent_name: agentName,
                            hasReasoning: assistantContent.includes('**AI Reasoning**'),
                          }
                        : m
                    )
                  );
                }
              } catch {
                textBuffer = line + '\n' + textBuffer;
                break;
              }
            }
          }
        }

        // Save assistant message
        if (convId && assistantContent) {
          const agentName = extractAgentName(assistantContent);
          await saveMessage(convId, 'assistant', assistantContent, agentName);
        }

        // Add disclaimer message
        const disclaimerMessage: ChatMessage = {
          id: `disclaimer-${Date.now()}`,
          role: 'system',
          content: '⚖️ **Important Notice**: This guidance is for informational purposes only and does not constitute legal advice. For matters affecting your legal rights, please consult a qualified advocate registered with the Bar Council of India.',
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, disclaimerMessage]);

        success = true;

      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          // Request was cancelled, don't show error
          return;
        }

        console.error('Chat error:', error);
        
        if (retryCount < MAX_RETRIES - 1) {
          retryCount++;
          await delay(RETRY_DELAY * retryCount);
          continue;
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
        setError(errorMessage);
        toast.error(errorMessage, {
          description: 'Please try again or rephrase your question.',
          action: {
            label: 'Retry',
            onClick: () => sendMessage(userInput, attachedFiles),
          },
        });
        
        // Remove the user message if there was an error
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      }
    }

    setIsLoading(false);
  }, [messages, isLoading, conversationId, user]);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  const clearMessages = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    cancelRequest,
    conversationId,
    error,
  };
};
