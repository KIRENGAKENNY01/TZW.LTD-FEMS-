'use client';

import { useEffect, useState, useCallback } from 'react';
import { getInspections, completeInspection, Inspection } from '@/lib/api/inspections';
import { DataTable, Column } from '@/components/fems/shared/DataTable';
import { StatusBadge } from '@/components/fems/shared/StatusBadge';
import { LogMaintenanceModal } from './LogMaintenanceModal';
import { useAuth } from '@/lib/context/AuthContext';

interface MyScheduleTableProps {
  onUpdate?: () => void;
}

export function MyScheduleTable({ onUpdate }: MyScheduleTableProps) {
  const { user } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [modalInspectionId, setModalInspectionId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    getInspections({ inspectorId: user.id, status: 'PENDING' })
      .then((res) => setInspections(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleMarkComplete = async (id: string) => {
    setCompleting(id);
    try {
      await completeInspection(id);
      setConfirmId(null);
      setModalInspectionId(id);
      await fetch();
      onUpdate?.();
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(null);
    }
  };

  const columns: Column<Inspection>[] = [
    {
      key: 'serial',
      header: 'Serial',
      render: (row) => (
        <span className="font-mono text-xs">{row.extinguisher?.serialNumber ?? '—'}</span>
      ),
    },
    {
      key: 'building',
      header: 'Building',
      render: (row) => row.extinguisher?.building ?? '—',
    },
    {
      key: 'floor',
      header: 'Floor',
      render: (row) => row.extinguisher?.floor ?? '—',
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) =>
        new Date(row.scheduledDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      key: 'time',
      header: 'Time',
      render: (row) =>
        new Date(row.scheduledDate).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) =>
        confirmId === row.id ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleMarkComplete(row.id)}
              disabled={completing === row.id}
              className="rounded-md bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50"
            >
              {completing === row.id ? 'Marking…' : 'Confirm'}
            </button>
            <button
              onClick={() => setConfirmId(null)}
              className="text-xs text-secondary-400 hover:text-secondary-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            id={`mark-complete-btn-${row.id}`}
            onClick={() => setConfirmId(row.id)}
            className="border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg px-3 py-1 text-xs font-medium transition-colors"
          >
            Mark complete
          </button>
        ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={inspections}
        isLoading={loading}
        emptyMessage="No pending inspections assigned to you."
        keyExtractor={(row) => row.id}
      />
      {modalInspectionId && (
        <LogMaintenanceModal
          inspectionId={modalInspectionId}
          onClose={() => setModalInspectionId(null)}
          onSuccess={() => {
            setModalInspectionId(null);
            fetch();
            onUpdate?.();
          }}
        />
      )}
    </>
  );
}

export default MyScheduleTable;
