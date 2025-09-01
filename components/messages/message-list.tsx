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
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

const MessageList = ({
  messages,
  searchQuery,
  currentMatchIndex = 0,
  matchingMessageIds = [],
  onScrollToBottom,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: MessageListProps) => {
  const messageListRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Check scroll position to show/hide scroll button and handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (messageListRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          messageListRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        const isNearTop = scrollTop < 100;

        setShowScrollButton(!isNearBottom);

        // Auto-scroll if user is near bottom
        if (isNearBottom) {
          setIsAutoScrolling(true);
        }

        // Load more messages if user scrolls to top
        if (isNearTop && hasMore && !isLoadingMore && onLoadMore) {
          onLoadMore();
        }
      }
    };

    const messageList = messageListRef.current;
    if (messageList) {
      messageList.addEventListener("scroll", handleScroll, { passive: true });
      return () => messageList.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore, isLoadingMore, onLoadMore, messages.length]);

  // Debug logging for props
  useEffect(() => {
    console.log("MessageList props updated:", {
      hasMore,
      isLoadingMore,
      messagesCount: messages.length,
      onLoadMore: !!onLoadMore,
      firstMessageDate: messages[0]?.createdAt,
      lastMessageDate: messages[messages.length - 1]?.createdAt,
    });
  }, [hasMore, isLoadingMore, messages.length, onLoadMore, messages]);

  // Group messages by date - messages are now properly ordered from API
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
        {/* Loading indicator at top */}
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
              Loading older messages...
            </div>
          </div>
        )}

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

        {/* More messages available indicator */}
        {hasMore && (
          <div className="flex justify-center py-2">
            <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
              ↑ Scroll up to load older messages
            </div>
          </div>
        )}
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
