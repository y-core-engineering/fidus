'use client';

import { ColorSwatch } from '../../../components/helpers/color-swatch';
import { TokenInspector } from '../../../components/helpers/token-inspector';
import { CodeBlock } from '../../../components/helpers/code-block';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';
import { Button } from '@fidus/ui/button';
import { ProgressBar } from '@fidus/ui/progress-bar';;
import { useState, useEffect } from 'react';
import { getAllTokens, type DesignToken } from '../../../components/helpers/get-tokens';

// Token descriptions mapping (for documentation purposes)
// Values come from CSS at runtime via getAllTokens()
const tokenMetadata: Record<string, { description: string; subcategory: string }> = {
  '--color-primary': { description: 'Gold brand color for backgrounds and primary actions', subcategory: 'brand' },
  '--color-primary-foreground': { description: 'Black text on gold backgrounds', subcategory: 'brand' },
  '--color-primary-hover': { description: 'Hover state for primary elements', subcategory: 'brand' },
  '--color-primary-active': { description: 'Active/pressed state for primary elements', subcategory: 'brand' },
  '--color-black': { description: 'Pure black', subcategory: 'brand' },
  '--color-white': { description: 'Pure white', subcategory: 'brand' },
  '--color-trust-local': { description: 'Green - Local processing (maximum privacy)', subcategory: 'trust' },
  '--color-trust-cloud': { description: 'Orange - Cloud processing', subcategory: 'trust' },
  '--color-trust-encrypted': { description: 'Blue - Encrypted data', subcategory: 'trust' },
  '--color-success': { description: 'Success states and confirmations', subcategory: 'semantic' },
  '--color-warning': { description: 'Warning states and cautions', subcategory: 'semantic' },
  '--color-error': { description: 'Error states and destructive actions', subcategory: 'semantic' },
  '--color-info': { description: 'Informational messages', subcategory: 'semantic' },
  '--color-urgent': { description: 'High urgency opportunities (red)', subcategory: 'urgency' },
  '--color-medium': { description: 'Medium urgency opportunities (amber)', subcategory: 'urgency' },
  '--color-low': { description: 'Low urgency opportunities (blue)', subcategory: 'urgency' },
  '--color-background': { description: 'Main background color', subcategory: 'neutral' },
  '--color-foreground': { description: 'Main text color', subcategory: 'neutral' },
  '--color-muted': { description: 'Lighter background for cards and surfaces', subcategory: 'neutral' },
  '--color-muted-foreground': { description: 'Subdued text color for secondary content', subcategory: 'neutral' },
  '--color-border': { description: 'Border color for dividers and outlines', subcategory: 'neutral' },
  '--color-input-bg': { description: 'Background color for input fields', subcategory: 'neutral' },
};

export default function ColorTokensPage() {
  const [allColorTokens, setAllColorTokens] = useState<DesignToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const tokens = getAllTokens().filter(t => t.category === 'color');
    // Add descriptions from metadata mapping
    const tokensWithDescriptions = tokens.map(token => ({
      ...token,
      description: tokenMetadata[token.variable]?.description || '',
    }));
    setAllColorTokens(tokensWithDescriptions);
    setIsLoading(false);
  }, []);

  const brandColors = allColorTokens.filter(t => tokenMetadata[t.variable]?.subcategory === 'brand');
  const trustColors = allColorTokens.filter(t => tokenMetadata[t.variable]?.subcategory === 'trust');
  const semanticColors = allColorTokens.filter(t => tokenMetadata[t.variable]?.subcategory === 'semantic');
  const urgencyColors = allColorTokens.filter(t => tokenMetadata[t.variable]?.subcategory === 'urgency');
  const neutralColors = allColorTokens.filter(t => tokenMetadata[t.variable]?.subcategory === 'neutral');

  if (isLoading) {
    return (
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Color Tokens</h1>
        <div className="rounded-lg border border-border bg-card p-lg my-lg">
          <div className="space-y-sm py-xl">
            <p className="text-sm text-muted-foreground text-center">Loading color tokens...</p>
            <ProgressBar indeterminate variant="primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Color Tokens</h1>
      <p className="lead">
        Semantic color tokens used throughout the Fidus Design System. All colors are defined as HSL values
        and exposed as CSS variables for consistency and theme support.
      </p>

      <h2>Brand Colors</h2>
      <p>
        Core brand colors including the signature Fidus gold and neutral black and white.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md not-prose mb-2xl">
        {brandColors.map((color) => (
          <ColorSwatch key={color.variable} {...color} />
        ))}
      </div>

      <h2>Trust Colors (Privacy)</h2>
      <p>
        Colors indicating privacy levels and data processing locations. Used in Privacy Badges
        to communicate transparency to users.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md not-prose mb-2xl">
        {trustColors.map((color) => (
          <ColorSwatch key={color.variable} {...color} />
        ))}
      </div>

      <h2>Semantic Colors</h2>
      <p>
        Standard semantic colors for feedback, alerts, and status indicators.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md not-prose mb-2xl">
        {semanticColors.map((color) => (
          <ColorSwatch key={color.variable} {...color} />
        ))}
      </div>

      <h2>Urgency Colors</h2>
      <p>
        Colors used to indicate urgency levels in OpportunityCards and priority indicators.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md not-prose mb-2xl">
        {urgencyColors.map((color) => (
          <ColorSwatch key={color.variable} {...color} />
        ))}
      </div>

      <h2>Neutral Colors</h2>
      <p>
        Foundation colors for backgrounds, text, and surfaces. These adapt in dark mode.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md not-prose mb-2xl">
        {neutralColors.map((color) => (
          <ColorSwatch key={color.variable} {...color} />
        ))}
      </div>

      <h2>Usage in Code</h2>
      <p>
        Colors should always be referenced via CSS variables, never hardcoded as hex values:
      </p>
      <div className="not-prose my-lg">
        <CodeBlock
          language="css"
          code={`/* ✅ CORRECT: Use CSS variables */
.button {
  background-color: hsl(var(--color-primary));
  color: hsl(var(--color-primary-foreground));
}

/* ❌ WRONG: Don't hardcode colors */
.button {
  background-color: #FFD700;
  color: #000000;
}`}
        />
      </div>

      <h3>Tailwind CSS Classes</h3>
      <p>
        Tailwind utility classes are preconfigured to use these color tokens:
      </p>
      <div className="not-prose my-lg">
        <div className="space-y-md p-md border border-border rounded-lg bg-card">
          <button className="bg-primary text-primary-foreground hover:bg-primary-hover px-md py-sm rounded-md transition-colors">
            Primary Button
          </button>
          <div className="bg-muted text-muted-foreground border border-border p-md rounded-md">
            Muted Card
          </div>
        </div>
      </div>
      <div className="not-prose my-lg">
        <CodeBlock
          language="tsx"
          code={`<button className="bg-primary text-primary-foreground hover:bg-primary-hover">
  Primary Button
</button>

<div className="bg-muted text-muted-foreground border border-border">
  Muted Card
</div>`}
        />
      </div>

      <h2>Dark Mode</h2>
      <p>
        Neutral colors automatically adapt in dark mode. Brand, semantic, and urgency colors
        remain consistent across themes for recognition and consistency.
      </p>
      <div className="not-prose my-lg">
        <p className="text-sm text-muted-foreground mb-sm">Dark mode overrides:</p>
        <CodeBlock
          language="css"
          code={`.dark {
  --color-background: 0 0% 9%;     /* #171717 */
  --color-foreground: 0 0% 98%;    /* #FAFAFA */
  --color-muted: 0 0% 15%;         /* #262626 */
  --color-muted-foreground: 0 0% 64%; /* #A3A3A3 */
  --color-border: 0 0% 18%;        /* #2E2E2E */
  --color-input-bg: 0 0% 11%;      /* #1C1C1C */
}`}
        />
      </div>

      <h2>Accessibility</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-sm text-sm">
          <li className="flex gap-sm">
            <span className="text-muted-foreground shrink-0">•</span>
            <span>All color combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for text)</span>
          </li>
          <li className="flex gap-sm">
            <span className="text-muted-foreground shrink-0">•</span>
            <span>Color is never the only indicator - text labels accompany colored elements</span>
          </li>
          <li className="flex gap-sm">
            <span className="text-muted-foreground shrink-0">•</span>
            <span>Trust colors are distinguishable for users with color blindness</span>
          </li>
          <li className="flex gap-sm">
            <span className="text-muted-foreground shrink-0">•</span>
            <span>Focus indicators use sufficient contrast for keyboard navigation</span>
          </li>
        </ul>
      </div>

      <h2>Usage Examples in Context</h2>
      <p>
        Practical examples showing how color tokens work together in real components:
      </p>

      <h3>Button States</h3>
      <div className="not-prose my-lg">
        <Stack direction="horizontal" spacing="sm">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="destructive">Destructive</Button>
        </Stack>
      </div>
      <div className="not-prose mt-md">
        <CodeBlock
          language="tsx"
          code={`<Stack direction="horizontal" spacing="sm">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="tertiary">Tertiary</Button>
  <Button variant="destructive">Destructive</Button>
</Stack>`}
        />
      </div>

      <h3>Trust Badges</h3>
      <div className="not-prose my-lg">
        <Stack direction="horizontal" spacing="sm">
          <div className="px-sm py-xs bg-trust-local/10 text-trust-local border border-trust-local rounded-md text-xs font-semibold">
            Local Processing
          </div>
          <div className="px-sm py-xs bg-trust-cloud/10 text-trust-cloud border border-trust-cloud rounded-md text-xs font-semibold">
            Cloud Processing
          </div>
          <div className="px-sm py-xs bg-trust-encrypted/10 text-trust-encrypted border border-trust-encrypted rounded-md text-xs font-semibold">
            Encrypted
          </div>
        </Stack>
      </div>
      <div className="not-prose mt-md">
        <CodeBlock
          language="tsx"
          code={`<Stack direction="horizontal" spacing="sm">
  <div className="px-sm py-xs bg-trust-local/10 text-trust-local border border-trust-local rounded-md text-xs font-semibold">
    Local Processing
  </div>
  <div className="px-sm py-xs bg-trust-cloud/10 text-trust-cloud border border-trust-cloud rounded-md text-xs font-semibold">
    Cloud Processing
  </div>
  <div className="px-sm py-xs bg-trust-encrypted/10 text-trust-encrypted border border-trust-encrypted rounded-md text-xs font-semibold">
    Encrypted
  </div>
</Stack>`}
        />
      </div>

      <h3>Semantic Alerts</h3>
      <div className="not-prose my-lg space-y-md">
        <div className="p-md bg-success/10 border-l-4 border-success rounded-md">
          <p className="text-sm text-success font-semibold mb-xs">Success</p>
          <p className="text-sm">Your changes have been saved successfully.</p>
        </div>
        <div className="p-md bg-warning/10 border-l-4 border-warning rounded-md">
          <p className="text-sm text-warning font-semibold mb-xs">Warning</p>
          <p className="text-sm">Please review your input before continuing.</p>
        </div>
        <div className="p-md bg-error/10 border-l-4 border-error rounded-md">
          <p className="text-sm text-error font-semibold mb-xs">Error</p>
          <p className="text-sm">An error occurred while processing your request.</p>
        </div>
      </div>
      <div className="not-prose mt-md">
        <CodeBlock
          language="tsx"
          code={`<div className="p-md bg-success/10 border-l-4 border-success rounded-md">
  <p className="text-sm text-success font-semibold mb-xs">Success</p>
  <p className="text-sm">Your changes have been saved successfully.</p>
</div>

<div className="p-md bg-warning/10 border-l-4 border-warning rounded-md">
  <p className="text-sm text-warning font-semibold mb-xs">Warning</p>
  <p className="text-sm">Please review your input before continuing.</p>
</div>

<div className="p-md bg-error/10 border-l-4 border-error rounded-md">
  <p className="text-sm text-error font-semibold mb-xs">Error</p>
  <p className="text-sm">An error occurred while processing your request.</p>
</div>`}
        />
      </div>

      <h2>All Color Tokens</h2>
      <p>Interactive inspector with all {allColorTokens.length} color tokens:</p>
      <TokenInspector tokens={allColorTokens} type="color" />

      <h2>Related Tokens</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/tokens/typography-tokens"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Typography Tokens
          </h3>
          <p className="text-sm text-muted-foreground">Font sizes and text colors</p>
        </Link>
        <Link
          href="/tokens/spacing-tokens"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Spacing Tokens
          </h3>
          <p className="text-sm text-muted-foreground">Padding and margins for colored elements</p>
        </Link>
        <Link
          href="/tokens/shadow-tokens"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Shadow Tokens
          </h3>
          <p className="text-sm text-muted-foreground">Elevation that enhances color depth</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/design-system/app/tokens/color-tokens/page.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html"
              external
              showIcon
            >
              WCAG Contrast Requirements
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://webaim.org/resources/contrastchecker/"
              external
              showIcon
            >
              WebAIM Contrast Checker
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
