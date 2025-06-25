"use client";

import Body from "@/components/layout/body";
import { Edit, Trash, Play, Pause } from "lucide-react";
import React, { useState } from "react";
import Table, { ActionMenuItem } from "@/components/ui/table";
import { MRT_ColumnDef } from "material-react-table";
import dynamic from "next/dynamic";
import { Node, Edge } from "@xyflow/react";

// Dynamically import FlowBuilder to avoid SSR issues
const FlowBuilderComponent = dynamic(
  () => import("@/components/flows/flow-builder"),
  {
    ssr: false,
  }
);

// Define the Flow type
type Flow = {
  id: string;
  name: string;
  status: string;
  date: string;
  triggers: string[];
  steps: any[];
};

// Function to reconstruct nodes and edges from flow JSON
function reconstructFlowData(flow: Flow): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Add start node
  nodes.push({
    id: "1",
    type: "custom",
    position: { x: 250, y: 100 },
    data: {
      label: "Start",
      isStartNode: true,
      nodeType: "Start",
      startKeywords: flow.triggers,
    },
  });

  // Add other nodes from steps
  flow.steps.forEach((step, index) => {
    const nodeId = step.id;
    const nodeType = step.type;
    // Use saved position if available, else fallback to grid
    const x = step.position?.x ?? 250 + (index + 1) * 200;
    const y = step.position?.y ?? 100 + (index % 2) * 150;

    const nodeData: any = {
      label: nodeType.replace(/([A-Z])/g, " $1").trim(),
      nodeType,
      category: nodeType.includes("Message") ? "message" : "action",
    };

    // Add step-specific data
    if (nodeType === "MessageAction") {
      nodeData.message = step.message || "";
      nodeData.link = step.link || "";
      nodeData.replyButtons = step.buttons?.map((btn: any) => btn.label) || [];
    } else if (
      [
        "ImageMessage",
        "VideoMessage",
        "AudioMessage",
        "DocumentMessage",
      ].includes(nodeType)
    ) {
      nodeData.fileUrl = step.file || "";
      nodeData.caption = step.message || "";
    } else if (nodeType === "ConnectFlowAction") {
      nodeData.flowId = step.flowId || "";
    }

    nodes.push({
      id: nodeId,
      type: "custom",
      position: { x, y },
      data: nodeData,
    });

    // Add edges
    if (nodeType === "MessageAction" && step.buttons) {
      step.buttons.forEach((button: any, buttonIndex: number) => {
        if (button.next) {
          edges.push({
            id: `${nodeId}-${buttonIndex}`,
            source: nodeId,
            target: button.next,
            sourceHandle: `reply-${buttonIndex}`,
          });
        }
      });
    } else if (step.next) {
      edges.push({
        id: `${nodeId}-next`,
        source: nodeId,
        target: step.next,
      });
    }
  });

  // Connect start node to the first step node if there are steps
  if (flow.steps.length > 0) {
    const firstStepId = flow.steps[0].id;
    edges.push({
      id: "start-to-first",
      source: "1", // Start node ID
      target: firstStepId,
    });
  }

  return { nodes, edges };
}

const initialFlows: Flow[] = [];

export default function FlowPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [flows, setFlows] = useState<Flow[]>(initialFlows);

  // State for builder
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingFlow, setEditingFlow] = useState<Flow | null>(null);
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [initialEdges, setInitialEdges] = useState<Edge[]>([]);

  const handleDeleteFlow = (flow: Flow) => {
    setFlows(flows.filter((f) => f.id !== flow.id));
  };

  const handleAddFlow = () => {
    setEditingFlow(null);
    setShowBuilder(true);
  };

  const handleEditFlow = (flow: Flow) => {
    const { nodes, edges } = reconstructFlowData(flow);
    setInitialNodes(nodes);
    setInitialEdges(edges);
    setEditingFlow(flow);
    setShowBuilder(true);
  };

  const handleToggleStatus = (flow: Flow) => {
    const newStatus = flow.status === "Active" ? "Inactive" : "Active";
    setFlows(
      flows.map((f) => (f.id === flow.id ? { ...f, status: newStatus } : f))
    );
  };

  const handleSaveFlow = (flow: Flow) => {
    if (editingFlow) {
      // Update existing flow
      setFlows((prev) => prev.map((f) => (f.id === editingFlow.id ? flow : f)));
    } else {
      // Add new flow
      setFlows((prev) => [...prev, flow]);
    }
    setShowBuilder(false);
    setEditingFlow(null);
    setInitialNodes([]);
    setInitialEdges([]);
  };

  const handleBack = () => {
    setShowBuilder(false);
    setEditingFlow(null);
    setInitialNodes([]);
    setInitialEdges([]);
  };

  const columns: MRT_ColumnDef<Flow>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "steps",
      header: "Steps",
      Cell: ({ row }) => <span>{row.original.steps.length}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ row }) => {
        const value = row.original.status;
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              value === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      Cell: ({ row }) => {
        const date = new Date(row.original.date);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "triggers",
      header: "Triggers",
      Cell: ({ row }) => {
        const triggers = row.original.triggers;
        return (
          <span>
            {triggers.length > 0 ? (
              triggers.join(", ")
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </span>
        );
      },
    },
  ];

  const actionMenuItems: ActionMenuItem[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <Edit className="size-4" />,
      onClick: (flow: Flow, closeMenu: () => void) => {
        handleEditFlow(flow);
        closeMenu();
      },
    },
    {
      key: "toggle",
      label: (row: Flow) =>
        row.status === "Active" ? "Deactivate" : "Activate",
      icon: (row: Flow) =>
        row.status === "Active" ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4" />
        ),
      onClick: (flow: Flow, closeMenu: () => void) => {
        handleToggleStatus(flow);
        closeMenu();
      },
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash className="text-red-600 size-4" />,
      onClick: (flow: Flow, closeMenu: () => void) => {
        handleDeleteFlow(flow);
        closeMenu();
      },
      className: "text-red-600",
    },
  ];

  return (
    <Body title="Flows">
      {showBuilder ? (
        <FlowBuilderComponent
          onBack={handleBack}
          onSave={handleSaveFlow}
          {...(editingFlow ? { initialNodes, initialEdges, editingFlow } : {})}
        />
      ) : (
        <Table
          data={flows}
          columns={columns}
          isLoading={isLoading}
          actionMenuItems={actionMenuItems}
          onAddItem={handleAddFlow}
          addButtonLabel="Add Flow"
          searchPlaceholder="Search flows..."
        />
      )}
    </Body>
  );
}
