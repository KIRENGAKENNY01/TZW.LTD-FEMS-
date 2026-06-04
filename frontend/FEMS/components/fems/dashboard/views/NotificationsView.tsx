'use client';

import { useCallback, useEffect, useState } from 'react';
import { DashboardPageHeader } from '@/components/fems/shared/DashboardPageHeader';
import { PageCard } from '@/components/fems/shared/PageCard';
import { Pagination } from '@/components/fems/shared/Pagination';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type Notification,
} from '@/lib/api/notifications';
import type { PaginationMeta } from '@/lib/api/client';

export function NotificationsView() {
  const [items, setItems] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | undefined>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications({ page, limit: 20 });
      setItems(res.data);
      setPagination(res.pagination);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <DashboardPageHeader
        title="Notifications"
        description="Inspection schedules, maintenance updates, and compliance alerts"
        actions={
          <button
            type="button"
            onClick={async () => {
              await markAllNotificationsRead();
              load();
            }}
            className="rounded-md border border-secondary-200 dark:border-secondary-700 px-4 py-2 text-sm font-medium hover:bg-secondary-50 dark:hover:bg-secondary-800"
          >
            Mark all read
          </button>
        }
      />
      <PageCard title="Inbox">
        {loading ? (
          <p className="text-sm text-secondary-500">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-secondary-500">No notifications.</p>
        ) : (
          <ul className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {items.map((n) => (
              <li
                key={n.id}
                className={`py-4 flex justify-between gap-4 ${!n.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10 -mx-6 px-6' : ''}`}
              >
                <div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-50">
                    {n.title}
                  </p>
                  <p className="text-sm text-secondary-500 mt-0.5">{n.body}</p>
                  <p className="text-xs text-secondary-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.isRead && (
                  <button
                    type="button"
                    onClick={async () => {
                      await markNotificationRead(n.id);
                      load();
                    }}
                    className="text-xs text-primary-500 shrink-0"
                  >
                    Mark read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </PageCard>
    </div>
  );
}
