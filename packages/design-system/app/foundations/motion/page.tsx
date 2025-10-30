'use client';

import { Button, Link } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { useState } from 'react';

export default function MotionPage() {
  const [showFadeExample, setShowFadeExample] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Motion & Animation</h1>
      <p className="lead">
        Motion in Fidus provides feedback, guides attention, and creates smooth transitions. All
        animations are purposeful, subtle, and respect user preferences for reduced motion.
      </p>

      <h2>Motion Principles</h2>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-md my-lg">
        <div className="border border-border rounded-lg p-md bg-card">
          <h3 className="text-base font-semibold mb-sm">1. Purposeful</h3>
          <p className="text-sm">Every animation serves a purpose: feedback, guidance, or context.</p>
        </div>

        <div className="border border-border rounded-lg p-md bg-card">
          <h3 className="text-base font-semibold mb-sm">2. Subtle</h3>
          <p className="text-sm">Animations are quick and understated, not distracting.</p>
        </div>

        <div className="border border-border rounded-lg p-md bg-card">
          <h3 className="text-base font-semibold mb-sm">3. Consistent</h3>
          <p className="text-sm">Similar interactions have similar animations across the app.</p>
        </div>

        <div className="border border-border rounded-lg p-md bg-card">
          <h3 className="text-base font-semibold mb-sm">4. Respectful</h3>
          <p className="text-sm">Honor prefers-reduced-motion for accessibility.</p>
        </div>
      </div>

      <h2>Interactive Examples</h2>
      <p>Experience how motion enhances user interactions with live examples.</p>

      <div className="not-prose my-lg space-y-lg">
        <ComponentPreview code={`const [showFadeExample, setShowFadeExample] = useState(true);

<Button onClick={() => setShowFadeExample(!showFadeExample)}>
  {showFadeExample ? 'Hide Card' : 'Show Card'}
</Button>

{showFadeExample && (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
    <h3>Fade In Example</h3>
    <p>This card uses fade-in and slide-in animations.</p>
  </div>
)}`}>
          <div className="space-y-md">
            <Button onClick={() => setShowFadeExample(!showFadeExample)}>
              {showFadeExample ? 'Hide Card' : 'Show Card'}
            </Button>

            {showFadeExample && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-lg border border-border bg-card p-md">
                <h3 className="text-base font-semibold mb-sm">Fade In Example</h3>
                <p className="text-sm text-muted-foreground">
                  This card uses fade-in (opacity: 0 → 1) and slide-in-from-bottom (translateY: 8px → 0) with 300ms duration and ease-out easing.
                </p>
              </div>
            )}
          </div>
        </ComponentPreview>

        <ComponentPreview code={`const [isHovered, setIsHovered] = useState(false);

<div
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  className="transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
>
  <h3>Hover Lift Example</h3>
  <p>{isHovered ? 'Hovering!' : 'Hover over this card'}</p>
</div>`}>
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="rounded-lg border border-border bg-card p-lg cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
          >
            <h3 className="text-base font-semibold mb-sm">Hover Lift Example</h3>
            <p className="text-sm text-muted-foreground">
              {isHovered
                ? 'Hovering! Card lifts 2px with shadow transition (150ms)'
                : 'Hover over this card to see the lift effect'}
            </p>
          </div>
        </ComponentPreview>
      </div>

      <h2>Timing Functions</h2>

      <p>We use CSS custom properties for consistent timing curves:</p>

      <div className="not-prose space-y-md my-lg">
        <div className="border border-border rounded-lg p-md">
          <div className="flex items-center justify-between mb-sm">
            <code className="text-sm">--ease-in</code>
            <span className="text-xs text-muted-foreground">cubic-bezier(0.4, 0, 1, 1)</span>
          </div>
          <p className="text-sm text-muted-foreground">Elements exiting the screen</p>
        </div>

        <div className="border border-border rounded-lg p-md">
          <div className="flex items-center justify-between mb-sm">
            <code className="text-sm">--ease-out</code>
            <span className="text-xs text-muted-foreground">cubic-bezier(0, 0, 0.2, 1)</span>
          </div>
          <p className="text-sm text-muted-foreground">Elements entering the screen</p>
        </div>

        <div className="border border-border rounded-lg p-md">
          <div className="flex items-center justify-between mb-sm">
            <code className="text-sm">--ease-in-out</code>
            <span className="text-xs text-muted-foreground">cubic-bezier(0.4, 0, 0.2, 1)</span>
          </div>
          <p className="text-sm text-muted-foreground">Elements moving within the screen</p>
        </div>
      </div>

      <h2>Duration Scale</h2>

      <div className="not-prose space-y-sm my-lg">
        <div className="flex items-center gap-md">
          <code className="text-sm min-w-[120px]">--duration-fast</code>
          <span className="text-sm font-semibold">150ms</span>
          <span className="text-xs text-muted-foreground">Hover states, button presses</span>
        </div>

        <div className="flex items-center gap-md">
          <code className="text-sm min-w-[120px]">--duration-normal</code>
          <span className="text-sm font-semibold">250ms</span>
          <span className="text-xs text-muted-foreground">Card dismissals, modals</span>
        </div>

        <div className="flex items-center gap-md">
          <code className="text-sm min-w-[120px]">--duration-slow</code>
          <span className="text-sm font-semibold">400ms</span>
          <span className="text-xs text-muted-foreground">Page transitions, large movements</span>
        </div>
      </div>

      <h2>Common Animations</h2>

      <h3>Fade In (Appearing)</h3>
      <p>Used when OpportunityCards or widgets appear on screen:</p>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md">
        <pre className="text-xs">
          {`opacity: 0 → 1
transform: translateY(8px) → translateY(0)
duration: 300ms
easing: ease-out`}
        </pre>
      </div>

      <h3>Fade Out (Dismissing)</h3>
      <p>Used when cards are dismissed:</p>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md">
        <pre className="text-xs">
          {`opacity: 1 → 0
transform: translateX(0) → translateX(100%)
duration: 250ms
easing: ease-in`}
        </pre>
      </div>

      <h3>Hover Lift</h3>
      <p>Subtle elevation on interactive cards:</p>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md">
        <pre className="text-xs">
          {`transform: translateY(0) → translateY(-2px)
box-shadow: sm → md
duration: 150ms
easing: ease`}
        </pre>
      </div>

      <h3>Expand/Collapse</h3>
      <p>Used in DetailCard and collapsible sections:</p>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md">
        <pre className="text-xs">
          {`max-height: 0 → auto (use specific px value)
opacity: 0 → 1
duration: 250ms
easing: ease-in-out`}
        </pre>
      </div>

      <h2>Swipe Gestures</h2>

      <p>OpportunityCards support swipe-to-dismiss on mobile:</p>

      <div className="not-prose bg-muted/30 border border-border rounded-lg p-lg my-lg">
        <h3 className="text-base font-semibold mb-md">Swipe Behavior</h3>
        <ol className="text-sm space-y-sm">
          <li>User starts swipe - card follows finger in real-time</li>
          <li>If swipe distance &gt; 50px - trigger dismiss animation</li>
          <li>Card slides out completely (250ms ease-in)</li>
          <li>onDismiss callback is fired</li>
          <li>If swipe &lt; 50px - card springs back (150ms ease-out)</li>
        </ol>
      </div>

      <h2>Loading States</h2>

      <h3>Spinner</h3>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md">
        <pre className="text-xs">
          {`@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

animation: spin 1s linear infinite;`}
        </pre>
      </div>

      <h3>Skeleton Loader</h3>
      <p>For content loading:</p>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md">
        <pre className="text-xs">
          {`@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;`}
        </pre>
      </div>

      <h2>Implementation Examples</h2>

      <h3>Tailwind CSS Classes</h3>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md">
        <pre className="text-xs">
          {`// Hover state
<button className="transition-colors duration-150 hover:bg-primary/90">

// Card appearing
<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

// Card dismissing (custom)
<div className="transition-all duration-250 opacity-0 translate-x-full">

// Respect reduced motion
<div className="transition-all duration-250 motion-reduce:transition-none">`}
        </pre>
      </div>

      <h3>Custom Transitions</h3>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md">
        <pre className="text-xs">
          {`// In Tailwind config
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
}`}
        </pre>
      </div>

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use motion</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Providing feedback on user interactions (button presses, form submissions)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Guiding user attention to important changes (new opportunity card appears)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Creating smooth transitions between states (modal opening, panel expanding)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Indicating loading or processing states</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Enhancing perceived performance (skeleton loaders)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep animations subtle - they should enhance, not distract</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Match animation direction to element behavior (entering from top exits to top)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use consistent durations from the scale (150ms/250ms/400ms)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Test on lower-end devices - animations may feel different</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Avoid animating multiple elements simultaneously</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Prefer GPU-accelerated properties (transform, opacity)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Always respect user preferences for reduced motion</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Always respect prefers-reduced-motion media query</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use motion-reduce: utilities in Tailwind for reduced motion variants</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide instant state changes (no animation) when reduced motion is preferred</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Never convey information through motion alone - include text or icons</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Avoid infinite looping animations (except loading indicators)</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do&apos;s and Don&apos;ts</h2>

      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <span className="text-2xl">✓</span> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use 150ms for instant feedback (hover, press)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use 250ms for transitions (dismiss, modal)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use 400ms for large movements (page transition)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Always respect prefers-reduced-motion</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Animate transform and opacity for performance</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Keep animations purposeful and subtle</span>
            </li>
          </ul>
        </div>

        <div className="border-2 border-error rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don&apos;t
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use auto-playing animations on page load</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Create long duration animations (&gt;500ms)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use complex 3D transforms</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Animate many elements at once</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Create purely decorative animations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Ignore user&apos;s reduced motion preference</span>
            </li>
          </ul>
        </div>
      </div>

      <h2>Accessibility: Reduced Motion</h2>

      <p>
        Always respect the <code>prefers-reduced-motion</code> media query. Users who enable this
        setting should see instant state changes without animations.
      </p>

      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md">
        <pre className="text-xs">
          {`@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`}
        </pre>
      </div>

      <h3>Tailwind Implementation</h3>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md">
        <pre className="text-xs">
          {`<div className="transition-all duration-250 motion-reduce:transition-none">`}
        </pre>
      </div>

      <h2>Performance</h2>

      <h3>GPU-Accelerated Properties</h3>
      <p>Prefer these properties for smooth 60fps animations:</p>
      <ul>
        <li>
          <code>transform</code> (translate, rotate, scale)
        </li>
        <li>
          <code>opacity</code>
        </li>
      </ul>

      <h3>Avoid Animating</h3>
      <p>These cause layout recalculation (expensive):</p>
      <ul>
        <li>
          <code>width</code>, <code>height</code>
        </li>
        <li>
          <code>top</code>, <code>left</code>, <code>right</code>, <code>bottom</code>
        </li>
        <li>
          <code>margin</code>, <code>padding</code>
        </li>
      </ul>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">Uses motion for hover and press states</p>
        </Link>

        <Link
          href="/components/modal"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Modal
          </h3>
          <p className="text-sm text-muted-foreground">Uses fade and scale animations</p>
        </Link>

        <Link
          href="/components/progress-bar"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            ProgressBar
          </h3>
          <p className="text-sm text-muted-foreground">Animated progress indicator</p>
        </Link>

        <Link
          href="/patterns/loading-states"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Loading States
          </h3>
          <p className="text-sm text-muted-foreground">Loading animations pattern</p>
        </Link>

        <Link
          href="/components/opportunity-card"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            OpportunityCard
          </h3>
          <p className="text-sm text-muted-foreground">Card with swipe gestures and transitions</p>
        </Link>

        <Link
          href="/components/toast"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Toast
          </h3>
          <p className="text-sm text-muted-foreground">Slide-in notification animations</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://web.dev/animations-guide/"
              external
              showIcon
            >
              Web.dev: Animations Guide
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html"
              external
              showIcon
            >
              WCAG 2.1: Animation from Interactions
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"
              external
              showIcon
            >
              MDN: prefers-reduced-motion
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://cubic-bezier.com/"
              external
              showIcon
            >
              Cubic-Bezier.com - Easing Function Generator
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/tokens/motion">
              Motion Design Tokens
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/for-developers">
              Installation guide
            </Link>
          </li>
        </ul>
      </div>

      <h2>Key Takeaways</h2>

      <div className="not-prose bg-primary/10 border border-primary/20 rounded-lg p-lg my-lg">
        <ul className="space-y-sm text-sm">
          <li>✅ Use 150ms for instant feedback (hover, press)</li>
          <li>✅ Use 250ms for transitions (dismiss, modal)</li>
          <li>✅ Use 400ms for large movements (page transition)</li>
          <li>✅ Always respect prefers-reduced-motion</li>
          <li>✅ Animate transform and opacity for performance</li>
          <li>✅ Keep animations purposeful and subtle</li>
        </ul>
      </div>
    </div>
  );
}
