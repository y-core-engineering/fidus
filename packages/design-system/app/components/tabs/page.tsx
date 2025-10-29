'use client';

import {
  Tabs,
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@fidus/ui';
import { Button } from '@fidus/ui';
import { useState } from 'react';
import { Home, User, Settings, Bell } from 'lucide-react';

export default function TabsPage() {
  const [value, setValue] = useState('tab1');

  const basicItems = [
    { value: 'tab1', label: 'Tab 1', content: <div className="p-4 text-sm">Content for Tab 1</div> },
    { value: 'tab2', label: 'Tab 2', content: <div className="p-4 text-sm">Content for Tab 2</div> },
    { value: 'tab3', label: 'Tab 3', content: <div className="p-4 text-sm">Content for Tab 3</div> },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Tabs</h1>
        <p className="text-lg text-muted-foreground">
          An accessible tabbed interface for organizing content into separate views, with support for keyboard navigation and multiple visual styles.
        </p>
      </div>

      {/* Import Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Import</h2>
          <div className="rounded-lg border border-border bg-muted p-4">
            <pre className="text-sm">
              <code>{`import { Tabs, TabsRoot, TabsList, TabsTrigger, TabsContent } from '@fidus/ui';

// Convenience wrapper with items array
<Tabs items={items} defaultValue="tab1" />

// Composable API for full control
<TabsRoot defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</TabsRoot>`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Basic Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Tabs</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Tabs items={basicItems} defaultValue="tab1" />
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Variants</h2>
          <div className="space-y-8 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Default</h3>
              <Tabs items={basicItems} variant="default" defaultValue="tab1" />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Pills</h3>
              <Tabs items={basicItems} variant="pills" defaultValue="tab1" />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Underline</h3>
              <Tabs items={basicItems} variant="underline" defaultValue="tab1" />
            </div>
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Sizes</h2>
          <div className="space-y-8 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Small</h3>
              <Tabs items={basicItems} size="sm" defaultValue="tab1" />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Medium (Default)</h3>
              <Tabs items={basicItems} size="md" defaultValue="tab1" />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Large</h3>
              <Tabs items={basicItems} size="lg" defaultValue="tab1" />
            </div>
          </div>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Icons</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TabsRoot defaultValue="home">
              <TabsList>
                <TabsTrigger value="home">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </TabsTrigger>
                <TabsTrigger value="profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
              <TabsContent value="home">
                <div className="p-4 text-sm">Home content with quick overview and dashboard.</div>
              </TabsContent>
              <TabsContent value="profile">
                <div className="p-4 text-sm">Profile information and settings.</div>
              </TabsContent>
              <TabsContent value="notifications">
                <div className="p-4 text-sm">Recent notifications and alerts.</div>
              </TabsContent>
              <TabsContent value="settings">
                <div className="p-4 text-sm">Application settings and preferences.</div>
              </TabsContent>
            </TabsRoot>
          </div>
        </div>
      </section>

      {/* Full Width */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Full Width</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Tabs items={basicItems} fullWidth defaultValue="tab1" />
          </div>
        </div>
      </section>

      {/* Vertical Orientation */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Vertical Orientation</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TabsRoot defaultValue="tab1" orientation="vertical">
              <div className="flex gap-4">
                <TabsList orientation="vertical">
                  <TabsTrigger value="tab1">General</TabsTrigger>
                  <TabsTrigger value="tab2">Security</TabsTrigger>
                  <TabsTrigger value="tab3">Notifications</TabsTrigger>
                  <TabsTrigger value="tab4">Advanced</TabsTrigger>
                </TabsList>
                <div className="flex-1 rounded border border-border p-4">
                  <TabsContent value="tab1">
                    <h3 className="mb-2 font-semibold">General Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure general application preferences and behavior.
                    </p>
                  </TabsContent>
                  <TabsContent value="tab2">
                    <h3 className="mb-2 font-semibold">Security Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage passwords, two-factor authentication, and security options.
                    </p>
                  </TabsContent>
                  <TabsContent value="tab3">
                    <h3 className="mb-2 font-semibold">Notification Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Control how and when you receive notifications.
                    </p>
                  </TabsContent>
                  <TabsContent value="tab4">
                    <h3 className="mb-2 font-semibold">Advanced Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced configuration options for power users.
                    </p>
                  </TabsContent>
                </div>
              </div>
            </TabsRoot>
          </div>
        </div>
      </section>

      {/* Controlled State */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Controlled State</h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Current tab: {value}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setValue('tab1')}>Go to Tab 1</Button>
                <Button size="sm" onClick={() => setValue('tab2')}>Go to Tab 2</Button>
                <Button size="sm" onClick={() => setValue('tab3')}>Go to Tab 3</Button>
              </div>
            </div>
            <Tabs items={basicItems} value={value} onValueChange={setValue} />
          </div>
        </div>
      </section>

      {/* Disabled Tab */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Disabled Tab</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Tabs
              items={[
                { value: 'tab1', label: 'Enabled', content: <div className="p-4 text-sm">This tab is enabled</div> },
                { value: 'tab2', label: 'Disabled', content: <div className="p-4 text-sm">This content cannot be accessed</div>, disabled: true },
                { value: 'tab3', label: 'Enabled', content: <div className="p-4 text-sm">This tab is also enabled</div> },
              ]}
              defaultValue="tab1"
            />
          </div>
        </div>
      </section>

      {/* Props Table - TabsRoot */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Props - TabsRoot</h2>
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
                  <td className="p-2 font-mono">value</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Controlled value of active tab</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">defaultValue</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Default active tab (uncontrolled)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onValueChange</td>
                  <td className="p-2 font-mono text-xs">(value: string) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Callback when tab changes</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">orientation</td>
                  <td className="p-2 font-mono text-xs">'horizontal' | 'vertical'</td>
                  <td className="p-2 font-mono text-xs">'horizontal'</td>
                  <td className="p-2">Tab list orientation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Props Table - TabsList */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Props - TabsList</h2>
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
                  <td className="p-2 font-mono text-xs">'default' | 'pills' | 'underline'</td>
                  <td className="p-2 font-mono text-xs">'default'</td>
                  <td className="p-2">Visual style of tabs</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">fullWidth</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether tabs span full width</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">orientation</td>
                  <td className="p-2 font-mono text-xs">'horizontal' | 'vertical'</td>
                  <td className="p-2 font-mono text-xs">'horizontal'</td>
                  <td className="p-2">Tab list orientation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Props Table - TabsTrigger */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Props - TabsTrigger</h2>
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
                  <td className="p-2 font-mono">value</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Unique value for this tab (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">variant</td>
                  <td className="p-2 font-mono text-xs">'default' | 'pills' | 'underline'</td>
                  <td className="p-2 font-mono text-xs">'default'</td>
                  <td className="p-2">Visual style of trigger</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">size</td>
                  <td className="p-2 font-mono text-xs">'sm' | 'md' | 'lg'</td>
                  <td className="p-2 font-mono text-xs">'md'</td>
                  <td className="p-2">Size of trigger</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">disabled</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether tab is disabled</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Props Table - Tabs (Convenience) */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Props - Tabs (Convenience Wrapper)</h2>
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
                  <td className="p-2 font-mono">items</td>
                  <td className="p-2 font-mono text-xs">TabItem[]</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Array of tab items (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">variant</td>
                  <td className="p-2 font-mono text-xs">'default' | 'pills' | 'underline'</td>
                  <td className="p-2 font-mono text-xs">'default'</td>
                  <td className="p-2">Visual style of tabs</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">size</td>
                  <td className="p-2 font-mono text-xs">'sm' | 'md' | 'lg'</td>
                  <td className="p-2 font-mono text-xs">'md'</td>
                  <td className="p-2">Size of tabs</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">fullWidth</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether tabs span full width</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">orientation</td>
                  <td className="p-2 font-mono text-xs">'horizontal' | 'vertical'</td>
                  <td className="p-2 font-mono text-xs">'horizontal'</td>
                  <td className="p-2">Tab list orientation</td>
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
            <li>ARIA role: tablist, tab, tabpanel</li>
            <li>Keyboard navigation: Arrow keys to navigate between tabs</li>
            <li>Keyboard activation: Enter or Space to activate tab</li>
            <li>Home/End keys: Jump to first/last tab</li>
            <li>Focus management: Automatic focus on active tab trigger</li>
            <li>ARIA attributes: aria-selected, aria-controls, aria-labelledby</li>
            <li>Roving tabindex: Only active tab is tabbable</li>
            <li>Disabled state: Skipped in keyboard navigation</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
