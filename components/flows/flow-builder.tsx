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
import { toast } from "sonner";

export interface FlowBuilderProps {
  onBack: () => void;
  onSave: (flow: any) => void;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  editingFlow?: any; // Flow being edited, if any
  flows?: any[]; // All available flows for Connect Flow nodes
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
  phoneNumber?: string;
  position: { x: number; y: number };
  header?: string;
  headerType?: string;
  templateData?: Array<{
    type: "HEADER" | "BODY" | "FOOTER" | "BUTTON" | "BUTTONS";
    text?: string;
    mediaUrl?: string;
    mediaId?: string;
    format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO";
    buttonText?: string;
    buttonType?: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
    buttonValue?: string;
    buttons?: Array<{
      type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
      text: string;
      url?: string;
      phone_number?: string;
    }>;
  }>;
}

interface FlowJson {
  id: string;
  name: string;
  status: string;
  date: string;
  triggers: string[];
  steps: Step[];
}

// Validation functions
const validateMessageAction = (nodeData: any): string[] => {
  const errors: string[] = [];

  if (!nodeData.message || nodeData.message.trim() === "") {
    errors.push("Message body is required");
  }

  if (nodeData.headerType && nodeData.headerType !== "none") {
    if (!nodeData.header || nodeData.header.trim() === "") {
      errors.push(`${nodeData.headerType} header is required`);
    }
  }

  if (nodeData.replyButtons && nodeData.replyButtons.length > 0) {
    const emptyButtons = nodeData.replyButtons.filter(
      (btn: string) => !btn || btn.trim() === ""
    );
    if (emptyButtons.length > 0) {
      errors.push("All reply buttons must have labels");
    }
  }

  return errors;
};

const validateSupportNode = (nodeData: any): string[] => {
  const errors: string[] = [];

  if (!nodeData.phoneNumber || nodeData.phoneNumber.trim() === "") {
    errors.push("Phone number is required");
  }

  return errors;
};

const validateMediaNode = (nodeData: any): string[] => {
  const errors: string[] = [];

  if (!nodeData.file || nodeData.file.trim() === "") {
    errors.push("Media file is required");
  }

  return errors;
};

const validateConnectFlow = (nodeData: any): string[] => {
  const errors: string[] = [];

  if (!nodeData.flowId || nodeData.flowId.trim() === "") {
    errors.push("Flow selection is required");
  }

  return errors;
};

const validateStartNode = (nodeData: any): string[] => {
  const errors: string[] = [];

  if (!nodeData.startKeywords || nodeData.startKeywords.length === 0) {
    errors.push("At least one start keyword is required");
  }

  return errors;
};

const validateAllNodes = (
  nodes: Node[]
): { isValid: boolean; errors: string[] } => {
  const allErrors: string[] = [];

  for (const node of nodes) {
    const nodeType = node.data.nodeType;
    let nodeErrors: string[] = [];

    switch (nodeType) {
      case "MessageAction":
        nodeErrors = validateMessageAction(node.data);
        break;
      case "CallSupport":
      case "WhatsAppSupport":
        nodeErrors = validateSupportNode(node.data);
        break;
      case "ImageMessage":
      case "VideoMessage":
      case "AudioMessage":
      case "DocumentMessage":
        nodeErrors = validateMediaNode(node.data);
        break;
      case "ConnectFlowAction":
        nodeErrors = validateConnectFlow(node.data);
        break;
      case "Start":
        nodeErrors = validateStartNode(node.data);
        break;
    }

    if (nodeErrors.length > 0) {
      allErrors.push(
        `${node.data.label || nodeType}: ${nodeErrors.join(", ")}`
      );
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

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
      const { id, data, position } = node;
      const type = typeof data.nodeType === "string" ? data.nodeType : "";
      // Message/Media nodes
      if (
        [
          "ImageMessage",
          "VideoMessage",
          "AudioMessage",
          "DocumentMessage",
        ].includes(type)
      ) {
        const nextEdge = (outgoingMap[id] || [])[0];
        return {
          id,
          type,
          file: typeof data.file === "string" ? data.file : "",
          message: typeof data.caption === "string" ? data.caption : "",
          next: nextEdge ? nextEdge.target : null,
          position: { x: position.x, y: position.y },
        };
      }
      // MessageAction node
      if (type === "MessageAction") {
        const replyButtons = Array.isArray(data.replyButtons)
          ? data.replyButtons
          : [];

        // Find default outgoing connection
        let defaultNext: string | null = null;
        if (replyButtons.length === 0) {
          // When no buttons, use the first edge (default outgoing)
          const defaultEdge = (outgoingMap[id] || [])[0];
          defaultNext = defaultEdge ? defaultEdge.target : null;
        } else {
          // When buttons exist, look for the "normal" handle edge
          const normalEdge = (outgoingMap[id] || []).find(
            (e) => e.edge.sourceHandle === "normal"
          );
          defaultNext = normalEdge ? normalEdge.target : null;
        }

        const buttons = replyButtons.map((label: string, idx: number) => {
          // Find edge with sourceHandle = reply-idx
          const edge = (outgoingMap[id] || []).find(
            (e) => e.edge.sourceHandle === `reply-${idx}`
          );
          return {
            label: typeof label === "string" ? label : `Button ${idx + 1}`,
            next: edge ? edge.target : null,
          };
        });

        // Build template data structure for MessageAction
        const templateData: Array<{
          type: "HEADER" | "BODY" | "FOOTER" | "BUTTON" | "BUTTONS";
          text?: string;
          mediaUrl?: string;
          mediaId?: string;
          format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO";
          buttonText?: string;
          buttonType?: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
          buttonValue?: string;
          buttons?: Array<{
            type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
            text: string;
            url?: string;
            phone_number?: string;
          }>;
        }> = [];

        // Add header if provided
        if (data.header && data.headerType && data.headerType !== "none") {
          if (data.headerType === "text") {
            templateData.push({
              type: "HEADER",
              text: String(data.header),
              format: "TEXT",
            });
          } else if (
            ["image", "video", "document"].includes(String(data.headerType))
          ) {
            templateData.push({
              type: "HEADER",
              mediaId: String(data.header),
              format: String(data.headerType).toUpperCase() as
                | "IMAGE"
                | "VIDEO"
                | "DOCUMENT",
            });
          }
        }

        // Add body
        if (data.message) {
          templateData.push({
            type: "BODY",
            text: String(data.message),
            format: "TEXT",
          });
        }

        // Add buttons if they exist
        if (replyButtons.length > 0) {
          templateData.push({
            type: "BUTTONS",
            buttons: replyButtons.map((label) => ({
              type: "QUICK_REPLY" as const,
              text: label,
            })),
          });
        }

        return {
          id,
          type,
          message: typeof data.message === "string" ? data.message : "",
          link: typeof data.link === "string" ? data.link : "",
          next: defaultNext,
          buttons,
          position: { x: position.x, y: position.y },
          header: data.header !== undefined ? String(data.header) : undefined,
          headerType:
            data.headerType !== undefined ? String(data.headerType) : undefined,
          templateData: templateData.length > 0 ? templateData : undefined,
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
          position: { x: position.x, y: position.y },
        };
      }
      // Support nodes
      if (type === "CallSupport" || type === "WhatsAppSupport") {
        const nextEdge = (outgoingMap[id] || [])[0];
        return {
          id,
          type,
          phoneNumber:
            typeof data.phoneNumber === "string" ? data.phoneNumber : "",
          next: nextEdge ? nextEdge.target : null,
          position: { x: position.x, y: position.y },
        };
      }
      // Fallback
      return {
        id,
        type,
        position: { x: position.x, y: position.y },
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
        currentFlowId: null,
      },
    },
  ],
  initialEdges = [],
  editingFlow = null,
  flows = [],
}: FlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [flowName, setFlowName] = useState(editingFlow?.name || "");

  // Check if flow is valid for save button state
  const validation = validateAllNodes(nodes);
  const isFlowValid = validation.isValid && flowName.trim() !== "";

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
      const label = nodeType.replace(/([A-Z])/g, " $1").trim(); // Convert camelCase to spaces

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
      } else if (nodeType.includes("Support")) {
        category = "support";
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
          currentFlowId: editingFlow?.id || null, // Add current flow ID for Connect Flow nodes
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
    if (!flowName.trim()) {
      toast.error("Flow name is required");
      return;
    }

    // Validate all nodes
    const validation = validateAllNodes(nodes);
    if (!validation.isValid) {
      toast.error("Please complete all required fields before saving", {
        description:
          validation.errors.slice(0, 3).join(", ") +
          (validation.errors.length > 3 ? "..." : ""),
        duration: 5000,
      });
      return;
    }

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

    toast.success("Flow saved successfully!");
    onSave(flowJson);
    setShowSaveModal(false);
    setFlowName("");
  };

  return (
    <div className="relative h-full w-full bg-gray-50 rounded-lg border border-gray-200 shadow">
      {/* Header */}
      <FlowHeader
        onBack={onBack}
        onSave={handleSave}
        hasValidationErrors={!validation.isValid}
        validationErrorCount={validation.errors.length}
        validationErrors={validation.errors}
      />

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="mb-4 text-lg font-semibold">Save Flow</div>

            {/* Validation Issues Display */}
            {!validation.isValid && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-sm font-medium text-red-800 mb-2">
                  Please fix the following issues before saving:
                </div>
                <ul className="text-xs text-red-700 space-y-1 max-h-32 overflow-y-auto">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2 mt-0.5">•</span>
                      <span className="flex-1">{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
              <Button
                onClick={handleConfirmSave}
                disabled={!flowName.trim()}
                variant={isFlowValid ? "default" : "secondary"}
              >
                {isFlowValid ? "Save" : "Complete Required Fields"}
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
        flows={flows}
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
