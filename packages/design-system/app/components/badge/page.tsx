'use client';

import { Badge, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';

export default function BadgePage() {
  const props = [
    {
      name: 'variant',
      type: "'urgent' | 'important' | 'normal' | 'low' | 'success' | 'warning' | 'error' | 'info'",
      default: "'normal'",
      description: 'Visual style variant',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Badge size',
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
      description: 'Badge content',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Badge</h1>
      <p className="lead">
        Small status indicators used to display metadata, counts, or categorical information.
        Designed for Fidus's urgency and domain-based system.
      </p>

      <h2>Urgency Variants</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md">
  <Badge variant="urgent">Urgent</Badge>
  <Badge variant="important">Important</Badge>
  <Badge variant="normal">Normal</Badge>
  <Badge variant="low">Low Priority</Badge>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" wrap>
          <Badge variant="urgent">Urgent</Badge>
          <Badge variant="important">Important</Badge>
          <Badge variant="normal">Normal</Badge>
          <Badge variant="low">Low Priority</Badge>
        </Stack>
      </ComponentPreview>

      <h2>Semantic Variants</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md">
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="error">Error</Badge>
  <Badge variant="info">Info</Badge>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" wrap>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </Stack>
      </ComponentPreview>

      <h2>Sizes</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md" align="center">
  <Badge size="sm" variant="urgent">Small</Badge>
  <Badge size="md" variant="urgent">Medium</Badge>
  <Badge size="lg" variant="urgent">Large</Badge>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" align="center">
          <Badge size="sm" variant="urgent">Small</Badge>
          <Badge size="md" variant="urgent">Medium</Badge>
          <Badge size="lg" variant="urgent">Large</Badge>
        </Stack>
      </ComponentPreview>

      <h2>In Context</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="sm" align="center">
  <span className="text-lg font-semibold">Appointment Reminder</span>
  <Badge variant="urgent">High Priority</Badge>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="sm" align="center">
          <span className="text-lg font-semibold">Appointment Reminder</span>
          <Badge variant="urgent">High Priority</Badge>
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
              <span>For displaying urgency levels (urgent, important, normal, low)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For status indicators (success, warning, error, info)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For notification counts</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For categorical labels</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use urgency variants for Fidus opportunities and tasks</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use semantic variants for system feedback</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep badge text short (1-2 words ideal)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Don't use badges for long descriptive text</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Place badges near the content they describe</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use consistent variant meanings throughout the app</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Badge text is readable by screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Color is not the only indicator - text provides context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Sufficient color contrast for all variants</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Consider aria-label for icon-only badges</span>
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
              <span>Use short, concise text (1-2 words)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use urgency variants for Fidus opportunities</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Place badges inline with related content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use consistent variant meanings across the app</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Stack direction="horizontal" spacing="sm" align="center">
  <span className="font-semibold">Budget Alert</span>
  <Badge variant="urgent">High</Badge>
</Stack>`}
            >
              <Stack direction="horizontal" spacing="sm" align="center">
                <span className="font-semibold">Budget Alert</span>
                <Badge variant="urgent">High</Badge>
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
              <span>Use badges for long descriptive text</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Mix urgency and semantic variants inconsistently</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use badges as clickable buttons</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Rely solely on color to convey meaning</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Badge variant="error">
  This is a very long description that should not be in a badge
</Badge>`}
            >
              <Badge variant="error">
                This is a very long description that should not be in a badge
              </Badge>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">
            For interactive actions and commands
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
            Containers that often include badges for status
          </p>
        </Link>

        <Link
          href="/components/table"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Table
          </h3>
          <p className="text-sm text-muted-foreground">
            Use badges in table cells to indicate status
          </p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/badge/badge.tsx"
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
