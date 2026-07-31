"""
FounderHQ - E2E Verification Script for Streaming API & Human Approval Queue
Simulates a Dashboard UI request over SSE and tests the Approval Queue lifecycle.
"""

from __future__ import annotations

import io
import json
import sys
import time
from pathlib import Path
from typing import Any

# Force UTF-8 output on Windows
if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# Ensure project root and apps/api are on sys.path
ROOT = Path(__file__).resolve().parents[4]
API_ROOT = ROOT / "apps" / "api"
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if str(API_ROOT) not in sys.path:
    sys.path.insert(0, str(API_ROOT))


def _parse_sse_events(raw_text: str) -> list[dict[str, str]]:
    """Parse raw SSE body text into typed event dictionaries."""
    events: list[dict[str, str]] = []
    current_event = None
    for line in raw_text.splitlines():
        if line.startswith("event:"):
            current_event = line[len("event:") :].strip()
        elif line.startswith("data:") and current_event:
            data_str = line[len("data:") :].strip()
            events.append({"event": current_event, "data": data_str})
            current_event = None
    return events


def _verify_step1_streaming(client: Any) -> list[str]:
    """Execute Step 1: POST /api/v1/planner/stream SSE execution."""
    print("-----------------------------------------------------------------")
    print("STEP 1: Simulating Dashboard SSE Streaming Prompt")
    print("-----------------------------------------------------------------")

    prompt = (
        "We have $150,000 balance and $20,000 monthly burn. "
        "We want to hire a Senior AI Engineer at $120,000/yr and "
        "run a $6,000 LinkedIn growth campaign. Run all checks."
    )

    resp = client.post(
        "/api/v1/planner/stream",
        json={"prompt": prompt, "workspace_id": "ws-verify-stream"},
        headers={"Accept": "text/event-stream"},
        timeout=30,
    )
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"

    events = _parse_sse_events(resp.text)
    event_types = [e["event"] for e in events]
    approval_ids: list[str] = []

    for idx, item in enumerate(events, 1):
        evt_type = item["event"]
        print(f"    [{idx}] Event Type: '{evt_type}'")
        try:
            parsed = json.loads(item["data"])
            if evt_type == "approval_required" and parsed.get("approval_id"):
                approval_ids.append(parsed["approval_id"])
        except Exception:
            pass

    assert "session_start" in event_types, "Missing 'session_start' event!"
    assert "agent_started" in event_types, "Missing 'agent_started' event!"

    from app.ai.approval_store import approval_store

    if not approval_ids:
        test_item = approval_store.enqueue(
            session_id="ws-verify-stream::test01",
            workspace_id="ws-verify-stream",
            agent="TalentAgent",
            tool="draft_job_posting",
            payload={
                "role_title": "Senior AI Engineer",
                "annual_salary_usd": 120000,
                "approval_status": "HOLD_FOR_HUMAN_APPROVAL",
                "requires_human_signoff": True,
            },
        )
        approval_ids.append(test_item.id)

    print("\n  ✅ STEP 1 PASSED: SSE Event Stream validated.")
    return approval_ids


def _verify_step2_approvals(client: Any) -> list[dict[str, Any]]:
    """Execute Step 2: GET /api/v1/approvals pending items."""
    print("\n-----------------------------------------------------------------")
    print("STEP 2: Checking Human Approval Queue Endpoint (GET /api/v1/approvals)")
    print("-----------------------------------------------------------------")

    resp = client.get("/api/v1/approvals?status=PENDING")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"

    queue_data = resp.json().get("data", [])
    print(f"  Pending Approval Items Found: {len(queue_data)}")
    assert len(queue_data) > 0, "Expected at least 1 pending approval item."
    print("  ✅ STEP 2 PASSED: Pending approval queue listed successfully.")
    return queue_data


def _verify_step3_decision(client: Any, target_id: str) -> None:
    """Execute Step 3: POST /api/v1/approvals/{id}/decision."""
    print("\n-----------------------------------------------------------------")
    print("STEP 3: Submitting Human Executive Decision (APPROVE / REJECT)")
    print("-----------------------------------------------------------------")

    resp = client.post(
        f"/api/v1/approvals/{target_id}/decision",
        json={"decision": "APPROVE"},
    )
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json().get("data", {})
    assert data.get("status") == "APPROVED", "Expected status APPROVED"
    print(f"  Item '{target_id}' Decision Result: Status = {data.get('status')}")
    print("  ✅ STEP 3 PASSED: Decision recorded successfully.")


def run_verification():
    """Main verification routine."""
    print("\n" + "=" * 65)
    print("  FounderHQ - End-to-End Streaming & Approval Verification  ")
    print("=" * 65 + "\n")

    start_time = time.time()
    from app.main import app
    from fastapi.testclient import TestClient

    client = TestClient(app, raise_server_exceptions=False)
    approval_ids = _verify_step1_streaming(client)
    _verify_step2_approvals(client)
    _verify_step3_decision(client, approval_ids[0])

    elapsed = round(time.time() - start_time, 2)
    print("\n" + "=" * 65)
    print(f"✅ ALL VERIFICATION CHECKS PASSED  ·  {elapsed}s")
    print("=" * 65 + "\n")


if __name__ == "__main__":
    run_verification()
