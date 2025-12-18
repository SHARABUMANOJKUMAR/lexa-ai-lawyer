import React, { useState } from "react";
import { 
  BookOpen, 
  Scale, 
  FileText, 
  Search, 
  ExternalLink,
  ChevronRight,
  Gavel,
  Shield,
  Users,
  Building,
  AlertTriangle,
  Clock,
  CheckCircle,
  Info
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AshokaChakra } from "@/components/AshokaChakra";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

interface LegalCode {
  id: string;
  name: string;
  fullName: string;
  sections: string;
  description: string;
  status: "Active" | "New" | "Foundation";
  icon: typeof Scale;
  link: string;
}

interface LegalResource {
  id: string;
  title: string;
  description: string;
  category: string;
  link: string;
  external: boolean;
}

const legalCodes: LegalCode[] = [
  {
    id: "ipc",
    name: "IPC",
    fullName: "Indian Penal Code, 1860",
    sections: "500+ Sections",
    description: "The main criminal code of India covering offenses and punishments. Active until BNS fully replaces it.",
    status: "Active",
    icon: Gavel,
    link: "https://www.indiacode.nic.in/handle/123456789/2263"
  },
  {
    id: "bns",
    name: "BNS",
    fullName: "Bharatiya Nyaya Sanhita, 2023",
    sections: "358 Sections",
    description: "New criminal code replacing IPC with modern provisions for cybercrimes and organized crime.",
    status: "New",
    icon: Scale,
    link: "https://www.mha.gov.in/en/bharatiya-nyaya-sanhita"
  },
  {
    id: "crpc",
    name: "CrPC",
    fullName: "Code of Criminal Procedure, 1973",
    sections: "484 Sections",
    description: "Procedural law for criminal cases including arrest, bail, trial, and appeal procedures.",
    status: "Active",
    icon: FileText,
    link: "https://www.indiacode.nic.in/handle/123456789/1611"
  },
  {
    id: "bnss",
    name: "BNSS",
    fullName: "Bharatiya Nagarik Suraksha Sanhita, 2023",
    sections: "531 Sections",
    description: "New procedural code replacing CrPC with provisions for digital evidence and video trials.",
    status: "New",
    icon: Shield,
    link: "https://www.mha.gov.in/en/bharatiya-nagarik-suraksha-sanhita"
  },
  {
    id: "constitution",
    name: "Constitution",
    fullName: "Constitution of India",
    sections: "395 Articles",
    description: "The supreme law of India establishing fundamental rights, directive principles, and government structure.",
    status: "Foundation",
    icon: Building,
    link: "https://www.india.gov.in/my-government/constitution-india"
  },
  {
    id: "bsa",
    name: "BSA",
    fullName: "Bharatiya Sakshya Adhiniyam, 2023",
    sections: "170 Sections",
    description: "New evidence law replacing Indian Evidence Act with provisions for electronic evidence.",
    status: "New",
    icon: BookOpen,
    link: "https://www.mha.gov.in/en/bharatiya-sakshya-adhiniyam"
  }
];

const legalResources: LegalResource[] = [
  {
    id: "1",
    title: "Supreme Court of India",
    description: "Official website with case status, judgments, and cause lists",
    category: "Courts",
    link: "https://main.sci.gov.in/",
    external: true
  },
  {
    id: "2",
    title: "India Code Portal",
    description: "Central repository of all Indian Acts and Laws",
    category: "Laws",
    link: "https://www.indiacode.nic.in/",
    external: true
  },
  {
    id: "3",
    title: "eCourts Services",
    description: "Case status and court orders from district courts",
    category: "Courts",
    link: "https://ecourts.gov.in/",
    external: true
  },
  {
    id: "4",
    title: "National Legal Services Authority",
    description: "Free legal aid and lok adalat services",
    category: "Services",
    link: "https://nalsa.gov.in/",
    external: true
  },
  {
    id: "5",
    title: "Bar Council of India",
    description: "Advocate registration and disciplinary matters",
    category: "Professional",
    link: "https://www.barcouncilofindia.org/",
    external: true
  },
  {
    id: "6",
    title: "Ministry of Law and Justice",
    description: "Legal policies, reforms, and notifications",
    category: "Government",
    link: "https://lawmin.gov.in/",
    external: true
  },
  {
    id: "7",
    title: "National Crime Records Bureau",
    description: "Crime statistics and FIR tracking",
    category: "Services",
    link: "https://ncrb.gov.in/",
    external: true
  },
  {
    id: "8",
    title: "Consumer Helpline",
    description: "File consumer complaints and track grievances",
    category: "Services",
    link: "https://consumerhelpline.gov.in/",
    external: true
  }
];

const faqs = [
  {
    question: "What is the difference between IPC and BNS?",
    answer: "The Bharatiya Nyaya Sanhita (BNS) 2023 is the new criminal code replacing the Indian Penal Code (IPC) 1860. BNS includes modern provisions for cybercrimes, organized crime, terrorism, and crimes against women. It came into effect from July 1, 2024."
  },
  {
    question: "How do I file an FIR?",
    answer: "You can file an FIR at any police station. Under Section 154 CrPC, the police must register your complaint for cognizable offenses. Many states also allow e-FIR filing for certain offenses. AI LeXa Lawyer can help you draft your FIR before submission."
  },
  {
    question: "What is anticipatory bail?",
    answer: "Anticipatory bail (Section 438 CrPC / Section 482 BNSS) allows a person to seek bail in anticipation of arrest. It can be obtained from Sessions Court or High Court when there's apprehension of arrest for a non-bailable offense."
  },
  {
    question: "What are my fundamental rights?",
    answer: "Fundamental Rights are enshrined in Part III (Articles 12-35) of the Indian Constitution. They include Right to Equality (Art. 14-18), Right to Freedom (Art. 19-22), Right against Exploitation (Art. 23-24), Right to Freedom of Religion (Art. 25-28), Cultural and Educational Rights (Art. 29-30), and Right to Constitutional Remedies (Art. 32)."
  },
  {
    question: "How long can police keep someone in custody?",
    answer: "Without judicial order: 24 hours (Article 22). With magistrate remand: up to 15 days police custody, then judicial custody. Maximum period before chargesheet: 60 days (offenses up to 10 years imprisonment) or 90 days (offenses punishable with 10+ years/death)."
  },
  {
    question: "What is a PIL (Public Interest Litigation)?",
    answer: "PIL is a legal action initiated in a court of law for the enforcement of public interest. It can be filed by any citizen under Article 32 (Supreme Court) or Article 226 (High Court) for matters affecting public welfare, environment, or constitutional rights."
  }
];

const Resources: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Courts", "Laws", "Services", "Government", "Professional"];

  const filteredResources = legalResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute top-0 right-10 opacity-10">
            <AshokaChakra size={150} className="text-primary" />
          </div>
          
          <Badge variant="gold" className="mb-4">
            <BookOpen className="w-4 h-4 mr-1" />
            Legal Resources
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Indian Legal Framework
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive database of Indian laws, legal codes, and resources. 
            Stay informed about your rights and the legal system.
          </p>
        </div>

        {/* Legal Codes Section */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" />
            Legal Codes of India
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legalCodes.map((code, index) => {
              const Icon = code.icon;
              return (
                <Card 
                  key={code.id} 
                  variant="elevated" 
                  className="animate-fade-in-up hover:border-primary/50 transition-all"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-gold-light flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <Badge variant={code.status === "New" ? "gold" : code.status === "Foundation" ? "agent" : "outline"}>
                        {code.status}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4">{code.name}</CardTitle>
                    <CardDescription>{code.fullName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{code.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{code.sections}</Badge>
                      <a href={code.link} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          Learn More
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
            <ExternalLink className="w-6 h-6 text-primary" />
            Legal Resources & Portals
          </h2>

          {/* Search and Filter */}
          <Card variant="glass" className="p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted border border-primary/30 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "judicial" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredResources.map((resource, index) => (
              <a 
                key={resource.id} 
                href={resource.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Card 
                  variant="glass" 
                  className="p-4 hover:border-primary/50 transition-all animate-fade-in-up group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium group-hover:text-primary transition-colors">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                      <Badge variant="outline" className="mt-2">{resource.category}</Badge>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
            <Info className="w-6 h-6 text-primary" />
            Frequently Asked Questions
          </h2>
          
          <Card variant="elevated" className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </section>

        {/* CTA Section */}
        <section>
          <Card variant="parchment" className="p-8 text-center relative overflow-hidden">
            <div className="absolute top-4 right-4 opacity-20">
              <AshokaChakra size={100} className="text-primary" animate={false} />
            </div>
            <div className="relative z-10">
              <h2 className="font-serif text-2xl font-bold text-secondary-foreground mb-4">
                Need Legal Guidance?
              </h2>
              <p className="text-secondary-foreground/80 mb-6 max-w-lg mx-auto">
                Get instant AI-powered legal consultation based on Indian laws. 
                Understand your rights and options before consulting a lawyer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/chat">
                  <Button variant="hero">
                    Start AI Consultation
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/lawyers">
                  <Button variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Connect with Lawyer
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Resources;