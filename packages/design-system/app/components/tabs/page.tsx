'use client';

import {
  Tabs,
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Link,
  Stack,
} from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { useState } from 'react';
import { Home, User, Settings, Bell } from 'lucide-react';

export default function TabsPage() {
  const [value, setValue] = useState('tab1');

  const basicItems = [
    { value: 'tab1', label: 'Tab 1', content: <div className="p-md text-sm">Content for Tab 1</div> },
    { value: 'tab2', label: 'Tab 2', content: <div className="p-md text-sm">Content for Tab 2</div> },
    { value: 'tab3', label: 'Tab 3', content: <div className="p-md text-sm">Content for Tab 3</div> },
  ];

  const tabsRootProps = [
    {
      name: 'value',
      type: 'string',
      description: 'Controlled value of active tab',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Default active tab (uncontrolled)',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: 'Callback when tab changes',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Tab list orientation',
    },
  ];

  const tabsListProps = [
    {
      name: 'variant',
      type: "'default' | 'pills' | 'underline'",
      default: "'default'",
      description: 'Visual style of tabs',
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      default: 'false',
      description: 'Whether tabs span full width',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Tab list orientation',
    },
  ];

  const tabsTriggerProps = [
    {
      name: 'value',
      type: 'string',
      required: true,
      description: 'Unique value for this tab',
    },
    {
      name: 'variant',
      type: "'default' | 'pills' | 'underline'",
      default: "'default'",
      description: 'Visual style of trigger',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of trigger',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether tab is disabled',
    },
  ];

  const tabsConvenienceProps = [
    {
      name: 'items',
      type: 'TabItem[]',
      required: true,
      description: 'Array of tab items',
    },
    {
      name: 'variant',
      type: "'default' | 'pills' | 'underline'",
      default: "'default'",
      description: 'Visual style of tabs',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of tabs',
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      default: 'false',
      description: 'Whether tabs span full width',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Tab list orientation',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Tabs</h1>
      <p className="lead">
        An accessible tabbed interface for organizing content into separate views, with support for keyboard navigation and multiple visual styles.
      </p>

      <h2>Basic Example</h2>
      <ComponentPreview
        code={`<Tabs
  items={[
    { value: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
    { value: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
    { value: 'tab3', label: 'Tab 3', content: <div>Content 3</div> },
  ]}
  defaultValue="tab1"
/>`}
      >
        <Tabs items={basicItems} defaultValue="tab1" />
      </ComponentPreview>

      <h2>Variants</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">Default</h3>
          <ComponentPreview
            code={`<Tabs items={items} variant="default" defaultValue="tab1" />`}
          >
            <Tabs items={basicItems} variant="default" defaultValue="tab1" />
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Pills</h3>
          <ComponentPreview
            code={`<Tabs items={items} variant="pills" defaultValue="tab1" />`}
          >
            <Tabs items={basicItems} variant="pills" defaultValue="tab1" />
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Underline</h3>
          <ComponentPreview
            code={`<Tabs items={items} variant="underline" defaultValue="tab1" />`}
          >
            <Tabs items={basicItems} variant="underline" defaultValue="tab1" />
          </ComponentPreview>
        </div>
      </div>

      <h2>Sizes</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">Small</h3>
          <ComponentPreview
            code={`<Tabs items={items} size="sm" defaultValue="tab1" />`}
          >
            <Tabs items={basicItems} size="sm" defaultValue="tab1" />
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Medium (Default)</h3>
          <ComponentPreview
            code={`<Tabs items={items} size="md" defaultValue="tab1" />`}
          >
            <Tabs items={basicItems} size="md" defaultValue="tab1" />
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Large</h3>
          <ComponentPreview
            code={`<Tabs items={items} size="lg" defaultValue="tab1" />`}
          >
            <Tabs items={basicItems} size="lg" defaultValue="tab1" />
          </ComponentPreview>
        </div>
      </div>

      <h2>With Icons</h2>
      <ComponentPreview
        code={`<TabsRoot defaultValue="home">
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
    <div className="p-md text-sm">Home content with quick overview and dashboard.</div>
  </TabsContent>
  <TabsContent value="profile">
    <div className="p-md text-sm">Profile information and settings.</div>
  </TabsContent>
  <TabsContent value="notifications">
    <div className="p-md text-sm">Recent notifications and alerts.</div>
  </TabsContent>
  <TabsContent value="settings">
    <div className="p-md text-sm">Application settings and preferences.</div>
  </TabsContent>
</TabsRoot>`}
      >
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
            <div className="p-md text-sm">Home content with quick overview and dashboard.</div>
          </TabsContent>
          <TabsContent value="profile">
            <div className="p-md text-sm">Profile information and settings.</div>
          </TabsContent>
          <TabsContent value="notifications">
            <div className="p-md text-sm">Recent notifications and alerts.</div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="p-md text-sm">Application settings and preferences.</div>
          </TabsContent>
        </TabsRoot>
      </ComponentPreview>

      <h2>Full Width</h2>
      <ComponentPreview
        code={`<Tabs items={items} fullWidth defaultValue="tab1" />`}
      >
        <Tabs items={basicItems} fullWidth defaultValue="tab1" />
      </ComponentPreview>

      <h2>Vertical Orientation</h2>
      <ComponentPreview
        code={`<TabsRoot defaultValue="tab1" orientation="vertical">
  <Stack direction="horizontal" spacing="md">
    <TabsList orientation="vertical">
      <TabsTrigger value="tab1">General</TabsTrigger>
      <TabsTrigger value="tab2">Security</TabsTrigger>
      <TabsTrigger value="tab3">Notifications</TabsTrigger>
      <TabsTrigger value="tab4">Advanced</TabsTrigger>
    </TabsList>
    <div className="flex-1 rounded-md border border-border p-md">
      <TabsContent value="tab1">
        <h3 className="mb-sm font-semibold">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure general application preferences and behavior.
        </p>
      </TabsContent>
      <TabsContent value="tab2">
        <h3 className="mb-sm font-semibold">Security Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage passwords, two-factor authentication, and security options.
        </p>
      </TabsContent>
      <TabsContent value="tab3">
        <h3 className="mb-sm font-semibold">Notification Settings</h3>
        <p className="text-sm text-muted-foreground">
          Control how and when you receive notifications.
        </p>
      </TabsContent>
      <TabsContent value="tab4">
        <h3 className="mb-sm font-semibold">Advanced Settings</h3>
        <p className="text-sm text-muted-foreground">
          Advanced configuration options for power users.
        </p>
      </TabsContent>
    </div>
  </Stack>
</TabsRoot>`}
      >
        <TabsRoot defaultValue="tab1" orientation="vertical">
          <Stack direction="horizontal" spacing="md">
            <TabsList orientation="vertical">
              <TabsTrigger value="tab1">General</TabsTrigger>
              <TabsTrigger value="tab2">Security</TabsTrigger>
              <TabsTrigger value="tab3">Notifications</TabsTrigger>
              <TabsTrigger value="tab4">Advanced</TabsTrigger>
            </TabsList>
            <div className="flex-1 rounded-md border border-border p-md">
              <TabsContent value="tab1">
                <h3 className="mb-sm font-semibold">General Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure general application preferences and behavior.
                </p>
              </TabsContent>
              <TabsContent value="tab2">
                <h3 className="mb-sm font-semibold">Security Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage passwords, two-factor authentication, and security options.
                </p>
              </TabsContent>
              <TabsContent value="tab3">
                <h3 className="mb-sm font-semibold">Notification Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Control how and when you receive notifications.
                </p>
              </TabsContent>
              <TabsContent value="tab4">
                <h3 className="mb-sm font-semibold">Advanced Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced configuration options for power users.
                </p>
              </TabsContent>
            </div>
          </Stack>
        </TabsRoot>
      </ComponentPreview>

      <h2>Controlled State</h2>
      <ComponentPreview
        code={`const [value, setValue] = useState('tab1');

<div className="space-y-md">
  <Stack direction="horizontal" spacing="sm" align="center" justify="space-between">
    <p className="text-sm text-muted-foreground">Current tab: {value}</p>
    <Stack direction="horizontal" spacing="sm">
      <Button size="sm" onClick={() => setValue('tab1')}>Go to Tab 1</Button>
      <Button size="sm" onClick={() => setValue('tab2')}>Go to Tab 2</Button>
      <Button size="sm" onClick={() => setValue('tab3')}>Go to Tab 3</Button>
    </Stack>
  </Stack>
  <Tabs items={items} value={value} onValueChange={setValue} />
</div>`}
      >
        <div className="space-y-md">
          <Stack direction="horizontal" spacing="sm" align="center" justify="space-between">
            <p className="text-sm text-muted-foreground">Current tab: {value}</p>
            <Stack direction="horizontal" spacing="sm">
              <Button size="sm" onClick={() => setValue('tab1')}>Go to Tab 1</Button>
              <Button size="sm" onClick={() => setValue('tab2')}>Go to Tab 2</Button>
              <Button size="sm" onClick={() => setValue('tab3')}>Go to Tab 3</Button>
            </Stack>
          </Stack>
          <Tabs items={basicItems} value={value} onValueChange={setValue} />
        </div>
      </ComponentPreview>

      <h2>Disabled Tab</h2>
      <ComponentPreview
        code={`<Tabs
  items={[
    { value: 'tab1', label: 'Enabled', content: <div>This tab is enabled</div> },
    { value: 'tab2', label: 'Disabled', content: <div>This content cannot be accessed</div>, disabled: true },
    { value: 'tab3', label: 'Enabled', content: <div>This tab is also enabled</div> },
  ]}
  defaultValue="tab1"
/>`}
      >
        <Tabs
          items={[
            { value: 'tab1', label: 'Enabled', content: <div className="p-md text-sm">This tab is enabled</div> },
            { value: 'tab2', label: 'Disabled', content: <div className="p-md text-sm">This content cannot be accessed</div>, disabled: true },
            { value: 'tab3', label: 'Enabled', content: <div className="p-md text-sm">This tab is also enabled</div> },
          ]}
          defaultValue="tab1"
        />
      </ComponentPreview>

      <h2>Props - TabsRoot</h2>
      <PropsTable props={tabsRootProps} />

      <h2>Props - TabsList</h2>
      <PropsTable props={tabsListProps} />

      <h2>Props - TabsTrigger</h2>
      <PropsTable props={tabsTriggerProps} />

      <h2>Props - Tabs (Convenience Wrapper)</h2>
      <PropsTable props={tabsConvenienceProps} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To organize related content into separate views without leaving the page</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When users need to switch between different categories of information frequently</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For settings pages with multiple configuration sections</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To reduce page scrolling by dividing content into logical groups</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use clear, concise labels that describe the content of each tab</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep the number of tabs reasonable (3-7 tabs is ideal)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Consider using vertical orientation for sidebar navigation with many tabs</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use icons with text to improve scannability for horizontal tabs</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Disable tabs that are temporarily unavailable rather than hiding them</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use the underline variant for minimal, content-focused interfaces</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Full keyboard navigation with Arrow keys (Left/Right for horizontal, Up/Down for vertical)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Home/End keys jump to first/last tab</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Proper ARIA roles: tablist, tab, tabpanel</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA attributes: aria-selected, aria-controls, aria-labelledby</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Roving tabindex ensures only active tab is in tab order</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Disabled tabs are skipped during keyboard navigation</span>
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
              <span>Use tabs for related content that users need to switch between frequently</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Keep tab labels short and descriptive (1-2 words ideal)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show disabled tabs with tooltips explaining why they're unavailable</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use consistent tab order that matches user mental models</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Preserve tab content state when switching between tabs</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Tabs
  items={[
    { value: 'overview', label: 'Overview', content: <div>Project overview</div> },
    { value: 'tasks', label: 'Tasks', content: <div>Task list</div> },
    { value: 'files', label: 'Files', content: <div>File browser</div> },
  ]}
  defaultValue="overview"
/>`}
            >
              <Tabs
                items={[
                  { value: 'overview', label: 'Overview', content: <div className="p-md text-sm">Project overview</div> },
                  { value: 'tasks', label: 'Tasks', content: <div className="p-md text-sm">Task list</div> },
                  { value: 'files', label: 'Files', content: <div className="p-md text-sm">File browser</div> },
                ]}
                defaultValue="overview"
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
              <span>Don't use tabs for sequential processes (use a wizard/stepper instead)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use more than 7 horizontal tabs (consider vertical or navigation menu)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't nest tabs within tabs (creates confusing navigation)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use tabs for unrelated content or actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't clear form data when users switch tabs (preserve state)</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Tabs
  items={[
    { value: 'step1', label: 'Step 1: Personal Info', content: <div>Form step 1</div> },
    { value: 'step2', label: 'Step 2: Address', content: <div>Form step 2</div> },
    { value: 'step3', label: 'Step 3: Payment', content: <div>Form step 3</div> },
  ]}
  defaultValue="step1"
/>`}
            >
              <Tabs
                items={[
                  { value: 'step1', label: 'Step 1: Personal Info', content: <div className="p-md text-sm">Form step 1</div> },
                  { value: 'step2', label: 'Step 2: Address', content: <div className="p-md text-sm">Form step 2</div> },
                  { value: 'step3', label: 'Step 3: Payment', content: <div className="p-md text-sm">Form step 3</div> },
                ]}
                defaultValue="step1"
              />
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/accordion"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Accordion</h3>
          <p className="text-sm text-muted-foreground">For vertically stacked collapsible sections</p>
        </Link>
        <Link
          href="/components/card"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Card</h3>
          <p className="text-sm text-muted-foreground">Container for grouped content</p>
        </Link>
        <Link
          href="/components/navigation-menu"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Navigation Menu</h3>
          <p className="text-sm text-muted-foreground">For site-wide navigation</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/tabs/tabs.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/"
              external
              showIcon
            >
              ARIA: Tabs Pattern
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
