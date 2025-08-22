"use client";

import { Conversation } from "./messages-interface";
import { formatDistanceToNow } from "date-fns";
import { generateColorFromString, getFirstLetter } from "@/lib/utils";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationList = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) => {
  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No conversations found
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-t border-gray-100">
      <div className="overflow-y-auto flex-1">
        {conversations.map((conversation) => {
          const { name, phoneNumber, messages } = conversation;
          const contact = {
            name,
            phoneNumber,
            isOnline: true,
            unreadCount: conversation.unreadCount,
          };
          const lastMsg = messages[messages.length - 1];
          const timeAgo = lastMsg
            ? formatDistanceToNow(new Date(lastMsg.createdAt), {
                addSuffix: true,
              })
            : "";
          const isSelected = conversation.id === selectedConversationId;

          return (
            <div
              key={conversation.id}
              className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                isSelected ? "bg-gray-50" : ""
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="relative flex-shrink-0">
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center text-white text-lg shadow-sm"
                  style={{
                    backgroundColor: generateColorFromString(contact.name),
                  }}
                >
                  {getFirstLetter(contact.name)}
                </div>
                {contact.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                )}
              </div>

              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {contact.name}
                    </h3>
                  </div>
                  {!isSelected &&
                  conversation.unreadCount &&
                  conversation.unreadCount > 0 ? (
                    <span
                      className={`text-xs ${
                        conversation.unreadCount > 0
                          ? "font-semibold text-unread-timestamp"
                          : "text-gray-500"
                      } flex-shrink-0`}
                    >
                      {timeAgo}
                    </span>
                  ) : null}
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 truncate">
                    {lastMsg?.isOutbound ? "You: " : ""}
                    {lastMsg?.message || "No messages yet"}
                  </p>

                  {!isSelected &&
                  conversation.unreadCount &&
                  conversation.unreadCount > 0 ? (
                    <div className="ml-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0">
                      {conversation.unreadCount}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
