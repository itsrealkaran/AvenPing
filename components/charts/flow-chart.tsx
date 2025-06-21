import React from "react";
import Card from "@/components/ui/card";
import {
  FLOW_FILTER_OPTIONS,
  FLOW_FILTER_DATA_MAP,
  getFlowFilterLabel,
  FlowData,
} from "../analytics/data";
import { cx } from "@/lib/utils";
import { BarChart, TooltipProps } from "@/components/charts/bar-chart";
import { DropdownButton } from "../ui/dropdown-button";

interface Issue {
  status: "completed" | "dropped";
  value: number;
  percentage: number;
}

const status = {
  completed: "bg-blue-500",
  dropped: "bg-emerald-500",
};

const Tooltip = ({ payload, active, label }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload.map((item) => ({
    status: item.category as Issue["status"],
    value: item.value,
    percentage: (
      (item.value / (item.payload.completed + item.payload.dropped)) *
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

export default function FlowChart() {
  const [selected, setSelected] = React.useState("30");
  const chartData = FLOW_FILTER_DATA_MAP[selected];
  const selectedLabel = getFlowFilterLabel(selected);

  // Determine categories dynamically from the first data row, fallback to []
  const categories =
    chartData && chartData.length > 0
      ? Object.keys(chartData[0]).filter((k) => k !== "name")
      : [];

  return (
    <Card
      title="Message Flow Analytics"
      headerButton={
        <DropdownButton
          options={FLOW_FILTER_OPTIONS}
          onChange={setSelected}
          selected={selected}
          size="xs"
          variant="outline"
        >
          {selectedLabel}
        </DropdownButton>
      }
    >
      <div className="p-4">
        <BarChart
          className="hidden h-72 sm:block"
          data={chartData}
          index="name"
          categories={categories}
          colors={["blue", "emerald"]}
          yAxisWidth={35}
          showLegend={true}
          customTooltip={Tooltip}
        />
        <BarChart
          className="h-80 sm:hidden"
          data={chartData}
          index="date"
          categories={categories}
          colors={["blue", "emerald"]}
          showYAxis={false}
          showLegend={true}
          startEndOnly={true}
          customTooltip={Tooltip}
        />
      </div>
    </Card>
  );
}
