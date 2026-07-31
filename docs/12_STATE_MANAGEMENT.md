# FounderHQ -- State Management

> **Document ID:** 12_STATE_MANAGEMENT\
> **Version:** 1.0\
> **Depends On:** Documents 01--11

---

# 1. Purpose

This document defines the official state management strategy for
FounderHQ.

The application follows a **server-first architecture**, where Firebase
and FastAPI are the source of truth. Client-side state exists only to
improve responsiveness and user experience.

---

# 2. State Management Principles

- Server is the source of truth.
- Minimize global client state.
- Cache server data intelligently.
- Separate UI state from business state.
- Stream AI updates instead of polling where possible.
- Never duplicate persistent data unnecessarily.

---

# 3. State Categories

```text
Application State
│
├── Authentication State
├── Workspace State
├── Startup State
├── Planner Execution State
├── Notifications State
├── Settings State
├── UI State
└── Cached Server State
```

---

# 4. Technology Stack

## Global State

- React Context (lightweight global state)

## Server State

- TanStack Query

## Forms

- React Hook Form

## Validation

- Zod

## Backend Source

- FastAPI + Firestore

---

# 5. Authentication State

Managed by:

- Firebase Authentication
- React Context

Stored Values

```text
User
Workspace
Permissions
Firebase Token
```

Authentication refresh should happen automatically.

---

# 6. Workspace State

Contains

- Current workspace
- Startup selection
- User role
- Team members

Changes trigger refetch of startup-scoped data.

---

# 7. Startup State

Contains

- Startup profile
- Stage
- Health score
- Integrations
- Documents
- Current metrics

Fetched using TanStack Query.

---

# 8. Planner Execution State

Tracks the active AI workflow.

```text
Idle
 ↓
Planning
 ↓
Consulting Agents
 ↓
Approval Required
 ↓
Executing
 ↓
Completed
```

The frontend should display progress in real time.

---

# 9. Streaming State

Planner responses may stream.

States:

- Connecting
- Receiving
- Complete
- Error

Streaming updates should append progressively without replacing previous
content.

---

# 10. Notification State

Contains

- Unread count
- Notification list
- Read status

Updates

- Real-time when possible
- Query invalidation after mutations

---

# 11. Dashboard State

Widgets

- Startup Health
- Executive Cards
- Timeline
- Planner
- Notifications

Each widget should query independently to reduce unnecessary rerenders.

---

# 12. Settings State

Includes

- Theme
- Language
- Workspace preferences
- Connected integrations

Persisted to Firestore.

---

# 13. UI State

Examples

- Sidebar open/closed
- Dialog visibility
- Selected tab
- Loading indicators
- Toast messages

This state remains local to components where possible.

---

# 14. TanStack Query Strategy

Use queries for:

- Startup profile
- Documents
- Notifications
- Health score
- Timeline
- Executions

Use mutations for:

- Planner execution
- Uploads
- Approvals
- Settings updates

Invalidate only affected queries.

---

# 15. Cache Strategy

Recommended cache lifetimes:

Resource Cache

---

Startup profile Medium
Notifications Short
Health score Short
Settings Long
Documents Medium

Background refetch should occur when the window regains focus if
appropriate.

---

# 16. Optimistic Updates

Allowed for:

- Mark notification as read
- Update preferences
- Rename workspace

Not allowed for:

- Planner execution
- Health score
- Financial metrics
- Approval workflows

---

# 17. Error State

Every request should expose:

- Loading
- Success
- Empty
- Error

The UI should never remain in an indefinite loading state.

---

# 18. Offline Behavior

Supported:

- Cached reads
- Draft form persistence

Not supported (MVP):

- Offline AI execution
- Offline document uploads

---

# 19. Query Keys

Examples

```text
["startup", startupId]
["documents", startupId]
["notifications", workspaceId]
["health", startupId]
["timeline", startupId]
["execution", executionId]
```

Use stable query keys throughout the application.

---

# 20. State Lifecycle

```text
User Action
    │
Mutation
    │
FastAPI
    │
Firestore
    │
Response
    │
Query Invalidation
    │
UI Refresh
```

---

# 21. Performance Guidelines

- Lazy-load dashboard modules.
- Avoid unnecessary global state.
- Memoize expensive UI components.
- Stream long-running planner executions.
- Keep React Context small.

---

# 22. Canonical Rules

- Firebase and FastAPI are the source of truth.
- TanStack Query manages server state.
- React Context stores lightweight global state only.
- Local component state should remain local.
- UI state must never contain business logic.
- Planner execution state is streamed whenever possible.
- Cache invalidation must be targeted and predictable.

This document defines the official state management strategy for all
FounderHQ clients.
