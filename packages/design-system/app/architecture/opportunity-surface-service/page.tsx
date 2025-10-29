'use client';

export default function OpportunitySurfaceServicePage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Opportunity Surface Service</h1>
      <p className="lead">
        The Opportunity Surface Service manages Fidus's dynamic dashboard, curating and ranking
        opportunity cards based on relevance, context, and user behavior.
      </p>

      <h2>What is the Opportunity Surface?</h2>
      <p>
        The Opportunity Surface is Fidus's answer to the traditional static dashboard. Instead of
        showing fixed widgets, it dynamically displays context-relevant opportunity cards that the
        user can act on or dismiss.
      </p>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6 not-prose">
        <h3 className="text-lg font-semibold mb-4">Key Differences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4">
            <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">Traditional Dashboard</h4>
            <ul className="space-y-1 text-red-600 dark:text-red-400">
              <li>❌ Fixed widgets hardcoded in layout</li>
              <li>❌ Same view for all users</li>
              <li>❌ Static all day long</li>
              <li>❌ User must seek relevant info</li>
            </ul>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-4">
            <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Opportunity Surface</h4>
            <ul className="space-y-1 text-green-600 dark:text-green-400">
              <li>✅ Dynamic cards based on relevance</li>
              <li>✅ Personalized per user</li>
              <li>✅ Changes throughout the day</li>
              <li>✅ Relevant info surfaces proactively</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Service Responsibilities</h2>

      <div className="space-y-4 my-6">
        <div className="border-l-4 border-primary pl-4">
          <h3 className="text-base font-semibold">1. Query Opportunities from Domains</h3>
          <p className="text-sm text-muted-foreground">
            Poll domain supervisors for potential opportunities (budget alerts, calendar conflicts,
            travel reminders, etc.)
          </p>
        </div>

        <div className="border-l-4 border-secondary pl-4">
          <h3 className="text-base font-semibold">2. Rank by Relevance</h3>
          <p className="text-sm text-muted-foreground">
            Score opportunities based on time, location, user behavior, and domain confidence
          </p>
        </div>

        <div className="border-l-4 border-accent pl-4">
          <h3 className="text-base font-semibold">3. Filter Dismissed Opportunities</h3>
          <p className="text-sm text-muted-foreground">
            Exclude opportunities user has already dismissed (unless they become relevant again)
          </p>
        </div>

        <div className="border-l-4 border-muted pl-4">
          <h3 className="text-base font-semibold">4. Manage User Dismissals</h3>
          <p className="text-sm text-muted-foreground">
            Track when users dismiss cards and learn from dismissal patterns
          </p>
        </div>
      </div>

      <h2>Opportunity Lifecycle</h2>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6 not-prose">
        <h3 className="text-sm font-semibold mb-4">From Domain Event to Dashboard Card</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
            <div>
              <strong>Domain Emits Trigger</strong><br />
              <span className="text-muted-foreground text-xs">
                Finance domain detects budget at 95%, emits BUDGET_EXCEEDED trigger
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
            <div>
              <strong>Service Evaluates Relevance</strong><br />
              <span className="text-muted-foreground text-xs">
                Check: Is budget period ending soon? Is user actively spending? Time context?
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
            <div>
              <strong>Ranks Against Other Opportunities</strong><br />
              <span className="text-muted-foreground text-xs">
                Compare with calendar conflicts, travel reminders, etc. Sort by relevance score
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-xs font-bold">4</div>
            <div>
              <strong>Renders as OpportunityCard</strong><br />
              <span className="text-muted-foreground text-xs">
                Card appears on dashboard with urgency styling, data, and action buttons
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-xs font-bold">5</div>
            <div>
              <strong>User Dismisses</strong><br />
              <span className="text-muted-foreground text-xs">
                User swipes card away. Service persists dismissal state and learns from pattern
              </span>
            </div>
          </div>
        </div>
      </div>

      <h2>Ranking Algorithm</h2>

      <p>
        The service uses a weighted scoring algorithm to rank opportunities:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`interface OpportunityScore {
  timeRelevance: number;      // 0-100
  locationRelevance: number;  // 0-100
  userHistory: number;        // 0-100
  domainConfidence: number;   // 0-100 (from domain)
  urgency: number;            // 0-100 (critical=100, high=75, medium=50, low=25)
}

function calculateRelevance(opportunity: Opportunity): number {
  const scores = {
    timeRelevance: calculateTimeRelevance(opportunity),
    locationRelevance: calculateLocationRelevance(opportunity),
    userHistory: calculateUserHistoryScore(opportunity),
    domainConfidence: opportunity.confidence * 100,
    urgency: urgencyToScore(opportunity.urgency)
  };

  // Weighted average
  const weights = {
    timeRelevance: 0.25,
    locationRelevance: 0.15,
    userHistory: 0.20,
    domainConfidence: 0.25,
    urgency: 0.15
  };

  return (
    scores.timeRelevance * weights.timeRelevance +
    scores.locationRelevance * weights.locationRelevance +
    scores.userHistory * weights.userHistory +
    scores.domainConfidence * weights.domainConfidence +
    scores.urgency * weights.urgency
  );
}

// Example: Budget Alert
const budgetAlert = {
  type: 'BUDGET_EXCEEDED',
  confidence: 0.95,
  urgency: 'high',
  context: {
    daysLeftInPeriod: 3,
    percentUsed: 95,
    recentActivity: true
  }
};

const scores = {
  timeRelevance: 90,        // End of month
  locationRelevance: 100,   // Not location-dependent
  userHistory: 85,          // User checks budgets regularly
  domainConfidence: 95,     // From domain
  urgency: 75               // High urgency
};

const relevance =
  90 * 0.25 +    // 22.5
  100 * 0.15 +   // 15.0
  85 * 0.20 +    // 17.0
  95 * 0.25 +    // 23.75
  75 * 0.15;     // 11.25
  // = 89.5 (very high relevance)`}
      </pre>

      <h3>Time Relevance Calculation</h3>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`function calculateTimeRelevance(opportunity: Opportunity): number {
  const now = new Date();
  const currentHour = now.getHours();

  switch (opportunity.type) {
    case 'CALENDAR_CONFLICT':
      // More relevant as event approaches
      const hoursUntilEvent = opportunity.hoursUntil;
      if (hoursUntilEvent < 1) return 100;
      if (hoursUntilEvent < 2) return 90;
      if (hoursUntilEvent < 24) return 70;
      return 40;

    case 'BUDGET_EXCEEDED':
      // More relevant at end of billing period
      const daysLeft = opportunity.daysLeftInPeriod;
      if (daysLeft <= 2) return 95;
      if (daysLeft <= 5) return 80;
      if (daysLeft <= 10) return 60;
      return 40;

    case 'WEATHER_ALERT':
      // More relevant in morning before leaving home
      if (currentHour >= 6 && currentHour <= 9) return 90;
      if (currentHour >= 10 && currentHour <= 12) return 70;
      return 30;

    case 'TRAVEL_CHECKIN':
      // More relevant as departure approaches
      const hoursUntilDeparture = opportunity.hoursUntilDeparture;
      if (hoursUntilDeparture < 24) return 100;
      if (hoursUntilDeparture < 48) return 70;
      return 40;

    default:
      return 50;  // Neutral relevance
  }
}`}
      </pre>

      <h3>User History Scoring</h3>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`function calculateUserHistoryScore(opportunity: Opportunity): number {
  const userHistory = getUserHistory(opportunity.userId);

  // Has user engaged with similar opportunities?
  const similarEngagements = userHistory.engagements.filter(
    e => e.type === opportunity.type
  );
  const engagementRate = similarEngagements.length > 0
    ? similarEngagements.filter(e => e.action !== 'dismiss').length / similarEngagements.length
    : 0.5;  // Neutral if no history

  // Has user dismissed this type recently?
  const recentDismissals = userHistory.dismissals.filter(
    d => d.type === opportunity.type &&
         d.timestamp > Date.now() - 24 * 60 * 60 * 1000  // Last 24h
  );
  const dismissalPenalty = recentDismissals.length * 20;  // -20 per dismissal

  // Calculate base score from engagement
  let score = engagementRate * 100;

  // Apply dismissal penalty
  score = Math.max(0, score - dismissalPenalty);

  return score;
}

// Example
const user = {
  engagements: [
    { type: 'BUDGET_EXCEEDED', action: 'view', timestamp: ... },
    { type: 'BUDGET_EXCEEDED', action: 'adjust', timestamp: ... },
    { type: 'WEATHER_ALERT', action: 'dismiss', timestamp: ... }
  ],
  dismissals: [
    { type: 'WEATHER_ALERT', timestamp: Date.now() - 3 * 60 * 60 * 1000 }
  ]
};

// Budget alert: 2/2 engagements, 0 dismissals = 100 score
// Weather alert: 0/1 engagements, 1 recent dismissal = 0 - 20 = 0 score`}
      </pre>

      <h2>API Endpoints</h2>

      <h3>GET /opportunities</h3>
      <p>Fetch ranked list of opportunities for current user:</p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`GET /api/opportunities
Headers:
  Authorization: Bearer <token>

Query Parameters:
  limit: number (default: 10)
  minRelevance: number (default: 60)
  includeDismissed: boolean (default: false)

Response:
{
  "opportunities": [
    {
      "id": "opp-123",
      "type": "BUDGET_EXCEEDED",
      "title": "Food Budget Exceeded",
      "description": "You've spent 950 EUR of 1000 EUR budget with 3 days left in October",
      "urgency": "high",
      "relevance": 89.5,
      "domain": "finance",
      "componentType": "budget-alert-card",
      "props": {
        "category": "food",
        "spent": 950,
        "limit": 1000,
        "daysLeft": 3,
        "period": "monthly"
      },
      "actions": [
        {
          "id": "view-transactions",
          "label": "View Transactions",
          "primary": true
        },
        {
          "id": "adjust-budget",
          "label": "Adjust Budget",
          "primary": false
        }
      ],
      "createdAt": "2025-10-29T14:30:00Z",
      "expiresAt": "2025-10-31T23:59:59Z"
    },
    {
      "id": "opp-124",
      "type": "CALENDAR_CONFLICT",
      "title": "Meeting Conflict",
      "description": "Two meetings overlap at 2pm today",
      "urgency": "medium",
      "relevance": 78.2,
      "domain": "calendar",
      "componentType": "calendar-conflict-card",
      "props": {
        "conflictingEvents": [
          {
            "id": "evt-1",
            "title": "Team Standup",
            "start": "2025-10-29T14:00:00Z"
          },
          {
            "id": "evt-2",
            "title": "Client Call",
            "start": "2025-10-29T14:00:00Z"
          }
        ]
      },
      "actions": [
        {
          "id": "resolve-conflict",
          "label": "Resolve Conflict",
          "primary": true
        }
      ],
      "createdAt": "2025-10-29T13:45:00Z",
      "expiresAt": "2025-10-29T14:00:00Z"
    }
  ],
  "totalCount": 5,
  "hasMore": false,
  "nextRelevanceThreshold": 55.0
}`}
      </pre>

      <h3>POST /opportunities/:id/dismiss</h3>
      <p>Dismiss an opportunity card:</p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`POST /api/opportunities/opp-123/dismiss
Headers:
  Authorization: Bearer <token>

Body:
{
  "reason": "not-interested" | "already-handled" | "not-relevant" | "other",
  "feedback": "Optional feedback text"
}

Response:
{
  "success": true,
  "opportunityId": "opp-123",
  "dismissedAt": "2025-10-29T14:35:00Z",
  "willReappear": false,
  "message": "Budget alert dismissed. You won't see this again for this period."
}`}
      </pre>

      <h3>POST /opportunities/:id/engage</h3>
      <p>Track user engagement with opportunity:</p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`POST /api/opportunities/opp-123/engage
Headers:
  Authorization: Bearer <token>

Body:
{
  "action": "view" | "click" | "complete",
  "actionId": "view-transactions",  // Optional: which action button
  "duration": 45  // Optional: seconds spent on opportunity
}

Response:
{
  "success": true,
  "opportunityId": "opp-123",
  "engagedAt": "2025-10-29T14:36:00Z",
  "message": "Engagement recorded"
}`}
      </pre>

      <h2>Real-time Updates</h2>

      <p>
        The Opportunity Surface supports real-time updates via WebSocket or Server-Sent Events:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// Client-side WebSocket connection
const ws = new WebSocket('wss://api.fidus.ai/opportunities/stream');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  switch (message.type) {
    case 'OPPORTUNITY_ADDED':
      // New opportunity appeared
      addOpportunityToSurface(message.opportunity);
      break;

    case 'OPPORTUNITY_UPDATED':
      // Existing opportunity changed (e.g., relevance score)
      updateOpportunity(message.opportunityId, message.changes);
      break;

    case 'OPPORTUNITY_EXPIRED':
      // Opportunity no longer relevant
      removeOpportunity(message.opportunityId);
      break;

    case 'RELEVANCE_RERANKED':
      // Opportunities reordered
      reorderOpportunities(message.newOrder);
      break;
  }
};

// Example message
{
  "type": "OPPORTUNITY_ADDED",
  "opportunity": {
    "id": "opp-125",
    "type": "TRAVEL_CHECKIN",
    "title": "Check-in Available",
    "description": "Your flight to Paris departs in 24 hours. Check-in is now open.",
    "urgency": "medium",
    "relevance": 85.0,
    "domain": "travel",
    // ... rest of opportunity
  }
}`}
      </pre>

      <h2>Opportunity Data Structure</h2>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`interface Opportunity {
  // Unique identifier
  id: string;

  // Opportunity type (domain-specific)
  type: OpportunityType;

  // Display information
  title: string;
  description: string;

  // Relevance information
  urgency: 'low' | 'medium' | 'high' | 'critical';
  relevance: number;  // Calculated score (0-100)

  // Source domain
  domain: string;

  // UI rendering
  componentType: string;  // Component registry lookup
  props: Record<string, unknown>;

  // Actions user can take
  actions: Array<{
    id: string;
    label: string;
    primary: boolean;
    icon?: string;
  }>;

  // Lifecycle
  createdAt: string;
  expiresAt?: string;
  dismissedAt?: string;

  // Context that influenced relevance
  context?: {
    timeRelevance: number;
    locationRelevance: number;
    userHistoryScore: number;
    domainConfidence: number;
  };
}

type OpportunityType =
  | 'BUDGET_EXCEEDED'
  | 'CALENDAR_CONFLICT'
  | 'TRAVEL_CHECKIN'
  | 'WEATHER_ALERT'
  | 'MISSED_TRANSACTION'
  | 'RECURRING_EXPENSE_DETECTED'
  | 'APPOINTMENT_REMINDER'
  | 'SMART_SUGGESTION';`}
      </pre>

      <h2>Persistence and State Management</h2>

      <p>
        The service persists opportunity state in the database:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`-- opportunities table
CREATE TABLE opportunities (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  urgency VARCHAR(20) NOT NULL,
  relevance DECIMAL(5,2) NOT NULL,
  domain VARCHAR(50) NOT NULL,
  component_type VARCHAR(100) NOT NULL,
  props JSONB NOT NULL,
  actions JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP,
  dismissed_at TIMESTAMP,
  dismissal_reason VARCHAR(50),
  context JSONB,
  INDEX idx_user_relevance (user_id, relevance DESC),
  INDEX idx_user_created (user_id, created_at DESC)
);

-- opportunity_engagements table
CREATE TABLE opportunity_engagements (
  id UUID PRIMARY KEY,
  opportunity_id UUID REFERENCES opportunities(id),
  user_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  action_id VARCHAR(100),
  duration INTEGER,
  engaged_at TIMESTAMP NOT NULL DEFAULT NOW(),
  INDEX idx_opportunity (opportunity_id),
  INDEX idx_user (user_id)
);`}
      </pre>

      <h2>Benefits</h2>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <ul className="space-y-2 text-sm">
          <li>✅ <strong>Context-Aware:</strong> Cards appear when relevant, not all the time</li>
          <li>✅ <strong>Personalized:</strong> Different users see different opportunities</li>
          <li>✅ <strong>Dynamic:</strong> Dashboard changes throughout the day</li>
          <li>✅ <strong>User-Controlled:</strong> Users dismiss cards, never auto-hide</li>
          <li>✅ <strong>Learning:</strong> System learns from engagement and dismissals</li>
          <li>✅ <strong>Real-time:</strong> New opportunities appear instantly via WebSocket</li>
        </ul>
      </div>

      <h2>Implementation Example</h2>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// Frontend: OpportunitySurface component
import { useOpportunities } from '@/hooks/useOpportunities';

export function OpportunitySurface() {
  const { opportunities, dismiss, engage, loading } = useOpportunities({
    minRelevance: 60,
    limit: 10
  });

  const handleDismiss = async (opportunityId: string) => {
    await dismiss(opportunityId, {
      reason: 'not-interested'
    });
  };

  const handleAction = async (opportunityId: string, actionId: string) => {
    await engage(opportunityId, {
      action: 'click',
      actionId
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="opportunity-surface">
      {opportunities.length === 0 ? (
        <EmptyState message="No urgent items. You're all caught up!" />
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onDismiss={() => handleDismiss(opp.id)}
              onAction={(actionId) => handleAction(opp.id, actionId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}`}
      </pre>

      <h2>Related Documentation</h2>
      <ul>
        <li><a href="/components/opportunity-card">OpportunityCard Component</a> - Card UI implementation</li>
        <li><a href="/architecture/ui-decision-layer">UI Decision Layer</a> - How opportunities choose UI</li>
        <li><a href="/foundations/ai-driven-ui">AI-Driven UI Paradigm</a> - Core principles</li>
      </ul>
    </div>
  );
}
