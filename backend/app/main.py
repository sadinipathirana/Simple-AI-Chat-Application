#*#
from fastapi import FastAPI  # pyright: ignore[reportMissingImports]
from fastapi.middleware.cors import CORSMiddleware  # pyright: ignore[reportMissingImports]
from app.config import settings
from app.routers import chat

app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins = settings.CORS_ORIGINS,
    allow_credentials = settings.CORS_CREDENTIALS,
    allow_methods = settings.CORS_METHODS,
    allow_headers = settings.CORS_HEADERS,
)

# Include routers 
app.include_router(chat.router)

@app.get("/")
async def root():
    """Root endpoint."""
    return {"message":"Simple AI Chat API","version":settings.API_VERSION}

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status":"healthy"}