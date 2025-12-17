import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Scale,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Brain,
  BarChart3,
  Briefcase
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentNetwork } from "@/components/AgentNetwork";

interface Case {
  id: string;
  clientName: string;
  caseTitle: string;
  status: "review" | "active" | "hearing" | "closed";
  sections: string[];
  aiSummary: string;
  lastUpdated: string;
  priority: "high" | "medium" | "low";
}

const mockCases: Case[] = [
  {
    id: "ADV-2024-001",
    clientName: "Ramesh Kumar",
    caseTitle: "Property Fraud - Recovery of ₹15 Lakhs",
    status: "active",
    sections: ["IPC 420", "IPC 406", "Transfer of Property Act"],
    aiSummary: "Strong case with documentary evidence. Recommended to pursue civil and criminal remedies simultaneously.",
    lastUpdated: "1 hour ago",
    priority: "high",
  },
  {
    id: "ADV-2024-002",
    clientName: "Sunita Devi",
    caseTitle: "Domestic Violence - Protection Order",
    status: "hearing",
    sections: ["DV Act 2005", "IPC 498A"],
    aiSummary: "Protection order likely. Evidence of physical and mental cruelty documented. Prepare for interim relief application.",
    lastUpdated: "3 hours ago",
    priority: "high",
  },
  {
    id: "ADV-2024-003",
    clientName: "Tech Solutions Pvt Ltd",
    caseTitle: "Contract Breach - Software Development",
    status: "review",
    sections: ["Indian Contract Act", "IT Act 2000"],
    aiSummary: "Contract terms favor client. Arbitration clause present. Recommend mediation before litigation.",
    lastUpdated: "1 day ago",
    priority: "medium",
  },
];

const LawyerPortal: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "hearing": return "warning";
      case "review": return "agent";
      case "closed": return "outline";
      default: return "outline";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold">
                <Briefcase className="w-3 h-3 mr-1" />
                Lawyer Portal
              </Badge>
            </div>
            <h1 className="font-serif text-3xl font-bold mb-2">Legal Aid Dashboard</h1>
            <p className="text-muted-foreground">Access case summaries, AI reasoning logs, and client evidence</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="hero">
              <Brain className="w-4 h-4 mr-2" />
              AI Analysis Mode
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Cases", value: "12", icon: Briefcase, change: "+2 this week" },
            { label: "Pending Hearings", value: "5", icon: Clock, change: "Next: Tomorrow" },
            { label: "AI Analyses Done", value: "47", icon: Brain, change: "+8 today" },
            { label: "Success Rate", value: "89%", icon: BarChart3, change: "↑ 3% vs last month" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} variant="agent" className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold font-serif mt-1">{stat.value}</p>
                    <p className="text-xs text-primary mt-1">{stat.change}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cases List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <Card variant="glass" className="p-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search cases, clients, or sections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-muted border border-primary/30 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </Card>

            {/* Cases */}
            <div className="space-y-4">
              {mockCases.map((caseItem, index) => (
                <Card 
                  key={caseItem.id} 
                  variant="elevated" 
                  className="p-5 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-serif font-semibold">{caseItem.caseTitle}</h3>
                        <Badge variant={getStatusColor(caseItem.status) as any} className="capitalize">
                          {caseItem.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {caseItem.id} • Client: {caseItem.clientName}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {caseItem.sections.map((section) => (
                      <Badge key={section} variant="judicial" className="text-xs">
                        {section}
                      </Badge>
                    ))}
                  </div>

                  <Card variant="glass" className="p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-primary mb-1">AI Legal Analysis</p>
                        <p className="text-sm text-muted-foreground">{caseItem.aiSummary}</p>
                      </div>
                    </div>
                  </Card>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last updated: {caseItem.lastUpdated}</span>
                    <Button variant="link" size="sm" className="h-auto p-0">
                      View Full Analysis
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* AI Agents Status */}
            <Card variant="glass" className="p-4">
              <h3 className="font-serif font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                AI Agents Status
              </h3>
              <AgentNetwork compact />
            </Card>

            {/* Quick Actions */}
            <Card variant="glass" className="p-4">
              <h3 className="font-serif font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Brain className="w-4 h-4 mr-2" />
                  Run Case Analysis
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Legal Draft
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Scale className="w-4 h-4 mr-2" />
                  Section Lookup
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </div>
            </Card>

            {/* Recent AI Logs */}
            <Card variant="glass" className="p-4">
              <h3 className="font-serif font-semibold mb-4">AI Reasoning Logs</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {[
                  { time: "10:45 AM", action: "Legal Analysis Agent", desc: "Identified 3 applicable sections for ADV-2024-001" },
                  { time: "10:42 AM", action: "Risk Assessment Agent", desc: "Case marked as HIGH priority - urgent hearing required" },
                  { time: "10:30 AM", action: "Document Agent", desc: "Generated petition draft with 94% confidence score" },
                  { time: "09:15 AM", action: "Ethics Agent", desc: "Compliance check passed - no conflicts detected" },
                ].map((log, index) => (
                  <div key={index} className="text-sm border-l-2 border-primary/30 pl-3">
                    <p className="text-xs text-muted-foreground">{log.time}</p>
                    <p className="font-medium text-primary">{log.action}</p>
                    <p className="text-muted-foreground text-xs">{log.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LawyerPortal;
