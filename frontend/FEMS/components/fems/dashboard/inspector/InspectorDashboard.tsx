'use client';

import { useEffect, useState, useCallback } from 'react';
import { StatCard } from '@/components/fems/shared/StatCard';
import { PageCard } from '@/components/fems/shared/PageCard';
import { MyScheduleTable } from './MyScheduleTable';
import { MyMaintenanceLogsTable } from './MyMaintenanceLogsTable';
import { getInspections, Inspection } from '@/lib/api/inspections';
import { useAuth } from '@/lib/context/AuthContext';
import { isSameMonth } from 'date-fns';

export function InspectorDashboard() {
  const { user } = useAuth();
  const [pending, setPending] = useState<Inspection[]>([]);
  const [completed, setCompleted] = useState<Inspection[]>([]);
  const [overdue, setOverdue] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [pRes, cRes, oRes] = await Promise.all([
        getInspections({ inspectorId: user.id, status: 'PENDING' }),
        getInspections({ inspectorId: user.id, status: 'COMPLETED' }),
        getInspections({ inspectorId: user.id, status: 'OVERDUE' }),
      ]);
      setPending(pRes.data);
      setOverdue(oRes.data);
      // Filter completed to current month
      const thisMonth = cRes.data.filter((i) =>
        i.completedAt ? isSameMonth(new Date(i.completedAt), new Date()) : false,
      );
      setCompleted(thisMonth);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">
          Inspector Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-secondary-500 dark:text-secondary-400">
          Your assigned inspections and maintenance activities
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="My pending inspections"
          value={loading ? '—' : pending.length}
          isLoading={loading}
          icon={<ClockIcon />}
        />
        <StatCard
          label="Completed this month"
          value={loading ? '—' : completed.length}
          isLoading={loading}
          icon={<CheckIcon />}
        />
        <StatCard
          label="Overdue"
          value={loading ? '—' : overdue.length}
          isLoading={loading}
          trend={
            overdue.length > 0
              ? { value: `${overdue.length} overdue`, direction: 'up', positive: false }
              : undefined
          }
          icon={<AlertIcon />}
        />
      </div>

      {/* Schedule table */}
      <PageCard title="My Inspection Schedule">
        <MyScheduleTable onUpdate={fetchStats} />
      </PageCard>

      {/* Maintenance logs */}
      <PageCard title="Recent Maintenance Logs">
        <MyMaintenanceLogsTable />
      </PageCard>
    </div>
  );
}

function ClockIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function CheckIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
}
function AlertIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>;
}

export default InspectorDashboard;
