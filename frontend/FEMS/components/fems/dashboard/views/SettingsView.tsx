'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { DashboardPageHeader } from '@/components/fems/shared/DashboardPageHeader';
import { PageCard } from '@/components/fems/shared/PageCard';

export function SettingsView() {
  const { user } = useAuth();

  return (
    <div>
      <DashboardPageHeader title="Settings" description="Account and system preferences" />
      <PageCard title="Account">
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="text-secondary-500">Email</dt>
            <dd className="font-medium text-secondary-900 dark:text-secondary-50">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-secondary-500">Role</dt>
            <dd className="font-medium text-secondary-900 dark:text-secondary-50">{user?.role}</dd>
          </div>
          <div>
            <dt className="text-secondary-500">User ID</dt>
            <dd className="font-mono text-xs text-secondary-700 dark:text-secondary-300">{user?.id}</dd>
          </div>
        </dl>
      </PageCard>
    </div>
  );
}
