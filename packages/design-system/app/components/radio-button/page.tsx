'use client';

import { RadioButton, RadioGroup } from '@fidus/ui';
import { useState } from 'react';

export default function RadioButtonPage() {
  const [plan, setPlan] = useState('');
  const [theme, setTheme] = useState('light');
  const [size, setSize] = useState('medium');

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Radio Button</h1>
        <p className="text-lg text-muted-foreground">
          A radio button component for single-selection within a group, with support for vertical and horizontal layouts.
        </p>
      </div>

      {/* RadioGroup Vertical (Default) */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">RadioGroup Vertical (Default)</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <RadioGroup
              label="Select a plan"
              value={plan}
              onChange={(value) => setPlan(value)}
            >
              <RadioButton label="Free" value="free" />
              <RadioButton label="Pro" value="pro" />
              <RadioButton label="Enterprise" value="enterprise" />
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* RadioGroup Horizontal */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">RadioGroup Horizontal</h2>
          <div className="rounded-lg border border-border bg-card p-6">
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
          </div>
        </div>
      </section>

      {/* With Helper Text */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Helper Text</h2>
          <div className="rounded-lg border border-border bg-card p-6">
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
          </div>
        </div>
      </section>

      {/* With Error */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Error</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <RadioGroup
              label="Delivery method"
              error="Please select a delivery method"
            >
              <RadioButton label="Standard shipping" value="standard" />
              <RadioButton label="Express shipping" value="express" />
              <RadioButton label="Pickup in store" value="pickup" />
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* Disabled Group */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Disabled Group</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <RadioGroup
              label="Payment method"
              disabled
              helperText="Payment methods are currently unavailable"
            >
              <RadioButton label="Credit card" value="credit" />
              <RadioButton label="PayPal" value="paypal" />
              <RadioButton label="Bank transfer" value="bank" />
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* Pre-selected Option */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Pre-selected Option</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <RadioGroup
              label="T-shirt size"
              defaultValue="medium"
            >
              <RadioButton label="Small" value="small" />
              <RadioButton label="Medium" value="medium" />
              <RadioButton label="Large" value="large" />
              <RadioButton label="X-Large" value="xlarge" />
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* Individual Disabled Radio */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Individual Disabled Radio</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <RadioGroup
              label="Subscription tier"
            >
              <RadioButton label="Basic" value="basic" />
              <RadioButton label="Premium" value="premium" />
              <RadioButton label="Ultimate (Coming Soon)" value="ultimate" disabled />
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* Props Table - RadioGroup */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">RadioGroup Props</h2>
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
                  <td className="p-2">Radio group label text (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">value</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Controlled selected value</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">defaultValue</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Uncontrolled default selected value</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">disabled</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether entire group is disabled</td>
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
                  <td className="p-2">Helper text below group</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">orientation</td>
                  <td className="p-2 font-mono text-xs">'vertical' | 'horizontal'</td>
                  <td className="p-2 font-mono text-xs">'vertical'</td>
                  <td className="p-2">Layout direction</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onChange</td>
                  <td className="p-2 font-mono text-xs">(value: string) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Change event handler</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">children</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">RadioButton components</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Props Table - RadioButton */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">RadioButton Props</h2>
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
                  <td className="p-2">Radio button label text (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">value</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Value when selected (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">checked</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Whether radio is checked (controlled by RadioGroup)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">disabled</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether individual radio is disabled</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onChange</td>
                  <td className="p-2 font-mono text-xs">(e: ChangeEvent) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Change event handler (managed by RadioGroup)</td>
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
            <li>Keyboard accessible (Tab for focus, Arrow keys to navigate within group, Space to select)</li>
            <li>ARIA attributes: role="radiogroup", aria-checked, aria-invalid, aria-describedby</li>
            <li>Error messages announced with aria-live</li>
            <li>Focus indicators visible (2px ring)</li>
            <li>Labels properly associated with radio inputs</li>
            <li>Group label uses fieldset/legend for semantic grouping</li>
            <li>Disabled state indicated with aria-disabled</li>
            <li>Arrow key navigation follows roving tabindex pattern</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
