import React, { useState, useEffect } from "react";
import { getAllSessions, deleteSessionHistory } from "../services/api";
import {
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiMessageSquare,
  FiTrash2,
} from "react-icons/fi";

const ChatList = ({ currentSessionId, onSessionSelect, onCreateNewChat }) => {
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [currentSessionId]);

  const loadSessions = async () => {
    setIsLoading(true);
    const allSessions = await getAllSessions();
    setSessions(allSessions);
    setIsLoading(false);
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      const success = await deleteSessionHistory(sessionId);
      if (success) {
        setSessions(sessions.filter((s) => s.session_id !== sessionId));
        if (sessionId === currentSessionId) {
          onSessionSelect(null);
        }
      }
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;

    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const filteredSessions = sessions.filter((session) =>
    session.session_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
      </div>

      {/* Last Chats Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Last chats</h2>
        <div className="flex gap-2">
          <button
            onClick={onCreateNewChat}
            className="text-gray-400 hover:text-teal-600 transition-colors p-1" // Added padding for better click area
            title="New chat"
            aria-label="New chat"
          >
            <FiPlus className="h-4 w-4" />
          </button>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            title="More options"
            aria-label="More options"
          >
            <FiMoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-gray-400 text-sm py-8">
            Loading...
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            {searchQuery ? "No chats found" : "No chats yet"}
          </div>
        ) : (
          <div className="py-2">
            {filteredSessions.map((session) => (
              <div
                key={session.session_id}
                onClick={() => onSessionSelect(session.session_id)}
                className={`px-4 py-3 cursor-pointer transition-colors group ${
                  currentSessionId === session.session_id
                    ? "bg-teal-50 border-l-4 border-teal-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    <FiMessageSquare className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        Chat Session
                      </h3>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatTime(session.updated_at)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      Click to view messages...
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(e, session.session_id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all ml-2 p-1"
                    title="Delete chat"
                    aria-label="Delete chat"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
