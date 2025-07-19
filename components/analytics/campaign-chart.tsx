"use client";
import React from "react";
import Card from "@/components/ui/card";
import { cx } from "@/lib/utils";
import { AreaChart, TooltipProps } from "@/components/charts/area-chart";
import { DropdownButton } from "@/components/ui/dropdown-button";
import { FILTER_OPTIONS, getFilterLabel } from "./data";
import { filterCampaignData, getPeriodDays } from "@/lib/analytics-utils";

interface CampaignData {
  date: string;
  sent: number;
  delivered: number;
  opened: number;
}

interface CampaignChartProps {
  data: CampaignData[];
}

interface Issue {
  status: "sent" | "delivered" | "opened";
  value: number;
  percentage: number;
}

const valueFormatter = (number: number) => {
  return Intl.NumberFormat("us").format(number).toString();
};

const status = {
  sent: "bg-blue-500",
  delivered: "bg-cyan-500",
  opened: "bg-violet-500",
};

const Tooltip = ({ payload, active, label }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload.map((item) => ({
    status: item.category as Issue["status"],
    value: item.value,
    percentage: (
      (item.value /
        (item.payload.sent +
          item.payload["delivered"] +
          item.payload["opened"])) *
      100
    ).toFixed(2),
  }));

  return (
    <>
      <div className="w-60 rounded-md border border-gray-500/10  bg-blue-500 px-4 py-1.5 text-sm shadow-md">
        <p className="flex items-center justify-between">
          <span className="text-gray-50">Date</span>
          <span className="font-medium text-gray-50">{label}</span>
        </p>
      </div>
      <div className="mt-1 w-60 space-y-1 rounded-md border border-gray-500/10  bg-white px-4 py-2 text-sm shadow-md">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2.5">
            <span
              className={cx(
                status[item.status],
                "size-2.5 shrink-0 rounded-xs"
              )}
              aria-hidden={true}
            />
            <div className="flex w-full justify-between">
              <span className=" text-gray-700">{item.status}</span>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-gray-900">{item.value}</span>
                <span className="text-gray-500">({item.percentage}&#37;)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

function AreaChartCustomTooltipExample({ data }: { data: CampaignData[] }) {
  return (
    <div>
      <AreaChart
        className="hidden h-72 sm:block"
        data={data}
        index="date"
        categories={["sent", "delivered", "opened"]}
        type="stacked"
        colors={["blue", "cyan", "violet"]}
        valueFormatter={valueFormatter}
        yAxisWidth={35}
        showLegend={true}
        customTooltip={Tooltip}
        showGridLines={true}
        showYAxis={true}
        showXAxis={true}
      />
      <AreaChart
        className="h-80 sm:hidden"
        data={data}
        index="date"
        categories={["sent", "delivered", "opened"]}
        type="stacked"
        colors={["blue", "cyan", "violet"]}
        valueFormatter={valueFormatter}
        showYAxis={false}
        showLegend={true}
        startEndOnly={true}
        customTooltip={Tooltip}
        showGridLines={true}
        showXAxis={true}
      />
    </div>
  );
}

export default function CampaignChart({ data }: CampaignChartProps) {
  const [selected, setSelected] = React.useState("30");
  const selectedLabel = getFilterLabel(selected);
  
  // Filter data based on selected period
  const filteredData = filterCampaignData(data, getPeriodDays(selected));

  return (
    <Card
      title="Campaign Performance"
      headerButton={
        <DropdownButton
          options={FILTER_OPTIONS}
          onChange={setSelected}
          selected={selected}
          size="sm"
          variant="outline"
        >
          {selectedLabel}
        </DropdownButton>
      }
    >
      <div className="p-4">
        <AreaChartCustomTooltipExample data={filteredData} />
      </div>
    </Card>
  );
}
