from typing import Any, Optional
from fastapi import HTTPException, status


class BaseAPIException(HTTPException):
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        details: Optional[Any] = None,
    ) -> None:
        super().__init__(
            status_code=status_code,
            detail={
                "success": False,
                "error": {
                    "code": code,
                    "message": message,
                    "details": details,
                },
            },
        )


class UnauthorizedException(BaseAPIException):
    def __init__(self, message: str = "Authentication credential failure.", details: Optional[Any] = None) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="UNAUTHORIZED",
            message=message,
            details=details,
        )


class ForbiddenException(BaseAPIException):
    def __init__(self, message: str = "Access forbidden for this operation.", details: Optional[Any] = None) -> None:
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            code="FORBIDDEN",
            message=message,
            details=details,
        )


class NotFoundException(BaseAPIException):
    def __init__(self, message: str = "Requested resource was not found.", details: Optional[Any] = None) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code="NOT_FOUND",
            message=message,
            details=details,
        )


class ValidationException(BaseAPIException):
    def __init__(self, message: str = "Payload validation error.", details: Optional[Any] = None) -> None:
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            code="VALIDATION_ERROR",
            message=message,
            details=details,
        )
