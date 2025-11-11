'use client';

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@fidus/ui/table';
import { Badge } from '@fidus/ui/badge';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';

export default function TablePage() {
  const props = [
    {
      name: 'Table',
      type: 'Component',
      description: 'Root table wrapper with overflow handling',
    },
    {
      name: 'TableHeader',
      type: 'Component',
      description: 'Table header section (thead)',
    },
    {
      name: 'TableBody',
      type: 'Component',
      description: 'Table body section (tbody)',
    },
    {
      name: 'TableRow',
      type: 'Component',
      description: 'Table row with hover states',
    },
    {
      name: 'TableHead',
      type: 'Component',
      description: 'Table header cell (th)',
    },
    {
      name: 'TableCell',
      type: 'Component',
      description: 'Table data cell (td)',
    },
    {
      name: 'TableCaption',
      type: 'Component',
      description: 'Table caption for accessibility',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Table</h1>
      <p className="lead">
        A complete table component system for displaying structured data with proper semantics,
        styling, and accessibility features.
      </p>

      <h2>Basic Table</h2>
      <ComponentPreview
        code={`<Table>
  <TableCaption>A list of recent transactions</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Date</TableHead>
      <TableHead>Description</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>2025-01-28</TableCell>
      <TableCell>Office Supplies</TableCell>
      <TableCell>$45.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>2025-01-27</TableCell>
      <TableCell>Software License</TableCell>
      <TableCell>$299.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>2025-01-26</TableCell>
      <TableCell>Team Lunch</TableCell>
      <TableCell>$120.00</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
      >
        <Table>
          <TableCaption>A list of recent transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2025-01-28</TableCell>
              <TableCell>Office Supplies</TableCell>
              <TableCell>$45.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-01-27</TableCell>
              <TableCell>Software License</TableCell>
              <TableCell>$299.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-01-26</TableCell>
              <TableCell>Team Lunch</TableCell>
              <TableCell>$120.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ComponentPreview>

      <h2>With Status Badges</h2>
      <ComponentPreview
        code={`<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Task</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Priority</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Implement authentication</TableCell>
      <TableCell><Badge variant="success">Complete</Badge></TableCell>
      <TableCell><Badge variant="urgent">High</Badge></TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Write documentation</TableCell>
      <TableCell><Badge variant="warning">In Progress</Badge></TableCell>
      <TableCell><Badge variant="important">Medium</Badge></TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Code review</TableCell>
      <TableCell><Badge variant="info">Pending</Badge></TableCell>
      <TableCell><Badge variant="low">Low</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Implement authentication</TableCell>
              <TableCell><Badge variant="success">Complete</Badge></TableCell>
              <TableCell><Badge variant="urgent">High</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Write documentation</TableCell>
              <TableCell><Badge variant="warning">In Progress</Badge></TableCell>
              <TableCell><Badge variant="important">Medium</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Code review</TableCell>
              <TableCell><Badge variant="info">Pending</Badge></TableCell>
              <TableCell><Badge variant="low">Low</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ComponentPreview>

      <h2>Components</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For displaying structured, tabular data</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For comparison of items across multiple attributes</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For data that benefits from sorting or filtering</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When rows and columns have semantic meaning</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Always include TableCaption for accessibility</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use TableHead in TableHeader for column labels</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep tables simple - avoid nested tables</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Consider alternative layouts (cards) for mobile</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use proper semantic HTML structure</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Add hover states to help users scan rows</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>TableCaption provides context for screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Proper thead/tbody structure aids navigation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Table headers (th) are programmatically associated with data cells</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard users can navigate cell by cell</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Consider aria-label or aria-describedby for complex tables</span>
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
              <span>Always include a caption for accessibility</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use semantic table structure (thead, tbody)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Keep table data scannable with clear headers</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Table>
  <TableCaption>User list</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
            >
              <Table>
                <TableCaption>User list</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>john@example.com</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
              <span>Don't omit table captions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use tables for layout purposes</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't nest tables within table cells</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Table>
  {/* Missing caption! */}
  <TableBody>
    <TableRow>
      <TableCell>No headers</TableCell>
      <TableCell>Hard to understand</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
            >
              <Table>
                {/* Missing caption! */}
                <TableBody>
                  <TableRow>
                    <TableCell>No headers</TableCell>
                    <TableCell>Hard to understand</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/badge"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Badge
          </h3>
          <p className="text-sm text-muted-foreground">Display status indicators in table cells</p>
        </Link>

        <Link
          href="/components/card"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Card
          </h3>
          <p className="text-sm text-muted-foreground">Alternative layout for mobile devices</p>
        </Link>

        <Link
          href="/components/input"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Input
          </h3>
          <p className="text-sm text-muted-foreground">Filter and search table data</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/table/table.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/WCAG21/Techniques/html/H51.html"
              external
              showIcon
            >
              WCAG: Table Techniques
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
