'use client';

export default function ResponsiveDesignPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Responsive Design</h1>
      <p className="lead">
        Fidus is mobile-first and fully responsive. Our design system adapts seamlessly from
        smartphones to desktop displays, ensuring optimal user experience at every screen size.
      </p>

      <h2>Breakpoints</h2>

      <p>We use Tailwind CSS's standard breakpoint system:</p>

      <div className="space-y-3 my-6">
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <code className="text-sm">sm</code>
            <span className="text-xs text-muted-foreground">640px and up</span>
          </div>
          <p className="text-sm text-muted-foreground">Small tablets, large phones (landscape)</p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <code className="text-sm">md</code>
            <span className="text-xs text-muted-foreground">768px and up</span>
          </div>
          <p className="text-sm text-muted-foreground">Tablets (portrait)</p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <code className="text-sm">lg</code>
            <span className="text-xs text-muted-foreground">1024px and up</span>
          </div>
          <p className="text-sm text-muted-foreground">Tablets (landscape), small laptops</p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <code className="text-sm">xl</code>
            <span className="text-xs text-muted-foreground">1280px and up</span>
          </div>
          <p className="text-sm text-muted-foreground">Desktop monitors</p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <code className="text-sm">2xl</code>
            <span className="text-xs text-muted-foreground">1536px and up</span>
          </div>
          <p className="text-sm text-muted-foreground">Large desktop monitors</p>
        </div>
      </div>

      <h2>Mobile-First Approach</h2>

      <p>
        We design for mobile first, then progressively enhance for larger screens. This ensures the
        core experience works everywhere.
      </p>

      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`// Mobile first (no prefix)
<div className="p-4 text-sm">

// Then enhance for larger screens
<div className="p-4 md:p-6 lg:p-8 text-sm md:text-base">

// Grid: 1 column mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`}
        </pre>
      </div>

      <h2>Responsive Patterns</h2>

      <h3>Grid Layout</h3>
      <p>Automatic responsive columns:</p>

      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`// Grid component with auto-responsive columns
<Grid cols="3">  // 1 col mobile, 2 tablet, 3 desktop
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</Grid>

// Manual control
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">`}
        </pre>
      </div>

      <h3>Stack Direction</h3>
      <p>Change layout orientation at breakpoints:</p>

      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`// Vertical on mobile, horizontal on tablet+
<Stack
  direction="vertical"
  className="md:flex-row"
>
  <Button>Primary</Button>
  <Button>Secondary</Button>
</Stack>`}
        </pre>
      </div>

      <h3>Container Max-Width</h3>
      <p>Content containers adapt to screen size:</p>

      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`<Container size="lg">  // max-w-6xl
  // Automatically adds padding and centers
  <OpportunityCard>...</OpportunityCard>
</Container>`}
        </pre>
      </div>

      <h3>Visibility Classes</h3>
      <p>Show/hide elements at specific breakpoints:</p>

      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`// Hidden on mobile, visible on md+
<div className="hidden md:block">
  Desktop navigation
</div>

// Visible on mobile, hidden on md+
<button className="md:hidden">
  Mobile menu
</button>`}
        </pre>
      </div>

      <h2>Typography Scale</h2>

      <p>Text sizes adjust for readability:</p>

      <div className="space-y-3 my-6">
        <div className="flex items-center gap-4 p-3 border border-border rounded-lg">
          <code className="text-sm min-w-[120px]">text-sm</code>
          <span className="text-sm">14px</span>
          <span className="text-xs text-muted-foreground">Body text mobile</span>
        </div>

        <div className="flex items-center gap-4 p-3 border border-border rounded-lg">
          <code className="text-sm min-w-[120px]">md:text-base</code>
          <span className="text-sm">16px</span>
          <span className="text-xs text-muted-foreground">Body text desktop</span>
        </div>

        <div className="flex items-center gap-4 p-3 border border-border rounded-lg">
          <code className="text-sm min-w-[120px]">text-xl md:text-2xl</code>
          <span className="text-sm">20px → 24px</span>
          <span className="text-xs text-muted-foreground">Headings</span>
        </div>
      </div>

      <h2>Spacing Scale</h2>

      <p>Padding and margins adjust at breakpoints:</p>

      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`// Tighter spacing mobile, more generous desktop
<div className="p-4 md:p-6 lg:p-8">

// Gap between elements
<Stack spacing="sm" className="md:gap-4 lg:gap-6">`}
        </pre>
      </div>

      <h2>Component Adaptations</h2>

      <h3>OpportunityCard</h3>
      <div className="space-y-2 my-4 text-sm">
        <p>
          <strong>Mobile:</strong> Full width, swipe-to-dismiss
        </p>
        <p>
          <strong>Desktop:</strong> Max-width constrained, X button to close
        </p>
      </div>

      <h3>Navigation</h3>
      <div className="space-y-2 my-4 text-sm">
        <p>
          <strong>Mobile:</strong> Hamburger menu, bottom tab bar
        </p>
        <p>
          <strong>Desktop:</strong> Sidebar navigation, top header
        </p>
      </div>

      <h3>Forms</h3>
      <div className="space-y-2 my-4 text-sm">
        <p>
          <strong>Mobile:</strong> Full-width inputs, vertical button stack
        </p>
        <p>
          <strong>Desktop:</strong> Multi-column layouts, horizontal button groups
        </p>
      </div>

      <h3>Tables</h3>
      <div className="space-y-2 my-4 text-sm">
        <p>
          <strong>Mobile:</strong> Card-based layout (stacked cells)
        </p>
        <p>
          <strong>Desktop:</strong> Traditional table with columns
        </p>
      </div>

      <h2>Touch vs. Mouse</h2>

      <h3>Touch Targets</h3>
      <p>Minimum 44x44px for touch interfaces:</p>

      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`// Ensure adequate spacing for touch
<button className="min-h-[44px] min-w-[44px] p-3">
  <Icon className="h-5 w-5" />
</button>`}
        </pre>
      </div>

      <h3>Hover States</h3>
      <p>Only apply hover styles on devices that support hover:</p>

      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`// Hover only on devices with hover capability
<button className="hover:bg-primary/90 active:bg-primary/80">
  // active state for touch devices
</button>`}
        </pre>
      </div>

      <h2>Testing Responsive Design</h2>

      <h3>Browser DevTools</h3>
      <div className="space-y-2 my-4 text-sm">
        <p>1. Open Chrome/Firefox DevTools (F12)</p>
        <p>2. Toggle device toolbar (Ctrl/Cmd + Shift + M)</p>
        <p>3. Test common device sizes:
</p>
        <ul className="text-xs ml-6 space-y-1">
          <li>• iPhone SE (375px)</li>
          <li>• iPhone 14 Pro (393px)</li>
          <li>• iPad (768px)</li>
          <li>• Desktop (1280px, 1920px)</li>
        </ul>
      </div>

      <h3>Real Devices</h3>
      <p className="text-sm">Always test on actual devices when possible:</p>
      <ul className="text-sm">
        <li>iOS Safari (different rendering than Chrome)</li>
        <li>Android Chrome</li>
        <li>Tablet (different touch patterns than phone)</li>
      </ul>

      <h2>Performance Considerations</h2>

      <h3>Mobile Performance</h3>
      <ul>
        <li>Optimize images for mobile (WebP, smaller sizes)</li>
        <li>Lazy load below-the-fold content</li>
        <li>Minimize JavaScript bundle size</li>
        <li>Use server-side rendering (Next.js)</li>
        <li>Implement proper caching strategies</li>
      </ul>

      <h3>Network Conditions</h3>
      <p>Design for varying network speeds:</p>
      <div className="space-y-2 my-4 text-sm">
        <li>Show loading states immediately</li>
        <li>Implement optimistic UI updates</li>
        <li>Cache data locally when possible</li>
        <li>Provide offline fallbacks</li>
      </div>

      <h2>Best Practices</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-success/20 bg-success/5 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-success mb-2">✓ Do</h3>
          <ul className="text-sm space-y-1">
            <li>• Design mobile-first</li>
            <li>• Test on real devices</li>
            <li>• Use semantic breakpoints</li>
            <li>• Optimize for touch</li>
            <li>• Consider network speed</li>
            <li>• Progressive enhancement</li>
          </ul>
        </div>

        <div className="border border-destructive/20 bg-destructive/5 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-destructive mb-2">✗ Don't</h3>
          <ul className="text-sm space-y-1">
            <li>• Assume desktop-only usage</li>
            <li>• Use device-specific CSS</li>
            <li>• Rely solely on hover</li>
            <li>• Ignore portrait orientation</li>
            <li>• Create separate mobile site</li>
            <li>• Block content on small screens</li>
          </ul>
        </div>
      </div>

      <h2>Example: Responsive Card Grid</h2>

      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`<Container size="lg" className="py-4 md:py-6 lg:py-8">
  <Grid
    cols="3"  // Auto: 1 mobile, 2 tablet, 3 desktop
    gap="md"  // Responsive gap sizes
  >
    {opportunities.map(opp => (
      <OpportunityCard
        key={opp.id}
        title={opp.title}
        urgency={opp.urgency}
        className="text-sm md:text-base"  // Responsive text
      >
        {opp.content}
      </OpportunityCard>
    ))}
  </Grid>
</Container>`}
        </pre>
      </div>

      <h2>Key Takeaways</h2>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <ul className="space-y-2 text-sm">
          <li>✅ Mobile-first design approach</li>
          <li>✅ Standard breakpoints: sm(640) md(768) lg(1024) xl(1280) 2xl(1536)</li>
          <li>✅ Touch targets minimum 44x44px</li>
          <li>✅ Test on real devices regularly</li>
          <li>✅ Progressive enhancement from mobile</li>
          <li>✅ Optimize for network conditions</li>
          <li>✅ Use responsive utility classes</li>
          <li>✅ Consider both portrait and landscape</li>
        </ul>
      </div>
    </div>
  );
}
