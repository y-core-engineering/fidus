'use client';

import { usePathname } from 'next/navigation';
import { Sidebar, type SidebarItem } from '@fidus/ui';
import { MessageSquare, Users, Building2, ListChecks, Target, User, Settings } from 'lucide-react';

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 'chat',
    label: 'Chat',
    href: '/fidus-memory',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    href: '/fidus-memory/preferences',
    icon: <ListChecks className="w-5 h-5" />,
  },
  {
    id: 'situations',
    label: 'Situations',
    href: '/fidus-memory/situations',
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: 'persons',
    label: 'Persons',
    href: '/fidus-memory/persons',
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: 'organizations',
    label: 'Organizations',
    href: '/fidus-memory/organizations',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/fidus-memory/profile',
    icon: <User className="w-5 h-5" />,
  },
  {
    id: 'admin',
    label: 'Admin',
    href: '/fidus-memory/admin',
    icon: <Settings className="w-5 h-5" />,
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function FidusMemoryLayout({ children }: LayoutProps) {
  const pathname = usePathname();

  // Mark active item based on current path
  const itemsWithActive = SIDEBAR_ITEMS.map((item) => ({
    ...item,
    active: pathname === item.href ||
            (item.href !== '/fidus-memory' && pathname?.startsWith(item.href || '')),
  }));

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <Sidebar
        items={itemsWithActive}
        width="sm"
        className="h-screen sticky top-0"
      />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
