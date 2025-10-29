'use client';

import {
  Sidebar,
  SidebarRoot,
  SidebarSection,
  SidebarItem,
  Button,
  Link,
  Stack,
} from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { useState } from 'react';
import {
  Home,
  Users,
  Settings,
  FileText,
  Calendar,
  Mail,
  BarChart,
  Package,
  Truck,
  DollarSign,
  ShoppingCart,
  Tag,
} from 'lucide-react';

export default function SidebarPage() {
  const [collapsed, setCollapsed] = useState(false);

  const basicItems = [
    { id: 'home', label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, active: true },
    { id: 'users', label: 'Users', href: '/users', icon: <Users className="h-4 w-4" /> },
    { id: 'documents', label: 'Documents', href: '/documents', icon: <FileText className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings className="h-4 w-4" /> },
  ];

  const nestedItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4" />,
      active: true,
      children: [
        { id: 'overview', label: 'Overview', href: '/dashboard/overview' },
        { id: 'analytics', label: 'Analytics', href: '/dashboard/analytics' },
      ],
    },
    {
      id: 'products',
      label: 'Products',
      icon: <Package className="h-4 w-4" />,
      children: [
        { id: 'all-products', label: 'All Products', href: '/products' },
        { id: 'add-product', label: 'Add Product', href: '/products/add' },
        { id: 'categories', label: 'Categories', href: '/products/categories' },
      ],
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingCart className="h-4 w-4" />,
      children: [
        { id: 'all-orders', label: 'All Orders', href: '/orders' },
        { id: 'pending', label: 'Pending', href: '/orders/pending' },
        { id: 'completed', label: 'Completed', href: '/orders/completed' },
      ],
    },
  ];

  const sections = [
    {
      id: 'main',
      title: 'Main Menu',
      items: [
        { id: 'home', label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, active: true },
        { id: 'calendar', label: 'Calendar', href: '/calendar', icon: <Calendar className="h-4 w-4" /> },
        { id: 'mail', label: 'Mail', href: '/mail', icon: <Mail className="h-4 w-4" /> },
      ],
    },
    {
      id: 'analytics',
      title: 'Analytics',
      collapsible: true,
      items: [
        { id: 'reports', label: 'Reports', href: '/reports', icon: <BarChart className="h-4 w-4" /> },
        { id: 'metrics', label: 'Metrics', href: '/metrics', icon: <BarChart className="h-4 w-4" /> },
      ],
    },
    {
      id: 'settings',
      title: 'Settings',
      collapsible: true,
      defaultCollapsed: true,
      items: [
        { id: 'profile', label: 'Profile', href: '/settings/profile', icon: <Users className="h-4 w-4" /> },
        { id: 'preferences', label: 'Preferences', href: '/settings/preferences', icon: <Settings className="h-4 w-4" /> },
      ],
    },
  ];

  const sidebarProps = [
    {
      name: 'sections',
      type: 'SidebarSection[]',
      description: 'Array of sections with grouped items',
    },
    {
      name: 'items',
      type: 'SidebarItem[]',
      description: 'Array of items (alternative to sections)',
    },
    {
      name: 'collapsed',
      type: 'boolean',
      default: 'false',
      description: 'Whether sidebar is collapsed (shows icons only)',
    },
    {
      name: 'onCollapse',
      type: '(collapsed: boolean) => void',
      description: 'Callback when collapse state changes',
    },
    {
      name: 'position',
      type: "'left' | 'right'",
      default: "'left'",
      description: 'Sidebar position',
    },
    {
      name: 'width',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Width of expanded sidebar',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes',
    },
  ];

  const sidebarItemProps = [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Unique identifier for the item',
    },
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Display text for the item',
    },
    {
      name: 'href',
      type: 'string',
      description: 'Link destination (omit for parent items)',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Icon to display before label',
    },
    {
      name: 'active',
      type: 'boolean',
      description: 'Whether this is the current page',
    },
    {
      name: 'children',
      type: 'SidebarItem[]',
      description: 'Nested child items',
    },
  ];

  const sidebarSectionProps = [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Unique identifier for the section',
    },
    {
      name: 'title',
      type: 'string',
      description: 'Section header title',
    },
    {
      name: 'items',
      type: 'SidebarItem[]',
      required: true,
      description: 'Items in this section',
    },
    {
      name: 'collapsible',
      type: 'boolean',
      description: 'Whether section can be collapsed',
    },
    {
      name: 'defaultCollapsed',
      type: 'boolean',
      description: 'Whether section starts collapsed',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Sidebar</h1>
      <p className="lead">
        Navigation sidebar component with support for nested items, collapsible sections, icons, and collapsed state. Ideal for application layouts.
      </p>

      <h2>Basic Sidebar</h2>
      <ComponentPreview
        code={`<Sidebar items={[
  { id: 'home', label: 'Home', href: '/', icon: <Home />, active: true },
  { id: 'users', label: 'Users', href: '/users', icon: <Users /> },
  { id: 'documents', label: 'Documents', href: '/documents', icon: <FileText /> },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings /> },
]} />`}
      >
        <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '400px' }}>
          <Sidebar items={basicItems} />
          <div className="flex-1 p-lg">
            <h3 className="text-lg font-semibold">Main Content Area</h3>
            <p className="mt-sm text-sm text-muted-foreground">
              Content appears here alongside the sidebar navigation.
            </p>
          </div>
        </div>
      </ComponentPreview>

      <h2>With Sections</h2>
      <ComponentPreview
        code={`<Sidebar sections={[
  {
    id: 'main',
    title: 'Main Menu',
    items: [
      { id: 'home', label: 'Home', href: '/', icon: <Home />, active: true },
      { id: 'calendar', label: 'Calendar', href: '/calendar', icon: <Calendar /> },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    collapsible: true,
    items: [
      { id: 'reports', label: 'Reports', href: '/reports', icon: <BarChart /> },
    ],
  },
]} />`}
      >
        <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '500px' }}>
          <Sidebar sections={sections} />
          <div className="flex-1 p-lg">
            <h3 className="text-lg font-semibold">Organized Navigation</h3>
            <p className="mt-sm text-sm text-muted-foreground">
              Sections group related navigation items. Some sections are collapsible and can start collapsed.
            </p>
          </div>
        </div>
      </ComponentPreview>

      <h2>Nested Navigation</h2>
      <ComponentPreview
        code={`<Sidebar items={[
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home />,
    active: true,
    children: [
      { id: 'overview', label: 'Overview', href: '/dashboard/overview' },
      { id: 'analytics', label: 'Analytics', href: '/dashboard/analytics' },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    icon: <Package />,
    children: [
      { id: 'all-products', label: 'All Products', href: '/products' },
      { id: 'add-product', label: 'Add Product', href: '/products/add' },
    ],
  },
]} />`}
      >
        <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '500px' }}>
          <Sidebar items={nestedItems} />
          <div className="flex-1 p-lg">
            <h3 className="text-lg font-semibold">Hierarchical Navigation</h3>
            <p className="mt-sm text-sm text-muted-foreground">
              Click parent items to expand/collapse nested children. Great for complex navigation structures.
            </p>
          </div>
        </div>
      </ComponentPreview>

      <h2>Collapsed State</h2>
      <ComponentPreview
        code={`const [collapsed, setCollapsed] = useState(false);

<Button onClick={() => setCollapsed(!collapsed)}>
  {collapsed ? 'Expand' : 'Collapse'} Sidebar
</Button>

<Sidebar items={items} collapsed={collapsed} />`}
      >
        <div className="space-y-md">
          <Stack direction="horizontal" spacing="md" align="center">
            <Button onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? 'Expand' : 'Collapse'} Sidebar
            </Button>
            <span className="text-sm text-muted-foreground">
              {collapsed ? 'Collapsed (w-16)' : 'Expanded (w-70)'}
            </span>
          </Stack>
          <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '400px' }}>
            <Sidebar items={basicItems} collapsed={collapsed} />
            <div className="flex-1 p-lg">
              <h3 className="text-lg font-semibold">Responsive Sidebar</h3>
              <p className="mt-sm text-sm text-muted-foreground">
                Collapsed sidebar shows only icons. Hover over icons to see tooltips with labels.
              </p>
            </div>
          </div>
        </div>
      </ComponentPreview>

      <h2>Width Variants</h2>
      <ComponentPreview
        code={`<Sidebar items={items} width="sm" />  // w-60
<Sidebar items={items} width="md" />  // w-70 (default)
<Sidebar items={items} width="lg" />  // w-80`}
      >
        <div className="space-y-lg">
          <div>
            <h3 className="mb-sm text-sm font-semibold text-muted-foreground">Small (w-60)</h3>
            <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '300px' }}>
              <Sidebar items={basicItems} width="sm" />
              <div className="flex-1 p-md text-sm text-muted-foreground">Content area</div>
            </div>
          </div>
          <div>
            <h3 className="mb-sm text-sm font-semibold text-muted-foreground">Medium (w-70, Default)</h3>
            <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '300px' }}>
              <Sidebar items={basicItems} width="md" />
              <div className="flex-1 p-md text-sm text-muted-foreground">Content area</div>
            </div>
          </div>
          <div>
            <h3 className="mb-sm text-sm font-semibold text-muted-foreground">Large (w-80)</h3>
            <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '300px' }}>
              <Sidebar items={basicItems} width="lg" />
              <div className="flex-1 p-md text-sm text-muted-foreground">Content area</div>
            </div>
          </div>
        </div>
      </ComponentPreview>

      <h2>Right Position</h2>
      <ComponentPreview
        code={`<Sidebar items={items} position="right" />`}
      >
        <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '400px' }}>
          <div className="flex-1 p-lg">
            <h3 className="text-lg font-semibold">Main Content</h3>
            <p className="mt-sm text-sm text-muted-foreground">
              Sidebar can be positioned on the right side. Border appears on the left instead of right.
            </p>
          </div>
          <Sidebar items={basicItems} position="right" />
        </div>
      </ComponentPreview>

      <h2>Props</h2>
      <h3 className="text-lg font-semibold mb-md">Sidebar</h3>
      <PropsTable props={sidebarProps} />

      <h3 className="text-lg font-semibold mb-md mt-lg">SidebarItem Type</h3>
      <PropsTable props={sidebarItemProps} />

      <h3 className="text-lg font-semibold mb-md mt-lg">SidebarSection Type</h3>
      <PropsTable props={sidebarSectionProps} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For primary navigation in web applications</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When you have multiple navigation items that need persistent visibility</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For hierarchical navigation with parent/child relationships</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>In dashboard layouts where navigation needs to be always accessible</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use icons consistently across all navigation items</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep navigation item labels short and descriptive</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Group related items into sections for better organization</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Mark the current page with the active state</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Limit nesting to 2 levels to maintain simplicity</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use collapsed state on smaller screens to save space</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA role: navigation with aria-label</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Semantic HTML: Uses aside and nav elements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Current page: Marked with aria-current="page"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible: Tab and arrow key navigation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus indicators: Visible focus rings on all interactive elements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Collapsed state: Icons include title attribute for tooltips</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do's and Don'ts</h2>

      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        {/* Do's */}
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <span className="text-2xl">✓</span> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Group related navigation items into sections</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use icons to help users quickly identify menu items</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Highlight the current page with the active state</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Keep navigation labels concise and clear</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide a collapsed state for responsive layouts</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Sidebar sections={[
  {
    id: 'main',
    title: 'Main',
    items: [
      { id: 'home', label: 'Home', href: '/', icon: <Home />, active: true },
      { id: 'users', label: 'Users', href: '/users', icon: <Users /> },
    ],
  },
]} />`}
            >
              <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '200px' }}>
                <Sidebar
                  sections={[
                    {
                      id: 'main',
                      title: 'Main',
                      items: [
                        { id: 'home', label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, active: true },
                        { id: 'users', label: 'Users', href: '/users', icon: <Users className="h-4 w-4" /> },
                      ],
                    },
                  ]}
                />
                <div className="flex-1 p-md text-sm text-muted-foreground">Content</div>
              </div>
            </ComponentPreview>
          </div>
        </div>

        {/* Don'ts */}
        <div className="border-2 border-error bg-error/10 rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don't
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use long navigation labels that get truncated</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't nest navigation more than 2 levels deep</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't mix items with icons and items without icons</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't forget to mark the current page as active</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use sidebar for temporary or contextual navigation</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Sidebar items={[
  { id: 'long', label: 'Very Long Navigation Item Label That Gets Cut Off', href: '/' },
  { id: 'home', label: 'Home', icon: <Home /> }, // Mixed: one has icon, one doesn't
]} />`}
            >
              <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '200px' }}>
                <Sidebar
                  items={[
                    { id: 'long', label: 'Very Long Navigation Item Label That Gets Cut Off', href: '/' },
                    { id: 'home', label: 'Home', href: '/home', icon: <Home className="h-4 w-4" /> },
                  ]}
                />
                <div className="flex-1 p-md text-sm text-muted-foreground">Content</div>
              </div>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/tabs"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Tabs</h3>
          <p className="text-sm text-muted-foreground">For secondary navigation within a page</p>
        </Link>
        <Link
          href="/components/breadcrumb"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Breadcrumb</h3>
          <p className="text-sm text-muted-foreground">Show current location in hierarchy</p>
        </Link>
        <Link
          href="/components/link"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Link</h3>
          <p className="text-sm text-muted-foreground">For standalone navigation links</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/sidebar/sidebar.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"
              external
              showIcon
            >
              ARIA: Disclosure (Collapsible Sections) Pattern
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/tutorials/menus/"
              external
              showIcon
            >
              W3C: Menu Structure Tutorial
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/for-developers">
              Installation guide
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
