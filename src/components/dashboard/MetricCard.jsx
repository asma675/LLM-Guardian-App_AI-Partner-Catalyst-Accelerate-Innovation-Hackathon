import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MetricCard({ 
  title, 
  value, 
  unit, 
  change, 
  trend, 
  icon: Icon, 
  status = "normal",
  subtitle 
}) {
  const statusColors = {
    normal: "from-slate-800 to-slate-900 border border-slate-700",
    warning: "from-amber-900/20 to-slate-900 border border-amber-500/50",
    critical: "from-red-900/20 to-slate-900 border border-red-500/50",
    good: "from-emerald-900/20 to-slate-900 border border-emerald-500/50"
  };

  const iconColors = {
    normal: "text-blue-400 bg-blue-500/10",
    warning: "text-amber-400 bg-amber-500/10",
    critical: "text-red-400 bg-red-500/10",
    good: "text-emerald-400 bg-emerald-500/10"
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-red-400" : trend === "down" ? "text-emerald-400" : "text-slate-500";

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 transition-all duration-300 hover:scale-[1.02]",
      statusColors[status]
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-300 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white tracking-tight">{value}</span>
            {unit && <span className="text-lg text-slate-300">{unit}</span>}
          </div>
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
              <TrendIcon className="h-4 w-4" />
              <span>{Math.abs(change)}% from last hour</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("p-3 rounded-xl", iconColors[status])}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      
      {status === "critical" && (
        <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
      )}
    </div>
  );
}