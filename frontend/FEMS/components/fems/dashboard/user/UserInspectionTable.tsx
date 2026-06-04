'use client';

import { Inspection } from '@/lib/api/inspections';
import { DataTable, Column } from '@/components/fems/shared/DataTable';
import { StatusBadge } from '@/components/fems/shared/StatusBadge';

interface UserInspectionTableProps {
  inspections: Inspection[];
  isLoading: boolean;
}

export function UserInspectionTable({ inspections, isLoading }: UserInspectionTableProps) {
  const columns: Column<Inspection>[] = [
    {
      key: 'serial',
      header: 'Extinguisher serial',
      render: (row) => (
        <span className="font-mono text-xs">
          {row.extinguisher?.serialNumber ?? '—'}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) =>
        new Date(row.scheduledDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      key: 'time',
      header: 'Time',
      render: (row) =>
        new Date(row.scheduledDate).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
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
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={inspections}
      isLoading={isLoading}
      emptyMessage="No scheduled inspections for your area."
      keyExtractor={(row) => row.id}
    />
  );
}

export default UserInspectionTable;
