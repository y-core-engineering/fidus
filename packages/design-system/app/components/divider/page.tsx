import { Divider, Stack } from '@fidus/ui';
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
        code={`<div>
  <p>Content above</p>
  <Divider />
  <p>Content below</p>
</div>`}
      >
        <div>
          <p>Content above the divider</p>
          <Divider />
          <p>Content below the divider</p>
        </div>
      </ComponentPreview>

      <h2>Vertical Divider</h2>
      <ComponentPreview
        code={`<div className="flex items-center h-12">
  <span>Left</span>
  <Divider orientation="vertical" />
  <span>Middle</span>
  <Divider orientation="vertical" />
  <span>Right</span>
</div>`}
      >
        <div className="flex items-center h-12">
          <span>Left</span>
          <Divider orientation="vertical" />
          <span>Middle</span>
          <Divider orientation="vertical" />
          <span>Right</span>
        </div>
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
      <h3>When to use</h3>
      <ul>
        <li>To separate content sections within a page</li>
        <li>To visually group related items in lists</li>
        <li>To create visual breaks in forms</li>
        <li>In toolbars to separate action groups</li>
      </ul>

      <h3>Best practices</h3>
      <ul>
        <li>Use horizontal dividers for vertical content flow</li>
        <li>Use vertical dividers in horizontal layouts (toolbars, breadcrumbs)</li>
        <li>Match spacing to the content density</li>
        <li>Don't overuse - too many dividers can create visual clutter</li>
        <li>Consider using whitespace instead for subtle separation</li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>Dividers are purely decorative and ignored by screen readers</li>
        <li>Use semantic HTML (headings, sections) for structural separation</li>
        <li>Ensure sufficient color contrast for the divider line</li>
      </ul>
    </div>
  );
}
