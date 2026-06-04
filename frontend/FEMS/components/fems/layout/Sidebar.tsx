'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';

type Role = 'ADMIN' | 'INSPECTOR' | 'USER';

interface NavItem {
  label: string;
  href?: string;
  action?: () => void;
  icon: React.ReactNode;
  badge?: number;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const iconClass = 'h-4 w-4 flex-shrink-0';

function LayoutDashboard() {
  return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
}
function IconChart() {
  return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
function IconBell() {
  return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>;
}
function IconTool() {
  return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>;
}
function IconClipboard() {
  return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>;
}
function IconSettings() {
  return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function IconUsers() {
  return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
}
function IconFile() {
  return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>;
}
function IconLogout() {
  return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>;
}

function useNavSections(role: Role, logout: () => Promise<void>, unreadCount = 0): NavSection[] {
  if (role === 'ADMIN') {
    return [
      {
        section: 'GENERAL',
        items: [{ label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> }],
      },
      {
        section: 'ANALYTICS',
        items: [
          { label: 'Performance', href: '/dashboard/reports', icon: <IconChart /> },
          { label: 'Alerts', href: '/dashboard/alerts', icon: <IconBell />, badge: unreadCount },
        ],
      },
      {
        section: 'MANAGEMENT',
        items: [
          { label: 'Extinguishers', href: '/dashboard/extinguishers', icon: <IconTool /> },
          { label: 'Requests', href: '/dashboard/requests', icon: <IconClipboard /> },
          { label: 'Inspections', href: '/dashboard/inspections', icon: <IconClipboard /> },
          { label: 'Maintenance', href: '/dashboard/maintenance', icon: <IconSettings /> },
          { label: 'Users', href: '/dashboard/users', icon: <IconUsers /> },
        ],
      },
      {
        section: 'REPORTS',
        items: [{ label: 'Reports', href: '/dashboard/reports', icon: <IconFile /> }],
      },
      {
        section: 'SYSTEM',
        items: [
          { label: 'Settings', href: '/dashboard/settings', icon: <IconSettings /> },
          { label: 'Logout', action: logout, icon: <IconLogout /> },
        ],
      },
    ];
  }

  if (role === 'INSPECTOR') {
    return [
      {
        section: 'GENERAL',
        items: [{ label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> }],
      },
      {
        section: 'WORK',
        items: [
          { label: 'My Inspections', href: '/dashboard/inspections', icon: <IconClipboard /> },
          { label: 'Maintenance Logs', href: '/dashboard/maintenance', icon: <IconTool /> },
        ],
      },
      {
        section: 'NOTIFICATIONS',
        items: [
          { label: 'Notifications', href: '/dashboard/notifications', icon: <IconBell />, badge: unreadCount },
        ],
      },
      {
        section: 'SYSTEM',
        items: [{ label: 'Logout', action: logout, icon: <IconLogout /> }],
      },
    ];
  }

  // USER
  return [
    {
      section: 'GENERAL',
      items: [{ label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> }],
    },
    {
      section: 'VIEW',
      items: [
        { label: 'Extinguishers', href: '/dashboard/extinguishers', icon: <IconTool /> },
        { label: 'My Requests', href: '/dashboard/requests', icon: <IconClipboard /> },
        { label: 'Inspection history', href: '/dashboard/inspections', icon: <IconClipboard /> },
        { label: 'Reports', href: '/dashboard/reports', icon: <IconFile /> },
      ],
    },
    {
      section: 'NOTIFICATIONS',
      items: [
        { label: 'Notifications', href: '/dashboard/notifications', icon: <IconBell />, badge: unreadCount },
      ],
    },
    {
      section: 'SYSTEM',
      items: [{ label: 'Logout', action: logout, icon: <IconLogout /> }],
    },
  ];
}

interface SidebarProps {
  role: Role;
  collapsed?: boolean;
  unreadCount?: number;
}

export function Sidebar({ role, collapsed = false, unreadCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const sections = useNavSections(role, logout, unreadCount);

  const isActive = (href?: string) =>
    href ? (href === '/dashboard' ? pathname === href : pathname.startsWith(href)) : false;

  return (
    <aside
      className={`flex flex-col h-full bg-white dark:bg-secondary-950 border-r border-secondary-200 dark:border-secondary-700 transition-all duration-200 ${
        collapsed ? 'w-[60px]' : 'w-[220px]'
      }`}
    >
      {/* Logo */}
      <div
        className={`flex h-14 items-center border-b border-secondary-200 dark:border-secondary-700 ${
          collapsed ? 'justify-center px-0' : 'px-5'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500">
            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm1 14h-2v-1h2v1zm0-3h-2v-1h2v1z"/>
            </svg>
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-secondary-900 dark:text-secondary-50 tracking-tight">
              TZW FEMS
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
        {sections.map((sec) => (
          <div key={sec.section}>
            {!collapsed && (
              <p className="mb-1 px-3 text-[10px] font-medium uppercase tracking-widest text-secondary-400">
                {sec.section}
              </p>
            )}
            <ul className="space-y-0.5">
              {sec.items.map((item) => {
                const active = isActive(item.href);
                const base =
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors';
                const activeClass =
                  'bg-primary-50 dark:bg-primary-900/40 text-primary-500 dark:text-primary-300 border-l-2 border-primary-500';
                const inactiveClass =
                  'text-secondary-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800';

                const inner = (
                  <>
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge != null && item.badge > 0 && (
                          <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-500 px-1.5 text-[10px] font-medium text-white">
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </>
                );

                if (item.action) {
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => item.action?.()}
                        className={`w-full ${base} ${inactiveClass}`}
                        title={collapsed ? item.label : undefined}
                      >
                        {inner}
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href!}
                      className={`${base} ${active ? activeClass : inactiveClass}`}
                      title={collapsed ? item.label : undefined}
                    >
                      {inner}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
