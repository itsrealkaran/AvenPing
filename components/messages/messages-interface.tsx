"use client";

import { useState, useEffect, useRef } from "react";
import ConversationList from "./conversation-list";
import MessagePanel from "./message-panel";
import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import MessageCard from "./message-card";

// Sample data structures
export type Contact = {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  lastSeen?: string;
  isOnline?: boolean;
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
  isGroup?: boolean;
  groupMembers?: Contact[];
};

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
      },
      messages: [
        {
          id: "m1",
          content: "Hi there! How are you doing?",
          timestamp: "2023-07-20T10:30:00Z",
          sender: "c1",
          status: "read",
        },
        {
          id: "m2",
          content: "I'm good, thanks! How about you?",
          timestamp: "2023-07-20T10:35:00Z",
          sender: "me",
          status: "read",
        },
        {
          id: "m3",
          content: "I'm doing well. Just checking in.",
          timestamp: "2023-07-20T10:40:00Z",
          sender: "c1",
          status: "read",
        },
        {
          id: "m4",
          content: "Great to hear that!",
          timestamp: "2023-07-20T10:45:00Z",
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
      },
      messages: [
        {
          id: "m5",
          content: "Hello! Are we still meeting tomorrow?",
          timestamp: "2023-07-19T18:30:00Z",
          sender: "c2",
          status: "read",
        },
        {
          id: "m6",
          content: "Yes, at 10 AM at the coffee shop.",
          timestamp: "2023-07-19T18:35:00Z",
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
      },
      messages: [
        {
          id: "m7",
          content: "Meeting postponed to next week.",
          timestamp: "2023-07-18T14:20:00Z",
          sender: "c4",
          status: "read",
        },
      ],
      unreadCount: 1,
      isGroup: true,
      groupMembers: [
        {
          id: "c3",
          name: "Mike Johnson",
          phone: "+91 9876543212",
        },
        {
          id: "c4",
          name: "Sarah Williams",
          phone: "+91 9876543213",
        },
      ],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    // Set the first conversation as selected by default
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.contact.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (content: string) => {
    if (!selectedConversation || !content.trim()) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      content,
      timestamp: new Date().toISOString(),
      sender: "me",
      status: "sent",
    };

    // Update the selected conversation with the new message
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: newMessage,
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
      lastMessage: newMessage,
    });
  };

  return (
    <MessageCard>
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search or start a new chat"
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList 
            conversations={filteredConversations}
            selectedConversationId={selectedConversation?.id || ""}
            onSelectConversation={setSelectedConversation}
          />
        </div>
      </div>

      {/* Message area */}
      <div className="w-2/3 flex flex-col">
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