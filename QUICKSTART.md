# Quick Start Guide

## Prerequisites

- Python 3.9+ (for backend)
- Node.js 18+ (for frontend)
- Google Gemini API key (optional - app works with mock responses)

## Quick Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies (using pip)
pip install -r requirements.txt

# OR using uv (recommended)
curl -LsSf https://astral.sh/uv/install.sh | sh
uv pip install -r requirements.txt

# Create .env file
echo "GEMINI_API_KEY=your_key_here" > .env
echo "ENVIRONMENT=development" >> .env

# Run backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Features

✅ Single-page chat interface
✅ Scrollable chat window
✅ TailwindCSS styling
✅ Google Gemini API integration (with LangChain)
✅ SQLite chat history persistence
✅ Session management
✅ Mock responses when API key not configured

## API Endpoints

- `POST /chat` - Send a message and get AI response
- `GET /chat/history/{session_id}` - Get chat history
- `POST /chat/session` - Create a new session

## Troubleshooting

1. **CORS errors**: Make sure backend is running on port 8000
2. **API not responding**: Check if GEMINI_API_KEY is set (or use mock mode)
3. **Frontend not loading**: Check if Vite dev server is running
