from typing import Any


class FirebaseFirestoreWrapper:
    """Typed SDK wrapper for Firebase Firestore database access."""

    async def get_document(self, collection: str, doc_id: str) -> dict[str, Any] | None:
        return {"id": doc_id, "collection": collection}


firebase_firestore = FirebaseFirestoreWrapper()
