"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "./user-context";

interface UserSetting {
  id: string;
  userId: string;
  isOptOutSelected: boolean;
  notificationSettings: Array<{
    notificationType: string;
    isEnabled: boolean;
  }>;
  optOutKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface OBARequestData {
  additional_supporting_information?: string;
  business_website_url: string;
  parent_business_or_brand: string;
  primary_country_of_operation: string;
  primary_language: string;
  supporting_links: string[];
}

interface OBAStatus {
  oba_status: string;
}

interface SettingsContextType {
  userSettings: UserSetting | undefined;
  isLoading: boolean;
  error: Error | null;
  toggleOptOut: () => Promise<void>;
  updateNotificationSetting: (
    notificationType: string,
    isEnabled: boolean
  ) => Promise<void>;
  updateNotificationSettings: (
    settings: Array<{ notificationType: string; isEnabled: boolean }>
  ) => Promise<void>;
  updateOptOutKeywords: (keywords: string[]) => Promise<void>;
  submitOBARequest: (
    phoneNumberId: string,
    data: OBARequestData
  ) => Promise<void>;
  obaStatus: OBAStatus | undefined;
  isOBAStatusLoading: boolean;
  obaStatusError: Error | null;
  refetchOBAStatus: () => void;
  fetchOBAStatus: (phoneNumberId: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  disconnectWhatsappAccount: () => Promise<void>;
  paymentHistory: any;
  isPaymentHistoryLoading: boolean;
  paymentHistoryError: Error | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { userInfo: user } = useUser();

  // Fetch user settings
  const {
    data: userSettings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userSettings", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await axios.get("/api/settings");
      return response.data;
    },
    enabled: !!user?.id,
  });

  // Toggle opt-out mutation
  const toggleOptOutMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/settings/toggle-opt-out");
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch user settings
      queryClient.invalidateQueries({ queryKey: ["userSettings", user?.id] });
    },
  });

  // Update notification setting mutation
  const updateNotificationSettingMutation = useMutation({
    mutationFn: async ({
      notificationType,
      isEnabled,
    }: {
      notificationType: string;
      isEnabled: boolean;
    }) => {
      const response = await axios.put("/api/settings/notification", {
        notificationType,
        isEnabled,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch user settings
      queryClient.invalidateQueries({ queryKey: ["userSettings", user?.id] });
    },
  });

  // Update all notification settings mutation
  const updateNotificationSettingsMutation = useMutation({
    mutationFn: async (
      settings: Array<{ notificationType: string; isEnabled: boolean }>
    ) => {
      const response = await axios.put("/api/settings/notifications", {
        settings,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch user settings
      queryClient.invalidateQueries({ queryKey: ["userSettings", user?.id] });
    },
  });

  // Update opt-out keywords mutation
  const updateOptOutKeywordsMutation = useMutation({
    mutationFn: async (keywords: string[]) => {
      const response = await axios.put("/api/settings/opt-out-keywords", {
        keywords,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch user settings
      queryClient.invalidateQueries({ queryKey: ["userSettings", user?.id] });
    },
  });

  // Submit OBA request mutation
  const submitOBARequestMutation = useMutation({
    mutationFn: async ({
      phoneNumberId,
      data,
    }: {
      phoneNumberId: string;
      data: OBARequestData;
    }) => {
      const response = await axios.post(
        `/api/oba/request?phoneNumberId=${phoneNumberId}`,
        data
      );
      return response.data;
    },
  });

  // Get OBA status query - will be fetched when user has WhatsApp account
  const {
    data: obaStatus,
    isLoading: isOBAStatusLoading,
    error: obaStatusError,
    refetch: refetchOBAStatus,
  } = useQuery({
    queryKey: [
      "obaStatus",
      user?.id,
      user?.whatsappAccount?.activePhoneNumber?.id,
    ],
    queryFn: async () => {
      if (!user?.id || !user?.whatsappAccount?.activePhoneNumber?.id)
        return null;

      // Fetch OBA status for the current active phone number
      const response = await axios.get(
        `/api/oba/status?phoneNumberId=${user.whatsappAccount.activePhoneNumber.id}`
      );
      return response.data;
    },
    enabled: !!(user?.id && user?.whatsappAccount?.activePhoneNumber?.id),
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/settings/delete-account");
      return response.data;
    },
  });

  // disconnect whatsapp account mutation
  const disconnectWhatsappAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/settings/disconnect-whatsapp");
      return response.data;
    },
  });

  // fetch payment history
  const paymentHistoryQuery = useQuery({
    queryKey: ["paymentHistory", user?.id],
    queryFn: async () => {
      const response = await axios.get("/api/subscription/payment-history");
      return response.data;
    },
  });

  const value: SettingsContextType = {
    userSettings: userSettings || undefined,
    isLoading,
    error: error as Error | null,
    toggleOptOut: async () => {
      await toggleOptOutMutation.mutateAsync();
    },
    updateNotificationSetting: async (
      notificationType: string,
      isEnabled: boolean
    ) => {
      await updateNotificationSettingMutation.mutateAsync({
        notificationType,
        isEnabled,
      });
    },
    updateNotificationSettings: async (
      settings: Array<{ notificationType: string; isEnabled: boolean }>
    ) => {
      await updateNotificationSettingsMutation.mutateAsync(settings);
    },
    updateOptOutKeywords: async (keywords: string[]) => {
      await updateOptOutKeywordsMutation.mutateAsync(keywords);
    },
    submitOBARequest: async (phoneNumberId: string, data: OBARequestData) => {
      await submitOBARequestMutation.mutateAsync({ phoneNumberId, data });
    },
    obaStatus: obaStatus || undefined,
    isOBAStatusLoading,
    obaStatusError: obaStatusError as Error | null,
    refetchOBAStatus,
    fetchOBAStatus: async (phoneNumberId: string) => {
      // Update the query to fetch OBA status for the specific phone number
      const response = await axios.get(
        `/api/oba/status?phoneNumberId=${phoneNumberId}`
      );
      const data = response.data as OBAStatus;

      // Update the query cache manually
      queryClient.setQueryData(["obaStatus", user?.id], data);
    },
    deleteAccount: async () => {
      await deleteAccountMutation.mutateAsync();
    },
    disconnectWhatsappAccount: async () => {
      await disconnectWhatsappAccountMutation.mutateAsync();
    },
    paymentHistory: paymentHistoryQuery.data || undefined,
    isPaymentHistoryLoading: paymentHistoryQuery.isLoading,
    paymentHistoryError: paymentHistoryQuery.error as Error | null,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
