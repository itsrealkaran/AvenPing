"use client";

import { useState, useEffect } from "react";
import ConversationList from "./conversation-list";
import MessagePanel from "./message-panel";
import { Search, MessageSquare, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import MessageCard from "./message-card";
import SearchableDropdown from "@/components/ui/searchable-dropdown";
import { useMessages } from "@/context/messages-context";

// Updated type definitions
export type Contact = {
  id: string;
  name: string;
  phone: string;
  isOnline?: boolean;
  label?: string;
};

export type Message = {
  id: string;
  message: string;
  createdAt: string;
  status: "SENT" | "DELIVERED" | "READ";
  isOutbound: boolean;
};

export type Conversation = {
  id: string;
  phoneNumber: string;
  name: string;
  messages: Message[];
};

type FilterType = "all" | "unread" | "label";

const Loading = () => (
  <div className="flex flex-col py-10 items-center justify-center text-gray-500">
    <Loader2 className="h-10 w-10 mb-4 opacity-30 animate-spin" />
  </div>
);

const MessagesInterface = () => {
  const { conversations, sendMessage, isLoading, searchQuery, setSearchQuery, labels, isLabelsLoading, labelsError, setLabel } = useMessages();

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [componentHeight, setComponentHeight] = useState("450px");

  const handleLabelSelect = (item: {
    id: string;
    label: string;
    value: string;
  }) => {
    setLabel(item.value);
    setActiveFilter("label");
  };

  useEffect(() => {
    // Set the first conversation as selected by default
    if (!conversations) return;
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const handleSendMessage = async (message: string) => {
    if (!selectedConversationId || !message.trim() || !conversations) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      message,
      createdAt: new Date().toISOString(),
      isOutbound: true,
      status: "SENT",
    };

    await sendMessage(newMessage, selectedConversationId);

    // Update the selected conversation with the new message
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
        };
      }
      return conv;
    });

    setSelectedConversationId(updatedConversations[0].id);
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversationId(conversation.id);
  };

  const selectedConversation = conversations?.find(
    (conv) => conv.id === selectedConversationId
  );

  return (
    <MessageCard>
      {/* Sidebar */}
      <div
        className={`w-1/3 md:w-1/3 border-r border-gray-200 flex flex-col max-w-[350px] min-w-[280px]`}
      >
        <div className="p-3 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search chats, labels or contacts"
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={(e) => {
                setLabel(null);
                setActiveFilter("all");
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
                setLabel("unread");
                setActiveFilter("unread");
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
              items={labels ?labels.map((label) => ({
                id: label.id,
                label: label.name,
                value: label.name,
              })) : []}
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
        <div>
          {isLoading ? (
            <Loading />
          ) : !conversations || conversations.length === 0 ? (
            <div className="flex flex-col py-10 items-center justify-center text-gray-500">
              <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
              <p>No messages yet</p>
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId || ""}
              onSelectConversation={handleConversationSelect}
            />
          )}
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <MessagePanel
            conversation={selectedConversation}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No chat selected</h3>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </MessageCard>
  );
};

export default MessagesInterface;
