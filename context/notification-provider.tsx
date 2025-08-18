"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useUser } from "./user-context";

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  timestamp: Date;
  read: boolean;
  category: "chats" | "campaigns" | "planExpiry" | "systemUpdates";
  metadata?: Record<string, any>;
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

  // Get auth token from cookies
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('Authorization='));
      if (authCookie) {
        return authCookie.split('=')[1];
      }
    }
    return '';
  };

  // Load notifications from API on mount
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('/api/notifications');

        if (response.ok) {
          const data = await response.json();
          console.log('Notifications loaded:', data);
          setNotifications(data.notifications || []);
        } else {
          console.error('Failed to load notifications:', response.statusText);
          const errorData = await response.json().catch(() => ({}));
          console.error('Error details:', errorData);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notificationSettings", JSON.stringify(settings));
  }, [settings]);

  const addNotification = async (notification: Omit<Notification, "id" | "timestamp" | "read" | "userId">) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (response.ok) {
        const result = await response.json();
        const newNotification = result.notification;
        
        setNotifications(prev => [newNotification, ...prev]);

        // Show toast notification
        if (settings.push) {
          toast(notification.title, {
            description: notification.message,
            duration: 5000,
          });
        }
      } else {
        console.error('Failed to create notification:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.warn('No auth token found for marking notification as read');
        return;
      }

      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'markAsRead' }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      } else {
        console.error('Failed to mark notification as read:', response.statusText);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.warn('No auth token found for marking all notifications as read');
        return;
      }

      const response = await fetch('/api/notifications/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'markAllAsRead' }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
      } else {
        console.error('Failed to mark all notifications as read:', response.statusText);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.warn('No auth token found for deleting notification');
        return;
      }

      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      } else {
        console.error('Failed to delete notification:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.warn('No auth token found for clearing all notifications');
        return;
      }

      const response = await fetch('/api/notifications/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'clearAll' }),
      });

      if (response.ok) {
        setNotifications([]);
      } else {
        console.error('Failed to clear all notifications:', response.statusText);
      }
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
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