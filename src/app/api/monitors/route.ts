import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const rows = await prisma.monitor.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(
    rows.map((m) => ({
      id: m.id,
      name: m.name,
      type: m.type,
      threshold: m.threshold,
      enabled: m.enabled,
      severity: m.severity,
      triggeredCount: m.triggeredCount,
    }))
  );
}
