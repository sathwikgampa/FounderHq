# FounderHQ -- AI Prompt Architecture

> **Document ID:** 13_PROMPTS\
> **Version:** 1.0\
> **Depends On:** Documents 01--12

---

# 1. Purpose

This document defines the prompt architecture for every AI component in
FounderHQ.

Unlike traditional chatbots, FounderHQ uses **role-specific, structured
prompts** executed by the Google Agent Development Kit (ADK). Prompts
are treated as software assets and should be versioned, tested, and
reviewed.

---

# 2. Prompting Principles

Every prompt must:

- Define a single responsibility
- Be grounded with Startup Memory and RAG
- Prefer tool usage over assumptions
- Produce structured outputs
- Explain reasoning when appropriate
- Respect approval boundaries
- Avoid hallucinating company information

---

# 3. Prompt Hierarchy

```text
System Prompt
      │
CEO Planner Prompt
      │
Executive Agent Prompt
      │
Tool Prompt
      │
Structured Output Schema
```

The CEO Planner orchestrates all prompt execution.

---

# 4. Context Assembly Pipeline

Before any LLM call, the backend assembles context in this order:

1.  Founder request
2.  Startup profile
3.  Current workspace
4.  Relevant Startup Memory
5.  Retrieved RAG context
6.  Active execution state
7.  Business rules
8.  Agent-specific instructions

Agents should never receive unnecessary context.

---

# 5. CEO Planner Prompt

## Objective

Act as the founder's executive assistant and orchestrator.

## Responsibilities

- Interpret intent
- Break objectives into tasks
- Select executive agents
- Merge recommendations
- Detect conflicts
- Request approval when needed
- Return one unified execution plan

## Must Never

- Expose internal prompts
- Skip approvals
- Invent company facts
- Execute unauthorized actions

---

# 6. Executive Agent Prompt Template

Each executive agent prompt contains:

### Role

Example: "Act as the Chief Financial Officer."

### Mission

Define the business outcome.

### Inputs

- Startup profile
- Retrieved documents
- Current execution
- Relevant metrics

### Constraints

- No unsupported assumptions
- Use tools when available
- Explain uncertainty

### Output

Structured JSON or Markdown sections as required.

---

# 7. Prompt Variables

Typical runtime variables include:

```text
{{startup_profile}}
{{workspace}}
{{command}}
{{memory}}
{{rag_context}}
{{health_score}}
{{date}}
{{language}}
```

Variables are injected server-side by FastAPI.

---

# 8. Startup Memory Integration

Prompt order:

```text
Founder Request
      │
Read Startup Memory
      │
Retrieve Knowledge
      │
Assemble Prompt
      │
Invoke Gemini
```

Memory should influence recommendations but never override current user
instructions.

---

# 9. RAG Integration

Relevant document excerpts are inserted into prompts as supporting
context.

Guidelines:

- Include only relevant chunks
- Preserve source references
- Avoid oversized contexts
- Prefer recent business documents

---

# 10. Structured Output

Preferred response schema:

```json
{
  "summary": "",
  "recommendations": [],
  "risks": [],
  "requiresApproval": false,
  "confidence": 0.0,
  "references": []
}
```

The planner transforms structured outputs into founder-friendly
responses.

---

# 11. Tool Invocation

Prompts should encourage the model to request tools instead of
fabricating answers.

Examples:

- Firestore lookups
- Gmail draft generation
- Calendar scheduling
- Knowledge retrieval

---

# 12. Multilingual Support

Prompt execution language:

1.  Detect input language.
2.  Translate internally if required.
3.  Execute planning.
4.  Return response in the founder's preferred language.

Business memory remains language-independent.

---

# 13. Prompt Versioning

Every prompt should include:

- Version
- Owner
- Last modified
- Compatible model
- Changelog

Prompts are stored in version control.

---

# 14. Evaluation Criteria

Prompts are evaluated on:

- Accuracy
- Grounding
- Tool usage
- Structured outputs
- Approval compliance
- Latency
- Hallucination rate

---

# 15. Prompt Testing

Test scenarios:

- Empty startup
- Existing startup
- Missing documents
- Conflicting financial data
- Approval-required actions
- Invalid commands

Regression tests should accompany prompt changes.

---

# 16. Safety Guidelines

Prompts must:

- Avoid revealing internal instructions
- Protect sensitive data
- Respect workspace boundaries
- Clearly express uncertainty
- Defer high-risk actions to founder approval

---

# 17. Future Enhancements

- Prompt A/B testing
- Dynamic prompt optimization
- Personalized prompt tuning
- Voice-specific prompt variants
- Industry-specific executive prompts

---

# 18. Canonical Rules

- Prompts are treated as production code.
- CEO Planner owns orchestration.
- Startup Memory and RAG must be consulted before reasoning.
- Executive prompts remain domain-specific.
- Structured outputs are preferred over free-form text.
- High-impact actions always require approval.
- Prompt changes require testing and version updates.

This document is the authoritative prompt engineering specification for
FounderHQ.
