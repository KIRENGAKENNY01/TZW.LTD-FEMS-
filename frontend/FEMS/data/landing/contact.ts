import { MapPin, Phone, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ContactInfoItem {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
}

export const contactInfo: ContactInfoItem[] = [
  {
    id: 'address',
    label: 'Address',
    value: '12 Industrial Park Drive, Harare, Zimbabwe',
    icon: MapPin,
  },
  {
    id: 'phone',
    label: 'Phone',
    value: '+263 4 123 4567',
    icon: Phone,
  },
  {
    id: 'email',
    label: 'Email',
    value: 'info@tzw.co.zw',
    icon: Mail,
  },
];
