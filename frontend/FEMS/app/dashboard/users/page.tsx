import { RoleGuard } from '@/components/fems/shared/RoleGuard';
import { UsersView } from '@/components/fems/dashboard/views/UsersView';

export default function UsersPage() {
  return (
    <RoleGuard allow={['ADMIN']}>
      <UsersView />
    </RoleGuard>
  );
}


