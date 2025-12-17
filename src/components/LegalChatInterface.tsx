import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  User, 
  Scale,
  AlertTriangle,
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentNetwork } from "@/components/AgentNetwork";
import { useChat, ChatMessage } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";

const initialWelcomeMessages: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "system",
    content: "Welcome to AI LeXa Lawyer. I am your AI-powered legal guidance assistant, designed to help Indian citizens understand their legal rights and options under the Indian Constitution, IPC, BNS, and CrPC.",
    created_at: new Date().toISOString(),
  },
  {
    id: "welcome-2",
    role: "assistant",
    content: "Namaste! I'm AI LeXa, your legal guidance assistant. I operate as a multi-agent system with specialized agents for:\n\n• **Legal Analysis** - Classifies issues & maps law sections\n• **FIR Drafting** - Generates formal legal documents\n• **Risk Assessment** - Explains consequences & procedures\n• **Defense Strategy** - Analyzes false accusations\n• **Ethics Compliance** - Ensures proper disclaimers\n\nHow may I assist you today?",
    agent_name: "User Experience Orchestrator Agent",
    created_at: new Date().toISOString(),
  },
];

export const LegalChatInterface: React.FC = () => {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [activeAgents, setActiveAgents] = useState(["legal-analysis", "ethics-compliance"]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const displayMessages = messages.length > 0 ? messages : initialWelcomeMessages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  useEffect(() => {
    if (isLoading) {
      setActiveAgents(["legal-analysis", "risk-consequence", "ethics-compliance", "ux-orchestrator"]);
    } else {
      setActiveAgents(["legal-analysis", "ethics-compliance"]);
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input;
    setInput("");
    await sendMessage(userInput);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const isSystemMessage = (message: ChatMessage) => {
    return message.role === "system" || message.content.includes("⚖️");
  };

  const extractSections = (content: string): string[] => {
    const sectionRegex = /(?:IPC|BNS|CrPC|Section)\s+\d+[A-Za-z]?(?:\s*[-–]\s*\d+[A-Za-z]?)?/gi;
    const matches = content.match(sectionRegex);
    return matches ? [...new Set(matches)] : [];
  };

  return (
    <div className="flex flex-col h-full">
      {/* Agent Status Bar */}
      <div className="p-4 border-b border-primary/20 bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Active AI Agents</span>
          </div>
          <Badge variant="gold" className="text-xs">
            Multi-Agent System
          </Badge>
        </div>
        <AgentNetwork activeAgents={activeAgents} compact />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.map((message) => {
          const sections = message.role === "assistant" ? extractSections(message.content) : [];
          const isDisclaimer = isSystemMessage(message);
          
          return (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in-up ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role !== "user" && (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDisclaimer 
                    ? "bg-warning/20 text-warning" 
                    : "bg-gradient-to-br from-primary to-gold-light text-primary-foreground"
                }`}>
                  {isDisclaimer ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Scale className="w-5 h-5" />
                  )}
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                {message.agent_name && !isDisclaimer && (
                  <Badge variant="agent" className="text-xs mb-1">
                    {message.agent_name}
                  </Badge>
                )}
                
                <Card 
                  variant={
                    message.role === "user" 
                      ? "judicial" 
                      : isDisclaimer 
                        ? "parchment" 
                        : "glass"
                  }
                  className={`p-4 ${
                    message.role === "user" 
                      ? "bg-primary/20" 
                      : isDisclaimer 
                        ? "border-warning/50" 
                        : ""
                  }`}
                >
                  <div className={`text-sm whitespace-pre-wrap ${
                    isDisclaimer ? "text-secondary-foreground" : ""
                  }`}>
                    {message.content}
                  </div>
                  
                  {sections.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-primary/20 flex flex-wrap gap-2">
                      {sections.slice(0, 5).map((section, idx) => (
                        <Badge key={`${section}-${idx}`} variant="judicial" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
                
                <p className="text-xs text-muted-foreground mt-1 px-1">
                  {new Date(message.created_at).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              
              {message.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-accent-foreground" />
                </div>
              )}
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary-foreground" />
            </div>
            <Card variant="glass" className="p-4">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">AI agents analyzing your query...</span>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-primary/20 bg-muted/20">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            "How to file an FIR?",
            "Explain my rights during arrest",
            "Draft a legal notice",
            "What is anticipatory bail?",
            "False case defense options",
          ].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs hover:bg-primary/10"
              onClick={() => setInput(suggestion)}
              disabled={isLoading}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-primary/20 bg-card">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            title="Attach evidence"
            disabled={isLoading}
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={user ? "Describe your legal situation..." : "Please login to start a consultation..."}
              className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              disabled={isLoading || !user}
            />
          </div>
          
          <Button
            type="button"
            variant={isRecording ? "destructive" : "ghost"}
            size="icon"
            className="flex-shrink-0"
            onClick={toggleRecording}
            title={isRecording ? "Stop recording" : "Voice input"}
            disabled={isLoading || !user}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          
          <Button
            type="submit"
            variant="hero"
            size="icon"
            className="flex-shrink-0"
            disabled={!input.trim() || isLoading || !user}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {!user && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            <a href="/auth" className="text-primary hover:underline">Login or create an account</a> to start your legal consultation
          </p>
        )}
      </form>
    </div>
  );
};
