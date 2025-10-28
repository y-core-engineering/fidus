'use client';

import { Chip, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';

export default function ChipPage() {
  const props = [
    {
      name: 'variant',
      type: "'filled' | 'outlined'",
      default: "'filled'",
      description: 'Visual style variant',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Chip size',
    },
    {
      name: 'dismissible',
      type: 'boolean',
      default: 'false',
      description: 'Show dismiss button',
    },
    {
      name: 'onDismiss',
      type: '() => void',
      description: 'Callback when chip is dismissed',
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
      description: 'Chip content',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Chip</h1>
      <p className="lead">
        Compact elements representing tags, filters, or selections. Can be dismissible
        for dynamic tag management.
      </p>

      <h2>Variants</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md">
  <Chip variant="filled">Filled Chip</Chip>
  <Chip variant="outlined">Outlined Chip</Chip>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" wrap>
          <Chip variant="filled">Filled Chip</Chip>
          <Chip variant="outlined">Outlined Chip</Chip>
        </Stack>
      </ComponentPreview>

      <h2>Sizes</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md" align="center">
  <Chip size="sm">Small</Chip>
  <Chip size="md">Medium</Chip>
  <Chip size="lg">Large</Chip>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" align="center">
          <Chip size="sm">Small</Chip>
          <Chip size="md">Medium</Chip>
          <Chip size="lg">Large</Chip>
        </Stack>
      </ComponentPreview>

      <h2>Dismissible Chips</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md">
  <Chip dismissible onDismiss={() => console.log('Dismissed')}>
    React
  </Chip>
  <Chip dismissible onDismiss={() => console.log('Dismissed')}>
    TypeScript
  </Chip>
  <Chip dismissible onDismiss={() => console.log('Dismissed')}>
    Next.js
  </Chip>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" wrap>
          <Chip dismissible onDismiss={() => console.log('Dismissed')}>
            React
          </Chip>
          <Chip dismissible onDismiss={() => console.log('Dismissed')}>
            TypeScript
          </Chip>
          <Chip dismissible onDismiss={() => console.log('Dismissed')}>
            Next.js
          </Chip>
        </Stack>
      </ComponentPreview>

      <h2>Filter Chips</h2>
      <ComponentPreview
        code={`<div>
  <p className="text-sm text-muted-foreground mb-2">Active filters:</p>
  <Stack direction="horizontal" spacing="sm" wrap>
    <Chip variant="outlined" dismissible>Calendar</Chip>
    <Chip variant="outlined" dismissible>Urgent</Chip>
    <Chip variant="outlined" dismissible>This Week</Chip>
  </Stack>
</div>`}
      >
        <div>
          <p className="text-sm text-muted-foreground mb-2">Active filters:</p>
          <Stack direction="horizontal" spacing="sm" wrap>
            <Chip variant="outlined" dismissible>Calendar</Chip>
            <Chip variant="outlined" dismissible>Urgent</Chip>
            <Chip variant="outlined" dismissible>This Week</Chip>
          </Stack>
        </div>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <h3>When to use</h3>
      <ul>
        <li>For user-selected filters or tags</li>
        <li>For displaying categories or attributes</li>
        <li>For multi-select interfaces</li>
        <li>For showing active search refinements</li>
      </ul>

      <h3>Best practices</h3>
      <ul>
        <li>Use dismissible chips for removable filters or tags</li>
        <li>Use outlined variant for filter chips</li>
        <li>Use filled variant for static category labels</li>
        <li>Keep chip text concise (1-3 words)</li>
        <li>Group related chips together</li>
        <li>Provide clear visual feedback on dismiss</li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>Dismiss button has aria-label="Remove"</li>
        <li>Keyboard accessible (Tab to focus, Enter/Space to dismiss)</li>
        <li>Screen readers announce chip content and dismiss option</li>
        <li>Sufficient color contrast for text and borders</li>
      </ul>
    </div>
  );
}
