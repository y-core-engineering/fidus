'use client';

import { Checkbox } from '@fidus/ui/checkbox';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
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

  const props = [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Checkbox label text',
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
      name: 'indeterminate',
      type: 'boolean',
      default: 'false',
      description: 'Whether checkbox is in indeterminate state',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether checkbox is disabled',
    },
    {
      name: 'error',
      type: 'string',
      description: 'Error message to display',
    },
    {
      name: 'helperText',
      type: 'string',
      description: 'Helper text below checkbox',
    },
    {
      name: 'onChange',
      type: '(e: ChangeEvent<HTMLInputElement>) => void',
      description: 'Change event handler',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Checkbox</h1>
      <p className="lead">
        A flexible checkbox component with support for indeterminate states, validation, and group selections. Use checkboxes when users need to select multiple options from a list or toggle individual settings.
      </p>

      <h2>Basic Checkbox</h2>
      <ComponentPreview
        code={`<Checkbox
  label="Accept terms and conditions"
  checked={checked}
  onChange={(checked) => setChecked(checked)}
/>`}
      >
        <Checkbox
          label="Accept terms and conditions"
          checked={checked}
          onChange={(checked) => setChecked(checked)}
        />
      </ComponentPreview>

      <h2>Checked by Default</h2>
      <ComponentPreview
        code={`<Checkbox label="Remember me" defaultChecked />`}
      >
        <Checkbox label="Remember me" defaultChecked />
      </ComponentPreview>

      <h2>With Helper Text</h2>
      <ComponentPreview
        code={`<Checkbox
  label="Enable two-factor authentication"
  helperText="Add an extra layer of security to your account"
/>`}
      >
        <Checkbox
          label="Enable two-factor authentication"
          helperText="Add an extra layer of security to your account"
        />
      </ComponentPreview>

      <h2>Indeterminate State</h2>
      <ComponentPreview
        code={`<Checkbox
  label="Select all items"
  checked={indeterminate}
  indeterminate={indeterminate}
  onChange={(checked) => setIndeterminate(checked)}
  helperText="Some items are selected"
/>`}
      >
        <Checkbox
          label="Select all items"
          checked={indeterminate}
          indeterminate={indeterminate}
          onChange={(checked) => setIndeterminate(checked)}
          helperText="Some items are selected"
        />
      </ComponentPreview>

      <h2>Error State</h2>
      <ComponentPreview
        code={`<Checkbox
  label="I agree to the privacy policy"
  error="You must accept the privacy policy to continue"
/>`}
      >
        <Checkbox
          label="I agree to the privacy policy"
          error="You must accept the privacy policy to continue"
        />
      </ComponentPreview>

      <h2>Disabled States</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <Checkbox label="Disabled unchecked" disabled />
  <Checkbox label="Disabled checked" disabled checked />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <Checkbox label="Disabled unchecked" disabled />
          <Checkbox label="Disabled checked" disabled checked />
        </Stack>
      </ComponentPreview>

      <h2>Group of Checkboxes</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="md">
  <h3 className="text-sm font-semibold">Email Preferences</h3>
  <Stack direction="vertical" spacing="sm">
    <Checkbox
      label="Newsletter"
      checked={preferences.newsletter}
      onChange={(checked) => setPreferences({ ...preferences, newsletter: checked })}
      helperText="Weekly updates about new features"
    />
    <Checkbox
      label="Notifications"
      checked={preferences.notifications}
      onChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
      helperText="Get notified about important events"
    />
    <Checkbox
      label="Product Updates"
      checked={preferences.updates}
      onChange={(checked) => setPreferences({ ...preferences, updates: checked })}
      helperText="Monthly product updates and announcements"
    />
    <Checkbox
      label="Marketing"
      checked={preferences.marketing}
      onChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
      helperText="Promotional offers and discounts"
    />
  </Stack>
</Stack>`}
      >
        <Stack direction="vertical" spacing="md">
          <h3 className="text-sm font-semibold">Email Preferences</h3>
          <Stack direction="vertical" spacing="sm">
            <Checkbox
              label="Newsletter"
              checked={preferences.newsletter}
              onChange={(checked) => setPreferences({ ...preferences, newsletter: checked })}
              helperText="Weekly updates about new features"
            />
            <Checkbox
              label="Notifications"
              checked={preferences.notifications}
              onChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
              helperText="Get notified about important events"
            />
            <Checkbox
              label="Product Updates"
              checked={preferences.updates}
              onChange={(checked) => setPreferences({ ...preferences, updates: checked })}
              helperText="Monthly product updates and announcements"
            />
            <Checkbox
              label="Marketing"
              checked={preferences.marketing}
              onChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
              helperText="Promotional offers and discounts"
            />
          </Stack>
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
              <span>When users need to select multiple options from a list</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For binary choices that can be toggled on/off</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>In forms where users need to agree to terms or enable features</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For filtering or configuration settings</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use clear, descriptive labels that explain what will happen when checked</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Group related checkboxes together with proper spacing</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use helper text to provide additional context when needed</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use indeterminate state for "select all" scenarios when some items are selected</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Display error messages clearly when validation fails</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep labels short and scannable - avoid lengthy text</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible (Tab for focus, Space to toggle)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA attributes: aria-checked, aria-invalid, aria-describedby</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Indeterminate state uses aria-checked="mixed"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Error messages announced with aria-live</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus indicators visible for keyboard navigation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Label properly associated with checkbox input</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Disabled state indicated with aria-disabled</span>
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
              <span>Use clear, affirmative labels that describe what happens when checked</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Group related checkboxes together logically</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use helper text to provide additional context or explanation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show validation errors immediately when applicable</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use indeterminate state for parent checkboxes when some children are selected</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Stack direction="vertical" spacing="sm">
  <Checkbox
    label="Enable notifications"
    helperText="Receive updates about your account"
  />
  <Checkbox
    label="Enable email digest"
    helperText="Weekly summary of your activity"
  />
</Stack>`}
            >
              <Stack direction="vertical" spacing="sm">
                <Checkbox
                  label="Enable notifications"
                  helperText="Receive updates about your account"
                />
                <Checkbox
                  label="Enable email digest"
                  helperText="Weekly summary of your activity"
                />
              </Stack>
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
              <span>Don't use negative labels like "Don't send notifications"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use checkboxes for mutually exclusive options - use radio buttons</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't hide important information in helper text alone</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use checkboxes to trigger immediate actions - use buttons or switches</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't make labels too long or verbose</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Stack direction="vertical" spacing="sm">
  <Checkbox label="Don't send me notifications" />
  <Checkbox label="This is a very long checkbox label that contains too much information and makes it difficult for users to quickly scan and understand what this option does" />
</Stack>`}
            >
              <Stack direction="vertical" spacing="sm">
                <Checkbox label="Don't send me notifications" />
                <Checkbox label="This is a very long checkbox label that contains too much information and makes it difficult for users to quickly scan and understand what this option does" />
              </Stack>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/radio"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Radio Button</h3>
          <p className="text-sm text-muted-foreground">For mutually exclusive single selections</p>
        </Link>
        <Link
          href="/components/switch"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Switch</h3>
          <p className="text-sm text-muted-foreground">For immediate toggle actions</p>
        </Link>
        <Link
          href="/components/form"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Form</h3>
          <p className="text-sm text-muted-foreground">Form container with validation</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/checkbox/checkbox.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/"
              external
              showIcon
            >
              ARIA: Checkbox Pattern
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
