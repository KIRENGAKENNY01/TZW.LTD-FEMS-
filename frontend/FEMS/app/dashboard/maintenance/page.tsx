import { RoleGuard } from '@/components/fems/shared/RoleGuard';
import { MaintenanceView } from '@/components/fems/dashboard/views/MaintenanceView';

export default function MaintenancePage() {
  return (
    <RoleGuard allow={['ADMIN', 'INSPECTOR']}>
      <MaintenanceView />
    </RoleGuard>
  );
}


