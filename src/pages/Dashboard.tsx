import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Upload, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Scale,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Calendar,
  User
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AshokaChakra } from "@/components/AshokaChakra";

interface Case {
  id: string;
  title: string;
  type: string;
  status: "active" | "pending" | "resolved" | "draft";
  sections: string[];
  lastUpdated: string;
  priority: "high" | "medium" | "low";
}

const mockCases: Case[] = [
  {
    id: "CASE-2024-001",
    title: "Property Dispute - Inheritance Matter",
    type: "Civil",
    status: "active",
    sections: ["IPC 420", "Transfer of Property Act"],
    lastUpdated: "2 hours ago",
    priority: "high",
  },
  {
    id: "CASE-2024-002",
    title: "Consumer Complaint - Defective Product",
    type: "Consumer",
    status: "pending",
    sections: ["Consumer Protection Act 2019"],
    lastUpdated: "1 day ago",
    priority: "medium",
  },
  {
    id: "CASE-2024-003",
    title: "FIR Draft - Cheating Case",
    type: "Criminal",
    status: "draft",
    sections: ["IPC 420", "IPC 406"],
    lastUpdated: "3 days ago",
    priority: "high",
  },
  {
    id: "CASE-2024-004",
    title: "RTI Application - Government Records",
    type: "Administrative",
    status: "resolved",
    sections: ["RTI Act 2005"],
    lastUpdated: "1 week ago",
    priority: "low",
  },
];

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "pending": return "warning";
      case "resolved": return "gold";
      case "draft": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Clock className="w-3 h-3" />;
      case "pending": return <AlertCircle className="w-3 h-3" />;
      case "resolved": return <CheckCircle className="w-3 h-3" />;
      case "draft": return <FileText className="w-3 h-3" />;
      default: return null;
    }
  };

  const filteredCases = mockCases.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || c.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold mb-2">Citizen Dashboard</h1>
            <p className="text-muted-foreground">Manage your cases, documents, and legal guidance history</p>
          </div>
          <div className="flex gap-2">
            <Link to="/chat">
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                New Consultation
              </Button>
            </Link>
            <Link to="/case-intake">
              <Button variant="hero">
                <Plus className="w-4 h-4 mr-2" />
                File New Case
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Cases", value: "2", icon: Clock, color: "text-success" },
            { label: "Pending Review", value: "1", icon: AlertCircle, color: "text-warning" },
            { label: "Resolved", value: "1", icon: CheckCircle, color: "text-primary" },
            { label: "Drafts", value: "1", icon: FileText, color: "text-muted-foreground" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} variant="glass" className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold font-serif">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cases List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Filters */}
            <Card variant="glass" className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search cases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-muted border border-primary/30 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "active", "pending", "draft", "resolved"].map((filter) => (
                    <Button
                      key={filter}
                      variant={selectedFilter === filter ? "judicial" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedFilter(filter)}
                      className="capitalize"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Cases */}
            <div className="space-y-3">
              {filteredCases.map((caseItem, index) => (
                <Card 
                  key={caseItem.id} 
                  variant="elevated" 
                  className="p-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-gold-light flex items-center justify-center flex-shrink-0">
                        <Scale className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium truncate">{caseItem.title}</h3>
                          <Badge variant={getStatusColor(caseItem.status) as any} className="flex items-center gap-1">
                            {getStatusIcon(caseItem.status)}
                            <span className="capitalize">{caseItem.status}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {caseItem.id} • {caseItem.type}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {caseItem.sections.map((section) => (
                            <Badge key={section} variant="outline" className="text-xs">
                              {section}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Last updated: {caseItem.lastUpdated}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" title="View">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Download">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="More">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card variant="glass" className="p-4">
              <h3 className="font-serif font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/chat">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    AI Legal Consultation
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
                <Link to="/case-intake">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Draft New FIR
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Evidence
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card variant="glass" className="p-4">
              <h3 className="font-serif font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: "Consulted AI for property dispute", time: "2 hours ago", icon: MessageSquare },
                  { action: "Uploaded evidence documents", time: "1 day ago", icon: Upload },
                  { action: "FIR draft generated", time: "3 days ago", icon: FileText },
                  { action: "Case CASE-2024-004 resolved", time: "1 week ago", icon: CheckCircle },
                ].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Upcoming */}
            <Card variant="parchment" className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="font-serif font-semibold text-secondary-foreground">Reminders</h3>
              </div>
              <div className="space-y-3 text-secondary-foreground">
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-warning mt-1.5" />
                  <div>
                    <p>Respond to RTI query</p>
                    <p className="text-xs opacity-70">Due in 3 days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
                  <div>
                    <p>Court hearing - Property case</p>
                    <p className="text-xs opacity-70">Next Monday, 10:00 AM</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
