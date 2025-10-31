'use client';

import { Button, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { CodeBlock } from '../../../components/helpers/code-block';
import { useState } from 'react';

export default function ResponsiveDesignPage() {
  const [showResponsiveDemo, setShowResponsiveDemo] = useState(true);

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Responsive Design</h1>
      <p className="lead">
        Fidus is mobile-first and fully responsive. Our design system adapts seamlessly from
        smartphones to desktop displays, ensuring optimal user experience at every screen size.
      </p>

      <h2>Breakpoints</h2>

      <p>We use Tailwind CSS&apos;s standard breakpoint system:</p>

      <div className="not-prose space-y-sm my-lg">
        <div className="border border-border rounded-lg p-md">
          <div className="flex items-center justify-between mb-sm">
            <code className="text-sm">sm</code>
            <span className="text-xs text-muted-foreground">640px and up</span>
          </div>
          <p className="text-sm text-muted-foreground">Small tablets, large phones (landscape)</p>
        </div>

        <div className="border border-border rounded-lg p-md">
          <div className="flex items-center justify-between mb-sm">
            <code className="text-sm">md</code>
            <span className="text-xs text-muted-foreground">768px and up</span>
          </div>
          <p className="text-sm text-muted-foreground">Tablets (portrait)</p>
        </div>

        <div className="border border-border rounded-lg p-md">
          <div className="flex items-center justify-between mb-sm">
            <code className="text-sm">lg</code>
            <span className="text-xs text-muted-foreground">1024px and up</span>
          </div>
          <p className="text-sm text-muted-foreground">Tablets (landscape), small laptops</p>
        </div>

        <div className="border border-border rounded-lg p-md">
          <div className="flex items-center justify-between mb-sm">
            <code className="text-sm">xl</code>
            <span className="text-xs text-muted-foreground">1280px and up</span>
          </div>
          <p className="text-sm text-muted-foreground">Desktop monitors</p>
        </div>

        <div className="border border-border rounded-lg p-md">
          <div className="flex items-center justify-between mb-sm">
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

      <div className="not-prose my-md">
        <CodeBlock
          language="tsx"
          code={`// Mobile first (no prefix)
<div className="p-md text-sm">

// Then enhance for larger screens
<div className="p-md md:p-lg lg:p-xl text-sm md:text-base">

// Grid: 1 column mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">`}
        />
      </div>

      <h2>Interactive Responsive Demo</h2>
      <p>
        Resize your browser window or use DevTools device emulation to see how this layout adapts
        across breakpoints:
      </p>

      <ComponentPreview
        code={`const [showResponsiveDemo, setShowResponsiveDemo] = useState(true);

<div>
  <Button onClick={() => setShowResponsiveDemo(!showResponsiveDemo)}>
    {showResponsiveDemo ? 'Hide Demo' : 'Show Demo'}
  </Button>
  {showResponsiveDemo && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mt-md">
      <div className="p-md border border-border rounded-lg bg-card">
        <h4 className="font-semibold mb-sm">Mobile: 1 Column</h4>
        <p className="text-sm text-muted-foreground">
          Full width on phones
        </p>
      </div>
      <div className="p-md border border-border rounded-lg bg-card">
        <h4 className="font-semibold mb-sm">Tablet: 2 Columns</h4>
        <p className="text-sm text-muted-foreground">
          Side-by-side on tablets
        </p>
      </div>
      <div className="p-md border border-border rounded-lg bg-card">
        <h4 className="font-semibold mb-sm">Desktop: 3 Columns</h4>
        <p className="text-sm text-muted-foreground">
          Optimized for large screens
        </p>
      </div>
    </div>
  )}
</div>`}
      >
        <div>
          <Button onClick={() => setShowResponsiveDemo(!showResponsiveDemo)}>
            {showResponsiveDemo ? 'Hide Demo' : 'Show Demo'}
          </Button>
          {showResponsiveDemo && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mt-md">
              <div className="p-md border border-border rounded-lg bg-card">
                <h4 className="font-semibold mb-sm">Mobile: 1 Column</h4>
                <p className="text-sm text-muted-foreground">
                  Full width on phones (default, no breakpoint prefix)
                </p>
              </div>
              <div className="p-md border border-border rounded-lg bg-card">
                <h4 className="font-semibold mb-sm">Tablet: 2 Columns</h4>
                <p className="text-sm text-muted-foreground">
                  Side-by-side on tablets (md:grid-cols-2 at 768px+)
                </p>
              </div>
              <div className="p-md border border-border rounded-lg bg-card">
                <h4 className="font-semibold mb-sm">Desktop: 3 Columns</h4>
                <p className="text-sm text-muted-foreground">
                  Optimized for large screens (lg:grid-cols-3 at 1024px+)
                </p>
              </div>
            </div>
          )}
        </div>
      </ComponentPreview>

      <h2>Responsive Patterns</h2>

      <h3>Grid Layout</h3>
      <p>Automatic responsive columns:</p>

      <div className="not-prose my-md">
        <CodeBlock
          language="tsx"
          code={`// Grid component with auto-responsive columns
<Grid cols="3">  // 1 col mobile, 2 tablet, 3 desktop
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</Grid>

// Manual control
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">`}
        />
      </div>

      <h3>Stack Direction</h3>
      <p>Change layout orientation at breakpoints:</p>

      <div className="not-prose my-md">
        <CodeBlock
          language="tsx"
          code={`// Vertical on mobile, horizontal on tablet+
<Stack
  direction="vertical"
  className="md:flex-row"
>
  <Button>Primary</Button>
  <Button>Secondary</Button>
</Stack>`}
        />
      </div>

      <h3>Container Max-Width</h3>
      <p>Content containers adapt to screen size:</p>

      <div className="not-prose my-md">
        <CodeBlock
          language="tsx"
          code={`<Container size="lg">  // max-w-6xl
  // Automatically adds padding and centers
  <OpportunityCard>...</OpportunityCard>
</Container>`}
        />
      </div>

      <h3>Visibility Classes</h3>
      <p>Show/hide elements at specific breakpoints:</p>

      <div className="not-prose my-md">
        <CodeBlock
          language="tsx"
          code={`// Hidden on mobile, visible on md+
<div className="hidden md:block">
  Desktop navigation
</div>

// Visible on mobile, hidden on md+
<button className="md:hidden">
  Mobile menu
</button>`}
        />
      </div>

      <h2>Typography Scale</h2>

      <p>Text sizes adjust for readability:</p>

      <div className="not-prose space-y-sm my-lg">
        <div className="flex items-center gap-md p-sm border border-border rounded-lg">
          <code className="text-sm min-w-[120px]">text-sm</code>
          <span className="text-sm">14px</span>
          <span className="text-xs text-muted-foreground">Body text mobile</span>
        </div>

        <div className="flex items-center gap-md p-sm border border-border rounded-lg">
          <code className="text-sm min-w-[120px]">md:text-base</code>
          <span className="text-sm">16px</span>
          <span className="text-xs text-muted-foreground">Body text desktop</span>
        </div>

        <div className="flex items-center gap-md p-sm border border-border rounded-lg">
          <code className="text-sm min-w-[120px]">text-xl md:text-2xl</code>
          <span className="text-sm">20px → 24px</span>
          <span className="text-xs text-muted-foreground">Headings</span>
        </div>
      </div>

      <h2>Spacing Scale</h2>

      <p>Padding and margins adjust at breakpoints:</p>

      <div className="not-prose my-md">
        <CodeBlock
          language="tsx"
          code={`// Tighter spacing mobile, more generous desktop
<div className="p-md md:p-lg lg:p-xl">

// Gap between elements
<Stack spacing="sm" className="md:gap-md lg:gap-lg">`}
        />
      </div>

      <h2>Component Adaptations</h2>

      <h3>OpportunityCard</h3>
      <div className="not-prose space-y-sm my-md text-sm">
        <p>
          <strong>Mobile:</strong> Full width, swipe-to-dismiss
        </p>
        <p>
          <strong>Desktop:</strong> Max-width constrained, X button to close
        </p>
      </div>

      <h3>Navigation</h3>
      <div className="not-prose space-y-sm my-md text-sm">
        <p>
          <strong>Mobile:</strong> Hamburger menu, bottom tab bar
        </p>
        <p>
          <strong>Desktop:</strong> Sidebar navigation, top header
        </p>
      </div>

      <h3>Forms</h3>
      <div className="not-prose space-y-sm my-md text-sm">
        <p>
          <strong>Mobile:</strong> Full-width inputs, vertical button stack
        </p>
        <p>
          <strong>Desktop:</strong> Multi-column layouts, horizontal button groups
        </p>
      </div>

      <h3>Tables</h3>
      <div className="not-prose space-y-sm my-md text-sm">
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

      <div className="not-prose my-md">
        <CodeBlock
          language="tsx"
          code={`// Ensure adequate spacing for touch
<button className="min-h-[44px] min-w-[44px] p-sm">
  <Icon className="h-5 w-5" />
</button>`}
        />
      </div>

      <h3>Hover States</h3>
      <p>Only apply hover styles on devices that support hover:</p>

      <div className="not-prose my-md">
        <CodeBlock
          language="tsx"
          code={`// Hover only on devices with hover capability
<button className="hover:bg-primary/90 active:bg-primary/80">
  // active state for touch devices
</button>`}
        />
      </div>

      <h2>Testing Responsive Design</h2>

      <h3>Browser DevTools</h3>
      <div className="not-prose space-y-sm my-md text-sm">
        <p>1. Open Chrome/Firefox DevTools (F12)</p>
        <p>2. Toggle device toolbar (Ctrl/Cmd + Shift + M)</p>
        <p>3. Test common device sizes:</p>
        <ul className="text-xs ml-lg space-y-xs">
          <li>• iPhone SE (375px)</li>
          <li>• iPhone 14 Pro (393px)</li>
          <li>• iPad (768px)</li>
          <li>• Desktop (1280px, 1920px)</li>
        </ul>
      </div>

      <h3>Device Preview Examples</h3>
      <p>
        Common device viewports to test. Use these dimensions in DevTools device emulation:
      </p>

      <div className="not-prose space-y-md my-lg">
        <div className="border border-border rounded-lg p-lg bg-muted">
          <h4 className="text-base font-semibold mb-md">📱 Mobile Phones (Portrait)</h4>
          <div className="space-y-sm text-sm">
            <div className="flex items-center justify-between p-sm bg-muted rounded-md">
              <span>iPhone SE (2022)</span>
              <code className="text-xs">375 × 667</code>
            </div>
            <div className="flex items-center justify-between p-sm bg-muted rounded-md">
              <span>iPhone 14 Pro</span>
              <code className="text-xs">393 × 852</code>
            </div>
            <div className="flex items-center justify-between p-sm bg-muted rounded-md">
              <span>Samsung Galaxy S23</span>
              <code className="text-xs">360 × 780</code>
            </div>
            <div className="flex items-center justify-between p-sm bg-muted rounded-md">
              <span>Google Pixel 7</span>
              <code className="text-xs">412 × 915</code>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-lg bg-muted">
          <h4 className="text-base font-semibold mb-md">📱 Mobile Phones (Landscape)</h4>
          <div className="space-y-sm text-sm">
            <div className="flex items-center justify-between p-sm bg-muted rounded-md">
              <span>iPhone 14 Pro (landscape)</span>
              <code className="text-xs">852 × 393</code>
            </div>
            <div className="flex items-center justify-between p-sm bg-muted rounded-md">
              <span>Samsung Galaxy S23 (landscape)</span>
              <code className="text-xs">780 × 360</code>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-lg bg-muted">
          <h4 className="text-base font-semibold mb-md">💻 Tablets</h4>
          <div className="space-y-sm text-sm">
            <div className="flex items-center justify-between p-sm bg-muted rounded-md">
              <span>iPad Mini (portrait)</span>
              <code className="text-xs">768 × 1024</code>
            </div>
            <div className="flex items-center justify-between p-sm bg-muted rounded-md">
              <span>iPad Air (portrait)</span>
              <code className="text-xs">820 × 1180</code>
            </div>
            <div className="flex items-center justify-between p-sm bg-muted rounded-md">
              <span>iPad Pro 11&quot; (portrait)</span>
              <code className="text-xs">834 × 1194</code>
            </div>
            <div className="flex items-center justify-between p-sm bg-muted rounded-md">
              <span>iPad Pro 12.9&quot; (landscape)</span>
              <code className="text-xs">1366 × 1024</code>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-lg bg-muted">
          <h4 className="text-base font-semibold mb-md">🖥️ Desktop & Laptop</h4>
          <div className="space-y-sm text-sm">
            <div className="flex items-center justify-between p-sm bg-muted rounded-md">
              <span>MacBook Air 13&quot;</span>
              <code className="text-xs">1280 × 832</code>
            </div>
            <div className="flex items-center justify-between p-sm bg-muted rounded-md">
              <span>MacBook Pro 14&quot;</span>
              <code className="text-xs">1512 × 982</code>
            </div>
            <div className="flex items-center justify-between p-sm bg-muted rounded-md">
              <span>Full HD Monitor</span>
              <code className="text-xs">1920 × 1080</code>
            </div>
            <div className="flex items-center justify-between p-sm bg-muted rounded-md">
              <span>4K Monitor</span>
              <code className="text-xs">3840 × 2160</code>
            </div>
          </div>
        </div>
      </div>

      <h3>Real Devices</h3>
      <p className="text-sm">Always test on actual devices when possible:</p>
      <ul className="text-sm">
        <li>iOS Safari (different rendering than Chrome)</li>
        <li>Android Chrome</li>
        <li>Tablet (different touch patterns than phone)</li>
      </ul>

      <h2>Responsive Testing Checklist</h2>

      <p>
        Use this checklist to ensure your responsive design works correctly across all devices:
      </p>

      <div className="not-prose space-y-sm my-lg">
        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Mobile (375px - 640px):</strong> Test on iPhone SE, ensure touch targets are 44x44px minimum
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Tablet Portrait (768px - 1024px):</strong> Verify 2-column layouts, navigation adapts
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Tablet Landscape (1024px+):</strong> Check 3-column grids, sidebar visibility
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Desktop (1280px+):</strong> Full layout, all features visible, hover states working
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Large Desktop (1920px+):</strong> Content max-width enforced, no excessive whitespace
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Orientation Changes:</strong> Test portrait → landscape transitions on mobile/tablet
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Touch Interactions:</strong> Swipe gestures work, buttons have adequate spacing
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Typography:</strong> Text is readable at all sizes, line-height appropriate
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Images & Media:</strong> Images scale properly, no horizontal scrolling
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Forms:</strong> Input fields accessible, virtual keyboard doesn&apos;t obscure inputs
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Navigation:</strong> Mobile menu works, desktop sidebar visible, transitions smooth
          </span>
        </label>

        <label className="flex items-start gap-sm">
          <input type="checkbox" className="mt-xs" />
          <span className="text-sm">
            <strong>Performance:</strong> Loads quickly on mobile networks, no layout shift (CLS)
          </span>
        </label>
      </div>

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
      <div className="not-prose space-y-sm my-md text-sm">
        <li>Show loading states immediately</li>
        <li>Implement optimistic UI updates</li>
        <li>Cache data locally when possible</li>
        <li>Provide offline fallbacks</li>
      </div>

      <h2>Best Practices</h2>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-md my-lg">
        <div className="border border-success/20 bg-success/5 rounded-lg p-md">
          <h3 className="text-sm font-semibold text-success mb-sm">✓ Do</h3>
          <ul className="text-sm space-y-xs">
            <li>• Design mobile-first</li>
            <li>• Test on real devices</li>
            <li>• Use semantic breakpoints</li>
            <li>• Optimize for touch</li>
            <li>• Consider network speed</li>
            <li>• Progressive enhancement</li>
          </ul>
        </div>

        <div className="border border-error/20 bg-error/5 rounded-lg p-md">
          <h3 className="text-sm font-semibold text-error mb-sm">✗ Don&apos;t</h3>
          <ul className="text-sm space-y-xs">
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

      <div className="not-prose my-md">
        <CodeBlock
          language="tsx"
          code={`<Container size="lg" className="py-md md:py-lg lg:py-xl">
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
        />
      </div>

      <h2>Related Components</h2>

      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/container"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Container
          </h3>
          <p className="text-sm text-muted-foreground">
            Responsive max-width containers with padding
          </p>
        </Link>

        <Link
          href="/components/grid"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Grid
          </h3>
          <p className="text-sm text-muted-foreground">
            Auto-responsive grid layouts with breakpoints
          </p>
        </Link>

        <Link
          href="/components/stack"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Stack
          </h3>
          <p className="text-sm text-muted-foreground">
            Flexible layouts with responsive direction
          </p>
        </Link>

        <Link
          href="/components/header"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Header
          </h3>
          <p className="text-sm text-muted-foreground">
            Responsive navigation with mobile menu
          </p>
        </Link>

        <Link
          href="/components/sidebar"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Sidebar
          </h3>
          <p className="text-sm text-muted-foreground">
            Collapsible sidebar for mobile/desktop
          </p>
        </Link>

        <Link
          href="/components/table"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Table
          </h3>
          <p className="text-sm text-muted-foreground">
            Responsive tables with card layout fallback
          </p>
        </Link>
      </div>

      <h2>Resources</h2>

      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design"
              external
              showIcon
            >
              MDN: Responsive Design - Complete guide to responsive web design
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://web.dev/responsive-web-design-basics/"
              external
              showIcon
            >
              Web.dev: Responsive Design Basics - Google&apos;s responsive design guide
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://tailwindcss.com/docs/responsive-design"
              external
              showIcon
            >
              Tailwind CSS: Responsive Design - Breakpoint system documentation
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://developer.chrome.com/docs/devtools/device-mode/"
              external
              showIcon
            >
              Chrome DevTools: Device Mode - Testing responsive designs
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.browserstack.com/responsive"
              external
              showIcon
            >
              BrowserStack - Test on real devices remotely
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://gs.statcounter.com/screen-resolution-stats"
              external
              showIcon
            >
              StatCounter: Screen Resolution Stats - Real-world device usage data
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/foundations/accessibility">
              Accessibility - Touch target and keyboard navigation guidelines
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
          <li>✅ Mobile-first design approach (default styles, then enhance)</li>
          <li>✅ Standard breakpoints: sm(640) md(768) lg(1024) xl(1280) 2xl(1536)</li>
          <li>✅ Touch targets minimum 44x44px for mobile devices</li>
          <li>✅ Test on real devices regularly, not just DevTools</li>
          <li>✅ Progressive enhancement from mobile to desktop</li>
          <li>✅ Optimize images and performance for mobile networks</li>
          <li>✅ Use responsive utility classes (md:, lg:, xl:)</li>
          <li>✅ Consider both portrait and landscape orientations</li>
          <li>✅ Test all breakpoints with comprehensive checklist</li>
          <li>✅ Use device-specific viewports (iPhone, iPad, etc.)</li>
        </ul>
      </div>
    </div>
  );
}
