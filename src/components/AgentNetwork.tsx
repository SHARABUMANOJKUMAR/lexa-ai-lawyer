import React from "react";
import { Scale, BookOpen, Shield, Users, Gavel, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "active" | "idle" | "working";
  color: string;
}

const agents: Agent[] = [
  {
    id: "legal-analysis",
    name: "Legal Analysis Agent",
    description: "Classifies legal issues, maps IPC/BNS/CrPC sections",
    icon: <Scale className="w-6 h-6" />,
    status: "active",
    color: "from-primary to-gold-light",
  },
  {
    id: "fir-drafting",
    name: "FIR & Drafting Agent",
    description: "Generates FIR drafts, complaints, legal notices",
    icon: <FileText className="w-6 h-6" />,
    status: "idle",
    color: "from-accent to-chakra",
  },
  {
    id: "risk-consequence",
    name: "Risk & Consequence Agent",
    description: "Explains bailable/non-bailable, penalties, timelines",
    icon: <Shield className="w-6 h-6" />,
    status: "idle",
    color: "from-warning to-primary",
  },
  {
    id: "false-case-defense",
    name: "False Case Defense Agent",
    description: "Analyzes accusations, identifies weak claims",
    icon: <Gavel className="w-6 h-6" />,
    status: "idle",
    color: "from-destructive/70 to-warning",
  },
  {
    id: "ethics-compliance",
    name: "Ethics & Compliance Agent",
    description: "Ensures no verdicts, adds disclaimers",
    icon: <BookOpen className="w-6 h-6" />,
    status: "active",
    color: "from-success to-accent",
  },
  {
    id: "ux-orchestrator",
    name: "UX Orchestrator Agent",
    description: "Controls flow, ensures smooth interaction",
    icon: <Users className="w-6 h-6" />,
    status: "working",
    color: "from-accent to-primary",
  },
];

interface AgentNetworkProps {
  activeAgents?: string[];
  compact?: boolean;
}

export const AgentNetwork: React.FC<AgentNetworkProps> = ({ 
  activeAgents = ["legal-analysis", "ethics-compliance", "ux-orchestrator"],
  compact = false
}) => {
  const getAgentStatus = (agent: Agent) => {
    if (activeAgents.includes(agent.id)) return "working";
    return agent.status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "working": return "bg-success";
      case "active": return "bg-primary";
      default: return "bg-muted-foreground/50";
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {agents.map((agent) => {
          const status = getAgentStatus(agent);
          return (
            <Badge
              key={agent.id}
              variant={status === "working" ? "gold" : "outline"}
              className="flex items-center gap-1.5 py-1 px-2"
            >
              <span className={`w-2 h-2 rounded-full ${getStatusColor(status)} ${status === "working" ? "animate-pulse" : ""}`} />
              {agent.name.replace(" Agent", "")}
            </Badge>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent, index) => {
        const status = getAgentStatus(agent);
        const isWorking = status === "working";
        
        return (
          <Card
            key={agent.id}
            variant="agent"
            className={`p-4 animate-fade-in-up ${isWorking ? "gold-glow-sm agent-pulse" : ""}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.color} text-primary-foreground`}>
                {agent.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm truncate">{agent.name}</h4>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(status)} ${isWorking ? "animate-pulse" : ""}`} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {agent.description}
                </p>
              </div>
            </div>
            {isWorking && (
              <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-gold-light shimmer" style={{ width: "60%" }} />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
