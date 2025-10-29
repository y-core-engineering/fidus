'use client';

import { Grid, Link, Stack } from '@fidus/ui';
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
  <div className="bg-muted p-lg rounded-lg">Item 1</div>
  <div className="bg-muted p-lg rounded-lg">Item 2</div>
  <div className="bg-muted p-lg rounded-lg">Item 3</div>
  <div className="bg-muted p-lg rounded-lg">Item 4</div>
</Grid>`}
      >
        <Grid cols="2">
          <div className="bg-muted p-lg rounded-lg">Item 1</div>
          <div className="bg-muted p-lg rounded-lg">Item 2</div>
          <div className="bg-muted p-lg rounded-lg">Item 3</div>
          <div className="bg-muted p-lg rounded-lg">Item 4</div>
        </Grid>
      </ComponentPreview>

      <h3>3 Columns (Default)</h3>
      <ComponentPreview
        code={`<Grid>
  <div className="bg-muted p-lg rounded-lg">Item 1</div>
  <div className="bg-muted p-lg rounded-lg">Item 2</div>
  <div className="bg-muted p-lg rounded-lg">Item 3</div>
  <div className="bg-muted p-lg rounded-lg">Item 4</div>
  <div className="bg-muted p-lg rounded-lg">Item 5</div>
  <div className="bg-muted p-lg rounded-lg">Item 6</div>
</Grid>`}
      >
        <Grid>
          <div className="bg-muted p-lg rounded-lg">Item 1</div>
          <div className="bg-muted p-lg rounded-lg">Item 2</div>
          <div className="bg-muted p-lg rounded-lg">Item 3</div>
          <div className="bg-muted p-lg rounded-lg">Item 4</div>
          <div className="bg-muted p-lg rounded-lg">Item 5</div>
          <div className="bg-muted p-lg rounded-lg">Item 6</div>
        </Grid>
      </ComponentPreview>

      <h3>4 Columns</h3>
      <ComponentPreview
        code={`<Grid cols="4">
  <div className="bg-muted p-lg rounded-lg">1</div>
  <div className="bg-muted p-lg rounded-lg">2</div>
  <div className="bg-muted p-lg rounded-lg">3</div>
  <div className="bg-muted p-lg rounded-lg">4</div>
</Grid>`}
      >
        <Grid cols="4">
          <div className="bg-muted p-lg rounded-lg">1</div>
          <div className="bg-muted p-lg rounded-lg">2</div>
          <div className="bg-muted p-lg rounded-lg">3</div>
          <div className="bg-muted p-lg rounded-lg">4</div>
        </Grid>
      </ComponentPreview>

      <h2>Gap Sizes</h2>
      <ComponentPreview
        code={`<Grid gap="none">
  <div className="bg-muted p-lg rounded-lg">No Gap</div>
  <div className="bg-muted p-lg rounded-lg">No Gap</div>
  <div className="bg-muted p-lg rounded-lg">No Gap</div>
</Grid>`}
      >
        <Grid gap="none">
          <div className="bg-muted p-lg rounded-lg">No Gap</div>
          <div className="bg-muted p-lg rounded-lg">No Gap</div>
          <div className="bg-muted p-lg rounded-lg">No Gap</div>
        </Grid>
      </ComponentPreview>

      <ComponentPreview
        code={`<Grid gap="xl">
  <div className="bg-muted p-lg rounded-lg">Large Gap</div>
  <div className="bg-muted p-lg rounded-lg">Large Gap</div>
  <div className="bg-muted p-lg rounded-lg">Large Gap</div>
</Grid>`}
      >
        <Grid gap="xl">
          <div className="bg-muted p-lg rounded-lg">Large Gap</div>
          <div className="bg-muted p-lg rounded-lg">Large Gap</div>
          <div className="bg-muted p-lg rounded-lg">Large Gap</div>
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
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For card layouts and product grids</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For image galleries and media displays</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For dashboard widgets and metrics</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When you need equal-width columns</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use cols=&quot;3&quot; for most card layouts</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use cols=&quot;2&quot; for larger content cards</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use cols=&quot;4&quot; for compact items like icons or thumbnails</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Match gap size to the visual weight of content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Ensure grid items have consistent heights for best appearance</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Grid items reflow naturally on smaller screens</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard navigation works left-to-right, top-to-bottom</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Screen readers announce items in source order</span>
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
              <span>Use consistent content within grid items</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Match gap size to your design system spacing</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use appropriate column counts for content type</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Grid cols="3" gap="md">
  <div className="bg-card p-lg rounded-lg border border-border">
    <h3 className="font-semibold mb-sm">Card 1</h3>
    <p className="text-sm text-muted-foreground">Consistent content</p>
  </div>
  <div className="bg-card p-lg rounded-lg border border-border">
    <h3 className="font-semibold mb-sm">Card 2</h3>
    <p className="text-sm text-muted-foreground">Consistent content</p>
  </div>
  <div className="bg-card p-lg rounded-lg border border-border">
    <h3 className="font-semibold mb-sm">Card 3</h3>
    <p className="text-sm text-muted-foreground">Consistent content</p>
  </div>
</Grid>`}
            >
              <Grid cols="3" gap="md">
                <div className="bg-card p-lg rounded-lg border border-border">
                  <h3 className="font-semibold mb-sm">Card 1</h3>
                  <p className="text-sm text-muted-foreground">Consistent content</p>
                </div>
                <div className="bg-card p-lg rounded-lg border border-border">
                  <h3 className="font-semibold mb-sm">Card 2</h3>
                  <p className="text-sm text-muted-foreground">Consistent content</p>
                </div>
                <div className="bg-card p-lg rounded-lg border border-border">
                  <h3 className="font-semibold mb-sm">Card 3</h3>
                  <p className="text-sm text-muted-foreground">Consistent content</p>
                </div>
              </Grid>
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
              <span>Mix wildly different content heights</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use too many columns on small screens</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Overcrowd grids with excessive content</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Grid cols="3" gap="sm">
  <div className="bg-card p-lg rounded-lg border border-border">
    <h3 className="font-semibold mb-sm">Tall Card</h3>
    <p className="text-sm text-muted-foreground">This card has much more content than the others, creating an unbalanced layout. It stretches vertically while others remain short.</p>
  </div>
  <div className="bg-card p-lg rounded-lg border border-border">
    <h3 className="font-semibold mb-sm">Short</h3>
  </div>
  <div className="bg-card p-lg rounded-lg border border-border">
    <h3 className="font-semibold mb-sm">Also Short</h3>
  </div>
</Grid>`}
            >
              <Grid cols="3" gap="sm">
                <div className="bg-card p-lg rounded-lg border border-border">
                  <h3 className="font-semibold mb-sm">Tall Card</h3>
                  <p className="text-sm text-muted-foreground">This card has much more content than the others, creating an unbalanced layout. It stretches vertically while others remain short.</p>
                </div>
                <div className="bg-card p-lg rounded-lg border border-border">
                  <h3 className="font-semibold mb-sm">Short</h3>
                </div>
                <div className="bg-card p-lg rounded-lg border border-border">
                  <h3 className="font-semibold mb-sm">Also Short</h3>
                </div>
              </Grid>
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
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Stack
          </h3>
          <p className="text-sm text-muted-foreground">Arrange items vertically or horizontally with consistent spacing</p>
        </Link>

        <Link
          href="/components/card"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Card
          </h3>
          <p className="text-sm text-muted-foreground">Container for grouping related content</p>
        </Link>

        <Link
          href="/foundations/spacing"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Spacing
          </h3>
          <p className="text-sm text-muted-foreground">Consistent spacing tokens for gaps and margins</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/grid/grid.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout"
              external
              showIcon
            >
              MDN: CSS Grid Layout
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
