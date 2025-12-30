"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function SimulatePage() {
  const qc = useQueryClient();
  const [count, setCount] = React.useState(8);
  const [prompt, setPrompt] = React.useState("Explain what observability means for LLM apps and give 3 key metrics.");
  const [answer, setAnswer] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  const sim = useMutation({
    mutationFn: () => api.simulate(count),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["dashboard"] }),
        qc.invalidateQueries({ queryKey: ["logs"] }),
        qc.invalidateQueries({ queryKey: ["incidents"] }),
        qc.invalidateQueries({ queryKey: ["monitors"] }),
      ]);
    },
  });

  const chat = useMutation({
    mutationFn: () => api.chat(prompt, "gemini-1.5-flash"),
    onMutate: () => {
      setAnswer(null);
      setErr(null);
    },
    onSuccess: async (r: any) => {
      setAnswer(r.text ?? r.response ?? JSON.stringify(r, null, 2));
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["dashboard"] }),
        qc.invalidateQueries({ queryKey: ["logs"] }),
        qc.invalidateQueries({ queryKey: ["incidents"] }),
      ]);
    },
    onError: (e: any) => setErr(String(e?.message || e)),
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold">Simulate</div>
        <div className="text-sm text-slate-400">Generate synthetic traffic to trigger monitors and incidents</div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white/4 p-5 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Traffic Generator</div>
          <div className="mt-2 text-sm text-slate-400">
            Creates requests with varied latency, tokens, PII patterns, and errors to exercise your detection rules.
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value || "0", 10))}
              type="number"
              min={1}
              max={50}
              className="w-24 rounded-xl bg-black/30 px-3 py-2 text-sm text-slate-100 ring-1 ring-white/10"
            />
            <button
              onClick={() => sim.mutate()}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              disabled={sim.isPending}
            >
              {sim.isPending ? "Generating…" : "Generate"}
            </button>
          </div>

          {sim.data ? <div className="mt-3 text-sm text-emerald-300">Created {sim.data.created} requests.</div> : null}
          {sim.error ? <div className="mt-3 text-sm text-rose-300">{String(sim.error)}</div> : null}
        </div>

        <div className="rounded-2xl bg-white/4 p-5 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Chat (API)</div>
          <div className="mt-2 text-sm text-slate-400">
            Calls <code className="text-slate-200">/api/chat</code> and stores telemetry in the database.
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-4 h-28 w-full rounded-xl bg-black/30 p-3 text-sm text-slate-100 ring-1 ring-white/10"
          />

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => chat.mutate()}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
              disabled={chat.isPending}
            >
              {chat.isPending ? "Calling…" : "Send"}
            </button>
          </div>

          {err ? <div className="mt-3 text-sm text-rose-300">{err}</div> : null}
          {answer ? (
            <div className="mt-4 rounded-xl bg-black/25 p-3 text-sm text-slate-100 ring-1 ring-white/10 whitespace-pre-wrap">
              {answer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
