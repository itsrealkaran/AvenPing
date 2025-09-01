import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { MetricData } from "./data";

type MetricCardProps = MetricData & {
  isLoading: boolean;
};

export default function MetricCard({
  title,
  value,
  change,
  isLoading,
}: MetricCardProps) {
  const isPositive = change >= 0;
  const changePercentage = `${isPositive ? "+" : ""}${change.toFixed(1)}%`;

  const chartColor = isPositive ? "#8B5CF6" : "#F59E0B"; // violet for up, Amber for down
  const gradientId = `metric-gradient-${title
    .replace(/\s+/g, "-")
    .toLowerCase()}`;

  const generateChartData = () => {
    const data: { day: number; value: number }[] = [];
    const points = 7;
    const values = Array.from(
      { length: points },
      () => Math.random() * 50 + 10
    );

    if (isPositive) {
      values.sort((a, b) => a - b);
    } else {
      values.sort((a, b) => b - a);
    }

    // Make trend more obvious
    values[0] *= 0.8;
    values[points - 1] *= 1.2;

    for (let i = 0; i < points; i++) {
      data.push({ day: i + 1, value: values[i] });
    }
    return data;
  };

  return (
    <div className="border-3 border-[#E0E0E0] rounded-2xl bg-white p-4 flex flex-col">
      <span className="text-sm text-gray-700">{title}</span>
      <div className="flex justify-between gap-4">
        <div className="flex flex-col">
          {isLoading ? (
            <div className="my-1 w-14 h-10 bg-gray-200 rounded animate-pulse" />
          ) : (
            <span className="text-2xl font-300 text-gray-800 mt-2">
              {value}
            </span>
          )}
          <div
            className={`flex items-center gap-1 mt-2 text-xs ${
              isLoading
                ? "border-gray-300"
                : isPositive
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            <div
              className={`p-0.5 border-2 rounded-lg ${
                isLoading
                  ? "border-gray-300"
                  : isPositive
                  ? "border-green-600"
                  : "border-red-600"
              }`}
            >
              {isLoading ? (
                <div className="size-3 bg-gray-200 rounded animate-pulse" />
              ) : isPositive ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
            </div>
            {isLoading ? (
              <div className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
            ) : (
              <span className="font-semibold">{changePercentage}</span>
            )}
            <span className="text-gray-500 font-300 whitespace-nowrap">
              last week
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {isLoading ? (
            <div className="w-28 h-16 bg-gray-200 rounded animate-pulse" />
          ) : (
            <div className="w-28 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={generateChartData()}
                  margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={chartColor}
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartColor}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chartColor}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#${gradientId})`}
                    dot={false}
                    activeDot={{
                      r: 4,
                      stroke: chartColor,
                      fill: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}