'use client';

import { ConfidenceIndicator, MessageBubble, Link, Stack, type Message } from '@fidus/ui';
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

  const highConfidenceMessage: Message = {
    id: '1',
    role: 'assistant',
    content: "I noticed you mentioned a coffee preference! I'll remember that for you.",
    timestamp: new Date(),
    avatar: { fallback: 'AI' },
    suggestions: [
      {
        id: 'sug-1',
        text: 'cappuccino',
        confidence: 0.92,
        onAccept: () => console.log('Accepted'),
        onReject: () => console.log('Rejected'),
      },
    ],
  };

  const mediumConfidenceMessage: Message = {
    id: '2',
    role: 'assistant',
    content: "Based on our conversation, I think you might prefer tea.",
    timestamp: new Date(),
    avatar: { fallback: 'AI' },
    suggestions: [
      {
        id: 'sug-2',
        text: 'green tea',
        confidence: 0.68,
        onAccept: () => console.log('Accepted'),
        onReject: () => console.log('Rejected'),
      },
    ],
  };

  const lowConfidenceMessage: Message = {
    id: '3',
    role: 'assistant',
    content: "I'm not quite sure about your breakfast preference yet.",
    timestamp: new Date(),
    avatar: { fallback: 'AI' },
    suggestions: [
      {
        id: 'sug-3',
        text: 'croissant',
        confidence: 0.42,
        onAccept: () => console.log('Accepted'),
        onReject: () => console.log('Rejected'),
      },
    ],
  };

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Confidence Indicator</h1>
      <p className="lead">
        Visual display of ML confidence scores with color-coded badges and progress bars. Shows how certain the AI is about its predictions.
      </p>

      <h2>In Context: Chat Messages with Suggestions</h2>
      <p>
        The ConfidenceIndicator is most commonly used within suggestion chips in chat messages. Each suggestion shows a confidence badge indicating how certain the AI is about the detected preference.
      </p>

      <h3>High Confidence (92% - Green)</h3>
      <ComponentPreview
        code={`<MessageBubble
  id="1"
  role="assistant"
  content="I noticed you mentioned a coffee preference!"
  timestamp={new Date()}
  avatar={{ fallback: 'AI' }}
  suggestions={[{
    id: 'sug-1',
    text: 'cappuccino',
    confidence: 0.92, // Shows green badge
    onAccept: () => console.log('Accepted'),
    onReject: () => console.log('Rejected')
  }]}
/>`}
      >
        <div className="max-w-lg">
          <MessageBubble {...highConfidenceMessage} />
        </div>
      </ComponentPreview>

      <h3>Medium Confidence (68% - Blue)</h3>
      <ComponentPreview
        code={`<MessageBubble
  id="2"
  role="assistant"
  content="Based on our conversation, I think you might prefer tea."
  timestamp={new Date()}
  avatar={{ fallback: 'AI' }}
  suggestions={[{
    id: 'sug-2',
    text: 'green tea',
    confidence: 0.68, // Shows blue badge
    onAccept: () => console.log('Accepted'),
    onReject: () => console.log('Rejected')
  }]}
/>`}
      >
        <div className="max-w-lg">
          <MessageBubble {...mediumConfidenceMessage} />
        </div>
      </ComponentPreview>

      <h3>Low Confidence (42% - Yellow)</h3>
      <ComponentPreview
        code={`<MessageBubble
  id="3"
  role="assistant"
  content="I'm not quite sure about your breakfast preference yet."
  timestamp={new Date()}
  avatar={{ fallback: 'AI' }}
  suggestions={[{
    id: 'sug-3',
    text: 'croissant',
    confidence: 0.42, // Shows yellow badge
    onAccept: () => console.log('Accepted'),
    onReject: () => console.log('Rejected')
  }]}
/>`}
      >
        <div className="max-w-lg">
          <MessageBubble {...lowConfidenceMessage} />
        </div>
      </ComponentPreview>

      <h2>Variants</h2>

      <h3>Minimal (Default)</h3>
      <p>The minimal variant shows only a percentage badge with color coding. This is the default variant used in suggestion chips:</p>

      <ComponentPreview
        code={`<MessageBubble
  id="msg-1"
  role="assistant"
  content="I detected multiple preferences from your message!"
  timestamp={new Date()}
  avatar={{ fallback: 'AI' }}
  suggestions={[
    {
      id: 'sug-1',
      text: 'cappuccino',
      confidence: 0.95, // minimal variant (default)
      onAccept: () => console.log('Accepted'),
      onReject: () => console.log('Rejected')
    },
    {
      id: 'sug-2',
      text: 'oat milk',
      confidence: 0.7,
      onAccept: () => console.log('Accepted'),
      onReject: () => console.log('Rejected')
    }
  ]}
/>`}
      >
        <div className="max-w-lg">
          <MessageBubble
            id="msg-1"
            role="assistant"
            content="I detected multiple preferences from your message!"
            timestamp={new Date()}
            avatar={{ fallback: 'AI' }}
            suggestions={[
              {
                id: 'sug-1',
                text: 'cappuccino',
                confidence: 0.95,
                onAccept: () => console.log('Accepted'),
                onReject: () => console.log('Rejected'),
              },
              {
                id: 'sug-2',
                text: 'oat milk',
                confidence: 0.7,
                onAccept: () => console.log('Accepted'),
                onReject: () => console.log('Rejected'),
              },
            ]}
          />
        </div>
      </ComponentPreview>

      <h3>Detailed</h3>
      <p>The detailed variant shows a progress bar, badge, and confidence level label. This variant is used when rendering standalone ConfidenceIndicator components in settings or detailed views (not within MessageBubble suggestions):</p>

      <ComponentPreview
        code={`// Note: The detailed variant is NOT available within MessageBubble suggestions.
// It's used when rendering ConfidenceIndicator as a standalone component
// in settings pages or detailed preference views.

import { ConfidenceIndicator, Stack } from '@fidus/ui';

<Stack direction="vertical" spacing="md">
  <ConfidenceIndicator confidence={0.92} variant="detailed" />
  <ConfidenceIndicator confidence={0.65} variant="detailed" />
  <ConfidenceIndicator confidence={0.35} variant="detailed" />
</Stack>`}
      >
        <Stack direction="vertical" spacing="md">
          <ConfidenceIndicator confidence={0.92} variant="detailed" />
          <ConfidenceIndicator confidence={0.65} variant="detailed" />
          <ConfidenceIndicator confidence={0.35} variant="detailed" />
        </Stack>
      </ComponentPreview>

      <h2>Confidence Levels</h2>
      <p>The component automatically maps confidence scores to color-coded levels. See the examples above for how each level appears in context:</p>

      <div className="not-prose my-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-sm px-md text-sm font-semibold">Range</th>
              <th className="text-left py-sm px-md text-sm font-semibold">Level</th>
              <th className="text-left py-sm px-md text-sm font-semibold">Color</th>
              <th className="text-left py-sm px-md text-sm font-semibold">Description</th>
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
                AI is highly certain about this prediction
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-sm px-md text-sm">0.5 - 0.8</td>
              <td className="py-sm px-md text-sm">Confident</td>
              <td className="py-sm px-md text-sm">
                <span className="text-info">Blue (info)</span>
              </td>
              <td className="py-sm px-md text-sm">
                AI is reasonably confident about this prediction
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-sm px-md text-sm">0.3 - 0.5</td>
              <td className="py-sm px-md text-sm">Learning</td>
              <td className="py-sm px-md text-sm">
                <span className="text-warning">Yellow (warning)</span>
              </td>
              <td className="py-sm px-md text-sm">
                AI is still learning, prediction may be uncertain
              </td>
            </tr>
            <tr>
              <td className="py-sm px-md text-sm">0.0 - 0.3</td>
              <td className="py-sm px-md text-sm">Uncertain</td>
              <td className="py-sm px-md text-sm">
                <span className="text-muted-foreground">Gray (default)</span>
              </td>
              <td className="py-sm px-md text-sm">
                AI is uncertain, user confirmation recommended
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Sizes</h2>
      <p>The ConfidenceIndicator supports three sizes when used as a standalone component (not within MessageBubble suggestions):</p>

      <ComponentPreview
        code={`import { ConfidenceIndicator, Stack } from '@fidus/ui';

<Stack direction="horizontal" spacing="md" align="center">
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
              <span>Use within MessageBubble suggestions for proper context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use minimal variant for compact UI (suggestion chips)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use detailed variant when space allows for better visibility</span>
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
        </div>

        <div className="border-2 border-error rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <X className="h-5 w-5" /> Don't
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use standalone without MessageBubble context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use confidence values outside 0.0-1.0 range</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't show confidence scores without user-facing context</span>
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
