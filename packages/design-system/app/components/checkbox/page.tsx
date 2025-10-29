'use client';

import { Checkbox } from '@fidus/ui';
import { useState } from 'react';

export default function CheckboxPage() {
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);
  const [preferences, setPreferences] = useState({
    newsletter: false,
    notifications: true,
    updates: false,
    marketing: false,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Checkbox</h1>
        <p className="text-lg text-muted-foreground">
          A flexible checkbox component with support for indeterminate states, validation, and group selections.
        </p>
      </div>

      {/* Basic Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Checkbox</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Checkbox
              label="Accept terms and conditions"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
          </div>
        </div>
      </section>

      {/* Checked by Default */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Checked by Default</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Checkbox
              label="Remember me"
              defaultChecked
            />
          </div>
        </div>
      </section>

      {/* With Helper Text */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Helper Text</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Checkbox
              label="Enable two-factor authentication"
              helperText="Add an extra layer of security to your account"
            />
          </div>
        </div>
      </section>

      {/* Indeterminate State */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Indeterminate State</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Checkbox
              label="Select all items"
              checked={indeterminate}
              indeterminate={indeterminate}
              onChange={(e) => setIndeterminate(e.target.checked)}
              helperText="Some items are selected"
            />
          </div>
        </div>
      </section>

      {/* Error State */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Error State</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Checkbox
              label="I agree to the privacy policy"
              error="You must accept the privacy policy to continue"
            />
          </div>
        </div>
      </section>

      {/* Disabled */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Disabled</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <Checkbox
              label="Disabled unchecked"
              disabled
            />
            <Checkbox
              label="Disabled checked"
              disabled
              checked
            />
          </div>
        </div>
      </section>

      {/* Group of Checkboxes */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Group of Checkboxes</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Email Preferences</h3>
              <div className="space-y-3">
                <Checkbox
                  label="Newsletter"
                  checked={preferences.newsletter}
                  onChange={(e) => setPreferences({ ...preferences, newsletter: e.target.checked })}
                  helperText="Weekly updates about new features"
                />
                <Checkbox
                  label="Notifications"
                  checked={preferences.notifications}
                  onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
                  helperText="Get notified about important events"
                />
                <Checkbox
                  label="Product Updates"
                  checked={preferences.updates}
                  onChange={(e) => setPreferences({ ...preferences, updates: e.target.checked })}
                  helperText="Monthly product updates and announcements"
                />
                <Checkbox
                  label="Marketing"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  helperText="Promotional offers and discounts"
                />
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
                  <td className="p-2 font-mono">label</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Checkbox label text (required)</td>
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
                  <td className="p-2 font-mono">indeterminate</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether checkbox is in indeterminate state</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">disabled</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether checkbox is disabled</td>
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
                  <td className="p-2">Helper text below checkbox</td>
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
            <li>Keyboard accessible (Tab for focus, Space to toggle)</li>
            <li>ARIA attributes: aria-checked, aria-invalid, aria-describedby</li>
            <li>Indeterminate state uses aria-checked="mixed"</li>
            <li>Error messages announced with aria-live</li>
            <li>Focus indicators visible (2px ring)</li>
            <li>Label properly associated with checkbox</li>
            <li>Disabled state indicated with aria-disabled</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
