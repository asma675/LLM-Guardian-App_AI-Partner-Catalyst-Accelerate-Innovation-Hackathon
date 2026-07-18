# 🛡️ LLM Guardian

### Enterprise Observability, Security & AI Governance Platform for Large Language Model Applications

[![Next.js](https://img.shields.io/badge/Next.js-15-black)]()
[![React](https://img.shields.io/badge/React-19-61DAFB)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)]()
[![Datadog](https://img.shields.io/badge/Datadog-Integrated-632CA6)]()
[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Gemini-4285F4)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

> **LLM Guardian** is a production-inspired AI observability and governance platform that enables engineering teams to monitor, secure, evaluate, and troubleshoot enterprise Generative AI applications. The platform combines runtime telemetry, AI safety analysis, incident management, and interactive dashboards into a unified developer experience.

Built by **Asma Ahmed** for the **Google Cloud × Datadog AI Partner Catalyst Hackathon**.

---

# 🚀 Why LLM Guardian?

Deploying LLM-powered applications introduces challenges beyond traditional software engineering.

Organizations need visibility into:

* Response latency
* Token consumption
* AI cost
* Hallucination risk
* PII exposure
* Prompt injection attempts
* System reliability
* Production incidents
* Governance & compliance

LLM Guardian provides a centralized platform for monitoring these signals in real time.

---

# ✨ Features

### 🤖 LLM Playground

* Execute prompts against LLMs
* Capture prompts and responses
* Compare model behavior
* Evaluate response quality

---

### 📊 AI Observability

Automatically captures

* Response latency
* Token usage
* Estimated inference cost
* Error rate
* Request metadata
* Trace identifiers

Inspired by modern observability platforms including Datadog.

---

### 🛡 AI Safety Monitoring

Built-in detection for

* Personally Identifiable Information (PII)
* Hallucination risk
* Safety rule violations
* Prompt metadata
* Configurable policy flags

Designed around Responsible AI principles.

---

### 🚨 Incident Management

Automatically converts AI failures into engineering incidents.

Each incident contains

* Severity
* Status
* Detection source
* Suggested remediation
* Engineering notes
* Resolution workflow

---

### 📈 Monitoring Rules

Create custom monitoring policies using thresholds.

Examples

* Latency > 3 seconds
* Error rate > 5%
* Hallucination score > 0.75
* Excessive token consumption

---

### 📉 Dashboards

Real-time operational dashboards showing

* Request throughput
* Token usage
* Cost trends
* Safety violations
* Incident summaries
* Active monitoring rules

---

# 🏗 Architecture

```text
                User
                 │
                 ▼
         Next.js Frontend
                 │
      React Query + API Routes
                 │
                 ▼
        Google Gemini / Vertex AI
                 │
                 ▼
      Telemetry + Safety Pipeline
                 │
      ┌──────────┴───────────┐
      ▼                      ▼
 Datadog              Supabase Postgres
 Metrics/Logs          Prisma ORM
      │
      ▼
 Incident Engine
      │
      ▼
 Monitoring Dashboard
```

---

# 🧰 Technology Stack

| Layer            | Technologies                                       |
| ---------------- | -------------------------------------------------- |
| Frontend         | Next.js, React, TypeScript, Tailwind CSS, Recharts |
| Backend          | Next.js API Routes, REST APIs                      |
| Database         | Supabase PostgreSQL                                |
| ORM              | Prisma                                             |
| State Management | TanStack React Query                               |
| AI               | Google Gemini, Vertex AI                           |
| Observability    | Datadog                                            |
| Deployment       | Vercel                                             |
| Version Control  | Git & GitHub                                       |

---

# 📊 Key Capabilities

✔ AI Observability

✔ Runtime Telemetry

✔ AI Governance

✔ Responsible AI

✔ Prompt Monitoring

✔ Hallucination Detection

✔ PII Detection

✔ Incident Management

✔ Cost Tracking

✔ Token Analytics

✔ Engineering Dashboards

✔ Enterprise Monitoring

---

# 📂 Project Structure

```
app/
components/
lib/
prisma/
public/
types/
utils/
```

---

# ⚡ Getting Started

## Install

```bash
npm install
```

---

## Configure Environment

```env
DATABASE_URL=
DIRECT_URL=

GOOGLE_API_KEY=

DD_API_KEY=
DD_SITE=
```

---

## Generate Prisma

```bash
npm run prisma:generate
```

---

## Run Migrations

```bash
npm run prisma:migrate
```

---

## Start

```bash
npm run dev
```

---

# 🚀 Deployment

The project is optimized for deployment on **Vercel**.

Deployment automatically

* Generates Prisma Client
* Applies database migrations
* Builds the Next.js application

---

# 📈 Future Roadmap

* Claude Integration
* OpenAI Integration
* IBM Granite Integration
* Amazon Bedrock
* Azure OpenAI
* LangSmith Evaluation
* Langfuse Observability
* OpenTelemetry Support
* RBAC & SSO
* Slack & Microsoft Teams alerts
* Kubernetes deployment
* Multi-model benchmarking
* AI Agent monitoring

---

# 🏆 Hackathon

**Google Cloud × Datadog AI Partner Catalyst**

Challenge Focus

* Google Gemini
* Vertex AI
* Datadog Observability
* Enterprise AI Monitoring

---

# 👩‍💻 Author

**Asma Ahmed**

Software Engineer • AI Engineer • Product Builder

* 🌐 Portfolio
* 💼 LinkedIn
* 💻 GitHub

---

# 📄 License

Licensed under the **MIT License**.

---

## A few suggestions that will make this look even more impressive to recruiters:

* Add a **system architecture diagram** near the top.
* Include **GIFs** of the dashboard and incident workflow instead of only screenshots.
* Add a **Tech Stack badges** section (Shields.io).
* Add **GitHub Actions CI**, code coverage, and deployment badges.
* Include a **Performance & Scale** section (e.g., average response time, requests tested, telemetry captured).
* Add an **Enterprise Use Cases** section (Healthcare, Banking, Insurance, Retail, Public Sector).
* Mention planned integrations with **Langfuse**, **LangSmith**, **OpenTelemetry**, **IBM watsonx**, and **IBM Granite** in the roadmap. Those names are highly recognizable to recruiters and signal familiarity with the enterprise AI ecosystem.
