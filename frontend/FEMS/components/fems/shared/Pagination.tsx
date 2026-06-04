'use client';

import type { PaginationMeta } from '@/lib/api/client';

interface PaginationProps {
  pagination?: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages } = pagination;

  return (
    <div className="flex items-center justify-between border-t border-secondary-200 dark:border-secondary-700 px-4 py-3">
      <p className="text-xs text-secondary-500 dark:text-secondary-400">
        Page {page} of {totalPages} ({pagination.total} total)
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-secondary-200 dark:border-secondary-700 px-3 py-1.5 text-xs font-medium text-secondary-700 dark:text-secondary-300 disabled:opacity-40 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-secondary-200 dark:border-secondary-700 px-3 py-1.5 text-xs font-medium text-secondary-700 dark:text-secondary-300 disabled:opacity-40 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
