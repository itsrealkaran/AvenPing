"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTemplates } from "./template-provider";

export interface Campaign {
  id: string;
  name: string;
  type: string;
  message?: string;
  templateName?: string;
  templateParams?: string;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'FAILED';
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  accountId: string;
}

interface CampaignData {
  name: string;
  type: 'TEMPLATE' | 'TEXT';
  message?: string;
  templateName?: string;
  templateParams?: string;
  templateData?: any; // Full template data from template provider
  scheduledAt?: Date;
  recipientPhoneNumbers: Array<{
    phoneNumber: string;
    phoneNumberId: string;
  }>;
  phoneNumberId: string;
}

interface CampaignContextType {
  campaigns: Campaign[];
  isLoading: boolean;
  error: string | null;
  createCampaign: (data: CampaignData) => Promise<Campaign>;
  selectedWhatsAppAccountId: string | null;
  setSelectedWhatsAppAccountId: (id: string | null) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [selectedWhatsAppAccountId, setSelectedWhatsAppAccountId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { templates } = useTemplates();

  // Fetch campaigns
  const {
    data: campaigns = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['campaigns', selectedWhatsAppAccountId],
    queryFn: async () => {
      if (!selectedWhatsAppAccountId) {
        return [];
      }
      
      const response = await fetch(`/api/whatsapp/campaigns?id=${selectedWhatsAppAccountId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      const data = await response.json();
      return data.campaigns;
    },
    enabled: !!selectedWhatsAppAccountId,
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: CampaignData) => {
      if (!selectedWhatsAppAccountId) {
        throw new Error('No WhatsApp account selected');
      }

      const response = await fetch(`/api/whatsapp/campaigns?id=${selectedWhatsAppAccountId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create campaign');
      }

      return response.json();
    },
    onSuccess: (newCampaign) => {
      // Invalidate and refetch campaigns
      queryClient.invalidateQueries({ queryKey: ['campaigns', selectedWhatsAppAccountId] });
      toast.success('Campaign created successfully!');
    },
    onError: (error: Error) => {
      console.error('Error creating campaign:', error);
      toast.error(error.message || 'Failed to create campaign');
    },
  });

  const createCampaign = async (data: CampaignData): Promise<Campaign> => {
    return createCampaignMutation.mutateAsync(data);
  };

  const value: CampaignContextType = {
    campaigns,
    isLoading,
    error: error?.message || null,
    createCampaign,
    selectedWhatsAppAccountId,
    setSelectedWhatsAppAccountId,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns() {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
} 