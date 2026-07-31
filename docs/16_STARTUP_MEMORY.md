# FounderHQ -- Startup Memory Architecture

> **Document ID:** 16_STARTUP_MEMORY\
> **Version:** 1.0\
> **Depends On:** Documents 01--15

---

# 1. Purpose

Startup Memory is FounderHQ's persistent cognition layer. It enables the
CEO Planner and executive agents to remember important company context,
decisions, goals, and historical events across sessions.

Unlike conversation history, Startup Memory is structured, durable, and
tied to a startup rather than a single chat.

---

# 2. Design Goals

- Preserve long-term organizational knowledge
- Maintain continuity across interactions
- Reduce repeated user input
- Support explainable AI decisions
- Keep memories isolated by workspace

---

# 3. Memory Types

```text
Startup Memory
│
├── Company Profile
├── Goals
├── Decisions
├── Conversations
├── Executions
├── Approvals
├── Metrics
├── Relationships
└── Preferences
```

---

# 4. Memory Layers

## Short-Term Memory

Lifetime: - Current planner execution - Current conversation - Temporary
reasoning context

Not persisted beyond execution unless promoted.

## Long-Term Memory

Persisted in Firestore:

- Company facts
- Strategic goals
- Decisions
- Preferences
- Execution history
- Health trends

---

# 5. Memory Lifecycle

```text
User Action
    │
Planner
    │
Evaluate Importance
 ┌────┴────┐
Discard  Persist
            │
Startup Memory
```

Only meaningful information is persisted.

---

# 6. Memory Categories

### Company Profile

- Industry
- Business model
- Stage
- Mission

### Goals

- Quarterly objectives
- Hiring goals
- Revenue targets

### Decisions

- Approved roadmap changes
- Pricing decisions
- Funding milestones

### Preferences

- Language
- Communication style
- Reporting cadence

---

# 7. Memory Schema (Example)

```json
{
  "memoryId": "",
  "startupId": "",
  "type": "decision",
  "title": "Approved hiring plan",
  "summary": "...",
  "createdAt": "...",
  "createdBy": "...",
  "tags": ["hiring", "approval"],
  "confidence": 1.0
}
```

---

# 8. Read Policy

Before reasoning, the CEO Planner should retrieve:

1.  Company profile
2.  Active goals
3.  Recent decisions
4.  Relevant approvals
5.  User preferences

Only relevant memories should be injected into prompts.

---

# 9. Write Policy

Persist when:

- Founder approves an action
- Strategy changes
- Goals are created or updated
- Important milestones occur
- Startup profile changes

Do not persist: - Chain-of-thought - Temporary tool outputs - Duplicate
events - Secrets or credentials

---

# 10. Memory Retrieval

Selection filters:

- Workspace
- Startup
- Memory type
- Tags
- Recency
- Relevance

Memory retrieval complements, but does not replace, RAG.

---

# 11. Interaction with RAG

```text
Founder Request
      │
Startup Memory
      │
RAG Retrieval
      │
Context Builder
      │
CEO Planner
```

Memory provides durable facts; RAG provides document evidence.

---

# 12. Versioning

Each memory entry should support:

- Created timestamp
- Last updated timestamp
- Version number
- Change history (future)

---

# 13. Privacy & Retention

- Memory is scoped to a startup.
- Deleted startups remove associated memories.
- Sensitive personal data should be minimized.
- Retention policies should be configurable in future releases.

---

# 14. Performance

Recommendations:

- Cache frequently accessed profile memories
- Batch reads where possible
- Index by startupId, type, and tags
- Summarize very large histories periodically

---

# 15. Failure Handling

If memory writes fail:

- Complete user-visible workflow if safe
- Retry asynchronously
- Log failure
- Notify administrators if persistent

---

# 16. Future Enhancements

- Semantic memory search
- Automatic memory summarization
- Relationship graphs
- Time-travel history
- Memory confidence scoring
- Cross-session personalization

---

# 17. Canonical Rules

- Startup Memory is the authoritative long-term context layer.
- Only meaningful, durable information is persisted.
- Memory is always isolated by workspace and startup.
- CEO Planner consults Startup Memory before reasoning.
- RAG and Startup Memory are complementary systems.
- Memory must never contain internal reasoning or secrets.

This document defines the official Startup Memory architecture for
FounderHQ.
