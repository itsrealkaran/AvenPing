"use client";

import { Conversation, Message } from "./messages-interface";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import {
  Bookmark,
  Search,
  MoreVertical,
  User,
  X,
  ChevronUp,
  ChevronDown,
  Loader2,
  Headphones,
  UserPlus2,
} from "lucide-react";
import { useMessages } from "@/context/messages-context";
import { useUser } from "@/context/user-context";
import { useEffect, useState, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { generateColorFromString, getFirstLetter } from "@/lib/utils";
import { toast } from "sonner";

interface MessagePanelProps {
  conversation: Conversation;
  onSendMessage: (
    content: string,
    media?: { type: string; mediaId: string },
    templateName?: string
  ) => void;
}

const MessagePanel = ({ conversation, onSendMessage }: MessagePanelProps) => {
  // Use state for the current conversation
  const [currentConversation, setCurrentConversation] = useState(conversation);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [matchingMessageIds, setMatchingMessageIds] = useState<string[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const searchAttemptsRef = useRef(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(
    conversation.hasMore || false
  );
  const [nextCursor, setNextCursor] = useState<string | null>(
    conversation.nextCursor || null
  );
  const [allMessages, setAllMessages] = useState<Message[]>(
    conversation.messages
  );
  const searchRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const scrollToBottomRef = useRef<(() => void) | null>(null);

  // if the last message was sent more than 23 hours ago then set the state to true
  const [isMessageWindowOpen, setIsMessageWindowOpen] = useState(true);
  useEffect(() => {
    if (allMessages && allMessages.length > 0) {
      const outboundMessages = allMessages.filter((message) => message.isOutbound === false);
      const lastMessage = outboundMessages.length > 0 ? outboundMessages[outboundMessages.length - 1] : allMessages[allMessages.length - 1];
      if (!lastMessage) return;
      const lastMessageDate = new Date(lastMessage.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastMessageDate.getTime());
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      console.log("diffHours > 23", diffHours);
      setIsMessageWindowOpen(diffHours < 23);
    }
  }, [allMessages]);

  const { getConversation } = useMessages();
  const { userInfo } = useUser();

  // Track if we've already loaded the conversation to prevent duplicate calls
  const hasLoadedConversation = useRef(false);
  const isLoadingConversation = useRef(false);

  // Single function to load conversation data with debouncing
  const loadConversation = useCallback(async (conversationId: string, cursor?: string) => {
    if (isLoadingConversation.current) {
      console.log("Already loading conversation, skipping...");
      return;
    }

    // Add a small delay to prevent rapid successive calls
    await new Promise(resolve => setTimeout(resolve, 100));

    isLoadingConversation.current = true;
    try {
      const conversationData = await getConversation(conversationId, cursor);
      
      if (conversationData) {
        console.log("Conversation loaded:", {
          id: conversationData.id,
          messagesCount: conversationData.messages.length,
          hasMore: conversationData.hasMore,
          nextCursor: conversationData.nextCursor,
        });

        // Only update state if this is still the current conversation
        if (conversationId === conversation.id) {
          setCurrentConversation(conversationData);
          setAllMessages(conversationData.messages);
          setNextCursor(conversationData.nextCursor || null);
          setHasMoreMessages(conversationData.hasMore || false);
          hasLoadedConversation.current = true;
        }
      } else {
        console.log("No conversation found, resetting state");
        if (conversationId === conversation.id) {
          setCurrentConversation(conversationData as any);
          setAllMessages([]);
          setNextCursor(null);
          setHasMoreMessages(false);
        }
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      isLoadingConversation.current = false;
    }
  }, [getConversation, conversation.id]);

  // Sync state with prop so UI updates immediately on conversation switch
  useEffect(() => {
    // Reset state when conversation changes
    if (conversation.id !== currentConversation.id) {
      console.log("Conversation changed, resetting state:", {
        from: currentConversation.id,
        to: conversation.id
      });
      console.log("conversation.nextCursor", conversation.nextCursor);
      console.log("conversation.hasMore", conversation.hasMore);
      
      // Reset all state for the new conversation
      hasLoadedConversation.current = false;
      setCurrentConversation(conversation);
      setAllMessages(conversation.messages);
      
      // Initialize with conversation data, but also load full conversation data
      // to get accurate hasMore and nextCursor values
      setNextCursor(conversation.nextCursor || null);
      setHasMoreMessages(conversation.hasMore || false);
      
      // Load the full conversation data to get accurate pagination info
      loadConversation(conversation.id);
    }
  }, [conversation.id, conversation.messages, conversation.nextCursor, conversation.hasMore, loadConversation]);

  // Scroll to bottom when conversation changes
  useEffect(() => {
    if (scrollToBottomRef.current) {
      setTimeout(() => {
        scrollToBottomRef.current?.();
      }, 100);
    }
  }, [conversation.id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollToBottomRef.current && allMessages.length > 0) {
      setTimeout(() => {
        scrollToBottomRef.current?.();
      }, 100);
    }
  }, [allMessages.length]);

  // Debug logging for infinite scroll state
  useEffect(() => {
    console.log("MessagePanel infinite scroll state:", {
      hasMoreMessages,
      isLoadingMore,
      nextCursor,
      messagesCount: allMessages.length,
    });
  }, [hasMoreMessages, isLoadingMore, nextCursor, allMessages.length]);

  // Ensure conversation is loaded on initial mount
  useEffect(() => {
    if (conversation.id && !hasLoadedConversation.current) {
      loadConversation(conversation.id);
    }
  }, [conversation.id, loadConversation]);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (scrollToBottomRef.current) {
      scrollToBottomRef.current();
    }
  };

  // Handle sending message and scroll to bottom
  const handleSendMessage = async (
    content: string,
    media?: { type: string; mediaId: string },
  ) => {
    onSendMessage(content, media);
    // Scroll to bottom after sending message
    setTimeout(() => {
      scrollToBottom();
    }, 200);
  };

  const handleSendTemplateMessage = async (
    templateId: string,
    variables: any[]
  ) => {
    // Send template message with variables
    try {
      // Sort variables by their index to ensure correct order
      const sortedVariables = variables.sort((a, b) => a.variableIndex - b.variableIndex);
      
      // Separate variables by component type for proper WhatsApp API structure
      const headerParams = sortedVariables
        .filter(variable => variable.componentType === "HEADER")
        .map(variable => {
          if (variable.format === "TEXT") {
            return {
              type: "text",
              text: variable.value || variable.fallbackValue || `Variable ${variable.variableIndex}`
            };
          } else {
            // For media parameters, use the correct WhatsApp API structure
            return {
              type: variable.format?.toLowerCase() || "text",
              ...(variable.mediaId && { 
                [variable.format?.toLowerCase() === "image" ? "image" : 
                 variable.format?.toLowerCase() === "video" ? "video" : 
                 variable.format?.toLowerCase() === "document" ? "document" : "image"]: {
                  id: variable.mediaId
                }
              })
            };
          }
        });

      const bodyParams = sortedVariables
        .filter(variable => variable.componentType === "BODY")
        .map(variable => {
          if (variable.format === "TEXT") {
            return {
              type: "text",
              text: variable.value || variable.fallbackValue || `Variable ${variable.variableIndex}`
            };
          } else {
            // For media parameters, use the correct WhatsApp API structure
            return {
              type: variable.format?.toLowerCase() || "text",
              ...(variable.mediaId && { 
                [variable.format?.toLowerCase() === "image" ? "image" : 
                 variable.format?.toLowerCase() === "video" ? "video" : 
                 variable.format?.toLowerCase() === "document" ? "document" : "image"]: {
                  id: variable.mediaId
                }
              })
            };
          }
        });

      // For now, send all parameters as body parameters (this is the current approach)
      const templateParams = bodyParams;

      console.log("Template variables debug:", {
        sortedVariables: sortedVariables.map(v => ({
          index: v.variableIndex,
          component: v.componentType,
          format: v.format,
          value: v.value || v.fallbackValue
        })),
        headerParams,
        bodyParams,
        templateParams
      });

      console.log("Sending template with params:", {
        templateId,
        templateParams,
        variablesCount: templateParams.length,
        originalVariables: variables
      });

      const response = await axios.post(
        `/api/whatsapp/messages?phoneNumberId=${userInfo?.whatsappAccount?.activePhoneNumber?.id}`,
        {
          recipientId: currentConversation.id,
          templateId: templateId,
          templateParams: templateParams,
          headerParams: headerParams,
          bodyParams: bodyParams
        }
      );
      
      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollToBottom();
      }, 200);
      
    } catch (error) {
      console.error("Error sending template message:", error);
      toast.error("Failed to send template message");
    }
  };

  // Load more messages when scrolling to top
  const handleLoadMore = async () => {
    console.log("handleLoadMore called:", {
      isLoadingMore,
      hasMoreMessages,
      nextCursor,
    });

    if (isLoadingMore || !hasMoreMessages || !nextCursor) {
      console.log("handleLoadMore early return:", {
        isLoadingMore,
        hasMoreMessages,
        nextCursor,
      });
      return;
    }

    setIsLoadingMore(true);
    try {
      // Use the context's getConversation function to properly cache messages
      const newConversation = await getConversation(currentConversation.id, nextCursor);
      
      if (newConversation) {
        // Store current scroll position
        const messageList = messageListRef.current;
        const currentScrollTop = messageList?.scrollTop || 0;
        const currentScrollHeight = messageList?.scrollHeight || 0;

        // Update local state with the cached messages from context
        setAllMessages(newConversation.messages);
        setNextCursor(newConversation.nextCursor || null);
        setHasMoreMessages(newConversation.hasMore || false);

        // Restore scroll position after new messages are added
        // This keeps the user at the same relative position
        setTimeout(() => {
          if (messageList) {
            const newScrollHeight = messageList.scrollHeight;
            const scrollDifference = newScrollHeight - currentScrollHeight;
            messageList.scrollTop = currentScrollTop + scrollDifference;
          }
        }, 100);
      }
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset searchAttemptsRef when the search query changes
  useEffect(() => {
    searchAttemptsRef.current = 0;
  }, [debouncedSearchQuery]);

  // Main effect for searching
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setMatchingMessageIds([]);
      setCurrentMatchIndex(0);
      return;
    }

    const matchingIds = allMessages
      .filter((message) =>
        message.message
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase())
      )
      .map((message) => message.id);

    setMatchingMessageIds(matchingIds);
    setCurrentMatchIndex(0);

    // If no matches found and we have more messages, try to fetch more
    if (
      matchingIds.length === 0 &&
      hasMoreMessages &&
      searchAttemptsRef.current < 3
    ) {
      fetchMoreMessagesForSearch();
    }
  }, [debouncedSearchQuery, allMessages, hasMoreMessages]);

  // Fetch more messages for search
  const fetchMoreMessagesForSearch = async () => {
    if (
      isLoadingMore ||
      searchAttemptsRef.current >= 3 ||
      !hasMoreMessages ||
      !nextCursor
    ) {
      return;
    }

    setIsLoadingMore(true);
    searchAttemptsRef.current += 1;

    try {
      // Use the context's getConversation function to properly cache messages
      const newConversation = await getConversation(currentConversation.id, nextCursor);
      
      if (newConversation) {
        // Update local state with the cached messages from context
        setAllMessages(newConversation.messages);
        setNextCursor(newConversation.nextCursor || null);
        setHasMoreMessages(newConversation.hasMore || false);
        
        // Search in the updated messages
        const newMatchingIds = newConversation.messages
          .filter((message) =>
            message.message
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase())
          )
          .map((message) => message.id);
        setMatchingMessageIds(newMatchingIds);
        setCurrentMatchIndex(0);
        
        // If still no matches and we can fetch more, try again
        if (
          newMatchingIds.length === 0 &&
          newConversation.hasMore &&
          searchAttemptsRef.current < 3
        ) {
          setTimeout(() => {
            fetchMoreMessagesForSearch();
          }, 500); // Small delay to prevent too many rapid requests
        }
      }
    } catch (error) {
      console.error("Error fetching more messages for search:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Scroll to current match
  useEffect(() => {
    if (
      matchingMessageIds.length > 0 &&
      currentMatchIndex < matchingMessageIds.length
    ) {
      const messageId = matchingMessageIds[currentMatchIndex];
      const messageElement = document.getElementById(`message-${messageId}`);

      if (messageElement) {
        messageElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Add temporary highlight
        messageElement.classList.add(
          "ring-2",
          "ring-blue-500",
          "ring-opacity-50"
        );
        setTimeout(() => {
          messageElement.classList.remove(
            "ring-2",
            "ring-blue-500",
            "ring-opacity-50"
          );
        }, 2000);
      }
    }
  }, [currentMatchIndex, matchingMessageIds]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
        setSearchQuery("");
        setDebouncedSearchQuery("");
        setMatchingMessageIds([]);
        setCurrentMatchIndex(0);
        searchAttemptsRef.current = 0;
      }
    };

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      // Focus the input after a short delay to ensure the dropdown is rendered
      setTimeout(() => {
        const input = searchRef.current?.querySelector("input");
        input?.focus();
      }, 100);
    } else {
      setSearchQuery("");
      setDebouncedSearchQuery("");
      setMatchingMessageIds([]);
      setCurrentMatchIndex(0);
      searchAttemptsRef.current = 0;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setMatchingMessageIds([]);
    setCurrentMatchIndex(0);
    searchAttemptsRef.current = 0;
    setShowSearch(false);
  };

  const goToNextMatch = () => {
    if (matchingMessageIds.length > 0) {
      setCurrentMatchIndex((prev) =>
        prev < matchingMessageIds.length - 1 ? prev + 1 : 0
      );
    }
  };

  const goToPreviousMatch = () => {
    if (matchingMessageIds.length > 0) {
      setCurrentMatchIndex((prev) =>
        prev > 0 ? prev - 1 : matchingMessageIds.length - 1
      );
    }
  };

  // Use currentConversation for name and phoneNumber
  const { name, phoneNumber } = currentConversation;

  return (
    <div className="flex flex-col h-full">
      <div className="py-3 px-6 border-b border-gray-200 flex justify-between items-center bg-white flex-shrink-0">
        <div className="flex items-center">
          <div className="relative">
            <div
              className="size-8 rounded-full flex items-center justify-center text-white text-md shadow-sm"
              style={{
                backgroundColor: generateColorFromString(name),
              }}
            >
              {getFirstLetter(name)}
            </div>
          </div>

          <div className="ml-3">
            <h3 className="font-medium text-gray-900">{name}</h3>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-gray-500 hover:text-gray-700">
            <UserPlus2 size={18} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <Headphones size={18} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <Bookmark size={18} />
          </button>
          <div className="relative" ref={searchRef}>
            <button
              className={`text-gray-500 hover:text-gray-700 flex items-center justify-center ${
                showSearch ? "text-blue-600" : ""
              }`}
              onClick={handleSearchToggle}
            >
              <Search size={18} />
            </button>

            {showSearch && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-10 pr-8"
                    />
                    <button
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {debouncedSearchQuery && (
                    <div className="mt-3">
                      {isLoadingMore ? (
                        <div className="flex items-center gap-2 text-sm text-blue-700">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Searching older messages...
                        </div>
                      ) : matchingMessageIds.length > 0 ? (
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-blue-700">
                            {currentMatchIndex + 1} of{" "}
                            {matchingMessageIds.length} matches
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={goToPreviousMatch}
                              className="p-1 text-gray-500 hover:text-gray-700 rounded"
                              title="Previous match"
                            >
                              <ChevronUp size={16} />
                            </button>
                            <button
                              onClick={goToNextMatch}
                              className="p-1 text-gray-500 hover:text-gray-700 rounded"
                              title="Next match"
                            >
                              <ChevronDown size={16} />
                            </button>
                          </div>
                        </div>
                      ) : searchAttemptsRef.current >= 3 ? (
                        <div className="text-sm text-gray-500">
                          No messages found
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          No messages found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        ref={messageListRef}
        className="flex-1 overflow-y-auto"
        style={{
          backgroundImage: 'url("/message-bg.png")',
          backgroundRepeat: "repeat",
          backgroundSize: "500px auto",
          backgroundColor: "#FFFFD5",
        }}
      >
        <MessageList
          messages={allMessages}
          searchQuery={debouncedSearchQuery}
          currentMatchIndex={currentMatchIndex}
          matchingMessageIds={matchingMessageIds}
          onScrollToBottom={(scrollFn) => {
            scrollToBottomRef.current = scrollFn;
          }}
          onLoadMore={handleLoadMore}
          hasMore={hasMoreMessages}
          isLoadingMore={isLoadingMore}
        />
      </div>

      <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          onSendTemplate={handleSendTemplateMessage}
          isMessageWindowOpen={isMessageWindowOpen}
        />
      </div>
    </div>
  );
};

export default MessagePanel;
