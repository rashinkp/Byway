import { CreateNotificationsForUsersUseCase } from '../../usecases/notification/implementations/create-notifications-for-users.usecase';
import { NotificationEventType } from '../../../domain/enum/notification-event-type.enum';
import { NotificationEntityType } from '../../../domain/enum/notification-entity-type.enum';

interface PendingNotification {
  userId: string;
  senderId: string;
  senderName: string;
  chatId: string;
  messageCount: number;
  lastMessage: string;
  lastMessageTime: Date;
  notificationId?: string;
}

export class NotificationBatchingService {
  private pendingNotifications: Map<string, PendingNotification> = new Map();
  private readonly BATCH_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_MESSAGE_LENGTH = 50;

  constructor(
    private readonly createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
  ) {}

  async addMessageToBatch(
    receiverId: string,
    senderId: string,
    senderName: string,
    chatId: string,
    messageContent: string
  ): Promise<void> {
    const key = `${receiverId}-${senderId}-${chatId}`;
    const now = new Date();

    // Check if we have a pending notification for this sender-receiver pair
    const existing = this.pendingNotifications.get(key);

    if (existing) {
      // Update existing notification
      existing.messageCount++;
      existing.lastMessage = messageContent;
      existing.lastMessageTime = now;

      // If the batch window has expired, send the notification
      if (now.getTime() - existing.lastMessageTime.getTime() > this.BATCH_WINDOW_MS) {
        await this.sendBatchedNotification(existing);
        this.pendingNotifications.delete(key);
      }
    } else {
      // Create new pending notification
      const pendingNotification: PendingNotification = {
        userId: receiverId,
        senderId,
        senderName,
        chatId,
        messageCount: 1,
        lastMessage: messageContent,
        lastMessageTime: now
      };

      this.pendingNotifications.set(key, pendingNotification);

      // Schedule the notification to be sent after the batch window
      setTimeout(async () => {
        const notification = this.pendingNotifications.get(key);
        if (notification) {
          await this.sendBatchedNotification(notification);
          this.pendingNotifications.delete(key);
        }
      }, this.BATCH_WINDOW_MS);
    }
  }

  private async sendBatchedNotification(notification: PendingNotification): Promise<void> {
    try {
      const message = notification.messageCount === 1
        ? `You have received a new message from ${notification.senderName}: ${this.truncateMessage(notification.lastMessage)}`
        : `You have received ${notification.messageCount} new messages from ${notification.senderName}`;

      await this.createNotificationsForUsersUseCase.execute(
        [notification.userId],
        {
          eventType: NotificationEventType.NEW_MESSAGE,
          entityType: NotificationEntityType.CHAT,
          entityId: notification.chatId,
          entityName: 'Chat',
          message,
          link: `/chat/${notification.chatId}`
        }
      );
    } catch (error) {
      console.error('Failed to send batched notification:', error);
    }
  }

  private truncateMessage(message: string): string {
    if (message.length <= this.MAX_MESSAGE_LENGTH) {
      return message;
    }
    return message.substring(0, this.MAX_MESSAGE_LENGTH) + '...';
  }

  // Method to force send all pending notifications (useful for cleanup)
  async flushAllPendingNotifications(): Promise<void> {
    const notifications = Array.from(this.pendingNotifications.values());
    
    for (const notification of notifications) {
      await this.sendBatchedNotification(notification);
    }
    
    this.pendingNotifications.clear();
  }

  // Method to clear notifications for a specific user (when they start chatting)
  clearNotificationsForUser(userId: string, chatId: string): void {
    const keysToDelete: string[] = [];
    
    for (const [key, notification] of this.pendingNotifications.entries()) {
      if (notification.userId === userId && notification.chatId === chatId) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.pendingNotifications.delete(key));
  }

  // Method to check if user has pending notifications for a specific chat
  hasPendingNotifications(userId: string, chatId: string): boolean {
    for (const [, notification] of this.pendingNotifications.entries()) {
      if (notification.userId === userId && notification.chatId === chatId) {
        return true;
      }
    }
    return false;
  }

  // Method to get pending notification count for a user
  getPendingNotificationCount(userId: string): number {
    let count = 0;
    for (const [, notification] of this.pendingNotifications.entries()) {
      if (notification.userId === userId) {
        count += notification.messageCount;
      }
    }
    return count;
  }
} 