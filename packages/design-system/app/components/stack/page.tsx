'use client';

import { Stack, Button, Link } from '@fidus/ui';
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
  <div className="bg-muted p-md rounded-md">Item 1</div>
  <div className="bg-muted p-md rounded-md">Item 2</div>
  <div className="bg-muted p-md rounded-md">Item 3</div>
</Stack>`}
      >
        <Stack>
          <div className="bg-muted p-md rounded-md">Item 1</div>
          <div className="bg-muted p-md rounded-md">Item 2</div>
          <div className="bg-muted p-md rounded-md">Item 3</div>
        </Stack>
      </ComponentPreview>

      <h2>Horizontal Stack</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal">
  <div className="bg-muted p-md rounded-md">Item 1</div>
  <div className="bg-muted p-md rounded-md">Item 2</div>
  <div className="bg-muted p-md rounded-md">Item 3</div>
</Stack>`}
      >
        <Stack direction="horizontal">
          <div className="bg-muted p-md rounded-md">Item 1</div>
          <div className="bg-muted p-md rounded-md">Item 2</div>
          <div className="bg-muted p-md rounded-md">Item 3</div>
        </Stack>
      </ComponentPreview>

      <h2>Spacing</h2>
      <ComponentPreview
        code={`<Stack spacing="xl">
  <div className="bg-muted p-md rounded-md">Large Spacing</div>
  <div className="bg-muted p-md rounded-md">Large Spacing</div>
</Stack>`}
      >
        <Stack spacing="xl">
          <div className="bg-muted p-md rounded-md">Large Spacing</div>
          <div className="bg-muted p-md rounded-md">Large Spacing</div>
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
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For arranging form fields vertically with consistent spacing</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For creating button toolbars with horizontal alignment</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For vertical content sections with predictable gaps</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For card layouts that need flexible alignment options</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use Stack instead of manual flexbox to ensure consistent spacing tokens</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Prefer vertical direction (default) for form layouts and content sections</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use horizontal direction for button groups and inline controls</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Choose spacing values based on content relationship (sm for tight groups, lg for distinct sections)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Stack maintains logical DOM order for screen reader navigation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Sufficient spacing improves target size for touch interactions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Visual grouping through spacing helps cognitive understanding</span>
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
              <span>Use Stack for consistent spacing and alignment</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Choose spacing values that reflect content relationships</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Nest Stacks for complex layouts with different spacing needs</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Stack spacing="lg">
  <h2>Section Title</h2>
  <Stack spacing="sm">
    <p>Related content 1</p>
    <p>Related content 2</p>
  </Stack>
</Stack>`}
            >
              <Stack spacing="lg">
                <h2 className="text-lg font-semibold">Section Title</h2>
                <Stack spacing="sm">
                  <p className="text-sm">Related content 1</p>
                  <p className="text-sm">Related content 2</p>
                </Stack>
              </Stack>
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
              <span>Don't use manual flexbox with hardcoded gap values</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use the same spacing for unrelated content groups</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't forget to consider alignment needs for mixed content sizes</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<div className="flex flex-col gap-4">
  <h2>Section Title</h2>
  <p>Content</p>
</div>`}
            >
              <div className="flex flex-col gap-md">
                <h2 className="text-lg font-semibold">Section Title</h2>
                <p className="text-sm">Content with manual flexbox</p>
              </div>
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
            Often arranged in horizontal Stacks for toolbars
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
            Cards often contain Stacks for internal content layout
          </p>
        </Link>

        <Link
          href="/foundations/spacing"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Spacing System
          </h3>
          <p className="text-sm text-muted-foreground">
            Learn about spacing tokens used by Stack
          </p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/stack/stack.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout"
              external
              showIcon
            >
              MDN: CSS Flexible Box Layout
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
