import { RoleGuard } from '@/components/fems/shared/RoleGuard';
import { InspectionsView } from '@/components/fems/dashboard/views/InspectionsView';

export default function InspectionsPage() {
  return (
    <RoleGuard allow={['ADMIN', 'INSPECTOR', 'USER']}>
      <InspectionsView />
    </RoleGuard>
  );
}


