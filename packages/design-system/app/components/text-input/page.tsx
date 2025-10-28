'use client';

import { TextInput } from '@fidus/ui';
import { Search, Mail, Lock } from 'lucide-react';
import { useState } from 'react';

export default function TextInputPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Text Input</h1>
        <p className="text-lg text-muted-foreground">
          A versatile text input component supporting multiple types, validation states, and customization options.
        </p>
      </div>

      {/* Basic Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Text Input</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TextInput label="Email Address" placeholder="Enter your email" />
          </div>
        </div>
      </section>

      {/* Input Types */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Input Types</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
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
          </div>
        </div>
      </section>

      {/* Required Field */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Required Field</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TextInput
              label="Username"
              placeholder="Enter username"
              required
              helperText="Username is required"
            />
          </div>
        </div>
      </section>

      {/* With Helper Text */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Helper Text</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TextInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              helperText="We'll never share your email with anyone else."
            />
          </div>
        </div>
      </section>

      {/* Validation States */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Validation States</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
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
          </div>
        </div>
      </section>

      {/* With Icons (Prefix/Suffix) */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Icons</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
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
          </div>
        </div>
      </section>

      {/* Character Count */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Character Count</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TextInput
              label="Username"
              placeholder="Choose a username"
              maxLength={20}
              showCharCount
              helperText="Must be 20 characters or less"
            />
          </div>
        </div>
      </section>

      {/* Disabled */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Disabled</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TextInput
              label="Disabled Input"
              placeholder="Cannot edit this"
              disabled
              value="Read-only value"
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
                  <td className="p-2">Input label text (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">type</td>
                  <td className="p-2 font-mono text-xs">
                    'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'
                  </td>
                  <td className="p-2 font-mono text-xs">'text'</td>
                  <td className="p-2">HTML input type</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">placeholder</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Placeholder text</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">value</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Controlled value</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">defaultValue</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Uncontrolled default value</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">disabled</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether input is disabled</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">required</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether input is required (shows * indicator)</td>
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
                  <td className="p-2">Helper text below input</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showValidIcon</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Show check icon when valid</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showErrorIcon</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Show X icon when error</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showPasswordToggle</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Show eye icon for password type</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">maxLength</td>
                  <td className="p-2 font-mono text-xs">number</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Maximum character length</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showCharCount</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Show character count (requires maxLength)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">prefix</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Content before input (icon, text)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">suffix</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Content after input (icon, text)</td>
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
            <li>Keyboard accessible (Tab, Enter, Escape)</li>
            <li>ARIA attributes: aria-invalid, aria-describedby</li>
            <li>Error messages announced with aria-live</li>
            <li>Focus indicators visible (2px ring)</li>
            <li>Label properly associated with input</li>
            <li>Required fields indicated with * and aria-required</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
