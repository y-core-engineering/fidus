'use client';

import { Breadcrumbs } from '@fidus/ui';
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

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Breadcrumbs</h1>
        <p className="text-lg text-muted-foreground">
          Navigation component that shows the current page location within a hierarchical structure, helping users understand where they are and navigate back.
        </p>
      </div>

      {/* Import Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Import</h2>
          <div className="rounded-lg border border-border bg-muted p-4">
            <pre className="text-sm">
              <code>{`import { Breadcrumbs } from '@fidus/ui';

<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Laptops' }
  ]}
/>`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Basic Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Breadcrumbs</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Breadcrumbs items={basicItems} />
          </div>
        </div>
      </section>

      {/* Separators */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Separators</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Chevron (Default)</h3>
              <Breadcrumbs items={basicItems} separator="chevron" />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Slash</h3>
              <Breadcrumbs items={basicItems} separator="slash" />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Dot</h3>
              <Breadcrumbs items={basicItems} separator="dot" />
            </div>
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Sizes</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Small</h3>
              <Breadcrumbs items={basicItems} size="sm" />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Medium (Default)</h3>
              <Breadcrumbs items={basicItems} size="md" />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Large</h3>
              <Breadcrumbs items={basicItems} size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Icons</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Breadcrumbs items={withIconsItems} />
          </div>
        </div>
      </section>

      {/* Truncation */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Truncation with maxItems</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Full Path (7 items)</h3>
              <Breadcrumbs items={longItems} />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Truncated to 5 items</h3>
              <p className="mb-2 text-xs text-muted-foreground">
                Shows first item, ellipsis, then last 4 items
              </p>
              <Breadcrumbs items={longItems} maxItems={5} />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Truncated to 4 items</h3>
              <p className="mb-2 text-xs text-muted-foreground">
                Shows first item, ellipsis, then last 3 items
              </p>
              <Breadcrumbs items={longItems} maxItems={4} />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Truncated to 3 items</h3>
              <p className="mb-2 text-xs text-muted-foreground">
                Shows first item, ellipsis, then last 2 items
              </p>
              <Breadcrumbs items={longItems} maxItems={3} />
            </div>
          </div>
        </div>
      </section>

      {/* Current Page Styling */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Current Page Styling</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="mb-4 text-sm text-muted-foreground">
              The last item (current page) is styled differently: it has no link, uses font-medium, and includes aria-current="page" for accessibility.
            </p>
            <Breadcrumbs
              items={[
                { label: 'Products', href: '/products' },
                { label: 'Laptops', href: '/products/laptops' },
                { label: 'MacBook Pro 16"' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Different Separator Styles */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Combining Size and Separator</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Small with Slash</h3>
              <Breadcrumbs items={basicItems} size="sm" separator="slash" />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Medium with Dot</h3>
              <Breadcrumbs items={basicItems} size="md" separator="dot" />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Large with Chevron</h3>
              <Breadcrumbs items={basicItems} size="lg" separator="chevron" />
            </div>
          </div>
        </div>
      </section>

      {/* Props Table */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Props</h2>
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
                  <td className="p-2 font-mono">items</td>
                  <td className="p-2 font-mono text-xs">BreadcrumbItem[]</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Array of breadcrumb items (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">separator</td>
                  <td className="p-2 font-mono text-xs">'chevron' | 'slash' | 'dot'</td>
                  <td className="p-2 font-mono text-xs">'chevron'</td>
                  <td className="p-2">Separator icon between items</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">size</td>
                  <td className="p-2 font-mono text-xs">'sm' | 'md' | 'lg'</td>
                  <td className="p-2 font-mono text-xs">'md'</td>
                  <td className="p-2">Size of breadcrumbs</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">maxItems</td>
                  <td className="p-2 font-mono text-xs">number</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Maximum items to show (min: 2). Truncates with ellipsis if exceeded</td>
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

      {/* BreadcrumbItem Type */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">BreadcrumbItem Type</h2>
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
                  <td className="p-2 font-mono">label</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 font-mono text-xs">Yes</td>
                  <td className="p-2">Display text for the breadcrumb</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">href</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 font-mono text-xs">No</td>
                  <td className="p-2">Link URL. If omitted, item is not clickable (current page)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">icon</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 font-mono text-xs">No</td>
                  <td className="p-2">Optional icon to display before label</td>
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
            <li>ARIA role: navigation with aria-label="breadcrumb"</li>
            <li>Semantic HTML: Uses nav and ol elements</li>
            <li>Current page: Marked with aria-current="page"</li>
            <li>Keyboard accessible: Tab to navigate between links</li>
            <li>Focus indicators: Visible focus rings on keyboard navigation</li>
            <li>Screen reader friendly: Proper hierarchy and structure</li>
            <li>Separators: Marked with aria-hidden="true" to avoid clutter</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
