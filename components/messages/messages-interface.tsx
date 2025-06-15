"use client";

import { useState, useEffect } from "react";
import ConversationList from "./conversation-list";
import MessagePanel from "./message-panel";
import { Search, MessageSquare } from "lucide-react";
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

const MessagesInterface = () => {
  const { conversations, sendMessage } = useMessages();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  // Extract unique labels from conversations
  // const labels = Array.from(
  //   new Set(
  //     conversations
  //       .map((conv) => conv.label)
  //       .filter((label): label is string => !!label)
  //   )
  // );

  // const labelItems = labels.map((label) => ({
  //   id: label,
  //   label: label,
  //   value: label,
  // }));

  const handleLabelSelect = (item: {
    id: string;
    label: string;
    value: string;
  }) => {
    setSelectedLabel(item.value);
    setActiveFilter("label");
  };

  useEffect(() => {
    // Set the first conversation as selected by default
    if (!conversations) return;
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (!conversations) {
    // make a proper loading state
    return (
      <div className="flex h-[84vh]">
        <div className="w-1/3 border-r border-gray-200 bg-white">
          <div className="h-full flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
            <p className="text-sm text-gray-500 mt-4">Loading conversations...</p>
          </div>
        </div>
        <div className="w-2/3 bg-gray-50 flex flex-col items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-lg px-8">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <p className="text-sm text-gray-500 mt-8">Loading messages...</p>
        </div>
      </div>
    )
  }
  // Filter conversations based on search and active filter
  const filteredConversations = conversations.filter((conversation) => {
    // First apply search filter
    const matchesSearch =
      conversation.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conversation.phoneNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) 
    //   conversation.label
    //     ?.toLowerCase()
    //     .includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Then apply type filter
    if (activeFilter === "unread") {
      return conversation.messages.length > 0;
    }
    // if (activeFilter === "label" && selectedLabel) {
    //   return conversation.label === selectedLabel;
    // }
    return true;
  });

  const handleSendMessage = async (message: string) => {
    if (!selectedConversationId || !message.trim()) return;

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

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );

  return (
    <MessageCard>
      {/* Sidebar */}
      <div className="w-1/3 md:w-1/3 border-r border-gray-200 flex flex-col max-w-[350px] min-w-[280px] h-[84vh]">
        <div className="p-3 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search chats, labels or contacts"
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={() => {
                setActiveFilter("all");
                setSelectedLabel(null);
              }}
              className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${activeFilter === "all"
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
              className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${activeFilter === "unread"
                  ? "bg-active-filter-bg text-active-filter font-medium"
                  : "text-gray-600 bg-gray-100"
                }`}
            >
              Unread
            </button>
            <SearchableDropdown
              items={[]}
              placeholder="Label"
              onSelect={handleLabelSelect}
              className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${activeFilter === "label"
                  ? "bg-active-filter-bg text-active-filter font-medium"
                  : "text-gray-600 bg-gray-100"
                }`}
              selectedLabel={selectedLabel}
            />
          </div>
        </div>
        <div className="overflow-y-auto ">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100%-5rem)] text-gray-500">
              <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
              <p>No messages yet</p>
            </div>
          ) : (
            <ConversationList
              conversations={filteredConversations}
              selectedConversationId={selectedConversationId || ""}
              onSelectConversation={handleConversationSelect}
            />
          )}
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 flex flex-col h-[84vh]">
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
