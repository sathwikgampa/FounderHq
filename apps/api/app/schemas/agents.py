from pydantic import BaseModel, Field


class AgentMetadata(BaseModel):
    id: str = Field(
        ..., description="Unique slug identifier for the agent (e.g., 'ceo', 'finance')"
    )
    title: str = Field(..., description="Display title of the agent")
    role: str = Field(..., description="Executive role description")
    model: str = Field(..., description="AI model backing this agent (e.g., gemini-2.5-pro)")
    tool_used: str = Field(
        default="", description="Primary deterministic tool function used by this agent"
    )
    description: str = Field(..., description="Detailed description of responsibilities")
    key_capabilities: list[str] = Field(..., description="List of core capabilities")
    status: str = Field(default="ACTIVE", description="Real-time operational status")
    default_prompt: str = Field(
        default="", description="Pre-filled prompt query for department checks"
    )


class AgentsInfoResponse(BaseModel):
    status: str = Field(default="success")
    total_agents: int = Field(..., description="Total count of agents returned")
    agents: dict[str, AgentMetadata] = Field(
        ..., description="Dictionary mapping agent key to AgentMetadata"
    )
