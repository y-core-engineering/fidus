'use client';

import { Badge } from '@fidus/ui';

export default function PrivacyUXPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Privacy & Trust UX</h1>
      <p className="lead">
        Fidus is built with privacy-first principles. Every UI element communicates data
        provenance, processing location, and user control. Trust is earned through transparency and
        user empowerment.
      </p>

      <h2>Core Privacy Principles</h2>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-md my-lg">
        <div className="border border-border rounded-lg p-md bg-card">
          <h3 className="text-base font-semibold mb-sm">1. Transparency</h3>
          <p className="text-sm">
            Users always know where their data is processed, stored, and who has access. No hidden
            data flows.
          </p>
        </div>

        <div className="border border-border rounded-lg p-md bg-card">
          <h3 className="text-base font-semibold mb-sm">2. User Control</h3>
          <p className="text-sm">
            Users decide what data to share, with whom, and for how long. Easy revocation of
            permissions.
          </p>
        </div>

        <div className="border border-border rounded-lg p-md bg-card">
          <h3 className="text-base font-semibold mb-sm">3. Local-First</h3>
          <p className="text-sm">
            Sensitive data processed locally when possible. Cloud sync is optional and explicit.
          </p>
        </div>

        <div className="border border-border rounded-lg p-md bg-card">
          <h3 className="text-base font-semibold mb-sm">4. Data Minimization</h3>
          <p className="text-sm">
            Only collect and process data necessary for the feature. No excessive data hoarding.
          </p>
        </div>
      </div>

      <h2>Privacy Badges</h2>

      <p>
        Every data-displaying UI element includes a privacy badge indicating data provenance and
        processing location:
      </p>

      <div className="space-y-md my-lg">
        <div className="flex items-center gap-sm p-sm border border-border rounded-lg">
          <Badge>🔒 Local</Badge>
          <div>
            <p className="text-sm font-medium">Local Processing</p>
            <p className="text-xs text-muted-foreground">
              Data processed on your device. Never leaves your machine. Highest privacy level.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-sm p-sm border border-border rounded-lg">
          <Badge>☁️ Cloud</Badge>
          <div>
            <p className="text-sm font-medium">Private Cloud</p>
            <p className="text-xs text-muted-foreground">
              Data synchronized to your private, encrypted cloud storage. You control access.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-sm p-sm border border-border rounded-lg">
          <Badge>🔗 External</Badge>
          <div>
            <p className="text-sm font-medium">External Service</p>
            <p className="text-xs text-muted-foreground">
              Data from third-party services (Google Calendar, banks, etc.). Subject to their
              privacy policies.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-sm p-sm border border-border rounded-lg">
          <Badge>🤖 AI</Badge>
          <div>
            <p className="text-sm font-medium">AI Processing</p>
            <p className="text-xs text-muted-foreground">
              Data analyzed by AI/LLM for insights. Choose local or cloud-based AI processing.
            </p>
          </div>
        </div>
      </div>

      <h2>Privacy in UI Components</h2>

      <h3>Opportunity Cards</h3>
      <p>Always include privacy badge in header showing data source:</p>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md">
        <div className="flex items-center justify-between mb-sm">
          <div className="flex items-center gap-xs">
            <span>💰</span>
            <strong className="text-sm">Budget Alert</strong>
          </div>
          <div className="flex items-center gap-xs">
            <Badge>🔒 Local</Badge>
            <button className="text-sm">✕</button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Food: 475 EUR / 500 EUR</p>
      </div>

      <h3>Inline Widgets</h3>
      <p>Badge in widget header or footer:</p>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md">
        <div className="flex items-center justify-between mb-sm">
          <strong className="text-sm">Today's Schedule</strong>
          <Badge>🔗 External</Badge>
        </div>
        <p className="text-xs text-muted-foreground">From Google Calendar</p>
      </div>

      <h3>Forms</h3>
      <p>Privacy notice before submission:</p>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md">
        <p className="text-sm mb-sm">
          <strong>Add New Transaction</strong>
        </p>
        <p className="text-xs text-muted-foreground mb-sm">
          🔒 This data stays on your device and is never shared.
        </p>
        <div className="flex gap-xs">
          <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md">
            Save
          </button>
          <button className="px-3 py-1.5 text-sm border border-border rounded-md">Cancel</button>
        </div>
      </div>

      <h2>Data Flow Transparency</h2>

      <h3>Connection Indicators</h3>
      <p>Show when data syncs to external services:</p>

      <div className="space-y-sm my-lg">
        <div className="flex items-center gap-xs text-sm">
          <div className="h-2 w-2 rounded-full bg-success"></div>
          <span>Connected to Google Calendar</span>
        </div>
        <div className="flex items-center gap-xs text-sm">
          <div className="h-2 w-2 rounded-full bg-warning"></div>
          <span>Syncing transactions (2 pending)</span>
        </div>
        <div className="flex items-center gap-xs text-sm">
          <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
          <span>Bank connection offline</span>
        </div>
      </div>

      <h3>Permission Requests</h3>
      <p>Clear, contextual permission requests:</p>

      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md">
        <h4 className="text-sm font-semibold mb-sm">Connect to Google Calendar</h4>
        <p className="text-sm text-muted-foreground mb-md">
          Fidus needs access to read and write calendar events to manage your schedule.
        </p>
        <ul className="text-xs space-y-1 mb-md text-muted-foreground">
          <li>✓ View your calendar events</li>
          <li>✓ Create new events</li>
          <li>✓ Update existing events</li>
          <li>✗ Access to other Google services</li>
        </ul>
        <div className="flex gap-xs">
          <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md">
            Allow Access
          </button>
          <button className="px-3 py-1.5 text-sm border border-border rounded-md">Deny</button>
        </div>
      </div>

      <h2>Local vs. Cloud Processing</h2>

      <p>Users choose where AI processing happens:</p>

      <div className="not-prose bg-muted/30 border border-border rounded-lg p-lg my-lg">
        <h3 className="text-base font-semibold mb-md">AI Processing Location</h3>
        <div className="space-y-md">
          <label className="flex items-start gap-sm cursor-pointer">
            <input type="radio" name="ai-processing" className="mt-1" defaultChecked />
            <div>
              <p className="text-sm font-medium">Local Processing (Recommended)</p>
              <p className="text-xs text-muted-foreground">
                AI runs on your device. Slower but maximum privacy. No data leaves your machine.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-sm cursor-pointer">
            <input type="radio" name="ai-processing" className="mt-1" />
            <div>
              <p className="text-sm font-medium">Cloud Processing</p>
              <p className="text-xs text-muted-foreground">
                AI runs in the cloud. Faster but data sent to servers. End-to-end encrypted.
              </p>
            </div>
          </label>
        </div>
      </div>

      <h2>Privacy Settings</h2>

      <h3>Granular Control</h3>
      <p>Users control privacy at feature level:</p>

      <div className="space-y-sm my-lg">
        <div className="flex items-center justify-between p-sm border border-border rounded-lg">
          <div>
            <p className="text-sm font-medium">Calendar Sync</p>
            <p className="text-xs text-muted-foreground">Sync with Google Calendar</p>
          </div>
          <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md">
            Enabled
          </button>
        </div>

        <div className="flex items-center justify-between p-sm border border-border rounded-lg">
          <div>
            <p className="text-sm font-medium">Budget Alerts</p>
            <p className="text-xs text-muted-foreground">Proactive spending notifications</p>
          </div>
          <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md">
            Enabled
          </button>
        </div>

        <div className="flex items-center justify-between p-sm border border-border rounded-lg">
          <div>
            <p className="text-sm font-medium">Cloud Backup</p>
            <p className="text-xs text-muted-foreground">Encrypted backup to cloud</p>
          </div>
          <button className="px-3 py-1 text-xs border border-border rounded-md">Disabled</button>
        </div>
      </div>

      <h3>Data Export & Deletion</h3>
      <p>Users can export or delete all data at any time:</p>

      <div className="flex gap-sm my-lg">
        <button className="px-4 py-2 text-sm border border-border rounded-md">
          Export All Data
        </button>
        <button className="px-4 py-2 text-sm border border-error text-error rounded-md">
          Delete All Data
        </button>
      </div>

      <h2>Trust-Building Patterns</h2>

      <h3>1. Progressive Disclosure</h3>
      <ul>
        <li>Start with minimal permissions</li>
        <li>Request additional access only when needed</li>
        <li>Explain "why" before asking</li>
      </ul>

      <h3>2. Contextual Privacy Info</h3>
      <ul>
        <li>Show privacy details when relevant</li>
        <li>Tooltip on privacy badges explaining details</li>
        <li>Link to full privacy policy</li>
      </ul>

      <h3>3. Visual Indicators</h3>
      <ul>
        <li>Lock icon for encrypted data</li>
        <li>Cloud icon for synced data</li>
        <li>External link icon for third-party services</li>
      </ul>

      <h3>4. User Empowerment</h3>
      <ul>
        <li>Easy disconnect from services</li>
        <li>One-click data export</li>
        <li>Clear data deletion process</li>
      </ul>

      <h2>Multi-Tenancy Privacy</h2>

      <p>Each tenant (user) has complete data isolation:</p>

      <div className="not-prose bg-muted/30 border border-border rounded-lg p-lg my-lg">
        <h3 className="text-base font-semibold mb-sm">Tenant Isolation Guarantees</h3>
        <ul className="space-y-sm text-sm">
          <li>✓ Data is never shared between tenants</li>
          <li>✓ Each tenant has separate encryption keys</li>
          <li>✓ API requests are tenant-scoped</li>
          <li>✓ Database queries are tenant-filtered</li>
          <li>✓ No cross-tenant AI analysis</li>
        </ul>
      </div>

      <h2>Implementation Guidelines</h2>

      <h3>For Developers</h3>
      <ul>
        <li>Always include privacy badge on data-displaying components</li>
        <li>Use appropriate badge type (Local, Cloud, External, AI)</li>
        <li>Implement tenant-scoped queries in all APIs</li>
        <li>Add permission checks before data access</li>
        <li>Log all data access for audit trail</li>
        <li>Support data export in machine-readable format</li>
      </ul>

      <h3>For Designers</h3>
      <ul>
        <li>Include privacy badge in mockups</li>
        <li>Design permission requests with clear explanations</li>
        <li>Show data flow visually when relevant</li>
        <li>Make privacy settings easily discoverable</li>
        <li>Use consistent iconography for privacy indicators</li>
      </ul>

      <h2>Key Takeaways</h2>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-lg my-lg">
        <ul className="space-y-sm text-sm">
          <li>✅ Every UI element shows privacy badge</li>
          <li>✅ Users choose local vs. cloud processing</li>
          <li>✅ Granular privacy controls per feature</li>
          <li>✅ Easy data export and deletion</li>
          <li>✅ Complete tenant data isolation</li>
          <li>✅ Progressive disclosure of permissions</li>
          <li>✅ Transparent data flow indicators</li>
        </ul>
      </div>
    </div>
  );
}
