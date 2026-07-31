# FounderHQ -- RAG Architecture

> **Document ID:** 15_RAG_ARCHITECTURE\
> **Version:** 1.0\
> **Depends On:** Documents 01--14

---

# 1. Purpose

This document defines the Retrieval-Augmented Generation (RAG)
architecture used by FounderHQ.

The RAG system is responsible for transforming uploaded startup
knowledge into grounded, searchable context for the CEO Planner and
executive agents.

Core goals:

- Ground every recommendation in company knowledge
- Reduce hallucinations
- Preserve startup-specific context
- Keep knowledge isolated per workspace

---

# 2. Design Principles

- Retrieval before generation
- Workspace isolation
- Startup-specific indexing
- Metadata-driven retrieval
- Incremental indexing
- Explainable citations
- Firebase-first implementation

---

# 3. High-Level Pipeline

```text
Upload
   │
Firebase Storage
   │
Document Parser
   │
Chunking
   │
Embedding Generation
   │
Firestore Metadata
   │
Retriever
   │
Context Builder
   │
CEO Planner
   │
Executive Agents
```

---

# 4. Supported Documents

MVP:

- PDF
- DOCX
- TXT
- Markdown
- CSV

Future:

- Google Docs
- Slides
- Notion exports
- Confluence
- Audio transcripts

---

# 5. Ingestion Pipeline

1.  Upload file to Firebase Storage.
2.  Create Firestore metadata.
3.  Extract text.
4.  Clean formatting.
5.  Split into chunks.
6.  Generate embeddings.
7.  Store metadata and embedding reference.
8.  Mark document as indexed.

Document states:

- Uploaded
- Parsing
- Chunking
- Embedding
- Indexed
- Failed

---

# 6. Parsing Strategy

Extract:

- Title
- Headings
- Body
- Tables (text form)
- Lists

Preserve page numbers where available for citations.

---

# 7. Chunking Strategy

Guidelines:

- Semantic chunks preferred
- Preserve section boundaries
- Include overlap between adjacent chunks
- Avoid splitting tables mid-row

Metadata per chunk:

```json
{
  "startupId": "",
  "documentId": "",
  "section": "",
  "page": 1,
  "language": "en",
  "embeddingId": "..."
}
```

---

# 8. Embeddings

Provider:

- Google embedding model

Pipeline:

```text
Chunk
  │
Embedding Model
  │
Embedding Vector
  │
Reference Stored
```

MVP stores embedding references with Firestore metadata.

Future migration:

- Vertex AI Vector Search

---

# 9. Retrieval Pipeline

```text
Founder Command
      │
Planner
      │
Retriever
      │
Relevant Chunks
      │
Context Builder
      │
Gemini
```

Retrieval should filter by:

- Workspace
- Startup
- Language
- Document type

---

# 10. Context Builder

Builds the prompt context using:

- Founder request
- Startup profile
- Startup Memory
- Top-ranked chunks
- Business rules

Keep prompts concise while preserving relevance.

---

# 11. Firestore Collections

Relevant collections:

- documents
- knowledge_chunks
- commands
- executions

Storage:

- Firebase Storage stores original files.
- Firestore stores metadata.
- Embeddings referenced from metadata.

---

# 12. Security

- Workspace isolation
- Backend-only indexing
- Authenticated retrieval
- No cross-startup retrieval
- Firestore Security Rules enforced

---

# 13. Performance

Recommendations:

- Incremental indexing
- Background processing
- Parallel embedding generation
- Chunk caching
- Lazy retrieval

---

# 14. Error Handling

Failures:

- Parsing failure
- Corrupt file
- Embedding failure
- Unsupported type

Rules:

- Preserve original upload
- Log failure
- Notify founder
- Allow re-index

---

# 15. Explainability

Every AI recommendation should expose references where applicable.

Reference fields:

- Document
- Section
- Page
- Confidence

---

# 16. Future Enhancements

- Hybrid keyword + vector search
- Reranking
- OCR for scanned PDFs
- Image understanding
- Meeting transcript ingestion
- Continuous document sync
- Automatic re-indexing

---

# 17. Canonical Rules

- RAG is the authoritative knowledge layer.
- Retrieval always precedes reasoning.
- Original documents remain immutable.
- Startup knowledge is isolated by workspace.
- Parsing and indexing occur only on the backend.
- Embeddings are replaceable without changing application logic.
- AI responses should cite retrieved business knowledge whenever
  available.

This document is the official RAG architecture specification for
FounderHQ.
