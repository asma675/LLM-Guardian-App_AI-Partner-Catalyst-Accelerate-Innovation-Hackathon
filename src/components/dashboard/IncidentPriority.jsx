import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import PriorityBadge from "./PriorityBadge";

export default function IncidentPriority({ incident, onPriorityCalculated }) {
  const [priority, setPriority] = useState(null);
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    calculatePriority();
  }, [incident.id]);

  const calculatePriority = async () => {
    setIsCalculating(true);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this incident and assign a priority level (P0, P1, P2, or P3):

Incident: ${incident.title}
Type: ${incident.type}
Severity: ${incident.severity}
Description: ${incident.description || "N/A"}
Affected Model: ${incident.affected_model || "N/A"}
Status: ${incident.status}

Priority Guidelines:
- P0 (Critical): Critical severity, multiple models affected, production system down, or PII leakage
- P1 (High): High severity, significant user impact, or high error rates
- P2 (Medium): Medium severity, limited impact, or isolated issues
- P3 (Low): Low severity, minimal impact, or cosmetic issues

Consider: severity level, incident type danger, affected systems, and potential user impact.
Return ONLY the priority level: P0, P1, P2, or P3`,
        response_json_schema: {
          type: "object",
          properties: {
            priority: { type: "string", enum: ["P0", "P1", "P2", "P3"] }
          }
        }
      });

      const calculatedPriority = result.priority || "P3";
      setPriority(calculatedPriority);
      if (onPriorityCalculated) {
        onPriorityCalculated(incident.id, calculatedPriority);
      }
    } catch (error) {
      setPriority("P3");
    }
    
    setIsCalculating(false);
  };

  if (isCalculating) {
    return (
      <div className="h-6 w-12 bg-slate-700/50 rounded-lg animate-pulse" />
    );
  }

  return <PriorityBadge priority={priority} size="sm" />;
}