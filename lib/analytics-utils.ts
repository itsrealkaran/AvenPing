export interface CampaignData {
  date: string;
  sent: number;
  delivered: number;
  opened: number;
}

export interface ContactGrowthData {
  name: string;
  contacts: number;
}

export function filterDataByPeriod<T extends { date?: string; name?: string }>(
  data: T[],
  days: number
): T[] {
  if (!data || data.length === 0) return [];

  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  return data.filter(item => {
    const itemDate = item.date || item.name;
    if (!itemDate) return false;
    
    const date = new Date(itemDate);
    return date >= cutoffDate;
  });
}

export function filterCampaignData(data: CampaignData[], days: number): CampaignData[] {
  return filterDataByPeriod(data, days);
}

export function filterContactGrowthData(data: ContactGrowthData[], days: number): ContactGrowthData[] {
  return filterDataByPeriod(data, days);
}

export function getPeriodDays(period: string): number {
  switch (period) {
    case '7': return 7;
    case '15': return 15;
    case '30': return 30;
    case '90': return 90;
    case '360': return 360;
    default: return 30;
  }
} 