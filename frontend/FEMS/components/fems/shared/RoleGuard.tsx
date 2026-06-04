'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

type Role = 'ADMIN' | 'INSPECTOR' | 'USER';

export function RoleGuard({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && !allow.includes(user.role as Role)) {
      router.replace('/dashboard');
    }
  }, [isLoading, user, allow, router]);

  if (isLoading || !user || !allow.includes(user.role as Role)) {
    return null;
  }

  return <>{children}</>;
}
