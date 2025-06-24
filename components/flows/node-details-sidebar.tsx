import React from "react";
import { Node } from "@xyflow/react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface NodeDetailsSidebarProps {
  selectedNode: Node | null;
  onClose: () => void;
  onUpdateNodeData: (key: string, value: any) => void;
}

const MAX_REPLY_BUTTONS = 3;

function isFile(val: any): val is File {
  return (
    val &&
    typeof val === "object" &&
    typeof val.name === "string" &&
    typeof val.size === "number"
  );
}

const renderNodeDetails = (
  selectedNode: Node,
  onUpdateNodeData: (key: string, value: any) => void
) => {
  const nodeType = selectedNode.data.nodeType;

  // Message Action Node
  if (nodeType === "MessageAction") {
    const replyButtons: string[] = Array.isArray(selectedNode.data.replyButtons)
      ? selectedNode.data.replyButtons
      : [""];
    return (
      <>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={
              typeof selectedNode.data.message === "string"
                ? selectedNode.data.message
                : ""
            }
            onChange={(e) => onUpdateNodeData("message", e.target.value)}
            className="mt-1"
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="link">Optional Link</Label>
          <Input
            id="link"
            value={
              typeof selectedNode.data.link === "string"
                ? selectedNode.data.link
                : ""
            }
            onChange={(e) => onUpdateNodeData("link", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Reply Buttons (max 3)</Label>
          {replyButtons.map((label, idx) => (
            <div key={idx} className="flex items-center gap-2 mt-2">
              <Input
                value={typeof label === "string" ? label : ""}
                onChange={(e) => {
                  const newButtons = [...replyButtons];
                  newButtons[idx] = e.target.value;
                  onUpdateNodeData("replyButtons", newButtons);
                }}
                placeholder={`Button ${idx + 1} label`}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newButtons = replyButtons.filter((_, i) => i !== idx);
                  onUpdateNodeData("replyButtons", newButtons);
                }}
                disabled={replyButtons.length === 1}
                type="button"
              >
                Remove
              </Button>
            </div>
          ))}
          {replyButtons.length < MAX_REPLY_BUTTONS && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() =>
                onUpdateNodeData("replyButtons", [...replyButtons, ""])
              }
              type="button"
            >
              Add Button
            </Button>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Number of outgoing connections: {replyButtons.length || 1}
        </div>
      </>
    );
  }

  // Connect Flow node
  if (nodeType === "ConnectFlowAction") {
    return (
      <div>
        <Label htmlFor="flow">Connect to Flow</Label>
        {/* Placeholder dropdown, replace with real flows */}
        <select
          id="flow"
          className="mt-1 w-full border rounded px-2 py-1"
          value={
            typeof selectedNode.data.flowId === "string"
              ? selectedNode.data.flowId
              : ""
          }
          onChange={(e) => onUpdateNodeData("flowId", e.target.value)}
        >
          <option value="">Select a flow...</option>
          <option value="flow1">Flow 1</option>
          <option value="flow2">Flow 2</option>
        </select>
      </div>
    );
  }

  // Start node
  if (nodeType === "Start") {
    return (
      <div>
        <Label htmlFor="startKeywords">Start Keywords</Label>
        <Input
          id="startKeywords"
          value={
            typeof selectedNode.data.startKeywords === "string"
              ? selectedNode.data.startKeywords
              : ""
          }
          onChange={(e) => onUpdateNodeData("startKeywords", e.target.value)}
          placeholder="Enter keywords, separated by commas"
          className="mt-1"
        />
      </div>
    );
  }

  // Image node & all message blocks
  if (
    nodeType === "ImageMessage" ||
    nodeType === "VideoMessage" ||
    nodeType === "DocumentMessage" ||
    nodeType === "AudioMessage" ||
    nodeType === "TemplateMessage"
  ) {
    return (
      <>
        <div>
          <Label htmlFor="fileUpload">Upload File</Label>
          <Input
            id="fileUpload"
            type="file"
            accept="image/*,video/*,audio/*,application/pdf"
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                onUpdateNodeData("file", file);
              }
            }}
            className="mt-1"
          />
          {isFile(selectedNode.data.file) && (
            <div className="text-xs text-green-600 mt-1">
              File selected: {selectedNode.data.file.name}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="caption">Caption (optional)</Label>
          <Input
            id="caption"
            value={
              typeof selectedNode.data.caption === "string"
                ? selectedNode.data.caption
                : ""
            }
            onChange={(e) => onUpdateNodeData("caption", e.target.value)}
            className="mt-1"
          />
        </div>
      </>
    );
  }

  // Default fallback
  return <div>No details available for this node type.</div>;
};

const NodeDetailsSidebar: React.FC<NodeDetailsSidebarProps> = ({
  selectedNode,
  onClose,
  onUpdateNodeData,
}) => {
  if (!selectedNode) return null;

  return (
    <div
      className="absolute z-30 top-16 right-4 flex flex-col gap-4 bg-white border border-gray-200 rounded-xl shadow-lg p-4 overflow-auto max-h-[calc(100%-5rem)]"
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
        {/* Render node-specific details */}
        {renderNodeDetails(selectedNode, onUpdateNodeData)}

        {/* Node Type and Node ID are always shown */}
        <div>
          <Label>Node Type</Label>
          <div className="text-sm text-gray-700 mt-1 px-3 py-2 bg-gray-50 rounded border border-gray-200">
            {typeof selectedNode.data.nodeType === "string"
              ? selectedNode.data.nodeType
              : "Custom"}
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
