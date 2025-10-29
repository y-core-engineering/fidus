'use client';

import { Banner } from '@fidus/ui';
import { useState } from 'react';

export default function BannerPage() {
  const [infoDismissible, setInfoDismissible] = useState(true);
  const [warningDismissible, setWarningDismissible] = useState(true);
  const [errorDismissible, setErrorDismissible] = useState(true);

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Banner</h1>
        <p className="text-lg text-muted-foreground">
          A prominent notification component that spans the full width of the container, typically used for important system-wide messages or announcements.
        </p>
      </div>

      {/* Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Variants</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <Banner variant="info" message="This is an informational banner message." />
            <Banner
              variant="warning"
              message="This is a warning banner. Please review before proceeding."
            />
            <Banner
              variant="error"
              message="This is an error banner. Immediate action required."
            />
          </div>
        </div>
      </section>

      {/* With Action Button */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Action Button</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <Banner
              variant="info"
              message="A new version of the app is available."
              actionLabel="Update"
              onAction={() => alert('Updating...')}
            />
            <Banner
              variant="warning"
              message="Your free trial expires in 3 days."
              actionLabel="Upgrade Now"
              onAction={() => alert('Upgrading...')}
            />
            <Banner
              variant="error"
              message="Your session has expired. Please log in again."
              actionLabel="Log In"
              onAction={() => alert('Logging in...')}
            />
          </div>
        </div>
      </section>

      {/* Dismissible */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Dismissible</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            {infoDismissible && (
              <Banner
                variant="info"
                message="This banner can be dismissed by clicking the X button."
                dismissible
                onDismiss={() => setInfoDismissible(false)}
              />
            )}
            {warningDismissible && (
              <Banner
                variant="warning"
                message="Maintenance scheduled for tonight at 2 AM EST."
                actionLabel="Learn More"
                onAction={() => alert('More info...')}
                dismissible
                onDismiss={() => setWarningDismissible(false)}
              />
            )}
            {errorDismissible && (
              <Banner
                variant="error"
                message="Unable to sync data. Check your connection."
                actionLabel="Retry"
                onAction={() => alert('Retrying...')}
                dismissible
                onDismiss={() => setErrorDismissible(false)}
              />
            )}
            {!infoDismissible && !warningDismissible && !errorDismissible && (
              <div className="text-center py-8">
                <p className="mb-4 text-sm text-muted-foreground">All banners dismissed</p>
                <button
                  onClick={() => {
                    setInfoDismissible(true);
                    setWarningDismissible(true);
                    setErrorDismissible(true);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Show All Banners
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sticky Banner */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Sticky Banner</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="mb-4 text-sm text-muted-foreground">
              Sticky banners remain at the top of the viewport when scrolling. Scroll down to see the effect.
            </p>
            <Banner
              variant="info"
              sticky
              message="This banner is sticky and stays at the top when scrolling."
              actionLabel="Dismiss"
              onAction={() => alert('Action clicked')}
            />
            <div className="mt-6 space-y-4">
              <p className="text-sm">Scroll down to see the sticky banner in action.</p>
              <div className="h-96 rounded border border-border bg-gray-50 p-4">
                <p className="text-sm text-muted-foreground">
                  This is placeholder content to demonstrate scrolling. The sticky banner should remain
                  visible at the top of the viewport as you scroll through this content area.
                </p>
              </div>
            </div>
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
                    'info' | 'warning' | 'error'
                  </td>
                  <td className="p-2 font-mono text-xs">'info'</td>
                  <td className="p-2">Visual style of the banner</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">message</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Banner message text (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">actionLabel</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Label for action button</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onAction</td>
                  <td className="p-2 font-mono text-xs">() =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Action button click handler</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">dismissible</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Whether banner can be dismissed</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onDismiss</td>
                  <td className="p-2 font-mono text-xs">() =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Callback when banner is dismissed</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">sticky</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether banner sticks to top on scroll</td>
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
            <li>ARIA role: banner</li>
            <li>Clear visual indicators: Color and icon distinguish banner types</li>
            <li>Keyboard accessible: Tab to navigate, Enter/Space for actions</li>
            <li>Dismissible: Accessible close button with aria-label</li>
            <li>High contrast: Meets WCAG AAA contrast requirements</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
