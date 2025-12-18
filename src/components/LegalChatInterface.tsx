import React, { useState, useRef, useEffect } from "react";
import DOMPurify from "dompurify";
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
  X,
  FileText,
  Image,
  File,
  Beaker,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentNetwork } from "@/components/AgentNetwork";
import { useChat, ChatMessage } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Sanitize HTML to prevent XSS attacks
const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'em', 'b', 'i', 'span', 'p', 'br'],
    ALLOWED_ATTR: ['class'],
  });
};

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
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
    content: `**Namaste!** I am AI LeXa, your trusted legal guidance assistant.

I operate as a **multi-agent system** with specialized capabilities to serve you better:

• **Legal Analysis Agent** — Classifies your legal issues and identifies applicable IPC/BNS/CrPC sections
• **FIR & Legal Drafting Agent** — Generates formal legal documents in proper Indian format
• **Risk & Consequence Agent** — Explains bail status, arrest risk, and penalties clearly
• **False Case Defense Agent** — Analyzes accusations and identifies weak claims
• **Ethics & Compliance Agent** — Ensures proper disclaimers and responsible guidance

**How to get started:**
1. Describe your legal situation in detail
2. Upload any relevant documents (images, PDFs)
3. Use voice input by clicking the microphone
4. Try **AI Sandbox Mode** for educational exploration

**I am here to help you understand your rights and guide you through the legal process. How may I assist you today?**`,
    agent_name: "UX Orchestrator Agent",
    created_at: new Date().toISOString(),
    confidence: "HIGH",
  },
];

const sandboxCategories = [
  { id: "criminal", label: "Criminal Law", icon: "⚖️", description: "IPC offenses, theft, assault, fraud" },
  { id: "civil", label: "Civil Matters", icon: "📋", description: "Property disputes, contracts, recovery" },
  { id: "family", label: "Family Law", icon: "👨‍👩‍👧", description: "Divorce, custody, maintenance" },
  { id: "property", label: "Property Law", icon: "🏠", description: "Land, inheritance, registration" },
  { id: "consumer", label: "Consumer Rights", icon: "🛒", description: "Complaints, refunds, remedies" },
  { id: "cyber", label: "Cyber Crime", icon: "💻", description: "Online fraud, hacking, harassment" },
];

export const LegalChatInterface: React.FC = () => {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage, cancelRequest, error } = useChat();
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [activeAgents, setActiveAgents] = useState(["legal-analysis", "ethics-compliance"]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showSandbox, setShowSandbox] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<string | null>(null);
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

    const attachedFiles = uploadedFiles.map(f => ({ name: f.name, type: f.type }));
    const currentInput = input;
    
    setInput("");
    setUploadedFiles([]);
    
    await sendMessage(currentInput, attachedFiles.length > 0 ? attachedFiles : undefined);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large`, {
          description: "Maximum file size is 10MB",
        });
        continue;
      }

      // Validate file type
      const allowedTypes = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument'];
      const isAllowed = allowedTypes.some(type => file.type.startsWith(type) || file.type.includes(type));
      
      if (!isAllowed) {
        toast.error(`${file.name} type not supported`, {
          description: "Please upload images, PDFs, or documents",
        });
        continue;
      }

      const uploadedFile: UploadedFile = {
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
        status: 'success',
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

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) attached successfully`, {
        description: "Files will be referenced in your message",
      });
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast.info("File removed");
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-destructive" />;
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
      toast.info("Recording started", {
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Microphone access denied", {
        description: "Please allow microphone access in your browser settings",
      });
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
        toast.success("Voice transcribed successfully");
        setIsTranscribing(false);
      };
      
      recognition.onerror = () => {
        toast.error("Could not transcribe audio", {
          description: "Please type your query instead",
        });
        setIsTranscribing(false);
      };
      
      recognition.onend = () => {
        setIsTranscribing(false);
      };
      
      recognition.start();
    } else {
      toast.info("Voice recognition not supported", {
        description: "Please type your query instead",
      });
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

  const getConfidenceBadge = (confidence?: 'HIGH' | 'MEDIUM' | 'LOW') => {
    if (!confidence) return null;
    
    const configs = {
      HIGH: { icon: CheckCircle, color: 'bg-success/20 text-success border-success/30', label: 'High Confidence' },
      MEDIUM: { icon: AlertCircle, color: 'bg-warning/20 text-warning border-warning/30', label: 'Medium Confidence' },
      LOW: { icon: HelpCircle, color: 'bg-muted text-muted-foreground border-muted', label: 'Low Confidence' },
    };
    
    const config = configs[confidence];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={`text-xs flex items-center gap-1 ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const handleSandboxExplore = (category: string) => {
    const prompts: Record<string, string> = {
      criminal: "[SANDBOX MODE - Educational Exploration]\n\nI want to understand criminal law in India. Please explain the common IPC sections for offenses like theft, assault, and fraud. What are the typical punishments and bail provisions?",
      civil: "[SANDBOX MODE - Educational Exploration]\n\nExplain civil law procedures in India. How do property disputes, contract breaches, and recovery suits work? What is the typical timeline and process?",
      family: "[SANDBOX MODE - Educational Exploration]\n\nWhat are my rights in family law matters? Explain divorce procedures, maintenance laws, custody rights, and domestic violence protections under Indian law.",
      property: "[SANDBOX MODE - Educational Exploration]\n\nGuide me through property law in India. How do land registration, inheritance rules, and property dispute resolution work?",
      consumer: "[SANDBOX MODE - Educational Exploration]\n\nWhat are consumer rights in India under the Consumer Protection Act 2019? How do I file a complaint and what remedies are available?",
      cyber: "[SANDBOX MODE - Educational Exploration]\n\nExplain cyber crime laws in India under the IT Act 2000. What constitutes cyber fraud, hacking, and online harassment? What are the penalties?",
    };
    
    setInput(prompts[category] || "");
    setShowSandbox(false);
    toast.info("Sandbox Mode Activated", {
      description: "Exploring educational legal information",
    });
  };

  const renderMessageContent = (content: string, messageId: string, hasReasoning?: boolean) => {
    // Extract AI Reasoning section if present
    const reasoningMatch = content.match(/\*\*AI Reasoning\*\*[:\s]*\n?([\s\S]*?)(?=\n\*\*Disclaimer\*\*|\n---|\n\*\*7\.|$)/i);
    const reasoning = reasoningMatch ? reasoningMatch[0] : null;
    
    // Content without the reasoning section for initial display
    const mainContent = reasoning 
      ? content.replace(reasoning, '').replace(/\n{3,}/g, '\n\n')
      : content;

    return (
      <div className="space-y-2">
        {mainContent.split('\n').map((line, i) => {
          // Headers
          if (line.startsWith('###')) {
            return <h4 key={i} className="font-semibold text-primary mt-3 mb-1 text-sm">{line.replace(/^###\s*/, '')}</h4>;
          }
          if (line.startsWith('##')) {
            return <h3 key={i} className="font-semibold text-base mt-4 mb-2">{line.replace(/^##\s*/, '')}</h3>;
          }
          // Numbered items
          if (/^\d+\./.test(line)) {
            const text = line.replace(/^\d+\.\s*/, '');
            return (
              <div key={i} className="flex items-start gap-2 my-1 pl-2">
                <span className="text-primary font-medium min-w-[20px]">{line.match(/^\d+/)?.[0]}.</span>
                <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')) }} />
              </div>
            );
          }
          // Bullet points
          if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
            const text = line.replace(/^[•\-\*]\s*/, '');
            return (
              <div key={i} className="flex items-start gap-2 my-1 pl-4">
                <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')) }} />
              </div>
            );
          }
          // Bold text
          if (line.includes('**')) {
            return <p key={i} className="my-1" dangerouslySetInnerHTML={{ __html: sanitizeHtml(line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')) }} />;
          }
          // Empty lines
          if (!line.trim()) {
            return <div key={i} className="h-2" />;
          }
          return <p key={i} className="my-1 leading-relaxed">{line}</p>;
        })}
        
        {/* Expandable AI Reasoning Section */}
        {hasReasoning && reasoning && (
          <div className="mt-4 border-t border-primary/20 pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setExpandedReasoning(expandedReasoning === messageId ? null : messageId)}
            >
              <span className="flex items-center gap-2">
                <Info className="w-3 h-3" />
                Why this response? (AI Reasoning)
              </span>
              {expandedReasoning === messageId ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            {expandedReasoning === messageId && (
              <div className="mt-2 p-3 bg-muted/50 rounded-lg text-sm animate-fade-in">
                {reasoning.split('\n').map((line, i) => {
                  if (!line.trim() || line.includes('**AI Reasoning**')) return null;
                  if (line.startsWith('-') || line.startsWith('•')) {
                    return (
                      <div key={i} className="flex items-start gap-2 my-1">
                        <span className="text-primary">•</span>
                        <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(line.replace(/^[-•]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')) }} />
                      </div>
                    );
                  }
                  return <p key={i} className="my-1" dangerouslySetInnerHTML={{ __html: sanitizeHtml(line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')) }} />;
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
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
              
              <div className={`max-w-[85%] ${message.role === "user" ? "order-first" : ""}`}>
                {/* Agent badge and confidence */}
                {message.role === "assistant" && !isDisclaimer && (
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {message.agent_name && (
                      <Badge variant="agent" className="text-xs">
                        {message.agent_name}
                      </Badge>
                    )}
                    {getConfidenceBadge(message.confidence)}
                  </div>
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
                    {renderMessageContent(message.content, message.id, message.hasReasoning)}
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
              <Scale className="w-5 h-5 text-primary-foreground animate-pulse" />
            </div>
            <Card variant="glass" className="p-4 max-w-[80%]">
              <div className="flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">AI agents analyzing your query...</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-muted-foreground"
                  onClick={cancelRequest}
                >
                  Cancel
                </Button>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {activeAgents.map(agent => (
                  <Badge key={agent} variant="outline" className="text-xs animate-pulse">
                    {agent.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        )}

        {error && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <Card variant="glass" className="p-4 border-destructive/50">
              <p className="text-sm text-destructive">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </Button>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="px-4 py-2 border-t border-primary/20 bg-muted/20">
          <p className="text-xs text-muted-foreground mb-2">Attached files ({uploadedFiles.length}):</p>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map(file => (
              <div 
                key={file.id}
                className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${
                  file.status === 'error' 
                    ? 'bg-destructive/10 border-destructive/30' 
                    : 'bg-muted border-primary/30'
                }`}
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

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-primary/20 bg-muted/30">
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
          />
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            title="Attach files (images, PDF, documents)"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={toggleRecording}
            disabled={isLoading || isTranscribing}
            title={isRecording ? "Stop recording" : "Start voice input"}
          >
            {isTranscribing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? "Recording... Click mic to stop" : "Describe your legal situation..."}
            className="flex-1 bg-muted border border-primary/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isLoading || isRecording}
          />
          
          <Button
            type="submit"
            variant="hero"
            size="icon"
            disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI LeXa provides legal guidance, not legal advice. Consult a qualified advocate for specific matters.
        </p>
      </form>

      {/* Sandbox Dialog */}
      <Dialog open={showSandbox} onOpenChange={setShowSandbox}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-primary" />
              AI Sandbox Mode
            </DialogTitle>
            <DialogDescription>
              Explore legal topics in a safe educational environment. Sandbox responses are clearly marked as exploratory guidance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            {sandboxCategories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 text-left hover:bg-primary/10 hover:border-primary"
                onClick={() => handleSandboxExplore(category.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium">{category.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{category.description}</span>
              </Button>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Sandbox mode is for educational exploration only. For real legal matters, please provide specific details about your situation.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
