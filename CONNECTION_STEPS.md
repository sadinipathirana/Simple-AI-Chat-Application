# Steps to Connect Frontend to Backend

## Step 1: Start the Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Verify it's running:**

- Open browser: `http://localhost:8000/docs`
- You should see the FastAPI documentation page
- Test endpoint: `http://localhost:8000/health` should return `{"status":"healthy"}`

---

## Step 2: Configure Frontend API URL

The frontend needs to know where the backend is running. The API service is configured to use:

- **Default**: `http://localhost:8000` (if no environment variable is set)
- **Custom**: Set via environment variable

### Option A: Using Create React App (CRA)

If you're using Create React App, create a `.env` file in the `frontend` directory:

```bash
cd frontend
echo "REACT_APP_API_URL=http://localhost:8000" > .env
```

### Option B: Using Vite

If you're using Vite, create a `.env` file:

```bash
cd frontend
echo "VITE_API_URL=http://localhost:8000" > .env
```

**Note:** You'll need to update `frontend/src/services/api.js` to use `import.meta.env.VITE_API_URL` instead of `process.env.REACT_APP_API_URL` for Vite.

### Option C: No Build Tool / Direct Configuration

If you're not using a build tool, you can directly edit `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = "http://localhost:8000"; // Hardcoded for now
```

---

## Step 3: Update API Service (if needed)

If you're using Vite or a different tool, update `frontend/src/services/api.js`:

**For Vite:**

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

**For Create React App (current):**

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
```

---

## Step 4: Start the Frontend

```bash
cd frontend
npm install  # If not already done
npm start    # For Create React App
# OR
npm run dev  # For Vite
```

---

## Step 5: Verify Connection

1. **Open browser DevTools** (F12)
2. **Go to Network tab**
3. **Send a message** in the chat interface
4. **Check for:**
   - Request to `http://localhost:8000/chat`
   - Status: `200 OK`
   - Response contains `{"reply": "..."}`

---

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

- Check that backend CORS is configured in `backend/app/config.py`
- Make sure `CORS_ORIGINS` includes your frontend URL (or `["*"]` for development)

### Connection Refused

- Verify backend is running: `curl http://localhost:8000/health`
- Check the port matches (default: 8000)
- Check firewall settings

### API Not Responding

- Check backend logs for errors
- Verify the endpoint: `http://localhost:8000/chat` (POST request)
- Test with curl:
  ```bash
  curl -X POST http://localhost:8000/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "Hello", "history": [], "session_id": null}'
  ```

---

## Current Backend Endpoints

- `POST /chat` - Send message and get AI response
- `GET /chat/history/{session_id}` - Get chat history
- `POST /chat/session` - Create new session
- `GET /health` - Health check
- `GET /` - API info

---

## Environment Variables Summary

### Backend (.env in `backend/` directory)

```
GEMINI_API_KEY=your_api_key_here
ENVIRONMENT=development
```

### Frontend (.env in `frontend/` directory)

**For Create React App:**

```
REACT_APP_API_URL=http://localhost:8000
```

**For Vite:**

```
VITE_API_URL=http://localhost:8000
```
