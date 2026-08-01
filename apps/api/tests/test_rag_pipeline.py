"""
Complete RAG Architecture Integration & Unit Test Suite

Tests:
1. Document Processing & Ingestion (PDF loader, metadata extraction, text cleaning, smart chunking, embedding generation, vector DB indexing)
2. Query Processing (Query understanding, query embedding, hybrid retrieval, re-ranking, context compression, prompt building, LLM/synthesizer generation)
3. Pre-retrieval Security Metadata Filtering (GLOBAL, TEAM, PRIVATE)
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from rag.pipeline import RAGPipeline

client = TestClient(app)


@pytest.mark.asyncio
async def test_full_rag_pipeline_end_to_end():
    pipeline = RAGPipeline()

    # Create synthetic PDF content
    pdf_content = (
        b"### Section 1: Financial Model Q3\n"
        b"Total Cash Reserve: $500,000 USD. Monthly Net Burn Rate: $20,000 / month.\n"
        b"Calculated Zero-Revenue Runway: 25 Months remaining.\n\n"
        b"### Section 2: Executive Compensation\n"
        b"VP of AI Engineering Target Base Salary: $160,000 USD.\n"
        b"Equity Pool Allocation: 1.5% options vesting over 48 months."
    )

    # Ingestion Flow
    doc_id = await pipeline.process_and_index_pdf(
        source=pdf_content,
        filename="acme_q3_strategy.pdf",
        workspace_id="acme-test",
        owner_id="siddharth",
        visibility="GLOBAL",
        department="FINANCE",
    )
    assert doc_id.startswith("doc-")

    # Query Flow — Financial query
    res = await pipeline.execute_retrieval(
        query="What is our current cash runway and net burn rate?",
        user_id="siddharth",
        workspace_id="acme-test",
        departments=["FINANCE"],
    )

    assert res.query == "What is our current cash runway and net burn rate?"
    assert res.intent == "FINANCE"
    assert res.retrieved_chunk_count > 0
    assert len(res.citations) > 0
    assert "Executive Summary" in res.generated_answer


@pytest.mark.asyncio
async def test_rag_security_permission_isolation():
    pipeline = RAGPipeline()

    # Ingest Private Document
    priv_doc = b"CONFIDENTIAL BOARD MEETING NOTES\nProposed M&A Acquisition of Competitor X for $5,000,000."
    await pipeline.process_and_index_pdf(
        source=priv_doc,
        filename="secret_board_notes.pdf",
        workspace_id="startup-001",
        owner_id="ceo-user",
        visibility="PRIVATE",
    )

    # Query as unauthorized user
    res_unauth = await pipeline.execute_retrieval(
        query="What was discussed in secret board notes regarding acquisition?",
        user_id="other-user",
        workspace_id="startup-001",
    )
    # Ensure secret document is NOT cited for unauthorized user
    for cite in res_unauth.citations:
        assert cite["file_name"] != "secret_board_notes.pdf"


def test_api_documents_query_endpoint():
    query_payload = {
        "prompt": "What is our current cash balance and runway?",
        "userId": "siddharth",
        "workspaceId": "startup-001",
        "departments": ["FINANCE", "GLOBAL"],
    }
    res = client.post("/api/v1/documents/query", json=query_payload)
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["success"] is True
    assert "data" in json_data
    assert "generated_answer" in json_data["data"]
    assert "citations" in json_data["data"]
