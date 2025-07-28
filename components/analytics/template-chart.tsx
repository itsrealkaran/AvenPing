"use client";

import React from "react";
import Card from "@/components/ui/card";
import { LineChart, TooltipProps } from "@/components/charts/line-chart";
import { DropdownButton } from "@/components/ui/dropdown-button";
import { TEMPLATE_FILTER_OPTIONS, getTemplateFilterLabel } from "./data";

interface TemplateData {
  name: string;
  success: number;
}

interface TemplateChartProps {
  data: TemplateData[];
}

const valueFormatter = (number: number) => {
  return `${Intl.NumberFormat("us").format(number)}%`;
};

const Tooltip = ({ payload, active, label }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <>
      <div className="w-60 rounded-md border border-gray-500/10 bg-blue-500 px-4 py-1.5 text-sm shadow-md">
        <p className="flex items-center justify-between">
          <span className="text-gray-50">Flow</span>
          <span className="font-medium text-gray-50">{label}</span>
        </p>
      </div>
      <div className="mt-1 w-60 space-y-1 rounded-md border border-gray-500/10 bg-white px-4 py-2 text-sm shadow-md">
        <div className="flex items-center space-x-2.5">
          <span
            className="size-2.5 shrink-0 rounded-xs bg-emerald-500"
            aria-hidden={true}
          />
          <div className="flex w-full justify-between">
            <span className="text-gray-700">Success Rate</span>
            <div className="flex items-center space-x-1">
              <span className="font-medium text-gray-900">
                {valueFormatter(payload[0].value)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function TemplateChart({ data }: TemplateChartProps) {
  const [selected, setSelected] = React.useState("30");
  const selectedLabel = getTemplateFilterLabel(selected);

  return (
    <Card
      title="Template Performance"
      headerButton={
        <DropdownButton
          options={TEMPLATE_FILTER_OPTIONS}
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
        <div>
          <LineChart
            className="hidden h-72 sm:block"
            data={data}
            index="name"
            categories={["success"]}
            colors={["emerald"]}
            valueFormatter={valueFormatter}
            yAxisWidth={35}
            showLegend={false}
            customTooltip={Tooltip}
            showGridLines={true}
            showYAxis={true}
            showXAxis={true}
            minValue={0}
            maxValue={100}
            intervalType="preserveStartEnd"
          />
          <LineChart
            className="h-80 sm:hidden"
            data={data}
            index="name"
            categories={["success"]}
            colors={["emerald"]}
            valueFormatter={valueFormatter}
            showYAxis={false}
            showLegend={false}
            startEndOnly={true}
            customTooltip={Tooltip}
            showGridLines={true}
            showXAxis={true}
            minValue={0}
            maxValue={100}
            intervalType="preserveStartEnd"
          />
        </div>
      </div>
    </Card>
  );
}
