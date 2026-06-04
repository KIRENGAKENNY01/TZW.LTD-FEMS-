'use client';

import { useEffect, useState } from 'react';
import { getExpiringSoon, Extinguisher } from '@/lib/api/extinguishers';
import { differenceInDays } from 'date-fns';

export function ComplianceAlertsPanel() {
  const [items, setItems] = useState<Extinguisher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExpiringSoon({ limit: 5 })
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-secondary-100 dark:bg-secondary-700" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-secondary-400 dark:text-secondary-500">
        No extinguishers expiring soon — all compliant! ✓
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-secondary-100 dark:divide-secondary-700">
      {items.map((ext) => {
        const daysLeft = differenceInDays(new Date(ext.expiryDate), new Date());
        const chipClass =
          daysLeft <= 7
            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800'
            : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';

        return (
          <div
            key={ext.id}
            className="flex items-center justify-between py-3 gap-3"
          >
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-xs font-medium text-secondary-900 dark:text-secondary-50 truncate">
                {ext.serialNumber}
              </span>
              <span className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                {ext.location}
              </span>
            </div>
            <div className="flex flex-shrink-0 flex-col items-end gap-1">
              <span className="text-xs text-secondary-400 dark:text-secondary-500">
                {new Date(ext.expiryDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${chipClass}`}>
                {daysLeft <= 0 ? 'Expired' : `${daysLeft}d left`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ComplianceAlertsPanel;
