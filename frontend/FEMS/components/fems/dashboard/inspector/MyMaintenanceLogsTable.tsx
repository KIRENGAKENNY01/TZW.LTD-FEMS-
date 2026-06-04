'use client';

import { useEffect, useState } from 'react';
import { getMaintenanceLogs, MaintenanceLog } from '@/lib/api/inspections';
import { useAuth } from '@/lib/context/AuthContext';

export function MyMaintenanceLogsTable() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewLog, setViewLog] = useState<MaintenanceLog | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    getMaintenanceLogs({ limit: 5 })
      .then((res) => setLogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 w-full animate-pulse rounded bg-secondary-100 dark:bg-secondary-700" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-secondary-400 dark:text-secondary-500">
        No maintenance logs yet.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary-50 dark:bg-secondary-800">
              {['Serial', 'Date', 'Action taken', 'Issues', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-secondary-500 dark:text-secondary-400 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-secondary-700 dark:text-secondary-300">
                  {log.inspection?.extinguisher?.serialNumber ?? '—'}
                </td>
                <td className="px-4 py-3 text-secondary-700 dark:text-secondary-300 whitespace-nowrap">
                  {new Date(log.maintenanceDate).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3 max-w-[200px] truncate text-secondary-700 dark:text-secondary-300">
                  {log.actionTaken.length > 60
                    ? `${log.actionTaken.slice(0, 60)}…`
                    : log.actionTaken}
                </td>
                <td className="px-4 py-3">
                  {log.issuesIdentified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      None
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setViewLog(log)}
                    className="border border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-md px-3 py-1 text-xs font-medium transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View modal */}
      {viewLog && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm" onClick={() => setViewLog(null)} />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-50">Maintenance Log Details</h3>
              <button onClick={() => setViewLog(null)} className="text-secondary-400 hover:text-secondary-600 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <dl className="flex flex-col gap-3 text-sm">
              <div><dt className="text-xs text-secondary-400">Date</dt><dd className="mt-0.5 text-secondary-900 dark:text-secondary-50">{new Date(viewLog.maintenanceDate).toLocaleDateString()}</dd></div>
              <div><dt className="text-xs text-secondary-400">Action taken</dt><dd className="mt-0.5 text-secondary-700 dark:text-secondary-300">{viewLog.actionTaken}</dd></div>
              {viewLog.issuesIdentified && <div><dt className="text-xs text-secondary-400">Issues</dt><dd className="mt-0.5 text-secondary-700 dark:text-secondary-300">{viewLog.issuesIdentified}</dd></div>}
              {viewLog.recommendations && <div><dt className="text-xs text-secondary-400">Recommendations</dt><dd className="mt-0.5 text-secondary-700 dark:text-secondary-300">{viewLog.recommendations}</dd></div>}
            </dl>
          </div>
        </div>
      )}
    </>
  );
}

export default MyMaintenanceLogsTable;
