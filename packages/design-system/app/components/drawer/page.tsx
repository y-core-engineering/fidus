'use client';

import {
  Drawer,
  DrawerRoot,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
} from '@fidus/ui';
import { Button } from '@fidus/ui';
import { Menu, Settings, User, Bell, Filter } from 'lucide-react';
import { useState } from 'react';

export default function DrawerPage() {
  const [rightOpen, setRightOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
  const [bottomOpen, setBottomOpen] = useState(false);
  const [composableOpen, setComposableOpen] = useState(false);
  const [nonDismissibleOpen, setNonDismissibleOpen] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Drawer</h1>
        <p className="text-lg text-muted-foreground">
          A panel that slides in from the edge of the screen, useful for displaying supplementary content, navigation menus, or forms without leaving the current page context.
        </p>
      </div>

      {/* Basic Drawer */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Drawer</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Button onClick={() => setRightOpen(true)}>Open Drawer</Button>
            <Drawer
              open={rightOpen}
              onOpenChange={setRightOpen}
              title="Drawer Title"
              description="This is a basic drawer that slides in from the right side."
              footer={
                <>
                  <Button variant="secondary" onClick={() => setRightOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setRightOpen(false)}>Save</Button>
                </>
              }
            >
              <div className="space-y-4">
                <p className="text-sm">
                  Drawer content goes here. This can include forms, settings, navigation, or any other content you need to display.
                </p>
                <div className="rounded border border-border p-4">
                  <h4 className="mb-2 font-semibold">Example Section</h4>
                  <p className="text-sm text-muted-foreground">
                    You can organize content in sections within the drawer.
                  </p>
                </div>
              </div>
            </Drawer>
          </div>
        </div>
      </section>

      {/* Sides */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Drawer Sides</h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setRightOpen(true)}>From Right</Button>
              <Button onClick={() => setLeftOpen(true)}>From Left</Button>
              <Button onClick={() => setBottomOpen(true)}>From Bottom</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Drawer */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Navigation Drawer</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DrawerRoot>
              <DrawerTrigger asChild>
                <Button variant="secondary">
                  <Menu className="mr-2 h-4 w-4" />
                  Menu
                </Button>
              </DrawerTrigger>
              <Drawer
                side="left"
                title="Navigation"
                description="Main navigation menu"
              >
                <nav className="space-y-2">
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    <Bell className="h-4 w-4" />
                    Notifications
                  </a>
                </nav>
              </Drawer>
            </DrawerRoot>
          </div>
        </div>
      </section>

      {/* Settings Drawer */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Settings Drawer</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DrawerRoot>
              <DrawerTrigger asChild>
                <Button>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </DrawerTrigger>
              <Drawer
                side="right"
                title="Settings"
                description="Customize your preferences"
                footer={
                  <>
                    <Button variant="secondary">Cancel</Button>
                    <Button>Save Changes</Button>
                  </>
                }
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <select className="w-full rounded border border-border px-3 py-2 text-sm">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <select className="w-full rounded border border-border px-3 py-2 text-sm">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input type="checkbox" />
                      Enable notifications
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input type="checkbox" defaultChecked />
                      Enable auto-save
                    </label>
                  </div>
                </div>
              </Drawer>
            </DrawerRoot>
          </div>
        </div>
      </section>

      {/* Filters Drawer */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Filters Drawer</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DrawerRoot>
              <DrawerTrigger asChild>
                <Button variant="secondary">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </DrawerTrigger>
              <Drawer
                side="bottom"
                title="Filter Results"
                description="Apply filters to refine your search"
                footer={
                  <>
                    <Button variant="secondary">Clear All</Button>
                    <Button>Apply Filters</Button>
                  </>
                }
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select className="w-full rounded border border-border px-3 py-2 text-sm">
                      <option>All Categories</option>
                      <option>Electronics</option>
                      <option>Clothing</option>
                      <option>Books</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price Range</label>
                    <select className="w-full rounded border border-border px-3 py-2 text-sm">
                      <option>Any Price</option>
                      <option>Under $25</option>
                      <option>$25 - $50</option>
                      <option>Over $50</option>
                    </select>
                  </div>
                </div>
              </Drawer>
            </DrawerRoot>
          </div>
        </div>
      </section>

      {/* Composable API */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Composable API</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Button onClick={() => setComposableOpen(true)}>Open Composable Drawer</Button>
            <DrawerRoot open={composableOpen} onOpenChange={setComposableOpen}>
              <DrawerContent side="right">
                <DrawerHeader>
                  <DrawerTitle>Composable Drawer</DrawerTitle>
                  <DrawerDescription>
                    Built using composable parts for maximum flexibility
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerBody>
                  <div className="space-y-4">
                    <p className="text-sm">
                      This drawer is built using the composable API, giving you full control over the structure and layout.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Custom Section</h4>
                      <p className="text-sm text-muted-foreground">
                        You can add any custom content and structure you need.
                      </p>
                    </div>
                  </div>
                </DrawerBody>
                <DrawerFooter>
                  <Button variant="secondary" onClick={() => setComposableOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => setComposableOpen(false)}>Confirm</Button>
                </DrawerFooter>
              </DrawerContent>
            </DrawerRoot>
          </div>
        </div>
      </section>

      {/* Non-dismissible */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Non-dismissible Drawer</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Button onClick={() => setNonDismissibleOpen(true)}>
              Open Non-dismissible Drawer
            </Button>
            <DrawerRoot open={nonDismissibleOpen} onOpenChange={setNonDismissibleOpen}>
              <DrawerContent side="right" dismissible={false}>
                <DrawerHeader>
                  <DrawerTitle>Important Action</DrawerTitle>
                  <DrawerDescription>
                    Please complete this action before continuing
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerBody>
                  <p className="text-sm">
                    This drawer requires an explicit action and cannot be dismissed by clicking outside or pressing Escape.
                  </p>
                </DrawerBody>
                <DrawerFooter>
                  <Button variant="secondary" onClick={() => setNonDismissibleOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setNonDismissibleOpen(false)}>Complete Action</Button>
                </DrawerFooter>
              </DrawerContent>
            </DrawerRoot>
          </div>
        </div>
      </section>

      {/* Props Table */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Props (Convenience API)</h2>
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
                  <td className="p-2 font-mono">side</td>
                  <td className="p-2 font-mono text-xs">'left' | 'right' | 'bottom'</td>
                  <td className="p-2 font-mono text-xs">'right'</td>
                  <td className="p-2">Side from which drawer slides in</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">title</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Drawer title (convenience API)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">description</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Drawer description (convenience API)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">dismissible</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Whether drawer shows close button</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">open</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Controlled open state</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onOpenChange</td>
                  <td className="p-2 font-mono text-xs">(open: boolean) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Open state change handler</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">children</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Drawer body content</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">footer</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Drawer footer content (convenience API)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Composable Parts */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Composable Parts</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-left font-semibold">Component</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">DrawerRoot</td>
                  <td className="p-2">Root container component</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">DrawerTrigger</td>
                  <td className="p-2">Trigger element wrapper</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">DrawerContent</td>
                  <td className="p-2">Content container with slide animation</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">DrawerHeader</td>
                  <td className="p-2">Header section container</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">DrawerTitle</td>
                  <td className="p-2">Title text component</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">DrawerDescription</td>
                  <td className="p-2">Description text component</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">DrawerBody</td>
                  <td className="p-2">Scrollable body content container</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">DrawerFooter</td>
                  <td className="p-2">Footer section for actions</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">Drawer</td>
                  <td className="p-2">Convenience wrapper component</td>
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
            <li>ARIA role: dialog</li>
            <li>Focus trap: Focus is trapped within drawer when open</li>
            <li>Keyboard accessible: Escape to close, Tab to navigate</li>
            <li>Focus management: Focus returns to trigger on close</li>
            <li>ARIA attributes: aria-labelledby, aria-describedby</li>
            <li>Portal rendering: Rendered at document body level</li>
            <li>Backdrop: Semi-transparent overlay blocks interaction with page</li>
          </ul>
        </div>
      </section>

      {/* Side drawers */}
      <Drawer
        open={leftOpen}
        onOpenChange={setLeftOpen}
        side="left"
        title="Left Drawer"
        description="This drawer slides in from the left side"
        footer={<Button onClick={() => setLeftOpen(false)}>Close</Button>}
      >
        <p className="text-sm">Content for the left drawer. Perfect for navigation menus.</p>
      </Drawer>

      <Drawer
        open={bottomOpen}
        onOpenChange={setBottomOpen}
        side="bottom"
        title="Bottom Drawer"
        description="This drawer slides in from the bottom"
        footer={<Button onClick={() => setBottomOpen(false)}>Close</Button>}
      >
        <p className="text-sm">
          Content for the bottom drawer. Great for mobile-friendly filters or actions.
        </p>
      </Drawer>
    </div>
  );
}
