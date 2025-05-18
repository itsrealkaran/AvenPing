// Types
export type MetricData = {
  title: string;
  value: string;
  change: number;
  icon: string; // Icon name to be mapped in the component
};

export type CampaignData = {
  date: string;
  sent: number;
  delivered: number;
  opened: number;
};

export type FlowData = {
  name: string;
  completed: number;
  dropped: number;
};

export type ResponseTimeData = {
  name: string;
  value: number;
};

export type ContactGrowthData = {
  name: string;
  contacts: number;
};

export type TemplateData = {
  name: string;
  success: number;
};

// Sample data exports
export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const sampleMetrics: MetricData[] = [
  {
    title: "Total Messages Sent",
    value: "24,512",
    change: 12.5,
    icon: "MessageSquare",
  },
  {
    title: "Delivery Rate",
    value: "98.2%",
    change: 2.1,
    icon: "CheckCheck",
  },
  {
    title: "Active Contacts",
    value: "8,642",
    change: 5.3,
    icon: "Users",
  },
  {
    title: "Response Rate",
    value: "76.8%",
    change: -1.2,
    icon: "Clock",
  },
];

// --- Campaign Data Generator ---
function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function generateCampaignData({
  days,
  checkpoint = "daily",
  startDate = new Date(),
}: {
  days: number;
  checkpoint?: "daily" | "semiweekly" | "monthly";
  startDate?: Date;
}): CampaignData[] {
  const data: CampaignData[] = [];
  let checkpoints: number;
  let labelFn: (i: number, d: Date) => string;

  switch (checkpoint) {
    case "monthly":
      checkpoints = Math.ceil(days / 30);
      labelFn = (i, d) => d.toLocaleString("default", { month: "short", year: "numeric" });
      break;
    case "semiweekly":
      checkpoints = Math.ceil(days / 3);
      labelFn = (i, d) => formatDate(d);
      break;
    default:
      checkpoints = days;
      labelFn = (i, d) => formatDate(d);
  }

  for (let i = 0; i < checkpoints; i++) {
    // Simulate some data
    const sent = 1000 + Math.floor(Math.random() * 1000) + i * 100;
    const delivered = sent - Math.floor(Math.random() * 50);
    const opened = delivered - Math.floor(Math.random() * 200);

    // Calculate date for label
    let date = new Date(startDate);
    if (checkpoint === "monthly") date.setMonth(date.getMonth() - (checkpoints - 1 - i));
    else if (checkpoint === "semiweekly") date.setDate(date.getDate() - (checkpoints - 1 - i) * 3);
    else date.setDate(date.getDate() - (checkpoints - 1 - i));

    data.push({
      date: labelFn(i, date),
      sent,
      delivered,
      opened,
    });
  }
  return data;
}

// Pre-generated datasets for filters
export const campaignDataLast7Days = generateCampaignData({ days: 7, checkpoint: "daily" });
export const campaignDataLast15Days = generateCampaignData({ days: 15, checkpoint: "daily" });
export const campaignDataLast30Days = generateCampaignData({ days: 30, checkpoint: "semiweekly" });
export const campaignDataLast90Days = generateCampaignData({ days: 90, checkpoint: "semiweekly" });
export const campaignDataLast360Days = generateCampaignData({ days: 360, checkpoint: "monthly" });

export const sampleCampaignData: CampaignData[] = campaignDataLast30Days;

export const sampleFlowData: FlowData[] = [
  { name: "Flow 1", completed: 85, dropped: 15 },
  { name: "Flow 2", completed: 75, dropped: 25 },
  { name: "Flow 3", completed: 90, dropped: 10 },
  { name: "Flow 4", completed: 70, dropped: 30 },
];

export const sampleResponseTimeData: ResponseTimeData[] = [
  { name: "< 5 min", value: 30 },
  { name: "5-15 min", value: 40 },
  { name: "15-30 min", value: 20 },
  { name: "30+ min", value: 10 },
];

export const sampleContactGrowthData: ContactGrowthData[] = [
  { name: "Jan", contacts: 5000 },
  { name: "Feb", contacts: 6200 },
  { name: "Mar", contacts: 7800 },
  { name: "Apr", contacts: 8600 },
  { name: "May", contacts: 9400 },
  { name: "Jun", contacts: 10500 },
];

export const sampleTemplateData: TemplateData[] = [
  { name: "Welcome", success: 92 },
  { name: "Promo", success: 78 },
  { name: "Support", success: 85 },
  { name: "Follow-up", success: 88 },
];

// --- Campaign Chart Filter Options and Data Map ---
import type { DropdownOption } from "@/components/ui/dropdown-button";

export const FILTER_OPTIONS: DropdownOption[] = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 15 Days", value: "15" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
  { label: "Last 360 Days", value: "360" },
];

export const FILTER_DATA_MAP: Record<string, CampaignData[]> = {
  "7": campaignDataLast7Days,
  "15": campaignDataLast15Days,
  "30": campaignDataLast30Days,
  "90": campaignDataLast90Days,
  "360": campaignDataLast360Days,
};

export function getFilterLabel(value: string): string {
  return FILTER_OPTIONS.find((opt) => opt.value === value)?.label || "Last 30 Days";
} 