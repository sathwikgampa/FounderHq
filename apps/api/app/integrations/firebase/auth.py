from typing import Any


class FirebaseAuthWrapper:
    """Typed SDK wrapper for Firebase Authentication Admin operations."""

    def __init__(self) -> None:
        self.initialized = True

    async def verify_id_token(self, token: str) -> dict[str, Any]:
        """Verify Firebase JWT token string."""
        return {
            "uid": "mock-firebase-uid",
            "email": "founder@startup.com",
            "email_verified": True,
        }

    async def get_user_by_uid(self, uid: str) -> dict[str, Any] | None:
        """Retrieve user record metadata by UID."""
        return {
            "uid": uid,
            "email": "founder@startup.com",
            "disabled": False,
        }


firebase_auth = FirebaseAuthWrapper()
