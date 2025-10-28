'use client';

import { EmptyCard, Stack } from '@fidus/ui';
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
        code={`<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <h3>When to Use</h3>
      <ul>
        <li>
          <strong>Empty Lists:</strong> When a list, table, or collection has no items
        </li>
        <li>
          <strong>No Search Results:</strong> When a search or filter returns no matches
        </li>
        <li>
          <strong>First-Time Experience:</strong> When a user hasn't created any content yet
        </li>
        <li>
          <strong>Cleared State:</strong> After all items have been removed or archived
        </li>
      </ul>

      <h3>Best Practices</h3>
      <ul>
        <li>
          <strong>Clear Messaging:</strong> Use friendly, conversational language to explain the empty
          state
        </li>
        <li>
          <strong>Actionable:</strong> Provide a clear primary action to help users get started
        </li>
        <li>
          <strong>Appropriate Icon:</strong> Choose an icon that relates to the content type
        </li>
        <li>
          <strong>Right Size:</strong> Use smaller sizes for panels, larger for full pages
        </li>
        <li>
          <strong>Helpful Description:</strong> Explain why it's empty and what users can do
        </li>
        <li>
          <strong>Avoid Negative Language:</strong> Use positive, encouraging tone
        </li>
      </ul>

      <h3>Content Guidelines</h3>
      <ul>
        <li>
          <strong>Title:</strong> Keep it short and descriptive (e.g., "No tasks yet", "Empty inbox")
        </li>
        <li>
          <strong>Description:</strong> 1-2 sentences explaining the situation and next steps
        </li>
        <li>
          <strong>Action Labels:</strong> Use clear verbs (e.g., "Create", "Add", "Invite")
        </li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>Icons have appropriate sizing for all size variants</li>
        <li>Text maintains readable contrast ratios</li>
        <li>Action buttons meet minimum touch target size (44x44px)</li>
        <li>Semantic HTML structure for screen readers</li>
      </ul>
    </div>
  );
}
