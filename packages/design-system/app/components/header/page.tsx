'use client';

import { Header } from '@fidus/ui';
import { Button } from '@fidus/ui';
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

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Header</h1>
        <p className="text-lg text-muted-foreground">
          Application header component with support for logo, navigation items, action buttons, and mobile menu. Can be sticky or transparent.
        </p>
      </div>

      {/* Import Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Import</h2>
          <div className="rounded-lg border border-border bg-muted p-4">
            <pre className="text-sm">
              <code>{`import { Header } from '@fidus/ui';

<Header
  logo={{ text: 'MyApp', href: '/' }}
  items={[
    { label: 'Home', href: '/', active: true },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' }
  ]}
  actions={<Button>Sign In</Button>}
/>`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Basic Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Header</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Header
              logo={{ text: 'MyApp' }}
              items={navItems}
              actions={<Button size="sm">Sign In</Button>}
            />
          </div>
        </div>
      </section>

      {/* With Logo Image */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Logo Image</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Header
              logo={{
                image: 'https://via.placeholder.com/150x40/4F46E5/FFFFFF?text=Logo',
                text: 'Company',
                href: '/',
              }}
              items={navItems}
            />
          </div>
        </div>
      </section>

      {/* With Icons in Navigation */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Navigation Icons</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Header
              logo={{ text: 'MyApp' }}
              items={navItemsWithIcons}
              actions={
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Sizes</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Small (h-14)</h3>
              <Header
                logo={{ text: 'MyApp' }}
                items={navItems}
                size="sm"
              />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Medium (h-16, Default)</h3>
              <Header
                logo={{ text: 'MyApp' }}
                items={navItems}
                size="md"
              />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Large (h-20)</h3>
              <Header
                logo={{ text: 'MyApp' }}
                items={navItems}
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Header */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Sticky Header</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="mb-4 text-sm text-muted-foreground">
              Sticky header stays at top when scrolling. Position is set to sticky with top-0 and z-50.
            </p>
            <Header
              logo={{ text: 'MyApp' }}
              items={navItems}
              sticky
              actions={<Button size="sm">Get Started</Button>}
            />
            <div className="mt-4 h-32 rounded border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              Scroll content area (in actual usage, header would stick to viewport top)
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Header */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Transparent Header</h2>
          <div className="relative overflow-hidden rounded-lg border border-border">
            <div
              className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 p-6"
              style={{ backgroundImage: 'url(https://via.placeholder.com/1200x400/667EEA/FFFFFF?text=Hero+Background)' }}
            >
              <Header
                logo={{ text: 'MyApp' }}
                items={navItems}
                transparent
                actions={<Button size="sm" variant="secondary">Sign In</Button>}
              />
              <div className="mt-8 text-center">
                <h2 className="text-3xl font-bold text-white">Hero Section</h2>
                <p className="mt-2 text-white/90">Transparent header overlays the hero background</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* With Mobile Menu Button */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Mobile Menu Button</h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Mobile menu button appears on smaller screens (hidden on md+). Resize browser to see the button.
            </p>
            <Header
              logo={{ text: 'MyApp' }}
              items={navItems}
              actions={<Button size="sm">Sign In</Button>}
              onMobileMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
            {mobileMenuOpen && (
              <div className="mt-4 rounded border border-border bg-muted p-4">
                <p className="text-sm font-semibold">Mobile Menu (would be a drawer/sheet)</p>
                <div className="mt-2 space-y-1">
                  {navItems.map((item, idx) => (
                    <div key={idx} className="text-sm text-muted-foreground">
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Multiple Action Buttons</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Header
              logo={{ text: 'MyApp' }}
              items={navItems}
              actions={
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                  <Button size="sm">Sign Up</Button>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* Without Navigation */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Logo and Actions Only</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Header
              logo={{ text: 'MyApp' }}
              actions={
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button size="sm">Get Started</Button>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* Sticky + Transparent Combined */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Sticky + Transparent</h2>
          <div className="relative overflow-hidden rounded-lg border border-border">
            <div className="h-64 bg-gradient-to-br from-green-400 to-blue-500 p-6">
              <Header
                logo={{ text: 'MyApp' }}
                items={navItems}
                sticky
                transparent
                actions={<Button size="sm" variant="secondary">Contact</Button>}
              />
              <div className="mt-16 text-center">
                <h2 className="text-3xl font-bold text-white">Sticky Transparent Header</h2>
                <p className="mt-2 text-white/90">Combines both sticky and transparent styles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Props Table */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Props</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-left font-semibold">Prop</th>
                  <th className="p-2 text-left font-semibold">Type</th>
                  <th className="p-2 text-left font-semibold">Default</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">logo</td>
                  <td className="p-2 font-mono text-xs">HeaderLogo</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Logo configuration (text and/or image)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">items</td>
                  <td className="p-2 font-mono text-xs">HeaderItem[]</td>
                  <td className="p-2 font-mono text-xs">[]</td>
                  <td className="p-2">Navigation items</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">actions</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Action buttons or elements</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">sticky</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether header sticks to top on scroll</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">transparent</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether header has transparent background</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">size</td>
                  <td className="p-2 font-mono text-xs">'sm' | 'md' | 'lg'</td>
                  <td className="p-2 font-mono text-xs">'md'</td>
                  <td className="p-2">Height and spacing of header</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onMobileMenuClick</td>
                  <td className="p-2 font-mono text-xs">() =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Callback for mobile menu button (shows button if provided)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">className</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Additional CSS classes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* HeaderLogo Type */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">HeaderLogo Type</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-left font-semibold">Property</th>
                  <th className="p-2 text-left font-semibold">Type</th>
                  <th className="p-2 text-left font-semibold">Default</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">text</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Logo text</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">image</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Logo image URL</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">href</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 font-mono text-xs">'/'</td>
                  <td className="p-2">Logo link destination</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* HeaderItem Type */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">HeaderItem Type</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-left font-semibold">Property</th>
                  <th className="p-2 text-left font-semibold">Type</th>
                  <th className="p-2 text-left font-semibold">Required</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">label</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 font-mono text-xs">Yes</td>
                  <td className="p-2">Display text for navigation item</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">href</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 font-mono text-xs">Yes</td>
                  <td className="p-2">Link destination</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">active</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">No</td>
                  <td className="p-2">Whether this is the current page</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">icon</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 font-mono text-xs">No</td>
                  <td className="p-2">Optional icon to display before label</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Accessibility</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Semantic HTML: Uses header and nav elements</li>
            <li>Navigation role: Proper ARIA role on nav element</li>
            <li>Active page: Marked with aria-current="page"</li>
            <li>Keyboard accessible: Tab navigation through all links</li>
            <li>Focus indicators: Visible focus rings on all interactive elements</li>
            <li>Mobile menu: Accessible button with proper aria-label</li>
            <li>Logo alt text: Image logos include appropriate alt text</li>
            <li>Responsive: Navigation hidden on mobile with accessible menu button</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
