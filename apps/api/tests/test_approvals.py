from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_list_approvals():
    response = client.get("/api/v1/approvals")
    assert response.status_code == 200
    json_data = response.json()
    assert isinstance(json_data["data"], list)
    assert len(json_data["data"]) >= 1


def test_approve_action():
    appr_res = client.get("/api/v1/approvals")
    appr_id = appr_res.json()["data"][0]["id"]

    response = client.post(f"/api/v1/approvals/{appr_id}/approve")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["data"]["status"] == "APPROVED"
