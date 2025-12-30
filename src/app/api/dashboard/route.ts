import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

function bucketKey(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  return `${hh}:00`;
}

export async function GET() {
  const since = new Date(Date.now() - 12 * 60 * 60 * 1000);

  const [reqs, incidents, monitors] = await Promise.all([
    prisma.llmRequest.findMany({ where: { createdAt: { gte: since } } }),
    prisma.incident.findMany({ where: { createdAt: { gte: since } } }),
    prisma.monitor.findMany(),
  ]);

  const n = reqs.length || 1;
  const avgLatencyMs = reqs.reduce((a, r) => a + r.latencyMs, 0) / n;
  const sortedLat = reqs.map((r) => r.latencyMs).sort((a, b) => a - b);
  const p95LatencyMs = sortedLat.length ? sortedLat[Math.floor(sortedLat.length * 0.95)] : 0;

  const totalTokens = reqs.reduce((a, r) => a + r.tokens, 0);
  const totalCostUsd = reqs.reduce((a, r) => a + r.costUsd, 0);
  const errors = reqs.filter((r) => !!r.error).length;
  const errorRatePct = reqs.length ? (errors / reqs.length) * 100 : 0;

  const hallucinationRiskPct = reqs.length
    ? reqs.reduce((a, r) => a + (r.hallucinationRisk || 0), 0) / reqs.length
    : 0;

  const piiIncidents = incidents.filter((i) => i.title.toLowerCase().includes("pii")).length;
  const activeMonitors = monitors.filter((m) => m.enabled).length;
  const openIncidents = await prisma.incident.count({ where: { status: { in: ["OPEN", "INVESTIGATING"] } } });

  // hourly trends
  const buckets = new Map<string, { latency: number[]; tokens: number; cost: number }>();
  for (const r of reqs) {
    const k = bucketKey(r.createdAt);
    const b = buckets.get(k) || { latency: [], tokens: 0, cost: 0 };
    b.latency.push(r.latencyMs);
    b.tokens += r.tokens;
    b.cost += r.costUsd;
    buckets.set(k, b);
  }

  const hours: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.now() - i * 60 * 60 * 1000);
    hours.push(bucketKey(d));
  }

  const latencyTrend = hours.map((h) => {
    const b = buckets.get(h);
    const value = b && b.latency.length ? b.latency.reduce((a, x) => a + x, 0) / b.latency.length : 0;
    return { t: h, value: Math.round(value) };
  });

  const tokenTrend = hours.map((h) => ({ t: h, value: Math.round(buckets.get(h)?.tokens || 0) }));
  const costTrend = hours.map((h) => ({ t: h, value: +(buckets.get(h)?.cost || 0).toFixed(4) }));

  return NextResponse.json({
    avgLatencyMs: Math.round(avgLatencyMs),
    p95LatencyMs: Math.round(p95LatencyMs),
    totalTokens,
    totalCostUsd: +totalCostUsd.toFixed(2),
    errorRatePct: +errorRatePct.toFixed(1),
    hallucinationRiskPct: +hallucinationRiskPct.toFixed(2),
    piiIncidents,
    activeMonitors,
    openIncidents,
    latencyTrend,
    tokenTrend,
    costTrend,
  });
}
