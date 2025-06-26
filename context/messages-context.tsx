'use client';

import { createContext, useContext, ReactNode, useEffect, useState, useMemo } from 'react';
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
}

interface Conversation {
  id: string;
  phoneNumber: string;
  name: string;
  messages: Message[];
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

  useEffect(() => {
    if (user?.whatsappAccount?.phoneNumbers[0].id) {
      setPhoneNumberId(user?.whatsappAccount?.phoneNumbers[0].id);
    }
  }, [user]);

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
      return response.data.items;
    },
    enabled: !!phoneNumberId, // Only fetch when phoneNumberId is available
  });

  const { data: conversation, isLoading: isConversationLoading, error: conversationError } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
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
    },
    deleteMessage: async (messageId: string) => {
      await deleteMessageMutation.mutateAsync(messageId);
    },
    getConversation: async (conversationId: string) => {
      setConversationId(conversationId);
      return conversation;
    },
    labels,
    isLabelsLoading,
    labelsError,
    label,
    setLabel,
    addRealTimeMessage: (message: Message, conversationId: string) => {
      queryClient.setQueryData(['messages', phoneNumberId, debouncedSearchQuery, label], (oldData: any) => {
        if (!oldData) return oldData;
        
        return oldData.map((conv: Conversation) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, message]
            };
          }
          return conv;
        });
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