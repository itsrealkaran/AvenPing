"use client";

import React, { useState } from "react";
import {
  MaterialReactTable,
  MRT_ToggleFiltersButton,
  useMaterialReactTable,
  MRT_ColumnDef,
} from "material-react-table";
import { Box, ListItemIcon, MenuItem } from "@mui/material";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

export type ActionMenuItem = {
  key: string | number;
  label: string | ((row: any) => string);
  icon?: React.ReactNode | ((row: any) => React.ReactNode);
  onClick: (row: any, closeMenu: () => void) => void;
  className?: string;
};

export type TableProps<T extends Record<string, any>> = {
  data: T[];
  columns: MRT_ColumnDef<T>[];
  isLoading?: boolean;
  enableRowSelection?: boolean;
  enableColumnResizing?: boolean;
  enableColumnOrdering?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  enableRowActions?: boolean;
  actionMenuItems?: ActionMenuItem[];
  onAddItem?: () => void;
  addButtonLabel?: string;
  searchPlaceholder?: string;
  tableHeight?: string;
  primaryColor?: string;
  density?: "compact" | "comfortable" | "spacious";
};

export default function Table<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  enableRowSelection = true,
  enableColumnResizing = true,
  enableColumnOrdering = false,
  enableGlobalFilter = true,
  enableColumnFilters = true,
  enablePagination = true,
  enableSorting = true,
  enableRowActions = true,
  actionMenuItems = [],
  onAddItem,
  addButtonLabel = "Add Item",
  searchPlaceholder = "Search...",
  tableHeight = "340px",
  primaryColor = "#7c3aed",
  density = "compact",
}: TableProps<T>) {
  const table = useMaterialReactTable({
    columns,
    data,
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
      showGlobalFilter: false,
      columnPinning: {
        left: ["mrt-row-select"],
        right: ["mrt-row-actions"],
      },
      density,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        "--mui-palette-primary-main": primaryColor,
        "--mui-palette-primary-light": primaryColor,
        "--mui-palette-primary-dark": primaryColor,
        boxShadow: "none",
        backgroundColor: "transparent",
      },
    },
    muiTableContainerProps: {
      sx: {
        "--mui-palette-primary-main": primaryColor,
        "--mui-palette-primary-light": primaryColor,
        "--mui-palette-primary-dark": primaryColor,
        height: tableHeight,
        border: "1px solid rgb(201, 201, 201)",
        borderRadius: "8px",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        color: "#4A5565",
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={table.getState().globalFilter ?? ""}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
              className="pl-10 w-64 bg-white"
            />
          </div>
          <MRT_ToggleFiltersButton table={table} />
        </div>
        {onAddItem && (
          <div className="flex gap-2">
            <Button
              onClick={onAddItem}
              variant={"outline"}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              {addButtonLabel}
            </Button>
          </div>
        )}
      </div>
    ),
    renderRowActionMenuItems:
      actionMenuItems.length > 0
        ? ({ row, closeMenu }) =>
            actionMenuItems.map((item) => (
              <MenuItem
                key={item.key}
                onClick={() => {
                  item.onClick(row.original, closeMenu);
                }}
                sx={{ m: 0 }}
                className={item.className}
              >
                {item.icon && (
                  <ListItemIcon>
                    {typeof item.icon === "function"
                      ? item.icon(row.original)
                      : item.icon}
                  </ListItemIcon>
                )}
                {typeof item.label === "function"
                  ? item.label(row.original)
                  : item.label}
              </MenuItem>
            ))
        : undefined,
    state: {
      isLoading,
    },
  });

  return <MaterialReactTable table={table} />;
}