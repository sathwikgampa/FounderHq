# FounderHQ -- Agent Communication Protocol

> **Document ID:** 09_AGENT_COMMUNICATION\
> **Version:** 1.0\
> **Depends On:** 01--08 Documentation

---

# 1. Purpose

This document defines how AI agents communicate, collaborate, and
coordinate within FounderHQ.

Only the **CEO Planner Agent** communicates with the frontend. All other
agents communicate exclusively through the planner using structured
messages.

---

# 2. Communication Principles

- Planner-mediated communication only
- Stateless messages
- Structured payloads
- Event-driven execution
- Idempotent processing
- Explainable decisions
- Auditability

---

# 3. High-Level Flow

```text
Founder
   │
Command
   │
CEO Planner
   │
Task Planning
   │
Dispatch Messages
   │
┌────────────┬────────────┬────────────┐
Finance    Talent      Growth
└────────────┴────────────┴────────────┘
        │
 Structured Results
        │
Conflict Resolution
        │
Approval (if needed)
        │
Execution
        │
Persistence
        │
Founder Response
```

---

# 4. Communication Lifecycle

1.  Receive founder command.
2.  Read Startup Memory.
3.  Retrieve RAG context.
4.  Build execution plan.
5.  Dispatch tasks.
6.  Collect outputs.
7.  Resolve conflicts.
8.  Request approval if required.
9.  Execute approved actions.
10. Persist results.
11. Respond to founder.

---

# 5. Message Contract

Every inter-agent message contains:

```json
{
  "executionId": "...",
  "taskId": "...",
  "agent": "finance",
  "objective": "...",
  "context": {},
  "constraints": [],
  "priority": "high",
  "deadline": null
}
```

---

# 6. Response Contract

```json
{
  "agent": "finance",
  "status": "success",
  "summary": "...",
  "recommendations": [],
  "confidence": 0.93,
  "requiresApproval": true,
  "references": []
}
```

---

# 7. Execution Modes

## Sequential

Used when outputs depend on previous agents.

Example:

Finance → Operations

## Parallel

Independent work executes simultaneously.

Example:

Finance + Growth + Talent

---

# 8. Context Propagation

The planner supplies only relevant context:

- Startup profile
- Current objective
- Relevant memory
- Retrieved knowledge
- Current metrics

Agents must not access unrelated startup information.

---

# 9. Startup Memory Synchronization

Read Before Execute

- Commands
- Decisions
- Goals
- Previous outputs

Write After Execute

- Agent output
- Status
- Timeline entry
- Health changes

Only the planner performs final persistence.

---

# 10. RAG Interaction

Agents never query raw documents directly.

Flow:

Agent → Planner → RAG Service → Planner → Agent

This guarantees consistent retrieval and access control.

---

# 11. Tool Invocation

The planner authorizes tool use.

Examples:

- Gmail
- Calendar
- Firestore
- Firebase Storage
- Google Drive

Tool calls are logged for auditing.

---

# 12. Conflict Resolution

If recommendations conflict:

1.  Compare confidence.
2.  Evaluate business constraints.
3.  Apply company priorities.
4.  Produce one unified recommendation.
5.  Record rationale.

---

# 13. Approval Checkpoints

Approval is required before:

- Hiring
- Budget allocation
- External communication
- Strategic changes

The execution remains paused until approval is received.

---

# 14. Retry Strategy

Transient failures:

- Retry with exponential backoff.

Permanent failures:

- Return structured error.
- Preserve execution state.
- Notify founder.

---

# 15. Streaming Events

The frontend may receive progress events:

- Understanding request
- Reading startup memory
- Retrieving knowledge
- Consulting finance
- Consulting growth
- Building execution plan
- Awaiting approval
- Completed

---

# 16. Observability

Every execution logs:

- Execution ID
- Active agents
- Duration
- Tool usage
- Errors
- Approval state

---

# 17. Security

- Workspace isolation
- Planner-controlled authorization
- Firestore Security Rules
- Sensitive tools restricted to backend
- Audit trail for every workflow

---

# 18. Future Extensions

- Dynamic agent discovery
- Marketplace agents
- Third-party executive plugins
- Voice event streams
- Autonomous scheduled reviews

---

# 19. Canonical Rules

- Founder communicates only with the CEO Planner.
- Agents never communicate directly with each other or the founder.
- All communication uses structured message contracts.
- Startup Memory and RAG are accessed through the planner.
- Planner is responsible for orchestration, persistence, and
  approvals.
- Every execution is auditable, resumable, and explainable.
