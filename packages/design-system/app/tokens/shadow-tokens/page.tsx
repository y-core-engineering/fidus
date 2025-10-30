'use client';

import { TokenDisplay } from '../../../components/helpers/color-swatch';
import { TokenInspector } from '../../../components/helpers/token-inspector';
import { Link, ProgressBar } from '@fidus/ui';
import { useState, useEffect } from 'react';
import { getAllTokens } from '../../../components/helpers/get-tokens';

const tokenMetadata: Record<string, { description: string; subcategory: string }> = {
  '--shadow-sm': { description: 'Subtle elevation for hover states', subcategory: 'shadow' },
  '--shadow-md': { description: 'Standard elevation for cards and dropdowns', subcategory: 'shadow' },
  '--shadow-lg': { description: 'High elevation for modals and popovers', subcategory: 'shadow' },
  '--shadow-xl': { description: 'Maximum elevation for overlays and sheets', subcategory: 'shadow' },
  '--z-base': { description: 'Default stacking level', subcategory: 'zIndex' },
  '--z-dropdown': { description: 'Dropdown menus and select options', subcategory: 'zIndex' },
  '--z-sticky': { description: 'Sticky headers and navigation', subcategory: 'zIndex' },
  '--z-modal': { description: 'Modal dialogs and overlays', subcategory: 'zIndex' },
  '--z-popover': { description: 'Popovers and tooltips', subcategory: 'zIndex' },
  '--z-tooltip': { description: 'Tooltips (highest level)', subcategory: 'zIndex' },
};

export default function ShadowTokensPage() {
  const [allTokens, setAllTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const shadowTokensData = getAllTokens().filter(t => t.category === 'shadow');
    const zIndexTokensData = getAllTokens().filter(t => t.category === 'zIndex');
    const combined = [...shadowTokensData, ...zIndexTokensData].map(token => ({
      ...token,
      description: tokenMetadata[token.variable]?.description || '',
    }));
    setAllTokens(combined);
    setIsLoading(false);
  }, []);

  const shadowTokens = allTokens.filter(t => tokenMetadata[t.variable]?.subcategory === 'shadow');
  const zIndexTokens = allTokens.filter(t => tokenMetadata[t.variable]?.subcategory === 'zIndex');

  if (isLoading) {
    return (
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Shadow & Z-Index Tokens</h1>
        <div className="rounded-lg border border-border bg-card p-lg my-lg">
          <div className="space-y-sm py-xl">
            <p className="text-sm text-muted-foreground text-center">Loading shadow tokens...</p>
            <ProgressBar indeterminate variant="primary" />
          </div>
        </div>
      </div>
    );
  }

  const zIndexTokensOld = [
    {
      name: 'Sticky',
      variable: '--z-sticky',
      value: '200',
      description: 'Sticky headers and navigation',
    },
    {
      name: 'Modal',
      variable: '--z-modal',
      value: '300',
      description: 'Modal dialogs and overlays',
    },
    {
      name: 'Popover',
      variable: '--z-popover',
      value: '400',
      description: 'Popovers and context menus',
    },
    {
      name: 'Tooltip',
      variable: '--z-tooltip',
      value: '500',
      description: 'Tooltips (highest level)',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Shadow Tokens</h1>
      <p className="lead">
        Elevation system using shadows and z-index values to create visual hierarchy
        and depth. Shadows convey elevation and importance through subtle layering.
      </p>

      <h2>Shadow Scale</h2>
      <p>
        Four-level shadow system from subtle to prominent, based on Material Design elevation principles.
      </p>
      <div className="not-prose space-y-md mb-2xl">
        {shadowTokens.map((shadow) => (
          <TokenDisplay
            key={shadow.variable}
            name={shadow.name}
            variable={shadow.variable}
            value={shadow.value}
            description={shadow.description}
            preview={
              <div
                className="w-12 h-12 bg-background rounded-md"
                style={{
                  boxShadow:
                    shadow.variable === '--shadow-sm'
                      ? 'var(--shadow-sm)'
                      : shadow.variable === '--shadow-md'
                        ? 'var(--shadow-md)'
                        : shadow.variable === '--shadow-lg'
                          ? 'var(--shadow-lg)'
                          : 'var(--shadow-xl)',
                }}
              />
            }
          />
        ))}
      </div>

      <h3>Shadow Examples</h3>
      <div className="not-prose mb-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-muted-foreground mb-4">Small Shadow</p>
            <div className="bg-background p-6 rounded-lg shadow-sm border border-border">
              <p className="text-sm">
                Subtle elevation for hover states and interactive elements.
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-4">Medium Shadow</p>
            <div className="bg-background p-6 rounded-lg shadow-md">
              <p className="text-sm">
                Standard elevation for cards, buttons, and dropdown menus.
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-4">Large Shadow</p>
            <div className="bg-background p-6 rounded-lg shadow-lg">
              <p className="text-sm">
                High elevation for modals, popovers, and floating panels.
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-4">Extra Large Shadow</p>
            <div className="bg-background p-6 rounded-lg shadow-xl">
              <p className="text-sm">
                Maximum elevation for drawers, sheets, and full overlays.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2>Z-Index Scale</h2>
      <p>
        Organized z-index values to prevent stacking conflicts. Higher values appear above lower values.
      </p>
      <div className="not-prose space-y-md mb-2xl">
        {zIndexTokens.map((zIndex) => (
          <TokenDisplay
            key={zIndex.variable}
            name={zIndex.name}
            variable={zIndex.variable}
            value={zIndex.value}
            description={zIndex.description}
          />
        ))}
      </div>

      <h3>Z-Index Visualization</h3>
      <div className="not-prose mb-2xl">
        <div className="relative h-64 bg-muted rounded-lg p-4 overflow-hidden">
          <div
            className="absolute bottom-4 left-4 w-32 h-32 bg-background border-2 border-border rounded-md flex items-center justify-center text-sm font-semibold"
            style={{ zIndex: 0 }}
          >
            Base (0)
          </div>
          <div
            className="absolute bottom-8 left-8 w-32 h-32 bg-background border-2 border-primary rounded-md flex items-center justify-center text-sm font-semibold shadow-sm"
            style={{ zIndex: 100 }}
          >
            Dropdown (100)
          </div>
          <div
            className="absolute bottom-12 left-12 w-32 h-32 bg-background border-2 border-primary rounded-md flex items-center justify-center text-sm font-semibold shadow-md"
            style={{ zIndex: 200 }}
          >
            Sticky (200)
          </div>
          <div
            className="absolute bottom-16 left-16 w-32 h-32 bg-background border-2 border-primary rounded-md flex items-center justify-center text-sm font-semibold shadow-lg"
            style={{ zIndex: 300 }}
          >
            Modal (300)
          </div>
          <div
            className="absolute bottom-20 left-20 w-32 h-32 bg-background border-2 border-primary rounded-md flex items-center justify-center text-sm font-semibold shadow-xl"
            style={{ zIndex: 500 }}
          >
            Tooltip (500)
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Each layer stacks above the previous, creating clear visual hierarchy.
        </p>
      </div>

      <h2>Usage in Code</h2>
      <p>
        Always use shadow and z-index tokens for consistent elevation:
      </p>
      <pre className="not-prose">
        <code>{`/* ✅ CORRECT: Use shadow tokens */
.card {
  box-shadow: var(--shadow-md);
}

.modal {
  box-shadow: var(--shadow-lg);
  z-index: var(--z-modal);
}

/* ❌ WRONG: Don't hardcode shadows */
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}`}</code>
      </pre>

      <h3>Tailwind CSS Classes</h3>
      <pre className="not-prose">
        <code>{`<div className="shadow-sm">Subtle elevation</div>
<div className="shadow-md">Standard card</div>
<div className="shadow-lg">Modal dialog</div>
<div className="shadow-xl">Drawer overlay</div>

<div className="z-dropdown">Dropdown menu</div>
<div className="z-modal">Modal overlay</div>`}</code>
      </pre>

      <h2>Component Guidelines</h2>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Shadow</th>
            <th>Z-Index</th>
            <th>Context</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Card</td>
            <td>sm-md</td>
            <td>base</td>
            <td>Resting state</td>
          </tr>
          <tr>
            <td>Button (hover)</td>
            <td>sm</td>
            <td>base</td>
            <td>Interactive feedback</td>
          </tr>
          <tr>
            <td>Dropdown</td>
            <td>md-lg</td>
            <td>dropdown</td>
            <td>Menu overlay</td>
          </tr>
          <tr>
            <td>Sticky Header</td>
            <td>sm</td>
            <td>sticky</td>
            <td>Fixed navigation</td>
          </tr>
          <tr>
            <td>Modal</td>
            <td>lg-xl</td>
            <td>modal</td>
            <td>Dialog overlay</td>
          </tr>
          <tr>
            <td>Popover</td>
            <td>lg</td>
            <td>popover</td>
            <td>Context menu</td>
          </tr>
          <tr>
            <td>Tooltip</td>
            <td>md</td>
            <td>tooltip</td>
            <td>Hover hint</td>
          </tr>
          <tr>
            <td>Drawer</td>
            <td>xl</td>
            <td>modal</td>
            <td>Side sheet</td>
          </tr>
        </tbody>
      </table>

      <h2>Best Practices</h2>
      <ul>
        <li>Use shadows to reinforce visual hierarchy, not just decoration</li>
        <li>Default to <code>shadow-md</code> for most elevated surfaces</li>
        <li>Use <code>shadow-sm</code> for subtle hover states and transitions</li>
        <li>Use <code>shadow-lg</code> or <code>shadow-xl</code> for overlays that need clear separation</li>
        <li>Don't stack multiple large shadows - use one prominent shadow per layer</li>
        <li>Combine shadow with z-index for proper layering</li>
        <li>Increase shadow size for interactive elements on hover/focus</li>
        <li>Use consistent z-index values - don't create arbitrary layers</li>
      </ul>

      <h2>Accessibility</h2>
      <ul>
        <li>Shadows provide visual affordance but don't rely on them alone</li>
        <li>Ensure sufficient color contrast regardless of shadow presence</li>
        <li>Use focus indicators in addition to hover shadows</li>
        <li>Z-index layers don't affect keyboard navigation order</li>
        <li>Modal and overlay z-index should trap focus appropriately</li>
      </ul>

      <h2>Dark Mode</h2>
      <p>
        Shadow values remain the same in dark mode, but may appear more subtle against
        dark backgrounds. The shadow opacity automatically adapts for consistency.
      </p>

      <h2>When to Use Which Elevation</h2>
      <p>
        Choosing the right shadow level depends on the component's visual hierarchy and interaction model:
      </p>
      <div className="not-prose my-lg">
        <div className="space-y-md">
          <div className="p-md bg-muted rounded-lg">
            <h3 className="font-semibold mb-xs">Small Shadow (sm)</h3>
            <p className="text-sm text-muted-foreground mb-xs">
              <strong>Use for:</strong> Hover states, subtle card lift on interaction
            </p>
            <p className="text-sm">
              Small shadows provide just enough elevation to indicate interactivity without being
              distracting. Perfect for hover effects on buttons, links, and cards where you want to
              signal that an element is clickable without creating visual noise.
            </p>
          </div>

          <div className="p-md bg-muted rounded-lg">
            <h3 className="font-semibold mb-xs">Medium Shadow (md)</h3>
            <p className="text-sm text-muted-foreground mb-xs">
              <strong>Use for:</strong> Resting cards, dropdown menus, standard elevation
            </p>
            <p className="text-sm">
              Medium shadows are the workhorse of the elevation system. They create clear separation
              from the background without being too heavy. Use them for cards in their default state,
              dropdown menus, and other floating UI elements that need to stand out from the page.
            </p>
          </div>

          <div className="p-md bg-muted rounded-lg">
            <h3 className="font-semibold mb-xs">Large Shadow (lg)</h3>
            <p className="text-sm text-muted-foreground mb-xs">
              <strong>Use for:</strong> Modals, important popovers, floating panels
            </p>
            <p className="text-sm">
              Large shadows create significant separation between layers, making it clear that a
              component sits above the rest of the UI. Essential for modal dialogs and important
              contextual overlays where you need to grab the user's attention and create focus.
            </p>
          </div>

          <div className="p-md bg-muted rounded-lg">
            <h3 className="font-semibold mb-xs">Extra Large Shadow (xl)</h3>
            <p className="text-sm text-muted-foreground mb-xs">
              <strong>Use for:</strong> Full-screen overlays, drawers, maximum separation
            </p>
            <p className="text-sm">
              Extra large shadows are reserved for the highest level of elevation. Use them sparingly
              for full-screen overlays, side drawers, and other UI elements that need to appear
              completely detached from the page. This level of shadow creates the strongest sense of
              depth and hierarchy.
            </p>
          </div>
        </div>
      </div>

      <div className="not-prose p-md bg-muted/30 border-l-4 border-warning rounded-md my-lg">
        <p className="text-sm text-warning font-semibold mb-xs">Accessibility Note</p>
        <p className="text-sm">
          Shadows should NOT convey meaning alone. Always use borders, text labels, or color for
          critical information. Shadows enhance visual hierarchy but must not be the only indicator
          of interactive states or important content.
        </p>
      </div>

      <TokenInspector
        tokens={[
          ...shadowTokens.map(s => ({ name: s.name, value: s.value, variable: s.variable })),
          ...zIndexTokens.map(z => ({ name: z.name, value: z.value, variable: z.variable })),
        ]}
        type="shadow"
      />

      <h2>Related Tokens</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/tokens/color-tokens"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Color Tokens
          </h3>
          <p className="text-sm text-muted-foreground">Shadow colors and opacity values</p>
        </Link>
        <Link
          href="/tokens/spacing-tokens"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Spacing Tokens
          </h3>
          <p className="text-sm text-muted-foreground">Padding and margins for elevated elements</p>
        </Link>
        <Link
          href="/tokens/motion-tokens"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Motion Tokens
          </h3>
          <p className="text-sm text-muted-foreground">Animation timing for shadow transitions</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/design-system/app/tokens/shadow-tokens/page.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://material.io/design/environment/elevation.html"
              external
              showIcon
            >
              Material Design Elevation Guidelines
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html"
              external
              showIcon
            >
              Shadow Accessibility Considerations
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
