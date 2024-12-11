export type NotificationType = 
  | 'transaction_success'
  | 'transaction_failed'
  | 'low_balance'
  | 'shipping_alert'
  | 'security_alert'
  | 'system_alert'
  | 'sync_complete'
  | 'sync_failed';

export interface NotificationEvent {
  type: NotificationType;
  data: any;
}

export interface INotification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  data?: any;
  timeAgo?: string;
}

// Re-export the Notification type to avoid conflicts with the browser's Notification API
export type { INotification as Notification };