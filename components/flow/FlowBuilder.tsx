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

import { ArrowLeft, Save } from "lucide-react";

// Minimal custom node with handles for connection
const CustomNode = ({ data }: any) => (
  <div className="bg-white border border-gray-300 rounded shadow p-2 text-xs min-w-[100px] text-center relative">
    {/* Top handle (target) */}
    <Handle type="target" position={Position.Top} className="!bg-blue-400" />
    {data.label || "Node"}
    {/* Bottom handle (source) */}
    <Handle type="source" position={Position.Bottom} className="!bg-blue-400" />
  </div>
);

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
      data: { label: "Start" },
    },
  ],
  initialEdges = [],
}: FlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

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
        type,
        position,
        data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
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

  return (
    <div className="relative h-full w-full bg-gray-50 rounded-lg border border-gray-200 shadow">
      <div className="absolute rounded-t-lg top-0 left-0 right-0 z-20 flex items-center justify-between p-3 bg-white border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 px-2 py-1 rounded transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={() => onSave(nodes, edges)}
          className="flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700 transition"
        >
          <Save size={16} /> Save
        </button>
      </div>
      {/* Sidebar: now absolutely positioned inside the main container */}
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
