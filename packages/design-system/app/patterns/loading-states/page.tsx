'use client';

import { ProgressBar, Button, Alert } from '@fidus/ui';
import { useState, useEffect } from 'react';

export default function LoadingStatesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const simulateProcessing = () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setProcessingProgress(0);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Loading State Patterns</h1>
        <p className="text-lg text-muted-foreground">
          Loading states provide feedback during asynchronous operations. Choose the right pattern based on operation duration, progress visibility, and user context.
        </p>
      </div>

      {/* When to Use */}
      <section className="space-y-4">
        <h2 className="mb-4 text-2xl font-semibold">When to Use Each Loading Pattern</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 text-left font-semibold">Pattern</th>
                <th className="p-3 text-left font-semibold">Duration</th>
                <th className="p-3 text-left font-semibold">Progress</th>
                <th className="p-3 text-left font-semibold">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Spinner</td>
                <td className="p-3">Short (under 2s)</td>
                <td className="p-3">Unknown</td>
                <td className="p-3 text-muted-foreground">Quick API calls, saves</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Linear Progress</td>
                <td className="p-3">Medium (2-10s)</td>
                <td className="p-3">Known</td>
                <td className="p-3 text-muted-foreground">File uploads, multi-step forms</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Circular Progress</td>
                <td className="p-3">Medium</td>
                <td className="p-3">Known</td>
                <td className="p-3 text-muted-foreground">Background tasks, processing</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Skeleton Screen</td>
                <td className="p-3">Short to Medium</td>
                <td className="p-3">Unknown</td>
                <td className="p-3 text-muted-foreground">Initial page load, list loading</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Progressive Disclosure</td>
                <td className="p-3">Long (10s+)</td>
                <td className="p-3">Incremental</td>
                <td className="p-3 text-muted-foreground">Dashboard, infinite scroll</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Determinate Progress (Linear) */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Determinate Progress (Linear)</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Use linear progress bars when you can track the exact progress of an operation. Show percentage and estimated time when possible.
          </p>

          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">File Upload</h3>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4">
                  <Button onClick={simulateUpload} disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Start Upload'}
                  </Button>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Uploading budget-report.pdf</span>
                      <span className="font-semibold">{uploadProgress}%</span>
                    </div>
                    <ProgressBar value={uploadProgress} variant="primary" showLabel={false} />
                    <p className="text-xs text-muted-foreground">
                      {uploadProgress < 100 ? 'Estimated time remaining: 5 seconds' : 'Upload complete!'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Multi-step Form */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Multi-step Form Progress</h3>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">Step 2 of 5</span>
                    <span className="text-muted-foreground">40% Complete</span>
                  </div>
                  <ProgressBar value={40} variant="primary" showLabel={false} />
                  <p className="text-xs text-muted-foreground">Budget details</p>
                </div>
              </div>
            </div>

            {/* Data Processing */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Data Processing</h3>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4">
                  <Button onClick={simulateProcessing} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Start Processing'}
                  </Button>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Processing transactions</span>
                      <span className="font-semibold">{processingProgress}%</span>
                    </div>
                    <ProgressBar value={processingProgress} variant="success" showLabel={false} />
                    <p className="text-xs text-muted-foreground">
                      {processingProgress < 100 ? `${Math.round((100 - processingProgress) / 5)} items remaining` : 'Processing complete!'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Implementation:</p>
            <pre className="overflow-x-auto text-xs">
{`const [uploadProgress, setUploadProgress] = useState(0);

// Update progress as upload proceeds
const handleUpload = async (file: File) => {
  const xhr = new XMLHttpRequest();

  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percentComplete = (e.loaded / e.total) * 100;
      setUploadProgress(percentComplete);
    }
  });

  // ... upload logic
};

<ProgressBar value={uploadProgress} variant="primary" />`}
            </pre>
          </div>
        </div>
      </section>

      {/* Indeterminate Progress */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Indeterminate Progress</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Use indeterminate progress indicators when you cannot track exact progress or the operation is very quick.
          </p>

          <div className="space-y-6">
            {/* Indeterminate Linear */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Indeterminate Linear Progress</h3>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4">
                  <Button onClick={simulateLoading} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Start Loading'}
                  </Button>
                </div>

                {isLoading && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Loading budget data...</p>
                    <ProgressBar indeterminate variant="primary" />
                  </div>
                )}
              </div>
            </div>

            {/* Inline Spinner */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Inline Spinner (Button Loading State)</h3>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex gap-2">
                  <Button loading disabled>
                    Saving...
                  </Button>
                  <Button variant="secondary" loading disabled>
                    Processing...
                  </Button>
                </div>
              </div>
            </div>

            {/* Section Loading */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Section Loading</h3>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="mb-2 flex justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Loading budgets...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Implementation:</p>
            <pre className="overflow-x-auto text-xs">
{`// Indeterminate progress bar
<ProgressBar indeterminate variant="primary" />

// Button with loading state
<Button loading disabled>
  Saving...
</Button>

// Custom spinner
<div className="h-8 w-8 animate-spin rounded-full
              border-4 border-muted border-t-primary" />`}
            </pre>
          </div>
        </div>
      </section>

      {/* Skeleton Screens */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Skeleton Screens</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Skeleton screens show the structure of the content before it loads, providing a smoother perceived loading experience.
          </p>

          <div className="space-y-6">
            {/* List Skeleton */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">List Item Skeleton</h3>
              <div className="space-y-3 rounded-lg border border-border bg-card p-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-12 w-12 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-muted" />
                      <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Skeleton */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Card Skeleton</h3>
              <div className="rounded-lg border border-border bg-card p-6 animate-pulse">
                <div className="mb-4 h-6 w-1/3 rounded bg-muted" />
                <div className="mb-2 h-4 w-full rounded bg-muted" />
                <div className="mb-2 h-4 w-5/6 rounded bg-muted" />
                <div className="mb-4 h-4 w-4/6 rounded bg-muted" />
                <div className="h-10 w-32 rounded bg-muted" />
              </div>
            </div>

            {/* Table Skeleton */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Table Skeleton</h3>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="animate-pulse">
                  {/* Header */}
                  <div className="mb-4 flex gap-4">
                    <div className="h-4 w-1/4 rounded bg-muted" />
                    <div className="h-4 w-1/4 rounded bg-muted" />
                    <div className="h-4 w-1/4 rounded bg-muted" />
                    <div className="h-4 w-1/4 rounded bg-muted" />
                  </div>
                  {/* Rows */}
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="mb-3 flex gap-4">
                      <div className="h-3 w-1/4 rounded bg-muted" />
                      <div className="h-3 w-1/4 rounded bg-muted" />
                      <div className="h-3 w-1/4 rounded bg-muted" />
                      <div className="h-3 w-1/4 rounded bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Implementation:</p>
            <pre className="overflow-x-auto text-xs">
{`// Skeleton component
function SkeletonCard() {
  return (
    <div className="rounded-lg border p-6 animate-pulse">
      <div className="mb-4 h-6 w-1/3 rounded bg-muted" />
      <div className="mb-2 h-4 w-full rounded bg-muted" />
      <div className="mb-2 h-4 w-5/6 rounded bg-muted" />
      <div className="h-10 w-32 rounded bg-muted" />
    </div>
  );
}

// Usage
{isLoading ? (
  <SkeletonCard />
) : (
  <Card>{content}</Card>
)}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Progressive Disclosure */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Progressive Disclosure</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Load content incrementally to show partial results quickly rather than blocking the entire page.
          </p>

          <div className="space-y-6">
            {/* Dashboard Loading */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Dashboard Loading (Incremental)</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Loaded Section */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <h4 className="mb-2 text-sm font-semibold">Recent Transactions</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Coffee - 4.50 EUR</li>
                    <li>Groceries - 45.20 EUR</li>
                    <li>Transport - 12.00 EUR</li>
                  </ul>
                </div>

                {/* Loading Section */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-center justify-center py-4">
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground">Loading budgets...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Infinite Scroll */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Infinite Scroll Loading</h3>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded border border-border p-3">
                      <p className="text-sm font-semibold">Transaction {i}</p>
                      <p className="text-xs text-muted-foreground">Details for transaction {i}</p>
                    </div>
                  ))}
                  {/* Loading indicator at bottom */}
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
                      <span>Loading more...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optimistic UI Updates */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Optimistic UI Updates</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Show the expected result immediately while the operation completes in the background. Revert on error.
          </p>

          <div className="space-y-6">
            {/* Like Button */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Optimistic Like/Favorite</h3>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Budget: Groceries 2024</p>
                  <Button variant="secondary" size="small">
                    ★ Favorite
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Clicking "Favorite" immediately shows the filled star while saving in background
                </p>
              </div>
            </div>

            {/* Status Toggle */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Optimistic Status Toggle</h3>
              <Alert variant="info" title="Best Practice">
                When toggling states (complete/incomplete, active/inactive), update the UI immediately and show a subtle loading indicator. Revert only if the operation fails.
              </Alert>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Implementation:</p>
            <pre className="overflow-x-auto text-xs">
{`const [isLiked, setIsLiked] = useState(false);

const handleLike = async () => {
  // Optimistically update UI
  setIsLiked(true);

  try {
    await api.likeItem(itemId);
    // Success - UI already updated
  } catch (error) {
    // Revert on error
    setIsLiked(false);
    showErrorToast('Failed to save favorite');
  }
};`}
            </pre>
          </div>
        </div>
      </section>

      {/* Timeout Handling */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Timeout Handling</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            For long-running operations, provide feedback and allow users to cancel or take alternative actions.
          </p>

          <div className="space-y-6">
            {/* Long Operation */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Long Operation with Cancel</h3>
              <Alert variant="info" title="Processing transaction history">
                <p className="mb-4">This operation may take a few minutes for large datasets.</p>
                <div className="mb-4">
                  <ProgressBar value={45} variant="primary" />
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="small">
                    Cancel
                  </Button>
                  <Button variant="secondary" size="small">
                    Run in Background
                  </Button>
                </div>
              </Alert>
            </div>

            {/* Timeout Error */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Timeout with Retry</h3>
              <Alert variant="error" title="Request timed out">
                <p className="mb-4">The operation is taking longer than expected.</p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="small">
                    Retry
                  </Button>
                  <Button variant="secondary" size="small">
                    Continue Waiting
                  </Button>
                </div>
              </Alert>
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
                  <span>Show loading feedback for operations over 1 second</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Use determinate progress when possible (with percentage)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Provide cancel options for long operations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Use skeleton screens for initial page loads</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Load content progressively rather than blocking entire page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Disable buttons during loading to prevent duplicate submissions</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-error bg-error/5 p-6">
              <h3 className="mb-3 font-semibold text-error">❌ Don't</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Use generic "Loading..." without context</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Block the entire UI for partial updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Use spinners for operations under 300ms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Show loading indicators without descriptive text</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Use indeterminate progress for file uploads (use determinate)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Leave users waiting indefinitely without timeout handling</span>
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
            <li>Loading states announced with <code className="text-xs">aria-live="polite"</code></li>
            <li>Progress bars use <code className="text-xs">role="progressbar"</code> with <code className="text-xs">aria-valuenow</code></li>
            <li>Loading spinners have <code className="text-xs">aria-label</code> describing the operation</li>
            <li>Buttons indicate loading state with <code className="text-xs">aria-busy="true"</code></li>
            <li>Keyboard users can cancel long operations with Escape key</li>
            <li>Screen readers announce progress updates at reasonable intervals</li>
            <li>Loading indicators meet WCAG AA contrast requirements</li>
          </ul>
        </div>
      </section>

      {/* Performance Considerations */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Performance Considerations</h2>
          <div className="space-y-4">
            <Alert variant="info" title="Perceived Performance">
              Users perceive loading times differently based on feedback. A 3-second load with a skeleton screen feels faster than a 2-second load with a blank screen.
            </Alert>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 font-semibold">Timing Guidelines</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">Under 100ms:</span>
                  <span>No loading indicator needed - feels instant</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">100-300ms:</span>
                  <span>Optional subtle indicator (e.g., button state change)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">300ms-1s:</span>
                  <span>Show spinner or indeterminate progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">1-10s:</span>
                  <span>Show determinate progress if possible, with context</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">Over 10s:</span>
                  <span>Provide cancel option and consider background processing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
