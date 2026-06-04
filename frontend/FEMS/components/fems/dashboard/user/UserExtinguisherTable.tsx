'use client';

import { Extinguisher } from '@/lib/api/extinguishers';
import { DataTable, Column } from '@/components/fems/shared/DataTable';
import { StatusBadge } from '@/components/fems/shared/StatusBadge';

interface UserExtinguisherTableProps {
  extinguishers: Extinguisher[];
  isLoading: boolean;
}

export function UserExtinguisherTable({ extinguishers, isLoading }: UserExtinguisherTableProps) {
  const columns: Column<Extinguisher>[] = [
    {
      key: 'serialNumber',
      header: 'Serial',
      render: (row) => (
        <span className="font-mono text-xs text-secondary-700 dark:text-secondary-300">
          {row.serialNumber}
        </span>
      ),
    },
    { key: 'location', header: 'Location' },
    { key: 'type', header: 'Type' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'expiryDate',
      header: 'Expiry date',
      render: (row) =>
        new Date(row.expiryDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      key: 'lastInspectionDate',
      header: 'Last inspection',
      render: (row) =>
        row.lastInspectionDate
          ? new Date(row.lastInspectionDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '—',
    },
  ];

  // Wrap in custom render to highlight expired rows
  const dataWithHighlight = extinguishers.map((ext) => ({
    ...ext,
    _rowClass: ext.status === 'EXPIRED' ? 'bg-primary-50 dark:bg-primary-900/30' : '',
  }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-secondary-50 dark:bg-secondary-800">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-secondary-500 dark:text-secondary-400 whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-secondary-200 dark:border-secondary-700">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-secondary-200 dark:bg-secondary-700" />
                    </td>
                  ))}
                </tr>
              ))
            : extinguishers.length === 0
            ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-secondary-400 dark:text-secondary-500">
                  No extinguishers found in your area.
                </td>
              </tr>
            )
            : dataWithHighlight.map((row) => (
                <tr
                  key={row.id}
                  className={`border-t border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors ${row._rowClass}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-secondary-700 dark:text-secondary-300 whitespace-nowrap">
                      {col.render ? col.render(row as unknown as Extinguisher) : String(row[col.key as keyof Extinguisher] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserExtinguisherTable;
