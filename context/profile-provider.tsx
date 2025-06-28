'use client';

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useUser } from './user-context';

interface WhatsAppProfile {
  about?: string;
  address?: string;
  description?: string;
  email?: string;
  profile_picture_url?: string;
  websites?: string[];
}

interface ProfileContextType {
  profile: WhatsAppProfile | undefined;
  isLoading: boolean;
  error: Error | null;
  updateProfile: (profileData: Partial<WhatsAppProfile>) => Promise<void>;
  isUpdating: boolean;
  updateError: Error | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
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
        
        // Clear profile query to force fresh data fetch
        queryClient.removeQueries({ queryKey: ['whatsapp-profile'] });
      }
    } else {
      // Reset if no user data
      setPhoneNumberId(null);
      queryClient.removeQueries({ queryKey: ['whatsapp-profile'] });
    }
  }, [user, phoneNumberId, queryClient]);

  // Update phone number ID when user info changes
  useEffect(() => {
    updatePhoneNumberId();
  }, [updatePhoneNumberId]);

  // Fetch profile data
  const { 
    data: profile, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['whatsapp-profile', phoneNumberId],
    queryFn: async () => {
      if (!phoneNumberId) {
        throw new Error('Phone number ID is required');
      }
      const response = await axios.get(`/api/whatsapp/profile?phoneNumberId=${phoneNumberId}`);
      return response.data;
    },
    enabled: !!phoneNumberId,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<WhatsAppProfile>) => {
      if (!phoneNumberId) {
        throw new Error('Phone number ID is required');
      }
      const response = await axios.post(`/api/whatsapp/profile?phoneNumberId=${phoneNumberId}`, profileData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['whatsapp-profile', phoneNumberId] });
    },
  });

  const value: ProfileContextType = {
    profile,
    isLoading,
    error: error as Error | null,
    updateProfile: async (profileData: Partial<WhatsAppProfile>) => {
      await updateProfileMutation.mutateAsync(profileData);
    },
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error as Error | null,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
