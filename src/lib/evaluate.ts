import { prisma } from "@/lib/db";

export async function evaluateMonitorsAndCreateIncidents(opts: {
  model: string;
  prompt: string;
  response: string;
  latencyMs: number;
  tokens: number;
  costUsd: number;
  pii: boolean;
  hallucRisk: number;
  error?: string | null;
  reqId: string;
}) {
  const monitors = await prisma.monitor.findMany({ where: { enabled: true } });

  const incidents: any[] = [];
  const now = new Date();

  const errorRatePct = opts.error ? 100 : 0;

  for (const m of monitors) {
    let triggered = false;
    let title = "";
    let desc = "";
    let fix = "";

    switch (m.type) {
      case "latency_p95_ms":
        triggered = opts.latencyMs > m.threshold;
        title = `Critical latency spike on ${opts.model} endpoint`;
        desc = `P95 latency exceeded ${m.threshold}ms threshold for over 10 minutes. User-facing requests may be impacted.`;
        fix =
          "Consider implementing request batching, caching, or switching to a faster model for latency-sensitive operations. Review downstream dependencies.";
        break;

      case "token_spike":
        triggered = opts.tokens > m.threshold;
        title = `Token usage anomaly: ${opts.tokens.toLocaleString()} tokens`;
        desc = "Token usage significantly exceeded expected baseline.";
        fix =
          "Investigate the triggering events or prompts that led to elevated token usage. Add max_tokens and trim context.";
        break;

      case "pii_incidents":
        triggered = opts.pii;
        title = "PII detected in LLM output";
        desc = "Model response contained email addresses and/or phone numbers that were not sanitized.";
        fix =
          "Implement output sanitization + PII detection. Add guardrails to prevent PII in responses even if present in context.";
        break;

      case "hallucination_risk_pct":
        triggered = opts.hallucRisk > m.threshold;
        title = "Hallucination detected in customer support responses";
        desc = "Model generated fictional product features or incorrect information. Confidence score indicates high hallucination likelihood.";
        fix =
          "Add retrieval-augmented generation (RAG) with verified product documentation. Implement fact-checking validation before responding.";
        break;

      case "error_rate_pct":
        triggered = errorRatePct > m.threshold;
        title = "Error rate threshold exceeded";
        desc = "Model/provider returned an error for the request.";
        fix = "Add retries with backoff, validate API keys/quotas, and implement fallbacks.";
        break;

      case "cost_usd":
        triggered = opts.costUsd > m.threshold;
        title = "Cost anomaly detected";
        desc = `Request cost ($${opts.costUsd.toFixed(4)}) exceeded $${m.threshold}.`;
        fix = "Enforce budgets, cap tokens, and route to cheaper models when appropriate.";
        break;

      default:
        break;
    }

    if (triggered) {
      incidents.push({
        createdAt: now,
        title,
        description: desc,
        model: opts.model,
        severity: m.severity,
        status: "OPEN",
        suggestedFix: fix,
        relatedReqId: opts.reqId,
      });
    }
  }

  if (incidents.length) {
    await prisma.incident.createMany({ data: incidents });
    await prisma.monitor.updateMany({
      where: { enabled: true },
      data: { triggeredCount: { increment: 1 } as any },
    });
  }
}
