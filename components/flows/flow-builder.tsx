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

import { ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Minimal custom node with handles for connection
const CustomNode = ({ data, selected, id }: any) => {
  const isStartNode = id === "1" || data.isStartNode;

  return (
    <div
      className={`bg-white border ${
        selected ? "border-blue-500" : "border-gray-300"
      } rounded shadow p-2 text-xs min-w-[100px] text-center relative`}
    >
      {/* Left handle (target) - Not shown for start nodes */}
      {!isStartNode && (
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-blue-400"
        />
      )}

      {data.label || "Node"}

      {/* Right handle (source) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-blue-400"
      />
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

const initialSidebarNodes = [
  { type: "Message", label: "Image" },
  { type: "Action", label: "Block" },
  // Add more node types here if needed
];

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
      const type = event.dataTransfer.getData("application/reactflow");
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      const newNode: Node = {
        id: `${+new Date()}`,
        type: "custom",
        position,
        data: {
          label: type.charAt(0).toUpperCase() + type.slice(1),
          description: "",
          nodeType: type,
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
      {/* Left Sidebar: Components */}
      <div
        className="absolute z-30 top-16 left-4 flex flex-col gap-4 bg-white border border-gray-200 rounded-xl shadow-lg p-4"
        style={{ minWidth: 240 }}
      >
        <div className="text-sm font-semibold text-gray-500 mb-2 pl-1">
          Components
        </div>
        {initialSidebarNodes.map((node) => (
          <div
            key={node.type}
            className="cursor-move bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-center text-xs hover:bg-gray-200 transition shadow"
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
          >
            {node.label}
          </div>
        ))}
      </div>

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
            <Background color="#e5e7eb" gap={16} />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
