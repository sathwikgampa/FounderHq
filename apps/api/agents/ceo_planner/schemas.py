from pydantic import BaseModel


class PlannerExecutionSchema(BaseModel):
    command: str
    workspace_id: str
