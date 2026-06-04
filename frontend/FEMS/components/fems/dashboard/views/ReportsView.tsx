'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardPageHeader } from '@/components/fems/shared/DashboardPageHeader';
import { PageCard } from '@/components/fems/shared/PageCard';
import { StatCard } from '@/components/fems/shared/StatCard';
import { DataTable, Column } from '@/components/fems/shared/DataTable';
import {
  getInventoryReport,
  getInspectionReport,
  getComplianceReport,
  getMaintenanceReport,
  exportReport,
  getExportJobStatus,
  getExportDownloadUrl,
} from '@/lib/api/reports';

export function ReportsView() {
  const { user } = useAuth();
  const isUser = user?.role === 'USER';
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<Awaited<ReturnType<typeof getInventoryReport>> | null>(null);
  const [inventoryDaily, setInventoryDaily] = useState<Awaited<ReturnType<typeof getInventoryReport>> | null>(null);
  const [inventoryMonthly, setInventoryMonthly] = useState<Awaited<ReturnType<typeof getInventoryReport>> | null>(null);
  const [inventoryYearly, setInventoryYearly] = useState<Awaited<ReturnType<typeof getInventoryReport>> | null>(null);
  const [inspections, setInspections] = useState<Awaited<ReturnType<typeof getInspectionReport>> | null>(null);
  const [compliance, setCompliance] = useState<Awaited<ReturnType<typeof getComplianceReport>> | null>(null);
  const [maintenance, setMaintenance] = useState<Awaited<ReturnType<typeof getMaintenanceReport>> | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    const tasks: Promise<void>[] = [getComplianceReport().then(setCompliance).catch(() => {})];
    if (!isUser) {
      tasks.push(
        getInventoryReport().then(setInventory).catch(() => {}),
        getInventoryReport({ period: 'DAILY' }).then(setInventoryDaily).catch(() => {}),
        getInventoryReport({ period: 'MONTHLY' }).then(setInventoryMonthly).catch(() => {}),
        getInventoryReport({ period: 'YEARLY' }).then(setInventoryYearly).catch(() => {}),
        getInspectionReport().then(setInspections).catch(() => {}),
        getMaintenanceReport().then(setMaintenance).catch(() => {}),
      );
    }
    Promise.all(tasks).finally(() => {
      setLoading(false);
    });
  }, [isUser]);

  const handleExport = async (
    type: 'inventory' | 'inspection' | 'compliance' | 'maintenance',
    format: 'PDF' | 'CSV',
  ) => {
    setExporting(`${type}-${format}`);
    try {
      const job = await exportReport(type, format, isUser);
      let status = job.status;
      if (status === 'DONE' && job.downloadUrl) {
        window.open(getExportDownloadUrl(`${job.id}.${format.toLowerCase()}`), '_blank');
        return;
      }

      let attempts = 0;
      while (status !== 'DONE' && attempts < 20) {
        await new Promise((r) => setTimeout(r, 500));
        const updated = await getExportJobStatus(job.id);
        status = updated.status;
        if (status === 'DONE' && updated.downloadUrl) {
          window.open(getExportDownloadUrl(`${job.id}.${format.toLowerCase()}`), '_blank');
          break;
        }
        attempts++;
      }
    } catch (e) {
      console.error(e);
      alert('Export failed');
    } finally {
      setExporting(null);
    }
  };

  const maintenanceColumns: Column<NonNullable<typeof maintenance>['recentActivities'][number]>[] = [
    {
      key: 'maintenanceDate',
      header: 'Date',
      render: (r) => new Date(r.maintenanceDate).toLocaleDateString(),
    },
    {
      key: 'extinguisherSerial',
      header: 'Extinguisher Serial',
      render: (r) => r.extinguisherSerial || 'Unknown',
    },
    {
      key: 'actionTaken',
      header: 'Action Taken',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Reports & analytics"
        description={
          isUser
            ? 'Compliance summary and personal exports for your assigned extinguishers'
            : 'System-wide performance and compliance reports'
        }
      />

      {/* Compliance / Expired Extinguishers Section */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-secondary-900 dark:text-secondary-50">Compliance & Expired Extinguishers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {compliance && (
            <>
              <StatCard label="Compliant %" value={`${compliance.compliantPercentage}`} isLoading={loading} />
              <StatCard label="Expired" value={compliance.expired} isLoading={loading} />
              <StatCard label="Expiring (30d)" value={compliance.expiringNext30Days} isLoading={loading} />
              <StatCard label="Expiring this month" value={compliance.expiringThisMonth} isLoading={loading} />
            </>
          )}
        </div>
      </div>

      {!isUser && (
        <>
          {/* Inventory Stock Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-secondary-900 dark:text-secondary-50">Inventory Stock Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Registered (All-Time)" value={inventory?.total ?? 0} isLoading={loading} />
              <StatCard label="Installed Today" value={inventoryDaily?.total ?? 0} isLoading={loading} />
              <StatCard label="Installed This Month" value={inventoryMonthly?.total ?? 0} isLoading={loading} />
              <StatCard label="Installed This Year" value={inventoryYearly?.total ?? 0} isLoading={loading} />
            </div>
          </div>

          {/* Inspection Status Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-secondary-900 dark:text-secondary-50">Inspection Status Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {inspections && (
                <>
                  <StatCard label="Pending Inspections" value={inspections.pending} isLoading={loading} />
                  <StatCard label="Overdue Inspections" value={inspections.overdue} isLoading={loading} />
                  <StatCard label="Completed Inspections" value={inspections.completed} isLoading={loading} />
                  <StatCard label="Completion Rate" value={inspections.completionRate} isLoading={loading} />
                </>
              )}
            </div>
          </div>

          {/* Maintenance History Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-secondary-900 dark:text-secondary-50">Maintenance History</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
              <StatCard label="Total Maintenance Activities" value={maintenance?.totalActivities ?? 0} isLoading={loading} />
              <StatCard label="Activities (Last 30 Days)" value={maintenance?.lastThirtyDays ?? 0} isLoading={loading} />
            </div>
            
            <PageCard title="Recent Maintenance Logs">
              <DataTable
                columns={maintenanceColumns}
                data={maintenance?.recentActivities || []}
                isLoading={loading}
                keyExtractor={(r) => r.id}
              />
            </PageCard>
          </div>
        </>
      )}

      <PageCard title="Export reports">
        <div className="flex flex-wrap gap-3">
          {(isUser ? (['compliance'] as const) : (['inventory', 'inspection', 'compliance', 'maintenance'] as const)).map(
            (type) => (
              <div key={type} className="flex gap-2">
                {(['PDF', 'CSV'] as const).map((fmt) => (
                  <button
                    key={`${type}-${fmt}`}
                    type="button"
                    disabled={!!exporting}
                    onClick={() => handleExport(type, fmt)}
                    className="rounded-md border border-secondary-200 dark:border-secondary-700 px-3 py-1.5 text-xs font-medium hover:bg-secondary-50 dark:hover:bg-secondary-800 disabled:opacity-50"
                  >
                    {exporting === `${type}-${fmt}` ? '…' : `${type} ${fmt}`}
                  </button>
                ))}
              </div>
            ),
          )}
        </div>
      </PageCard>
    </div>
  );
}
