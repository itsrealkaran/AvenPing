"use client";

import Body from "@/components/layout/body";
import { Edit, Trash, BarChart } from "lucide-react";
import React, { useState, useEffect } from "react";
import Table, { ActionMenuItem } from "@/components/ui/table";
import { MRT_ColumnDef } from "material-react-table";
import { CreateCampaignModal } from "@/components/campaigns/create-campaign-modal";
import {
  useCampaigns,
  Campaign as BaseCampaign,
} from "@/context/campaign-provider";
import { useUser } from "@/context/user-context";
import { toast } from "sonner";
import { RecipientStatsModal } from "@/components/campaigns/recipient-stats-modal";

type Campaign = BaseCampaign & {
  recipientStats?: Array<{
    id: string;
    name: string;
    phoneNumber: string;
    status: string;
  }>;
  chartData?: Array<{ Status: string; Count: number }>;
};

export default function CampaignsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const {
    campaigns,
    isLoading,
    isSaving,
    error,
    setSelectedWhatsAppAccountId,
    createCampaign,
  } = useCampaigns();
  const { userInfo } = useUser();

  const [selectedRecipientStats, setSelectedRecipientStats] = useState(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  // Set the selected WhatsApp account ID when user info is available
  useEffect(() => {
    if (userInfo?.whatsappAccount?.id) {
      setSelectedWhatsAppAccountId(userInfo.whatsappAccount.id);
    }
  }, [userInfo, setSelectedWhatsAppAccountId]);

  const handleDeleteCampaign = (campaign: Campaign) => {
    console.log("Delete campaign", campaign);
    // TODO: Implement delete campaign logic
    toast.info("Delete campaign functionality coming soon");
  };

  const handleAddCampaign = () => {
    setShowCreateModal(true);
  };

  const handleCreateCampaign = async (campaignData: any) => {
    try {
      await createCampaign(campaignData);
      toast.success("Campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    console.log("Edit campaign", campaign);
    // TODO: Implement your edit campaign logic here
    toast.info("Edit campaign functionality coming soon");
  };

  const handleViewAnalytics = (campaign: Campaign) => {
    console.log("View analytics for", campaign.name);
    // Implement your analytics view logic here
  };

  const handleRowClick = (campaign: any) => {
    if (campaign.chartData) {
      setSelectedRecipientStats(campaign.recipientStats);
      setSelectedCampaign(campaign);
      setIsStatsModalOpen(true);
    }
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
              value === "COMPLETED"
                ? "bg-green-100 text-green-800"
                : value === "SCHEDULED"
                ? "bg-blue-100 text-blue-800"
                : value === "PENDING"
                ? "bg-gray-100 text-gray-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      accessorKey: "readCount",
      header: "Read",
      Cell: ({ row }) => {
        const chartData = row.original.chartData || [];
        const total = chartData.reduce(
          (sum: number, item: any) => sum + item.Count,
          0
        );
        const readItem = chartData.find((item: any) => item.Status === "Read");
        const count = readItem ? readItem.Count : 0;
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;
        return `${percent}%`;
      },
    },
    {
      accessorKey: "repliedCount",
      header: "Replied",
      Cell: ({ row }) => {
        const chartData = row.original.chartData || [];
        const total = chartData.reduce(
          (sum: number, item: any) => sum + item.Count,
          0
        );
        const repliedItem = chartData.find(
          (item: any) => item.Status === "Replied"
        );
        const count = repliedItem ? repliedItem.Count : 0;
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;
        return `${percent}%`;
      },
    },
    {
      accessorKey: "unreadCount",
      header: "Unread",
      Cell: ({ row }) => {
        const chartData = row.original.chartData || [];
        const total = chartData.reduce(
          (sum: number, item: any) => sum + item.Count,
          0
        );
        const unreadItem = chartData.find(
          (item: any) => item.Status === "Unread"
        );
        const count = unreadItem ? unreadItem.Count : 0;
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;
        return `${percent}%`;
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
  console.log(campaigns, "campaings");
  return (
    <>
      <Body title="Campaigns">
        <Table
          data={campaigns}
          columns={columns}
          isLoading={isLoading}
          isSaving={isSaving}
          actionMenuItems={actionMenuItems}
          onAddItem={handleAddCampaign}
          addButtonLabel="Create Campaign"
          searchPlaceholder="Search campaigns..."
          onRowClick={handleRowClick}
        />
      </Body>

      <CreateCampaignModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCampaign}
      />
      <RecipientStatsModal
        open={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={selectedRecipientStats}
        chartData={selectedCampaign?.chartData}
      />
    </>
  );
}
