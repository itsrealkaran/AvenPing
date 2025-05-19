import React from "react";
import Card from "@/components/ui/card";
import { BarChart } from "@/components/ui/bar-chart";
import {
  FLOW_FILTER_OPTIONS,
  FLOW_FILTER_DATA_MAP,
  getFlowFilterLabel,
  FlowData,
} from "./data";
import { DropdownButton } from "@/components/ui/dropdown-button";

const valueFormatter = (number: number) =>
  `$${Intl.NumberFormat("us").format(number).toString()}`;

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
          className="h-80"
          data={chartData}
          index="name"
          categories={categories}
          valueFormatter={valueFormatter}
        />
      </div>
    </Card>
  );
}
