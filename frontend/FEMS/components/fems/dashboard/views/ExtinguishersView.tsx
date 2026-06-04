'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardPageHeader } from '@/components/fems/shared/DashboardPageHeader';
import { PageCard } from '@/components/fems/shared/PageCard';
import { DataTable, Column } from '@/components/fems/shared/DataTable';
import { Pagination } from '@/components/fems/shared/Pagination';
import { StatusBadge } from '@/components/fems/shared/StatusBadge';
import {
  getExtinguishers,
  createExtinguisher,
  updateExtinguisher,
  deleteExtinguisher,
  type Extinguisher,
} from '@/lib/api/extinguishers';
import { getUsers, type UserProfile } from '@/lib/api/users';
import { getInspectors, type InspectorOption } from '@/lib/api/auth';
import type { PaginationMeta } from '@/lib/api/client';

export function ExtinguishersView() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const canManage = user?.role === 'ADMIN' || user?.role === 'INSPECTOR';

  const [items, setItems] = useState<Extinguisher[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | undefined>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Dropdown lists
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [inspectorsList, setInspectorsList] = useState<InspectorOption[]>([]);

  // Registration Form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    serialNumber: '',
    location: '',
    building: '',
    floor: '',
    type: 'CO2',
    size: 'LB_5',
    status: 'ACTIVE',
    installationDate: new Date().toISOString().slice(0, 10),
    expiryDate: (() => {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      return d.toISOString().slice(0, 10);
    })(),
    notes: '',
    ownerUserId: '',
    inspectorId: '',
  });

  // Modal State
  const [selectedExtinguisher, setSelectedExtinguisher] = useState<Extinguisher | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    serialNumber: '',
    location: '',
    building: '',
    floor: '',
    type: 'CO2',
    size: 'LB_5',
    status: 'ACTIVE',
    installationDate: '',
    expiryDate: '',
    notes: '',
    ownerUserId: '',
    inspectorId: '',
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState<{ installationDate?: string; expiryDate?: string }>({});
  const [editErrors, setEditErrors] = useState<{ installationDate?: string; expiryDate?: string }>({});

  const validateDates = (
    installationDate: string,
    expiryDate: string
  ): { installationDate?: string; expiryDate?: string } => {
    const errors: { installationDate?: string; expiryDate?: string } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (installationDate) {
      const inst = new Date(installationDate);
      if (inst > today) errors.installationDate = 'Installation date cannot be in the future.';
    }
    if (installationDate && expiryDate) {
      const inst = new Date(installationDate);
      const exp = new Date(expiryDate);
      if (exp <= inst) errors.expiryDate = 'Expiry date must be after the installation date.';
    }
    return errors;
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getExtinguishers({ page, limit: 15 });
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

  useEffect(() => {
    if (canManage) {
      getUsers({ limit: 100 }).then((r) => setUsersList(r.data)).catch(() => {});
      getInspectors().then(setInspectorsList).catch(() => {});
    }
  }, [canManage]);

  const sizeLabel = (val?: string | null) => {
    switch (val) {
      case 'LB_1_5':
        return '1.5 lbs.';
      case 'LB_2_5':
        return '2.5 lbs.';
      case 'LB_5':
        return '5 lbs.';
      case 'LB_9':
        return '9 lbs.';
      case 'LB_12':
        return '12 lbs.';
      default:
        return val ?? '—';
    }
  };

  const columns: Column<Extinguisher>[] = [
    { key: 'serialNumber', header: 'Serial' },
    { key: 'type', header: 'Type' },
    { key: 'location', header: 'Location' },
    { key: 'building', header: 'Building', render: (r) => r.building ?? '—' },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'expiryDate',
      header: 'Expiry',
      render: (r) => new Date(r.expiryDate).toLocaleDateString(),
    },
    {
      key: 'more',
      header: 'More',
      render: (row) => (
        <button
          type="button"
          onClick={() => {
            setSelectedExtinguisher(row);
            setIsEditMode(false);
            setEditForm({
              serialNumber: row.serialNumber,
              location: row.location,
              building: row.building ?? '',
              floor: row.floor ?? '',
              type: row.type,
              size: row.size ?? 'LB_5',
              status: row.status,
              installationDate: row.installationDate ? new Date(row.installationDate).toISOString().slice(0, 10) : '',
              expiryDate: row.expiryDate ? new Date(row.expiryDate).toISOString().slice(0, 10) : '',
              notes: row.notes ?? '',
              ownerUserId: row.assignedUserId ?? '', // Fallback to assignedUserId for legacy
              inspectorId: (row as any).inspectorId ?? '',
            });
          }}
          className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
        >
          View Details
        </button>
      ),
    },
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateDates(form.installationDate, form.expiryDate);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormErrors({});
    try {
      await createExtinguisher({
        ...form,
        ownerUserId: form.ownerUserId || null,
        inspectorId: form.inspectorId || null,
      });
      setShowForm(false);
      setForm({
        serialNumber: '',
        location: '',
        building: '',
        floor: '',
        type: 'CO2',
        size: 'LB_5',
        status: 'ACTIVE',
        installationDate: new Date().toISOString().slice(0, 10),
        expiryDate: (() => {
          const d = new Date();
          d.setFullYear(d.getFullYear() + 1);
          return d.toISOString().slice(0, 10);
        })(),
        notes: '',
        ownerUserId: '',
        inspectorId: '',
      });
      load();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to register extinguisher.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExtinguisher) return;
    const errors = validateDates(editForm.installationDate, editForm.expiryDate);
    if (Object.keys(errors).length > 0) { setEditErrors(errors); return; }
    setEditErrors({});
    try {
      await updateExtinguisher(selectedExtinguisher.id, {
        ...editForm,
        ownerUserId: editForm.ownerUserId || null,
        inspectorId: editForm.inspectorId || null,
      });
      setIsEditMode(false);
      setSelectedExtinguisher(null);
      load();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update extinguisher.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this extinguisher?')) {
      try {
        await deleteExtinguisher(id);
        setSelectedExtinguisher(null);
        load();
      } catch (err) {
        console.error(err);
        alert('Failed to delete extinguisher.');
      }
    }
  };

  return (
    <div>
      <DashboardPageHeader
        title={user?.role === 'USER' ? 'My Extinguishers' : 'Fire Extinguishers'}
        description={
          user?.role === 'USER'
            ? 'Extinguishers assigned to your account'
            : 'Manage inventory across all facilities'
        }
        actions={
          canManage ? (
            <button
              type="button"
              onClick={() => setShowForm((s) => !s)}
              className="rounded-md bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 text-sm font-semibold transition-all shadow-md active:scale-95"
            >
              {showForm ? 'Cancel' : 'Register extinguisher'}
            </button>
          ) : undefined
        }
      />

      {showForm && canManage && (
        <PageCard title="Register new extinguisher" className="mb-6">
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-secondary-600">Serial Number *</label>
              <input
                required
                type="text"
                value={form.serialNumber}
                onChange={(e) => setForm((f) => ({ ...f, serialNumber: e.target.value }))}
                placeholder="e.g. SN-001"
                className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary-600">Location *</label>
              <input
                required
                type="text"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Lobby corridor"
                className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary-600">Building</label>
              <input
                type="text"
                value={form.building}
                onChange={(e) => setForm((f) => ({ ...f, building: e.target.value }))}
                placeholder="e.g. Building A"
                className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary-600">Floor</label>
              <input
                type="text"
                value={form.floor}
                onChange={(e) => setForm((f) => ({ ...f, floor: e.target.value }))}
                placeholder="e.g. 2"
                className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary-600">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
              >
                {['WATER', 'CO2', 'FOAM', 'DRY_CHEMICAL'].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-secondary-600">Size</label>
              <select
                value={form.size}
                onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
              >
                <option value="LB_2_5">2.5 lbs.</option>
                <option value="LB_5">5 lbs.</option>
                <option value="LB_9">9 lbs.</option>
                <option value="LB_12">12 lbs.</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-secondary-600">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="EXPIRED">EXPIRED</option>
                <option value="UNDER_MAINTENANCE">UNDER MAINTENANCE</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-secondary-600">Installation Date</label>
              <input
                type="date"
                value={form.installationDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setForm((f) => ({ ...f, installationDate: e.target.value }))}
                className={`mt-1 h-10 w-full rounded-lg border ${formErrors.installationDate ? 'border-red-400' : 'border-secondary-200 dark:border-secondary-700'} bg-white dark:bg-secondary-800 px-3 text-sm`}
              />
              {formErrors.installationDate && <p className="mt-1 text-xs text-red-500">{formErrors.installationDate}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-secondary-600">Expiry Date</label>
              <input
                type="date"
                value={form.expiryDate}
                min={form.installationDate || new Date().toISOString().slice(0, 10)}
                onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
                className={`mt-1 h-10 w-full rounded-lg border ${formErrors.expiryDate ? 'border-red-400' : 'border-secondary-200 dark:border-secondary-700'} bg-white dark:bg-secondary-800 px-3 text-sm`}
              />
              {formErrors.expiryDate && <p className="mt-1 text-xs text-red-500">{formErrors.expiryDate}</p>}
            </div>
            {isAdmin && (
              <>
                <div>
                  <label className="text-xs font-medium text-secondary-600">Owner Assignment (User)</label>
                  <select
                    value={form.ownerUserId}
                    onChange={(e) => setForm((f) => ({ ...f, ownerUserId: e.target.value }))}
                    className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
                  >
                    <option value="">Unassigned</option>
                    {usersList.map((u) => (
                      <option key={u.userId} value={u.userId}>
                        {u.firstName} {u.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-secondary-600">Inspector Assignment</label>
                  <select
                    value={form.inspectorId}
                    onChange={(e) => setForm((f) => ({ ...f, inspectorId: e.target.value }))}
                    className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
                  >
                    <option value="">Unassigned</option>
                    {inspectorsList.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.email}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-secondary-600">Notes</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Additional notes..."
                className="mt-1 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-md bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 text-sm font-semibold shadow-md active:scale-95"
              >
                Save extinguisher
              </button>
            </div>
          </form>
        </PageCard>
      )}

      <PageCard title="All extinguishers">
        <DataTable columns={columns} data={items} isLoading={loading} keyExtractor={(r) => r.id} />
        <Pagination pagination={pagination} onPageChange={setPage} />
      </PageCard>

      {/* Details & Edit Popup Modal */}
      {selectedExtinguisher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm"
            onClick={() => setSelectedExtinguisher(null)}
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 shadow-2xl p-6">
            
            {/* Header / Top Right Edit Pencil Button */}
            <div className="flex items-center justify-between border-b border-secondary-200 dark:border-secondary-700 pb-4 mb-4">
              <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-50">
                {isEditMode ? 'Edit Fire Extinguisher' : 'Fire Extinguisher Details'}
              </h3>
              <div className="flex items-center gap-2">
                {canManage && !isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsEditMode(true)}
                    title="Edit Extinguisher"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-50 hover:bg-secondary-100 text-secondary-600 border border-secondary-200 transition-all active:scale-90"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedExtinguisher(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Read-only Details Mode */}
            {!isEditMode && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 border-b border-secondary-200 dark:border-secondary-700 pb-4">
                  <div>
                    <p className="text-[10px] font-semibold text-secondary-400 uppercase">Serial Number</p>
                    <p className="text-sm font-bold text-secondary-900 dark:text-secondary-100">{selectedExtinguisher.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-secondary-400 uppercase">Status</p>
                    <div className="mt-1"><StatusBadge status={selectedExtinguisher.status} /></div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-secondary-400 uppercase">Type & Size</p>
                    <p className="text-sm text-secondary-900 dark:text-secondary-100">
                      {selectedExtinguisher.type} — {sizeLabel(selectedExtinguisher.size)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-secondary-400 uppercase">Location Info</p>
                    <p className="text-sm text-secondary-900 dark:text-secondary-100">
                      {selectedExtinguisher.building ?? '—'} (Floor {selectedExtinguisher.floor ?? '—'}), {selectedExtinguisher.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-secondary-400 uppercase">Installation Date</p>
                    <p className="text-sm text-secondary-900 dark:text-secondary-100">
                      {selectedExtinguisher.installationDate ? new Date(selectedExtinguisher.installationDate).toLocaleDateString() : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-secondary-400 uppercase">Expiry Date</p>
                    <p className="text-sm text-secondary-900 dark:text-secondary-100">
                      {new Date(selectedExtinguisher.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-secondary-400 uppercase">Owner Assignment</p>
                    <p className="text-sm text-secondary-900 dark:text-secondary-100">
                      {selectedExtinguisher.assignedUserId ? (
                        usersList.find(u => u.userId === selectedExtinguisher.assignedUserId)
                          ? `${usersList.find(u => u.userId === selectedExtinguisher.assignedUserId)?.firstName} ${usersList.find(u => u.userId === selectedExtinguisher.assignedUserId)?.lastName}`
                          : selectedExtinguisher.assignedUserId
                      ) : 'Unassigned'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-secondary-400 uppercase">Inspector Assignment</p>
                    <p className="text-sm text-secondary-900 dark:text-secondary-100">
                      {((selectedExtinguisher as any).inspectorId) ? (
                        inspectorsList.find(i => i.id === (selectedExtinguisher as any).inspectorId)?.email || (selectedExtinguisher as any).inspectorId
                      ) : 'Unassigned'}
                    </p>
                  </div>
                </div>

                {selectedExtinguisher.notes && (
                  <div className="border-b border-secondary-200 dark:border-secondary-700 pb-4">
                    <p className="text-[10px] font-semibold text-secondary-400 uppercase">Notes</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-1 whitespace-pre-wrap">{selectedExtinguisher.notes}</p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-2">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedExtinguisher.id)}
                      className="rounded-md bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 text-xs font-semibold border border-red-200"
                    >
                      Delete Extinguisher
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedExtinguisher(null)}
                    className="ml-auto rounded-md bg-secondary-100 hover:bg-secondary-200 text-secondary-800 px-5 py-2 text-sm font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Edit Mode Form */}
            {isEditMode && (
              <form onSubmit={handleUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-secondary-600">Serial Number *</label>
                  <input
                    required
                    type="text"
                    value={editForm.serialNumber}
                    onChange={(e) => setEditForm(f => ({ ...f, serialNumber: e.target.value }))}
                    className="mt-1 h-9 w-full rounded border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary-600">Location *</label>
                  <input
                    required
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(f => ({ ...f, location: e.target.value }))}
                    className="mt-1 h-9 w-full rounded border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary-600">Building</label>
                  <input
                    type="text"
                    value={editForm.building}
                    onChange={(e) => setEditForm(f => ({ ...f, building: e.target.value }))}
                    className="mt-1 h-9 w-full rounded border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary-600">Floor</label>
                  <input
                    type="text"
                    value={editForm.floor}
                    onChange={(e) => setEditForm(f => ({ ...f, floor: e.target.value }))}
                    className="mt-1 h-9 w-full rounded border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary-600">Type</label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm(f => ({ ...f, type: e.target.value }))}
                    className="mt-1 h-9 w-full rounded border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-2 text-sm"
                  >
                    {['WATER', 'CO2', 'FOAM', 'DRY_CHEMICAL'].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary-600">Size</label>
                  <select
                    value={editForm.size}
                    onChange={(e) => setEditForm(f => ({ ...f, size: e.target.value }))}
                    className="mt-1 h-9 w-full rounded border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-2 text-sm"
                  >
                    <option value="LB_1_5">1.5 lbs.</option>
                    <option value="LB_2_5">2.5 lbs.</option>
                    <option value="LB_5">5 lbs.</option>
                    <option value="LB_9">9 lbs.</option>
                    <option value="LB_12">12 lbs.</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary-600">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value }))}
                    className="mt-1 h-9 w-full rounded border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-2 text-sm"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="UNDER_MAINTENANCE">UNDER MAINTENANCE</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary-600">Installation Date</label>
                  <input
                    type="date"
                    value={editForm.installationDate}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setEditForm(f => ({ ...f, installationDate: e.target.value }))}
                    className={`mt-1 h-9 w-full rounded border ${editErrors.installationDate ? 'border-red-400' : 'border-secondary-200 dark:border-secondary-700'} bg-white dark:bg-secondary-800 px-2.5 text-sm`}
                  />
                  {editErrors.installationDate && <p className="mt-1 text-xs text-red-500">{editErrors.installationDate}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary-600">Expiry Date</label>
                  <input
                    type="date"
                    value={editForm.expiryDate}
                    min={editForm.installationDate || new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setEditForm(f => ({ ...f, expiryDate: e.target.value }))}
                    className={`mt-1 h-9 w-full rounded border ${editErrors.expiryDate ? 'border-red-400' : 'border-secondary-200 dark:border-secondary-700'} bg-white dark:bg-secondary-800 px-2.5 text-sm`}
                  />
                  {editErrors.expiryDate && <p className="mt-1 text-xs text-red-500">{editErrors.expiryDate}</p>}
                </div>
                {isAdmin && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-secondary-600">Owner User (Ownership)</label>
                      <select
                        value={editForm.ownerUserId}
                        onChange={(e) => setEditForm(f => ({ ...f, ownerUserId: e.target.value }))}
                        className="mt-1 h-9 w-full rounded border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-2 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {usersList.map((u) => (
                          <option key={u.userId} value={u.userId}>
                            {u.firstName} {u.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-secondary-600">Inspector User (Inspection)</label>
                      <select
                        value={editForm.inspectorId}
                        onChange={(e) => setEditForm(f => ({ ...f, inspectorId: e.target.value }))}
                        className="mt-1 h-9 w-full rounded border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-2 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {inspectorsList.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.email}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-secondary-600">Notes</label>
                  <textarea
                    rows={2}
                    value={editForm.notes}
                    onChange={(e) => setEditForm(f => ({ ...f, notes: e.target.value }))}
                    className="mt-1 w-full rounded border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-2.5 py-2 text-sm"
                  />
                </div>
                <div className="sm:col-span-2 flex gap-3 justify-end pt-2 border-t border-secondary-200 dark:border-secondary-700 mt-2">
                  <button
                    type="submit"
                    className="rounded-md bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 text-sm font-semibold shadow-md active:scale-95"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className="rounded-md border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 text-secondary-600 px-5 py-2 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
