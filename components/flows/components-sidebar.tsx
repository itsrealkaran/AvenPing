import React from "react";
import { Button } from "@/components/ui/button";
import {
  Image,
  FileVideo,
  FileText,
  FileAudio,
  FileEdit,
  MessageSquare,
  GitMerge,
  PanelLeft,
  Phone,
  MessageCircle,
} from "lucide-react";

interface ComponentsSidebarProps {
  showSidebar: boolean;
  onShowSidebarChange: (show: boolean) => void;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

const initialSidebarNodes = {
  message: [
    { type: "ImageMessage", label: "Image", icon: <Image size={18} /> },
    { type: "VideoMessage", label: "Video", icon: <FileVideo size={18} /> },
    {
      type: "DocumentMessage",
      label: "Document",
      icon: <FileText size={18} />,
    },
    { type: "AudioMessage", label: "Audio", icon: <FileAudio size={18} /> },
  ],
  action: [
    {
      type: "MessageAction",
      label: "Message",
      icon: <MessageSquare size={18} />,
    },
    {
      type: "ConnectFlowAction",
      label: "Connect Flow",
      icon: <GitMerge size={18} />,
    },
  ],
  support: [
    {
      type: "CallSupport",
      label: "Call Support",
      icon: <Phone size={18} />,
    },
    {
      type: "WhatsAppSupport",
      label: "WhatsApp Support",
      icon: <MessageCircle size={18} />,
    },
  ],
};

const ComponentsSidebar = ({
  showSidebar,
  onShowSidebarChange,
  onDragStart,
}: ComponentsSidebarProps) => {
  if (!showSidebar) return null;

  return (
    <div
      className="absolute z-30 top-16 left-4 flex flex-col gap-6 bg-white border border-gray-200 rounded-xl shadow-lg p-4 overflow-auto max-h-[calc(100%-5rem)]"
      style={{ minWidth: 240 }}
    >
      {/* Message Blocks */}
      <div>
        <div className="flex justify-between">
          <div className="text-sm font-semibold text-gray-700 mb-3 pl-1 border-l-2 border-blue-500 pl-2">
            Message Blocks
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowSidebarChange(false)}
            className="text-gray-500 hover:text-gray-700 h-6 w-6"
          >
            <PanelLeft size={16} />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {initialSidebarNodes.message.map((node) => (
            <div
              key={node.type}
              className="cursor-move bg-white border border-gray-200 rounded-lg px-3 py-3 text-sm hover:border-blue-300 hover:bg-blue-50 transition shadow-sm flex items-center gap-2"
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
            >
              <span className="text-blue-500">{node.icon}</span>
              <span>{node.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Blocks */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-3 pl-1 border-l-2 border-green-500 pl-2">
          Action Blocks
        </div>
        <div className="grid grid-cols-1 gap-2">
          {initialSidebarNodes.action.map((node) => (
            <div
              key={node.type}
              className="cursor-move bg-white border border-gray-200 rounded-lg px-3 py-3 text-sm hover:border-green-300 hover:bg-green-50 transition shadow-sm flex items-center gap-2"
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
            >
              <span className="text-green-500">{node.icon}</span>
              <span>{node.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Support Blocks */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-3 pl-1 border-l-2 border-orange-500 pl-2">
          Support Blocks
        </div>
        <div className="grid grid-cols-1 gap-2">
          {initialSidebarNodes.support.map((node) => (
            <div
              key={node.type}
              className="cursor-move bg-white border border-gray-200 rounded-lg px-3 py-3 text-sm hover:border-orange-300 hover:bg-orange-50 transition shadow-sm flex items-center gap-2"
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
            >
              <span className="text-orange-500">{node.icon}</span>
              <span>{node.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComponentsSidebar;
