"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Clock, Hash, DollarSign, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function Card({
  title,
  value,
  sub,
  icon,
  tone = "neutral",
}: {
  title: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "neutral" | "good" | "bad";
}) {
  const ring =
    tone === "good"
      ? "ring-emerald-400/20"
      : tone === "bad"
      ? "ring-rose-400/25"
      : "ring-white/10";
  return (
    <div className={`rounded-2xl bg-white/5 p-5 ring-1 ${ring}`}>
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium tracking-wide text-slate-400">{title.toUpperCase()}</div>
        {icon ? <div className="opacity-80">{icon}</div> : null}
      </div>
      <div className="mt-2 text-4xl font-semibold">{value}</div>
      {sub ? <div className="mt-2 text-sm text-slate-400">{sub}</div> : null}
    </div>
  );
}

function Panel({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/4 p-5 ring-1 ring-white/10">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-base font-semibold">{title}</div>
        {right ? <div className="text-xs text-slate-400">{right}</div> : null}
      </div>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const { data: dash, isLoading: dashLoading, error: dashErr } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.getDashboard,
    refetchInterval: 10_000,
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["logs", "recent"],
    queryFn: api.listLogs,
    refetchInterval: 10_000,
  });

  if (dashErr) {
    return (
      <div className="rounded-2xl bg-rose-500/10 p-4 ring-1 ring-rose-400/20">
        <div className="font-semibold">Dashboard error</div>
        <div className="mt-1 text-sm text-rose-200">{String(dashErr)}</div>
      </div>
    );
  }

  const hallucRisk = dash?.hallucinationRiskPct ?? 0;
  const riskTone = hallucRisk >= 60 ? "bad" : hallucRisk >= 35 ? "neutral" : "good";

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card
          title="Avg Latency"
          value={dashLoading ? "—" : `${Math.round(dash?.avgLatencyMs ?? 0)} ms`}
          sub={dashLoading ? "Loading…" : `P95: ${Math.round(dash?.p95LatencyMs ?? 0)} ms`}
          icon={<Clock className="h-5 w-5 text-indigo-200" />}
        />
        <Card
          title="Total Tokens"
          value={dashLoading ? "—" : `${(dash?.totalTokens ?? 0).toLocaleString()}`}
          sub="Last 12 hours"
          icon={<Hash className="h-5 w-5 text-indigo-200" />}
        />
        <Card
          title="Total Cost"
          value={dashLoading ? "—" : `$${(dash?.totalCostUsd ?? 0).toFixed(2)}`}
          sub="Last 12 hours"
          icon={<DollarSign className="h-5 w-5 text-emerald-200" />}
          tone="good"
        />
        <Card
          title="Error Rate"
          value={dashLoading ? "—" : `${(dash?.errorRatePct ?? 0).toFixed(1)} %`}
          sub={`${dash?.openIncidents ?? 0} open incidents`}
          icon={<AlertTriangle className="h-5 w-5 text-rose-200" />}
          tone={(dash?.errorRatePct ?? 0) >= 5 ? "bad" : "neutral"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Latency Trend" right="Last 12 hours">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dash?.latencyTrend ?? []}>
                <XAxis dataKey="t" tick={{ fill: "rgba(148,163,184,0.8)", fontSize: 10 }} />
                <YAxis tick={{ fill: "rgba(148,163,184,0.8)", fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Hallucination Risk" right={riskTone === "bad" ? "High Risk" : riskTone === "good" ? "Low Risk" : "Moderate"}>
          <div className="flex h-60 flex-col items-center justify-center">
            <div className="text-5xl font-semibold">{hallucRisk.toFixed(2)}%</div>
            <div className="mt-2 text-sm text-slate-400">
              PII incidents: <span className="text-slate-200">{dash?.piiIncidents ?? 0}</span> • Active monitors:{" "}
              <span className="text-slate-200">{dash?.activeMonitors ?? 0}</span>
            </div>
            <div className="mt-4 w-full rounded-full bg-white/5 p-1 ring-1 ring-white/10">
              <div
                className="h-3 rounded-full bg-white/60"
                style={{ width: `${Math.min(100, Math.max(0, hallucRisk))}%` }}
              />
            </div>
          </div>
        </Panel>

        <Panel title="Cost Over Time" right="Cumulative">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dash?.costTrend ?? []}>
                <XAxis dataKey="t" tick={{ fill: "rgba(148,163,184,0.8)", fontSize: 10 }} />
                <YAxis tick={{ fill: "rgba(148,163,184,0.8)", fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Recent LLM Requests" right={<span className="text-slate-500">Latest {Math.min(10, logs.length)}</span>}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-400">
              <tr>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Time</th>
                <th className="py-2 pr-3">Model</th>
                <th className="py-2 pr-3">Prompt</th>
                <th className="py-2 pr-3">Latency</th>
                <th className="py-2 pr-3">Tokens</th>
                <th className="py-2 pr-3">Cost</th>
                <th className="py-2">Flags</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {logs.slice(0, 10).map((row) => (
                <tr key={row.id} className="border-t border-white/5">
                  <td className="py-2 pr-3">
                    <span
                      className={
                        row.status === "ERROR"
                          ? "text-rose-300"
                          : row.status === "WARN"
                          ? "text-amber-300"
                          : "text-emerald-300"
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-slate-400">{new Date(row.createdAt).toLocaleTimeString()}</td>
                  <td className="py-2 pr-3">{row.model}</td>
                  <td className="py-2 pr-3 text-slate-400">
                    {row.prompt.length > 48 ? row.prompt.slice(0, 48) + "…" : row.prompt}
                  </td>
                  <td className="py-2 pr-3">{row.latencyMs}ms</td>
                  <td className="py-2 pr-3">{row.tokens.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-emerald-300">${row.costUsd.toFixed(4)}</td>
                  <td className="py-2 text-slate-400">{row.flags.join(", ") || "—"}</td>
                </tr>
              ))}
              {!logs.length ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-500">
                    No logs yet. Go to <span className="text-slate-200">Simulate</span> to generate traffic.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
