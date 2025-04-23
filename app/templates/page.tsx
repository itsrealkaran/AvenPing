"use client";
import React, { useState } from "react";
import { Box, ListItemIcon, MenuItem } from "@mui/material";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { MoreHorizontal, Search } from "lucide-react";
import {
  MaterialReactTable,
  MRT_TableInstance,
  MRT_Row,
  MRT_ColumnDef,
  MRT_ToggleFiltersButton,
  useMaterialReactTable,
} from "material-react-table";
import { FaEdit, FaPlay, FaStop, FaTrash } from "react-icons/fa";
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

// Updated Type Definitions for Template
interface Template {
  id?: string;
  name: string;
  category?: string; // Example property, adjust as needed
  status: "Active" | "Draft" | "Archived"; // Example statuses
  createdAt: string | Date;
  lastModified: string | Date; // Example property
}

interface TemplatesPageProps {
  templates: Template[];
  onCreateTemplate: () => void;
  onUpdateTemplate: (templateId: string, data: Partial<Template>) => void;
  onDeleteTemplate: (templateId: string) => void;
  onOpenCreateTemplateModal: () => void; // Renamed prop
}

export function TemplatesPage({
  templates = [],
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onOpenCreateTemplateModal, // Use renamed prop
}: TemplatesPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Default dummy data for templates
  const defaultTemplates: Template[] = [
    {
      id: "t1",
      name: "Welcome Email",
      category: "Onboarding",
      status: "Active",
      createdAt: new Date("2023-11-01T10:00:00Z"),
      lastModified: new Date("2024-03-15T14:30:00Z"),
    },
    {
      id: "t2",
      name: "Password Reset",
      category: "Account",
      status: "Active",
      createdAt: new Date("2023-10-15T09:15:00Z"),
      lastModified: new Date("2024-01-20T11:00:00Z"),
    },
    {
      id: "t3",
      name: "Promotional Offer",
      category: "Marketing",
      status: "Draft",
      createdAt: new Date("2024-02-01T16:45:00Z"),
      lastModified: new Date("2024-03-10T10:00:00Z"),
    },
    {
      id: "t4",
      name: "Monthly Newsletter",
      category: "Marketing",
      status: "Archived",
      createdAt: new Date("2023-08-20T12:00:00Z"),
      lastModified: new Date("2024-02-28T17:00:00Z"),
    },
  ];

  const finalTemplates = templates.length > 0 ? templates : defaultTemplates;

  const columns: MRT_ColumnDef<Template>[] = [
    {
      accessorKey: "name",
      header: "Template Name",
    },
    {
      accessorKey: "category",
      header: "Category",
      Cell: ({ row }: { row: MRT_Row<Template> }) =>
        row.original.category || "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ row }: { row: MRT_Row<Template> }) => {
        const value = row.original.status;
        const statusColors = {
          Active: "bg-green-100 text-green-800",
          Draft: "bg-yellow-100 text-yellow-800",
          Archived: "bg-gray-100 text-gray-800",
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
      accessorKey: "createdAt",
      header: "Created At",
      Cell: ({ row }: { row: MRT_Row<Template> }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      accessorKey: "lastModified",
      header: "Last Modified",
      Cell: ({ row }: { row: MRT_Row<Template> }) => {
        const date = new Date(row.original.lastModified);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: finalTemplates,
    enableRowSelection: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enablePagination: true,
    enableSorting: true,
    enableRowActions: true,
    enableColumnActions: false,
    positionActionsColumn: "last",
    enableStickyHeader: true,
    initialState: {
      showGlobalFilter: true,
      columnPinning: {
        left: ["mrt-row-select"],
        right: ["mrt-row-actions"],
      },
    },
    muiTablePaperProps: {
      sx: {
        boxShadow: "none",
        border: "none",
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: "calc(100vh - 250px)", // Adjust height as needed
      },
    },
    renderTopToolbar: ({ table }: { table: MRT_TableInstance<Template> }) => (
      <Box
        sx={{
          display: "flex",
          gap: "0.5rem",
          p: "1rem",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Input
            placeholder="Search templates..." // Updated placeholder
            value={table.getState().globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          <MRT_ToggleFiltersButton table={table} />
        </Box>
        <Button
          onClick={onOpenCreateTemplateModal} // Use correct handler
          className="bg-[#5932EA] hover:bg-[#5932EA]/90"
          disabled={isLoading}
        >
          Create Template {/* Updated button text */}
        </Button>
      </Box>
    ),
    renderRowActionMenuItems: ({
      row,
      closeMenu,
    }: {
      row: MRT_Row<Template>;
      closeMenu: () => void;
    }) => {
      const template = row.original;
      // Example actions, adjust based on template status or logic
      const isTemplateActive = template.status === "Active";

      return [
        <MenuItem
          key={1}
          onClick={async () => {
            // Example: Trigger edit action
            console.log("Edit template:", template.id);
            // Call onUpdateTemplate or open an edit modal
            if (template.id) {
              // Example update, replace with actual logic/modal
              // await onUpdateTemplate(template.id, { name: 'Updated Name' });
            }
            closeMenu();
          }}
          sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <FaEdit /> Edit
        </MenuItem>,
        <MenuItem
          key={2}
          onClick={async () => {
            // Example: Toggle status action
            const newStatus = isTemplateActive ? "Draft" : "Active"; // Example toggle logic
            console.log(
              "Toggle status for template:",
              template.id,
              "to",
              newStatus
            );
            if (template.id) {
              setIsLoading(true);
              try {
                // Replace with actual API call or state update
                await onUpdateTemplate(template.id, { status: newStatus });
                toast.success(`Template status updated to ${newStatus}`);
              } catch (error) {
                console.error("Failed to update template status:", error);
                toast.error("Failed to update template status");
              } finally {
                setIsLoading(false);
              }
            }
            closeMenu();
          }}
          sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          {/* Adjust icon based on action */}
          {isTemplateActive ? <FaStop /> : <FaPlay />}{" "}
          {isTemplateActive ? "Set to Draft" : "Activate"}
        </MenuItem>,
        <MenuItem
          key={3}
          onClick={async () => {
            // Example: Delete action
            console.log("Delete template:", template.id);
            if (template.id) {
              setIsLoading(true);
              try {
                // Replace with actual API call
                await onDeleteTemplate(template.id);
                toast.success("Template deleted successfully");
              } catch (error) {
                console.error("Failed to delete template:", error);
                toast.error("Failed to delete template");
              } finally {
                setIsLoading(false);
              }
            }
            closeMenu();
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "red",
          }}
        >
          <FaTrash /> Delete
        </MenuItem>,
      ];
    },
  });

  // Placeholder functions if not provided
  const handleCreateTemplate = () =>
    console.log("Create template modal opened");
  const handleUpdateTemplate = (id: string, data: Partial<Template>) =>
    console.log("Update template:", id, data);
  const handleDeleteTemplate = (id: string) =>
    console.log("Delete template:", id);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Templates Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Templates</CardTitle>
          <CardDescription>
            Manage your message templates. Create, edit, and organize templates
            for different channels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MaterialReactTable table={table} />
        </CardContent>
      </Card>
    </div>
  );
}

// Default export for Next.js page component
export default function Page() {
  // Provide placeholder functions or connect to actual logic/state management
  return (
    <TemplatesPage
      templates={[]} // Pass actual templates data here
      onOpenCreateTemplateModal={() => console.log("Open create modal handler")}
      onCreateTemplate={() => console.log("Create template handler")}
      onUpdateTemplate={(id, data) =>
        console.log(`Update template ${id}`, data)
      }
      onDeleteTemplate={(id) => console.log(`Delete template ${id}`)}
    />
  );
}
