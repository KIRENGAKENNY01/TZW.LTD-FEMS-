import { RoleGuard } from '@/components/fems/shared/RoleGuard';
import { SettingsView } from '@/components/fems/dashboard/views/SettingsView';

export default function SettingsPage() {
  return (
    <RoleGuard allow={['ADMIN']}>
      <SettingsView />
    </RoleGuard>
  );
}


