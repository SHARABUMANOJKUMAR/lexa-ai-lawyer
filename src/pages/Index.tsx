import React from "react";
import { Link } from "react-router-dom";
import {
  Scale, MessageSquare, FileText, Shield, Users, BookOpen, ChevronRight, Sparkles,
  ArrowRight, CheckCircle, AlertTriangle, Gavel, Brain, Zap, Lock, Globe, Search,
  Upload, PlayCircle, Star, Building2, BadgeCheck, Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { AgentNetwork } from "@/components/AgentNetwork";
import { LadyJustice } from "@/components/LadyJustice";
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
const testimonials = [
  { name: "Priya S.", role: "Small Business Owner", quote: "LeXa explained the FIR process in minutes. It felt like having a lawyer on call at 2am." },
  { name: "Adv. Rohan M.", role: "Advocate, Delhi HC", quote: "The section mapping is remarkably accurate. It saves me hours during client intake." },
  { name: "Kavya R.", role: "Student", quote: "I finally understood my rights under Article 21. Beautiful, calm, and easy to use." },
];

const practiceAreas = [
  { icon: Shield, label: "Criminal Law", color: "from-blue-500 to-indigo-500" },
  { icon: Building2, label: "Property Law", color: "from-purple-500 to-fuchsia-500" },
  { icon: Users, label: "Family Law", color: "from-pink-500 to-rose-500" },
  { icon: FileText, label: "Consumer Rights", color: "from-sky-500 to-cyan-500" },
  { icon: Scale, label: "Civil Disputes", color: "from-amber-500 to-orange-500" },
  { icon: BookOpen, label: "Constitutional", color: "from-emerald-500 to-teal-500" },
];

const workflow = [
  { step: "01", title: "Describe your situation", desc: "Chat, upload documents, or record voice — the AI listens without judgment." },
  { step: "02", title: "AI analyzes & maps laws", desc: "Multi-agent system identifies IPC, BNS, and CrPC sections that apply." },
  { step: "03", title: "Get clear guidance", desc: "Understand your rights, generate an FIR, and know your next best step." },
];

const faqs = [
  { q: "Is LeXa a replacement for a lawyer?", a: "No. LeXa provides guidance and information. For representation, we help you connect with verified advocates." },
  { q: "Which laws does the AI understand?", a: "Indian Constitution, IPC, BNS (2023), CrPC, and major Supreme Court judgments." },
  { q: "Is my data private?", a: "Yes. Conversations are encrypted end-to-end and we never share personal information." },
  { q: "Can I generate an FIR draft?", a: "Yes. LeXa produces court-ready FIR drafts in the official Indian format, ready to print." },
];

const Index: React.FC = () => {
  return (
    <Layout>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        {/* Floating colorful blobs */}
        <div className="blob w-[420px] h-[420px] bg-primary/30 top-[-120px] left-[-80px] animate-float-slow" />
        <div className="blob w-[380px] h-[380px] bg-purple-400/30 top-[80px] right-[-60px] animate-float-slower" />
        <div className="blob w-[320px] h-[320px] bg-sky-300/40 bottom-[-100px] left-[30%] animate-float-slow" />

        <div className="container mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 backdrop-blur px-4 py-1.5 text-xs font-medium text-primary shadow-card mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Powered by Multi-Agent AI · Trained on Indian Law
              </span>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
                Your Intelligent{" "}
                <span className="text-gradient-primary animate-gradient bg-gradient-to-r from-primary via-purple-500 to-sky-500">
                  AI Legal
                </span>
                <br />
                Assistant for India
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
                Understand your rights, draft FIRs, and get instant legal clarity — grounded in
                the Constitution, IPC, BNS, and CrPC. Warm, private, and always available.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Link to="/chat">
                  <Button size="xl" className="rounded-full bg-gradient-to-r from-primary to-purple-500 text-white shadow-elevated hover:shadow-glow hover:scale-[1.02] transition-all">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Start Free Consultation
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/case-intake">
                  <Button size="xl" variant="outline" className="rounded-full border-primary/30 bg-white/60 backdrop-blur hover:bg-white">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Legal Document
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> Constitution-based</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> IPC & BNS compliant</div>
                <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> End-to-end encrypted</div>
              </div>

              {/* Social proof strip */}
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["from-blue-400 to-purple-500", "from-pink-400 to-rose-500", "from-amber-400 to-orange-500", "from-emerald-400 to-teal-500"].map((c, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full bg-gradient-to-br ${c} ring-2 ring-white`} />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    <span className="ml-1 text-sm font-semibold text-foreground">4.9/5</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Trusted by 10,000+ citizens across India</p>
                </div>
              </div>
            </div>

            {/* Right — floating hero visual */}
            <div className="relative animate-fade-in-up delay-200">
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Main glass card */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/20 via-purple-400/15 to-sky-400/20 blur-2xl" />
                <div className="relative h-full rounded-[2rem] gradient-border shadow-elevated overflow-hidden bg-white">
                  <div className="absolute inset-0 grid-bg opacity-30" />
                  {/* Central Justice */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-glow">
                      <LadyJustice size={100} className="text-white" />
                    </div>
                  </div>
                  {/* Floating info cards */}
                  <div className="absolute top-6 left-6 glass-card rounded-2xl p-3 flex items-center gap-2 animate-float-slow">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Analyzing</p>
                      <p className="text-sm font-semibold">IPC §420 · Fraud</p>
                    </div>
                  </div>
                  <div className="absolute top-8 right-4 glass-card rounded-2xl p-3 animate-float-slower">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-5 h-5 text-success" />
                      <span className="text-sm font-semibold">FIR Draft Ready</span>
                    </div>
                  </div>
                  <div className="absolute bottom-8 left-4 glass-card rounded-2xl p-3 animate-float">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      <div>
                        <p className="text-[11px] text-muted-foreground">Response</p>
                        <p className="text-sm font-semibold">1.2s avg</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-6 glass-card rounded-2xl p-3 animate-float-slow">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-semibold">358 BNS §</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section className="relative -mt-10 z-10">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl glass-card shadow-elevated p-6 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={stat.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="text-3xl md:text-5xl font-display font-bold text-gradient-primary mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="mb-4 rounded-full bg-primary/10 text-primary border-0 hover:bg-primary/15">Features</Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Everything you need to <span className="text-gradient-primary">navigate the law</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              From clarity on your rights to court-ready drafts, LeXa handles it end-to-end.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const gradients = [
                "from-blue-500 to-indigo-500",
                "from-purple-500 to-pink-500",
                "from-amber-500 to-orange-500",
                "from-sky-500 to-cyan-500",
                "from-emerald-500 to-teal-500",
                "from-rose-500 to-fuchsia-500",
              ];
              return (
                <Link key={feature.title} to={feature.link}>
                  <div
                    className="group h-full rounded-3xl bg-white border border-border p-7 shadow-card hover-lift transition-all animate-fade-in-up relative overflow-hidden"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`} />
                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{feature.description}</p>
                    <div className="flex items-center text-primary text-sm font-semibold">
                      Explore
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== PRACTICE AREAS ========== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-lavender/30 to-white" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge className="mb-4 rounded-full bg-purple-100 text-purple-700 border-0">Practice Areas</Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Coverage across <span className="text-gradient-primary">Indian law</span>
            </h2>
            <p className="text-muted-foreground text-lg">Six major practice areas, hundreds of sections mapped.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {practiceAreas.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={p.label} className="group rounded-2xl bg-white border border-border p-5 text-center hover-lift shadow-card animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold">{p.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="mb-4 rounded-full bg-sky-100 text-sky-700 border-0">Workflow</Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Legal clarity in <span className="text-gradient-sky">three simple steps</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-16 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-primary/30 via-purple-400/30 to-sky-400/30" />
            {workflow.map((w, i) => (
              <div key={w.step} className="relative rounded-3xl bg-white border border-border p-8 shadow-card hover-lift animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-500 text-white font-display font-bold text-lg flex items-center justify-center mb-5 shadow-lg">
                  {w.step}
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{w.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== AI ARCHITECTURE ========== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-sky-500/5" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-14">
            <Badge className="mb-4 rounded-full bg-primary/10 text-primary border-0">
              <Brain className="w-3 h-3 mr-1" /> AI Architecture
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Multi-Agent AI System</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Specialized agents collaborate — one interprets law, one drafts documents, one verifies ethics.
            </p>
          </div>
          <div className="rounded-3xl bg-white/70 backdrop-blur border border-border p-6 md:p-10 shadow-elevated">
            <AgentNetwork />
          </div>
        </div>
      </section>

      {/* ========== LEGAL FRAMEWORK ========== */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 rounded-full bg-amber-100 text-amber-700 border-0">Legal Framework</Badge>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Built on <span className="text-gradient-primary">Indian Law</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Every response is grounded in current Indian legal codes, always cited, always transparent.
              </p>
              <div className="space-y-3">
                {legalCodes.map((code, i) => (
                  <div key={code.name} className="flex items-center justify-between p-5 rounded-2xl bg-white border border-border shadow-card hover-lift animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{code.name}</h4>
                        <p className="text-sm text-muted-foreground">{code.sections}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${code.status === "New" ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>
                      {code.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-primary/20 via-purple-400/20 to-sky-400/20 blur-2xl rounded-3xl" />
              <div className="relative rounded-3xl bg-white border border-border shadow-elevated p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-2xl font-bold">Fundamental Rights</h3>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { art: "14", text: "Equality before law and equal protection of laws" },
                    { art: "19", text: "Freedom of speech, assembly, and movement" },
                    { art: "21", text: "Protection of life and personal liberty" },
                    { art: "22", text: "Protection against arrest and detention" },
                  ].map((r) => (
                    <div key={r.art} className="flex gap-4 items-start p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-purple-500/5 hover:from-primary/10 hover:to-purple-500/10 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">Art {r.art}</span>
                      </div>
                      <p className="text-sm text-foreground/90 pt-1">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-sky-50/50 to-white" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge className="mb-4 rounded-full bg-emerald-100 text-emerald-700 border-0">Testimonials</Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Loved by citizens & advocates
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className="rounded-3xl bg-white border border-border p-8 shadow-card hover-lift animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-foreground/90 leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <Badge className="mb-4 rounded-full bg-primary/10 text-primary border-0">FAQ</Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={f.q} className="group rounded-2xl bg-white border border-border p-6 shadow-card hover:shadow-elevated transition-shadow animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-semibold text-lg pr-4">{f.q}</span>
                  <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ========== DISCLAIMER ========== */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-2xl border border-amber-200 bg-amber-50/60 p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900/80 leading-relaxed">
              <strong>Legal Disclaimer:</strong> LeXa provides legal information and guidance only. It does not constitute
              legal advice or replace consultation with a qualified advocate. Always consult a licensed lawyer for
              specific legal matters. Human-in-the-loop verification is enforced for all sensitive cases.
            </p>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[2.5rem] p-12 md:p-16 text-center bg-gradient-to-br from-primary via-purple-600 to-sky-500 shadow-elevated">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="blob w-96 h-96 bg-white/20 top-[-100px] left-[-80px]" />
            <div className="blob w-96 h-96 bg-amber-300/30 bottom-[-100px] right-[-80px]" />
            <div className="relative max-w-2xl mx-auto text-white">
              <Sparkles className="w-10 h-10 mx-auto mb-4 opacity-80" />
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Ready to understand your rights?
              </h2>
              <p className="text-white/85 text-lg mb-8">
                Join thousands using LeXa for clear, private, and instant legal guidance across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/chat">
                  <Button size="xl" className="rounded-full bg-white text-primary hover:bg-white/95 hover:scale-[1.02] shadow-elevated">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Ask AI Lawyer
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="xl" variant="outline" className="rounded-full bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default Index;