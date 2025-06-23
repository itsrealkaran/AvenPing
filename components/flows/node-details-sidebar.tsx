import React from "react";
import { Node } from "@xyflow/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NodeDetailsSidebarProps {
  selectedNode: Node | null;
  onClose: () => void;
  onUpdateNodeData: (key: string, value: string) => void;
}

const NodeDetailsSidebar = ({
  selectedNode,
  onClose,
  onUpdateNodeData,
}: NodeDetailsSidebarProps) => {
  if (!selectedNode) return null;

  return (
    <div
      className="absolute z-30 top-16 right-4 flex flex-col gap-4 bg-white border border-gray-200 rounded-xl shadow-lg p-4"
      style={{ minWidth: 280 }}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-500 pl-1">
          Node Details
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="nodeLabel">Label</Label>
          <Input
            id="nodeLabel"
            value={(selectedNode.data.label as string) || ""}
            onChange={(e) => onUpdateNodeData("label", e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="nodeDescription">Description</Label>
          <Textarea
            id="nodeDescription"
            value={(selectedNode.data.description as string) || ""}
            onChange={(e) => onUpdateNodeData("description", e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label>Node Type</Label>
          <div className="text-sm text-gray-700 mt-1 px-3 py-2 bg-gray-50 rounded border border-gray-200">
            {(selectedNode.data.nodeType as string) || "Custom"}
          </div>
        </div>

        <div>
          <Label>Node ID</Label>
          <div className="text-xs text-gray-500 mt-1 px-3 py-2 bg-gray-50 rounded border border-gray-200 overflow-x-auto">
            {selectedNode.id}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeDetailsSidebar;
