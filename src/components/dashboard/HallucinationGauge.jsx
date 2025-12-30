import { cn } from "@/lib/utils";

export default function HallucinationGauge({ score, size = "default" }) {
  const normalizedScore = Math.min(100, Math.max(0, score));
  const rotation = (normalizedScore / 100) * 180 - 90;
  
  const getColor = (score) => {
    if (score < 30) return { stroke: "#10B981", text: "text-emerald-400", label: "Low Risk" };
    if (score < 60) return { stroke: "#F59E0B", text: "text-amber-400", label: "Medium Risk" };
    return { stroke: "#EF4444", text: "text-red-400", label: "High Risk" };
  };

  const { stroke, text, label } = getColor(normalizedScore);
  const sizeClass = size === "sm" ? "w-32 h-20" : "w-48 h-28";
  const fontSize = size === "sm" ? "text-xl" : "text-3xl";

  return (
    <div className="flex flex-col items-center">
      <div className={cn("relative", sizeClass)}>
        <svg viewBox="0 0 100 60" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#334155"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Colored sections */}
          <path
            d="M 10 50 A 40 40 0 0 1 30 18"
            fill="none"
            stroke="#10B981"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.3"
          />
          <path
            d="M 32 16 A 40 40 0 0 1 68 16"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.3"
          />
          <path
            d="M 70 18 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#EF4444"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.3"
          />
          {/* Needle */}
          <g transform={`rotate(${rotation} 50 50)`}>
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="18"
              stroke={stroke}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="4" fill={stroke} />
          </g>
        </svg>
      </div>
      <div className="text-center -mt-2">
        <span className={cn("font-bold", fontSize, text)}>{normalizedScore.toFixed(2)}</span>
        <span className="text-slate-500 text-sm">%</span>
      </div>
      <p className={cn("text-xs mt-1", text)}>{label}</p>
    </div>
  );
}