'use client';

import {
  Sidebar,
  SidebarRoot,
  SidebarSection,
  SidebarItem,
} from '@fidus/ui';
import { Button } from '@fidus/ui';
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

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Sidebar</h1>
        <p className="text-lg text-muted-foreground">
          Navigation sidebar component with support for nested items, collapsible sections, icons, and collapsed state. Ideal for application layouts.
        </p>
      </div>

      {/* Import Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Import</h2>
          <div className="rounded-lg border border-border bg-muted p-4">
            <pre className="text-sm">
              <code>{`import { Sidebar, SidebarRoot, SidebarSection, SidebarItem } from '@fidus/ui';

// Simple usage with items array
<Sidebar items={items} />

// With sections for organization
<Sidebar sections={sections} />

// Composable API for full control
<SidebarRoot>
  <SidebarSection section={section} renderItem={renderItem} />
</SidebarRoot>`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Basic Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Sidebar</h2>
          <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '400px' }}>
            <Sidebar items={basicItems} />
            <div className="flex-1 p-6">
              <h3 className="text-lg font-semibold">Main Content Area</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Content appears here alongside the sidebar navigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* With Sections */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Sections</h2>
          <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '500px' }}>
            <Sidebar sections={sections} />
            <div className="flex-1 p-6">
              <h3 className="text-lg font-semibold">Organized Navigation</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Sections group related navigation items. Some sections are collapsible and can start collapsed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nested Items */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Nested Navigation</h2>
          <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '500px' }}>
            <Sidebar items={nestedItems} />
            <div className="flex-1 p-6">
              <h3 className="text-lg font-semibold">Hierarchical Navigation</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Click parent items to expand/collapse nested children. Great for complex navigation structures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collapsed State */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Collapsed State</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? 'Expand' : 'Collapse'} Sidebar
              </Button>
              <span className="text-sm text-muted-foreground">
                {collapsed ? 'Collapsed (w-16)' : 'Expanded (w-70)'}
              </span>
            </div>
            <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '400px' }}>
              <Sidebar items={basicItems} collapsed={collapsed} />
              <div className="flex-1 p-6">
                <h3 className="text-lg font-semibold">Responsive Sidebar</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Collapsed sidebar shows only icons. Hover over icons to see tooltips with labels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Width Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Width Variants</h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Small (w-60)</h3>
              <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '300px' }}>
                <Sidebar items={basicItems} width="sm" />
                <div className="flex-1 p-4 text-sm text-muted-foreground">Content area</div>
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Medium (w-70, Default)</h3>
              <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '300px' }}>
                <Sidebar items={basicItems} width="md" />
                <div className="flex-1 p-4 text-sm text-muted-foreground">Content area</div>
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Large (w-80)</h3>
              <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '300px' }}>
                <Sidebar items={basicItems} width="lg" />
                <div className="flex-1 p-4 text-sm text-muted-foreground">Content area</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Position Right */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Right Position</h2>
          <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '400px' }}>
            <div className="flex-1 p-6">
              <h3 className="text-lg font-semibold">Main Content</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Sidebar can be positioned on the right side. Border appears on the left instead of right.
              </p>
            </div>
            <Sidebar items={basicItems} position="right" />
          </div>
        </div>
      </section>

      {/* E-commerce Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">E-commerce Dashboard Example</h2>
          <div className="flex rounded-lg border border-border bg-card overflow-hidden" style={{ height: '600px' }}>
            <Sidebar
              sections={[
                {
                  id: 'overview',
                  title: 'Overview',
                  items: [
                    { id: 'dashboard', label: 'Dashboard', href: '/', icon: <Home className="h-4 w-4" />, active: true },
                    { id: 'analytics', label: 'Analytics', href: '/analytics', icon: <BarChart className="h-4 w-4" /> },
                  ],
                },
                {
                  id: 'sales',
                  title: 'Sales',
                  collapsible: true,
                  items: [
                    { id: 'orders', label: 'Orders', href: '/orders', icon: <ShoppingCart className="h-4 w-4" /> },
                    { id: 'products', label: 'Products', href: '/products', icon: <Package className="h-4 w-4" /> },
                    { id: 'customers', label: 'Customers', href: '/customers', icon: <Users className="h-4 w-4" /> },
                  ],
                },
                {
                  id: 'operations',
                  title: 'Operations',
                  collapsible: true,
                  items: [
                    { id: 'inventory', label: 'Inventory', href: '/inventory', icon: <Package className="h-4 w-4" /> },
                    { id: 'shipping', label: 'Shipping', href: '/shipping', icon: <Truck className="h-4 w-4" /> },
                    { id: 'pricing', label: 'Pricing', href: '/pricing', icon: <Tag className="h-4 w-4" /> },
                  ],
                },
                {
                  id: 'finance',
                  title: 'Finance',
                  collapsible: true,
                  defaultCollapsed: true,
                  items: [
                    { id: 'revenue', label: 'Revenue', href: '/revenue', icon: <DollarSign className="h-4 w-4" /> },
                    { id: 'expenses', label: 'Expenses', href: '/expenses', icon: <DollarSign className="h-4 w-4" /> },
                  ],
                },
              ]}
            />
            <div className="flex-1 p-6">
              <h3 className="text-lg font-semibold">Dashboard</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Complex e-commerce navigation with multiple collapsible sections and various menu items.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Props Table - Sidebar */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Props - Sidebar (Convenience Wrapper)</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-left font-semibold">Prop</th>
                  <th className="p-2 text-left font-semibold">Type</th>
                  <th className="p-2 text-left font-semibold">Default</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">sections</td>
                  <td className="p-2 font-mono text-xs">SidebarSection[]</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Array of sections with grouped items</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">items</td>
                  <td className="p-2 font-mono text-xs">SidebarItem[]</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Array of items (alternative to sections)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">collapsed</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether sidebar is collapsed (shows icons only)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onCollapse</td>
                  <td className="p-2 font-mono text-xs">(collapsed: boolean) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Callback when collapse state changes</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">position</td>
                  <td className="p-2 font-mono text-xs">'left' | 'right'</td>
                  <td className="p-2 font-mono text-xs">'left'</td>
                  <td className="p-2">Sidebar position</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">width</td>
                  <td className="p-2 font-mono text-xs">'sm' | 'md' | 'lg'</td>
                  <td className="p-2 font-mono text-xs">'md'</td>
                  <td className="p-2">Width of expanded sidebar</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">className</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Additional CSS classes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SidebarItem Type */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">SidebarItem Type</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-left font-semibold">Property</th>
                  <th className="p-2 text-left font-semibold">Type</th>
                  <th className="p-2 text-left font-semibold">Required</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">id</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 font-mono text-xs">Yes</td>
                  <td className="p-2">Unique identifier for the item</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">label</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 font-mono text-xs">Yes</td>
                  <td className="p-2">Display text for the item</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">href</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 font-mono text-xs">No</td>
                  <td className="p-2">Link destination (omit for parent items)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">icon</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 font-mono text-xs">No</td>
                  <td className="p-2">Icon to display before label</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">active</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">No</td>
                  <td className="p-2">Whether this is the current page</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">children</td>
                  <td className="p-2 font-mono text-xs">SidebarItem[]</td>
                  <td className="p-2 font-mono text-xs">No</td>
                  <td className="p-2">Nested child items</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SidebarSection Type */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">SidebarSection Type</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-left font-semibold">Property</th>
                  <th className="p-2 text-left font-semibold">Type</th>
                  <th className="p-2 text-left font-semibold">Required</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">id</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 font-mono text-xs">Yes</td>
                  <td className="p-2">Unique identifier for the section</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">title</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 font-mono text-xs">No</td>
                  <td className="p-2">Section header title</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">items</td>
                  <td className="p-2 font-mono text-xs">SidebarItem[]</td>
                  <td className="p-2 font-mono text-xs">Yes</td>
                  <td className="p-2">Items in this section</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">collapsible</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">No</td>
                  <td className="p-2">Whether section can be collapsed</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">defaultCollapsed</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">No</td>
                  <td className="p-2">Whether section starts collapsed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Accessibility</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>ARIA role: navigation with aria-label</li>
            <li>Semantic HTML: Uses aside and nav elements</li>
            <li>Current page: Marked with aria-current="page"</li>
            <li>Keyboard accessible: Tab and arrow key navigation</li>
            <li>Focus indicators: Visible focus rings on all interactive elements</li>
            <li>Collapsed state: Icons include title attribute for tooltips</li>
            <li>Collapsible sections: Proper button semantics and expand/collapse icons</li>
            <li>Nested navigation: Proper hierarchy and indentation</li>
          </ul>
        </div>
      </section>

      {/* Usage Notes */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Usage Notes</h2>
          <div className="space-y-4 rounded-lg border border-border bg-muted p-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold">Layout Integration</h3>
              <p className="text-sm text-muted-foreground">
                Use Sidebar with a flex layout. The sidebar is a fixed-width aside element, and your main content should be flex-1.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">Nested Navigation</h3>
              <p className="text-sm text-muted-foreground">
                Items with children are expandable. Clicking them toggles the nested items. Nested items have increased left padding for visual hierarchy.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">Collapsed State</h3>
              <p className="text-sm text-muted-foreground">
                In collapsed state (width: 64px), only icons are visible. Labels are hidden but available as tooltips via title attribute.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">Section Organization</h3>
              <p className="text-sm text-muted-foreground">
                Use sections to group related navigation items. Sections can be collapsible for better space management in complex navigation structures.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
