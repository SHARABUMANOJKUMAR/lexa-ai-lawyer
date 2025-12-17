import React from "react";
import { Layout } from "@/components/Layout";
import { LegalChatInterface } from "@/components/LegalChatInterface";
import { Badge } from "@/components/ui/badge";
import { Scale, Shield } from "lucide-react";

const Chat: React.FC = () => {
  return (
    <Layout showFooter={false}>
      <div className="h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <div className="border-b border-primary/20 bg-gradient-card p-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-serif text-xl font-bold">AI Legal Consultation</h1>
                  <p className="text-xs text-muted-foreground">Multi-Agent Legal Guidance System</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="hidden sm:flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success-foreground animate-pulse" />
                  System Active
                </Badge>
                <Badge variant="outline" className="hidden sm:flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  End-to-End Encrypted
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <div className="container mx-auto h-full max-w-5xl">
            <LegalChatInterface />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
