'use client';

import { Toast, ToastProvider, ToastViewport } from '@fidus/ui';
import { Button } from '@fidus/ui';
import { useState } from 'react';

export default function ToastPage() {
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [topLeftOpen, setTopLeftOpen] = useState(false);
  const [topCenterOpen, setTopCenterOpen] = useState(false);
  const [bottomLeftOpen, setBottomLeftOpen] = useState(false);
  const [bottomRightOpen, setBottomRightOpen] = useState(false);
  const [bottomCenterOpen, setBottomCenterOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [customDurationOpen, setCustomDurationOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Toast</h1>
          <p className="text-lg text-muted-foreground">
            A non-blocking notification component that appears temporarily to provide feedback about an action or event.
          </p>
        </div>

        {/* Basic Variants */}
        <section className="space-y-4">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Variants</h2>
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setSuccessOpen(true)}>Show Success</Button>
                <Button onClick={() => setErrorOpen(true)}>Show Error</Button>
                <Button onClick={() => setWarningOpen(true)}>Show Warning</Button>
                <Button onClick={() => setInfoOpen(true)}>Show Info</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Positions */}
        <section className="space-y-4">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Positions</h2>
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setTopLeftOpen(true)}>Top Left</Button>
                <Button onClick={() => setTopCenterOpen(true)}>Top Center</Button>
                <Button onClick={() => setBottomLeftOpen(true)}>Bottom Left</Button>
                <Button onClick={() => setBottomRightOpen(true)}>Bottom Right</Button>
                <Button onClick={() => setBottomCenterOpen(true)}>Bottom Center</Button>
              </div>
            </div>
          </div>
        </section>

        {/* With Action Button */}
        <section className="space-y-4">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">With Action Button</h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <Button onClick={() => setActionOpen(true)}>Show Toast with Action</Button>
            </div>
          </div>
        </section>

        {/* Custom Duration */}
        <section className="space-y-4">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Custom Duration</h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <Button onClick={() => setCustomDurationOpen(true)}>Show Toast (10 seconds)</Button>
            </div>
          </div>
        </section>

        {/* Setup Instructions */}
        <section className="space-y-4">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Setup</h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="mb-4 text-sm text-muted-foreground">
                Wrap your application with ToastProvider and add ToastViewport to enable toasts:
              </p>
              <pre className="rounded bg-gray-100 p-4 text-sm">
                <code>{`import { ToastProvider, ToastViewport } from '@fidus/ui';

function App() {
  return (
    <ToastProvider>
      <YourApp />
      <ToastViewport position="top-right" />
    </ToastProvider>
  );
}`}</code>
              </pre>
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
                    <td className="p-2">Visual style of the toast</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2 font-mono">title</td>
                    <td className="p-2 font-mono text-xs">string</td>
                    <td className="p-2 text-muted-foreground">-</td>
                    <td className="p-2">Toast title (required)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2 font-mono">description</td>
                    <td className="p-2 font-mono text-xs">string</td>
                    <td className="p-2 text-muted-foreground">-</td>
                    <td className="p-2">Optional description text</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2 font-mono">duration</td>
                    <td className="p-2 font-mono text-xs">number</td>
                    <td className="p-2 font-mono text-xs">5000</td>
                    <td className="p-2">Auto-dismiss duration in milliseconds</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2 font-mono">dismissible</td>
                    <td className="p-2 font-mono text-xs">boolean</td>
                    <td className="p-2 font-mono text-xs">true</td>
                    <td className="p-2">Whether toast can be manually dismissed</td>
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
                    <td className="p-2 font-mono">open</td>
                    <td className="p-2 font-mono text-xs">boolean</td>
                    <td className="p-2 text-muted-foreground">-</td>
                    <td className="p-2">Controlled open state</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2 font-mono">onOpenChange</td>
                    <td className="p-2 font-mono text-xs">(open: boolean) =&gt; void</td>
                    <td className="p-2 text-muted-foreground">-</td>
                    <td className="p-2">Open state change handler</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ToastViewport Props */}
        <section className="space-y-4">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">ToastViewport Props</h2>
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
                    <td className="p-2 font-mono">position</td>
                    <td className="p-2 font-mono text-xs">
                      'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
                    </td>
                    <td className="p-2 font-mono text-xs">'top-right'</td>
                    <td className="p-2">Position where toasts appear</td>
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
              <li>ARIA role: status for non-urgent, alert for errors</li>
              <li>ARIA attributes: aria-live, aria-atomic</li>
              <li>Keyboard accessible: Escape to dismiss (if dismissible)</li>
              <li>Focus management: Action button receives focus when present</li>
              <li>Respects prefers-reduced-motion for animations</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Toast instances */}
      <ToastViewport position="top-right" />
      <Toast
        variant="success"
        title="Success!"
        description="Your changes have been saved successfully."
        open={successOpen}
        onOpenChange={setSuccessOpen}
      />
      <Toast
        variant="error"
        title="Error"
        description="Something went wrong. Please try again."
        open={errorOpen}
        onOpenChange={setErrorOpen}
      />
      <Toast
        variant="warning"
        title="Warning"
        description="This action cannot be undone."
        open={warningOpen}
        onOpenChange={setWarningOpen}
      />
      <Toast
        variant="info"
        title="Information"
        description="A new version is available."
        open={infoOpen}
        onOpenChange={setInfoOpen}
      />
      <Toast
        variant="info"
        title="Action Required"
        description="Please review your settings."
        actionLabel="Review"
        onAction={() => {
          setActionOpen(false);
          alert('Action clicked!');
        }}
        open={actionOpen}
        onOpenChange={setActionOpen}
      />
      <Toast
        variant="success"
        title="Long Duration"
        description="This toast will stay for 10 seconds."
        duration={10000}
        open={customDurationOpen}
        onOpenChange={setCustomDurationOpen}
      />
      {/* Position examples - using different viewports */}
      {topLeftOpen && (
        <>
          <ToastViewport position="top-left" />
          <Toast
            variant="info"
            title="Top Left"
            description="Toast appears in top left corner"
            open={topLeftOpen}
            onOpenChange={setTopLeftOpen}
          />
        </>
      )}
      {topCenterOpen && (
        <>
          <ToastViewport position="top-center" />
          <Toast
            variant="info"
            title="Top Center"
            description="Toast appears in top center"
            open={topCenterOpen}
            onOpenChange={setTopCenterOpen}
          />
        </>
      )}
      {bottomLeftOpen && (
        <>
          <ToastViewport position="bottom-left" />
          <Toast
            variant="info"
            title="Bottom Left"
            description="Toast appears in bottom left corner"
            open={bottomLeftOpen}
            onOpenChange={setBottomLeftOpen}
          />
        </>
      )}
      {bottomRightOpen && (
        <>
          <ToastViewport position="bottom-right" />
          <Toast
            variant="info"
            title="Bottom Right"
            description="Toast appears in bottom right corner"
            open={bottomRightOpen}
            onOpenChange={setBottomRightOpen}
          />
        </>
      )}
      {bottomCenterOpen && (
        <>
          <ToastViewport position="bottom-center" />
          <Toast
            variant="info"
            title="Bottom Center"
            description="Toast appears in bottom center"
            open={bottomCenterOpen}
            onOpenChange={setBottomCenterOpen}
          />
        </>
      )}
    </ToastProvider>
  );
}
