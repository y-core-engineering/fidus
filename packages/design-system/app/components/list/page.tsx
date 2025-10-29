'use client';

import { List, ListItem } from '@fidus/ui';
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
      <h3>When to use</h3>
      <ul>
        <li>For displaying related items in sequence</li>
        <li>For step-by-step instructions (use ordered)</li>
        <li>For feature lists and benefits</li>
        <li>For navigation menus (use variant="none")</li>
      </ul>

      <h3>Best practices</h3>
      <ul>
        <li>Use ordered lists for sequential steps or rankings</li>
        <li>Use unordered lists for related but unordered items</li>
        <li>Use variant="none" for custom styled lists or navigation</li>
        <li>Keep list items concise and scannable</li>
        <li>Limit nesting to 2-3 levels for readability</li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>Screen readers announce list type and item count</li>
        <li>Semantic HTML (ul, ol) provides proper structure</li>
        <li>Users can navigate by list item with screen readers</li>
        <li>Ordered lists communicate sequence to assistive technology</li>
      </ul>
    </div>
  );
}
