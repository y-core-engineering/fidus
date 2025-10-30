'use client';

import { EmptyCard, Button, Alert, TextInput, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { useState } from 'react';

export default function EmptyStatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('');

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Empty State Patterns</h1>
      <p className="lead">
        Empty states guide users when there is no content to display. They should be encouraging, helpful, and provide clear next steps.
      </p>

      {/* When to Use */}
      <h2>When to Use Empty States</h2>
      <div className="not-prose my-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-md text-left font-semibold">Type</th>
              <th className="p-md text-left font-semibold">Context</th>
              <th className="p-md text-left font-semibold">Message Tone</th>
              <th className="p-md text-left font-semibold">Call-to-Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">First Use</td>
              <td className="p-md">User has not created any content yet</td>
              <td className="p-md">Encouraging, welcoming</td>
              <td className="p-md text-muted-foreground">Create first item</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">No Results</td>
              <td className="p-md">Search or filter returned nothing</td>
              <td className="p-md">Neutral, helpful</td>
              <td className="p-md text-muted-foreground">Adjust search, clear filters</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Cleared</td>
              <td className="p-md">User deleted all content</td>
              <td className="p-md">Neutral, supportive</td>
              <td className="p-md text-muted-foreground">Create new item</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Permission Denied</td>
              <td className="p-md">User lacks access to view content</td>
              <td className="p-md">Informative, not accusatory</td>
              <td className="p-md text-muted-foreground">Request access</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* First-Use Empty States */}
      <h2>First-Use Empty States</h2>
      <p className="text-sm text-muted-foreground">
        When users first encounter a feature, empty states should be welcoming and guide them to create their first item.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">No Budgets Yet</h3>
          <ComponentPreview code={`<EmptyCard
  title="No budgets yet"
  description="Create your first budget to start tracking your spending."
  icon="💰"
  action={{
    label: 'Create Budget',
    onClick: handleCreateBudget,
  }}
/>`}>
            <EmptyCard
              title="No budgets yet"
              description="Create your first budget to start tracking your spending."
              icon="💰"
              action={{
                label: 'Create Budget',
                onClick: () => console.log('Create budget'),
              }}
            />
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">No Appointments</h3>
          <ComponentPreview code={`<EmptyCard
  title="Your calendar is empty"
  description="Add your first appointment to get started with scheduling."
  icon="📅"
  action={{
    label: 'Add Appointment',
    onClick: handleAddAppointment,
  }}
/>`}>
            <EmptyCard
              title="Your calendar is empty"
              description="Add your first appointment to get started with scheduling."
              icon="📅"
              action={{
                label: 'Add Appointment',
                onClick: () => console.log('Add appointment'),
              }}
            />
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">No Travel Plans</h3>
          <ComponentPreview code={`<EmptyCard
  title="Ready for an adventure?"
  description="Start planning your next trip by adding a destination."
  icon="✈️"
  action={{
    label: 'Plan Trip',
    onClick: handlePlanTrip,
  }}
/>`}>
            <EmptyCard
              title="Ready for an adventure?"
              description="Start planning your next trip by adding a destination."
              icon="✈️"
              action={{
                label: 'Plan Trip',
                onClick: () => console.log('Plan trip'),
              }}
            />
          </ComponentPreview>
        </div>
      </div>

      {/* Search with No Results */}
      <h2>Search with No Results</h2>
      <p className="text-sm text-muted-foreground">
        When a search returns no results, provide helpful suggestions to refine the search or try alternative actions.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">Interactive Search Demo</h3>
          <ComponentPreview code={`<TextInput
  label="Search budgets"
  placeholder="Try searching..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

{searchQuery && (
  <EmptyCard
    title={\`No results for "\${searchQuery}"\`}
    description="Try adjusting your search terms or check for typos."
    icon="🔍"
    action={{
      label: 'Clear Search',
      onClick: () => setSearchQuery(''),
    }}
  />
)}`}>
            <div className="rounded-lg border border-border bg-card p-lg">
              <TextInput
                label="Search budgets"
                placeholder="Try searching for something that doesn&apos;t exist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {searchQuery && (
                <div className="mt-md">
                  <EmptyCard
                    title={`No results for "${searchQuery}"`}
                    description="Try adjusting your search terms or check for typos."
                    icon="🔍"
                    action={{
                      label: 'Clear Search',
                      onClick: () => setSearchQuery(''),
                    }}
                  />
                </div>
              )}
            </div>
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">With Alternative Actions</h3>
          <ComponentPreview code={`<EmptyCard
  title="No transactions found"
  description="We could not find any transactions matching your search."
  icon="🔍"
>
  <Stack direction="horizontal" spacing="sm">
    <Button variant="secondary" size="sm">
      Clear Search
    </Button>
    <Button variant="secondary" size="sm">
      View All Transactions
    </Button>
  </Stack>
</EmptyCard>`}>
            <EmptyCard
              title="No transactions found"
              description="We could not find any transactions matching your search."
              icon="🔍"
            >
              <Stack direction="horizontal" spacing="sm" className="mt-md">
                <Button variant="secondary" size="sm">
                  Clear Search
                </Button>
                <Button variant="secondary" size="sm">
                  View All Transactions
                </Button>
              </Stack>
            </EmptyCard>
          </ComponentPreview>
        </div>
      </div>

      {/* Filtered List with No Matches */}
      <h2>Filtered List with No Matches</h2>
      <p className="text-sm text-muted-foreground">
        When filters are applied but no items match, provide a way to adjust or clear filters.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">Interactive Filter Demo</h3>
          <ComponentPreview code={`<TextInput
  label="Filter by category"
  placeholder="e.g., Food, Transport"
  value={filterValue}
  onChange={(e) => setFilterValue(e.target.value)}
/>

{filterValue && (
  <EmptyCard
    title="No items match your filters"
    description={\`No items found in category "\${filterValue}".\`}
    icon="🔍"
  >
    <Stack direction="horizontal" spacing="sm">
      <Button variant="secondary" size="sm" onClick={() => setFilterValue('')}>
        Clear Filters
      </Button>
      <Button variant="secondary" size="sm">
        View All Categories
      </Button>
    </Stack>
  </EmptyCard>
)}`}>
            <div className="rounded-lg border border-border bg-card p-lg">
              <TextInput
                label="Filter by category"
                placeholder="e.g., Food, Transport"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />

              {filterValue && (
                <div className="mt-md">
                  <EmptyCard
                    title="No items match your filters"
                    description={`No items found in category "${filterValue}".`}
                    icon="🔍"
                  >
                    <Stack direction="horizontal" spacing="sm" className="mt-md">
                      <Button variant="secondary" size="sm" onClick={() => setFilterValue('')}>
                        Clear Filters
                      </Button>
                      <Button variant="secondary" size="sm">
                        View All Categories
                      </Button>
                    </Stack>
                  </EmptyCard>
                </div>
              )}
            </div>
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Multiple Active Filters</h3>
          <ComponentPreview code={`<Alert variant="info" title="No transactions found">
  <p className="mb-sm">No transactions match your current filters:</p>
  <ul className="mb-md list-inside list-disc text-sm">
    <li>Category: Food</li>
    <li>Date Range: Last 7 days</li>
    <li>Amount: More than 50 EUR</li>
  </ul>
  <Button variant="secondary" size="sm">
    Clear All Filters
  </Button>
</Alert>`}>
            <div className="rounded-md border border-info bg-info/10 p-md">
              <h4 className="font-semibold text-info mb-sm">No transactions found</h4>
              <p className="mb-sm text-sm">No transactions match your current filters:</p>
              <ul className="mb-md list-inside list-disc text-sm">
                <li>Category: Food</li>
                <li>Date Range: Last 7 days</li>
                <li>Amount: More than 50 EUR</li>
              </ul>
              <Button variant="secondary" size="sm">
                Clear All Filters
              </Button>
            </div>
          </ComponentPreview>
        </div>
      </div>

      {/* Cleared/Deleted Content */}
      <h2>Cleared or Deleted Content</h2>
      <p className="text-sm text-muted-foreground">
        When users have deleted all content, the empty state should acknowledge this and encourage them to create new content.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">All Tasks Completed</h3>
          <ComponentPreview code={`<EmptyCard
  title="All done!"
  description="You have completed all your tasks. Great work!"
  icon="✅"
  action={{
    label: 'Add New Task',
    onClick: handleAddTask,
  }}
/>`}>
            <EmptyCard
              title="All done!"
              description="You have completed all your tasks. Great work!"
              icon="✅"
              action={{
                label: 'Add New Task',
                onClick: () => console.log('Add task'),
              }}
            />
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Inbox Zero</h3>
          <ComponentPreview code={`<EmptyCard
  title="Inbox zero achieved!"
  description="You are all caught up. No messages to display."
  icon="📬"
/>`}>
            <EmptyCard
              title="Inbox zero achieved!"
              description="You are all caught up. No messages to display."
              icon="📬"
            />
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Trash Emptied</h3>
          <ComponentPreview code={`<EmptyCard
  title="Trash is empty"
  description="Deleted items will appear here for 30 days before being permanently removed."
  icon="🗑️"
/>`}>
            <EmptyCard
              title="Trash is empty"
              description="Deleted items will appear here for 30 days before being permanently removed."
              icon="🗑️"
            />
          </ComponentPreview>
        </div>
      </div>

      {/* Empty Dashboard Sections */}
      <h2>Empty Dashboard Sections</h2>
      <p className="text-sm text-muted-foreground">
        Dashboard sections may be empty when there is no relevant data or opportunities to display.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">No Opportunities</h3>
          <ComponentPreview code={`<EmptyCard
  title="No suggestions right now"
  description="Fidus will show relevant suggestions here when opportunities arise."
  icon="💡"
/>`}>
            <EmptyCard
              title="No suggestions right now"
              description="Fidus will show relevant suggestions here when opportunities arise."
              icon="💡"
            />
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">No Recent Activity</h3>
          <ComponentPreview code={`<EmptyCard
  title="No recent activity"
  description="Your recent actions and updates will appear here."
  icon="📊"
/>`}>
            <EmptyCard
              title="No recent activity"
              description="Your recent actions and updates will appear here."
              icon="📊"
            />
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">No Upcoming Events</h3>
          <ComponentPreview code={`<EmptyCard
  title="Nothing scheduled"
  description="You have no upcoming appointments or events."
  icon="📅"
  action={{
    label: 'Add Event',
    onClick: handleAddEvent,
  }}
/>`}>
            <EmptyCard
              title="Nothing scheduled"
              description="You have no upcoming appointments or events."
              icon="📅"
              action={{
                label: 'Add Event',
                onClick: () => console.log('Add event'),
              }}
            />
          </ComponentPreview>
        </div>
      </div>

      {/* Permission Denied */}
      <h2>Permission Denied Empty States</h2>
      <p className="text-sm text-muted-foreground">
        When users lack permission to view content, explain why and provide a path forward.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">No Access</h3>
          <ComponentPreview code={`<EmptyCard
  title="You don't have access"
  description="You need permission to view this content. Contact your administrator for access."
  icon="🔒"
  action={{
    label: 'Request Access',
    onClick: handleRequestAccess,
  }}
/>`}>
            <EmptyCard
              title="You don&apos;t have access"
              description="You need permission to view this content. Contact your administrator for access."
              icon="🔒"
              action={{
                label: 'Request Access',
                onClick: () => console.log('Request access'),
              }}
            />
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Feature Not Available</h3>
          <ComponentPreview code={`<EmptyCard
  title="Feature not available"
  description="This feature is not included in your current plan."
  icon="⭐"
  action={{
    label: 'Upgrade Plan',
    onClick: handleUpgradePlan,
  }}
/>`}>
            <EmptyCard
              title="Feature not available"
              description="This feature is not included in your current plan."
              icon="⭐"
              action={{
                label: 'Upgrade Plan',
                onClick: () => console.log('Upgrade plan'),
              }}
            />
          </ComponentPreview>
        </div>
      </div>

      {/* Empty State vs Error State */}
      <h2>Empty State vs Error State</h2>
      <p className="text-sm text-muted-foreground">
        It is critical to distinguish between empty states and error states to provide the right user experience.
      </p>

      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        <div className="rounded-lg border border-border bg-card p-lg">
          <h3 className="font-semibold mb-md">Empty State</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">✓</span>
              <span>System is working correctly</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">✓</span>
              <span>No content exists (yet)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">✓</span>
              <span>Encouraging and helpful tone</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">✓</span>
              <span>Call-to-action to create content</span>
            </li>
          </ul>
          <div className="mt-md">
            <EmptyCard
              title="No budgets yet"
              description="Create your first budget to start tracking spending."
              icon="💰"
              action={{
                label: 'Create Budget',
                onClick: () => console.log('Create'),
              }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-error bg-error/5 p-lg">
          <h3 className="font-semibold text-error mb-md">Error State</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">✗</span>
              <span>Something went wrong</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">✗</span>
              <span>Content should exist but cannot load</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">✗</span>
              <span>Informative and solution-oriented</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">✗</span>
              <span>Recovery or retry options</span>
            </li>
          </ul>
          <div className="mt-md">
            <Alert variant="error" title="Failed to load budgets">
              Unable to retrieve your budget data. Please try again.
            </Alert>
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When there is no content to display in a section or page</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When a search or filter returns no results</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When a user first encounters a feature before creating content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When a user has deleted all content from a list</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When a user lacks permission to view content</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use friendly, encouraging language that motivates action</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Include a clear call-to-action that helps users proceed</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use icons or illustrations to make empty states more engaging</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Explain why the state is empty and what the user can do</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For search/filter states, show the query or active filters</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Never leave empty states completely blank</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Empty state messages are announced to screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Call-to-action buttons have descriptive labels</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Icons are decorative and hidden from screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus management when transitioning from content to empty state</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard users can navigate to and activate call-to-action buttons</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Do's and Don'ts */}
      <h2 className="mt-2xl">Do&apos;s and Don&apos;ts</h2>

      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        {/* Do's */}
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <span className="text-2xl">✓</span> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use friendly, encouraging language</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Include a clear call-to-action</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use icons to make empty states engaging</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Explain why the state is empty</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview code={`<EmptyCard
  title="Ready to start budgeting?"
  description="Create your first budget to take control of your spending."
  icon="💰"
  action={{ label: 'Create Budget', onClick: handleCreate }}
/>`}>
              <EmptyCard
                title="Ready to start budgeting?"
                description="Create your first budget to take control of your spending."
                icon="💰"
                action={{
                  label: 'Create Budget',
                  onClick: () => console.log('Create'),
                }}
              />
            </ComponentPreview>
          </div>
        </div>

        {/* Don'ts */}
        <div className="border-2 border-error rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don&apos;t
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use negative or discouraging language</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Leave empty states completely blank</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Show a generic &quot;No data&quot; message</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Confuse empty states with error states</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/10 rounded-md">
            <ComponentPreview code={`<EmptyCard
  title="No budgets"
  description="The budget list is empty."
/>`}>
              <EmptyCard
                title="No budgets"
                description="The budget list is empty."
              />
            </ComponentPreview>
          </div>
        </div>
      </div>

      {/* Related Components */}
      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/empty-card"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Empty Card
          </h3>
          <p className="text-sm text-muted-foreground">Component for displaying empty states</p>
        </Link>

        <Link
          href="/components/alert"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Alert
          </h3>
          <p className="text-sm text-muted-foreground">Inline contextual messages</p>
        </Link>

        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">Actionable buttons for CTAs</p>
        </Link>
      </div>

      {/* Resources */}
      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/empty-state-interface-design/"
              external
              showIcon
            >
              Nielsen Norman Group: Empty State Design Patterns
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://uxdesign.cc/empty-state-designing-the-void-77e4297e3fc6"
              external
              showIcon
            >
              UX Collective: Designing the Void - Empty State Best Practices
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/components/empty-card">
              EmptyCard Component Documentation
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
