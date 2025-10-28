import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@fidus/ui';
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
      <h3>When to use</h3>
      <ul>
        <li>For displaying structured, tabular data</li>
        <li>For comparison of items across multiple attributes</li>
        <li>For data that benefits from sorting or filtering</li>
        <li>When rows and columns have semantic meaning</li>
      </ul>

      <h3>Best practices</h3>
      <ul>
        <li>Always include TableCaption for accessibility</li>
        <li>Use TableHead in TableHeader for column labels</li>
        <li>Keep tables simple - avoid nested tables</li>
        <li>Consider alternative layouts (cards) for mobile</li>
        <li>Use proper semantic HTML structure</li>
        <li>Add hover states help users scan rows</li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>TableCaption provides context for screen readers</li>
        <li>Proper thead/tbody structure aids navigation</li>
        <li>Table headers (th) are programmatically associated with data cells</li>
        <li>Keyboard users can navigate cell by cell</li>
        <li>Consider aria-label or aria-describedby for complex tables</li>
      </ul>
    </div>
  );
}
