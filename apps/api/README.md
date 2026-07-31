# FounderHQ Backend API (`apps/api`)

## Overview

FastAPI production backend for FounderHQ implementing Clean Architecture, Dependency Injection, Repository Pattern, Firebase Admin SDK integration, and Google ADK agent framework modules.

## Architectural Layout

- `app/api/`: Versioned API routers (`/v1/health`, `/v1/auth`, `/v1/workspace`, `/v1/planner`).
- `app/core/`: Configuration (Pydantic BaseSettings), structured logging, and custom exception handling.
- `app/middleware/`: Security headers, CORS, JWT auth, RBAC, multi-tenant workspace context, and rate limiting placeholders.
- `app/models/`: Domain entity models.
- `app/repositories/`: Data persistence abstractions (Repository Pattern).
- `app/schemas/`: Pydantic v2 DTO schemas.
- `app/services/`: Service layer containing business workflow execution logic.
- `app/integrations/firebase/`: Firebase Admin SDK wrappers (Auth, Firestore, Storage, App Check).
- `app/ai/`: Google ADK AI agent layer placeholders.
