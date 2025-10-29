'use client';

import { Grid } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';

export default function GridPage() {
  const props = [
    {
      name: 'cols',
      type: "'1' | '2' | '3' | '4' | '6' | '12'",
      default: "'3'",
      description: 'Number of columns (responsive)',
    },
    {
      name: 'gap',
      type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",
      default: "'md'",
      description: 'Gap between grid items',
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
      description: 'Grid items',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Grid</h1>
      <p className="lead">
        A responsive CSS Grid wrapper that automatically adapts column count based on screen size.
        Perfect for card layouts, image galleries, and dashboard widgets.
      </p>

      <h2>Column Variations</h2>

      <h3>2 Columns</h3>
      <ComponentPreview
        code={`<Grid cols="2">
  <div className="bg-muted p-4 rounded">Item 1</div>
  <div className="bg-muted p-4 rounded">Item 2</div>
  <div className="bg-muted p-4 rounded">Item 3</div>
  <div className="bg-muted p-4 rounded">Item 4</div>
</Grid>`}
      >
        <Grid cols="2">
          <div className="bg-muted p-4 rounded">Item 1</div>
          <div className="bg-muted p-4 rounded">Item 2</div>
          <div className="bg-muted p-4 rounded">Item 3</div>
          <div className="bg-muted p-4 rounded">Item 4</div>
        </Grid>
      </ComponentPreview>

      <h3>3 Columns (Default)</h3>
      <ComponentPreview
        code={`<Grid>
  <div className="bg-muted p-4 rounded">Item 1</div>
  <div className="bg-muted p-4 rounded">Item 2</div>
  <div className="bg-muted p-4 rounded">Item 3</div>
  <div className="bg-muted p-4 rounded">Item 4</div>
  <div className="bg-muted p-4 rounded">Item 5</div>
  <div className="bg-muted p-4 rounded">Item 6</div>
</Grid>`}
      >
        <Grid>
          <div className="bg-muted p-4 rounded">Item 1</div>
          <div className="bg-muted p-4 rounded">Item 2</div>
          <div className="bg-muted p-4 rounded">Item 3</div>
          <div className="bg-muted p-4 rounded">Item 4</div>
          <div className="bg-muted p-4 rounded">Item 5</div>
          <div className="bg-muted p-4 rounded">Item 6</div>
        </Grid>
      </ComponentPreview>

      <h3>4 Columns</h3>
      <ComponentPreview
        code={`<Grid cols="4">
  <div className="bg-muted p-4 rounded">1</div>
  <div className="bg-muted p-4 rounded">2</div>
  <div className="bg-muted p-4 rounded">3</div>
  <div className="bg-muted p-4 rounded">4</div>
</Grid>`}
      >
        <Grid cols="4">
          <div className="bg-muted p-4 rounded">1</div>
          <div className="bg-muted p-4 rounded">2</div>
          <div className="bg-muted p-4 rounded">3</div>
          <div className="bg-muted p-4 rounded">4</div>
        </Grid>
      </ComponentPreview>

      <h2>Gap Sizes</h2>
      <ComponentPreview
        code={`<Grid gap="none">
  <div className="bg-muted p-4 rounded">No Gap</div>
  <div className="bg-muted p-4 rounded">No Gap</div>
  <div className="bg-muted p-4 rounded">No Gap</div>
</Grid>`}
      >
        <Grid gap="none">
          <div className="bg-muted p-4 rounded">No Gap</div>
          <div className="bg-muted p-4 rounded">No Gap</div>
          <div className="bg-muted p-4 rounded">No Gap</div>
        </Grid>
      </ComponentPreview>

      <ComponentPreview
        code={`<Grid gap="xl">
  <div className="bg-muted p-4 rounded">Large Gap</div>
  <div className="bg-muted p-4 rounded">Large Gap</div>
  <div className="bg-muted p-4 rounded">Large Gap</div>
</Grid>`}
      >
        <Grid gap="xl">
          <div className="bg-muted p-4 rounded">Large Gap</div>
          <div className="bg-muted p-4 rounded">Large Gap</div>
          <div className="bg-muted p-4 rounded">Large Gap</div>
        </Grid>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Responsive Behavior</h2>
      <p>The Grid component automatically adjusts columns based on screen size:</p>
      <ul>
        <li><strong>cols=&quot;2&quot;:</strong> 1 col (mobile) → 2 cols (desktop)</li>
        <li><strong>cols=&quot;3&quot;:</strong> 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)</li>
        <li><strong>cols=&quot;4&quot;:</strong> 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop)</li>
        <li><strong>cols=&quot;6&quot;:</strong> 2 cols (mobile) → 3 cols (tablet) → 6 cols (desktop)</li>
        <li><strong>cols=&quot;12&quot;:</strong> 4 cols (mobile) → 6 cols (tablet) → 12 cols (desktop)</li>
      </ul>

      <h2>Usage Guidelines</h2>
      <h3>When to use</h3>
      <ul>
        <li>For card layouts and product grids</li>
        <li>For image galleries and media displays</li>
        <li>For dashboard widgets and metrics</li>
        <li>When you need equal-width columns</li>
      </ul>

      <h3>Best practices</h3>
      <ul>
        <li>Use cols=&quot;3&quot; for most card layouts</li>
        <li>Use cols=&quot;2&quot; for larger content cards</li>
        <li>Use cols=&quot;4&quot; for compact items like icons or thumbnails</li>
        <li>Match gap size to the visual weight of content</li>
        <li>Ensure grid items have consistent heights for best appearance</li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>Grid items reflow naturally on smaller screens</li>
        <li>Keyboard navigation works left-to-right, top-to-bottom</li>
        <li>Screen readers announce items in source order</li>
      </ul>
    </div>
  );
}
