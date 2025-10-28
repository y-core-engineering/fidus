'use client';

import { Alert, Banner, Modal, Toast, Button } from '@fidus/ui';
import { useState } from 'react';

export default function ErrorStatesPage() {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showNetworkErrorToast, setShowNetworkErrorToast] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Error State Patterns</h1>
        <p className="text-lg text-muted-foreground">
          Best practices for displaying errors in Fidus. Choose the right error display method based on severity, context, and user action required.
        </p>
      </div>

      {/* When to Use */}
      <section className="space-y-4">
        <h2 className="mb-4 text-2xl font-semibold">When to Use Each Error Type</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 text-left font-semibold">Component</th>
                <th className="p-3 text-left font-semibold">Severity</th>
                <th className="p-3 text-left font-semibold">Use Case</th>
                <th className="p-3 text-left font-semibold">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Toast</td>
                <td className="p-3">Low</td>
                <td className="p-3">Transient errors that auto-dismiss</td>
                <td className="p-3 text-muted-foreground">Network timeout, save failed</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Alert (Inline)</td>
                <td className="p-3">Medium</td>
                <td className="p-3">Contextual errors within a section</td>
                <td className="p-3 text-muted-foreground">Form validation, missing data</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Banner</td>
                <td className="p-3">High</td>
                <td className="p-3">Page-level errors requiring attention</td>
                <td className="p-3 text-muted-foreground">Session expired, payment failed</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Modal</td>
                <td className="p-3">Critical</td>
                <td className="p-3">Blocking errors requiring immediate action</td>
                <td className="p-3 text-muted-foreground">Data loss, security alert</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Inline Errors (Alert) */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Inline Errors (Alert Component)</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Use inline alerts for contextual errors that relate to a specific section or form. These errors stay visible until the issue is resolved.
          </p>

          <div className="space-y-6">
            {/* Form Validation Error */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Form Validation Error</h3>
              <Alert variant="error" title="Please correct the following errors:">
                <ul className="list-inside list-disc space-y-1 text-sm">
                  <li>Email address is required</li>
                  <li>Password must be at least 8 characters</li>
                  <li>You must agree to the terms and conditions</li>
                </ul>
              </Alert>
            </div>

            {/* Missing Data Error */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Missing Data Error</h3>
              <Alert variant="error" title="Unable to load budget data">
                The budget information could not be retrieved. Please check your connection and try again.
              </Alert>
            </div>

            {/* Permission Error */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Permission Error</h3>
              <Alert variant="error" title="Access denied">
                You do not have permission to view this budget. Contact your administrator for access.
              </Alert>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Implementation:</p>
            <pre className="overflow-x-auto text-xs">
{`<Alert variant="error" title="Please correct the following errors:">
  <ul className="list-inside list-disc space-y-1 text-sm">
    <li>Email address is required</li>
    <li>Password must be at least 8 characters</li>
  </ul>
</Alert>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Page-Level Errors (Banner) */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Page-Level Errors (Banner Component)</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Use banners for important errors that affect the entire page or require immediate attention. Banners should be dismissible unless the error is critical.
          </p>

          <div className="space-y-6">
            {/* Session Expired */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Session Expired</h3>
              <Banner variant="error" title="Your session has expired" dismissible>
                Please log in again to continue using Fidus.
              </Banner>
            </div>

            {/* Payment Failed */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Payment Failed</h3>
              <Banner variant="error" title="Payment processing failed" dismissible>
                Your payment could not be processed. Please update your payment method and try again.
              </Banner>
            </div>

            {/* System Error */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">System Error</h3>
              <Banner variant="error" title="Service temporarily unavailable">
                We are experiencing technical difficulties. Please try again in a few minutes.
              </Banner>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Implementation:</p>
            <pre className="overflow-x-auto text-xs">
{`<Banner variant="error" title="Your session has expired" dismissible>
  Please log in again to continue using Fidus.
</Banner>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Modal Errors */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Modal Error Dialogs</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Use modal dialogs for critical errors that block the user from continuing until they acknowledge or resolve the issue.
          </p>

          <div className="space-y-4">
            <Button onClick={() => setShowErrorModal(true)}>Show Critical Error Modal</Button>
            <Button onClick={() => setShowValidationModal(true)}>Show Validation Error Modal</Button>
          </div>

          <Modal
            isOpen={showErrorModal}
            onClose={() => setShowErrorModal(false)}
            title="Data Loss Warning"
            variant="error"
            actions={[
              {
                label: 'Discard Changes',
                onClick: () => setShowErrorModal(false),
                variant: 'error',
              },
              {
                label: 'Go Back',
                onClick: () => setShowErrorModal(false),
                variant: 'secondary',
              },
            ]}
          >
            <p>
              You have unsaved changes that will be lost if you continue. Are you sure you want to discard these changes?
            </p>
          </Modal>

          <Modal
            isOpen={showValidationModal}
            onClose={() => setShowValidationModal(false)}
            title="Cannot Submit Form"
            variant="error"
            actions={[
              {
                label: 'Review Form',
                onClick: () => setShowValidationModal(false),
                variant: 'primary',
              },
            ]}
          >
            <p className="mb-4">The form cannot be submitted because of the following errors:</p>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Budget amount must be greater than zero</li>
              <li>Category is required</li>
              <li>Start date cannot be in the past</li>
            </ul>
          </Modal>

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Implementation:</p>
            <pre className="overflow-x-auto text-xs">
{`<Modal
  isOpen={showErrorModal}
  onClose={() => setShowErrorModal(false)}
  title="Data Loss Warning"
  variant="error"
  actions={[
    {
      label: 'Discard Changes',
      onClick: handleDiscard,
      variant: 'error',
    },
    {
      label: 'Go Back',
      onClick: () => setShowErrorModal(false),
      variant: 'secondary',
    },
  ]}
>
  <p>
    You have unsaved changes that will be lost if you continue.
  </p>
</Modal>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Toast Notifications */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Toast Notifications for Transient Errors</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Use toast notifications for low-severity errors that auto-dismiss. These should not block the user and typically indicate recoverable issues.
          </p>

          <div className="space-y-4">
            <Button onClick={() => setShowErrorToast(true)}>Show Save Failed Toast</Button>
            <Button onClick={() => setShowNetworkErrorToast(true)}>Show Network Error Toast</Button>
          </div>

          {showErrorToast && (
            <Toast
              title="Save failed"
              description="Your changes could not be saved. Please try again."
              variant="error"
              onClose={() => setShowErrorToast(false)}
            />
          )}

          {showNetworkErrorToast && (
            <Toast
              title="Connection lost"
              description="Unable to connect to the server. Retrying..."
              variant="error"
              onClose={() => setShowNetworkErrorToast(false)}
            />
          )}

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Implementation:</p>
            <pre className="overflow-x-auto text-xs">
{`<Toast
  title="Save failed"
  description="Your changes could not be saved. Please try again."
  variant="error"
  onClose={() => setShowErrorToast(false)}
/>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Network Error Handling */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Network Error Handling</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Network errors require special handling based on the severity and user impact.
          </p>

          <div className="space-y-6">
            {/* Temporary Network Error */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Temporary Network Error (Auto-Retry)</h3>
              <Alert variant="error" title="Connection issue">
                Unable to sync your data. Retrying automatically...
              </Alert>
            </div>

            {/* Offline Mode */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Offline Mode</h3>
              <Banner variant="error" title="You are offline">
                You can continue working, but changes will be synced when your connection is restored.
              </Banner>
            </div>

            {/* API Error */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">API Error (500)</h3>
              <Alert variant="error" title="Server error">
                Something went wrong on our end. Our team has been notified. Please try again in a few minutes.
              </Alert>
            </div>
          </div>
        </div>
      </section>

      {/* Error vs Empty State */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Error State vs Empty State</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            It is important to distinguish between error states and empty states to avoid confusing users.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-error bg-error/5 p-6">
              <h3 className="mb-3 font-semibold text-error">Error State</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Something went wrong</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Data should exist but cannot be loaded</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>User action failed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Show error message and recovery options</span>
                </li>
              </ul>
              <div className="mt-4">
                <Alert variant="error" title="Failed to load budgets">
                  Unable to retrieve your budget data. Please try again.
                </Alert>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 font-semibold">Empty State</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Nothing is wrong</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>No data exists yet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>User has not created content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Show call-to-action to create content</span>
                </li>
              </ul>
              <div className="mt-4">
                <Alert variant="info" title="No budgets yet">
                  You have not created any budgets. Get started by creating your first budget.
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Best Practices</h2>

          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 font-semibold">✅ Do</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Explain what went wrong in plain language</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Provide clear next steps or recovery options</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Use appropriate severity (Toast for minor, Modal for critical)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Preserve user input when errors occur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Show errors near the context where they occurred</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Include error codes for technical support</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-error bg-error/5 p-6">
              <h3 className="mb-3 font-semibold text-error">❌ Don't</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Use technical jargon or stack traces</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Blame the user ("You entered an invalid value")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Show multiple error dialogs at once</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Use generic messages ("Error occurred")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Disable UI without explaining why</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Auto-dismiss errors without user acknowledgment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Accessibility</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Error messages announced with <code className="text-xs">aria-live="assertive"</code> for critical errors</li>
            <li>Error dialogs trap focus until dismissed</li>
            <li>Error messages linked to form fields with <code className="text-xs">aria-describedby</code></li>
            <li>Error icons have appropriate ARIA labels</li>
            <li>Keyboard users can dismiss errors with Escape key</li>
            <li>Error colors meet WCAG AA contrast requirements</li>
            <li>Error text is not conveyed by color alone</li>
          </ul>
        </div>
      </section>

      {/* Error Recovery Patterns */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Error Recovery Patterns</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Always provide users with clear paths to recover from errors.
          </p>

          <div className="space-y-6">
            {/* Retry */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Automatic Retry</h3>
              <Alert variant="error" title="Upload failed">
                <p className="mb-2">The file could not be uploaded due to a network error.</p>
                <Button variant="secondary" size="small">
                  Retry Upload
                </Button>
              </Alert>
            </div>

            {/* Contact Support */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Contact Support</h3>
              <Alert variant="error" title="Payment processing error">
                <p className="mb-2">We could not process your payment. Error code: PAY_001</p>
                <Button variant="secondary" size="small">
                  Contact Support
                </Button>
              </Alert>
            </div>

            {/* Alternative Action */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Alternative Action</h3>
              <Alert variant="error" title="Export unavailable">
                <p className="mb-2">The export feature is temporarily unavailable.</p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="small">
                    Copy Data
                  </Button>
                  <Button variant="secondary" size="small">
                    Print View
                  </Button>
                </div>
              </Alert>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
