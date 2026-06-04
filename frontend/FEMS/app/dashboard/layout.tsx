'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardShell } from '@/components/fems/layout/DashboardShell';
import { getUnreadCount } from '@/lib/api/notifications';

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-50 dark:bg-secondary-900">
      <svg className="h-8 w-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    getUnreadCount()
      .then((res) => setUnreadCount(res?.count ?? 0))
      .catch(() => setUnreadCount(0));
  }, [isAuthenticated]);

  if (isLoading) return <LoadingScreen />;

  // Not authenticated after loading — redirect (useEffect above also handles this,
  // but rendering null during the 1-frame delay causes the white flash)
  if (!isAuthenticated || !user) return <LoadingScreen />;

  const role = user.role as 'ADMIN' | 'INSPECTOR' | 'USER';

  return (
    <DashboardShell role={role} unreadCount={unreadCount}>
      {children}
    </DashboardShell>
  );
}


