"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/context/notification-provider";
import Link from "next/link";

interface NotificationBadgeProps {
  className?: string;
}

export function NotificationBadge({ className = "" }: NotificationBadgeProps) {
  const { unreadCount } = useNotifications();

  return (
    <Link href="/notifications" className={`relative inline-flex ${className}`}>
      <Bell className="h-5 w-5 text-gray-600 hover:text-gray-900 transition-colors" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center min-w-0 px-0">
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Link>
  );
} 