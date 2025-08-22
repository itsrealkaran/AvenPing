"use client";

import React from "react";
import Card from "@/components/analytics/card";
import { DonutChart } from "@/components/charts/donut-chart";
import { DropdownButton } from "@/components/ui/dropdown-button";
import { RESPONSE_FILTER_OPTIONS, getResponseFilterLabel } from "./data";

interface ResponseTimeData {
  name: string;
  value: number;
}

interface ResponseTimeChartProps {
  data: ResponseTimeData[];
}

const colors: ("blue" | "violet" | "cyan" | "emerald")[] = [
  "blue",
  "violet",
  "cyan",
  "emerald",
];

export const DonutChartHero = ({ data }: { data: ResponseTimeData[] }) => (
  <div className="flex flex-1 flex-col items-center justify-center p-10">
    <DonutChart
      data={data}
      variant="pie"
      category="name"
      value="value"
      colors={colors}
      valueFormatter={(number: number) =>
        `${Intl.NumberFormat("us").format(number).toString()}`
      }
    />
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      {data?.map((item, index) => (
        <div key={item.name} className="flex items-center gap-4">
          <div className={`h-2.5 w-2.5 rounded-sm bg-${colors[index]}-500`} />
          <span className="text-xs text-gray-600">{item.name}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  const [selected, setSelected] = React.useState("30");
  const selectedLabel = getResponseFilterLabel(selected);

  return (
    <Card
      title="Response Time Distribution"
      headerButton={
        <DropdownButton
          options={RESPONSE_FILTER_OPTIONS}
          onChange={setSelected}
          selected={selected}
          size="sm"
          variant="outline"
        >
          {selectedLabel}
        </DropdownButton>
      }
    >
      <DonutChartHero data={data} />
    </Card>
  );
}
