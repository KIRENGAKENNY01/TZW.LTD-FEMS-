'use client';

import { useState } from 'react';
import { logMaintenance } from '@/lib/api/inspections';

interface LogMaintenanceModalProps {
  inspectionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function LogMaintenanceModal({
  inspectionId,
  onClose,
  onSuccess,
}: LogMaintenanceModalProps) {
  const [form, setForm] = useState({
    actionTaken: '',
    issuesIdentified: '',
    recommendations: '',
    conditionsNoted: '',
    maintenanceDate: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.actionTaken.trim()) {
      setError('Action taken is required.');
      return;
    }
    // Validate: maintenance date cannot be in the future
    if (form.maintenanceDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const mDate = new Date(form.maintenanceDate);
      if (mDate > today) {
        setError('Maintenance date cannot be in the future.');
        return;
      }
    }
    setError('');
    setLoading(true);
    try {
      await logMaintenance(inspectionId, {
        actionTaken: form.actionTaken.trim(),
        issuesIdentified: form.issuesIdentified.trim() || undefined,
        recommendations: form.recommendations.trim() || undefined,
        conditionsNoted: form.conditionsNoted.trim() || undefined,
        maintenanceDate: form.maintenanceDate,
      });
      onSuccess();
    } catch {
      setError('Failed to save maintenance log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
          <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-50">
            Log Maintenance Activity
          </h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          {error && (
            <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 px-4 py-3">
              <p className="text-sm text-primary-700 dark:text-primary-400">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
              Action taken <span className="text-primary-500">*</span>
            </label>
            <textarea
              rows={3}
              value={form.actionTaken}
              onChange={(e) => set('actionTaken', e.target.value)}
              placeholder="Describe what was done during maintenance…"
              className="w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-50 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
              Issues identified (optional)
            </label>
            <textarea
              rows={2}
              value={form.issuesIdentified}
              onChange={(e) => set('issuesIdentified', e.target.value)}
              placeholder="Any problems found…"
              className="w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-50 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
              Recommendations (optional)
            </label>
            <textarea
              rows={2}
              value={form.recommendations}
              onChange={(e) => set('recommendations', e.target.value)}
              placeholder="Future recommendations…"
              className="w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-50 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
              Conditions noted during maintenance (optional)
            </label>
            <textarea
              rows={2}
              value={form.conditionsNoted}
              onChange={(e) => set('conditionsNoted', e.target.value)}
              placeholder="e.g. dusty canister, clean surroundings..."
              className="w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-50 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
              Maintenance date
            </label>
            <input
              type="date"
              value={form.maintenanceDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => set('maintenanceDate', e.target.value)}
              className="h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-700 px-3 text-sm text-secondary-900 dark:text-secondary-50 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              id="log-maintenance-submit-btn"
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving…
                </>
              ) : (
                'Save log'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogMaintenanceModal;
