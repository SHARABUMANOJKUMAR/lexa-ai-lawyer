import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type Status = "checking" | "online" | "offline";

const HEALTH_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/legal-chat/health`;

export const ChatStatusIndicator = () => {
  const [status, setStatus] = useState<Status>("checking");

  const check = async () => {
    try {
      const res = await fetch(HEALTH_URL, {
        method: "GET",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) return setStatus("offline");
      const data = await res.json().catch(() => null);
      setStatus(data?.status === "OK" ? "online" : "offline");
    } catch {
      setStatus("offline");
    }
  };

  useEffect(() => {
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, []);

  const config = {
    checking: {
      label: "Checking…",
      icon: <Loader2 className="w-3 h-3 mr-1 animate-spin" />,
      className: "bg-muted text-muted-foreground border border-border",
    },
    online: {
      label: "Chat Online",
      icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
      className: "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30",
    },
    offline: {
      label: "Chat Offline",
      icon: <AlertCircle className="w-3 h-3 mr-1" />,
      className: "bg-destructive/15 text-destructive border border-destructive/30",
    },
  }[status];

  return (
    <Badge
      variant="outline"
      className={`text-xs flex items-center cursor-pointer ${config.className}`}
      onClick={check}
      title="Click to re-check chat reachability"
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};

export default ChatStatusIndicator;