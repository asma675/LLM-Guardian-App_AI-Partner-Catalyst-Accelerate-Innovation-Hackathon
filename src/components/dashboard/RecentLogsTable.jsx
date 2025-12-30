import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Shield, Eye } from "lucide-react";

export default function RecentLogsTable({ logs, onViewLog }) {
  const statusIcons = {
    success: <CheckCircle className="h-4 w-4 text-emerald-400" />,
    error: <XCircle className="h-4 w-4 text-red-400" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-400" />
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "-";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="rounded-xl border border-slate-700/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700/50 hover:bg-transparent">
            <TableHead className="text-slate-400 font-medium">Status</TableHead>
            <TableHead className="text-slate-400 font-medium">Time</TableHead>
            <TableHead className="text-slate-400 font-medium">Model</TableHead>
            <TableHead className="text-slate-400 font-medium">Prompt</TableHead>
            <TableHead className="text-slate-400 font-medium text-right">Latency</TableHead>
            <TableHead className="text-slate-400 font-medium text-right">Tokens</TableHead>
            <TableHead className="text-slate-400 font-medium text-right">Cost</TableHead>
            <TableHead className="text-slate-400 font-medium">Flags</TableHead>
            <TableHead className="text-slate-400 font-medium w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow 
              key={log.id} 
              className="border-slate-700/50 hover:bg-slate-800/50 cursor-pointer"
              onClick={() => onViewLog(log)}
            >
              <TableCell>{statusIcons[log.status]}</TableCell>
              <TableCell className="text-slate-400 text-sm font-mono">
                {format(new Date(log.created_date), "HH:mm:ss")}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                  {log.model || "unknown"}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-300 text-sm max-w-[200px]">
                {truncateText(log.prompt)}
              </TableCell>
              <TableCell className={cn(
                "text-right text-sm font-mono",
                log.latency_ms > 5000 ? "text-red-400" : log.latency_ms > 2000 ? "text-amber-400" : "text-slate-300"
              )}>
                {log.latency_ms?.toFixed(0) || "-"}ms
              </TableCell>
              <TableCell className="text-right text-sm font-mono text-slate-300">
                {log.total_tokens?.toLocaleString() || "-"}
              </TableCell>
              <TableCell className="text-right text-sm font-mono text-emerald-400">
                ${log.cost_usd?.toFixed(4) || "0.0000"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {log.pii_detected && (
                    <div className="p-1 rounded bg-red-500/10" title="PII Detected">
                      <Shield className="h-3 w-3 text-red-400" />
                    </div>
                  )}
                  {log.hallucination_score > 60 && (
                    <div className="p-1 rounded bg-amber-500/10" title={`Hallucination: ${log.hallucination_score}%`}>
                      <AlertTriangle className="h-3 w-3 text-amber-400" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Eye className="h-4 w-4 text-slate-500 hover:text-white transition-colors" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}