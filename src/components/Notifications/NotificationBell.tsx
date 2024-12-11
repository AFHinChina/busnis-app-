import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationManager } from '../../services/notifications/NotificationManager';

export const NotificationBell: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications({ limit: 10 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    NotificationManager.getInstance().requestNotificationPermission();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'shipping_alert':
        return '🚚';
      case 'security_alert':
        return '🔒';
      case 'transaction_success':
        return '✅';
      case 'transaction_failed':
        return '❌';
      default:
        return '📢';
    }
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
        aria-label="الإشعارات"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="fixed left-4 top-16 w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200"
          style={{ maxHeight: 'calc(100vh - 5rem)' }}
        >
          <div className="sticky top-0 bg-white p-4 border-b border-gray-100 shadow-sm z-10">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">الإشعارات</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-1 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                    title="تحديد الكل كمقروء"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={clearNotifications}
                  className="p-1 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                  title="حذف الكل"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 10rem)' }}>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                لا توجد إشعارات
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
                        {notification.content}
                      </p>
                      <span className="mt-2 text-xs text-gray-500 block">
                        {notification.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};