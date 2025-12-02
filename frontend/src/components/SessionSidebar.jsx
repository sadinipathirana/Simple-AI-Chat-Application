import React, { useEffect, useState } from "react";
import { getAllSessions, deleteSessionHistory } from "../services/api";
import { FiX, FiTrash2 } from "react-icons/fi";

const SessionSidebar = ({
  currentSessionId,
  onSessionSelect,
  isOpen,
  onToggleSidebar,
}) => {
  const [sessions, setSessions] = useState([]);
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

    if (window.confirm("Are you sure you want to delete this chat history?")) {
      const success = await deleteSessionHistory(sessionId);
      if (success) {
        setSessions(sessions.filter((s) => s.session_id !== sessionId));
        // If deleting current session, clear it
        if (sessionId === currentSessionId) {
          onSessionSelect(null);
        }
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-slate-900 text-white transform transition-transform duration-300 z-50 lg:relative lg:translate-x-0 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700 mt-8 lg:mt-0">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <p className="text-xs text-slate-400 mt-1">
            {sessions.length} {sessions.length === 1 ? "chat" : "chats"}
          </p>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-3">
          {isLoading ? (
            <div className="text-center text-slate-400 text-sm py-4">
              Loading...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center text-slate-400 text-sm py-4">
              No chat history yet
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.session_id}
                  className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                    currentSessionId === session.session_id
                      ? "bg-sky-600 text-white"
                      : "hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        Chat Session
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(session.updated_at)}
                      </p>
                    </div>
                    <button
                      onClick={(e) =>
                        handleDeleteSession(e, session.session_id)
                      }
                      className="ml-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all p-1"
                      title="Delete this chat"
                      aria-label="Delete this chat"
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
    </>
  );
};

export default SessionSidebar;
