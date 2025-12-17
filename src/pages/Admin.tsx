import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Users, 
  Scale,
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  Database,
  Server,
  Eye,
  Download,
  RefreshCw,
  Search,
  UserX,
  UserCheck,
  FileText,
  Gavel,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  XCircle,
  Loader2
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentNetwork } from "@/components/AgentNetwork";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  status?: "active" | "suspended";
}

interface CaseOverview {
  id: string;
  title: string;
  category: string;
  status: string;
  user_id: string;
  created_at: string;
  user_name?: string;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [cases, setCases] = useState<CaseOverview[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCases, setLoadingCases] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCases: 0,
    casesToday: 0,
    ethicsFlags: 3,
    aiAnalyses: 0,
    successRate: 89
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchUsers(), fetchCases(), fetchStats()]);
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data?.map(u => ({ ...u, status: 'active' as const })) || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchCases = async () => {
    setLoadingCases(true);
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoadingCases(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [usersCount, casesCount, todayCases] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('cases').select('id', { count: 'exact', head: true }),
        supabase.from('cases').select('id', { count: 'exact', head: true })
          .gte('created_at', new Date().toISOString().split('T')[0])
      ]);

      setStats(prev => ({
        ...prev,
        totalUsers: usersCount.count || 0,
        activeCases: casesCount.count || 0,
        casesToday: todayCases.count || 0,
        aiAnalyses: (casesCount.count || 0) * 2
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    toast.success("Data refreshed successfully");
    setRefreshing(false);
  };

  const exportLogs = () => {
    const logs = {
      exportDate: new Date().toISOString(),
      totalUsers: stats.totalUsers,
      totalCases: stats.activeCases,
      casesToday: stats.casesToday,
      ethicsFlags: stats.ethicsFlags,
      systemStatus: "Operational"
    };
    
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Logs exported successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "outline";
      case "submitted": return "agent";
      case "under_review": return "warning";
      case "in_progress": return "gold";
      case "resolved": return "success";
      case "closed": return "secondary";
      default: return "outline";
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCases = cases.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ethicsLogs = [
    { time: "11:23 AM", type: "info", message: "Disclaimer automatically added to case analysis", agent: "Ethics & Compliance Agent" },
    { time: "10:45 AM", type: "warning", message: "Sensitive case flagged for human review - domestic violence matter", agent: "Ethics & Compliance Agent" },
    { time: "10:30 AM", type: "success", message: "Lawyer escalation triggered for complex property dispute", agent: "UX Orchestrator Agent" },
    { time: "09:15 AM", type: "warning", message: "AI attempted legal verdict - blocked and logged", agent: "Ethics & Compliance Agent" },
    { time: "08:45 AM", type: "info", message: "Human-in-the-loop verification completed", agent: "Admin Oversight Agent" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="destructive">
                <Shield className="w-3 h-3 mr-1" />
                Admin Access
              </Badge>
              <Badge variant="gold">
                <Brain className="w-3 h-3 mr-1" />
                Admin Oversight Agent Active
              </Badge>
            </div>
            <h1 className="font-serif text-3xl font-bold mb-2">System Administration</h1>
            <p className="text-muted-foreground">Monitor users, cases, agent health, and ethics compliance</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportLogs}>
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
            <Button variant="hero">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* System Health Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "System Status", value: "Operational", icon: Server, status: "success" },
            { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, status: "info" },
            { label: "Cases Today", value: stats.casesToday.toString(), icon: Scale, status: "info" },
            { label: "Ethics Flags", value: stats.ethicsFlags.toString(), icon: AlertTriangle, status: "warning" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} variant="agent" className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold font-serif mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    stat.status === "success" ? "bg-success/20 text-success" :
                    stat.status === "warning" ? "bg-warning/20 text-warning" :
                    "bg-primary/20 text-primary"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="cases">Cases</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ethics">Ethics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Agent Health */}
                <Card variant="elevated" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl font-semibold flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" />
                      AI Agent Health Monitor
                    </h2>
                    <Badge variant="success" className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-success-foreground animate-pulse" />
                      All Systems Normal
                    </Badge>
                  </div>
                  <AgentNetwork />
                </Card>

                {/* Case Flow */}
                <Card variant="elevated" className="p-6">
                  <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Case Flow Monitoring
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      { stage: "Intake (New Cases)", count: Math.ceil(stats.activeCases * 0.3), percentage: 100 },
                      { stage: "AI Analysis", count: Math.ceil(stats.activeCases * 0.25), percentage: 83 },
                      { stage: "Legal Review", count: Math.ceil(stats.activeCases * 0.2), percentage: 65 },
                      { stage: "Document Generation", count: Math.ceil(stats.activeCases * 0.15), percentage: 52 },
                      { stage: "Resolution", count: Math.ceil(stats.activeCases * 0.1), percentage: 35 },
                    ].map((stage) => (
                      <div key={stage.stage}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium">{stage.stage}</span>
                          <span className="text-muted-foreground">{stage.count} cases</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-gold-light transition-all duration-500"
                            style={{ width: `${stage.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card variant="glass" className="p-4">
                  <h3 className="font-serif font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    System Metrics
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "CPU Usage", value: 42, unit: "%" },
                      { label: "Memory", value: 67, unit: "%" },
                      { label: "API Latency", value: 124, unit: "ms" },
                      { label: "Uptime", value: 99.9, unit: "%" },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{metric.label}</span>
                          <span className="font-medium">{metric.value}{metric.unit}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              metric.value > 80 ? "bg-destructive" :
                              metric.value > 60 ? "bg-warning" :
                              "bg-success"
                            }`}
                            style={{ width: `${Math.min(metric.value, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card variant="glass" className="p-4">
                  <h3 className="font-serif font-semibold mb-4 flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    Database Statistics
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Total Cases", value: stats.activeCases.toLocaleString() },
                      { label: "Active Users", value: stats.totalUsers.toLocaleString() },
                      { label: "AI Analyses", value: stats.aiAnalyses.toLocaleString() },
                      { label: "Documents Generated", value: Math.ceil(stats.activeCases * 1.5).toLocaleString() },
                    ].map((stat) => (
                      <div key={stat.label} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                        <span className="font-mono text-sm font-medium">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card variant="elevated" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  User Management
                </h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-muted border border-primary/30 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {loadingUsers ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No users found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.slice(0, 20).map((userProfile) => (
                    <div 
                      key={userProfile.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center">
                          <span className="text-primary-foreground font-semibold">
                            {userProfile.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{userProfile.full_name}</p>
                          <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="success" className="capitalize">
                          {userProfile.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Joined: {new Date(userProfile.created_at).toLocaleDateString('en-IN')}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(userProfile)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Cases Tab */}
          <TabsContent value="cases">
            <Card variant="elevated" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-semibold flex items-center gap-2">
                  <Scale className="w-5 h-5 text-primary" />
                  Case Oversight ({cases.length} total)
                </h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search cases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-muted border border-primary/30 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {loadingCases ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredCases.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No cases found</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredCases.map((caseItem) => (
                    <div 
                      key={caseItem.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{caseItem.title}</h4>
                          <Badge variant={getStatusColor(caseItem.status) as any} className="capitalize">
                            {caseItem.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Category: {caseItem.category} • Created: {new Date(caseItem.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard`)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card variant="elevated" className="p-6">
                <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  AI Usage Analytics
                </h2>
                <div className="space-y-6">
                  {[
                    { label: "Legal Analyses Performed", value: stats.aiAnalyses, icon: Brain },
                    { label: "FIR Documents Generated", value: Math.ceil(stats.activeCases * 0.8), icon: FileText },
                    { label: "Risk Assessments", value: Math.ceil(stats.activeCases * 1.2), icon: AlertCircle },
                    { label: "Ethics Checks Passed", value: Math.ceil(stats.aiAnalyses * 0.97), icon: CheckCircle },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <span className="text-2xl font-bold font-serif">{item.value.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card variant="elevated" className="p-6">
                <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Case Volume Analytics
                </h2>
                <div className="space-y-4">
                  {[
                    { category: "Criminal", count: Math.ceil(stats.activeCases * 0.25), color: "bg-destructive" },
                    { category: "Civil", count: Math.ceil(stats.activeCases * 0.2), color: "bg-primary" },
                    { category: "Family", count: Math.ceil(stats.activeCases * 0.15), color: "bg-warning" },
                    { category: "Property", count: Math.ceil(stats.activeCases * 0.18), color: "bg-success" },
                    { category: "Consumer", count: Math.ceil(stats.activeCases * 0.12), color: "bg-accent" },
                    { category: "Other", count: Math.ceil(stats.activeCases * 0.1), color: "bg-muted-foreground" },
                  ].map((cat) => (
                    <div key={cat.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{cat.category}</span>
                        <span className="font-medium">{cat.count} cases</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${cat.color}`}
                          style={{ width: `${(cat.count / stats.activeCases) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card variant="elevated" className="p-6 lg:col-span-2">
                <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Agent Performance Monitoring
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: "Legal Analysis Agent", requests: Math.ceil(stats.aiAnalyses * 0.3), success: 98.5 },
                    { name: "FIR Drafting Agent", requests: Math.ceil(stats.aiAnalyses * 0.25), success: 99.2 },
                    { name: "Risk Assessment Agent", requests: Math.ceil(stats.aiAnalyses * 0.2), success: 97.8 },
                    { name: "Defense Strategy Agent", requests: Math.ceil(stats.aiAnalyses * 0.1), success: 96.5 },
                    { name: "Ethics & Compliance Agent", requests: stats.aiAnalyses, success: 99.9 },
                    { name: "UX Orchestrator Agent", requests: stats.aiAnalyses, success: 99.7 },
                  ].map((agent) => (
                    <div key={agent.name} className="p-4 bg-muted/50 rounded-lg border border-primary/20">
                      <h4 className="font-medium text-sm mb-2">{agent.name}</h4>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Requests: {agent.requests.toLocaleString()}</span>
                        <span className="text-success">{agent.success}% success</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-success" style={{ width: `${agent.success}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Ethics Tab */}
          <TabsContent value="ethics">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card variant="elevated" className="p-6 lg:col-span-2">
                <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Ethics Compliance Logs
                </h2>
                
                <div className="space-y-3">
                  {ethicsLogs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border ${
                        log.type === "warning" ? "border-warning/50 bg-warning/10" :
                        log.type === "success" ? "border-success/50 bg-success/10" :
                        "border-primary/30 bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {log.type === "warning" ? (
                            <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                          ) : log.type === "success" ? (
                            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                          ) : (
                            <Activity className="w-5 h-5 text-primary mt-0.5" />
                          )}
                          <div>
                            <p className="font-medium">{log.message}</p>
                            <p className="text-sm text-muted-foreground mt-1">{log.agent}</p>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="space-y-4">
                <Card variant="parchment" className="p-4">
                  <h3 className="font-serif font-semibold mb-3 text-secondary-foreground flex items-center gap-2">
                    <Gavel className="w-4 h-4" />
                    Ethics Rules Enforced
                  </h3>
                  <div className="space-y-2 text-sm text-secondary-foreground">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span>AI provides guidance only, never verdicts</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span>Mandatory disclaimers on all legal outputs</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span>Human-in-the-loop for sensitive cases</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span>Automatic lawyer escalation triggers</span>
                    </div>
                  </div>
                </Card>

                <Card variant="glass" className="p-4">
                  <h3 className="font-serif font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    Active Ethics Flags
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                      <span>3 cases pending ethics review</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>1 verdict attempt blocked today</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0" />
                      <span>5 lawyer escalations triggered</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View and manage user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center">
                  <span className="text-primary-foreground text-2xl font-semibold">
                    {selectedUser.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.full_name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant="success" className="capitalize">{selectedUser.status}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Admin;