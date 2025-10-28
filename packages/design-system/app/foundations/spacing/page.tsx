export default function SpacingPage() {
  const SpacingExample = ({
    name,
    variable,
    pixels,
  }: {
    name: string;
    variable: string;
    pixels: string;
  }) => (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-center gap-4">
        <div
          className="bg-primary shrink-0"
          style={{
            width: `var(${variable})`,
            height: `var(${variable})`,
          }}
        />
        <div>
          <div className="font-semibold text-foreground">{name}</div>
          <div className="text-sm text-muted-foreground font-mono">{variable}</div>
          <div className="text-sm text-muted-foreground">{pixels}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Spacing</h1>
      <p className="lead">
        A consistent spacing system creates rhythm and hierarchy in the interface.
        Our spacing scale uses rem units for better accessibility and scales
        proportionally with user font size preferences.
      </p>

      <h2>Spacing Scale</h2>
      <p>
        Our spacing scale follows a consistent progression that provides flexibility
        while maintaining visual harmony.
      </p>

      <div className="not-prose space-y-4 my-6">
        <SpacingExample name="XS" variable="--spacing-xs" pixels="4px (0.25rem)" />
        <SpacingExample name="SM" variable="--spacing-sm" pixels="8px (0.5rem)" />
        <SpacingExample name="MD" variable="--spacing-md" pixels="16px (1rem)" />
        <SpacingExample name="LG" variable="--spacing-lg" pixels="24px (1.5rem)" />
        <SpacingExample name="XL" variable="--spacing-xl" pixels="32px (2rem)" />
        <SpacingExample name="2XL" variable="--spacing-2xl" pixels="40px (2.5rem)" />
        <SpacingExample name="3XL" variable="--spacing-3xl" pixels="48px (3rem)" />
        <SpacingExample name="4XL" variable="--spacing-4xl" pixels="64px (4rem)" />
        <SpacingExample name="5XL" variable="--spacing-5xl" pixels="80px (5rem)" />
      </div>

      <h2>Usage Examples</h2>

      <h3>Component Padding</h3>
      <div className="not-prose my-6">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/30 p-4 border-b border-border">
            <code className="text-sm">padding: var(--spacing-xs)</code>
          </div>
          <div style={{ padding: 'var(--spacing-xs)' }} className="bg-muted/10">
            <div className="bg-primary/20 border border-primary rounded">
              XS Padding (4px)
            </div>
          </div>
        </div>
      </div>

      <div className="not-prose my-6">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/30 p-4 border-b border-border">
            <code className="text-sm">padding: var(--spacing-md)</code>
          </div>
          <div style={{ padding: 'var(--spacing-md)' }} className="bg-muted/10">
            <div className="bg-primary/20 border border-primary rounded">
              MD Padding (16px)
            </div>
          </div>
        </div>
      </div>

      <div className="not-prose my-6">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/30 p-4 border-b border-border">
            <code className="text-sm">padding: var(--spacing-xl)</code>
          </div>
          <div style={{ padding: 'var(--spacing-xl)' }} className="bg-muted/10">
            <div className="bg-primary/20 border border-primary rounded">
              XL Padding (32px)
            </div>
          </div>
        </div>
      </div>

      <h3>Component Gaps</h3>
      <div className="not-prose my-6">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/30 p-4 border-b border-border">
            <code className="text-sm">gap: var(--spacing-sm)</code>
          </div>
          <div className="p-4 bg-muted/10">
            <div className="flex" style={{ gap: 'var(--spacing-sm)' }}>
              <div className="bg-primary/20 border border-primary rounded px-4 py-2">
                Item 1
              </div>
              <div className="bg-primary/20 border border-primary rounded px-4 py-2">
                Item 2
              </div>
              <div className="bg-primary/20 border border-primary rounded px-4 py-2">
                Item 3
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="not-prose my-6">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/30 p-4 border-b border-border">
            <code className="text-sm">gap: var(--spacing-lg)</code>
          </div>
          <div className="p-4 bg-muted/10">
            <div className="flex" style={{ gap: 'var(--spacing-lg)' }}>
              <div className="bg-primary/20 border border-primary rounded px-4 py-2">
                Item 1
              </div>
              <div className="bg-primary/20 border border-primary rounded px-4 py-2">
                Item 2
              </div>
              <div className="bg-primary/20 border border-primary rounded px-4 py-2">
                Item 3
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2>Usage Guidelines</h2>

      <h3>When to use each size</h3>
      <ul>
        <li>
          <strong>XS (4px):</strong> Tight spacing within components, icon margins, badge gaps
        </li>
        <li>
          <strong>SM (8px):</strong> Small component padding, compact lists, inline elements
        </li>
        <li>
          <strong>MD (16px):</strong> Default component padding, standard gaps between related elements
        </li>
        <li>
          <strong>LG (24px):</strong> Spacing between component groups, card padding
        </li>
        <li>
          <strong>XL (32px):</strong> Section padding, spacing between major content blocks
        </li>
        <li>
          <strong>2XL-5XL (40px-80px):</strong> Page margins, hero sections, major layout divisions
        </li>
      </ul>

      <h3>Best Practices</h3>
      <ul>
        <li>Use spacing scale values instead of arbitrary numbers</li>
        <li>Maintain consistent spacing patterns throughout the interface</li>
        <li>Use larger spacing to create visual hierarchy and grouping</li>
        <li>Consider touch target sizes (minimum 44x44px) for interactive elements</li>
        <li>Test spacing at different viewport sizes and zoom levels</li>
      </ul>

      <h3>Tailwind Utilities</h3>
      <p>
        When using Tailwind CSS, spacing values are available through standard utilities:
      </p>
      <div className="not-prose bg-muted/30 rounded-lg p-4 my-4">
        <pre className="text-sm">
          <code>{`<!-- Padding -->
<div className="p-xs">4px padding</div>
<div className="p-md">16px padding</div>
<div className="px-lg py-md">24px horizontal, 16px vertical</div>

<!-- Margin -->
<div className="m-sm">8px margin</div>
<div className="mt-xl mb-lg">32px top, 24px bottom</div>

<!-- Gap (for flexbox/grid) -->
<div className="flex gap-md">16px gap</div>
<div className="grid gap-lg">24px gap</div>`}</code>
        </pre>
      </div>

      <h3>Accessibility</h3>
      <ul>
        <li>Ensure interactive elements have sufficient padding for touch targets (min 44x44px)</li>
        <li>Use spacing to create clear visual groups for screen reader users</li>
        <li>Spacing scales proportionally with user font size preferences (rem units)</li>
        <li>Maintain consistent spacing patterns to help users build mental models</li>
      </ul>
    </div>
  );
}
