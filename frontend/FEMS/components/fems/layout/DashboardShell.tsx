'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

type Role = 'ADMIN' | 'INSPECTOR' | 'USER';

interface DashboardShellProps {
  role: Role;
  children: React.ReactNode;
  unreadCount?: number;
}

export function DashboardShell({ role, children, unreadCount = 0 }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  // collapsed = icon-only at md (tablet)
  const sidebarCollapsed = isTablet;

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Sidebar — fixed on md+, drawer overlay on mobile */}
      {(isDesktop || isTablet) && (
        <div className={`fixed inset-y-0 left-0 z-10 ${sidebarCollapsed ? 'w-[60px]' : 'w-[220px]'}`}>
          <Sidebar role={role} collapsed={sidebarCollapsed} unreadCount={unreadCount} />
        </div>
      )}

      {/* Mobile drawer */}
      {!isDesktop && !isTablet && sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-20 bg-secondary-900/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-30 w-[220px]">
            <Sidebar role={role} collapsed={false} unreadCount={unreadCount} />
          </div>
        </>
      )}

      {/* TopBar */}
      <TopBar onMenuToggle={() => setSidebarOpen((o) => !o)} />

      {/* Main content */}
      <main
        className={`pt-14 min-h-screen transition-all duration-200 ${
          isDesktop ? 'ml-[220px]' : isTablet ? 'ml-[60px]' : 'ml-0'
        }`}
      >
        <div className="p-4 md:p-6 lg:p-6">{children}</div>
      </main>
    </div>
  );
}

export default DashboardShell;
