'use client';

import { useCallback, useEffect, useState } from 'react';
import { DashboardPageHeader } from '@/components/fems/shared/DashboardPageHeader';
import { PageCard } from '@/components/fems/shared/PageCard';
import { DataTable, Column } from '@/components/fems/shared/DataTable';
import { Pagination } from '@/components/fems/shared/Pagination';
import { StatusBadge } from '@/components/fems/shared/StatusBadge';
import { getExpiringSoon, getExpired, type Extinguisher } from '@/lib/api/extinguishers';
import type { PaginationMeta } from '@/lib/api/client';

export function AlertsView() {
  const [expiring, setExpiring] = useState<Extinguisher[]>([]);
  const [expired, setExpired] = useState<Extinguisher[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | undefined>();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<'expiring' | 'expired'>('expiring');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'expiring') {
        const res = await getExpiringSoon({ page, limit: 15 });
        setExpiring(res.data);
        setPagination(res.pagination);
      } else {
        const res = await getExpired({ page, limit: 15 });
        setExpired(res.data);
        setPagination(res.pagination);
      }
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => {
    load();
  }, [load]);

  const columns: Column<Extinguisher>[] = [
    { key: 'serialNumber', header: 'Serial' },
    { key: 'location', header: 'Location' },
    { key: 'building', header: 'Building', render: (r) => r.building ?? '—' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'expiryDate',
      header: 'Expiry',
      render: (r) => new Date(r.expiryDate).toLocaleDateString(),
    },
  ];

  const data = tab === 'expiring' ? expiring : expired;

  return (
    <div>
      <DashboardPageHeader
        title="Compliance alerts"
        description="Extinguishers expiring soon or already expired"
      />
      <div className="flex gap-2 mb-4">
        {(['expiring', 'expired'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setPage(1);
              setTab(t);
            }}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              tab === t
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-600'
            }`}
          >
            {t === 'expiring' ? 'Expiring soon' : 'Expired'}
          </button>
        ))}
      </div>
      <PageCard title={tab === 'expiring' ? 'Expiring within 30 days' : 'Expired extinguishers'}>
        <DataTable columns={columns} data={data} isLoading={loading} keyExtractor={(r) => r.id} />
        <Pagination pagination={pagination} onPageChange={setPage} />
      </PageCard>
    </div>
  );
}
