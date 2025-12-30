import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const rows = await prisma.llmRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const out = rows.map((r) => {
    const flags = (() => {
      try {
        return JSON.parse(r.flagsJson || "[]");
      } catch {
        return [];
      }
    })();

    let status: "OK" | "WARN" | "ERROR" = "OK";
    if (r.error) status = "ERROR";
    else if (flags.length) status = "WARN";

    return {
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      status,
      model: r.model,
      prompt: r.prompt,
      latencyMs: r.latencyMs,
      tokens: r.tokens,
      costUsd: r.costUsd,
      flags,
    };
  });

  return NextResponse.json(out);
}
