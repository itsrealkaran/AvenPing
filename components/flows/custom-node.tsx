import React from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Image,
  FileVideo,
  FileText,
  FileAudio,
  FileEdit,
  MessageSquare,
  GitMerge,
  Play,
} from "lucide-react";

interface CustomNodeProps {
  data: any;
  selected: boolean;
  id: string;
}

const CustomNode = ({ data, selected, id }: CustomNodeProps) => {
  const isStartNode = id === "1" || data.isStartNode;

  // Debug log to see why some nodes are not getting colored correctly
  console.log(`Node ${id}:`, {
    nodeType: data.nodeType,
    category: data.category,
    isStartNode,
  });

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
      case "TemplateMessage":
        return <FileEdit size={14} className="text-blue-500" />;
      case "MessageAction":
        return <MessageSquare size={14} className="text-green-500" />;
      case "ConnectFlowAction":
        return <GitMerge size={14} className="text-green-500" />;
      default:
        return null;
    }
  };

  // For MessageAction, render as many outgoing handles as reply buttons (default 1)
  let outgoingHandles: React.ReactNode = null;
  if (data.nodeType === "MessageAction") {
    const replyButtons = Array.isArray(data.replyButtons)
      ? data.replyButtons
      : [""];
    const count = Math.max(1, replyButtons.length);
    outgoingHandles = (
      <>
        {Array.from({ length: count }).map((_, idx) => (
          <Handle
            key={idx}
            type="source"
            position={Position.Right}
            id={`reply-${idx}`}
            className={handleColor}
            style={{ top: `${40 + idx * 24}px`, right: -8 }} // space handles vertically
          />
        ))}
      </>
    );
  }

  return (
    <div
      className={`${nodeStyle} border ${borderStyle} rounded shadow p-3 text-xs min-w-[120px] text-center relative`}
      style={{
        minHeight:
          data.nodeType === "MessageAction"
            ? 40 +
              24 *
                Math.max(
                  1,
                  Array.isArray(data.replyButtons)
                    ? data.replyButtons.length
                    : 1
                )
            : undefined,
      }}
    >
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
