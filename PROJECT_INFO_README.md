<div align="center">

# 🚀 FounderHQ — AI Startup Incubator OS

### _An Enterprise Multi-Agent Operating System for 0-to-1 Founders_

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Google ADK](https://img.shields.io/badge/Google_ADK-Gemini_2.5-4285F4.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.0-000000.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📌 Executive Summary & Key Features

### Executive Summary

**FounderHQ** is an enterprise-grade AI Startup Incubator OS designed for 0-to-1 founders. Acting as an on-demand AI Executive Team—comprising a CEO Orchestrator, Product Lead, Growth Architect, Finance Director, and General Counsel—FounderHQ transforms simple startup prompts (e.g., _"build an edutech study app"_, _"real estate SaaS"_, _"crypto tax tool"_) into structured, execution-ready **30-Day Launch Blueprints**.

Powered by **Google ADK (Agent Development Kit)** and **Gemini 2.5**, FounderHQ features hierarchical multi-agent orchestration, real-time Server-Sent Event (SSE) streaming, Human-in-the-Loop (HITL) safety gates, and dynamic metric-based business analytics.

---

### 🌟 Key Features

- 👑 **Hierarchical CEO Orchestration:** Powered by `gemini-2.5-pro`, the CEO Planner dynamically evaluates prompt context, extracts domain parameters, and routes sub-tasks across specialized executive agents.
- ⚡ **Real-Time SSE Event Streaming:** Utilizes FastAPI and `sse-starlette` to stream live agent thoughts, tool execution steps, and structured blueprint deliverables directly to the frontend.
- 🛡️ **Human Approval Queue (HITL):** Built-in safety gates flag high-impact founder actions—such as equity allocation, hiring offers >$100k, and high-budget marketing spend—requiring explicit founder sign-off before execution.
- 📊 **Proactive Business Insights:** Dynamic metric-driven dashboard tracking Revenue, Runway, Burn Rate, and Growth Rate with live SVG arc progress calculations.
- 📱 **Interactive Agent Profile Explorer:** Dynamic UI drawer and metadata viewer providing direct insight into agent capabilities, prompt parameters, system instructions, and execution logs.

---

## 🏗️ Architecture Diagram & Agent Matrix

### System Architecture

```text
               ┌──────────────────────────────────────────────┐
               │    Next.js 14 Web Dashboard (Tailwind)       │
               └──────────────────────┬───────────────────────┘
                                      │ HTTP / SSE Stream
                                      ▼
               ┌──────────────────────────────────────────────┐
               │    FastAPI API Gateway (/api/v1/planner)      │
               └──────────────────────┬───────────────────────┘
                                      │ Dynamic Routing
                                      ▼
               ┌──────────────────────────────────────────────┐
               │  CEO Planner Agent (gemini-2.5-pro / ADK)     │
               └──────┬───────────────┬───────────────┬───────┘
                      │               │               │
         ┌────────────┴───┐    ┌──────┴────────┐    ┌─┴──────────────┐
         │ Product Agent  │    │ Growth Agent  │    │ Finance Agent  │
         │ (gemini-flash) │    │ (gemini-flash)│    │ (gemini-flash) │
         └────────────┬───┘    └──────┬────────┘    └─┴──────────────┘
                      │               │               │
                      └───────────────┼───────────────┘
                                      ▼
               ┌──────────────────────────────────────────────┐
               │         Deterministic ADK Tools              │
               │ generate_mvp_spec(), build_gtm_launch_plan() │
               │ calculate_bootstrap_runway(), checklist()    │
               └──────────────────────┬───────────────────────┘
                                      │ Action Flags
                                      ▼
               ┌──────────────────────────────────────────────┐
               │   Human Approval Queue (HITL Safety Gate)    │
               └──────────────────────────────────────────────┘
```

---

### Agent Roster & Tool Matrix

| Executive Agent       | Core Model         | Primary ADK Tool                     | Primary Deliverable                                     |
| :-------------------- | :----------------- | :----------------------------------- | :------------------------------------------------------ |
| **CEO Planner Agent** | `gemini-2.5-pro`   | `analyze_and_route_workflow()`       | 30-Day Orchestrated Executive Blueprint                 |
| **Product Agent**     | `gemini-2.5-flash` | `generate_mvp_spec()`                | 14-Day Scoped MVP Features & Recommended Tech Stack     |
| **Growth Agent**      | `gemini-2.5-flash` | `build_gtm_launch_plan()`            | Target ICP, Waitlist Copy & Outreach Sales Scripts      |
| **Finance Agent**     | `gemini-2.5-flash` | `calculate_bootstrap_runway()`       | Zero-Revenue Runway Months & Safe Spend Budget          |
| **Legal Agent**       | `gemini-2.5-flash` | `generate_incorporation_checklist()` | Founder Equity Split (4-Yr Vesting / 1-Yr Cliff) & NDAs |

---

## 📁 Repository Structure & API Reference

### Project Tree Layout

```text
FounderHq/
├── apps/
│   ├── api/                              # FastAPI Backend Application
│   │   ├── agents/
│   │   │   └── startup_team/
│   │   │       ├── agent.py              # Google ADK Sub-Agent Definitions & Tools
│   │   │       └── founder_engine.py     # Standalone Incubator CLI Pipeline
│   │   ├── app/
│   │   │   ├── api/v1/                   # FastAPI Endpoints (Planner, Agents, Approvals)
│   │   │   └── services/
│   │   │       └── planner_service.py    # Multi-Agent Workflow Engine & Context Extractor
│   │   ├── tests/                        # Pytest & Verification Test Suites
│   │   └── main.py                       # FastAPI Application Entry Point
│   └── web/                              # Next.js 14 Frontend Application
│       ├── app/                          # Next.js App Router (Dashboard, Agents, Workspace)
│       ├── components/                   # UI Components (Copilot, HeroMissionControl, Agents)
│       ├── hooks/                        # Custom React Hooks (useUserStartupMetrics)
│       └── providers/                    # Context Providers (AuthProvider)
├── founder_engine.py                     # Root CLI Execution Runner
├── PROJECT_INFO_README.md                # System Documentation
└── README.md                             # Monorepo Readme
```

---

### Quick Setup Guide

#### 1. Backend Setup (FastAPI & Google ADK)

```bash
# Navigate to the API directory
cd apps/api

# Create & activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI Development Server
uvicorn main:app --reload --port 8000
```

#### 2. Frontend Setup (Next.js 14)

```bash
# From project root, install monorepo dependencies
pnpm install

# Start the Next.js Development Server
pnpm --filter web dev
```

---

### API Reference

#### 1. Real-Time Planner Execution Stream (SSE)

- **Endpoint:** `POST /api/v1/planner/stream`
- **Content-Type:** `text/event-stream`
- **Request Body:**
  ```json
  {
    "command": "i need to build an edutech study app",
    "startupId": "startup-001"
  }
  ```
- **Sample Event Stream Output:**
  ```text
  event: message
  data: {"event": "WORKFLOW_INITIATED", "selectedAgents": ["ProductAgent", "GrowthAgent", "FinanceAgent", "LegalAgent"]}

  event: message
  data: {"event": "AGENT_STEP", "agentName": "Product Executive Agent", "summary": "Scoped V1 MVP features", "status": "COMPLETED"}

  event: message
  data: {"event": "PLAN_COMPLETED", "executionId": "exec-98213", "status": "COMPLETED"}
  ```

#### 2. Get Executive Agents Info

- **Endpoint:** `GET /api/v1/agents/info`
- **Response:**
  ```json
  {
    "agents": [
      {
        "id": "ceo",
        "name": "CEO Planner Agent",
        "role": "Chief Executive Officer",
        "model": "gemini-2.5-pro",
        "status": "ONLINE"
      }
    ]
  }
  ```

---

### CLI Test Execution Command

You can run the full multi-agent incubator pipeline directly from your terminal:

```bash
python founder_engine.py
```

---

<div align="center">

_Built with ❤️ for 0-to-1 Founders using Google ADK & Gemini 2.5._

</div>
