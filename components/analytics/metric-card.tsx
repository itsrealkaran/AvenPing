import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import * as Icons from "lucide-react";

import { MetricData } from "./data";

export type MetricCardProps = MetricData;

export default function MetricCard({
  title,
  value,
  change,
  icon: iconName,
  color,
}: MetricCardProps) {
  const isPositive = change >= 0;
  const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon;

  return (
    <div
      className={`bg-${color}-100 border border-gray-100 shadow-sm rounded-2xl pt-3 relative`}
    >
      {/* <div className={`absolute inset-0 bg-${color}-100 rounded-2xl`} /> */}
      <div className="flex items-start justify-between relative z-10 px-6">
        <div className="p-2 pb-1">
          <Icon className={`size-6 text-${color}-500`} />
        </div>

        <div className="flex items-center text-sm">
          {change !== 0 && (
            <div
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-background/50 border-2 border-white ${
                isPositive ? "text-green-700" : "text-red-700"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 relative z-10 px-6 pb-6">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
