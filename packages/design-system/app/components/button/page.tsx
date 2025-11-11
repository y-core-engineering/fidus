'use client';

import { Button } from '@fidus/ui/button';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
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
        code={`<Stack direction="horizontal" spacing="md" align="center">
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" align="center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Stack>
      </ComponentPreview>

      <h2>States</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md" align="center">
  <Button disabled>Disabled</Button>
  <Button loading>Loading</Button>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" align="center">
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </Stack>
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
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For primary actions on a page (use primary variant)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For form submissions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For triggering modal dialogs or other interactions</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use clear, action-oriented labels (e.g., "Save", "Delete", "Continue")</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use primary variant for the most important action on a page</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use destructive variant for actions that cannot be undone</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show loading state during async operations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Disable buttons that cannot be clicked in current context</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>All buttons have proper focus states for keyboard navigation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Disabled buttons are marked with aria-disabled</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Loading state includes aria-busy attribute</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Button content should be descriptive of the action</span>
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
              <span>Use clear, action-oriented labels that describe what will happen</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use primary variant for the main action on a page</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show loading state during async operations to provide feedback</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use destructive variant for irreversible actions like "Delete"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Maintain consistent button sizes within a button group</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Stack direction="horizontal" spacing="md">
  <Button variant="primary">Save Changes</Button>
  <Button variant="secondary">Cancel</Button>
</Stack>`}
            >
              <Stack direction="horizontal" spacing="md">
                <Button variant="primary">Save Changes</Button>
                <Button variant="secondary">Cancel</Button>
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
              <span>Don't use vague labels like "Click here" or "Submit"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use multiple primary buttons on the same page</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use buttons for navigation - use Link component instead</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't mix button sizes randomly in the same context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't disable buttons without explanation (use tooltip)</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Stack direction="horizontal" spacing="md">
  <Button variant="primary">Click here</Button>
  <Button variant="primary">Submit</Button>
</Stack>`}
            >
              <Stack direction="horizontal" spacing="md">
                <Button variant="primary">Click here</Button>
                <Button variant="primary">Submit</Button>
              </Stack>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/link"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Link</h3>
          <p className="text-sm text-muted-foreground">For navigation between pages</p>
        </Link>
        <Link
          href="/components/icon-button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Icon Button</h3>
          <p className="text-sm text-muted-foreground">Button with icon only, no text</p>
        </Link>
        <Link
          href="/components/button-group"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Button Group</h3>
          <p className="text-sm text-muted-foreground">Group related buttons together</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/button/button.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/button/"
              external
              showIcon
            >
              ARIA: Button Pattern
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
