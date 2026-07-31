# FounderHQ -- Database Design (Firebase)

> **Document ID:** 04_DATABASE_DESIGN\
> **Version:** 1.0\
> **Database:** Firebase Firestore + Firebase Authentication + Firebase
> Storage + Cloud Functions

---

# 1. Purpose

This document defines the canonical Firebase data model for FounderHQ.

FounderHQ uses **Cloud Firestore** as the primary database because it
provides:

- Real-time updates
- Flexible document model
- Offline support
- Security Rules
- Easy integration with Cloud Functions
- Fast iteration for MVP

---

# 2. Firebase Services

Service Purpose

---

Firebase Authentication User login
Cloud Firestore Primary database
Firebase Storage Uploaded documents
Cloud Functions AI orchestration & background jobs
Firebase Hosting Web deployment
Firebase Cloud Messaging Notifications
Firebase App Check API protection

---

# 3. Firestore Collections

```text
users/
workspaces/
startups/
documents/
knowledge_chunks/
commands/
executions/
tasks/
approvals/
notifications/
activities/
health_scores/
agent_outputs/
integrations/
settings/
```

---

# 4. Collection Design

## users/{userId}

```json
{
  "name": "",
  "email": "",
  "photoURL": "",
  "language": "en",
  "createdAt": "",
  "lastLogin": "",
  "workspaceIds": []
}
```

---

## workspaces/{workspaceId}

Supports future multi-founder teams.

```json
{
  "name": "FounderHQ",
  "ownerId": "",
  "memberIds": [],
  "createdAt": ""
}
```

---

## startups/{startupId}

```json
{
  "workspaceId": "",
  "mode": "new|existing",
  "name": "",
  "industry": "",
  "businessModel": "",
  "targetAudience": "",
  "teamSize": 2,
  "stage": "Idea",
  "revenue": 0,
  "burnRate": 0,
  "runwayMonths": 12,
  "fundingRaised": 0,
  "status": "active",
  "createdAt": ""
}
```

---

## documents/{documentId}

Metadata only.

Actual files stored in Firebase Storage.

```json
{
  "startupId": "",
  "type": "Pitch Deck",
  "storagePath": "documents/file.pdf",
  "uploadedBy": "",
  "status": "indexed",
  "createdAt": ""
}
```

---

## knowledge_chunks/{chunkId}

Stores RAG chunks.

```json
{
  "documentId": "",
  "startupId": "",
  "text": "",
  "embeddingId": "",
  "page": 1,
  "language": "en"
}
```

---

## commands/{commandId}

Founder requests.

```json
{
  "startupId": "",
  "command": "Launch MVP",
  "status": "completed",
  "plannerSummary": "",
  "createdAt": ""
}
```

---

## executions/{executionId}

Planner execution instance.

```json
{
  "commandId": "",
  "activeAgents": ["finance", "growth"],
  "status": "running",
  "approvalRequired": true
}
```

---

## tasks/{taskId}

```json
{
  "executionId": "",
  "agent": "finance",
  "title": "Check runway",
  "status": "completed",
  "priority": "high"
}
```

---

## approvals/{approvalId}

```json
{
  "executionId": "",
  "type": "Hiring",
  "status": "pending",
  "decision": "",
  "approvedBy": "",
  "updatedAt": ""
}
```

---

## agent_outputs/{outputId}

```json
{
  "executionId": "",
  "agent": "growth",
  "summary": "",
  "confidence": 0.91,
  "references": []
}
```

---

## health_scores/{scoreId}

```json
{
  "startupId": "",
  "overall": 83,
  "finance": 92,
  "growth": 88,
  "hiring": 71,
  "operations": 82,
  "createdAt": ""
}
```

---

## activities/{activityId}

Timeline.

```json
{
  "startupId": "",
  "title": "Campaign approved",
  "actor": "CEO Planner",
  "timestamp": ""
}
```

---

## notifications/{notificationId}

```json
{
  "startupId": "",
  "type": "approval",
  "message": "",
  "read": false,
  "createdAt": ""
}
```

---

## integrations/{integrationId}

```json
{
  "startupId": "",
  "provider": "google_drive",
  "connected": true,
  "metadata": {}
}
```

---

## settings/{settingId}

User preferences.

```json
{
  "startupId": "",
  "theme": "dark",
  "language": "en"
}
```

---

# 5. Storage Structure

```text
storage/
 documents/
 avatars/
 exports/
 generated/
```

---

# 6. Relationships

```text
Workspace
   │
   ├── Users
   └── Startups
          │
          ├── Documents
          ├── Commands
          ├── Activities
          ├── Notifications
          ├── Health Scores
          └── Integrations

Commands
    │
    └── Executions
            │
            ├── Tasks
            ├── Agent Outputs
            └── Approvals
```

---

# 7. Security Rules Principles

- Users access only their workspace.
- Startup data isolated by workspaceId.
- Documents require authentication.
- Storage paths validated.
- Cloud Functions perform privileged writes.
- Client never writes health scores directly.

---

# 8. Index Strategy

Create composite indexes for:

- startupId + createdAt
- workspaceId + createdAt
- executionId + status
- notification read + createdAt
- command status + createdAt

---

# 9. Cloud Functions

Functions:

- plannerTrigger
- generateTasks
- updateHealthScore
- processDocument
- createEmbeddings
- notifyFounder
- approvalWorkflow

---

# 10. Firebase Architecture

```text
React App
    │
Firebase Auth
    │
Cloud Firestore
    │
Cloud Functions
    │
CEO Planner
    │
Executive Agents
    │
RAG Engine
    │
Firestore Updates
```

---

# 11. Engineering Rules

- Firestore is the source of truth.
- Documents live in Storage; metadata lives in Firestore.
- Every command creates an execution.
- Every execution creates tasks.
- Agent outputs are immutable after completion.
- Health score updates only through Cloud Functions.
- All timestamps use Firebase server timestamps.
- Use batched writes or transactions for approval workflows.
- Prefer subcollections only when data is tightly coupled; otherwise
  use top-level collections for scalable querying.

---

# 12. Future Expansion

- Vector database integration
- BigQuery analytics
- Multi-workspace organizations
- Audit logs
- AI memory snapshots
- Offline synchronization improvements

This schema is the canonical Firebase database design for FounderHQ MVP.
