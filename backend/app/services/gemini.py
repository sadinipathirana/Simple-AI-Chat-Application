"""Gemini API service for handling chat interactions"""
from typing import List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI  
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from app.models.chat import ChatMessage
from app.config import settings


class GeminiService:
    """Service for interacting with Google Gemini API using LangChain."""
    
    @staticmethod
    def _get_llm():
        """Get LangChain Gemini LLM instance."""
        if not settings.GEMINI_API_KEY:
            print("GEMINI_API_KEY not found. Using mock responses.")
            print(f"   API Key length: {len(settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else 0}")
            return None

        try:
            # Use the model gemini-2.5-flash
            model_name = settings.GEMINI_MODEL or "gemini-2.5-flash"
            print(f" Initializing Gemini model: {model_name}")
            print(f" API Key present: {bool(settings.GEMINI_API_KEY)}")
            
            llm = ChatGoogleGenerativeAI(
                model=model_name,
                google_api_key=settings.GEMINI_API_KEY,
                temperature=0.8,
            )
            print(f" Gemini LLM initialized successfully")
            return llm
        except Exception as e:
            print(f" Error initializing Gemini: {e}")
            import traceback
            traceback.print_exc()
            return None

    @staticmethod
    def _convert_history(history: List[ChatMessage]) -> List:
        messages = []
        for msg in history:
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                messages.append(AIMessage(content=msg.content))
        return messages

    @staticmethod
    def _get_system_prompt() -> SystemMessage:
        return SystemMessage(content=(
            "You are a helpful, friendly, and conversational AI assistant. "
            "You are designed to be approachable, warm, and genuinely helpful. "
            "Think of yourself as a knowledgeable friend who is always ready to assist. "
            "\n\n"
            "Guidelines for your responses:\n"
            "- Be natural and conversational, like you're chatting with a friend\n"
            "- Show enthusiasm and genuine interest in helping\n"
            "- Use a warm, friendly tone throughout\n"
            "- Answer questions thoroughly but keep responses concise when appropriate\n"
            "- If you don't know something, say so honestly and offer to help find the answer\n"
            "- Use emojis sparingly and only when they add warmth (like 😊 or 👍)\n"
            "- Be proactive - if a user asks about weather, provide helpful context\n"
            "- Show empathy and understanding\n"
            "- Keep the conversation flowing naturally\n"
            "- Avoid being overly formal or robotic\n"
            "\n"
            "Remember: You're here to help, have a great conversation, and make the user feel heard and supported."
        ))

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
                print(f" Sending message to Gemini: {message[:50]}...")
                
                # Build message list with system prompt
                messages = []
                
                # Add system prompt
                system_prompt = GeminiService._get_system_prompt()
                messages.append(system_prompt)
                
                # Add conversation history
                history_messages = GeminiService._convert_history(history)
                messages.extend(history_messages)
                
                # Add current user message
                messages.append(HumanMessage(content=message))

                print(f" Total messages: {len(messages)} ({len(history_messages)} history + 1 current)")

                # Get response from LLM
                response = await llm.ainvoke(messages)
                
                print(f" Received response from Gemini")
                
                # Extract content from response
                if hasattr(response, 'content'):
                    content = str(response.content).strip()
                    print(f"   Response length: {len(content)} characters")
                    if content:
                        return content
                elif isinstance(response, str):
                    content = response.strip()
                    print(f"   Response length: {len(content)} characters")
                    if content:
                        return content
                
                # If get here, try converting
                content = str(response).strip()
                print(f"   Response (converted): {len(content)} characters")
                
                if not content or content == "None":
                    raise ValueError("Empty response from Gemini API")
                
                return content

            except Exception as e:
                print(f" Gemini API error: {e}")
                print(f"   Error type: {type(e).__name__}")
                import traceback
                traceback.print_exc()
                print(f"  Falling back to mock response")
                return GeminiService._get_mock_response(message)

        # Otherwise → use mock reply
        return GeminiService._get_mock_response(message)

    @staticmethod
    def _get_mock_response(message: str) -> str:
        """Fallback mock responses - should only be used if API fails"""
        user_text = message.lower()

        if "hi" in user_text or "hello" in user_text:
            return "Hello! 😊 How can I help you today?"
        elif "bye" in user_text or "goodbye" in user_text:
            return "Goodbye! Have a great day! 👋"
        elif "how are you" in user_text:
            return "I'm doing great, thank you for asking! How can I assist you today?"
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