'use client';

import { useCallback, useEffect, useState } from 'react';
import { DashboardPageHeader } from '@/components/fems/shared/DashboardPageHeader';
import { PageCard } from '@/components/fems/shared/PageCard';
import { DataTable, Column } from '@/components/fems/shared/DataTable';
import { Pagination } from '@/components/fems/shared/Pagination';
import { getUsers, updateUserRole, deactivateUser, type UserProfile } from '@/lib/api/users';
import type { PaginationMeta } from '@/lib/api/client';

export function UsersView() {
  const [items, setItems] = useState<UserProfile[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | undefined>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers({ page, limit: 15 });
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

  const columns: Column<UserProfile>[] = [
    { key: 'firstName', header: 'First name' },
    { key: 'lastName', header: 'Last name' },
    { key: 'userId', header: 'User ID', render: (r) => r.userId.slice(0, 8) + '…' },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <select
          className="rounded border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-xs px-2 py-1"
          defaultValue="USER"
          onChange={async (e) => {
            await updateUserRole(
              row.userId,
              e.target.value as 'ADMIN' | 'INSPECTOR' | 'USER',
            );
            load();
          }}
        >
          {['ADMIN', 'INSPECTOR', 'USER'].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          type="button"
          onClick={async () => {
            if (confirm('Deactivate this user?')) {
              await deactivateUser(row.userId);
              load();
            }
          }}
          className="text-xs text-primary-500"
        >
          Deactivate
        </button>
      ),
    },
  ];

  return (
    <div>
      <DashboardPageHeader
        title="Users"
        description="Manage accounts and assign roles (Admin, Inspector, User)"
      />
      <PageCard title="User profiles">
        <DataTable columns={columns} data={items} isLoading={loading} keyExtractor={(r) => r.id} />
        <Pagination pagination={pagination} onPageChange={setPage} />
      </PageCard>
    </div>
  );
}
