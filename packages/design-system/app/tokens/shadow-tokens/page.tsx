'use client';

import { TokenDisplay } from '../../../components/helpers/color-swatch';

export default function ShadowTokensPage() {
  const shadowTokens = [
    {
      name: 'Small Shadow',
      variable: '--shadow-sm',
      value: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      description: 'Subtle elevation for hover states',
    },
    {
      name: 'Medium Shadow',
      variable: '--shadow-md',
      value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      description: 'Standard elevation for cards and dropdowns',
    },
    {
      name: 'Large Shadow',
      variable: '--shadow-lg',
      value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      description: 'High elevation for modals and popovers',
    },
    {
      name: 'Extra Large Shadow',
      variable: '--shadow-xl',
      value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      description: 'Maximum elevation for overlays and sheets',
    },
  ];

  const zIndexTokens = [
    {
      name: 'Base',
      variable: '--z-base',
      value: '0',
      description: 'Default stacking level',
    },
    {
      name: 'Dropdown',
      variable: '--z-dropdown',
      value: '100',
      description: 'Dropdown menus and select options',
    },
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
      <div className="not-prose space-y-4 mb-8">
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
      <div className="not-prose mb-8">
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
      <div className="not-prose space-y-4 mb-8">
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
      <div className="not-prose mb-8">
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
    </div>
  );
}
