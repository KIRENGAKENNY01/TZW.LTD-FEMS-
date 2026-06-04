'use client';

import { useState } from 'react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';
import { NotificationDropdown } from '@/components/fems/shared/NotificationDropdown';
import { useAuth } from '@/lib/context/AuthContext';

interface TopBarProps {
  onMenuToggle?: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() ||
      user.email?.[0]?.toUpperCase() ||
      'U'
    : 'U';

  return (
    <header className="fixed top-0 right-0 left-0 z-20 flex h-14 items-center gap-4 border-b border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900 px-4 md:px-6">
      {/* Hamburger (mobile) */}
      <button
        id="sidebar-toggle-btn"
        onClick={onMenuToggle}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors md:hidden"
        aria-label="Toggle sidebar"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Search */}
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            id="topbar-search-input"
            type="search"
            placeholder="Search..."
            className="h-9 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800 pl-9 pr-3 text-sm text-secondary-900 dark:text-secondary-50 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <NotificationDropdown onCountChange={setUnreadCount} />

        <ThemeSwitch />

        {/* Avatar */}
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 text-xs font-semibold select-none cursor-default"
          title={user?.email}
        >
          {initials}
        </div>

        {!true && (
          <div className="hidden md:flex flex-col leading-none">
            <span className="text-xs font-medium text-secondary-900 dark:text-secondary-50">
              {user?.firstName ?? user?.email}
            </span>
            <span className="text-[10px] text-secondary-400 capitalize">
              {user?.role?.toLowerCase()}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

export default TopBar;
