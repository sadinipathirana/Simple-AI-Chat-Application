""" Pydantic models for chat request/response schemas """
from pydantic import BaseModel  # pyright: ignore[reportMissingImports]
from typing import List,Optional


class ChatMessage(BaseModel):
    """Single chat message"""
    role:str # "user" or "assistant"
    content:str

class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    message:str
    history:List[ChatMessage]=[]
    session_id:Optional[str] = None

class ChatResponse(BaseModel):
    """Response model for chat endpoint"""
    reply:str








