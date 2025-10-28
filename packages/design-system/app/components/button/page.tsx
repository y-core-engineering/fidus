import { Button } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { Loader2 } from 'lucide-react';

export default function ButtonPage() {
  const props = [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'tertiary' | 'destructive'",
      default: "'primary'",
      description: 'Visual style variant of the button',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the button',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Whether the button is disabled',
    },
    {
      name: 'loading',
      type: 'boolean',
      description: 'Whether the button is in a loading state (shows spinner)',
    },
    {
      name: 'asChild',
      type: 'boolean',
      description: 'Merge props onto immediate child (Radix Slot pattern)',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      required: true,
      description: 'Button content',
    },
    {
      name: 'onClick',
      type: '() => void',
      description: 'Click event handler',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Button</h1>
      <p className="lead">
        Buttons trigger actions or events when clicked. They are used for form submissions,
        navigation, and other interactive elements.
      </p>

      <h2>Variants</h2>
      <ComponentPreview
        code={`<Button variant="primary">Primary Button</Button>`}
      >
        <Button variant="primary">Primary Button</Button>
      </ComponentPreview>

      <ComponentPreview
        code={`<Button variant="secondary">Secondary Button</Button>`}
      >
        <Button variant="secondary">Secondary Button</Button>
      </ComponentPreview>

      <ComponentPreview
        code={`<Button variant="tertiary">Tertiary Button</Button>`}
      >
        <Button variant="tertiary">Tertiary Button</Button>
      </ComponentPreview>

      <ComponentPreview
        code={`<Button variant="destructive">Destructive Button</Button>`}
      >
        <Button variant="destructive">Destructive Button</Button>
      </ComponentPreview>

      <h2>Sizes</h2>
      <ComponentPreview
        code={`<div className="flex items-center gap-4">
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</div>`}
      >
        <div className="flex items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </ComponentPreview>

      <h2>States</h2>
      <ComponentPreview
        code={`<div className="flex items-center gap-4">
  <Button disabled>Disabled</Button>
  <Button loading>Loading</Button>
</div>`}
      >
        <div className="flex items-center gap-4">
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
      </ComponentPreview>

      <h2>With Icons</h2>
      <ComponentPreview
        code={`<Button>
  <Loader2 className="h-4 w-4 mr-2" />
  Button with Icon
</Button>`}
      >
        <Button>
          <Loader2 className="h-4 w-4 mr-2" />
          Button with Icon
        </Button>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <h3>When to use</h3>
      <ul>
        <li>For primary actions on a page (use primary variant)</li>
        <li>For form submissions</li>
        <li>For triggering modal dialogs or other interactions</li>
      </ul>

      <h3>Best practices</h3>
      <ul>
        <li>Use clear, action-oriented labels (e.g., "Save", "Delete", "Continue")</li>
        <li>Use primary variant for the most important action on a page</li>
        <li>Use destructive variant for actions that cannot be undone</li>
        <li>Show loading state during async operations</li>
        <li>Disable buttons that cannot be clicked in current context</li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>All buttons have proper focus states for keyboard navigation</li>
        <li>Disabled buttons are marked with aria-disabled</li>
        <li>Loading state includes aria-busy attribute</li>
        <li>Button content should be descriptive of the action</li>
      </ul>
    </div>
  );
}
