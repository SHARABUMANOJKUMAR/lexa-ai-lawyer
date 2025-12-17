import React, { useState } from "react";
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
  RefreshCw
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentNetwork } from "@/components/AgentNetwork";

const Admin: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

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
            </div>
            <h1 className="font-serif text-3xl font-bold mb-2">System Administration</h1>
            <p className="text-muted-foreground">Monitor case flows, agent health, and ethics compliance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
            <Button variant="hero">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "System Status", value: "Operational", icon: Server, status: "success" },
            { label: "Active Users", value: "1,247", icon: Users, status: "info" },
            { label: "Cases Today", value: "89", icon: Scale, status: "info" },
            { label: "Ethics Flags", value: "3", icon: AlertTriangle, status: "warning" },
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
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
                  { stage: "Intake", count: 23, percentage: 100 },
                  { stage: "AI Analysis", count: 19, percentage: 83 },
                  { stage: "Legal Review", count: 15, percentage: 65 },
                  { stage: "Document Generation", count: 12, percentage: 52 },
                  { stage: "Resolution", count: 8, percentage: 35 },
                ].map((stage, index) => (
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

            {/* Ethics Compliance */}
            <Card variant="elevated" className="p-6">
              <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Ethics Compliance Logs
              </h2>
              
              <div className="space-y-3">
                {[
                  { time: "11:23 AM", type: "info", message: "Disclaimer automatically added to case CASE-2024-089", agent: "Ethics Agent" },
                  { time: "10:45 AM", type: "warning", message: "Sensitive case flagged for human review - domestic violence matter", agent: "Ethics Agent" },
                  { time: "10:30 AM", type: "success", message: "Lawyer escalation triggered for complex property dispute", agent: "UX Orchestrator" },
                  { time: "09:15 AM", type: "warning", message: "AI attempted legal verdict - blocked and logged", agent: "Compliance Agent" },
                  { time: "08:45 AM", type: "info", message: "Human-in-the-loop verification completed for CASE-2024-087", agent: "Ethics Agent" },
                ].map((log, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${
                      log.type === "warning" ? "border-warning/50 bg-warning/10" :
                      log.type === "success" ? "border-success/50 bg-success/10" :
                      "border-primary/30 bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {log.type === "warning" ? (
                          <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                        ) : log.type === "success" ? (
                          <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                        ) : (
                          <Activity className="w-4 h-4 text-primary mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm">{log.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{log.agent}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* System Metrics */}
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

            {/* Database Stats */}
            <Card variant="glass" className="p-4">
              <h3 className="font-serif font-semibold mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                Database Statistics
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Total Cases", value: "12,847" },
                  { label: "Active Sessions", value: "342" },
                  { label: "Documents Stored", value: "45,892" },
                  { label: "AI Analyses", value: "89,234" },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <span className="font-mono text-sm font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card variant="glass" className="p-4">
              <h3 className="font-serif font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View All Logs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Brain className="w-4 h-4 mr-2" />
                  Agent Configuration
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Security Settings
                </Button>
              </div>
            </Card>

            {/* Alerts */}
            <Card variant="parchment" className="p-4">
              <h3 className="font-serif font-semibold mb-3 text-secondary-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Active Alerts
              </h3>
              <div className="space-y-2 text-sm text-secondary-foreground">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                  <span>3 cases pending ethics review</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Scheduled maintenance: Sunday 2 AM</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
