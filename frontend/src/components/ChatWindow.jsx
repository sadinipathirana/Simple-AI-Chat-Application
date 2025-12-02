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
    <div className="h-full overflow-y-auto px-6 py-6 bg-white">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-dashed border-teal-300 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
                <span className="text-4xl">💬</span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Start a conversation
          </h3>
          <p className="text-sm text-gray-500">
            Ask me anything, I'm here to help!
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
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <p className="text-sm text-gray-600 animate-pulse">
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
