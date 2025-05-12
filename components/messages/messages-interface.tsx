"use client";

import { useState, useEffect, useRef } from "react";
import ConversationList from "./conversation-list";
import MessagePanel from "./message-panel";
import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import MessageCard from "./message-card";
import SearchableDropdown from "@/components/ui/searchable-dropdown";

// Updated type definitions
export type Contact = {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  lastSeen?: string;
  isOnline?: boolean;
  label?: string;
};

export type Message = {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
  status: "sent" | "delivered" | "read";
  isMedia?: boolean;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "document";
};

export type Conversation = {
  id: string;
  contact: Contact;
  messages: Message[];
  unreadCount: number;
  lastMessage?: Message;
};

type FilterType = "all" | "unread" | "label";

const MessagesInterface = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      contact: {
        id: "c1",
        name: "John Doe",
        phone: "+91 9876543210",
        lastSeen: "today at 12:30 PM",
        isOnline: true,
        label: "Work",
      },
      messages: [
        {
          id: "m1",
          content: "Hi there! How are you doing?",
          timestamp: "2025-05-12T10:30:00Z",
          sender: "c1",
          status: "read",
        },
        {
          id: "m2",
          content: "I'm good, thanks! How about you?",
          timestamp: "2025-05-12T10:35:00Z",
          sender: "me",
          status: "read",
        },
        {
          id: "m3",
          content: "I'm doing well. Just checking in.",
          timestamp: "2025-05-12T10:40:00Z",
          sender: "c1",
          status: "read",
        },
        {
          id: "m4",
          content: "Great to hear that!",
          timestamp: "2025-05-12T10:45:00Z",
          sender: "me",
          status: "delivered",
        },
        {
          id: "m5",
          content: "Great to hear that!",
          timestamp: "2025-05-12T10:45:00Z",
          sender: "me",
          status: "delivered",
        },
        {
          id: "m6",
          content: "Great to hear that!",
          timestamp: "2025-05-12T10:45:00Z",
          sender: "me",
          status: "delivered",
        },
        {
          id: "m7",
          content: "Great to hear that!",
          timestamp: "2025-05-12T10:45:00Z",
          sender: "me",
          status: "delivered",
        },
        {
          id: "m8",
          content: "Great to hear that!",
          timestamp: "2025-05-12T10:45:00Z",
          sender: "me",
          status: "delivered",
        },
      ],
      unreadCount: 0,
    },
    {
      id: "2",
      contact: {
        id: "c2",
        name: "Jane Smith",
        phone: "+91 9876543211",
        lastSeen: "yesterday at 8:45 PM",
        label: "Family",
      },
      messages: [
        {
          id: "m5",
          content: "Hello! Are we still meeting tomorrow?",
          timestamp: "2025-05-19T18:30:00Z",
          sender: "c2",
          status: "read",
        },
        {
          id: "m6",
          content: "Yes, at 10 AM at the coffee shop.",
          timestamp: "2025-05-19T18:35:00Z",
          sender: "me",
          status: "read",
        },
      ],
      unreadCount: 0,
    },
    {
      id: "3",
      contact: {
        id: "c3",
        name: "Marketing Team",
        phone: "Group",
        label: "Work",
      },
      messages: [
        {
          id: "m7",
          content: "Meeting postponed to next week.",
          timestamp: "2025-05-18T14:20:00Z",
          sender: "c4",
          status: "read",
        },
      ],
      unreadCount: 1,
    },
    {
      id: "4",
      contact: {
        id: "c5",
        name: "David Chen",
        phone: "+91 9876543214",
        lastSeen: "today at 9:15 AM",
        isOnline: false,
      },
      messages: [
        {
          id: "m8",
          content: "Can you send me the project files?",
          timestamp: "2025-05-21T09:10:00Z",
          sender: "c5",
          status: "read",
        },
      ],
      unreadCount: 0,
    },
    {
      id: "5",
      contact: {
        id: "c6",
        name: "Emily Rodriguez",
        phone: "+91 9876543215",
        isOnline: true,
      },
      messages: [
        {
          id: "m9",
          content: "Check out this photo!",
          timestamp: "2025-05-21T11:20:00Z",
          sender: "c6",
          status: "read",
          isMedia: true,
          mediaUrl: "https://source.unsplash.com/random/300x200",
          mediaType: "image",
        },
      ],
      unreadCount: 1,
    },
    {
      id: "6",
      contact: {
        id: "c7",
        name: "Alex Thompson",
        phone: "+91 9876543216",
        lastSeen: "3 days ago",
      },
      messages: [
        {
          id: "m10",
          content: "Let's catch up soon!",
          timestamp: "2025-05-17T16:45:00Z",
          sender: "c7",
          status: "read",
        },
      ],
      unreadCount: 0,
    },
    {
      id: "7",
      contact: {
        id: "c8",
        name: "Tech Support",
        phone: "Group",
      },
      messages: [
        {
          id: "m11",
          content: "Server maintenance scheduled for tonight.",
          timestamp: "2025-05-21T08:30:00Z",
          sender: "c9",
          status: "read",
        },
      ],
      unreadCount: 2,
    },
    {
      id: "8",
      contact: {
        id: "c11",
        name: "Sophia Martinez",
        phone: "+91 9876543219",
        lastSeen: "just now",
        isOnline: true,
      },
      messages: [
        {
          id: "m12",
          content: "Did you get my email?",
          timestamp: "2025-05-21T12:05:00Z",
          sender: "c11",
          status: "read",
        },
      ],
      unreadCount: 0,
    },
    {
      id: "9",
      contact: {
        id: "c12",
        name: "James Wilson",
        phone: "+91 9876543220",
        lastSeen: "yesterday at 11:30 PM",
      },
      messages: [
        {
          id: "m13",
          content: "The presentation went well!",
          timestamp: "2025-05-20T23:15:00Z",
          sender: "c12",
          status: "read",
        },
      ],
      unreadCount: 0,
    },
    {
      id: "10",
      contact: {
        id: "c13",
        name: "Olivia Brown",
        phone: "+91 9876543221",
        isOnline: false,
        lastSeen: "2 hours ago",
      },
      messages: [
        {
          id: "m14",
          content: "Happy birthday! 🎂",
          timestamp: "2025-05-21T10:00:00Z",
          sender: "c13",
          status: "read",
        },
      ],
      unreadCount: 0,
    },
    {
      id: "11",
      contact: {
        id: "c14",
        name: "Family Group",
        phone: "Group",
      },
      messages: [
        {
          id: "m15",
          content: "Who's coming to dinner on Sunday?",
          timestamp: "2025-05-20T19:30:00Z",
          sender: "c15",
          status: "read",
        },
      ],
      unreadCount: 3,
    },
    {
      id: "12",
      contact: {
        id: "c18",
        name: "Daniel Lee",
        phone: "+91 9876543225",
        lastSeen: "5 minutes ago",
      },
      messages: [
        {
          id: "m16",
          content: "Can I borrow your notes from yesterday's class?",
          timestamp: "2025-05-12T11:45:00Z",
          sender: "c18",
          status: "delivered",
        },
      ],
      unreadCount: 1,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
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
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter conversations based on search and active filter
  const filteredConversations = conversations.filter((conversation) => {
    // First apply search filter
    const matchesSearch =
      conversation.contact.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conversation.contact.phone
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conversation.contact.label
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Then apply type filter
    if (activeFilter === "unread") {
      return conversation.unreadCount > 0;
    }
    if (activeFilter === "label" && selectedLabel) {
      return conversation.contact.label === selectedLabel;
    }
    return true;
  });

  const handleSendMessage = (content: string) => {
    if (!selectedConversationId || !content.trim()) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      content,
      timestamp: new Date().toISOString(),
      sender: "me",
      status: "sent",
    };

    // Update the selected conversation with the new message
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: newMessage,
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversationId(updatedConversations[0].id);
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversationId(conversation.id);
    // Mark conversation as read when selected
    if (conversation.unreadCount > 0) {
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === conversation.id
            ? {
                ...conv,
                unreadCount: 0,
                messages: conv.messages.map((msg) => ({
                  ...msg,
                  status: msg.sender !== "me" ? ("read" as const) : msg.status,
                })),
              }
            : conv
        )
      );
    }
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
