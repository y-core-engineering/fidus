'use client';

import { Container, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';

export default function ContainerPage() {
  const props = [
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
      default: "'lg'",
      description: 'Maximum width of the container',
    },
    {
      name: 'padding',
      type: "'none' | 'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Horizontal padding of the container',
    },
    {
      name: 'as',
      type: "'div' | 'section' | 'article' | 'main'",
      default: "'div'",
      description: 'HTML element to render',
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
      description: 'Container content',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Container</h1>
      <p className="lead">
        A responsive container component that centers content and constrains its maximum width.
        Essential for creating consistent page layouts.
      </p>

      <h2>Sizes</h2>
      <ComponentPreview
        code={`<Container size="sm">
  <div className="bg-muted p-md rounded-md">Small Container (max-w-2xl)</div>
</Container>`}
      >
        <Container size="sm">
          <div className="bg-muted p-md rounded-md">Small Container (max-w-2xl)</div>
        </Container>
      </ComponentPreview>

      <ComponentPreview
        code={`<Container size="md">
  <div className="bg-muted p-md rounded-md">Medium Container (max-w-4xl)</div>
</Container>`}
      >
        <Container size="md">
          <div className="bg-muted p-md rounded-md">Medium Container (max-w-4xl)</div>
        </Container>
      </ComponentPreview>

      <ComponentPreview
        code={`<Container size="lg">
  <div className="bg-muted p-md rounded-md">Large Container (max-w-6xl) - Default</div>
</Container>`}
      >
        <Container size="lg">
          <div className="bg-muted p-md rounded-md">Large Container (max-w-6xl) - Default</div>
        </Container>
      </ComponentPreview>

      <ComponentPreview
        code={`<Container size="xl">
  <div className="bg-muted p-md rounded-md">Extra Large Container (max-w-7xl)</div>
</Container>`}
      >
        <Container size="xl">
          <div className="bg-muted p-md rounded-md">Extra Large Container (max-w-7xl)</div>
        </Container>
      </ComponentPreview>

      <ComponentPreview
        code={`<Container size="full">
  <div className="bg-muted p-md rounded-md">Full Width Container</div>
</Container>`}
      >
        <Container size="full">
          <div className="bg-muted p-md rounded-md">Full Width Container</div>
        </Container>
      </ComponentPreview>

      <h2>Padding</h2>
      <ComponentPreview
        code={`<Container padding="none">
  <div className="bg-muted p-md rounded-md">No Padding</div>
</Container>`}
      >
        <Container padding="none">
          <div className="bg-muted p-md rounded-md">No Padding</div>
        </Container>
      </ComponentPreview>

      <ComponentPreview
        code={`<Container padding="sm">
  <div className="bg-muted p-md rounded-md">Small Padding (16px)</div>
</Container>`}
      >
        <Container padding="sm">
          <div className="bg-muted p-md rounded-md">Small Padding (16px)</div>
        </Container>
      </ComponentPreview>

      <h2>Semantic HTML</h2>
      <ComponentPreview
        code={`<Container as="main">
  <h1>Page Content</h1>
  <p>Using semantic main element</p>
</Container>`}
      >
        <Container as="main">
          <h1>Page Content</h1>
          <p>Using semantic main element</p>
        </Container>
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
              <span>For main page content to prevent text lines from becoming too long</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To create consistent margins across different pages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To center content horizontally on the page</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use 'lg' size for most page content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use 'sm' or 'md' for focused content like forms or articles</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use 'full' when you need edge-to-edge layouts</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Combine with semantic HTML elements (main, section, article)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Nest containers carefully - usually only one level needed</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use semantic 'as' prop for proper document structure</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Ensure sufficient padding for touch targets on mobile</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Content remains readable at all viewport sizes</span>
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
              <span>Use consistent container sizes across similar page types</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Choose container size based on content type and reading comfort</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use semantic HTML with the 'as' prop for better document structure</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Combine with Stack component for consistent internal spacing</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Container size="md" as="main">
  <Stack direction="vertical" spacing="lg">
    <h1>Article Title</h1>
    <p>Content with optimal line length for readability.</p>
  </Stack>
</Container>`}
            >
              <Container size="md" as="main">
                <Stack direction="vertical" spacing="lg">
                  <h1>Article Title</h1>
                  <p>Content with optimal line length for readability.</p>
                </Stack>
              </Container>
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
              <span>Don't nest multiple containers unnecessarily</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use 'sm' container for wide content like data tables</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't override container max-width without good reason</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use 'full' size by default - reserve for special layouts</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Container size="sm">
  <Container size="lg">
    {/* Unnecessary nesting */}
    <p>Content</p>
  </Container>
</Container>`}
            >
              <Container size="sm">
                <Container size="lg">
                  <p>Content</p>
                </Container>
              </Container>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/stack"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Stack</h3>
          <p className="text-sm text-muted-foreground">For flexible layouts inside containers</p>
        </Link>
        <Link
          href="/components/grid"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Grid</h3>
          <p className="text-sm text-muted-foreground">For multi-column layouts</p>
        </Link>
        <Link
          href="/components/section"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Section</h3>
          <p className="text-sm text-muted-foreground">For semantic page sections</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/container/container.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation.html"
              external
              showIcon
            >
              WCAG: Visual Presentation
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
