'use client';

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useUser } from './user-context';

export interface Contact {
  id: string;
  name: string | null;
  phoneNumber: string;
  whatsAppPhoneNumberId: string | null;
  hasConversation: boolean;
  lastCheckedTime: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  group?: string;
  labels?: Label[];
  attributeValues?: ContactAttribute[];
  source?: string;
}

interface ContactAttribute {
  id: string;
  name: string;
  type: "TEXT" | "NUMBER";
  value: string;
  // value: string; // Only for attribute values, not for the definition
  // recipientId: string; // Only for attribute values, not for the definition
}

interface Label {
  id: string;
  name: string;
  description: string | null;
  color: string;
}

interface CreateContactData {
  name: string;
  phoneNumber: string;
  phoneNumberId: string;
  attributes?: { name: string; value: string }[];
}

interface UpdateContactData {
  id: string;
  name: string;
  phoneNumber: string;
  attributes?: { name: string; value: string }[];
}

interface ContactContextType {
  contacts: Contact[] | undefined;
  isLoading: boolean;
  error: Error | null;
  createContact: (data: CreateContactData) => Promise<Contact>;
  updateContact: (data: UpdateContactData) => Promise<Contact>;
  deleteContacts: (ids: string[]) => Promise<void>;
  bulkImportContacts: (contacts: CreateContactData[]) => Promise<{ success: number; failed: number; errors?: Array<{ index: number; error: string }> }>;
  attributes: ContactAttribute[] | undefined;
  isLoadingAttributes: boolean;
  errorAttributes: Error | null;
  createAttribute: (data: { name: string; type: string }) => Promise<ContactAttribute>;
  updateAttribute: (data: { id: string; name: string; type: string }) => Promise<ContactAttribute>;
  deleteAttribute: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isImporting: boolean;
  createError: Error | null;
  updateError: Error | null;
  deleteError: Error | null;
  importError: Error | null;
  isCreatingAttribute: boolean;
  isUpdatingAttribute: boolean;
  isDeletingAttribute: boolean;
  createAttributeError: Error | null;
  updateAttributeError: Error | null;
  deleteAttributeError: Error | null;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { userInfo: user } = useUser();
  const [phoneNumberId, setPhoneNumberId] = useState<string | null>(null);

  // Set phone number ID when user info is available
  const updatePhoneNumberId = useCallback(() => {
    if (user?.whatsappAccount?.phoneNumbers?.[0]?.id) {
      const newPhoneNumberId = user.whatsappAccount.phoneNumbers[0].id;
      
      // Only update if the phone number ID has actually changed
      if (newPhoneNumberId !== phoneNumberId) {
        setPhoneNumberId(newPhoneNumberId);
        
        // Clear contacts query to force fresh data fetch
        queryClient.removeQueries({ queryKey: ['contacts'] });
      }
    } else {
      // Reset if no user data
      setPhoneNumberId(null);
      queryClient.removeQueries({ queryKey: ['contacts'] });
    }
  }, [user, phoneNumberId, queryClient]);

  // Update phone number ID when user info changes
  useEffect(() => {
    updatePhoneNumberId();
  }, [updatePhoneNumberId]);

  // Fetch contacts
  const { 
    data: contacts, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['contacts', phoneNumberId],
    queryFn: async () => {
      if (!phoneNumberId) {
        throw new Error('Phone number ID is required');
      }
      const response = await axios.get(`/api/contacts?phoneNumberId=${phoneNumberId}`);
      return response.data;
    },
    enabled: !!phoneNumberId,
  });

  // Create contact mutation
  const createContactMutation = useMutation({
    mutationFn: async (data: CreateContactData) => {
      const response = await axios.post('/api/contacts', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch contacts data
      queryClient.invalidateQueries({ queryKey: ['contacts', phoneNumberId] });
    },
  });

  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: async (data: UpdateContactData) => {
      const response = await axios.put('/api/contacts', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch contacts data
      queryClient.invalidateQueries({ queryKey: ['contacts', phoneNumberId] });
    },
  });

  // Delete contacts mutation
  const deleteContactsMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await axios.delete('/api/contacts', { data: { ids } });
    },
    onSuccess: () => {
      // Invalidate and refetch contacts data
      queryClient.invalidateQueries({ queryKey: ['contacts', phoneNumberId] });
    },
  });

  // Bulk import contacts mutation
  const bulkImportContactsMutation = useMutation({
    mutationFn: async (contacts: CreateContactData[]) => {
      const response = await axios.post('/api/contacts/bulk-import', { contacts });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch contacts data
      queryClient.invalidateQueries({ queryKey: ['contacts', phoneNumberId] });
    },
  });

  // Get attributes
  const { data: attributes } = useQuery({
    queryKey: ['attributes'],
    queryFn: async () => {
      const response = await axios.get('/api/contacts/attribute');
      return response.data;
    },
  });

  // Create attribute mutation
  const addAttributeMutation = useMutation({
    mutationFn: async (data: { name: string; type: string }) => {
      const response = await axios.post('/api/contacts/attribute', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch attributes data
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    },
  });

  // Update attribute mutation
  const updateAttributeMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; type: string }) => {
      const response = await axios.put('/api/contacts/attribute', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch attributes data
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    },
  });

  // Delete attribute mutation
  const deleteAttributeMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete('/api/contacts/attribute', { data: { id } });
    },
    onSuccess: () => {
      // Invalidate and refetch attributes data
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    },
  });

  const value: ContactContextType = {
    // Contacts
    contacts,
    isLoading,
    error: error as Error | null,
    createContact: async (data: CreateContactData) => {
      return await createContactMutation.mutateAsync(data);
    },
    updateContact: async (data: UpdateContactData) => {
      return await updateContactMutation.mutateAsync(data);
    },
    deleteContacts: async (ids: string[]) => {
      await deleteContactsMutation.mutateAsync(ids);
    },
    bulkImportContacts: async (contacts: CreateContactData[]) => {
      return await bulkImportContactsMutation.mutateAsync(contacts);
    },
    isCreating: createContactMutation.isPending,
    isUpdating: updateContactMutation.isPending,
    isDeleting: deleteContactsMutation.isPending,
    isImporting: bulkImportContactsMutation.isPending,
    createError: createContactMutation.error as Error | null,
    updateError: updateContactMutation.error as Error | null,
    deleteError: deleteContactsMutation.error as Error | null,
    importError: bulkImportContactsMutation.error as Error | null,

    // Attributes
    attributes,
    isLoadingAttributes: false,
    errorAttributes: null,
    createAttribute: async (data: { name: string; type: string }) => {
      return await addAttributeMutation.mutateAsync(data);
    },
    updateAttribute: async (data: { id: string; name: string; type: string }) => {
      return await updateAttributeMutation.mutateAsync(data);
    },
    deleteAttribute: async (id: string) => {
      await deleteAttributeMutation.mutateAsync(id);
    },
    isCreatingAttribute: addAttributeMutation.isPending,
    isUpdatingAttribute: updateAttributeMutation.isPending,
    isDeletingAttribute: deleteAttributeMutation.isPending,
    createAttributeError: addAttributeMutation.error as Error | null,
    updateAttributeError: updateAttributeMutation.error as Error | null,
    deleteAttributeError: deleteAttributeMutation.error as Error | null,
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
}
