# FounderHQ -- Business Rules & Governance

> **Document ID:** 14_BUSINESS_RULES\
> **Version:** 1.0\
> **Depends On:** Documents 01--13

---

# 1. Purpose

This document defines the business rules that govern FounderHQ. These
rules are independent of implementation and must be enforced
consistently by the FastAPI backend, Google ADK agents, and Firebase
services.

---

# 2. Core Principles

- The founder is the final decision-maker.
- AI recommends; it does not autonomously make high-impact business
  decisions.
- Every important action is explainable, auditable, and reversible
  where practical.
- Business rules override AI-generated suggestions.

---

# 3. Authority Matrix

Action AI Recommend AI Execute Founder Approval

---

Draft hiring plan ✓ ✓  
Create job description ✓ ✓  
Send external email ✓ ✓
Hire employee ✓ ✓
Change company budget ✓ ✓
Update roadmap ✓ ✓
Connect integrations ✓ ✓

---

# 4. Startup Lifecycle

States:

```text
Draft
 ↓
Active
 ↓
Scaling
 ↓
Paused
 ↓
Archived
```

Only Active startups can execute AI workflows.

---

# 5. Workspace Rules

- Every startup belongs to exactly one workspace.
- Users may belong to multiple workspaces.
- Workspace data is isolated.
- Cross-workspace data access is prohibited.

---

# 6. Approval Rules

Approval is mandatory for:

- Hiring
- Budget changes
- Strategic pivots
- External communication
- Integration authorization
- Deleting startup data

Approval records must be immutable after completion.

---

# 7. AI Decision Rules

The CEO Planner must:

1.  Read Startup Memory.
2.  Retrieve relevant knowledge.
3.  Evaluate business rules.
4.  Consult required agents.
5.  Request approval when necessary.
6.  Persist execution history.

---

# 8. Executive Collaboration Rules

- Executive agents communicate only through the CEO Planner.
- Agents cannot trigger other agents directly.
- Planner resolves conflicting recommendations.
- Planner determines execution order.

---

# 9. Startup Memory Rules

Always store:

- Founder commands
- Decisions
- Approvals
- Completed executions
- Health score history

Never store:

- Temporary reasoning
- Internal chain-of-thought
- API secrets

---

# 10. Document Rules

Uploaded documents:

- Stored in Firebase Storage
- Indexed after upload
- Linked through Firestore metadata
- Never modified directly by AI

Supported examples:

- Pitch decks
- Business plans
- Financial reports
- Policies
- Meeting notes

---

# 11. Health Score Rules

Dimensions:

- Finance
- Hiring
- Growth
- Operations

Rules:

- Calculated by backend services.
- Never edited manually.
- Historical values retained.

---

# 12. Notification Rules

Create notifications for:

- Approval requests
- Execution completion
- Failed indexing
- Integration errors
- Significant health score changes

Notifications should remain read/unread until dismissed.

---

# 13. Audit Rules

Every major workflow logs:

- Timestamp
- User
- Workspace
- Startup
- Execution ID
- Result
- Approval status

Audit entries are append-only.

---

# 14. Security Rules

- Enforce Firebase Authentication.
- Enforce Firestore Security Rules.
- Validate every backend request.
- Never trust client-supplied roles.
- Use server timestamps.

---

# 15. Error Rules

If execution fails:

- Preserve state.
- Log error.
- Notify founder.
- Allow resume where possible.

No partial destructive actions without confirmation.

---

# 16. Compliance Guidelines

FounderHQ should:

- Minimize stored personal data.
- Respect workspace boundaries.
- Support export and deletion requests.
- Maintain execution history for accountability.

---

# 17. Business Invariants

These rules must always hold true:

1.  A startup belongs to one workspace.
2.  The CEO Planner is the only public AI interface.
3.  Every execution has a unique execution ID.
4.  Every approval references one execution.
5.  Every uploaded document belongs to one startup.
6.  Health scores are backend-generated.
7.  AI cannot bypass approval workflows.

---

# 18. Future Governance

Potential additions:

- Organization-level policies
- Industry compliance packs
- Custom approval workflows
- Department-level permissions
- Risk scoring engine

---

# 19. Canonical Rules

- Business rules take precedence over AI outputs.
- Founder approval is required for high-impact actions.
- Startup Memory is authoritative historical context.
- RAG grounds recommendations.
- All business operations must be auditable.
- Security and workspace isolation are mandatory.

This document is the authoritative governance specification for
FounderHQ.
