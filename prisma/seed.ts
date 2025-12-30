import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.monitor.count();
  if (existing > 0) return;

  await prisma.monitor.createMany({
    data: [
      {
        name: "Latency P95 Threshold",
        type: "latency_p95_ms",
        threshold: 2000,
        enabled: true,
        severity: "HIGH",
      },
      {
        name: "Hallucination Score Alert",
        type: "hallucination_risk_pct",
        threshold: 60,
        enabled: true,
        severity: "CRITICAL",
      },
      {
        name: "Token Usage Spike",
        type: "token_spike",
        threshold: 50000,
        enabled: true,
        severity: "HIGH",
      },
      {
        name: "PII Detection Alert",
        type: "pii_incidents",
        threshold: 1,
        enabled: true,
        severity: "CRITICAL",
      },
      {
        name: "Error Rate Threshold",
        type: "error_rate_pct",
        threshold: 5,
        enabled: true,
        severity: "HIGH",
      },
      {
        name: "Cost Anomaly Alert",
        type: "cost_usd",
        threshold: 50,
        enabled: false,
        severity: "MEDIUM",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
