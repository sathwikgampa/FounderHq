from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response


class WorkspaceContextMiddleware(BaseHTTPMiddleware):
    """Multi-tenant workspace context isolation middleware placeholder."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        workspace_id: str | None = request.headers.get("X-Workspace-ID", "ws-default-dev")
        request.state.workspace_id = workspace_id
        response = await call_next(request)
        response.headers["X-Workspace-ID"] = str(workspace_id)
        return response
