'use client';

import { Stack, Button } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';

export default function StackPage() {
  const props = [
    {
      name: 'direction',
      type: "'horizontal' | 'vertical'",
      default: "'vertical'",
      description: 'Stack direction',
    },
    {
      name: 'spacing',
      type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'",
      default: "'md'",
      description: 'Space between items',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end' | 'stretch'",
      default: "'stretch'",
      description: 'Cross-axis alignment',
    },
    {
      name: 'justify',
      type: "'start' | 'center' | 'end' | 'between' | 'around'",
      default: "'start'",
      description: 'Main-axis alignment',
    },
    {
      name: 'wrap',
      type: 'boolean',
      default: 'false',
      description: 'Allow items to wrap',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Stack</h1>
      <p className="lead">
        A flexbox-based layout component for arranging items vertically or horizontally with consistent spacing.
      </p>

      <h2>Vertical Stack (Default)</h2>
      <ComponentPreview
        code={`<Stack>
  <div className="bg-muted p-4 rounded">Item 1</div>
  <div className="bg-muted p-4 rounded">Item 2</div>
  <div className="bg-muted p-4 rounded">Item 3</div>
</Stack>`}
      >
        <Stack>
          <div className="bg-muted p-4 rounded">Item 1</div>
          <div className="bg-muted p-4 rounded">Item 2</div>
          <div className="bg-muted p-4 rounded">Item 3</div>
        </Stack>
      </ComponentPreview>

      <h2>Horizontal Stack</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal">
  <div className="bg-muted p-4 rounded">Item 1</div>
  <div className="bg-muted p-4 rounded">Item 2</div>
  <div className="bg-muted p-4 rounded">Item 3</div>
</Stack>`}
      >
        <Stack direction="horizontal">
          <div className="bg-muted p-4 rounded">Item 1</div>
          <div className="bg-muted p-4 rounded">Item 2</div>
          <div className="bg-muted p-4 rounded">Item 3</div>
        </Stack>
      </ComponentPreview>

      <h2>Spacing</h2>
      <ComponentPreview
        code={`<Stack spacing="xl">
  <div className="bg-muted p-4 rounded">Large Spacing</div>
  <div className="bg-muted p-4 rounded">Large Spacing</div>
</Stack>`}
      >
        <Stack spacing="xl">
          <div className="bg-muted p-4 rounded">Large Spacing</div>
          <div className="bg-muted p-4 rounded">Large Spacing</div>
        </Stack>
      </ComponentPreview>

      <h2>Alignment</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" align="center" justify="between">
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</Stack>`}
      >
        <Stack direction="horizontal" align="center" justify="between">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Stack>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <h3>When to use</h3>
      <ul>
        <li>For form field groups</li>
        <li>For button toolbars</li>
        <li>For vertical content sections</li>
      </ul>
    </div>
  );
}
