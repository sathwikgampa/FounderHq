# FounderHQ -- Technology Stack

> **Document ID:** 05_TECH_STACK\
> **Version:** 1.0\
> **Depends On:** 01_PROJECT_BRIEF.md, 02_PRODUCT_REQUIREMENTS.md,
> 03_SYSTEM_ARCHITECTURE.md, 04_DATABASE_DESIGN.md

---

# 1. Purpose

This document defines the official technology stack for FounderHQ. Every
implementation decision should align with this document unless
superseded by a future architecture review.

## Core Principles

- AI-first architecture
- Modular services
- Cloud-native deployment
- Type-safe development
- Scalable by default
- Firebase-first backend services
- Python-powered AI orchestration

---

# 2. System Overview

```text
Next.js Frontend
        │
 REST / Streaming APIs
        │
     FastAPI Backend
        │
   CEO Planner (Google ADK)
        │
 Executive AI Agents
        │
RAG + Startup Memory
        │
 Firebase Services
```

---

# 3. Frontend

## Framework

- Next.js 15 (App Router)
- React 19
- TypeScript

### Why

- Server Components
- Excellent routing
- Production-ready SSR/CSR support
- Modern React ecosystem

## UI

- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide Icons

## Forms & Validation

- React Hook Form
- Zod

## Data Fetching

- TanStack Query
- Native fetch for server components

---

# 4. Backend

## Framework

- FastAPI
- Python 3.12+
- Uvicorn

### Responsibilities

- API layer
- Authentication validation
- AI orchestration
- Agent execution
- Streaming responses
- Background jobs

Future additions:

- Celery
- Redis
- WebSockets

---

# 5. AI Stack

## Agent Framework

**Google Agent Development Kit (Google ADK)**

Reason:

- Native Gemini integration
- Multi-agent orchestration
- Tool calling
- Structured execution
- Long-term Google ecosystem support

## Agents

- CEO Planner (primary interface)
- Finance
- Talent
- Growth
- Operations
- Legal (future)
- Investment (future)

Only the CEO Planner communicates with the frontend.

---

# 6. LLM Stack

Primary

- Gemini 2.5 Pro

Fast tasks

- Gemini 2.5 Flash

Embeddings

- Google embedding model (Vertex AI / Gemini embedding service)

Usage Guidelines

- Planner: Pro
- Lightweight classification: Flash
- Retrieval: Embeddings

---

# 7. Firebase Platform

## Authentication

- Google Sign-In
- Email/Password

## Firestore

Stores

- Users
- Workspaces
- Startups
- Commands
- Executions
- Tasks
- Notifications
- Health Scores
- Startup Memory

## Storage

Stores

- PDFs
- Pitch decks
- Images
- Financial documents
- Meeting notes

## Cloud Messaging

Push notifications

## App Check

Protect Firebase resources.

---

# 8. Knowledge & RAG

Pipeline

```text
Upload
 ↓
Parser
 ↓
Chunking
 ↓
Embedding
 ↓
Index
 ↓
Retriever
 ↓
CEO Planner
```

Initial MVP

- Firestore metadata
- Embedding references

Future

- Vertex AI Vector Search

---

# 9. Startup Memory

Short-Term Memory

- Active conversation
- Current execution
- Temporary reasoning context

Long-Term Memory

- Firestore
- Commands
- Decisions
- Goals
- Health history
- Executive outputs

---

# 10. API Design

Architecture

```text
Next.js
   │
REST / Streaming
   │
FastAPI
   │
Google ADK
   │
Firebase
```

Guidelines

- JSON APIs
- Versioned endpoints
- Stateless requests
- Streaming for AI responses where appropriate

---

# 11. Security

- Firebase Authentication
- Firestore Security Rules
- HTTPS only
- Environment variables
- Role-based authorization
- Server-side validation in FastAPI
- Secrets never exposed to frontend

---

# 12. Deployment

Frontend

- Vercel

Backend

- Google Cloud Run (preferred)
- Railway (development alternative)

Firebase

- Firestore
- Storage
- Authentication
- Cloud Messaging

---

# 13. Development Tooling

- Git
- GitHub
- pnpm
- ESLint
- Prettier
- Python virtual environments
- pytest
- Ruff (Python linting)

---

# 14. Coding Standards

Frontend

- Feature-first organization
- Reusable UI components
- Strict TypeScript

Backend

- Layered architecture
- Dependency injection where appropriate
- Pydantic models for validation

AI

- One responsibility per agent
- Explainable outputs
- Structured prompts
- Deterministic tool usage

---

# 15. Future Technologies

Potential additions

- Redis
- Temporal
- BigQuery
- Vertex AI Vector Search
- Cloud Tasks
- Cloud Scheduler
- Google Workspace APIs
- Stripe
- Slack
- GitHub App integrations

---

# 16. Approved Stack Summary

Layer Technology

---

Frontend Next.js 15 + React 19 + TypeScript
UI Tailwind CSS + shadcn/ui + Framer Motion
Backend FastAPI + Python 3.12
AI Framework Google Agent Development Kit
LLM Gemini 2.5 Pro / Flash
Database Cloud Firestore
Authentication Firebase Authentication
File Storage Firebase Storage
Notifications Firebase Cloud Messaging
Hosting Vercel + Cloud Run
Validation Zod + Pydantic
Forms React Hook Form
State & Fetching TanStack Query
Version Control Git + GitHub

---

# 17. Engineering Decision Record

The FounderHQ MVP officially adopts:

- Next.js as the frontend framework.
- FastAPI as the backend and orchestration service.
- Google ADK for multi-agent execution.
- Gemini models for reasoning.
- Firebase as the application platform.
- Firestore as the primary database.
- Firebase Storage for uploaded assets.
- Cloud Run for backend deployment.
- Vercel for frontend deployment.

All future architectural documents should assume this stack unless a
documented migration strategy is approved.
