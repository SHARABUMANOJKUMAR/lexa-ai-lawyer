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
  Loader2,
  Volume2,
  X,
  FileText,
  Image,
  File,
  Upload,
  Brain,
  Beaker
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentNetwork } from "@/components/AgentNetwork";
import { useChat, ChatMessage } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { useEvidence } from "@/hooks/useEvidence";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
  file: File;
}

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
    content: `Namaste! I'm AI LeXa, your legal guidance assistant. I operate as a **multi-agent system** with specialized agents for:

• **Legal Analysis Agent** - Classifies issues & maps IPC/BNS/CrPC sections
• **FIR & Legal Drafting Agent** - Generates formal legal documents
• **Risk & Consequence Agent** - Explains bail, arrest risk, penalties
• **False Case Defense Agent** - Analyzes accusations & weak claims
• **Ethics & Compliance Agent** - Ensures proper disclaimers

**How to use:**
- Type your legal question or describe your situation
- Upload evidence files (images, PDFs, documents)
- Use voice input by clicking the microphone
- Try "AI Sandbox Mode" for structured legal exploration

How may I assist you today?`,
    agent_name: "UX Orchestrator Agent",
    created_at: new Date().toISOString(),
  },
];

export const LegalChatInterface: React.FC = () => {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useChat();
  const { uploadEvidence, analyzeEvidence, analyzing } = useEvidence();
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [activeAgents, setActiveAgents] = useState(["legal-analysis", "ethics-compliance"]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxCategory, setSandboxCategory] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
    if ((!input.trim() && uploadedFiles.length === 0) || isLoading) return;

    let userInput = input;
    
    // Include file references in the message
    if (uploadedFiles.length > 0) {
      const fileDescriptions = uploadedFiles.map(f => `[Attached: ${f.name} (${f.type})]`).join('\n');
      userInput = `${fileDescriptions}\n\n${input}`.trim();
    }

    setInput("");
    setUploadedFiles([]);
    await sendMessage(userInput);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 10MB.`);
        continue;
      }

      const uploadedFile: UploadedFile = {
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles(prev => 
            prev.map(f => f.id === uploadedFile.id ? { ...f, preview: e.target?.result as string } : f)
          );
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(uploadedFile);
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} file(s) attached`);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.includes('pdf')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        startSpeechRecognition();
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started... Speak now");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const startSpeechRecognition = () => {
    setIsTranscribing(true);
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? prev + ' ' + transcript : transcript);
        toast.success("Voice transcribed!");
        setIsTranscribing(false);
      };
      
      recognition.onerror = () => {
        toast.error("Could not transcribe. Please type your query.");
        setIsTranscribing(false);
      };
      
      recognition.onend = () => {
        setIsTranscribing(false);
      };
      
      recognition.start();
    } else {
      toast.info("Voice recognition not supported. Please type your query.");
      setIsTranscribing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const isSystemMessage = (message: ChatMessage) => {
    return message.role === "system" || message.content.includes("⚖️");
  };

  const extractSections = (content: string): string[] => {
    const sectionRegex = /(?:IPC|BNS|CrPC|Section)\s+\d+[A-Za-z]?(?:\s*[-–]\s*\d+[A-Za-z]?)?/gi;
    const matches = content.match(sectionRegex);
    return matches ? [...new Set(matches)] : [];
  };

  const handleSandboxExplore = (category: string) => {
    setSandboxCategory(category);
    const prompts: Record<string, string> = {
      criminal: "I want to understand criminal law in India. Explain IPC sections for common offenses like theft, assault, and fraud. What are the typical punishments?",
      civil: "Explain civil law procedures in India. How do property disputes, contract breaches, and recovery suits work?",
      family: "What are my rights in family law matters? Explain divorce, maintenance, custody, and domestic violence laws in India.",
      property: "Guide me through property law in India. How do land registration, inheritance, and property disputes work?",
      consumer: "What are consumer rights in India? How do I file a complaint and what remedies are available?",
      cyber: "Explain cyber crime laws in India. What constitutes cyber fraud, hacking, and online harassment?",
    };
    
    setInput(prompts[category] || "");
    setShowSandbox(false);
    toast.info(`Sandbox mode: ${category} law exploration`);
  };

  const renderMessageContent = (content: string) => {
    // Simple markdown-like rendering
    return content.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('###')) {
        return <h4 key={i} className="font-semibold text-primary mt-3 mb-1">{line.replace(/^###\s*/, '')}</h4>;
      }
      if (line.startsWith('##')) {
        return <h3 key={i} className="font-semibold text-lg mt-4 mb-2">{line.replace(/^##\s*/, '')}</h3>;
      }
      // Bullet points
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        const text = line.replace(/^[•\-\*]\s*/, '');
        return (
          <div key={i} className="flex items-start gap-2 my-1">
            <span className="text-primary mt-1">•</span>
            <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>') }} />
          </div>
        );
      }
      // Bold text
      if (line.includes('**')) {
        return <p key={i} className="my-1" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>') }} />;
      }
      // Empty lines
      if (!line.trim()) {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className="my-1">{line}</p>;
    });
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
          <div className="flex items-center gap-2">
            <Badge variant="gold" className="text-xs">
              Multi-Agent System
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setShowSandbox(true)}
            >
              <Beaker className="w-3 h-3 mr-1" />
              AI Sandbox
            </Button>
          </div>
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
                  <div className={`text-sm ${isDisclaimer ? "text-secondary-foreground" : ""}`}>
                    {renderMessageContent(message.content)}
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
              <div className="mt-2 flex gap-2">
                {activeAgents.map(agent => (
                  <Badge key={agent} variant="outline" className="text-xs animate-pulse">
                    {agent.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="px-4 py-2 border-t border-primary/20 bg-muted/20">
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map(file => (
              <div 
                key={file.id}
                className="flex items-center gap-2 bg-muted border border-primary/30 rounded-lg px-3 py-2"
              >
                {file.preview ? (
                  <img src={file.preview} alt={file.name} className="w-8 h-8 object-cover rounded" />
                ) : (
                  getFileIcon(file.type)
                )}
                <div className="text-xs">
                  <p className="font-medium truncate max-w-[120px]">{file.name}</p>
                  <p className="text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            title="Attach evidence"
            disabled={isLoading}
            onClick={() => fileInputRef.current?.click()}
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
              disabled={isLoading || !user || isTranscribing}
            />
            {isRecording && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-xs text-destructive">Recording...</span>
              </div>
            )}
          </div>
          
          <Button
            type="button"
            variant={isRecording ? "destructive" : "ghost"}
            size="icon"
            className={`flex-shrink-0 transition-all ${isRecording ? "animate-pulse" : ""}`}
            onClick={toggleRecording}
            title={isRecording ? "Stop recording" : "Voice input"}
            disabled={isLoading || !user || isTranscribing}
          >
            {isTranscribing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
          
          <Button
            type="submit"
            variant="hero"
            size="icon"
            className="flex-shrink-0"
            disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading || !user}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {!user && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            <a href="/auth" className="text-primary hover:underline">Login or create an account</a> to start your legal consultation
          </p>
        )}
        
        {isRecording && (
          <p className="text-xs text-muted-foreground mt-2 text-center flex items-center justify-center gap-2">
            <Volume2 className="w-3 h-3 text-primary animate-pulse" />
            Listening... Click the mic button again to stop
          </p>
        )}
      </form>

      {/* AI Sandbox Dialog */}
      <Dialog open={showSandbox} onOpenChange={setShowSandbox}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-primary" />
              AI Sandbox Mode
            </DialogTitle>
            <DialogDescription>
              Explore Indian legal topics in a structured, guided manner
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {[
              { id: 'criminal', label: 'Criminal Law', icon: '⚖️', desc: 'IPC, theft, assault, fraud' },
              { id: 'civil', label: 'Civil Law', icon: '📜', desc: 'Contracts, property, recovery' },
              { id: 'family', label: 'Family Law', icon: '👨‍👩‍👧', desc: 'Divorce, custody, maintenance' },
              { id: 'property', label: 'Property Law', icon: '🏠', desc: 'Land, inheritance, disputes' },
              { id: 'consumer', label: 'Consumer Rights', icon: '🛒', desc: 'Complaints, refunds, CPGRAMS' },
              { id: 'cyber', label: 'Cyber Crime', icon: '💻', desc: 'IT Act, fraud, harassment' },
            ].map(category => (
              <Card 
                key={category.id}
                variant="glass"
                className="p-4 cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => handleSandboxExplore(category.id)}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <h4 className="font-semibold text-sm">{category.label}</h4>
                <p className="text-xs text-muted-foreground">{category.desc}</p>
              </Card>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Select a category to start guided legal exploration
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};