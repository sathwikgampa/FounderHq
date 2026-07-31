# FounderHQ – AI Operating System for Startups

FounderHQ is an enterprise-grade AI Operating System designed to empower startup founders with an intelligent CEO Planner and specialized agentic sub-systems. 

This repository houses the production-grade engineering foundation built using **Next.js 15**, **FastAPI**, **Firebase**, and **Google Gemini** architecture principles.

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
└── tests/             # End-to-end and Integration tests
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Python >= 3.12

### Installation & Setup

1. **Clone & Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Backend Setup**
   ```bash
   cd apps/api
   python -m venv .venv
   
   # On Windows:
   .venv\Scripts\activate
   # On Mac/Linux:
   # source .venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Environment Configuration**
   Copy the sample environment files and configure your access keys:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   cp apps/api/.env.example apps/api/.env
   ```

4. **Run Development Servers**
   ```bash
   # Run full stack monorepo (Web + API)
   pnpm dev
   ```

   - **Frontend UI**: `http://localhost:3000`
   - **FastAPI Server**: `http://localhost:8000`
   - **API Documentation**: `http://localhost:8000/docs` (Swagger UI)

---

## 📚 Core Documentation

- [Architecture Guide](./docs/Architecture.md)
- [Development Setup](./docs/Development.md)
- [Folder Structure Map](./docs/FolderStructure.md)
- [Contribution Guidelines](./docs/Contribution.md)
- [Setup & Deployment Guide](./docs/Setup.md)

---

## 🛠️ Code Quality & Testing

- **Linting & Formatting**: `pnpm lint` / `pnpm format`
- **Type Checking**: `pnpm typecheck`
- **Unit Tests**: `pnpm test`
- **E2E Tests**: `pnpm test:e2e`

---

## 🔒 Security & Standards

- Strict Environment Variable Validation (Zod on Web, Pydantic BaseSettings on API)
- Firebase JWT Verification, RBAC, and Workspace Isolation Middlewares
- Strict Security Headers & CORS Policy
