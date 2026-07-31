from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_upload_and_delete_document():
    upload_payload = {
        "filename": "q3_financial_model.pdf",
        "category": "financial",
        "startupId": "startup-001"
    }
    res = client.post("/api/v1/documents/upload", json=upload_payload)
    assert res.status_code == 201
    json_data = res.json()
    assert json_data["success"] is True
    doc_id = json_data["data"]["id"]

    # Verify listing includes doc
    list_res = client.get("/api/v1/documents?startupId=startup-001")
    assert list_res.status_code == 200

    # Delete doc
    del_res = client.delete(f"/api/v1/documents/{doc_id}")
    assert del_res.status_code == 200
    assert del_res.json()["data"]["deleted"] is True
