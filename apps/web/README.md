# FounderHQ Web Application (`apps/web`)

## Overview

Next.js 15 App Router web client for FounderHQ built with React 19, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui, and Firebase Auth/Firestore wrappers.

## Feature-Based Folder Organization

The application scales to 1000+ components using a **feature-sliced layout**:

- `app/`: Next.js routes, layouts, server components.
- `components/ui/`: Atomic shadcn UI primitives (Button, Dialog, Card, Input, Toast).
- `components/common/`: Shared layout wrappers, error boundaries, skeletons.
- `features/`: Feature modules containing domain logic, components, state hooks, and API services:
  - `features/auth/`
  - `features/dashboard/`
  - `features/planner/`
  - `features/settings/`
  - `features/workspace/`
- `providers/`: Top-level application context providers.
- `lib/`: Utility functions, Zod runtime environment validation, and Firebase client SDK initialization.
