'use client';

import { Breadcrumbs } from '@fidus/ui/breadcrumbs';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { Home, Folder, File } from 'lucide-react';

export default function BreadcrumbsPage() {
  const basicItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Laptops' },
  ];

  const withIconsItems = [
    { label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
    { label: 'Documents', href: '/documents', icon: <Folder className="h-4 w-4" /> },
    { label: 'Projects', href: '/documents/projects', icon: <Folder className="h-4 w-4" /> },
    { label: 'report.pdf', icon: <File className="h-4 w-4" /> },
  ];

  const longItems = [
    { label: 'Home', href: '/' },
    { label: 'Category', href: '/category' },
    { label: 'Subcategory', href: '/category/subcategory' },
    { label: 'Item Type', href: '/category/subcategory/type' },
    { label: 'Brand', href: '/category/subcategory/type/brand' },
    { label: 'Model', href: '/category/subcategory/type/brand/model' },
    { label: 'Product Details' },
  ];

  const props = [
    {
      name: 'items',
      type: 'BreadcrumbItem[]',
      required: true,
      description: 'Array of breadcrumb items to display',
    },
    {
      name: 'separator',
      type: "'chevron' | 'slash' | 'dot'",
      default: "'chevron'",
      description: 'Separator icon between items',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of breadcrumbs',
    },
    {
      name: 'maxItems',
      type: 'number',
      description: 'Maximum items to show (min: 2). Truncates with ellipsis if exceeded',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes',
    },
  ];

  const itemTypeProps = [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Display text for the breadcrumb',
    },
    {
      name: 'href',
      type: 'string',
      description: 'Link URL. If omitted, item is not clickable (current page)',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Optional icon to display before label',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Breadcrumbs</h1>
      <p className="lead">
        Navigation component that shows the current page location within a hierarchical structure, helping users understand where they are and navigate back.
      </p>

      <h2>Basic Usage</h2>
      <ComponentPreview
        code={`<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Laptops' }
  ]}
/>`}
      >
        <Breadcrumbs items={basicItems} />
      </ComponentPreview>

      <h2>Separators</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <Breadcrumbs items={items} separator="chevron" />
  <Breadcrumbs items={items} separator="slash" />
  <Breadcrumbs items={items} separator="dot" />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Chevron (Default)</h3>
            <Breadcrumbs items={basicItems} separator="chevron" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Slash</h3>
            <Breadcrumbs items={basicItems} separator="slash" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Dot</h3>
            <Breadcrumbs items={basicItems} separator="dot" />
          </div>
        </Stack>
      </ComponentPreview>

      <h2>Sizes</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <Breadcrumbs items={items} size="sm" />
  <Breadcrumbs items={items} size="md" />
  <Breadcrumbs items={items} size="lg" />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Small</h3>
            <Breadcrumbs items={basicItems} size="sm" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Medium (Default)</h3>
            <Breadcrumbs items={basicItems} size="md" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Large</h3>
            <Breadcrumbs items={basicItems} size="lg" />
          </div>
        </Stack>
      </ComponentPreview>

      <h2>With Icons</h2>
      <ComponentPreview
        code={`<Breadcrumbs
  items={[
    { label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
    { label: 'Documents', href: '/documents', icon: <Folder className="h-4 w-4" /> },
    { label: 'Projects', href: '/documents/projects', icon: <Folder className="h-4 w-4" /> },
    { label: 'report.pdf', icon: <File className="h-4 w-4" /> }
  ]}
/>`}
      >
        <Breadcrumbs items={withIconsItems} />
      </ComponentPreview>

      <h2>Truncation with maxItems</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <Breadcrumbs items={longItems} />
  <Breadcrumbs items={longItems} maxItems={5} />
  <Breadcrumbs items={longItems} maxItems={4} />
  <Breadcrumbs items={longItems} maxItems={3} />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Full Path (7 items)</h3>
            <Breadcrumbs items={longItems} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Truncated to 5 items</h3>
            <p className="text-xs text-muted-foreground mb-xs">
              Shows first item, ellipsis, then last 4 items
            </p>
            <Breadcrumbs items={longItems} maxItems={5} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Truncated to 4 items</h3>
            <p className="text-xs text-muted-foreground mb-xs">
              Shows first item, ellipsis, then last 3 items
            </p>
            <Breadcrumbs items={longItems} maxItems={4} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Truncated to 3 items</h3>
            <p className="text-xs text-muted-foreground mb-xs">
              Shows first item, ellipsis, then last 2 items
            </p>
            <Breadcrumbs items={longItems} maxItems={3} />
          </div>
        </Stack>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>BreadcrumbItem Type</h2>
      <PropsTable props={itemTypeProps} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For hierarchical navigation showing the path to the current page</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>In applications with deep navigation structures (e.g., e-commerce categories)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When users need to navigate back to parent pages quickly</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To provide context about the current location in the site structure</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep labels concise and clear - avoid overly long text</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>The last item should always be the current page (no href)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use maxItems for deep hierarchies to prevent overflow</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Place breadcrumbs near the top of the page, above the main heading</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use consistent separator styles throughout your application</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Uses semantic HTML with nav and ol elements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Includes aria-label="breadcrumb" on navigation landmark</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Current page marked with aria-current="page"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Separators have aria-hidden="true" to avoid screen reader clutter</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible with visible focus indicators</span>
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
              <span>Use breadcrumbs for hierarchical navigation with 3+ levels</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Keep labels short and descriptive</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Make the current page (last item) non-clickable</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use maxItems to truncate very long paths</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Place breadcrumbs near the top of the page</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Laptops' }
  ]}
/>`}
            >
              <Breadcrumbs
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Products', href: '/products' },
                  { label: 'Laptops' },
                ]}
              />
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
              <span>Don't use breadcrumbs for single-level navigation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't make the current page clickable</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use overly long labels that wrap to multiple lines</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't mix different separator styles on the same page</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't show breadcrumbs that don't match the actual page hierarchy</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Breadcrumbs
  items={[
    { label: 'This is a very long breadcrumb label that wraps to multiple lines', href: '/' },
    { label: 'Current Page', href: '/current' } // Current page should not have href!
  ]}
/>`}
            >
              <Breadcrumbs
                items={[
                  { label: 'Very Long Label That Wraps', href: '/' },
                  { label: 'Current Page', href: '/current' },
                ]}
              />
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/link"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Link</h3>
          <p className="text-sm text-muted-foreground">Basic navigation links</p>
        </Link>
        <Link
          href="/components/tabs"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Tabs</h3>
          <p className="text-sm text-muted-foreground">Organize content into sections</p>
        </Link>
        <Link
          href="/components/navigation-menu"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Navigation Menu</h3>
          <p className="text-sm text-muted-foreground">Primary site navigation</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/breadcrumbs/breadcrumbs.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/"
              external
              showIcon
            >
              ARIA: Breadcrumb Pattern
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
