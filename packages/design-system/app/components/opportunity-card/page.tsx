'use client';

import { OpportunityCard, Badge, Stack } from '@fidus/ui';
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
  <p className="mb-2"><strong>Food: 475 EUR / 500 EUR</strong></p>
  <p className="text-sm text-muted-foreground">3 days remaining in month</p>
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
          <p className="mb-2"><strong>Food: 475 EUR / 500 EUR</strong></p>
          <p className="text-sm text-muted-foreground">3 days remaining in month</p>
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
  <p className="mb-3">Double booking detected:</p>
  <ul className="text-sm space-y-1">
    <li>• Team Meeting: 2:00 PM - 3:00 PM</li>
    <li>• Client Call: 2:30 PM - 3:30 PM</li>
  </ul>
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
          <p className="mb-3">Double booking detected:</p>
          <ul className="text-sm space-y-1">
            <li>• Team Meeting: 2:00 PM - 3:00 PM</li>
            <li>• Client Call: 2:30 PM - 3:30 PM</li>
          </ul>
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
  <p className="mb-3"><strong>Flight to Paris tomorrow</strong></p>
  <p className="text-sm mb-2">Departure: Nov 10, 2:00 PM</p>
  <p className="text-sm text-muted-foreground mb-3">Berlin (BER) → Paris (CDG)</p>
  <div className="flex gap-2 text-sm">
    <Badge variant="success">✓ Check-in complete</Badge>
    <Badge variant="warning">⚠️ No hotel booking</Badge>
  </div>
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
          <p className="mb-3"><strong>Flight to Paris tomorrow</strong></p>
          <p className="text-sm mb-2">Departure: Nov 10, 2:00 PM</p>
          <p className="text-sm text-muted-foreground mb-3">Berlin (BER) → Paris (CDG)</p>
          <div className="flex gap-2 text-sm">
            <Badge variant="success">✓ Check-in complete</Badge>
            <Badge variant="warning">⚠️ No hotel booking</Badge>
          </div>
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
      <div className="flex justify-between text-sm mb-2">
        <span>Food Budget</span>
        <span className="font-semibold">95%</span>
      </div>
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
              <div className="flex justify-between text-sm mb-2">
                <span>Food Budget</span>
                <span className="font-semibold">95%</span>
              </div>
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

      <h3>When to Use</h3>
      <ul>
        <li>
          <strong>Proactive Opportunities:</strong> Surface AI-detected opportunities that require
          user attention
        </li>
        <li>
          <strong>Dashboard Widgets:</strong> Display actionable insights on the main dashboard
        </li>
        <li>
          <strong>Urgent Notifications:</strong> Alert users to time-sensitive issues like conflicts
          or deadlines
        </li>
        <li>
          <strong>Contextual Actions:</strong> Provide quick actions related to the opportunity
        </li>
      </ul>

      <h3>Best Practices</h3>
      <ul>
        <li>
          <strong>Set Appropriate Urgency:</strong> Use "urgent" sparingly for truly critical issues
        </li>
        <li>
          <strong>Provide Context:</strong> Always explain "why now" to help users understand timing
        </li>
        <li>
          <strong>Include Privacy Badge:</strong> Show data source transparency (Local, Cloud, etc.)
        </li>
        <li>
          <strong>Actionable Content:</strong> Provide clear primary and secondary actions
        </li>
        <li>
          <strong>Dismissible:</strong> Always provide a close button for user control
        </li>
        <li>
          <strong>Mobile Support:</strong> Cards support swipe gestures for dismissal on mobile
        </li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>Close button has proper aria-label for screen readers</li>
        <li>Urgency levels use both color and visual hierarchy</li>
        <li>Touch targets meet minimum 44x44px size requirements</li>
        <li>Swipe gestures have minimum threshold for intentional dismissal</li>
      </ul>
    </div>
  );
}
