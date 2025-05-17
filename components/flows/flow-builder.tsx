import React, { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Connection,
  NodeTypes,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  ArrowLeft,
  Save,
  X,
  Image,
  FileVideo,
  FileText,
  FileAudio,
  FileEdit,
  MessageSquare,
  GitMerge,
  Play,
  Menu,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Minimal custom node with handles for connection
const CustomNode = ({ data, selected, id }: any) => {
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
  if (data.nodeType === "ChatAction") {
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
      case "ChatAction":
        return <MessageSquare size={14} className="text-green-500" />;
      case "ConnectFlowAction":
        return <GitMerge size={14} className="text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`${nodeStyle} border ${borderStyle} rounded shadow p-3 text-xs min-w-[120px] text-center relative`}
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
      <Handle type="source" position={Position.Right} className={handleColor} />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export interface FlowBuilderProps {
  onBack: () => void;
  onSave: (nodes: Node[], edges: Edge[]) => void;
  initialNodes?: Node[];
  initialEdges?: Edge[];
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
    {
      type: "TemplateMessage",
      label: "Template",
      icon: <FileEdit size={18} />,
    },
  ],
  action: [
    {
      type: "ChatAction",
      label: "Message",
      icon: <MessageSquare size={18} />,
    },
    {
      type: "ConnectFlowAction",
      label: "Connect Flow",
      icon: <GitMerge size={18} />,
    },
  ],
};

export default function FlowBuilder({
  onBack,
  onSave,
  initialNodes = [
    {
      id: "1",
      type: "custom",
      position: { x: 250, y: 100 },
      data: {
        label: "Start",
        isStartNode: true,
        nodeType: "Start",
      },
    },
  ],
  initialEdges = [],
}: FlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Drag and drop handlers for sidebar
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
    setDraggedNode(nodeType);
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = (
        event.target as HTMLElement
      ).getBoundingClientRect();
      const nodeType = event.dataTransfer.getData("application/reactflow");
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Get appropriate label and node type based on the dragged component
      let label = nodeType.replace(/([A-Z])/g, " $1").trim(); // Convert camelCase to spaces

      // Determine category based on node type naming pattern
      let category = "";

      // Special case for ChatAction
      if (nodeType === "ChatAction") {
        category = "action";
      }
      // General patterns
      else if (nodeType.includes("Message")) {
        category = "message";
      } else if (nodeType.includes("Action")) {
        category = "action";
      }

      // Log for debugging
      console.log(`Creating node: ${nodeType} with category: ${category}`);

      const newNode: Node = {
        id: `${+new Date()}`,
        type: "custom",
        position,
        data: {
          label,
          description: "",
          nodeType,
          category,
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setDraggedNode(null);
    },
    [setNodes]
  );

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  // Function to handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Function to update node data
  const updateNodeData = (key: string, value: string) => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              [key]: value,
            },
          };
        }
        return node;
      })
    );

    setSelectedNode((prev) =>
      prev
        ? {
            ...prev,
            data: {
              ...prev.data,
              [key]: value,
            },
          }
        : null
    );
  };

  // Function to close the right sidebar
  const closeRightSidebar = () => {
    setSelectedNode(null);
  };

  return (
    <div className="relative h-full w-full bg-gray-50 rounded-lg border border-gray-200 shadow">
      <div className="absolute rounded-t-lg top-0 left-0 right-0 z-20 flex items-center justify-between p-3 bg-white border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 px-2 py-1 rounded transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <Button onClick={() => onSave(nodes, edges)} size="sm">
          <Save size={16} /> Save
        </Button>
      </div>

      {/* Hamburger Menu - Only shown when sidebar is hidden */}
      {!showSidebar && (
        <div
          className="absolute z-30 top-16 left-4 bg-white border border-gray-200 rounded-lg shadow-md p-2 m-2 cursor-pointer hover:bg-gray-50 transition-all"
          onClick={() => setShowSidebar(true)}
          title="Show components"
        >
          <PanelLeft size={16} className="text-gray-600" />
        </div>
      )}

      {/* Left Sidebar: Components with categories */}
      {showSidebar && (
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
                onClick={() => setShowSidebar(false)}
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
        </div>
      )}

      {/* Right Sidebar: Node Details */}
      {selectedNode && (
        <div
          className="absolute z-30 top-16 right-4 flex flex-col gap-4 bg-white border border-gray-200 rounded-xl shadow-lg p-4"
          style={{ minWidth: 280 }}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-500 pl-1">
              Node Details
            </div>
            <button
              onClick={closeRightSidebar}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nodeLabel">Label</Label>
              <Input
                id="nodeLabel"
                value={(selectedNode.data.label as string) || ""}
                onChange={(e) => updateNodeData("label", e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="nodeDescription">Description</Label>
              <Textarea
                id="nodeDescription"
                value={(selectedNode.data.description as string) || ""}
                onChange={(e) => updateNodeData("description", e.target.value)}
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
      )}

      {/* Main Flow Area */}
      <div className="flex-1 relative h-full">
        {/* Header */}
        <div className="h-full w-full pt-12">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            className="bg-gray-50"
            attributionPosition={undefined}
          >
            <Background color="#999" gap={16} />
            <MiniMap />
            {/* <Controls /> */}
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
