export default function MotionPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Motion & Animation</h1>
      <p className="lead">
        Motion in Fidus provides feedback, guides attention, and creates smooth transitions. All
        animations are purposeful, subtle, and respect user preferences for reduced motion.
      </p>

      <h2>Motion Principles</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-base font-semibold mb-2">1. Purposeful</h3>
          <p className="text-sm">Every animation serves a purpose: feedback, guidance, or context.</p>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-base font-semibold mb-2">2. Subtle</h3>
          <p className="text-sm">Animations are quick and understated, not distracting.</p>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-base font-semibold mb-2">3. Consistent</h3>
          <p className="text-sm">Similar interactions have similar animations across the app.</p>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-base font-semibold mb-2">4. Respectful</h3>
          <p className="text-sm">Honor prefers-reduced-motion for accessibility.</p>
        </div>
      </div>

      <h2>Timing Functions</h2>

      <p>We use CSS custom properties for consistent timing curves:</p>

      <div className="space-y-4 my-6">
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <code className="text-sm">--ease-in</code>
            <span className="text-xs text-muted-foreground">cubic-bezier(0.4, 0, 1, 1)</span>
          </div>
          <p className="text-sm text-muted-foreground">Elements exiting the screen</p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <code className="text-sm">--ease-out</code>
            <span className="text-xs text-muted-foreground">cubic-bezier(0, 0, 0.2, 1)</span>
          </div>
          <p className="text-sm text-muted-foreground">Elements entering the screen</p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <code className="text-sm">--ease-in-out</code>
            <span className="text-xs text-muted-foreground">cubic-bezier(0.4, 0, 0.2, 1)</span>
          </div>
          <p className="text-sm text-muted-foreground">Elements moving within the screen</p>
        </div>
      </div>

      <h2>Duration Scale</h2>

      <div className="space-y-3 my-6">
        <div className="flex items-center gap-4">
          <code className="text-sm min-w-[100px]">--duration-fast</code>
          <span className="text-sm">150ms</span>
          <span className="text-xs text-muted-foreground">Hover states, button presses</span>
        </div>

        <div className="flex items-center gap-4">
          <code className="text-sm min-w-[100px]">--duration-normal</code>
          <span className="text-sm">250ms</span>
          <span className="text-xs text-muted-foreground">Card dismissals, modals</span>
        </div>

        <div className="flex items-center gap-4">
          <code className="text-sm min-w-[100px]">--duration-slow</code>
          <span className="text-sm">400ms</span>
          <span className="text-xs text-muted-foreground">Page transitions, large movements</span>
        </div>
      </div>

      <h2>Common Animations</h2>

      <h3>Fade In (Appearing)</h3>
      <p>Used when OpportunityCards or widgets appear on screen:</p>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`opacity: 0 → 1
transform: translateY(8px) → translateY(0)
duration: 300ms
easing: ease-out`}
        </pre>
      </div>

      <h3>Fade Out (Dismissing)</h3>
      <p>Used when cards are dismissed:</p>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`opacity: 1 → 0
transform: translateX(0) → translateX(100%)
duration: 250ms
easing: ease-in`}
        </pre>
      </div>

      <h3>Hover Lift</h3>
      <p>Subtle elevation on interactive cards:</p>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`transform: translateY(0) → translateY(-2px)
box-shadow: sm → md
duration: 150ms
easing: ease`}
        </pre>
      </div>

      <h3>Expand/Collapse</h3>
      <p>Used in DetailCard and collapsible sections:</p>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`max-height: 0 → auto (use specific px value)
opacity: 0 → 1
duration: 250ms
easing: ease-in-out`}
        </pre>
      </div>

      <h2>Swipe Gestures</h2>

      <p>OpportunityCards support swipe-to-dismiss on mobile:</p>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
        <h3 className="text-base font-semibold mb-4">Swipe Behavior</h3>
        <ol className="text-sm space-y-2">
          <li>1. User starts swipe - card follows finger in real-time</li>
          <li>2. If swipe distance &gt; 50px - trigger dismiss animation</li>
          <li>3. Card slides out completely (250ms ease-in)</li>
          <li>4. onDismiss callback is fired</li>
          <li>5. If swipe &lt; 50px - card springs back (150ms ease-out)</li>
        </ol>
      </div>

      <h2>Loading States</h2>

      <h3>Spinner</h3>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
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
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
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
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`// Hover state
<button className="transition-colors duration-150 hover:bg-primary/90">

// Card appearing
<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

// Card dismissing (custom)
<div className="transition-all duration-250 opacity-0 translate-x-full">`}
        </pre>
      </div>

      <h3>Custom Transitions</h3>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
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

      <h2>Accessibility: Reduced Motion</h2>

      <p>
        Always respect the <code>prefers-reduced-motion</code> media query. Users who enable this
        setting should see instant state changes without animations.
      </p>

      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
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
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`<div className="transition-all duration-250 motion-reduce:transition-none">`}
        </pre>
      </div>

      <h2>Best Practices</h2>

      <ul>
        <li>
          <strong>Keep it Subtle:</strong> Animations should enhance, not distract
        </li>
        <li>
          <strong>Match Direction:</strong> Elements entering from top should exit to top
        </li>
        <li>
          <strong>Consistent Durations:</strong> Use the duration scale (150/250/400ms)
        </li>
        <li>
          <strong>Test on Devices:</strong> Animations may feel different on lower-end devices
        </li>
        <li>
          <strong>No Animation Spam:</strong> Avoid animating multiple elements simultaneously
        </li>
        <li>
          <strong>Respect Preferences:</strong> Always honor prefers-reduced-motion
        </li>
      </ul>

      <h2>When to Use Motion</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-success/20 bg-success/5 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-success mb-2">✓ Good Uses</h3>
          <ul className="text-sm space-y-1">
            <li>• Feedback on button press</li>
            <li>• Card appearing/dismissing</li>
            <li>• Hover states on interactive elements</li>
            <li>• Expand/collapse transitions</li>
            <li>• Loading states</li>
            <li>• Page transitions</li>
          </ul>
        </div>

        <div className="border border-destructive/20 bg-destructive/5 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-destructive mb-2">✗ Avoid</h3>
          <ul className="text-sm space-y-1">
            <li>• Auto-playing animations</li>
            <li>• Long duration animations (&gt;500ms)</li>
            <li>• Complex 3D transforms</li>
            <li>• Animating many elements at once</li>
            <li>• Decorative animations</li>
            <li>• Infinite loops (except loading)</li>
          </ul>
        </div>
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

      <h2>Key Takeaways</h2>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <ul className="space-y-2 text-sm">
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
