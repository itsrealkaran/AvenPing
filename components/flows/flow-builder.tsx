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
  onSave: (flow: any) => void;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  editingFlow?: any; // Flow being edited, if any
}

interface BuildFlowJsonArgs {
  nodes: Node[];
  edges: Edge[];
  flowId: string;
  flowName: string;
  status: string;
  date: string;
}

interface Step {
  id: string;
  type: string;
  file?: string;
  message?: string;
  next?: string | null;
  link?: string;
  buttons?: { label: string; next: string | null }[];
  flowId?: string;
}

interface FlowJson {
  id: string;
  name: string;
  status: string;
  date: string;
  triggers: string[];
  steps: Step[];
}

function buildFlowJson({
  nodes,
  edges,
  flowId,
  flowName,
  status,
  date,
}: BuildFlowJsonArgs): FlowJson {
  // 1. Find start node and triggers
  const startNode = nodes.find((n) => n.data.nodeType === "Start");
  const triggers = Array.isArray(startNode?.data.startKeywords)
    ? startNode.data.startKeywords
    : typeof startNode?.data.startKeywords === "string"
    ? startNode.data.startKeywords
        .split(",")
        .map((k: string) => k.trim())
        .filter(Boolean)
    : [];

  // 2. Build a map for quick lookup
  const nodeMap: Record<string, Node> = Object.fromEntries(
    nodes.map((n) => [n.id, n])
  );
  const outgoingMap: Record<string, { edge: Edge; target: string }[]> = {};
  edges.forEach((e) => {
    if (!outgoingMap[e.source]) outgoingMap[e.source] = [];
    outgoingMap[e.source].push({ edge: e, target: e.target });
  });

  // 3. Build steps (skip Start node)
  const steps: Step[] = nodes
    .filter((n) => n.data.nodeType !== "Start")
    .map((node) => {
      const { id, data } = node;
      const type = typeof data.nodeType === "string" ? data.nodeType : "";
      // Message/Media nodes
      if (
        [
          "ImageMessage",
          "VideoMessage",
          "AudioMessage",
          "DocumentMessage",
          "TemplateMessage",
        ].includes(type)
      ) {
        const nextEdge = (outgoingMap[id] || [])[0];
        return {
          id,
          type,
          file: typeof data.fileUrl === "string" ? data.fileUrl : "", // fileUrl should be set after upload
          message: typeof data.caption === "string" ? data.caption : "",
          next: nextEdge ? nextEdge.target : null,
        };
      }
      // MessageAction node
      if (type === "MessageAction") {
        const buttons = Array.isArray(data.replyButtons)
          ? data.replyButtons.map((label: string, idx: number) => {
              // Find edge with sourceHandle = reply-idx
              const edge = (outgoingMap[id] || []).find(
                (e) => e.edge.sourceHandle === `reply-${idx}`
              );
              return {
                label: typeof label === "string" ? label : `Button ${idx + 1}`,
                next: edge ? edge.target : null,
              };
            })
          : [];
        return {
          id,
          type,
          message: typeof data.message === "string" ? data.message : "",
          link: typeof data.link === "string" ? data.link : "",
          buttons,
        };
      }
      // ConnectFlow node
      if (type === "ConnectFlowAction") {
        const nextEdge = (outgoingMap[id] || [])[0];
        return {
          id,
          type,
          flowId: typeof data.flowId === "string" ? data.flowId : "",
          next: nextEdge ? nextEdge.target : null,
        };
      }
      // Fallback
      return {
        id,
        type,
      };
    });

  return {
    id: flowId,
    name: flowName,
    status,
    date,
    triggers,
    steps,
  };
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
  editingFlow = null,
}: FlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [flowName, setFlowName] = useState(editingFlow?.name || "");

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
    const flowId = editingFlow?.id || `${+new Date()}`;
    const status = editingFlow?.status || "active";
    const date = editingFlow?.date || new Date().toISOString();
    const flowJson = buildFlowJson({
      nodes,
      edges,
      flowId,
      flowName: flowName.trim(),
      status,
      date,
    });
    console.log("Exported flow JSON:", flowJson);
    onSave(flowJson);
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
