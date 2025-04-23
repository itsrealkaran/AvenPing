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

// Updated Type Definitions for Contact
interface Contact {
  id?: string;
  name: string;
  channel: "WhatsApp" | "Email" | "SMS";
  group?: string;
  status: "Active" | "Inactive";
  createdAt: string | Date;
}

interface ContactsPageProps {
  contacts: Contact[];
  onCreateContact: () => void;
  onUpdateContact: (contactId: string, data: Partial<Contact>) => void;
  onDeleteContact: (contactId: string) => void;
  onOpenCreateContactModal: () => void;
}

export function ContactsPage({
  contacts = [],
  onCreateContact,
  onUpdateContact,
  onDeleteContact,
  onOpenCreateContactModal,
}: ContactsPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Default dummy data if contacts prop is not provided
  const defaultContacts: Contact[] = [
    {
      id: "1",
      name: "Alice Smith",
      channel: "WhatsApp",
      group: "Friends",
      status: "Active",
      createdAt: new Date("2023-10-26T10:00:00Z"),
    },
    {
      id: "2",
      name: "Bob Johnson",
      channel: "Email",
      group: "Work",
      status: "Active",
      createdAt: new Date("2023-10-25T14:30:00Z"),
    },
    {
      id: "3",
      name: "Charlie Brown",
      channel: "SMS",
      status: "Inactive",
      createdAt: new Date("2023-09-15T09:15:00Z"),
    },
    {
      id: "4",
      name: "Diana Prince",
      channel: "WhatsApp",
      group: "Family",
      status: "Active",
      createdAt: new Date("2024-01-10T11:00:00Z"),
    },
    {
      id: "5",
      name: "Ethan Hunt",
      channel: "Email",
      status: "Inactive",
      createdAt: new Date("2024-02-20T16:45:00Z"),
    },
  ];

  const finalContacts = contacts.length > 0 ? contacts : defaultContacts;

  const columns: MRT_ColumnDef<Contact>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "channel",
      header: "Channel",
      Cell: ({ row }: { row: MRT_Row<Contact> }) => {
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
      accessorKey: "group",
      header: "Group",
      Cell: ({ row }: { row: MRT_Row<Contact> }) => row.original.group || "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ row }: { row: MRT_Row<Contact> }) => {
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
      Cell: ({ row }: { row: MRT_Row<Contact> }) => {
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
  ];

  const table = useMaterialReactTable({
    columns,
    data: finalContacts,
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
        maxHeight: "500px",
      },
    },
    renderTopToolbar: ({ table }: { table: MRT_TableInstance<Contact> }) => (
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
            placeholder="Search contacts..."
            value={table.getState().globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          <MRT_ToggleFiltersButton table={table} />
        </Box>
        <Button
          onClick={onOpenCreateContactModal}
          className="bg-[#5932EA] hover:bg-[#5932EA]/90"
          disabled={isLoading}
        >
          Create Contact
        </Button>
      </Box>
    ),
    renderRowActionMenuItems: ({
      row,
      closeMenu,
    }: {
      row: MRT_Row<Contact>;
      closeMenu: () => void;
    }) => {
      const contact = row.original;
      const isContactActive = contact.status === "Active";

      return [
        <MenuItem
          key={1}
          onClick={() => {
            const newStatus = isContactActive ? "Inactive" : "Active";
            onUpdateContact(contact.id!, { status: newStatus });
            toast.success(`Contact ${newStatus.toLowerCase()}d successfully`);
            closeMenu();
          }}
          sx={{ m: 0 }}
        >
          <ListItemIcon>
            {isContactActive ? (
              <FaStop className="size-4 text-orange-600" />
            ) : (
              <FaPlay className="size-4 text-green-600" />
            )}
          </ListItemIcon>
          {isContactActive ? "Deactivate" : "Activate"}
        </MenuItem>,
        <MenuItem
          key={2}
          onClick={() => {
            console.log("Edit contact:", contact.id);
            toast.info("Edit functionality not yet implemented.");
            closeMenu();
          }}
          sx={{ m: 0 }}
        >
          <ListItemIcon>
            <FaEdit className="size-4" />
          </ListItemIcon>
          Edit Contact
        </MenuItem>,
        <MenuItem
          key={3}
          onClick={() => {
            onDeleteContact(contact.id!);
            toast.success("Contact deleted successfully");
            closeMenu();
          }}
          sx={{ m: 0, color: "red" }}
        >
          <ListItemIcon>
            <FaTrash className="size-4 text-red-600" />
          </ListItemIcon>
          Delete Contact
        </MenuItem>,
      ];
    },
    state: {
      isLoading,
    },
  });

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
      <Card>
        <CardContent className="p-0">
          <MaterialReactTable table={table} />
        </CardContent>
      </Card>
    </div>
  );
}

export default ContactsPage;
