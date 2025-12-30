"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function LogsPage() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["logs"],
    queryFn: api.listLogs,
    refetchInterval: 10_000,
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold">Logs</div>
        <div className="text-sm text-slate-400">LLM request telemetry captured by LLM Guardian</div>
      </div>

      <div className="rounded-2xl bg-white/4 p-5 ring-1 ring-white/10">
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
              {logs.map((row) => (
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
                  <td className="py-2 pr-3 text-slate-400">{new Date(row.createdAt).toLocaleString()}</td>
                  <td className="py-2 pr-3">{row.model}</td>
                  <td className="py-2 pr-3 text-slate-400">{row.prompt}</td>
                  <td className="py-2 pr-3">{row.latencyMs}ms</td>
                  <td className="py-2 pr-3">{row.tokens.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-emerald-300">${row.costUsd.toFixed(4)}</td>
                  <td className="py-2 text-slate-400">{row.flags.join(", ") || "—"}</td>
                </tr>
              ))}
              {!logs.length && !isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No logs yet. Go to Simulate to generate traffic.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
