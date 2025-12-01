"""Application configuration settings.""" 
import os 
from dotenv import load_dotenv   # pyright: ignore[reportMissingImports]

load_dotenv() 

class Settings:
    """Application settings loaded from environment variables."""
    # API Configuration
    API_TITLE: str = "Simple AI Chat Backend"
    API_VERSION: str = "1.0.0"
    # CORS Configuration
    CORS_ORIGINS: list = ["*"]  # For development. Limit in production.
    CORS_CREDENTIALS: bool = True
    CORS_METHODS: list = ["*"]
    CORS_HEADERS: list = ["*"]

    # Gemini API Configuration 
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    # Environment 
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

settings = Settings()