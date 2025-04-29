"use client";

import { Message } from "./messages-interface";
import { Check, CheckCheck } from "lucide-react";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isMe = message.sender === "me";
  const time = format(new Date(message.timestamp), "h:mm a");

  const renderStatus = () => {
    switch (message.status) {
      case "sent":
        return <Check size={14} className="text-gray-400" />;
      case "delivered":
        return <CheckCheck size={14} className="text-gray-400" />;
      case "read":
        return <CheckCheck size={14} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-3 py-2 rounded-lg ${
          isMe
            ? "bg-purple-100 text-gray-800 rounded-tr-none"
            : "bg-white text-gray-800 rounded-tl-none"
        }`}
      >
        {message.isMedia && message.mediaUrl && (
          <div className="mb-1">
            {message.mediaType === "image" && (
              <img
                src={message.mediaUrl}
                alt="Media"
                className="rounded-md max-h-60 w-auto"
              />
            )}
            {message.mediaType === "video" && (
              <video
                src={message.mediaUrl}
                controls
                className="rounded-md max-h-60 w-auto"
              />
            )}
            {message.mediaType === "document" && (
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                <DocumentIcon />
                <span className="text-sm truncate">Document</span>
              </div>
            )}
          </div>
        )}
        
        <div className="text-sm">{message.content}</div>
        
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[10px] text-gray-500">{time}</span>
          {isMe && renderStatus()}
        </div>
      </div>
    </div>
  );
};

// Helper icon component
const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default MessageBubble; 