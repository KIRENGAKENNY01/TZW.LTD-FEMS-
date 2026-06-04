import { RoleGuard } from '@/components/fems/shared/RoleGuard';
import { AlertsView } from '@/components/fems/dashboard/views/AlertsView';

export default function AlertsPage() {
  return (
    <RoleGuard allow={['ADMIN']}>
      <AlertsView />
    </RoleGuard>
  );
}
