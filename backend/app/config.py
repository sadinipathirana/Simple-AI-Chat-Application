"""Application configuration settings.""" 
import os 
from pathlib import Path
from dotenv import load_dotenv 

# Get the backend directory (parent of app directory)
BACKEND_DIR = Path(__file__).parent.parent
ENV_FILE = BACKEND_DIR / ".env"

# Load .env file explicitly from backend directory
if ENV_FILE.exists():
    load_dotenv(dotenv_path=ENV_FILE)
    print(f" Loaded .env file from: {ENV_FILE}")
else:
    # Fallback to default load_dotenv behavior
    load_dotenv()
    print(f" .env file not found at {ENV_FILE}, using default load_dotenv()") 

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