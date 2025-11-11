'use client';

import { Banner } from '@fidus/ui/banner';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';
import { Button } from '@fidus/ui/button';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { useState } from 'react';

export default function BannerPage() {
  const [infoDismissible, setInfoDismissible] = useState(true);
  const [warningDismissible, setWarningDismissible] = useState(true);
  const [errorDismissible, setErrorDismissible] = useState(true);

  const props = [
    {
      name: 'variant',
      type: "'info' | 'warning' | 'error'",
      default: "'info'",
      description: 'Visual style variant of the banner',
    },
    {
      name: 'message',
      type: 'string',
      required: true,
      description: 'Banner message text',
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
      name: 'dismissible',
      type: 'boolean',
      default: 'true',
      description: 'Whether banner can be dismissed',
    },
    {
      name: 'onDismiss',
      type: '() => void',
      description: 'Callback when banner is dismissed',
    },
    {
      name: 'sticky',
      type: 'boolean',
      default: 'false',
      description: 'Whether banner sticks to top on scroll',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Banner</h1>
      <p className="lead">
        A prominent notification component that spans the full width of the container, typically used for important system-wide messages or announcements.
      </p>

      <h2>Variants</h2>
      <ComponentPreview code={`<Banner variant="info" message="This is an informational banner message." />`}>
        <Banner variant="info" message="This is an informational banner message." />
      </ComponentPreview>

      <ComponentPreview
        code={`<Banner
  variant="warning"
  message="This is a warning banner. Please review before proceeding."
/>`}
      >
        <Banner
          variant="warning"
          message="This is a warning banner. Please review before proceeding."
        />
      </ComponentPreview>

      <ComponentPreview
        code={`<Banner
  variant="error"
  message="This is an error banner. Immediate action required."
/>`}
      >
        <Banner
          variant="error"
          message="This is an error banner. Immediate action required."
        />
      </ComponentPreview>

      <h2>With Action Button</h2>
      <ComponentPreview
        code={`<Banner
  variant="info"
  message="A new version of the app is available."
  actionLabel="Update"
  onAction={() => alert('Updating...')}
/>`}
      >
        <Banner
          variant="info"
          message="A new version of the app is available."
          actionLabel="Update"
          onAction={() => alert('Updating...')}
        />
      </ComponentPreview>

      <ComponentPreview
        code={`<Banner
  variant="warning"
  message="Your free trial expires in 3 days."
  actionLabel="Upgrade Now"
  onAction={() => alert('Upgrading...')}
/>`}
      >
        <Banner
          variant="warning"
          message="Your free trial expires in 3 days."
          actionLabel="Upgrade Now"
          onAction={() => alert('Upgrading...')}
        />
      </ComponentPreview>

      <ComponentPreview
        code={`<Banner
  variant="error"
  message="Your session has expired. Please log in again."
  actionLabel="Log In"
  onAction={() => alert('Logging in...')}
/>`}
      >
        <Banner
          variant="error"
          message="Your session has expired. Please log in again."
          actionLabel="Log In"
          onAction={() => alert('Logging in...')}
        />
      </ComponentPreview>

      <h2>Dismissible</h2>
      <ComponentPreview
        code={`const [visible, setVisible] = useState(true);

{visible && (
  <Banner
    variant="info"
    message="This banner can be dismissed by clicking the X button."
    dismissible
    onDismiss={() => setVisible(false)}
  />
)}`}
      >
        <Stack direction="vertical" spacing="lg">
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
            <Stack direction="vertical" spacing="md" align="center" className="py-2xl">
              <p className="text-sm text-muted-foreground">All banners dismissed</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setInfoDismissible(true);
                  setWarningDismissible(true);
                  setErrorDismissible(true);
                }}
              >
                Show All Banners
              </Button>
            </Stack>
          )}
        </Stack>
      </ComponentPreview>

      <h2>Sticky Banner</h2>
      <ComponentPreview
        code={`<Banner
  variant="info"
  sticky
  message="This banner is sticky and stays at the top when scrolling."
  actionLabel="Dismiss"
  onAction={() => alert('Action clicked')}
/>`}
      >
        <Stack direction="vertical" spacing="lg">
          <p className="text-sm text-muted-foreground">
            Sticky banners remain at the top of the viewport when scrolling. Scroll down to see the effect.
          </p>
          <Banner
            variant="info"
            sticky
            message="This banner is sticky and stays at the top when scrolling."
            actionLabel="Dismiss"
            onAction={() => alert('Action clicked')}
          />
          <Stack direction="vertical" spacing="md">
            <p className="text-sm">Scroll down to see the sticky banner in action.</p>
            <div className="h-96 rounded-md border border-border bg-muted p-md">
              <p className="text-sm text-muted-foreground">
                This is placeholder content to demonstrate scrolling. The sticky banner should remain
                visible at the top of the viewport as you scroll through this content area.
              </p>
            </div>
          </Stack>
        </Stack>
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
              <span>For system-wide messages that affect the entire application</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For important announcements or updates that users should not miss</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For critical errors or warnings that require immediate attention</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For informational messages about ongoing processes or maintenance</span>
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
              <span>Use appropriate variant based on message severity (info, warning, error)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide clear action buttons for next steps when applicable</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Make banners dismissible unless they contain critical information</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use sticky banners sparingly to avoid obscuring content</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA role: banner for semantic meaning</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Clear visual indicators through color and icons</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible with Tab navigation and Enter/Space for actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Dismissible close button includes aria-label</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>High contrast colors meet WCAG AAA requirements</span>
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
              <span>Use clear, concise messaging that explains the situation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Match the variant to the severity (info for updates, error for critical issues)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide actionable next steps with clear button labels</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Allow users to dismiss non-critical banners</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Banner
  variant="warning"
  message="Your free trial expires in 3 days."
  actionLabel="Upgrade Now"
  onAction={() => handleUpgrade()}
  dismissible
/>`}
            >
              <Banner
                variant="warning"
                message="Your free trial expires in 3 days."
                actionLabel="Upgrade Now"
                onAction={() => alert('Upgrading...')}
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
              <span>Don't use vague messages without context or explanation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't stack multiple banners at once (prioritize the most important)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use error variant for non-critical messages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't make critical safety banners dismissible</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Stack direction="vertical" spacing="xs">
  <Banner variant="error" message="Error!" />
  <Banner variant="error" message="Something went wrong" />
  <Banner variant="error" message="Try again" />
</Stack>`}
            >
              <Stack direction="vertical" spacing="xs">
                <Banner variant="error" message="Error!" />
                <Banner variant="error" message="Something went wrong" />
                <Banner variant="error" message="Try again" />
              </Stack>
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
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Alert</h3>
          <p className="text-sm text-muted-foreground">For contextual feedback messages</p>
        </Link>
        <Link
          href="/components/toast"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Toast</h3>
          <p className="text-sm text-muted-foreground">For temporary notifications</p>
        </Link>
        <Link
          href="/components/badge"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Badge</h3>
          <p className="text-sm text-muted-foreground">For inline status indicators</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/banner/banner.tsx"
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
