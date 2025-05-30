'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useGetUser from '@/hooks/get-userdata';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
  // Add other message properties as needed
}

interface MessagesContextType {
  conversations: Message[] | undefined;
  isLoading: boolean;
  error: Error | null;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const user = useGetUser();

  const [phoneNumberId, setPhoneNumberId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.whatsappAccount?.phoneNumbers[0].id) {
      setPhoneNumberId(user?.whatsappAccount?.phoneNumbers[0].id);
    }
  }, [user]);

  // Fetch messages
  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['messages', phoneNumberId],
    queryFn: async () => {
      const response = await axios.get(`/api/whatsapp/messages?phoneNumberId=${phoneNumberId}`);
      return response.data;
    },
    enabled: !!phoneNumberId, // Only fetch when phoneNumberId is available
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: Omit<Message, 'id' | 'timestamp'>) => {
      const response = await axios.post('/api/messages', newMessage);
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

  const value = {
    conversations,
    isLoading,
    error: error as Error | null,
    sendMessage: async (message: Omit<Message, 'id' | 'timestamp'>) => {
      await sendMessageMutation.mutateAsync(message);
    },
    deleteMessage: async (messageId: string) => {
      await deleteMessageMutation.mutateAsync(messageId);
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