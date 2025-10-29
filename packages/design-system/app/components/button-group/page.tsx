'use client';

import { Button, ButtonGroup, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function ButtonGroupPage() {
  const props = [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Direction in which buttons are arranged',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      required: true,
      description: 'Button components to group together',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Button Group</h1>
      <p className="lead">
        Button groups combine related buttons together into a single component. They
        are useful for toolbars, segmented controls, and toggle groups.
      </p>

      <h2>Horizontal</h2>
      <ComponentPreview
        code={`<ButtonGroup orientation="horizontal">
  <Button variant="secondary">Left</Button>
  <Button variant="secondary">Center</Button>
  <Button variant="secondary">Right</Button>
</ButtonGroup>`}
      >
        <ButtonGroup orientation="horizontal">
          <Button variant="secondary">Left</Button>
          <Button variant="secondary">Center</Button>
          <Button variant="secondary">Right</Button>
        </ButtonGroup>
      </ComponentPreview>

      <h2>Vertical</h2>
      <ComponentPreview
        code={`<ButtonGroup orientation="vertical">
  <Button variant="secondary">Top</Button>
  <Button variant="secondary">Middle</Button>
  <Button variant="secondary">Bottom</Button>
</ButtonGroup>`}
      >
        <ButtonGroup orientation="vertical">
          <Button variant="secondary">Top</Button>
          <Button variant="secondary">Middle</Button>
          <Button variant="secondary">Bottom</Button>
        </ButtonGroup>
      </ComponentPreview>

      <h2>Icon Buttons</h2>
      <ComponentPreview
        code={`<ButtonGroup orientation="horizontal">
  <Button variant="tertiary" size="sm">
    <AlignLeft className="h-4 w-4" />
  </Button>
  <Button variant="tertiary" size="sm">
    <AlignCenter className="h-4 w-4" />
  </Button>
  <Button variant="tertiary" size="sm">
    <AlignRight className="h-4 w-4" />
  </Button>
</ButtonGroup>`}
      >
        <ButtonGroup orientation="horizontal">
          <Button variant="tertiary" size="sm">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="tertiary" size="sm">
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="tertiary" size="sm">
            <AlignRight className="h-4 w-4" />
          </Button>
        </ButtonGroup>
      </ComponentPreview>

      <h2>With Different Button Variants</h2>
      <ComponentPreview
        code={`<ButtonGroup orientation="horizontal">
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
</ButtonGroup>`}
      >
        <ButtonGroup orientation="horizontal">
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
        </ButtonGroup>
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
              <span>For related actions that should be visually grouped</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For segmented controls (like text alignment options)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For toolbars with multiple related actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For toggle groups where one option is selected</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use secondary or tertiary variants for button groups</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep the number of buttons in a group reasonable (2-5 is ideal)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use consistent button sizes within a group</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Consider using icon buttons for compact toolbars</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use horizontal orientation by default, vertical for sidebar actions</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Button groups have role="group" for screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Each button can be navigated individually with keyboard</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus states are preserved for each button</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Consider adding aria-label to the group if its purpose isn't obvious</span>
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
              <span>Use consistent button sizes within a group</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Group related actions together logically</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use secondary or tertiary variants for grouped buttons</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Keep groups to 2-5 buttons for clarity</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use icon-only buttons for compact toolbars</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<ButtonGroup orientation="horizontal">
  <Button variant="secondary" size="sm">
    <AlignLeft className="h-4 w-4" />
  </Button>
  <Button variant="secondary" size="sm">
    <AlignCenter className="h-4 w-4" />
  </Button>
  <Button variant="secondary" size="sm">
    <AlignRight className="h-4 w-4" />
  </Button>
</ButtonGroup>`}
            >
              <ButtonGroup orientation="horizontal">
                <Button variant="secondary" size="sm">
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="sm">
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="sm">
                  <AlignRight className="h-4 w-4" />
                </Button>
              </ButtonGroup>
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
              <span>Don't mix different button sizes in the same group</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't group unrelated actions together</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use more than one primary button in a group</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't create groups with too many buttons (over 5)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't mix text and icon-only buttons in the same group</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<ButtonGroup orientation="horizontal">
  <Button variant="primary" size="sm">Edit</Button>
  <Button variant="secondary" size="lg">Save</Button>
  <Button variant="destructive" size="md">Delete</Button>
</ButtonGroup>`}
            >
              <ButtonGroup orientation="horizontal">
                <Button variant="primary" size="sm">Edit</Button>
                <Button variant="secondary" size="lg">Save</Button>
                <Button variant="destructive" size="md">Delete</Button>
              </ButtonGroup>
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
          <p className="text-sm text-muted-foreground">Individual button component</p>
        </Link>
        <Link
          href="/components/icon-button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Icon Button
          </h3>
          <p className="text-sm text-muted-foreground">Button with icon only, no text</p>
        </Link>
        <Link
          href="/components/toolbar"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Toolbar
          </h3>
          <p className="text-sm text-muted-foreground">Container for button groups and tools</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/button-group/button-group.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/"
              external
              showIcon
            >
              ARIA: Toolbar Pattern
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
