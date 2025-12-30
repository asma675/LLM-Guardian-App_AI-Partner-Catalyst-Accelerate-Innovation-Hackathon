import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { detectPII, estimateCostUsd, estimateTokens, hallucinationRisk } from "@/lib/guardrails";
import { evaluateMonitorsAndCreateIncidents } from "@/lib/evaluate";

export const runtime = "nodejs";

type Body = {
  prompt?: string;
  model?: string;
  temperature?: number;
};

async function callGemini(prompt: string, model: string, temperature: number) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return {
      text:
        "⚠️ GEMINI_API_KEY is not set. This is a stub response so the app remains functional.

" +
        "Your prompt was:
" +
        prompt,
      provider: "stub",
    };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(key)}`;

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature },
    }),
  });

  const data = await r.json();
  if (!r.ok) {
    const msg = data?.error?.message || "Gemini request failed";
    throw new Error(msg);
  }

  const text =
    data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join("") ??
    "No response";
  return { text, provider: "gemini" };
}

async function evaluateMonitorsAndCreateIncidents(opts: {
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
        desc = `Latency exceeded ${m.threshold}ms threshold. User-facing requests may be impacted.`;
        fix =
          "Consider request batching, caching, or switching to a faster model for latency-sensitive paths. Check downstream dependencies and network egress.";
        break;

      case "token_spike":
        triggered = opts.tokens > m.threshold;
        title = `Token usage anomaly: ${opts.tokens.toLocaleString()} tokens`;
        desc = "Token usage significantly exceeded expected baseline.";
        fix =
          "Investigate prompts or retrieval payload size. Add max_tokens, output length controls, and truncate irrelevant context.";
        break;

      case "pii_incidents":
        triggered = opts.pii;
        title = "PII detected in LLM output";
        desc = "Personally identifiable information (email/phone/SSN) was detected in model response.";
        fix =
          "Implement output sanitization + PII redaction, add stricter system prompts, and block risky tool outputs. Store only redacted logs.";
        break;

      case "hallucination_risk_pct":
        triggered = opts.hallucRisk > m.threshold;
        title = "Hallucination detected in customer support responses";
        desc = `Hallucination risk score (${opts.hallucRisk.toFixed(1)}%) exceeded ${m.threshold}%.`;
        fix =
          "Add retrieval-augmented generation (RAG) with verified documentation, require citations for factual answers, and use a secondary verifier model.";
        break;

      case "error_rate_pct":
        triggered = errorRatePct > m.threshold;
        title = "Error rate threshold exceeded";
        desc = "An API error occurred while generating a response.";
        fix = "Check provider key/quotas, add retries with backoff, and implement graceful fallbacks.";
        break;

      case "cost_usd":
        triggered = opts.costUsd > m.threshold;
        title = "Cost anomaly detected";
        desc = `Request cost ($${opts.costUsd.toFixed(4)}) exceeded $${m.threshold}.`;
        fix = "Enforce budgets, cap tokens, and route to cheaper models for non-critical flows.";
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
    // increment triggeredCount for monitors that fired
    const triggeredTypes = new Set(
      incidents
        .map((i) => i.title)
        .filter(Boolean)
    );
    // best-effort: just increment all enabled monitors when at least one incident created
    await prisma.monitor.updateMany({
      where: { enabled: true },
      data: { triggeredCount: { increment: 1 } as any },
    });
  }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body;
  const prompt = (body.prompt || "").trim();
  if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

  const model = body.model || "gemini-1.5-flash";
  const temperature = typeof body.temperature === "number" ? body.temperature : 0.2;

  const t0 = Date.now();
  let text = "";
  let error: string | null = null;

  try {
    const r = await callGemini(prompt, model, temperature);
    text = r.text;
  } catch (e: any) {
    error = e?.message || "Unknown error";
    text = "";
  }

  const latencyMs = Date.now() - t0;
  const promptTokens = estimateTokens(prompt);
  const completionTokens = estimateTokens(text || "");
  const tokens = promptTokens + completionTokens;
  const costUsd = estimateCostUsd(model, promptTokens, completionTokens);

  const pii = detectPII(text).pii;
  const hallRisk = text ? hallucinationRisk(prompt, text) : 0;
  const flags = [
    ...(pii ? ["PII"] : []),
    ...(hallRisk > 60 ? ["Hallucination"] : hallRisk > 35 ? ["Risk"] : []),
    ...(error ? ["Error"] : []),
  ];

  const saved = await prisma.llmRequest.create({
    data: {
      model,
      prompt,
      response: text || null,
      latencyMs,
      tokens,
      costUsd,
      error,
      piiDetected: pii,
      hallucinationRisk: hallRisk,
      flagsJson: JSON.stringify(flags),
    },
  });

  await evaluateMonitorsAndCreateIncidents({
    model,
    prompt,
    response: text || "",
    latencyMs,
    tokens,
    costUsd,
    pii,
    hallucRisk: hallRisk,
    error,
    reqId: saved.id,
  });

  return NextResponse.json({
    id: saved.id,
    model,
    latencyMs,
    tokens,
    costUsd,
    flags,
    text,
    error,
  });
}
