import { notificationService, NotificationCreateInput } from './notification-service';

/**
 * Utility class for creating notifications easily from anywhere in the application
 */
export class NotificationUtils {
  /**
   * Create a success notification
   */
  static async success(
    userId: string,
    title: string,
    message: string,
    category: NotificationCreateInput['category'] = 'systemUpdates',
    metadata?: Record<string, any>
  ) {
    return this.createNotification({
      userId,
      title,
      message,
      type: 'success',
      category,
      metadata,
    });
  }

  /**
   * Create an error notification
   */
  static async error(
    userId: string,
    title: string,
    message: string,
    category: NotificationCreateInput['category'] = 'systemUpdates',
    metadata?: Record<string, any>
  ) {
    return this.createNotification({
      userId,
      title,
      message,
      type: 'error',
      category,
      metadata,
    });
  }

  /**
   * Create a warning notification
   */
  static async warning(
    userId: string,
    title: string,
    message: string,
    category: NotificationCreateInput['category'] = 'systemUpdates',
    metadata?: Record<string, any>
  ) {
    return this.createNotification({
      userId,
      title,
      message,
      type: 'warning',
      category,
      metadata,
    });
  }

  /**
   * Create an info notification
   */
  static async info(
    userId: string,
    title: string,
    message: string,
    category: NotificationCreateInput['category'] = 'systemUpdates',
    metadata?: Record<string, any>
  ) {
    return this.createNotification({
      userId,
      title,
      message,
      type: 'info',
      category,
      metadata,
    });
  }

  /**
   * Create a campaign notification
   */
  static async campaign(
    userId: string,
    title: string,
    message: string,
    type: NotificationCreateInput['type'] = 'info',
    metadata?: Record<string, any>
  ) {
    return this.createNotification({
      userId,
      title,
      message,
      type,
      category: 'campaigns',
      metadata,
    });
  }

  /**
   * Create a chat notification
   */
  static async chat(
    userId: string,
    title: string,
    message: string,
    type: NotificationCreateInput['type'] = 'info',
    metadata?: Record<string, any>
  ) {
    return this.createNotification({
      userId,
      title,
      message,
      type,
      category: 'chats',
      metadata,
    });
  }

  /**
   * Create a plan expiry notification
   */
  static async planExpiry(
    userId: string,
    title: string,
    message: string,
    type: NotificationCreateInput['type'] = 'warning',
    metadata?: Record<string, any>
  ) {
    return this.createNotification({
      userId,
      title,
      message,
      type,
      category: 'planExpiry',
      metadata,
    });
  }

  /**
   * Create a system update notification
   */
  static async systemUpdate(
    userId: string,
    title: string,
    message: string,
    type: NotificationCreateInput['type'] = 'info',
    metadata?: Record<string, any>
  ) {
    return this.createNotification({
      userId,
      title,
      message,
      type,
      category: 'systemUpdates',
      metadata,
    });
  }

  /**
   * Internal method to create notification via API
   */
  private static async createNotification(input: NotificationCreateInput) {
    try {
      // Use the notification service directly instead of making an HTTP request
      const notification = await notificationService.createNotification(input);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }
}

/**
 * Convenience functions for common notification scenarios
 */
export const notify = {
  // Campaign notifications
  campaignSuccess: (userId: string, title: string, message: string, metadata?: Record<string, any>) =>
    NotificationUtils.campaign(userId, title, message, 'success', metadata),
  
  campaignError: (userId: string, title: string, message: string, metadata?: Record<string, any>) =>
    NotificationUtils.campaign(userId, title, message, 'error', metadata),
  
  campaignWarning: (userId: string, title: string, message: string, metadata?: Record<string, any>) =>
    NotificationUtils.campaign(userId, title, message, 'warning', metadata),

  // Chat notifications
  chatReceived: (userId: string, from: string, message: string) =>
    NotificationUtils.chat(userId, 'New Chat Message', `Message received from ${from}: ${message}`, 'info', { from }),
  
  chatSent: (userId: string, to: string, message: string) =>
    NotificationUtils.chat(userId, 'Chat Message Sent', `Message sent to ${to}: ${message}`, 'success', { to }),

  // Plan expiry notifications
  planExpiryWarning: (userId: string, planName: string, daysLeft: number) =>
    NotificationUtils.planExpiry(userId, 'Plan Expiry Warning', `Your ${planName} plan expires in ${daysLeft} days`, 'warning', { planName, daysLeft }),
  
  planExpired: (userId: string, planName: string) =>
    NotificationUtils.planExpiry(userId, 'Plan Expired', `Your ${planName} plan has expired. Please renew to continue using premium features.`, 'error', { planName }),
  
  planRenewed: (userId: string, planName: string, newExpiryDate: string) =>
    NotificationUtils.planExpiry(userId, 'Plan Renewed', `Your ${planName} plan has been renewed until ${newExpiryDate}`, 'success', { planName, newExpiryDate }),

  // System update notifications
  systemMaintenance: (userId: string, message: string, scheduledTime?: string) =>
    NotificationUtils.systemUpdate(userId, 'System Maintenance', message, 'info', { scheduledTime }),
  
  systemError: (userId: string, message: string, errorCode?: string) =>
    NotificationUtils.systemUpdate(userId, 'System Error', message, 'error', { errorCode }),
  
  systemUpdate: (userId: string, message: string, version?: string) =>
    NotificationUtils.systemUpdate(userId, 'System Update', message, 'info', { version }),

  // WhatsApp notifications
  whatsappConnected: (userId: string, phoneNumbers: string[]) =>
    NotificationUtils.systemUpdate(userId, 'WhatsApp Connected', `WhatsApp Business account connected successfully with ${phoneNumbers.join(', ')}`, 'success', { phoneNumbers }),
  
  whatsappDisconnected: (userId: string) =>
    NotificationUtils.systemUpdate(userId, 'WhatsApp Disconnected', `WhatsApp Business account disconnected from AvenPing`, 'warning', {}),

  // Contact notifications
  contactsImported: (userId: string, count: number, filename: string) =>
    NotificationUtils.systemUpdate(userId, 'Contacts Imported', `Successfully imported ${count} contacts from ${filename}`, 'success', { count, filename }),
  
  contactsExportFailed: (userId: string, reason: string) =>
    NotificationUtils.systemUpdate(userId, 'Export Failed', `Failed to export contacts: ${reason}`, 'error', { reason }),

  // Template notifications
  templateApproved: (userId: string, templateName: string) =>
    NotificationUtils.campaign(userId, 'Template Approved', `Template "${templateName}" has been approved by WhatsApp`, 'success', { templateName }),
  
  templateRejected: (userId: string, templateName: string, reason: string) =>
    NotificationUtils.campaign(userId, 'Template Rejected', `Template "${templateName}" was rejected: ${reason}`, 'error', { templateName, reason }),
};

export default NotificationUtils;
