"use client";

import { useState, useEffect, useCallback } from "react";
import ConversationList from "./conversation-list";
import MessagePanel from "./message-panel";
import { Search, MessageSquare, Loader2, Wifi, WifiOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import MessageCard from "./message-card";
import SearchableDropdown from "@/components/ui/searchable-dropdown";
import { useMessages } from "@/context/messages-context";
import { useWebSocket } from "@/hooks/use-websocket";

// Updated type definitions
export type Contact = {
  id: string;
  name: string;
  phone: string;
  isOnline?: boolean;
  label?: string;
  unreadCount?: number;
};

export type Message = {
  id: string;
  wamid?: string;
  status: "SENT" | "DELIVERED" | "READ" | "PENDING" | "FAILED";
  message: string;
  mediaIds?: string[];
  templateData?: Array<{
    type: "HEADER" | "BODY" | "FOOTER" | "BUTTON" | "BUTTONS";
    text?: string;
    mediaUrl?: string;
    mediaId?: string;
    format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO";
    buttonText?: string;
    buttonType?: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
    buttonValue?: string;
    // New fields for BUTTONS structure
    buttons?: Array<{
      type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
      text: string;
      url?: string;
      phone_number?: string;
    }>;
  }> | null;
  interactiveJson?: Array<{
    type: string;
    label: string;
  }> | null;
  isOutbound: boolean;
  errorMessage?: string | null;
  phoneNumber: string;
  sentAt?: string | null;
  deliveredAt?: string | null;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
  whatsAppPhoneNumberId: string;
  recipientId: string;
  media?: { type: string; mediaId: string }[];
};

export type Conversation = {
  id: string;
  phoneNumber: string;
  name: string;
  messages: Message[];
  unreadCount?: number;
  nextCursor?: string | null;
  hasMore?: boolean;
  updatedAt?: string;
  labels?: string;
};

type FilterType = "all" | "unread" | "label";

const Loading = () => (
  <div className="flex flex-col py-10 items-center justify-center text-gray-500">
    <Loader2 className="h-10 w-10 mb-4 opacity-30 animate-spin" />
  </div>
);

const MessagesInterface = () => {
  const {
    conversations,
    sendMessage,
    isLoading,
    searchQuery,
    setSearchQuery,
    labels,
    isLabelsLoading,
    labelsError,
    setLabel,
    addRealTimeMessage,
    updateConversationUnreadCount,
  } = useMessages();

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [componentHeight, setComponentHeight] = useState("450px");
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

  // WebSocket callbacks - memoized to prevent re-renders
  const handleWebSocketMessage = useCallback(
    (message: any) => {
      console.log(message, "message from websocket");
      if (message.type === "new_message") {
        // Handle incoming real-time message
        const messageData = message.data?.message;
        if (messageData) {
          const newMessage: Message = {
            id: messageData.id || `m${Date.now()}`,
            wamid: messageData.wamid,
            message: messageData.message || "",
            createdAt: messageData.createdAt || new Date().toISOString(),
            status: messageData.status || "DELIVERED",
            isOutbound: false, // Incoming messages are not outbound
            media: messageData.media || [],
            mediaIds: messageData.mediaIds || [],
            templateData: messageData.templateData || null,
            interactiveJson: messageData.interactiveJson || null,
            errorMessage: messageData.errorMessage || null,
            phoneNumber: messageData.phoneNumber || "",
            sentAt: messageData.sentAt || null,
            deliveredAt: messageData.deliveredAt || null,
            readAt: messageData.readAt || null,
            updatedAt: messageData.updatedAt || new Date().toISOString(),
            whatsAppPhoneNumberId: messageData.whatsAppPhoneNumberId || "",
            recipientId: messageData.recipientId || "",
          };
          console.log(newMessage, "newMessage from websocket");

          // Try to find conversation by recipientId first
          if (messageData.recipientId) {
            console.log(messageData.recipientId, "recipientId from websocket");
            addRealTimeMessage(newMessage, messageData.recipientId);
          } else if (messageData.phoneNumber && conversations) {
            // Fallback: find conversation by phone number
            const conversation = conversations.find(
              (conv) => conv.phoneNumber === messageData.phoneNumber
            );
            if (conversation) {
              console.log(
                conversation.id,
                "found conversation by phone number"
              );
              addRealTimeMessage(newMessage, conversation.id);
            } else {
              console.warn(
                "No conversation found for phone number:",
                messageData.phoneNumber
              );
            }
          } else {
            console.warn("No recipientId or phoneNumber in WebSocket message");
          }
        }
      }
    },
    [addRealTimeMessage, conversations]
  );

  const handleWebSocketConnect = useCallback(() => {
    console.log("WebSocket connected for real-time messaging");
    setIsWebSocketConnected(true);
  }, []);

  const handleWebSocketDisconnect = useCallback(() => {
    console.log("WebSocket disconnected");
    setIsWebSocketConnected(false);
  }, []);

  const handleWebSocketError = useCallback((error: Event) => {
    console.error("WebSocket error in messages interface:", error);
    setIsWebSocketConnected(false);
  }, []);

  // WebSocket integration
  const { connectionStatus, connect, disconnect } = useWebSocket({
    onMessage: handleWebSocketMessage,
    onConnect: handleWebSocketConnect,
    onDisconnect: handleWebSocketDisconnect,
    onError: handleWebSocketError,
  });

  const handleWebSocketReconnect = useCallback(() => {
    if (connectionStatus === "disconnected") {
      console.log("Attempting to reconnect WebSocket...");
      connect();
    }
  }, [connectionStatus, connect]);

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

  const handleSendMessage = async (
    message: string,
    media?: { type: string; mediaId: string }
  ) => {
    if (
      !selectedConversationId ||
      (!message.trim() && !media) ||
      !conversations
    )
      return;

    const newMessage = {
      wamid: undefined,
      message: message || "",
      isOutbound: true,
      status: "SENT" as const,
      media: media ? [{ type: media.type, mediaId: media.mediaId }] : undefined,
      mediaIds: media ? [media.mediaId] : [],
      templateData: null,
      interactiveJson: null,
      errorMessage: null,
      phoneNumber: selectedConversation?.phoneNumber || "",
      sentAt: null,
      deliveredAt: null,
      readAt: null,
      updatedAt: new Date().toISOString(),
      whatsAppPhoneNumberId: "",
      recipientId: selectedConversationId,
    };

    await sendMessage(newMessage, selectedConversationId);
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversationId(conversation.id);

    // Reset unread count for the selected conversation
    if (conversation.unreadCount && conversation.unreadCount > 0) {
      updateConversationUnreadCount(conversation.id, 0);
    }
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

          {/* WebSocket Connection Status */}
          <div className="flex items-center justify-between mt-2">
            <div
              className={`flex items-center space-x-1 text-xs ${
                connectionStatus === "disconnected"
                  ? "cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                  : ""
              }`}
              onClick={handleWebSocketReconnect}
              title={
                connectionStatus === "disconnected"
                  ? "Click to reconnect"
                  : undefined
              }
            >
              {connectionStatus === "connected" ? (
                <>
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">Real-time active</span>
                </>
              ) : connectionStatus === "connecting" ? (
                <>
                  <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />
                  <span className="text-blue-600">Connecting...</span>
                </>
              ) : connectionStatus === "reconnecting" ? (
                <>
                  <Loader2 className="h-3 w-3 text-orange-500 animate-spin" />
                  <span className="text-orange-600">Reconnecting...</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-500">Disconnected</span>
                </>
              )}
            </div>
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
              items={
                labels
                  ? labels.map((label) => ({
                      id: label.id,
                      label: label.name,
                      value: label.name,
                    }))
                  : []
              }
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
