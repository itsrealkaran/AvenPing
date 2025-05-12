"use client";

import { Conversation } from "./messages-interface";
import { formatDistanceToNow } from "date-fns";
import { User, Filter } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import SearchableDropdown from "@/components/ui/searchable-dropdown";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string;
  onSelectConversation: (conversation: Conversation) => void;
}

type FilterType = "all" | "unread" | "label";

const ConversationList = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  // Extract unique labels from conversations
  const labels = Array.from(
    new Set(
      conversations
        .map((conv) => conv.contact.label)
        .filter((label): label is string => !!label)
    )
  );

  const labelItems = labels.map((label) => ({
    id: label,
    label: label,
    value: label,
  }));

  // Filter conversations based on active filter
  const filteredConversations = conversations.filter((conversation) => {
    if (activeFilter === "unread") {
      return conversation.unreadCount > 0;
    }
    if (activeFilter === "label" && selectedLabel) {
      return conversation.contact.label === selectedLabel;
    }
    return true;
  });

  const handleLabelSelect = useCallback(
    (item: { id: string; label: string; value: string }) => {
      setSelectedLabel(item.value);
      setActiveFilter("label");
    },
    []
  );

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No conversations found
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pt-0 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setActiveFilter("all");
              setSelectedLabel(null);
            }}
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
              activeFilter === "all"
                ? "bg-active-filter-bg text-active-filter font-medium"
                : "text-gray-600 bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setActiveFilter("unread");
              setSelectedLabel(null);
            }}
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
              activeFilter === "unread"
                ? "bg-active-filter-bg text-active-filter font-medium"
                : "text-gray-600 bg-gray-100"
            }`}
          >
            Unread
          </button>
          <SearchableDropdown
            items={labelItems}
            placeholder="Label"
            onSelect={handleLabelSelect}
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
              activeFilter === "label"
                ? "bg-active-filter-bg text-active-filter font-medium"
                : "text-gray-600 bg-gray-100"
            }`}
            selectedLabel={selectedLabel}
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredConversations.map((conversation) => {
          const { contact, lastMessage, unreadCount } = conversation;
          const lastMsg =
            lastMessage ||
            conversation.messages[conversation.messages.length - 1];
          const timeAgo = lastMsg
            ? formatDistanceToNow(new Date(lastMsg.timestamp), {
                addSuffix: true,
              })
            : "";
          const isSelected = conversation.id === selectedConversationId;

          return (
            <div
              key={conversation.id}
              className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                isSelected ? "bg-gray-50" : ""
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
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={20} className="text-gray-500" />
                  </div>
                )}
                {contact.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-primary border-2 border-white"></div>
                )}
              </div>

              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {contact.name}
                    </h3>
                  </div>
                  <span
                    className={`text-xs ${
                      unreadCount > 0
                        ? "font-semibold text-unread-timestamp"
                        : "text-gray-500"
                    } flex-shrink-0`}
                  >
                    {timeAgo}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 truncate">
                    {lastMsg?.sender === "me" ? "You: " : ""}
                    {lastMsg?.content || "No messages yet"}
                  </p>

                  {unreadCount > 0 && (
                    <div className="ml-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0">
                      {unreadCount}
                    </div>
                  )}
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
