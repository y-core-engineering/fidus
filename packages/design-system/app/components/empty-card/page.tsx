'use client';

import { EmptyCard, Stack, Link } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { Inbox, FileText, Users, Calendar, Package } from 'lucide-react';

export default function EmptyCardPage() {
  const props = [
    {
      name: 'title',
      type: 'string',
      default: '-',
      description: 'Main title of the empty state',
    },
    {
      name: 'description',
      type: 'string',
      default: 'undefined',
      description: 'Descriptive text explaining the empty state',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      default: 'undefined',
      description: 'Icon to display (Lucide icon recommended)',
    },
    {
      name: 'illustration',
      type: 'ReactNode',
      default: 'undefined',
      description: 'Custom illustration (takes precedence over icon)',
    },
    {
      name: 'action',
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
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the empty card',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Empty Card</h1>
      <p className="lead">
        Empty state cards that communicate when there's no content to display. Provides clear
        messaging, helpful guidance, and actions to help users get started.
      </p>

      <h2>Basic Example</h2>
      <ComponentPreview
        code={`<EmptyCard
  title="No messages yet"
  description="Your inbox is empty. New messages will appear here."
  icon={<Inbox />}
/>`}
      >
        <EmptyCard
          title="No messages yet"
          description="Your inbox is empty. New messages will appear here."
          icon={<Inbox />}
        />
      </ComponentPreview>

      <h2>With Primary Action</h2>
      <ComponentPreview
        code={`<EmptyCard
  title="No documents"
  description="You haven't created any documents yet. Start by creating your first document."
  icon={<FileText />}
  action={{
    label: 'Create Document',
    onClick: () => console.log('Create clicked'),
  }}
/>`}
      >
        <EmptyCard
          title="No documents"
          description="You haven't created any documents yet. Start by creating your first document."
          icon={<FileText />}
          action={{
            label: 'Create Document',
            onClick: () => console.log('Create clicked'),
          }}
        />
      </ComponentPreview>

      <h2>With Both Actions</h2>
      <ComponentPreview
        code={`<EmptyCard
  title="No team members"
  description="Invite colleagues to collaborate on projects together."
  icon={<Users />}
  action={{
    label: 'Invite Members',
    onClick: () => console.log('Invite clicked'),
  }}
  secondaryAction={{
    label: 'Learn More',
    onClick: () => console.log('Learn more clicked'),
  }}
/>`}
      >
        <EmptyCard
          title="No team members"
          description="Invite colleagues to collaborate on projects together."
          icon={<Users />}
          action={{
            label: 'Invite Members',
            onClick: () => console.log('Invite clicked'),
          }}
          secondaryAction={{
            label: 'Learn More',
            onClick: () => console.log('Learn more clicked'),
          }}
        />
      </ComponentPreview>

      <h2>Size Variants</h2>
      <ComponentPreview
        code={`<Stack spacing="lg">
  <EmptyCard
    title="Small"
    description="Compact empty state"
    icon={<Package />}
    size="sm"
  />

  <EmptyCard
    title="Medium"
    description="Standard empty state with balanced proportions"
    icon={<Package />}
    size="md"
  />

  <EmptyCard
    title="Large"
    description="Spacious empty state for full-page contexts"
    icon={<Package />}
    size="lg"
  />
</Stack>`}
      >
        <Stack spacing="lg">
          <EmptyCard
            title="Small"
            description="Compact empty state"
            icon={<Package />}
            size="sm"
          />

          <EmptyCard
            title="Medium"
            description="Standard empty state with balanced proportions"
            icon={<Package />}
            size="md"
          />

          <EmptyCard
            title="Large"
            description="Spacious empty state for full-page contexts"
            icon={<Package />}
            size="lg"
          />
        </Stack>
      </ComponentPreview>

      <h2>Custom Illustration</h2>
      <ComponentPreview
        code={`<EmptyCard
  title="No upcoming events"
  description="Your calendar is clear for the next 7 days."
  illustration={
    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
      <Calendar className="h-16 w-16 text-muted-foreground" />
    </div>
  }
  action={{
    label: 'Schedule Event',
    onClick: () => console.log('Schedule clicked'),
  }}
/>`}
      >
        <EmptyCard
          title="No upcoming events"
          description="Your calendar is clear for the next 7 days."
          illustration={
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="h-16 w-16 text-muted-foreground" />
            </div>
          }
          action={{
            label: 'Schedule Event',
            onClick: () => console.log('Schedule clicked'),
          }}
        />
      </ComponentPreview>

      <h2>Different Use Cases</h2>
      <ComponentPreview
        code={`<div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
  <EmptyCard
    title="No search results"
    description="Try adjusting your filters or search query"
    icon={<FileText />}
    size="sm"
    action={{
      label: 'Clear Filters',
      onClick: () => console.log('Clear clicked'),
    }}
  />

  <EmptyCard
    title="Nothing here yet"
    description="Start adding items to see them listed here"
    icon={<Inbox />}
    size="sm"
    action={{
      label: 'Add Item',
      onClick: () => console.log('Add clicked'),
    }}
  />
</div>`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <EmptyCard
            title="No search results"
            description="Try adjusting your filters or search query"
            icon={<FileText />}
            size="sm"
            action={{
              label: 'Clear Filters',
              onClick: () => console.log('Clear clicked'),
            }}
          />

          <EmptyCard
            title="Nothing here yet"
            description="Start adding items to see them listed here"
            icon={<Inbox />}
            size="sm"
            action={{
              label: 'Add Item',
              onClick: () => console.log('Add clicked'),
            }}
          />
        </div>
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
                <strong>Empty Lists:</strong> When a list, table, or collection has no items
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>No Search Results:</strong> When a search or filter returns no matches
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>First-Time Experience:</strong> When a user hasn't created any content yet
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Cleared State:</strong> After all items have been removed or archived
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
                <strong>Clear Messaging:</strong> Use friendly, conversational language to explain the
                empty state
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Actionable:</strong> Provide a clear primary action to help users get started
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Appropriate Icon:</strong> Choose an icon that relates to the content type
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Right Size:</strong> Use smaller sizes for panels, larger for full pages
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Helpful Description:</strong> Explain why it's empty and what users can do
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Avoid Negative Language:</strong> Use positive, encouraging tone
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Content guidelines</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Title:</strong> Keep it short and descriptive (e.g., "No tasks yet", "Empty
                inbox")
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Description:</strong> 1-2 sentences explaining the situation and next steps
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                <strong>Action Labels:</strong> Use clear verbs (e.g., "Create", "Add", "Invite")
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Icons have appropriate sizing for all size variants</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Text maintains readable contrast ratios</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Action buttons meet minimum touch target size (44x44px)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Semantic HTML structure for screen readers</span>
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
              <span>Provide helpful, actionable guidance to resolve the empty state</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use icons that clearly represent the content type</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Include a primary action to help users get started</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use positive, encouraging language</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<EmptyCard
  title="No projects yet"
  description="Create your first project to get started with collaboration."
  icon={<FileText />}
  action={{
    label: 'Create Project',
    onClick: () => {},
  }}
/>`}
            >
              <EmptyCard
                title="No projects yet"
                description="Create your first project to get started with collaboration."
                icon={<FileText />}
                action={{
                  label: 'Create Project',
                  onClick: () => {},
                }}
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
              <span>Use negative or discouraging language</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Leave users without a clear next step</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use generic icons unrelated to the content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Write overly long descriptions that overwhelm users</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<EmptyCard
  title="Error: No Data"
  description="There is nothing here. The system could not find any records in the database that match your current filter criteria."
  icon={<Package />}
/>`}
            >
              <EmptyCard
                title="Error: No Data"
                description="There is nothing here. The system could not find any records in the database that match your current filter criteria."
                icon={<Package />}
              />
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
            Container component for grouping related content
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
            Trigger actions within empty state cards
          </p>
        </Link>

        <Link
          href="/components/alert"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Alert
          </h3>
          <p className="text-sm text-muted-foreground">
            Display important messages in non-empty contexts
          </p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/empty-card/empty-card.tsx"
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
