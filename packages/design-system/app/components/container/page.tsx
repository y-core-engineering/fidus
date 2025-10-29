'use client';

import { Container } from '@fidus/ui';
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
  <div className="bg-muted p-4 rounded">Small Container (max-w-2xl)</div>
</Container>`}
      >
        <Container size="sm">
          <div className="bg-muted p-4 rounded">Small Container (max-w-2xl)</div>
        </Container>
      </ComponentPreview>

      <ComponentPreview
        code={`<Container size="md">
  <div className="bg-muted p-4 rounded">Medium Container (max-w-4xl)</div>
</Container>`}
      >
        <Container size="md">
          <div className="bg-muted p-4 rounded">Medium Container (max-w-4xl)</div>
        </Container>
      </ComponentPreview>

      <ComponentPreview
        code={`<Container size="lg">
  <div className="bg-muted p-4 rounded">Large Container (max-w-6xl) - Default</div>
</Container>`}
      >
        <Container size="lg">
          <div className="bg-muted p-4 rounded">Large Container (max-w-6xl) - Default</div>
        </Container>
      </ComponentPreview>

      <ComponentPreview
        code={`<Container size="xl">
  <div className="bg-muted p-4 rounded">Extra Large Container (max-w-7xl)</div>
</Container>`}
      >
        <Container size="xl">
          <div className="bg-muted p-4 rounded">Extra Large Container (max-w-7xl)</div>
        </Container>
      </ComponentPreview>

      <ComponentPreview
        code={`<Container size="full">
  <div className="bg-muted p-4 rounded">Full Width Container</div>
</Container>`}
      >
        <Container size="full">
          <div className="bg-muted p-4 rounded">Full Width Container</div>
        </Container>
      </ComponentPreview>

      <h2>Padding</h2>
      <ComponentPreview
        code={`<Container padding="none">
  <div className="bg-muted p-4 rounded">No Padding</div>
</Container>`}
      >
        <Container padding="none">
          <div className="bg-muted p-4 rounded">No Padding</div>
        </Container>
      </ComponentPreview>

      <ComponentPreview
        code={`<Container padding="sm">
  <div className="bg-muted p-4 rounded">Small Padding (16px)</div>
</Container>`}
      >
        <Container padding="sm">
          <div className="bg-muted p-4 rounded">Small Padding (16px)</div>
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
      <h3>When to use</h3>
      <ul>
        <li>For main page content to prevent text lines from becoming too long</li>
        <li>To create consistent margins across different pages</li>
        <li>To center content horizontally on the page</li>
      </ul>

      <h3>Best practices</h3>
      <ul>
        <li>Use 'lg' size for most page content</li>
        <li>Use 'sm' or 'md' for focused content like forms or articles</li>
        <li>Use 'full' when you need edge-to-edge layouts</li>
        <li>Combine with semantic HTML elements (main, section, article)</li>
        <li>Nest containers carefully - usually only one level needed</li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>Use semantic 'as' prop for proper document structure</li>
        <li>Ensure sufficient padding for touch targets on mobile</li>
        <li>Content remains readable at all viewport sizes</li>
      </ul>
    </div>
  );
}
