'use client';

import { useEffect, useState } from 'react';
import { getInspections, Inspection } from '@/lib/api/inspections';
import { DataTable, Column } from '@/components/fems/shared/DataTable';
import { StatusBadge } from '@/components/fems/shared/StatusBadge';

export function RecentInspectionsTable() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInspections({ limit: 5 })
      .then((res) => setInspections(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<Inspection>[] = [
    {
      key: 'serial',
      header: 'Serial',
      render: (row) => (
        <span className="font-mono text-xs text-secondary-700 dark:text-secondary-300">
          {row.extinguisher?.serialNumber ?? '—'}
        </span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (row) => (
        <span className="text-secondary-700 dark:text-secondary-300">
          {row.extinguisher?.location ?? '—'}
        </span>
      ),
    },
    {
      key: 'inspector',
      header: 'Inspector',
      render: (row) =>
        row.inspector
          ? `${row.inspector.firstName} ${row.inspector.lastName}`
          : '—',
    },
    {
      key: 'scheduledDate',
      header: 'Scheduled date',
      render: (row) =>
        new Date(row.scheduledDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-700 dark:hover:text-secondary-300 transition-colors"
          aria-label="More options"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={inspections}
      isLoading={loading}
      emptyMessage="No recent inspections found."
      keyExtractor={(row) => row.id}
    />
  );
}

export default RecentInspectionsTable;
