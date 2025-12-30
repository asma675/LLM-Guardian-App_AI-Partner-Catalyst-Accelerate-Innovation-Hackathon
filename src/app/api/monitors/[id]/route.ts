import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const enabled = !!body.enabled;

  const updated = await prisma.monitor.update({
    where: { id: params.id },
    data: { enabled },
  });

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    type: updated.type,
    threshold: updated.threshold,
    enabled: updated.enabled,
    severity: updated.severity,
    triggeredCount: updated.triggeredCount,
  });
}
