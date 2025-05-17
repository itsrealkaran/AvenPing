"use client";

import Card from "@/components/ui/card";
import { DonutChart } from "@/components/ui/donut-chart";
import { ResponseTimeData } from "./data";

const colors: ("blue" | "violet" | "cyan" | "emerald")[] = [
  "blue",
  "violet",
  "cyan",
  "emerald",
];

export const DonutChartHero = ({ data }: { data: ResponseTimeData[] }) => (
  <div className="flex flex-1 flex-col items-center justify-center p-2">
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
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {data?.map((item, index) => (
        <div key={item.name} className="flex items-center gap-1">
          <div className={`h-2 w-2 rounded-sm bg-${colors[index]}-500`} />
          <span className="text-xs text-gray-600">{item.name}:</span>
          <span className="text-xs font-medium">
            {Intl.NumberFormat("us").format(item.value)}
          </span>
        </div>
      ))}
    </div>
  </div>
);

type Props = {
  data: ResponseTimeData[];
};

export default function ResponseTimeChart({ data }: Props) {
  return (
    <Card title="Response Time Distribution">
      <DonutChartHero data={data} />
    </Card>
  );
}
