"use client";

import Body from "@/components/layout/body";
import MetricCard from "@/components/analytics/metric-card";
import CampaignChart from "@/components/analytics/campaign-chart";
import FlowChart from "@/components/charts/flow-chart";
import ResponseTimeChart from "@/components/analytics/response-time-chart";
import ContactGrowthChart from "@/components/analytics/contact-growth-chart";
import TemplateChart from "@/components/analytics/template-chart";
import { sampleMetrics } from "@/components/analytics/data";

export default function AnalyticsPage() {
  return (
    <Body title="Analytics">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {sampleMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CampaignChart />
        <TemplateChart />
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <FlowChart />
        </div>
        <ResponseTimeChart />
        <div className="col-span-3">
          <ContactGrowthChart />
        </div>
      </div>
    </Body>
  );
}
