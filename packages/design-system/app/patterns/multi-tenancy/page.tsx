'use client';

import { Select } from '@fidus/ui/select';
import { Button } from '@fidus/ui/button';
import { Alert } from '@fidus/ui/alert';
import { Badge } from '@fidus/ui/badge';
import { Avatar } from '@fidus/ui/avatar';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { useState } from 'react';

export default function MultiTenancyPatternPage() {
  const [currentTenant, setCurrentTenant] = useState('work');

  const tenants = [
    { id: 'personal', name: 'Personal', icon: '👤', color: 'bg-blue-500' },
    { id: 'work', name: 'Work Workspace', icon: '💼', color: 'bg-purple-500', members: 3 },
    { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: 'bg-green-500', members: 4 },
  ];

  const currentTenantData = tenants.find(t => t.id === currentTenant) || tenants[0];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Multi-Tenancy Pattern</h1>
      <p className="lead">
        Managing multiple workspaces, organizations, and contexts within a single application with clear data isolation and seamless switching.
      </p>

      <h2>Interactive Tenant Switcher</h2>
      <p className="text-sm text-muted-foreground">
        The tenant switcher allows users to seamlessly switch between different workspaces or contexts.
      </p>

      <div className="not-prose my-lg">
        <ComponentPreview code={`const [currentTenant, setCurrentTenant] = useState('work');

const tenants = [
  { id: 'personal', name: 'Personal', icon: '👤' },
  { id: 'work', name: 'Work Workspace', icon: '💼', members: 3 },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', members: 4 },
];

<div className="flex items-center justify-between p-md border border-border rounded-lg bg-card">
  <div className="flex items-center gap-md">
    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-2xl">
      {currentTenantData.icon}
    </div>
    <div>
      <p className="font-semibold">{currentTenantData.name}</p>
      {currentTenantData.members && (
        <p className="text-xs text-muted-foreground">
          {currentTenantData.members} members
        </p>
      )}
    </div>
  </div>
  <Select
    value={currentTenant}
    onChange={(e) => setCurrentTenant(e.target.value)}
  >
    {tenants.map(tenant => (
      <option key={tenant.id} value={tenant.id}>
        {tenant.icon} {tenant.name}
      </option>
    ))}
  </Select>
</div>`}>
          <div className="flex items-center justify-between p-lg border border-border rounded-lg bg-card">
            <div className="flex items-center gap-md">
              <div className={`w-10 h-10 ${currentTenantData.color} rounded-full flex items-center justify-center text-2xl`}>
                {currentTenantData.icon}
              </div>
              <div>
                <p className="font-semibold text-base">{currentTenantData.name}</p>
                {currentTenantData.members && (
                  <p className="text-xs text-muted-foreground">
                    {currentTenantData.members} members
                  </p>
                )}
              </div>
            </div>
            <Select
              label="Select Tenant"
              value={currentTenant}
              onChange={(value) => setCurrentTenant(value)}
              options={tenants.map(tenant => ({
                value: tenant.id,
                label: `${tenant.icon} ${tenant.name}`,
              }))}
            />
          </div>

          <Alert variant="info" title="Current Context" className="mt-md">
            You are viewing data for <strong>{currentTenantData.name}</strong>. All calendars, budgets, and tasks shown are specific to this workspace.
          </Alert>
        </ComponentPreview>
      </div>

      <h2>Tenant Cards</h2>
      <p className="text-sm text-muted-foreground">
        Show available tenants as cards for selection or management.
      </p>

      <div className="not-prose my-lg">
        <ComponentPreview code={`<div className="grid md:grid-cols-3 gap-md">
  {tenants.map(tenant => (
    <div
      key={tenant.id}
      className="p-lg border border-border rounded-lg hover:border-primary cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-md mb-md">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-3xl">
          {tenant.icon}
        </div>
        <div>
          <h3 className="font-semibold">{tenant.name}</h3>
          {tenant.members && (
            <p className="text-xs text-muted-foreground">
              {tenant.members} members
            </p>
          )}
        </div>
      </div>
      <Button variant="secondary" size="sm" className="w-full">
        Switch
      </Button>
    </div>
  ))}
</div>`}>
          <div className="grid md:grid-cols-3 gap-md">
            {tenants.map(tenant => (
              <div
                key={tenant.id}
                className={`p-lg border-2 rounded-lg cursor-pointer transition-colors ${
                  currentTenant === tenant.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary'
                }`}
                onClick={() => setCurrentTenant(tenant.id)}
              >
                <div className="flex items-center gap-md mb-md">
                  <div className={`w-12 h-12 ${tenant.color} rounded-full flex items-center justify-center text-3xl`}>
                    {tenant.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{tenant.name}</h3>
                    {tenant.members && (
                      <p className="text-xs text-muted-foreground">
                        {tenant.members} members
                      </p>
                    )}
                  </div>
                </div>
                {currentTenant === tenant.id && (
                  <Badge variant="success">Active</Badge>
                )}
              </div>
            ))}
          </div>
        </ComponentPreview>
      </div>

      <h2>Data Isolation Indicator</h2>
      <p className="text-sm text-muted-foreground">
        Clearly show users which tenant context they&apos;re viewing data from.
      </p>

      <div className="not-prose my-lg">
        <ComponentPreview code={`<Alert variant="info">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-sm">
      <span className="text-2xl">{currentTenantData.icon}</span>
      <div>
        <p className="font-semibold text-sm">Viewing: {currentTenantData.name}</p>
        <p className="text-xs text-muted-foreground">
          All data shown is isolated to this workspace
        </p>
      </div>
    </div>
    <Button variant="ghost" size="sm">Switch</Button>
  </div>
</Alert>`}>
          <Alert variant="info">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="text-2xl">{currentTenantData.icon}</span>
                <div>
                  <p className="font-semibold text-sm">Viewing: {currentTenantData.name}</p>
                  <p className="text-xs text-muted-foreground">
                    All data shown is isolated to this workspace
                  </p>
                </div>
              </div>
              <Button variant="tertiary" size="sm">Switch</Button>
            </div>
          </Alert>
        </ComponentPreview>
      </div>

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Users need to separate personal and work data</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Users manage multiple organizations or teams</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Data must be isolated between contexts</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Different permissions apply per tenant</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Always show current tenant prominently</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use visual indicators (colors, icons) to differentiate tenants</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Make tenant switching easily accessible</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Clearly indicate data isolation boundaries</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Persist tenant selection across sessions</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Announce tenant switches to screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide keyboard shortcuts for tenant switching</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Ensure tenant indicators meet contrast requirements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use clear labels, not just colors or icons</span>
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
              <span>Clearly show which tenant is currently active</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use visual indicators to differentiate tenants</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Make switching between tenants easy and quick</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Confirm tenant switches for destructive actions</span>
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
              <span>Hide the current tenant context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Mix data from multiple tenants without clear labels</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Make tenant switching hard to find</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Rely only on color to indicate tenants</span>
            </li>
          </ul>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/select"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Select
          </h3>
          <p className="text-sm text-muted-foreground">Dropdown selection</p>
        </Link>

        <Link
          href="/components/badge"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Badge
          </h3>
          <p className="text-sm text-muted-foreground">Status indicators</p>
        </Link>

        <Link
          href="/components/avatar"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Avatar
          </h3>
          <p className="text-sm text-muted-foreground">User/workspace icons</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/multi-account-management/"
              external
              showIcon
            >
              Nielsen Norman Group: Multi-Account Management
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
