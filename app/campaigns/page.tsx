"use client";

import Body from "@/components/ui/body";
import { Send, Edit, Trash, Pause, Play, Plus, BarChart } from "lucide-react";
import React, { useState } from "react";
import Table, { ActionMenuItem } from "@/components/ui/table";
import { MRT_ColumnDef } from "material-react-table";

type Campaign = {
  id: string;
  name: string;
  type: string;
  status: string;
  sent: number;
  delivered: number;
  opened: number;
  createdAt: string;
};

export default function CampaignsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Welcome Message",
      type: "SMS",
      status: "Active",
      sent: 1250,
      delivered: 1200,
      opened: 980,
      createdAt: "2023-05-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Promotional Offer",
      type: "WhatsApp",
      status: "Active",
      sent: 2500,
      delivered: 2450,
      opened: 1800,
      createdAt: "2023-05-16T11:20:00Z",
    },
    {
      id: "3",
      name: "Event Reminder",
      type: "SMS",
      status: "Inactive",
      sent: 500,
      delivered: 490,
      opened: 320,
      createdAt: "2023-05-17T09:15:00Z",
    },
    {
      id: "4",
      name: "Customer Feedback",
      type: "WhatsApp",
      status: "Active",
      sent: 1800,
      delivered: 1750,
      opened: 1200,
      createdAt: "2023-05-18T14:45:00Z",
    },
  ]);

  const handleDeleteCampaign = (campaign: Campaign) => {
    setCampaigns(campaigns.filter((c) => c.id !== campaign.id));
  };

  const handleAddCampaign = () => {
    console.log("Add campaign");
    // Implement your add campaign logic here
  };

  const handleEditCampaign = (campaign: Campaign) => {
    console.log("Edit campaign", campaign);
    // Implement your edit campaign logic here
  };

  const handleToggleStatus = (campaign: Campaign) => {
    const newStatus = campaign.status === "Active" ? "Inactive" : "Active";
    setCampaigns(
      campaigns.map((c) =>
        c.id === campaign.id ? { ...c, status: newStatus } : c
      )
    );
  };

  const handleViewAnalytics = (campaign: Campaign) => {
    console.log("View analytics for", campaign.name);
    // Implement your analytics view logic here
  };

  const columns: MRT_ColumnDef<Campaign>[] = [
    {
      accessorKey: "name",
      header: "Campaign Name",
    },
    {
      accessorKey: "type",
      header: "Type",
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
      accessorKey: "sent",
      header: "Sent",
    },
    {
      accessorKey: "delivered",
      header: "Delivered",
    },
    {
      accessorKey: "opened",
      header: "Opened",
      Cell: ({ row }) => {
        const { opened, sent } = row.original;
        const openRate = sent > 0 ? Math.round((opened / sent) * 100) : 0;
        return (
          <div className="flex items-center gap-2">
            <span>{opened}</span>
            <span className="text-xs text-gray-500">({openRate}%)</span>
          </div>
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
      key: "analytics",
      label: "View Analytics",
      icon: <BarChart className="size-4" />,
      onClick: (campaign, closeMenu) => {
        handleViewAnalytics(campaign);
        closeMenu();
      },
    },
    {
      key: "edit",
      label: "Edit",
      icon: <Edit className="size-4" />,
      onClick: (campaign, closeMenu) => {
        handleEditCampaign(campaign);
        closeMenu();
      },
    },
    {
      key: "toggle",
      label: (row: Campaign) =>
        row.status === "Active" ? "Pause Campaign" : "Activate Campaign",
      icon: (row: Campaign) =>
        row.status === "Active" ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4" />
        ),
      onClick: (campaign, closeMenu) => {
        handleToggleStatus(campaign);
        closeMenu();
      },
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash className="text-red-600 size-4" />,
      onClick: (campaign, closeMenu) => {
        handleDeleteCampaign(campaign);
        closeMenu();
      },
      className: "text-red-600",
    },
  ];

  return (
    <Body icon={Send} title="Campaigns">
      <Table
        data={campaigns}
        columns={columns}
        isLoading={isLoading}
        actionMenuItems={actionMenuItems}
        onAddItem={handleAddCampaign}
        addButtonLabel="Create Campaign"
        searchPlaceholder="Search campaigns..."
        tableHeight="340px"
      />
    </Body>
  );
}
