/**Text input component for chat messages */
import React, { useState } from "react";

const TextInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-white"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder:text-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="px-6 py-3 text-sm font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        Send
      </button>
    </form>
  );
};

export default TextInput;
