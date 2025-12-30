import { z } from "zod";

const API = {
  dashboard: "/api/dashboard",
  logs: "/api/logs",
  incidents: "/api/incidents",
  monitors: "/api/monitors",
  chat: "/api/chat",
  simulate: "/api/simulate",
};

async function j<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((data as any)?.error || `Request failed (${r.status})`);
  return data as T;
}

export const DashboardSchema = z.object({
  avgLatencyMs: z.number(),
  p95LatencyMs: z.number(),
  totalTokens: z.number(),
  totalCostUsd: z.number(),
  errorRatePct: z.number(),
  hallucinationRiskPct: z.number(),
  piiIncidents: z.number(),
  activeMonitors: z.number(),
  openIncidents: z.number(),
  latencyTrend: z.array(z.object({ t: z.string(), value: z.number() })),
  tokenTrend: z.array(z.object({ t: z.string(), value: z.number() })),
  costTrend: z.array(z.object({ t: z.string(), value: z.number() })),
});

export type Dashboard = z.infer<typeof DashboardSchema>;

export type LogRow = {
  id: string;
  createdAt: string;
  status: "OK" | "WARN" | "ERROR";
  model: string;
  prompt: string;
  latencyMs: number;
  tokens: number;
  costUsd: number;
  flags: string[];
};

export type Incident = {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  model?: string | null;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  suggestedFix?: string | null;
};

export type Monitor = {
  id: string;
  name: string;
  type: string;
  threshold: number;
  enabled: boolean;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  triggeredCount: number;
};

export const api = {
  getDashboard: async () => DashboardSchema.parse(await j(API.dashboard)),
  listLogs: async (): Promise<LogRow[]> => j(API.logs),
  listIncidents: async (): Promise<Incident[]> => j(API.incidents),
  listMonitors: async (): Promise<Monitor[]> => j(API.monitors),
  toggleMonitor: async (id: string, enabled: boolean): Promise<Monitor> =>
    j(`${API.monitors}/${id}`, { method: "PATCH", body: JSON.stringify({ enabled }) }),
  simulate: async (count: number): Promise<{ ok: true; created: number }> =>
    j(API.simulate, { method: "POST", body: JSON.stringify({ count }) }),
  chat: async (prompt: string, model?: string) =>
    j(API.chat, { method: "POST", body: JSON.stringify({ prompt, model }) }),
};
