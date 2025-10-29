'use client';

import { RadioButton, RadioGroup, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { useState } from 'react';

export default function RadioButtonPage() {
  const [plan, setPlan] = useState('');
  const [theme, setTheme] = useState('light');
  const [size, setSize] = useState('medium');

  const radioGroupProps = [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Radio group label text',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled selected value',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Uncontrolled default selected value',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether entire group is disabled',
    },
    {
      name: 'error',
      type: 'string',
      description: 'Error message to display',
    },
    {
      name: 'helperText',
      type: 'string',
      description: 'Helper text below group',
    },
    {
      name: 'orientation',
      type: "'vertical' | 'horizontal'",
      default: "'vertical'",
      description: 'Layout direction',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Change event handler',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'RadioButton components',
    },
  ];

  const radioButtonProps = [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Radio button label text',
    },
    {
      name: 'value',
      type: 'string',
      required: true,
      description: 'Value when selected',
    },
    {
      name: 'checked',
      type: 'boolean',
      description: 'Whether radio is checked (controlled by RadioGroup)',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether individual radio is disabled',
    },
    {
      name: 'onChange',
      type: '(e: ChangeEvent) => void',
      description: 'Change event handler (managed by RadioGroup)',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Radio Button</h1>
      <p className="lead">
        A radio button component for single-selection within a group, with support for vertical and horizontal layouts.
      </p>

      <h2>RadioGroup Vertical (Default)</h2>
      <ComponentPreview
        code={`<RadioGroup
  label="Select a plan"
  value={plan}
  onChange={(value) => setPlan(value)}
>
  <RadioButton label="Free" value="free" />
  <RadioButton label="Pro" value="pro" />
  <RadioButton label="Enterprise" value="enterprise" />
</RadioGroup>`}
      >
        <RadioGroup
          label="Select a plan"
          value={plan}
          onChange={(value) => setPlan(value)}
        >
          <RadioButton label="Free" value="free" />
          <RadioButton label="Pro" value="pro" />
          <RadioButton label="Enterprise" value="enterprise" />
        </RadioGroup>
      </ComponentPreview>

      <h2>RadioGroup Horizontal</h2>
      <ComponentPreview
        code={`<RadioGroup
  label="Choose theme"
  value={theme}
  onChange={(value) => setTheme(value)}
  orientation="horizontal"
>
  <RadioButton label="Light" value="light" />
  <RadioButton label="Dark" value="dark" />
  <RadioButton label="System" value="system" />
</RadioGroup>`}
      >
        <RadioGroup
          label="Choose theme"
          value={theme}
          onChange={(value) => setTheme(value)}
          orientation="horizontal"
        >
          <RadioButton label="Light" value="light" />
          <RadioButton label="Dark" value="dark" />
          <RadioButton label="System" value="system" />
        </RadioGroup>
      </ComponentPreview>

      <h2>With Helper Text</h2>
      <ComponentPreview
        code={`<RadioGroup
  label="Notification frequency"
  helperText="Choose how often you'd like to receive notifications"
  value={size}
  onChange={(value) => setSize(value)}
>
  <RadioButton label="Real-time" value="realtime" />
  <RadioButton label="Daily digest" value="daily" />
  <RadioButton label="Weekly summary" value="weekly" />
  <RadioButton label="Never" value="never" />
</RadioGroup>`}
      >
        <RadioGroup
          label="Notification frequency"
          helperText="Choose how often you'd like to receive notifications"
          value={size}
          onChange={(value) => setSize(value)}
        >
          <RadioButton label="Real-time" value="realtime" />
          <RadioButton label="Daily digest" value="daily" />
          <RadioButton label="Weekly summary" value="weekly" />
          <RadioButton label="Never" value="never" />
        </RadioGroup>
      </ComponentPreview>

      <h2>With Error</h2>
      <ComponentPreview
        code={`<RadioGroup
  label="Delivery method"
  error="Please select a delivery method"
>
  <RadioButton label="Standard shipping" value="standard" />
  <RadioButton label="Express shipping" value="express" />
  <RadioButton label="Pickup in store" value="pickup" />
</RadioGroup>`}
      >
        <RadioGroup
          label="Delivery method"
          error="Please select a delivery method"
        >
          <RadioButton label="Standard shipping" value="standard" />
          <RadioButton label="Express shipping" value="express" />
          <RadioButton label="Pickup in store" value="pickup" />
        </RadioGroup>
      </ComponentPreview>

      <h2>Disabled Group</h2>
      <ComponentPreview
        code={`<RadioGroup
  label="Payment method"
  disabled
  helperText="Payment methods are currently unavailable"
>
  <RadioButton label="Credit card" value="credit" />
  <RadioButton label="PayPal" value="paypal" />
  <RadioButton label="Bank transfer" value="bank" />
</RadioGroup>`}
      >
        <RadioGroup
          label="Payment method"
          disabled
          helperText="Payment methods are currently unavailable"
        >
          <RadioButton label="Credit card" value="credit" />
          <RadioButton label="PayPal" value="paypal" />
          <RadioButton label="Bank transfer" value="bank" />
        </RadioGroup>
      </ComponentPreview>

      <h2>Pre-selected Option</h2>
      <ComponentPreview
        code={`<RadioGroup
  label="T-shirt size"
  defaultValue="medium"
>
  <RadioButton label="Small" value="small" />
  <RadioButton label="Medium" value="medium" />
  <RadioButton label="Large" value="large" />
  <RadioButton label="X-Large" value="xlarge" />
</RadioGroup>`}
      >
        <RadioGroup
          label="T-shirt size"
          defaultValue="medium"
        >
          <RadioButton label="Small" value="small" />
          <RadioButton label="Medium" value="medium" />
          <RadioButton label="Large" value="large" />
          <RadioButton label="X-Large" value="xlarge" />
        </RadioGroup>
      </ComponentPreview>

      <h2>Individual Disabled Radio</h2>
      <ComponentPreview
        code={`<RadioGroup
  label="Subscription tier"
>
  <RadioButton label="Basic" value="basic" />
  <RadioButton label="Premium" value="premium" />
  <RadioButton label="Ultimate (Coming Soon)" value="ultimate" disabled />
</RadioGroup>`}
      >
        <RadioGroup
          label="Subscription tier"
        >
          <RadioButton label="Basic" value="basic" />
          <RadioButton label="Premium" value="premium" />
          <RadioButton label="Ultimate (Coming Soon)" value="ultimate" disabled />
        </RadioGroup>
      </ComponentPreview>

      <h2>RadioGroup Props</h2>
      <PropsTable props={radioGroupProps} />

      <h2>RadioButton Props</h2>
      <PropsTable props={radioButtonProps} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When users need to select exactly one option from a list of 2-7 choices</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When all available options should be visible at once</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For mutually exclusive settings or preferences</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When selection needs to be immediately visible to users</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use vertical layout by default for better readability</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use horizontal layout only when space is limited and options are short</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide clear, concise labels for each option</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use helper text to provide additional context about the choices</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Consider pre-selecting the most common or recommended option</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For more than 7 options, consider using a Select component instead</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Always provide a group label that describes what users are choosing</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible: Tab for focus, Arrow keys to navigate within group, Space to select</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA attributes: role="radiogroup", aria-checked, aria-invalid, aria-describedby</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Error messages announced with aria-live</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus indicators visible with 2px ring</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Labels properly associated with radio inputs</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Group label uses fieldset/legend for semantic grouping</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Disabled state indicated with aria-disabled</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Arrow key navigation follows roving tabindex pattern</span>
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
              <span>Use radio buttons when there are 2-7 mutually exclusive options</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Display all options at once so users can compare choices</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use vertical layout for better readability and scanning</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide clear labels that describe each option</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Pre-select the most common or recommended option</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<RadioGroup
  label="Notification frequency"
  defaultValue="daily"
>
  <RadioButton label="Real-time" value="realtime" />
  <RadioButton label="Daily digest" value="daily" />
  <RadioButton label="Weekly summary" value="weekly" />
</RadioGroup>`}
            >
              <RadioGroup
                label="Notification frequency"
                defaultValue="daily"
              >
                <RadioButton label="Real-time" value="realtime" />
                <RadioButton label="Daily digest" value="daily" />
                <RadioButton label="Weekly summary" value="weekly" />
              </RadioGroup>
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
              <span>Don't use radio buttons for multiple selections (use checkboxes)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use for more than 7 options (use Select instead)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use horizontal layout for long option labels</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't nest radio groups or mix with other input types in same group</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use radio buttons for binary yes/no choices (use Switch or Toggle)</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<RadioGroup
  label="Choose options"
  orientation="horizontal"
>
  <RadioButton label="Option with a very long descriptive label" value="1" />
  <RadioButton label="Another lengthy option label" value="2" />
</RadioGroup>`}
            >
              <RadioGroup
                label="Choose options"
                orientation="horizontal"
              >
                <RadioButton label="Option with a very long descriptive label" value="1" />
                <RadioButton label="Another lengthy option label" value="2" />
              </RadioGroup>
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
          <p className="text-sm text-muted-foreground">For multiple selections from a list</p>
        </Link>
        <Link
          href="/components/select"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Select</h3>
          <p className="text-sm text-muted-foreground">For choosing one option from many choices</p>
        </Link>
        <Link
          href="/components/switch"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Switch</h3>
          <p className="text-sm text-muted-foreground">For binary on/off or true/false choices</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/radio-button/radio-button.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/radio/"
              external
              showIcon
            >
              ARIA: Radio Group Pattern
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
