'use client';

import { Pagination } from '@fidus/ui';
import { useState } from 'react';

export default function PaginationPage() {
  const [basicPage, setBasicPage] = useState(1);
  const [outlinedPage, setOutlinedPage] = useState(1);
  const [withoutFirstLastPage, setWithoutFirstLastPage] = useState(5);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Pagination</h1>
        <p className="text-lg text-muted-foreground">
          Navigation component for splitting content across multiple pages, with support for page size selection and keyboard navigation.
        </p>
      </div>

      {/* Import Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Import</h2>
          <div className="rounded-lg border border-border bg-muted p-4">
            <pre className="text-sm">
              <code>{`import { Pagination } from '@fidus/ui';

const [currentPage, setCurrentPage] = useState(1);

<Pagination
  currentPage={currentPage}
  totalPages={10}
  onPageChange={setCurrentPage}
/>`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Basic Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Pagination</h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div className="text-center text-sm text-muted-foreground">
              Current page: {basicPage} of 10
            </div>
            <Pagination
              currentPage={basicPage}
              totalPages={10}
              onPageChange={setBasicPage}
            />
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Variants</h2>
          <div className="space-y-8 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Default</h3>
              <Pagination
                currentPage={basicPage}
                totalPages={10}
                onPageChange={setBasicPage}
                variant="default"
              />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Outlined</h3>
              <Pagination
                currentPage={outlinedPage}
                totalPages={10}
                onPageChange={setOutlinedPage}
                variant="outlined"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Sizes</h2>
          <div className="space-y-8 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Small</h3>
              <Pagination
                currentPage={basicPage}
                totalPages={10}
                onPageChange={setBasicPage}
                size="sm"
              />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Medium (Default)</h3>
              <Pagination
                currentPage={basicPage}
                totalPages={10}
                onPageChange={setBasicPage}
                size="md"
              />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Large</h3>
              <Pagination
                currentPage={basicPage}
                totalPages={10}
                onPageChange={setBasicPage}
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Without First/Last */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Without First/Last Buttons</h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
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
        </div>
      </section>

      {/* With Page Size Selector */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Page Size Selector</h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
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
                setCurrentPage(1); // Reset to first page when page size changes
              }}
            />
          </div>
        </div>
      </section>

      {/* Different Page Counts */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Different Total Pages</h2>
          <div className="space-y-8 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Few pages (5 total)</h3>
              <p className="mb-2 text-xs text-muted-foreground">Shows all page numbers when total is 7 or less</p>
              <Pagination
                currentPage={1}
                totalPages={5}
                onPageChange={(page) => console.log('Page:', page)}
              />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Many pages (50 total, page 1)</h3>
              <p className="mb-2 text-xs text-muted-foreground">Shows ellipsis when needed</p>
              <Pagination
                currentPage={1}
                totalPages={50}
                onPageChange={(page) => console.log('Page:', page)}
              />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Many pages (50 total, page 25)</h3>
              <p className="mb-2 text-xs text-muted-foreground">Shows current page in middle with ellipsis on both sides</p>
              <Pagination
                currentPage={25}
                totalPages={50}
                onPageChange={(page) => console.log('Page:', page)}
              />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Many pages (50 total, page 48)</h3>
              <p className="mb-2 text-xs text-muted-foreground">Shows last pages when near the end</p>
              <Pagination
                currentPage={48}
                totalPages={50}
                onPageChange={(page) => console.log('Page:', page)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Combined Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Complete Example</h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of 15 ({pageSize} items per page)
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Showing items {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, 300)} of 300 total
              </p>
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
              variant="outlined"
              size="md"
            />
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
                  <td className="p-2 font-mono">currentPage</td>
                  <td className="p-2 font-mono text-xs">number</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Current active page (required, min: 1)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">totalPages</td>
                  <td className="p-2 font-mono text-xs">number</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Total number of pages (required, min: 1)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onPageChange</td>
                  <td className="p-2 font-mono text-xs">(page: number) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Callback when page changes (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showFirstLast</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Whether to show first/last page buttons</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">size</td>
                  <td className="p-2 font-mono text-xs">'sm' | 'md' | 'lg'</td>
                  <td className="p-2 font-mono text-xs">'md'</td>
                  <td className="p-2">Size of pagination controls</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">variant</td>
                  <td className="p-2 font-mono text-xs">'default' | 'outlined'</td>
                  <td className="p-2 font-mono text-xs">'default'</td>
                  <td className="p-2">Visual style of pagination</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">pageSize</td>
                  <td className="p-2 font-mono text-xs">number</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Current page size (enables page size selector)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">pageSizeOptions</td>
                  <td className="p-2 font-mono text-xs">number[]</td>
                  <td className="p-2 font-mono text-xs">[10, 20, 50, 100]</td>
                  <td className="p-2">Available page size options</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onPageSizeChange</td>
                  <td className="p-2 font-mono text-xs">(size: number) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Callback when page size changes</td>
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

      {/* Accessibility */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Accessibility</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>ARIA role: navigation with aria-label="pagination"</li>
            <li>Current page: Marked with aria-current="page"</li>
            <li>Keyboard accessible: Tab to navigate, Enter/Space to activate</li>
            <li>Disabled states: Properly disabled when on first/last page</li>
            <li>Clear labels: aria-label on all navigation buttons</li>
            <li>Page size selector: Properly labeled with associated label element</li>
            <li>Focus indicators: Visible focus rings on all interactive elements</li>
            <li>Screen reader friendly: Descriptive labels for all controls</li>
          </ul>
        </div>
      </section>

      {/* Usage Notes */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Usage Notes</h2>
          <div className="space-y-4 rounded-lg border border-border bg-muted p-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold">Ellipsis Logic</h3>
              <p className="text-sm text-muted-foreground">
                When there are more than 7 pages, the component intelligently shows ellipsis:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Near start: [1, 2, 3, 4, ..., Last]</li>
                <li>In middle: [1, ..., Current-1, Current, Current+1, ..., Last]</li>
                <li>Near end: [1, ..., Last-3, Last-2, Last-1, Last]</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">Page Size Changes</h3>
              <p className="text-sm text-muted-foreground">
                When page size changes, you typically want to reset to page 1 to avoid showing an empty page.
                Remember to recalculate totalPages based on your total item count and new page size.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">Responsive Design</h3>
              <p className="text-sm text-muted-foreground">
                The component uses flexbox with flex-col on mobile and flex-row on desktop (sm breakpoint).
                Page size selector stacks below pagination on mobile for better usability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
