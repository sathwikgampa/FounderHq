# `/apps` Directory

## Overview

The `/apps` directory contains the runnable applications of the FounderHQ monorepo platform.

## Applications Included

- **`web`** (`/apps/web` or `/frontend`): Next.js 15 App Router client UI application.
- **`api`** (`/apps/api` or `/backend`): FastAPI high-performance Python backend server.

## Directives

1. Applications must remain decoupled and import shared functionality from `/packages`.
2. No direct cross-application imports (e.g., `apps/web` must not import from `apps/api` source directly; communication happens via HTTP/WebSocket API contracts).
