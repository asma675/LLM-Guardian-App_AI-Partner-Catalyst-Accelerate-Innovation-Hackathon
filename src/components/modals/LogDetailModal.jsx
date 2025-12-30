import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Cpu, 
  Hash, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  User
} from "lucide-react";
import HallucinationGauge from "../dashboard/HallucinationGauge";

export default function LogDetailModal({ log, open, onClose }) {
  if (!log) return null;

  const statusConfig = {
    success: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    error: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
    warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" }
  };

  const { icon: StatusIcon, color, bg } = statusConfig[log.status] || statusConfig.success;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className={`p-2 rounded-lg ${bg}`}>
              <StatusIcon className={`h-5 w-5 ${color}`} />
            </div>
            Request Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                  <Clock className="h-4 w-4" />
                  Latency
                </div>
                <p className="text-xl font-bold text-white">{log.latency_ms?.toFixed(0) || "-"}ms</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                  <Hash className="h-4 w-4" />
                  Tokens
                </div>
                <p className="text-xl font-bold text-white">{log.total_tokens?.toLocaleString() || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                  <DollarSign className="h-4 w-4" />
                  Cost
                </div>
                <p className="text-xl font-bold text-emerald-400">${log.cost_usd?.toFixed(4) || "0.0000"}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 flex items-center justify-center">
                <HallucinationGauge score={log.hallucination_score || 0} size="sm" />
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="border-slate-600">
                <Cpu className="h-3 w-3 mr-1" />
                {log.model || "unknown"}
              </Badge>
              <Badge variant="outline" className="border-slate-600">
                <Hash className="h-3 w-3 mr-1" />
                {log.request_id || "N/A"}
              </Badge>
              {log.user_id && (
                <Badge variant="outline" className="border-slate-600">
                  <User className="h-3 w-3 mr-1" />
                  {log.user_id}
                </Badge>
              )}
              <Badge variant="outline" className="border-slate-600">
                {format(new Date(log.created_date), "MMM d, yyyy HH:mm:ss")}
              </Badge>
            </div>

            {/* PII Warning */}
            {log.pii_detected && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-2 text-red-400 font-medium mb-2">
                  <Shield className="h-5 w-5" />
                  PII Detected
                </div>
                <div className="flex flex-wrap gap-2">
                  {log.pii_types?.map((type, i) => (
                    <Badge key={i} className="bg-red-500/20 text-red-300 border-red-500/30">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className="bg-slate-700" />

            {/* Prompt */}
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Input Prompt</h4>
              <div className="p-4 rounded-xl bg-slate-800 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                {log.prompt || "No prompt recorded"}
              </div>
            </div>

            {/* Response */}
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Response</h4>
              <div className="p-4 rounded-xl bg-slate-800 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                {log.response || "No response recorded"}
              </div>
            </div>

            {/* Error */}
            {log.error && (
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-2">Error</h4>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 font-mono text-sm text-red-300">
                  {log.error}
                </div>
              </div>
            )}

            {/* Token Breakdown */}
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Token Breakdown</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                  <p className="text-xs text-slate-500">Input</p>
                  <p className="text-lg font-bold text-white">{log.input_tokens || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                  <p className="text-xs text-slate-500">Output</p>
                  <p className="text-lg font-bold text-white">{log.output_tokens || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="text-lg font-bold text-violet-400">{log.total_tokens || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}