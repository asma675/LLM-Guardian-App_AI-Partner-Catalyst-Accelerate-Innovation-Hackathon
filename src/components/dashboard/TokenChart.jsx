import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function TokenChart({ data, threshold }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isAnomaly = payload[0].value > (threshold || Infinity);
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-slate-400 mb-1">{label}</p>
          <p className={`text-sm font-semibold ${isAnomaly ? 'text-red-400' : 'text-white'}`}>
            {payload[0].value.toLocaleString()} tokens
          </p>
          {isAnomaly && (
            <p className="text-xs text-red-400 mt-1">⚠️ Above threshold</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="tokenAnomalyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity={1} />
              <stop offset="100%" stopColor="#EF4444" stopOpacity={0.3} />
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
            tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="tokens" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.tokens > (threshold || Infinity) ? "url(#tokenAnomalyGradient)" : "url(#tokenGradient)"} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}