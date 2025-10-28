'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Foundations',
    items: [
      { title: 'Colors', href: '/foundations/colors' },
      { title: 'Typography', href: '/foundations/typography' },
      { title: 'Spacing', href: '/foundations/spacing' },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Button', href: '/components/button' },
      { title: 'Link', href: '/components/link' },
      { title: 'Icon Button', href: '/components/icon-button' },
      { title: 'Button Group', href: '/components/button-group' },
    ],
  },
];

function NavSection({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  if (item.items) {
    return (
      <div className="mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted rounded-md"
        >
          {item.title}
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {isOpen && (
          <div className="mt-1 space-y-1 pl-3">
            {item.items.map((subItem) => (
              <NavItem key={subItem.href || subItem.title} item={subItem} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return <NavItem item={item} />;
}

function NavItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  if (!item.href) return null;

  return (
    <Link
      href={item.href}
      className={`block px-3 py-2 text-sm rounded-md transition-colors no-underline ${
        isActive
          ? 'bg-primary text-black font-bold'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {item.title}
    </Link>
  );
}

export function Sidebar({ isOpen }: { isOpen?: boolean }) {
  return (
    <aside
      className={`fixed top-16 left-0 z-sidebar h-[calc(100vh-4rem)] w-64 border-r border-border bg-background overflow-y-auto transition-transform lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <nav className="p-4">
        {navigation.map((item) => (
          <NavSection key={item.title} item={item} />
        ))}
      </nav>
    </aside>
  );
}
