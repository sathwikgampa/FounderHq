from abc import ABC, abstractmethod
from typing import Any, TypeVar

T = TypeVar("T")


class BaseRepository[T](ABC):
    """Abstract Repository Pattern interface for Firebase Firestore data access."""

    @abstractmethod
    async def get_by_id(self, id: str) -> T | None:
        pass

    @abstractmethod
    async def list_all(self, limit: int = 100) -> list[T]:
        pass

    @abstractmethod
    async def create(self, entity: T) -> T:
        pass

    @abstractmethod
    async def update(self, id: str, updates: dict[str, Any]) -> T | None:
        pass

    @abstractmethod
    async def delete(self, id: str) -> bool:
        pass
