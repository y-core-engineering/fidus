'use client';

import { DetailCard, Badge, Stack, Link } from '@fidus/ui';
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
  <p className="mb-sm"><strong>Team Standup</strong></p>
  <p className="text-sm text-muted-foreground mb-sm">Today, 9:00 AM - 9:30 AM</p>
  <p className="text-sm">Discuss daily progress and blockers with the team.</p>
</DetailCard>`}
      >
        <DetailCard title="Meeting Details">
          <p className="mb-sm"><strong>Team Standup</strong></p>
          <p className="text-sm text-muted-foreground mb-sm">Today, 9:00 AM - 9:30 AM</p>
          <p className="text-sm">Discuss daily progress and blockers with the team.</p>
        </DetailCard>
      </ComponentPreview>

      <h2>With Subtitle</h2>
      <ComponentPreview
        code={`<DetailCard
  title="Project Alpha"
  subtitle="Software Development"
>
  <p className="text-sm mb-md">
    A new customer portal with advanced analytics and reporting capabilities.
  </p>
  <Stack direction="horizontal" spacing="sm">
    <Badge variant="info">In Progress</Badge>
    <Badge variant="normal">Q4 2025</Badge>
  </Stack>
</DetailCard>`}
      >
        <DetailCard title="Project Alpha" subtitle="Software Development">
          <p className="text-sm mb-md">
            A new customer portal with advanced analytics and reporting capabilities.
          </p>
          <Stack direction="horizontal" spacing="sm">
            <Badge variant="info">In Progress</Badge>
            <Badge variant="normal">Q4 2025</Badge>
          </Stack>
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
  <p className="text-sm mb-sm">
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
          <p className="text-sm mb-sm">
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
    <Stack direction="horizontal" spacing="sm">
      <button className="px-md py-sm text-sm bg-primary text-primary-foreground rounded-md">
        Download PDF
      </button>
      <button className="px-md py-sm text-sm hover:bg-muted rounded-md">
        Share
      </button>
    </Stack>
  }
>
  <p className="text-sm mb-md">Total expenses: 2,450 EUR</p>
  <ul className="text-sm space-y-xs">
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
            <Stack direction="horizontal" spacing="sm">
              <button className="px-md py-sm text-sm bg-primary text-primary-foreground rounded-md">
                Download PDF
              </button>
              <button className="px-md py-sm text-sm hover:bg-muted rounded-md">Share</button>
            </Stack>
          }
        >
          <p className="text-sm mb-md">Total expenses: 2,450 EUR</p>
          <ul className="text-sm space-y-xs">
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
    <ul className="text-sm space-y-sm">
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
    <ul className="text-sm space-y-sm">
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
            <ul className="text-sm space-y-sm">
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
            <ul className="text-sm space-y-sm">
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
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Grouped Information:</strong> Display related information that can be collapsed
                to save space
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Progressive Disclosure:</strong> Show summary in header, details in body
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Settings Sections:</strong> Organize settings into logical, collapsible groups
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>List Items with Details:</strong> Show item overview with expandable details
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
                <strong>Clear Titles:</strong> Use descriptive titles that summarize the card content
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Useful Subtitles:</strong> Provide context or metadata in the subtitle
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Start Collapsed:</strong> Keep cards collapsed by default unless content is
                critical
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Header Badges:</strong> Use header slot for status indicators or metadata
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Footer Actions:</strong> Place actions in footer when content is expanded
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Non-Collapsible Sparingly:</strong> Only disable collapsing for critical
                information
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Header is keyboard accessible (Tab, Enter, Space)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Proper ARIA attributes for expanded/collapsed state</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Chevron icon indicates collapsible state visually</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus indicator on header when using keyboard navigation</span>
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
              <span>Use descriptive titles that clearly explain the card content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Start cards collapsed by default to reduce visual clutter</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use badges in the header slot for status indicators</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Place actions in the footer when card is expanded</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-lg">
            <ComponentPreview
              code={`<DetailCard
  title="Monthly Budget"
  subtitle="October 2025"
  header={<Badge variant="warning">Over Budget</Badge>}
>
  <p className="text-sm">Spent: 2,450 EUR / 2,000 EUR</p>
</DetailCard>`}
            >
              <DetailCard
                title="Monthly Budget"
                subtitle="October 2025"
                header={<Badge variant="warning">Over Budget</Badge>}
              >
                <p className="text-sm">Spent: 2,450 EUR / 2,000 EUR</p>
              </DetailCard>
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
              <span>Use vague titles like "Details" or "Information"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Start all cards expanded, creating a cluttered interface</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Nest detail cards inside other detail cards</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Make cards non-collapsible unless absolutely necessary</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-lg">
            <ComponentPreview
              code={`<DetailCard
  title="Info"
  defaultExpanded
  collapsible={false}
>
  <p className="text-sm">Some details here</p>
</DetailCard>`}
            >
              <DetailCard title="Info" defaultExpanded collapsible={false}>
                <p className="text-sm">Some details here</p>
              </DetailCard>
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
            Basic container for displaying grouped content
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
            Small status indicators and labels for headers
          </p>
        </Link>

        <Link
          href="/components/stack"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Stack
          </h3>
          <p className="text-sm text-muted-foreground">Layout multiple cards with consistent spacing</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/detail-card/detail-card.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"
              external
              showIcon
            >
              ARIA: Disclosure Pattern
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
