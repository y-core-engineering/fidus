'use client';

import { ToggleSwitch } from '@fidus/ui';
import { useState } from 'react';

export default function ToggleSwitchPage() {
  const [enabled, setEnabled] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Toggle Switch</h1>
        <p className="text-lg text-muted-foreground">
          A toggle switch component for binary on/off states, with support for multiple sizes and label positions.
        </p>
      </div>

      {/* Basic Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Toggle Switch</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <ToggleSwitch
              label="Enable feature"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </div>
        </div>
      </section>

      {/* Checked by Default */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Checked by Default</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <ToggleSwitch
              label="Email notifications"
              defaultChecked
            />
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Sizes</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <ToggleSwitch
              label="Small size"
              size="sm"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <ToggleSwitch
              label="Medium size (default)"
              size="md"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <ToggleSwitch
              label="Large size"
              size="lg"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          </div>
        </div>
      </section>

      {/* Label Position */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Label Position</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <ToggleSwitch
              label="Label on left"
              labelPosition="left"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <ToggleSwitch
              label="Label on right (default)"
              labelPosition="right"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
          </div>
        </div>
      </section>

      {/* With Helper Text */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Helper Text</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <ToggleSwitch
              label="Dark mode"
              helperText="Switch to dark theme for better nighttime viewing"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
          </div>
        </div>
      </section>

      {/* Error State */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Error State</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <ToggleSwitch
              label="Two-factor authentication"
              error="You must enable 2FA to continue"
            />
          </div>
        </div>
      </section>

      {/* Disabled */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Disabled</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <ToggleSwitch
              label="Disabled off"
              disabled
            />
            <ToggleSwitch
              label="Disabled on"
              disabled
              checked
            />
          </div>
        </div>
      </section>

      {/* Combined Examples */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Combined Examples</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <ToggleSwitch
              label="Auto-save"
              size="sm"
              labelPosition="left"
              helperText="Automatically save your work every 5 minutes"
            />
            <ToggleSwitch
              label="Push notifications"
              size="md"
              labelPosition="right"
              helperText="Receive notifications on your device"
              defaultChecked
            />
            <ToggleSwitch
              label="High contrast mode"
              size="lg"
              labelPosition="left"
              helperText="Increase contrast for better readability"
            />
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
                  <td className="p-2 font-mono">label</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Toggle switch label text (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">checked</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Controlled checked state</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">defaultChecked</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Uncontrolled default checked state</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">disabled</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether toggle is disabled</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">error</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Error message to display</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">helperText</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Helper text below toggle</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">size</td>
                  <td className="p-2 font-mono text-xs">'sm' | 'md' | 'lg'</td>
                  <td className="p-2 font-mono text-xs">'md'</td>
                  <td className="p-2">Size of the toggle switch</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">labelPosition</td>
                  <td className="p-2 font-mono text-xs">'left' | 'right'</td>
                  <td className="p-2 font-mono text-xs">'right'</td>
                  <td className="p-2">Position of label relative to toggle</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onChange</td>
                  <td className="p-2 font-mono text-xs">(e: ChangeEvent) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Change event handler</td>
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
            <li>Keyboard accessible (Tab for focus, Space or Enter to toggle)</li>
            <li>ARIA attributes: role="switch", aria-checked, aria-invalid, aria-describedby</li>
            <li>Error messages announced with aria-live</li>
            <li>Focus indicators visible (2px ring)</li>
            <li>Label properly associated with switch</li>
            <li>Disabled state indicated with aria-disabled</li>
            <li>State changes announced to screen readers</li>
            <li>Visual feedback for on/off states with color and position</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
