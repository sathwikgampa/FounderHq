import pytest
from typing import Generator
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    """Pytest fixture providing synchronous HTTP TestClient."""
    with TestClient(app) as test_client:
        yield test_client
