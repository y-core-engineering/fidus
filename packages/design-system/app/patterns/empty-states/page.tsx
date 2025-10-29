'use client';

import { EmptyCard, Button, Alert, TextInput } from '@fidus/ui';
import { useState } from 'react';

export default function EmptyStatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('');

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Empty State Patterns</h1>
        <p className="text-lg text-muted-foreground">
          Empty states guide users when there is no content to display. They should be encouraging, helpful, and provide clear next steps.
        </p>
      </div>

      {/* When to Use */}
      <section className="space-y-4">
        <h2 className="mb-4 text-2xl font-semibold">When to Use Empty States</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 text-left font-semibold">Type</th>
                <th className="p-3 text-left font-semibold">Context</th>
                <th className="p-3 text-left font-semibold">Message Tone</th>
                <th className="p-3 text-left font-semibold">Call-to-Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">First Use</td>
                <td className="p-3">User has not created any content yet</td>
                <td className="p-3">Encouraging, welcoming</td>
                <td className="p-3 text-muted-foreground">Create first item</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">No Results</td>
                <td className="p-3">Search or filter returned nothing</td>
                <td className="p-3">Neutral, helpful</td>
                <td className="p-3 text-muted-foreground">Adjust search, clear filters</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Cleared</td>
                <td className="p-3">User deleted all content</td>
                <td className="p-3">Neutral, supportive</td>
                <td className="p-3 text-muted-foreground">Create new item</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold">Permission Denied</td>
                <td className="p-3">User lacks access to view content</td>
                <td className="p-3">Informative, not accusatory</td>
                <td className="p-3 text-muted-foreground">Request access</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* First-Use Empty States */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">First-Use Empty States</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            When users first encounter a feature, empty states should be welcoming and guide them to create their first item.
          </p>

          <div className="space-y-6">
            {/* No Budgets Yet */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">No Budgets Yet</h3>
              <EmptyCard
                title="No budgets yet"
                description="Create your first budget to start tracking your spending."
                icon="💰"
                action={{
                  label: 'Create Budget',
                  onClick: () => console.log('Create budget'),
                }}
              />
            </div>

            {/* No Appointments */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">No Appointments</h3>
              <EmptyCard
                title="Your calendar is empty"
                description="Add your first appointment to get started with scheduling."
                icon="📅"
                action={{
                  label: 'Add Appointment',
                  onClick: () => console.log('Add appointment'),
                }}
              />
            </div>

            {/* No Travel Plans */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">No Travel Plans</h3>
              <EmptyCard
                title="Ready for an adventure?"
                description="Start planning your next trip by adding a destination."
                icon="✈️"
                action={{
                  label: 'Plan Trip',
                  onClick: () => console.log('Plan trip'),
                }}
              />
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Implementation:</p>
            <pre className="overflow-x-auto text-xs">
{`<EmptyCard
  title="No budgets yet"
  description="Create your first budget to start tracking your spending."
  icon="💰"
  action={{
    label: 'Create Budget',
    onClick: handleCreateBudget,
  }}
/>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Search with No Results */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Search with No Results</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            When a search returns no results, provide helpful suggestions to refine the search or try alternative actions.
          </p>

          <div className="space-y-6">
            {/* Search Demo */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Interactive Search Demo</h3>
              <div className="rounded-lg border border-border bg-card p-6">
                <TextInput
                  label="Search budgets"
                  placeholder="Try searching for something that doesn't exist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {searchQuery && (
                  <div className="mt-4">
                    <EmptyCard
                      title={`No results for "${searchQuery}"`}
                      description="Try adjusting your search terms or check for typos."
                      icon="🔍"
                      action={{
                        label: 'Clear Search',
                        onClick: () => setSearchQuery(''),
                        variant: 'secondary',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Alternative Actions */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">With Alternative Actions</h3>
              <EmptyCard
                title="No transactions found"
                description="We could not find any transactions matching your search."
                icon="🔍"
              >
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" size="small">
                    Clear Search
                  </Button>
                  <Button variant="secondary" size="small">
                    View All Transactions
                  </Button>
                </div>
              </EmptyCard>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Best Practices for Search Empty States:</p>
            <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
              <li>Show the search query in the empty state message</li>
              <li>Provide suggestions to refine the search</li>
              <li>Offer a way to clear the search or view all items</li>
              <li>Consider showing suggested searches or popular items</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Filtered List with No Matches */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Filtered List with No Matches</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            When filters are applied but no items match, provide a way to adjust or clear filters.
          </p>

          <div className="space-y-6">
            {/* Filter Demo */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Interactive Filter Demo</h3>
              <div className="rounded-lg border border-border bg-card p-6">
                <TextInput
                  label="Filter by category"
                  placeholder="e.g., Food, Transport"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />

                {filterValue && (
                  <div className="mt-4">
                    <EmptyCard
                      title="No items match your filters"
                      description={`No items found in category "${filterValue}".`}
                      icon="🔍"
                    >
                      <div className="mt-4 flex gap-2">
                        <Button variant="secondary" size="small" onClick={() => setFilterValue('')}>
                          Clear Filters
                        </Button>
                        <Button variant="secondary" size="small">
                          View All Categories
                        </Button>
                      </div>
                    </EmptyCard>
                  </div>
                )}
              </div>
            </div>

            {/* Multiple Filters */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Multiple Active Filters</h3>
              <Alert variant="info" title="No transactions found">
                <p className="mb-2">No transactions match your current filters:</p>
                <ul className="mb-4 list-inside list-disc text-sm">
                  <li>Category: Food</li>
                  <li>Date Range: Last 7 days</li>
                  <li>Amount: More than 50 EUR</li>
                </ul>
                <Button variant="secondary" size="small">
                  Clear All Filters
                </Button>
              </Alert>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Best Practices for Filter Empty States:</p>
            <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
              <li>Show which filters are currently active</li>
              <li>Provide a clear way to remove individual filters</li>
              <li>Offer a "Clear all filters" option</li>
              <li>Consider showing the total number of unfiltered items</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Cleared/Deleted Content */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Cleared or Deleted Content</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            When users have deleted all content, the empty state should acknowledge this and encourage them to create new content.
          </p>

          <div className="space-y-6">
            {/* All Tasks Completed */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">All Tasks Completed</h3>
              <EmptyCard
                title="All done!"
                description="You have completed all your tasks. Great work!"
                icon="✅"
                action={{
                  label: 'Add New Task',
                  onClick: () => console.log('Add task'),
                }}
              />
            </div>

            {/* Inbox Zero */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Inbox Zero</h3>
              <EmptyCard
                title="Inbox zero achieved!"
                description="You are all caught up. No messages to display."
                icon="📬"
              />
            </div>

            {/* Trash Emptied */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Trash Emptied</h3>
              <EmptyCard
                title="Trash is empty"
                description="Deleted items will appear here for 30 days before being permanently removed."
                icon="🗑️"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Empty Dashboard Sections */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Empty Dashboard Sections</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Dashboard sections may be empty when there is no relevant data or opportunities to display.
          </p>

          <div className="space-y-6">
            {/* No Opportunities */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">No Opportunities</h3>
              <EmptyCard
                title="No suggestions right now"
                description="Fidus will show relevant suggestions here when opportunities arise."
                icon="💡"
              />
            </div>

            {/* No Recent Activity */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">No Recent Activity</h3>
              <EmptyCard
                title="No recent activity"
                description="Your recent actions and updates will appear here."
                icon="📊"
              />
            </div>

            {/* No Upcoming Events */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">No Upcoming Events</h3>
              <EmptyCard
                title="Nothing scheduled"
                description="You have no upcoming appointments or events."
                icon="📅"
                action={{
                  label: 'Add Event',
                  onClick: () => console.log('Add event'),
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Permission Denied */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Permission Denied Empty States</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            When users lack permission to view content, explain why and provide a path forward.
          </p>

          <div className="space-y-6">
            {/* No Access */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">No Access</h3>
              <EmptyCard
                title="You don't have access"
                description="You need permission to view this content. Contact your administrator for access."
                icon="🔒"
                action={{
                  label: 'Request Access',
                  onClick: () => console.log('Request access'),
                }}
              />
            </div>

            {/* Feature Not Available */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Feature Not Available</h3>
              <EmptyCard
                title="Feature not available"
                description="This feature is not included in your current plan."
                icon="⭐"
                action={{
                  label: 'Upgrade Plan',
                  onClick: () => console.log('Upgrade plan'),
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Empty State vs Error State */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Empty State vs Error State</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            It is critical to distinguish between empty states and error states to provide the right user experience.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 font-semibold">Empty State</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>System is working correctly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>No content exists (yet)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Encouraging and helpful tone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Call-to-action to create content</span>
                </li>
              </ul>
              <div className="mt-4">
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

            <div className="rounded-lg border border-error bg-error/5 p-6">
              <h3 className="mb-3 font-semibold text-error">Error State</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span>✗</span>
                  <span>Something went wrong</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✗</span>
                  <span>Content should exist but cannot load</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✗</span>
                  <span>Informative and solution-oriented</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✗</span>
                  <span>Recovery or retry options</span>
                </li>
              </ul>
              <div className="mt-4">
                <Alert variant="error" title="Failed to load budgets">
                  Unable to retrieve your budget data. Please try again.
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Best Practices</h2>

          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 font-semibold">✅ Do</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Use friendly, encouraging language</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Include a clear call-to-action</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Use icons or illustrations to make empty states more engaging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Explain why the state is empty</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Provide helpful suggestions or tips</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Show the search query or active filters</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-error bg-error/5 p-6">
              <h3 className="mb-3 font-semibold text-error">❌ Don't</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Use negative or discouraging language</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Leave empty states completely blank</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Show a generic "No data" message</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Confuse empty states with error states</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Use overly technical language</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Provide too many call-to-action options</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Writing Empty State Copy */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Writing Empty State Copy</h2>

          <div className="space-y-6">
            {/* Good Examples */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 font-semibold">✅ Good Empty State Messages</h3>
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-sm font-semibold">Title:</p>
                  <p className="text-sm">"Ready to start budgeting?"</p>
                  <p className="text-xs text-muted-foreground">Engaging and action-oriented</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold">Description:</p>
                  <p className="text-sm">"Create your first budget to take control of your spending."</p>
                  <p className="text-xs text-muted-foreground">Clear benefit and next step</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold">Button:</p>
                  <p className="text-sm">"Create Budget"</p>
                  <p className="text-xs text-muted-foreground">Specific action verb</p>
                </div>
              </div>
            </div>

            {/* Bad Examples */}
            <div className="rounded-lg border border-error bg-error/5 p-6">
              <h3 className="mb-3 font-semibold text-error">❌ Bad Empty State Messages</h3>
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-sm font-semibold">Title:</p>
                  <p className="text-sm">"No budgets"</p>
                  <p className="text-xs text-muted-foreground">Too terse and uninviting</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold">Description:</p>
                  <p className="text-sm">"The budget list is empty."</p>
                  <p className="text-xs text-muted-foreground">States the obvious without guidance</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold">Button:</p>
                  <p className="text-sm">"Click here"</p>
                  <p className="text-xs text-muted-foreground">Generic, unclear action</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Accessibility</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Empty state messages announced to screen readers</li>
            <li>Call-to-action buttons have descriptive labels</li>
            <li>Icons are decorative and hidden from screen readers</li>
            <li>Focus management when transitioning from content to empty state</li>
            <li>Keyboard users can navigate to and activate call-to-action buttons</li>
            <li>Empty state cards use semantic HTML (section, heading)</li>
          </ul>
        </div>
      </section>

      {/* Resources */}
      <section className="space-y-4">
        <h2 className="mb-4 text-2xl font-semibold">Resources</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.nngroup.com/articles/empty-state-interface-design/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Nielsen Norman Group: Empty State Design Patterns
            </a>
          </li>
          <li>
            <a
              href="https://uxdesign.cc/empty-state-designing-the-void-77e4297e3fc6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              UX Collective: Designing the Void - Empty State Best Practices
            </a>
          </li>
          <li>
            <a
              href="/components/empty-card"
              className="text-primary hover:underline"
            >
              EmptyCard Component Documentation
            </a>
          </li>
          <li>
            <a
              href="/components/button"
              className="text-primary hover:underline"
            >
              Button Component Documentation
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
