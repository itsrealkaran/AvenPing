"use client";

import Body from "@/components/ui/body";
import {
  Users,
  Edit,
  Trash,
  Pause,
  Play,
  Plus,
  Filter,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import { Box, ListItemIcon, MenuItem } from "@mui/material";
import {
  MaterialReactTable,
  MRT_ToggleFiltersButton,
  useMaterialReactTable,
} from "material-react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";

export default function ContactsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([
    {
      id: "1",
      name: "John Doe",
      phone: "+91 9876543210",
      group: "Friends",
      status: "Active",
      createdAt: "2023-05-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      phone: "+91 9876543211",
      group: "Family",
      status: "Active",
      createdAt: "2023-05-16T11:20:00Z",
    },
    {
      id: "3",
      name: "Mike Johnson",
      phone: "+91 9876543212",
      group: "Work",
      status: "Inactive",
      createdAt: "2023-05-17T09:15:00Z",
    },
    {
      id: "4",
      name: "Sarah Williams",
      phone: "+91 9876543213",
      group: "Friends",
      status: "Active",
      createdAt: "2023-05-18T14:45:00Z",
    },
  ]);

  const handleDeleteContact = (contact: any) => {
    setContacts(contacts.filter((c) => c.id !== contact.id));
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
    },
    {
      accessorKey: "group",
      header: "Group",
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ row }: any) => {
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
      Cell: ({ row }: any) => {
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
      accessorKey: "createdAt",
      header: "Created At",
      Cell: ({ row }: any) => {
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
      accessorKey: "createdAt",
      header: "Created At",
      Cell: ({ row }: any) => {
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
    data: contacts,
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
      showGlobalFilter: false, // Hide the global filter initially to match the image
      columnPinning: {
        left: ["mrt-row-select"],
        right: ["mrt-row-actions"],
      },
      density: "compact", // Use comfortable density to match the spacing in the image
    },
    muiTablePaperProps: {
      elevation: 0, // Remove shadow to match the flat design in the image
      sx: {
        "--mui-palette-primary-main": "#7c3aed",
        "--mui-palette-primary-light": "#7c3aed",
        "--mui-palette-primary-dark": "#7c3aed",
        boxShadow: "none",
        backgroundColor: "transparent", // Light red background color
      },
    },
    muiTableContainerProps: {
      sx: {
        "--mui-palette-primary-main": "#7c3aed",
        "--mui-palette-primary-light": "#7c3aed",
        "--mui-palette-primary-dark": "#7c3aed",
        height: "340px",
        border: "1px solid rgb(201, 201, 201)",
        borderRadius: "8px",
      },
    },

    muiTableHeadCellProps: {
      sx: {
        // backgroundColor: "#F3F4F6", // Light gray header background
        color: "#6b7280", // Medium gray text for headers
        fontSize: "small",
        fontWeight: "500",
        borderBottom: "1px solid #e5e7eb",
      },
    },

    muiTableHeadProps: {
      sx: {
        boxShadow: "none",
      },
    },

    muiTableBodyCellProps: {
      sx: {
        py: "12px",
      },
    },

    renderTopToolbar: ({ table }) => (
      <div className="flex justify-between items-center pb-3 bg-transparent">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search contacts..."
            value={table.getState().globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="w-64 bg-white"
          />
          <MRT_ToggleFiltersButton table={table} />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              // Handle create contact
            }}
            variant={"outline"}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            Add Contact
          </Button>
        </div>
      </div>
    ),
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <MenuItem
        key={1}
        onClick={() => {
          // Handle edit contact
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Edit className="size-4" />
        </ListItemIcon>
        Edit
      </MenuItem>,
      <MenuItem
        key={2}
        onClick={() => {
          // Handle toggle status
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          {row.original.status === "Active" ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </ListItemIcon>
        {row.original.status === "Active" ? "Deactivate" : "Activate"}
      </MenuItem>,
      <MenuItem
        key={3}
        onClick={() => {
          handleDeleteContact(row.original);
          closeMenu();
        }}
        sx={{ m: 0 }}
        className="text-red-600"
      >
        <ListItemIcon>
          <Trash className="text-red-600 size-4" />
        </ListItemIcon>
        Delete
      </MenuItem>,
    ],
    state: {
      isLoading,
    },
  });

  return (
    <Body icon={Users} title="Contacts">
      <MaterialReactTable table={table} />
    </Body>
  );
}
