'use client';

import { Chip } from '@fidus/ui/chip';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
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
  <p className="text-sm text-muted-foreground mb-sm">Active filters:</p>
  <Stack direction="horizontal" spacing="sm" wrap>
    <Chip variant="outlined" dismissible>Calendar</Chip>
    <Chip variant="outlined" dismissible>Urgent</Chip>
    <Chip variant="outlined" dismissible>This Week</Chip>
  </Stack>
</div>`}
      >
        <div>
          <p className="text-sm text-muted-foreground mb-sm">Active filters:</p>
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
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For user-selected filters or tags</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For displaying categories or attributes</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For multi-select interfaces</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For showing active search refinements</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use dismissible chips for removable filters or tags</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use outlined variant for filter chips</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use filled variant for static category labels</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep chip text concise (1-3 words)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Group related chips together</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide clear visual feedback on dismiss</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Dismiss button has aria-label="Remove"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible (Tab to focus, Enter/Space to dismiss)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Screen readers announce chip content and dismiss option</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Sufficient color contrast for text and borders</span>
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
              <span>Use dismissible chips for removable filters</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Keep chip labels concise and scannable</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use outlined variant for filter contexts</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Stack direction="horizontal" spacing="sm" wrap>
  <Chip variant="outlined" dismissible>Active</Chip>
  <Chip variant="outlined" dismissible>Finance</Chip>
  <Chip variant="outlined" dismissible>High Priority</Chip>
</Stack>`}
            >
              <Stack direction="horizontal" spacing="sm" wrap>
                <Chip variant="outlined" dismissible>Active</Chip>
                <Chip variant="outlined" dismissible>Finance</Chip>
                <Chip variant="outlined" dismissible>High Priority</Chip>
              </Stack>
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
              <span>Don't use overly long text in chips</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't make non-dismissible chips look clickable</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use chips for primary actions</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Stack direction="horizontal" spacing="sm" wrap>
  <Chip>This is a very long chip label that wraps</Chip>
  <Chip>Another extremely verbose chip</Chip>
</Stack>`}
            >
              <Stack direction="horizontal" spacing="sm" wrap>
                <Chip>This is a very long chip label that wraps</Chip>
                <Chip>Another extremely verbose chip</Chip>
              </Stack>
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
          <p className="text-sm text-muted-foreground">Highlight status or counts</p>
        </Link>
        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">Trigger actions and events</p>
        </Link>
        <Link
          href="/components/checkbox"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Checkbox
          </h3>
          <p className="text-sm text-muted-foreground">Multi-select options</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/chip/chip.tsx"
              external
              showIcon
            >
              View source on GitHub
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
