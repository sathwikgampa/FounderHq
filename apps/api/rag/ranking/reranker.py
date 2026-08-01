"""
Re-ranking Model Module — Reciprocal Rank Fusion & Domain Affinity Re-scoring

Implements:
1. Reciprocal Rank Fusion (RRF)
2. Strategic domain & numerical affinity re-scoring
3. Candidate candidate re-ordering
"""

from __future__ import annotations

import logging
import re

from rag.retriever.hybrid_retriever import CandidateChunk

logger = logging.getLogger("founderhq.rag.ranking.reranker")


class ReRanker:
    """Re-ranks top hybrid retrieval candidate chunks using RRF and domain affinity metrics."""

    def __init__(self, rrf_k: float = 60.0) -> None:
        self.rrf_k = rrf_k

    def rerank(
        self, candidates: list[CandidateChunk], query: str, top_n: int = 5
    ) -> list[CandidateChunk]:
        if not candidates:
            return []

        query_lower = query.lower()

        # Step 1: Compute Vector RRF Rank & Keyword RRF Rank
        sorted_by_vector = sorted(candidates, key=lambda c: c.vector_score, reverse=True)
        sorted_by_keyword = sorted(candidates, key=lambda c: c.keyword_score, reverse=True)

        vec_rank_map = {c.record.chunk_id: rank + 1 for rank, c in enumerate(sorted_by_vector)}
        kw_rank_map = {c.record.chunk_id: rank + 1 for rank, c in enumerate(sorted_by_keyword)}

        reranked: list[CandidateChunk] = []

        for candidate in candidates:
            cid = candidate.record.chunk_id
            v_rank = vec_rank_map.get(cid, 99)
            k_rank = kw_rank_map.get(cid, 99)

            # RRF Formula: RRF Score = 1/(k + v_rank) + 1/(k + k_rank)
            rrf_score = (1.0 / (self.rrf_k + v_rank)) + (1.0 / (self.rrf_k + k_rank))

            # Domain & Numerical Affinity Boost
            text_lower = candidate.record.text.lower()
            affinity_boost = 0.0

            # Boost exact phrase matches
            if query_lower in text_lower:
                affinity_boost += 0.05

            # Boost currency / percentage metrics if financial query
            if any(
                k in query_lower
                for k in ["runway", "burn", "cash", "salary", "mrr", "cost", "price"]
            ):
                if re.search(r"\$\d+|\d+%", candidate.record.text):
                    affinity_boost += 0.04

            final_score = round(rrf_score * 100 + affinity_boost, 4)
            candidate.hybrid_score = final_score
            reranked.append(candidate)

        reranked.sort(key=lambda c: c.hybrid_score, reverse=True)
        logger.info(
            f"ReRanker ordered {len(reranked)} candidate chunks (top score: {reranked[0].hybrid_score if reranked else 0})"
        )
        return reranked[:top_n]
