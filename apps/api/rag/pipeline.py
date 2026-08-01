"""
Complete RAG Architecture Pipeline Controller

Orchestrates:
1. Ingestion Flow:
   User Uploads PDF → Document Processing (Metadata Extraction / OCR) → Text Cleaning →
   Smart Chunking → Embedding Generation → Vector Database

2. Query Flow:
   User Query → Query Understanding → Query Embedding → Hybrid Retrieval (Vector + Keyword) →
   Re-ranking Model → Context Compression → Prompt Builder → LLM → Final Answer
"""

from __future__ import annotations

import logging
import os
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from rag.chunking.smart_chunker import SmartChunker
from rag.embeddings.generator import EmbeddingGenerator
from rag.indexing.vector_db import VectorDatabase
from rag.loaders.pdf_loader import PDFLoader
from rag.parsers.doc_processor import DocumentProcessor
from rag.ranking.context_compressor import ContextCompressor
from rag.ranking.reranker import ReRanker
from rag.retriever.hybrid_retriever import HybridRetriever

logger = logging.getLogger("founderhq.rag.pipeline")


@dataclass
class RAGQueryResult:
    query: str
    rewritten_query: str
    intent: str
    compressed_context: str
    citations: list[dict[str, Any]]
    retrieved_chunk_count: int
    generated_answer: str
    confidence: float


class RAGPipeline:
    """Master RAG Architecture Controller connecting PDF ingestion and query resolution."""

    def __init__(self, storage_path: Path | None = None) -> None:
        self.loader = PDFLoader()
        self.doc_processor = DocumentProcessor()
        self.chunker = SmartChunker(target_chunk_size=600, overlap_size=100)
        self.embedding_gen = EmbeddingGenerator(dimension=384)
        self.vector_db = VectorDatabase(storage_path=storage_path)
        self.retriever = HybridRetriever(
            vector_db=self.vector_db, embedding_gen=self.embedding_gen, alpha=0.65
        )
        self.reranker = ReRanker(rrf_k=60.0)
        self.compressor = ContextCompressor(max_chars=4000)

        # Seed initial core workspace documents for immediate availability
        self._seed_default_documents()

    def _seed_default_documents(self) -> None:
        """Pre-indexes default operational documents into vector DB."""
        default_docs = [
            (
                "q3_financial_model.pdf",
                "FINANCE",
                "Q3 Startup Financial Model & Runway Statement\n"
                "Total Cash Reserve: $450,000 USD. Monthly Net Burn Rate: $25,000 / month.\n"
                "Zero-Revenue Runway: 18 Months remaining. Monthly Recurring Revenue (MRR): $15,000.\n"
                "Max safe monthly engineering spend: $12,500/mo to preserve 14+ months runway.",
            ),
            (
                "series_a_safe_terms.pdf",
                "LEGAL",
                "Series A SAFE Term Sheet — YC Post-Money SAFE\n"
                "Pre-Money Valuation: $8,000,000 USD. Investment Amount: $1,000,000 USD.\n"
                "Investor Ownership Post-Money: 11.11%. Board Seat: 1 Independent Observer.\n"
                "Human Approval Requirement: Mandatory for cap table dilution > 10%.",
            ),
            (
                "senior_ai_engineer_jd.pdf",
                "HR",
                "Senior AI/ML Engineer Job Posting & Compensation Package\n"
                "Role: Senior AI Infrastructure Lead. Target Salary Range: $130,000 – $150,000 USD.\n"
                "Equity Option Pool Grant: 0.75% – 1.25% with 4-year vesting (1-year cliff).\n"
                "Approval Status: Pending CFO Runway & Sign-off.",
            ),
        ]

        for doc_name, dept, content in default_docs:
            doc_id = f"doc-sys-{dept.lower()}"
            processed = self.doc_processor.process(
                pages=[
                    type("PDFPageObj", (), {"page_number": 1, "text": content, "has_text": True})()
                ],
                filename=doc_name,
                workspace_id="startup-001",
                owner_id="system",
                visibility="GLOBAL",
                department=dept,
            )
            chunks = self.chunker.chunk_document(processed, doc_id)
            vectors = self.embedding_gen.generate_batch_embeddings([c.text for c in chunks])
            self.vector_db.add_chunks(chunks, vectors, doc_id)

    async def process_and_index_pdf(
        self,
        source: str | Path | bytes,
        filename: str,
        workspace_id: str = "startup-001",
        owner_id: str = "siddharth",
        visibility: str = "GLOBAL",
        department: str | None = None,
        category: str = "general",
        document_id: str | None = None,
    ) -> str:
        """Executes Ingestion Flow: PDF -> Processing -> OCR/Cleaning -> Chunking -> Embeddings -> Vector DB."""
        doc_id = document_id or f"doc-{uuid.uuid4().hex[:8]}"

        # Step 1: User Uploads PDF -> Document Processing Loader
        pages = self.loader.load_pdf(source)

        # Step 2: Metadata Extraction, OCR (if scanned), & Text Cleaning
        processed_doc = self.doc_processor.process(
            pages=pages,
            filename=filename,
            workspace_id=workspace_id,
            owner_id=owner_id,
            visibility=visibility,
            department=department,
            category=category,
        )

        # Step 3: Smart Chunking
        chunks = self.chunker.chunk_document(processed_doc, doc_id)

        # Step 4: Embedding Generation
        vectors = self.embedding_gen.generate_batch_embeddings([c.text for c in chunks])

        # Step 5: Vector Database Indexing
        self.vector_db.delete_document(doc_id)
        self.vector_db.add_chunks(chunks, vectors, doc_id)

        logger.info(
            f"RAG Pipeline successfully ingested PDF '{filename}' ({len(chunks)} chunks, doc_id={doc_id})"
        )
        return doc_id

    async def execute_retrieval(
        self,
        query: str,
        user_id: str = "siddharth",
        workspace_id: str = "startup-001",
        departments: list[str] | None = None,
    ) -> RAGQueryResult:
        """Executes Query Flow: Query -> Understanding -> Embedding -> Hybrid Retrieval -> Re-ranking -> Compression -> Prompt -> LLM."""
        user_depts = departments or []

        # Step 1 & 2 & 3: Query Understanding, Query Embedding, Hybrid Retrieval
        qu_res, candidates = self.retriever.retrieve(
            query=query,
            user_id=user_id,
            workspace_id=workspace_id,
            user_departments=user_depts,
            top_k=20,
        )

        # Step 4: Re-ranking Model
        ranked_chunks = self.reranker.rerank(candidates, query=query, top_n=5)

        # Step 5: Context Compression & Citation Extraction
        compressed_res = self.compressor.compress(ranked_chunks)

        # Step 6: Prompt Builder
        prompt = self._build_prompt(
            query=qu_res.rewritten_query, context=compressed_res.compressed_text
        )

        # Step 7 & 8: LLM Generation -> Final Answer
        answer = await self._call_llm(prompt)
        if not answer or len(answer.strip()) < 20:
            answer = self._synthesize_fallback_answer(query=query, compressed_res=compressed_res)

        confidence = max(
            (float(c["relevance_score"]) for c in compressed_res.citations), default=0.0
        )
        return RAGQueryResult(
            query=query,
            rewritten_query=qu_res.rewritten_query,
            intent=qu_res.intent,
            compressed_context=compressed_res.compressed_text,
            citations=compressed_res.citations,
            retrieved_chunk_count=compressed_res.chunk_count,
            generated_answer=answer,
            confidence=round(min(1.0, confidence), 4),
        )

    def _build_prompt(self, query: str, context: str) -> str:
        """Prompt Builder — Prepares executive RAG instruction prompt."""
        return f"""You are the FounderHQ Executive Knowledge Assistant. Answer the question strictly using the provided context documents.

RULES:
1. Format output cleanly using markdown per Simple Format Law:
   - Header: ### 🎯 Executive Summary
   - Section: #### 📊 Key Findings
   - Section: #### 💡 Strategic Recommendations
   - Section: #### 📄 Verified Source Citations
2. Answer ONLY from the provided context. Do NOT hallucinate facts outside the context.
3. Include explicit document citations e.g. [📄 filename.pdf | Page N].
4. Be precise, professional, and quantitative.

CONTEXT FROM RETRIEVED DOCUMENTS:
{context}

USER QUESTION: {query}

EXECUTIVE ANSWER:"""

    async def _call_llm(self, prompt: str) -> str:
        """Executes LLM call to Gemini 2.5 API."""
        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        if not api_key:
            return ""

        try:
            from google import genai  # type: ignore[import]

            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            if response and hasattr(response, "text") and response.text:
                return response.text.strip()
        except Exception as exc:
            logger.debug(f"Gemini API call failed: {exc}")

        return ""

    def _synthesize_fallback_answer(self, query: str, compressed_res: Any) -> str:
        """Synthesizes structured executive fallback response if LLM is offline."""
        if not compressed_res.citations:
            return (
                "### ℹ️ Executive Knowledge Notice\n\n"
                "I don't have enough information in your uploaded workspace documents to answer that query. "
                "Please upload relevant PDF files (financial models, SAFEs, job posts) using the document upload panel."
            )

        citations_str = ", ".join(
            f"`[📄 {c['file_name']} | Page {c['page_number']}]`"
            for c in compressed_res.citations[:3]
        )

        lines = compressed_res.compressed_text.split("\n")
        findings = [
            line.strip()
            for line in lines
            if line.strip() and not line.startswith("[📄") and not line.startswith("---")
        ][:4]
        findings_md = (
            "\n".join(f"* {f}" for f in findings)
            if findings
            else "* Context details available in indexed workspace documents."
        )

        return f"""### 🎯 Executive Summary
Based on your FounderHQ workspace documents, here is the synthesized intelligence for: **"{query}"**

#### 📊 Grounded Findings
{findings_md}

#### 💡 Strategic Recommendation
Review the referenced source documents to ensure your financial, legal, and operational metrics remain fully aligned with your milestone roadmap.

#### 📄 Verified Source Citations
{citations_str}"""
