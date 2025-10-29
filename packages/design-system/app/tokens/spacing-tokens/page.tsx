'use client';

import { TokenDisplay } from '../../../components/helpers/color-swatch';

export default function SpacingTokensPage() {
  const spacingTokens = [
    {
      name: 'Extra Small',
      variable: '--spacing-xs',
      value: '0.25rem (4px)',
      size: '4px',
    },
    {
      name: 'Small',
      variable: '--spacing-sm',
      value: '0.5rem (8px)',
      size: '8px',
    },
    {
      name: 'Medium',
      variable: '--spacing-md',
      value: '1rem (16px)',
      size: '16px',
    },
    {
      name: 'Large',
      variable: '--spacing-lg',
      value: '1.5rem (24px)',
      size: '24px',
    },
    {
      name: 'Extra Large',
      variable: '--spacing-xl',
      value: '2rem (32px)',
      size: '32px',
    },
    {
      name: '2X Large',
      variable: '--spacing-2xl',
      value: '3rem (48px)',
      size: '48px',
    },
    {
      name: '3X Large',
      variable: '--spacing-3xl',
      value: '4rem (64px)',
      size: '64px',
    },
  ];

  const radiusTokens = [
    {
      name: 'Small Radius',
      variable: '--radius-sm',
      value: '0.25rem (4px)',
      description: 'Small rounded corners',
    },
    {
      name: 'Medium Radius',
      variable: '--radius-md',
      value: '0.5rem (8px)',
      description: 'Standard rounded corners (most components)',
    },
    {
      name: 'Large Radius',
      variable: '--radius-lg',
      value: '0.75rem (12px)',
      description: 'Large rounded corners (cards)',
    },
    {
      name: 'Extra Large Radius',
      variable: '--radius-xl',
      value: '1rem (16px)',
      description: 'Extra large rounded corners',
    },
    {
      name: 'Full Radius',
      variable: '--radius-full',
      value: '9999px',
      description: 'Fully circular (pills, avatars)',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Spacing Tokens</h1>
      <p className="lead">
        Consistent spacing scale used for margins, padding, and gaps throughout the design system.
        All spacing values are based on a 4px base unit for pixel-perfect alignment.
      </p>

      <h2>Spacing Scale</h2>
      <p>
        Our spacing scale follows a progressive scale that doubles at each step after the base unit,
        ensuring visual rhythm and consistency.
      </p>
      <div className="not-prose space-y-4 mb-8">
        {spacingTokens.map((token) => (
          <TokenDisplay
            key={token.variable}
            name={token.name}
            variable={token.variable}
            value={token.value}
            preview={
              <div
                className="bg-primary"
                style={{
                  width: token.size,
                  height: token.size,
                }}
              />
            }
          />
        ))}
      </div>

      <h2>Visual Examples</h2>

      <h3>Padding Examples</h3>
      <div className="not-prose mb-8 space-y-4">
        <div className="border border-border rounded-md p-xs bg-muted">
          <div className="bg-primary rounded-sm h-8 flex items-center justify-center text-xs text-primary-foreground">
            padding-xs (4px)
          </div>
        </div>
        <div className="border border-border rounded-md p-sm bg-muted">
          <div className="bg-primary rounded-sm h-8 flex items-center justify-center text-xs text-primary-foreground">
            padding-sm (8px)
          </div>
        </div>
        <div className="border border-border rounded-md p-md bg-muted">
          <div className="bg-primary rounded-sm h-8 flex items-center justify-center text-xs text-primary-foreground">
            padding-md (16px)
          </div>
        </div>
        <div className="border border-border rounded-md p-lg bg-muted">
          <div className="bg-primary rounded-sm h-8 flex items-center justify-center text-xs text-primary-foreground">
            padding-lg (24px)
          </div>
        </div>
      </div>

      <h3>Gap Examples</h3>
      <div className="not-prose mb-8 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">gap-sm (8px)</p>
          <div className="flex gap-sm">
            <div className="w-12 h-12 bg-primary rounded-md" />
            <div className="w-12 h-12 bg-primary rounded-md" />
            <div className="w-12 h-12 bg-primary rounded-md" />
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">gap-md (16px)</p>
          <div className="flex gap-md">
            <div className="w-12 h-12 bg-primary rounded-md" />
            <div className="w-12 h-12 bg-primary rounded-md" />
            <div className="w-12 h-12 bg-primary rounded-md" />
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">gap-lg (24px)</p>
          <div className="flex gap-lg">
            <div className="w-12 h-12 bg-primary rounded-md" />
            <div className="w-12 h-12 bg-primary rounded-md" />
            <div className="w-12 h-12 bg-primary rounded-md" />
          </div>
        </div>
      </div>

      <h2>Border Radius</h2>
      <p>
        Standard border radius values for rounded corners. Most components use medium radius by default.
      </p>
      <div className="not-prose space-y-4 mb-8">
        {radiusTokens.map((token) => (
          <TokenDisplay
            key={token.variable}
            name={token.name}
            variable={token.variable}
            value={token.value}
            description={token.description}
            preview={
              <div
                className="w-12 h-12 bg-primary"
                style={{
                  borderRadius:
                    token.variable === '--radius-full'
                      ? '9999px'
                      : token.value.split(' ')[0],
                }}
              />
            }
          />
        ))}
      </div>

      <h2>Usage in Code</h2>
      <p>
        Always use spacing tokens instead of hardcoded pixel values:
      </p>
      <pre className="not-prose">
        <code>{`/* ✅ CORRECT: Use spacing tokens */
.card {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-sm);
  border-radius: var(--radius-lg);
}

/* ❌ WRONG: Don't hardcode spacing */
.card {
  padding: 16px;
  margin-bottom: 24px;
  gap: 8px;
  border-radius: 12px;
}`}</code>
      </pre>

      <h3>Tailwind CSS Classes</h3>
      <p>
        Tailwind utility classes are preconfigured to use these spacing tokens:
      </p>
      <pre className="not-prose">
        <code>{`<div className="p-md mb-lg gap-sm rounded-lg">
  Content with standard spacing
</div>

<div className="space-y-md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>`}</code>
      </pre>

      <h2>Best Practices</h2>
      <ul>
        <li>Use the spacing scale consistently - avoid custom values</li>
        <li>Default to <code>spacing-md</code> (16px) for most padding and margins</li>
        <li>Use <code>spacing-sm</code> (8px) for tight spacing within components</li>
        <li>Use <code>spacing-lg</code> (24px) or larger for section spacing</li>
        <li>Default to <code>radius-md</code> (8px) for most components</li>
        <li>Use <code>radius-lg</code> (12px) for cards and larger surfaces</li>
        <li>Use <code>radius-full</code> for circular elements (avatars, pills)</li>
      </ul>

      <h2>Component Guidelines</h2>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Padding</th>
            <th>Gap</th>
            <th>Radius</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Button</td>
            <td>sm-md</td>
            <td>sm</td>
            <td>md</td>
          </tr>
          <tr>
            <td>Card</td>
            <td>md-lg</td>
            <td>md</td>
            <td>lg</td>
          </tr>
          <tr>
            <td>Input</td>
            <td>sm-md</td>
            <td>-</td>
            <td>md</td>
          </tr>
          <tr>
            <td>Modal</td>
            <td>lg-xl</td>
            <td>md</td>
            <td>lg</td>
          </tr>
          <tr>
            <td>Badge</td>
            <td>xs-sm</td>
            <td>xs</td>
            <td>sm</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
