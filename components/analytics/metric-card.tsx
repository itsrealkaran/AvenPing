import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import * as Icons from "lucide-react";

import Card from "@/components/ui/card";
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
    <Card className={`pt-2 ${color}`}>
      <div className="flex items-start justify-between">
        <div className="p-2 bg-black/5 rounded-lg">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>

        <div className="flex items-center text-sm">
          {change !== 0 && (
            <div
              className={`flex items-center mr-2 ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </Card>
  );
}
