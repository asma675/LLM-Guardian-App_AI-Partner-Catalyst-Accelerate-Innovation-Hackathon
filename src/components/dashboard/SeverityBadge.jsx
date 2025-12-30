import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info, XCircle } from "lucide-react";

export default function SeverityBadge({ severity, size = "default" }) {
  const config = {
    critical: {
      bg: "bg-red-500/10 border-red-500/30",
      text: "text-red-400",
      icon: XCircle,
      glow: "shadow-red-500/20 shadow-lg"
    },
    high: {
      bg: "bg-orange-500/10 border-orange-500/30",
      text: "text-orange-400",
      icon: AlertTriangle,
      glow: ""
    },
    medium: {
      bg: "bg-amber-500/10 border-amber-500/30",
      text: "text-amber-400",
      icon: AlertCircle,
      glow: ""
    },
    low: {
      bg: "bg-blue-500/10 border-blue-500/30",
      text: "text-blue-400",
      icon: Info,
      glow: ""
    }
  };

  const { bg, text, icon: Icon, glow } = config[severity] || config.low;
  
  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-xs gap-1" 
    : "px-3 py-1 text-sm gap-1.5";

  return (
    <div className={cn(
      "inline-flex items-center rounded-full border font-medium capitalize",
      bg, text, glow, sizeClasses
    )}>
      <Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      {severity}
    </div>
  );
}