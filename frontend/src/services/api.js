/** API service for chat interactions. */
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Send a chat message to the backend
 * @param {string}message - User message
 * @param {Array}history - Conversation history
 * @param {string}sessionid - Optional session ID
 * @returns {Promise<string>}AI response
 */
export const sendMessage = async (message, history = [], sessionid = null) => {
  try {
    const response = await api.post("/chat", {
      message,
      history,
      session_id: sessionid,
    });
    return response.data.reply;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error(
      error.response?.data?.detail || "Failed to send message.Please try again."
    );
  }
};

/**
 * Get chat history for a session.
 * @param {string} sessionId - Session ID
 * @returns {Promise<Array>}Chat history
 */
export const getChatHistory = async (sessionId) => {
  try {
    const response = await api.get(`/history/${sessionId}`);
    return response.data.history || [];
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

/**
 * Get all chat sessions
 * @returns {Promise<Array>} Array of all sessions
 */
export const getAllSessions = async () => {
  try {
    const response = await api.get("/sessions");
    return response.data.sessions || [];
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
};

/**
 * Delete chat history for a session
 * @param {string} sessionId - Session ID to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteSessionHistory = async (sessionId) => {
  try {
    const response = await api.delete(`/history/${sessionId}`);
    return response.status === 200;
  } catch (error) {
    console.error("Error deleting session:", error);
    return false;
  }
};

export default api;
