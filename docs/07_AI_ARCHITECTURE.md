# FounderHQ -- AI Architecture

> **Document ID:** 07_AI_ARCHITECTURE\
> **Version:** 1.0\
> **Depends On:** 01_PROJECT_BRIEF.md → 06_FOLDER_STRUCTURE.md

---

# 1. Purpose

This document defines the AI architecture for FounderHQ.

FounderHQ is an **AI Operating System**, not a chatbot platform. The
founder interacts with exactly **one AI interface**---the CEO Planner
Agent. All specialist agents operate behind the scenes using the Google
Agent Development Kit (ADK).

---

# 2. AI Design Principles

- Single conversational entry point
- Planner-first orchestration
- Tool-first execution
- Retrieval before generation
- Memory-aware reasoning
- Human approval for high-impact actions
- Explainable outputs
- Modular agents

---

# 3. AI Layers

```text
Founder
   │
   ▼
CEO Planner Agent
   │
   ├── Startup Memory
   ├── RAG Knowledge Engine
   ├── Tool Registry
   └── Executive Agents
          ├── Finance
          ├── Talent
          ├── Growth
          └── Operations
```

---

# 4. CEO Planner

## Responsibilities

- Understand intent
- Determine business objective
- Retrieve startup context
- Query RAG
- Decide required agents
- Coordinate execution
- Merge outputs
- Request approval
- Update Startup Memory

The CEO Planner is the **only AI exposed to the frontend**.

---

# 5. Executive Agents

## Finance

Focus: - Cash flow - Runway - Budget - Forecasting

## Talent

Focus: - Hiring plans - Job descriptions - Candidate evaluation

## Growth

Focus: - Marketing - GTM strategy - Campaign planning

## Operations

Focus: - Roadmaps - Sprint planning - Delivery tracking

Future: - Legal - Investment - Customer Success

---

# 6. Google ADK

FounderHQ adopts Google ADK because it supports:

- Multi-agent orchestration
- Tool calling
- Structured workflows
- Gemini-native execution

Each agent owns: - Prompt - Tools - Schemas - Business rules

---

# 7. Planning Pipeline

```text
Founder Command
      │
Intent Analysis
      │
Read Startup Memory
      │
Retrieve RAG Context
      │
Select Agents
      │
Execute Agent Tasks
      │
Merge Results
      │
Conflict Resolution
      │
Approval (if required)
      │
Persist Results
      │
Respond to Founder
```

---

# 8. Startup Memory

## Short-Term

- Active conversation
- Current execution
- Temporary reasoning

## Long-Term

Stored in Firestore:

- Commands
- Decisions
- Goals
- Health history
- Approvals
- Agent outputs

The planner reads memory before every execution.

---

# 9. Knowledge (RAG)

Pipeline

```text
Upload
→ Parse
→ Chunk
→ Embed
→ Store Metadata
→ Retrieve
→ Planner Context
```

Knowledge sources:

- Pitch decks
- Financial reports
- Policies
- Roadmaps
- Meeting notes

All recommendations should be grounded whenever applicable.

---

# 10. Tool Calling

The planner invokes tools instead of generating unsupported actions.

Examples:

- Gmail
- Google Drive
- Calendar
- Firestore
- Firebase Storage
- GitHub (future)
- Stripe (future)

---

# 11. Context Management

Each execution receives:

- Founder request
- Startup profile
- Relevant memory
- Retrieved documents
- Active integrations
- Current health score

Agents receive only the context they require.

---

# 12. Agent Communication

Agents never communicate directly with the founder.

Flow:

CEO Planner → Agent Request → Agent Response → Planner Merge

All communication is mediated by the planner.

---

# 13. Conflict Resolution

When agent recommendations differ:

1.  Collect outputs
2.  Compare constraints
3.  Apply business priorities
4.  Produce one unified recommendation
5.  Explain reasoning

---

# 14. Approval Workflow

Approval is mandatory for:

- Hiring
- Budget changes
- External communications
- Strategic pivots

Execution pauses until founder action.

---

# 15. Streaming

FastAPI streams planner responses to Next.js.

Stages:

- Understanding request
- Gathering knowledge
- Consulting executives
- Building plan
- Final recommendation

---

# 16. Error Recovery

If an agent fails:

- Log failure
- Retry when appropriate
- Continue with partial execution if safe
- Notify founder
- Preserve execution state

---

# 17. AI Safety

- Never fabricate company data
- Prefer retrieved knowledge
- Explain uncertainty
- Respect approval boundaries
- Log major decisions

---

# 18. Future Evolution

Planned enhancements:

- Voice interaction
- Continuous monitoring
- Scheduled executive reviews
- Autonomous recurring tasks
- Multi-startup portfolio planning

---

# 19. Canonical AI Principles

- CEO Planner is the single conversational interface.
- Executive agents are internal services.
- Retrieval precedes generation.
- Startup Memory provides continuity.
- Google ADK manages orchestration.
- Gemini powers reasoning.
- Firebase stores persistent operational state.
- Every important recommendation is explainable and auditable.
