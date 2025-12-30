"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Activity } from "lucide-react";

export default function MonitorsPage() {
  const qc = useQueryClient();
  const { data: monitors = [] } = useQuery({
    queryKey: ["monitors"],
    queryFn: api.listMonitors,
    refetchInterval: 10_000,
  });

  const toggle = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => api.toggleMonitor(id, enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["monitors"] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold">Monitors</div>
        <div className="text-sm text-slate-400">Enable/disable detection rules and tune thresholds</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {monitors.map((m) => (
          <div key={m.id} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500/10 p-2 ring-1 ring-indigo-400/20">
                  <Activity className="h-4 w-4 text-indigo-200" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{m.name}</div>
                  <div className="mt-1 text-xs text-slate-400">{m.type}</div>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-slate-300">
                <span className="text-slate-400">Enabled</span>
                <button
                  onClick={() => toggle.mutate({ id: m.id, enabled: !m.enabled })}
                  className={`h-6 w-10 rounded-full p-1 ring-1 transition ${
                    m.enabled ? "bg-emerald-500/20 ring-emerald-400/25" : "bg-white/10 ring-white/15"
                  }`}
                >
                  <span
                    className={`block h-4 w-4 rounded-full bg-white/80 transition ${
                      m.enabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </label>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <div className="text-xs text-slate-400">Threshold</div>
                <div className="mt-1 font-semibold">{m.threshold}</div>
              </div>
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <div className="text-xs text-slate-400">Severity</div>
                <div className="mt-1 font-semibold">{m.severity}</div>
              </div>
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <div className="text-xs text-slate-400">Triggered</div>
                <div className="mt-1 font-semibold">{m.triggeredCount}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!monitors.length ? (
        <div className="rounded-2xl bg-white/4 p-8 text-center text-slate-500 ring-1 ring-white/10">
          No monitors yet. Run <code className="text-slate-200">npm run prisma:migrate</code> then{" "}
          <code className="text-slate-200">npm run seed</code>.
        </div>
      ) : null}
    </div>
  );
}
