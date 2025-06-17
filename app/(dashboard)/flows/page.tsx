"use client";

import Body from "@/components/layout/body";
import { GitBranch, Edit, Trash, Play, Pause, Plus } from "lucide-react";
import React, { useState } from "react";
import Table, { ActionMenuItem } from "@/components/ui/table";
import { MRT_ColumnDef } from "material-react-table";
import dynamic from "next/dynamic";

// Dynamically import FlowBuilder to avoid SSR issues
const FlowBuilder = dynamic(() => import("@/components/flows/flow-builder"), {
  ssr: false,
});

// Define the Flow type
type Flow = {
  id: string;
  name: string;
  status: string;
  steps: number;
  createdAt: string;
};

export default function FlowPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [flows, setFlows] = useState<Flow[]>([
    {
      id: "1",
      name: "Welcome Sequence",
      status: "Active",
      steps: 5,
      createdAt: "2023-06-01T09:00:00Z",
    },
    {
      id: "2",
      name: "Abandoned Cart",
      status: "Inactive",
      steps: 3,
      createdAt: "2023-06-02T10:30:00Z",
    },
    {
      id: "3",
      name: "Feedback Request",
      status: "Active",
      steps: 4,
      createdAt: "2023-06-03T14:15:00Z",
    },
  ]);

  // State for builder
  const [showBuilder, setShowBuilder] = useState(false);
  const [editFlow, setEditFlow] = useState<Flow | null>(null);

  const handleDeleteFlow = (flow: Flow) => {
    setFlows(flows.filter((f) => f.id !== flow.id));
  };

  const handleAddFlow = () => {
    setEditFlow(null);
    setShowBuilder(true);
  };

  const handleEditFlow = (flow: Flow) => {
    setEditFlow(flow);
    setShowBuilder(true);
  };

  const handleToggleStatus = (flow: Flow) => {
    const newStatus = flow.status === "Active" ? "Inactive" : "Active";
    setFlows(
      flows.map((f) => (f.id === flow.id ? { ...f, status: newStatus } : f))
    );
  };

  const handleSaveFlow = (nodes: any, edges: any) => {
    // For demo: just close builder and (optionally) update flows
    setShowBuilder(false);
    setEditFlow(null);
    // You can add logic here to update flows list
  };

  const handleBack = () => {
    setShowBuilder(false);
    setEditFlow(null);
  };

  const columns: MRT_ColumnDef<Flow>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "steps",
      header: "Steps",
      Cell: ({ row }) => <span>{row.original.steps}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ row }) => {
        const value = row.original.status;
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              value === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      Cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
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
        <FlowBuilder
          onBack={handleBack}
          onSave={handleSaveFlow}
          // Optionally pass initialNodes/initialEdges for edit
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
