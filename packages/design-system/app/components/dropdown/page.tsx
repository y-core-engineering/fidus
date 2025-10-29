'use client';

import {
  Dropdown,
  DropdownRoot,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  DropdownCheckboxItem,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
} from '@fidus/ui';
import { Button } from '@fidus/ui';
import { User, Settings, LogOut, Bell, Mail, Save, Share, Download, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function DropdownPage() {
  const [notifications, setNotifications] = useState(true);
  const [emails, setEmails] = useState(false);
  const [messages, setMessages] = useState(true);
  const [sortBy, setSortBy] = useState('date');

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Dropdown</h1>
        <p className="text-lg text-muted-foreground">
          A menu component that displays a list of actions or options triggered by a button, providing a clean way to organize related commands.
        </p>
      </div>

      {/* Basic Dropdown */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Dropdown</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Dropdown trigger={<Button>Open Menu</Button>}>
              <DropdownItem>Profile</DropdownItem>
              <DropdownItem>Settings</DropdownItem>
              <DropdownSeparator />
              <DropdownItem>Log Out</DropdownItem>
            </Dropdown>
          </div>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Icons</h2>
          <div className="rounded-lg border border-border bg-card p-6">
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
          </div>
        </div>
      </section>

      {/* With Labels and Grouping */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Labels and Grouping</h2>
          <div className="rounded-lg border border-border bg-card p-6">
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
          </div>
        </div>
      </section>

      {/* Checkbox Items */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Checkbox Items</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DropdownRoot>
              <DropdownTrigger asChild>
                <Button>
                  <Bell className="mr-2 h-4 w-4" />
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
          </div>
        </div>
      </section>

      {/* Radio Items */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Radio Items</h2>
          <div className="rounded-lg border border-border bg-card p-6">
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
          </div>
        </div>
      </section>

      {/* Sub-menus */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Sub-menus</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DropdownRoot>
              <DropdownTrigger asChild>
                <Button>More Options</Button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem icon={<Save />}>Save</DropdownItem>
                <DropdownSub>
                  <DropdownSubTrigger>
                    <Share className="mr-2 h-4 w-4" />
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
                    <Download className="mr-2 h-4 w-4" />
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
          </div>
        </div>
      </section>

      {/* Disabled Items */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Disabled Items</h2>
          <div className="rounded-lg border border-border bg-card p-6">
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
          </div>
        </div>
      </section>

      {/* Props Table - Dropdown */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Dropdown Props (Convenience API)</h2>
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
                  <td className="p-2 font-mono">trigger</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Trigger element (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">children</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Dropdown menu content</td>
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
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Props Table - DropdownItem */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">DropdownItem Props</h2>
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
                  <td className="p-2 font-mono">variant</td>
                  <td className="p-2 font-mono text-xs">'default' | 'destructive'</td>
                  <td className="p-2 font-mono text-xs">'default'</td>
                  <td className="p-2">Visual style variant</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">icon</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Icon to display before text</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">disabled</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether item is disabled</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">children</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Item content</td>
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
            <li>ARIA role: menu, menuitem</li>
            <li>Keyboard navigation: Arrow keys to navigate, Enter/Space to select</li>
            <li>Focus management: Focus trapped within open menu</li>
            <li>Escape to close: Pressing Escape closes the menu</li>
            <li>ARIA attributes: aria-expanded, aria-haspopup</li>
            <li>Disabled items: Properly marked and not keyboard accessible</li>
            <li>Sub-menus: Arrow keys to open/close, proper nesting</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
