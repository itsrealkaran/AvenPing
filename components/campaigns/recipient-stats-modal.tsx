import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { DonutChart } from "@/components/charts/donut-chart";

const FILTERS = [
  { key: "Undelivered", label: "Undelivered", color: "#EF4444" },
  { key: "Unread", label: "Unread", color: "#F59E0B" },
  { key: "Read", label: "Read", color: "#10B981" },
  { key: "Replied", label: "Replied", color: "#3B82F6" },
];

export function RecipientStatsModal({ open, onClose, stats, chartData }: { open: boolean, onClose: () => void, stats?: { id: string, name: string, phoneNumber: string, status: string }[] | null, chartData?: { Status: string, Count: number }[] }) {
  const [activeFilter, setActiveFilter] = useState("Undelivered");
  if (!open) return null;

  const chartColors = FILTERS.map(f => {
    switch (f.key) {
      case "Undelivered": return "red";
      case "Unread": return "yellow";
      case "Read": return "green";
      case "Replied": return "blue";
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
          {/* Pie Chart */}
          <div className="mb-6 mt-2 flex flex-col items-center">
            <DonutChart
              data={chartData || []}
              category="Status"
              value="Count"
              colors={chartColors}
              variant="donut"
              valueFormatter={(v: number) => v.toString()}
              showTooltip={true}
              showLabel={true}
              label="Total Recipients"
              className="h-80 w-80"
            />
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {FILTERS.map((filter) => (
                <div key={filter.key} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: filter.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {filter.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6 mt-2">
            {stats && stats.length > 0 && FILTERS.map((f) => (
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
          {stats && stats.length > 0 && (
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
          )}
          <Button onClick={onClose} className="mt-6 w-full font-semibold">Close</Button>
        </Card>
      </div>
    </div>
  );
} 