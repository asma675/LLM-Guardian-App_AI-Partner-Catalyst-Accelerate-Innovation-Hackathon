import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Cpu, 
  Sparkles,
  CheckCircle,
  Search,
  XCircle,
  Copy,
  ExternalLink
} from "lucide-react";
import SeverityBadge from "../dashboard/SeverityBadge";
import StatusBadge from "../dashboard/StatusBadge";
import { toast } from "sonner";

export default function IncidentDetailModal({ incident, open, onClose, onUpdateStatus }) {
  if (!incident) return null;

  const typeLabels = {
    latency: "Latency Spike",
    hallucination: "Hallucination Detected",
    token_spike: "Token Usage Anomaly",
    pii_detected: "PII Detected",
    error_rate: "High Error Rate",
    prompt_drift: "Prompt Drift",
    cost_anomaly: "Cost Anomaly"
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl mb-2">{incident.title}</DialogTitle>
              <div className="flex items-center gap-3">
                <SeverityBadge severity={incident.severity} />
                <StatusBadge status={incident.status} />
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Metadata */}
            <div className="flex flex-wrap gap-3 text-sm">
              <Badge variant="outline" className="border-slate-600">
                {typeLabels[incident.type]}
              </Badge>
              {incident.affected_model && (
                <Badge variant="outline" className="border-slate-600">
                  <Cpu className="h-3 w-3 mr-1" />
                  {incident.affected_model}
                </Badge>
              )}
              <Badge variant="outline" className="border-slate-600">
                <Clock className="h-3 w-3 mr-1" />
                {format(new Date(incident.created_date), "MMM d, yyyy HH:mm")}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Description</h4>
              <p className="text-slate-300">{incident.description}</p>
            </div>

            {/* AI Suggested Fix */}
            {incident.suggested_fix && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center gap-2 text-blue-400 font-medium mb-2">
                  <Sparkles className="h-5 w-5" />
                  AI Suggested Fix
                </div>
                <p className="text-slate-300">{incident.suggested_fix}</p>
              </div>
            )}

            <Separator className="bg-slate-700" />

            {/* Sample Prompt */}
            {incident.sample_prompt && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-400">Sample Prompt</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(incident.sample_prompt)}
                    className="h-7 text-slate-400 hover:text-white"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="p-4 rounded-xl bg-slate-800 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                  {incident.sample_prompt}
                </div>
              </div>
            )}

            {/* Sample Output */}
            {incident.sample_output && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-400">Sample Output</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(incident.sample_output)}
                    className="h-7 text-slate-400 hover:text-white"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="p-4 rounded-xl bg-slate-800 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                  {incident.sample_output}
                </div>
              </div>
            )}

            {/* Metrics Snapshot */}
            {incident.metrics && (
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Metrics at Time of Incident</h4>
                <div className="p-4 rounded-xl bg-slate-800 font-mono text-sm text-slate-300">
                  <pre>{JSON.stringify(incident.metrics, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex gap-2 sm:gap-0">
          {incident.status === "open" && (
            <>
              <Button 
                variant="outline" 
                className="border-slate-600 hover:bg-slate-800"
                onClick={() => onUpdateStatus(incident.id, "investigating")}
              >
                <Search className="h-4 w-4 mr-2" />
                Investigate
              </Button>
              <Button 
                variant="outline" 
                className="border-slate-600 hover:bg-slate-800"
                onClick={() => onUpdateStatus(incident.id, "dismissed")}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Dismiss
              </Button>
            </>
          )}
          {incident.status === "investigating" && (
            <>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => onUpdateStatus(incident.id, "resolved")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Resolved
              </Button>
            </>
          )}
          {(incident.status === "resolved" || incident.status === "dismissed") && (
            <Button 
              variant="outline" 
              className="border-slate-600 hover:bg-slate-800"
              onClick={() => onUpdateStatus(incident.id, "open")}
            >
              Reopen
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}