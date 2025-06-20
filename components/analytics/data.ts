// Types
export type MetricData = {
  title: string;
  value: string;
  change: number;
  icon: keyof typeof import("lucide-react");
  color: string;
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
    icon: "Mail",
    color: "cyan",
  },
  {
    title: "Delivery Rate",
    value: "98.2%",
    change: 2.1,
    icon: "CheckCheck",
    color: "green",
  },
  {
    title: "Active Contacts",
    value: "8,642",
    change: 5.3,
    icon: "Users",
    color: "yellow",
  },
  {
    title: "Response Rate",
    value: "76.8%",
    change: -1.2,
    icon: "Clock",
    color: "orange",
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

// --- Generic Sample Data Generators ---
export function generateFlowData(): FlowData[] {
  return [
    { name: "Flow 1", completed: 50 + Math.floor(Math.random() * 50), dropped: 10 + Math.floor(Math.random() * 20) },
    { name: "Flow 2", completed: 50 + Math.floor(Math.random() * 50), dropped: 10 + Math.floor(Math.random() * 20) },
    { name: "Flow 3", completed: 50 + Math.floor(Math.random() * 50), dropped: 10 + Math.floor(Math.random() * 20) },
    { name: "Flow 4", completed: 50 + Math.floor(Math.random() * 50), dropped: 10 + Math.floor(Math.random() * 20) },
  ];
}

export function generateResponseTimeData(): ResponseTimeData[] {
  const buckets = ["< 5 min", "5-15 min", "15-30 min", "30+ min"];
  return buckets.map((name) => ({
    name,
    value: 10 + Math.floor(Math.random() * 40),
  }));
}

export function generateContactGrowthData({
  days,
  checkpoint = "daily",
  startDate = new Date(),
}: {
  days: number;
  checkpoint?: "daily" | "semiweekly" | "monthly";
  startDate?: Date;
}): ContactGrowthData[] {
  const data: ContactGrowthData[] = [];
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

  let baseContacts = 5000; // Starting with 5000 contacts
  for (let i = 0; i < checkpoints; i++) {
    // Calculate date for label
    let date = new Date(startDate);
    if (checkpoint === "monthly") date.setMonth(date.getMonth() - (checkpoints - 1 - i));
    else if (checkpoint === "semiweekly") date.setDate(date.getDate() - (checkpoints - 1 - i) * 3);
    else date.setDate(date.getDate() - (checkpoints - 1 - i));

    // Simulate contact growth with some randomness
    baseContacts += 100 + Math.floor(Math.random() * 200);

    data.push({
      name: labelFn(i, date),
      contacts: baseContacts,
    });
  }
  return data;
}

const FLOW_NAMES = [
  "Welcome Sequence",
  "Abandoned Cart",
  "Post-Purchase",
  "Re-engagement",
  "Feedback Loop"
];

export function generateTemplateData({
  days,
  checkpoint = "daily",
  startDate = new Date(),
}: {
  days: number;
  checkpoint?: "daily" | "semiweekly" | "monthly";
  startDate?: Date;
}): TemplateData[] {
  return FLOW_NAMES.map((name, index) => {
    // Generate success rate with some variation based on flow type
    const baseSuccess = 75 + (index * 2); // Slightly higher success for later flows
    const variation = Math.random() * 10 - 5; // Random variation between -5 and +5
    const success = Math.min(Math.max(Math.round(baseSuccess + variation), 60), 95);

    return {
      name,
      success,
    };
  });
}

// Pre-generated datasets for filters
export const campaignDataLast7Days = generateCampaignData({ days: 7, checkpoint: "daily" });
export const campaignDataLast15Days = generateCampaignData({ days: 15, checkpoint: "daily" });
export const campaignDataLast30Days = generateCampaignData({ days: 30, checkpoint: "semiweekly" });
export const campaignDataLast90Days = generateCampaignData({ days: 90, checkpoint: "semiweekly" });
export const campaignDataLast360Days = generateCampaignData({ days: 360, checkpoint: "monthly" });

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

// --- Filtered Data for FlowData ---
export const flowDataLast7 = generateFlowData();
export const flowDataLast15 = generateFlowData();
export const flowDataLast30 = generateFlowData();
export const flowDataLast90 = generateFlowData();
export const flowDataLast360 = generateFlowData();

export const FLOW_FILTER_OPTIONS: DropdownOption[] = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 15 Days", value: "15" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
  { label: "Last 360 Days", value: "360" },
];
export const FLOW_FILTER_DATA_MAP: Record<string, FlowData[]> = {
  "7": flowDataLast7,
  "15": flowDataLast15,
  "30": flowDataLast30,
  "90": flowDataLast90,
  "360": flowDataLast360,
};
export function getFlowFilterLabel(value: string): string {
  return FLOW_FILTER_OPTIONS.find((opt) => opt.value === value)?.label || "Last 30 Days";
}

// --- Filtered Data for ResponseTimeData ---
export const responseTimeDataLast7 = generateResponseTimeData();
export const responseTimeDataLast15 = generateResponseTimeData();
export const responseTimeDataLast30 = generateResponseTimeData();
export const responseTimeDataLast90 = generateResponseTimeData();
export const responseTimeDataLast360 = generateResponseTimeData();

export const RESPONSE_FILTER_OPTIONS: DropdownOption[] = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 15 Days", value: "15" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
  { label: "Last 360 Days", value: "360" },
];
export const RESPONSE_FILTER_DATA_MAP: Record<string, ResponseTimeData[]> = {
  "7": responseTimeDataLast7,
  "15": responseTimeDataLast15,
  "30": responseTimeDataLast30,
  "90": responseTimeDataLast90,
  "360": responseTimeDataLast360,
};
export function getResponseFilterLabel(value: string): string {
  return RESPONSE_FILTER_OPTIONS.find((opt) => opt.value === value)?.label || "Last 30 Days";
}

// --- Filtered Data for ContactGrowthData ---
export const contactGrowthDataLast15 = generateContactGrowthData({ days: 15, checkpoint: "daily" });
export const contactGrowthDataLast30 = generateContactGrowthData({ days: 30, checkpoint: "semiweekly" });
export const contactGrowthDataLast90 = generateContactGrowthData({ days: 90, checkpoint: "semiweekly" });
export const contactGrowthDataLast360 = generateContactGrowthData({ days: 360, checkpoint: "monthly" });

export const CONTACT_FILTER_OPTIONS: DropdownOption[] = [
  { label: "Last 15 Days", value: "15" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
  { label: "Last 360 Days", value: "360" },
];
export const CONTACT_FILTER_DATA_MAP: Record<string, ContactGrowthData[]> = {
  "15": contactGrowthDataLast15,
  "30": contactGrowthDataLast30,
  "90": contactGrowthDataLast90,
  "360": contactGrowthDataLast360,
};
export function getContactFilterLabel(value: string): string {
  return CONTACT_FILTER_OPTIONS.find((opt) => opt.value === value)?.label || "Last 30 Days";
}

// --- Filtered Data for TemplateData ---
export const templateDataLast7 = generateTemplateData({ days: 7, checkpoint: "daily" });
export const templateDataLast15 = generateTemplateData({ days: 15, checkpoint: "daily" });
export const templateDataLast30 = generateTemplateData({ days: 30, checkpoint: "semiweekly" });
export const templateDataLast90 = generateTemplateData({ days: 90, checkpoint: "semiweekly" });
export const templateDataLast360 = generateTemplateData({ days: 360, checkpoint: "monthly" });

export const TEMPLATE_FILTER_OPTIONS: DropdownOption[] = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 15 Days", value: "15" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
  { label: "Last 360 Days", value: "360" },
];
export const TEMPLATE_FILTER_DATA_MAP: Record<string, TemplateData[]> = {
  "7": templateDataLast7,
  "15": templateDataLast15,
  "30": templateDataLast30,
  "90": templateDataLast90,
  "360": templateDataLast360,
};
export function getTemplateFilterLabel(value: string): string {
  return TEMPLATE_FILTER_OPTIONS.find((opt) => opt.value === value)?.label || "Last 30 Days";
} 