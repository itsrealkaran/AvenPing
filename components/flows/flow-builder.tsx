import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  MiniMap,
  useEdgesState,
  useNodesState,
  Node,
  Edge,
  Connection,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Sub-components
import CustomNode from "./custom-node";
import ComponentsSidebar from "./components-sidebar";
import NodeDetailsSidebar from "./node-details-sidebar";
import FlowHeader from "./flow-header";
import SidebarToggle from "./sidebar-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface FlowBuilderProps {
  onBack: () => void;
  onSave: (flow: {
    id: string;
    name: string;
    steps: number;
    status: string;
    date: string;
  }) => void;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

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
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [flowName, setFlowName] = useState("");

  // Delete node handler
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
      setSelectedNode((sel) => (sel && sel.id === nodeId ? null : sel));
    },
    [setNodes, setEdges, setSelectedNode]
  );

  const nodeTypes: NodeTypes = {
    custom: (props) => <CustomNode {...props} onDelete={handleDeleteNode} />,
  };

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
      if (nodeType === "MessageAction") {
        category = "action";
      }
      // General patterns
      else if (nodeType.includes("Message")) {
        category = "message";
      } else if (nodeType.includes("Action")) {
        category = "action";
      }

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

  // Save handler: show modal
  const handleSave = () => {
    setShowSaveModal(true);
  };

  // Confirm save: call onSave with flow data
  const handleConfirmSave = () => {
    if (!flowName.trim()) return;
    const steps = nodes.length;
    const flow = {
      id: `${+new Date()}`,
      name: flowName.trim(),
      steps,
      data: JSON.stringify(steps),
      status: "active",
      date: new Date().toISOString(),
    };
    console.log("Saved flow:", flow);
    onSave(flow);
    setShowSaveModal(false);
    setFlowName("");
  };

  return (
    <div className="relative h-full w-full bg-gray-50 rounded-lg border border-gray-200 shadow">
      {/* Header */}
      <FlowHeader onBack={onBack} onSave={handleSave} />

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw]">
            <div className="mb-4 text-lg font-semibold">Save Flow</div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Flow Name
              </label>
              <Input
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                placeholder="Enter flow name"
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="ghost" onClick={() => setShowSaveModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmSave} disabled={!flowName.trim()}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hamburger Menu - Only shown when sidebar is hidden */}
      {!showSidebar && (
        <SidebarToggle onShowSidebar={() => setShowSidebar(true)} />
      )}

      {/* Left Sidebar: Components with categories */}
      <ComponentsSidebar
        showSidebar={showSidebar}
        onShowSidebarChange={setShowSidebar}
        onDragStart={onDragStart}
      />

      {/* Right Sidebar: Node Details */}
      <NodeDetailsSidebar
        selectedNode={selectedNode}
        onClose={closeRightSidebar}
        onUpdateNodeData={updateNodeData}
      />

      {/* Main Flow Area */}
      <div className="flex-1 relative h-full">
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
            fitViewOptions={{ padding: 1, maxZoom: 2 }}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
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
