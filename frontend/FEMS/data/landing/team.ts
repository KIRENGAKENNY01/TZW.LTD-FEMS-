export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  linkedIn?: string;
  email?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'admin',
    name: 'Admin',
    role: 'System Administrator',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80',
    linkedIn: '#',
    email: 'admin@tzw.co.zw',
  },
  {
    id: 'senior-inspector',
    name: 'Senior Inspector',
    role: 'Senior Inspector',
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
    linkedIn: '#',
    email: 'inspectors@tzw.co.zw',
  },
  {
    id: 'compliance-officer',
    name: 'Compliance Officer',
    role: 'Compliance Officer',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
    linkedIn: '#',
    email: 'compliance@tzw.co.zw',
  },
];
