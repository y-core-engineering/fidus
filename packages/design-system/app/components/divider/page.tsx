'use client';

import { Divider } from '@fidus/ui/divider';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';

export default function DividerPage() {
  const props = [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Direction of the divider',
    },
    {
      name: 'spacing',
      type: "'none' | 'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Margin around the divider',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Divider</h1>
      <p className="lead">
        A visual separator that creates clear boundaries between content sections.
        Can be horizontal or vertical.
      </p>

      <h2>Horizontal Divider (Default)</h2>
      <ComponentPreview
        code={`<Stack>
  <p>Content above</p>
  <Divider />
  <p>Content below</p>
</Stack>`}
      >
        <Stack>
          <p>Content above the divider</p>
          <Divider />
          <p>Content below the divider</p>
        </Stack>
      </ComponentPreview>

      <h2>Vertical Divider</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" align="center" className="h-12">
  <span>Left</span>
  <Divider orientation="vertical" />
  <span>Middle</span>
  <Divider orientation="vertical" />
  <span>Right</span>
</Stack>`}
      >
        <Stack direction="horizontal" align="center" className="h-12">
          <span>Left</span>
          <Divider orientation="vertical" />
          <span>Middle</span>
          <Divider orientation="vertical" />
          <span>Right</span>
        </Stack>
      </ComponentPreview>

      <h2>Spacing Variations</h2>
      <ComponentPreview
        code={`<Stack>
  <p>No spacing</p>
  <Divider spacing="none" />
  <p>Content</p>
</Stack>`}
      >
        <Stack>
          <p>No spacing</p>
          <Divider spacing="none" />
          <p>Content</p>
        </Stack>
      </ComponentPreview>

      <ComponentPreview
        code={`<Stack>
  <p>Small spacing</p>
  <Divider spacing="sm" />
  <p>Content</p>
</Stack>`}
      >
        <Stack>
          <p>Small spacing</p>
          <Divider spacing="sm" />
          <p>Content</p>
        </Stack>
      </ComponentPreview>

      <ComponentPreview
        code={`<Stack>
  <p>Large spacing</p>
  <Divider spacing="lg" />
  <p>Content</p>
</Stack>`}
      >
        <Stack>
          <p>Large spacing</p>
          <Divider spacing="lg" />
          <p>Content</p>
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
              <span>To separate content sections within a page</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To visually group related items in lists</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To create visual breaks in forms</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>In toolbars to separate action groups</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use horizontal dividers for vertical content flow</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use vertical dividers in horizontal layouts (toolbars, breadcrumbs)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Match spacing to the content density</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Consider using whitespace instead for subtle separation</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Dividers are purely decorative and ignored by screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use semantic HTML (headings, sections) for structural separation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Ensure sufficient color contrast for the divider line</span>
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
              <span>Use dividers to separate distinct content sections</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Choose appropriate spacing based on content density</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use vertical dividers in horizontal toolbars</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Stack>
  <section>
    <h3>Section 1</h3>
    <p>Content for first section</p>
  </section>
  <Divider />
  <section>
    <h3>Section 2</h3>
    <p>Content for second section</p>
  </section>
</Stack>`}
            >
              <Stack>
                <section>
                  <h4 className="text-base font-semibold mb-xs">Section 1</h4>
                  <p className="text-sm">Content for first section</p>
                </section>
                <Divider />
                <section>
                  <h4 className="text-base font-semibold mb-xs">Section 2</h4>
                  <p className="text-sm">Content for second section</p>
                </section>
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
              <span>Overuse dividers - creates visual clutter</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use dividers between every list item</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Rely on dividers alone for content structure</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Stack>
  <p>Item 1</p>
  <Divider />
  <p>Item 2</p>
  <Divider />
  <p>Item 3</p>
  <Divider />
  <p>Item 4</p>
</Stack>`}
            >
              <Stack>
                <p className="text-sm">Item 1</p>
                <Divider />
                <p className="text-sm">Item 2</p>
                <Divider />
                <p className="text-sm">Item 3</p>
                <Divider />
                <p className="text-sm">Item 4</p>
              </Stack>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/card"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Card
          </h3>
          <p className="text-sm text-muted-foreground">
            Container component that creates visual boundaries
          </p>
        </Link>

        <Link
          href="/components/stack"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Stack
          </h3>
          <p className="text-sm text-muted-foreground">
            Layout component for arranging content with spacing
          </p>
        </Link>

        <Link
          href="/components/breadcrumb"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Breadcrumb
          </h3>
          <p className="text-sm text-muted-foreground">
            Navigation component that uses vertical dividers
          </p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/divider/divider.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/separator/"
              external
              showIcon
            >
              ARIA: Separator (Divider) Pattern
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
