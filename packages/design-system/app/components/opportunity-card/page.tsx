'use client';

import { OpportunityCard, Badge, Stack, Link } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { AlertCircle, DollarSign, Calendar, Plane } from 'lucide-react';

export default function OpportunityCardPage() {
  const props = [
    {
      name: 'title',
      type: 'string',
      default: '-',
      description: 'Card title displayed in the header',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      default: 'undefined',
      description: 'Icon displayed before the title',
    },
    {
      name: 'urgency',
      type: "'urgent' | 'important' | 'normal' | 'low'",
      default: "'normal'",
      description: 'Urgency level affecting border and header styling',
    },
    {
      name: 'privacyBadge',
      type: 'string',
      default: 'undefined',
      description: 'Privacy indicator text (e.g., "🔒 Local")',
    },
    {
      name: 'onClose',
      type: '() => void',
      default: 'undefined',
      description: 'Callback when close button is clicked',
    },
    {
      name: 'onDismiss',
      type: '() => void',
      default: 'undefined',
      description: 'Callback when card is dismissed via swipe gesture',
    },
    {
      name: 'visual',
      type: 'ReactNode',
      default: 'undefined',
      description: 'Optional visual element (chart, progress bar, etc.)',
    },
    {
      name: 'context',
      type: 'string',
      default: 'undefined',
      description: 'Context explanation with "Why now?" reasoning',
    },
    {
      name: 'primaryAction',
      type: '{ label: string; onClick: () => void }',
      default: 'undefined',
      description: 'Primary action button configuration',
    },
    {
      name: 'secondaryAction',
      type: '{ label: string; onClick: () => void }',
      default: 'undefined',
      description: 'Secondary action button configuration',
    },
    {
      name: 'children',
      type: 'ReactNode',
      default: '-',
      description: 'Main content of the card body',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Opportunity Card</h1>
      <p className="lead">
        Proactive information surfacing cards for the Fidus dashboard. OpportunityCards display
        AI-detected opportunities with urgency indicators, privacy badges, and contextual actions.
      </p>

      <h2>Basic Example</h2>
      <ComponentPreview
        code={`<OpportunityCard
  title="Budget Alert"
  icon={<DollarSign className="h-5 w-5" />}
  urgency="important"
  privacyBadge="🔒 Local"
  onClose={() => console.log('Closed')}
  primaryAction={{
    label: 'View Transactions',
    onClick: () => console.log('View clicked'),
  }}
  secondaryAction={{
    label: 'Adjust Budget',
    onClick: () => console.log('Adjust clicked'),
  }}
  context="Month-end approaching, spending high"
>
  <Stack spacing="sm">
    <p><strong>Food: 475 EUR / 500 EUR</strong></p>
    <p className="text-sm text-muted-foreground">3 days remaining in month</p>
  </Stack>
</OpportunityCard>`}
      >
        <OpportunityCard
          title="Budget Alert"
          icon={<DollarSign className="h-5 w-5" />}
          urgency="important"
          privacyBadge="🔒 Local"
          onClose={() => console.log('Closed')}
          primaryAction={{
            label: 'View Transactions',
            onClick: () => console.log('View clicked'),
          }}
          secondaryAction={{
            label: 'Adjust Budget',
            onClick: () => console.log('Adjust clicked'),
          }}
          context="Month-end approaching, spending high"
        >
          <Stack spacing="sm">
            <p><strong>Food: 475 EUR / 500 EUR</strong></p>
            <p className="text-sm text-muted-foreground">3 days remaining in month</p>
          </Stack>
        </OpportunityCard>
      </ComponentPreview>

      <h2>Urgency Levels</h2>
      <ComponentPreview
        code={`<Stack spacing="md">
  <OpportunityCard
    title="Critical Issue"
    icon={<AlertCircle className="h-5 w-5" />}
    urgency="urgent"
  >
    Urgent attention required immediately.
  </OpportunityCard>

  <OpportunityCard
    title="Important Notice"
    icon={<AlertCircle className="h-5 w-5" />}
    urgency="important"
  >
    Important information that needs attention soon.
  </OpportunityCard>

  <OpportunityCard
    title="Normal Update"
    icon={<AlertCircle className="h-5 w-5" />}
    urgency="normal"
  >
    Regular information update.
  </OpportunityCard>

  <OpportunityCard
    title="Low Priority"
    icon={<AlertCircle className="h-5 w-5" />}
    urgency="low"
  >
    Low priority information for your reference.
  </OpportunityCard>
</Stack>`}
      >
        <Stack spacing="md">
          <OpportunityCard
            title="Critical Issue"
            icon={<AlertCircle className="h-5 w-5" />}
            urgency="urgent"
          >
            Urgent attention required immediately.
          </OpportunityCard>

          <OpportunityCard
            title="Important Notice"
            icon={<AlertCircle className="h-5 w-5" />}
            urgency="important"
          >
            Important information that needs attention soon.
          </OpportunityCard>

          <OpportunityCard
            title="Normal Update"
            icon={<AlertCircle className="h-5 w-5" />}
            urgency="normal"
          >
            Regular information update.
          </OpportunityCard>

          <OpportunityCard
            title="Low Priority"
            icon={<AlertCircle className="h-5 w-5" />}
            urgency="low"
          >
            Low priority information for your reference.
          </OpportunityCard>
        </Stack>
      </ComponentPreview>

      <h2>Calendar Conflict Example</h2>
      <ComponentPreview
        code={`<OpportunityCard
  title="Calendar Conflict"
  icon={<Calendar className="h-5 w-5" />}
  urgency="urgent"
  privacyBadge="🔒 Local"
  onClose={() => console.log('Closed')}
  primaryAction={{
    label: 'Reschedule One',
    onClick: () => console.log('Reschedule'),
  }}
  secondaryAction={{
    label: 'View Calendar',
    onClick: () => console.log('View'),
  }}
  context="Both on Nov 4, overlap 30 minutes"
>
  <Stack spacing="md">
    <p>Double booking detected:</p>
    <ul className="text-sm space-y-xs">
      <li>• Team Meeting: 2:00 PM - 3:00 PM</li>
      <li>• Client Call: 2:30 PM - 3:30 PM</li>
    </ul>
  </Stack>
</OpportunityCard>`}
      >
        <OpportunityCard
          title="Calendar Conflict"
          icon={<Calendar className="h-5 w-5" />}
          urgency="urgent"
          privacyBadge="🔒 Local"
          onClose={() => console.log('Closed')}
          primaryAction={{
            label: 'Reschedule One',
            onClick: () => console.log('Reschedule'),
          }}
          secondaryAction={{
            label: 'View Calendar',
            onClick: () => console.log('View'),
          }}
          context="Both on Nov 4, overlap 30 minutes"
        >
          <Stack spacing="md">
            <p>Double booking detected:</p>
            <ul className="text-sm space-y-xs">
              <li>• Team Meeting: 2:00 PM - 3:00 PM</li>
              <li>• Client Call: 2:30 PM - 3:30 PM</li>
            </ul>
          </Stack>
        </OpportunityCard>
      </ComponentPreview>

      <h2>Travel Reminder Example</h2>
      <ComponentPreview
        code={`<OpportunityCard
  title="Travel Reminder"
  icon={<Plane className="h-5 w-5" />}
  urgency="important"
  privacyBadge="🔒 Local"
  onClose={() => console.log('Closed')}
  primaryAction={{
    label: 'Find Hotel',
    onClick: () => console.log('Find hotel'),
  }}
  secondaryAction={{
    label: 'View Itinerary',
    onClick: () => console.log('View'),
  }}
  context="Less than 24 hours until departure"
>
  <Stack spacing="md">
    <p><strong>Flight to Paris tomorrow</strong></p>
    <Stack spacing="sm">
      <p className="text-sm">Departure: Nov 10, 2:00 PM</p>
      <p className="text-sm text-muted-foreground">Berlin (BER) → Paris (CDG)</p>
    </Stack>
    <Stack direction="horizontal" spacing="sm" className="text-sm">
      <Badge variant="success">✓ Check-in complete</Badge>
      <Badge variant="warning">⚠️ No hotel booking</Badge>
    </Stack>
  </Stack>
</OpportunityCard>`}
      >
        <OpportunityCard
          title="Travel Reminder"
          icon={<Plane className="h-5 w-5" />}
          urgency="important"
          privacyBadge="🔒 Local"
          onClose={() => console.log('Closed')}
          primaryAction={{
            label: 'Find Hotel',
            onClick: () => console.log('Find hotel'),
          }}
          secondaryAction={{
            label: 'View Itinerary',
            onClick: () => console.log('View'),
          }}
          context="Less than 24 hours until departure"
        >
          <Stack spacing="md">
            <p><strong>Flight to Paris tomorrow</strong></p>
            <Stack spacing="sm">
              <p className="text-sm">Departure: Nov 10, 2:00 PM</p>
              <p className="text-sm text-muted-foreground">Berlin (BER) → Paris (CDG)</p>
            </Stack>
            <Stack direction="horizontal" spacing="sm" className="text-sm">
              <Badge variant="success">✓ Check-in complete</Badge>
              <Badge variant="warning">⚠️ No hotel booking</Badge>
            </Stack>
          </Stack>
        </OpportunityCard>
      </ComponentPreview>

      <h2>With Visual Element</h2>
      <ComponentPreview
        code={`<OpportunityCard
  title="Budget Progress"
  icon={<DollarSign className="h-5 w-5" />}
  urgency="normal"
  privacyBadge="🔒 Local"
  visual={
    <div className="w-full">
      <Stack direction="horizontal" justify="between" className="text-sm mb-sm">
        <span>Food Budget</span>
        <span className="font-semibold">95%</span>
      </Stack>
      <div className="w-full bg-muted rounded-full h-2">
        <div className="bg-warning h-2 rounded-full" style={{ width: '95%' }} />
      </div>
    </div>
  }
  context="Month-end approaching"
>
  <p className="text-sm">475 EUR of 500 EUR spent</p>
</OpportunityCard>`}
      >
        <OpportunityCard
          title="Budget Progress"
          icon={<DollarSign className="h-5 w-5" />}
          urgency="normal"
          privacyBadge="🔒 Local"
          visual={
            <div className="w-full">
              <Stack direction="horizontal" justify="between" className="text-sm mb-sm">
                <span>Food Budget</span>
                <span className="font-semibold">95%</span>
              </Stack>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
          }
          context="Month-end approaching"
        >
          <p className="text-sm">475 EUR of 500 EUR spent</p>
        </OpportunityCard>
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
              <span>
                <strong>Proactive Opportunities:</strong> Surface AI-detected opportunities that
                require user attention
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Dashboard Widgets:</strong> Display actionable insights on the main dashboard
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Urgent Notifications:</strong> Alert users to time-sensitive issues like
                conflicts or deadlines
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Contextual Actions:</strong> Provide quick actions related to the opportunity
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Set Appropriate Urgency:</strong> Use "urgent" sparingly for truly critical
                issues
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Provide Context:</strong> Always explain "why now" to help users understand
                timing
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Include Privacy Badge:</strong> Show data source transparency (Local, Cloud,
                etc.)
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Actionable Content:</strong> Provide clear primary and secondary actions
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span><strong>Dismissible:</strong> Always provide a close button for user control</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Mobile Support:</strong> Cards support swipe gestures for dismissal on mobile
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Close button has proper aria-label for screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Urgency levels use both color and visual hierarchy</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Touch targets meet minimum 44x44px size requirements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Swipe gestures have minimum threshold for intentional dismissal</span>
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
              <span>Use appropriate urgency levels based on actual time sensitivity</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide clear context explaining why the opportunity is surfaced now</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Include both primary and secondary actions when multiple paths exist</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show privacy badges to indicate data source transparency</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<OpportunityCard
  title="Budget Alert"
  icon={<DollarSign className="h-5 w-5" />}
  urgency="important"
  privacyBadge="🔒 Local"
  onClose={() => {}}
  context="Month-end approaching, spending high"
  primaryAction={{ label: 'View', onClick: () => {} }}
>
  Food: 475 EUR / 500 EUR
</OpportunityCard>`}
            >
              <OpportunityCard
                title="Budget Alert"
                icon={<DollarSign className="h-5 w-5" />}
                urgency="important"
                privacyBadge="🔒 Local"
                onClose={() => {}}
                context="Month-end approaching, spending high"
                primaryAction={{ label: 'View', onClick: () => {} }}
              >
                Food: 475 EUR / 500 EUR
              </OpportunityCard>
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
              <span>Mark everything as urgent - reserve for truly critical issues</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Omit the close button - users must be able to dismiss cards</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use vague or generic context - be specific about timing</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Create cards without actionable next steps</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<OpportunityCard
  title="Budget Alert"
  urgency="urgent"
  // ❌ No close button
  // ❌ No context
  // ❌ No actions
  // ❌ No privacy badge
>
  Your budget needs attention
</OpportunityCard>`}
            >
              <OpportunityCard title="Budget Alert" urgency="urgent">
                Your budget needs attention
              </OpportunityCard>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/card"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Card
          </h3>
          <p className="text-sm text-muted-foreground">
            Basic container for grouping related content
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
            Small status indicators used in opportunity cards
          </p>
        </Link>

        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">
            Action buttons for primary and secondary actions
          </p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/opportunity-card/opportunity-card.tsx"
              external
              showIcon
            >
              View source on GitHub
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
