LLM Guardian 🛡️

End-to-end observability + safety monitoring for LLM apps (Google Cloud x Datadog)

LLM Guardian is a full-stack web app that helps AI engineers monitor and troubleshoot LLM applications by tracking latency, errors, token usage, estimated cost, and safety signals (PII risk + hallucination risk). It also generates actionable incidents and provides a dashboard view of system health.

Built for the AI Partner Catalyst: Accelerate Innovation hackathon — Datadog Challenge.

✨ Key Features

Chat / LLM Request Runner: Send prompts and capture responses

Telemetry capture: latency, token counts, estimated cost, error states

Safety signals:

PII detection flag

Hallucination risk score

Flags JSON for rule triggers / metadata

Incidents:

Create incident records from detection rules

Track incident status + severity

Suggested fix field for engineering handoff

Monitoring rules (basic):

Threshold monitors (latency / error rate / risk score)

Trigger counts per monitor

Dashboard UI:

Charts + tables for requests/incidents/monitors

Real-time-ish refresh via React Query

🧱 Tech Stack

Frontend: Next.js (React), TailwindCSS, Recharts

Backend: Next.js API Routes (/api/*)

Database: Supabase Postgres

ORM: Prisma

State/Data: @tanstack/react-query

Observability: Datadog (logs/metrics/traces – integrated per challenge)

🚀 Live Demo

Hosted App: (add your Vercel URL here)

Demo Video (≤ 3 min): (add YouTube/Vimeo link here)

Devpost Submission: (add Devpost link here)

✅ Hackathon Requirement Mapping (Datadog Challenge)

This project:

Uses Google Cloud AI (Gemini / Vertex AI) to power LLM responses

Streams LLM + runtime telemetry to Datadog

Provides detection rules that generate actionable items (incidents/alerts) with engineering context

Includes a dashboard surfacing key health + security signals

Note: If you used a local stub model during development, you can switch to Gemini/Vertex by setting env vars (see below).

🛠️ Local Development
1) Install dependencies
npm install

2) Create .env (root)

Create a file named .env in the project root:

# Prisma / Supabase Postgres
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..."

# Optional: Google Cloud / Gemini (if you wired it)
GOOGLE_API_KEY="..."

# Optional: Datadog
DD_API_KEY="..."
DD_SITE="datadoghq.com"

3) Generate Prisma client
npm run prisma:generate

4) Run migrations (local)
npm run prisma:migrate

5) Start dev server
npm run dev


Open: http://localhost:3000

🌐 Deploy to Vercel
Environment variables (Vercel)

In Vercel → Project → Settings → Environment Variables, set:

DATABASE_URL → paste your Supabase pooled Postgres URL (often includes pgbouncer=true)

DIRECT_URL → paste your Supabase non-pooling Postgres URL (port 5432)

✅ Important: paste the full URL (no quotes, no @VARNAME references).

Build script

The build script runs:

prisma generate

prisma migrate deploy

next build

So your DB schema is applied automatically during deployment.

🧪 Scripts
npm run dev                 # Start Next.js dev server
npm run build               # Generate Prisma + migrate deploy + Next build
npm run start               # Run production server
npm run lint                # Lint
npm run prisma:generate     # Prisma client generation
npm run prisma:migrate      # Local migration (dev)
npm run prisma:migrate:deploy # Prod migration (deploy)
npm run seed                # Seed sample data (if configured)

🗃️ Database Schema (Prisma)

Core entities:

LlmRequest — each prompt/response with telemetry + safety flags

Incident — actionable engineering items linked to a request

Monitor — threshold-based monitors and trigger counts

🧩 StackBlitz Support (FYI)

StackBlitz is great for quick UI demos, but Prisma migrations may not run reliably there.
Recommended approach:

Use Vercel for full backend + DB

Use StackBlitz for UI preview / mock data if needed

🔐 Security Notes

Never commit .env

Rotate secrets if they are ever shared publicly

Use Supabase Service Role key only on server-side (never in browser)

📄 License

This repository is open source for hackathon submission requirements.

Add a license file:

LICENSE → MIT (recommended)

🙌 Acknowledgements

Google Cloud (Gemini / Vertex AI)

Datadog

Devpost Hackathon: AI Partner Catalyst: Accelerate Innovation

Confluent, ElevenLabs (hackathon partners)
