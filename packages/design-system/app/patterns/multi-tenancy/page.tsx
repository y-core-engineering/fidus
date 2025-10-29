'use client';

import Link from 'next/link';

export default function MultiTenancyPatternPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Multi-Tenancy Pattern</h1>
        <p className="text-xl text-gray-600">
          Managing multiple workspaces, organizations, and team contexts
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          Multi-tenancy allows users to manage separate contexts within the same application.
          In Fidus, this might mean switching between personal, work, and family workspaces,
          or managing multiple organizations or teams.
        </p>
        <p className="mb-4">
          The multi-tenancy pattern ensures data isolation, clear context indication, and
          seamless switching between different tenant contexts.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">When to Use This Pattern</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-green-900">Use when:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>Users need to separate personal and work data</li>
              <li>Users manage multiple organizations</li>
              <li>Users collaborate in team workspaces</li>
              <li>Data must be isolated between contexts</li>
              <li>Different permissions apply per tenant</li>
              <li>Users want separate calendars, budgets, or projects</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-red-900">Do not use when:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>User only needs one context</li>
              <li>Data can be tagged or filtered instead</li>
              <li>Complexity outweighs benefits</li>
              <li>Users prefer unified view</li>
              <li>Single workspace meets all needs</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Tenant Switcher Component</h2>

        <p className="mb-4">
          The tenant switcher is the primary UI element for managing multi-tenancy. It should
          be easily accessible and clearly indicate the current tenant.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Location</h3>
          <p className="mb-3">
            Place the tenant switcher in a prominent, consistent location:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Top navigation bar (next to user profile)</li>
            <li>Left sidebar header</li>
            <li>Always visible, never hidden in menus</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Visual Design</h3>
          <div className="bg-gray-50 border rounded-lg p-6 mb-4">
            <p className="font-semibold mb-3">Tenant switcher should display:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Current tenant name or label</li>
              <li>Tenant icon or avatar</li>
              <li>Visual indicator (color, badge, icon)</li>
              <li>Dropdown arrow showing more options available</li>
            </ul>
          </div>
          <div className="bg-gray-100 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  W
                </div>
                <div>
                  <div className="font-semibold">Work Workspace</div>
                  <div className="text-xs text-gray-600">3 team members</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Code Example: Tenant Switcher</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`import { useState } from 'react';
import { Avatar, Select } from '@fidus/ui';

interface Tenant {
  id: string;
  name: string;
  type: 'personal' | 'work' | 'family';
  icon?: string;
  memberCount?: number;
}

interface TenantSwitcherProps {
  tenants: Tenant[];
  currentTenant: Tenant;
  onSwitch: (tenantId: string) => void;
}

export function TenantSwitcher({
  tenants,
  currentTenant,
  onSwitch,
}: TenantSwitcherProps) {
  return (
    <Select
      value={currentTenant.id}
      onChange={(e) => onSwitch(e.target.value)}
      renderValue={() => (
        <div className="flex items-center space-x-3">
          <Avatar
            src={currentTenant.icon}
            alt={currentTenant.name}
            size="sm"
          />
          <div>
            <div className="font-semibold">{currentTenant.name}</div>
            {currentTenant.memberCount && (
              <div className="text-xs text-gray-600">
                {currentTenant.memberCount} members
              </div>
            )}
          </div>
        </div>
      )}
    >
      {tenants.map((tenant) => (
        <option key={tenant.id} value={tenant.id}>
          {tenant.name}
        </option>
      ))}
    </Select>
  );
}`}</code>
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Tenant Context Management</h2>

        <p className="mb-4">
          Manage tenant context throughout the application using React Context or a state
          management library.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Code Example: Tenant Context</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`import { createContext, useContext, useState, ReactNode } from 'react';

interface Tenant {
  id: string;
  name: string;
  type: 'personal' | 'work' | 'family';
}

interface TenantContextValue {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  switchTenant: (tenantId: string) => void;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextValue | undefined>(
  undefined
);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const switchTenant = async (tenantId: string) => {
    setIsLoading(true);
    try {
      // Fetch tenant data
      const tenant = tenants.find((t) => t.id === tenantId);
      if (tenant) {
        setCurrentTenant(tenant);
        // Store in localStorage for persistence
        localStorage.setItem('currentTenantId', tenantId);
        // Refresh data for new tenant
        await refreshTenantData(tenantId);
      }
    } catch (error) {
      console.error('Failed to switch tenant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TenantContext.Provider
      value={{ currentTenant, tenants, switchTenant, isLoading }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}

// Helper hook to ensure tenant context exists
export function useRequireTenant() {
  const { currentTenant, isLoading } = useTenant();

  if (isLoading) {
    return { tenant: null, isLoading: true };
  }

  if (!currentTenant) {
    throw new Error('No tenant selected');
  }

  return { tenant: currentTenant, isLoading: false };
}`}</code>
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Workspace and Organization Selector</h2>

        <p className="mb-4">
          When users belong to multiple workspaces or organizations, provide a clear selector
          that shows all available options.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Workspace List</h3>
          <div className="bg-gray-50 border rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white border border-blue-500 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                    P
                  </div>
                  <div>
                    <div className="font-semibold">Personal</div>
                    <div className="text-xs text-gray-600">Just you</div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border rounded-lg hover:border-gray-400 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                    W
                  </div>
                  <div>
                    <div className="font-semibold">Work</div>
                    <div className="text-xs text-gray-600">5 members</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border rounded-lg hover:border-gray-400 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-semibold">
                    F
                  </div>
                  <div>
                    <div className="font-semibold">Family</div>
                    <div className="text-xs text-gray-600">4 members</div>
                  </div>
                </div>
              </div>

              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create New Workspace</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Tenant-Specific Data Isolation</h2>

        <p className="mb-4">
          All data must be strictly isolated by tenant. Never show data from one tenant in
          another tenant's context.
        </p>

        <div className="space-y-6">
          <div className="border-l-4 border-red-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Backend Implementation</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Every database query must filter by tenant ID</li>
              <li>API endpoints require tenant context</li>
              <li>Validate user has access to requested tenant</li>
              <li>Log tenant context for all operations</li>
              <li>Use row-level security in database</li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Frontend Implementation</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Include tenant ID in all API requests</li>
              <li>Clear local cache when switching tenants</li>
              <li>Validate data belongs to current tenant</li>
              <li>Prevent accidental cross-tenant operations</li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Code Example: API Request with Tenant</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
              <code>{`import { useTenant } from '@/contexts/TenantContext';

export function useCalendarEvents() {
  const { currentTenant } = useTenant();

  const fetchEvents = async () => {
    if (!currentTenant) {
      throw new Error('No tenant selected');
    }

    const response = await fetch('/api/calendar/events', {
      headers: {
        'X-Tenant-ID': currentTenant.id,
        'Authorization': \`Bearer \${token}\`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    return response.json();
  };

  return { fetchEvents };
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Tenant Settings and Management</h2>

        <p className="mb-4">
          Each tenant should have its own settings and configuration options.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Tenant Settings Include</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Tenant name and description</li>
            <li>Tenant icon or logo</li>
            <li>Notification preferences</li>
            <li>Data retention policies</li>
            <li>Integration connections</li>
            <li>Billing and subscription (for work tenants)</li>
            <li>Privacy and security settings</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Access Control</h3>
          <p className="mb-3">
            Only tenant owners and administrators can modify tenant settings:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Owner: Full control, can delete tenant</li>
            <li>Admin: Manage settings and members</li>
            <li>Member: View and use tenant, no management</li>
            <li>Guest: Limited access to specific resources</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Team Member Management</h2>

        <p className="mb-4">
          For shared workspaces, provide tools to invite and manage team members.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Member Invitation Flow</h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
            <li>Admin clicks "Invite Member" button</li>
            <li>Enter email address and select role</li>
            <li>System sends invitation email</li>
            <li>Invitee clicks link and accepts invitation</li>
            <li>Invitee gains access to tenant workspace</li>
          </ol>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Code Example: Team Member List</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`import { Avatar, Badge, Button } from '@fidus/ui';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  avatar?: string;
  status: 'active' | 'invited' | 'inactive';
}

interface TeamMemberListProps {
  members: TeamMember[];
  onRemove: (memberId: string) => void;
  onChangeRole: (memberId: string, newRole: string) => void;
}

export function TeamMemberList({
  members,
  onRemove,
  onChangeRole,
}: TeamMemberListProps) {
  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center space-x-4">
            <Avatar src={member.avatar} alt={member.name} />
            <div>
              <div className="font-semibold">{member.name}</div>
              <div className="text-sm text-gray-600">{member.email}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant={member.status === 'active' ? 'success' : 'warning'}>
              {member.status}
            </Badge>

            <select
              value={member.role}
              onChange={(e) => onChangeRole(member.id, e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="guest">Guest</option>
            </select>

            <Button
              variant="outline"
              size="small"
              onClick={() => onRemove(member.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}`}</code>
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Security Considerations</h2>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Critical Security Rules</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Never expose data from other tenants</li>
              <li>Always validate tenant access on backend</li>
              <li>Log all tenant switches for audit trail</li>
              <li>Encrypt tenant data at rest and in transit</li>
              <li>Implement rate limiting per tenant</li>
              <li>Monitor for suspicious cross-tenant access attempts</li>
            </ul>
          </div>

          <div className="border-l-4 border-yellow-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Privacy Implications</h3>
            <p className="text-gray-700 mb-3">
              Multi-tenancy must respect privacy:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Personal tenants must not be visible to work tenants</li>
              <li>Data sharing requires explicit consent</li>
              <li>Users can delete tenant data independently</li>
              <li>Export data for one tenant without others</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>

        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Clear Current Tenant Indication</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Always show current tenant name prominently</li>
              <li>Use distinct colors or icons per tenant type</li>
              <li>Announce tenant changes to screen readers</li>
              <li>Provide visual confirmation after switching</li>
            </ul>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Keyboard Navigation</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Tenant switcher accessible via keyboard</li>
              <li>Arrow keys navigate tenant list</li>
              <li>Enter key selects tenant</li>
              <li>Escape key closes dropdown</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-green-900">Do</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>Make current tenant always visible</li>
              <li>Provide quick tenant switching</li>
              <li>Clear cache when switching tenants</li>
              <li>Validate tenant access on every request</li>
              <li>Allow users to create unlimited personal tenants</li>
              <li>Show visual confirmation after switch</li>
              <li>Persist last-used tenant</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-red-900">Do not</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>Hide tenant switcher in nested menus</li>
              <li>Allow cross-tenant data leakage</li>
              <li>Auto-switch tenants without consent</li>
              <li>Make tenant switching slow or difficult</li>
              <li>Show confusing tenant indicators</li>
              <li>Trust client-side tenant validation alone</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Related Components</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/components/select"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Select</h3>
            <p className="text-sm text-gray-600">
              Tenant dropdown selector
            </p>
          </Link>

          <Link
            href="/components/avatar"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Avatar</h3>
            <p className="text-sm text-gray-600">
              Tenant and member icons
            </p>
          </Link>

          <Link
            href="/components/badge"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Badge</h3>
            <p className="text-sm text-gray-600">
              Status and role indicators
            </p>
          </Link>
        </div>
      </section>

      <section className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/foundations/privacy-ux" className="text-blue-600 hover:underline">
              Privacy UX Guidelines
            </Link>
          </li>
          <li>
            <Link href="/patterns/onboarding" className="text-blue-600 hover:underline">
              Onboarding Pattern
            </Link>
          </li>
          <li>
            <Link href="/getting-started/design-philosophy" className="text-blue-600 hover:underline">
              Design Philosophy
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
