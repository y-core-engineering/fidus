'use client';

import { Toast, ToastProvider, ToastViewport, Button, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
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

  const toastProps = [
    {
      name: 'variant',
      type: "'success' | 'error' | 'warning' | 'info'",
      default: "'info'",
      description: 'Visual style of the toast',
    },
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Toast title',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Optional description text',
    },
    {
      name: 'duration',
      type: 'number',
      default: '5000',
      description: 'Auto-dismiss duration in milliseconds',
    },
    {
      name: 'dismissible',
      type: 'boolean',
      default: 'true',
      description: 'Whether toast can be manually dismissed',
    },
    {
      name: 'actionLabel',
      type: 'string',
      description: 'Label for action button',
    },
    {
      name: 'onAction',
      type: '() => void',
      description: 'Action button click handler',
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'Controlled open state',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Open state change handler',
    },
  ];

  const viewportProps = [
    {
      name: 'position',
      type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'",
      default: "'top-right'",
      description: 'Position where toasts appear',
    },
  ];

  return (
    <ToastProvider>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Toast</h1>
        <p className="lead">
          A non-blocking notification component that appears temporarily to provide feedback about an action or event.
        </p>

        <h2>Variants</h2>
        <ComponentPreview
          code={`<Button onClick={() => setSuccessOpen(true)}>Show Success</Button>`}
        >
          <Stack direction="horizontal" spacing="sm">
            <Button onClick={() => setSuccessOpen(true)}>Show Success</Button>
            <Button onClick={() => setErrorOpen(true)}>Show Error</Button>
            <Button onClick={() => setWarningOpen(true)}>Show Warning</Button>
            <Button onClick={() => setInfoOpen(true)}>Show Info</Button>
          </Stack>
        </ComponentPreview>

        <h2>Positions</h2>
        <ComponentPreview
          code={`<Button onClick={() => setTopLeftOpen(true)}>Top Left</Button>`}
        >
          <Stack direction="horizontal" spacing="sm">
            <Button onClick={() => setTopLeftOpen(true)}>Top Left</Button>
            <Button onClick={() => setTopCenterOpen(true)}>Top Center</Button>
            <Button onClick={() => setBottomLeftOpen(true)}>Bottom Left</Button>
            <Button onClick={() => setBottomRightOpen(true)}>Bottom Right</Button>
            <Button onClick={() => setBottomCenterOpen(true)}>Bottom Center</Button>
          </Stack>
        </ComponentPreview>

        <h2>With Action Button</h2>
        <ComponentPreview
          code={`<Toast
  variant="info"
  title="Action Required"
  description="Please review your settings."
  actionLabel="Review"
  onAction={() => alert('Action clicked!')}
  open={actionOpen}
  onOpenChange={setActionOpen}
/>`}
        >
          <Button onClick={() => setActionOpen(true)}>Show Toast with Action</Button>
        </ComponentPreview>

        <h2>Custom Duration</h2>
        <ComponentPreview
          code={`<Toast
  variant="success"
  title="Long Duration"
  description="This toast will stay for 10 seconds."
  duration={10000}
  open={customDurationOpen}
  onOpenChange={setCustomDurationOpen}
/>`}
        >
          <Button onClick={() => setCustomDurationOpen(true)}>Show Toast (10 seconds)</Button>
        </ComponentPreview>

        <h2>Setup</h2>
        <div className="not-prose my-lg">
          <p className="text-sm text-muted-foreground mb-md">
            Wrap your application with ToastProvider and add ToastViewport to enable toasts:
          </p>
          <pre className="rounded-lg bg-muted p-lg text-sm overflow-x-auto">
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

        <h2>Props</h2>
        <PropsTable props={toastProps} />

        <h2>ToastViewport Props</h2>
        <PropsTable props={viewportProps} />

        <h2>Usage Guidelines</h2>
        <div className="not-prose space-y-lg my-lg">
          <div>
            <h3 className="text-lg font-semibold mb-md">When to use</h3>
            <ul className="space-y-sm text-sm">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>To provide feedback after a user action (save, delete, update)</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>To display non-critical system notifications</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>For success confirmations that don't require user interaction</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>To show brief, contextual information that auto-dismisses</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-md">Best practices</h3>
            <ul className="space-y-sm text-sm">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Keep messages concise and actionable</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Use appropriate variants: success for confirmations, error for failures, warning for cautions, info for general notifications</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Set reasonable duration (3-7 seconds) based on message length</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Position toasts consistently across your application</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Limit to one or two toasts visible at once to avoid overwhelming users</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Include action buttons only when immediate user response is beneficial</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
            <ul className="space-y-sm text-sm">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Uses ARIA role: status for non-urgent notifications, alert for errors</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Includes ARIA attributes: aria-live and aria-atomic for screen reader announcements</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Keyboard accessible: Press Escape to dismiss (when dismissible)</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Focus management: Action button receives focus when present</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Respects prefers-reduced-motion for animations</span>
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
                <span>Use toasts for brief, non-critical feedback messages</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-success shrink-0">•</span>
                <span>Match variant to message type (success, error, warning, info)</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-success shrink-0">•</span>
                <span>Allow users to dismiss toasts manually</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-success shrink-0">•</span>
                <span>Keep message text concise and clear</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-success shrink-0">•</span>
                <span>Use consistent positioning across your app</span>
              </li>
            </ul>
            <div className="mt-md p-md bg-success/10 rounded-md">
              <ComponentPreview
                code={`<Toast
  variant="success"
  title="Changes saved"
  description="Your profile has been updated."
  open={true}
/>`}
              >
                <div className="text-sm text-muted-foreground">
                  (Click "Show Success" above to see example)
                </div>
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
                <span>Don't use toasts for critical information that requires acknowledgment (use dialog instead)</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-error shrink-0">•</span>
                <span>Don't show multiple toasts simultaneously if avoidable</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-error shrink-0">•</span>
                <span>Don't use very long messages that are hard to read quickly</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-error shrink-0">•</span>
                <span>Don't set extremely short durations that don't allow reading time</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-error shrink-0">•</span>
                <span>Don't use toasts for information users need to reference later</span>
              </li>
            </ul>
            <div className="mt-md p-md bg-error/20 rounded-md">
              <ComponentPreview
                code={`// ❌ BAD: Critical confirmation in toast
<Toast
  variant="error"
  title="Delete account?"
  description="This cannot be undone. Click here to confirm deletion of all your data and account."
  duration={5000}
/>`}
              >
                <div className="text-sm text-error">
                  Use a Dialog for critical confirmations, not a Toast
                </div>
              </ComponentPreview>
            </div>
          </div>
        </div>

        <h2>Related Components</h2>
        <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
          <Link
            href="/components/alert"
            className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
          >
            <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
              Alert
            </h3>
            <p className="text-sm text-muted-foreground">
              For persistent, inline notifications
            </p>
          </Link>
          <Link
            href="/components/dialog"
            className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
          >
            <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
              Dialog
            </h3>
            <p className="text-sm text-muted-foreground">
              For critical confirmations requiring user action
            </p>
          </Link>
          <Link
            href="/components/banner"
            className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
          >
            <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
              Banner
            </h3>
            <p className="text-sm text-muted-foreground">
              For page-level announcements and updates
            </p>
          </Link>
        </div>

        <h2>Resources</h2>
        <div className="not-prose my-lg">
          <ul className="space-y-md">
            <li>
              <Link
                variant="standalone"
                href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/toast/toast.tsx"
                external
                showIcon
              >
                View source on GitHub
              </Link>
            </li>
            <li>
              <Link
                variant="standalone"
                href="https://www.w3.org/WAI/ARIA/apg/patterns/alert/"
                external
                showIcon
              >
                ARIA: Alert Pattern
              </Link>
            </li>
            <li>
              <Link
                variant="standalone"
                href="https://www.radix-ui.com/primitives/docs/components/toast"
                external
                showIcon
              >
                Radix UI Toast Documentation
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
