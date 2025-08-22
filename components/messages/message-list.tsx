"use client";

import { Message } from "./messages-interface";
import MessageBubble from "./message-bubble";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MessageListProps {
  messages: Message[];
  searchQuery?: string;
  currentMatchIndex?: number;
  matchingMessageIds?: string[];
  onScrollToBottom?: (scrollFn: () => void) => void;
}

const MessageList = ({
  messages,
  searchQuery,
  currentMatchIndex = 0,
  matchingMessageIds = [],
  onScrollToBottom,
}: MessageListProps) => {
  const messageListRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};

  messages.forEach((message) => {
    const messageDate = new Date(message.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateLabel: string;

    if (messageDate.toDateString() === today.toDateString()) {
      dateLabel = "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      dateLabel = "Yesterday";
    } else if (messageDate.getFullYear() === today.getFullYear()) {
      dateLabel = messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else {
      dateLabel = messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    if (!groupedMessages[dateLabel]) {
      groupedMessages[dateLabel] = [];
    }
    groupedMessages[dateLabel].push(message);
  });

  // Expose scroll function to parent component
  useEffect(() => {
    if (onScrollToBottom) {
      onScrollToBottom(scrollToBottom);
    }
  }, [onScrollToBottom]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAutoScrolling && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, isAutoScrolling]);

  // Check scroll position to show/hide scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (messageListRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          messageListRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);

        // Auto-scroll if user is near bottom
        if (isNearBottom) {
          setIsAutoScrolling(true);
        }
      }
    };

    const messageList = messageListRef.current;
    if (messageList) {
      messageList.addEventListener("scroll", handleScroll);
      return () => messageList.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
      setIsAutoScrolling(true);
    }
  };

  const handleScrollButtonClick = () => {
    scrollToBottom();
  };

  return (
    <div className="relative h-[58vh]">
      <div
        ref={messageListRef}
        className="space-y-4 h-full px-4 overflow-y-auto scroll-smooth"
      >
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex justify-center my-4">
              <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                {date}
              </div>
            </div>

            <div className="space-y-1">
              {dateMessages.map((message) => {
                const isCurrentMatch =
                  matchingMessageIds[currentMatchIndex] === message.id;
                return (
                  <div
                    key={message.id}
                    id={`message-${message.id}`}
                    className={isCurrentMatch ? "rounded-lg" : ""}
                  >
                    <MessageBubble
                      message={message}
                      searchQuery={searchQuery}
                      isCurrentMatch={isCurrentMatch}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={handleScrollButtonClick}
          className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:scale-110 z-10"
          title="Scroll to bottom"
        >
          <ChevronDown size={20} className="text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default MessageList;
