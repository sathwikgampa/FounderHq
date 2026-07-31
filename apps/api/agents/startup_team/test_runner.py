"""
FounderHQ Multi-Agent System - Full Verification Suite

Tests:
    1. Syntax check for all generated Python files
    2. Tool function unit tests (direct execution)
    3. Agent & runner instantiation
    4. FastAPI server + SSE endpoint smoke test (httpx)
"""

from __future__ import annotations

import io
import subprocess
import sys
import time
from pathlib import Path

# Force UTF-8 stdout on Windows to avoid cp1252 encoding errors
if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# ── Path Setup ──────────────────────────────────────────────────────────────────
ROOT = (
    Path(__file__).resolve().parents[4]
)  # FounderHq root (startup_team/agents/api/apps/FounderHq)

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 1 — Syntax Check via Python compile
# ═══════════════════════════════════════════════════════════════════════════════


def test_syntax_checks():
    print("\n" + "=" * 60)
    print("TEST 1: Python Syntax Checks")
    print("=" * 60)
    files = [
        ROOT / "apps/api/agents/startup_team/agent.py",
        ROOT / "apps/api/agents/startup_team/__init__.py",
        ROOT / "apps/api/main.py",
    ]
    all_ok = True
    for f in files:
        result = subprocess.run(
            [sys.executable, "-m", "py_compile", str(f)],
            capture_output=True,
            text=True,
        )
        status = "✅ OK" if result.returncode == 0 else f"❌ FAIL: {result.stderr.strip()}"
        print(f"  {status}  →  {f.relative_to(ROOT)}")
        if result.returncode != 0:
            all_ok = False
    assert all_ok, "One or more syntax checks failed."
    print("  → All syntax checks passed.\n")


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 2 — Tool Function Unit Tests
# ═══════════════════════════════════════════════════════════════════════════════


def test_tool_functions():
    print("=" * 60)
    print("TEST 2: Deterministic Tool Function Tests")
    print("=" * 60)

    from apps.api.agents.startup_team.agent import (
        check_runway,
        create_campaign_plan,
        draft_job_posting,
        verify_contract,
    )

    # ── check_runway ─────────────────────────────────────────────────────────
    r = check_runway(150000, 20000)
    assert r["months_of_runway"] == "7.5 months", f"Got: {r['months_of_runway']}"
    assert r["health_score"] == "ADEQUATE"
    print("  ✅ check_runway(150000, 20000) → ADEQUATE, 7.5 months")

    r2 = check_runway(500000, 30000)
    assert r2["health_score"] == "HEALTHY"
    print("  ✅ check_runway(500000, 30000) → HEALTHY")

    r3 = check_runway(50000, 20000)
    assert r3["health_score"] == "CRITICAL_RUNWAY_WARNING"
    print("  ✅ check_runway(50000, 20000) → CRITICAL_RUNWAY_WARNING")

    # ── draft_job_posting ────────────────────────────────────────────────────
    j = draft_job_posting("Senior AI Engineer", 120000)
    assert j["monthly_burn_impact_usd"] == 10000.0
    assert j["approval_status"] == "HOLD_FOR_HUMAN_APPROVAL"
    assert j["requires_human_signoff"] is True
    print(
        "  ✅ draft_job_posting('Senior AI Engineer', 120000) → HOLD_FOR_HUMAN_APPROVAL, $10,000/mo"
    )

    # ── create_campaign_plan ─────────────────────────────────────────────────
    c = create_campaign_plan("LinkedIn", 5000)
    assert c["approval_status"] == "HOLD_FOR_HUMAN_APPROVAL"
    assert c["requires_human_signoff"] is True
    cpc_clicks = round(5000 / 6.50)
    assert c["projected_metrics"]["estimated_clicks"] == cpc_clicks
    print(
        f"  ✅ create_campaign_plan('LinkedIn', 5000) → HOLD_FOR_HUMAN_APPROVAL, {cpc_clicks} clicks"
    )

    c2 = create_campaign_plan("Twitter", 1000)
    assert c2["approval_status"] == "AUTO_APPROVED"
    print("  ✅ create_campaign_plan('Twitter', 1000) → AUTO_APPROVED")

    # ── verify_contract ──────────────────────────────────────────────────────
    v_emp = verify_contract("employment")
    assert v_emp["risk_assessment"] == "MEDIUM"
    assert v_emp["clause_verification"]["ip_assignment_clause_present"] is True
    print("  ✅ verify_contract('employment') → MEDIUM risk, IP clause present")

    v_nda = verify_contract("nda")
    assert v_nda["risk_assessment"] == "LOW"
    print("  ✅ verify_contract('nda') → LOW risk")

    v_safe = verify_contract("equity/safe")
    assert v_safe["risk_assessment"] == "HIGH"
    assert v_safe["compliance_status"] == "BLOCKED_PENDING_COUNSEL"
    print("  ✅ verify_contract('equity/safe') → HIGH risk, BLOCKED_PENDING_COUNSEL")

    print("  → All tool tests passed.\n")


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 3 — Agent & Runner Instantiation
# ═══════════════════════════════════════════════════════════════════════════════


def test_agent_instantiation():
    print("=" * 60)
    print("TEST 3: Agent & Runner Instantiation")
    print("=" * 60)

    from apps.api.agents.startup_team.agent import (
        CEOAgent,
        FinanceAgent,
        GrowthAgent,
        LegalAgent,
        LocalRunner,
        TalentAgent,
        root_agent,
    )

    print(f"  ✅ CEOAgent          name='{CEOAgent.name}'  model='{CEOAgent.model}'")
    print(f"  ✅ FinanceAgent      name='{FinanceAgent.name}'  model='{FinanceAgent.model}'")
    print(f"  ✅ TalentAgent       name='{TalentAgent.name}'  model='{TalentAgent.model}'")
    print(f"  ✅ GrowthAgent       name='{GrowthAgent.name}'  model='{GrowthAgent.model}'")
    print(f"  ✅ LegalAgent        name='{LegalAgent.name}'  model='{LegalAgent.model}'")

    sub_names = [a.name for a in CEOAgent.sub_agents]
    assert sub_names == ["FinanceAgent", "TalentAgent", "GrowthAgent", "LegalAgent"]
    print(f"  ✅ sub_agents        {sub_names}")

    assert root_agent is CEOAgent
    print(f"  ✅ root_agent alias  → CEOAgent ({'✓ same object'})")

    runner = LocalRunner()
    assert runner.agent.name == "CEOAgent"
    print(f"  ✅ LocalRunner       initialized with '{runner.agent.name}'")

    print("  → All instantiation tests passed.\n")


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 4 — FastAPI Server Import & Schema Validation
# ═══════════════════════════════════════════════════════════════════════════════


def test_fastapi_server():
    print("=" * 60)
    print("TEST 4: FastAPI Server Import & Schema Validation")
    print("=" * 60)

    from apps.api.main import PlannerStreamRequest, app

    # Validate request schema
    req = PlannerStreamRequest(
        prompt=(
            "We have $150,000 balance and $20,000 monthly burn. "
            "We want to hire a Senior AI Engineer at $120,000/yr and "
            "run a $5,000 LinkedIn growth campaign. Run all checks."
        ),
        workspace_id="ws-founder-test",
    )
    assert req.prompt.startswith("We have")
    assert req.workspace_id == "ws-founder-test"
    print("  ✅ PlannerStreamRequest validated")
    print(f"     prompt[:60]: '{req.prompt[:60]}...'")
    print(f"     workspace_id: '{req.workspace_id}'")

    # Validate FastAPI routes
    routes = {r.path for r in app.routes if hasattr(r, "path")}
    assert "/api/v1/planner/stream" in routes, "SSE endpoint not found!"
    assert "/api/v1/healthz" in routes, "Health endpoint not found!"
    print("  ✅ Route: POST /api/v1/planner/stream   → registered")
    print("  ✅ Route: GET  /api/v1/healthz          → registered")
    print("  → FastAPI server tests passed.\n")


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 5 — SSE Endpoint Test via httpx TestClient (no live API key required)
# ═══════════════════════════════════════════════════════════════════════════════


def test_sse_endpoint_smoke():
    print("=" * 60)
    print("TEST 5: SSE Endpoint Smoke Test (httpx TestClient)")
    print("=" * 60)

    from fastapi.testclient import TestClient

    from apps.api.main import app

    TEST_PROMPT = (
        "We have $150,000 balance and $20,000 monthly burn. "
        "We want to hire a Senior AI Engineer at $120,000/yr and "
        "run a $5,000 LinkedIn growth campaign. Run all checks."
    )

    client = TestClient(app, raise_server_exceptions=False)
    resp = client.post(
        "/api/v1/planner/stream",
        json={"prompt": TEST_PROMPT, "workspace_id": "ws-verify-001"},
        headers={"Accept": "text/event-stream"},
        timeout=30,
    )

    print(f"  HTTP Status Code: {resp.status_code}")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"

    raw = resp.text
    print(f"  SSE Response ({len(raw)} chars) first 300 chars:")
    print(f"  {raw[:300]!r}")

    # Validate session_start event was returned
    assert (
        "session_start" in raw or "agent_chunk" in raw or "EXECUTION_STARTED" in raw
    ), "Expected session_start or agent_chunk event in SSE stream."

    print("  ✅ SSE endpoint returned 200 with valid event-stream body.")
    print("  → SSE smoke test passed.\n")


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN — Run All Tests
# ═══════════════════════════════════════════════════════════════════════════════


def main():
    print("\n" + "=" * 60)
    print("  FounderHQ Multi-Agent Backend - Full Verification Suite  ")
    print("=" * 60)

    start = time.time()

    test_syntax_checks()
    test_tool_functions()
    test_agent_instantiation()
    test_fastapi_server()
    test_sse_endpoint_smoke()

    elapsed = round(time.time() - start, 2)
    print("=" * 60)
    print(f"✅  ALL TESTS PASSED  ·  {elapsed}s")
    print("=" * 60)


if __name__ == "__main__":
    main()
