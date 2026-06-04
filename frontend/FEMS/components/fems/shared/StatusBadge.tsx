const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  INACTIVE: 'bg-secondary-100 text-secondary-600 border-secondary-200 dark:bg-secondary-800 dark:text-secondary-400',
  EXPIRED: 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300',
  UNDER_MAINTENANCE: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
  PENDING: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300',
  OVERDUE: 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300',
  CANCELLED: 'bg-secondary-100 text-secondary-600 border-secondary-200',
};

export function StatusBadge({ status }: { status: string }) {
  const style =
    statusStyles[status] ??
    'bg-secondary-100 text-secondary-600 border-secondary-200 dark:bg-secondary-800 dark:text-secondary-400';

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
