'use client';

import { Link, Stack, Button, ProgressBar } from '@fidus/ui';
import { Palette, Type, Ruler, Box, Zap, Download, FileJson, FileCode } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TokenInspector } from '../../components/helpers/token-inspector';
import { ComponentPreview } from '../../components/helpers/component-preview';
import { getAllTokens, type DesignToken } from '../../components/helpers/get-tokens';

export default function TokensOverviewPage() {
  const [exportFormat, setExportFormat] = useState<'json' | 'css'>('json');
  const [allTokens, setAllTokens] = useState<DesignToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Read tokens from CSS variables at runtime
  useEffect(() => {
    setIsLoading(true);
    setAllTokens(getAllTokens());
    setIsLoading(false);
  }, []);

  // Calculate actual token counts per category
  const colorCount = allTokens.filter(t => t.category === 'color').length;
  const typographyCount = allTokens.filter(t => t.category === 'typography').length;
  const spacingCount = allTokens.filter(t => t.category === 'spacing').length;
  const shadowCount = allTokens.filter(t => t.category === 'shadow').length;
  const motionCount = allTokens.filter(t => t.category === 'motion').length;

  const tokenCategories = [
    {
      title: 'Color Tokens',
      href: '/tokens/color-tokens',
      icon: Palette,
      description: 'Brand colors, semantic colors, trust indicators, and neutral shades',
      count: colorCount > 0 ? `${colorCount} tokens` : undefined,
      examples: ['Primary', 'Success', 'Error', 'Trust Local', 'Background'],
    },
    {
      title: 'Typography Tokens',
      href: '/tokens/typography-tokens',
      icon: Type,
      description: 'Font families, sizes, weights, line heights, and letter spacing',
      count: typographyCount > 0 ? `${typographyCount} tokens` : undefined,
      examples: ['Heading XL', 'Body MD', 'Caption SM', 'Code', 'Line Height'],
    },
    {
      title: 'Spacing Tokens',
      href: '/tokens/spacing-tokens',
      icon: Ruler,
      description: 'Consistent spacing scale for margins, padding, and gaps',
      count: spacingCount > 0 ? `${spacingCount} tokens` : undefined,
      examples: ['XS (4px)', 'SM (8px)', 'MD (16px)', 'LG (24px)', 'XL (32px)'],
    },
    {
      title: 'Shadow Tokens',
      href: '/tokens/shadow-tokens',
      icon: Box,
      description: 'Elevation levels and depth indicators for UI hierarchy',
      count: shadowCount > 0 ? `${shadowCount} tokens` : undefined,
      examples: ['SM', 'MD', 'LG', 'XL', 'Inner', 'None'],
    },
    {
      title: 'Motion Tokens',
      href: '/tokens/motion-tokens',
      icon: Zap,
      description: 'Animation durations and easing functions for smooth transitions',
      count: motionCount > 0 ? `${motionCount} tokens` : undefined,
      examples: ['Fast', 'Normal', 'Slow', 'Ease In', 'Ease Out'],
    },
  ];


  const handleExportAll = () => {
    // Export all tokens in the selected format
    let output = '';
    if (exportFormat === 'json') {
      const jsonData = allTokens.reduce((acc, token) => {
        acc[token.name] = token.value;
        return acc;
      }, {} as Record<string, string>);
      output = JSON.stringify(jsonData, null, 2);
    } else {
      output = `:root {\n${allTokens.map(t => `  ${t.variable}: ${t.value};`).join('\n')}\n}`;
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
                    {isLoading ? (
                      <div className="w-16">
                        <ProgressBar indeterminate variant="primary" size="sm" />
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-primary">{category.count}</span>
                    )}
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

      {/* Interactive Token Inspector */}
      <h2>Interactive Token Inspector</h2>
      <p>
        Explore all design tokens from every category. Use search and filters to find specific tokens,
        copy values, and see visual previews. This inspector includes all {allTokens.length} tokens from
        colors, typography, spacing, shadows, and motion.
      </p>

      <div className="not-prose my-lg">
        {isLoading ? (
          <div className="rounded-lg border border-border bg-card p-lg">
            <div className="space-y-sm py-xl">
              <p className="text-sm text-muted-foreground text-center">Loading design tokens...</p>
              <ProgressBar indeterminate variant="primary" />
            </div>
          </div>
        ) : (
          <TokenInspector tokens={allTokens} type="color" />
        )}
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

      {/* Do's and Don'ts */}
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
              <span>Use semantic tokens like <code>--color-error</code> instead of <code>--color-red-500</code></span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Stay within the design system - always use tokens instead of hardcoded values</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use Tailwind utilities like <code>bg-primary</code> over custom CSS</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Reference tokens from individual category pages for complete token sets</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Export tokens in your preferred format (JSON/CSS) for external use</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview code={`<Button className="bg-primary text-primary-foreground p-md">\n  Good Example\n</Button>`}>
              <Button className="bg-primary text-primary-foreground p-md">
                Good Example
              </Button>
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
              <span>Don't hardcode values like <code>padding: 16px</code> - use <code>p-md</code></span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't create custom tokens outside the design system</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use arbitrary Tailwind values like <code>p-[17px]</code></span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't mix token systems - stick to Fidus tokens consistently</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use color codes directly - use semantic color tokens</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview code={`<button style={{ padding: '16px', background: '#FFD700' }}>\n  Bad Example\n</button>`}>
              <button style={{ padding: '16px', background: '#FFD700' }} className="rounded-md text-black">
                Bad Example
              </button>
            </ComponentPreview>
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
