'use client';

import { OpportunityCard, Alert, Badge, Button, Tabs, Tab } from '@fidus/ui';
import { useState } from 'react';

// Mock opportunity data
const mockOpportunities = [
  {
    id: '1',
    type: 'budget-alert',
    title: 'Food Budget Exceeded',
    description: 'You have spent €1,250 of your €1,000 monthly food budget.',
    priority: 'high' as const,
    category: 'Finance',
    timestamp: new Date(),
    actions: [
      { label: 'Adjust Budget', onClick: () => {} },
      { label: 'View Transactions', onClick: () => {} },
    ],
  },
  {
    id: '2',
    type: 'calendar-conflict',
    title: 'Schedule Conflict Detected',
    description: 'You have two appointments at 2:00 PM today: Team Meeting and Doctor Appointment.',
    priority: 'high' as const,
    category: 'Calendar',
    timestamp: new Date(),
    actions: [
      { label: 'Reschedule', onClick: () => {} },
      { label: 'View Calendar', onClick: () => {} },
    ],
  },
  {
    id: '3',
    type: 'weather',
    title: 'Rain Expected This Afternoon',
    description: 'There is a 80% chance of rain starting at 3:00 PM. Consider bringing an umbrella.',
    priority: 'low' as const,
    category: 'Weather',
    timestamp: new Date(),
    actions: [
      { label: 'View Forecast', onClick: () => {} },
    ],
  },
  {
    id: '4',
    type: 'travel-prep',
    title: 'Upcoming Trip to Berlin',
    description: 'Your flight to Berlin is in 3 days. Time to start packing and checking travel documents.',
    priority: 'medium' as const,
    category: 'Travel',
    timestamp: new Date(),
    actions: [
      { label: 'View Checklist', onClick: () => {} },
      { label: 'Flight Details', onClick: () => {} },
    ],
  },
  {
    id: '5',
    type: 'bill-due',
    title: 'Internet Bill Due Soon',
    description: 'Your internet bill of €49.99 is due in 2 days. Pay now to avoid late fees.',
    priority: 'medium' as const,
    category: 'Finance',
    timestamp: new Date(),
    actions: [
      { label: 'Pay Now', onClick: () => {} },
      { label: 'Set Reminder', onClick: () => {} },
    ],
  },
];

export default function OpportunitySurfacePage() {
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const handleDismiss = (id: string) => {
    setOpportunities(opportunities.filter(opp => opp.id !== id));
  };

  const filteredOpportunities = activeFilter === 'all'
    ? opportunities
    : opportunities.filter(opp => opp.category.toLowerCase() === activeFilter);

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Opportunity Surface</h1>
        <p className="text-lg text-muted-foreground">
          The AI-curated dashboard that dynamically shows relevant opportunities based on context, replacing traditional static dashboards.
        </p>
      </div>

      {/* What is Opportunity Surface */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">What is Opportunity Surface?</h2>
          <div className="space-y-3 rounded-lg border border-border bg-card p-6">
            <p className="text-muted-foreground">
              The Opportunity Surface is Fidus's AI-driven dashboard that replaces traditional static dashboards with dynamic, contextual content.
              Instead of showing fixed widgets, it displays relevant opportunities that are curated by an LLM based on:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li><strong>Time:</strong> Morning might show weather and today's schedule, evening might show tomorrow's appointments</li>
              <li><strong>Location:</strong> Nearby events, local weather, location-based reminders</li>
              <li><strong>User History:</strong> Previously engaged opportunities, user preferences, behavior patterns</li>
              <li><strong>Domain Signals:</strong> Budget alerts, calendar conflicts, bill due dates, travel preparations</li>
            </ul>
            <Alert variant="info" className="mt-4">
              <strong>Key Principle:</strong> The LLM decides what to show, not hardcoded logic. The same user might see different opportunities at different times based on contextual relevance.
            </Alert>
          </div>
        </div>
      </section>

      {/* Traditional vs Opportunity Surface */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Traditional Dashboard vs Opportunity Surface</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-left font-semibold">Aspect</th>
                  <th className="p-3 text-left font-semibold">Traditional Dashboard</th>
                  <th className="p-3 text-left font-semibold">Opportunity Surface</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Content</td>
                  <td className="p-3 text-muted-foreground">Fixed widgets (Weather, Calendar, Finance)</td>
                  <td className="p-3 text-muted-foreground">Dynamic opportunity cards</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Visibility</td>
                  <td className="p-3 text-muted-foreground">Always visible</td>
                  <td className="p-3 text-muted-foreground">Contextually relevant</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Configuration</td>
                  <td className="p-3 text-muted-foreground">User configures manually</td>
                  <td className="p-3 text-muted-foreground">LLM decides based on context</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Dismissal</td>
                  <td className="p-3 text-muted-foreground">Auto-hide after timeout</td>
                  <td className="p-3 text-muted-foreground">User controls (swipe/X button)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Personalization</td>
                  <td className="p-3 text-muted-foreground">Limited to widget selection</td>
                  <td className="p-3 text-muted-foreground">Deep contextual adaptation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">How It Works</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold">1</div>
                  <div>
                    <h3 className="font-semibold">Domains Emit Triggers</h3>
                    <p className="text-sm text-muted-foreground">
                      Each domain (Finance, Calendar, Travel, etc.) emits proactive triggers when something relevant happens:
                      BUDGET_EXCEEDED, CALENDAR_CONFLICT, BILL_DUE_SOON, etc.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold">2</div>
                  <div>
                    <h3 className="font-semibold">Opportunity Service Evaluates Relevance</h3>
                    <p className="text-sm text-muted-foreground">
                      The Opportunity Service uses an LLM to evaluate each trigger's relevance based on current context
                      (time, location, user history, current activity).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold">3</div>
                  <div>
                    <h3 className="font-semibold">Ranks by Weighted Score</h3>
                    <p className="text-sm text-muted-foreground">
                      Opportunities are ranked by a weighted score combining urgency, relevance, confidence, and user engagement history.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold">4</div>
                  <div>
                    <h3 className="font-semibold">Renders as OpportunityCard Components</h3>
                    <p className="text-sm text-muted-foreground">
                      The top 5-7 opportunities are rendered as dismissible cards on the dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold">5</div>
                  <div>
                    <h3 className="font-semibold">User Dismisses</h3>
                    <p className="text-sm text-muted-foreground">
                      User can dismiss cards via swipe gesture or X button. Dismissal state is persisted to avoid showing the same opportunity again.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity Card Structure */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Opportunity Card Structure</h2>
          <p className="mb-4 text-muted-foreground">
            Each opportunity is rendered as an OpportunityCard component with a consistent structure:
          </p>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 rounded-lg bg-muted p-4">
              <p className="mb-2 text-sm font-semibold">OpportunityCard Props:</p>
              <pre className="overflow-x-auto text-xs">
{`interface OpportunityCardProps {
  id: string;                    // Unique identifier
  type: string;                  // Trigger type (e.g., 'budget-alert')
  title: string;                 // Card title
  description: string;           // Detailed description
  priority: 'low' | 'medium' | 'high';  // Visual urgency
  category?: string;             // Domain category (Finance, Calendar, etc.)
  timestamp?: Date;              // When opportunity was created
  actions?: Array<{              // Action buttons
    label: string;
    onClick: () => void;
  }>;
  onDismiss: () => void;        // Dismiss handler
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Live Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Live Example</h2>
          <p className="mb-4 text-muted-foreground">
            This is what an Opportunity Surface might look like. Try dismissing cards using the X button.
          </p>

          {/* Filter tabs */}
          <div className="mb-4 flex gap-2">
            <Button
              variant={activeFilter === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveFilter('all')}
            >
              All ({opportunities.length})
            </Button>
            <Button
              variant={activeFilter === 'finance' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveFilter('finance')}
            >
              Finance ({opportunities.filter(o => o.category === 'Finance').length})
            </Button>
            <Button
              variant={activeFilter === 'calendar' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveFilter('calendar')}
            >
              Calendar ({opportunities.filter(o => o.category === 'Calendar').length})
            </Button>
            <Button
              variant={activeFilter === 'travel' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveFilter('travel')}
            >
              Travel ({opportunities.filter(o => o.category === 'Travel').length})
            </Button>
          </div>

          <div className="space-y-4">
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map(opp => (
                <OpportunityCard
                  key={opp.id}
                  {...opp}
                  onDismiss={() => handleDismiss(opp.id)}
                />
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
                <p className="text-muted-foreground">No opportunities to show right now. Check back later!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Opportunity Types */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Opportunity Types (Examples)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-left font-semibold">Type</th>
                  <th className="p-3 text-left font-semibold">Domain</th>
                  <th className="p-3 text-left font-semibold">Priority</th>
                  <th className="p-3 text-left font-semibold">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-xs">BUDGET_EXCEEDED</td>
                  <td className="p-3">Finance</td>
                  <td className="p-3">
                    <Badge variant="error">High</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">Food budget exceeded by €250</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-xs">CALENDAR_CONFLICT</td>
                  <td className="p-3">Calendar</td>
                  <td className="p-3">
                    <Badge variant="error">High</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">Two appointments at same time</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-xs">BILL_DUE_SOON</td>
                  <td className="p-3">Finance</td>
                  <td className="p-3">
                    <Badge variant="warning">Medium</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">Internet bill due in 2 days</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-xs">TRAVEL_PREP</td>
                  <td className="p-3">Travel</td>
                  <td className="p-3">
                    <Badge variant="warning">Medium</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">Flight in 3 days, start packing</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-xs">WEATHER_RELEVANT</td>
                  <td className="p-3">Weather</td>
                  <td className="p-3">
                    <Badge variant="default">Low</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">Rain expected this afternoon</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-xs">SAVINGS_SUGGESTION</td>
                  <td className="p-3">Finance</td>
                  <td className="p-3">
                    <Badge variant="default">Low</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">You could save €50/month on subscriptions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Ranking & Filtering */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Ranking & Filtering</h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="mb-2 font-semibold">Relevance Factors</h3>
              <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
                <li><strong>Time-based:</strong> Morning = weather and today's schedule, evening = tomorrow's appointments</li>
                <li><strong>Location-based:</strong> Nearby events, local weather, location-triggered reminders</li>
                <li><strong>User Behavior:</strong> Previously engaged with similar opportunities, preferences</li>
                <li><strong>Confidence Score:</strong> Domain's confidence in the opportunity's accuracy</li>
                <li><strong>Urgency:</strong> High-priority opportunities (conflicts, exceeded budgets) rank higher</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">User Controls</h3>
              <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
                <li><strong>Filter by Category:</strong> Show only Finance, Calendar, Travel, etc.</li>
                <li><strong>Dismiss Individual Cards:</strong> Swipe or X button removes card</li>
                <li><strong>Snooze:</strong> Remind me later (reappears based on time)</li>
                <li><strong>Never Show Again:</strong> Permanently dismiss this type of opportunity</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Display Limits</h3>
              <p className="text-sm text-muted-foreground">
                Show maximum 5-7 opportunities at once to avoid overwhelming the user. Lower-priority opportunities
                are queued and shown after higher-priority ones are dismissed or resolved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Implementation Examples</h2>

          <div className="space-y-4">
            <div>
              <h3 className="mb-3 font-semibold">Fetching Opportunities</h3>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs">
{`import { useQuery } from '@tanstack/react-query';

function useOpportunities() {
  return useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      const response = await fetch('/api/opportunities', {
        headers: {
          'X-User-Context': JSON.stringify({
            time: new Date().toISOString(),
            location: userLocation,
            activity: currentActivity,
          }),
        },
      });
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });
}

function OpportunitySurface() {
  const { data: opportunities, isLoading } = useOpportunities();

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-4">
      {opportunities.map(opp => (
        <OpportunityCard key={opp.id} {...opp} />
      ))}
    </div>
  );
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Handling Dismissal</h3>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs">
{`async function handleDismiss(opportunityId: string) {
  // Optimistic update
  setOpportunities(prev => prev.filter(o => o.id !== opportunityId));

  // Persist dismissal
  await fetch(\`/api/opportunities/\${opportunityId}/dismiss\`, {
    method: 'POST',
  });

  // Show toast confirmation
  toast({
    title: 'Opportunity dismissed',
    variant: 'success',
  });
}

<OpportunityCard
  {...opportunity}
  onDismiss={() => handleDismiss(opportunity.id)}
/>`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Real-time Updates (WebSocket)</h3>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs">
{`import { useEffect } from 'react';

function useOpportunityUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket('ws://api.fidus.ai/opportunities');

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);

      if (update.type === 'new_opportunity') {
        // Add new opportunity to the list
        queryClient.setQueryData(['opportunities'], (old: any[]) => [
          update.opportunity,
          ...old,
        ]);
      } else if (update.type === 'opportunity_resolved') {
        // Remove resolved opportunity
        queryClient.setQueryData(['opportunities'], (old: any[]) =>
          old.filter(o => o.id !== update.opportunityId)
        );
      }
    };

    return () => ws.close();
  }, [queryClient]);
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Best Practices</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 font-semibold text-success">✅ Do</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Let the LLM decide what opportunities to show based on context</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Provide clear, actionable buttons (not just "View Details")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Allow user dismissal via swipe or X button</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Limit to 5-7 visible opportunities at once</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Update in real-time when new opportunities arise</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Persist dismissal state to avoid re-showing</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-error bg-error/5 p-6">
              <h3 className="mb-3 font-semibold text-error">❌ Don't</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Auto-hide opportunities after a timeout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Show too many opportunities at once (causes overwhelm)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Ignore user context (time, location, history)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Use hardcoded "if morning, show weather" logic</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Require user to manually configure what to show</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Accessibility</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li><strong>Screen Reader Announcements:</strong> New opportunities announced with aria-live="polite"</li>
            <li><strong>Keyboard Navigation:</strong> Tab to navigate cards, Enter to activate actions, X key to dismiss</li>
            <li><strong>Focus Management:</strong> Focus moves to next card after dismissal</li>
            <li><strong>Alternative Text:</strong> Icons and visual indicators have text alternatives</li>
            <li><strong>Color Independence:</strong> Priority indicated by badge text, not just color</li>
          </ul>
        </div>
      </section>

      {/* Mobile Considerations */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Mobile Considerations</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li><strong>Swipe to Dismiss:</strong> Swipe left/right on card to dismiss (like iOS notifications)</li>
            <li><strong>Tap Actions:</strong> Primary action on tap, secondary actions in bottom sheet</li>
            <li><strong>Vertical Scroll:</strong> Cards stack vertically with comfortable spacing</li>
            <li><strong>Pull to Refresh:</strong> Pull down to fetch latest opportunities</li>
            <li><strong>Reduced Motion:</strong> Respect prefers-reduced-motion for animations</li>
          </ul>
        </div>
      </section>

      {/* Related Components */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Related Components</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">OpportunityCard</Badge>
            <Badge variant="default">Alert</Badge>
            <Badge variant="default">Banner</Badge>
            <Badge variant="default">Toast</Badge>
            <Badge variant="default">Badge</Badge>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="space-y-4">
        <h2 className="mb-4 text-2xl font-semibold">Resources</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/components/card" className="text-blue-600 hover:underline">
              Card Component
            </Link>
          </li>
          <li>
            <Link href="/components/badge" className="text-blue-600 hover:underline">
              Badge Component
            </Link>
          </li>
          <li>
            <Link href="/foundations/ai-driven-ui" className="text-blue-600 hover:underline">
              AI-Driven UI Paradigm
            </Link>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/notification-design/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Nielsen Norman Group: Notification Design
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/ai-transparency/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Nielsen Norman Group: AI Transparency
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              WCAG 2.1: Status Messages
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/contextual-content/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Nielsen Norman Group: Contextual Content
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
