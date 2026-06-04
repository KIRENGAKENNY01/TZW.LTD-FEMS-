'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/fems/shared/StatCard';
import { PageCard } from '@/components/fems/shared/PageCard';
import { UserExtinguisherTable } from './UserExtinguisherTable';
import { UserInspectionTable } from './UserInspectionTable';
import { getExtinguishers, Extinguisher } from '@/lib/api/extinguishers';
import { getInspections, Inspection } from '@/lib/api/inspections';

export function UserDashboard() {
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getExtinguishers({ limit: 50 }),
      getInspections({ status: 'PENDING', limit: 20 }),
    ])
      .then(([extRes, insRes]) => {
        setExtinguishers(extRes.data);
        setInspections(insRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const expiredCount = extinguishers.filter((e) => e.status === 'EXPIRED').length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">
          My Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-secondary-500 dark:text-secondary-400">
          Overview of extinguishers and inspections in your area
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Extinguishers in my building"
          value={loading ? '—' : extinguishers.length}
          isLoading={loading}
          icon={<ToolIcon />}
        />
        <StatCard
          label="Upcoming inspections"
          value={loading ? '—' : inspections.length}
          isLoading={loading}
          icon={<CalendarIcon />}
        />
        <StatCard
          label="Expired in my area"
          value={loading ? '—' : expiredCount}
          isLoading={loading}
          trend={
            expiredCount > 0
              ? { value: `${expiredCount} expired`, direction: 'up', positive: false }
              : undefined
          }
          icon={<AlertIcon />}
        />
      </div>

      <PageCard title="Extinguishers in My Area">
        <UserExtinguisherTable extinguishers={extinguishers} isLoading={loading} />
      </PageCard>

      <PageCard title="Scheduled Inspections">
        <UserInspectionTable inspections={inspections} isLoading={loading} />
      </PageCard>
    </div>
  );
}

function ToolIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>;
}
function CalendarIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function AlertIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>;
}

export default UserDashboard;
