"use client";

import { Conversation } from "./messages-interface";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import { Bookmark, Search, MoreVertical, User } from "lucide-react";
import { useMessages } from "@/context/messages-context";
import { useEffect } from "react";

interface MessagePanelProps {
  conversation: Conversation;
  onSendMessage: (content: string) => void;
}

const MessagePanel = ({ conversation, onSendMessage }: MessagePanelProps) => {
  let { name, phoneNumber, messages } = conversation;
  const { getConversation } = useMessages();

  useEffect(() => {
    if (conversation.id) {
      getConversation(conversation.id).then((conversation) => {
        if (conversation) {
          name = conversation.name;
          phoneNumber = conversation.phoneNumber;
          messages = conversation.messages;
        }
      });
    }
    
  }, [conversation.id]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-white flex-shrink-0">
        <div className="flex items-center">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <User size={18} className="text-gray-500" />
            </div>
          </div>

          <div className="ml-3">
            <h3 className="font-medium text-gray-900">{name}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700">
            <Search size={18} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <Bookmark size={18} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <div
        className="flex-1 p-4 overflow-y-auto"
        style={{
          backgroundImage: 'url("/message-bg.png")',
          backgroundRepeat: "repeat",
          backgroundSize: "500px auto",
          backgroundColor: "#f0f2f5",
        }}
      >
        <MessageList messages={messages} />
      </div>

      <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default MessagePanel;
