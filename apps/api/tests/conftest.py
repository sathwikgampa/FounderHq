from collections.abc import Generator

import pytest
from app.main import app
from fastapi.testclient import TestClient


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    """Pytest fixture providing synchronous HTTP TestClient."""
    with TestClient(app) as test_client:
        yield test_client
