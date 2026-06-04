'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/fems/shared/StatCard';
import { PageCard } from '@/components/fems/shared/PageCard';
import { InspectionChart } from './InspectionChart';
import { ExtinguisherStatusChart } from './ExtinguisherStatusChart';
import { RecentInspectionsTable } from './RecentInspectionsTable';
import { ComplianceAlertsPanel } from './ComplianceAlertsPanel';
import { getInventoryReport, InventoryReport, getInspectionReport, InspectionReport } from '@/lib/api/reports';

export function AdminDashboard() {
  const [inventory, setInventory] = useState<InventoryReport | null>(null);
  const [inspectionReport, setInspectionReport] = useState<InspectionReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getInventoryReport(), getInspectionReport()])
      .then(([inv, ins]) => {
        setInventory(inv);
        setInspectionReport(ins);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">
          Admin Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-secondary-500 dark:text-secondary-400">
          Overview of all fire extinguisher operations
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total extinguishers"
          value={loading ? '—' : inventory?.total ?? 0}
          icon={<ToolIcon />}
          isLoading={loading}
        />
        <StatCard
          label="Active extinguishers"
          value={loading ? '—' : inventory?.byStatus?.ACTIVE ?? 0}
          icon={<CheckIcon />}
          isLoading={loading}
        />
        <StatCard
          label="Pending inspections"
          value={loading ? '—' : inspectionReport?.pending ?? 0}
          icon={<ClockIcon />}
          isLoading={loading}
        />
        <StatCard
          label="Overdue inspections"
          value={loading ? '—' : inspectionReport?.overdue ?? 0}
          trend={
            inspectionReport
              ? {
                  value: `${inspectionReport.overdue} overdue`,
                  direction: 'up',
                  positive: false,
                }
              : undefined
          }
          icon={<AlertIcon />}
          isLoading={loading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <PageCard title="Inspection Overview">
            <InspectionChart />
          </PageCard>
        </div>
        <div className="lg:col-span-2">
          <PageCard title="Extinguisher Status">
            <ExtinguisherStatusChart inventory={inventory} isLoading={loading} />
          </PageCard>
        </div>
      </div>

      {/* Tables */}
      <PageCard
        title="Recent Inspections"
        action={
          <a
            href="/dashboard/inspections"
            className="text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            See all inspections →
          </a>
        }
      >
        <RecentInspectionsTable />
      </PageCard>

      <PageCard
        title="Compliance Alerts"
        action={
          <a
            href="/dashboard/extinguishers"
            className="text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            View all →
          </a>
        }
      >
        <ComplianceAlertsPanel />
      </PageCard>
    </div>
  );
}

function ToolIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>;
}
function CheckIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
}
function ClockIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function AlertIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>;
}

export default AdminDashboard;
