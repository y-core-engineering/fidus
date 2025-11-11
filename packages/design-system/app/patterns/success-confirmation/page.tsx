'use client';

import { Alert } from '@fidus/ui/alert';
import { Button } from '@fidus/ui/button';
import { ProgressBar } from '@fidus/ui/progress-bar';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessConfirmationPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Success Confirmation Patterns</h1>
      <p className="lead">
        Success confirmations provide positive feedback when operations complete successfully. Choose the right pattern based on importance, context, and required user attention.
      </p>

      {/* When to Use */}
      <h2>When to Use Each Pattern</h2>
      <div className="not-prose my-lg overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-md text-left font-semibold">Pattern</th>
              <th className="p-md text-left font-semibold">Use When</th>
              <th className="p-md text-left font-semibold">Duration</th>
              <th className="p-md text-left font-semibold">Importance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Toast</td>
              <td className="p-md">Quick, non-blocking confirmation of user actions</td>
              <td className="p-md">3-5 seconds</td>
              <td className="p-md">Low to Medium</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Alert (Inline)</td>
              <td className="p-md">Contextual success within a specific section</td>
              <td className="p-md">Until dismissed</td>
              <td className="p-md">Medium</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Banner</td>
              <td className="p-md">Page-level announcements or important milestones</td>
              <td className="p-md">Until dismissed</td>
              <td className="p-md">Medium to High</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Modal</td>
              <td className="p-md">Critical confirmations requiring user acknowledgment</td>
              <td className="p-md">Until dismissed</td>
              <td className="p-md">High</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Progress Bar</td>
              <td className="p-md">Show completion of long-running operations</td>
              <td className="p-md">Until 100%</td>
              <td className="p-md">Medium</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Toast Notifications */}
      <h2>Toast Notifications</h2>
      <p className="text-sm text-muted-foreground">
        Use toasts for quick, non-blocking confirmations that don&apos;t require user action. They appear briefly and then disappear automatically.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div className="rounded-lg border border-border bg-card p-lg">
          <h3 className="font-semibold mb-md">Common Use Cases</h3>

          <div className="space-y-md">
            <div>
              <h4 className="text-sm font-medium mb-xs">Budget saved successfully</h4>
              <p className="text-sm text-muted-foreground">
                Quick confirmation after saving changes to a budget.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-xs">Transaction added</h4>
              <p className="text-sm text-muted-foreground">
                Confirm transaction was recorded with undo action available.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-xs">Settings updated</h4>
              <p className="text-sm text-muted-foreground">
                Confirmation that preferences were saved successfully.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-lg">
          <h4 className="font-semibold mb-md">Best Practices</h4>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>Auto-dismiss after 3-5 seconds for simple confirmations</span>
            </li>
            <li className="flex gap-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>Include undo action for destructive operations</span>
            </li>
            <li className="flex gap-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>Position in top-right for desktop, bottom-center for mobile</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Inline Success Messages */}
      <h2>Inline Success Messages (Alert)</h2>
      <p className="text-sm text-muted-foreground">
        Use inline alerts to provide contextual success feedback within a specific section or form.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">Form Submission Success</h3>
          <ComponentPreview code={`<Alert variant="success" title="Budget Created Successfully">
  Your monthly budget for Groceries has been created. You can now start tracking expenses.
</Alert>`}>
            <Alert variant="success" title="Budget Created Successfully">
              Your monthly budget for Groceries has been created. You can now start tracking expenses.
            </Alert>
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">With Next Steps</h3>
          <ComponentPreview code={`<Alert variant="success" title="Settings Saved">
  <div className="space-y-sm">
    <p className="text-sm">Your notification preferences have been updated successfully.</p>
    <p className="text-sm font-medium">Next steps:</p>
    <ul className="list-disc space-y-xs pl-md text-sm">
      <li>Check your email for a confirmation message</li>
      <li>Update your mobile app settings if needed</li>
    </ul>
  </div>
</Alert>`}>
            <Alert variant="success" title="Settings Saved">
              <div className="space-y-sm">
                <p className="text-sm">Your notification preferences have been updated successfully.</p>
                <p className="text-sm font-medium">Next steps:</p>
                <ul className="list-disc space-y-xs pl-md text-sm">
                  <li>Check your email for a confirmation message</li>
                  <li>Update your mobile app settings if needed</li>
                </ul>
              </div>
            </Alert>
          </ComponentPreview>
        </div>
      </div>

      {/* Banner Announcements */}
      <h2>Banner Announcements</h2>
      <p className="text-sm text-muted-foreground">
        Use banners for page-level success messages or important milestones that affect the entire application.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div className="rounded-lg border border-border bg-card p-lg">
          <h3 className="font-semibold mb-md">Common Use Cases</h3>

          <div className="space-y-md">
            <div>
              <h4 className="text-sm font-medium mb-xs">Account Migration Complete</h4>
              <p className="text-sm text-muted-foreground">
                All your data has been successfully migrated to the new system. You can now access advanced features.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-xs">Monthly Goal Achieved</h4>
              <p className="text-sm text-muted-foreground">
                Congratulations! You stayed within budget for all categories this month.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Completion */}
      <h2>Progress Completion States</h2>
      <p className="text-sm text-muted-foreground">
        Show the completion of long-running operations with progress indicators that reach 100%.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">Upload Complete</h3>
          <ComponentPreview code={`<div className="space-y-sm">
  <div className="flex justify-between text-sm">
    <span>Importing transactions...</span>
    <span className="font-medium text-success">Complete!</span>
  </div>
  <ProgressBar value={100} variant="success" />
  <p className="text-sm text-muted-foreground">
    Successfully imported 247 transactions from your bank statement.
  </p>
</div>`}>
            <div className="space-y-sm">
              <div className="flex justify-between text-sm">
                <span>Importing transactions...</span>
                <span className="font-medium text-success">Complete!</span>
              </div>
              <ProgressBar value={100} variant="success" />
              <p className="text-sm text-muted-foreground">
                Successfully imported 247 transactions from your bank statement.
              </p>
            </div>
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Multi-Step Form Completion</h3>
          <ComponentPreview code={`<div className="space-y-md">
  <ProgressBar value={100} variant="success" label="Step 3 of 3" />
  <Alert variant="success" title="Budget Setup Complete">
    You've successfully set up budgets for all your expense categories. Start tracking your spending today!
  </Alert>
</div>`}>
            <div className="space-y-md">
              <ProgressBar value={100} variant="success" label="Step 3 of 3" />
              <Alert variant="success" title="Budget Setup Complete">
                You&apos;ve successfully set up budgets for all your expense categories. Start tracking your spending today!
              </Alert>
            </div>
          </ComponentPreview>
        </div>
      </div>

      {/* Writing Success Messages */}
      <h2>Writing Success Messages</h2>
      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        <div className="rounded-lg border border-error bg-error/5 p-lg">
          <h3 className="font-semibold text-error mb-md">❌ Bad</h3>
          <div className="space-y-sm text-sm">
            <p className="rounded bg-background p-sm border border-border">&quot;Success!&quot;</p>
            <p className="rounded bg-background p-sm border border-border">&quot;Operation completed&quot;</p>
            <p className="rounded bg-background p-sm border border-border">&quot;Done&quot;</p>
          </div>
          <p className="text-xs text-muted-foreground mt-md">
            Too vague - doesn&apos;t tell users what succeeded
          </p>
        </div>

        <div className="rounded-lg border border-success bg-success/5 p-lg">
          <h3 className="font-semibold text-success mb-md">✓ Good</h3>
          <div className="space-y-sm text-sm">
            <p className="rounded bg-background p-sm border border-border">&quot;Budget saved successfully&quot;</p>
            <p className="rounded bg-background p-sm border border-border">&quot;Transaction added to Groceries&quot;</p>
            <p className="rounded bg-background p-sm border border-border">&quot;Import complete: 247 transactions added&quot;</p>
          </div>
          <p className="text-xs text-muted-foreground mt-md">
            Specific and informative - users know exactly what happened
          </p>
        </div>
      </div>

      {/* Usage Guidelines */}
      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>After successful completion of user-initiated actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When important milestones are reached</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To confirm data has been saved or processed</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When providing next steps or follow-up actions</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Be specific about what succeeded</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Match importance to the confirmation type</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide next steps when appropriate</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Include undo options for reversible actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Auto-dismiss low-importance confirmations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep messages concise and actionable</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>
                <strong>ARIA Live Regions:</strong> Use aria-live=&quot;polite&quot; for toasts and alerts to announce success to screen readers
              </span>
            </li>
            <li className="flex gap-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>
                <strong>Focus Management:</strong> Move focus to the success message for critical confirmations
              </span>
            </li>
            <li className="flex gap-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>
                <strong>Keyboard Access:</strong> Ensure all actions (like undo) are keyboard accessible
              </span>
            </li>
            <li className="flex gap-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>
                <strong>Visual Indicators:</strong> Don&apos;t rely only on color - use icons and text
              </span>
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
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>Be specific about what succeeded</span>
            </li>
            <li className="flex gap-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>Match importance to the confirmation type</span>
            </li>
            <li className="flex gap-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>Provide next steps when appropriate</span>
            </li>
            <li className="flex gap-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>Include undo options for reversible actions</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview code={`<Alert variant="success" title="Budget saved successfully">
  Your changes have been saved. You can continue editing or return to the dashboard.
</Alert>`}>
              <Alert variant="success" title="Budget saved successfully">
                Your changes have been saved. You can continue editing or return to the dashboard.
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
              <span className="text-error shrink-0">✗</span>
              <span>Use generic &quot;Success!&quot; messages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">✗</span>
              <span>Show multiple confirmations for one action</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">✗</span>
              <span>Use modals for minor confirmations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">✗</span>
              <span>Auto-dismiss critical confirmations</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/10 rounded-md">
            <ComponentPreview code={`<Alert variant="success" title="Success!">
  Done.
</Alert>`}>
              <Alert variant="success" title="Success!">
                Done.
              </Alert>
            </ComponentPreview>
          </div>
        </div>
      </div>

      {/* Related Components */}
      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/toast"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Toast
          </h3>
          <p className="text-sm text-muted-foreground">Temporary notifications</p>
        </Link>

        <Link
          href="/components/alert"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Alert
          </h3>
          <p className="text-sm text-muted-foreground">Inline contextual messages</p>
        </Link>

        <Link
          href="/components/banner"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Banner
          </h3>
          <p className="text-sm text-muted-foreground">Page-level announcements</p>
        </Link>

        <Link
          href="/components/modal"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Modal
          </h3>
          <p className="text-sm text-muted-foreground">Critical confirmations</p>
        </Link>

        <Link
          href="/components/progress-bar"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Progress Bar
          </h3>
          <p className="text-sm text-muted-foreground">Completion indicators</p>
        </Link>
      </div>

      {/* Resources */}
      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/confirmation-dialog/"
              external
              showIcon
            >
              Nielsen Norman Group: Confirmation Dialog Design Best Practices
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/feedback-forms/"
              external
              showIcon
            >
              Nielsen Norman Group: Feedback and Confirmation Patterns
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
  );
}
