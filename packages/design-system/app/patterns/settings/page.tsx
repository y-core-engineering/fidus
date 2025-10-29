'use client';

import { TextInput, ToggleSwitch, Select, Button, Badge, Modal, Alert } from '@fidus/ui';
import { useState } from 'react';

// Mock settings data
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

const mockPrivacyReport = {
  dataCollected: ['Appointments', 'Transactions', 'Preferences', 'Usage Analytics'],
  storageLocation: 'Local device + encrypted cloud backup (EU region)',
  thirdPartySharing: 'None',
  exportOptions: ['JSON', 'CSV', 'PDF'],
  lastExport: '2024-01-15',
};

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState('account');
  const [settings, setSettings] = useState(mockSettings);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrivacyReport, setShowPrivacyReport] = useState(false);

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
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Settings Organization</h1>
        <p className="text-lg text-muted-foreground">
          Organizing settings into 9 clear categories with special emphasis on privacy transparency.
        </p>
      </div>

      {/* 9 Settings Categories */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">9 Settings Categories</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map(category => (
              <div
                key={category.id}
                className="rounded-lg border border-border bg-card p-4 hover:bg-muted cursor-pointer"
                onClick={() => setActiveCategory(category.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="font-semibold">{category.label}</h3>
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
      </section>

      {/* Settings Layout Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Settings Layout</h2>
          <p className="mb-4 text-muted-foreground">
            Settings use a sidebar navigation pattern on desktop and a stacked list on mobile.
          </p>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex h-[600px]">
              {/* Sidebar Navigation (Desktop) */}
              <div className="w-64 border-r border-border bg-muted/30">
                <div className="p-4">
                  <h3 className="mb-3 font-semibold text-sm text-muted-foreground">SETTINGS</h3>
                  <nav className="space-y-1">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm ${
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
              <div className="flex-1 overflow-y-auto p-6">
                {activeCategory === 'account' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="mb-1 text-2xl font-bold">Account</h2>
                      <p className="text-sm text-muted-foreground">
                        Manage your account details and security settings.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <TextInput
                        label="Email Address"
                        type="email"
                        value={settings.account.email}
                        onChange={(e) => updateSetting('account', 'email', e.target.value)}
                      />

                      <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                        <div>
                          <p className="font-semibold">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">
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

                      <div className="border-t border-border pt-4">
                        <h3 className="mb-2 font-semibold text-error">Danger Zone</h3>
                        <Button
                          variant="danger"
                          onClick={() => setShowDeleteModal(true)}
                        >
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === 'privacy' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="mb-1 text-2xl font-bold">Privacy</h2>
                      <p className="text-sm text-muted-foreground">
                        Control how your data is used and shared.
                      </p>
                    </div>

                    <Alert variant="info">
                      <strong>Privacy First:</strong> Fidus is built with privacy as a core principle.
                      Your data stays on your device unless you explicitly choose to sync it.
                    </Alert>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                        <div>
                          <p className="font-semibold">Data Sharing</p>
                          <p className="text-sm text-muted-foreground">
                            Share anonymized data to improve Fidus
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={settings.privacy.dataSharing}
                          onChange={(checked) => updateSetting('privacy', 'dataSharing', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                        <div>
                          <p className="font-semibold">Analytics</p>
                          <p className="text-sm text-muted-foreground">
                            Help us understand how Fidus is used
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={settings.privacy.analytics}
                          onChange={(checked) => updateSetting('privacy', 'analytics', checked)}
                        />
                      </div>

                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => setShowPrivacyReport(true)}
                      >
                        View Privacy Report
                      </Button>
                    </div>
                  </div>
                )}

                {activeCategory === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="mb-1 text-2xl font-bold">Notifications</h2>
                      <p className="text-sm text-muted-foreground">
                        Choose how you want to be notified about important events.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                        <div>
                          <p className="font-semibold">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={settings.notifications.email}
                          onChange={(checked) => updateSetting('notifications', 'email', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                        <div>
                          <p className="font-semibold">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications on your device
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={settings.notifications.push}
                          onChange={(checked) => updateSetting('notifications', 'push', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                        <div>
                          <p className="font-semibold">In-App Notifications</p>
                          <p className="text-sm text-muted-foreground">
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
                  <div className="space-y-6">
                    <div>
                      <h2 className="mb-1 text-2xl font-bold">Appearance</h2>
                      <p className="text-sm text-muted-foreground">
                        Customize how Fidus looks and feels.
                      </p>
                    </div>

                    <div className="space-y-4">
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
                  <div className="space-y-6">
                    <div>
                      <h2 className="mb-1 text-2xl font-bold">Advanced</h2>
                      <p className="text-sm text-muted-foreground">
                        Developer tools and data export options.
                      </p>
                    </div>

                    <Alert variant="warning">
                      <strong>Warning:</strong> These settings are for advanced users only.
                      Changing these settings incorrectly may affect app functionality.
                    </Alert>

                    <div className="space-y-4">
                      <div className="rounded-lg border border-border bg-background p-4">
                        <h3 className="mb-2 font-semibold">Export Your Data</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          Download all your data in JSON, CSV, or PDF format.
                        </p>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm">Export as JSON</Button>
                          <Button variant="secondary" size="sm">Export as CSV</Button>
                          <Button variant="secondary" size="sm">Export as PDF</Button>
                        </div>
                      </div>

                      <div className="rounded-lg border border-border bg-background p-4">
                        <h3 className="mb-2 font-semibold">API Keys</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          Generate API keys for integrating with external services.
                        </p>
                        <Button variant="secondary">Manage API Keys</Button>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                        <div>
                          <p className="font-semibold">Developer Mode</p>
                          <p className="text-sm text-muted-foreground">
                            Enable developer tools and debugging features
                          </p>
                        </div>
                        <ToggleSwitch checked={false} onChange={() => {}} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Report Modal */}
      {showPrivacyReport && (
        <Modal
          isOpen={showPrivacyReport}
          onClose={() => setShowPrivacyReport(false)}
          title="Privacy Report"
          size="lg"
        >
          <div className="space-y-6">
            <Alert variant="success">
              Your data is secure and private. This report shows exactly what we collect and how it's used.
            </Alert>

            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-background p-4">
                <h3 className="mb-2 font-semibold">Data We Collect</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {mockPrivacyReport.dataCollected.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-background p-4">
                <h3 className="mb-2 font-semibold">Storage Location</h3>
                <p className="text-sm text-muted-foreground">
                  {mockPrivacyReport.storageLocation}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-background p-4">
                <h3 className="mb-2 font-semibold">Third-Party Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  {mockPrivacyReport.thirdPartySharing}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-background p-4">
                <h3 className="mb-2 font-semibold">Export Options</h3>
                <div className="flex gap-2">
                  {mockPrivacyReport.exportOptions.map((format, idx) => (
                    <Badge key={idx} variant="default">{format}</Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background p-4">
                <h3 className="mb-2 font-semibold">Last Data Export</h3>
                <p className="text-sm text-muted-foreground">
                  {mockPrivacyReport.lastExport}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowPrivacyReport(false)}>
                Close
              </Button>
              <Button variant="primary">
                Export Privacy Report
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Account"
          variant="danger"
        >
          <div className="space-y-4">
            <Alert variant="error">
              <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
            </Alert>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete your account? This will:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Permanently delete all your appointments</li>
              <li>Permanently delete all your transactions</li>
              <li>Remove all your preferences and settings</li>
              <li>Disconnect all integrations</li>
              <li>Delete your account immediately</li>
            </ul>

            <TextInput
              label='Type "DELETE" to confirm'
              placeholder="DELETE"
            />

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger">
                Delete My Account
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Setting Types */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Setting Types</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-left font-semibold">Type</th>
                  <th className="p-3 text-left font-semibold">Component</th>
                  <th className="p-3 text-left font-semibold">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Toggle</td>
                  <td className="p-3 font-mono text-xs">ToggleSwitch</td>
                  <td className="p-3 text-muted-foreground">Dark mode, notifications enabled</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Select</td>
                  <td className="p-3 font-mono text-xs">Select</td>
                  <td className="p-3 text-muted-foreground">Theme, language, time zone</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Input</td>
                  <td className="p-3 font-mono text-xs">TextInput</td>
                  <td className="p-3 text-muted-foreground">Email, API key</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Slider</td>
                  <td className="p-3 font-mono text-xs">Slider (future)</td>
                  <td className="p-3 text-muted-foreground">Font size, notification frequency</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Multi-select</td>
                  <td className="p-3 font-mono text-xs">Checkbox Group</td>
                  <td className="p-3 text-muted-foreground">Notification channels</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Settings Form Patterns */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Settings Form Patterns</h2>

          <div className="space-y-4">
            <div>
              <h3 className="mb-3 font-semibold">Autosave (Recommended)</h3>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs">
{`function SettingToggle({ label, checked, onChange }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = async (newValue: boolean) => {
    setIsSaving(true);

    try {
      await updateSetting(newValue);
      onChange(newValue);

      toast({
        title: 'Setting saved',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Failed to save setting',
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <label>{label}</label>
      <ToggleSwitch
        checked={checked}
        onChange={handleChange}
        disabled={isSaving}
      />
    </div>
  );
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Explicit Save (for Forms)</h3>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs">
{`function ProfileSettings() {
  const [formData, setFormData] = useState(initialData);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    await saveSettings(formData);
    setHasChanges(false);
    toast({ title: 'Settings saved', variant: 'success' });
  };

  const handleCancel = () => {
    setFormData(initialData);
    setHasChanges(false);
  };

  return (
    <form onSubmit={handleSave}>
      <TextInput
        label="Email"
        value={formData.email}
        onChange={(e) => {
          setFormData({ ...formData, email: e.target.value });
          setHasChanges(true);
        }}
      />

      {hasChanges && (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </div>
      )}
    </form>
  );
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Dangerous Actions (with Confirmation)</h3>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs">
{`function DeleteAccountButton() {
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast({
        title: 'Please type DELETE to confirm',
        variant: 'error',
      });
      return;
    }

    await deleteAccount();
    window.location.href = '/goodbye';
  };

  return (
    <>
      <Button variant="danger" onClick={() => setShowModal(true)}>
        Delete Account
      </Button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Alert variant="error">
          This action cannot be undone.
        </Alert>

        <TextInput
          label='Type "DELETE" to confirm'
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />

        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={confirmText !== 'DELETE'}
        >
          Delete My Account
        </Button>
      </Modal>
    </>
  );
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Best Practices</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 font-semibold text-success">✅ Do</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Group related settings into logical categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Provide a search bar for finding specific settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Show privacy impact for data-related settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Use autosave for simple toggles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Require confirmation for dangerous actions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Provide data export in multiple formats</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-error bg-error/5 p-6">
              <h3 className="mb-3 font-semibold text-error">❌ Don't</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Bury important settings in obscure menus</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Use technical jargon without explanations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Hide data collection practices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Allow account deletion without confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Make privacy settings hard to find</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Accessibility</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li><strong>Landmark Regions:</strong> Use nav for sidebar, main for content area</li>
            <li><strong>Focus Management:</strong> Focus moves to content when category changes</li>
            <li><strong>Clear Labels:</strong> All form controls have descriptive labels</li>
            <li><strong>Skip Links:</strong> Keyboard users can skip to content</li>
            <li><strong>Screen Reader Announcements:</strong> Settings changes announced with toast</li>
          </ul>
        </div>
      </section>

      {/* Mobile Considerations */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Mobile Considerations</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li><strong>Stacked Layout:</strong> Sidebar becomes full-width list on mobile</li>
            <li><strong>Back Navigation:</strong> Back button returns to category list</li>
            <li><strong>Sticky Header:</strong> Category title sticks to top while scrolling</li>
            <li><strong>Touch Targets:</strong> Minimum 44x44px for all interactive elements</li>
            <li><strong>Bottom Sheet:</strong> Dangerous actions (delete) open in bottom sheet</li>
          </ul>
        </div>
      </section>

      {/* Related Components */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Related Components</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">ToggleSwitch</Badge>
            <Badge variant="default">Select</Badge>
            <Badge variant="default">TextInput</Badge>
            <Badge variant="default">Button</Badge>
            <Badge variant="default">Modal</Badge>
            <Badge variant="default">Alert</Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
