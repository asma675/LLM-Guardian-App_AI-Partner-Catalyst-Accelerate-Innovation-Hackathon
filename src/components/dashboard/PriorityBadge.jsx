import { cn } from "@/lib/utils";
import { Flame, ArrowUp, ArrowRight, ArrowDown } from "lucide-react";

export default function PriorityBadge({ priority, size = "md" }) {
  const config = {
    P0: {
      label: "P0",
      icon: Flame,
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/50",
      glow: "shadow-red-500/20"
    },
    P1: {
      label: "P1",
      icon: ArrowUp,
      bg: "bg-orange-500/20",
      text: "text-orange-400",
      border: "border-orange-500/50",
      glow: "shadow-orange-500/20"
    },
    P2: {
      label: "P2",
      icon: ArrowRight,
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      border: "border-yellow-500/50",
      glow: "shadow-yellow-500/20"
    },
    P3: {
      label: "P3",
      icon: ArrowDown,
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/50",
      glow: "shadow-blue-500/20"
    }
  };

  const { label, icon: Icon, bg, text, border, glow } = config[priority] || config.P3;
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4"
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 rounded-lg border font-semibold shadow-lg",
      bg, text, border, glow, sizeClasses[size]
    )}>
      <Icon className={iconSizes[size]} />
      {label}
    </div>
  );
}