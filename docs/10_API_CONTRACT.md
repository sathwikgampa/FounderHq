# FounderHQ -- API Contract

> **Document ID:** 10_API_CONTRACT\
> **Version:** 1.0\
> **Depends On:** Documents 01--09

---

# 1. Purpose

This document defines the API contract between the Next.js frontend and
the FastAPI backend.

The frontend **never communicates directly** with Google ADK, Gemini, or
Firestore for business operations. All business workflows pass through
FastAPI.

---

# 2. API Principles

- REST-first
- JSON request/response
- Versioned endpoints (`/api/v1`)
- JWT/Firebase token authentication
- Consistent error format
- Streaming support for AI responses

---

# 3. Architecture

```text
Next.js
   │
HTTPS
   │
FastAPI (/api/v1)
   │
CEO Planner
   │
Executive Agents
   │
Firebase + RAG
```

---

# 4. Authentication

Every protected request includes:

```http
Authorization: Bearer <Firebase_ID_Token>
```

FastAPI validates the token using Firebase Admin SDK.

---

# 5. Standard Response

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed",
  "requestId": "uuid"
}
```

---

# 6. Standard Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request"
  },
  "requestId": "uuid"
}
```

---

# 7. Endpoint Groups

## Auth

Method Endpoint Purpose

---

GET /api/v1/auth/me Current user

## Startups

Method Endpoint

---

POST /api/v1/startups
GET /api/v1/startups/{id}
PATCH /api/v1/startups/{id}

## Documents

Method Endpoint

---

POST /api/v1/documents/upload
GET /api/v1/documents/{id}
DELETE /api/v1/documents/{id}

Upload returns a Firebase Storage path and indexing status.

## Planner

Method Endpoint Purpose

---

POST /api/v1/planner/execute Execute founder command
GET /api/v1/planner/executions/{id} Execution status

Example request:

```json
{
  "startupId": "...",
  "command": "Hire two backend engineers"
}
```

## Approvals

- GET /api/v1/approvals
- POST /api/v1/approvals/{id}/approve
- POST /api/v1/approvals/{id}/reject

## Notifications

- GET /api/v1/notifications
- PATCH /api/v1/notifications/{id}/read

## Health

- GET /api/v1/health-score

## Settings

- GET /api/v1/settings
- PATCH /api/v1/settings

---

# 8. Streaming API

Planner execution may stream progress.

```text
Connecting
Reading Memory
Searching Knowledge
Consulting Finance
Consulting Growth
Building Plan
Complete
```

Streaming uses Server-Sent Events (SSE) initially. WebSockets may be
added later.

---

# 9. File Upload Flow

```text
Client
 ↓
FastAPI
 ↓
Firebase Storage
 ↓
Firestore Metadata
 ↓
RAG Processing
 ↓
Index Complete
```

---

# 10. Validation

Frontend: - Zod

Backend: - Pydantic

Validation occurs before AI execution.

---

# 11. Status Codes

    Code Meaning

---

     200 Success
     201 Created
     400 Validation error
     401 Unauthorized
     403 Forbidden
     404 Not found
     409 Conflict
     422 Invalid payload
     429 Rate limited
     500 Server error

---

# 12. API Versioning

Current:

```text
/api/v1
```

Future:

```text
/api/v2
```

Breaking changes require a new version.

---

# 13. Security

- HTTPS only
- Firebase ID token verification
- Rate limiting
- Input sanitization
- Workspace isolation
- Server-side authorization
- Secrets stored in environment variables

---

# 14. Observability

Every request logs:

- requestId
- userId
- workspaceId
- startupId
- latency
- endpoint
- executionId (if applicable)

---

# 15. Future APIs

- Voice API
- Calendar sync
- Gmail actions
- Slack integration
- GitHub integration
- Scheduled automation

---

# 16. Canonical Rules

- FastAPI is the only backend entry point.
- Google ADK is never exposed directly to clients.
- Firebase is accessed through backend services.
- Planner APIs orchestrate all executive agents.
- All APIs must remain backward compatible within a version.
