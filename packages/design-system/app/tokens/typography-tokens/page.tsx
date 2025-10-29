'use client';

import { TokenDisplay } from '../../../components/helpers/color-swatch';

export default function TypographyTokensPage() {
  const fontFamilies = [
    {
      name: 'Sans Serif',
      variable: '--font-sans',
      value: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      description: 'Primary font for UI and body text',
    },
    {
      name: 'Monospace',
      variable: '--font-mono',
      value: "'Fira Code', 'Monaco', 'Courier New', monospace",
      description: 'Font for code blocks and technical content',
    },
  ];

  const fontSizes = [
    {
      name: 'Extra Small',
      variable: '--font-size-xs',
      value: '0.75rem (12px)',
      example: 'Extra small text - captions, labels',
    },
    {
      name: 'Small',
      variable: '--font-size-sm',
      value: '0.875rem (14px)',
      example: 'Small text - secondary content, metadata',
    },
    {
      name: 'Medium',
      variable: '--font-size-md',
      value: '1rem (16px)',
      example: 'Medium text - body text, default size',
    },
    {
      name: 'Large',
      variable: '--font-size-lg',
      value: '1.125rem (18px)',
      example: 'Large text - emphasized content',
    },
    {
      name: 'Extra Large',
      variable: '--font-size-xl',
      value: '1.25rem (20px)',
      example: 'Extra large text - subheadings',
    },
    {
      name: '2X Large',
      variable: '--font-size-2xl',
      value: '1.5rem (24px)',
      example: '2X large text - section headings',
    },
    {
      name: '3X Large',
      variable: '--font-size-3xl',
      value: '1.875rem (30px)',
      example: '3X large text - page titles',
    },
    {
      name: '4X Large',
      variable: '--font-size-4xl',
      value: '2.25rem (36px)',
      example: '4X large text - hero headings',
    },
  ];

  const lineHeights = [
    {
      name: 'Tight',
      variable: '--line-height-tight',
      value: '1.25',
      description: 'For headings and short text',
    },
    {
      name: 'Normal',
      variable: '--line-height-normal',
      value: '1.5',
      description: 'Default line height for body text',
    },
    {
      name: 'Relaxed',
      variable: '--line-height-relaxed',
      value: '1.75',
      description: 'For long-form content',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Typography Tokens</h1>
      <p className="lead">
        Typography system including font families, sizes, weights, and line heights.
        Designed for readability and hierarchy across all devices.
      </p>

      <h2>Font Families</h2>
      <div className="not-prose space-y-4 mb-8">
        {fontFamilies.map((font) => (
          <TokenDisplay
            key={font.variable}
            name={font.name}
            variable={font.variable}
            value={font.value}
            description={font.description}
            preview={
              <span
                className="text-2xl"
                style={{
                  fontFamily:
                    font.variable === '--font-sans'
                      ? 'var(--font-sans)'
                      : 'var(--font-mono)',
                }}
              >
                Aa
              </span>
            }
          />
        ))}
      </div>

      <h3>Font Family Examples</h3>
      <div className="not-prose mb-8 space-y-4">
        <div className="p-md bg-muted rounded-lg">
          <p className="font-sans text-lg mb-2">
            The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-sm text-muted-foreground">Inter (Sans Serif) - Primary UI font</p>
        </div>
        <div className="p-md bg-muted rounded-lg">
          <p className="font-mono text-lg mb-2">
            The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-sm text-muted-foreground">Fira Code (Monospace) - Code font</p>
        </div>
      </div>

      <h2>Font Sizes</h2>
      <p>
        Type scale based on a modular scale for consistent visual hierarchy. Base size is 16px (1rem).
      </p>
      <div className="not-prose space-y-4 mb-8">
        {fontSizes.map((size) => (
          <TokenDisplay
            key={size.variable}
            name={size.name}
            variable={size.variable}
            value={size.value}
            description={size.example}
            preview={
              <span
                style={{
                  fontSize:
                    size.variable === '--font-size-xs'
                      ? '0.75rem'
                      : size.variable === '--font-size-sm'
                        ? '0.875rem'
                        : size.variable === '--font-size-md'
                          ? '1rem'
                          : size.variable === '--font-size-lg'
                            ? '1.125rem'
                            : size.variable === '--font-size-xl'
                              ? '1.25rem'
                              : size.variable === '--font-size-2xl'
                                ? '1.5rem'
                                : size.variable === '--font-size-3xl'
                                  ? '1.875rem'
                                  : '2.25rem',
                }}
              >
                Aa
              </span>
            }
          />
        ))}
      </div>

      <h3>Type Scale Examples</h3>
      <div className="not-prose mb-8 space-y-2">
        <p className="text-xs">Extra Small (12px) - Captions and fine print</p>
        <p className="text-sm">Small (14px) - Secondary content and metadata</p>
        <p className="text-md">Medium (16px) - Body text and default size</p>
        <p className="text-lg">Large (18px) - Emphasized content</p>
        <p className="text-xl">Extra Large (20px) - Subheadings</p>
        <p className="text-2xl">2X Large (24px) - Section headings</p>
        <p className="text-3xl">3X Large (30px) - Page titles</p>
        <p className="text-4xl">4X Large (36px) - Hero headings</p>
      </div>

      <h2>Line Heights</h2>
      <p>
        Line height tokens for optimal readability at different text sizes and contexts.
      </p>
      <div className="not-prose space-y-4 mb-8">
        {lineHeights.map((lineHeight) => (
          <TokenDisplay
            key={lineHeight.variable}
            name={lineHeight.name}
            variable={lineHeight.variable}
            value={lineHeight.value}
            description={lineHeight.description}
          />
        ))}
      </div>

      <h3>Line Height Examples</h3>
      <div className="not-prose mb-8 space-y-6">
        <div className="p-md bg-muted rounded-lg">
          <p
            className="text-md mb-2"
            style={{ lineHeight: 'var(--line-height-tight)' }}
          >
            Tight line height (1.25) - Perfect for headings where lines are close together for
            visual cohesion. Not recommended for body text.
          </p>
          <p className="text-sm text-muted-foreground">Tight (1.25)</p>
        </div>
        <div className="p-md bg-muted rounded-lg">
          <p
            className="text-md mb-2"
            style={{ lineHeight: 'var(--line-height-normal)' }}
          >
            Normal line height (1.5) - Standard for body text, balancing readability with
            efficient use of space. This is the default line height.
          </p>
          <p className="text-sm text-muted-foreground">Normal (1.5)</p>
        </div>
        <div className="p-md bg-muted rounded-lg">
          <p
            className="text-md mb-2"
            style={{ lineHeight: 'var(--line-height-relaxed)' }}
          >
            Relaxed line height (1.75) - Generous spacing for long-form content like articles
            and documentation. Improves readability for extended reading.
          </p>
          <p className="text-sm text-muted-foreground">Relaxed (1.75)</p>
        </div>
      </div>

      <h2>Heading Styles</h2>
      <p>
        Predefined heading styles with font size, weight, and line height. All headings use
        semibold weight (600) and tight tracking for visual impact.
      </p>
      <div className="not-prose mb-8 space-y-4">
        <h1 className="text-4xl font-semibold">Heading 1 (36px)</h1>
        <h2 className="text-3xl font-semibold">Heading 2 (30px)</h2>
        <h3 className="text-2xl font-semibold">Heading 3 (24px)</h3>
        <h4 className="text-xl font-semibold">Heading 4 (20px)</h4>
        <h5 className="text-lg font-semibold">Heading 5 (18px)</h5>
        <h6 className="text-md font-semibold">Heading 6 (16px)</h6>
      </div>

      <h2>Usage in Code</h2>
      <p>
        Always use typography tokens instead of hardcoded values:
      </p>
      <pre className="not-prose">
        <code>{`/* ✅ CORRECT: Use typography tokens */
.heading {
  font-family: var(--font-sans);
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-tight);
}

.body {
  font-family: var(--font-sans);
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
}

/* ❌ WRONG: Don't hardcode typography */
.heading {
  font-family: 'Inter', sans-serif;
  font-size: 30px;
  line-height: 1.25;
}`}</code>
      </pre>

      <h3>Tailwind CSS Classes</h3>
      <pre className="not-prose">
        <code>{`<h1 className="text-4xl font-semibold">Hero Heading</h1>
<h2 className="text-3xl font-semibold">Section Heading</h2>
<p className="text-md leading-normal">Body text paragraph</p>
<code className="font-mono text-sm">Code snippet</code>`}</code>
      </pre>

      <h2>Best Practices</h2>
      <ul>
        <li>Use <code>font-sans</code> for all UI text and body content</li>
        <li>Use <code>font-mono</code> only for code, technical data, and numeric values</li>
        <li>Default to <code>font-size-md</code> (16px) for body text</li>
        <li>Use <code>line-height-normal</code> (1.5) for most body text</li>
        <li>Use <code>line-height-tight</code> (1.25) for headings</li>
        <li>Use <code>line-height-relaxed</code> (1.75) for long-form content</li>
        <li>Maintain consistent hierarchy - don't skip heading levels</li>
        <li>Limit line length to 60-75 characters for optimal readability</li>
      </ul>

      <h2>Accessibility</h2>
      <ul>
        <li>Base font size is 16px for comfortable reading across devices</li>
        <li>All text sizes are in rem units for user font-size preference support</li>
        <li>Sufficient contrast ratios maintained for all text sizes</li>
        <li>Line heights ensure comfortable reading for users with dyslexia</li>
        <li>Font weights provide clear visual hierarchy for screen readers</li>
      </ul>
    </div>
  );
}
