'use client';

import { Alert, Button, ProgressBar } from '@fidus/ui';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessConfirmationPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Success Confirmation Patterns</h1>
        <p className="text-lg text-muted-foreground">
          Success confirmations provide positive feedback when operations complete successfully. Choose the right pattern based on importance, context, and required user attention.
        </p>
      </div>

      {/* When to Use */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">When to Use Each Pattern</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 text-left font-semibold">Pattern</th>
                <th className="p-3 text-left font-semibold">Use When</th>
                <th className="p-3 text-left font-semibold">Duration</th>
                <th className="p-3 text-left font-semibold">Importance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Toast</td>
                <td className="p-3">Quick, non-blocking confirmation of user actions</td>
                <td className="p-3">3-5 seconds</td>
                <td className="p-3">Low to Medium</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Alert (Inline)</td>
                <td className="p-3">Contextual success within a specific section</td>
                <td className="p-3">Until dismissed</td>
                <td className="p-3">Medium</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Banner</td>
                <td className="p-3">Page-level announcements or important milestones</td>
                <td className="p-3">Until dismissed</td>
                <td className="p-3">Medium to High</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Modal</td>
                <td className="p-3">Critical confirmations requiring user acknowledgment</td>
                <td className="p-3">Until dismissed</td>
                <td className="p-3">High</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Progress Bar</td>
                <td className="p-3">Show completion of long-running operations</td>
                <td className="p-3">Until 100%</td>
                <td className="p-3">Medium</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Toast Notifications */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Toast Notifications</h2>
          <p className="mb-4 text-muted-foreground">
            Use toasts for quick, non-blocking confirmations that don't require user action. They appear briefly and then disappear automatically.
          </p>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold">Examples</h3>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Budget saved successfully</h4>
            <p className="text-sm text-muted-foreground">
              Quick confirmation after saving changes to a budget.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Transaction added</h4>
            <p className="text-sm text-muted-foreground">
              Confirm transaction was recorded with undo action available.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Settings updated</h4>
            <p className="text-sm text-muted-foreground">
              Confirmation that preferences were saved successfully.
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <h4 className="mb-2 font-semibold">Best Practices</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>Auto-dismiss after 3-5 seconds for simple confirmations</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>Include undo action for destructive operations</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>Position in top-right for desktop, bottom-center for mobile</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Inline Success Messages */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Inline Success Messages (Alert)</h2>
          <p className="mb-4 text-muted-foreground">
            Use inline alerts to provide contextual success feedback within a specific section or form.
          </p>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold">Example: Form Submission Success</h3>
          <Alert variant="success" title="Budget Created Successfully">
            Your monthly budget for Groceries has been created. You can now start tracking expenses.
          </Alert>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold">Example: With Next Steps</h3>
          <Alert
            variant="success"
            title="Settings Saved"
          >
            <div className="mt-2 space-y-2">
              <p className="text-sm">Your notification preferences have been updated successfully.</p>
              <p className="text-sm font-medium">Next steps:</p>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>Check your email for a confirmation message</li>
                <li>Update your mobile app settings if needed</li>
              </ul>
            </div>
          </Alert>
        </div>
      </section>

      {/* Banner Announcements */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Banner Announcements</h2>
          <p className="mb-4 text-muted-foreground">
            Use banners for page-level success messages or important milestones that affect the entire application.
          </p>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold">Examples</h3>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Account Migration Complete</h4>
            <p className="text-sm text-muted-foreground">
              All your data has been successfully migrated to the new system. You can now access advanced features.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Monthly Goal Achieved</h4>
            <p className="text-sm text-muted-foreground">
              Congratulations! You stayed within budget for all categories this month.
            </p>
          </div>
        </div>
      </section>

      {/* Progress Completion */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Progress Completion States</h2>
          <p className="mb-4 text-muted-foreground">
            Show the completion of long-running operations with progress indicators that reach 100%.
          </p>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold">Example: Upload Complete</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing transactions...</span>
                <span className="font-medium text-success">Complete!</span>
              </div>
              <ProgressBar value={100} variant="success" />
              <p className="text-sm text-muted-foreground">
                Successfully imported 247 transactions from your bank statement.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold">Example: Multi-Step Form Completion</h3>
          <div className="space-y-4">
            <ProgressBar value={100} variant="success" label="Step 3 of 3" />
            <Alert variant="success" title="Budget Setup Complete">
              You've successfully set up budgets for all your expense categories. Start tracking your spending today!
            </Alert>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Best Practices</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 font-semibold text-success">Do</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                <span>Be specific about what succeeded</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                <span>Match importance to the confirmation type</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                <span>Provide next steps when appropriate</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                <span>Include undo options for reversible actions</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 font-semibold text-error">Don't</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-error">✕</span>
                <span>Use generic "Success!" messages</span>
              </li>
              <li className="flex gap-2">
                <span className="text-error">✕</span>
                <span>Show multiple confirmations for one action</span>
              </li>
              <li className="flex gap-2">
                <span className="text-error">✕</span>
                <span>Use modals for minor confirmations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-error">✕</span>
                <span>Auto-dismiss critical confirmations</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Writing Success Messages */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Writing Success Messages</h2>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-error">❌ Bad</h3>
              <div className="space-y-2 text-sm">
                <p className="rounded bg-muted p-2">"Success!"</p>
                <p className="rounded bg-muted p-2">"Operation completed"</p>
                <p className="rounded bg-muted p-2">"Done"</p>
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-success">✓ Good</h3>
              <div className="space-y-2 text-sm">
                <p className="rounded bg-muted p-2">"Budget saved successfully"</p>
                <p className="rounded bg-muted p-2">"Transaction added to Groceries"</p>
                <p className="rounded bg-muted p-2">"Import complete: 247 transactions added"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Accessibility</h2>
        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>
                <strong>ARIA Live Regions:</strong> Use <code className="rounded bg-muted px-1">aria-live="polite"</code> for toasts and alerts to announce success to screen readers
              </span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>
                <strong>Focus Management:</strong> Move focus to the success message for critical confirmations
              </span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>
                <strong>Keyboard Access:</strong> Ensure all actions (like undo) are keyboard accessible
              </span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span>
                <strong>Visual Indicators:</strong> Don't rely only on color - use icons and text
              </span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
