'use client';

import { DetailCard, Badge, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { Calendar, CheckCircle } from 'lucide-react';

export default function DetailCardPage() {
  const props = [
    {
      name: 'title',
      type: 'string',
      default: '-',
      description: 'Card title displayed in the header',
    },
    {
      name: 'subtitle',
      type: 'string',
      default: 'undefined',
      description: 'Optional subtitle text below the title',
    },
    {
      name: 'defaultExpanded',
      type: 'boolean',
      default: 'false',
      description: 'Whether the card starts in expanded state',
    },
    {
      name: 'collapsible',
      type: 'boolean',
      default: 'true',
      description: 'Whether the card can be collapsed/expanded',
    },
    {
      name: 'header',
      type: 'ReactNode',
      default: 'undefined',
      description: 'Custom content in the header (badges, icons, etc.)',
    },
    {
      name: 'footer',
      type: 'ReactNode',
      default: 'undefined',
      description: 'Footer content shown when card is expanded',
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
      <h1>Detail Card</h1>
      <p className="lead">
        Expandable cards for displaying detailed information with collapsible sections. Perfect for
        showing additional context, settings, or grouped information.
      </p>

      <h2>Basic Example</h2>
      <ComponentPreview
        code={`<DetailCard title="Meeting Details">
  <p className="mb-2"><strong>Team Standup</strong></p>
  <p className="text-sm text-muted-foreground mb-2">Today, 9:00 AM - 9:30 AM</p>
  <p className="text-sm">Discuss daily progress and blockers with the team.</p>
</DetailCard>`}
      >
        <DetailCard title="Meeting Details">
          <p className="mb-2"><strong>Team Standup</strong></p>
          <p className="text-sm text-muted-foreground mb-2">Today, 9:00 AM - 9:30 AM</p>
          <p className="text-sm">Discuss daily progress and blockers with the team.</p>
        </DetailCard>
      </ComponentPreview>

      <h2>With Subtitle</h2>
      <ComponentPreview
        code={`<DetailCard
  title="Project Alpha"
  subtitle="Software Development"
>
  <p className="text-sm mb-3">
    A new customer portal with advanced analytics and reporting capabilities.
  </p>
  <div className="flex gap-2">
    <Badge variant="info">In Progress</Badge>
    <Badge variant="normal">Q4 2025</Badge>
  </div>
</DetailCard>`}
      >
        <DetailCard title="Project Alpha" subtitle="Software Development">
          <p className="text-sm mb-3">
            A new customer portal with advanced analytics and reporting capabilities.
          </p>
          <div className="flex gap-2">
            <Badge variant="info">In Progress</Badge>
            <Badge variant="normal">Q4 2025</Badge>
          </div>
        </DetailCard>
      </ComponentPreview>

      <h2>Default Expanded</h2>
      <ComponentPreview
        code={`<DetailCard title="Important Notice" defaultExpanded>
  <p className="text-sm">
    This card starts expanded by default, making the content immediately visible.
    Users can still collapse it if they want.
  </p>
</DetailCard>`}
      >
        <DetailCard title="Important Notice" defaultExpanded>
          <p className="text-sm">
            This card starts expanded by default, making the content immediately visible. Users can
            still collapse it if they want.
          </p>
        </DetailCard>
      </ComponentPreview>

      <h2>Non-Collapsible</h2>
      <ComponentPreview
        code={`<DetailCard title="System Status" collapsible={false}>
  <p className="text-sm">
    This card cannot be collapsed. The content is always visible.
    Use this for critical information that should always be shown.
  </p>
</DetailCard>`}
      >
        <DetailCard title="System Status" collapsible={false}>
          <p className="text-sm">
            This card cannot be collapsed. The content is always visible. Use this for critical
            information that should always be shown.
          </p>
        </DetailCard>
      </ComponentPreview>

      <h2>With Header Badge</h2>
      <ComponentPreview
        code={`<DetailCard
  title="Task: Implement Login"
  header={<Badge variant="success">Completed</Badge>}
>
  <p className="text-sm mb-2">
    User authentication system with email and password login.
  </p>
  <p className="text-xs text-muted-foreground">
    Completed on: October 25, 2025
  </p>
</DetailCard>`}
      >
        <DetailCard
          title="Task: Implement Login"
          header={<Badge variant="success">Completed</Badge>}
        >
          <p className="text-sm mb-2">
            User authentication system with email and password login.
          </p>
          <p className="text-xs text-muted-foreground">Completed on: October 25, 2025</p>
        </DetailCard>
      </ComponentPreview>

      <h2>With Footer</h2>
      <ComponentPreview
        code={`<DetailCard
  title="Budget Report"
  subtitle="October 2025"
  footer={
    <div className="flex gap-2">
      <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded">
        Download PDF
      </button>
      <button className="px-3 py-1.5 text-sm hover:bg-muted rounded">
        Share
      </button>
    </div>
  }
>
  <p className="text-sm mb-3">Total expenses: 2,450 EUR</p>
  <ul className="text-sm space-y-1">
    <li>• Food: 500 EUR</li>
    <li>• Transport: 300 EUR</li>
    <li>• Shopping: 1,650 EUR</li>
  </ul>
</DetailCard>`}
      >
        <DetailCard
          title="Budget Report"
          subtitle="October 2025"
          footer={
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded">
                Download PDF
              </button>
              <button className="px-3 py-1.5 text-sm hover:bg-muted rounded">Share</button>
            </div>
          }
        >
          <p className="text-sm mb-3">Total expenses: 2,450 EUR</p>
          <ul className="text-sm space-y-1">
            <li>• Food: 500 EUR</li>
            <li>• Transport: 300 EUR</li>
            <li>• Shopping: 1,650 EUR</li>
          </ul>
        </DetailCard>
      </ComponentPreview>

      <h2>Multiple Cards</h2>
      <ComponentPreview
        code={`<Stack spacing="md">
  <DetailCard
    title="Today's Events"
    subtitle="3 events scheduled"
    header={<Calendar className="h-4 w-4 text-muted-foreground" />}
  >
    <ul className="text-sm space-y-2">
      <li>9:00 AM - Team Standup</li>
      <li>2:00 PM - Client Call</li>
      <li>4:30 PM - Code Review</li>
    </ul>
  </DetailCard>

  <DetailCard
    title="Completed Tasks"
    subtitle="5 tasks done today"
    header={<CheckCircle className="h-4 w-4 text-success" />}
  >
    <ul className="text-sm space-y-2">
      <li>✓ Fix login bug</li>
      <li>✓ Update documentation</li>
      <li>✓ Review pull request</li>
      <li>✓ Deploy to staging</li>
      <li>✓ Client presentation</li>
    </ul>
  </DetailCard>
</Stack>`}
      >
        <Stack spacing="md">
          <DetailCard
            title="Today's Events"
            subtitle="3 events scheduled"
            header={<Calendar className="h-4 w-4 text-muted-foreground" />}
          >
            <ul className="text-sm space-y-2">
              <li>9:00 AM - Team Standup</li>
              <li>2:00 PM - Client Call</li>
              <li>4:30 PM - Code Review</li>
            </ul>
          </DetailCard>

          <DetailCard
            title="Completed Tasks"
            subtitle="5 tasks done today"
            header={<CheckCircle className="h-4 w-4 text-success" />}
          >
            <ul className="text-sm space-y-2">
              <li>✓ Fix login bug</li>
              <li>✓ Update documentation</li>
              <li>✓ Review pull request</li>
              <li>✓ Deploy to staging</li>
              <li>✓ Client presentation</li>
            </ul>
          </DetailCard>
        </Stack>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>

      <h3>When to Use</h3>
      <ul>
        <li>
          <strong>Grouped Information:</strong> Display related information that can be collapsed to
          save space
        </li>
        <li>
          <strong>Progressive Disclosure:</strong> Show summary in header, details in body
        </li>
        <li>
          <strong>Settings Sections:</strong> Organize settings into logical, collapsible groups
        </li>
        <li>
          <strong>List Items with Details:</strong> Show item overview with expandable details
        </li>
      </ul>

      <h3>Best Practices</h3>
      <ul>
        <li>
          <strong>Clear Titles:</strong> Use descriptive titles that summarize the card content
        </li>
        <li>
          <strong>Useful Subtitles:</strong> Provide context or metadata in the subtitle
        </li>
        <li>
          <strong>Start Collapsed:</strong> Keep cards collapsed by default unless content is critical
        </li>
        <li>
          <strong>Header Badges:</strong> Use header slot for status indicators or metadata
        </li>
        <li>
          <strong>Footer Actions:</strong> Place actions in footer when content is expanded
        </li>
        <li>
          <strong>Non-Collapsible Sparingly:</strong> Only disable collapsing for critical information
        </li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>Header is keyboard accessible (Tab, Enter, Space)</li>
        <li>Proper ARIA attributes for expanded/collapsed state</li>
        <li>Chevron icon indicates collapsible state visually</li>
        <li>Focus indicator on header when using keyboard navigation</li>
      </ul>
    </div>
  );
}
