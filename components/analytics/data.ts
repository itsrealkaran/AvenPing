// Types
export type MetricData = {
  title: string;
  value: string;
  change: number;
  icon: string; // Icon name to be mapped in the component
};

export type CampaignData = {
  name: string;
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

export const sampleCampaignData: CampaignData[] = [
  { name: "Week 1", sent: 1200, delivered: 1180, opened: 850 },
  { name: "Week 2", sent: 1500, delivered: 1470, opened: 1050 },
  { name: "Week 3", sent: 1800, delivered: 1750, opened: 1200 },
  { name: "Week 4", sent: 2200, delivered: 2150, opened: 1600 },
];

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