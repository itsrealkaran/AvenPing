"use client";

import { Message } from "./messages-interface";
import MessageBubble from "./message-bubble";

interface MessageListProps {
  messages: Message[];
  searchQuery?: string;
  currentMatchIndex?: number;
  matchingMessageIds?: string[];
}

const MessageList = ({ messages, searchQuery, currentMatchIndex = 0, matchingMessageIds = [] }: MessageListProps) => {
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
      dateLabel = messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } else {
      dateLabel = messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }

    if (!groupedMessages[dateLabel]) {
      groupedMessages[dateLabel] = [];
    }
    groupedMessages[dateLabel].push(message);
  });

  return (
    <div className="space-y-4 h-[50vh]">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="flex justify-center my-4">
            <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
              {date}
            </div>
          </div>

          <div className="space-y-1">
            {dateMessages.map((message) => {
              const isCurrentMatch = matchingMessageIds[currentMatchIndex] === message.id;
              return (
                <div 
                  key={message.id} 
                  id={`message-${message.id}`}
                  className={isCurrentMatch ? 'rounded-lg' : ''}
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
  );
};

export default MessageList;
