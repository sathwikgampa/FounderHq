# RAG Knowledge Engine (`apps/api/rag`)

## Overview

Retrieval-Augmented Generation module for document parsing, chunking, embedding generation, vector indexing, semantic retrieval, and ranking context for CEO Planner.

## Sub-Modules

- `loaders/`: Document ingest loaders (PDF, Docx, Text).
- `parsers/`: Document structural parsers.
- `chunking/`: Text chunking strategies (semantic / sliding window).
- `embeddings/`: Embedding generation service (Gemini Embeddings).
- `retriever/`: Context retriever interface.
- `indexing/`: Vector index manager.
- `ranking/`: Reranking & context relevance engine.
- `pipeline.py`: RAG execution pipeline controller.
