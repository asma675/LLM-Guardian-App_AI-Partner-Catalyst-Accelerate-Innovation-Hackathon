import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function LatencyChart({ data, threshold }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-slate-400 mb-1">{label}</p>
          <p className="text-sm font-semibold text-white">
            {payload[0].value.toFixed(0)} ms
          </p>
          {payload[1] && (
            <p className="text-xs text-slate-500">
              P95: {payload[1].value.toFixed(0)} ms
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="p95Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            stroke="#475569" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#475569" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}ms`}
          />
          <Tooltip content={<CustomTooltip />} />
          {threshold && (
            <ReferenceLine 
              y={threshold} 
              stroke="#EF4444" 
              strokeDasharray="5 5" 
              label={{ value: "Threshold", fill: "#EF4444", fontSize: 10 }}
            />
          )}
          <Area
            type="monotone"
            dataKey="p95"
            stroke="#F59E0B"
            strokeWidth={1}
            fill="url(#p95Gradient)"
          />
          <Area
            type="monotone"
            dataKey="avg"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#latencyGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}