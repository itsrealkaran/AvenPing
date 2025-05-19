"use client";

import React from "react";
import Card from "@/components/ui/card";
import { cx } from "@/lib/utils";
import { AreaChart, TooltipProps } from "@/components/ui/area-chart";
import {
  CONTACT_FILTER_OPTIONS,
  CONTACT_FILTER_DATA_MAP,
  getContactFilterLabel,
  ContactGrowthData,
} from "./data";
import { DropdownButton } from "@/components/ui/dropdown-button";

const valueFormatter = (number: number) => {
  return Intl.NumberFormat("us").format(number).toString();
};

const Tooltip = ({ payload, active, label }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <>
      <div className="w-60 rounded-md border border-gray-500/10 bg-blue-500 px-4 py-1.5 text-sm shadow-md dark:border-gray-400/20 dark:bg-gray-900">
        <p className="flex items-center justify-between">
          <span className="text-gray-50 dark:text-gray-50">Date</span>
          <span className="font-medium text-gray-50 dark:text-gray-50">
            {label}
          </span>
        </p>
      </div>
      <div className="mt-1 w-60 space-y-1 rounded-md border border-gray-500/10 bg-white px-4 py-2 text-sm shadow-md dark:border-gray-400/20 dark:bg-gray-900">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center space-x-2.5">
            <span
              className="size-2.5 shrink-0 rounded-xs bg-blue-500 dark:bg-blue-500"
              aria-hidden={true}
            />
            <div className="flex w-full justify-between">
              <span className="text-gray-700 dark:text-gray-300">Contacts</span>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-gray-900 dark:text-gray-50">
                  {valueFormatter(item.value)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default function ContactGrowthChart() {
  const [selected, setSelected] = React.useState("30");
  const chartData = CONTACT_FILTER_DATA_MAP[selected];
  const selectedLabel = getContactFilterLabel(selected);

  return (
    <Card
      title="Contact Growth"
      headerButton={
        <DropdownButton
          options={CONTACT_FILTER_OPTIONS}
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
        <div>
          <AreaChart
            className="hidden h-72 sm:block"
            data={chartData}
            index="name"
            categories={["contacts"]}
            type="default"
            colors={["blue"]}
            valueFormatter={valueFormatter}
            yAxisWidth={35}
            showLegend={false}
            customTooltip={Tooltip}
            showGridLines={true}
            showYAxis={true}
            showXAxis={true}
          />
          <AreaChart
            className="h-80 sm:hidden"
            data={chartData}
            index="name"
            categories={["contacts"]}
            type="default"
            colors={["blue"]}
            valueFormatter={valueFormatter}
            showYAxis={false}
            showLegend={false}
            startEndOnly={true}
            customTooltip={Tooltip}
            showGridLines={true}
            showXAxis={true}
          />
        </div>
      </div>
    </Card>
  );
}
