"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TriangleAlert, Plus } from "lucide-react";

function Stat({ label, value, tone }: { label: string; value: number; tone?: "neutral" | "bad" | "good" }) {
  const ring =
    tone === "bad" ? "ring-rose-400/25" : tone === "good" ? "ring-emerald-400/20" : "ring-white/10";
  return (
    <div className={`rounded-2xl bg-white/5 p-5 ring-1 ${ring}`}>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}

export default function IncidentsPage() {
  const { data: incidents = [], isLoading } = useQuery({
    queryKey: ["incidents"],
    queryFn: api.listIncidents,
    refetchInterval: 10_000,
  });

  const totals = React.useMemo(() => {
    const total = incidents.length;
    const open = incidents.filter((i) => i.status === "OPEN").length;
    const investigating = incidents.filter((i) => i.status === "INVESTIGATING").length;
    const resolved = incidents.filter((i) => i.status === "RESOLVED").length;
    const critical = incidents.filter((i) => i.severity === "CRITICAL").length;
    return { total, open, investigating, resolved, critical };
  }, [incidents]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">Incidents</div>
          <div className="text-sm text-slate-400">Monitor and manage LLM anomalies and issues</div>
        </div>
        <button
          disabled
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white opacity-60"
          title="Creation UI can be added—incidents are auto-created by monitors."
        >
          <Plus className="h-4 w-4" /> Create Incident
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Stat label="Total" value={isLoading ? 0 : totals.total} />
        <Stat label="Open" value={isLoading ? 0 : totals.open} tone="neutral" />
        <Stat label="Investigating" value={isLoading ? 0 : totals.investigating} tone="neutral" />
        <Stat label="Resolved" value={isLoading ? 0 : totals.resolved} tone="good" />
        <Stat label="Critical" value={isLoading ? 0 : totals.critical} tone="bad" />
      </div>

      <div className="rounded-2xl bg-white/4 p-5 ring-1 ring-white/10">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-semibold">
            <TriangleAlert className="h-4 w-4 text-amber-200" />
            AI Incident Summary
          </div>
          <div className="text-xs text-slate-500">Auto-generated from recent signals</div>
        </div>
        <p className="text-sm leading-6 text-slate-200">
          {totals.total === 0
            ? "No incidents detected. Generate traffic in Simulate to exercise monitors."
            : `There are ${totals.open} open incidents (${totals.critical} critical). Prioritize PII, error rate, and latency spikes. Use the Monitors page to tune thresholds and reduce alert fatigue.`}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {incidents
          .slice()
          .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
          .map((i) => (
            <div
              key={i.id}
              className={`rounded-2xl p-5 ring-1 ${
                i.severity === "CRITICAL"
                  ? "bg-rose-500/10 ring-rose-400/25"
                  : i.severity === "HIGH"
                  ? "bg-amber-500/10 ring-amber-400/25"
                  : "bg-white/4 ring-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{i.title}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {new Date(i.createdAt).toLocaleString()} • {i.model ?? "unknown model"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ring-1 ${
                      i.severity === "CRITICAL"
                        ? "bg-rose-500/10 text-rose-200 ring-rose-400/25"
                        : i.severity === "HIGH"
                        ? "bg-amber-500/10 text-amber-200 ring-amber-400/25"
                        : "bg-white/5 text-slate-200 ring-white/10"
                    }`}
                  >
                    {i.severity}
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300 ring-1 ring-white/10">
                    {i.status}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-200">{i.description}</div>

              {i.suggestedFix ? (
                <div className="mt-4 rounded-xl bg-white/5 p-3 text-sm ring-1 ring-white/10">
                  <div className="mb-1 text-xs font-semibold text-slate-300">AI Suggested Fix</div>
                  <div className="text-slate-200">{i.suggestedFix}</div>
                </div>
              ) : null}
            </div>
          ))}

        {!incidents.length ? (
          <div className="rounded-2xl bg-white/4 p-8 text-center text-slate-500 ring-1 ring-white/10 lg:col-span-2">
            No incidents yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
