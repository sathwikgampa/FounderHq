# `/backend` Directory

## Overview

`/backend` serves as the primary root reference to the FounderHQ FastAPI backend application located at `apps/api`.

## Tech Stack

- Python 3.12
- FastAPI & Uvicorn
- Pydantic v2
- Firebase Admin SDK (Auth, Firestore, Storage, App Check)
- Google ADK Architecture (AI Layer Placeholders)

## Architectural Layers (Clean Architecture)

- **`app/api/`**: API Version routers (`/v1/`).
- **`app/core/`**: Core app configuration, settings validation, and structured logging.
- **`app/middleware/`**: JWT auth, RBAC, multi-tenant workspace context, rate limiting, and security headers.
- **`app/repositories/`**: Data persistence abstraction (Repository Pattern).
- **`app/services/`**: Business logic service layer.
- **`app/ai/`**: Google ADK agent framework placeholders (Planner, Finance, Growth, Talent, Operations, Legal, Investment, Memory, Retriever).
- **`app/integrations/`**: Firebase and external third-party typed wrappers.

## Running Locally

```bash
cd apps/api
uvicorn app.main:app --reload --port 8000
```
