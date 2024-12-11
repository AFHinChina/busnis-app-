import { ShippingDocument } from '../../types/shipping';
import { addDays, isBefore } from 'date-fns';
import { ar } from 'date-fns/locale';
import { formatCurrency } from '../../constants/currencies';

interface StoredNotification {
  id: string;
  title: string;
  content: string;
  type: string;
  timestamp: Date;
  read: boolean;
}

export class NotificationService {
  static async checkShippingNotifications(document: ShippingDocument) {
    if (!document.estimatedDelivery) return;

    const notificationDate = addDays(new Date(document.estimatedDelivery), -14);
    const today = new Date();

    if (isBefore(today, notificationDate)) {
      await this.sendShippingNotification(document);
    }
  }

  private static async sendShippingNotification(document: ShippingDocument) {
    const notification: StoredNotification = {
      id: crypto.randomUUID(),
      title: `تنبيه بوليصة الشحن رقم ${document.shipmentNumber}`,
      content: this.formatNotificationContent(document),
      type: 'shipping_alert',
      timestamp: new Date(),
      read: false
    };

    // Store notification in IndexedDB
    await this.storeNotification(notification);
    
    // Update UI with new notification
    this.dispatchNotificationEvent(notification);
  }

  private static formatNotificationContent(document: ShippingDocument): string {
    const totalValue = document.items.reduce((sum, item) => sum + (item.value || 0), 0);
    
    return `
      معلومات الشحنة:
      - رقم البوليصة: ${document.shipmentNumber}
      - إجمالي قيمة البضاعة: ${formatCurrency(totalValue, 'SAR')}
      - تاريخ الوصول المتوقع: ${document.estimatedDelivery}
      
      البضائع المشحونة:
      ${document.items.map(item => `- ${item.description} (${item.quantity} قطعة)`).join('\n')}
      
      معلومات إضافية:
      - من: ${document.origin}
      - إلى: ${document.destination}
      - شركة الشحن: ${document.carrier}
    `;
  }

  private static async storeNotification(notification: StoredNotification) {
    const db = await this.openNotificationsDB();
    const tx = db.transaction('notifications', 'readwrite');
    await tx.store.add(notification);
    await tx.done;
  }

  private static dispatchNotificationEvent(notification: StoredNotification) {
    const event = new CustomEvent('newNotification', { detail: notification });
    window.dispatchEvent(event);
  }

  private static async openNotificationsDB() {
    const db = await indexedDB.open('notifications-db', 1);
    
    db.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('notifications')) {
        db.createObjectStore('notifications', { keyPath: 'id' });
      }
    };

    return db;
  }

  static async markAsRead(notificationId: string) {
    const db = await this.openNotificationsDB();
    const tx = db.transaction('notifications', 'readwrite');
    const store = tx.objectStore('notifications');
    
    const notification = await store.get(notificationId);
    if (notification) {
      notification.read = true;
      await store.put(notification);
    }
    
    await tx.done;
  }

  static async getNotifications(): Promise<StoredNotification[]> {
    const db = await this.openNotificationsDB();
    const tx = db.transaction('notifications', 'readonly');
    const store = tx.objectStore('notifications');
    
    return store.getAll();
  }
}