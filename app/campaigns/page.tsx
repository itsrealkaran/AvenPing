"use client";

import { Box, ListItemIcon, MenuItem, Typography } from "@mui/material";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { MoreHorizontal, Search } from "lucide-react";
import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import React, { useState } from "react";
import { FaEdit, FaPause, FaPlay, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// Type Definition for Campaign
interface Campaign {
  id?: string;
  name: string;
  channel: "WhatsApp" | "Email" | "SMS";
  status: "Draft" | "Active" | "Paused" | "Completed";
  sent: number;
  opened: number; // Representing count, could be rate %
  clicked: number; // Representing count, could be rate %
  createdAt: string | Date;
}

// Props for the CampaignsPage component
interface CampaignsPageProps {
  campaigns?: Campaign[]; // Optional prop
  onCreateCampaign: () => void;
  onUpdateCampaign: (campaignId: string, data: Partial<Campaign>) => void;
  onDeleteCampaign: (campaignId: string) => void;
  onStartCampaign: (campaignId: string) => void;
  onPauseCampaign: (campaignId: string) => void;
  onOpenCreateCampaignModal: () => void;
}

// Dummy handler functions (replace with actual logic)
const handleCreateCampaign = () => console.log("Create campaign");
const handleUpdateCampaign = (id: string, data: Partial<Campaign>) =>
  console.log(`Update campaign ${id}`, data);
const handleDeleteCampaign = (id: string) =>
  console.log(`Delete campaign ${id}`);
const handleStartCampaign = (id: string) => console.log(`Start campaign ${id}`);
const handlePauseCampaign = (id: string) => console.log(`Pause campaign ${id}`);
const handleOpenCreateCampaignModal = () =>
  console.log("Open create campaign modal");

// Rename the main component to follow the pattern
function CampaignsPageComponent({
  // Renamed and accept props directly
  campaigns = [], // Default to empty array if prop not provided
  onCreateCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
  onStartCampaign,
  onPauseCampaign,
  onOpenCreateCampaignModal,
}: CampaignsPageProps) {
  // Destructure props directly
  const [isLoading, setIsLoading] = useState(false);

  // Default dummy data if campaigns prop is empty
  const defaultCampaigns: Campaign[] = [
    {
      id: "camp1",
      name: "Summer Sale Promo",
      channel: "Email",
      status: "Active",
      sent: 5000,
      opened: 1500,
      clicked: 300,
      createdAt: new Date("2024-06-01T10:00:00Z"),
    },
    {
      id: "camp2",
      name: "WhatsApp Blast",
      channel: "WhatsApp",
      status: "Completed",
      sent: 10000,
      opened: 7500,
      clicked: 1500,
      createdAt: new Date("2024-05-15T14:30:00Z"),
    },
    {
      id: "camp3",
      name: "New Product Launch SMS",
      channel: "SMS",
      status: "Paused",
      sent: 2000,
      opened: 1800,
      clicked: 400,
      createdAt: new Date("2024-06-10T09:15:00Z"),
    },
    {
      id: "camp4",
      name: "Re-engagement Email Series",
      channel: "Email",
      status: "Draft",
      sent: 0,
      opened: 0,
      clicked: 0,
      createdAt: new Date("2024-06-20T11:00:00Z"),
    },
  ];

  const finalCampaigns = campaigns.length > 0 ? campaigns : defaultCampaigns;

  const columns: MRT_ColumnDef<Campaign>[] = [
    {
      accessorKey: "name",
      header: "Campaign Name",
      size: 250,
    },
    {
      accessorKey: "channel",
      header: "Channel",
      filterVariant: "select",
      filterSelectOptions: ["WhatsApp", "Email", "SMS"],
      Cell: ({ row }: { row: MRT_Row<Campaign> }) => {
        const value = row.original.channel;
        const channelColors = {
          WhatsApp: "bg-green-100 text-green-800",
          Email: "bg-blue-100 text-blue-800",
          SMS: "bg-yellow-100 text-yellow-800",
        };
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
              channelColors[value as keyof typeof channelColors] ??
              "bg-gray-100 text-gray-800"
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      filterVariant: "select",
      filterSelectOptions: ["Draft", "Active", "Paused", "Completed"],
      Cell: ({ row }: { row: MRT_Row<Campaign> }) => {
        const value = row.original.status;
        const statusColors = {
          Draft: "bg-gray-100 text-gray-800",
          Active: "bg-green-100 text-green-800",
          Paused: "bg-yellow-100 text-yellow-800",
          Completed: "bg-blue-100 text-blue-800",
        };
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
              statusColors[value as keyof typeof statusColors] ??
              "bg-gray-100 text-gray-800"
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
      filterVariant: "range",
      Cell: ({ row }: { row: MRT_Row<Campaign> }) =>
        row.original.sent.toLocaleString(),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      filterVariant: "date-range",
      Cell: ({ row }: { row: MRT_Row<Campaign> }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          // hour: "2-digit", // Keep concise date for campaigns list
          // minute: "2-digit",
        });
      },
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: finalCampaigns,
    enableRowSelection: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableGlobalFilter: true, //enable search
    enableColumnFilters: true, //enable filtering
    enablePagination: true,
    enableSorting: true,
    enableRowActions: true,
    enableColumnActions: false, //optional definitions
    positionActionsColumn: "last",
    enableStickyHeader: true,
    initialState: {
      showGlobalFilter: true, //show search by default
      pagination: { pageIndex: 0, pageSize: 5 }, // Set default page size to 5
      columnPinning: {
        left: ["mrt-row-select"],
        right: ["mrt-row-actions"],
      },
    },
    muiTablePaperProps: {
      sx: {
        boxShadow: "none", //remove paper shadow
        border: "none", //remove paper border
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: "calc(100vh - 250px)", // Added maxHeight like templates page
      },
    },
    renderTopToolbar: ({ table }: { table: MRT_TableInstance<Campaign> }) => (
      <Box
        sx={{
          display: "flex",
          gap: "0.5rem",
          p: "1rem", // Keep padding for spacing
          // justifyContent: "space-between", // Remove this as button is moved
          alignItems: "center",
        }}
      >
        {/* Left Side: Search and Filters ONLY */}
        <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {/* Global Search Input */}
          <Input
            placeholder="Search campaigns..."
            value={table.getState().globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          <MRT_ToggleFiltersButton table={table} />
        </Box>

        {/* Right Side: Action Button - MOVED to CardHeader */}
        {/* <Button
          onClick={onOpenCreateCampaignModal}
          className="bg-[#5932EA] hover:bg-[#5932EA]/90"
          disabled={isLoading}
        >
          Create Campaign
        </Button> */}
      </Box>
    ),
    renderRowActionMenuItems: ({
      row,
      closeMenu,
    }: {
      row: MRT_Row<Campaign>;
      closeMenu: () => void;
    }) => {
      const campaign = row.original;
      const items = [];

      if (campaign.status === "Draft" || campaign.status === "Paused") {
        items.push(
          <MenuItem
            key="start"
            onClick={() => {
              if (campaign.id) onStartCampaign(campaign.id);
              closeMenu();
              toast.success(`Campaign "${campaign.name}" started.`);
            }}
            sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <ListItemIcon>
              <FaPlay fontSize="small" />
            </ListItemIcon>
            Start
          </MenuItem>
        );
      }

      if (campaign.status === "Active") {
        items.push(
          <MenuItem
            key="pause"
            onClick={() => {
              if (campaign.id) onPauseCampaign(campaign.id);
              closeMenu();
              toast.info(`Campaign "${campaign.name}" paused.`);
            }}
            sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <ListItemIcon>
              <FaPause fontSize="small" />
            </ListItemIcon>
            Pause
          </MenuItem>
        );
      }

      items.push(
        <MenuItem
          key="edit"
          onClick={() => {
            // Add logic to open an edit modal or navigate to edit page
            console.log("Edit campaign:", campaign);
            if (campaign.id) onUpdateCampaign(campaign.id, {}); // Placeholder call
            closeMenu();
            toast.info(`Editing campaign "${campaign.name}".`); // Placeholder
          }}
          sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <ListItemIcon>
            <FaEdit fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
      );

      items.push(
        <MenuItem
          key="delete"
          onClick={async () => {
            // Add confirmation dialog here
            setIsLoading(true); // Example loading state
            try {
              if (campaign.id) await onDeleteCampaign(campaign.id);
              toast.success(`Campaign "${campaign.name}" deleted.`);
            } catch (error) {
              toast.error("Failed to delete campaign.");
              console.error("Deletion failed:", error);
            } finally {
              setIsLoading(false);
              closeMenu();
            }
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "red",
          }}
        >
          <ListItemIcon sx={{ color: "red" }}>
            <FaTrash fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      );

      return items;
    },
  });

  return (
    <>
      <div className="flex justify-start items-start mb-4">
        <h1 className="text-2xl font-bold text-left">Campaigns</h1>
      </div>
      <Card>
        <CardHeader>
          {/* Use flexbox to position title/desc vs button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              {" "}
              {/* Container for title and description */}
              <CardTitle>Campaigns</CardTitle>
              <CardDescription>
                Manage your marketing campaigns here.
              </CardDescription>
            </Box>
            {/* Moved Button */}
            <Button
              onClick={onOpenCreateCampaignModal}
              className="bg-[#5932EA] hover:bg-[#5932EA]/90"
              disabled={isLoading}
            >
              Create Campaign
            </Button>
          </Box>
        </CardHeader>
        <CardContent className="pt-0">
          {" "}
          {/* Remove top padding from CardContent if toolbar is minimal */}
          <MaterialReactTable table={table} />
        </CardContent>
      </Card>
    </>
  );
}

// Default export wrapper function
export default function Page() {
  // Here you would typically fetch data or pass props from a higher level
  // For now, using the dummy handlers and letting the component use default data
  return (
    <CampaignsPageComponent
      // campaigns={[]} // Example: Pass fetched campaigns here
      onCreateCampaign={handleCreateCampaign}
      onUpdateCampaign={handleUpdateCampaign}
      onDeleteCampaign={handleDeleteCampaign}
      onStartCampaign={handleStartCampaign}
      onPauseCampaign={handlePauseCampaign}
      onOpenCreateCampaignModal={handleOpenCreateCampaignModal}
    />
  );
}
