"use client";

import { Conversation } from "./messages-interface";
import { formatDistanceToNow } from "date-fns";
import { User, Users } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationList = ({ 
  conversations, 
  selectedConversationId, 
  onSelectConversation 
}: ConversationListProps) => {
  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No conversations found
      </div>
    );
  }

  return (
    <div>
      {conversations.map((conversation) => {
        const { contact, lastMessage, unreadCount, isGroup } = conversation;
        const lastMsg = lastMessage || conversation.messages[conversation.messages.length - 1];
        const timeAgo = lastMsg ? formatDistanceToNow(new Date(lastMsg.timestamp), { addSuffix: true }) : "";
        const isSelected = conversation.id === selectedConversationId;

        return (
          <div
            key={conversation.id}
            className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
              isSelected ? "bg-purple-50" : ""
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="relative flex-shrink-0">
              {contact.avatar ? (
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  {isGroup ? (
                    <Users size={20} className="text-purple-500" />
                  ) : (
                    <User size={20} className="text-purple-500" />
                  )}
                </div>
              )}
              {contact.isOnline && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
              )}
            </div>
            
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                <span className="text-xs text-gray-500">{timeAgo}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 truncate">
                  {lastMsg?.sender === "me" ? "You: " : ""}
                  {lastMsg?.content || "No messages yet"}
                </p>
                
                {unreadCount > 0 && (
                  <div className="ml-2 bg-purple-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {unreadCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList; 