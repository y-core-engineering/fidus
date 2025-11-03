'use client';

import { ConfidenceIndicator, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { Check, X } from 'lucide-react';

export default function ConfidenceIndicatorPage() {
  const props = [
    {
      name: 'confidence',
      type: 'number',
      required: true,
      description: 'Confidence score between 0.0 and 1.0',
    },
    {
      name: 'variant',
      type: "'minimal' | 'detailed'",
      default: "'minimal'",
      required: false,
      description: 'Display variant: minimal (badge only) or detailed (progress bar + badge + label)',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      required: false,
      description: 'Size of the badge',
    },
    {
      name: 'showTooltip',
      type: 'boolean',
      default: 'true',
      required: false,
      description: 'Whether to show tooltip on hover',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      description: 'Additional CSS classes to apply',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Confidence Indicator</h1>
      <p className="lead">
        Visual display of ML confidence scores with color-coded badges and progress bars. Shows how certain the AI is about its predictions.
      </p>

      <h2>Variants</h2>

      <h3>Minimal</h3>
      <p>Shows only a percentage badge with color coding based on confidence level:</p>

      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md" align="center">
  <ConfidenceIndicator confidence={0.95} variant="minimal" />
  <ConfidenceIndicator confidence={0.7} variant="minimal" />
  <ConfidenceIndicator confidence={0.4} variant="minimal" />
  <ConfidenceIndicator confidence={0.2} variant="minimal" />
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" align="center">
          <ConfidenceIndicator confidence={0.95} variant="minimal" />
          <ConfidenceIndicator confidence={0.7} variant="minimal" />
          <ConfidenceIndicator confidence={0.4} variant="minimal" />
          <ConfidenceIndicator confidence={0.2} variant="minimal" />
        </Stack>
      </ComponentPreview>

      <h3>Detailed</h3>
      <p>Shows progress bar, badge, and confidence level label:</p>

      <ComponentPreview
        code={`<Stack direction="vertical" spacing="md">
  <ConfidenceIndicator confidence={0.92} variant="detailed" />
  <ConfidenceIndicator confidence={0.65} variant="detailed" />
  <ConfidenceIndicator confidence={0.35} variant="detailed" />
  <ConfidenceIndicator confidence={0.15} variant="detailed" />
</Stack>`}
      >
        <Stack direction="vertical" spacing="md">
          <ConfidenceIndicator confidence={0.92} variant="detailed" />
          <ConfidenceIndicator confidence={0.65} variant="detailed" />
          <ConfidenceIndicator confidence={0.35} variant="detailed" />
          <ConfidenceIndicator confidence={0.15} variant="detailed" />
        </Stack>
      </ComponentPreview>

      <h2>Confidence Levels</h2>
      <p>The component automatically maps confidence scores to color-coded levels:</p>

      <div className="not-prose my-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-sm px-md text-sm font-semibold">Range</th>
              <th className="text-left py-sm px-md text-sm font-semibold">Level</th>
              <th className="text-left py-sm px-md text-sm font-semibold">Color</th>
              <th className="text-left py-sm px-md text-sm font-semibold">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-sm px-md text-sm">0.8 - 1.0</td>
              <td className="py-sm px-md text-sm">Very Confident</td>
              <td className="py-sm px-md text-sm">
                <span className="text-success">Green (success)</span>
              </td>
              <td className="py-sm px-md text-sm">
                <ConfidenceIndicator confidence={0.9} variant="minimal" />
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-sm px-md text-sm">0.5 - 0.8</td>
              <td className="py-sm px-md text-sm">Confident</td>
              <td className="py-sm px-md text-sm">
                <span className="text-info">Blue (info)</span>
              </td>
              <td className="py-sm px-md text-sm">
                <ConfidenceIndicator confidence={0.65} variant="minimal" />
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-sm px-md text-sm">0.3 - 0.5</td>
              <td className="py-sm px-md text-sm">Learning</td>
              <td className="py-sm px-md text-sm">
                <span className="text-warning">Yellow (warning)</span>
              </td>
              <td className="py-sm px-md text-sm">
                <ConfidenceIndicator confidence={0.4} variant="minimal" />
              </td>
            </tr>
            <tr>
              <td className="py-sm px-md text-sm">0.0 - 0.3</td>
              <td className="py-sm px-md text-sm">Uncertain</td>
              <td className="py-sm px-md text-sm">
                <span className="text-muted-foreground">Gray (default)</span>
              </td>
              <td className="py-sm px-md text-sm">
                <ConfidenceIndicator confidence={0.2} variant="minimal" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Sizes</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md" align="center">
  <ConfidenceIndicator confidence={0.85} size="sm" />
  <ConfidenceIndicator confidence={0.85} size="md" />
  <ConfidenceIndicator confidence={0.85} size="lg" />
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" align="center">
          <ConfidenceIndicator confidence={0.85} size="sm" />
          <ConfidenceIndicator confidence={0.85} size="md" />
          <ConfidenceIndicator confidence={0.85} size="lg" />
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
              <span>Displaying ML model confidence scores</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Showing certainty of AI-suggested preferences</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Providing transparency in AI decision-making</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Helping users understand when to trust AI predictions</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use minimal variant for inline display (e.g., in suggestion chips)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use detailed variant when space allows for better visibility</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Always pass confidence values between 0.0 and 1.0</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep tooltips enabled for additional context</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Color is not the only indicator (percentage also shown)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Tooltips provide additional context on hover</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Uses semantic HTML and data attributes</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Text labels in detailed variant improve clarity</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do's and Don'ts</h2>

      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <Check className="h-5 w-5" /> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use minimal variant for compact UI (suggestion chips)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use detailed variant when explaining AI decisions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Pass confidence values between 0.0 and 1.0</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Keep tooltips enabled for user education</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<ConfidenceIndicator confidence={0.85} variant="detailed" />`}
            >
              <ConfidenceIndicator confidence={0.85} variant="detailed" />
            </ComponentPreview>
          </div>
        </div>

        <div className="border-2 border-error rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <X className="h-5 w-5" /> Don't
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use confidence values outside 0.0-1.0 range</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't show confidence scores without context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't disable tooltips unless absolutely necessary</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use for non-ML certainty indicators</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`// ❌ Wrong: confidence > 1.0
<ConfidenceIndicator confidence={1.5} />`}
            >
              <div className="text-sm text-error">Invalid confidence value</div>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/message-bubble"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Message Bubble
          </h3>
          <p className="text-sm text-muted-foreground">
            Chat message with AI suggestions
          </p>
        </Link>

        <Link
          href="/components/badge"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Badge
          </h3>
          <p className="text-sm text-muted-foreground">
            Status badge component used internally
          </p>
        </Link>

        <Link
          href="/components/progress-bar"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Progress Bar
          </h3>
          <p className="text-sm text-muted-foreground">
            Progress bar used in detailed variant
          </p>
        </Link>

        <Link
          href="/components/tooltip"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Tooltip
          </h3>
          <p className="text-sm text-muted-foreground">
            Tooltip for additional context
          </p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/confidence-indicator/confidence-indicator.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/ai-transparency/"
              external
              showIcon
            >
              Nielsen Norman Group: AI Transparency
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
