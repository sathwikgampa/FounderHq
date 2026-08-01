"""Comprehensive API Endpoint Verification Script for FounderHQ FastAPI Backend."""

import sys
from pathlib import Path

# Add apps/api to PYTHONPATH
API_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(API_DIR))

from fastapi.testclient import TestClient  # noqa: E402

from main import app  # noqa: E402

client = TestClient(app)


def verify_all_endpoints():
    print("==========================================================")
    print("  FounderHQ API Verification Suite                        ")
    print("==========================================================")

    passed = 0
    total = 0

    endpoints_to_test = [
        ("GET", "/api/v1/healthz", None, 200),
        ("GET", "/api/v1/health/readyz", None, 200),
        ("GET", "/api/v1/agents/info", None, 200),
        ("GET", "/api/v1/agents/ceo", None, 200),
        ("GET", "/api/v1/agents/product", None, 200),
        ("GET", "/api/v1/agents/growth", None, 200),
        ("GET", "/api/v1/agents/finance", None, 200),
        ("GET", "/api/v1/agents/legal", None, 200),
        (
            "POST",
            "/api/v1/planner/execute",
            {"command": "i need to build an edutech thing", "startupId": "startup-001"},
            200,
        ),
        (
            "POST",
            "/api/v1/planner/execute",
            {"command": "hire a senior engineer for $140,000", "startupId": "startup-001"},
            200,
        ),
        ("GET", "/api/v1/approvals", None, 200),
        (
            "POST",
            "/api/v1/documents/query",
            {
                "prompt": "i need to build an edutech thing",
                "userId": "siddharth",
                "workspaceId": "startup-001",
                "departments": ["GLOBAL"],
            },
            200,
        ),
        ("GET", "/api/v1/documents", None, 200),
        ("GET", "/api/v1/startups/startup-001", None, 200),
        ("POST", "/api/v1/startups", {"name": "Test Startup HQ", "industry": "AI SaaS"}, 201),
    ]

    for method, path, payload, expected_status in endpoints_to_test:
        total += 1
        try:
            if method == "GET":
                res = client.get(path)
            elif method == "POST":
                res = client.post(path, json=payload)
            elif method == "DELETE":
                res = client.delete(path)

            if res.status_code == expected_status:
                print(f"✅ PASS: {method:<6} {path:<38} Status: {res.status_code}")
                passed += 1
            else:
                print(
                    f"❌ FAIL: {method:<6} {path:<38} Expected: {expected_status}, Got: {res.status_code} - {res.text[:100]}"
                )
        except Exception as e:
            print(f"❌ EXCEPTION: {method:<6} {path:<38} Exception: {e}")

    print("\n----------------------------------------------------------")
    print(f"Results: {passed}/{total} endpoints passed successfully ({int(passed/total*100)}%)")
    print("==========================================================\n")
    return passed == total


if __name__ == "__main__":
    success = verify_all_endpoints()
    sys.exit(0 if success else 1)
