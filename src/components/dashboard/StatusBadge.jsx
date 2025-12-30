import { cn } from "@/lib/utils";

export default function StatusBadge({ status }) {
  const config = {
    open: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      dot: "bg-red-400 animate-pulse"
    },
    investigating: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      dot: "bg-amber-400 animate-pulse"
    },
    resolved: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      dot: "bg-emerald-400"
    },
    dismissed: {
      bg: "bg-slate-500/10",
      text: "text-slate-400",
      dot: "bg-slate-400"
    }
  };

  const { bg, text, dot } = config[status] || config.open;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium capitalize",
      bg, text
    )}>
      <div className={cn("h-2 w-2 rounded-full", dot)} />
      {status}
    </div>
  );
}