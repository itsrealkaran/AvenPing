"use client";

import React, { useState, useEffect } from "react";
import {
  MaterialReactTable,
  MRT_ToggleFiltersButton,
  useMaterialReactTable,
  MRT_ColumnDef,
} from "material-react-table";
import { ListItemIcon, MenuItem } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LucideIcon } from "lucide-react";
import { calculateTableHeight } from "@/lib/utils";

export type ActionMenuItem = {
  key: string | number;
  label: string | ((row: any) => string);
  icon?: React.ReactNode | ((row: any) => React.ReactNode);
  onClick: (row: any, closeMenu: () => void) => void;
  className?: string;
};

export type ToolbarAction<T extends Record<string, any>> = {
  key: string;
  label: string;
  icon?: LucideIcon;
  onClick: (rows: T[]) => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
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
  toolbarActions?: ToolbarAction<T>[];
  onAddItem?: () => void;
  onDelete?: (rows: T[]) => void;
  onRefresh?: () => void | Promise<void>;
  addButtonLabel?: string;
  deleteButtonLabel?: string;
  searchPlaceholder?: string;
  tableHeight?: string;
  primaryColor?: string;
  density?: "compact" | "comfortable" | "spacious";
  Add?: LucideIcon;
  Delete?: LucideIcon;
  onRowClick?: (row: T) => void;
  renderTopToolbar?: (props: { table: any }) => React.ReactNode;
  isSaving?: boolean;
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
  toolbarActions = [],
  onAddItem,
  onDelete,
  onRefresh,
  addButtonLabel = "Add Item",
  deleteButtonLabel = "Delete",
  searchPlaceholder = "Search...",
  tableHeight: propTableHeight,
  primaryColor = "#7c3aed",
  density = "compact",
  Add,
  Delete,
  onRowClick,
  renderTopToolbar,
  isSaving,
}: TableProps<T>) {
  const [tableHeight, setTableHeight] = useState(propTableHeight || "450px");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!propTableHeight) {
      const updateHeight = () => {
        const height = calculateTableHeight();
        setTableHeight(`${height}px`);
      };

      // Calculate initial height
      updateHeight();

      // Recalculate on window resize
      window.addEventListener("resize", updateHeight);

      // Cleanup
      return () => window.removeEventListener("resize", updateHeight);
    }
  }, [propTableHeight]);

  const handleRefresh = async () => {
    if (!onRefresh) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

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
    state: {
      isLoading: isLoading,
      isSaving: isSaving,
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
        borderBottom: "none",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        backgroundColor: "white",
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
    muiPaginationProps: {
      sx: {
        borderBottom: "1px solid #e5e7eb",
      },
    },
    renderTopToolbar:
      renderTopToolbar ||
      (({ table }) => {
        const selectedRowCount = table.getSelectedRowModel().rows.length;

        return (
          <div className="flex justify-between items-center pb-3 bg-transparent">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={searchPlaceholder}
                  value={(table.getState().globalFilter as string) ?? ""}
                  onChange={(e) => table.setGlobalFilter(e.target.value)}
                  className="pl-10 w-64 bg-white"
                />
              </div>
              <MRT_ToggleFiltersButton table={table} />
              <button
                onClick={() => {
                  table.reset();
                  handleRefresh();
                }}
                className="flex justify-center items-center text-gray-500 hover:bg-gray-50 p-2 rounded-full"
                disabled={isRefreshing || isLoading}
                title="Refresh data"
              >
                {isRefreshing || isLoading ? (
                  <Refresh className="h-4 w-4 animate-spin" />
                ) : (
                  <Refresh className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {toolbarActions.length > 0 &&
                toolbarActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.key}
                      variant={action.variant || "outline"}
                      onClick={() =>
                        action.onClick(
                          table
                            .getSelectedRowModel()
                            .rows.map((r) => r.original)
                        )
                      }
                      disabled={isLoading}
                      className={action.className}
                    >
                      {Icon && <Icon className="h-4 w-4 mr-2" />}
                      {action.label}
                    </Button>
                  );
                })}

              {selectedRowCount > 0 && onDelete && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(
                      table.getSelectedRowModel().rows.map((r) => r.original)
                    );
                    table.resetRowSelection();
                  }}
                  disabled={isLoading}
                >
                  {Delete && <Delete className="h-4 w-4 mr-2" />}
                  {deleteButtonLabel} ({selectedRowCount})
                </Button>
              )}

              {onAddItem && (
                <Button
                  onClick={onAddItem}
                  disabled={isLoading || selectedRowCount > 0}
                >
                  {Add && <Add className="h-4 w-4 mr-2" />}
                  {addButtonLabel}
                </Button>
              )}
            </div>
          </div>
        );
      }),
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
    muiTableBodyRowProps: onRowClick
      ? ({ row }) => ({
          onClick: () => onRowClick(row.original),
          style: { cursor: "pointer" },
        })
      : undefined,
  });

  return (
    <div className="w-full overflow-hidden">
      <MaterialReactTable table={table} />
    </div>
  );
}

/* Custom Button Example Usage */
// const toolbarActions: ToolbarAction<Contact>[] = [
//   {
//     key: "export",
//     label: "Export",
//     icon: FileUp,
//     onClick: (selectedRows) => {
//       console.log("Exporting contacts:", selectedRows);
//       alert(`Exporting ${selectedRows.length} contacts...`);
//     },
//   },
//   {
//     key: "add-to-campaign",
//     label: "Add to Campaign",
//     icon: Send,
//     onClick: (selectedRows) => {
//       console.log("Adding to campaign:", selectedRows);
//       alert(`Adding ${selectedRows.length} contacts to a campaign...`);
//     },
//     variant: "secondary",
//   },
// ];

// <Table
//   data={contacts}
//   columns={columns}
//   isLoading={isLoading}
//   actionMenuItems={actionMenuItems}
//   onAddItem={handleAddContact}
//   onRefresh={fetchContacts}
//   addButtonLabel="Add Contact"
//   onDelete={handleDeleteContacts}
//   deleteButtonLabel="Delete Contact"
//   searchPlaceholder="Search contacts..."
//   toolbarActions={toolbarActions}
// />;
