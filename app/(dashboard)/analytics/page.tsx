"use client";

import Body from "@/components/layout/body";
import MetricCard from "@/components/analytics/metric-card";
import CampaignChart from "@/components/analytics/campaign-chart";
import FlowChart from "@/components/charts/flow-chart";
import ResponseTimeChart from "@/components/analytics/response-time-chart";
import ContactGrowthChart from "@/components/analytics/contact-growth-chart";
import TemplateChart from "@/components/analytics/template-chart";
import { useAnalytics } from "@/hooks/use-analytics";
import { Loader2, BarChart3, TrendingUp, Users, MessageSquare } from "lucide-react";

export default function AnalyticsPage() {
  const { data: analyticsData, isLoading, error } = useAnalytics();

  if (isLoading) {
    return (
      <Body title="Analytics">
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            {/* Animated Loading Icons */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse delay-100">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center animate-pulse delay-200">
                  <MessageSquare className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>

            {/* Loading Message */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Processing Analytics Data
              </h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                We're gathering your campaign performance, message delivery rates, and contact growth data to provide you with comprehensive insights.
              </p>
              
              {/* Progress Bar */}
              <div className="w-64 mx-auto mt-6">
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              {/* Loading Dots */}
              <div className="flex justify-center items-center gap-2 mt-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-sm text-gray-500">
              <p>This may take a few moments as we analyze your data...</p>
            </div>
          </div>
        </div>
      </Body>
    );
  }

  if (error) {
    return (
      <Body title="Analytics">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-600 mb-2">Failed to load analytics data</div>
            <div className="text-sm text-gray-500">
              Please try refreshing the page or contact support if the problem persists.
            </div>
          </div>
        </div>
      </Body>
    );
  }

  if (!analyticsData || !analyticsData.metrics || analyticsData.metrics.length === 0) {
    return (
      <Body title="Analytics">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-gray-600 mb-2">No analytics data available</div>
            <div className="text-sm text-gray-500">
              Start sending messages to see your analytics data.
            </div>
          </div>
        </div>
      </Body>
    );
  }

  return (
    <Body title="Analytics">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {analyticsData.metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CampaignChart data={analyticsData.campaignData || []} />
        <TemplateChart data={analyticsData.templateData || []} />
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <FlowChart data={analyticsData.flowData || []} />
        </div>
        <ResponseTimeChart data={analyticsData.responseTimeData || []} />
        <div className="col-span-3">
          <ContactGrowthChart data={analyticsData.contactGrowthData || []} />
        </div>
      </div>
    </Body>
  );
}