from typing import Generic, TypeVar
from app.repositories.base import BaseRepository

T = TypeVar("T")


class BaseService(Generic[T]):
    """Base class for domain service layer execution."""

    def __init__(self, repository: BaseRepository[T]) -> None:
        self.repository = repository
