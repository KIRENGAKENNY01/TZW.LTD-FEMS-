'use client';

import React from 'react';

interface Trend {
  value: string;
  direction: 'up' | 'down';
  positive: boolean;
}

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: Trend;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function StatCard({ label, value, trend, icon, isLoading = false }: StatCardProps) {
  const trendClass =
    trend?.positive
      ? 'text-green-600 dark:text-green-400'
      : 'text-primary-500 dark:text-primary-400';

  return (
    <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-5 flex flex-col gap-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
          {label}
        </p>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400">
            {icon}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="h-9 w-24 animate-pulse rounded bg-secondary-200 dark:bg-secondary-700" />
      ) : (
        <p className="text-3xl font-semibold text-secondary-900 dark:text-secondary-50 leading-none">
          {value}
        </p>
      )}

      {trend && !isLoading && (
        <p className={`flex items-center gap-1 text-xs font-medium ${trendClass}`}>
          {trend.direction === 'up' ? (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          {trend.value}
        </p>
      )}
    </div>
  );
}

export default StatCard;
