'use client';

import { TextInput, ToggleSwitch, Select, Button, Badge, Modal, Alert, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { useState } from 'react';

const mockSettings = {
  account: {
    email: 'user@example.com',
    twoFactorEnabled: true,
  },
  privacy: {
    dataSharing: false,
    analytics: false,
  },
  notifications: {
    email: true,
    push: true,
    inApp: true,
  },
  appearance: {
    theme: 'auto' as 'light' | 'dark' | 'auto',
    language: 'en' as string,
    density: 'comfortable' as 'compact' | 'comfortable' | 'spacious',
  },
};

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState('account');
  const [settings, setSettings] = useState(mockSettings);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const categories = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'integrations', label: 'Integrations', icon: '🔌' },
    { id: 'advanced', label: 'Advanced', icon: '⚙️' },
  ];

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Settings Pattern</h1>
      <p className="lead">
        Organizing settings into 9 clear categories with special emphasis on privacy transparency and user control.
      </p>

      <h2>9 Settings Categories</h2>
      <p className="text-sm text-muted-foreground">
        Fidus organizes all settings into logical categories that match user mental models.
      </p>

      <div className="not-prose my-lg">
        <div className="grid gap-md md:grid-cols-2 lg:grid-cols-3">
          {categories.map(category => (
            <div
              key={category.id}
              className="rounded-lg border border-border bg-card p-md hover:bg-muted cursor-pointer transition-colors"
              onClick={() => setActiveCategory(category.id)}
            >
              <div className="flex items-center gap-sm">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <h3 className="font-semibold text-base">{category.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {category.id === 'account' && 'Email, password, 2FA, delete account'}
                    {category.id === 'privacy' && 'Data sharing, tracking, privacy report'}
                    {category.id === 'notifications' && 'Email, push, in-app preferences'}
                    {category.id === 'calendar' && 'Default calendar, sync, time zone'}
                    {category.id === 'finance' && 'Default currency, budget alerts'}
                    {category.id === 'travel' && 'Home location, travel preferences'}
                    {category.id === 'appearance' && 'Theme, language, density'}
                    {category.id === 'integrations' && 'Connected apps, OAuth tokens'}
                    {category.id === 'advanced' && 'Export data, API keys, developer mode'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2>Interactive Settings Example</h2>
      <p className="text-sm text-muted-foreground">
        Settings use a sidebar navigation pattern on desktop. Click categories to explore different sections.
      </p>

      <div className="not-prose my-lg">
        <ComponentPreview code={`const [activeCategory, setActiveCategory] = useState('account');
const [settings, setSettings] = useState(mockSettings);

const categories = [
  { id: 'account', label: 'Account', icon: '👤' },
  { id: 'privacy', label: 'Privacy', icon: '🔒' },
  // ... more categories
];

<div className="flex h-[600px] rounded-lg border border-border bg-card overflow-hidden">
  {/* Sidebar */}
  <div className="w-64 border-r border-border bg-muted/30">
    <nav className="space-y-xs p-md">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={\`flex w-full items-center gap-sm rounded-md px-md py-sm text-left text-sm \${
            activeCategory === category.id
              ? 'bg-primary text-white'
              : 'hover:bg-muted'
          }\`}
        >
          <span>{category.icon}</span>
          <span>{category.label}</span>
        </button>
      ))}
    </nav>
  </div>

  {/* Content */}
  <div className="flex-1 overflow-y-auto p-lg">
    {/* Category content */}
  </div>
</div>`}>
          <div className="flex h-[600px] rounded-lg border border-border bg-card overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-64 border-r border-border bg-muted/30">
              <div className="p-md">
                <h3 className="mb-sm font-semibold text-sm text-muted-foreground">SETTINGS</h3>
                <nav className="space-y-xs">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex w-full items-center gap-sm rounded-md px-md py-sm text-left text-sm transition-colors ${
                        activeCategory === category.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-lg">
              {activeCategory === 'account' && (
                <div className="space-y-lg">
                  <div>
                    <h2 className="text-2xl font-bold mb-xs">Account</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your account details and security settings.
                    </p>
                  </div>

                  <div className="space-y-md">
                    <TextInput
                      label="Email Address"
                      type="email"
                      value={settings.account.email}
                      onChange={(e) => updateSetting('account', 'email', e.target.value)}
                    />

                    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-md">
                      <div>
                        <p className="font-semibold text-sm">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={settings.account.twoFactorEnabled}
                        onChange={(checked) => updateSetting('account', 'twoFactorEnabled', checked)}
                      />
                    </div>

                    <Button variant="secondary" fullWidth>
                      Change Password
                    </Button>

                    <div className="border-t border-border pt-md mt-md">
                      <h3 className="font-semibold text-error mb-sm">Danger Zone</h3>
                      <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === 'privacy' && (
                <div className="space-y-lg">
                  <div>
                    <h2 className="text-2xl font-bold mb-xs">Privacy</h2>
                    <p className="text-sm text-muted-foreground">
                      Control how your data is used and shared.
                    </p>
                  </div>

                  <Alert variant="info">
                    <strong>Privacy First:</strong> Fidus is built with privacy as a core principle.
                    Your data stays on your device unless you explicitly choose to sync it.
                  </Alert>

                  <div className="space-y-md">
                    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-md">
                      <div>
                        <p className="font-semibold text-sm">Data Sharing</p>
                        <p className="text-xs text-muted-foreground">
                          Share anonymized data to improve Fidus
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={settings.privacy.dataSharing}
                        onChange={(checked) => updateSetting('privacy', 'dataSharing', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-md">
                      <div>
                        <p className="font-semibold text-sm">Analytics</p>
                        <p className="text-xs text-muted-foreground">
                          Help us understand how Fidus is used
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={settings.privacy.analytics}
                        onChange={(checked) => updateSetting('privacy', 'analytics', checked)}
                      />
                    </div>

                    <Button variant="primary" fullWidth>
                      View Privacy Report
                    </Button>
                  </div>
                </div>
              )}

              {activeCategory === 'notifications' && (
                <div className="space-y-lg">
                  <div>
                    <h2 className="text-2xl font-bold mb-xs">Notifications</h2>
                    <p className="text-sm text-muted-foreground">
                      Choose how you want to be notified about important events.
                    </p>
                  </div>

                  <div className="space-y-md">
                    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-md">
                      <div>
                        <p className="font-semibold text-sm">Email Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={settings.notifications.email}
                        onChange={(checked) => updateSetting('notifications', 'email', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-md">
                      <div>
                        <p className="font-semibold text-sm">Push Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Receive push notifications on your device
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={settings.notifications.push}
                        onChange={(checked) => updateSetting('notifications', 'push', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-md">
                      <div>
                        <p className="font-semibold text-sm">In-App Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Show notifications within the app
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={settings.notifications.inApp}
                        onChange={(checked) => updateSetting('notifications', 'inApp', checked)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === 'appearance' && (
                <div className="space-y-lg">
                  <div>
                    <h2 className="text-2xl font-bold mb-xs">Appearance</h2>
                    <p className="text-sm text-muted-foreground">
                      Customize how Fidus looks and feels.
                    </p>
                  </div>

                  <div className="space-y-md">
                    <Select
                      label="Theme"
                      value={settings.appearance.theme}
                      options={[
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark' },
                        { value: 'auto', label: 'Auto (System)' },
                      ]}
                      onChange={(value) => updateSetting('appearance', 'theme', value)}
                    />

                    <Select
                      label="Language"
                      value={settings.appearance.language}
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'de', label: 'Deutsch' },
                        { value: 'es', label: 'Español' },
                        { value: 'fr', label: 'Français' },
                      ]}
                      onChange={(value) => updateSetting('appearance', 'language', value)}
                    />

                    <Select
                      label="Density"
                      value={settings.appearance.density}
                      options={[
                        { value: 'compact', label: 'Compact' },
                        { value: 'comfortable', label: 'Comfortable' },
                        { value: 'spacious', label: 'Spacious' },
                      ]}
                      onChange={(value) => updateSetting('appearance', 'density', value)}
                      helperText="Controls spacing and element sizes throughout the app"
                    />
                  </div>
                </div>
              )}

              {activeCategory === 'advanced' && (
                <div className="space-y-lg">
                  <div>
                    <h2 className="text-2xl font-bold mb-xs">Advanced</h2>
                    <p className="text-sm text-muted-foreground">
                      Developer tools and data export options.
                    </p>
                  </div>

                  <Alert variant="warning">
                    <strong>Warning:</strong> These settings are for advanced users only.
                  </Alert>

                  <div className="space-y-md">
                    <div className="rounded-lg border border-border bg-background p-md">
                      <h3 className="font-semibold mb-sm">Export Your Data</h3>
                      <p className="text-xs text-muted-foreground mb-md">
                        Download all your data in JSON, CSV, or PDF format.
                      </p>
                      <Stack direction="horizontal" spacing="sm">
                        <Button variant="secondary" size="small">Export as JSON</Button>
                        <Button variant="secondary" size="small">Export as CSV</Button>
                        <Button variant="secondary" size="small">Export as PDF</Button>
                      </Stack>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-md">
                      <h3 className="font-semibold mb-sm">API Keys</h3>
                      <p className="text-xs text-muted-foreground mb-md">
                        Generate API keys for integrating with external services.
                      </p>
                      <Button variant="secondary">Manage API Keys</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ComponentPreview>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <Modal
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          title="Delete Account"
        >
          <div className="space-y-md">
            <Alert variant="error">
              <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
            </Alert>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete your account? This will:
            </p>
            <ul className="list-inside list-disc space-y-xs text-sm text-muted-foreground">
              <li>Permanently delete all your appointments</li>
              <li>Permanently delete all your transactions</li>
              <li>Remove all your preferences and settings</li>
              <li>Disconnect all integrations</li>
              <li>Delete your account immediately</li>
            </ul>

            <TextInput
              label="Type &quot;DELETE&quot; to confirm"
              placeholder="DELETE"
            />

            <Stack direction="horizontal" spacing="sm" justify="end">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger">
                Delete My Account
              </Button>
            </Stack>
          </div>
        </Modal>
      )}

      <h2>Setting Types</h2>
      <p className="text-sm text-muted-foreground">
        Different types of settings use appropriate UI components.
      </p>

      <div className="not-prose my-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-md text-left font-semibold">Type</th>
              <th className="p-md text-left font-semibold">Component</th>
              <th className="p-md text-left font-semibold">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Toggle</td>
              <td className="p-md font-mono text-xs">ToggleSwitch</td>
              <td className="p-md text-muted-foreground">Dark mode, notifications enabled</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Select</td>
              <td className="p-md font-mono text-xs">Select</td>
              <td className="p-md text-muted-foreground">Theme, language, time zone</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Input</td>
              <td className="p-md font-mono text-xs">TextInput</td>
              <td className="p-md text-muted-foreground">Email, API key</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Multi-select</td>
              <td className="p-md font-mono text-xs">Checkbox Group</td>
              <td className="p-md text-muted-foreground">Notification channels</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Users need to configure application behavior</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Multiple settings categories exist (3+)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Privacy controls are important to users</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Account management features are needed</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Group related settings into logical categories</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide a search bar for finding specific settings</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show privacy impact for data-related settings</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use autosave for simple toggles</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Require confirmation for dangerous actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide data export in multiple formats</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use nav for sidebar, main for content area</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus moves to content when category changes</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>All form controls have descriptive labels</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide skip links for keyboard users</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Announce settings changes with toast messages</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do&apos;s and Don&apos;ts</h2>
      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <span className="text-2xl">✓</span> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Group related settings into logical categories</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show privacy impact for data-related settings</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use autosave for simple toggles</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Require confirmation for dangerous actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide data export in multiple formats</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Make privacy settings prominent and easy to find</span>
            </li>
          </ul>
        </div>

        <div className="border-2 border-error rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don&apos;t
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Bury important settings in obscure menus</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use technical jargon without explanations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Hide data collection practices</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Allow account deletion without confirmation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Make privacy settings hard to discover</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Force users through lengthy forms to change simple settings</span>
            </li>
          </ul>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/toggle-switch"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            ToggleSwitch
          </h3>
          <p className="text-sm text-muted-foreground">Boolean settings</p>
        </Link>

        <Link
          href="/components/select"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Select
          </h3>
          <p className="text-sm text-muted-foreground">Dropdown options</p>
        </Link>

        <Link
          href="/components/text-input"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            TextInput
          </h3>
          <p className="text-sm text-muted-foreground">Text settings</p>
        </Link>

        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">Actions</p>
        </Link>

        <Link
          href="/components/modal"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Modal
          </h3>
          <p className="text-sm text-muted-foreground">Confirmations</p>
        </Link>

        <Link
          href="/components/alert"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Alert
          </h3>
          <p className="text-sm text-muted-foreground">Warnings and info</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/settings-design/"
              external
              showIcon
            >
              Nielsen Norman Group: Settings Design
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/privacy-ux/"
              external
              showIcon
            >
              Nielsen Norman Group: Privacy UX
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/WCAG21/Understanding/error-prevention-legal-financial-data.html"
              external
              showIcon
            >
              WCAG 2.1: Error Prevention
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://gdpr.eu/right-to-be-forgotten/"
              external
              showIcon
            >
              GDPR: Right to Erasure
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/foundations/privacy-ux">
              Privacy UX Guidelines
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
