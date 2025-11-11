'use client';

import { Link } from '@fidus/ui/link';
import { List, ListItem } from '@fidus/ui/list';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';

export default function ListPage() {
  const props = [
    {
      name: 'variant',
      type: "'ordered' | 'unordered' | 'none'",
      default: "'unordered'",
      description: 'List marker style',
    },
    {
      name: 'spacing',
      type: "'none' | 'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Space between list items',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      required: true,
      description: 'List items',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>List</h1>
      <p className="lead">
        Organized lists for displaying sequential or related items. Supports ordered,
        unordered, and unmarked lists with configurable spacing.
      </p>

      <h2>Unordered List (Default)</h2>
      <ComponentPreview
        code={`<List>
  <ListItem>First item with bullet point</ListItem>
  <ListItem>Second item with bullet point</ListItem>
  <ListItem>Third item with bullet point</ListItem>
</List>`}
      >
        <List>
          <ListItem>First item with bullet point</ListItem>
          <ListItem>Second item with bullet point</ListItem>
          <ListItem>Third item with bullet point</ListItem>
        </List>
      </ComponentPreview>

      <h2>Ordered List</h2>
      <ComponentPreview
        code={`<List variant="ordered">
  <ListItem>First step in process</ListItem>
  <ListItem>Second step in process</ListItem>
  <ListItem>Third step in process</ListItem>
</List>`}
      >
        <List variant="ordered">
          <ListItem>First step in process</ListItem>
          <ListItem>Second step in process</ListItem>
          <ListItem>Third step in process</ListItem>
        </List>
      </ComponentPreview>

      <h2>List Without Markers</h2>
      <ComponentPreview
        code={`<List variant="none">
  <ListItem>Item without marker</ListItem>
  <ListItem>Item without marker</ListItem>
  <ListItem>Item without marker</ListItem>
</List>`}
      >
        <List variant="none">
          <ListItem>Item without marker</ListItem>
          <ListItem>Item without marker</ListItem>
          <ListItem>Item without marker</ListItem>
        </List>
      </ComponentPreview>

      <h2>Spacing Variations</h2>
      <ComponentPreview
        code={`<List spacing="sm">
  <ListItem>Compact spacing</ListItem>
  <ListItem>Compact spacing</ListItem>
  <ListItem>Compact spacing</ListItem>
</List>`}
      >
        <List spacing="sm">
          <ListItem>Compact spacing</ListItem>
          <ListItem>Compact spacing</ListItem>
          <ListItem>Compact spacing</ListItem>
        </List>
      </ComponentPreview>

      <ComponentPreview
        code={`<List spacing="lg">
  <ListItem>Generous spacing</ListItem>
  <ListItem>Generous spacing</ListItem>
  <ListItem>Generous spacing</ListItem>
</List>`}
      >
        <List spacing="lg">
          <ListItem>Generous spacing</ListItem>
          <ListItem>Generous spacing</ListItem>
          <ListItem>Generous spacing</ListItem>
        </List>
      </ComponentPreview>

      <h2>Nested Lists</h2>
      <ComponentPreview
        code={`<List>
  <ListItem>
    Parent Item 1
    <List variant="ordered">
      <ListItem>Nested item 1.1</ListItem>
      <ListItem>Nested item 1.2</ListItem>
    </List>
  </ListItem>
  <ListItem>Parent Item 2</ListItem>
</List>`}
      >
        <List>
          <ListItem>
            Parent Item 1
            <List variant="ordered">
              <ListItem>Nested item 1.1</ListItem>
              <ListItem>Nested item 1.2</ListItem>
            </List>
          </ListItem>
          <ListItem>Parent Item 2</ListItem>
        </List>
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
              <span>For displaying related items in sequence</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For step-by-step instructions (use ordered)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For feature lists and benefits</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For navigation menus (use variant="none")</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use ordered lists for sequential steps or rankings</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use unordered lists for related but unordered items</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use variant="none" for custom styled lists or navigation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep list items concise and scannable</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Limit nesting to 2-3 levels for readability</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Screen readers announce list type and item count</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Semantic HTML (ul, ol) provides proper structure</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Users can navigate by list item with screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Ordered lists communicate sequence to assistive technology</span>
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
              <span>Use ordered lists for sequential steps</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Keep list items concise and parallel in structure</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use appropriate spacing for content density</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<List variant="ordered">
  <ListItem>Review the requirements</ListItem>
  <ListItem>Design the solution</ListItem>
  <ListItem>Implement the feature</ListItem>
</List>`}
            >
              <List variant="ordered">
                <ListItem>Review the requirements</ListItem>
                <ListItem>Design the solution</ListItem>
                <ListItem>Implement the feature</ListItem>
              </List>
            </ComponentPreview>
          </div>
        </div>

        {/* Don'ts */}
        <div className="border-2 border-error rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don't
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't mix ordered and unordered lists at the same level</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use lists for non-list content like paragraphs</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't nest lists more than 3 levels deep</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<List>
  <ListItem>This is a very long paragraph of text that should not be in a list item because it makes the list difficult to scan and defeats the purpose of using a list structure for organizing information.</ListItem>
  <ListItem>Another lengthy paragraph.</ListItem>
</List>`}
            >
              <List>
                <ListItem>
                  This is a very long paragraph of text that should not be in a list item
                  because it makes the list difficult to scan and defeats the purpose of
                  using a list structure for organizing information.
                </ListItem>
                <ListItem>Another lengthy paragraph.</ListItem>
              </List>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/stack"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Stack
          </h3>
          <p className="text-sm text-muted-foreground">
            Layout component for vertical or horizontal spacing
          </p>
        </Link>

        <Link
          href="/components/card"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Card
          </h3>
          <p className="text-sm text-muted-foreground">
            Container for grouping related content
          </p>
        </Link>

        <Link
          href="/components/accordion"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Accordion
          </h3>
          <p className="text-sm text-muted-foreground">
            Collapsible content sections
          </p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/list/list.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html"
              external
              showIcon
            >
              WCAG: Info and Relationships
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
