# LLM Guardian (Next.js + Prisma)

A traditional Next.js/React implementation of the **LLM Guardian** dashboard you originally built in Base44 — rebuilt with:

- **Next.js App Router** (React)
- **Node.js API routes** (`/api/*`)
- **Prisma + SQLite** database (easy local dev)
- **React Query** for client data fetching
- **Recharts** for charts
- Minimal **PII + hallucination heuristics** + monitor-driven incident creation

> This repo intentionally contains **no Base44-specific runtime dependencies or Base44 API calls**.

---

## Features

- Dashboard KPIs: avg latency, tokens, cost, error rate
- Trends (last 12 hours): latency & cost charts
- Hallucination risk gauge (demo heuristic)
- Incidents page with severity + suggested fixes
- Monitors page with toggles + thresholds
- Logs page (request telemetry)
- Simulate page:
  - Generate synthetic traffic
  - Call a real LLM via Gemini (optional) and record telemetry

---

## Quickstart

### 1) Install

```bash
npm install
```

### 2) Configure env

Copy `.env.example` to `.env` and set values:

```bash
cp .env.example .env
```

At minimum you need:

- `DATABASE_URL="file:./dev.db"`

Optional (to enable real chat):
- `GEMINI_API_KEY="..."`

### 3) Create DB + seed monitors

```bash
npx prisma migrate dev --name init
npm run seed
```

### 4) Run

```bash
npm run dev
```

Open: http://localhost:3000

---

## Notes

- `Simulate` works even without an LLM key (it can generate synthetic traffic).
- `/api/chat` returns a stub response if `GEMINI_API_KEY` is not set, but still logs telemetry.
- Thresholds are configurable on the **Monitors** page.

---

## Project structure

- `src/app/*` — Next.js pages (Dashboard, Incidents, Monitors, Logs, Simulate)
- `src/app/api/*` — backend endpoints
- `prisma/schema.prisma` — DB schema
- `prisma/seed.ts` — default monitors
- `src/lib/guardrails.ts` — toy PII + hallucination scoring
- `src/lib/evaluate.ts` — monitor evaluation -> incident creation

---

## Deploy

- Works on Vercel (SQLite is fine for demos; for production use Postgres).
- Replace `DATABASE_URL` with a Postgres connection string if needed and run migrations.
