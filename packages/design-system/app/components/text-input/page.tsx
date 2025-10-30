'use client';

import { TextInput, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { Search, Mail, Lock } from 'lucide-react';
import { useState } from 'react';

export default function TextInputPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');

  const props = [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Input label text',
    },
    {
      name: 'type',
      type: "'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'",
      default: "'text'",
      description: 'HTML input type',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled value',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Uncontrolled default value',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether input is disabled',
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Whether input is required (shows * indicator)',
    },
    {
      name: 'error',
      type: 'string',
      description: 'Error message to display',
    },
    {
      name: 'helperText',
      type: 'string',
      description: 'Helper text below input',
    },
    {
      name: 'showValidIcon',
      type: 'boolean',
      default: 'true',
      description: 'Show check icon when valid',
    },
    {
      name: 'showErrorIcon',
      type: 'boolean',
      default: 'true',
      description: 'Show X icon when error',
    },
    {
      name: 'showPasswordToggle',
      type: 'boolean',
      default: 'true',
      description: 'Show eye icon for password type',
    },
    {
      name: 'maxLength',
      type: 'number',
      description: 'Maximum character length',
    },
    {
      name: 'showCharCount',
      type: 'boolean',
      default: 'false',
      description: 'Show character count (requires maxLength)',
    },
    {
      name: 'prefix',
      type: 'ReactNode',
      description: 'Content before input (icon, text)',
    },
    {
      name: 'suffix',
      type: 'ReactNode',
      description: 'Content after input (icon, text)',
    },
    {
      name: 'onChange',
      type: '(e: ChangeEvent) => void',
      description: 'Change event handler',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Text Input</h1>
      <p className="lead">
        A versatile text input component supporting multiple types, validation states, and customization options for collecting user text input.
      </p>

      <h2>Basic Text Input</h2>
      <ComponentPreview code={`<TextInput label="Email Address" placeholder="Enter your email" />`}>
        <TextInput label="Email Address" placeholder="Enter your email" />
      </ComponentPreview>

      <h2>Input Types</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <TextInput
    label="Email"
    type="email"
    placeholder="you@example.com"
  />
  <TextInput
    label="Password"
    type="password"
    placeholder="Enter password"
    showPasswordToggle
  />
  <TextInput
    label="Search"
    type="search"
    placeholder="Search..."
  />
  <TextInput
    label="Phone"
    type="tel"
    placeholder="+1 (555) 000-0000"
  />
  <TextInput
    label="Website"
    type="url"
    placeholder="https://example.com"
  />
  <TextInput
    label="Amount"
    type="number"
    placeholder="0.00"
  />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <TextInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label="Password"
            type="password"
            placeholder="Enter password"
            showPasswordToggle
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextInput
            label="Search"
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextInput
            label="Phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
          />
          <TextInput
            label="Website"
            type="url"
            placeholder="https://example.com"
          />
          <TextInput
            label="Amount"
            type="number"
            placeholder="0.00"
          />
        </Stack>
      </ComponentPreview>

      <h2>Required Field</h2>
      <ComponentPreview
        code={`<TextInput
  label="Username"
  placeholder="Enter username"
  required
  helperText="Username is required"
/>`}
      >
        <TextInput
          label="Username"
          placeholder="Enter username"
          required
          helperText="Username is required"
        />
      </ComponentPreview>

      <h2>With Helper Text</h2>
      <ComponentPreview
        code={`<TextInput
  label="Email"
  type="email"
  placeholder="you@example.com"
  helperText="We'll never share your email with anyone else."
/>`}
      >
        <TextInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          helperText="We'll never share your email with anyone else."
        />
      </ComponentPreview>

      <h2>Validation States</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <TextInput
    label="Valid Email"
    type="email"
    value="user@example.com"
    showValidIcon
  />
  <TextInput
    label="Invalid Email"
    type="email"
    value="invalid-email"
    error="Please enter a valid email address"
    showErrorIcon
  />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <TextInput
            label="Valid Email"
            type="email"
            value="user@example.com"
            showValidIcon
          />
          <TextInput
            label="Invalid Email"
            type="email"
            value="invalid-email"
            error="Please enter a valid email address"
            showErrorIcon
          />
        </Stack>
      </ComponentPreview>

      <h2>With Icons (Prefix/Suffix)</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <TextInput
    label="Search"
    placeholder="Search..."
    prefix={<Search className="h-5 w-5" />}
  />
  <TextInput
    label="Email"
    type="email"
    placeholder="you@example.com"
    prefix={<Mail className="h-5 w-5" />}
  />
  <TextInput
    label="Password"
    type="password"
    placeholder="Enter password"
    prefix={<Lock className="h-5 w-5" />}
    showPasswordToggle
  />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          {/* @ts-expect-error - prefix prop type conflict with InputHTMLAttributes */}
          <TextInput
            label="Search"
            placeholder="Search..."
            prefix={<Search className="h-5 w-5" />}
          />
          {/* @ts-expect-error - prefix prop type conflict with InputHTMLAttributes */}
          <TextInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            prefix={<Mail className="h-5 w-5" />}
          />
          {/* @ts-expect-error - prefix prop type conflict with InputHTMLAttributes */}
          <TextInput
            label="Password"
            type="password"
            placeholder="Enter password"
            prefix={<Lock className="h-5 w-5" />}
            showPasswordToggle
          />
        </Stack>
      </ComponentPreview>

      <h2>Character Count</h2>
      <ComponentPreview
        code={`<TextInput
  label="Username"
  placeholder="Choose a username"
  maxLength={20}
  showCharCount
  helperText="Must be 20 characters or less"
/>`}
      >
        <TextInput
          label="Username"
          placeholder="Choose a username"
          maxLength={20}
          showCharCount
          helperText="Must be 20 characters or less"
        />
      </ComponentPreview>

      <h2>Disabled</h2>
      <ComponentPreview
        code={`<TextInput
  label="Disabled Input"
  placeholder="Cannot edit this"
  disabled
  value="Read-only value"
/>`}
      >
        <TextInput
          label="Disabled Input"
          placeholder="Cannot edit this"
          disabled
          value="Read-only value"
        />
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
              <span>For collecting single-line text input from users</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For forms that require specific input types (email, password, phone)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When validation feedback needs to be displayed inline</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For search functionality or filtering data</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use clear, descriptive labels that tell users what to input</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide helpful placeholder text as examples, not instructions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show validation errors immediately after user interaction</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use appropriate input types for better mobile keyboard support</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Include helper text for complex or important fields</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use prefix icons to clarify the input purpose (search, email, etc.)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible with Tab, Enter, and Escape keys</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA attributes: aria-invalid, aria-describedby, aria-required</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Error messages announced with aria-live regions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus indicators visible with 2px ring for keyboard navigation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Labels properly associated with inputs using htmlFor</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Required fields indicated with asterisk and aria-required</span>
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
              <span>Use descriptive labels that clearly indicate what input is expected</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide immediate validation feedback after user interaction</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use appropriate input types (email, tel, url) for better UX</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Include helper text for complex requirements or formatting</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use prefix icons to make the input purpose immediately clear</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<TextInput
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  prefix={<Mail className="h-5 w-5" />}
  helperText="We'll send a confirmation to this address"
/>`}
            >
              {/* @ts-expect-error - prefix prop type conflict with InputHTMLAttributes */}
              <TextInput
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                prefix={<Mail className="h-5 w-5" />}
                helperText="We'll send a confirmation to this address"
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
              <span>Don't use vague labels like "Input" or "Field"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use placeholder text as a substitute for labels</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't validate before the user has finished typing</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use generic error messages like "Invalid input"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't disable inputs without explanation or alternative</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<TextInput
  label="Input"
  placeholder="Label should be here"
  error="Invalid"
/>`}
            >
              <TextInput
                label="Input"
                placeholder="Label should be here"
                error="Invalid"
              />
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/textarea"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Textarea
          </h3>
          <p className="text-sm text-muted-foreground">For multi-line text input</p>
        </Link>
        <Link
          href="/components/select"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Select
          </h3>
          <p className="text-sm text-muted-foreground">For selecting from a list of options</p>
        </Link>
        <Link
          href="/components/checkbox"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Checkbox
          </h3>
          <p className="text-sm text-muted-foreground">For boolean or multi-select input</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/text-input/text-input.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/textbox/"
              external
              showIcon
            >
              ARIA: Textbox Pattern
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
