'use client';

import { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  Notification,
} from '@/lib/api/notifications';

interface NotificationDropdownProps {
  onCountChange?: (count: number) => void;
}

export function NotificationDropdown({ onCountChange }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications({ limit: 8 });
      const items = res.data ?? [];
      setNotifications(items);
      const count = items.filter((n) => !n.isRead).length;
      setUnreadCount(count);
      onCountChange?.(count);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      onCountChange?.(0);
    } catch {
      // ignore
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        id="notification-bell-btn"
        aria-label="Notifications"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) fetchNotifications();
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-medium text-white leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-80 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
            <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-50">
              Notifications
            </p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-secondary-100 dark:divide-secondary-700">
            {loading ? (
              <div className="px-4 py-6 text-center text-sm text-secondary-400">
                Loading…
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-secondary-400 dark:text-secondary-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && handleMarkRead(n.id)}
                  className={`px-4 py-3 cursor-pointer transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-700/50 ${
                    !n.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.isRead && (
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500" />
                    )}
                    <div className={!n.isRead ? '' : 'pl-4'}>
                      <p className="text-xs font-semibold text-secondary-900 dark:text-secondary-50 leading-snug">
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-xs text-secondary-500 dark:text-secondary-400 line-clamp-2">
                        {n.body}
                      </p>
                      <p className="mt-1 text-[10px] text-secondary-400 dark:text-secondary-500">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
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
}

export default NotificationDropdown;
