# FounderHQ Knowledge Engine (Enterprise RAG)
Version: 1.0
Project: FounderHQ

---

# Objective

Build an enterprise-grade Retrieval Augmented Generation (RAG) system for FounderHQ that behaves similarly to Notion AI, Glean, Perplexity Enterprise, and Cursor.

The chatbot must never behave like a simple PDF chatbot.

Instead, it should act as a secure workspace knowledge assistant capable of retrieving information from:

- Global Workspace Documents
- Team Documents
- User Private Documents
- Built-in FounderHQ Knowledge
- Future Integrations (Google Drive, Notion, Slack, GitHub, etc.)

The architecture must support thousands of documents while maintaining security, speed, and accuracy.

---

# Core Principles

The chatbot must:

✅ Answer only using retrieved context whenever possible.

✅ Never expose documents the current user cannot access.

✅ Always provide citations.

✅ Understand natural language.

✅ Search across multiple knowledge sources.

✅ Support semantic search + keyword search.

✅ Support future AI agents.

---

# Knowledge Layers

## 1. Global Workspace Knowledge

Accessible to everyone inside the workspace.

Examples:

Business Plan

Pitch Deck

Vision

Mission

Roadmap

PRDs

API Documentation

Design System

Company SOP

Legal Policies

Investor Deck

Startup Documents

---

## 2. Team Knowledge

Visible only to members of that team.

Examples

Engineering

Marketing

Sales

Finance

Legal

HR

Operations

Example:

Engineering uploads

Architecture.md

Database.pdf

API Docs.pdf

Only Engineering can retrieve them.

---

## 3. User Private Knowledge

Every user owns their personal documents.

Examples

Resume

Meeting Notes

Personal Research

Personal Roadmaps

Investor Notes

Private PDFs

Private Docs

Private PPTs

Private Excel

No other user can retrieve these.

---

## 4. FounderHQ Knowledge

Built-in documentation.

Examples

Startup Guides

Templates

YC Advice

Business Frameworks

Legal Templates

Fundraising Guides

Marketing Playbooks

Prompt Libraries

Product Frameworks

These are read-only.

---

# Security Model

Every document MUST contain metadata.

Required metadata

workspace_id

document_id

owner_id

department

visibility

file_name

file_type

page_number

chunk_number

tags

created_at

updated_at

embedding_version

Possible visibility values

GLOBAL

TEAM

PRIVATE

SYSTEM

The retrieval engine MUST filter permissions BEFORE vector search.

Never retrieve unauthorized chunks.

---

# Supported File Types

PDF

DOCX

PPTX

XLSX

CSV

TXT

Markdown

HTML

JSON

Images (OCR)

Code Files

Google Docs

Notion Export

Future:

Slack

GitHub

Drive

Confluence

---

# Ingestion Pipeline

Whenever a document is uploaded

Step 1

Extract text

↓

Step 2

OCR images if necessary

↓

Step 3

Extract tables

↓

Step 4

Generate metadata

↓

Step 5

Semantic chunking

↓

Step 6

Generate embeddings

↓

Step 7

Store chunks

↓

Step 8

Store metadata

↓

Step 9

Update search index

The pipeline must be asynchronous.

---

# Chunking Strategy

Never split every fixed number of tokens.

Instead split by meaning.

Preferred boundaries

Heading

Subheading

Paragraph

Bullet list

Table

Section

Each chunk should contain

300–700 tokens

15–20% overlap

Each chunk must know

Parent heading

Document title

Page

Section

---

# Embeddings

Recommended

Gemini Embedding

or

Voyage AI

or

OpenAI text-embedding-3-large

Embedding model should be configurable.

---

# Vector Database

Recommended

Qdrant

Reasons

Fast

Payload filtering

Hybrid Search

Multi-tenancy

Open Source

Scalable

Alternative

Pinecone

Weaviate

pgvector

---

# Retrieval Pipeline

User Question

↓

Authentication

↓

Permission Resolver

↓

Intent Detection

↓

Query Rewriting

↓

Collection Selection

↓

Hybrid Retrieval

↓

Reranking

↓

Context Compression

↓

LLM

↓

Grounded Response

---

# Intent Detection

The chatbot should first classify the query.

Possible intents

Workspace Question

Personal Question

Team Question

Document Lookup

Summarization

Comparison

Generation

Action Request

General Knowledge

The detected intent determines which collections to search.

---

# Query Rewriting

Before searching

Rewrite vague questions.

Example

Original

How much money do we need?

Rewrite

Funding requirements in workspace business plan.

Another

What did I write yesterday?

Rewrite

User meeting notes OR personal notes created yesterday.

---

# Collection Selection

Instead of searching everything

Search only relevant collections.

Example

"What is our refund policy?"

Search

Global

Legal

HR

Not Personal Notes

Example

"Summarize my meeting"

Search

User Notes

Meeting Transcripts

Calendar Notes

---

# Hybrid Search

Never rely only on embeddings.

Use

Dense Embeddings

+

BM25

+

Metadata Filters

↓

Merge Results

↓

Rerank

---

# Metadata Filtering

Example

workspace_id = current_workspace

AND

owner_id = current_user

OR

visibility = GLOBAL

OR

department IN user_departments

Only then perform vector similarity.

---

# Reranking

Retrieve

Top 30

↓

Cross Encoder Reranker

↓

Top 8

↓

LLM

---

# Context Compression

Retrieved context should be compressed before generation.

Instead of sending

20 chunks

↓

Compress

↓

6 high quality context blocks

↓

Generate answer

---

# Citations

Every answer MUST contain citations.

Example

BusinessPlan.pdf

Page 14

Section

Market Opportunity

InvestorDeck.pdf

Slide 9

Clickable citations preferred.

---

# Response Rules

The chatbot must

Never hallucinate.

If information cannot be found

Say

"I couldn't find this information in your accessible documents."

Never invent.

---

# Memory

Remember

Recent conversation

Recent retrieved documents

Previous follow-up questions

Allow conversational follow-up without searching again if sufficient context exists.

---

# Multi-Step Retrieval

Some questions require multiple retrievals.

Example

Generate investor email using our tone.

Retrieve

Pitch Deck

↓

Brand Voice

↓

Fundraising Notes

↓

Generate email

The planner should support chained retrieval.

---

# File Upload Experience

User uploads file

↓

Processing animation

↓

Extracting text

↓

Generating embeddings

↓

Indexing

↓

Ready for AI

Large files should process in background.

---

# Performance Goals

Cold query

< 5 sec

Warm query

< 2 sec

Streaming responses

First token < 2 sec

---

# Future Integrations

Google Drive

Dropbox

Slack

GitHub

Notion

Confluence

Jira

Gmail

Calendar

OneDrive

---

# AI Agent Compatibility

The RAG engine should not belong only to the chatbot.

Instead expose it as a service.

Future AI agents

CEO

CTO

CFO

CMO

COO

Legal

HR

Marketing

Sales

Product

All agents use the same retrieval API.

---

# Suggested Folder Structure

backend/

    rag/

        ingestion/

        parser/

        chunking/

        embeddings/

        retriever/

        reranker/

        permissions/

        citations/

        context/

        prompts/

        services/

        api/

        workers/

        utils/

---

# Tech Stack

Backend

Python

FastAPI

Celery

Redis

Qdrant

Postgres

Storage

Supabase Storage

or

Google Cloud Storage

Embeddings

Gemini

Vector DB

Qdrant

Reranker

BAAI bge-reranker-large

LLM

Gemini 2.5 Pro

Streaming

Server Sent Events

Authentication

Firebase Auth

or

Supabase Auth

---

# Golden Rules

NEVER expose unauthorized documents.

NEVER answer without retrieval if the question is about workspace knowledge.

ALWAYS show citations.

ALWAYS filter permissions before searching.

Prefer precision over recall.

Use semantic chunking.

Use hybrid retrieval.

Use reranking.

Use context compression.

Design for multi-agent usage.

Build the RAG engine as a reusable platform service, not as a chatbot-specific component.

The knowledge engine should become the central intelligence layer of FounderHQ.
