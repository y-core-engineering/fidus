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
  Button,
  Link,
  Stack,
} from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { Menu, Settings, User, Bell, Filter } from 'lucide-react';
import { useState } from 'react';

export default function DrawerPage() {
  const [rightOpen, setRightOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
  const [bottomOpen, setBottomOpen] = useState(false);
  const [composableOpen, setComposableOpen] = useState(false);
  const [nonDismissibleOpen, setNonDismissibleOpen] = useState(false);

  const convenienceProps = [
    {
      name: 'side',
      type: "'left' | 'right' | 'bottom'",
      default: "'right'",
      description: 'Side from which drawer slides in',
    },
    {
      name: 'title',
      type: 'string',
      description: 'Drawer title (convenience API)',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Drawer description (convenience API)',
    },
    {
      name: 'dismissible',
      type: 'boolean',
      default: 'true',
      description: 'Whether drawer shows close button',
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'Controlled open state',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Open state change handler',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Drawer body content',
    },
    {
      name: 'footer',
      type: 'ReactNode',
      description: 'Drawer footer content (convenience API)',
    },
  ];

  const composableProps = [
    {
      name: 'DrawerRoot',
      type: 'Component',
      description: 'Root container component',
    },
    {
      name: 'DrawerTrigger',
      type: 'Component',
      description: 'Trigger element wrapper',
    },
    {
      name: 'DrawerContent',
      type: 'Component',
      description: 'Content container with slide animation',
    },
    {
      name: 'DrawerHeader',
      type: 'Component',
      description: 'Header section container',
    },
    {
      name: 'DrawerTitle',
      type: 'Component',
      description: 'Title text component',
    },
    {
      name: 'DrawerDescription',
      type: 'Component',
      description: 'Description text component',
    },
    {
      name: 'DrawerBody',
      type: 'Component',
      description: 'Scrollable body content container',
    },
    {
      name: 'DrawerFooter',
      type: 'Component',
      description: 'Footer section for actions',
    },
    {
      name: 'Drawer',
      type: 'Component',
      description: 'Convenience wrapper component',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Drawer</h1>
      <p className="lead">
        A panel that slides in from the edge of the screen, useful for displaying supplementary content, navigation menus, or forms without leaving the current page context.
      </p>

      {/* Basic Drawer */}
      <h2>Basic Drawer</h2>
      <ComponentPreview code={`<Button onClick={() => setOpen(true)}>Open Drawer</Button>
<Drawer
  open={open}
  onOpenChange={setOpen}
  title="Drawer Title"
  description="This is a basic drawer that slides in from the right side."
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={() => setOpen(false)}>Save</Button>
    </>
  }
>
  <div className="space-y-md">
    <p className="text-sm">
      Drawer content goes here. This can include forms, settings, navigation, or any other content you need to display.
    </p>
  </div>
</Drawer>`}>
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
          <div className="space-y-md">
            <p className="text-sm">
              Drawer content goes here. This can include forms, settings, navigation, or any other content you need to display.
            </p>
            <div className="rounded-lg border border-border p-md">
              <h4 className="mb-sm font-semibold">Example Section</h4>
              <p className="text-sm text-muted-foreground">
                You can organize content in sections within the drawer.
              </p>
            </div>
          </div>
        </Drawer>
      </ComponentPreview>

      {/* Drawer Sides */}
      <h2>Drawer Sides</h2>
      <ComponentPreview code={`<Stack direction="horizontal" spacing="sm" wrap>
  <Button onClick={() => setRightOpen(true)}>From Right</Button>
  <Button onClick={() => setLeftOpen(true)}>From Left</Button>
  <Button onClick={() => setBottomOpen(true)}>From Bottom</Button>
</Stack>`}>
        <Stack direction="horizontal" spacing="sm" wrap>
          <Button onClick={() => setRightOpen(true)}>From Right</Button>
          <Button onClick={() => setLeftOpen(true)}>From Left</Button>
          <Button onClick={() => setBottomOpen(true)}>From Bottom</Button>
        </Stack>
      </ComponentPreview>

      {/* Navigation Drawer */}
      <h2>Navigation Drawer</h2>
      <ComponentPreview code={`<DrawerRoot>
  <DrawerTrigger asChild>
    <Button variant="secondary">
      <Menu className="mr-sm h-4 w-4" />
      Menu
    </Button>
  </DrawerTrigger>
  <Drawer
    side="left"
    title="Navigation"
    description="Main navigation menu"
  >
    <nav className="space-y-sm">
      <Link
        href="#"
        className="flex items-center gap-sm rounded-lg px-sm py-xs text-sm hover:bg-gray-100 no-underline"
      >
        <User className="h-4 w-4" />
        Profile
      </Link>
      <Link
        href="#"
        className="flex items-center gap-sm rounded-lg px-sm py-xs text-sm hover:bg-gray-100 no-underline"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Link>
    </nav>
  </Drawer>
</DrawerRoot>`}>
        <DrawerRoot>
          <DrawerTrigger asChild>
            <Button variant="secondary">
              <Menu className="mr-sm h-4 w-4" />
              Menu
            </Button>
          </DrawerTrigger>
          <Drawer
            side="left"
            title="Navigation"
            description="Main navigation menu"
          >
            <nav className="space-y-sm">
              <Link
                href="#"
                className="flex items-center gap-sm rounded-lg px-sm py-xs text-sm hover:bg-gray-100 no-underline"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href="#"
                className="flex items-center gap-sm rounded-lg px-sm py-xs text-sm hover:bg-gray-100 no-underline"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Link
                href="#"
                className="flex items-center gap-sm rounded-lg px-sm py-xs text-sm hover:bg-gray-100 no-underline"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </Link>
            </nav>
          </Drawer>
        </DrawerRoot>
      </ComponentPreview>

      {/* Settings Drawer */}
      <h2>Settings Drawer</h2>
      <ComponentPreview code={`<DrawerRoot>
  <DrawerTrigger asChild>
    <Button>
      <Settings className="mr-sm h-4 w-4" />
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
    <div className="space-y-lg">
      <div className="space-y-sm">
        <label className="text-sm font-medium">Theme</label>
        <select className="w-full rounded-lg border border-border px-sm py-xs text-sm">
          <option>Light</option>
          <option>Dark</option>
          <option>System</option>
        </select>
      </div>
    </div>
  </Drawer>
</DrawerRoot>`}>
        <DrawerRoot>
          <DrawerTrigger asChild>
            <Button>
              <Settings className="mr-sm h-4 w-4" />
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
            <div className="space-y-lg">
              <div className="space-y-sm">
                <label className="text-sm font-medium">Theme</label>
                <select className="w-full rounded-lg border border-border px-sm py-xs text-sm">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>
              <div className="space-y-sm">
                <label className="text-sm font-medium">Language</label>
                <select className="w-full rounded-lg border border-border px-sm py-xs text-sm">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div className="space-y-sm">
                <label className="flex items-center gap-sm text-sm font-medium">
                  <input type="checkbox" />
                  Enable notifications
                </label>
              </div>
              <div className="space-y-sm">
                <label className="flex items-center gap-sm text-sm font-medium">
                  <input type="checkbox" defaultChecked />
                  Enable auto-save
                </label>
              </div>
            </div>
          </Drawer>
        </DrawerRoot>
      </ComponentPreview>

      {/* Filters Drawer */}
      <h2>Filters Drawer</h2>
      <ComponentPreview code={`<DrawerRoot>
  <DrawerTrigger asChild>
    <Button variant="secondary">
      <Filter className="mr-sm h-4 w-4" />
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
    <div className="grid gap-lg sm:grid-cols-2">
      <div className="space-y-sm">
        <label className="text-sm font-medium">Category</label>
        <select className="w-full rounded-lg border border-border px-sm py-xs text-sm">
          <option>All Categories</option>
          <option>Electronics</option>
        </select>
      </div>
    </div>
  </Drawer>
</DrawerRoot>`}>
        <DrawerRoot>
          <DrawerTrigger asChild>
            <Button variant="secondary">
              <Filter className="mr-sm h-4 w-4" />
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
            <div className="grid gap-lg sm:grid-cols-2">
              <div className="space-y-sm">
                <label className="text-sm font-medium">Category</label>
                <select className="w-full rounded-lg border border-border px-sm py-xs text-sm">
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Books</option>
                </select>
              </div>
              <div className="space-y-sm">
                <label className="text-sm font-medium">Price Range</label>
                <select className="w-full rounded-lg border border-border px-sm py-xs text-sm">
                  <option>Any Price</option>
                  <option>Under $25</option>
                  <option>$25 - $50</option>
                  <option>Over $50</option>
                </select>
              </div>
            </div>
          </Drawer>
        </DrawerRoot>
      </ComponentPreview>

      {/* Composable API */}
      <h2>Composable API</h2>
      <ComponentPreview code={`<Button onClick={() => setOpen(true)}>Open Composable Drawer</Button>
<DrawerRoot open={open} onOpenChange={setOpen}>
  <DrawerContent side="right">
    <DrawerHeader>
      <DrawerTitle>Composable Drawer</DrawerTitle>
      <DrawerDescription>
        Built using composable parts for maximum flexibility
      </DrawerDescription>
    </DrawerHeader>
    <DrawerBody>
      <div className="space-y-md">
        <p className="text-sm">
          This drawer is built using the composable API, giving you full control over the structure and layout.
        </p>
      </div>
    </DrawerBody>
    <DrawerFooter>
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Close
      </Button>
      <Button onClick={() => setOpen(false)}>Confirm</Button>
    </DrawerFooter>
  </DrawerContent>
</DrawerRoot>`}>
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
              <div className="space-y-md">
                <p className="text-sm">
                  This drawer is built using the composable API, giving you full control over the structure and layout.
                </p>
                <div className="space-y-sm">
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
      </ComponentPreview>

      {/* Non-dismissible */}
      <h2>Non-dismissible Drawer</h2>
      <ComponentPreview code={`<Button onClick={() => setOpen(true)}>
  Open Non-dismissible Drawer
</Button>
<DrawerRoot open={open} onOpenChange={setOpen}>
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
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={() => setOpen(false)}>Complete Action</Button>
    </DrawerFooter>
  </DrawerContent>
</DrawerRoot>`}>
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
      </ComponentPreview>

      {/* Props Table */}
      <h2>Props (Convenience API)</h2>
      <PropsTable props={convenienceProps} />

      <h2>Composable Parts</h2>
      <PropsTable props={composableProps} />

      {/* Usage Guidelines */}
      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use for navigation menus that don't need to be always visible</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Display settings or configuration panels without leaving the current page</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show forms or multi-step workflows in a focused context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide filters or advanced search options on mobile devices</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Display supplementary content that doesn't warrant a separate page</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep drawer content focused and relevant to the current task</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use right-side drawers for most scenarios (follows natural reading flow)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use left-side drawers for navigation menus (convention)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use bottom drawers on mobile for filters and actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Include clear actions in the footer (Cancel, Save, Apply, etc.)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide a title and description for context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Allow dismissal by clicking outside or pressing Escape (unless critical action required)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA role: dialog for screen reader announcement</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus trap: Focus is trapped within drawer when open</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible: Escape to close, Tab to navigate</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus management: Focus returns to trigger on close</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA attributes: aria-labelledby, aria-describedby for context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Portal rendering: Rendered at document body level for proper stacking</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Backdrop: Semi-transparent overlay blocks interaction with page content</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Do's and Don'ts */}
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
              <span>Provide clear actions in the footer (Save, Cancel, Apply)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use descriptive titles and descriptions for context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Allow users to dismiss by clicking outside (for non-critical content)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Keep content focused and relevant to the current task</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use appropriate side based on content type (left for nav, right for forms)</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-lg">
            <ComponentPreview code={`<Drawer
  title="Edit Profile"
  description="Update your profile information"
  footer={
    <>
      <Button variant="secondary">Cancel</Button>
      <Button>Save Changes</Button>
    </>
  }
>
  <Stack spacing="md">
    <div>
      <label>Name</label>
      <input type="text" />
    </div>
  </Stack>
</Drawer>`}>
              <div className="text-sm text-muted-foreground">
                Good: Clear title, description, and action buttons with focused content
              </div>
            </ComponentPreview>
          </div>
        </div>

        {/* Don'ts */}
        <div className="border-2 border-error rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don't
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Overload the drawer with too much content or complex layouts</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Nest drawers within drawers (use a wizard or multi-step form instead)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use for content that requires full page context (use a separate page)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Forget to provide a way to close the drawer (unless critical action)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use for critical alerts or confirmations (use Dialog instead)</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-lg">
            <ComponentPreview code={`<Drawer title="Everything">
  <div className="space-y-xl">
    <ComplexForm />
    <DataTable />
    <Charts />
    <Settings />
  </div>
</Drawer>`}>
              <div className="text-sm text-muted-foreground">
                Bad: Too much unrelated content crammed into a single drawer
              </div>
            </ComponentPreview>
          </div>
        </div>
      </div>

      {/* Related Components */}
      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/dialog"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Dialog
          </h3>
          <p className="text-sm text-muted-foreground">
            Modal dialog for alerts, confirmations, and focused interactions
          </p>
        </Link>
        <Link
          href="/components/popover"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Popover
          </h3>
          <p className="text-sm text-muted-foreground">
            Floating panel for contextual content and actions
          </p>
        </Link>
        <Link
          href="/components/sheet"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Sheet
          </h3>
          <p className="text-sm text-muted-foreground">
            Overlay panel for extended content and workflows
          </p>
        </Link>
      </div>

      {/* Resources */}
      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/drawer/drawer.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
              external
              showIcon
            >
              ARIA: Dialog (Modal) Pattern
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/for-developers">
              Installation guide
            </Link>
          </li>
        </ul>
      </div>

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
