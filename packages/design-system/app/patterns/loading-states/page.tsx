'use client';

import { ProgressBar, Button, Alert, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { useState } from 'react';

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
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Loading State Patterns</h1>
      <p className="lead">
        Loading states provide feedback during asynchronous operations. Choose the right pattern based on operation duration, progress visibility, and user context.
      </p>

      {/* When to Use */}
      <h2>When to Use Each Loading Pattern</h2>
      <div className="not-prose my-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-md text-left font-semibold">Pattern</th>
              <th className="p-md text-left font-semibold">Duration</th>
              <th className="p-md text-left font-semibold">Progress</th>
              <th className="p-md text-left font-semibold">Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Spinner</td>
              <td className="p-md">Short (under 2s)</td>
              <td className="p-md">Unknown</td>
              <td className="p-md text-muted-foreground">Quick API calls, saves</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Linear Progress</td>
              <td className="p-md">Medium (2-10s)</td>
              <td className="p-md">Known</td>
              <td className="p-md text-muted-foreground">File uploads, multi-step forms</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Circular Progress</td>
              <td className="p-md">Medium</td>
              <td className="p-md">Known</td>
              <td className="p-md text-muted-foreground">Background tasks, processing</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Skeleton Screen</td>
              <td className="p-md">Short to Medium</td>
              <td className="p-md">Unknown</td>
              <td className="p-md text-muted-foreground">Initial page load, list loading</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Progressive Disclosure</td>
              <td className="p-md">Long (10s+)</td>
              <td className="p-md">Incremental</td>
              <td className="p-md text-muted-foreground">Dashboard, infinite scroll</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Determinate Progress (Linear) */}
      <h2>Determinate Progress (Linear)</h2>
      <p className="text-sm text-muted-foreground">
        Use linear progress bars when you can track the exact progress of an operation. Show percentage and estimated time when possible.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">File Upload</h3>
          <ComponentPreview code={`const [uploadProgress, setUploadProgress] = useState(0);
const [isUploading, setIsUploading] = useState(false);

{isUploading && (
  <div className="space-y-sm">
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">Uploading budget-report.pdf</span>
      <span className="font-semibold">{uploadProgress}%</span>
    </div>
    <ProgressBar value={uploadProgress} variant="primary" showLabel={false} />
    <p className="text-xs text-muted-foreground">
      {uploadProgress < 100 ? 'Estimated time remaining: 5 seconds' : 'Upload complete!'}
    </p>
  </div>
)}`}>
            <div className="rounded-lg border border-border bg-card p-lg">
              <div className="mb-md">
                <Button onClick={simulateUpload} disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Start Upload'}
                </Button>
              </div>

              {isUploading && (
                <div className="space-y-sm">
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
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Multi-step Form Progress</h3>
          <ComponentPreview code={`<div className="space-y-sm">
  <div className="flex items-center justify-between text-sm">
    <span className="font-semibold">Step 2 of 5</span>
    <span className="text-muted-foreground">40% Complete</span>
  </div>
  <ProgressBar value={40} variant="primary" showLabel={false} />
  <p className="text-xs text-muted-foreground">Budget details</p>
</div>`}>
            <div className="rounded-lg border border-border bg-card p-lg">
              <div className="space-y-sm">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">Step 2 of 5</span>
                  <span className="text-muted-foreground">40% Complete</span>
                </div>
                <ProgressBar value={40} variant="primary" showLabel={false} />
                <p className="text-xs text-muted-foreground">Budget details</p>
              </div>
            </div>
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Data Processing</h3>
          <ComponentPreview code={`{isProcessing && (
  <div className="space-y-sm">
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">Processing transactions</span>
      <span className="font-semibold">{processingProgress}%</span>
    </div>
    <ProgressBar value={processingProgress} variant="success" showLabel={false} />
    <p className="text-xs text-muted-foreground">
      {processingProgress < 100
        ? \`\${Math.round((100 - processingProgress) / 5)} items remaining\`
        : 'Processing complete!'}
    </p>
  </div>
)}`}>
            <div className="rounded-lg border border-border bg-card p-lg">
              <div className="mb-md">
                <Button onClick={simulateProcessing} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Start Processing'}
                </Button>
              </div>

              {isProcessing && (
                <div className="space-y-sm">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Processing transactions</span>
                    <span className="font-semibold">{processingProgress}%</span>
                  </div>
                  <ProgressBar value={processingProgress} variant="success" showLabel={false} />
                  <p className="text-xs text-muted-foreground">
                    {processingProgress < 100
                      ? `${Math.round((100 - processingProgress) / 5)} items remaining`
                      : 'Processing complete!'}
                  </p>
                </div>
              )}
            </div>
          </ComponentPreview>
        </div>
      </div>

      {/* Indeterminate Progress */}
      <h2>Indeterminate Progress</h2>
      <p className="text-sm text-muted-foreground">
        Use indeterminate progress indicators when you cannot track exact progress or the operation is very quick.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">Indeterminate Linear Progress</h3>
          <ComponentPreview code={`{isLoading && (
  <div className="space-y-sm">
    <p className="text-sm text-muted-foreground">Loading budget data...</p>
    <ProgressBar indeterminate variant="primary" />
  </div>
)}`}>
            <div className="rounded-lg border border-border bg-card p-lg">
              <div className="mb-md">
                <Button onClick={simulateLoading} disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Start Loading'}
                </Button>
              </div>

              {isLoading && (
                <div className="space-y-sm">
                  <p className="text-sm text-muted-foreground">Loading budget data...</p>
                  <ProgressBar indeterminate variant="primary" />
                </div>
              )}
            </div>
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Inline Spinner (Button Loading State)</h3>
          <ComponentPreview code={`<Stack direction="horizontal" spacing="sm">
  <Button loading disabled>
    Saving...
  </Button>
  <Button variant="secondary" loading disabled>
    Processing...
  </Button>
</Stack>`}>
            <div className="rounded-lg border border-border bg-card p-lg">
              <Stack direction="horizontal" spacing="sm">
                <Button loading disabled>
                  Saving...
                </Button>
                <Button variant="secondary" loading disabled>
                  Processing...
                </Button>
              </Stack>
            </div>
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Section Loading</h3>
          <ComponentPreview code={`<div className="flex items-center justify-center py-xl">
  <div className="text-center">
    <div className="mb-sm flex justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
    <p className="text-sm text-muted-foreground">Loading budgets...</p>
  </div>
</div>`}>
            <div className="rounded-lg border border-border bg-card p-lg">
              <div className="flex items-center justify-center py-xl">
                <div className="text-center">
                  <div className="mb-sm flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Loading budgets...</p>
                </div>
              </div>
            </div>
          </ComponentPreview>
        </div>
      </div>

      {/* Skeleton Screens */}
      <h2>Skeleton Screens</h2>
      <p className="text-sm text-muted-foreground">
        Skeleton screens show the structure of the content before it loads, providing a smoother perceived loading experience.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">List Item Skeleton</h3>
          <ComponentPreview code={`<div className="space-y-md">
  {[1, 2, 3].map((i) => (
    <div key={i} className="flex items-center gap-md animate-pulse">
      <div className="h-12 w-12 rounded-full bg-muted" />
      <div className="flex-1 space-y-sm">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>
    </div>
  ))}
</div>`}>
            <div className="space-y-md rounded-lg border border-border bg-card p-lg">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-md animate-pulse">
                  <div className="h-12 w-12 rounded-full bg-muted" />
                  <div className="flex-1 space-y-sm">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Card Skeleton</h3>
          <ComponentPreview code={`<div className="rounded-lg border border-border bg-card p-lg animate-pulse">
  <div className="mb-md h-6 w-1/3 rounded bg-muted" />
  <div className="mb-sm h-4 w-full rounded bg-muted" />
  <div className="mb-sm h-4 w-5/6 rounded bg-muted" />
  <div className="mb-md h-4 w-4/6 rounded bg-muted" />
  <div className="h-10 w-32 rounded bg-muted" />
</div>`}>
            <div className="rounded-lg border border-border bg-card p-lg animate-pulse">
              <div className="mb-md h-6 w-1/3 rounded bg-muted" />
              <div className="mb-sm h-4 w-full rounded bg-muted" />
              <div className="mb-sm h-4 w-5/6 rounded bg-muted" />
              <div className="mb-md h-4 w-4/6 rounded bg-muted" />
              <div className="h-10 w-32 rounded bg-muted" />
            </div>
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Table Skeleton</h3>
          <ComponentPreview code={`<div className="animate-pulse">
  {/* Header */}
  <div className="mb-md flex gap-md">
    <div className="h-4 w-1/4 rounded bg-muted" />
    <div className="h-4 w-1/4 rounded bg-muted" />
    <div className="h-4 w-1/4 rounded bg-muted" />
    <div className="h-4 w-1/4 rounded bg-muted" />
  </div>
  {/* Rows */}
  {[1, 2, 3, 4].map((i) => (
    <div key={i} className="mb-md flex gap-md">
      <div className="h-3 w-1/4 rounded bg-muted" />
      <div className="h-3 w-1/4 rounded bg-muted" />
      <div className="h-3 w-1/4 rounded bg-muted" />
      <div className="h-3 w-1/4 rounded bg-muted" />
    </div>
  ))}
</div>`}>
            <div className="rounded-lg border border-border bg-card p-lg">
              <div className="animate-pulse">
                {/* Header */}
                <div className="mb-md flex gap-md">
                  <div className="h-4 w-1/4 rounded bg-muted" />
                  <div className="h-4 w-1/4 rounded bg-muted" />
                  <div className="h-4 w-1/4 rounded bg-muted" />
                  <div className="h-4 w-1/4 rounded bg-muted" />
                </div>
                {/* Rows */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="mb-md flex gap-md">
                    <div className="h-3 w-1/4 rounded bg-muted" />
                    <div className="h-3 w-1/4 rounded bg-muted" />
                    <div className="h-3 w-1/4 rounded bg-muted" />
                    <div className="h-3 w-1/4 rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          </ComponentPreview>
        </div>
      </div>

      {/* Progressive Disclosure */}
      <h2>Progressive Disclosure</h2>
      <p className="text-sm text-muted-foreground">
        Load content incrementally to show partial results quickly rather than blocking the entire page.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">Dashboard Loading (Incremental)</h3>
          <ComponentPreview code={`<div className="grid gap-md md:grid-cols-2">
  {/* Loaded Section */}
  <div className="rounded-lg border border-border bg-card p-lg">
    <h4 className="text-sm font-semibold mb-sm">Recent Transactions</h4>
    <ul className="space-y-sm text-sm text-muted-foreground">
      <li>Coffee - 4.50 EUR</li>
      <li>Groceries - 45.20 EUR</li>
      <li>Transport - 12.00 EUR</li>
    </ul>
  </div>

  {/* Loading Section */}
  <div className="rounded-lg border border-border bg-card p-lg">
    <div className="flex items-center justify-center py-md">
      <div className="text-center">
        <div className="mb-sm flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
        <p className="text-xs text-muted-foreground">Loading budgets...</p>
      </div>
    </div>
  </div>
</div>`}>
            <div className="grid gap-md md:grid-cols-2">
              {/* Loaded Section */}
              <div className="rounded-lg border border-border bg-card p-lg">
                <h4 className="text-sm font-semibold mb-sm">Recent Transactions</h4>
                <ul className="space-y-sm text-sm text-muted-foreground">
                  <li>Coffee - 4.50 EUR</li>
                  <li>Groceries - 45.20 EUR</li>
                  <li>Transport - 12.00 EUR</li>
                </ul>
              </div>

              {/* Loading Section */}
              <div className="rounded-lg border border-border bg-card p-lg">
                <div className="flex items-center justify-center py-md">
                  <div className="text-center">
                    <div className="mb-sm flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">Loading budgets...</p>
                  </div>
                </div>
              </div>
            </div>
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Infinite Scroll Loading</h3>
          <ComponentPreview code={`<div className="space-y-md">
  {items.map((item) => (
    <div key={item.id} className="rounded border border-border p-md">
      <p className="text-sm font-semibold">{item.title}</p>
      <p className="text-xs text-muted-foreground">{item.description}</p>
    </div>
  ))}
  {/* Loading indicator at bottom */}
  <div className="flex items-center justify-center py-md">
    <div className="flex items-center gap-sm text-sm text-muted-foreground">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
      <span>Loading more...</span>
    </div>
  </div>
</div>`}>
            <div className="rounded-lg border border-border bg-card p-lg">
              <div className="space-y-md">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded border border-border p-md">
                    <p className="text-sm font-semibold">Transaction {i}</p>
                    <p className="text-xs text-muted-foreground">Details for transaction {i}</p>
                  </div>
                ))}
                {/* Loading indicator at bottom */}
                <div className="flex items-center justify-center py-md">
                  <div className="flex items-center gap-sm text-sm text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
                    <span>Loading more...</span>
                  </div>
                </div>
              </div>
            </div>
          </ComponentPreview>
        </div>
      </div>

      {/* Optimistic UI Updates */}
      <h2>Optimistic UI Updates</h2>
      <p className="text-sm text-muted-foreground">
        Show the expected result immediately while the operation completes in the background. Revert on error.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">Optimistic Like/Favorite</h3>
          <ComponentPreview code={`const handleLike = async () => {
  // Optimistically update UI
  setIsLiked(true);

  try {
    await api.likeItem(itemId);
  } catch (error) {
    // Revert on error
    setIsLiked(false);
    showErrorToast('Failed to save favorite');
  }
};

<div className="flex items-center justify-between">
  <p className="text-sm">Budget: Groceries 2024</p>
  <Button variant="secondary" size="small">
    ★ Favorite
  </Button>
</div>`}>
            <div className="rounded-lg border border-border bg-card p-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm">Budget: Groceries 2024</p>
                <Button variant="secondary" size="small">
                  ★ Favorite
                </Button>
              </div>
              <p className="mt-sm text-xs text-muted-foreground">
                Clicking &quot;Favorite&quot; immediately shows the filled star while saving in background
              </p>
            </div>
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best Practice</h3>
          <Alert variant="info" title="Optimistic Status Toggle">
            When toggling states (complete/incomplete, active/inactive), update the UI immediately and show a subtle loading indicator. Revert only if the operation fails.
          </Alert>
        </div>
      </div>

      {/* Timeout Handling */}
      <h2>Timeout Handling</h2>
      <p className="text-sm text-muted-foreground">
        For long-running operations, provide feedback and allow users to cancel or take alternative actions.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">Long Operation with Cancel</h3>
          <ComponentPreview code={`<Alert variant="info" title="Processing transaction history">
  <p className="mb-md">This operation may take a few minutes for large datasets.</p>
  <div className="mb-md">
    <ProgressBar value={45} variant="primary" />
  </div>
  <Stack direction="horizontal" spacing="sm">
    <Button variant="secondary" size="small">
      Cancel
    </Button>
    <Button variant="secondary" size="small">
      Run in Background
    </Button>
  </Stack>
</Alert>`}>
            <Alert variant="info" title="Processing transaction history">
              <p className="mb-md">This operation may take a few minutes for large datasets.</p>
              <div className="mb-md">
                <ProgressBar value={45} variant="primary" />
              </div>
              <Stack direction="horizontal" spacing="sm">
                <Button variant="secondary" size="small">
                  Cancel
                </Button>
                <Button variant="secondary" size="small">
                  Run in Background
                </Button>
              </Stack>
            </Alert>
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Timeout with Retry</h3>
          <ComponentPreview code={`<Alert variant="error" title="Request timed out">
  <p className="mb-md">The operation is taking longer than expected.</p>
  <Stack direction="horizontal" spacing="sm">
    <Button variant="secondary" size="small">
      Retry
    </Button>
    <Button variant="secondary" size="small">
      Continue Waiting
    </Button>
  </Stack>
</Alert>`}>
            <Alert variant="error" title="Request timed out">
              <p className="mb-md">The operation is taking longer than expected.</p>
              <Stack direction="horizontal" spacing="sm">
                <Button variant="secondary" size="small">
                  Retry
                </Button>
                <Button variant="secondary" size="small">
                  Continue Waiting
                </Button>
              </Stack>
            </Alert>
          </ComponentPreview>
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
              <span>Show loading feedback for operations over 1 second</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use determinate progress when you can track exact progress</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use skeleton screens for initial page loads</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use progressive disclosure for dashboard or list loading</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use optimistic UI updates for user-triggered actions</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide cancel options for operations over 10 seconds</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Load content progressively rather than blocking entire page</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Disable buttons during loading to prevent duplicate submissions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show descriptive text with loading indicators</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use indeterminate progress for operations under 2 seconds</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Avoid spinners for operations under 300ms</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Loading states announced with aria-live=&quot;polite&quot;</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Progress bars use role=&quot;progressbar&quot; with aria-valuenow</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Loading spinners have aria-label describing the operation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Buttons indicate loading state with aria-busy=&quot;true&quot;</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard users can cancel long operations with Escape key</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Loading indicators meet WCAG AA contrast requirements</span>
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
              <span>Show loading feedback for operations over 1 second</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use determinate progress when possible (with percentage)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide cancel options for long operations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use skeleton screens for initial page loads</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview code={`<ProgressBar
  value={uploadProgress}
  variant="primary"
  showLabel={false}
/>
<p className="text-sm text-muted-foreground">
  Uploading budget-report.pdf - 45% complete
</p>`}>
              <div className="space-y-sm">
                <ProgressBar value={45} variant="primary" showLabel={false} />
                <p className="text-sm text-muted-foreground">
                  Uploading budget-report.pdf - 45% complete
                </p>
              </div>
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
              <span>Use generic &quot;Loading...&quot; without context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Block the entire UI for partial updates</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use spinners for operations under 300ms</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Show loading indicators without descriptive text</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/10 rounded-md">
            <ComponentPreview code={`<ProgressBar indeterminate variant="primary" />
<p className="text-sm text-muted-foreground">
  Loading...
</p>`}>
              <div className="space-y-sm">
                <ProgressBar indeterminate variant="primary" />
                <p className="text-sm text-muted-foreground">
                  Loading...
                </p>
              </div>
            </ComponentPreview>
          </div>
        </div>
      </div>

      {/* Performance Considerations */}
      <h2>Performance Considerations</h2>
      <div className="not-prose my-lg">
        <Alert variant="info" title="Perceived Performance">
          Users perceive loading times differently based on feedback. A 3-second load with a skeleton screen feels faster than a 2-second load with a blank screen.
        </Alert>

        <div className="rounded-lg border border-border bg-card p-lg mt-lg">
          <h3 className="font-semibold mb-md">Timing Guidelines</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="font-semibold shrink-0">Under 100ms:</span>
              <span>No loading indicator needed - feels instant</span>
            </li>
            <li className="flex gap-sm">
              <span className="font-semibold shrink-0">100-300ms:</span>
              <span>Optional subtle indicator (e.g., button state change)</span>
            </li>
            <li className="flex gap-sm">
              <span className="font-semibold shrink-0">300ms-1s:</span>
              <span>Show spinner or indeterminate progress</span>
            </li>
            <li className="flex gap-sm">
              <span className="font-semibold shrink-0">1-10s:</span>
              <span>Show determinate progress if possible, with context</span>
            </li>
            <li className="flex gap-sm">
              <span className="font-semibold shrink-0">Over 10s:</span>
              <span>Provide cancel option and consider background processing</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Related Components */}
      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/progress-bar"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Progress Bar
          </h3>
          <p className="text-sm text-muted-foreground">Linear progress indicators</p>
        </Link>

        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">Button loading states</p>
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
      </div>

      {/* Resources */}
      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/progress-indicators/"
              external
              showIcon
            >
              Nielsen Norman Group: Progress Indicators Make a Slow System Less Insufferable
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.lukew.com/ff/entry.asp?1797"
              external
              showIcon
            >
              Luke Wroblewski: Mobile Design Details - Avoid the Spinner
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/components/progress-bar">
              ProgressBar Component Documentation
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
