"""
Hybrid Retriever Module — Query Understanding, Query Embedding, & Hybrid Retrieval (Vector + Keyword)

Implements:
1. Query Understanding (Intent Detection & Query Expansion/Rewriting)
2. Query Embedding Generation
3. Hybrid Retrieval (Dense Cosine Similarity + Sparse Keyword BM25/TF-IDF)
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass

from rag.embeddings.generator import EmbeddingGenerator
from rag.indexing.vector_db import VectorDatabase, VectorRecord

logger = logging.getLogger("founderhq.rag.retriever.hybrid_retriever")


@dataclass
class QueryUnderstandingResult:
    original_query: str
    rewritten_query: str
    intent: str
    keywords: list[str]


@dataclass
class CandidateChunk:
    record: VectorRecord
    vector_score: float
    keyword_score: float
    hybrid_score: float


class QueryUnderstanding:
    """Classifies user query intent and expands domain terms into search phrases."""

    @staticmethod
    def analyze_query(query: str) -> QueryUnderstandingResult:
        lower_q = query.lower()
        intent = "GENERAL"
        rewritten = query

        # Intent detection
        if any(
            k in lower_q
            for k in ["runway", "burn", "cash", "finance", "revenue", "mrr", "budget", "cost"]
        ):
            intent = "FINANCE"
            if "runway" in lower_q or "money" in lower_q:
                rewritten = f"{query} cash reserve monthly burn rate runway months balance"
        elif any(
            k in lower_q
            for k in ["safe", "contract", "nda", "tax", "legal", "83b", "terms", "valuation"]
        ):
            intent = "LEGAL"
            if "safe" in lower_q or "valuation" in lower_q:
                rewritten = (
                    f"{query} post-money SAFE term sheet cap table valuation equity percentage"
                )
        elif any(
            k in lower_q for k in ["hire", "job", "salary", "recruiting", "candidate", "engineer"]
        ):
            intent = "HR"
            if "salary" in lower_q or "hire" in lower_q:
                rewritten = (
                    f"{query} target salary range equity pool grant compensation job description"
                )
        elif any(k in lower_q for k in ["pitch", "deck", "investor", "sequoia", "yc"]):
            intent = "INVESTOR"

        keywords = list(set(re.findall(r"\w+", rewritten.lower())))

        return QueryUnderstandingResult(
            original_query=query,
            rewritten_query=rewritten,
            intent=intent,
            keywords=keywords,
        )


class HybridRetriever:
    """Executes Query Embedding and Hybrid Retrieval (Dense Vector + Sparse Keyword BM25)."""

    def __init__(
        self, vector_db: VectorDatabase, embedding_gen: EmbeddingGenerator, alpha: float = 0.65
    ) -> None:
        self.vector_db = vector_db
        self.embedding_gen = embedding_gen
        self.alpha = alpha  # Weight for vector score vs keyword score

    def retrieve(
        self,
        query: str,
        user_id: str,
        workspace_id: str,
        user_departments: list[str],
        top_k: int = 10,
    ) -> tuple[QueryUnderstandingResult, list[CandidateChunk]]:
        # Step 1: Query Understanding
        qu_res = QueryUnderstanding.analyze_query(query)

        # Step 2: Query Embedding
        query_vec = self.embedding_gen.generate_embedding(qu_res.rewritten_query)

        # Step 3: Security-scoped Dense Vector Search
        vector_matches = self.vector_db.search_vector(
            query_vector=query_vec,
            user_id=user_id,
            workspace_id=workspace_id,
            user_departments=user_departments,
            top_k=top_k * 2,
        )

        # Step 4: Sparse Keyword / BM25 Term Frequency Scoring
        accessible_records = self.vector_db.filter_by_permissions(
            user_id=user_id,
            workspace_id=workspace_id,
            user_departments=user_departments,
        )

        vector_score_map = {r.chunk_id: score for r, score in vector_matches}
        candidates: list[CandidateChunk] = []

        for record in accessible_records:
            v_score = vector_score_map.get(record.chunk_id, 0.0)
            k_score = self._compute_keyword_score(qu_res.keywords, record.text, record.file_name)

            # Hybrid Score Fusion
            hybrid_score = round(self.alpha * v_score + (1 - self.alpha) * k_score, 4)
            if hybrid_score > 0.05:
                candidates.append(
                    CandidateChunk(
                        record=record,
                        vector_score=round(v_score, 4),
                        keyword_score=round(k_score, 4),
                        hybrid_score=hybrid_score,
                    )
                )

        candidates.sort(key=lambda c: c.hybrid_score, reverse=True)
        return qu_res, candidates[:top_k]

    def _compute_keyword_score(self, keywords: list[str], text: str, filename: str) -> float:
        text_lower = text.lower()
        fn_lower = filename.lower()

        if not keywords:
            return 0.1

        match_count = sum(1 for kw in keywords if kw in text_lower or kw in fn_lower)
        term_freq = match_count / len(keywords)

        # Exact phrase match bonus
        phrase_bonus = 0.3 if any(kw in text_lower for kw in keywords if len(kw) > 5) else 0.0

        # Numerical metric bonus
        num_bonus = 0.2 if re.search(r"\$\d+|\d+%", text) else 0.0

        return min(1.0, term_freq * 0.5 + phrase_bonus + num_bonus)
