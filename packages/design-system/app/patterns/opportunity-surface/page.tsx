'use client';

import { OpportunityCard } from '@fidus/ui/opportunity-card';
import { Alert } from '@fidus/ui/alert';
import { Badge } from '@fidus/ui/badge';
import { Button } from '@fidus/ui/button';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { useState } from 'react';

type TimeOfDay = 'morning' | 'afternoon' | 'evening';
type UserSituation = 'normal' | 'overspent' | 'traveling';

interface Opportunity {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

const OPPORTUNITIES_BY_CONTEXT = {
  morning: {
    normal: [
      {
        id: 'm1',
        type: 'calendar-today',
        title: 'Your Day at a Glance',
        description: 'You have 3 meetings today. Next: Team Standup at 9:00 AM (in 30 minutes).',
        priority: 'medium' as const,
        category: 'Calendar',
      },
      {
        id: 'm2',
        type: 'commute-traffic',
        title: 'Heavy Traffic on Your Route',
        description: 'Your usual route to work has 15 min delays. Consider leaving 10 minutes early.',
        priority: 'low' as const,
        category: 'Travel',
      },
    ],
    overspent: [
      {
        id: 'm3',
        type: 'budget-alert',
        title: 'Food Budget Exceeded',
        description: 'You&apos;ve spent €1,250 of your €1,000 monthly food budget. Consider meal planning.',
        priority: 'high' as const,
        category: 'Finance',
      },
      {
        id: 'm1',
        type: 'calendar-today',
        title: 'Your Day at a Glance',
        description: 'You have 3 meetings today. Next: Team Standup at 9:00 AM (in 30 minutes).',
        priority: 'medium' as const,
        category: 'Calendar',
      },
    ],
    traveling: [
      {
        id: 'm4',
        type: 'flight-checkin',
        title: 'Flight to Berlin - Check-in Open',
        description: 'Your flight LH2134 departs tomorrow at 10:30 AM. Check in now to select your seat.',
        priority: 'high' as const,
        category: 'Travel',
      },
      {
        id: 'm5',
        type: 'weather-destination',
        title: 'Rain Expected in Berlin',
        description: 'Pack an umbrella - 80% chance of rain on Wednesday.',
        priority: 'low' as const,
        category: 'Weather',
      },
    ],
  },
  afternoon: {
    normal: [
      {
        id: 'a1',
        type: 'email-pending',
        title: '3 Emails Need Response',
        description: 'You have 3 unread emails that require action.',
        priority: 'medium' as const,
        category: 'Communication',
      },
    ],
    overspent: [
      {
        id: 'a2',
        type: 'spending-insight',
        title: 'Spending Pattern Detected',
        description: 'You spend 40% more on weekends vs. weekdays. Review your budget strategy?',
        priority: 'low' as const,
        category: 'Finance',
      },
    ],
    traveling: [
      {
        id: 'a3',
        type: 'meeting-prep',
        title: 'Tomorrow&apos;s Meeting in Berlin',
        description: 'Client presentation at 2 PM. Meeting room booked, agenda ready.',
        priority: 'medium' as const,
        category: 'Calendar',
      },
    ],
  },
  evening: {
    normal: [
      {
        id: 'e1',
        type: 'tomorrow-preview',
        title: 'Tomorrow: 2 Meetings, 1 Deadline',
        description: 'Your schedule tomorrow: Client call 10 AM, Team sync 3 PM, Q4 report due.',
        priority: 'low' as const,
        category: 'Calendar',
      },
    ],
    overspent: [
      {
        id: 'e2',
        type: 'grocery-suggestion',
        title: 'Meal Plan for This Week?',
        description: 'Save €200/month by meal planning. Create a grocery list based on your budget.',
        priority: 'medium' as const,
        category: 'Finance',
      },
    ],
    traveling: [
      {
        id: 'e3',
        type: 'packing-reminder',
        title: 'Don&apos;t Forget to Pack',
        description: 'Flight tomorrow at 10:30 AM. Chargers, passport, presentation materials.',
        priority: 'high' as const,
        category: 'Travel',
      },
    ],
  },
};

export default function OpportunitySurfacePage() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [userSituation, setUserSituation] = useState<UserSituation>('normal');
  const [opportunities, setOpportunities] = useState<Opportunity[]>(OPPORTUNITIES_BY_CONTEXT.morning.normal);

  const updateContext = (newTime: TimeOfDay, newSituation: UserSituation) => {
    setTimeOfDay(newTime);
    setUserSituation(newSituation);
    setOpportunities(OPPORTUNITIES_BY_CONTEXT[newTime][newSituation]);
  };

  const handleDismiss = (id: string) => {
    setOpportunities(opportunities.filter(opp => opp.id !== id));
  };

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Opportunity Surface Pattern</h1>
      <p className="lead">
        AI-driven dashboard that shows contextually relevant opportunities instead of static widgets. Same user, different context = different dashboard.
      </p>

      <h2>The Problem with Traditional Dashboards</h2>
      <p>
        Traditional dashboards show the <strong>same widgets</strong> to everyone, all the time:
      </p>

      <div className="not-prose my-lg">
        <div className="rounded-lg border-2 border-border bg-muted/30 p-lg">
          <h3 className="text-base font-semibold mb-md">❌ Traditional Dashboard (Static)</h3>
          <div className="grid gap-md md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-md">
              <div className="text-sm font-semibold mb-xs">Weather Widget</div>
              <div className="text-xs text-muted-foreground">Always visible, even when irrelevant</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-md">
              <div className="text-sm font-semibold mb-xs">Calendar Widget</div>
              <div className="text-xs text-muted-foreground">Shows full month, not today&apos;s urgency</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-md">
              <div className="text-sm font-semibold mb-xs">Finance Widget</div>
              <div className="text-xs text-muted-foreground">Generic totals, no actionable insights</div>
            </div>
          </div>
          <div className="mt-md text-sm text-muted-foreground">
            💡 Same layout at 7 AM (rushing to work) and 8 PM (planning tomorrow)
          </div>
        </div>
      </div>

      <h2>Opportunity Surface: Context-Adaptive Dashboard</h2>
      <p>
        The Opportunity Surface shows <strong>only what&apos;s relevant right now</strong>. The LLM evaluates:
      </p>

      <div className="not-prose my-lg">
        <div className="grid gap-md md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-md">
            <h4 className="text-sm font-semibold mb-sm">🕐 Time Context</h4>
            <ul className="text-xs space-y-xs text-muted-foreground">
              <li>• Morning (7 AM): Today&apos;s schedule + commute traffic</li>
              <li>• Afternoon (2 PM): Pending tasks + emails</li>
              <li>• Evening (8 PM): Tomorrow&apos;s prep</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-md">
            <h4 className="text-sm font-semibold mb-sm">📊 User Situation</h4>
            <ul className="text-xs space-y-xs text-muted-foreground">
              <li>• Budget overspent: Financial guidance cards</li>
              <li>• Traveling tomorrow: Flight check-in, weather, packing</li>
              <li>• Normal day: Calendar + relevant tasks</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Interactive Context Demo</h2>
      <p className="text-sm text-muted-foreground">
        Change the time and user situation to see how the Opportunity Surface adapts dynamically.
      </p>

      <div className="not-prose my-lg">
        <ComponentPreview code={`const [timeOfDay, setTimeOfDay] = useState('morning');
const [userSituation, setUserSituation] = useState('normal');
const [opportunities, setOpportunities] = useState(OPPORTUNITIES_BY_CONTEXT.morning.normal);

const updateContext = (newTime, newSituation) => {
  setOpportunities(OPPORTUNITIES_BY_CONTEXT[newTime][newSituation]);
};

<div className="space-y-md">
  {/* Context Controls */}
  <div className="flex gap-md">
    <Button onClick={() => updateContext('morning', userSituation)}>
      Morning (7 AM)
    </Button>
    <Button onClick={() => updateContext('afternoon', userSituation)}>
      Afternoon (2 PM)
    </Button>
    <Button onClick={() => updateContext('evening', userSituation)}>
      Evening (8 PM)
    </Button>
  </div>

  {/* Opportunities */}
  {opportunities.map(opp => (
    <OpportunityCard key={opp.id} {...opp} onDismiss={() => handleDismiss(opp.id)} />
  ))}
</div>`}>
          <div className="space-y-md">
            {/* Context Controls */}
            <div className="rounded-lg bg-muted/50 p-md border border-border">
              <div className="mb-md">
                <h4 className="text-sm font-semibold mb-sm">🕐 Time of Day</h4>
                <Stack direction="horizontal" spacing="sm">
                  <Button
                    size="sm"
                    variant={timeOfDay === 'morning' ? 'primary' : 'secondary'}
                    onClick={() => updateContext('morning', userSituation)}
                  >
                    Morning (7 AM)
                  </Button>
                  <Button
                    size="sm"
                    variant={timeOfDay === 'afternoon' ? 'primary' : 'secondary'}
                    onClick={() => updateContext('afternoon', userSituation)}
                  >
                    Afternoon (2 PM)
                  </Button>
                  <Button
                    size="sm"
                    variant={timeOfDay === 'evening' ? 'primary' : 'secondary'}
                    onClick={() => updateContext('evening', userSituation)}
                  >
                    Evening (8 PM)
                  </Button>
                </Stack>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-sm">👤 User Situation</h4>
                <Stack direction="horizontal" spacing="sm">
                  <Button
                    size="sm"
                    variant={userSituation === 'normal' ? 'primary' : 'secondary'}
                    onClick={() => updateContext(timeOfDay, 'normal')}
                  >
                    Normal Day
                  </Button>
                  <Button
                    size="sm"
                    variant={userSituation === 'overspent' ? 'primary' : 'secondary'}
                    onClick={() => updateContext(timeOfDay, 'overspent')}
                  >
                    Budget Overspent
                  </Button>
                  <Button
                    size="sm"
                    variant={userSituation === 'traveling' ? 'primary' : 'secondary'}
                    onClick={() => updateContext(timeOfDay, 'traveling')}
                  >
                    Traveling Tomorrow
                  </Button>
                </Stack>
              </div>
            </div>

            {/* Current Context Indicator */}
            <div className="rounded-lg bg-primary/10 border border-primary/30 p-md">
              <div className="flex items-center gap-sm text-sm">
                <span className="font-semibold">Current Context:</span>
                <Badge variant="info">
                  {timeOfDay === 'morning' ? '🌅 7:00 AM' : timeOfDay === 'afternoon' ? '☀️ 2:00 PM' : '🌆 8:00 PM'}
                </Badge>
                <Badge variant="info">
                  {userSituation === 'normal' ? '📅 Normal' : userSituation === 'overspent' ? '💰 Budget Alert' : '✈️ Travel'}
                </Badge>
              </div>
            </div>

            {/* Opportunity Cards */}
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
                  <p className="text-sm text-muted-foreground">
                    All opportunities dismissed. The LLM will evaluate new ones based on changing context.
                  </p>
                </div>
              )}
            </div>
          </div>
        </ComponentPreview>
      </div>

      <h2>Real-World Example: Same User, 3 Different Times</h2>
      <div className="not-prose my-lg space-y-md">
        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-md">
          <div className="flex items-start gap-md">
            <div className="text-2xl">🌅</div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-xs">Morning (7:00 AM) - Rushing to Work</h4>
              <div className="text-xs text-muted-foreground mb-sm">
                <strong>Context:</strong> User is about to leave for work
              </div>
              <div className="bg-card rounded-lg p-sm border border-border">
                <div className="text-xs space-y-xs">
                  <div>✓ <strong>Today&apos;s Schedule</strong> - First meeting in 2 hours</div>
                  <div>✓ <strong>Traffic Alert</strong> - Route has 15 min delay</div>
                  <div className="text-muted-foreground">❌ Tomorrow&apos;s calendar (not urgent)</div>
                  <div className="text-muted-foreground">❌ Weekly spending report (not time-sensitive)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-md">
          <div className="flex items-start gap-md">
            <div className="text-2xl">☀️</div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-xs">Afternoon (2:00 PM) - Work Mode</h4>
              <div className="text-xs text-muted-foreground mb-sm">
                <strong>Context:</strong> User is at work, focused on tasks
              </div>
              <div className="bg-card rounded-lg p-sm border border-border">
                <div className="text-xs space-y-xs">
                  <div>✓ <strong>3 Emails Need Response</strong> - Pending actions</div>
                  <div>✓ <strong>Meeting Prep</strong> - Tomorrow&apos;s client call</div>
                  <div className="text-muted-foreground">❌ Traffic alerts (already at work)</div>
                  <div className="text-muted-foreground">❌ Morning schedule (past)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-md">
          <div className="flex items-start gap-md">
            <div className="text-2xl">🌆</div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-xs">Evening (8:00 PM) - Planning Mode</h4>
              <div className="text-xs text-muted-foreground mb-sm">
                <strong>Context:</strong> User is home, planning tomorrow
              </div>
              <div className="bg-card rounded-lg p-sm border border-border">
                <div className="text-xs space-y-xs">
                  <div>✓ <strong>Tomorrow Preview</strong> - 2 meetings, 1 deadline</div>
                  <div>✓ <strong>Flight Check-in</strong> - If traveling tomorrow</div>
                  <div className="text-muted-foreground">❌ Today&apos;s schedule (past)</div>
                  <div className="text-muted-foreground">❌ Current traffic (not relevant)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2>How It Works</h2>
      <div className="not-prose space-y-md my-lg">
        <div className="flex items-start gap-md">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">1</div>
          <div>
            <h3 className="font-semibold mb-xs">Domains Emit Triggers</h3>
            <p className="text-sm text-muted-foreground">
              Finance domain detects: <code className="text-xs">BUDGET_EXCEEDED</code><br/>
              Calendar domain detects: <code className="text-xs">MEETING_IN_30MIN</code><br/>
              Travel domain detects: <code className="text-xs">FLIGHT_CHECKIN_OPEN</code>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-md">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">2</div>
          <div>
            <h3 className="font-semibold mb-xs">LLM Scores Relevance</h3>
            <p className="text-sm text-muted-foreground">
              Context: 7:00 AM, user at home, normal day<br/>
              • <code className="text-xs">MEETING_IN_30MIN</code> → Score: 95 (high urgency + time-sensitive)<br/>
              • <code className="text-xs">BUDGET_EXCEEDED</code> → Score: 40 (important but not urgent now)<br/>
              • <code className="text-xs">WEEKLY_REPORT</code> → Score: 10 (not time-sensitive)
            </p>
          </div>
        </div>

        <div className="flex items-start gap-md">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">3</div>
          <div>
            <h3 className="font-semibold mb-xs">Top Opportunities Rendered</h3>
            <p className="text-sm text-muted-foreground">
              Only opportunities with score &gt; 70 are shown as OpportunityCards on the dashboard. User controls dismissal (no auto-hide).
            </p>
          </div>
        </div>
      </div>

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>As the main dashboard/home screen in AI-driven applications</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When user context significantly affects what&apos;s relevant (time, location, situation)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When you want to surface proactive insights, not just reactive responses</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When different users (or same user at different times) need different content</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Let LLM decide relevance based on context - don&apos;t hardcode &quot;if morning, show X&quot;</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>User controls dismissal (X button, swipe) - NEVER auto-hide based on timers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show 2-5 opportunities max - prioritize quality over quantity</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Re-evaluate opportunities when context changes (time passes, location changes)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Include actionable CTAs in OpportunityCards (not just passive info)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Announce new opportunities with aria-live=&quot;polite&quot;</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Dismissal buttons must have clear aria-labels (&quot;Dismiss budget alert&quot;)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Ensure keyboard navigation between opportunities and actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>High-priority opportunities should have higher contrast/visual weight</span>
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
              <span>Let LLM evaluate relevance based on full context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Give user full control over dismissal (X button, swipe)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Re-evaluate opportunities as context changes</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Include clear CTAs in opportunity cards</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show empty state when no relevant opportunities exist</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Prioritize time-sensitive opportunities in the morning</span>
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
              <span>Hardcode &quot;if morning, show calendar widget&quot; logic</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Auto-hide opportunities after timeout (user controls dismissal)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Show static widgets that never change</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Overwhelm with 10+ opportunities at once</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Ignore context changes (time, location, user state)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Mix Opportunity Surface with traditional fixed navigation</span>
            </li>
          </ul>
        </div>
      </div>

      <h2>Related Components &amp; Patterns</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/opportunity-card"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            OpportunityCard
          </h3>
          <p className="text-sm text-muted-foreground">The card component used in Opportunity Surface</p>
        </Link>

        <Link
          href="/architecture/ui-decision-layer"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            UI Decision Layer
          </h3>
          <p className="text-sm text-muted-foreground">How LLM decides which UI to render</p>
        </Link>

        <Link
          href="/foundations/ai-driven-ui"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            AI-Driven UI Paradigm
          </h3>
          <p className="text-sm text-muted-foreground">Core principles of context-adaptive UI</p>
        </Link>

        <Link
          href="/components/alert"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Alert
          </h3>
          <p className="text-sm text-muted-foreground">For high-priority opportunities</p>
        </Link>

        <Link
          href="/components/badge"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Badge
          </h3>
          <p className="text-sm text-muted-foreground">Priority and category indicators</p>
        </Link>

        <Link
          href="/patterns/empty-states"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Empty States
          </h3>
          <p className="text-sm text-muted-foreground">When no opportunities exist</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link variant="standalone" href="/foundations/ai-driven-ui">
              AI-Driven UI Paradigm - Core Philosophy
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/architecture/ui-decision-layer">
              UI Decision Layer - Technical Implementation
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/personalization/"
              external
              showIcon
            >
              Nielsen Norman Group: Personalization
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/context-sensitive-help/"
              external
              showIcon
            >
              Nielsen Norman Group: Context-Sensitive Help
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
