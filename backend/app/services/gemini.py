"""Gemini API service for handling chat interactions"""
from typing import List, Optional

from langchain_google_genai import ChatGoogleGenerativeAI  # pyright: ignore[reportMissingImports]
from langchain_core.messages import HumanMessage, AIMessage  # pyright: ignore[reportMissingImports]
from app.config import settings
from app.models.chat import ChatMessage


class GeminiService:
    """Service for interacting with Google Gemini API using LangChain."""

    @staticmethod
    def _get_llm():
        """Get LangChain Gemini LLM instance."""
        if not settings.GEMINI_API_KEY:
            print("⚠️  GEMINI_API_KEY not found. Using mock responses.")
            return None

        try:
            # Use the model from settings, default to gemini-1.5-flash (faster and free tier friendly)
            model_name = settings.GEMINI_MODEL or "gemini-2.5-flash"
            print(f"🤖 Using Gemini model: {settings.GEMINI_MODEL}")
            
            return ChatGoogleGenerativeAI(
                model=settings.GEMINI_MODEL,
                google_api_key=settings.GEMINI_API_KEY,
                temperature=0.1,
            )
        except Exception as e:
            print(f"⚠️  Error initializing Gemini: {e}. Using mock responses.")
            return None

    @staticmethod
    def _convert_history(history: List[ChatMessage]) -> List:
        """Convert chat history to LangChain message format."""
        messages = []
        for msg in history:
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                messages.append(AIMessage(content=msg.content))
        return messages

    @staticmethod
    async def get_chat_response(
        message: str,
        history: Optional[List[ChatMessage]] = None
    ) -> str:

        history = history or []
        llm = GeminiService._get_llm()

        # If Gemini API works → use it
        if llm:
            try:
                messages = GeminiService._convert_history(history)
                messages.append(HumanMessage(content=message))

                response = await llm.ainvoke(messages)
                return response.content

            except Exception as e:
                print(f"⚠️  Gemini API error: {e}. Falling back to mock response.")
                return GeminiService._get_mock_response(message)

        # Otherwise → use mock reply
        return GeminiService._get_mock_response(message)

    @staticmethod
    def _get_mock_response(message: str) -> str:
        user_text = message.lower()

        if "hi" in user_text or "hello" in user_text:
            return "Hello! How can I help you today?"
        elif "bye" in user_text or "goodbye" in user_text:
            return "Goodbye! Have a great day!"
        elif "how are you" in user_text:
            return "I'm doing great! How can I assist you?"
        elif "?" in message:
            return (
                f"Interesting question about '{message}'. "
                f"(Mock reply — add GEMINI_API_KEY for real AI responses.)"
            )
        else:
            return (
                f"I see: '{message}'. "
                f"(Mock reply — add GEMINI_API_KEY for real AI responses.)"
            )