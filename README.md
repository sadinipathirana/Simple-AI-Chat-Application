# Simple-AI-Chat-Application

## Project Overview

A single-page chat application with a React frontend and FastAPI backend. It uses Google Gemini via LangChain for conversational AI, with SQLite for chat history and session management.

### Features

- ✅ Single-page chat interface with modern UI
- ✅ Google Gemini API integration (via LangChain)
- ✅ SQLite chat history persistence
- ✅ Session management (multiple chat sessions)
- ✅ Friendly, conversational AI responses
- ✅ Real-time chat with message history
- ✅ Responsive design with TailwindCSS

---

## Architecture

### System Architecture

```
┌─────────────────┐
│   React Frontend │
│   (Port 3000)    │
└────────┬─────────┘
         │ HTTP/REST
         │
┌────────▼─────────┐
│  FastAPI Backend  │
│   (Port 8000)     │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐  ┌─▼────────┐
│Gemini │  │ SQLite   │
│  API  │  │ Database │
└───────┘  └──────────┘
```

### Component Flow

1. User sends message → Frontend (React)
2. Frontend → Backend API (`POST /chat`)
3. Backend → Gemini Service (LangChain)
4. Gemini Service → Google Gemini API
5. Response flows back through the chain
6. Messages saved to SQLite database
7. Frontend displays response

---

## Technology Stack

### Backend

- **Python 3.9+**
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **LangChain** - LLM framework
- **LangChain Google GenAI** - Gemini integration
- **SQLite** - Database
- **Pydantic** - Data validation
- **python-dotenv** - Environment variables

### Frontend

- **React 18+**
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **React Scripts** - Build tooling

---

## Setup Instructions

### Prerequisites

1. **Python 3.9+**

   - Download from [python.org](https://www.python.org/downloads/)
   - Verify: `python --version` or `py --version`

2. **Node.js 18+**

   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version`

3. **Google Gemini API Key** (Required for real AI responses)
   - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Free tier available

## How to Set Up Google Gemini API

### Why You're Seeing Mock Responses

If you see messages like:

- "I see: 'your message'. (Mock reply — add GEMINI_API_KEY for real AI responses.)"

This means the Gemini API key is not configured. The app is using mock responses instead.

## Steps to Get Real AI Responses

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy your API key (it looks like: `AIzaSy...`)

---

## How to Start the Project

### Step 1: Clone/Download the Project

```bash
# Navigate to project directory
cd Simple-AI-Chat-Application
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory

```bash
cd backend
```

#### 2.2 Install Python Dependencies

**Option A: Using pip (Recommended)**

```bash
pip install -r requirements.txt
```

**Option B: Using Python launcher (Windows)**

```bash
py -m pip install -r requirements.txt
```

**Option C: Using uv (Fast)**

```bash
# Install uv first
curl -LsSf https://astral.sh/uv/install.sh | sh
# Then install dependencies
uv pip install -r requirements.txt
```

#### 2.3 Create `.env` File

Create a `.env` file in the `backend/` directory:

**Windows (PowerShell):**

```powershell
Set-Content -Path .env -Value "GEMINI_API_KEY=your_api_key_here`nENVIRONMENT=development`nGEMINI_MODEL=gemini-2.5-flash"
```

**Linux/Mac:**

```bash
cat > .env << EOF
GEMINI_API_KEY=gemini_api_key_here
ENVIRONMENT=development
GEMINI_MODEL=gemini-2.5-flash
EOF
```

**Or manually create `.env` file:**

```
GEMINI_API_KEY=AIzaSyDjYnU-_R_2Nkbdc3IA1KjreK5u9BPb_Qo
ENVIRONMENT=development
GEMINI_MODEL=gemini-2.5-flash
```

**Important:** Replace `gemini_api_key_here` with your actual Gemini API key.

#### 2.4 Start Backend Server

```bash
# Using uvicorn directly
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Or using Python launcher (Windows)
py -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Expected Output:**

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
Initializing Gemini model: gemini-2.5-flash
Gemini LLM initialized successfully
```

**Keep this terminal window open!**

### Step 3: Frontend Setup

#### 3.1 Open a New Terminal Window

Keep the backend running and open a new terminal.

#### 3.2 Navigate to Frontend Directory

```bash
cd frontend
```

#### 3.3 Install Node Dependencies

```bash
npm install
```

This may take a few minutes.

#### 3.4 Start Frontend Development Server

```bash
npm start
```

**Expected Output:**

Compiled successfully!

You can now view frontend in the browser.

Local: http://localhost:3000
On Your Network: http://192.168.x.x:3000

The browser should automatically open to `http://localhost:3000`.

### Step 4: Access the Application

- **Frontend UI:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health
