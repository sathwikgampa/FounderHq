# FounderHQ – AI Operating System for Startups

FounderHQ is an enterprise-grade AI Operating System designed to empower startup founders with an intelligent CEO Planner and specialized agentic sub-systems. 

This document serves as the comprehensive repository guide detailing the product vision, the chosen technology stack, and the exact architectural implementation strategies we employed.

---

## 🚀 What is our project about?

**FounderHQ** is a comprehensive software-as-a-service (SaaS) platform built to act as the ultimate "Co-Founder" for ambitious entrepreneurs. At its core, the project solves the problem of founder burnout and operational fragmentation by providing a localized, intelligent operating system.

Instead of navigating between a dozen fractured tools (spreadsheets for finance, Trello for tasks, Notion for documentation), FounderHQ centralizes startup operations into a sleek, dark-themed dashboard. 
- **The Core Value Proposition:** The platform features specialized AI "Executive Agents" (Finance, HR, Growth, Legal, Sales) powered by Large Language Models. These agents intelligently process unstructured prompts into structural workflows.
- **The Interface:** A premium, Next.js dashboard featuring a dynamic Floating Sidebar, responsive agent grids, interactive Kanbans, and interactive multi-agent chat environments.
- **The Goal:** To reduce the operational drag of early-stage startups and give founders institutional-grade workflows out-of-the-box.

---

## 🛠️ What have we used to implement this? 

We engineered FounderHQ utilizing a highly modern, production-grade tech stack decoupled across a full-stack monorepo framework:

### 1. Frontend Ecosystem (Client & Interface)
- **Framework:** Next.js 15 (App Router) with React 19 for rapid server-side rendering and streamlined API handling.
- **Styling:** Tailwind CSS integrated with Shadcn/UI for a beautiful, raw, and composable component library.
- **Motion/Animations:** Framer Motion for buttery-smooth micro-interactions, layout transitions, and hovering glow effects. 
- **State & Hooks:** Context API (Auth), custom React hooks, and native standard DOM manipulation.
- **Icons & Graphics:** Lucide-React and custom SVG inline mapping.

### 2. Backend Ecosystem (Logic & APIs)
- **Framework:** FastAPI (Python 3.12) ensuring ultra-fast execution, robust Pydantic data validation, and automated OpenAPI documentation.
- **Authentication:** Google Firebase Admin SDK handles core JWT token ingestion and verifies the security of REST interactions.
- **AI Integration:** Google Gemini LLM API acts as the cognitive engine empowering our executive AI agent classes.
- **Architecture Validation:** Zod and Pydantic ensuring safe data transit boundaries.

### 3. Project Management
- **Monorepo Architecture:** Powered by **Turborepo** and `pnpm` to safely manage disjointed microservices (web/api) under one holistic repository loop.

---

## 📐 How did we implement this?

The execution of FounderHQ was methodically divided into modular, scalable milestones to maintain high performance across both frontend interactions and backend API responses.

### Phase 1: Structuring the Monorepo
We began by scaffolding a `Turborepo` foundation explicitly carving out two operational domains:
- `/apps/web` (The Next.js Frontend ecosystem)
- `/apps/api` (The FastAPI Python backend ecosystem)
This decoupled strategy allows the frontend and backend to scale independently, share Type/Schema definitions via local `packages/`, and deploy on different cloud boundaries smoothly.

### Phase 2: Building the Presentation Layer
We implemented the interface visually iterating towards a premium, dark-mode focused aesthetic:
- **Navigation:** Abandoned static sidebars in favor of a dynamic `floating-sidebar.tsx` utilizing interactive `AgentNavGroup` hooks handling deep nested recursive lists mapped perfectly to App Router folder paths.
- **Dynamic Dashboards:** Implemented asynchronous dashboard feeds mapping grid items using raw React state to inject highly-engaging motion boundaries (`GlowCard`, etc).
- **Authentication Wall:** Engineered a custom `/login` split-pane UI. The layout routes secure Google Firebase interactions via standard React forms and handles `isSignUp` logic conditionally exposing payload arrays. This seamlessly ties into our global Next.js `<ProtectedRoute>` layouts, intercepting unauthenticated attempts.

### Phase 3: Empowering the API Context
The backend implementation follows a strict **Clean Architecture** pattern in Python:
- **Separation of Concerns:** Our `api` directory routes requests through strict Middleware (for extracting and decoding JWT Firebase tokens) into abstract Service layers (`services/planner_service.py`), keeping routers exceptionally declarative.
- **Agent Framework:** We mapped bespoke logic endpoints designed strictly to synthesize the LLM logic routing for specialized features (Operations, Finance, Legal, etc.).

### Phase 4: CI/CD & Formatting Standardization
To ensure production reliability:
- Configured local `.prettierrc`, ESLint config bundles, and Python `ruff` linters natively wired into husky git hooks ensuring code safety.
- Handled precise GitHub merge conflict resolutions natively maintaining perfect code parity via explicit `git rebase` pipelines.

---

## 🏃 Deployment & Quick Start

You can hot-boot the entire ecosystem on your local machine instantly:

```bash
# 1. Install Workspace Dependencies
pnpm install

# 2. Fire up the Next.js Frontend and FastAPI servers simultaneously
pnpm dev
```
- **Web App**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000/docs`

> *FounderHQ represents a fusion of modern deterministic SaaS architectures with the untethered intelligence of autonomous AI frameworks.*
