<div align="center">

# 🚀 FounderHQ — AI Startup Incubator OS

### _An Enterprise Multi-Agent Operating System for 0-to-1 Founders_

<br />

<p align="center">
  <img src="https://img.shields.io/badge/Google_ADK-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google ADK" />
  <img src="https://img.shields.io/badge/Gemini_2.5-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini 2.5" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/Python_3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.11+" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase_Auth-DD2C00?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase Auth" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="MIT License" />
</p>

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

## 🛠️ Technology Stack & Architectural Rationale

FounderHQ was built using a curated, battle-tested stack. Every framework and tool was deliberately chosen to meet strict enterprise requirements: real-time streaming, high-throughput multi-agent execution, type safety, and premium user experience.

|                                        Icon                                         | Layer                 | Technology Chosen                      | What It Does in FounderHQ                                                                             | Architectural Rationale (Why This Choice?)                                                                                                         |
| :---------------------------------------------------------------------------------: | :-------------------- | :------------------------------------- | :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
|   <img src="https://cdn.simpleicons.org/google/4285F4" width="22" height="22" />    | **Agent Framework**   | **Google ADK & Gemini 2.5**            | Multi-agent orchestration, CEO routing (`gemini-2.5-pro`) & sub-agent execution (`gemini-2.5-flash`). | **1M+ token context window**, native tool calling, structured JSON output, and sub-second reasoning speed for complex executive workflows.         |
|   <img src="https://cdn.simpleicons.org/fastapi/009688" width="22" height="22" />   | **Backend API**       | **FastAPI (Python 3.11+)**             | High-speed REST API gateway, business logic, RAG vector pipeline & SSE event streaming.               | **Asynchronous ASGI throughput**, automatic OpenAPI generation, native Pydantic validation, and seamless integration with AI/ML Python libraries.  |
|   <img src="https://cdn.simpleicons.org/python/3776AB" width="22" height="22" />    | **Real-Time Stream**  | **SSE-Starlette (Server-Sent Events)** | Streams live agent thought traces, tool execution steps, and blueprints line-by-line to the client.   | **Lightweight unidirectional HTTP streaming** without the heavy connection overhead, stateful reconnects, and socket complexity of WebSockets.     |
|  <img src="https://cdn.simpleicons.org/nextdotjs/000000" width="22" height="22" />  | **Frontend Core**     | **Next.js 14 (App Router & React 18)** | Executive Mission Control UI, Copilot command bar, Agent explorer, and metric management.             | **App Router architecture**, Server Components for instant initial load, smooth client-side hydration, and native Vercel deployment optimizations. |
| <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" width="22" height="22" /> | **Styling & Icons**   | **Tailwind CSS & Lucide React**        | Enterprise glassmorphism styling, responsive KPI grids, and crisp SVG icons.                          | **Utility-first styling** enables rapid customization of modern dark/light themes without CSS bundle bloat or runtime style recalculations.        |
|  <img src="https://cdn.simpleicons.org/pydantic/E92063" width="22" height="22" />   | **Data Validation**   | **Pydantic v2**                        | Strict schema validation for request payloads, agent tool signatures, and response models.            | **Rust-backed validation engine** for maximum speed, preventing malformed tool arguments or invalid payload states before execution.               |
|  <img src="https://cdn.simpleicons.org/firebase/DD2C00" width="22" height="22" />   | **Auth & Security**   | **Firebase Auth**                      | Google OAuth popup login & session token handling with local fallback support.                        | **Production-grade Google OAuth integration**, seamless token verification, and domain whitelist authorization support.                            |
|   <img src="https://cdn.simpleicons.org/pytest/0A9EDC" width="22" height="22" />    | **Testing & Quality** | **Pytest & TestClient**                | End-to-end API verification suite testing all 15+ backend routes and tool contracts.                  | **Blazing fast parallel test execution**, easy fixture mocking for AI tools, and strict CI/CD gate checks to ensure zero-regression releases.      |

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

|                                      SVG                                       | Executive Agent       | Core Model         | Primary ADK Tool                     | Primary Deliverable                                     |
| :----------------------------------------------------------------------------: | :-------------------- | :----------------- | :----------------------------------- | :------------------------------------------------------ |
| <img src="https://cdn.simpleicons.org/google/4285F4" width="18" height="18" /> | **CEO Planner Agent** | `gemini-2.5-pro`   | `analyze_and_route_workflow()`       | 30-Day Orchestrated Executive Blueprint                 |
| <img src="https://cdn.simpleicons.org/google/34A853" width="18" height="18" /> | **Product Agent**     | `gemini-2.5-flash` | `generate_mvp_spec()`                | 14-Day Scoped MVP Features & Recommended Tech Stack     |
| <img src="https://cdn.simpleicons.org/google/FBBC05" width="18" height="18" /> | **Growth Agent**      | `gemini-2.5-flash` | `build_gtm_launch_plan()`            | Target ICP, Waitlist Copy & Outreach Sales Scripts      |
| <img src="https://cdn.simpleicons.org/google/EA4335" width="18" height="18" /> | **Finance Agent**     | `gemini-2.5-flash` | `calculate_bootstrap_runway()`       | Zero-Revenue Runway Months & Safe Spend Budget          |
| <img src="https://cdn.simpleicons.org/google/8E75B2" width="18" height="18" /> | **Legal Agent**       | `gemini-2.5-flash` | `generate_incorporation_checklist()` | Founder Equity Split (4-Yr Vesting / 1-Yr Cliff) & NDAs |

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
