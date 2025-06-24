"use client";

import Body from "@/components/layout/body";
import { GitBranch, Edit, Trash, Play, Pause, Plus } from "lucide-react";
import React, { useState } from "react";
import Table, { ActionMenuItem } from "@/components/ui/table";
import { MRT_ColumnDef } from "material-react-table";
import dynamic from "next/dynamic";

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

const initialFlows: Flow[] = [
  {
    id: "1",
    name: "Welcome Sequence",
    status: "Active",
    date: "2023-06-01T09:00:00Z",
    triggers: [],
    steps: [5],
  },
  {
    id: "2",
    name: "Abandoned Cart",
    status: "Inactive",
    date: "2023-06-02T10:30:00Z",
    triggers: ["hi", "hello"],
    steps: [3],
  },
  {
    id: "3",
    name: "Feedback Request",
    status: "Active",
    date: "2023-06-03T14:15:00Z",
    triggers: [],
    steps: [4],
  },
  {
    id: "1750792206272",
    name: "Test",
    status: "active",
    date: "2025-06-24T19:10:06.272Z",
    triggers: ["testing", "test"],
    steps: [
      {
        id: "1750791963173",
        type: "MessageAction",
        message: "Choose one reply?",
        link: "",
        buttons: [
          {
            label: "message",
            next: "1750791983386",
          },
          {
            label: "image1",
            next: "1750791978085",
          },
          {
            label: "image2",
            next: "1750791993229",
          },
        ],
      },
      {
        id: "1750791978085",
        type: "ImageMessage",
        file: "",
        message: "no image attached",
        next: "1750792159035",
      },
      {
        id: "1750791983386",
        type: "MessageAction",
        message: "Just Message",
        link: "",
        buttons: [],
      },
      {
        id: "1750791993229",
        type: "ImageMessage",
        file: "",
        message: "Test image attached",
        next: null,
      },
      {
        id: "1750792159035",
        type: "VideoMessage",
        file: "",
        message: "no video attached",
        next: null,
      },
    ],
  },
];

export default function FlowPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [flows, setFlows] = useState<Flow[]>(initialFlows);

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

  const handleSaveFlow = (flow: Flow) => {
    setFlows((prev) => [...prev, flow]);
    setShowBuilder(false);
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
              value === "Active"
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
        <FlowBuilderComponent onBack={handleBack} onSave={handleSaveFlow} />
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
