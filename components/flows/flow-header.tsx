import React from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlowHeaderProps {
  onBack: () => void;
  onSave: () => void;
}

const FlowHeader = ({ onBack, onSave }: FlowHeaderProps) => {
  return (
    <div className="absolute rounded-t-lg top-0 left-0 right-0 z-20 flex items-center justify-between p-3 bg-white border-b border-gray-200">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 px-2 py-1 rounded transition"
      >
        <ArrowLeft size={16} /> Back
      </button>
      <Button onClick={onSave} size="sm">
        <Save size={16} /> Save
      </Button>
    </div>
  );
};

export default FlowHeader;
