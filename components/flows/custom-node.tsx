import React from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Image,
  FileVideo,
  FileText,
  FileAudio,
  MessageSquare,
  GitMerge,
  Play,
  Trash,
} from "lucide-react";

interface CustomNodeProps {
  data: any;
  selected: boolean;
  id: string;
  onDelete?: (id: string) => void;
}

const CustomNode = ({ data, selected, id, onDelete }: CustomNodeProps) => {
  const isStartNode = id === "1" || data.isStartNode;

  // Determine node style based on category and nodeType
  let nodeStyle = "bg-white";
  let borderStyle = selected ? "border-blue-500" : "border-gray-300";
  let handleColor = "!bg-blue-400";
  let textColor = "text-gray-700";

  // First check for specific node types that might be ambiguous
  if (data.nodeType === "MessageAction") {
    // Special case for ChatAction (previously MessageAction)
    nodeStyle = "bg-green-50";
    borderStyle = selected ? "border-green-500" : "border-green-200";
    handleColor = "!bg-green-400";
    textColor = "text-green-700";
  }
  // Then check for general patterns
  else if (data.nodeType && data.nodeType.includes("Message")) {
    nodeStyle = "bg-blue-50";
    borderStyle = selected ? "border-blue-500" : "border-blue-200";
    handleColor = "!bg-blue-400";
    textColor = "text-blue-700";
  } else if (data.nodeType && data.nodeType.includes("Action")) {
    nodeStyle = "bg-green-50";
    borderStyle = selected ? "border-green-500" : "border-green-200";
    handleColor = "!bg-green-400";
    textColor = "text-green-700";
  } else if (isStartNode) {
    nodeStyle = "bg-purple-50";
    borderStyle = selected ? "border-purple-500" : "border-purple-200";
    handleColor = "!bg-purple-400";
    textColor = "text-purple-700";
  }

  // Determine node icon based on type
  const getNodeIcon = () => {
    if (isStartNode) return <Play size={14} className="text-purple-500" />;

    switch (data.nodeType) {
      case "ImageMessage":
        return <Image size={14} className="text-blue-500" />;
      case "VideoMessage":
        return <FileVideo size={14} className="text-blue-500" />;
      case "DocumentMessage":
        return <FileText size={14} className="text-blue-500" />;
      case "AudioMessage":
        return <FileAudio size={14} className="text-blue-500" />;

      case "MessageAction":
        return <MessageSquare size={14} className="text-green-500" />;
      case "ConnectFlowAction":
        return <GitMerge size={14} className="text-green-500" />;
      default:
        return null;
    }
  };

  // For MessageAction, render normal outgoing handle + one handle per reply button
  let outgoingHandles: React.ReactNode = null;
  if (data.nodeType === "MessageAction") {
    const replyButtons = Array.isArray(data.replyButtons)
      ? data.replyButtons
      : [];

    // Normal outgoing handle (only shown when no buttons)
    const normalHandle =
      replyButtons.length === 0 ? (
        <div className="flex items-center gap-1 w-full justify-center relative">
          <Handle
            type="source"
            position={Position.Right}
            id="normal"
            className={handleColor}
            style={{ right: -12, top: -12 }}
          />
        </div>
      ) : null;

    // Add handles for each reply button
    const buttonHandles = replyButtons.map((label: string, idx: number) => (
      <div
        key={idx}
        className="flex items-center gap-1 w-full justify-end relative"
        style={{ height: 24 }}
      >
        <span className="text-xs px-2 py-0.5 min-w-[48px] text-green-700 text-left truncate max-w-[70px]">
          {label || `Button ${idx + 1}`}
        </span>
        <Handle
          type="source"
          position={Position.Right}
          id={`reply-${idx}`}
          className={handleColor}
          style={{ right: -12 }}
        />
      </div>
    ));

    outgoingHandles = (
      <div className="flex flex-col gap-1 items-end mt-2">
        {normalHandle}
        {buttonHandles}
      </div>
    );
  }

  return (
    <div
      className={`${nodeStyle} border ${borderStyle} rounded shadow p-3 text-xs min-w-[120px] text-center relative group`}
      style={{
        minHeight:
          data.nodeType === "MessageAction"
            ? 40 +
              24 *
                (Array.isArray(data.replyButtons) &&
                data.replyButtons.length === 0
                  ? 1 // Normal handle when no buttons
                  : Math.max(
                      0,
                      Array.isArray(data.replyButtons)
                        ? data.replyButtons.length
                        : 0
                    )) // Button handles
            : undefined,
      }}
    >
      {/* Delete node button (not for start node) */}
      {!isStartNode && onDelete && (
        <button
          type="button"
          className="absolute -top-4 right-1 z-20 p-1 rounded-full bg-white shadow border border-gray-200 hover:bg-red-100 text-gray-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          title="Delete node"
          aria-label="Delete node"
        >
          <Trash size={12} />
        </button>
      )}
      {/* Left handle (target) - Not shown for start nodes */}
      {!isStartNode && (
        <Handle
          type="target"
          position={Position.Left}
          className={handleColor}
        />
      )}

      <div
        className={`font-medium flex items-center justify-center gap-1.5 ${textColor}`}
      >
        {getNodeIcon()}
        {data.label || "Node"}
      </div>

      {data.description && (
        <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">
          {data.description}
        </div>
      )}

      {/* Right handle (source) */}
      {data.nodeType === "MessageAction" ? (
        outgoingHandles
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className={handleColor}
        />
      )}
    </div>
  );
};

export default CustomNode;
