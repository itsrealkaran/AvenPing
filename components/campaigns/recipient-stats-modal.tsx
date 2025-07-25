import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { AreaChart } from "@/components/charts/area-chart";
import { BarChart } from "@/components/charts/bar-chart";

const FILTERS = [
  { key: "UNDELIVERED", label: "Undelivered", color: "#EF4444" },
  { key: "UNREAD", label: "Unread", color: "#F59E0B" },
  { key: "READ", label: "Read", color: "#10B981" },
  { key: "REPLIED", label: "Replied", color: "#3B82F6" },
];

export function RecipientStatsModal({ open, onClose, stats, chartData }: { open: boolean, onClose: () => void, stats?: { id: string, name: string, phoneNumber: string, status: string }[] | null, chartData?: { Status: string, Count: number }[] }) {
  const [activeFilter, setActiveFilter] = useState("UNDELIVERED");
  if (!open) return null;

  const chartCategories = ["Count"];
  const chartColors = FILTERS.map(f => {
    switch (f.key) {
      case "UNDELIVERED": return "red";
      case "UNREAD": return "yellow";
      case "READ": return "green";
      case "REPLIED": return "blue";
      default: return "gray";
    }
  });
  const filtered = stats?.filter((r: any) => r.status?.toUpperCase() === activeFilter) || [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-2xl mx-auto">
        <Card
          title="Recipient Stats"
          className="shadow-2xl border-0 p-0"
          headerButton={
            <button
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition absolute top-4 right-4"
              onClick={onClose}
              aria-label="Close"
            >
              <span className="text-2xl leading-none">&times;</span>
            </button>
          }
        >
          {/* Bar Chart */}
          <div className="mb-6 mt-2">
            <BarChart
              data={chartData || []}
              index="Status"
              categories={chartCategories}
              colors={chartColors}
              showLegend={false}
              showXAxis={true}
              showYAxis={true}
              showGridLines={true}
              valueFormatter={(v) => v.toString()}
              className="h-80"
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-6 mt-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  activeFilter === f.key
                    ? 'bg-blue-100 text-blue-700 border-blue-400 shadow-sm'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
                style={{ borderColor: activeFilter === f.key ? f.color : undefined }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                {f.label}
              </button>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl shadow-inner max-h-80 overflow-y-auto divide-y divide-gray-200">
            {filtered.length > 0 ? (
              filtered.map((recipient: any) => (
                <div key={recipient.id} className="flex items-center justify-between py-3 px-4 hover:bg-gray-100 transition">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{recipient.name || "Unknown"}</div>
                    <div className="text-xs text-gray-500 truncate">{recipient.phoneNumber}</div>
                  </div>
                  <span className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold`} style={{ backgroundColor: FILTERS.find(f => f.key === recipient.status?.toUpperCase())?.color + '22', color: FILTERS.find(f => f.key === recipient.status?.toUpperCase())?.color }}>
                    {recipient.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-12">No recipients in this category.</div>
            )}
          </div>
          <Button onClick={onClose} className="mt-6 w-full font-semibold">Close</Button>
        </Card>
      </div>
    </div>
  );
} 