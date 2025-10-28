'use client';

import { ProgressBar, CircularProgress } from '@fidus/ui';
import { Button } from '@fidus/ui';
import { useState } from 'react';

export default function ProgressBarPage() {
  const [linearProgress, setLinearProgress] = useState(30);
  const [circularProgress, setCircularProgress] = useState(60);

  const incrementProgress = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((prev) => (prev >= 100 ? 0 : prev + 10));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Progress Bar</h1>
        <p className="text-lg text-muted-foreground">
          Visual indicators for displaying the progress of a task or operation, available in both linear and circular variants.
        </p>
      </div>

      {/* Linear Progress - Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Linear Progress - Variants</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Primary (default)</p>
              <ProgressBar variant="primary" value={60} />
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Success</p>
              <ProgressBar variant="success" value={100} />
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Warning</p>
              <ProgressBar variant="warning" value={75} />
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Error</p>
              <ProgressBar variant="error" value={45} />
            </div>
          </div>
        </div>
      </section>

      {/* Linear Progress - Sizes */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Linear Progress - Sizes</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Small</p>
              <ProgressBar size="sm" value={60} />
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Medium (default)</p>
              <ProgressBar size="md" value={60} />
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Large</p>
              <ProgressBar size="lg" value={60} />
            </div>
          </div>
        </div>
      </section>

      {/* With Label and Percentage */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Label and Percentage</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <ProgressBar
              variant="primary"
              value={linearProgress}
              showLabel
              showPercentage
              label="Upload Progress"
            />
            <Button onClick={() => incrementProgress(setLinearProgress)}>
              Increment Progress
            </Button>
          </div>
        </div>
      </section>

      {/* Indeterminate */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Indeterminate Progress</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                Use indeterminate when progress cannot be calculated
              </p>
              <ProgressBar indeterminate label="Loading..." showLabel />
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Different variants</p>
              <div className="space-y-4">
                <ProgressBar variant="primary" indeterminate />
                <ProgressBar variant="success" indeterminate />
                <ProgressBar variant="warning" indeterminate />
                <ProgressBar variant="error" indeterminate />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Circular Progress - Basic */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Circular Progress - Variants</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap gap-8">
              <div className="text-center">
                <CircularProgress variant="primary" value={60} showPercentage />
                <p className="mt-2 text-sm text-muted-foreground">Primary</p>
              </div>
              <div className="text-center">
                <CircularProgress variant="success" value={100} showPercentage />
                <p className="mt-2 text-sm text-muted-foreground">Success</p>
              </div>
              <div className="text-center">
                <CircularProgress variant="warning" value={75} showPercentage />
                <p className="mt-2 text-sm text-muted-foreground">Warning</p>
              </div>
              <div className="text-center">
                <CircularProgress variant="error" value={45} showPercentage />
                <p className="mt-2 text-sm text-muted-foreground">Error</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Circular Progress - Sizes */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Circular Progress - Sizes</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap items-end gap-8">
              <div className="text-center">
                <CircularProgress size="sm" value={60} showPercentage />
                <p className="mt-2 text-sm text-muted-foreground">Small</p>
              </div>
              <div className="text-center">
                <CircularProgress size="md" value={60} showPercentage />
                <p className="mt-2 text-sm text-muted-foreground">Medium</p>
              </div>
              <div className="text-center">
                <CircularProgress size="lg" value={60} showPercentage />
                <p className="mt-2 text-sm text-muted-foreground">Large</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Circular Progress - Interactive */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Interactive Circular Progress</h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-8">
              <CircularProgress value={circularProgress} showPercentage variant="primary" />
              <Button onClick={() => incrementProgress(setCircularProgress)}>
                Increment Progress
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Circular Progress - Indeterminate */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Circular Indeterminate</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap gap-8">
              <div className="text-center">
                <CircularProgress variant="primary" indeterminate />
                <p className="mt-2 text-sm text-muted-foreground">Loading</p>
              </div>
              <div className="text-center">
                <CircularProgress variant="success" indeterminate />
                <p className="mt-2 text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Props Table - ProgressBar */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">ProgressBar Props</h2>
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
                  <td className="p-2 font-mono">value</td>
                  <td className="p-2 font-mono text-xs">number (0-100)</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Progress value (percentage)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">variant</td>
                  <td className="p-2 font-mono text-xs">
                    'primary' | 'success' | 'warning' | 'error'
                  </td>
                  <td className="p-2 font-mono text-xs">'primary'</td>
                  <td className="p-2">Visual style variant</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">size</td>
                  <td className="p-2 font-mono text-xs">'sm' | 'md' | 'lg'</td>
                  <td className="p-2 font-mono text-xs">'md'</td>
                  <td className="p-2">Size of the progress bar</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showLabel</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether to show label text</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showPercentage</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether to show percentage</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">label</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Label text to display</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">indeterminate</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Show indeterminate animation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Props Table - CircularProgress */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">CircularProgress Props</h2>
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
                  <td className="p-2 font-mono">value</td>
                  <td className="p-2 font-mono text-xs">number (0-100)</td>
                  <td className="p-2 font-mono text-xs">0</td>
                  <td className="p-2">Progress value (percentage)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">variant</td>
                  <td className="p-2 font-mono text-xs">
                    'primary' | 'success' | 'warning' | 'error'
                  </td>
                  <td className="p-2 font-mono text-xs">'primary'</td>
                  <td className="p-2">Visual style variant</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">size</td>
                  <td className="p-2 font-mono text-xs">'sm' | 'md' | 'lg'</td>
                  <td className="p-2 font-mono text-xs">'md'</td>
                  <td className="p-2">Size of circular progress</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showPercentage</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Show percentage in center</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">indeterminate</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Show spinning animation</td>
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
            <li>ARIA role: progressbar (for determinate) or status (for indeterminate)</li>
            <li>ARIA attributes: aria-valuenow, aria-valuemin, aria-valuemax</li>
            <li>Screen reader announcements: Progress updates are announced</li>
            <li>Semantic markup: Uses proper progress elements</li>
            <li>Color + text: Percentage shown in addition to color for accessibility</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
