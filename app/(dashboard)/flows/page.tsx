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
      toast.success("Flow saved successfully!");
    } catch (error: any) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "An unknown error occurred";
      toast.error(errorMessage);
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

  return (
    <Body title="Flows">
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
