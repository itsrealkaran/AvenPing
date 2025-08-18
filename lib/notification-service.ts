import redis from './redis';

export interface Notification {
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

export interface NotificationCreateInput {
  userId: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  category: "chats" | "campaigns" | "planExpiry" | "systemUpdates";
  metadata?: Record<string, any>;
}

class NotificationService {
  private readonly NOTIFICATION_PREFIX = 'notification:';
  private readonly USER_NOTIFICATIONS_PREFIX = 'user_notifications:';
  private readonly NOTIFICATION_COUNTER_KEY = 'notification_counter';

  /**
   * Store a new notification in Redis for a specific user
   */
  async createNotification(input: NotificationCreateInput): Promise<Notification> {
    try {
      // Generate unique ID
      const id = await this.generateNotificationId();
      
      const notification: Notification = {
        id,
        userId: input.userId,
        title: input.title,
        message: input.message,
        type: input.type,
        category: input.category,
        timestamp: new Date(),
        read: false,
        metadata: input.metadata || {},
      };

      // Store notification data
      const notificationKey = `${this.NOTIFICATION_PREFIX}${id}`;
      await redis.setex(notificationKey, 7776000, JSON.stringify(notification)); // 90 days TTL

      // Add to user's notification list
      const userNotificationsKey = `${this.USER_NOTIFICATIONS_PREFIX}${input.userId}`;
      await redis.zadd(userNotificationsKey, notification.timestamp.getTime(), id);

      // Set TTL for user notifications (90 days)
      await redis.expire(userNotificationsKey, 7776000);

      // Increment unread count for user
      await this.incrementUnreadCount(input.userId);

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  /**
   * Get all notifications for a specific user
   */
  async getUserNotifications(userId: string, limit: number = 100, offset: number = 0): Promise<Notification[]> {
    try {
      const userNotificationsKey = `${this.USER_NOTIFICATIONS_PREFIX}${userId}`;
      
      // Get notification IDs from user's sorted set (most recent first)
      const notificationIds = await redis.zrevrange(userNotificationsKey, offset, offset + limit - 1);
      
      if (notificationIds.length === 0) {
        return [];
      }

      // Fetch notification data for each ID
      const notifications: Notification[] = [];
      for (const id of notificationIds) {
        const notificationKey = `${this.NOTIFICATION_PREFIX}${id}`;
        const notificationData = await redis.get(notificationKey);
        
        if (notificationData) {
          const notification = JSON.parse(notificationData);
          notification.timestamp = new Date(notification.timestamp);
          notifications.push(notification);
        }
      }

      return notifications;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw new Error('Failed to get user notifications');
    }
  }

  /**
   * Get unread notifications count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const unreadCountKey = `unread_count:${userId}`;
      const count = await redis.get(unreadCountKey);
      return count ? parseInt(count, 10) : 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    try {
      const notificationKey = `${this.NOTIFICATION_PREFIX}${notificationId}`;
      const notificationData = await redis.get(notificationKey);
      
      if (!notificationData) {
        return false;
      }

      const notification: Notification = JSON.parse(notificationData);
      
      // Check if notification belongs to user
      if (notification.userId !== userId) {
        return false;
      }

      // Update notification
      notification.read = true;
      await redis.setex(notificationKey, 7776000, JSON.stringify(notification));

      // Decrement unread count
      await this.decrementUnreadCount(userId);

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<number> {
    try {
      const userNotificationsKey = `${this.USER_NOTIFICATIONS_PREFIX}${userId}`;
      const notificationIds = await redis.zrange(userNotificationsKey, 0, -1);
      
      let updatedCount = 0;
      for (const id of notificationIds) {
        const notificationKey = `${this.NOTIFICATION_PREFIX}${id}`;
        const notificationData = await redis.get(notificationKey);
        
        if (notificationData) {
          const notification: Notification = JSON.parse(notificationData);
          if (!notification.read) {
            notification.read = true;
            await redis.setex(notificationKey, 7776000, JSON.stringify(notification));
            updatedCount++;
          }
        }
      }

      // Reset unread count to 0
      await this.resetUnreadCount(userId);

      return updatedCount;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return 0;
    }
  }

  /**
   * Delete a specific notification
   */
  async deleteNotification(userId: string, notificationId: string): Promise<boolean> {
    try {
      const notificationKey = `${this.NOTIFICATION_PREFIX}${notificationId}`;
      const notificationData = await redis.get(notificationKey);
      
      if (!notificationData) {
        return false;
      }

      const notification: Notification = JSON.parse(notificationData);
      
      // Check if notification belongs to user
      if (notification.userId !== userId) {
        return false;
      }

      // Remove from user's notification list
      const userNotificationsKey = `${this.USER_NOTIFICATIONS_PREFIX}${userId}`;
      await redis.zrem(userNotificationsKey, notificationId);

      // Delete notification data
      await redis.del(notificationKey);

      // Decrement unread count if notification was unread
      if (!notification.read) {
        await this.decrementUnreadCount(userId);
      }

      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Clear all notifications for a user
   */
  async clearAllNotifications(userId: string): Promise<number> {
    try {
      const userNotificationsKey = `${this.USER_NOTIFICATIONS_PREFIX}${userId}`;
      const notificationIds = await redis.zrange(userNotificationsKey, 0, -1);
      
      let deletedCount = 0;
      for (const id of notificationIds) {
        const notificationKey = `${this.NOTIFICATION_PREFIX}${id}`;
        await redis.del(notificationKey);
        deletedCount++;
      }

      // Clear user's notification list
      await redis.del(userNotificationsKey);

      // Reset unread count
      await this.resetUnreadCount(userId);

      return deletedCount;
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      return 0;
    }
  }

  /**
   * Get notifications by category for a user
   */
  async getNotificationsByCategory(userId: string, category: string, limit: number = 50): Promise<Notification[]> {
    try {
      const allNotifications = await this.getUserNotifications(userId, 1000);
      return allNotifications
        .filter(notification => notification.category === category)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting notifications by category:', error);
      return [];
    }
  }

  /**
   * Search notifications for a user
   */
  async searchNotifications(userId: string, query: string, limit: number = 50): Promise<Notification[]> {
    try {
      const allNotifications = await this.getUserNotifications(userId, 1000);
      const searchTerm = query.toLowerCase();
      
      return allNotifications
        .filter(notification => 
          notification.title.toLowerCase().includes(searchTerm) ||
          notification.message.toLowerCase().includes(searchTerm)
        )
        .slice(0, limit);
    } catch (error) {
      console.error('Error searching notifications:', error);
      return [];
    }
  }

  /**
   * Generate unique notification ID
   */
  private async generateNotificationId(): Promise<string> {
    const counter = await redis.incr(this.NOTIFICATION_COUNTER_KEY);
    return `notif_${Date.now()}_${counter}`;
  }

  /**
   * Increment unread count for a user
   */
  private async incrementUnreadCount(userId: string): Promise<void> {
    const unreadCountKey = `unread_count:${userId}`;
    await redis.incr(unreadCountKey);
    await redis.expire(unreadCountKey, 7776000); // 90 days TTL
  }

  /**
   * Decrement unread count for a user
   */
  private async decrementUnreadCount(userId: string): Promise<void> {
    const unreadCountKey = `unread_count:${userId}`;
    const currentCount = await redis.get(unreadCountKey);
    if (currentCount && parseInt(currentCount, 10) > 0) {
      await redis.decr(unreadCountKey);
    }
  }

  /**
   * Reset unread count for a user
   */
  private async resetUnreadCount(userId: string): Promise<void> {
    const unreadCountKey = `unread_count:${userId}`;
    await redis.setex(unreadCountKey, 7776000, '0');
  }

  /**
   * Get notification statistics for a user
   */
  async getUserNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    byCategory: Record<string, number>;
    byType: Record<string, number>;
  }> {
    try {
      const notifications = await this.getUserNotifications(userId, 1000);
      const unreadCount = await this.getUnreadCount(userId);
      
      const byCategory: Record<string, number> = {};
      const byType: Record<string, number> = {};
      
      notifications.forEach(notification => {
        // Count by category
        byCategory[notification.category] = (byCategory[notification.category] || 0) + 1;
        
        // Count by type
        byType[notification.type] = (byType[notification.type] || 0) + 1;
      });

      return {
        total: notifications.length,
        unread: unreadCount,
        byCategory,
        byType,
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return {
        total: 0,
        unread: 0,
        byCategory: {},
        byType: {},
      };
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
