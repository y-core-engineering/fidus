'use client';

import { Alert, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { useState } from 'react';

export default function AlertPage() {
  const [dismissibleVisible, setDismissibleVisible] = useState(true);

  const props = [
    {
      name: 'variant',
      type: "'success' | 'error' | 'warning' | 'info'",
      default: "'info'",
      description: 'Visual style variant of the alert',
    },
    {
      name: 'title',
      type: 'string',
      description: 'Optional alert title',
    },
    {
      name: 'description',
      type: 'string',
      required: true,
      description: 'Alert message content',
    },
    {
      name: 'dismissible',
      type: 'boolean',
      default: 'false',
      description: 'Whether the alert can be dismissed',
    },
    {
      name: 'onDismiss',
      type: '() => void',
      description: 'Callback function when alert is dismissed',
    },
    {
      name: 'actions',
      type: "Array<{label: string, onClick: () => void}>",
      description: 'Action buttons to display in the alert',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Alert</h1>
      <p className="lead">
        A prominent message component used to communicate important information to users, with support for multiple variants and actions.
      </p>

      <h2>Variants</h2>
      <ComponentPreview
        code={`<Alert
  variant="success"
  description="Your changes have been saved successfully."
/>`}
      >
        <Alert
          variant="success"
          description="Your changes have been saved successfully."
        />
      </ComponentPreview>

      <ComponentPreview
        code={`<Alert
  variant="error"
  description="There was an error processing your request. Please try again."
/>`}
      >
        <Alert
          variant="error"
          description="There was an error processing your request. Please try again."
        />
      </ComponentPreview>

      <ComponentPreview
        code={`<Alert
  variant="warning"
  description="This action will permanently delete your account and cannot be undone."
/>`}
      >
        <Alert
          variant="warning"
          description="This action will permanently delete your account and cannot be undone."
        />
      </ComponentPreview>

      <ComponentPreview
        code={`<Alert
  variant="info"
  description="A new software update is available for download."
/>`}
      >
        <Alert
          variant="info"
          description="A new software update is available for download."
        />
      </ComponentPreview>

      <h2>With Title</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
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
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
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
        </Stack>
      </ComponentPreview>

      <h2>Dismissible</h2>
      <ComponentPreview
        code={`<Alert
  variant="info"
  title="Dismissible Alert"
  description="Click the X button to dismiss this alert."
  dismissible
  onDismiss={() => console.log('Alert dismissed')}
/>`}
      >
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
          <Stack direction="vertical" spacing="md" align="center">
            <p className="text-sm text-muted-foreground">Alert was dismissed</p>
            <Link
              variant="standalone"
              href="#"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                setDismissibleVisible(true);
              }}
            >
              Show Again
            </Link>
          </Stack>
        )}
      </ComponentPreview>

      <h2>With Action Buttons</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <Alert
    variant="info"
    title="Update Available"
    description="A new version of the application is available."
    actions={[
      { label: 'Update Now', onClick: () => console.log('Updating...') },
      { label: 'Remind Me Later', onClick: () => console.log('Reminder set') },
    ]}
  />
  <Alert
    variant="warning"
    title="Unsaved Changes"
    description="You have unsaved changes that will be lost if you leave this page."
    actions={[
      { label: 'Save Changes', onClick: () => console.log('Saving...') },
      { label: 'Discard', onClick: () => console.log('Discarded') },
    ]}
  />
  <Alert
    variant="error"
    title="Connection Lost"
    description="Unable to reach the server. Your changes may not be saved."
    actions={[
      { label: 'Retry Connection', onClick: () => console.log('Retrying...') }
    ]}
  />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
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
        </Stack>
      </ComponentPreview>

      <h2>Dismissible with Actions</h2>
      <ComponentPreview
        code={`<Alert
  variant="success"
  title="Account Created"
  description="Your account has been created successfully. Would you like to complete your profile?"
  dismissible
  actions={[
    { label: 'Complete Profile', onClick: () => console.log('Navigating to profile...') },
    { label: 'Skip', onClick: () => console.log('Skipped') },
  ]}
/>`}
      >
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
              <span>For important messages that require user attention or action</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To communicate system status, errors, warnings, or confirmations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When providing contextual information within a workflow</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For non-intrusive notifications that don't require immediate action</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use appropriate variant: success for confirmations, error for critical issues, warning for caution, info for general updates</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep messages concise and action-oriented</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide clear next steps through action buttons when needed</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Make alerts dismissible when they are informational and not critical</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Avoid showing multiple alerts at once - prioritize and consolidate</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Uses ARIA role="alert" for screen reader announcements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Icons provide visual reinforcement, not sole information source</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Action buttons are keyboard accessible (Tab, Enter/Space)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Dismiss button includes aria-label for screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Color is not the only indicator - icons and text convey meaning</span>
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
              <span>Use clear, specific messages that explain what happened</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Match variant to message severity (error for failures, success for confirmations)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide actionable next steps through buttons</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use dismissible alerts for non-critical information</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Alert
  variant="success"
  title="Payment Processed"
  description="Your payment of $49.99 has been successfully processed."
  dismissible
/>`}
            >
              <Alert
                variant="success"
                title="Payment Processed"
                description="Your payment of $49.99 has been successfully processed."
                dismissible
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
              <span>Don't use vague messages like "Something went wrong"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't mismatch variant and message (error variant with positive message)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't show critical errors as dismissible</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use alerts for promotional content or marketing</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Alert
  variant="error"
  description="Oops!"
  dismissible
/>`}
            >
              <Alert
                variant="error"
                description="Oops!"
                dismissible
              />
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/toast"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Toast</h3>
          <p className="text-sm text-muted-foreground">Temporary notification that appears and auto-dismisses</p>
        </Link>
        <Link
          href="/components/banner"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Banner</h3>
          <p className="text-sm text-muted-foreground">Page-level announcements and persistent messages</p>
        </Link>
        <Link
          href="/components/badge"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Badge</h3>
          <p className="text-sm text-muted-foreground">Small status indicators for inline use</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/alert/alert.tsx"
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
            <Link variant="standalone" href="/getting-started/for-developers">
              Installation guide
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
