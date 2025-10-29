'use client';

import { ColorSwatch } from '../../../components/helpers/color-swatch';

export default function ColorTokensPage() {
  const brandColors = [
    {
      name: 'Primary',
      variable: '--color-primary',
      value: '45 100% 51%',
      description: 'Gold brand color for backgrounds and primary actions',
    },
    {
      name: 'Primary Foreground',
      variable: '--color-primary-foreground',
      value: '0 0% 0%',
      description: 'Black text on gold backgrounds',
    },
    {
      name: 'Primary Hover',
      variable: '--color-primary-hover',
      value: '45 100% 45%',
      description: 'Hover state for primary elements',
    },
    {
      name: 'Primary Active',
      variable: '--color-primary-active',
      value: '45 100% 38%',
      description: 'Active/pressed state for primary elements',
    },
    {
      name: 'Black',
      variable: '--color-black',
      value: '0 0% 0%',
      description: 'Pure black',
    },
    {
      name: 'White',
      variable: '--color-white',
      value: '0 0% 100%',
      description: 'Pure white',
    },
  ];

  const trustColors = [
    {
      name: 'Trust Local',
      variable: '--color-trust-local',
      value: '122 39% 33%',
      description: 'Green - Local processing (maximum privacy)',
    },
    {
      name: 'Trust Cloud',
      variable: '--color-trust-cloud',
      value: '27 96% 48%',
      description: 'Orange - Cloud processing',
    },
    {
      name: 'Trust Encrypted',
      variable: '--color-trust-encrypted',
      value: '207 77% 47%',
      description: 'Blue - Encrypted data',
    },
  ];

  const semanticColors = [
    {
      name: 'Success',
      variable: '--color-success',
      value: '122 39% 49%',
      description: 'Success states and confirmations',
    },
    {
      name: 'Warning',
      variable: '--color-warning',
      value: '36 100% 50%',
      description: 'Warning states and cautions',
    },
    {
      name: 'Error',
      variable: '--color-error',
      value: '4 90% 58%',
      description: 'Error states and destructive actions',
    },
    {
      name: 'Info',
      variable: '--color-info',
      value: '207 90% 54%',
      description: 'Informational messages',
    },
  ];

  const urgencyColors = [
    {
      name: 'Urgent',
      variable: '--color-urgent',
      value: '4 90% 58%',
      description: 'High urgency opportunities (red)',
    },
    {
      name: 'Medium',
      variable: '--color-medium',
      value: '36 100% 50%',
      description: 'Medium urgency opportunities (amber)',
    },
    {
      name: 'Low',
      variable: '--color-low',
      value: '207 90% 54%',
      description: 'Low urgency opportunities (blue)',
    },
  ];

  const neutralColors = [
    {
      name: 'Background',
      variable: '--color-background',
      value: '0 0% 100%',
      description: 'Main background color (light mode)',
    },
    {
      name: 'Foreground',
      variable: '--color-foreground',
      value: '0 0% 0%',
      description: 'Main text color (light mode)',
    },
    {
      name: 'Muted',
      variable: '--color-muted',
      value: '0 0% 96%',
      description: 'Lighter background for cards and surfaces',
    },
    {
      name: 'Muted Foreground',
      variable: '--color-muted-foreground',
      value: '0 0% 40%',
      description: 'Subdued text color for secondary content',
    },
    {
      name: 'Border',
      variable: '--color-border',
      value: '0 0% 88%',
      description: 'Border color for dividers and outlines',
    },
    {
      name: 'Input Background',
      variable: '--color-input-bg',
      value: '0 0% 100%',
      description: 'Background color for input fields',
    },
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
        {brandColors.map((color) => (
          <ColorSwatch key={color.variable} {...color} />
        ))}
      </div>

      <h2>Trust Colors (Privacy)</h2>
      <p>
        Colors indicating privacy levels and data processing locations. Used in Privacy Badges
        to communicate transparency to users.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
        {trustColors.map((color) => (
          <ColorSwatch key={color.variable} {...color} />
        ))}
      </div>

      <h2>Semantic Colors</h2>
      <p>
        Standard semantic colors for feedback, alerts, and status indicators.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
        {semanticColors.map((color) => (
          <ColorSwatch key={color.variable} {...color} />
        ))}
      </div>

      <h2>Urgency Colors</h2>
      <p>
        Colors used to indicate urgency levels in OpportunityCards and priority indicators.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
        {urgencyColors.map((color) => (
          <ColorSwatch key={color.variable} {...color} />
        ))}
      </div>

      <h2>Neutral Colors</h2>
      <p>
        Foundation colors for backgrounds, text, and surfaces. These adapt in dark mode.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
        {neutralColors.map((color) => (
          <ColorSwatch key={color.variable} {...color} />
        ))}
      </div>

      <h2>Usage in Code</h2>
      <p>
        Colors should always be referenced via CSS variables, never hardcoded as hex values:
      </p>
      <pre className="not-prose">
        <code>{`/* ✅ CORRECT: Use CSS variables */
.button {
  background-color: hsl(var(--color-primary));
  color: hsl(var(--color-primary-foreground));
}

/* ❌ WRONG: Don't hardcode colors */
.button {
  background-color: #FFD700;
  color: #000000;
}`}</code>
      </pre>

      <h3>Tailwind CSS Classes</h3>
      <p>
        Tailwind utility classes are preconfigured to use these color tokens:
      </p>
      <pre className="not-prose">
        <code>{`<button className="bg-primary text-primary-foreground hover:bg-primary-hover">
  Primary Button
</button>

<div className="bg-muted text-muted-foreground border border-border">
  Muted Card
</div>`}</code>
      </pre>

      <h2>Dark Mode</h2>
      <p>
        Neutral colors automatically adapt in dark mode. Brand, semantic, and urgency colors
        remain consistent across themes for recognition and consistency.
      </p>
      <div className="not-prose bg-muted p-4 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">Dark mode overrides:</p>
        <pre className="text-xs">
          <code>{`.dark {
  --color-background: 0 0% 9%;     /* #171717 */
  --color-foreground: 0 0% 98%;    /* #FAFAFA */
  --color-muted: 0 0% 15%;         /* #262626 */
  --color-muted-foreground: 0 0% 64%; /* #A3A3A3 */
  --color-border: 0 0% 18%;        /* #2E2E2E */
  --color-input-bg: 0 0% 11%;      /* #1C1C1C */
}`}</code>
        </pre>
      </div>

      <h2>Accessibility</h2>
      <ul>
        <li>All color combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for text)</li>
        <li>Color is never the only indicator - text labels accompany colored elements</li>
        <li>Trust colors are distinguishable for users with color blindness</li>
        <li>Focus indicators use sufficient contrast for keyboard navigation</li>
      </ul>
    </div>
  );
}
