'use client';

import { Button, Link } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { CodeBlock } from '../../../components/helpers/code-block';
import { useState } from 'react';

export default function AccessibilityPage() {
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Accessibility</h1>
      <p className="lead">
        Fidus is built for everyone. We follow WCAG 2.1 Level AA standards to ensure our
        application is usable by people with disabilities, including those using screen readers,
        keyboard navigation, and assistive technologies.
      </p>

      <h2>WCAG 2.1 Level AA Compliance</h2>

      <p>
        We commit to meeting{' '}
        <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>. This includes:
      </p>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-md my-lg">
        <div className="bg-muted rounded-lg p-md">
          <h3 className="text-base font-semibold mb-sm">Perceivable</h3>
          <p className="text-sm">
            Information presented in ways users can perceive (text alternatives, captions, color
            contrast)
          </p>
        </div>

        <div className="bg-muted rounded-lg p-md">
          <h3 className="text-base font-semibold mb-sm">Operable</h3>
          <p className="text-sm">
            Interface components operable by everyone (keyboard navigation, sufficient time, no
            seizures)
          </p>
        </div>

        <div className="bg-muted rounded-lg p-md">
          <h3 className="text-base font-semibold mb-sm">Understandable</h3>
          <p className="text-sm">
            Information and operation understandable (readable, predictable, input assistance)
          </p>
        </div>

        <div className="bg-muted rounded-lg p-md">
          <h3 className="text-base font-semibold mb-sm">Robust</h3>
          <p className="text-sm">
            Content robust enough to work with assistive technologies (valid HTML, ARIA)
          </p>
        </div>
      </div>

      <h2>Color Contrast</h2>

      <p>All text meets WCAG 2.1 AA contrast requirements:</p>

      <div className="not-prose space-y-sm my-lg">
        <div className="flex items-center justify-between p-sm border border-border rounded-lg">
          <div>
            <p className="text-sm font-medium">Normal Text (14px+)</p>
            <p className="text-xs text-muted-foreground">Minimum contrast ratio</p>
          </div>
          <code className="text-sm font-semibold">4.5:1</code>
        </div>

        <div className="flex items-center justify-between p-sm border border-border rounded-lg">
          <div>
            <p className="text-sm font-medium">Large Text (18px+ or 14px+ bold)</p>
            <p className="text-xs text-muted-foreground">Minimum contrast ratio</p>
          </div>
          <code className="text-sm font-semibold">3:1</code>
        </div>

        <div className="flex items-center justify-between p-sm border border-border rounded-lg">
          <div>
            <p className="text-sm font-medium">UI Components & Graphics</p>
            <p className="text-xs text-muted-foreground">Icons, borders, focus indicators</p>
          </div>
          <code className="text-sm font-semibold">3:1</code>
        </div>
      </div>

      <h3>Testing Contrast</h3>
      <div className="bg-muted rounded-lg p-md my-md">
        <p className="text-sm mb-sm">
          <strong>Tools:</strong>
        </p>
        <ul className="text-sm space-y-xs">
          <li>• WebAIM Contrast Checker</li>
          <li>• Chrome DevTools Accessibility panel</li>
          <li>• Figma Contrast plugin</li>
        </ul>
      </div>

      <h2>Keyboard Navigation</h2>

      <p>All interactive elements must be keyboard accessible:</p>

      <div className="not-prose space-y-md my-lg">
        <div className="border border-border rounded-lg p-md">
          <div className="flex items-center justify-between mb-sm">
            <code className="text-sm">Tab</code>
            <span className="text-xs text-muted-foreground">Navigate forward</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Move focus to next interactive element
          </p>
        </div>

        <div className="border border-border rounded-lg p-md">
          <div className="flex items-center justify-between mb-sm">
            <code className="text-sm">Shift + Tab</code>
            <span className="text-xs text-muted-foreground">Navigate backward</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Move focus to previous interactive element
          </p>
        </div>

        <div className="border border-border rounded-lg p-md">
          <div className="flex items-center justify-between mb-sm">
            <code className="text-sm">Enter / Space</code>
            <span className="text-xs text-muted-foreground">Activate</span>
          </div>
          <p className="text-sm text-muted-foreground">Activate buttons, links, toggles</p>
        </div>

        <div className="border border-border rounded-lg p-md">
          <div className="flex items-center justify-between mb-sm">
            <code className="text-sm">Escape</code>
            <span className="text-xs text-muted-foreground">Close/Cancel</span>
          </div>
          <p className="text-sm text-muted-foreground">Close modals, dismiss cards</p>
        </div>

        <div className="border border-border rounded-lg p-md">
          <div className="flex items-center justify-between mb-sm">
            <code className="text-sm">Arrow Keys</code>
            <span className="text-xs text-muted-foreground">Navigate within</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Navigate within radio groups, tabs, menus
          </p>
        </div>
      </div>

      <h3>Interactive Keyboard Navigation Demo</h3>
      <p>Try navigating through these buttons using Tab, Shift+Tab, and Enter:</p>

      <ComponentPreview
        code={`const [focusedElement, setFocusedElement] = useState<string | null>(null);

<div className="space-y-md">
  <div className="flex gap-md">
    <Button
      variant="primary"
      onClick={() => setFocusedElement('Save')}
      onFocus={() => setFocusedElement('Save (focused)')}
      onBlur={() => setFocusedElement(null)}
    >
      Save
    </Button>
    <Button
      variant="secondary"
      onClick={() => setFocusedElement('Cancel')}
      onFocus={() => setFocusedElement('Cancel (focused)')}
      onBlur={() => setFocusedElement(null)}
    >
      Cancel
    </Button>
    <Button
      variant="tertiary"
      onClick={() => setFocusedElement('Help')}
      onFocus={() => setFocusedElement('Help (focused)')}
      onBlur={() => setFocusedElement(null)}
    >
      Help
    </Button>
  </div>
  {focusedElement && (
    <div className="p-md bg-muted rounded-lg border border-border">
      <p className="text-sm">
        <strong>Current state:</strong> {focusedElement}
      </p>
    </div>
  )}
</div>`}
      >
        <div className="space-y-md">
          <div className="flex gap-md">
            <Button
              variant="primary"
              onClick={() => setFocusedElement('Save (clicked)')}
              onFocus={() => setFocusedElement('Save (focused)')}
              onBlur={() => setFocusedElement(null)}
            >
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => setFocusedElement('Cancel (clicked)')}
              onFocus={() => setFocusedElement('Cancel (focused)')}
              onBlur={() => setFocusedElement(null)}
            >
              Cancel
            </Button>
            <Button
              variant="tertiary"
              onClick={() => setFocusedElement('Help (clicked)')}
              onFocus={() => setFocusedElement('Help (focused)')}
              onBlur={() => setFocusedElement(null)}
            >
              Help
            </Button>
          </div>
          {focusedElement && (
            <div className="p-md bg-muted rounded-lg border border-border">
              <p className="text-sm">
                <strong>Current state:</strong> {focusedElement}
              </p>
              <p className="text-xs text-muted-foreground mt-xs">
                Use Tab to navigate between buttons, Enter or Space to activate
              </p>
            </div>
          )}
        </div>
      </ComponentPreview>

      <h3>Focus Indicators</h3>
      <p>All focusable elements have visible focus indicators:</p>

      <div className="not-prose my-md">
        <CodeBlock
          language="css"
          code={`/* Global focus styles */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}`}
        />
      </div>

      <h2>Screen Reader Support</h2>

      <h3>Semantic HTML</h3>
      <p>Use proper HTML elements for their intended purpose:</p>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-md my-lg">
        <div className="border border-success/20 bg-success/5 rounded-lg p-md">
          <h4 className="text-sm font-semibold text-success mb-sm">✓ Good</h4>
          <CodeBlock
            language="tsx"
            code={`<button onClick={...}>
  Submit
</button>

<nav>
  <a href="/dashboard">
    Dashboard
  </a>
</nav>`}
          />
        </div>

        <div className="border border-error/20 bg-error/5 rounded-lg p-md">
          <h4 className="text-sm font-semibold text-error mb-sm">✗ Bad</h4>
          <CodeBlock
            language="tsx"
            code={`<div onClick={...}>
  Submit
</div>

<div>
  <div onClick={...}>
    Dashboard
  </div>
</div>`}
          />
        </div>
      </div>

      <h3>ARIA Labels</h3>
      <p>Provide labels for elements when visual text isn&apos;t sufficient:</p>

      <div className="not-prose my-md">
        <CodeBlock
          language="tsx"
          code={`// Icon-only button
<button aria-label="Close card">
  <X className="h-4 w-4" />
</button>

// Decorative image
<img src="banner.jpg" alt="" role="presentation" />

// Form input
<label htmlFor="email">Email</label>
<input id="email" type="email" aria-required="true" />`}
        />
      </div>

      <h3>ARIA Roles & States</h3>
      <p>Use ARIA attributes to communicate state changes:</p>

      <div className="not-prose space-y-sm my-lg">
        <div className="border border-border rounded-lg p-sm">
          <code className="text-sm">aria-expanded=&quot;true|false&quot;</code>
          <p className="text-xs text-muted-foreground mt-xs">
            Indicates whether collapsible content is expanded
          </p>
        </div>

        <div className="border border-border rounded-lg p-sm">
          <code className="text-sm">aria-selected=&quot;true|false&quot;</code>
          <p className="text-xs text-muted-foreground mt-xs">
            Indicates selection state (tabs, options)
          </p>
        </div>

        <div className="border border-border rounded-lg p-sm">
          <code className="text-sm">aria-disabled=&quot;true|false&quot;</code>
          <p className="text-xs text-muted-foreground mt-xs">Indicates disabled state</p>
        </div>

        <div className="border border-border rounded-lg p-sm">
          <code className="text-sm">aria-live=&quot;polite|assertive&quot;</code>
          <p className="text-xs text-muted-foreground mt-xs">Announces dynamic content changes</p>
        </div>
      </div>

      <h3>Screen Reader Testing Guide</h3>
      <p>
        Testing with screen readers is essential for ensuring your application is truly accessible.
        Here&apos;s how to test with the most common screen readers:
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div className="border border-border rounded-lg p-lg bg-muted">
          <h4 className="text-base font-semibold mb-md">VoiceOver (macOS/iOS)</h4>
          <div className="space-y-sm text-sm">
            <p>
              <strong>Enable:</strong> System Preferences → Accessibility → VoiceOver
            </p>
            <p>
              <strong>Keyboard Shortcut:</strong> <code className="text-xs">Cmd + F5</code>
            </p>
            <div className="mt-md">
              <p className="font-medium mb-xs">Common Commands:</p>
              <ul className="space-y-xs text-xs">
                <li>
                  • <code>VO + Right Arrow</code> - Navigate to next item
                </li>
                <li>
                  • <code>VO + Left Arrow</code> - Navigate to previous item
                </li>
                <li>
                  • <code>VO + Space</code> - Activate item (click)
                </li>
                <li>
                  • <code>VO + A</code> - Read entire page
                </li>
                <li>
                  • <code>VO + H</code> - Next heading
                </li>
                <li>
                  • <code>VO + U</code> - Open rotor (navigation menu)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-lg bg-muted">
          <h4 className="text-base font-semibold mb-md">NVDA (Windows - Free)</h4>
          <div className="space-y-sm text-sm">
            <p>
              <strong>Download:</strong>{' '}
              <a
                href="https://www.nvaccess.org/download/"
                className="text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                nvaccess.org
              </a>
            </p>
            <p>
              <strong>Start:</strong> <code className="text-xs">Ctrl + Alt + N</code>
            </p>
            <div className="mt-md">
              <p className="font-medium mb-xs">Common Commands:</p>
              <ul className="space-y-xs text-xs">
                <li>
                  • <code>Down Arrow</code> - Next item
                </li>
                <li>
                  • <code>Up Arrow</code> - Previous item
                </li>
                <li>
                  • <code>Enter</code> - Activate link/button
                </li>
                <li>
                  • <code>H</code> - Next heading
                </li>
                <li>
                  • <code>Shift + H</code> - Previous heading
                </li>
                <li>
                  • <code>B</code> - Next button
                </li>
                <li>
                  • <code>Insert + Down Arrow</code> - Read all from cursor
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-lg bg-muted">
          <h4 className="text-base font-semibold mb-md">JAWS (Windows - Commercial)</h4>
          <div className="space-y-sm text-sm">
            <p>
              <strong>Download:</strong>{' '}
              <a
                href="https://www.freedomscientific.com/products/software/jaws/"
                className="text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                freedomscientific.com
              </a>
            </p>
            <p>
              <strong>Note:</strong> Most widely used professional screen reader, similar commands to
              NVDA
            </p>
            <div className="mt-md">
              <p className="font-medium mb-xs">Common Commands:</p>
              <ul className="space-y-xs text-xs">
                <li>
                  • <code>Down Arrow</code> - Next line
                </li>
                <li>
                  • <code>H</code> - Next heading
                </li>
                <li>
                  • <code>T</code> - Next table
                </li>
                <li>
                  • <code>F</code> - Next form field
                </li>
                <li>
                  • <code>Insert + F5</code> - List form fields
                </li>
                <li>
                  • <code>Insert + F6</code> - List headings
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="not-prose my-lg p-lg bg-primary/10 border border-primary/20 rounded-lg">
        <h4 className="text-base font-semibold mb-md">Testing Checklist for Screen Readers</h4>
        <ul className="space-y-xs text-sm">
          <li>✓ All interactive elements are announced with their role (button, link, etc.)</li>
          <li>✓ Form inputs have clear labels that are read before the input</li>
          <li>✓ Error messages are announced when validation fails</li>
          <li>✓ Dynamic content changes are announced (use aria-live)</li>
          <li>✓ Headings create a logical document outline</li>
          <li>✓ Images have descriptive alt text (or alt=&quot;&quot; if decorative)</li>
          <li>✓ Navigation can be done using heading/landmark shortcuts</li>
          <li>✓ Modal dialogs trap focus and announce their role</li>
        </ul>
      </div>

      <h2>Touch Targets</h2>

      <p>All interactive elements meet minimum touch target size:</p>

      <div className="bg-muted rounded-lg p-lg my-lg">
        <h3 className="text-base font-semibold mb-md">Minimum Size: 44x44 pixels</h3>
        <p className="text-sm mb-sm">Applies to:</p>
        <ul className="text-sm space-y-xs">
          <li>• Buttons (primary, secondary, icon buttons)</li>
          <li>• Links (when standalone)</li>
          <li>• Form inputs (checkboxes, radio buttons)</li>
          <li>• Toggle switches</li>
          <li>• Close buttons (X)</li>
          <li>• Swipeable areas on cards</li>
        </ul>
      </div>

      <h2>Forms & Input</h2>

      <h3>Labels & Descriptions</h3>
      <div className="not-prose my-md">
        <CodeBlock
          language="tsx"
          code={`<label htmlFor="username">Username</label>
<input
  id="username"
  type="text"
  aria-describedby="username-hint"
  aria-required="true"
/>
<span id="username-hint">
  Must be 3-20 characters
</span>`}
        />
      </div>

      <h3>Error Messages</h3>
      <div className="not-prose my-md">
        <CodeBlock
          language="tsx"
          code={`<input
  id="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Please enter a valid email address
</span>`}
        />
      </div>

      <h2>Reduced Motion</h2>

      <p>
        Respect user preferences for reduced motion. Users who enable this setting should see
        instant state changes:
      </p>

      <div className="not-prose my-md">
        <CodeBlock
          language="css"
          code={`@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// In Tailwind
<div className="transition-all motion-reduce:transition-none">`}
        />
      </div>

      <h2>Accessibility Testing Checklist</h2>

      <p>
        Use this comprehensive checklist to ensure your features meet accessibility standards before
        deployment:
      </p>

      <div className="not-prose space-y-sm my-lg">
        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Keyboard Navigation:</strong> All interactive elements reachable and operable
            via keyboard (Tab, Enter, Escape, Arrow keys)
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Focus Indicators:</strong> Visible focus indicators (2px outline with offset) on
            all focusable elements
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Color Contrast:</strong> All text meets 4.5:1 ratio (3:1 for large text) - test
            with WebAIM or DevTools
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Screen Reader Testing:</strong> Test with VoiceOver (Mac), NVDA (Windows), or
            JAWS - all content readable
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Touch Targets:</strong> All interactive elements at least 44x44px with sufficient
            spacing
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>ARIA Labels:</strong> Icon-only buttons have aria-label, decorative images have
            alt=&quot;&quot;
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Semantic HTML:</strong> Proper use of button, nav, header, main, article, section
            elements
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Form Labels:</strong> All inputs have associated labels (htmlFor + id), or
            aria-label for custom inputs
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Error Messages:</strong> Clear, specific error messages with role=&quot;alert&quot;
            or aria-describedby
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Reduced Motion:</strong> All animations respect prefers-reduced-motion setting
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Heading Hierarchy:</strong> Proper heading structure (h1 → h2 → h3, no skipped
            levels)
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Automated Testing:</strong> Run axe DevTools or WAVE and fix all critical issues
          </span>
        </label>
      </div>

      <h2>Automated Testing Tools</h2>

      <p>
        Automated tools catch 30-50% of accessibility issues. Use them as a first pass, then perform
        manual testing:
      </p>

      <div className="not-prose space-y-md my-lg">
        <div className="border border-border rounded-lg p-lg bg-muted">
          <h3 className="text-base font-semibold mb-sm">axe DevTools (Browser Extension)</h3>
          <p className="text-sm text-muted-foreground mb-md">
            Industry-standard accessibility testing tool available for Chrome, Firefox, and Edge
          </p>
          <div className="space-y-sm text-sm">
            <p>
              <strong>Install:</strong> Available in Chrome Web Store and Firefox Add-ons
            </p>
            <p>
              <strong>Usage:</strong> Open DevTools → Axe DevTools tab → &quot;Scan All of My
              Page&quot;
            </p>
            <div className="mt-md bg-muted border border-border rounded-md p-sm">
              <p className="text-xs font-medium mb-xs">Features:</p>
              <ul className="space-y-xs text-xs">
                <li>• Automated full-page scans</li>
                <li>• Detailed issue descriptions with remediation guidance</li>
                <li>• WCAG 2.1 Level A, AA, and AAA compliance checks</li>
                <li>• Highlight issues directly on page</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-lg bg-muted">
          <h3 className="text-base font-semibold mb-sm">WAVE (Web Accessibility Evaluation Tool)</h3>
          <p className="text-sm text-muted-foreground mb-md">
            Visual accessibility testing tool by WebAIM
          </p>
          <div className="space-y-sm text-sm">
            <p>
              <strong>Access:</strong>{' '}
              <a
                href="https://wave.webaim.org/"
                className="text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                wave.webaim.org
              </a>{' '}
              or Browser Extension
            </p>
            <p>
              <strong>Usage:</strong> Enter URL or use extension to scan current page
            </p>
            <div className="mt-md bg-muted border border-border rounded-md p-sm">
              <p className="text-xs font-medium mb-xs">Features:</p>
              <ul className="space-y-xs text-xs">
                <li>• Visual feedback with icons on page</li>
                <li>• Color-coded issues (errors, alerts, features)</li>
                <li>• Contrast checker</li>
                <li>• Works on live and local sites</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-lg bg-muted">
          <h3 className="text-base font-semibold mb-sm">Lighthouse (Chrome DevTools)</h3>
          <p className="text-sm text-muted-foreground mb-md">
            Built-in accessibility auditing in Chrome DevTools
          </p>
          <div className="space-y-sm text-sm">
            <p>
              <strong>Access:</strong> Chrome DevTools → Lighthouse tab
            </p>
            <p>
              <strong>Usage:</strong> Select &quot;Accessibility&quot; category → Generate report
            </p>
            <div className="mt-md bg-muted border border-border rounded-md p-sm">
              <p className="text-xs font-medium mb-xs">Features:</p>
              <ul className="space-y-xs text-xs">
                <li>• Comprehensive accessibility score (0-100)</li>
                <li>• Performance impact analysis</li>
                <li>• Mobile and desktop testing</li>
                <li>• CI/CD integration available</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-lg bg-muted">
          <h3 className="text-base font-semibold mb-sm">Pa11y CI (Automated Testing)</h3>
          <p className="text-sm text-muted-foreground mb-md">
            Command-line tool for accessibility testing in CI/CD pipelines
          </p>
          <div className="space-y-sm text-sm">
            <p>
              <strong>Install:</strong> <code className="text-xs">npm install -g pa11y-ci</code>
            </p>
            <p>
              <strong>Usage:</strong> <code className="text-xs">pa11y-ci --sitemap https://your-site.com/sitemap.xml</code>
            </p>
            <div className="mt-md bg-muted border border-border rounded-md p-sm">
              <p className="text-xs font-medium mb-xs">Features:</p>
              <ul className="space-y-xs text-xs">
                <li>• Test multiple URLs automatically</li>
                <li>• Configurable WCAG levels</li>
                <li>• CI/CD integration (GitHub Actions, Jenkins)</li>
                <li>• JSON/HTML reports</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>

      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/text-input"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Text Input
          </h3>
          <p className="text-sm text-muted-foreground">
            Accessible form inputs with labels and validation
          </p>
        </Link>

        <Link
          href="/components/checkbox"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Checkbox
          </h3>
          <p className="text-sm text-muted-foreground">
            Keyboard-accessible checkboxes with proper ARIA
          </p>
        </Link>

        <Link
          href="/components/radio-button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Radio Button
          </h3>
          <p className="text-sm text-muted-foreground">
            Radio groups with arrow key navigation
          </p>
        </Link>

        <Link
          href="/components/modal"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Modal
          </h3>
          <p className="text-sm text-muted-foreground">
            Focus trap and keyboard navigation for dialogs
          </p>
        </Link>

        <Link
          href="/components/alert"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Alert
          </h3>
          <p className="text-sm text-muted-foreground">
            Screen reader announcements with role=&quot;alert&quot;
          </p>
        </Link>

        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">
            Focus indicators and touch target sizing
          </p>
        </Link>
      </div>

      <h2>Resources</h2>

      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              external
              showIcon
            >
              WCAG 2.1 Quick Reference - Complete accessibility guidelines
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="https://webaim.org/" external showIcon>
              WebAIM - Web accessibility resources and training
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.a11yproject.com/"
              external
              showIcon
            >
              The A11Y Project - Community-driven accessibility resources
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://developer.mozilla.org/en-US/docs/Web/Accessibility"
              external
              showIcon
            >
              MDN: Accessibility - Comprehensive accessibility documentation
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.deque.com/axe/devtools/"
              external
              showIcon
            >
              axe DevTools - Download browser extension
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="https://wave.webaim.org/" external showIcon>
              WAVE Tool - Online accessibility checker
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.nvaccess.org/"
              external
              showIcon
            >
              NVDA Screen Reader - Free screen reader for Windows
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/foundations/motion">
              Motion & Animation - Reduced motion guidelines
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/for-developers">
              Installation guide - How to install Fidus Design System
            </Link>
          </li>
        </ul>
      </div>

      <h2>Key Takeaways</h2>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-lg my-lg">
        <ul className="space-y-sm text-sm">
          <li>✅ WCAG 2.1 Level AA compliance required for all features</li>
          <li>✅ 4.5:1 contrast ratio for normal text, 3:1 for large text and UI components</li>
          <li>✅ All features must be fully keyboard accessible with visible focus indicators</li>
          <li>✅ 44x44px minimum touch target size for all interactive elements</li>
          <li>✅ Use semantic HTML and proper ARIA attributes for screen reader support</li>
          <li>✅ Test with screen readers (VoiceOver, NVDA, JAWS) before release</li>
          <li>✅ Run automated tools (axe DevTools, WAVE, Lighthouse) and fix critical issues</li>
          <li>✅ Respect prefers-reduced-motion for all animations and transitions</li>
          <li>✅ Provide clear labels, error messages, and form validation feedback</li>
          <li>✅ Maintain logical heading hierarchy and document structure</li>
        </ul>
      </div>
    </div>
  );
}
