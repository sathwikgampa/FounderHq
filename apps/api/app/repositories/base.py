from typing import Generic, TypeVar, Optional, List, Dict, Any
from abc import ABC, abstractmethod

T = TypeVar("T")


class BaseRepository(Generic[T], ABC):
    """Abstract Repository Pattern interface for Firebase Firestore data access."""

    @abstractmethod
    async def get_by_id(self, id: str) -> Optional[T]:
        pass

    @abstractmethod
    async def list_all(self, limit: int = 100) -> List[T]:
        pass

    @abstractmethod
    async def create(self, entity: T) -> T:
        pass

    @abstractmethod
    async def update(self, id: str, updates: Dict[str, Any]) -> Optional[T]:
        pass

    @abstractmethod
    async def delete(self, id: str) -> bool:
        pass
