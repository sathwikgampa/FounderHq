from typing import Optional, List
from pydantic import BaseModel


class AgentTaskPayload(BaseModel):
    task_id: str
    target_agent: str
    instruction: str
    parameters: Optional[dict] = None


class AgentResponsePayload(BaseModel):
    task_id: str
    status: str
    output: str
    artifacts: Optional[List[str]] = None
