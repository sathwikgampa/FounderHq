from typing import Any


class FirebaseAuthWrapper:
    """Typed SDK wrapper for Firebase Authentication Admin operations."""

    async def verify_id_token(self, token: str) -> dict[str, Any]:
        return {
            "uid": "mock-firebase-uid",
            "email": "founder@startup.com",
            "email_verified": True,
        }


firebase_auth = FirebaseAuthWrapper()
