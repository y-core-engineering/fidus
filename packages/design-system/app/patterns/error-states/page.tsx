'use client';

import { Alert } from '@fidus/ui/alert';
import { Banner } from '@fidus/ui/banner';
import { Modal } from '@fidus/ui/modal';
import { Toast, ToastProvider, ToastViewport } from '@fidus/ui/toast';
import { Button } from '@fidus/ui/button';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { useState } from 'react';

export default function ErrorStatesPage() {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showNetworkErrorToast, setShowNetworkErrorToast] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);

  return (
    <ToastProvider>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* Title and Lead Description */}
        <h1>Error State Patterns</h1>
        <p className="lead">
          Best practices for displaying errors in Fidus. Choose the right error display method based on severity, context, and user action required.
        </p>

        {/* When to Use - Decision Table */}
        <h2>When to Use Each Error Type</h2>
        <div className="not-prose my-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-md text-left font-semibold">Component</th>
                <th className="p-md text-left font-semibold">Severity</th>
                <th className="p-md text-left font-semibold">Use Case</th>
                <th className="p-md text-left font-semibold">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-md font-semibold">Toast</td>
                <td className="p-md">Low</td>
                <td className="p-md">Transient errors that auto-dismiss</td>
                <td className="p-md text-muted-foreground">Network timeout, save failed</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-md font-semibold">Alert (Inline)</td>
                <td className="p-md">Medium</td>
                <td className="p-md">Contextual errors within a section</td>
                <td className="p-md text-muted-foreground">Form validation, missing data</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-md font-semibold">Banner</td>
                <td className="p-md">High</td>
                <td className="p-md">Page-level errors requiring attention</td>
                <td className="p-md text-muted-foreground">Session expired, payment failed</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-md font-semibold">Modal</td>
                <td className="p-md">Critical</td>
                <td className="p-md">Blocking errors requiring immediate action</td>
                <td className="p-md text-muted-foreground">Data loss, security alert</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Inline Errors (Alert) */}
        <h2>Inline Errors (Alert Component)</h2>
        <p className="text-muted-foreground">
          Use inline alerts for contextual errors that relate to a specific section or form. These errors stay visible until the issue is resolved.
        </p>

        <div className="not-prose space-y-lg my-lg">
          {/* Form Validation Error */}
          <div>
            <h3 className="text-lg font-semibold mb-md">Form Validation Error</h3>
            <ComponentPreview
              code={`<Alert variant="error" title="Please correct the following errors:">
  <ul className="list-inside list-disc space-y-sm text-sm">
    <li>Email address is required</li>
    <li>Password must be at least 8 characters</li>
    <li>You must agree to the terms and conditions</li>
  </ul>
</Alert>`}
            >
              <Alert variant="error" title="Please correct the following errors:">
                <ul className="list-inside list-disc space-y-sm text-sm">
                  <li>Email address is required</li>
                  <li>Password must be at least 8 characters</li>
                  <li>You must agree to the terms and conditions</li>
                </ul>
              </Alert>
            </ComponentPreview>
          </div>

          {/* Missing Data Error */}
          <div>
            <h3 className="text-lg font-semibold mb-md">Missing Data Error</h3>
            <ComponentPreview
              code={`<Alert variant="error" title="Unable to load budget data">
  The budget information could not be retrieved. Please check your connection and try again.
</Alert>`}
            >
              <Alert variant="error" title="Unable to load budget data">
                The budget information could not be retrieved. Please check your connection and try again.
              </Alert>
            </ComponentPreview>
          </div>

          {/* Permission Error */}
          <div>
            <h3 className="text-lg font-semibold mb-md">Permission Error</h3>
            <ComponentPreview
              code={`<Alert variant="error" title="Access denied">
  You do not have permission to view this budget. Contact your administrator for access.
</Alert>`}
            >
              <Alert variant="error" title="Access denied">
                You do not have permission to view this budget. Contact your administrator for access.
              </Alert>
            </ComponentPreview>
          </div>
        </div>

        {/* Page-Level Errors (Banner) */}
        <h2>Page-Level Errors (Banner Component)</h2>
        <p className="text-muted-foreground">
          Use banners for important errors that affect the entire page or require immediate attention. Banners should be dismissible unless the error is critical.
        </p>

        <div className="not-prose space-y-lg my-lg">
          {/* Session Expired */}
          <div>
            <h3 className="text-lg font-semibold mb-md">Session Expired</h3>
            <ComponentPreview
              code={`<Banner
  variant="error"
  message="Your session has expired. Please log in again to continue using Fidus."
  dismissible
/>`}
            >
              <Banner
                variant="error"
                message="Your session has expired. Please log in again to continue using Fidus."
                dismissible
              />
            </ComponentPreview>
          </div>

          {/* Payment Failed */}
          <div>
            <h3 className="text-lg font-semibold mb-md">Payment Failed</h3>
            <ComponentPreview
              code={`<Banner
  variant="error"
  message="Payment processing failed. Please update your payment method and try again."
  dismissible
/>`}
            >
              <Banner
                variant="error"
                message="Payment processing failed. Please update your payment method and try again."
                dismissible
              />
            </ComponentPreview>
          </div>

          {/* System Error */}
          <div>
            <h3 className="text-lg font-semibold mb-md">System Error</h3>
            <ComponentPreview
              code={`<Banner
  variant="error"
  message="Service temporarily unavailable. We are experiencing technical difficulties. Please try again in a few minutes."
/>`}
            >
              <Banner
                variant="error"
                message="Service temporarily unavailable. We are experiencing technical difficulties. Please try again in a few minutes."
              />
            </ComponentPreview>
          </div>
        </div>

        {/* Modal Error Dialogs */}
        <h2>Modal Error Dialogs</h2>
        <p className="text-muted-foreground">
          Use modal dialogs for critical errors that block the user from continuing until they acknowledge or resolve the issue.
        </p>

        <div className="not-prose space-y-lg my-lg">
          {/* Critical Error Modal */}
          <div>
            <h3 className="text-lg font-semibold mb-md">Critical Error (Data Loss Warning)</h3>
            <ComponentPreview
              code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>
  Show Critical Error
</Button>

<Modal
  open={open}
  onOpenChange={setOpen}
  title="Data Loss Warning"
  footer={
    <Stack direction="horizontal" spacing="sm" justify="end">
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Go Back
      </Button>
      <Button variant="error" onClick={handleDiscard}>
        Discard Changes
      </Button>
    </Stack>
  }
>
  <p>
    You have unsaved changes that will be lost if you continue.
    Are you sure you want to discard these changes?
  </p>
</Modal>`}
            >
              <Button onClick={() => setShowErrorModal(true)}>
                Show Critical Error Modal
              </Button>
            </ComponentPreview>
          </div>

          {/* Validation Error Modal */}
          <div>
            <h3 className="text-lg font-semibold mb-md">Validation Error Modal</h3>
            <ComponentPreview
              code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>
  Show Validation Error
</Button>

<Modal
  open={open}
  onOpenChange={setOpen}
  title="Cannot Submit Form"
  footer={
    <Button variant="primary" onClick={() => setOpen(false)}>
      Review Form
    </Button>
  }
>
  <div>
    <p className="mb-md">
      The form cannot be submitted because of the following errors:
    </p>
    <ul className="list-inside list-disc space-y-sm text-sm">
      <li>Budget amount must be greater than zero</li>
      <li>Category is required</li>
      <li>Start date cannot be in the past</li>
    </ul>
  </div>
</Modal>`}
            >
              <Button onClick={() => setShowValidationModal(true)}>
                Show Validation Error Modal
              </Button>
            </ComponentPreview>
          </div>
        </div>

        {/* Modals rendered outside ComponentPreview for proper portal functionality */}
        <Modal
          open={showErrorModal}
          onOpenChange={setShowErrorModal}
          title="Data Loss Warning"
          footer={
            <Stack direction="horizontal" spacing="sm" justify="end">
              <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                Go Back
              </Button>
              <Button variant="destructive" onClick={() => setShowErrorModal(false)}>
                Discard Changes
              </Button>
            </Stack>
          }
        >
          <p>
            You have unsaved changes that will be lost if you continue. Are you sure you want to discard these changes?
          </p>
        </Modal>

        <Modal
          open={showValidationModal}
          onOpenChange={setShowValidationModal}
          title="Cannot Submit Form"
          footer={
            <Button variant="primary" onClick={() => setShowValidationModal(false)}>
              Review Form
            </Button>
          }
        >
          <div>
            <p className="mb-md">The form cannot be submitted because of the following errors:</p>
            <ul className="list-inside list-disc space-y-sm text-sm">
              <li>Budget amount must be greater than zero</li>
              <li>Category is required</li>
              <li>Start date cannot be in the past</li>
            </ul>
          </div>
        </Modal>

        {/* Toast Notifications */}
        <h2>Toast Notifications for Transient Errors</h2>
        <p className="text-muted-foreground">
          Use toast notifications for low-severity errors that auto-dismiss. These should not block the user and typically indicate recoverable issues.
        </p>

        <div className="not-prose space-y-lg my-lg">
          {/* Save Failed Toast */}
          <div>
            <h3 className="text-lg font-semibold mb-md">Save Failed</h3>
            <ComponentPreview
              code={`const [open, setOpen] = useState(false);

<ToastProvider>
  <Button onClick={() => setOpen(true)}>
    Show Save Failed Toast
  </Button>

  <Toast
    open={open}
    onOpenChange={setOpen}
    title="Save failed"
    description="Your changes could not be saved. Please try again."
    variant="error"
  />
  <ToastViewport />
</ToastProvider>`}
            >
              <Button onClick={() => setShowErrorToast(true)}>
                Show Save Failed Toast
              </Button>
            </ComponentPreview>
          </div>

          {/* Network Error Toast */}
          <div>
            <h3 className="text-lg font-semibold mb-md">Network Error</h3>
            <ComponentPreview
              code={`const [open, setOpen] = useState(false);

<ToastProvider>
  <Button onClick={() => setOpen(true)}>
    Show Network Error Toast
  </Button>

  <Toast
    open={open}
    onOpenChange={setOpen}
    title="Connection lost"
    description="Unable to connect to the server. Retrying..."
    variant="error"
  />
  <ToastViewport />
</ToastProvider>`}
            >
              <Button onClick={() => setShowNetworkErrorToast(true)}>
                Show Network Error Toast
              </Button>
            </ComponentPreview>
          </div>
        </div>

        {/* Toasts rendered at page level */}
        <Toast
          open={showErrorToast}
          onOpenChange={setShowErrorToast}
          title="Save failed"
          description="Your changes could not be saved. Please try again."
          variant="error"
        />

        <Toast
          open={showNetworkErrorToast}
          onOpenChange={setShowNetworkErrorToast}
          title="Connection lost"
          description="Unable to connect to the server. Retrying..."
          variant="error"
        />

        <ToastViewport position="top-right" />

        {/* Usage Guidelines */}
        <h2>Usage Guidelines</h2>
        <div className="not-prose space-y-lg my-lg">
          <div>
            <h3 className="text-lg font-semibold mb-md">When to use</h3>
            <ul className="space-y-sm text-sm">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>When a user action fails or cannot be completed</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>When data cannot be loaded or is unavailable</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>When validation rules are not met</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>When network or system errors occur</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>When user permissions prevent an action</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-md">Best practices</h3>
            <ul className="space-y-sm text-sm">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Explain what went wrong in plain language, avoiding technical jargon</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Provide clear next steps or recovery options</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Match error severity to the appropriate component (Toast, Alert, Banner, Modal)</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Preserve user input when errors occur to avoid data loss</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Show errors near the context where they occurred</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Include error codes for technical support when appropriate</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Distinguish between error states and empty states clearly</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
            <ul className="space-y-sm text-sm">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Error messages announced with aria-live="assertive" for critical errors</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Error dialogs trap focus until dismissed</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Error messages linked to form fields with aria-describedby</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Error icons have appropriate ARIA labels</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Keyboard users can dismiss errors with Escape key</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Error colors meet WCAG AA contrast requirements</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Error information is not conveyed by color alone</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Do's and Don'ts */}
        <h2 className="mt-2xl">Do&apos;s and Don&apos;ts</h2>

        <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
          {/* Do's */}
          <div className="border-2 border-success rounded-lg p-lg">
            <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
              <span className="text-2xl">✓</span> Do
            </h3>
            <ul className="space-y-md text-sm">
              <li className="flex gap-sm">
                <span className="text-success shrink-0">•</span>
                <span>Explain what went wrong: &quot;Unable to save budget. The amount exceeds your spending limit.&quot;</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-success shrink-0">•</span>
                <span>Provide actionable next steps: &quot;Please reduce the amount or increase your limit.&quot;</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-success shrink-0">•</span>
                <span>Use appropriate severity levels based on impact</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-success shrink-0">•</span>
                <span>Preserve user input to prevent data loss</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-success shrink-0">•</span>
                <span>Include error codes for support: &quot;Error PAY_001&quot;</span>
              </li>
            </ul>
            <div className="mt-md p-md bg-success/10 rounded-md">
              <ComponentPreview
                code={`<Alert variant="error" title="Unable to save budget">
  The amount exceeds your spending limit. Please reduce the amount or increase your limit in Settings.
</Alert>`}
              >
                <Alert variant="error" title="Unable to save budget">
                  The amount exceeds your spending limit. Please reduce the amount or increase your limit in Settings.
                </Alert>
              </ComponentPreview>
            </div>
          </div>

          {/* Don'ts */}
          <div className="border-2 border-error rounded-lg p-lg">
            <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
              <span className="text-2xl">✗</span> Don&apos;t
            </h3>
            <ul className="space-y-md text-sm">
              <li className="flex gap-sm">
                <span className="text-error shrink-0">•</span>
                <span>Use technical jargon: &quot;NullPointerException in BudgetService&quot;</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-error shrink-0">•</span>
                <span>Blame the user: &quot;You entered an invalid value&quot;</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-error shrink-0">•</span>
                <span>Show multiple error dialogs simultaneously</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-error shrink-0">•</span>
                <span>Use generic messages: &quot;Error occurred&quot;, &quot;Something went wrong&quot;</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-error shrink-0">•</span>
                <span>Auto-dismiss critical errors without acknowledgment</span>
              </li>
            </ul>
            <div className="mt-md p-md bg-error/10 rounded-md">
              <ComponentPreview
                code={`<Alert variant="error" title="Error">
  Something went wrong. Please try again.
</Alert>`}
              >
                <Alert variant="error" title="Error">
                  Something went wrong. Please try again.
                </Alert>
              </ComponentPreview>
            </div>
          </div>
        </div>

        {/* Related Components */}
        <h2>Related Components</h2>
        <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
          <Link
            href="/components/alert"
            className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
          >
            <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
              Alert
            </h3>
            <p className="text-sm text-muted-foreground">Inline contextual error messages</p>
          </Link>

          <Link
            href="/components/banner"
            className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
          >
            <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
              Banner
            </h3>
            <p className="text-sm text-muted-foreground">Page-level error notifications</p>
          </Link>

          <Link
            href="/components/modal"
            className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
          >
            <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
              Modal
            </h3>
            <p className="text-sm text-muted-foreground">Critical error dialogs</p>
          </Link>

          <Link
            href="/components/toast"
            className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
          >
            <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
              Toast
            </h3>
            <p className="text-sm text-muted-foreground">Transient error notifications</p>
          </Link>

          <Link
            href="/patterns/empty-states"
            className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
          >
            <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
              Empty States
            </h3>
            <p className="text-sm text-muted-foreground">When no errors occurred, just no data</p>
          </Link>

          <Link
            href="/patterns/form-validation"
            className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
          >
            <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
              Form Validation
            </h3>
            <p className="text-sm text-muted-foreground">Form-specific error handling</p>
          </Link>
        </div>

        {/* Resources */}
        <h2>Resources</h2>
        <div className="not-prose my-lg">
          <ul className="space-y-md">
            <li>
              <Link
                variant="standalone"
                href="https://www.nngroup.com/articles/error-message-guidelines/"
                external
                showIcon
              >
                Nielsen Norman Group: Error Message Guidelines
              </Link>
            </li>
            <li>
              <Link
                variant="standalone"
                href="https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html"
                external
                showIcon
              >
                WCAG 2.1: Error Identification
              </Link>
            </li>
            <li>
              <Link
                variant="standalone"
                href="https://www.w3.org/WAI/WCAG21/Understanding/error-suggestion.html"
                external
                showIcon
              >
                WCAG 2.1: Error Suggestion
              </Link>
            </li>
            <li>
              <Link variant="standalone" href="/components/alert">
                Alert Component Documentation
              </Link>
            </li>
            <li>
              <Link variant="standalone" href="/components/banner">
                Banner Component Documentation
              </Link>
            </li>
            <li>
              <Link variant="standalone" href="/components/modal">
                Modal Component Documentation
              </Link>
            </li>
            <li>
              <Link variant="standalone" href="/components/toast">
                Toast Component Documentation
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
    </ToastProvider>
  );
}
