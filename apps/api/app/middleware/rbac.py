from typing import Any

from app.core.exceptions import ForbiddenException
from app.middleware.jwt_auth import jwt_auth
from fastapi import Depends


class RBACMiddleware:
    """Role-Based Access Control placeholder dependency validator."""

    def __init__(self, allowed_roles: list[str]) -> None:
        self.allowed_roles = allowed_roles

    def __call__(self, user: dict[str, Any] = Depends(jwt_auth.verify_token)) -> dict[str, Any]:
        user_role = user.get("role", "GUEST")
        if user_role not in self.allowed_roles:
            raise ForbiddenException(
                f"User role '{user_role}' lacks required permissions ({self.allowed_roles})."
            )
        return user


def require_role(roles: list[str]) -> RBACMiddleware:
    return RBACMiddleware(allowed_roles=roles)
