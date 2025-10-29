'use client';

import { OpportunityCard, Alert, Badge, Button, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { useState } from 'react';

export default function OpportunitySurfacePage() {
  const [opportunities, setOpportunities] = useState([
    {
      id: '1',
      type: 'budget-alert',
      title: 'Food Budget Exceeded',
      description: 'You have spent €1,250 of your €1,000 monthly food budget.',
      priority: 'high' as const,
      category: 'Finance',
    },
    {
      id: '2',
      type: 'calendar-conflict',
      title: 'Schedule Conflict Detected',
      description: 'You have two appointments at 2:00 PM today.',
      priority: 'high' as const,
      category: 'Calendar',
    },
    {
      id: '3',
      type: 'weather',
      title: 'Rain Expected This Afternoon',
      description: 'There is an 80% chance of rain starting at 3:00 PM.',
      priority: 'low' as const,
      category: 'Weather',
    },
  ]);

  const handleDismiss = (id: string) => {
    setOpportunities(opportunities.filter(opp => opp.id !== id));
  };

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Opportunity Surface Pattern</h1>
      <p className="lead">
        AI-curated dashboard that dynamically shows relevant opportunities based on context, replacing traditional static dashboards with adaptive, contextual content.
      </p>

      <h2>What is Opportunity Surface?</h2>
      <p className="text-sm text-muted-foreground">
        The Opportunity Surface is Fidus&apos;s AI-driven dashboard that replaces static widgets with dynamic, contextual opportunities.
      </p>

      <div className="not-prose my-lg">
        <Alert variant="info" title="Key Principle">
          The LLM decides what to show based on context (time, location, user history), not hardcoded logic. The same user might see different opportunities at different times.
        </Alert>
      </div>

      <h2>Traditional Dashboard vs Opportunity Surface</h2>
      <div className="not-prose my-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-md text-left font-semibold">Aspect</th>
              <th className="p-md text-left font-semibold">Traditional Dashboard</th>
              <th className="p-md text-left font-semibold">Opportunity Surface</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Content</td>
              <td className="p-md text-muted-foreground">Fixed widgets</td>
              <td className="p-md text-muted-foreground">Dynamic opportunity cards</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Visibility</td>
              <td className="p-md text-muted-foreground">Always visible</td>
              <td className="p-md text-muted-foreground">Contextually relevant</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Configuration</td>
              <td className="p-md text-muted-foreground">User configures manually</td>
              <td className="p-md text-muted-foreground">LLM decides based on context</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Dismissal</td>
              <td className="p-md text-muted-foreground">Auto-hide after timeout</td>
              <td className="p-md text-muted-foreground">User controls (swipe/X button)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Interactive Example</h2>
      <p className="text-sm text-muted-foreground">
        Try dismissing cards using the X button to see how the Opportunity Surface updates dynamically.
      </p>

      <div className="not-prose my-lg">
        <ComponentPreview code={`const [opportunities, setOpportunities] = useState([...]);

const handleDismiss = (id: string) => {
  setOpportunities(opportunities.filter(opp => opp.id !== id));
};

<div className="space-y-md">
  {opportunities.map(opp => (
    <OpportunityCard
      key={opp.id}
      title={opp.title}
      description={opp.description}
      priority={opp.priority}
      onDismiss={() => handleDismiss(opp.id)}
    />
  ))}
</div>`}>
          <div className="space-y-md">
            {opportunities.length > 0 ? (
              opportunities.map(opp => (
                <OpportunityCard
                  key={opp.id}
                  {...opp}
                  onDismiss={() => handleDismiss(opp.id)}
                />
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-card p-xl text-center">
                <p className="text-muted-foreground">No opportunities to show right now. Check back later!</p>
              </div>
            )}
          </div>
        </ComponentPreview>
      </div>

      <h2>How It Works</h2>
      <div className="not-prose space-y-md my-lg">
        <div className="flex items-start gap-md">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">1</div>
          <div>
            <h3 className="font-semibold mb-xs">Domains Emit Triggers</h3>
            <p className="text-sm text-muted-foreground">
              Each domain (Finance, Calendar, Travel) emits proactive triggers when something relevant happens: BUDGET_EXCEEDED, CALENDAR_CONFLICT, BILL_DUE_SOON.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-md">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">2</div>
          <div>
            <h3 className="font-semibold mb-xs">LLM Evaluates Relevance</h3>
            <p className="text-sm text-muted-foreground">
              The Opportunity Service uses an LLM to evaluate each trigger&apos;s relevance based on context (time, location, user history).
            </p>
          </div>
        </div>
        <div className="flex items-start gap-md">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">3</div>
          <div>
            <h3 className="font-semibold mb-xs">Ranks by Weighted Score</h3>
            <p className="text-sm text-muted-foreground">
              Opportunities are ranked by urgency, relevance, confidence, and user engagement history.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-md">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">4</div>
          <div>
            <h3 className="font-semibold mb-xs">Renders as OpportunityCard</h3>
            <p className="text-sm text-muted-foreground">
              The top 5-7 opportunities are rendered as dismissible cards on the dashboard.
            </p>
          </div>
        </div>
      </div>

      <h2>Opportunity Types</h2>
      <div className="not-prose my-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-md text-left font-semibold">Type</th>
              <th className="p-md text-left font-semibold">Domain</th>
              <th className="p-md text-left font-semibold">Priority</th>
              <th className="p-md text-left font-semibold">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-md font-mono text-xs">BUDGET_EXCEEDED</td>
              <td className="p-md">Finance</td>
              <td className="p-md"><Badge variant="error">High</Badge></td>
              <td className="p-md text-muted-foreground">Food budget exceeded by €250</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-mono text-xs">CALENDAR_CONFLICT</td>
              <td className="p-md">Calendar</td>
              <td className="p-md"><Badge variant="error">High</Badge></td>
              <td className="p-md text-muted-foreground">Two appointments at same time</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-mono text-xs">BILL_DUE_SOON</td>
              <td className="p-md">Finance</td>
              <td className="p-md"><Badge variant="warning">Medium</Badge></td>
              <td className="p-md text-muted-foreground">Internet bill due in 2 days</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-mono text-xs">WEATHER_RELEVANT</td>
              <td className="p-md">Weather</td>
              <td className="p-md"><Badge variant="default">Low</Badge></td>
              <td className="p-md text-muted-foreground">Rain expected this afternoon</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>As the main dashboard for contextual, AI-driven content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When showing proactive suggestions and alerts</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For time-sensitive, location-aware recommendations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To surface relevant actions without user searching</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Let the LLM decide what to show based on context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Limit to 5-7 visible opportunities at once</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide clear, actionable buttons (not just &quot;View Details&quot;)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Allow user dismissal via swipe or X button</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Update in real-time when new opportunities arise</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>New opportunities announced with aria-live=&quot;polite&quot;</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard navigation: Tab through cards, Enter for actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus moves to next card after dismissal</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Priority indicated by badge text, not just color</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do&apos;s and Don&apos;ts</h2>
      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <span className="text-2xl">✓</span> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Let LLM decide what opportunities to show</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide clear, actionable buttons</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Allow user dismissal (swipe/X button)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Limit to 5-7 visible opportunities</span>
            </li>
          </ul>
        </div>

        <div className="border-2 border-error rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don&apos;t
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Auto-hide opportunities after timeout</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Show too many opportunities at once</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use hardcoded &quot;if morning, show weather&quot; logic</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Ignore user context (time, location, history)</span>
            </li>
          </ul>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/opportunity-card"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Opportunity Card
          </h3>
          <p className="text-sm text-muted-foreground">Dynamic opportunity cards</p>
        </Link>

        <Link
          href="/components/alert"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Alert
          </h3>
          <p className="text-sm text-muted-foreground">Contextual messages</p>
        </Link>

        <Link
          href="/components/badge"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Badge
          </h3>
          <p className="text-sm text-muted-foreground">Priority indicators</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/notification-design/"
              external
              showIcon
            >
              Nielsen Norman Group: Notification Design
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
            <Link variant="standalone" href="/foundations/ai-driven-ui">
              AI-Driven UI Paradigm
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
