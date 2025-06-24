import React from "react";
import { PanelLeft } from "lucide-react";

interface SidebarToggleProps {
  onShowSidebar: () => void;
}

const SidebarToggle = ({ onShowSidebar }: SidebarToggleProps) => {
  return (
    <div
      className="absolute z-30 top-16 left-4 bg-white border border-gray-200 rounded-lg shadow-md p-2 m-2 cursor-pointer hover:bg-gray-50 transition-all"
      onClick={onShowSidebar}
      title="Show components"
    >
      <PanelLeft size={16} className="text-gray-600" />
    </div>
  );
};

export default SidebarToggle;