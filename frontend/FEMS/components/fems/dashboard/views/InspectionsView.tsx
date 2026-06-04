'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardPageHeader } from '@/components/fems/shared/DashboardPageHeader';
import { PageCard } from '@/components/fems/shared/PageCard';
import { DataTable, Column } from '@/components/fems/shared/DataTable';
import { Pagination } from '@/components/fems/shared/Pagination';
import { StatusBadge } from '@/components/fems/shared/StatusBadge';
import {
  getInspections,
  completeInspection,
  createInspection,
  approveInspection,
  type Inspection,
} from '@/lib/api/inspections';
import { getExtinguishers, type Extinguisher } from '@/lib/api/extinguishers';
import { getInspectors, type InspectorOption } from '@/lib/api/auth';
import type { PaginationMeta } from '@/lib/api/client';
import { LogMaintenanceModal } from '@/components/fems/dashboard/inspector/LogMaintenanceModal';

export function InspectionsView() {
  const { user } = useAuth();
  const isInspector = user?.role === 'INSPECTOR';
  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'USER';

  const [items, setItems] = useState<Inspection[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | undefined>();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // User Request Form States
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [userExtinguishers, setUserExtinguishers] = useState<Extinguisher[]>([]);
  const [form, setForm] = useState({
    extinguisherId: '',
    scheduledDate: '',
    scheduledTime: '09:00',
    notes: '',
  });
  const [dateError, setDateError] = useState('');

  // Admin Approval Modal States
  const [selectedRequestedInspection, setSelectedRequestedInspection] = useState<Inspection | null>(null);
  const [assignInspectorId, setAssignInspectorId] = useState('');
  const [inspectors, setInspectors] = useState<InspectorOption[]>([]);

  // Inspector Log Maintenance States
  const [logMaintenanceId, setLogMaintenanceId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getInspections({
        page,
        limit: 15,
        status: statusFilter || undefined,
        inspectorId: undefined, // Let backend automatically filter based on role/auth token
      });
      setItems(res.data);
      setPagination(res.pagination);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (isUser && showRequestForm) {
      getExtinguishers({ limit: 100 }).then((r) => setUserExtinguishers(r.data)).catch(() => {});
    }
  }, [isUser, showRequestForm]);

  useEffect(() => {
    if (isAdmin && !!selectedRequestedInspection) {
      getInspectors().then(setInspectors).catch(() => {});
    }
  }, [isAdmin, selectedRequestedInspection]);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate: scheduled date must be today or in the future
    if (form.scheduledDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(form.scheduledDate);
      if (selected < today) {
        setDateError('Scheduled date cannot be in the past. Please select today or a future date.');
        return;
      }
    }
    setDateError('');
    try {
      await createInspection({
        extinguisherId: form.extinguisherId,
        inspectorId: null,
        scheduledDate: form.scheduledDate,
        scheduledTime: form.scheduledTime,
        notes: form.notes || undefined,
      });
      setShowRequestForm(false);
      setForm({ extinguisherId: '', scheduledDate: '', scheduledTime: '09:00', notes: '' });
      setDateError('');
      load();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit inspection request.');
    }
  };

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestedInspection) return;
    try {
      await approveInspection(selectedRequestedInspection.id, {
        inspectorId: assignInspectorId,
      });
      setSelectedRequestedInspection(null);
      setAssignInspectorId('');
      load();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to approve and assign inspection.');
    }
  };

  const columns: Column<Inspection>[] = [
    { 
      key: 'extinguisherId', 
      header: 'Extinguisher', 
      render: (r) => r.extinguisher?.serialNumber ?? r.extinguisherId.slice(0, 8) + '…' 
    },
    { 
      key: 'scheduledDate', 
      header: 'Scheduled', 
      render: (r) => new Date(r.scheduledDate).toLocaleDateString() 
    },
    { 
      key: 'scheduledTime', 
      header: 'Time', 
      render: (r) => r.scheduledTime ?? '—' 
    },
    { 
      key: 'inspector', 
      header: 'Inspector', 
      render: (r) => r.inspector ? `${r.inspector.firstName} ${r.inspector.lastName}` : 'Unassigned' 
    },
    { 
      key: 'status', 
      header: 'Status', 
      render: (r) => <StatusBadge status={r.status} /> 
    },
  ];

  if (isInspector) {
    columns.push({
      key: 'actions',
      header: 'Actions',
      render: (row) => {
        if (row.status === 'PENDING' || row.status === 'OVERDUE') {
          return (
            <button
              type="button"
              onClick={async () => {
                await completeInspection(row.id);
                load();
              }}
              className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
            >
              Complete
            </button>
          );
        }
        if (row.status === 'COMPLETED' && !row.maintenanceLog) {
          return (
            <button
              type="button"
              onClick={() => setLogMaintenanceId(row.id)}
              className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
            >
              Log Maintenance
            </button>
          );
        }
        return '—';
      },
    });
  }

  if (isAdmin) {
    columns.push({
      key: 'actions',
      header: 'Actions',
      render: (row) =>
        row.status === 'REQUESTED' ? (
          <button
            type="button"
            onClick={() => {
              setSelectedRequestedInspection(row);
              setAssignInspectorId('');
            }}
            className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
          >
            Approve & Assign
          </button>
        ) : (
          '—'
        ),
    });
  }

  return (
    <div>
      <DashboardPageHeader
        title={
          isInspector
            ? 'My Inspections'
            : isUser
              ? 'Inspection History'
              : 'Inspections'
        }
        description="Schedule, track, and complete fire extinguisher inspections"
        actions={
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
              className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 py-2 text-sm"
            >
              <option value="">All statuses</option>
              {['REQUESTED', 'PENDING', 'COMPLETED', 'OVERDUE', 'CANCELLED'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {isUser && (
              <button
                type="button"
                onClick={() => setShowRequestForm((s) => !s)}
                className="rounded-md bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 text-sm font-semibold transition-all shadow-md active:scale-95 whitespace-nowrap"
              >
                {showRequestForm ? 'Cancel' : 'Request inspection'}
              </button>
            )}
          </div>
        }
      />

      {showRequestForm && isUser && (
        <PageCard title="Submit New Inspection Request" className="mb-6">
          <form onSubmit={handleRequestSubmit} className="grid gap-4 max-w-lg">
            <div>
              <label className="text-xs font-medium text-secondary-600">Extinguisher *</label>
              <select
                required
                value={form.extinguisherId}
                onChange={(e) => setForm((f) => ({ ...f, extinguisherId: e.target.value }))}
                className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
              >
                <option value="">Select extinguisher...</option>
                {userExtinguishers.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.serialNumber} — {e.location}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-secondary-600">Date *</label>
                <input
                  type="date"
                  required
                  value={form.scheduledDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => { setForm((f) => ({ ...f, scheduledDate: e.target.value })); setDateError(''); }}
                  className={`mt-1 h-10 w-full rounded-lg border ${dateError ? 'border-red-400' : 'border-secondary-200 dark:border-secondary-700'} bg-white dark:bg-secondary-800 px-3 text-sm`}
                />
                {dateError && <p className="mt-1 text-xs text-red-500">{dateError}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-secondary-600">Time *</label>
                <input
                  type="time"
                  required
                  value={form.scheduledTime}
                  onChange={(e) => setForm((f) => ({ ...f, scheduledTime: e.target.value }))}
                  className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-secondary-600">Notes / Reason</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Why is this inspection requested?"
                className="mt-1 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 text-sm font-semibold w-fit transition-all shadow-md active:scale-95"
            >
              Submit request
            </button>
          </form>
        </PageCard>
      )}

      <PageCard title="Inspection records">
        <DataTable columns={columns} data={items} isLoading={loading} keyExtractor={(r) => r.id} />
        <Pagination pagination={pagination} onPageChange={setPage} />
      </PageCard>

      {/* Admin Approval & Assignment Modal */}
      {selectedRequestedInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm"
            onClick={() => setSelectedRequestedInspection(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 shadow-2xl p-6">
            <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-50 mb-4">
              Approve & Assign Inspection
            </h3>
            <div className="flex flex-col gap-3 mb-4 text-sm text-secondary-600 dark:text-secondary-300">
              <p><strong>Extinguisher:</strong> {selectedRequestedInspection.extinguisher?.serialNumber || selectedRequestedInspection.extinguisherId}</p>
              <p><strong>Requested Date:</strong> {new Date(selectedRequestedInspection.scheduledDate).toLocaleDateString()}</p>
              <p><strong>Requested Time:</strong> {selectedRequestedInspection.scheduledTime ?? '—'}</p>
              {selectedRequestedInspection.notes && (
                <p><strong>User Notes:</strong> {selectedRequestedInspection.notes}</p>
              )}
            </div>
            
            <form onSubmit={handleApproveSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-secondary-600 block mb-1">Assign Inspector *</label>
                <select
                  required
                  value={assignInspectorId}
                  onChange={(e) => setAssignInspectorId(e.target.value)}
                  className="h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
                >
                  <option value="">Select inspector...</option>
                  {inspectors.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-secondary-200 dark:border-secondary-700 mt-2">
                <button
                  type="submit"
                  className="rounded-md bg-green-500 hover:bg-green-600 text-white px-5 py-2 text-sm font-semibold transition-all active:scale-95 shadow"
                >
                  Approve & Assign
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRequestedInspection(null)}
                  className="rounded-md border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 text-secondary-600 px-5 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {logMaintenanceId && (
        <LogMaintenanceModal
          inspectionId={logMaintenanceId}
          onClose={() => setLogMaintenanceId(null)}
          onSuccess={() => {
            setLogMaintenanceId(null);
            load();
          }}
        />
      )}
    </div>
  );
}
