/** Message bubble component for displaying chat messages. */
import React from "react";

const MessageBubble = ({ message, isUser }) => {
  return (
    <div
      className={`flex mb-3 md:mb-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[78%] md:max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm ${
          isUser
            ? "bg-sky-600 text-white rounded-br-sm"
            : "bg-slate-100 text-slate-900 border border-slate-200 rounded-bl-sm"
        }`}
      >
        <p className="text-sm md:text-[0.95rem] leading-relaxed whitespace-pre-wrap break-words">
          {message}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
