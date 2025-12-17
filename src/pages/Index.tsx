import React from "react";
import { Link } from "react-router-dom";
import { Scale, MessageSquare, FileText, Shield, Users, BookOpen, ChevronRight, Sparkles, ArrowRight, CheckCircle, AlertTriangle, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { AshokaChakra } from "@/components/AshokaChakra";
import { AgentNetwork } from "@/components/AgentNetwork";
const features = [{
  icon: MessageSquare,
  title: "AI Legal Chat",
  description: "Get instant guidance on your legal issues with our multi-agent AI system trained on Indian law.",
  link: "/chat"
}, {
  icon: FileText,
  title: "FIR & Document Drafting",
  description: "Generate legally sound FIR drafts, complaints, and legal notices in proper format.",
  link: "/chat"
}, {
  icon: Shield,
  title: "False Case Defense",
  description: "Analyze accusations, identify weak claims, and understand your defense options.",
  link: "/chat"
}, {
  icon: Scale,
  title: "Law Section Mapping",
  description: "Automatic identification of applicable IPC, BNS, and CrPC sections for your case.",
  link: "/chat"
}, {
  icon: Users,
  title: "Lawyer Connection",
  description: "Connect with verified advocates when you need professional legal representation.",
  link: "/lawyers"
}, {
  icon: BookOpen,
  title: "Legal Resources",
  description: "Access comprehensive database of Indian laws, sections, and court judgments.",
  link: "/resources"
}];
const stats = [{
  value: "500+",
  label: "IPC Sections Covered"
}, {
  value: "358",
  label: "BNS Sections Mapped"
}, {
  value: "24/7",
  label: "AI Availability"
}, {
  value: "100%",
  label: "Privacy Protected"
}];
const legalCodes = [{
  name: "Indian Penal Code (IPC)",
  sections: "500+ Sections",
  status: "Active"
}, {
  name: "Bharatiya Nyaya Sanhita (BNS)",
  sections: "358 Sections",
  status: "New"
}, {
  name: "Criminal Procedure Code",
  sections: "484 Sections",
  status: "Active"
}, {
  name: "Indian Constitution",
  sections: "395 Articles",
  status: "Foundation"
}];
const Index: React.FC = () => {
  return <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5">
          <AshokaChakra size={800} className="text-primary" />
        </div>
        <div className="absolute top-20 right-10 opacity-10">
          <Scale className="w-32 h-32 text-primary" />
        </div>
        <div className="absolute bottom-20 left-10 opacity-10">
          <Gavel className="w-24 h-24 text-primary" />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge variant="gold" className="mb-6 py-1.5 px-4 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-1" />
              Powered by Multi-Agent AI System
            </Badge>
            
            {/* Title */}
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up">
              <span className="text-gradient-gold">LeXa AI Lawyer</span>
              <br />
              <span className="text-foreground text-3xl md:text-4xl lg:text-5xl">
                Smart Judiciary of India
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up delay-100">
              Empowering citizens with AI-powered legal guidance. Understand your rights under 
              the Indian Constitution, IPC, BNS, and CrPC with intelligent multi-agent assistance.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up delay-200">
              <Link to="/chat">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Start Legal Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/case-intake">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  <FileText className="w-5 h-5 mr-2" />
                  File New Case
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground animate-fade-in-up delay-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Based on Indian Constitution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>IPC & BNS Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-primary rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-y border-primary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => <div key={stat.label} className="text-center animate-fade-in-up" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <div className="text-3xl md:text-4xl font-bold text-gradient-gold font-serif mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Multi-Agent System Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="gold" className="mb-4">
              <Sparkles className="w-4 h-4 mr-1" />
              AI Architecture
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Multi-Agent AI System
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform uses multiple specialized AI agents that work together to provide 
              comprehensive legal guidance while maintaining ethical compliance.
            </p>
          </div>
          
          <AgentNetwork />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="gold" className="mb-4">Features</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Legal Assistance
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From understanding your rights to drafting legal documents, 
              AI LeXa Lawyer provides end-to-end legal guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return <Link key={feature.title} to={feature.link}>
                  <Card variant="elevated" className="h-full p-6 group cursor-pointer animate-fade-in-up" style={{
                animationDelay: `${index * 100}ms`
              }}>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-gold-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Learn more
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>;
          })}
          </div>
        </div>
      </section>

      {/* Legal Codes Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="gold" className="mb-4">Legal Framework</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Built on Indian Law
              </h2>
              <p className="text-muted-foreground mb-8">
                Our AI system is trained on comprehensive Indian legal codes, ensuring accurate 
                guidance based on current laws and procedures.
              </p>
              
              <div className="space-y-4">
                {legalCodes.map(code => <Card key={code.name} variant="judicial" className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{code.name}</h4>
                        <p className="text-sm text-muted-foreground">{code.sections}</p>
                      </div>
                      <Badge variant={code.status === "New" ? "gold" : "outline"}>
                        {code.status}
                      </Badge>
                    </div>
                  </Card>)}
              </div>
            </div>
            
            <div className="relative">
              <Card variant="parchment" className="p-8">
                <div className="absolute top-4 right-4">
                  <AshokaChakra size={60} className="text-primary/30" animate={false} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-secondary-foreground mb-4">
                  Fundamental Rights
                </h3>
                <div className="space-y-4 text-secondary-foreground/90">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">14</span>
                    </div>
                    <p className="text-sm">Equality before law and equal protection of laws</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">21</span>
                    </div>
                    <p className="text-sm">Protection of life and personal liberty</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">22</span>
                    </div>
                    <p className="text-sm">Protection against arrest and detention</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 bg-warning/10 border-y border-warning/30">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4 max-w-4xl mx-auto">
            <AlertTriangle className="w-8 h-8 text-warning flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-serif text-xl font-bold text-warning mb-2">
                Important Legal Disclaimer
              </h3>
              <p className="text-muted-foreground text-sm">
                AI LeXa Lawyer provides legal information and guidance only. It does not constitute 
                legal advice, representation, or replace consultation with a qualified advocate. 
                The platform does not render judicial decisions and always recommends consulting 
                a licensed lawyer for specific legal matters. Human-in-the-loop verification is 
                enforced for all sensitive cases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card variant="elevated" className="p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <AshokaChakra size={200} className="text-primary" />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Legal Guidance?
              </h2>
              <p className="text-muted-foreground mb-8">
                Start your consultation with AI LeXa Lawyer and understand your legal rights 
                and options under Indian law.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/chat">
                  <Button variant="hero" size="xl">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Start Free Consultation
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="xl">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </Layout>;
};
export default Index;