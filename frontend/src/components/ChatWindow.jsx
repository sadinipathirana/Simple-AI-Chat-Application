import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="h-full overflow-y-auto px-4 py-4 md:px-6 md:py-5 bg-slate-50">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-slate-500">
          <p className="text-sm md:text-base text-center max-w-md">
            How can I help you today?
          </p>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              message={msg.content}
              isUser={msg.role === "user"}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-3 md:mb-4">
              <div className="bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2">
                <p className="text-sm text-slate-600 animate-pulse">
                  Thinking…
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};
export default ChatWindow;
