from pydantic import BaseModel


class AgentTaskPayload(BaseModel):
    task_id: str
    target_agent: str
    instruction: str
    parameters: dict | None = None


class AgentResponsePayload(BaseModel):
    task_id: str
    status: str
    output: str
    artifacts: list[str] | None = None
