# 🚀 FounderHQ – Autonomous AI Operating System for Startups

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-ef4444?style=for-the-badge&logo=turborepo)](https://turbo.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**FounderHQ** is an enterprise-grade AI Operating System designed to eliminate operational burnout for early-stage founders by centralizing startup operations into an intelligent CEO Planner and specialized agentic sub-systems.

---

## 🏆 Hackathon Submission Checklist (Section 5.4 Compliance)

| Submission Requirement               | Link / Details                                                                             | Status                                                            |
| :----------------------------------- | :----------------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| **🌐 Live Deployed Product**         | [https://founderhq.vercel.app](https://founderhq.vercel.app) _(or your Vercel/Render URL)_ | ✅ Ready for Deployment                                           |
| **📂 Public Source Code Repository** | Public GitHub Repository with complete README & setup instructions                         | ✅ Fully Documented                                               |
| **🎥 60-Second Demonstration Video** | See [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) for 60s timestamped script & recording blueprint  | ✅ Script & Outline Complete                                      |
| **📌 Distributed Git Commits**       | Incremental, structured commits throughout development event                               | ✅ Compliant (See [`GIT_COMMIT_GUIDE.md`](./GIT_COMMIT_GUIDE.md)) |

---

## 🎯 1. Problem Clarity & Product Vision (Weight: 10%)

### The Problem

Early-stage founders face severe operational friction. Managing pitch decks, financial burn rates, legal compliance, hiring pipelines, and marketing campaigns across dozens of fragmented SaaS tools causes cognitive fatigue and distracts from core product innovation.

### The Solution: FounderHQ

FounderHQ solves operational fragmentation by acting as an **Autonomous AI Co-Founder**.

- Centralized dark-mode operating system interface.
- High-level intent processing: State a goal (e.g. _"Raise $500k Pre-Seed round"_), and FounderHQ orchestrates multi-agent tasks across Finance, Legal, HR, and Growth.
- Structured execution workflows with memory retention and real-time speech interactions.

---

## 🧠 2. AI Integration Depth & System Architecture (Weight: 25%)

FounderHQ goes far beyond simple LLM chat wrappers by engineering a **hierarchical multi-agent cognitive architecture**:

```
                              ┌───────────────────────────┐
                              │    Founder HQ Interface   │
                              │  (Next.js 15 + Speech UI) │
                              └─────────────┬─────────────┘
                                            │
                                            ▼
                              ┌───────────────────────────┐
                              │  FastAPI Backend Gateway  │
                              └─────────────┬─────────────┘
                                            │
                                            ▼
                              ┌───────────────────────────┐
                              │     CEO Planner Agent     │
                              │   (Google Gemini Engine)  │
                              └─────────────┬─────────────┘
                                            │
        ┌───────────────────┬───────────────┼───────────────┬───────────────────┐
        ▼                   ▼               ▼               ▼                   ▼
┌───────────────┐   ┌───────────────┐ ┌───────────┐ ┌───────────────┐   ┌───────────────┐
│ Financial     │   │ Legal &       │ │ HR &      │ │ Growth &      │   │ Sales &       │
│ Executive     │   │ Compliance    │ │ Talent    │ │ Marketing     │   │ Revenue       │
│ Agent         │   │ Agent         │ │ Agent     │ │ Agent         │   │ Agent         │
└───────────────┘   └───────────────┘ └───────────┘ └───────────────┘   └───────────────┘
```

### Key AI Features

1. **CEO Planner Engine:** Decomposes unstructured natural language goals into actionable execution graphs using Google Gemini LLM.
2. **Specialized Executive Sub-Agents:** Domain-tuned agents (Finance, HR, Growth, Legal, Sales) powered by structured Pydantic schemas.
3. **Voice & Speech Intelligence:** Real-time text-to-speech and speech-to-text integration for hands-free executive commands.
4. **Memory & Context RAG Pipeline:** Retains historical founder decisions, financial models, and strategic context across sessions.

---

## 🛠️ 3. Technical Execution & Monorepo Architecture (Weight: 20%)

Engineered as a production-grade monorepo powered by **Turborepo** and `pnpm`:

### Repository Structure

```
FounderHq/
├── apps/
│   ├── web/               # Next.js 15 App Router Frontend (React 19, Tailwind CSS, Framer Motion)
│   └── api/               # FastAPI Python 3.12 Backend (Gemini SDK, Pydantic v2, Uvicorn)
├── packages/
│   ├── types/             # Shared TypeScript types & interfaces
│   ├── ui/                # Shared design system components
│   ├── config/            # Shared ESLint, TypeScript, & Tailwind configs
│   └── shared/            # Shared utilities & constants
├── Dockerfile.web         # Multi-stage Docker build for Next.js standalone runner
├── Dockerfile.api         # Optimized Python Docker container with healthchecks
└── render.yaml            # Blueprint infrastructure definition for 1-click cloud deploy
```

- **Type Safety:** 100% strict TypeScript compliance across all packages (`pnpm run typecheck` verified).
- **Code Quality:** Prettier formatting, ESLint rules, and Ruff linter hooks.

---

## 🎨 4. Design & User Experience (Weight: 10%)

- **Aesthetic Excellence:** Modern, premium dark-mode interface built with custom glassmorphism effects, HSL color palettes, and polished typography.
- **Dynamic Navigation:** Floating collapsible sidebar (`floating-sidebar.tsx`) with nested recursive agent routing.
- **Micro-Animations:** Fluid layout transitions and glow highlights powered by Framer Motion.
- **Responsive Layout:** Tailored dashboards across desktop, tablet, and mobile displays.

---

## ⚡ 5. Quick Start & Local Setup

### Prerequisites

- **Node.js**: `>= 20.0.0`
- **pnpm**: `>= 9.0.0`
- **Python**: `>= 3.12`

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/FounderHQ.git
cd FounderHQ
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` templates in both `apps/web` and `apps/api`:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

### 3. Launch Development Server

```bash
pnpm dev
```

- **Web Dashboard:** `http://localhost:3000`
- **FastAPI OpenAPI Docs:** `http://localhost:8000/docs`
- **Health Check Endpoint:** `http://localhost:8000/api/v1/healthz`

---

## 🌐 6. Production Deployment (Completeness: 10%)

For detailed deployment instructions on Vercel and Render, refer to [`DEPLOYMENT.md`](./DEPLOYMENT.md).

```bash
# Verify build locally before pushing
pnpm run typecheck
pnpm --filter web build
```

---

## 🎥 7. 60-Second Video Script & Presentation (Weight: 10%)

Refer to [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) for the exact 60-second video demo script, visual screen recording guide, and voiceover text required for submission.

---

## 🎓 8. Individual Interview Preparation (Section 6.2)

Refer to [`INTERVIEW_PREP.md`](./INTERVIEW_PREP.md) for technical talking points, system design explanations, and Q&A preparation for the Axiss Group representative interviews during the demo round.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
