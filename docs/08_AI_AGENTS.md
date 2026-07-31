# FounderHQ -- AI Agents Specification

> **Document ID:** 08_AI_AGENTS\
> **Version:** 1.0\
> **Depends On:** 01_PROJECT_BRIEF.md → 07_AI_ARCHITECTURE.md

---

# 1. Purpose

This document specifies every AI agent used in FounderHQ.

Each agent is an internal microservice built using **Google Agent
Development Kit (ADK)**. The founder never communicates directly with
these agents. All interactions are orchestrated through the **CEO
Planner Agent**.

---

# 2. Agent Design Principles

Every agent must:

- Have one clearly defined responsibility
- Produce structured outputs
- Use tools instead of assumptions
- Read only the context it needs
- Never bypass the CEO Planner
- Log important decisions
- Be independently testable

---

# 3. Agent Hierarchy

```text
Founder
   │
   ▼
CEO Planner Agent
   │
   ├── Finance Agent
   ├── Talent Agent
   ├── Growth Agent
   ├── Operations Agent
   ├── Legal Agent (Future)
   └── Investment Agent (Future)
```

---

# 4. CEO Planner Agent

## Role

The CEO Planner is the orchestrator of the FounderHQ AI Operating
System.

## Responsibilities

- Understand founder intent
- Break goals into executable work
- Retrieve Startup Memory
- Query RAG
- Select appropriate executive agents
- Merge agent outputs
- Resolve conflicts
- Request approvals
- Update Startup Memory
- Return a unified response

## Inputs

- Founder request
- Startup profile
- Startup Memory
- Knowledge Engine context
- Current health score

## Outputs

- Execution plan
- Recommendations
- Task assignments
- Approval requests

## Allowed Tools

- Firestore
- Firebase Storage
- Gmail
- Calendar
- Google Drive
- RAG Retriever

---

# 5. Finance Agent

## Purpose

Acts as the virtual CFO.

## Responsibilities

- Burn rate analysis
- Cash flow forecasting
- Budget planning
- Runway estimation
- Cost optimization

## Inputs

- Revenue
- Expenses
- Funding
- Financial documents

## Outputs

- Budget reports
- Forecasts
- Financial recommendations

## Constraints

- Never modify financial records directly
- Must explain assumptions

---

# 6. Talent Agent

## Purpose

Acts as Head of Talent.

## Responsibilities

- Hiring plans
- Job descriptions
- Candidate scoring
- Interview workflows
- Team planning

## Outputs

- Hiring roadmap
- Job descriptions
- Evaluation summaries

## Allowed Tools

- Resume parser
- Document search
- Email drafting (with approval)

---

# 7. Growth Agent

## Purpose

Acts as Head of Growth.

## Responsibilities

- Marketing strategy
- Product launch planning
- GTM strategy
- Campaign ideas
- Content planning

## Outputs

- Marketing roadmap
- Campaign plans
- KPI recommendations

---

# 8. Operations Agent

## Purpose

Acts as COO.

## Responsibilities

- Sprint planning
- Project tracking
- Delivery timelines
- Risk identification
- Resource allocation

## Outputs

- Sprint plans
- Milestones
- Operational recommendations

---

# 9. Future Agents

## Legal Agent

Responsibilities

- Contract review
- Compliance guidance
- Policy generation

## Investment Agent

Responsibilities

- Investor readiness
- Fundraising strategy
- Due diligence support

---

# 10. Shared Capabilities

Every agent supports:

- Structured prompts
- Tool calling
- Startup Memory access (scoped)
- RAG context retrieval
- Confidence scoring
- Explainable outputs

---

# 11. Prompt Contract

Each agent prompt must include:

1.  Role
2.  Objective
3.  Available context
4.  Allowed tools
5.  Constraints
6.  Output schema

Prompts should avoid free-form responses when structured data is
expected.

---

# 12. Tool Access Matrix

Tool CEO Finance Talent Growth Operations

---

Firestore ✓ ✓ ✓ ✓ ✓
Storage ✓ ✓ ✓ ✓ ✓
Gmail ✓ ✓ ✓  
Calendar ✓ ✓ ✓ ✓
Drive ✓ ✓ ✓ ✓ ✓
RAG ✓ ✓ ✓ ✓ ✓

Only the CEO Planner can initiate cross-agent workflows.

---

# 13. Memory Access

## CEO Planner

- Full startup memory

## Executive Agents

- Scoped memory
- Relevant documents
- Current execution context

Agents should never access unrelated startup data.

---

# 14. Execution Lifecycle

```text
Receive Task
    │
Read Context
    │
Retrieve Knowledge
    │
Use Tools
    │
Generate Structured Output
    │
Return to CEO Planner
```

---

# 15. Error Handling

If an agent cannot complete its task:

- Return structured error
- Include reason
- Suggest next steps
- Do not fabricate results

The CEO Planner decides whether to retry, continue, or request founder
input.

---

# 16. Success Metrics

Each agent should be evaluated on:

- Accuracy
- Explainability
- Response time
- Tool usage correctness
- Grounding quality
- Completion rate

---

# 17. Security Rules

Agents:

- Never expose secrets
- Never bypass approval workflows
- Never modify Firestore directly without authorized services
- Respect workspace isolation

---

# 18. Future Expansion

Future executive agents may include:

- Sales
- Customer Success
- Product Management
- Data Analytics
- HR Operations
- Procurement

The architecture supports adding new agents without changing the CEO
Planner interface.

---

# 19. Canonical Rules

- The CEO Planner is the only public AI interface.
- Executive agents are internal specialists.
- Agents communicate only through the CEO Planner.
- Every recommendation should be grounded by RAG or Startup Memory
  when possible.
- High-impact actions require founder approval.
- All agent outputs must be auditable and persistable.

This document serves as the implementation specification for all Google
ADK agents in FounderHQ.
