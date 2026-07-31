class FirebaseStorageWrapper:
    """Typed SDK wrapper for Firebase Cloud Storage bucket management."""

    async def generate_upload_url(self, path: str) -> str:
        return f"https://storage.googleapis.com/mock-bucket/{path}"


firebase_storage = FirebaseStorageWrapper()
