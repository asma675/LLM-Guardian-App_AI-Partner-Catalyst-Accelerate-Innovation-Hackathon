import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IncidentSummary({ incidents }) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async () => {
    if (!incidents || incidents.length === 0) {
      setSummary("No open incidents at this time. All systems running normally.");
      return;
    }

    setIsLoading(true);
    
    const incidentData = incidents.map(inc => ({
      type: inc.type,
      severity: inc.severity,
      title: inc.title,
      affected_model: inc.affected_model,
      description: inc.description?.substring(0, 150)
    }));

    try {
      const aiSummary = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI reliability expert. Analyze these ${incidents.length} open incidents and provide a concise executive summary (3-4 sentences max):

${JSON.stringify(incidentData, null, 2)}

Focus on: overall system health, most critical issues, patterns across incidents, and priority recommendations.`,
      });
      
      setSummary(aiSummary);
    } catch (error) {
      setSummary("Unable to generate summary at this time.");
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    generateSummary();
  }, [incidents]);

  return (
    <Card className="bg-gradient-to-br from-blue-900/10 to-violet-900/10 border-blue-500/30 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Sparkles className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Incident Summary</h3>
            <p className="text-xs text-slate-400">Powered by LLM analysis</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={generateSummary}
          disabled={isLoading}
          className="text-slate-400 hover:text-white"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Refresh"
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-slate-200 leading-relaxed">{summary}</p>
          
          {incidents.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-700">
              <div className="text-xs text-slate-400">
                <span className="font-medium text-slate-300">{incidents.length}</span> open incidents
              </div>
              {incidents.filter(i => i.severity === "critical").length > 0 && (
                <div className="flex items-center gap-1 text-xs text-red-400">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="font-medium">{incidents.filter(i => i.severity === "critical").length}</span> critical
                </div>
              )}
              {incidents.filter(i => i.severity === "high").length > 0 && (
                <div className="text-xs text-orange-400">
                  <span className="font-medium">{incidents.filter(i => i.severity === "high").length}</span> high priority
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}