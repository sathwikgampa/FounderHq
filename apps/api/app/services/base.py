from typing import TypeVar

from app.repositories.base import BaseRepository

T = TypeVar("T")


class BaseService[T]:
    """Base class for domain service layer execution."""

    def __init__(self, repository: BaseRepository[T]) -> None:
        self.repository = repository
