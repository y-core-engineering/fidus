export default function AccessibilityPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-base font-semibold mb-2">Perceivable</h3>
          <p className="text-sm">
            Information presented in ways users can perceive (text alternatives, captions, color
            contrast)
          </p>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-base font-semibold mb-2">Operable</h3>
          <p className="text-sm">
            Interface components operable by everyone (keyboard navigation, sufficient time, no
            seizures)
          </p>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-base font-semibold mb-2">Understandable</h3>
          <p className="text-sm">
            Information and operation understandable (readable, predictable, input assistance)
          </p>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-base font-semibold mb-2">Robust</h3>
          <p className="text-sm">
            Content robust enough to work with assistive technologies (valid HTML, ARIA)
          </p>
        </div>
      </div>

      <h2>Color Contrast</h2>

      <p>All text meets WCAG 2.1 AA contrast requirements:</p>

      <div className="space-y-3 my-6">
        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
          <div>
            <p className="text-sm font-medium">Normal Text (14px+)</p>
            <p className="text-xs text-muted-foreground">Minimum contrast ratio</p>
          </div>
          <code className="text-sm font-semibold">4.5:1</code>
        </div>

        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
          <div>
            <p className="text-sm font-medium">Large Text (18px+ or 14px+ bold)</p>
            <p className="text-xs text-muted-foreground">Minimum contrast ratio</p>
          </div>
          <code className="text-sm font-semibold">3:1</code>
        </div>

        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
          <div>
            <p className="text-sm font-medium">UI Components & Graphics</p>
            <p className="text-xs text-muted-foreground">Icons, borders, focus indicators</p>
          </div>
          <code className="text-sm font-semibold">3:1</code>
        </div>
      </div>

      <h3>Testing Contrast</h3>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <p className="text-sm mb-2">
          <strong>Tools:</strong>
        </p>
        <ul className="text-sm space-y-1">
          <li>• WebAIM Contrast Checker</li>
          <li>• Chrome DevTools Accessibility panel</li>
          <li>• Figma Contrast plugin</li>
        </ul>
      </div>

      <h2>Keyboard Navigation</h2>

      <p>All interactive elements must be keyboard accessible:</p>

      <div className="space-y-4 my-6">
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <code className="text-sm">Tab</code>
            <span className="text-xs text-muted-foreground">Navigate forward</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Move focus to next interactive element
          </p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <code className="text-sm">Shift + Tab</code>
            <span className="text-xs text-muted-foreground">Navigate backward</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Move focus to previous interactive element
          </p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <code className="text-sm">Enter / Space</code>
            <span className="text-xs text-muted-foreground">Activate</span>
          </div>
          <p className="text-sm text-muted-foreground">Activate buttons, links, toggles</p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <code className="text-sm">Escape</code>
            <span className="text-xs text-muted-foreground">Close/Cancel</span>
          </div>
          <p className="text-sm text-muted-foreground">Close modals, dismiss cards</p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <code className="text-sm">Arrow Keys</code>
            <span className="text-xs text-muted-foreground">Navigate within</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Navigate within radio groups, tabs, menus
          </p>
        </div>
      </div>

      <h3>Focus Indicators</h3>
      <p>All focusable elements have visible focus indicators:</p>

      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`/* Global focus styles */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}`}
        </pre>
      </div>

      <h2>Screen Reader Support</h2>

      <h3>Semantic HTML</h3>
      <p>Use proper HTML elements for their intended purpose:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-success/20 bg-success/5 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-success mb-2">✓ Good</h4>
          <pre className="text-xs">
            {`<button onClick={...}>
  Submit
</button>

<nav>
  <a href="/dashboard">
    Dashboard
  </a>
</nav>`}
          </pre>
        </div>

        <div className="border border-destructive/20 bg-destructive/5 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-destructive mb-2">✗ Bad</h4>
          <pre className="text-xs">
            {`<div onClick={...}>
  Submit
</div>

<div>
  <div onClick={...}>
    Dashboard
  </div>
</div>`}
          </pre>
        </div>
      </div>

      <h3>ARIA Labels</h3>
      <p>Provide labels for elements when visual text isn't sufficient:</p>

      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`// Icon-only button
<button aria-label="Close card">
  <X className="h-4 w-4" />
</button>

// Decorative image
<img src="banner.jpg" alt="" role="presentation" />

// Form input
<label htmlFor="email">Email</label>
<input id="email" type="email" aria-required="true" />`}
        </pre>
      </div>

      <h3>ARIA Roles & States</h3>
      <p>Use ARIA attributes to communicate state changes:</p>

      <div className="space-y-3 my-6">
        <div className="border border-border rounded-lg p-3">
          <code className="text-sm">aria-expanded="true|false"</code>
          <p className="text-xs text-muted-foreground mt-1">
            Indicates whether collapsible content is expanded
          </p>
        </div>

        <div className="border border-border rounded-lg p-3">
          <code className="text-sm">aria-selected="true|false"</code>
          <p className="text-xs text-muted-foreground mt-1">
            Indicates selection state (tabs, options)
          </p>
        </div>

        <div className="border border-border rounded-lg p-3">
          <code className="text-sm">aria-disabled="true|false"</code>
          <p className="text-xs text-muted-foreground mt-1">Indicates disabled state</p>
        </div>

        <div className="border border-border rounded-lg p-3">
          <code className="text-sm">aria-live="polite|assertive"</code>
          <p className="text-xs text-muted-foreground mt-1">Announces dynamic content changes</p>
        </div>
      </div>

      <h2>Touch Targets</h2>

      <p>All interactive elements meet minimum touch target size:</p>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
        <h3 className="text-base font-semibold mb-4">Minimum Size: 44x44 pixels</h3>
        <p className="text-sm mb-3">Applies to:</p>
        <ul className="text-sm space-y-1">
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
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`<label htmlFor="username">Username</label>
<input
  id="username"
  type="text"
  aria-describedby="username-hint"
  aria-required="true"
/>
<span id="username-hint">
  Must be 3-20 characters
</span>`}
        </pre>
      </div>

      <h3>Error Messages</h3>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`<input
  id="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Please enter a valid email address
</span>`}
        </pre>
      </div>

      <h2>Reduced Motion</h2>

      <p>
        Respect user preferences for reduced motion. Users who enable this setting should see
        instant state changes:
      </p>

      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// In Tailwind
<div className="transition-all motion-reduce:transition-none">`}
        </pre>
      </div>

      <h2>Testing Checklist</h2>

      <div className="space-y-3 my-6">
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span className="text-sm">
            <strong>Keyboard Navigation:</strong> All interactive elements reachable and operable
            via keyboard
          </span>
        </label>

        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span className="text-sm">
            <strong>Focus Indicators:</strong> Visible focus indicators on all focusable elements
          </span>
        </label>

        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span className="text-sm">
            <strong>Color Contrast:</strong> All text meets 4.5:1 ratio (3:1 for large text)
          </span>
        </label>

        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span className="text-sm">
            <strong>Screen Reader:</strong> Test with VoiceOver (Mac), NVDA/JAWS (Windows)
          </span>
        </label>

        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span className="text-sm">
            <strong>Touch Targets:</strong> All interactive elements at least 44x44px
          </span>
        </label>

        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span className="text-sm">
            <strong>ARIA Labels:</strong> Icon-only buttons have aria-label
          </span>
        </label>

        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span className="text-sm">
            <strong>Semantic HTML:</strong> Proper use of button, nav, header, main, etc.
          </span>
        </label>

        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span className="text-sm">
            <strong>Form Labels:</strong> All inputs have associated labels
          </span>
        </label>

        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span className="text-sm">
            <strong>Error Messages:</strong> Clear, specific, programmatically associated with inputs
          </span>
        </label>

        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span className="text-sm">
            <strong>Reduced Motion:</strong> Animations respect prefers-reduced-motion
          </span>
        </label>
      </div>

      <h2>Tools & Resources</h2>

      <div className="space-y-3 my-6">
        <div className="border border-border rounded-lg p-3">
          <p className="text-sm font-medium">axe DevTools (Browser Extension)</p>
          <p className="text-xs text-muted-foreground">
            Automated accessibility testing in Chrome/Firefox
          </p>
        </div>

        <div className="border border-border rounded-lg p-3">
          <p className="text-sm font-medium">WAVE (WebAIM)</p>
          <p className="text-xs text-muted-foreground">
            Visual accessibility evaluation tool
          </p>
        </div>

        <div className="border border-border rounded-lg p-3">
          <p className="text-sm font-medium">VoiceOver (macOS)</p>
          <p className="text-xs text-muted-foreground">Built-in screen reader for testing</p>
        </div>

        <div className="border border-border rounded-lg p-3">
          <p className="text-sm font-medium">NVDA (Windows)</p>
          <p className="text-xs text-muted-foreground">Free, open-source screen reader</p>
        </div>

        <div className="border border-border rounded-lg p-3">
          <p className="text-sm font-medium">Pa11y CI</p>
          <p className="text-xs text-muted-foreground">
            Automated accessibility testing in CI/CD
          </p>
        </div>
      </div>

      <h2>Key Takeaways</h2>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <ul className="space-y-2 text-sm">
          <li>✅ WCAG 2.1 Level AA compliance required</li>
          <li>✅ 4.5:1 contrast ratio for normal text, 3:1 for large text</li>
          <li>✅ All features keyboard accessible</li>
          <li>✅ Visible focus indicators on all elements</li>
          <li>✅ 44x44px minimum touch target size</li>
          <li>✅ Semantic HTML and proper ARIA attributes</li>
          <li>✅ Respect prefers-reduced-motion</li>
          <li>✅ Test with screen readers regularly</li>
        </ul>
      </div>
    </div>
  );
}
