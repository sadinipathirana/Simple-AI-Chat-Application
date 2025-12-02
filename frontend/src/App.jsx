import { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import TextInput from "./components/TextInput";
import ChatList from "./components/ChatList";
import { sendMessage, getChatHistory } from "./services/api";
import "./styles/chat.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

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
    <div className="flex h-screen bg-gray-50">

      {/* Left-Middle Panel - Chat List */}
      <ChatList
        currentSessionId={sessionId}
        onSessionSelect={setSessionId}
        onCreateNewChat={createNewChat}
      />

      {/* Center Panel - Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 overflow-hidden">
          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>
        <TextInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

export default App;
