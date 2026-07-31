from typing import Any


class RAGRetrieverPipelinePlaceholder:
    """RAG Retriever Pipeline Placeholder."""

    async def query_knowledge_base(self, query: str) -> list[dict[str, Any]]:
        return []
