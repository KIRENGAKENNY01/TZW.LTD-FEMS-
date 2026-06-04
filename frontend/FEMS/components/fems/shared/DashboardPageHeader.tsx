interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashboardPageHeader({
  title,
  description,
  actions,
}: DashboardPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-sm text-secondary-500 dark:text-secondary-400">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
