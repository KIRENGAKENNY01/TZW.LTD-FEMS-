import { ClipboardCheck, Wrench, FileBarChart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface LandingService {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: LucideIcon;
}

export const landingServices: LandingService[] = [
  {
    id: 'inspection',
    name: 'Extinguisher Inspection',
    description:
      'Scheduled and ad-hoc inspections with digital checklists, photo evidence, and instant status updates.',
    image:
      'https://images.unsplash.com/photo-1581094794329-cd2e8e6e3f1f?w=800&q=80',
    icon: ClipboardCheck,
  },
  {
    id: 'maintenance',
    name: 'Maintenance & Servicing',
    description:
      'Track servicing history, parts replaced, and technician notes across every unit in your portfolio.',
    image:
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
    icon: Wrench,
  },
  {
    id: 'compliance',
    name: 'Compliance Reporting',
    description:
      'Automated compliance dashboards, expiry alerts, and export-ready reports for auditors and regulators.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    icon: FileBarChart,
  },
];
