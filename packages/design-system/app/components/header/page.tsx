'use client';

import { Button } from '@fidus/ui/button';
import { Link } from '@fidus/ui/link';
import { Header } from '@fidus/ui/header';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { useState } from 'react';
import { Home, Users, Settings, Search, Bell, User } from 'lucide-react';

export default function HeaderPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/', active: true },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const navItemsWithIcons = [
    { label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, active: true },
    { label: 'Team', href: '/team', icon: <Users className="h-4 w-4" /> },
    { label: 'Settings', href: '/settings', icon: <Settings className="h-4 w-4" /> },
  ];

  const headerProps = [
    {
      name: 'logo',
      type: 'HeaderLogo',
      required: true,
      description: 'Logo configuration with text and/or image',
    },
    {
      name: 'items',
      type: 'HeaderItem[]',
      default: '[]',
      description: 'Navigation items to display in the header',
    },
    {
      name: 'actions',
      type: 'React.ReactNode',
      description: 'Action buttons or elements to display on the right side',
    },
    {
      name: 'sticky',
      type: 'boolean',
      default: 'false',
      description: 'Whether header sticks to top on scroll',
    },
    {
      name: 'transparent',
      type: 'boolean',
      default: 'false',
      description: 'Whether header has transparent background',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Height and spacing of header (sm: h-14, md: h-16, lg: h-20)',
    },
    {
      name: 'onMobileMenuClick',
      type: '() => void',
      description: 'Callback for mobile menu button (shows button if provided)',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes',
    },
  ];

  const logoProps = [
    {
      name: 'text',
      type: 'string',
      description: 'Logo text to display',
    },
    {
      name: 'image',
      type: 'string',
      description: 'Logo image URL',
    },
    {
      name: 'href',
      type: 'string',
      default: "'/'",
      description: 'Logo link destination',
    },
  ];

  const itemProps = [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Display text for navigation item',
    },
    {
      name: 'href',
      type: 'string',
      required: true,
      description: 'Link destination',
    },
    {
      name: 'active',
      type: 'boolean',
      description: 'Whether this is the current page',
    },
    {
      name: 'icon',
      type: 'React.ReactNode',
      description: 'Optional icon to display before label',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Header</h1>
      <p className="lead">
        Application header component with support for logo, navigation items, action buttons, and mobile menu. Can be sticky or transparent for hero sections.
      </p>

      <h2>Basic Example</h2>
      <ComponentPreview code={`<Header
  logo={{ href: '/', text: 'MyApp' }}
  items={[
    { label: 'Home', href: '/', active: true },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
  ]}
  actions={<Button size="sm">Sign In</Button>}
/>`}>
        <Header
          logo={{ href: '/', text: 'MyApp' }}
          items={navItems}
          actions={<Button size="sm">Sign In</Button>}
        />
      </ComponentPreview>

      <h2>With Logo Image</h2>
      <ComponentPreview code={`<Header
  logo={{
    image: '/logo.svg',
    text: 'Fidus',
    href: '/',
  }}
  items={navItems}
/>`}>
        <Header
          logo={{
            image: '/logo.svg',
            text: 'Fidus',
            href: '/',
          }}
          items={navItems}
        />
      </ComponentPreview>

      <h2>With Navigation Icons</h2>
      <ComponentPreview code={`<Header
  logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
  items={[
    { label: 'Home', href: '/', icon: <Home />, active: true },
    { label: 'Team', href: '/team', icon: <Users /> },
    { label: 'Settings', href: '/settings', icon: <Settings /> },
  ]}
  actions={
    <Stack direction="horizontal" spacing="sm">
      <Button variant="tertiary" size="sm"><Search /></Button>
      <Button variant="tertiary" size="sm"><Bell /></Button>
      <Button variant="tertiary" size="sm"><User /></Button>
    </Stack>
  }
/>`}>
        <Header
          logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
          items={navItemsWithIcons}
          actions={
            <Stack direction="horizontal" spacing="sm">
              <Button variant="tertiary" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="tertiary" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="tertiary" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </Stack>
          }
        />
      </ComponentPreview>

      <h2>Sizes</h2>
      <ComponentPreview code={`<Stack direction="vertical" spacing="lg">
  <Header logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }} items={navItems} size="sm" />
  <Header logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }} items={navItems} size="md" />
  <Header logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }} items={navItems} size="lg" />
</Stack>`}>
        <Stack direction="vertical" spacing="lg">
          <Header logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }} items={navItems} size="sm" />
          <Header logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }} items={navItems} size="md" />
          <Header logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }} items={navItems} size="lg" />
        </Stack>
      </ComponentPreview>

      <h2>Sticky Header</h2>
      <ComponentPreview code={`<Header
  logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
  items={navItems}
  sticky
  actions={<Button size="sm">Get Started</Button>}
/>`}>
        <div className="space-y-md">
          <Header
            logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
            items={navItems}
            sticky
            actions={<Button size="sm">Get Started</Button>}
          />
          <div className="h-32 rounded-lg border border-dashed border-border p-md flex items-center justify-center text-sm text-muted-foreground">
            Scroll content area (in actual usage, header would stick to viewport top)
          </div>
        </div>
      </ComponentPreview>

      <h2>Transparent Header</h2>
      <ComponentPreview code={`<div className="relative overflow-hidden">
  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600">
    <Header
      logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
      items={navItems}
      transparent
      actions={<Button size="sm" variant="secondary">Sign In</Button>}
    />
    <div className="text-center text-white mt-lg">
      <h2 className="text-3xl font-bold">Hero Section</h2>
      <p className="text-white/90 mt-sm">Transparent header overlays the background</p>
    </div>
  </div>
</div>`}>
        <div className="relative overflow-hidden rounded-lg border border-border">
          <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 p-lg">
            <Header
              logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
              items={navItems}
              transparent
              actions={<Button size="sm" variant="secondary">Sign In</Button>}
            />
            <div className="text-center text-white mt-lg">
              <h2 className="text-3xl font-bold">Hero Section</h2>
              <p className="text-white/90 mt-sm">Transparent header overlays the background</p>
            </div>
          </div>
        </div>
      </ComponentPreview>

      <h2>With Mobile Menu</h2>
      <ComponentPreview code={`<Header
  logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
  items={navItems}
  actions={<Button size="sm">Sign In</Button>}
  onMobileMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
/>`}>
        <div className="space-y-md">
          <p className="text-sm text-muted-foreground not-prose">
            Mobile menu button appears on smaller screens (hidden on md+). Resize browser to see the button.
          </p>
          <Header
            logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
            items={navItems}
            actions={<Button size="sm">Sign In</Button>}
            onMobileMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
          {mobileMenuOpen && (
            <div className="rounded-lg border border-border bg-muted p-md">
              <p className="text-sm font-semibold mb-sm">Mobile Menu (would be a drawer/sheet)</p>
              <Stack direction="vertical" spacing="xs">
                {navItems.map((item, idx) => (
                  <div key={idx} className="text-sm text-muted-foreground">
                    {item.label}
                  </div>
                ))}
              </Stack>
            </div>
          )}
        </div>
      </ComponentPreview>

      <h2>Multiple Action Buttons</h2>
      <ComponentPreview code={`<Header
  logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
  items={navItems}
  actions={
    <Stack direction="horizontal" spacing="sm">
      <Button variant="tertiary" size="sm">Sign In</Button>
      <Button size="sm">Sign Up</Button>
    </Stack>
  }
/>`}>
        <Header
          logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
          items={navItems}
          actions={
            <Stack direction="horizontal" spacing="sm">
              <Button variant="tertiary" size="sm">Sign In</Button>
              <Button size="sm">Sign Up</Button>
            </Stack>
          }
        />
      </ComponentPreview>

      <h2>Logo and Actions Only</h2>
      <ComponentPreview code={`<Header
  logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
  actions={
    <Stack direction="horizontal" spacing="sm">
      <Button variant="tertiary" size="sm"><Search /></Button>
      <Button size="sm">Get Started</Button>
    </Stack>
  }
/>`}>
        <Header
          logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
          actions={
            <Stack direction="horizontal" spacing="sm">
              <Button variant="tertiary" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button size="sm">Get Started</Button>
            </Stack>
          }
        />
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={headerProps} />

      <h2>HeaderLogo Type</h2>
      <PropsTable props={logoProps} />

      <h2>HeaderItem Type</h2>
      <PropsTable props={itemProps} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For primary application navigation at the top of every page</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For consistent branding with logo placement</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For global actions like search, notifications, or user account access</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use sticky variant when navigation should remain accessible while scrolling</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use transparent variant for hero sections with background images</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep navigation items concise (5-7 items maximum)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use active state to indicate current page location</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Place most important actions on the right side</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use consistent header across all pages for familiarity</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide mobile menu callback for responsive navigation on small screens</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Choose appropriate size based on content density needs</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Uses semantic HTML with &lt;header&gt; and &lt;nav&gt; elements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Navigation has proper ARIA role</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Active page marked with aria-current="page"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>All interactive elements are keyboard accessible with visible focus indicators</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Mobile menu button includes appropriate aria-label</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Logo images include alt text for screen readers</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do's and Don'ts</h2>

      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        {/* Do's */}
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <span className="text-2xl">✓</span> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Keep navigation items clear and concise (max 5-7 items)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Mark the current page with active state for wayfinding</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use consistent header placement and styling across all pages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide mobile menu for responsive navigation on smaller screens</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use sticky header for long pages where navigation should stay accessible</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview code={`<Header
  logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
  items={[
    { label: 'Home', href: '/', active: true },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
  ]}
  sticky
  actions={<Button size="sm">Sign In</Button>}
/>`}>
              <Header
                logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
                items={[
                  { label: 'Home', href: '/', active: true },
                  { label: 'Products', href: '/products' },
                  { label: 'About', href: '/about' },
                ]}
                sticky
                actions={<Button size="sm">Sign In</Button>}
              />
            </ComponentPreview>
          </div>
        </div>

        {/* Don'ts */}
        <div className="border-2 border-error bg-error/10 rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don't
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't overcrowd navigation with too many items (causes cognitive overload)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use different header styles across pages (breaks consistency)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't forget to mark the active page (users get lost)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use transparent header on light backgrounds (readability issues)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't hide critical navigation on mobile without a menu button</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview code={`<Header
  logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Team', href: '/team' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ]}
/>`}>
              <Header
                logo={{ href: '/', image: '/logo.svg', text: 'Fidus' }}
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Products', href: '/products' },
                  { label: 'Services', href: '/services' },
                  { label: 'Portfolio', href: '/portfolio' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'Team', href: '/team' },
                  { label: 'Careers', href: '/careers' },
                  { label: 'Contact', href: '/contact' },
                ]}
              />
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/link"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Link</h3>
          <p className="text-sm text-muted-foreground">For navigation between pages</p>
        </Link>
        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Button</h3>
          <p className="text-sm text-muted-foreground">For action buttons in header</p>
        </Link>
        <Link
          href="/components/stack"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Stack</h3>
          <p className="text-sm text-muted-foreground">For arranging action buttons</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/header/header.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/banner.html"
              external
              showIcon
            >
              ARIA: Banner Landmark Pattern
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
