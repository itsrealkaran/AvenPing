'use client';

import { createContext, useContext, ReactNode, useEffect, useState, useMemo, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useUser } from './user-context';
import { Label } from '@prisma/client';

interface Message {
  id: string;
  message: string;
  createdAt: string;
  status: "SENT" | "DELIVERED" | "READ";
  isOutbound: boolean;
  templateId?: string;
  templateParams?: Record<string, string>;
  media?: { type: string; mediaId: string }[];
}

interface Conversation {
  id: string;
  phoneNumber: string;
  name: string;
  messages: Message[];
  unreadCount?: number;
  nextCursor?: string | null;
  hasMore?: boolean;
}

interface MessagesContextType {
  conversations: Conversation[] | undefined;
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sendMessage: (message: Omit<Message, 'id' | 'createdAt'>, recipientId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  getConversation: (conversationId: string) => Promise<Conversation | undefined>;
  labels: Label[];
  isLabelsLoading: boolean;
  labelsError: Error | null;
  label: string | null;
  setLabel: (label: string | null) => void;
  addRealTimeMessage: (message: Message, conversationId: string) => void;
  updateConversationUnreadCount: (conversationId: string, unreadCount: number) => void;
  createLabel: (labelData: { name: string; description?: string; color: string }) => Promise<Label>;
  updateLabel: (id: string, labelData: { name: string; description?: string; color: string }) => Promise<Label>;
  deleteLabel: (id: string) => Promise<void>;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { userInfo: user } = useUser();

  const [phoneNumberId, setPhoneNumberId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [label, setLabel] = useState<string | null>(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');

  // Message cache: conversationId -> Message[]
  const messageCache = useRef<Map<string, Message[]>>(new Map());

  useEffect(() => {
    console.log(user);
    if (user && 
        user.whatsappAccount && 
        user.whatsappAccount.phoneNumbers && 
        user.whatsappAccount.phoneNumbers.length > 0 && 
        user.whatsappAccount.phoneNumbers[0]?.id) {
      const newPhoneNumberId = user.whatsappAccount.phoneNumbers[0].id;
      
      // Only update if the phone number ID has actually changed
      if (newPhoneNumberId !== phoneNumberId) {
        setPhoneNumberId(newPhoneNumberId);
        
        // Reset states when user changes
        setSearchQuery('');
        setLabel(null);
        setConversationId(null);
        
        // Clear all related queries to force fresh data fetch
        queryClient.removeQueries({ queryKey: ['messages'] });
        queryClient.removeQueries({ queryKey: ['conversation'] });
        queryClient.removeQueries({ queryKey: ['labels'] });
      }
    } else {
      // Reset everything if no user data
      setPhoneNumberId(null);
      setSearchQuery('');
      setLabel(null);
      setConversationId(null);
    }
  }, [user, phoneNumberId, queryClient]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch messages with search functionality
  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['messages', phoneNumberId, debouncedSearchQuery, label],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (phoneNumberId) {
        params.append('phoneNumberId', phoneNumberId);
      }
      if (debouncedSearchQuery.trim()) {
        params.append('search', debouncedSearchQuery.trim());
      }
      if (label) {
        params.append('label', label);
      }
      const response = await axios.get(`/api/whatsapp/messages?${params.toString()}`);
      response.data.items.forEach((item: any) => {
        messageCache.current.set(item.id, item.messages);
      });
      return response.data.items as Conversation[];
    },
    enabled: !!phoneNumberId, // Only fetch when phoneNumberId is available
  });

  const { data: conversation, isLoading: isConversationLoading, error: conversationError } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const response = await axios.get(`/api/whatsapp/messages/conversation/${conversationId}`);
      return response.data;
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ newMessage, recipientId }: { newMessage: Omit<Message, 'id' | 'createdAt'>, recipientId: string }) => {
      const response = await axios.post(`/api/whatsapp/messages?phoneNumberId=${phoneNumberId}`, {
        message: newMessage.message,
        templateId: newMessage.templateId,
        templateParams: newMessage.templateParams,
        recipientId,
        media: newMessage.media,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', phoneNumberId] });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      await axios.delete(`/api/messages/${messageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', phoneNumberId] });
    },
  });

  // Get labels
  const { data: labels, isLoading: isLabelsLoading, error: labelsError } = useQuery({
    queryKey: ['labels', phoneNumberId],
    queryFn: async () => {
      const response = await axios.get(`/api/whatsapp/label`);
      return response.data;
    },
    enabled: !!phoneNumberId,
  });

  const value = {
    conversations,
    isLoading,
    error: error as Error | null,
    searchQuery,
    setSearchQuery,
    sendMessage: async (message: Omit<Message, 'id' | 'createdAt'>, recipientId: string) => {
      await sendMessageMutation.mutateAsync({ newMessage: message, recipientId });
      // Optimistically update cache for the recipient conversation
      if (recipientId) {
        const cached = messageCache.current.get(recipientId) || [];
        // Create a fake message object for cache (id and createdAt will be replaced by backend on next fetch)
        const fakeMessage: Message = {
          ...message,
          id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        messageCache.current.set(recipientId, [...cached, fakeMessage]);
      }
    },
    deleteMessage: async (messageId: string) => {
      await deleteMessageMutation.mutateAsync(messageId);
      // Optionally, remove the message from cache for all conversations
      messageCache.current.forEach((messages, convId) => {
        messageCache.current.set(convId, messages.filter(m => m.id !== messageId));
      });
    },
    getConversation: async (conversationId: string, cursor?: string) => {
      setConversationId(conversationId);
      if (cursor) {
        const response = await axios.get(`/api/whatsapp/messages/conversation/${conversationId}?cursor=${cursor}`);
        messageCache.current.set(conversationId, response.data.messages);
        return { ...response.data, messages: response.data.messages, nextCursor: response.data.nextCursor };
      }
      // Check cache first
      if (messageCache.current.has(conversationId)) {
        const cachedMessages = messageCache.current.get(conversationId)!;
        const conv = conversations?.find((c) => c.id === conversationId);
        if (conv) {
          return { ...conv, messages: cachedMessages };
        }
      }
      // Always fetch if not in cache
      const response = await axios.get(`/api/whatsapp/messages/conversation/${conversationId}`);
      messageCache.current.set(conversationId, response.data.messages);
      return { ...response.data, messages: response.data.messages, nextCursor: response.data.nextCursor };
    },
    
    labels,
    isLabelsLoading,
    labelsError,
    label,
    setLabel,
    addRealTimeMessage: (message: Message, conversationId: string) => {
      // Update cache
      const cached = messageCache.current.get(conversationId) || [];
      messageCache.current.set(conversationId, [...cached, message]);
      console.log("updating cache", message, conversationId);
      
      // Update react-query cache with proper immutability
      queryClient.setQueryData(['messages', phoneNumberId, debouncedSearchQuery, label], (oldData: Conversation[] | undefined) => {
        if (!oldData) return oldData;
        
        const updatedData = oldData.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, message],
            };
          }
          return conv;
        });
        
        console.log("Updated query data:", updatedData);
        return updatedData;
      });
      
      // Force a re-render by invalidating the query after updating
      queryClient.invalidateQueries({ queryKey: ['messages', phoneNumberId, debouncedSearchQuery, label] });
    },
    updateConversationUnreadCount: (conversationId: string, unreadCount: number) => {
      queryClient.setQueryData(['messages', phoneNumberId, debouncedSearchQuery, label], (oldData: Conversation[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              unreadCount,
            };
          }
          return conv;
        });
      });
    },
    createLabel: async (labelData: { name: string; description?: string; color: string }) => {
      const response = await axios.post('/api/whatsapp/label', labelData);
      const responseData = response.data;
      
      // Check if the API returned a success message instead of label data
      if (responseData.message && !responseData.id) {
        // If API only returns success message, invalidate the cache to refetch fresh data
        queryClient.invalidateQueries({ queryKey: ['labels', phoneNumberId] });
        return responseData; // Return the response as-is
      }
      
      // If API returned actual label data, update the cache
      const newLabel = responseData;
      queryClient.setQueryData(['labels', phoneNumberId], (oldData: Label[] | undefined) => {
        if (!oldData) return [newLabel];
        return [...oldData, newLabel];
      });
      
      return newLabel;
    },
    updateLabel: async (id: string, labelData: { name: string; description?: string; color: string }) => {
      const response = await axios.put('/api/whatsapp/label', {
        id,
        ...labelData
      });
      const responseData = response.data;
      
      // Check if the API returned a success message instead of label data
      if (responseData.message && !responseData.id) {
        // If API only returns success message, invalidate the cache to refetch fresh data
        queryClient.invalidateQueries({ queryKey: ['labels', phoneNumberId] });
        return responseData; // Return the response as-is
      }
      
      // If API returned actual label data, update the cache
      const updatedLabel = responseData;
      queryClient.setQueryData(['labels', phoneNumberId], (oldData: Label[] | undefined) => {
        if (!oldData) return [updatedLabel];
        return oldData.map(label => 
          label.id === id ? updatedLabel : label
        );
      });
      
      return updatedLabel;
    },
    deleteLabel: async (id: string) => {
      const response = await axios.delete(`/api/whatsapp/label?id=${id}`);
      const responseData = response.data;
      
      // Check if the API returned a success message
      if (responseData.message) {
        // Invalidate the cache to refetch fresh data
        queryClient.invalidateQueries({ queryKey: ['labels', phoneNumberId] });
        return;
      }
      
      // If API didn't return a message, manually update the cache
      queryClient.setQueryData(['labels', phoneNumberId], (oldData: Label[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(label => label.id !== id);
      });
    },
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
} 