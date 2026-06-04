'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardPageHeader } from '@/components/fems/shared/DashboardPageHeader';
import { PageCard } from '@/components/fems/shared/PageCard';
import { DataTable, Column } from '@/components/fems/shared/DataTable';
import { Pagination } from '@/components/fems/shared/Pagination';
import { StatusBadge } from '@/components/fems/shared/StatusBadge';
import {
  getRequests,
  createRequest,
  reviewRequest,
  type ExtinguisherRequest,
} from '@/lib/api/requests';
import { getExtinguishers, type Extinguisher } from '@/lib/api/extinguishers';
import { getInspectors, type InspectorOption } from '@/lib/api/auth';
import { getUsers, type UserProfile } from '@/lib/api/users';
import type { PaginationMeta } from '@/lib/api/client';

export function ExtinguisherRequestsView() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [items, setItems] = useState<ExtinguisherRequest[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | undefined>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Form states for creating a request
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [requestType, setRequestType] = useState<'NEW' | 'REPLACEMENT' | 'INSTALLATION'>('NEW');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('LB_5');
  const [extType, setExtType] = useState('CO2');
  const [extinguisherId, setExtinguisherId] = useState('');
  const [details, setDetails] = useState('');

  // Dropdown lists
  const [myExtinguishers, setMyExtinguishers] = useState<Extinguisher[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [inspectors, setInspectors] = useState<InspectorOption[]>([]);

  // Modal / Review state
  const [selectedRequest, setSelectedRequest] = useState<ExtinguisherRequest | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [createExtRecord, setCreateExtRecord] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [assignOwnerId, setAssignOwnerId] = useState('');
  const [assignInspectorId, setAssignInspectorId] = useState('');
  const [installationDate, setInstallationDate] = useState(new Date().toISOString().slice(0, 10));
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1); // 1 year expiry
    return d.toISOString().slice(0, 10);
  });
  const [message, setMessage] = useState('');
  const [dateErrors, setDateErrors] = useState<{ installationDate?: string; expiryDate?: string }>({});

  const validateApprovalDates = () => {
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

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRequests({ page, limit: 15 });
      setItems(res.data);
      setPagination(res.pagination);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    getExtinguishers({ limit: 100 }).then((res) => {
      setMyExtinguishers(res.data);
    }).catch(() => {});
    if (isAdmin) {
      getUsers({ limit: 100 }).then((res) => setAllUsers(res.data)).catch(() => {});
      getInspectors().then(setInspectors).catch(() => {});
    }
  }, [isAdmin]);

  // Pre-fill extinguisher creation parameters when selectedRequest changes
  useEffect(() => {
    if (selectedRequest) {
      setSerialNumber('');
      setAssignOwnerId(selectedRequest.userId || '');
      setAssignInspectorId('');
      setCreateExtRecord(selectedRequest.type === 'NEW' || selectedRequest.type === 'REPLACEMENT');
    }
  }, [selectedRequest]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRequest({
        type: requestType,
        building: building || null,
        floor: floor || null,
        location: location || null,
        size: size || null,
        extinguisherType: extType || null,
        extinguisherId: requestType === 'REPLACEMENT' ? extinguisherId || null : null,
        details: details || null,
      });
      setShowCreateForm(false);
      // Reset form
      setBuilding('');
      setFloor('');
      setLocation('');
      setDetails('');
      setExtinguisherId('');
      loadRequests();
    } catch (err) {
      console.error(err);
      alert('Failed to submit request.');
    }
  };

  const handleReview = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedRequest) return;
    if (status === 'APPROVED' && createExtRecord && !serialNumber.trim()) {
      alert('Serial number is required to register the extinguisher.');
      return;
    }
    // Validate dates when creating an extinguisher record
    if (status === 'APPROVED' && createExtRecord) {
      const errors = validateApprovalDates();
      if (Object.keys(errors).length > 0) { setDateErrors(errors); return; }
    }
    setDateErrors({});

    try {
      await reviewRequest(selectedRequest.id, {
        status,
        adminComment: adminComment.trim() || null,
        createExtinguisher: status === 'APPROVED' ? createExtRecord : false,
        serialNumber: serialNumber || undefined,
        location: selectedRequest.location || 'Building Lobby',
        building: selectedRequest.building || null,
        floor: selectedRequest.floor || null,
        type: selectedRequest.extinguisherType || 'CO2',
        size: selectedRequest.size || 'LB_5',
        installationDate,
        expiryDate,
        ownerUserId: assignOwnerId || null,
        inspectorId: assignInspectorId || null,
      });

      setSelectedRequest(null);
      setAdminComment('');
      loadRequests();
    } catch (err) {
      console.error(err);
      alert('Failed to submit review.');
    }
  };

  const columns: Column<ExtinguisherRequest>[] = [
    { key: 'type', header: 'Request Type', render: (r) => r.type },
    { key: 'createdAt', header: 'Submitted Date', render: (r) => new Date(r.createdAt).toLocaleDateString() },
    { key: 'building', header: 'Location Info', render: (r) => `${r.building ?? '—'} (Floor ${r.floor ?? '—'})` },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'actions',
      header: 'More',
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedRequest(row)}
          className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
        >
          {isAdmin && row.status === 'PENDING' ? 'Review' : 'View Details'}
        </button>
      ),
    },
  ];

  return (
    <div>
      <DashboardPageHeader
        title={isAdmin ? 'Extinguisher Requests' : 'My Requests'}
        description={
          isAdmin
            ? 'Review and approve/reject fire extinguisher requests'
            : 'Submit and track fire extinguisher request status'
        }
        actions={
          !isAdmin && !showCreateForm ? (
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="rounded-md bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 text-sm font-semibold transition-all shadow-md active:scale-95"
            >
              Submit request
            </button>
          ) : undefined
        }
      />

      {showCreateForm && (
        <PageCard title="Submit New Fire Extinguisher Request" className="mb-6">
          <form onSubmit={handleSubmitRequest} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-secondary-600">Request Type</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as any)}
                className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
              >
                <option value="NEW">New Fire Extinguisher</option>
                <option value="REPLACEMENT">Replacement (Expired/Damaged)</option>
                <option value="INSTALLATION">Installation Request</option>
              </select>
            </div>

            {requestType === 'REPLACEMENT' && (
              <div>
                <label className="text-xs font-medium text-secondary-600">Extinguisher to Replace</label>
                <select
                  required
                  value={extinguisherId}
                  onChange={(e) => setExtinguisherId(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
                >
                  <option value="">Select extinguisher...</option>
                  {myExtinguishers.map((ext) => (
                    <option key={ext.id} value={ext.id}>
                      {ext.serialNumber} - {ext.location} ({ext.type})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-secondary-600">Building</label>
              <input
                required
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="e.g. Building A"
                className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-secondary-600">Floor</label>
              <input
                required
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="e.g. 2"
                className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-secondary-600">Specific Location</label>
              <input
                required
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Next to elevator"
                className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-secondary-600">Extinguisher Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
              >
                <option value="LB_2_5">2.5 lbs.</option>
                <option value="LB_5">5 lbs.</option>
                <option value="LB_9">9 lbs.</option>
                <option value="LB_12">12 lbs.</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-secondary-600">Extinguisher Type</label>
              <select
                value={extType}
                onChange={(e) => setExtType(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm"
              >
                <option value="WATER">Water</option>
                <option value="CO2">CO2</option>
                <option value="FOAM">Foam</option>
                <option value="DRY_CHEMICAL">Dry Chemical</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-secondary-600">Details / Justification</label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Why do you need this extinguisher?"
                className="mt-1 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 py-2 text-sm"
              />
            </div>

            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                className="rounded-md bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 text-sm font-semibold shadow-md active:scale-95"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-md border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 text-secondary-600 px-5 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </PageCard>
      )}

      <PageCard title="Submitted Requests">
        <DataTable columns={columns} data={items} isLoading={loading} keyExtractor={(r) => r.id} />
        <Pagination pagination={pagination} onPageChange={setPage} />
      </PageCard>

      {/* Details/Review Popup Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm"
            onClick={() => setSelectedRequest(null)}
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 shadow-2xl p-6">
            <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-50 mb-4">
              Fire Extinguisher Request Details
            </h3>

            <div className="grid grid-cols-2 gap-4 border-b border-secondary-200 dark:border-secondary-700 pb-4 mb-4">
              <div>
                <p className="text-[10px] font-semibold text-secondary-400 uppercase">Type</p>
                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{selectedRequest.type}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-secondary-400 uppercase">Status</p>
                <div className="mt-1"><StatusBadge status={selectedRequest.status} /></div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-secondary-400 uppercase">Location</p>
                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                  {selectedRequest.building ?? '—'} (Floor {selectedRequest.floor ?? '—'}), {selectedRequest.location ?? '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-secondary-400 uppercase">Spec Requested</p>
                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                  Size: {selectedRequest.size === 'LB_2_5' ? '2.5 lbs.' : selectedRequest.size === 'LB_5' ? '5 lbs.' : selectedRequest.size === 'LB_9' ? '9 lbs.' : selectedRequest.size === 'LB_12' ? '12 lbs.' : '—'}, Type: {selectedRequest.extinguisherType ?? '—'}
                </p>
              </div>
              {selectedRequest.type === 'REPLACEMENT' && selectedRequest.extinguisherId && (
                <div className="col-span-2">
                  <p className="text-[10px] font-semibold text-secondary-400 uppercase">Replacing Extinguisher ID</p>
                  <p className="text-sm font-mono text-secondary-900 dark:text-secondary-100">{selectedRequest.extinguisherId}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-[10px] font-semibold text-secondary-400 uppercase">Details / Justification</p>
                <p className="text-sm text-secondary-600 dark:text-secondary-300 bg-secondary-50 dark:bg-secondary-900 p-2 rounded-lg mt-1 border border-secondary-200 dark:border-secondary-700">
                  {selectedRequest.details ?? 'No details provided'}
                </p>
              </div>
              {selectedRequest.adminComment && (
                <div className="col-span-2">
                  <p className="text-[10px] font-semibold text-secondary-400 uppercase">Admin Comment</p>
                  <p className="text-sm text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10 p-2 rounded-lg mt-1 border border-primary-100 dark:border-primary-900">
                    {selectedRequest.adminComment}
                  </p>
                </div>
              )}
            </div>

            {/* Admin Actions */}
            {isAdmin && selectedRequest.status === 'PENDING' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-secondary-600">Admin Comment / Reason</label>
                  <textarea
                    rows={2}
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Enter review comment..."
                    className="mt-1 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 py-2 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="create-record-chk"
                    checked={createExtRecord}
                    onChange={(e) => setCreateExtRecord(e.target.checked)}
                    className="h-4 w-4 rounded border-secondary-300 dark:border-secondary-600 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                  />
                  <label htmlFor="create-record-chk" className="text-xs font-semibold text-secondary-700">
                    Create fire extinguisher record in system on Approval?
                  </label>
                </div>

                {createExtRecord && (
                  <div className="border border-primary-200 dark:border-primary-800 bg-primary-50/20 dark:bg-primary-900/5 p-4 rounded-lg grid grid-cols-2 gap-3">
                    <div className="col-span-2 text-xs font-bold text-primary-500 uppercase tracking-wider mb-1 border-b border-primary-100 pb-1">
                      Register Extinguisher Options
                    </div>
                    <div>
                      <label className="text-xs font-medium text-secondary-600">Serial Number *</label>
                      <input
                        required
                        type="text"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        placeholder="e.g. SN-XYZ"
                        className="mt-1 h-9 w-full rounded border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-secondary-600">Owner User (Ownership)</label>
                      <select
                        value={assignOwnerId}
                        onChange={(e) => setAssignOwnerId(e.target.value)}
                        className="mt-1 h-9 w-full rounded border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-2 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {allUsers.map((u) => (
                          <option key={u.userId} value={u.userId}>
                            {u.firstName} {u.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-secondary-600">Inspector User (Inspection)</label>
                      <select
                        value={assignInspectorId}
                        onChange={(e) => setAssignInspectorId(e.target.value)}
                        className="mt-1 h-9 w-full rounded border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-2 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {inspectors.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.email}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-secondary-600">Installation Date</label>
                      <input
                        type="date"
                        value={installationDate}
                        max={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => { setInstallationDate(e.target.value); setDateErrors({}); }}
                        className={`mt-1 h-9 w-full rounded border ${dateErrors.installationDate ? 'border-red-400' : 'border-secondary-200 dark:border-secondary-700'} bg-white dark:bg-secondary-800 px-2.5 text-sm`}
                      />
                      {dateErrors.installationDate && <p className="mt-1 text-xs text-red-500">{dateErrors.installationDate}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-secondary-600">Expiry Date</label>
                      <input
                        type="date"
                        value={expiryDate}
                        min={installationDate || new Date().toISOString().slice(0, 10)}
                        onChange={(e) => { setExpiryDate(e.target.value); setDateErrors({}); }}
                        className={`mt-1 h-9 w-full rounded border ${dateErrors.expiryDate ? 'border-red-400' : 'border-secondary-200 dark:border-secondary-700'} bg-white dark:bg-secondary-800 px-2.5 text-sm`}
                      />
                      {dateErrors.expiryDate && <p className="mt-1 text-xs text-red-500">{dateErrors.expiryDate}</p>}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-end mt-2 pt-2 border-t border-secondary-200 dark:border-secondary-700">
                  <button
                    type="button"
                    onClick={() => handleReview('APPROVED')}
                    className="rounded-md bg-green-500 hover:bg-green-600 text-white px-5 py-2 text-sm font-semibold transition-all active:scale-95 shadow"
                  >
                    Approve Request
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReview('REJECTED')}
                    className="rounded-md bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 text-sm font-semibold transition-all active:scale-95 shadow"
                  >
                    Reject Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="rounded-md border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 text-secondary-600 px-5 py-2 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {(!isAdmin || selectedRequest.status !== 'PENDING') && (
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="rounded-md bg-secondary-100 hover:bg-secondary-200 text-secondary-800 dark:bg-secondary-700 dark:hover:bg-secondary-600 dark:text-secondary-200 px-5 py-2 text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
