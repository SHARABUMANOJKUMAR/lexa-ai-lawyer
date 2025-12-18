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
  User,
  Loader2
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AshokaChakra } from "@/components/AshokaChakra";
import { useCases, CaseStatus } from "@/hooks/useCases";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import FilePreviewModal from "@/components/FilePreviewModal";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cases, isLoading, deleteCase } = useCases();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!user) {
      toast.error("Please login to access dashboard");
      navigate("/auth");
    }
  }, [user, navigate]);

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case "in_progress": return "success";
      case "submitted":
      case "under_review": return "warning";
      case "resolved":
      case "closed": return "gold";
      case "draft": return "outline";
      case "assigned": return "default";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: CaseStatus) => {
    switch (status) {
      case "in_progress":
      case "assigned": return <Clock className="w-3 h-3" />;
      case "submitted":
      case "under_review": return <AlertCircle className="w-3 h-3" />;
      case "resolved":
      case "closed": return <CheckCircle className="w-3 h-3" />;
      case "draft": return <FileText className="w-3 h-3" />;
      default: return null;
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (c.case_number?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesFilter = selectedFilter === "all" || c.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    active: cases.filter(c => c.status === "in_progress" || c.status === "assigned").length,
    pending: cases.filter(c => c.status === "submitted" || c.status === "under_review").length,
    resolved: cases.filter(c => c.status === "resolved" || c.status === "closed").length,
    drafts: cases.filter(c => c.status === "draft").length,
  };

  const handleDeleteCase = async (caseId: string) => {
    if (confirm("Are you sure you want to delete this case?")) {
      const { error } = await deleteCase(caseId);
      if (error) {
        toast.error("Failed to delete case");
      } else {
        toast.success("Case deleted successfully");
      }
    }
  };

  if (!user) {
    return null;
  }

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
            { label: "Active Cases", value: stats.active.toString(), icon: Clock, color: "text-success" },
            { label: "Pending Review", value: stats.pending.toString(), icon: AlertCircle, color: "text-warning" },
            { label: "Resolved", value: stats.resolved.toString(), icon: CheckCircle, color: "text-primary" },
            { label: "Drafts", value: stats.drafts.toString(), icon: FileText, color: "text-muted-foreground" },
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
                <div className="flex gap-2 flex-wrap">
                  {["all", "draft", "submitted", "in_progress", "resolved"].map((filter) => (
                    <Button
                      key={filter}
                      variant={selectedFilter === filter ? "judicial" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedFilter(filter)}
                      className="capitalize"
                    >
                      {filter.replace("_", " ")}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading cases...</span>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredCases.length === 0 && (
              <Card variant="glass" className="p-8 text-center">
                <Scale className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-2">No cases found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedFilter !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "Start by filing a new case or consulting with our AI"}
                </p>
                <Link to="/case-intake">
                  <Button variant="hero">
                    <Plus className="w-4 h-4 mr-2" />
                    File New Case
                  </Button>
                </Link>
              </Card>
            )}

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
                            <span className="capitalize">{caseItem.status.replace("_", " ")}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {caseItem.case_number || "Draft"} • {caseItem.category}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {caseItem.ipc_sections?.slice(0, 3).map((section) => (
                            <Badge key={section} variant="outline" className="text-xs">
                              {section}
                            </Badge>
                          ))}
                          {caseItem.bns_sections?.slice(0, 2).map((section) => (
                            <Badge key={section} variant="outline" className="text-xs">
                              {section}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Updated: {format(new Date(caseItem.updated_at), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link to={`/case/${caseItem.id}`}>
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" title="Download">
                        <Download className="w-4 h-4" />
                      </Button>
                      {caseItem.status === "draft" && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Delete"
                          onClick={() => handleDeleteCase(caseItem.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
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
                <Link to="/case-intake">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Evidence
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card variant="glass" className="p-4">
              <h3 className="font-serif font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {cases.slice(0, 4).map((caseItem, index) => (
                  <div key={caseItem.id} className="flex items-start gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Scale className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground truncate max-w-[180px]">{caseItem.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(caseItem.updated_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
                {cases.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </Card>

            {/* Reminders */}
            <Card variant="parchment" className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="font-serif font-semibold text-secondary-foreground">Reminders</h3>
              </div>
              <div className="space-y-3 text-secondary-foreground">
                {cases.filter(c => c.status === "submitted" || c.status === "under_review").slice(0, 2).map((caseItem) => (
                  <div key={caseItem.id} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-warning mt-1.5" />
                    <div>
                      <p className="truncate max-w-[200px]">{caseItem.title}</p>
                      <p className="text-xs opacity-70">Pending review</p>
                    </div>
                  </div>
                ))}
                {cases.filter(c => c.status === "submitted" || c.status === "under_review").length === 0 && (
                  <p className="text-sm opacity-70 text-center">No pending reminders</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;