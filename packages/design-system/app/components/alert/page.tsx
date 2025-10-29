'use client';

import { Alert } from '@fidus/ui';
import { useState } from 'react';

export default function AlertPage() {
  const [dismissibleVisible, setDismissibleVisible] = useState(true);

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Alert</h1>
        <p className="text-lg text-muted-foreground">
          A prominent message component used to communicate important information to users, with support for multiple variants and actions.
        </p>
      </div>

      {/* Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Variants</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <Alert
              variant="success"
              description="Your changes have been saved successfully."
            />
            <Alert
              variant="error"
              description="There was an error processing your request. Please try again."
            />
            <Alert
              variant="warning"
              description="This action will permanently delete your account and cannot be undone."
            />
            <Alert
              variant="info"
              description="A new software update is available for download."
            />
          </div>
        </div>
      </section>

      {/* With Title */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Title</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <Alert
              variant="success"
              title="Success"
              description="Your payment has been processed. You will receive an email confirmation shortly."
            />
            <Alert
              variant="error"
              title="Error"
              description="Unable to connect to the server. Please check your internet connection and try again."
            />
            <Alert
              variant="warning"
              title="Warning"
              description="Your session will expire in 5 minutes. Please save your work."
            />
            <Alert
              variant="info"
              title="Information"
              description="We have updated our privacy policy. Please review the changes."
            />
          </div>
        </div>
      </section>

      {/* Dismissible */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Dismissible</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            {dismissibleVisible && (
              <Alert
                variant="info"
                title="Dismissible Alert"
                description="Click the X button to dismiss this alert."
                dismissible
                onDismiss={() => setDismissibleVisible(false)}
              />
            )}
            {!dismissibleVisible && (
              <div className="text-center">
                <p className="mb-4 text-sm text-muted-foreground">Alert was dismissed</p>
                <button
                  onClick={() => setDismissibleVisible(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Show Again
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* With Actions */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Action Buttons</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <Alert
              variant="info"
              title="Update Available"
              description="A new version of the application is available."
              actions={[
                { label: 'Update Now', onClick: () => alert('Updating...') },
                { label: 'Remind Me Later', onClick: () => alert('Reminder set') },
              ]}
            />
            <Alert
              variant="warning"
              title="Unsaved Changes"
              description="You have unsaved changes that will be lost if you leave this page."
              actions={[
                { label: 'Save Changes', onClick: () => alert('Saving...') },
                { label: 'Discard', onClick: () => alert('Discarded') },
              ]}
            />
            <Alert
              variant="error"
              title="Connection Lost"
              description="Unable to reach the server. Your changes may not be saved."
              actions={[{ label: 'Retry Connection', onClick: () => alert('Retrying...') }]}
            />
          </div>
        </div>
      </section>

      {/* Dismissible with Actions */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Dismissible with Actions</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Alert
              variant="success"
              title="Account Created"
              description="Your account has been created successfully. Would you like to complete your profile?"
              dismissible
              actions={[
                { label: 'Complete Profile', onClick: () => alert('Navigating to profile...') },
                { label: 'Skip', onClick: () => alert('Skipped') },
              ]}
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
                  <td className="p-2 font-mono">variant</td>
                  <td className="p-2 font-mono text-xs">
                    'success' | 'error' | 'warning' | 'info'
                  </td>
                  <td className="p-2 font-mono text-xs">'info'</td>
                  <td className="p-2">Visual style of the alert</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">title</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Optional alert title</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">description</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Alert message (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">dismissible</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether alert can be dismissed</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onDismiss</td>
                  <td className="p-2 font-mono text-xs">() =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Callback when alert is dismissed</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">actions</td>
                  <td className="p-2 font-mono text-xs">
                    {'Array<{label: string, onClick: () => void}>'}
                  </td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Action buttons to display</td>
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
            <li>ARIA role: alert</li>
            <li>Screen reader announcements: Alerts are automatically announced</li>
            <li>Keyboard accessible: Tab to navigate, Enter/Space for actions</li>
            <li>Clear visual indicators: Color and icon distinguish alert types</li>
            <li>Dismissible: Accessible close button with aria-label</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
