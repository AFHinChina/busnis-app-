import { openDB } from 'idb';
import { NotificationEvent, NotificationType, Notification } from '../../types/notifications';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export class NotificationManager {
  private static instance: NotificationManager;
  private db: Promise<IDBDatabase>;
  private subscribers: Set<(notification: Notification) => void>;

  private constructor() {
    this.db = this.initDatabase();
    this.subscribers = new Set();
  }

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private async initDatabase() {
    return openDB('notifications-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('notifications')) {
          const store = db.createObjectStore('notifications', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('read', 'read');
          store.createIndex('type', 'type');
        }
      }
    });
  }

  async addNotification(event: NotificationEvent): Promise<void> {
    const notification: Notification = {
      id: crypto.randomUUID(),
      title: this.getNotificationTitle(event),
      content: this.formatNotificationContent(event),
      type: event.type,
      timestamp: new Date(),
      read: false,
      data: event.data
    };

    const db = await this.db;
    await db.transaction('notifications', 'readwrite')
      .objectStore('notifications')
      .add(notification);

    this.notifySubscribers(notification);
    this.showSystemNotification(notification);
  }

  private getNotificationTitle(event: NotificationEvent): string {
    const titles: Record<NotificationType, string> = {
      'transaction_success': 'تم تنفيذ المعاملة بنجاح',
      'transaction_failed': 'فشل في تنفيذ المعاملة',
      'low_balance': 'تنبيه: رصيد منخفض',
      'shipping_alert': 'تنبيه شحنة',
      'security_alert': 'تنبيه أمني',
      'system_alert': 'تنبيه النظام',
      'sync_complete': 'اكتمال المزامنة',
      'sync_failed': 'فشل المزامنة'
    };

    return titles[event.type] || 'إشعار جديد';
  }

  private formatNotificationContent(event: NotificationEvent): string {
    switch (event.type) {
      case 'shipping_alert':
        const shipment = event.data.shipment;
        return `
          شحنة رقم: ${shipment.number}
          تاريخ الوصول المتوقع: ${shipment.estimatedDelivery}
          القيمة: ${shipment.value}
          الحالة: ${shipment.status}
        `;

      case 'low_balance':
        return `الرصيد الحالي: ${event.data.balance} ${event.data.currency}`;

      case 'transaction_success':
        return `تم تنفيذ معاملة بقيمة ${event.data.amount} ${event.data.currency}`;

      default:
        return event.data?.message || 'تفاصيل غير متوفرة';
    }
  }

  private async showSystemNotification(notification: Notification) {
    if ('Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification(notification.title, {
        body: notification.content,
        icon: '/notification-icon.png'
      });
    }
  }

  subscribe(callback: (notification: Notification) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(notification: Notification) {
    this.subscribers.forEach(callback => callback(notification));
  }

  async getNotifications(options: {
    unreadOnly?: boolean;
    limit?: number;
    type?: NotificationType;
  } = {}): Promise<Notification[]> {
    const db = await this.db;
    const tx = db.transaction('notifications', 'readonly');
    const store = tx.objectStore('notifications');
    
    let notifications = await store.getAll();

    if (options.unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }

    if (options.type) {
      notifications = notifications.filter(n => n.type === options.type);
    }

    notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (options.limit) {
      notifications = notifications.slice(0, options.limit);
    }

    return notifications.map(notification => ({
      ...notification,
      timeAgo: formatDistanceToNow(new Date(notification.timestamp), { 
        addSuffix: true,
        locale: ar 
      })
    }));
  }

  async markAsRead(notificationId: string): Promise<void> {
    const db = await this.db;
    const tx = db.transaction('notifications', 'readwrite');
    const store = tx.objectStore('notifications');
    
    const notification = await store.get(notificationId);
    if (notification) {
      notification.read = true;
      await store.put(notification);
      this.notifySubscribers(notification);
    }
  }

  async markAllAsRead(): Promise<void> {
    const db = await this.db;
    const tx = db.transaction('notifications', 'readwrite');
    const store = tx.objectStore('notifications');
    
    const notifications = await store.getAll();
    for (const notification of notifications) {
      if (!notification.read) {
        notification.read = true;
        await store.put(notification);
        this.notifySubscribers(notification);
      }
    }
  }

  async clearNotifications(): Promise<void> {
    const db = await this.db;
    const tx = db.transaction('notifications', 'readwrite');
    await tx.objectStore('notifications').clear();
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (window.Notification.permission === 'granted') {
      return true;
    }

    const permission = await window.Notification.requestPermission();
    return permission === 'granted';
  }
}