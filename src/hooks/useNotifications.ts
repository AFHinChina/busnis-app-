import { useState, useEffect } from 'react';
import { NotificationManager } from '../services/notifications/NotificationManager';
import { Notification, NotificationType } from '../types/notifications';

export const useNotifications = (options: {
  unreadOnly?: boolean;
  limit?: number;
  type?: NotificationType;
} = {}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationManager = NotificationManager.getInstance();

  useEffect(() => {
    const loadNotifications = async () => {
      const fetchedNotifications = await notificationManager.getNotifications(options);
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter(n => !n.read).length);
    };

    loadNotifications();

    const unsubscribe = notificationManager.subscribe((notification) => {
      setNotifications(prev => [notification, ...prev]);
      if (!notification.read) {
        setUnreadCount(count => count + 1);
      }
    });

    return () => unsubscribe();
  }, [options.unreadOnly, options.limit, options.type]);

  const markAsRead = async (notificationId: string) => {
    await notificationManager.markAsRead(notificationId);
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(count => Math.max(0, count - 1));
  };

  const markAllAsRead = async () => {
    await notificationManager.markAllAsRead();
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = async () => {
    await notificationManager.clearNotifications();
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
};