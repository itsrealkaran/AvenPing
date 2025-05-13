import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import Card from "@/components/ui/card";
import * as Icons from "lucide-react";
import { MetricData } from "./data";

export type MetricCardProps = MetricData;

export default function MetricCard({
  title,
  value,
  change,
  icon: iconName,
}: MetricCardProps) {
  const isPositive = change >= 0;
  const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold mb-1">{value}</div>
          <div
            className={`flex items-center text-sm ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
            <span>{Math.abs(change)}%</span>
            <span className="text-gray-600 ml-1">vs last period</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
