"use client";

import Body from "@/components/layout/body";
import { Edit, Trash, Play, Pause } from "lucide-react";
import React, { useState, useEffect } from "react";
import Table, { ActionMenuItem } from "@/components/ui/table";
import { MRT_ColumnDef } from "material-react-table";
import dynamic from "next/dynamic";
import { Node, Edge } from "@xyflow/react";
import { useFlow, Flow } from "@/context/flow-provider";
import { toast } from "sonner";
import { SupportTemplatesStatus } from "@/components/onboarding/support-templates-status";

// Dynamically import FlowBuilder to avoid SSR issues
const FlowBuilderComponent = dynamic(
  () => import("@/components/flows/flow-builder"),
  {
    ssr: false,
  }
);

// Function to reconstruct nodes and edges from flow JSON
function reconstructFlowData(flow: Flow): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Create start node
  const startNode: Node = {
    id: "1",
    type: "custom",
    position: { x: 250, y: 100 },
    data: {
      label: "Start",
      isStartNode: true,
      nodeType: "Start",
      startKeywords: flow.triggers || [],
      currentFlowId: flow.id, // Add current flow ID
    },
  };

  // Add start node
  nodes.push(startNode);

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
      nodeData.file = step.file || "";
      nodeData.caption = step.message || "";
    } else if (nodeType === "ConnectFlowAction") {
      nodeData.flowId = step.flowId || "";
    } else if (nodeType === "CallSupport" || nodeType === "WhatsAppSupport") {
      nodeData.phoneNumber = step.phoneNumber || "";
    }

    nodes.push({
      id: nodeId,
      type: "custom",
      position: { x, y },
      data: {
        ...nodeData,
        currentFlowId: flow.id, // Add current flow ID for Connect Flow nodes
      },
    });

    // Add edges
    if (nodeType === "MessageAction") {
      if (step.buttons && step.buttons.length > 0) {
        // Add button-specific edges
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
      }

      // Add default outgoing edge (for when no buttons or as fallback)
      if (step.next) {
        edges.push({
          id: `${nodeId}-next`,
          source: nodeId,
          target: step.next,
          sourceHandle:
            step.buttons && step.buttons.length > 0 ? "normal" : undefined,
        });
      }
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

export default function FlowPage() {
  const {
    flows,
    isLoading,
    error,
    deleteFlow,
    toggleFlowStatus,
    toggleFlowDisabled,
    saveFlowFromBuilder,
    reconstructFlowData,
    refreshFlows,
    isRefreshing,
    clearError,
  } = useFlow();

  // State for builder
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingFlow, setEditingFlow] = useState<Flow | null>(null);
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [initialEdges, setInitialEdges] = useState<Edge[]>([]);

  const handleDeleteFlow = async (flow: Flow) => {
    try {
      await deleteFlow(flow.id);
    } catch (error) {
      console.error("Failed to delete flow:", error);
    }
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

  const handleToggleStatus = async (flow: Flow) => {
    try {
      await toggleFlowStatus(flow.id);
    } catch (error) {
      console.error("Failed to toggle flow status:", error);
    }
  };

  const handleToggleDisabled = async (flow: Flow) => {
    try {
      await toggleFlowDisabled(flow.id);
    } catch (error) {
      console.error("Failed to toggle flow disabled status:", error);
    }
  };

  const handleSaveFlow = async (flow: Flow) => {
    try {
      await saveFlowFromBuilder(flow);
      setShowBuilder(false);
      setEditingFlow(null);
      setInitialNodes([]);
      setInitialEdges([]);
    } catch (error) {
      console.error("Failed to save flow:", error);
    }
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
        const isActive = value === "ACTIVE";
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      accessorKey: "isDisabled",
      header: "Disabled",
      Cell: ({ row }) => {
        const isDisabled = row.original.isDisabled;
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              isDisabled
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {isDisabled ? "Disabled" : "Enabled"}
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
        row.status === "ACTIVE" ? "Deactivate" : "Activate",
      icon: (row: Flow) =>
        row.status === "ACTIVE" ? (
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
      key: "toggleDisabled",
      label: (flow: Flow) => (flow.isDisabled ? "Enable" : "Disable"),
      icon: (flow: Flow) =>
        flow.isDisabled ? (
          <Play className="size-4" />
        ) : (
          <Pause className="size-4" />
        ),
      onClick: (flow: Flow, closeMenu: () => void) => {
        handleToggleDisabled(flow);
        closeMenu();
      },
      className: "text-amber-600",
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

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  return (
    <Body title="Flows">
      {/* Error toast handled in useEffect, nothing rendered here */}

      {showBuilder ? (
        <>
          <div className="mb-4">
            <SupportTemplatesStatus />
          </div>
          <FlowBuilderComponent
            onBack={handleBack}
            onSave={handleSaveFlow}
            flows={flows}
            {...(editingFlow
              ? { initialNodes, initialEdges, editingFlow }
              : {})}
          />
        </>
      ) : (
        <Table
          data={flows}
          columns={columns}
          isLoading={isLoading || isRefreshing}
          actionMenuItems={actionMenuItems}
          onAddItem={handleAddFlow}
          onRefresh={refreshFlows}
          addButtonLabel="Add Flow"
          searchPlaceholder="Search flows..."
        />
      )}
    </Body>
  );
}
