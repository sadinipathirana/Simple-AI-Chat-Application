"""Chat API routes"""
from fastapi import APIRouter, HTTPException  # pyright: ignore[reportMissingImports]
from app.models.chat import ChatRequest, ChatResponse
from app.services.gemini import GeminiService
from app.services.chat_history import ChatHistoryService

router = APIRouter(tags=["chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest) -> ChatResponse:

    try:
        # Get AI response using Gemini service
        reply = await GeminiService.get_chat_response(
            message=req.message,
            history=req.history
        )

        # Save chat history
        if req.session_id:
            ChatHistoryService.save_message(
                session_id=req.session_id,
                role="user",
                content=req.message
            )

            ChatHistoryService.save_message(
                session_id=req.session_id,
                role="assistant",
                content=reply
            )

        return ChatResponse(reply=reply)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat request: {str(e)}"
        )

@router.post("/session")
async def create_session():
    """Create a new chat session"""
    session_id = ChatHistoryService.create_session()
    return {"session_id": session_id}

@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    history = ChatHistoryService.get_history(session_id)
    return {"session_id": session_id, "history": history}

@router.get("/sessions")
async def get_all_sessions():
    """Get all chat sessions"""
    sessions = ChatHistoryService.get_all_sessions()
    return {"sessions": sessions}

@router.delete("/history/{session_id}")
async def delete_chat_history(session_id: str):
    """Delete chat history for a session"""
    success = ChatHistoryService.delete_session(session_id)
    if success:
        return {"message": "History deleted successfully", "session_id": session_id}
    else:
        raise HTTPException(
            status_code=500,
            detail="Failed to delete chat history"
        )