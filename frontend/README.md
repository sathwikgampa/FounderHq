# `/frontend` Directory

## Overview

`/frontend` serves as the primary root reference to the FounderHQ Next.js 15 web application located at `apps/web`.

## Tech Stack

- Next.js 15 (App Router)
- React 19 & TypeScript (Strict Mode)
- Tailwind CSS & shadcn/ui
- Framer Motion
- TanStack Query v5
- Zod & React Hook Form

## Folder Structure

- `app/`: Next.js App Router routes, layouts, and error boundaries.
- `components/`: UI components (shadcn primitives, feature components, feedback skeletons).
- `features/`: Feature-sliced domain modules (auth, dashboard, planner, settings, etc.).
- `hooks/`: Custom React hooks.
- `lib/`: Utilities, env validation, and Firebase client initialization.
- `providers/`: Application context providers (Auth, Theme, Toast, Query, Dialog, Modal).
- `services/`: API client services for backend interaction.

## Getting Started

```bash
pnpm --filter web dev
```
