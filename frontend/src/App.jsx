import { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import TextInput from "./components/TextInput";
import SessionSidebar from "./components/SessionSidebar";
import { sendMessage, getChatHistory } from "./services/api";
import "./styles/chat.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize session ID and load history
  useEffect(() => {
    const storedSessionId = localStorage.getItem("chatSessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
      loadChatHistory(storedSessionId);
    } else {
      createNewChat();
    }
  }, []);

  // Load chat history when session changes
  useEffect(() => {
    if (sessionId) {
      loadChatHistory(sessionId);
    }
  }, [sessionId]);

  const loadChatHistory = async (id) => {
    const history = await getChatHistory(id);
    if (history && history.length > 0) {
      const formattedMessages = history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      setMessages(formattedMessages);
    } else {
      setMessages([]);
    }
  };

  const createNewChat = () => {
    const newSessionId = `session_${Date.now()}`;
    setSessionId(newSessionId);
    localStorage.setItem("chatSessionId", newSessionId);
    setMessages([]);
  };

  const handleSendMessage = async (message) => {
    // Add user message immediately
    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare history for API (last 10 messages for context)
      const history = messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send message to backend
      const reply = await sendMessage(message, history, sessionId);

      // Add AI response
      const aiMessage = { role: "assistant", content: reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      // Show error message
      const errorMessage = {
        role: "assistant",
        content: `Error: ${error.message}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <SessionSidebar
        currentSessionId={sessionId}
        onSessionSelect={setSessionId}
        isOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main chat area */}
      <div className="chat-container flex flex-col rounded-2xl shadow-xl border border-slate-200 bg-white/90 backdrop-blur-sm overflow-hidden flex-1 m-4">
        <header className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-sky-600 to-indigo-600 text-white flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Simple AI Chat
            </h1>
            <p className="mt-1 text-sm md:text-base text-slate-100/90">
              Powered by Google Gemini
            </p>
          </div>
          <div className="flex gap-2">
            {/* Menu button for mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden bg-white/20 hover:bg-white/30 px-3 py-2 rounded text-sm transition-colors"
              title="Toggle chat history"
            >
              📋
            </button>
            {/* New Chat button */}
            <button
              onClick={createNewChat}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              title="Start a new chat"
            >
              ➕ New Chat
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>

        <TextInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

export default App;
