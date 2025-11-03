'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Getting Started',
    items: [
      { title: 'Overview', href: '/getting-started/overview' },
      { title: 'For Designers', href: '/getting-started/for-designers' },
      { title: 'For Developers', href: '/getting-started/for-developers' },
      { title: 'Design Philosophy', href: '/getting-started/design-philosophy' },
    ],
  },
  {
    title: 'Foundations',
    items: [
      { title: 'AI-Driven UI', href: '/foundations/ai-driven-ui' },
      { title: 'Privacy & UX', href: '/foundations/privacy-ux' },
      { title: 'Colors', href: '/foundations/colors' },
      { title: 'Typography', href: '/foundations/typography' },
      { title: 'Spacing', href: '/foundations/spacing' },
      { title: 'Motion', href: '/foundations/motion' },
      { title: 'Icons', href: '/foundations/icons' },
      { title: 'Accessibility', href: '/foundations/accessibility' },
      { title: 'Responsive Design', href: '/foundations/responsive-design' },
    ],
  },
  {
    title: 'Components',
    items: [
      {
        title: 'Layout',
        items: [
          { title: 'Container', href: '/components/container' },
          { title: 'Grid', href: '/components/grid' },
          { title: 'Stack', href: '/components/stack' },
          { title: 'Divider', href: '/components/divider' },
        ],
      },
      {
        title: 'Actions',
        items: [
          { title: 'Button', href: '/components/button' },
          { title: 'Link', href: '/components/link' },
          { title: 'Icon Button', href: '/components/icon-button' },
          { title: 'Button Group', href: '/components/button-group' },
        ],
      },
      {
        title: 'Forms',
        items: [
          { title: 'Text Input', href: '/components/text-input' },
          { title: 'Text Area', href: '/components/text-area' },
          { title: 'Checkbox', href: '/components/checkbox' },
          { title: 'Radio Button', href: '/components/radio-button' },
          { title: 'Toggle Switch', href: '/components/toggle-switch' },
          { title: 'Select', href: '/components/select' },
          { title: 'Date Picker', href: '/components/date-picker' },
          { title: 'Time Picker', href: '/components/time-picker' },
          { title: 'File Upload', href: '/components/file-upload' },
        ],
      },
      {
        title: 'Data Display',
        items: [
          { title: 'Table', href: '/components/table' },
          { title: 'List', href: '/components/list' },
          { title: 'Badge', href: '/components/badge' },
          { title: 'Chip', href: '/components/chip' },
          { title: 'Avatar', href: '/components/avatar' },
        ],
      },
      {
        title: 'Cards',
        items: [
          { title: 'Opportunity Card', href: '/components/opportunity-card' },
          { title: 'Detail Card', href: '/components/detail-card' },
          { title: 'Empty Card', href: '/components/empty-card' },
        ],
      },
      {
        title: 'Feedback',
        items: [
          { title: 'Toast', href: '/components/toast' },
          { title: 'Modal', href: '/components/modal' },
          { title: 'Alert', href: '/components/alert' },
          { title: 'Banner', href: '/components/banner' },
          { title: 'Progress Bar', href: '/components/progress-bar' },
        ],
      },
      {
        title: 'Overlays',
        items: [
          { title: 'Dropdown', href: '/components/dropdown' },
          { title: 'Popover', href: '/components/popover' },
          { title: 'Tooltip', href: '/components/tooltip' },
          { title: 'Drawer', href: '/components/drawer' },
        ],
      },
      {
        title: 'Navigation',
        items: [
          { title: 'Tabs', href: '/components/tabs' },
          { title: 'Breadcrumbs', href: '/components/breadcrumbs' },
          { title: 'Pagination', href: '/components/pagination' },
          { title: 'Header', href: '/components/header' },
          { title: 'Sidebar', href: '/components/sidebar' },
        ],
      },
      {
        title: 'Chat',
        items: [
          { title: 'Message Bubble', href: '/components/message-bubble' },
          { title: 'Chat Interface', href: '/components/chat-interface' },
          { title: 'Confidence Indicator', href: '/components/confidence-indicator' },
        ],
      },
    ],
  },
  {
    title: 'Patterns',
    items: [
      { title: 'Form Validation', href: '/patterns/form-validation' },
      { title: 'Error States', href: '/patterns/error-states' },
      { title: 'Empty States', href: '/patterns/empty-states' },
      { title: 'Loading States', href: '/patterns/loading-states' },
      { title: 'Success Confirmation', href: '/patterns/success-confirmation' },
      { title: 'Onboarding', href: '/patterns/onboarding' },
      { title: 'Multi-Tenancy', href: '/patterns/multi-tenancy' },
      { title: 'Opportunity Surface', href: '/patterns/opportunity-surface' },
      { title: 'Search & Filtering', href: '/patterns/search-filtering' },
      { title: 'Settings', href: '/patterns/settings' },
    ],
  },
  {
    title: 'Tokens',
    items: [
      { title: 'Overview', href: '/tokens' },
      { title: 'Colors', href: '/tokens/color-tokens' },
      { title: 'Typography', href: '/tokens/typography-tokens' },
      { title: 'Spacing', href: '/tokens/spacing-tokens' },
      { title: 'Shadows', href: '/tokens/shadow-tokens' },
      { title: 'Motion', href: '/tokens/motion-tokens' },
    ],
  },
  {
    title: 'Architecture',
    items: [
      { title: 'UI Decision Layer', href: '/architecture/ui-decision-layer' },
      { title: 'Component Registry', href: '/architecture/component-registry' },
      { title: 'API Response Schema', href: '/architecture/api-response-schema' },
      { title: 'Opportunity Surface Service', href: '/architecture/opportunity-surface-service' },
      { title: 'Frontend Architecture', href: '/architecture/frontend-architecture' },
    ],
  },
  {
    title: 'Content',
    items: [
      { title: 'Glossary', href: '/content/glossary' },
      { title: 'Writing for Privacy', href: '/content/writing-for-privacy' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { title: 'Playground', href: '/playground' },
      { title: 'Contributing', href: '/resources/contributing' },
      { title: 'GitHub', href: '/resources/github' },
      { title: 'Support', href: '/resources/support' },
    ],
  },
];

function NavSection({ item, onLinkClick }: { item: NavItem; onLinkClick?: () => void }) {
  const pathname = usePathname();

  // Check if any child item is active (recursively)
  const hasActiveChild = (items: NavItem[]): boolean => {
    return items.some(child => {
      if (child.href === pathname) return true;
      if (child.items) return hasActiveChild(child.items);
      return false;
    });
  };

  const isActiveSection = item.items ? hasActiveChild(item.items) : false;
  const [isOpen, setIsOpen] = useState(isActiveSection);

  // Update isOpen when pathname changes
  useEffect(() => {
    setIsOpen(isActiveSection);
  }, [pathname, isActiveSection]);

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
              <NavItem key={subItem.href || subItem.title} item={subItem} onLinkClick={onLinkClick} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return <NavItem item={item} onLinkClick={onLinkClick} />;
}

function NavItem({ item, onLinkClick }: { item: NavItem; onLinkClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  // If item has sub-items, render as a nested section
  if (item.items) {
    return <NavSection item={item} onLinkClick={onLinkClick} />;
  }

  // If no href and no items, skip
  if (!item.href) return null;

  return (
    <Link
      href={item.href}
      onClick={onLinkClick}
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

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  return (
    <aside
      className={`fixed top-16 left-0 z-sidebar h-[calc(100vh-4rem)] w-64 border-r border-border bg-background overflow-y-auto transition-transform lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <nav className="p-4">
        {navigation.map((item) => (
          <NavSection key={item.title} item={item} onLinkClick={onClose} />
        ))}
      </nav>
    </aside>
  );
}
