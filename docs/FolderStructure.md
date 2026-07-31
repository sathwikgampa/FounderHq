# FounderHQ Folder Structure Specification

```text
founderhq/
│
├── apps/
│   ├── web/                     # Next.js 15 App Router Frontend
│   │   ├── app/                 # Next.js App Router Pages & Layouts
│   │   ├── components/          # Reusable UI Primitives & Skeletons
│   │   ├── features/            # Feature-Sliced Modules
│   │   ├── hooks/               # Custom React Hooks
│   │   ├── lib/                 # Env validation, Firebase SDK client
│   │   ├── providers/           # App Context Providers (Auth, Theme, etc.)
│   │   └── services/            # Client API Services
│   │
│   └── api/                     # FastAPI Backend Application
│       ├── app/
│       │   ├── api/             # Routers (/v1/health, /v1/auth, etc.)
│       │   ├── core/            # Config, Logging, Exceptions
│       │   ├── middleware/      # JWT, RBAC, Workspace, RateLimiter
│       │   ├── models/          # Domain Entities
│       │   ├── repositories/    # Repository Layer Abstractions
│       │   ├── schemas/         # Pydantic v2 DTO Schemas
│       │   ├── services/        # Service Layer Logic
│       │   └── main.py          # FastAPI Application Entrypoint
│       │
│       ├── app/ai/              # Google ADK Agent System Placeholders
│       │   ├── planner/         # CEO Planner AI
│       │   ├── finance/         # Finance Agent
│       │   ├── growth/          # Growth Agent
│       │   ├── talent/          # Talent Agent
│       │   ├── operations/      # Operations Agent
│       │   ├── legal/           # Legal Agent
│       │   ├── investment/      # Investment Agent
│       │   ├── memory/          # Startup Memory System
│       │   ├── retriever/       # RAG Vector Search
│       │   ├── prompts/         # Prompt Templates
│       │   ├── schemas/         # AI Tool Pydantic Schemas
│       │   └── evaluators/      # Agent Benchmarking
│       └── tests/               # Backend Pytest Suite
│
├── packages/
│   ├── ui/                      # Shared Tailwind & shadcn UI primitives
│   ├── types/                   # Cross-monorepo TypeScript types
│   ├── shared/                  # Common JavaScript/TypeScript utilities
│   └── config/                  # Shared tooling configurations
│
├── docs/                        # Engineering Specifications & Manuals
├── scripts/                     # Environment Bootstrap & Health Scripts
├── tests/                       # Monorepo E2E Playwright Tests
├── config/                      # Firebase Rules & Local Emulator Specs
├── .github/workflows/           # CI/CD Workflows
└── docker-compose.yml           # Local Multi-Container Services
```
