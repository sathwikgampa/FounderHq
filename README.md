# FounderHQ — AI Operating System for Startups

FounderHQ is an enterprise-grade AI Operating System designed to empower startup founders with an intelligent CEO Planner and specialized agentic sub-systems.

This repository houses the **production-grade engineering foundation** built using Next.js 15, FastAPI, Firebase, and Google ADK architecture principles.

---

## 🏗️ Architecture Overview

The system is structured as a scalable monorepo using `pnpm` and `Turborepo`:

```text
FounderHQ/
├── apps/
│   ├── web/           # Next.js 15 App Router Frontend
│   └── api/           # FastAPI Python 3.12 Backend
├── packages/
│   ├── ui/            # Shared shadcn/ui components & Tailwind theme
│   ├── types/         # Shared TypeScript interfaces & DTO contracts
│   ├── shared/        # Common utilities & validation helpers
│   └── config/        # Shared linter & build presets
├── docs/              # Architectural & Engineering Specifications
├── scripts/           # Automation & environment bootstrap scripts
├── tests/             # End-to-end (Playwright) and Integration tests
└── config/            # Firebase security rules & emulator configs
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Python >= 3.12
- Docker & Docker Compose (optional for local containers)

### Installation & Setup

1. **Clone & Install Dependencies**

   ```bash
   pnpm install
   ```

2. **Backend Setup**

   ```bash
   cd apps/api
   python -m venv .venv
   # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Environment Configuration**
   Copy sample environment files:

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   cp apps/api/.env.example apps/api/.env
   ```

4. **Run Development Servers**
   ```bash
   # Run full stack monorepo (Web + API)
   pnpm dev
   ```

- Frontend UI: `http://localhost:3000`
- FastAPI Server: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs` (Swagger UI)

---

## 📚 Core Documentation

- 📖 [Architecture Guide](file:///c:/project-self-1/FounderHQ/docs/Architecture.md)
- 🛠️ [Development Setup](file:///c:/project-self-1/FounderHQ/docs/Development.md)
- 📂 [Folder Structure Map](file:///c:/project-self-1/FounderHQ/docs/FolderStructure.md)
- 🤝 [Contribution Guidelines](file:///c:/project-self-1/FounderHQ/docs/Contribution.md)
- ⚙️ [Setup & Deployment Guide](file:///c:/project-self-1/FounderHQ/docs/Setup.md)

---

## 🛡️ Code Quality & Testing

- **Linting & Formatting**: `pnpm lint` / `pnpm format`
- **Type Checking**: `pnpm typecheck`
- **Frontend Unit Tests**: `pnpm --filter web test`
- **Backend Tests**: `pytest`
- **E2E Tests**: `pnpm test:e2e`

---

## 🔒 Security & Standards

- Strict Environment Variable Validation (Zod on Web, Pydantic BaseSettings on API)
- Firebase JWT Verification, RBAC, and Workspace Isolation Middlewares
- Strict Security Headers & CORS Policy
