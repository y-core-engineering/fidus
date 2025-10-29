'use client';

import { Badge, Stack } from '@fidus/ui';
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
        code={`<div className="flex items-center gap-2">
  <span className="text-lg font-semibold">Appointment Reminder</span>
  <Badge variant="urgent">High Priority</Badge>
</div>`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Appointment Reminder</span>
          <Badge variant="urgent">High Priority</Badge>
        </div>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <h3>When to use</h3>
      <ul>
        <li>For displaying urgency levels (urgent, important, normal, low)</li>
        <li>For status indicators (success, warning, error, info)</li>
        <li>For notification counts</li>
        <li>For categorical labels</li>
      </ul>

      <h3>Best practices</h3>
      <ul>
        <li>Use urgency variants for Fidus opportunities and tasks</li>
        <li>Use semantic variants for system feedback</li>
        <li>Keep badge text short (1-2 words ideal)</li>
        <li>Don't use badges for long descriptive text</li>
        <li>Place badges near the content they describe</li>
        <li>Use consistent variant meanings throughout the app</li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>Badge text is readable by screen readers</li>
        <li>Color is not the only indicator - text provides context</li>
        <li>Sufficient color contrast for all variants</li>
        <li>Consider aria-label for icon-only badges</li>
      </ul>
    </div>
  );
}
