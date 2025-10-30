'use client';

import { ToggleSwitch, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { useState } from 'react';

export default function ToggleSwitchPage() {
  const [enabled, setEnabled] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const props = [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Toggle switch label text',
    },
    {
      name: 'checked',
      type: 'boolean',
      description: 'Controlled checked state',
    },
    {
      name: 'defaultChecked',
      type: 'boolean',
      default: 'false',
      description: 'Uncontrolled default checked state',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether toggle is disabled',
    },
    {
      name: 'error',
      type: 'string',
      description: 'Error message to display',
    },
    {
      name: 'helperText',
      type: 'string',
      description: 'Helper text below toggle',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the toggle switch',
    },
    {
      name: 'labelPosition',
      type: "'left' | 'right'",
      default: "'right'",
      description: 'Position of label relative to toggle',
    },
    {
      name: 'onChange',
      type: '(e: ChangeEvent) => void',
      description: 'Change event handler',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Toggle Switch</h1>
      <p className="lead">
        A toggle switch component for binary on/off states, with support for multiple sizes and label positions.
      </p>

      <h2>Basic Example</h2>
      <ComponentPreview code={`<ToggleSwitch
  label="Enable feature"
  checked={enabled}
  onChange={(checked) => setEnabled(checked)}
/>`}>
        <ToggleSwitch
          label="Enable feature"
          checked={enabled}
          onChange={(checked) => setEnabled(checked)}
        />
      </ComponentPreview>

      <h2>Checked by Default</h2>
      <ComponentPreview code={`<ToggleSwitch
  label="Email notifications"
  defaultChecked
/>`}>
        <ToggleSwitch
          label="Email notifications"
          defaultChecked
        />
      </ComponentPreview>

      <h2>Sizes</h2>
      <ComponentPreview code={`<Stack direction="vertical" spacing="lg">
  <ToggleSwitch
    label="Small size"
    size="sm"
    checked={notifications}
    onChange={(checked) => setNotifications(checked)}
  />
  <ToggleSwitch
    label="Medium size (default)"
    size="md"
    checked={notifications}
    onChange={(checked) => setNotifications(checked)}
  />
  <ToggleSwitch
    label="Large size"
    size="lg"
    checked={notifications}
    onChange={(checked) => setNotifications(checked)}
  />
</Stack>`}>
        <Stack direction="vertical" spacing="lg">
          <ToggleSwitch
            label="Small size"
            size="sm"
            checked={notifications}
            onChange={(checked) => setNotifications(checked)}
          />
          <ToggleSwitch
            label="Medium size (default)"
            size="md"
            checked={notifications}
            onChange={(checked) => setNotifications(checked)}
          />
          <ToggleSwitch
            label="Large size"
            size="lg"
            checked={notifications}
            onChange={(checked) => setNotifications(checked)}
          />
        </Stack>
      </ComponentPreview>

      <h2>Label Position</h2>
      <ComponentPreview code={`<Stack direction="vertical" spacing="lg">
  <ToggleSwitch
    label="Label on left"
    labelPosition="left"
    checked={darkMode}
    onChange={(checked) => setDarkMode(checked)}
  />
  <ToggleSwitch
    label="Label on right (default)"
    labelPosition="right"
    checked={darkMode}
    onChange={(checked) => setDarkMode(checked)}
  />
</Stack>`}>
        <Stack direction="vertical" spacing="lg">
          <ToggleSwitch
            label="Label on left"
            labelPosition="left"
            checked={darkMode}
            onChange={(checked) => setDarkMode(checked)}
          />
          <ToggleSwitch
            label="Label on right (default)"
            labelPosition="right"
            checked={darkMode}
            onChange={(checked) => setDarkMode(checked)}
          />
        </Stack>
      </ComponentPreview>

      <h2>With Helper Text</h2>
      <ComponentPreview code={`<ToggleSwitch
  label="Dark mode"
  helperText="Switch to dark theme for better nighttime viewing"
  checked={darkMode}
  onChange={(checked) => setDarkMode(checked)}
/>`}>
        <ToggleSwitch
          label="Dark mode"
          helperText="Switch to dark theme for better nighttime viewing"
          checked={darkMode}
          onChange={(checked) => setDarkMode(checked)}
        />
      </ComponentPreview>

      <h2>Error State</h2>
      <ComponentPreview code={`<ToggleSwitch
  label="Two-factor authentication"
  error="You must enable 2FA to continue"
/>`}>
        <ToggleSwitch
          label="Two-factor authentication"
          error="You must enable 2FA to continue"
        />
      </ComponentPreview>

      <h2>Disabled</h2>
      <ComponentPreview code={`<Stack direction="vertical" spacing="lg">
  <ToggleSwitch
    label="Disabled off"
    disabled
  />
  <ToggleSwitch
    label="Disabled on"
    disabled
    checked
  />
</Stack>`}>
        <Stack direction="vertical" spacing="lg">
          <ToggleSwitch
            label="Disabled off"
            disabled
          />
          <ToggleSwitch
            label="Disabled on"
            disabled
            checked
          />
        </Stack>
      </ComponentPreview>

      <h2>Combined Examples</h2>
      <ComponentPreview code={`<Stack direction="vertical" spacing="lg">
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
</Stack>`}>
        <Stack direction="vertical" spacing="lg">
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
        </Stack>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For settings that take effect immediately (no save button needed)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For binary on/off or enabled/disabled states</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>In settings panels and preferences menus</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When the change is applied immediately and is reversible</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use clear labels that describe what the toggle controls</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide helper text to explain what happens when toggled</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use consistent label positioning throughout your interface</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show the current state visually with color and position</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use error states to indicate when a toggle is required but not enabled</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible with Tab for focus, Space or Enter to toggle</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Uses role="switch" and aria-checked for screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Error messages announced with aria-live and aria-invalid</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Visual focus indicators with 2px ring for keyboard navigation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Label properly associated with switch via aria-describedby</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Disabled state indicated with aria-disabled attribute</span>
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
              <span>Use for settings that take effect immediately</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide clear labels that describe the current state</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Add helper text to explain the effect of toggling</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use for reversible actions only</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview code={`<ToggleSwitch
  label="Email notifications"
  helperText="Receive updates about your account"
  defaultChecked
/>`}>
              <ToggleSwitch
                label="Email notifications"
                helperText="Receive updates about your account"
                defaultChecked
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
              <span>Don't use for actions that require confirmation (use Checkbox)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use for irreversible or destructive actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use vague labels like "Setting 1" or "Option A"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use when changes require a save action</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview code={`<ToggleSwitch
  label="Delete all data"
/>`}>
              <ToggleSwitch
                label="Delete all data"
              />
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/checkbox"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Checkbox</h3>
          <p className="text-sm text-muted-foreground">For selecting multiple options or confirming actions</p>
        </Link>
        <Link
          href="/components/radio"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Radio</h3>
          <p className="text-sm text-muted-foreground">For selecting one option from multiple choices</p>
        </Link>
        <Link
          href="/components/select"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Select</h3>
          <p className="text-sm text-muted-foreground">For choosing from a dropdown list of options</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/toggle-switch/toggle-switch.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/switch/"
              external
              showIcon
            >
              ARIA: Switch Pattern
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
