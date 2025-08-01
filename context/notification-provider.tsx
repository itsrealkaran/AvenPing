"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  timestamp: Date;
  read: boolean;
  category: "campaign" | "message" | "system" | "payment";
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  campaignUpdates: boolean;
  messageAlerts: boolean;
  systemNotifications: boolean;
  paymentReminders: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  settings: NotificationSettings;
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  updateSettings: (key: keyof NotificationSettings, value: boolean) => void;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    campaignUpdates: true,
    messageAlerts: true,
    systemNotifications: true,
    paymentReminders: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    const savedSettings = localStorage.getItem("notificationSettings");
    
    // Always load dummy notifications for testing (comment out this line to use localStorage)
    const dummyNotifications: Notification[] = [
      {
        id: "1",
        title: "Campaign Completed",
        message: "Your 'Summer Sale' campaign has been successfully delivered to 1,234 contacts.",
        type: "success",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        category: "campaign",
      },
      {
        id: "2",
        title: "New Message Received",
        message: "You have received a new message from +1234567890",
        type: "info",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true,
        category: "message",
      },
      {
        id: "3",
        title: "Payment Due",
        message: "Your subscription payment is due in 3 days. Please update your payment method.",
        type: "warning",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: false,
        category: "payment",
      },
      {
        id: "4",
        title: "System Maintenance",
        message: "Scheduled maintenance will occur on Sunday at 2:00 AM UTC.",
        type: "info",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        read: true,
        category: "system",
      },
      {
        id: "5",
        title: "Campaign Failed",
        message: "Your 'Product Launch' campaign failed to send. Please check your settings.",
        type: "error",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        read: false,
        category: "campaign",
      },
      {
        id: "6",
        title: "WhatsApp Connected",
        message: "Your WhatsApp Business account has been successfully connected.",
        type: "success",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
        read: true,
        category: "system",
      },
      {
        id: "7",
        title: "Template Approved",
        message: "Your 'Welcome Message' template has been approved by WhatsApp.",
        type: "success",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        read: false,
        category: "campaign",
      },
      {
        id: "8",
        title: "Contact Imported",
        message: "Successfully imported 500 contacts from your CSV file.",
        type: "info",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
        read: true,
        category: "message",
      },
    ];
    
    console.log("Setting dummy notifications:", dummyNotifications);
    setNotifications(dummyNotifications);
    
    // Uncomment the following code to use localStorage instead of always showing dummy data
    /*
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        })));
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    } else {
      setNotifications(dummyNotifications);
    }
    */
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error loading notification settings:", error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notificationSettings", JSON.stringify(settings));
  }, [settings]);

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    if (settings.push) {
      toast(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateSettings = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    settings,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    isLoading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
} 