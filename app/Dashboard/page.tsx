import Body from "@/components/UI/body";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <Body icon={LayoutDashboard} title="Dashboard">
      <div>
        <h2>Dashboard Content</h2>
        {/* Dashboard content goes here */}
      </div>
    </Body>
  );
}
