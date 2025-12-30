import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Clock, Cpu, ChevronRight, Sparkles } from "lucide-react";
import SeverityBadge from "./SeverityBadge";
import StatusBadge from "./StatusBadge";
import IncidentPriority from "./IncidentPriority";

export default function IncidentCard({ incident, onClick, compact = false, onPriorityCalculated }) {
  const typeIcons = {
    latency: "⏱️",
    hallucination: "🎭",
    token_spike: "📈",
    pii_detected: "🔐",
    error_rate: "❌",
    prompt_drift: "📊",
    cost_anomaly: "💰"
  };

  const typeLabels = {
    latency: "Latency Spike",
    hallucination: "Hallucination Detected",
    token_spike: "Token Usage Anomaly",
    pii_detected: "PII Detected",
    error_rate: "High Error Rate",
    prompt_drift: "Prompt Drift",
    cost_anomaly: "Cost Anomaly"
  };

  if (compact) {
    return (
      <div 
        onClick={onClick}
        className={cn(
          "flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50",
          "hover:bg-slate-800 hover:border-slate-600 cursor-pointer transition-all duration-200",
          incident.severity === "critical" && "border-red-500/30 bg-red-950/10"
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{typeIcons[incident.type]}</span>
          <div>
            <p className="text-sm font-medium text-white">{incident.title}</p>
            <p className="text-xs text-slate-500">{typeLabels[incident.type]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IncidentPriority incident={incident} onPriorityCalculated={onPriorityCalculated} />
          <SeverityBadge severity={incident.severity} size="sm" />
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 p-6",
        "hover:bg-slate-800 hover:border-slate-600 cursor-pointer transition-all duration-300",
        incident.severity === "critical" && "border-red-500/50 bg-red-950/20"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{typeIcons[incident.type]}</span>
          <div>
            <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
              {incident.title}
            </h3>
            <p className="text-sm text-slate-300">{typeLabels[incident.type]}</p>
          </div>
        </div>
        <SeverityBadge severity={incident.severity} />
      </div>

      <p className="text-sm text-slate-300 mb-4 line-clamp-2">{incident.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {format(new Date(incident.created_date), "MMM d, HH:mm")}
          </div>
          {incident.affected_model && (
            <div className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              {incident.affected_model}
            </div>
          )}
        </div>
        <StatusBadge status={incident.status} />
      </div>

      {incident.suggested_fix && (
        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-center gap-2 text-xs text-blue-300 mb-1 font-medium">
            <Sparkles className="h-3 w-3" />
            AI Suggested Fix
          </div>
          <p className="text-sm text-slate-200 line-clamp-2">{incident.suggested_fix}</p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}