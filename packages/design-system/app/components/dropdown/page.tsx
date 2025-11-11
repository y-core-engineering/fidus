'use client';

import { Dropdown, DropdownRoot, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator, DropdownLabel, DropdownCheckboxItem, DropdownRadioGroup, DropdownRadioItem, DropdownSub, DropdownSubTrigger, DropdownSubContent } from '@fidus/ui/dropdown';
import { Button } from '@fidus/ui/button';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { User, Settings, LogOut, Bell, Mail, Save, Share, Download, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function DropdownPage() {
  const [notifications, setNotifications] = useState(true);
  const [emails, setEmails] = useState(false);
  const [messages, setMessages] = useState(true);
  const [sortBy, setSortBy] = useState('date');

  const dropdownProps = [
    {
      name: 'trigger',
      type: 'ReactNode',
      required: true,
      description: 'Trigger element (required)',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Dropdown menu content',
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
  ];

  const dropdownItemProps = [
    {
      name: 'variant',
      type: "'default' | 'destructive'",
      default: "'default'",
      description: 'Visual style variant',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Icon to display before text',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether item is disabled',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Item content',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Dropdown</h1>
      <p className="lead">
        A menu component that displays a list of actions or options triggered by a button, providing a clean way to organize related commands.
      </p>

      <h2>Basic Dropdown</h2>
      <ComponentPreview
        code={`<Dropdown trigger={<Button>Open Menu</Button>}>
  <DropdownItem>Profile</DropdownItem>
  <DropdownItem>Settings</DropdownItem>
  <DropdownSeparator />
  <DropdownItem>Log Out</DropdownItem>
</Dropdown>`}
      >
        <Dropdown trigger={<Button>Open Menu</Button>}>
          <DropdownItem>Profile</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownSeparator />
          <DropdownItem>Log Out</DropdownItem>
        </Dropdown>
      </ComponentPreview>

      <h2>With Icons</h2>
      <ComponentPreview
        code={`<DropdownRoot>
  <DropdownTrigger asChild>
    <Button>Account Menu</Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem icon={<User />}>Profile</DropdownItem>
    <DropdownItem icon={<Settings />}>Settings</DropdownItem>
    <DropdownSeparator />
    <DropdownItem icon={<LogOut />} variant="destructive">
      Log Out
    </DropdownItem>
  </DropdownContent>
</DropdownRoot>`}
      >
        <DropdownRoot>
          <DropdownTrigger asChild>
            <Button>Account Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem icon={<User />}>Profile</DropdownItem>
            <DropdownItem icon={<Settings />}>Settings</DropdownItem>
            <DropdownSeparator />
            <DropdownItem icon={<LogOut />} variant="destructive">
              Log Out
            </DropdownItem>
          </DropdownContent>
        </DropdownRoot>
      </ComponentPreview>

      <h2>With Labels and Grouping</h2>
      <ComponentPreview
        code={`<DropdownRoot>
  <DropdownTrigger asChild>
    <Button>Actions</Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownLabel>File Actions</DropdownLabel>
    <DropdownItem icon={<Save />}>Save</DropdownItem>
    <DropdownItem icon={<Download />}>Download</DropdownItem>
    <DropdownSeparator />
    <DropdownLabel>Share</DropdownLabel>
    <DropdownItem icon={<Share />}>Share Link</DropdownItem>
    <DropdownItem icon={<Mail />}>Email</DropdownItem>
  </DropdownContent>
</DropdownRoot>`}
      >
        <DropdownRoot>
          <DropdownTrigger asChild>
            <Button>Actions</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownLabel>File Actions</DropdownLabel>
            <DropdownItem icon={<Save />}>Save</DropdownItem>
            <DropdownItem icon={<Download />}>Download</DropdownItem>
            <DropdownSeparator />
            <DropdownLabel>Share</DropdownLabel>
            <DropdownItem icon={<Share />}>Share Link</DropdownItem>
            <DropdownItem icon={<Mail />}>Email</DropdownItem>
          </DropdownContent>
        </DropdownRoot>
      </ComponentPreview>

      <h2>Checkbox Items</h2>
      <ComponentPreview
        code={`<DropdownRoot>
  <DropdownTrigger asChild>
    <Button>
      <Bell className="mr-sm h-4 w-4" />
      Notifications
    </Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownLabel>Notification Preferences</DropdownLabel>
    <DropdownCheckboxItem
      checked={notifications}
      onCheckedChange={setNotifications}
    >
      Push Notifications
    </DropdownCheckboxItem>
    <DropdownCheckboxItem checked={emails} onCheckedChange={setEmails}>
      Email Notifications
    </DropdownCheckboxItem>
    <DropdownCheckboxItem checked={messages} onCheckedChange={setMessages}>
      Message Notifications
    </DropdownCheckboxItem>
  </DropdownContent>
</DropdownRoot>`}
      >
        <DropdownRoot>
          <DropdownTrigger asChild>
            <Button>
              <Bell className="mr-sm h-4 w-4" />
              Notifications
            </Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownLabel>Notification Preferences</DropdownLabel>
            <DropdownCheckboxItem
              checked={notifications}
              onCheckedChange={setNotifications}
            >
              Push Notifications
            </DropdownCheckboxItem>
            <DropdownCheckboxItem checked={emails} onCheckedChange={setEmails}>
              Email Notifications
            </DropdownCheckboxItem>
            <DropdownCheckboxItem checked={messages} onCheckedChange={setMessages}>
              Message Notifications
            </DropdownCheckboxItem>
          </DropdownContent>
        </DropdownRoot>
      </ComponentPreview>

      <h2>Radio Items</h2>
      <ComponentPreview
        code={`<DropdownRoot>
  <DropdownTrigger asChild>
    <Button>Sort By: {sortBy}</Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownLabel>Sort By</DropdownLabel>
    <DropdownRadioGroup value={sortBy} onValueChange={setSortBy}>
      <DropdownRadioItem value="date">Date</DropdownRadioItem>
      <DropdownRadioItem value="name">Name</DropdownRadioItem>
      <DropdownRadioItem value="size">Size</DropdownRadioItem>
    </DropdownRadioGroup>
  </DropdownContent>
</DropdownRoot>`}
      >
        <DropdownRoot>
          <DropdownTrigger asChild>
            <Button>Sort By: {sortBy === 'date' ? 'Date' : sortBy === 'name' ? 'Name' : 'Size'}</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownLabel>Sort By</DropdownLabel>
            <DropdownRadioGroup value={sortBy} onValueChange={setSortBy}>
              <DropdownRadioItem value="date">Date</DropdownRadioItem>
              <DropdownRadioItem value="name">Name</DropdownRadioItem>
              <DropdownRadioItem value="size">Size</DropdownRadioItem>
            </DropdownRadioGroup>
          </DropdownContent>
        </DropdownRoot>
      </ComponentPreview>

      <h2>Sub-menus</h2>
      <ComponentPreview
        code={`<DropdownRoot>
  <DropdownTrigger asChild>
    <Button>More Options</Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem icon={<Save />}>Save</DropdownItem>
    <DropdownSub>
      <DropdownSubTrigger>
        <Share className="mr-sm h-4 w-4" />
        Share
      </DropdownSubTrigger>
      <DropdownSubContent>
        <DropdownItem>Email</DropdownItem>
        <DropdownItem>Copy Link</DropdownItem>
        <DropdownItem>Social Media</DropdownItem>
      </DropdownSubContent>
    </DropdownSub>
    <DropdownSub>
      <DropdownSubTrigger>
        <Download className="mr-sm h-4 w-4" />
        Export
      </DropdownSubTrigger>
      <DropdownSubContent>
        <DropdownItem>Export as PDF</DropdownItem>
        <DropdownItem>Export as CSV</DropdownItem>
        <DropdownItem>Export as JSON</DropdownItem>
      </DropdownSubContent>
    </DropdownSub>
    <DropdownSeparator />
    <DropdownItem variant="destructive">Delete</DropdownItem>
  </DropdownContent>
</DropdownRoot>`}
      >
        <DropdownRoot>
          <DropdownTrigger asChild>
            <Button>More Options</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem icon={<Save />}>Save</DropdownItem>
            <DropdownSub>
              <DropdownSubTrigger>
                <Share className="mr-sm h-4 w-4" />
                Share
              </DropdownSubTrigger>
              <DropdownSubContent>
                <DropdownItem>Email</DropdownItem>
                <DropdownItem>Copy Link</DropdownItem>
                <DropdownItem>Social Media</DropdownItem>
              </DropdownSubContent>
            </DropdownSub>
            <DropdownSub>
              <DropdownSubTrigger>
                <Download className="mr-sm h-4 w-4" />
                Export
              </DropdownSubTrigger>
              <DropdownSubContent>
                <DropdownItem>Export as PDF</DropdownItem>
                <DropdownItem>Export as CSV</DropdownItem>
                <DropdownItem>Export as JSON</DropdownItem>
              </DropdownSubContent>
            </DropdownSub>
            <DropdownSeparator />
            <DropdownItem variant="destructive">Delete</DropdownItem>
          </DropdownContent>
        </DropdownRoot>
      </ComponentPreview>

      <h2>Disabled Items</h2>
      <ComponentPreview
        code={`<DropdownRoot>
  <DropdownTrigger asChild>
    <Button>Edit Menu</Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem>Cut</DropdownItem>
    <DropdownItem>Copy</DropdownItem>
    <DropdownItem disabled>Paste (Nothing to paste)</DropdownItem>
    <DropdownSeparator />
    <DropdownItem>Select All</DropdownItem>
  </DropdownContent>
</DropdownRoot>`}
      >
        <DropdownRoot>
          <DropdownTrigger asChild>
            <Button>Edit Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Cut</DropdownItem>
            <DropdownItem>Copy</DropdownItem>
            <DropdownItem disabled>Paste (Nothing to paste)</DropdownItem>
            <DropdownSeparator />
            <DropdownItem>Select All</DropdownItem>
          </DropdownContent>
        </DropdownRoot>
      </ComponentPreview>

      <h2>Props</h2>
      <h3 className="text-lg font-semibold mt-lg mb-md">Dropdown (Convenience API)</h3>
      <PropsTable props={dropdownProps} />

      <h3 className="text-lg font-semibold mt-lg mb-md">DropdownItem</h3>
      <PropsTable props={dropdownItemProps} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Display a list of related actions or options that don't need to be immediately visible</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Group related commands that share a common theme (e.g., file operations, account settings)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Conserve screen space by hiding less frequently used actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide context-specific actions for a particular element or section</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep menu items concise and clearly labeled</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use icons to enhance recognition and scannability</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Group related items with labels and separators</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Place destructive actions at the bottom with visual distinction</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Limit menu depth to 2 levels to avoid complexity</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Disable rather than hide unavailable options to maintain consistency</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Implements ARIA menu pattern with proper roles (menu, menuitem)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard navigation with arrow keys, Enter/Space to select</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus management with trapped focus within open menu</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Escape key closes the menu and returns focus to trigger</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Disabled items properly marked with aria-disabled</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Sub-menus navigate with right/left arrow keys</span>
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
              <span>Use clear, action-oriented labels</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Group related items with separators</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Place destructive actions at the bottom</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use icons to enhance scannability</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<DropdownRoot>
  <DropdownTrigger asChild>
    <Button>Actions</Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem icon={<Save />}>Save</DropdownItem>
    <DropdownItem icon={<Download />}>Download</DropdownItem>
    <DropdownSeparator />
    <DropdownItem icon={<LogOut />} variant="destructive">
      Delete
    </DropdownItem>
  </DropdownContent>
</DropdownRoot>`}
            >
              <DropdownRoot>
                <DropdownTrigger asChild>
                  <Button>Actions</Button>
                </DropdownTrigger>
                <DropdownContent>
                  <DropdownItem icon={<Save />}>Save</DropdownItem>
                  <DropdownItem icon={<Download />}>Download</DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem icon={<LogOut />} variant="destructive">
                    Delete
                  </DropdownItem>
                </DropdownContent>
              </DropdownRoot>
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
              <span>Use vague labels like "Options" or "More"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Mix destructive actions with regular items</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Create deeply nested sub-menus (3+ levels)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Include too many items without grouping</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<DropdownRoot>
  <DropdownTrigger asChild>
    <Button>Options</Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem variant="destructive">Delete</DropdownItem>
    <DropdownItem>Save</DropdownItem>
    <DropdownItem>Download</DropdownItem>
    <DropdownItem>Option 1</DropdownItem>
    <DropdownItem>Option 2</DropdownItem>
  </DropdownContent>
</DropdownRoot>`}
            >
              <DropdownRoot>
                <DropdownTrigger asChild>
                  <Button>Options</Button>
                </DropdownTrigger>
                <DropdownContent>
                  <DropdownItem variant="destructive">Delete</DropdownItem>
                  <DropdownItem>Save</DropdownItem>
                  <DropdownItem>Download</DropdownItem>
                  <DropdownItem>Option 1</DropdownItem>
                  <DropdownItem>Option 2</DropdownItem>
                </DropdownContent>
              </DropdownRoot>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">
            Trigger element for dropdown menus
          </p>
        </Link>
        <Link
          href="/components/menu"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Menu
          </h3>
          <p className="text-sm text-muted-foreground">
            Alternative menu component for navigation
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
            Display content in an overlay
          </p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/dropdown/dropdown.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/menu/"
              external
              showIcon
            >
              ARIA: Menu Pattern
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
