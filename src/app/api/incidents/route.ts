import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const rows = await prisma.incident.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json(
    rows.map((i) => ({
      id: i.id,
      createdAt: i.createdAt.toISOString(),
      title: i.title,
      description: i.description,
      model: i.model,
      severity: i.severity,
      status: i.status,
      suggestedFix: i.suggestedFix,
    }))
  );
}
