'use client';

import { Pagination } from '@fidus/ui/pagination';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { useState } from 'react';

export default function PaginationPage() {
  const [basicPage, setBasicPage] = useState(1);
  const [outlinedPage, setOutlinedPage] = useState(1);
  const [withoutFirstLastPage, setWithoutFirstLastPage] = useState(5);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const props = [
    {
      name: 'currentPage',
      type: 'number',
      required: true,
      description: 'Current active page (min: 1)',
    },
    {
      name: 'totalPages',
      type: 'number',
      required: true,
      description: 'Total number of pages (min: 1)',
    },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      required: true,
      description: 'Callback when page changes',
    },
    {
      name: 'showFirstLast',
      type: 'boolean',
      default: 'true',
      description: 'Whether to show first/last page buttons',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of pagination controls',
    },
    {
      name: 'variant',
      type: "'default' | 'outlined'",
      default: "'default'",
      description: 'Visual style of pagination',
    },
    {
      name: 'pageSize',
      type: 'number',
      description: 'Current page size (enables page size selector)',
    },
    {
      name: 'pageSizeOptions',
      type: 'number[]',
      default: '[10, 20, 50, 100]',
      description: 'Available page size options',
    },
    {
      name: 'onPageSizeChange',
      type: '(size: number) => void',
      description: 'Callback when page size changes',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Pagination</h1>
      <p className="lead">
        Navigation component for splitting content across multiple pages, with support for page size selection and keyboard navigation.
      </p>

      <h2>Basic Usage</h2>
      <ComponentPreview
        code={`const [currentPage, setCurrentPage] = useState(1);

<Pagination
  currentPage={currentPage}
  totalPages={10}
  onPageChange={setCurrentPage}
/>`}
      >
        <div className="space-y-md">
          <div className="text-center text-sm text-muted-foreground">
            Current page: {basicPage} of 10
          </div>
          <Pagination
            currentPage={basicPage}
            totalPages={10}
            onPageChange={setBasicPage}
          />
        </div>
      </ComponentPreview>

      <h2>Variants</h2>
      <ComponentPreview code={`<Pagination variant="default" currentPage={1} totalPages={10} onPageChange={setPage} />`}>
        <Stack direction="vertical" spacing="lg">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Default</h3>
            <Pagination
              currentPage={basicPage}
              totalPages={10}
              onPageChange={setBasicPage}
              variant="default"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Outlined</h3>
            <Pagination
              currentPage={outlinedPage}
              totalPages={10}
              onPageChange={setOutlinedPage}
              variant="outlined"
            />
          </div>
        </Stack>
      </ComponentPreview>

      <h2>Sizes</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <Pagination size="sm" currentPage={1} totalPages={10} onPageChange={setPage} />
  <Pagination size="md" currentPage={1} totalPages={10} onPageChange={setPage} />
  <Pagination size="lg" currentPage={1} totalPages={10} onPageChange={setPage} />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Small</h3>
            <Pagination
              currentPage={basicPage}
              totalPages={10}
              onPageChange={setBasicPage}
              size="sm"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Medium (Default)</h3>
            <Pagination
              currentPage={basicPage}
              totalPages={10}
              onPageChange={setBasicPage}
              size="md"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Large</h3>
            <Pagination
              currentPage={basicPage}
              totalPages={10}
              onPageChange={setBasicPage}
              size="lg"
            />
          </div>
        </Stack>
      </ComponentPreview>

      <h2>Without First/Last Buttons</h2>
      <ComponentPreview
        code={`<Pagination
  currentPage={5}
  totalPages={20}
  onPageChange={setPage}
  showFirstLast={false}
/>`}
      >
        <div className="space-y-md">
          <div className="text-center text-sm text-muted-foreground">
            Current page: {withoutFirstLastPage} of 20
          </div>
          <Pagination
            currentPage={withoutFirstLastPage}
            totalPages={20}
            onPageChange={setWithoutFirstLastPage}
            showFirstLast={false}
          />
        </div>
      </ComponentPreview>

      <h2>With Page Size Selector</h2>
      <ComponentPreview
        code={`<Pagination
  currentPage={currentPage}
  totalPages={15}
  onPageChange={setCurrentPage}
  pageSize={pageSize}
  pageSizeOptions={[10, 20, 50, 100]}
  onPageSizeChange={(newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }}
/>`}
      >
        <div className="space-y-md">
          <div className="text-center text-sm text-muted-foreground">
            Showing page {currentPage} of 15 with {pageSize} items per page
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={15}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50, 100]}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      </ComponentPreview>

      <h2>Page Range Examples</h2>
      <ComponentPreview
        code={`// Shows all pages when total is 7 or less
<Pagination currentPage={1} totalPages={5} onPageChange={setPage} />

// Shows ellipsis for many pages
<Pagination currentPage={25} totalPages={50} onPageChange={setPage} />`}
      >
        <Stack direction="vertical" spacing="lg">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Few pages (5 total)</h3>
            <p className="text-xs text-muted-foreground mb-sm">Shows all page numbers when total is 7 or less</p>
            <Pagination
              currentPage={1}
              totalPages={5}
              onPageChange={(page) => console.log('Page:', page)}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Many pages (50 total, page 1)</h3>
            <p className="text-xs text-muted-foreground mb-sm">Shows ellipsis when needed</p>
            <Pagination
              currentPage={1}
              totalPages={50}
              onPageChange={(page) => console.log('Page:', page)}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Many pages (50 total, page 25)</h3>
            <p className="text-xs text-muted-foreground mb-sm">Shows current page in middle with ellipsis on both sides</p>
            <Pagination
              currentPage={25}
              totalPages={50}
              onPageChange={(page) => console.log('Page:', page)}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-sm">Many pages (50 total, page 48)</h3>
            <p className="text-xs text-muted-foreground mb-sm">Shows last pages when near the end</p>
            <Pagination
              currentPage={48}
              totalPages={50}
              onPageChange={(page) => console.log('Page:', page)}
            />
          </div>
        </Stack>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For large datasets that need to be split across multiple pages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For tables with many rows that would be overwhelming on one page</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When users need to navigate between pages of content systematically</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For search results or list views with many items</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show total page count to help users understand the data size</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Reset to page 1 when page size changes to avoid empty pages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Display item range (e.g., "Showing 21-40 of 100") for context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use appropriate page size defaults (10-50 items) based on content type</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Consider infinite scroll for mobile or casual browsing experiences</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Disable navigation buttons when on first/last page to prevent confusion</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Navigation role with aria-label="pagination" for screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Current page marked with aria-current="page"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible with Tab navigation and Enter/Space activation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Clear aria-labels on all navigation buttons (First, Previous, Next, Last)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Visible focus indicators on all interactive elements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Page size selector properly labeled with associated label element</span>
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
              <span>Show item range and total count for context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Reset to page 1 when changing page size</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use ellipsis (...) for large page ranges</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide reasonable page size options (10, 20, 50, 100)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Disable navigation when on first/last page</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<div className="space-y-md">
  <div className="text-sm text-muted-foreground">
    Showing 21-40 of 100 items
  </div>
  <Pagination
    currentPage={2}
    totalPages={5}
    onPageChange={setPage}
  />
</div>`}
            >
              <div className="space-y-md">
                <div className="text-sm text-muted-foreground">
                  Showing 21-40 of 100 items
                </div>
                <Pagination
                  currentPage={2}
                  totalPages={5}
                  onPageChange={(page) => console.log('Page:', page)}
                />
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
              <span>Don't show pagination without context (no item counts)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use pagination for small datasets (less than 20 items)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't show all page numbers when there are 50+ pages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't forget to recalculate total pages when page size changes</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't enable navigation buttons when they have no action</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`// No context - user doesn't know what they're paginating
<Pagination
  currentPage={2}
  totalPages={5}
  onPageChange={setPage}
/>`}
            >
              <Pagination
                currentPage={2}
                totalPages={5}
                onPageChange={(page) => console.log('Page:', page)}
              />
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/table"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Table</h3>
          <p className="text-sm text-muted-foreground">Display tabular data with pagination</p>
        </Link>
        <Link
          href="/components/select"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Select</h3>
          <p className="text-sm text-muted-foreground">Used for page size selection</p>
        </Link>
        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Button</h3>
          <p className="text-sm text-muted-foreground">Navigation buttons in pagination</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/pagination/pagination.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/link/"
              external
              showIcon
            >
              ARIA: Link Pattern
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
