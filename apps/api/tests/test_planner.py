from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_execute_planner_command():
    payload = {
        "startupId": "startup-001",
        "command": "Analyze runway and review hiring proposal for Senior AI Engineer"
    }
    response = client.post("/api/v1/planner/execute", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "executionId" in json_data["data"]
    assert json_data["data"]["requiresApproval"] is True


def test_get_execution_status():
    payload = {
        "startupId": "startup-001",
        "command": "Calculate financial projections for Q3"
    }
    exec_res = client.post("/api/v1/planner/execute", json=payload)
    exec_id = exec_res.json()["data"]["executionId"]

    status_res = client.get(f"/api/v1/planner/executions/{exec_id}")
    assert status_res.status_code == 200
    json_data = status_res.json()
    assert json_data["success"] is True
    assert json_data["data"]["executionId"] == exec_id
