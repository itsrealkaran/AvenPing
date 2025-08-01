"use client";

import Body from "@/components/layout/body";
import { Bell, CheckCircle, AlertCircle, Info, Trash, CheckCheck, Search } from "lucide-react";
import React, { useState } from "react";
import Table, { ActionMenuItem, ToolbarAction } from "@/components/ui/table";
import { MRT_ColumnDef, MRT_ToggleFiltersButton } from "material-react-table";
import { useNotifications } from "@/context/notification-provider";
import { DropdownButton } from "@/components/ui/dropdown-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  timestamp: Date;
  read: boolean;
  category: "campaign" | "message" | "system" | "payment";
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationBadge = (category: Notification["category"]) => {
    const categoryMap = {
      campaign: { label: "Campaign", color: "bg-blue-100 text-blue-800" },
      message: { label: "Message", color: "bg-green-100 text-green-800" },
      system: { label: "System", color: "bg-gray-100 text-gray-800" },
      payment: { label: "Payment", color: "bg-purple-100 text-purple-800" },
    };
    const categoryInfo = categoryMap[category];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryInfo.color}`}>
        {categoryInfo.label}
      </span>
    );
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const handleDeleteNotification = async (notificationsToDelete: Notification | Notification[]) => {
    const notificationArray = Array.isArray(notificationsToDelete) ? notificationsToDelete : [notificationsToDelete];
    notificationArray.forEach(notification => {
      deleteNotification(notification.id);
    });
  };

  const handleMarkAsRead = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    // Filter by read status
    if (activeTab === "unread" && notification.read) return false;
    if (activeTab === "read" && !notification.read) return false;
    
    // Filter by category
    if (categoryFilter !== "all" && notification.category !== categoryFilter) return false;
    
    return true;
  });

  const readCount = notifications.filter(n => n.read).length;

  const categoryOptions = [
    { label: "All Categories", value: "all" },
    { label: "Campaign", value: "campaign" },
    { label: "Message", value: "message" },
    { label: "System", value: "system" },
    { label: "Payment", value: "payment" },
  ];

  const columns: MRT_ColumnDef<Notification>[] = [
    {
      accessorKey: "title",
      header: "Title",
      Cell: ({ row }) => {
        const notification = row.original;
        return (
          <div className="flex items-center gap-2">
            {getNotificationIcon(notification.type)}
            <span className="font-medium">{notification.title}</span>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "message",
      header: "Message",
      Cell: ({ row }) => {
        return (
          <div className="max-w-xs truncate" title={row.original.message}>
            {row.original.message}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      Cell: ({ row }) => {
        return getNotificationBadge(row.original.category);
      },
    },
    {
      accessorKey: "timestamp",
      header: "Time",
      Cell: ({ row }) => {
        return formatTimestamp(row.original.timestamp);
      },
    },
    {
      accessorKey: "read",
      header: "Status",
      Cell: ({ row }) => {
        const isRead = row.original.read;
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              isRead
                ? "bg-gray-100 text-gray-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {isRead ? "Read" : "Unread"}
          </span>
        );
      },
    },
  ];

  const actionMenuItems: ActionMenuItem[] = [
    {
      key: "markAsRead",
      label: "Mark as Read",
      icon: <CheckCircle className="text-blue-600 size-4" />,
      onClick: (notification: Notification, closeMenu) => {
        if (!notification.read) {
          handleMarkAsRead(notification);
        }
        closeMenu();
      },
      className: "text-blue-600",
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash className="text-red-600 size-4" />,
      onClick: async (notification: Notification, closeMenu) => {
        await handleDeleteNotification(notification);
        closeMenu();
      },
      className: "text-red-600",
    },
  ];

  // Custom toolbar render function to include filters
  const renderCustomToolbar = ({ table }: { table: any }) => {
    return (
        <div className="flex items-center justify-between pb-3 gap-4">
          {/* Search and filters from original toolbar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notifications..."
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => table.setGlobalFilter(e.target.value)}
                className="pl-10 w-64 bg-white"
              />
            </div>
            <MRT_ToggleFiltersButton table={table} />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DropdownButton
                options={[
                  { label: `All (${notifications.length})`, value: "all" }, 
                  { label: `Unread (${unreadCount})`, value: "unread" }, 
                  { label: `Read (${readCount})`, value: "read" }
                ]}
                selected={activeTab}
                onChange={(value: string) => setActiveTab(value as "all" | "unread" | "read")}
                variant="outline"
                size="default"
              >
                {activeTab === "all" ? `All (${notifications.length})` : 
                 activeTab === "unread" ? `Unread (${unreadCount})` : 
                 `Read (${readCount})`}
              </DropdownButton>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownButton
                options={categoryOptions}
                selected={categoryFilter}
                onChange={setCategoryFilter}
                variant="outline"
                size="default"
              >
                {categoryOptions.find(opt => opt.value === categoryFilter)?.label || "All Categories"}
              </DropdownButton>
            </div>
            
            {table.getSelectedRowModel().rows.length > 0 && (
            <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteNotification(
                  table.getSelectedRowModel().rows.map((r: any) => r.original)
                );
                table.resetRowSelection();
              }}
              disabled={false}
            >
              <Trash className="h-4 w-4 mr-2" />
              Clear Notification ({table.getSelectedRowModel().rows.length})
            </Button>
            </div>
          )}
            <div className="flex items-center gap-2">
              <Button size="default" onClick={() => markAllAsRead()}>
                Mark All as Read
              </Button>
            </div>
          </div>
        </div>
    );
  };

  return (
    <Body title="Notifications">
      <div className="space-y-4">
        <Table
          data={filteredNotifications}
          columns={columns}
          isLoading={false}
          actionMenuItems={actionMenuItems}
          searchPlaceholder="Search notifications..."
          deleteButtonLabel="Delete Notification"
          onDelete={handleDeleteNotification}
          renderTopToolbar={renderCustomToolbar}
        />
      </div>
    </Body>
  );
} 