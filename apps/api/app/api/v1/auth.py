from typing import Dict, Any
from fastapi import APIRouter, Depends
from app.middleware.jwt_auth import jwt_auth
from app.schemas.common import APIResponseEnvelope

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/me", response_model=APIResponseEnvelope[Dict[str, Any]])
async def get_current_user_profile(
    user: Dict[str, Any] = Depends(jwt_auth.verify_token)
) -> APIResponseEnvelope[Dict[str, Any]]:
    """Retrieve authenticated user token claims and profile information."""
    return APIResponseEnvelope(
        data=user,
        message="User profile verified successfully.",
    )
