'use client';

import { ProgressBar, CircularProgress } from '@fidus/ui/progress-bar';
import { Button } from '@fidus/ui/button';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { useState } from 'react';

export default function ProgressBarPage() {
  const [linearProgress, setLinearProgress] = useState(30);
  const [circularProgress, setCircularProgress] = useState(60);

  const incrementProgress = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((prev) => (prev >= 100 ? 0 : prev + 10));
  };

  const progressBarProps = [
    {
      name: 'value',
      type: 'number',
      description: 'Progress value (percentage, 0-100)',
    },
    {
      name: 'variant',
      type: "'primary' | 'success' | 'warning' | 'error'",
      default: "'primary'",
      description: 'Visual style variant',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the progress bar',
    },
    {
      name: 'showLabel',
      type: 'boolean',
      default: 'false',
      description: 'Whether to show label text',
    },
    {
      name: 'showPercentage',
      type: 'boolean',
      default: 'false',
      description: 'Whether to show percentage',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Label text to display',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      default: 'false',
      description: 'Show indeterminate animation',
    },
  ];

  const circularProgressProps = [
    {
      name: 'value',
      type: 'number',
      default: '0',
      description: 'Progress value (percentage, 0-100)',
    },
    {
      name: 'variant',
      type: "'primary' | 'success' | 'warning' | 'error'",
      default: "'primary'",
      description: 'Visual style variant',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of circular progress',
    },
    {
      name: 'showPercentage',
      type: 'boolean',
      default: 'false',
      description: 'Show percentage in center',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      default: 'false',
      description: 'Show spinning animation',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Progress Bar</h1>
      <p className="lead">
        Visual indicators for displaying the progress of a task or operation, available in both linear and circular variants.
      </p>

      <h2>Linear Progress - Variants</h2>
      <ComponentPreview code={`<ProgressBar variant="primary" value={60} />`}>
        <Stack direction="vertical" spacing="lg">
          <div>
            <p className="mb-sm text-sm text-muted-foreground">Primary (default)</p>
            <ProgressBar variant="primary" value={60} />
          </div>
          <div>
            <p className="mb-sm text-sm text-muted-foreground">Success</p>
            <ProgressBar variant="success" value={100} />
          </div>
          <div>
            <p className="mb-sm text-sm text-muted-foreground">Warning</p>
            <ProgressBar variant="warning" value={75} />
          </div>
          <div>
            <p className="mb-sm text-sm text-muted-foreground">Error</p>
            <ProgressBar variant="error" value={45} />
          </div>
        </Stack>
      </ComponentPreview>

      <h2>Linear Progress - Sizes</h2>
      <ComponentPreview code={`<ProgressBar size="md" value={60} />`}>
        <Stack direction="vertical" spacing="lg">
          <div>
            <p className="mb-sm text-sm text-muted-foreground">Small</p>
            <ProgressBar size="sm" value={60} />
          </div>
          <div>
            <p className="mb-sm text-sm text-muted-foreground">Medium (default)</p>
            <ProgressBar size="md" value={60} />
          </div>
          <div>
            <p className="mb-sm text-sm text-muted-foreground">Large</p>
            <ProgressBar size="lg" value={60} />
          </div>
        </Stack>
      </ComponentPreview>

      <h2>With Label and Percentage</h2>
      <ComponentPreview
        code={`<ProgressBar
  variant="primary"
  value={30}
  showLabel
  showPercentage
  label="Upload Progress"
/>`}
      >
        <Stack direction="vertical" spacing="lg">
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
        </Stack>
      </ComponentPreview>

      <h2>Indeterminate Progress</h2>
      <ComponentPreview code={`<ProgressBar indeterminate label="Loading..." showLabel />`}>
        <Stack direction="vertical" spacing="lg">
          <div>
            <p className="mb-sm text-sm text-muted-foreground">
              Use indeterminate when progress cannot be calculated
            </p>
            <ProgressBar indeterminate label="Loading..." showLabel />
          </div>
          <div>
            <p className="mb-sm text-sm text-muted-foreground">Different variants</p>
            <Stack direction="vertical" spacing="md">
              <ProgressBar variant="primary" indeterminate />
              <ProgressBar variant="success" indeterminate />
              <ProgressBar variant="warning" indeterminate />
              <ProgressBar variant="error" indeterminate />
            </Stack>
          </div>
        </Stack>
      </ComponentPreview>

      <h2>Circular Progress - Variants</h2>
      <ComponentPreview code={`<CircularProgress variant="primary" value={60} showPercentage />`}>
        <Stack direction="horizontal" spacing="xl" align="center">
          <div className="text-center">
            <CircularProgress variant="primary" value={60} showPercentage />
            <p className="mt-sm text-sm text-muted-foreground">Primary</p>
          </div>
          <div className="text-center">
            <CircularProgress variant="success" value={100} showPercentage />
            <p className="mt-sm text-sm text-muted-foreground">Success</p>
          </div>
          <div className="text-center">
            <CircularProgress variant="warning" value={75} showPercentage />
            <p className="mt-sm text-sm text-muted-foreground">Warning</p>
          </div>
          <div className="text-center">
            <CircularProgress variant="error" value={45} showPercentage />
            <p className="mt-sm text-sm text-muted-foreground">Error</p>
          </div>
        </Stack>
      </ComponentPreview>

      <h2>Circular Progress - Sizes</h2>
      <ComponentPreview code={`<CircularProgress size="md" value={60} showPercentage />`}>
        <Stack direction="horizontal" spacing="xl" align="end">
          <div className="text-center">
            <CircularProgress size="sm" value={60} showPercentage />
            <p className="mt-sm text-sm text-muted-foreground">Small</p>
          </div>
          <div className="text-center">
            <CircularProgress size="md" value={60} showPercentage />
            <p className="mt-sm text-sm text-muted-foreground">Medium</p>
          </div>
          <div className="text-center">
            <CircularProgress size="lg" value={60} showPercentage />
            <p className="mt-sm text-sm text-muted-foreground">Large</p>
          </div>
        </Stack>
      </ComponentPreview>

      <h2>Interactive Circular Progress</h2>
      <ComponentPreview code={`<CircularProgress value={60} showPercentage variant="primary" />`}>
        <Stack direction="horizontal" spacing="xl" align="center">
          <CircularProgress value={circularProgress} showPercentage variant="primary" />
          <Button onClick={() => incrementProgress(setCircularProgress)}>
            Increment Progress
          </Button>
        </Stack>
      </ComponentPreview>

      <h2>Circular Indeterminate</h2>
      <ComponentPreview code={`<CircularProgress variant="primary" indeterminate />`}>
        <Stack direction="horizontal" spacing="xl" align="center">
          <div className="text-center">
            <CircularProgress variant="primary" indeterminate />
            <p className="mt-sm text-sm text-muted-foreground">Loading</p>
          </div>
          <div className="text-center">
            <CircularProgress variant="success" indeterminate />
            <p className="mt-sm text-sm text-muted-foreground">Processing</p>
          </div>
        </Stack>
      </ComponentPreview>

      <h2>ProgressBar Props</h2>
      <PropsTable props={progressBarProps} />

      <h2>CircularProgress Props</h2>
      <PropsTable props={circularProgressProps} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For file uploads, downloads, or data processing operations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When showing completion of multi-step processes or forms</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use linear progress for horizontal layouts and longer durations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use circular progress for compact spaces or shorter operations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use indeterminate when duration or progress cannot be calculated</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Always provide clear labels describing what is in progress</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show percentage when users need precise progress information</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use success variant when task completes successfully</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use error variant to indicate failed operations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use warning variant for operations that need attention</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Update progress smoothly to avoid jarring jumps</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Uses ARIA role progressbar for determinate progress</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Uses ARIA role status for indeterminate progress</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Includes aria-valuenow, aria-valuemin, aria-valuemax attributes</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Screen readers announce progress updates automatically</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Combines color with text percentage for accessibility</span>
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
              <span>Provide clear labels describing what is in progress</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use indeterminate when progress cannot be calculated</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show percentage for operations where precision matters</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use success variant to confirm completed operations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Choose circular for compact spaces, linear for wider layouts</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<ProgressBar
  variant="success"
  value={100}
  showLabel
  showPercentage
  label="Upload Complete"
/>`}
            >
              <ProgressBar
                variant="success"
                value={100}
                showLabel
                showPercentage
                label="Upload Complete"
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
              <span>Don't show progress without explaining what is happening</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use determinate progress when duration is unknown</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't let progress bar jump backwards or freeze at 99%</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use progress bars for instant operations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't hide progress indicators before users see completion</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<ProgressBar value={35} />
{/* Missing label - unclear what is happening */}`}
            >
              <ProgressBar value={35} />
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/spinner"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Spinner
          </h3>
          <p className="text-sm text-muted-foreground">For simple loading states without progress</p>
        </Link>
        <Link
          href="/components/skeleton"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Skeleton
          </h3>
          <p className="text-sm text-muted-foreground">For placeholder content while loading</p>
        </Link>
        <Link
          href="/components/badge"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Badge
          </h3>
          <p className="text-sm text-muted-foreground">For status indicators and labels</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/progress-bar/progress-bar.tsx"
              external
              showIcon
            >
              View ProgressBar source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/progress-bar/circular-progress.tsx"
              external
              showIcon
            >
              View CircularProgress source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/meter/"
              external
              showIcon
            >
              ARIA: Meter Pattern
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
