# FounderHQ -- Folder Structure

> **Document ID:** 06_FOLDER_STRUCTURE\
> **Version:** 1.0\
> **Depends On:** 01_PROJECT_BRIEF.md, 02_PRODUCT_REQUIREMENTS.md,
> 03_SYSTEM_ARCHITECTURE.md, 04_DATABASE_DESIGN.md, 05_TECH_STACK.md

---

# 1. Purpose

This document defines the official repository structure for FounderHQ.

The architecture separates concerns into:

- Frontend (Next.js)
- Backend (FastAPI)
- AI Layer (Google ADK)
- Firebase
- Shared Packages

The structure is designed to support both rapid MVP development and
long-term scalability.

---

# 2. Monorepo Structure

```text
founderhq/
│
├── apps/
│   ├── web/                  # Next.js frontend
│   └── api/                  # FastAPI backend
│
├── packages/
│   ├── shared/
│   ├── types/
│   ├── ui/
│   └── config/
│
├── docs/
│
├── scripts/
│
├── .github/
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

# 3. Frontend Structure (apps/web)

```text
web/
│
├── app/
│   ├── (marketing)/
│   ├── (dashboard)/
│   ├── onboarding/
│   ├── auth/
│   ├── api/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── agents/
│   ├── charts/
│   ├── forms/
│   ├── onboarding/
│   └── ui/
│
├── features/
│   ├── auth/
│   ├── onboarding/
│   ├── dashboard/
│   ├── planner/
│   ├── approvals/
│   ├── notifications/
│   ├── documents/
│   ├── startup-health/
│   └── settings/
│
├── hooks/
├── lib/
├── services/
├── styles/
├── public/
├── types/
└── middleware.ts
```

---

# 4. Backend Structure (apps/api)

```text
api/
│
├── app/
│   ├── api/
│   ├── core/
│   ├── config/
│   ├── dependencies/
│   ├── middleware/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── routers/
│   ├── utils/
│   └── main.py
│
├── agents/
├── rag/
├── memory/
├── integrations/
├── workers/
├── tests/
└── requirements.txt
```

---

# 5. Google ADK Structure

```text
agents/
│
├── ceo_planner/
│
├── finance/
│
├── talent/
│
├── growth/
│
├── operations/
│
├── legal/          # Future
│
├── investment/     # Future
│
└── shared/
```

Each agent contains:

```text
agent.py
prompt.py
tools.py
schemas.py
memory.py
```

---

# 6. RAG Module

```text
rag/
│
├── loaders/
├── parsers/
├── chunking/
├── embeddings/
├── retriever/
├── indexing/
├── ranking/
└── pipeline.py
```

Responsibilities

- Parse uploaded documents
- Generate chunks
- Create embeddings
- Retrieve relevant knowledge
- Supply grounded context to CEO Planner

---

# 7. Startup Memory Module

```text
memory/
│
├── long_term.py
├── short_term.py
├── history.py
├── decisions.py
├── health.py
└── manager.py
```

---

# 8. Firebase Integration

```text
integrations/firebase/
│
├── auth.py
├── firestore.py
├── storage.py
├── messaging.py
└── security.py
```

---

# 9. External Integrations

```text
integrations/
│
├── gmail/
├── drive/
├── calendar/
├── github/
├── slack/
└── stripe/
```

Each integration should expose:

- Client
- Service
- Schemas
- Utilities

---

# 10. Shared Packages

```text
packages/
│
├── ui/
│
├── shared/
│
├── config/
│
└── types/
```

Purpose

- Shared TypeScript types
- Shared constants
- Reusable UI components
- Environment configuration

---

# 11. API Routes

```text
/api/v1/

auth/

startup/

planner/

commands/

documents/

health/

approvals/

notifications/

settings/

integrations/
```

Guidelines

- RESTful naming
- Versioned APIs
- Stateless requests

---

# 12. Environment Files

Frontend

```text
apps/web/.env.local
```

Backend

```text
apps/api/.env
```

Examples

```text
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
GOOGLE_GENAI_API_KEY=
FIREBASE_SERVICE_ACCOUNT=
```

Secrets must never be committed.

---

# 13. Testing Structure

Frontend

```text
__tests__/
```

Backend

```text
tests/
```

Types

- Unit tests
- Integration tests
- API tests
- Agent tests
- RAG tests

---

# 14. Assets

```text
public/

icons/

images/

illustrations/

animations/

logos/
```

---

# 15. Documentation

```text
docs/

architecture/

database/

api/

agents/

prompts/

deployment/

security/
```

All engineering documentation resides here.

---

# 16. Deployment Files

```text
Dockerfile
docker-compose.yml
cloudbuild.yaml
vercel.json
```

---

# 17. Naming Conventions

Frontend

- PascalCase for components
- camelCase for hooks
- kebab-case for folders where appropriate

Backend

- snake_case for Python modules
- PascalCase for Pydantic models

Collections

- plural lowercase
- e.g., users, startups, commands

---

# 18. Repository Rules

- Feature-first organization
- No business logic in UI components
- All AI logic remains in backend
- CEO Planner is the only public AI interface
- Shared code belongs in packages
- All Firebase access goes through service layers
- Environment-specific logic must be isolated

---

# 19. Future Expansion

Reserved directories

```text
mobile/
desktop/
analytics/
marketplace/
plugins/
voice/
```

These should remain outside the MVP but the repository is structured to
accommodate them without major refactoring.

---

# 20. Canonical Repository Layout

FounderHQ officially adopts:

- Monorepo using pnpm workspaces
- Next.js App Router frontend
- FastAPI backend
- Google ADK agents
- Firebase platform
- Shared packages
- Documentation-first development

All future implementation should conform to this folder structure unless
superseded by an approved architecture revision.
