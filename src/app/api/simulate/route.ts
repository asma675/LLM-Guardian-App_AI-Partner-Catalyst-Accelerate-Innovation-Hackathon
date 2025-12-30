import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { detectPII, estimateCostUsd, estimateTokens, hallucinationRisk } from "@/lib/guardrails";
import { evaluateMonitorsAndCreateIncidents } from "@/lib/evaluate";

export const runtime = "nodejs";

function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const count = Math.max(1, Math.min(50, Number(body.count || 8)));

  const prompts = [
    "Write a short poem about artificial intelligence.",
    "Summarize the key points from the meeting transcript and list action items.",
    "Generate a product description for the new feature release.",
    "Process customer feedback and extract sentiment with top 3 themes.",
    "Translate this document to Spanish.",
    "Analyze sales data and provide insights.",
    "Generate weekly report summary for leadership.",
    "Review code for security vulnerabilities.",
    "Categorize support tickets by priority and owner.",
  ];

  const models = ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo", "gemini-pro", "claude-3"];

  let created = 0;

  for (let i = 0; i < count; i++) {
    const prompt = sample(prompts);
    const model = sample(models);

    const latencyMs = Math.round(200 + Math.random() * 6000);
    const response =
      Math.random() < 0.18
        ? "Here is an email you can use: jane.doe@example.com and phone (415) 555-1234."
        : "Response generated successfully.";

    const error = Math.random() < 0.08 ? "Upstream provider error" : null;

    const promptTokens = estimateTokens(prompt);
    const completionTokens = estimateTokens(response);
    // occasional token spikes
    const tokens = Math.random() < 0.12 ? 3000 + Math.round(Math.random() * 6000) : promptTokens + completionTokens;
    const costUsd = estimateCostUsd(model, promptTokens, completionTokens) + (tokens > 2000 ? 0.05 : 0);

    const pii = detectPII(response).pii;
    const hallRisk = hallucinationRisk(prompt, response) + (Math.random() < 0.2 ? 40 : 0);
    const flags = [
      ...(pii ? ["PII"] : []),
      ...(hallRisk > 60 ? ["Hallucination"] : hallRisk > 35 ? ["Risk"] : []),
      ...(error ? ["Error"] : []),
    ];

    const saved = await prisma.llmRequest.create({
      data: {
        model,
        prompt,
        response: error ? null : response,
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
      response,
      latencyMs,
      tokens,
      costUsd,
      pii,
      hallucRisk: hallRisk,
      error,
      reqId: saved.id,
    });

    created++;
  }

  return NextResponse.json({ ok: true, created });
}
