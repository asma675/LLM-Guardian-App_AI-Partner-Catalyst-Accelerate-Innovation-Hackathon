import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Clock, AlertTriangle, TrendingUp, Shield, DollarSign, Activity, FileWarning, Zap } from "lucide-react";
import SeverityBadge from "./SeverityBadge";

export default function MonitorCard({ monitor, onToggle, onClick }) {
  const typeConfig = {
    latency: { icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
    hallucination: { icon: AlertTriangle, color: "text-purple-400", bg: "bg-purple-500/10" },
    token_usage: { icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-500/10" },
    pii_detection: { icon: Shield, color: "text-red-400", bg: "bg-red-500/10" },
    error_rate: { icon: FileWarning, color: "text-orange-400", bg: "bg-orange-500/10" },
    prompt_drift: { icon: Activity, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    cost: { icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" }
  };

  const { icon: Icon, color, bg } = typeConfig[monitor.type] || typeConfig.latency;

  const comparisonLabels = {
    greater_than: ">",
    less_than: "<",
    equals: "=",
    anomaly: "≠"
  };

  return (
    <div 
      className={cn(
        "group relative rounded-2xl bg-slate-900 border border-slate-700 p-5",
        "hover:bg-slate-800 hover:border-slate-600 transition-all duration-300",
        !monitor.enabled && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onClick}>
          <div className={cn("p-2.5 rounded-xl", bg)}>
            <Icon className={cn("h-5 w-5", color)} />
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm">
              {monitor.name}
            </h3>
            <p className="text-xs text-slate-400 capitalize">{monitor.type.replace(/_/g, ' ')}</p>
          </div>
        </div>
        <Switch 
          checked={monitor.enabled} 
          onCheckedChange={() => onToggle(monitor)}
          className="data-[state=checked]:bg-blue-600"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="font-mono bg-slate-800 px-2 py-1 rounded text-slate-200 font-medium">
            {comparisonLabels[monitor.comparison]} {monitor.threshold}{monitor.threshold_unit}
          </span>
        </div>
        <SeverityBadge severity={monitor.severity_on_trigger} size="sm" />
      </div>

      {monitor.trigger_count > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Zap className="h-3 w-3 text-amber-400" />
          Triggered {monitor.trigger_count} times
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}