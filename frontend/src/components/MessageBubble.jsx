/** Message bubble component for displaying chat messages. */
import React from "react";

const MessageBubble = ({ message, isUser }) => {
  return (
    <div
      className={`flex mb-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-teal-600 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
