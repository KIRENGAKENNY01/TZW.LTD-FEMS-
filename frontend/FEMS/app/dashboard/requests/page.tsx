import { RoleGuard } from '@/components/fems/shared/RoleGuard';
import { ExtinguisherRequestsView } from '@/components/fems/dashboard/views/ExtinguisherRequestsView';

export default function RequestsPage() {
  return (
    <RoleGuard allow={['USER', 'ADMIN']}>
      <ExtinguisherRequestsView />
    </RoleGuard>
  );
}


