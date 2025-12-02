# How to Set Up Google Gemini API

## Why You're Seeing Mock Responses

If you see messages like:

- "I see: 'your message'. (Mock reply — add GEMINI_API_KEY for real AI responses.)"

This means the Gemini API key is not configured. The app is using mock responses instead.

## Steps to Get Real AI Responses

### Step 1: Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy your API key (it looks like: `AIzaSy...`)

### Step 2: Create `.env` File in Backend Directory

```bash
cd backend
```

Create a file named `.env` in the `backend` directory:

```bash
touch .env
```

Or on Windows:

```cmd
type nul > .env
```

### Step 3: Add Your API Key

Open the `.env` file and add:

```env
GEMINI_API_KEY=your_actual_api_key_here
ENVIRONMENT=development
```

**Example:**

```env
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
ENVIRONMENT=development
```

### Step 4: Restart the Backend Server

**Important:** You must restart the backend server for the changes to take effect!

1. Stop the current server (Press `CTRL+C` in the terminal)
2. Start it again:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Step 5: Verify It's Working

1. Check the backend terminal - you should **NOT** see:

   - `⚠️  GEMINI_API_KEY not found. Using mock responses.`

2. Send a message in the frontend
3. You should get a real AI response instead of mock responses

## Troubleshooting

### Still Getting Mock Responses?

1. **Check the `.env` file location:**

   - Must be in the `backend/` directory (same level as `app/` folder)
   - Not in the root project directory

2. **Check the `.env` file format:**

   - No quotes around the API key
   - No spaces around the `=` sign
   - Correct format: `GEMINI_API_KEY=AIzaSy...`

3. **Restart the server:**

   - Environment variables are loaded when the server starts
   - Changes to `.env` require a server restart

4. **Check backend terminal:**

   - Look for error messages about the API key
   - Check if you see: `⚠️  GEMINI_API_KEY not found`

5. **Verify API key is valid:**
   - Make sure you copied the entire key
   - Try creating a new API key if the current one doesn't work

### API Key Errors

If you see errors like:

- `API key not valid`
- `Permission denied`
- `Quota exceeded`

- Check that your API key is correct
- Make sure billing is enabled (if required)
- Check API quotas in Google Cloud Console

## File Structure

Your `.env` file should be here:

```
backend/
├── .env              ← HERE
├── app/
│   ├── main.py
│   └── ...
├── requirements.txt
└── ...
```

## Security Note

⚠️ **Never commit your `.env` file to Git!**

The `.env` file should already be in `.gitignore`. Make sure it contains:

```
.env
```

## Test Without API Key

If you want to test without an API key, the app will continue to work with mock responses. This is useful for:

- Development without API costs
- Testing the UI
- Learning the codebase

But for real AI responses, you need a valid Gemini API key.
