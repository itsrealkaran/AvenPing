"use client";

import { Conversation } from "./messages-interface";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import { Bookmark, Search, MoreVertical, User, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface MessagePanelProps {
  conversation: Conversation;
  onSendMessage: (content: string) => void;
}

const MessagePanel = ({ conversation, onSendMessage }: MessagePanelProps) => {
  const { contact, isGroup, messages } = conversation;

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
        <div className="flex items-center">
          <div className="relative">
            {contact.avatar ? (
              <img
                src={contact.avatar}
                alt={contact.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                {isGroup ? (
                  <Users size={18} className="text-gray-500" />
                ) : (
                  <User size={18} className="text-gray-500" />
                )}
              </div>
            )}
            {contact.isOnline && (
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></div>
            )}
          </div>

          <div className="ml-3">
            <h3 className="font-medium text-gray-900">{contact.name}</h3>
            <p className="text-xs text-gray-500">
              {contact.isOnline
                ? "Online"
                : contact.lastSeen
                ? `Last seen ${contact.lastSeen}`
                : isGroup
                ? `${conversation.groupMembers?.length || 0} members`
                : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700">
            <Bookmark size={18} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <Search size={18} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-[#f0f2f5]">
        <MessageList messages={messages} />
      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default MessagePanel;
