import { useQuery } from '@tanstack/react-query';

export interface AnalyticsData {
  metrics: {
    title: string;
    value: string;
    change: number;
  }[];
  campaignData: {
    date: string;
    unread: number;
    read: number;
    replied: number;
  }[];
  flowData: {
    name: string;
    completed: number;
    dropped: number;
  }[];
  responseTimeData: {
    name: string;
    value: number;
  }[];
  contactGrowthData: {
    name: string;
    contacts: number;
  }[];
  templateData: {
    name: string;
    success: number;
  }[];
}

export function useAnalytics() {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch('/api/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
} 