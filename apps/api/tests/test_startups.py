from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_get_startup():
    response = client.get("/api/v1/startups/startup-001")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["id"] == "startup-001"
    assert "name" in json_data["data"]


def test_create_startup():
    payload = {
        "name": "Test Founder HQ Startup",
        "industry": "AI & Robotics",
        "stage": "Seed",
        "mrr": 50000.0,
        "burnRate": 20000.0,
        "cashBalance": 400000.0,
        "teamSize": 8,
    }
    response = client.post("/api/v1/startups", json=payload)
    assert response.status_code == 201
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["name"] == "Test Founder HQ Startup"
    assert json_data["data"]["runwayMonths"] == 20.0
