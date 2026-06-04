'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { AdminDashboard } from '@/components/fems/dashboard/admin/AdminDashboard';
import { InspectorDashboard } from '@/components/fems/dashboard/inspector/InspectorDashboard';
import { UserDashboard } from '@/components/fems/dashboard/user/UserDashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <svg className="h-7 w-7 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );

  if (user.role === 'ADMIN') return <AdminDashboard />;
  if (user.role === 'INSPECTOR') return <InspectorDashboard />;
  return <UserDashboard />;
}


