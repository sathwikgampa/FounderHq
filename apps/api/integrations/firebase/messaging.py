class FirebaseMessagingWrapper:
    """Typed wrapper for Firebase Cloud Messaging push notifications."""

    async def send_notification(self, target_token: str, title: str, body: str) -> bool:
        return True


firebase_messaging = FirebaseMessagingWrapper()
