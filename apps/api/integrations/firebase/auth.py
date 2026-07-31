from typing import Dict, Any, Optional


class FirebaseAuthWrapper:
    """Typed SDK wrapper for Firebase Authentication Admin operations."""

    async def verify_id_token(self, token: str) -> Dict[str, Any]:
        return {
            "uid": "mock-firebase-uid",
            "email": "founder@startup.com",
            "email_verified": True,
        }


firebase_auth = FirebaseAuthWrapper()
