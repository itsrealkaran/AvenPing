import Card from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FlowData } from "./data";

type Props = {
  data: FlowData[];
};

export default function FlowChart({ data }: Props) {
  return (
    <Card title="Message Flow Analytics">
      <div className="p-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
              <Bar dataKey="dropped" fill="#ff8042" name="Dropped" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
