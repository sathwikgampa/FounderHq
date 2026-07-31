# FounderHQ -- User Flows

> **Document ID:** 11_USER_FLOWS\
> **Version:** 1.0\
> **Depends On:** Documents 01--10

---

# 1. Purpose

This document defines the canonical end-to-end user journeys for
FounderHQ. Every feature should implement these flows consistently.

---

# 2. Guiding Principles

- Founder interacts only with the CEO Planner.
- AI remains explainable.
- High-risk actions require approval.
- Every completed workflow updates Startup Memory and Activity
  Timeline.

---

# 3. Primary User Journeys

## Journey A -- New Startup

```text
Landing Page
    │
Sign In
    │
Create Workspace
    │
New Startup
    │
Business Idea
    │
Industry
    │
Business Model
    │
Budget & Timeline
    │
Generate Company Context
    │
Initialize Startup Memory
    │
Dashboard
```

Success Criteria: - Workspace created - Startup profile stored -
Dashboard available

---

## Journey B -- Existing Startup

```text
Landing Page
    │
Sign In
    │
Import Startup
    │
Upload Documents
    │
Connect Google Services (optional)
    │
RAG Indexing
    │
Startup Memory Initialization
    │
Dashboard
```

Documents may include: - Pitch deck - Financial reports - Roadmap -
Policies - Meeting notes

---

# 4. Dashboard Flow

```text
Dashboard
 ├── Startup Health
 ├── Notifications
 ├── Timeline
 ├── Executive Cards
 └── CEO Planner Command Box
```

The dashboard is the operational home screen after onboarding.

---

# 5. CEO Planner Flow

```text
Founder Command
      │
Intent Analysis
      │
Read Startup Memory
      │
Retrieve RAG Context
      │
Select Executive Agents
      │
Generate Execution Plan
      │
Approval (if needed)
      │
Persist Results
      │
Update Dashboard
```

---

# 6. Document Upload Flow

```text
Select Files
      │
Upload to Firebase Storage
      │
Create Firestore Metadata
      │
Parse
      │
Chunk
      │
Embedding
      │
Knowledge Indexed
```

Status: - Uploading - Processing - Indexed - Failed

---

# 7. Approval Flow

```text
Planner Recommendation
        │
Approval Required
        │
Founder Decision
 ┌──────┴──────┐
Approve      Reject
     │          │
 Execute     Revise Plan
```

---

# 8. Notification Flow

Events that create notifications:

- Approval requested
- Document indexed
- Health score changed
- Execution completed
- Integration failure

Users can: - View - Mark as read - Navigate to related resource

---

# 9. Startup Health Flow

```text
Execution Completed
      │
Metrics Updated
      │
Health Score Recalculated
      │
Persist History
      │
Refresh Dashboard
```

---

# 10. Timeline Flow

Every major event creates an activity entry.

Examples: - Startup created - Document uploaded - Approval granted -
Campaign launched - Hiring completed

---

# 11. Settings Flow

```text
Settings
   ├── Profile
   ├── Workspace
   ├── Language
   ├── Theme
   ├── Integrations
   └── Security
```

---

# 12. Error Recovery

If execution fails:

```text
Failure
   │
Log Error
   │
Preserve State
   │
Notify Founder
   │
Retry / Resume
```

Workflows should be resumable without data loss.

---

# 13. Logout Flow

```text
Open Menu
    │
Logout
    │
Invalidate Session
    │
Return to Landing Page
```

---

# 14. Future User Flows

- Voice conversations
- Scheduled executive reviews
- Multi-founder collaboration
- Investor workspace
- Mobile experience

---

# 15. UX Rules

- Minimize required clicks.
- Surface AI reasoning clearly.
- Keep founder informed of execution progress.
- Never execute high-impact actions silently.
- Preserve continuity across sessions.

---

# 16. Canonical Flow Summary

Flow Entry Exit

---

New Startup Landing Dashboard
Existing Startup Landing Dashboard
Planner Execution Command Box Updated Dashboard
Document Upload Dashboard Indexed Knowledge
Approval Notification Execution
Settings Dashboard Saved Preferences

This document is the reference for implementing FounderHQ user
experience across web and future clients.
