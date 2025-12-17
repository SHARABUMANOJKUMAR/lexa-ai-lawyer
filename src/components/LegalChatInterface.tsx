import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Bot, 
  User, 
  Scale,
  AlertTriangle,
  FileText,
  Download,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentNetwork } from "@/components/AgentNetwork";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  agent?: string;
  sections?: string[];
  isDisclaimer?: boolean;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "system",
    content: "Welcome to AI LeXa Lawyer. I am your AI-powered legal guidance assistant, designed to help Indian citizens understand their legal rights and options under the Indian Constitution, IPC, BNS, and CrPC.",
    timestamp: new Date(),
    isDisclaimer: true,
  },
  {
    id: "2",
    role: "assistant",
    content: "Namaste! I'm AI LeXa, your legal guidance assistant. I can help you with:\n\n• Understanding applicable law sections (IPC/BNS/CrPC)\n• Drafting FIRs and legal complaints\n• Explaining legal consequences and procedures\n• Defense strategies for false accusations\n\nHow may I assist you today?",
    timestamp: new Date(),
    agent: "Legal Analysis Agent",
  },
];

export const LegalChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeAgents, setActiveAgents] = useState(["legal-analysis", "ethics-compliance"]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setActiveAgents(["legal-analysis", "risk-consequence", "ethics-compliance", "ux-orchestrator"]);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateLegalResponse(input),
        timestamp: new Date(),
        agent: "Legal Analysis Agent",
        sections: ["IPC Section 420", "BNS Section 316"],
      };

      const disclaimerMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "system",
        content: "⚖️ This guidance is for informational purposes only and does not constitute legal advice. For specific legal matters, please consult a qualified advocate.",
        timestamp: new Date(),
        isDisclaimer: true,
      };

      setMessages((prev) => [...prev, assistantMessage, disclaimerMessage]);
      setIsLoading(false);
      setActiveAgents(["legal-analysis", "ethics-compliance"]);
    }, 2500);
  };

  const generateLegalResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("fir") || lowerQuery.includes("complaint")) {
      return `Based on your query, I've analyzed the relevant legal provisions:\n\n**Applicable Sections:**\n• IPC Section 420 (Cheating and dishonestly inducing delivery of property)\n• CrPC Section 154 (Information in cognizable cases)\n\n**Procedure to File FIR:**\n1. Visit the nearest police station within your jurisdiction\n2. Provide written complaint to the Station House Officer (SHO)\n3. If police refuses, you can approach the Superintendent of Police\n4. You may also file a private complaint before Magistrate under CrPC Section 200\n\n**I can help you draft an FIR complaint. Would you like me to proceed?**`;
    }
    
    if (lowerQuery.includes("arrest") || lowerQuery.includes("bail")) {
      return `Regarding arrest and bail provisions under Indian law:\n\n**Key Points:**\n• **Bailable Offenses:** Bail is a matter of right. Police must grant bail at the station.\n• **Non-Bailable Offenses:** Requires court application under CrPC Section 437/439\n\n**Your Rights During Arrest:**\n1. Right to know grounds of arrest (Article 22)\n2. Right to legal counsel\n3. Right to inform family/friend\n4. Must be produced before magistrate within 24 hours\n\n**Would you like me to explain the bail application process?**`;
    }
    
    if (lowerQuery.includes("false") || lowerQuery.includes("fake case")) {
      return `I understand you're concerned about a potentially false case. Let me analyze this:\n\n**Immediate Steps:**\n1. Preserve all evidence (messages, documents, recordings)\n2. Do not destroy any evidence even if unfavorable\n3. Consult an advocate immediately\n\n**Legal Remedies:**\n• File for anticipatory bail if arrest is likely (CrPC Section 438)\n• Lodge counter-complaint if applicable\n• Seek quashing of FIR under CrPC Section 482 / Article 226\n\n**Warning Signs of False Cases:**\n• Inconsistent statements\n• Delayed complaint without justification\n• Material contradictions\n\n**Would you like me to analyze specific aspects of your situation?**`;
    }
    
    return `Thank you for your query. Based on my analysis:\n\n**Initial Assessment:**\nYour matter appears to involve aspects of civil and/or criminal law under Indian jurisdiction.\n\n**Recommended Next Steps:**\n1. Gather all relevant documents and evidence\n2. Note down timeline of events with dates\n3. Identify witnesses if any\n\n**I can help you with:**\n• Understanding applicable legal sections\n• Drafting complaints or legal notices\n• Explaining your rights and remedies\n\n**Please provide more details about your specific situation so I can offer more targeted guidance.**`;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
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
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-fade-in-up ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role !== "user" && (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isDisclaimer 
                  ? "bg-warning/20 text-warning" 
                  : "bg-gradient-to-br from-primary to-gold-light text-primary-foreground"
              }`}>
                {message.isDisclaimer ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <Scale className="w-5 h-5" />
                )}
              </div>
            )}
            
            <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
              {message.agent && (
                <Badge variant="agent" className="text-xs mb-1">
                  {message.agent}
                </Badge>
              )}
              
              <Card 
                variant={
                  message.role === "user" 
                    ? "judicial" 
                    : message.isDisclaimer 
                      ? "parchment" 
                      : "glass"
                }
                className={`p-4 ${
                  message.role === "user" 
                    ? "bg-primary/20" 
                    : message.isDisclaimer 
                      ? "border-warning/50" 
                      : ""
                }`}
              >
                <div className={`text-sm whitespace-pre-wrap ${
                  message.isDisclaimer ? "text-secondary-foreground" : ""
                }`}>
                  {message.content}
                </div>
                
                {message.sections && message.sections.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-primary/20 flex flex-wrap gap-2">
                    {message.sections.map((section) => (
                      <Badge key={section} variant="judicial" className="text-xs">
                        {section}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
              
              <p className="text-xs text-muted-foreground mt-1 px-1">
                {message.timestamp.toLocaleTimeString("en-IN", {
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
        ))}
        
        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary-foreground" />
            </div>
            <Card variant="glass" className="p-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-primary typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-primary typing-dot" />
                </div>
                <span className="text-sm text-muted-foreground">AI agents analyzing...</span>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-primary/20 bg-muted/20">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            "How to file an FIR?",
            "Explain my rights during arrest",
            "Draft a legal notice",
            "What is anticipatory bail?",
          ].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs"
              onClick={() => setInput(suggestion)}
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
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your legal situation..."
              className="w-full bg-muted border border-primary/30 rounded-lg px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              disabled={isLoading}
            />
          </div>
          
          <Button
            type="button"
            variant={isRecording ? "destructive" : "ghost"}
            size="icon"
            className="flex-shrink-0"
            onClick={toggleRecording}
            title={isRecording ? "Stop recording" : "Voice input"}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          
          <Button
            type="submit"
            variant="hero"
            size="icon"
            className="flex-shrink-0"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};
