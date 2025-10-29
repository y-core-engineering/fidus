'use client';

export default function APIResponseSchemaPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>API Response Schema</h1>
      <p className="lead">
        The API Response Schema defines how the backend communicates UI instructions to the frontend.
        It's the contract between the UI Decision Layer and the frontend rendering system.
      </p>

      <h2>Schema Structure</h2>

      <p>
        Every UI decision response follows a consistent schema:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`interface UIDecisionResponse {
  // High-level UI paradigm
  uiForm: 'form' | 'chat' | 'widget' | 'wizard';

  // Specific component from registry
  componentType: string;

  // Component props (validated by registry)
  props: Record<string, unknown>;

  // Context that influenced the decision
  context: {
    urgency: 'low' | 'medium' | 'high' | 'critical';
    complexity: 'simple' | 'medium' | 'complex';
    dataVolume: 'small' | 'medium' | 'large';
    timeContext?: string;
    userExpertise?: number;
  };

  // LLM confidence in decision (0.0 - 1.0)
  confidence: number;

  // Explanation of why this UI form was chosen
  reasoning: string;

  // Optional metadata
  metadata?: {
    privacyLevel?: 'local' | 'cloud' | 'external';
    estimatedDuration?: number;  // seconds
    requiresAuth?: boolean;
    canDismiss?: boolean;
  };
}`}
      </pre>

      <h2>Field Explanations</h2>

      <h3>uiForm</h3>
      <p>
        The high-level UI paradigm. Determines the overall interaction pattern:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
        <div className="border border-border rounded-lg p-4 bg-card">
          <h4 className="text-sm font-semibold mb-2 text-blue-600 dark:text-blue-400">form</h4>
          <p className="text-xs text-muted-foreground">
            Structured data input with fields. Best for creating or editing entities with known parameters.
          </p>
          <div className="text-xs mt-2 bg-muted/50 rounded p-2">
            <strong>Example:</strong> Budget creation, appointment scheduling
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h4 className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">chat</h4>
          <p className="text-xs text-muted-foreground">
            Conversational text response. Best for simple queries or when clarification is needed.
          </p>
          <div className="text-xs mt-2 bg-muted/50 rounded p-2">
            <strong>Example:</strong> "What's my balance?", ambiguous queries
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h4 className="text-sm font-semibold mb-2 text-purple-600 dark:text-purple-400">widget</h4>
          <p className="text-xs text-muted-foreground">
            Interactive data visualization. Best for displaying complex data with actions.
          </p>
          <div className="text-xs mt-2 bg-muted/50 rounded p-2">
            <strong>Example:</strong> Calendar view, budget charts, transaction lists
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h4 className="text-sm font-semibold mb-2 text-orange-600 dark:text-orange-400">wizard</h4>
          <p className="text-xs text-muted-foreground">
            Multi-step guided flow. Best for complex processes requiring multiple decisions.
          </p>
          <div className="text-xs mt-2 bg-muted/50 rounded p-2">
            <strong>Example:</strong> Trip planning, budget setup, onboarding
          </div>
        </div>
      </div>

      <h3>componentType</h3>
      <p>
        Stable identifier for the specific component to render. This is looked up in the Component Registry.
      </p>

      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <h4 className="text-sm font-semibold mb-2">Naming Convention</h4>
        <ul className="text-sm space-y-2">
          <li><code>kebab-case</code> format (e.g., <code>budget-form</code>, <code>calendar-widget</code>)</li>
          <li>Descriptive and stable across versions</li>
          <li>Must exist in Component Registry</li>
          <li>Can include version suffix for backward compatibility (e.g., <code>budget-form-v1</code>)</li>
        </ul>
      </div>

      <h3>props</h3>
      <p>
        Component-specific props validated by the Component Registry. Structure varies by component:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// Example: Budget Form Props
{
  "props": {
    "category": "food",
    "suggestedAmount": 500,
    "currency": "EUR",
    "period": "monthly",
    "existingBudgets": [
      { "category": "transport", "amount": 300 },
      { "category": "entertainment", "amount": 200 }
    ]
  }
}

// Example: Calendar Widget Props
{
  "props": {
    "date": "2025-10-29",
    "events": [
      {
        "id": "evt-1",
        "title": "Team Meeting",
        "start": "2025-10-29T10:00:00Z",
        "end": "2025-10-29T11:00:00Z",
        "location": "Office"
      }
    ],
    "highlightConflicts": true
  }
}`}
      </pre>

      <h3>context</h3>
      <p>
        Contextual information that influenced the UI decision. Useful for debugging and analytics:
      </p>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6 not-prose">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-semibold">urgency</dt>
            <dd className="text-muted-foreground ml-4">
              <code>low</code> - Can wait<br />
              <code>medium</code> - Should address soon<br />
              <code>high</code> - Needs attention<br />
              <code>critical</code> - Immediate action required
            </dd>
          </div>

          <div>
            <dt className="font-semibold">complexity</dt>
            <dd className="text-muted-foreground ml-4">
              <code>simple</code> - Single value or yes/no<br />
              <code>medium</code> - Multiple fields or decisions<br />
              <code>complex</code> - Multi-step process
            </dd>
          </div>

          <div>
            <dt className="font-semibold">dataVolume</dt>
            <dd className="text-muted-foreground ml-4">
              <code>small</code> - Single item or short list<br />
              <code>medium</code> - List of 10-50 items<br />
              <code>large</code> - 50+ items, needs pagination
            </dd>
          </div>

          <div>
            <dt className="font-semibold">timeContext</dt>
            <dd className="text-muted-foreground ml-4">
              Optional. E.g., "morning", "before-meeting", "end-of-month"
            </dd>
          </div>

          <div>
            <dt className="font-semibold">userExpertise</dt>
            <dd className="text-muted-foreground ml-4">
              Optional. User expertise level (0-10)
            </dd>
          </div>
        </dl>
      </div>

      <h2>Examples for Each UI Form</h2>

      <h3>Form: Budget Creation</h3>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "uiForm": "form",
  "componentType": "budget-form",
  "props": {
    "category": "food",
    "suggestedAmount": 500,
    "currency": "EUR",
    "period": "monthly",
    "categoryOptions": [
      "food",
      "transport",
      "entertainment",
      "utilities",
      "other"
    ]
  },
  "context": {
    "urgency": "low",
    "complexity": "medium",
    "dataVolume": "small",
    "userExpertise": 7
  },
  "confidence": 0.92,
  "reasoning": "Expert user with clear intent to create budget. Direct form is most efficient.",
  "metadata": {
    "privacyLevel": "local",
    "estimatedDuration": 30,
    "canDismiss": true
  }
}`}
      </pre>

      <h3>Chat: Balance Query</h3>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "uiForm": "chat",
  "componentType": "text-response",
  "props": {
    "text": "Your current balance is 2,450 EUR across 3 accounts:\\n\\n• Checking: 1,200 EUR\\n• Savings: 1,000 EUR\\n• Cash: 250 EUR",
    "format": "markdown",
    "actions": [
      {
        "label": "View Transactions",
        "action": "view-transactions"
      },
      {
        "label": "Transfer Money",
        "action": "transfer"
      }
    ]
  },
  "context": {
    "urgency": "low",
    "complexity": "simple",
    "dataVolume": "small"
  },
  "confidence": 0.95,
  "reasoning": "Simple balance query. Text response is sufficient and fastest.",
  "metadata": {
    "privacyLevel": "local",
    "estimatedDuration": 5,
    "canDismiss": true
  }
}`}
      </pre>

      <h3>Widget: Calendar View</h3>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "uiForm": "widget",
  "componentType": "calendar-widget",
  "props": {
    "date": "2025-10-29",
    "view": "day",
    "events": [
      {
        "id": "evt-1",
        "title": "Team Standup",
        "start": "2025-10-29T09:00:00Z",
        "end": "2025-10-29T09:15:00Z",
        "location": "Zoom",
        "color": "blue"
      },
      {
        "id": "evt-2",
        "title": "Client Meeting",
        "start": "2025-10-29T14:00:00Z",
        "end": "2025-10-29T15:00:00Z",
        "location": "Office - Room 3",
        "color": "green"
      }
    ],
    "highlightConflicts": true,
    "showTimeSlots": true
  },
  "context": {
    "urgency": "medium",
    "complexity": "medium",
    "dataVolume": "medium",
    "timeContext": "morning"
  },
  "confidence": 0.89,
  "reasoning": "Morning context detected. User likely checking today's schedule. Calendar widget provides quick overview with interaction options.",
  "metadata": {
    "privacyLevel": "local",
    "estimatedDuration": 15,
    "canDismiss": true
  }
}`}
      </pre>

      <h3>Wizard: Trip Planning</h3>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "uiForm": "wizard",
  "componentType": "trip-planning-wizard",
  "props": {
    "initialStep": "destination",
    "steps": [
      {
        "id": "destination",
        "title": "Where are you going?",
        "description": "Enter your destination city or country",
        "fields": [
          {
            "name": "destination",
            "type": "location-autocomplete",
            "label": "Destination",
            "required": true
          }
        ]
      },
      {
        "id": "dates",
        "title": "When are you traveling?",
        "description": "Select your departure and return dates",
        "fields": [
          {
            "name": "departureDate",
            "type": "date",
            "label": "Departure",
            "required": true
          },
          {
            "name": "returnDate",
            "type": "date",
            "label": "Return",
            "required": true
          }
        ]
      },
      {
        "id": "preferences",
        "title": "Travel preferences",
        "description": "Help us find the best options for you",
        "fields": [
          {
            "name": "budget",
            "type": "number",
            "label": "Budget (EUR)",
            "required": false
          },
          {
            "name": "flightClass",
            "type": "select",
            "label": "Flight Class",
            "options": ["economy", "premium-economy", "business"],
            "required": false
          }
        ]
      }
    ],
    "allowSkip": true,
    "showProgress": true
  },
  "context": {
    "urgency": "low",
    "complexity": "complex",
    "dataVolume": "medium",
    "userExpertise": 3
  },
  "confidence": 0.85,
  "reasoning": "Complex trip planning task with multiple decisions. Beginner user (expertise: 3/10) benefits from guided multi-step wizard.",
  "metadata": {
    "privacyLevel": "cloud",
    "estimatedDuration": 180,
    "canDismiss": true,
    "requiresAuth": true
  }
}`}
      </pre>

      <h2>Validation with Zod</h2>

      <p>
        Both backend and frontend validate the response schema using Zod:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { z } from 'zod';

// Base response schema
export const UIDecisionResponseSchema = z.object({
  uiForm: z.enum(['form', 'chat', 'widget', 'wizard']),
  componentType: z.string().min(1),
  props: z.record(z.unknown()),
  context: z.object({
    urgency: z.enum(['low', 'medium', 'high', 'critical']),
    complexity: z.enum(['simple', 'medium', 'complex']),
    dataVolume: z.enum(['small', 'medium', 'large']),
    timeContext: z.string().optional(),
    userExpertise: z.number().min(0).max(10).optional()
  }),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().min(1),
  metadata: z.object({
    privacyLevel: z.enum(['local', 'cloud', 'external']).optional(),
    estimatedDuration: z.number().positive().optional(),
    requiresAuth: z.boolean().optional(),
    canDismiss: z.boolean().optional()
  }).optional()
});

export type UIDecisionResponse = z.infer<typeof UIDecisionResponseSchema>;

// Usage
const response = await fetch('/api/ui-decision', { ... });
const data = await response.json();

const validationResult = UIDecisionResponseSchema.safeParse(data);

if (!validationResult.success) {
  console.error('Invalid response:', validationResult.error);
  // Handle error
} else {
  // TypeScript knows the shape!
  const uiResponse = validationResult.data;
  console.log(uiResponse.uiForm);  // ✅ Type-safe
}`}
      </pre>

      <h2>Error Handling</h2>

      <p>
        When the UI Decision Layer encounters errors, it returns an error response:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// Error response schema
interface UIDecisionErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  fallback?: UIDecisionResponse;  // Optional fallback UI
}

// Example error response
{
  "error": {
    "code": "LLM_UNAVAILABLE",
    "message": "Could not reach LLM service",
    "details": {
      "retryAfter": 30
    }
  },
  "fallback": {
    "uiForm": "chat",
    "componentType": "text-response",
    "props": {
      "text": "I'm having trouble processing your request right now. Please try again in a moment.",
      "variant": "error"
    },
    "context": {
      "urgency": "low",
      "complexity": "simple",
      "dataVolume": "small"
    },
    "confidence": 1.0,
    "reasoning": "LLM unavailable, using fallback response"
  }
}`}
      </pre>

      <h2>Versioning Strategy</h2>

      <p>
        The API response schema supports versioning through content negotiation:
      </p>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6 not-prose">
        <h3 className="text-sm font-semibold mb-3">Version Headers</h3>
        <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`// Request with version
POST /api/ui-decision
Headers:
  Content-Type: application/json
  Accept: application/vnd.fidus.ui-decision.v2+json

// Response includes schema version
{
  "schemaVersion": "2.0.0",
  "uiForm": "form",
  "componentType": "budget-form",
  // ... rest of response
}`}
        </pre>
      </div>

      <h2>TypeScript Types</h2>

      <p>
        Complete TypeScript type definitions for the API response:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// types/ui-decision.ts
export type UIForm = 'form' | 'chat' | 'widget' | 'wizard';

export type Urgency = 'low' | 'medium' | 'high' | 'critical';
export type Complexity = 'simple' | 'medium' | 'complex';
export type DataVolume = 'small' | 'medium' | 'large';
export type PrivacyLevel = 'local' | 'cloud' | 'external';

export interface UIDecisionContext {
  urgency: Urgency;
  complexity: Complexity;
  dataVolume: DataVolume;
  timeContext?: string;
  userExpertise?: number;
}

export interface UIDecisionMetadata {
  privacyLevel?: PrivacyLevel;
  estimatedDuration?: number;
  requiresAuth?: boolean;
  canDismiss?: boolean;
}

export interface UIDecisionResponse {
  uiForm: UIForm;
  componentType: string;
  props: Record<string, unknown>;
  context: UIDecisionContext;
  confidence: number;
  reasoning: string;
  metadata?: UIDecisionMetadata;
}

export interface UIDecisionErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  fallback?: UIDecisionResponse;
}`}
      </pre>

      <h2>Benefits</h2>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <ul className="space-y-2 text-sm">
          <li>✅ <strong>Consistent:</strong> All UI decisions follow same structure</li>
          <li>✅ <strong>Type-Safe:</strong> Validated with Zod, typed with TypeScript</li>
          <li>✅ <strong>Debuggable:</strong> Context and reasoning included</li>
          <li>✅ <strong>Versioned:</strong> Support for schema evolution</li>
          <li>✅ <strong>Extensible:</strong> Add fields without breaking changes</li>
          <li>✅ <strong>Testable:</strong> Easy to mock and test</li>
        </ul>
      </div>

      <h2>Testing</h2>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`describe('UIDecisionResponse', () => {
  it('should validate valid response', () => {
    const response = {
      uiForm: 'form',
      componentType: 'budget-form',
      props: { category: 'food' },
      context: {
        urgency: 'low',
        complexity: 'medium',
        dataVolume: 'small'
      },
      confidence: 0.92,
      reasoning: 'Expert user intent'
    };

    const result = UIDecisionResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });

  it('should reject invalid uiForm', () => {
    const response = {
      uiForm: 'invalid',  // ❌ Not in enum
      // ... rest
    };

    const result = UIDecisionResponseSchema.safeParse(response);
    expect(result.success).toBe(false);
  });

  it('should accept optional metadata', () => {
    const response = {
      uiForm: 'widget',
      componentType: 'calendar-widget',
      props: {},
      context: { urgency: 'medium', complexity: 'medium', dataVolume: 'small' },
      confidence: 0.89,
      reasoning: 'Morning check',
      metadata: {
        privacyLevel: 'local',
        estimatedDuration: 15
      }
    };

    const result = UIDecisionResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });
});`}
      </pre>

      <h2>Related Documentation</h2>
      <ul>
        <li><a href="/architecture/ui-decision-layer">UI Decision Layer</a> - How decisions are made</li>
        <li><a href="/architecture/component-registry">Component Registry</a> - Component resolution</li>
        <li><a href="/foundations/ai-driven-ui">AI-Driven UI Paradigm</a> - Core principles</li>
      </ul>
    </div>
  );
}
