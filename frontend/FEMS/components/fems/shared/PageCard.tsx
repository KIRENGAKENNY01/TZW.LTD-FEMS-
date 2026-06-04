'use client';

import React from 'react';

interface PageCardProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageCard({ title, action, children, className = '' }: PageCardProps) {
  return (
    <div
      className={`bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl shadow-sm ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
          {title && (
            <h2 className="text-sm font-semibold text-secondary-900 dark:text-secondary-50">
              {title}
            </h2>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

export default PageCard;
