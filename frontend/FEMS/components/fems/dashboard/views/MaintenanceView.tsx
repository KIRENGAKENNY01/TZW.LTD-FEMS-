'use client';

import { useCallback, useEffect, useState } from 'react';
import { DashboardPageHeader } from '@/components/fems/shared/DashboardPageHeader';
import { PageCard } from '@/components/fems/shared/PageCard';
import { DataTable, Column } from '@/components/fems/shared/DataTable';
import { Pagination } from '@/components/fems/shared/Pagination';
import { getMaintenanceLogs, type MaintenanceLog } from '@/lib/api/inspections';
import type { PaginationMeta } from '@/lib/api/client';

export function MaintenanceView() {
  const [items, setItems] = useState<MaintenanceLog[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | undefined>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMaintenanceLogs({ page, limit: 15 });
      setItems(res.data);
      setPagination(res.pagination);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const columns: Column<MaintenanceLog>[] = [
    {
      key: 'maintenanceDate',
      header: 'Date',
      render: (r) => new Date(r.maintenanceDate).toLocaleDateString(),
    },
    { key: 'actionTaken', header: 'Action taken' },
    { key: 'issuesIdentified', header: 'Issues', render: (r) => r.issuesIdentified ?? '—' },
    { key: 'recommendations', header: 'Recommendations', render: (r) => r.recommendations ?? '—' },
  ];

  return (
    <div>
      <DashboardPageHeader
        title="Maintenance logs"
        description="Recorded maintenance activities after completed inspections"
      />
      <PageCard title="Maintenance history">
        <DataTable columns={columns} data={items} isLoading={loading} keyExtractor={(r) => r.id} />
        <Pagination pagination={pagination} onPageChange={setPage} />
      </PageCard>
    </div>
  );
}
