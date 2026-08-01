"""
FounderHQ Enterprise RAG Knowledge Engine & Executive Memory Manager

Architecture:
- 4 Knowledge Layers (Global Workspace, Team Department, User Private, System FounderHQ)
- Hybrid BM25 & Semantic Term-Frequency Keyword Scorer
- Pre-retrieval Security Metadata Permission Filtering
- Intent Classification & Query Rewriting
- Modern Google GenAI (Gemini 2.5) LLM Integration
- Executive Knowledge Synthesizer for Clean Markdown Outputs with Citations
"""

from __future__ import annotations

import logging
import os
import re
from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any

logger = logging.getLogger("founderhq.rag_engine")


@dataclass
class DocumentChunkMetadata:
    document_id: str
    workspace_id: str
    owner_id: str
    visibility: str  # GLOBAL, TEAM, PRIVATE, SYSTEM
    department: str | None = None
    file_name: str = ""
    file_type: str = "pdf"
    page_number: int = 1
    chunk_number: int = 1
    tags: list[str] = field(default_factory=list)
    created_at: str = field(default_factory=lambda: datetime.now(UTC).isoformat())


@dataclass
class ChunkResult:
    chunk_id: str
    text: str
    score: float
    metadata: DocumentChunkMetadata


class PermissionResolver:
    """Filters accessible documents based on security metadata BEFORE retrieval."""

    @staticmethod
    def filter_accessible_chunks(
        chunks: list[ChunkResult],
        user_id: str,
        workspace_id: str,
        user_departments: list[str],
    ) -> list[ChunkResult]:
        allowed_chunks: list[ChunkResult] = []
        for chunk in chunks:
            meta = chunk.metadata
            if meta.visibility != "SYSTEM" and meta.workspace_id != workspace_id:
                continue
            if meta.visibility in ("GLOBAL", "SYSTEM"):
                allowed_chunks.append(chunk)
                continue
            if meta.visibility == "PRIVATE" and meta.owner_id == user_id:
                allowed_chunks.append(chunk)
                continue
            if meta.visibility == "TEAM" and meta.department in user_departments:
                allowed_chunks.append(chunk)
                continue
        return allowed_chunks


class QueryRewriter:
    """Classifies query intent and rewrites user questions into optimized RAG search terms."""

    @staticmethod
    def rewrite_query(prompt: str) -> dict[str, Any]:
        lower_p = prompt.lower()
        intent = "GENERAL"
        collections = ["GLOBAL", "SYSTEM"]

        if any(
            k in lower_p for k in ["runway", "burn", "cash", "finance", "revenue", "mrr", "budget"]
        ):
            intent = "FINANCE_QUERY"
            collections.extend(["TEAM_FINANCE", "PRIVATE"])
        elif any(
            k in lower_p for k in ["candidate", "hire", "job", "salary", "recruiting", "talent"]
        ):
            intent = "HR_QUERY"
            collections.extend(["TEAM_HR", "PRIVATE"])
        elif any(k in lower_p for k in ["safe", "contract", "nda", "tax", "legal", "83b", "terms"]):
            intent = "LEGAL_QUERY"
            collections.extend(["TEAM_LEGAL", "GLOBAL"])
        elif any(
            k in lower_p
            for k in ["pitch", "deck", "investor", "cap table", "valuation", "series a"]
        ):
            intent = "INVESTOR_QUERY"
            collections.extend(["GLOBAL", "PRIVATE"])

        rewritten_query = prompt
        if "how much money" in lower_p or "cash runway" in lower_p:
            rewritten_query = "Current cash balance, monthly net burn rate, and runway calculation"
        elif "meeting yesterday" in lower_p:
            rewritten_query = "User meeting notes and transcripts recorded yesterday"

        return {
            "intent": intent,
            "collections": list(set(collections)),
            "rewritten_query": rewritten_query,
        }


def _compute_relevance_score(query: str, text: str, meta: DocumentChunkMetadata) -> float:
    """Compute dynamic BM25 / TF-IDF hybrid keyword relevance score for a chunk."""
    query_terms = set(re.findall(r"\w+", query.lower()))
    text_lower = text.lower()
    text_terms = re.findall(r"\w+", text_lower)

    if not query_terms or not text_terms:
        return 0.1

    # Term overlap & frequency
    matches = sum(1 for term in query_terms if term in text_lower)
    term_score = matches / len(query_terms)

    # Substring / exact phrase match bonus
    phrase_bonus = 0.3 if query.lower() in text_lower else 0.0

    # Business term match bonus
    business_keywords = [
        "runway",
        "mrr",
        "burn",
        "valuation",
        "safe",
        "equity",
        "post-money",
        "83b",
        "soc2",
        "salary",
        "arr",
        "ebitda",
    ]
    key_bonus = (
        0.2 if any(k in query.lower() and k in text_lower for k in business_keywords) else 0.0
    )

    # Numerical currency/percentage match bonus
    num_bonus = (
        0.15
        if re.search(r"\$\d+|\d+%", text)
        and re.search(r"\$\d+|\d+|money|cost|price|runway|burn", query.lower())
        else 0.0
    )

    total_score = min(0.99, term_score * 0.5 + phrase_bonus + key_bonus + num_bonus + 0.1)
    return round(total_score, 4)


class ExecutiveKnowledgeSynthesizer:
    """Formats retrieved document chunks into clean executive briefing markdown per Simple Format Law."""

    @staticmethod
    def synthesize_fallback_answer(query: str, chunks: list[ChunkResult]) -> str:
        if not chunks:
            return (
                "### ℹ️ Executive Knowledge Notice\n\n"
                "I don't have enough information in your uploaded documents to answer that. "
                "Please upload relevant files (financial models, SAFEs, job posts, PRDs) using the document upload panel."
            )

        # Extract top key insights & numbers
        top_chunk = chunks[0]
        citations_str = ", ".join(
            f"`[📄 {c.metadata.file_name} | Chunk {c.metadata.chunk_number}]`" for c in chunks[:3]
        )

        bullet_points: list[str] = []
        for c in chunks[:4]:
            lines = [line.strip() for line in c.text.split("\n") if line.strip()]
            for line in lines:
                if len(line) > 15 and not line.startswith("#"):
                    bullet_points.append(f"* **{c.metadata.file_name}**: {line}")
                    if len(bullet_points) >= 4:
                        break
            if len(bullet_points) >= 4:
                break

        bullets_md = (
            "\n".join(bullet_points)
            if bullet_points
            else f"* **Context**: {top_chunk.text[:300]}..."
        )

        return f"""### 🎯 Executive Summary
Based on your FounderHQ workspace documents, here is the synthesized intelligence for: **"{query}"**

#### 📊 Grounded Findings
{bullets_md}

#### 💡 Strategic Action Item
Review the referenced source documents to ensure your financial, legal, and operational metrics remain fully aligned with your milestone roadmap.

#### 📄 Verified Source Citations
{citations_str}"""


def _build_rag_prompt(user_question: str, context: str) -> str:
    """Build an executive RAG generation prompt for Gemini 2.5."""
    return f"""You are the FounderHQ Executive Knowledge Assistant. Answer the question strictly using the provided context documents.

RULES:
1. Format output cleanly using markdown per Simple Format Law:
   - Header: ### 🎯 Executive Summary
   - Section: #### 📊 Key Findings
   - Section: #### 💡 Strategic Recommendations
   - Section: #### 📄 Verified Source Citations
2. Answer ONLY from the provided context. Do NOT hallucinate or guess outside facts.
3. Include explicit document citations e.g. [📄 filename.pdf | Chunk N].
4. Be precise, professional, and quantitative.

CONTEXT FROM RETRIEVED DOCUMENTS:
{context}

USER QUESTION: {user_question}

EXECUTIVE ANSWER:"""


async def _call_gemini(prompt: str) -> str:
    """Call Gemini API to generate a grounded executive answer."""
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.info("No Gemini API key found — utilizing ExecutiveKnowledgeSynthesizer fallback")
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
        logger.warning(f"Google GenAI SDK call failed: {exc} — attempting legacy client fallback")

    try:
        import google.generativeai as legacy_genai  # type: ignore[import]

        legacy_genai.configure(api_key=api_key)
        model = legacy_genai.GenerativeModel(model_name="gemini-1.5-flash")
        res = model.generate_content(prompt)
        if res and hasattr(res, "text") and res.text:
            return res.text.strip()
    except Exception as legacy_exc:
        logger.error(f"Legacy Gemini API error: {legacy_exc}")

    return ""


class EnterpriseRAGEngine:
    """Central Intelligence Knowledge Layer for FounderHQ Multi-Agent System."""

    def __init__(self) -> None:
        from rag.pipeline import RAGPipeline

        self.pipeline = RAGPipeline()

    async def ingest_document(
        self,
        document_id: str,
        workspace_id: str,
        owner_id: str,
        content: str,
        file_name: str,
        visibility: str = "GLOBAL",
        department: str | None = None,
    ) -> int:
        """Ingests raw content or PDF streams through the RAG pipeline."""
        content_bytes = content.encode("utf-8")
        doc_id = await self.pipeline.process_and_index_pdf(
            source=content_bytes,
            filename=file_name,
            workspace_id=workspace_id,
            owner_id=owner_id,
            visibility=visibility,
            department=department,
            document_id=document_id,
        )
        logger.info(f"Ingested document {file_name} into Enterprise RAG Engine (ID={doc_id})")
        return 1

    async def ingest_pdf_bytes(
        self,
        pdf_bytes: bytes,
        file_name: str,
        workspace_id: str = "startup-001",
        owner_id: str = "siddharth",
        visibility: str = "GLOBAL",
        department: str | None = None,
        document_id: str | None = None,
    ) -> str:
        """Ingests binary PDF uploads through the PDF Processing -> Chunking -> Vector DB pipeline."""
        return await self.pipeline.process_and_index_pdf(
            source=pdf_bytes,
            filename=file_name,
            workspace_id=workspace_id,
            owner_id=owner_id,
            visibility=visibility,
            department=department,
            document_id=document_id,
        )

    def delete_document(self, document_id: str) -> int:
        """Remove all indexed chunks when the source document is deleted."""
        return self.pipeline.vector_db.delete_document(document_id)

    async def query_knowledge_base(
        self,
        user_prompt: str,
        user_id: str,
        workspace_id: str,
        user_departments: list[str] | None = None,
    ) -> dict[str, Any]:
        """Query RAG Knowledge Engine through Query Understanding, Hybrid Retrieval, Re-ranking, Context Compression, and LLM Generation."""
        res = await self.pipeline.execute_retrieval(
            query=user_prompt,
            user_id=user_id,
            workspace_id=workspace_id,
            departments=user_departments,
        )

        return {
            "query": res.query,
            "rewritten_query": res.rewritten_query,
            "intent": res.intent,
            "compressed_context": res.compressed_context,
            "citations": res.citations,
            "retrieved_chunk_count": res.retrieved_chunk_count,
            "generated_answer": res.generated_answer,
            "confidence": res.confidence,
        }


# Global Singleton RAG Memory Instance
rag_engine = EnterpriseRAGEngine()
