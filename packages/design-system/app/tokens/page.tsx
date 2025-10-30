'use client';

import { Link, Stack, Button } from '@fidus/ui';
import { Palette, Type, Ruler, Box, Zap, Download, FileJson, FileCode } from 'lucide-react';
import { useState } from 'react';

export default function TokensOverviewPage() {
  const [exportFormat, setExportFormat] = useState<'json' | 'css'>('json');

  const tokenCategories = [
    {
      title: 'Color Tokens',
      href: '/tokens/color-tokens',
      icon: Palette,
      description: 'Brand colors, semantic colors, trust indicators, and neutral shades',
      count: '50+ tokens',
      examples: ['Primary', 'Success', 'Error', 'Trust Local', 'Background'],
    },
    {
      title: 'Typography Tokens',
      href: '/tokens/typography-tokens',
      icon: Type,
      description: 'Font families, sizes, weights, line heights, and letter spacing',
      count: '30+ tokens',
      examples: ['Heading XL', 'Body MD', 'Caption SM', 'Code', 'Line Height'],
    },
    {
      title: 'Spacing Tokens',
      href: '/tokens/spacing-tokens',
      icon: Ruler,
      description: 'Consistent spacing scale for margins, padding, and gaps',
      count: '12 tokens',
      examples: ['XS (4px)', 'SM (8px)', 'MD (16px)', 'LG (24px)', 'XL (32px)'],
    },
    {
      title: 'Shadow Tokens',
      href: '/tokens/shadow-tokens',
      icon: Box,
      description: 'Elevation levels and depth indicators for UI hierarchy',
      count: '6 tokens',
      examples: ['SM', 'MD', 'LG', 'XL', 'Inner', 'None'],
    },
    {
      title: 'Motion Tokens',
      href: '/tokens/motion-tokens',
      icon: Zap,
      description: 'Animation durations and easing functions for smooth transitions',
      count: '10+ tokens',
      examples: ['Fast', 'Normal', 'Slow', 'Ease In', 'Ease Out'],
    },
  ];

  const handleExportAll = () => {
    // This would aggregate all tokens from all pages
    const allTokens = {
      colors: {},
      typography: {},
      spacing: {},
      shadows: {},
      motion: {},
    };

    let output = '';
    if (exportFormat === 'json') {
      output = JSON.stringify(allTokens, null, 2);
    } else {
      output = `:root {
  /* Color Tokens */
  --color-primary: 45 100% 51%;
  --color-success: 122 39% 49%;

  /* Typography Tokens */
  --font-family-sans: Inter, system-ui, sans-serif;
  --font-size-md: 1rem;

  /* Spacing Tokens */
  --spacing-md: 1rem;

  /* Shadow Tokens */
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);

  /* Motion Tokens */
  --duration-normal: 200ms;
}`;
    }

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fidus-design-tokens.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Design Tokens</h1>
      <p className="lead">
        A comprehensive system of design decisions codified as reusable variables for consistent UI
        implementation across the Fidus platform.
      </p>

      {/* What are Design Tokens? */}
      <h2>What are Design Tokens?</h2>
      <div className="not-prose my-lg">
        <div className="space-y-md">
          <p className="text-base">
            Design tokens are the atomic building blocks of a design system. They store design
            decisions as data (colors, spacing, typography) and make them reusable across platforms
            and technologies.
          </p>

          <div className="bg-muted rounded-lg p-lg space-y-md">
            <h3 className="text-lg font-semibold">Why Design Tokens?</h3>
            <ul className="space-y-sm text-sm">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>
                  <strong>Consistency:</strong> Ensures uniform design across all components and
                  pages
                </span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>
                  <strong>Maintainability:</strong> Update design system-wide by changing a single
                  token value
                </span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>
                  <strong>Scalability:</strong> Easily extend the design system with new tokens
                </span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>
                  <strong>Cross-platform:</strong> Export tokens to CSS, JSON, iOS, Android, and
                  more
                </span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>
                  <strong>Collaboration:</strong> Provides a shared language between designers and
                  developers
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Token Categories */}
      <h2>Token Categories</h2>
      <p>
        The Fidus Design System organizes design tokens into five core categories, each serving a
        specific purpose in the visual hierarchy and user experience.
      </p>

      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        {tokenCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.href}
              href={category.href}
              className="group block border-2 border-border rounded-lg p-lg hover:border-primary hover:shadow-lg transition-all duration-normal no-underline"
            >
              <Stack direction="horizontal" spacing="md" align="start">
                <div className="p-sm bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors duration-normal">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 space-y-sm">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-normal">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <div className="flex items-center gap-md pt-xs">
                    <span className="text-xs font-medium text-primary">{category.count}</span>
                    <span className="text-xs text-muted-foreground">
                      {category.examples.slice(0, 3).join(' • ')}
                    </span>
                  </div>
                </div>
              </Stack>
            </Link>
          );
        })}
      </div>

      {/* Export Options */}
      <h2>Export Design Tokens</h2>
      <p>
        Download all Fidus design tokens in your preferred format for use in your own projects or
        external design tools.
      </p>

      <div className="not-prose bg-muted rounded-lg p-lg my-lg space-y-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">Export Format</h3>
          <Stack direction="horizontal" spacing="md">
            <Button
              variant={exportFormat === 'json' ? 'primary' : 'secondary'}
              onClick={() => setExportFormat('json')}
            >
              <FileJson className="w-4 h-4" />
              JSON
            </Button>
            <Button
              variant={exportFormat === 'css' ? 'primary' : 'secondary'}
              onClick={() => setExportFormat('css')}
            >
              <FileCode className="w-4 h-4" />
              CSS Variables
            </Button>
          </Stack>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Export All Tokens</h3>
          <p className="text-sm text-muted-foreground mb-md">
            Download all design tokens from all categories in a single file.
          </p>
          <Button variant="primary" onClick={handleExportAll}>
            <Download className="w-4 h-4" />
            Download All Tokens ({exportFormat.toUpperCase()})
          </Button>
        </div>

        <div className="pt-md border-t border-border">
          <p className="text-sm text-muted-foreground">
            Individual token categories can also be exported from their respective pages. Visit each
            token page to export specific token groups.
          </p>
        </div>
      </div>

      {/* How to Use Design Tokens */}
      <h2>How to Use Design Tokens</h2>
      <div className="not-prose my-lg space-y-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">In CSS</h3>
          <div className="bg-muted rounded-md p-md font-mono text-sm">
            <pre className="text-foreground">
              {`.button {
  background-color: hsl(var(--color-primary));
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  transition: background-color var(--duration-normal);
}`}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">In Tailwind CSS</h3>
          <div className="bg-muted rounded-md p-md font-mono text-sm">
            <pre className="text-foreground">
              {`<button className="bg-primary text-primary-foreground px-lg py-md rounded-md text-md hover:bg-primary-hover transition-colors duration-normal">
  Click me
</button>`}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">In React Components</h3>
          <div className="bg-muted rounded-md p-md font-mono text-sm">
            <pre className="text-foreground">
              {`import { Button } from '@fidus/ui';

function MyComponent() {
  return (
    <Button variant="primary" size="md">
      Click me
    </Button>
  );
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <h2>Best Practices</h2>
      <div className="not-prose my-lg">
        <div className="space-y-md">
          <div className="flex gap-sm">
            <span className="text-success shrink-0 text-lg">✓</span>
            <div>
              <strong>Use semantic tokens</strong> - Use <code>--color-error</code> instead of{' '}
              <code>--color-red-500</code> for better maintainability
            </div>
          </div>
          <div className="flex gap-sm">
            <span className="text-success shrink-0 text-lg">✓</span>
            <div>
              <strong>Stay within the system</strong> - Always use design tokens instead of
              hardcoded values
            </div>
          </div>
          <div className="flex gap-sm">
            <span className="text-success shrink-0 text-lg">✓</span>
            <div>
              <strong>Use Tailwind utilities</strong> - Prefer <code>bg-primary</code> over custom
              CSS with <code>var(--color-primary)</code>
            </div>
          </div>
          <div className="flex gap-sm">
            <span className="text-error shrink-0 text-lg">✗</span>
            <div>
              <strong>Don't hardcode values</strong> - Avoid <code>padding: 16px</code> - use{' '}
              <code>p-md</code> instead
            </div>
          </div>
          <div className="flex gap-sm">
            <span className="text-error shrink-0 text-lg">✗</span>
            <div>
              <strong>Don't create custom tokens</strong> - If a token doesn't exist, request it
              through the design system
            </div>
          </div>
        </div>
      </div>

      {/* Related Resources */}
      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/tree/main/packages/ui/src/styles"
              external
              showIcon
            >
              View tokens source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/community/design-tokens/"
              external
              showIcon
            >
              W3C Design Tokens Community Group
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/for-developers">
              Developer installation guide
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/for-designers">
              Designer workflow guide
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
