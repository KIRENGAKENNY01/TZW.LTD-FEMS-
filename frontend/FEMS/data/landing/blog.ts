export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  href: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'New Fire Safety Regulations for Commercial Buildings',
    excerpt:
      'Key changes facility managers need to know about extinguisher placement, inspection frequency, and documentation.',
    date: 'Mar 12, 2026',
    category: 'Compliance',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    href: '#',
  },
  {
    id: '2',
    title: 'How Digital Inspections Reduce Compliance Risk',
    excerpt:
      'Why paper logs fall short and how FEMS keeps your audit trail complete, searchable, and always up to date.',
    date: 'Feb 28, 2026',
    category: 'Operations',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    href: '#',
  },
  {
    id: '3',
    title: 'Preparing for Your Annual Fire Safety Audit',
    excerpt:
      'A practical checklist for safety officers to verify extinguisher records, maintenance logs, and alert settings.',
    date: 'Feb 10, 2026',
    category: 'Best Practices',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    href: '#',
  },
];
