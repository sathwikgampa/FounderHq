# FounderHQ -- AI Evaluation & Governance

> **Document ID:** 24_AI_EVALUATION_AND_GOVERNANCE **Version:** 1.0
> **Depends On:** Documents 01--23

---

# 1. Purpose

This document defines how FounderHQ measures, validates, governs, and
continuously improves its AI systems.

The objective is to ensure every AI interaction is accurate, grounded,
safe, explainable, cost-effective, and aligned with business rules.

---

# 2. AI Governance Principles

- Human oversight for high-impact decisions
- Retrieval before reasoning
- Measurable AI quality
- Continuous evaluation
- Transparency and explainability
- Privacy by design
- Version-controlled prompts and models

---

# 3. AI Lifecycle

```text
Design
  │
Prompt Development
  │
Offline Evaluation
  │
Regression Testing
  │
Staging Validation
  │
Production
  │
Monitoring
  │
Feedback
  │
Continuous Improvement
```

---

# 4. Evaluation Dimensions

Dimension Goal

---

Accuracy Correct recommendations
Grounding Supported by Startup Memory/RAG
Safety No harmful or unauthorized actions
Explainability Clear reasoning and references
Latency Fast responses
Cost Efficient token usage
Reliability Consistent outputs

---

# 5. CEO Planner Scorecard

Measure:

- Intent understanding
- Planning quality
- Agent selection
- Conflict resolution
- Approval compliance
- Final response quality

---

# 6. Executive Agent Scorecard

Each agent is evaluated on:

- Domain correctness
- Tool usage
- Structured output compliance
- Business rule adherence
- Hallucination rate
- Execution success

---

# 7. Hallucination Detection

Checks include:

- Unsupported factual claims
- Missing citations
- Contradictory outputs
- Fabricated startup data
- Incorrect calculations

Responses failing validation should be flagged or regenerated.

---

# 8. Grounding Verification

Before responding:

- Query Startup Memory
- Retrieve RAG context
- Validate references
- Attach supporting citations where available

---

# 9. Prompt Regression Testing

Run suites covering:

- New startup
- Existing startup
- Missing documents
- Approval-required tasks
- Empty knowledge base
- Conflicting information
- Invalid commands

---

# 10. Safety Evaluation

Verify that AI:

- Respects RBAC
- Does not bypass approvals
- Does not expose secrets
- Avoids prompt injection
- Rejects unauthorized requests

---

# 11. Cost Monitoring

Track:

- Tokens per request
- Tokens per workspace
- Model usage
- Cost per execution
- Cache hit rate

Optimize prompts and retrieval to reduce unnecessary usage.

---

# 12. Latency Benchmarks

Suggested targets:

- Planner first token \< 2 s
- Non-AI API p95 \< 500 ms
- Retrieval \< 300 ms
- End-to-end execution within acceptable workflow limits

---

# 13. Human-in-the-Loop

Require review for:

- Hiring decisions
- Budget changes
- External communications
- Strategy recommendations
- Sensitive integrations

Human feedback should be recorded for future evaluation.

---

# 14. Model Management

Maintain:

- Supported model versions
- Prompt versions
- Rollback capability
- Compatibility matrix
- Changelog

Model upgrades require evaluation before production rollout.

---

# 15. Continuous Monitoring

Monitor:

- Hallucination rate
- Approval failures
- Tool failures
- User satisfaction
- Regeneration frequency
- AI latency
- Error rates

---

# 16. Red Team Testing

Regularly test:

- Prompt injection
- Jailbreak attempts
- Data leakage
- Cross-workspace access
- Malicious file uploads
- Tool abuse scenarios

Document findings and remediation.

---

# 17. Continuous Improvement

Feedback sources:

- User ratings
- Operational metrics
- Incident reviews
- Prompt experiments
- Model benchmarking

All improvements should be measurable.

---

# 18. Canonical Rules

1.  AI quality must be continuously measured.
2.  Startup Memory and RAG ground every decision.
3.  Prompt and model changes require regression testing.
4.  High-impact actions require human approval.
5.  AI outputs are observable, auditable, and explainable.
6.  Safety and privacy override convenience.
7.  Governance is an ongoing operational process.

This document is the authoritative AI evaluation and governance
framework for FounderHQ.
