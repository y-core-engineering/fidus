'use client';

import { useState } from 'react';
import { Button } from '@fidus/ui';

type UIForm = 'chat' | 'form' | 'widget' | 'wizard';

interface UIDecision {
  uiForm: UIForm;
  componentType: string;
  explanation: string;
  confidence: number;
}

export default function UIDecisionLayerPage() {
  const [userQuery, setUserQuery] = useState('');
  const [timeOfDay, setTimeOfDay] = useState(12);
  const [expertiseLevel, setExpertiseLevel] = useState(5);
  const [decision, setDecision] = useState<UIDecision | null>(null);

  const mockLLMDecision = (query: string, time: number, expertise: number): UIDecision => {
    const lowerQuery = query.toLowerCase();

    // Budget-related queries
    if (lowerQuery.includes('budget')) {
      if (lowerQuery.includes('create') || lowerQuery.includes('new')) {
        if (expertise >= 7) {
          return {
            uiForm: 'form',
            componentType: 'BudgetForm',
            explanation: 'Expert user with clear intent. Direct form is most efficient.',
            confidence: 0.92
          };
        } else if (expertise <= 3) {
          return {
            uiForm: 'wizard',
            componentType: 'BudgetWizard',
            explanation: 'Beginner user needs guidance. Multi-step wizard with explanations.',
            confidence: 0.88
          };
        } else {
          return {
            uiForm: 'chat',
            componentType: 'ConversationalBudgetCreation',
            explanation: 'Intermediate user. Conversational flow allows questions.',
            confidence: 0.85
          };
        }
      } else if (lowerQuery.includes('show') || lowerQuery.includes('check')) {
        return {
          uiForm: 'widget',
          componentType: 'BudgetWidget',
          explanation: 'Query requests data display. Interactive widget shows overview.',
          confidence: 0.90
        };
      }
    }

    // Balance queries
    if (lowerQuery.includes('balance')) {
      if (lowerQuery.length < 20) {
        return {
          uiForm: 'chat',
          componentType: 'TextResponse',
          explanation: 'Simple query. Text response sufficient.',
          confidence: 0.95
        };
      } else {
        return {
          uiForm: 'widget',
          componentType: 'BalanceWidget',
          explanation: 'Detailed query. Widget provides interactive breakdown.',
          confidence: 0.87
        };
      }
    }

    // Schedule/calendar queries
    if (lowerQuery.includes('schedule') || lowerQuery.includes('calendar') || lowerQuery.includes('meeting')) {
      if (time >= 6 && time <= 9) {
        return {
          uiForm: 'widget',
          componentType: 'CalendarDayWidget',
          explanation: 'Morning context. User likely checking today\'s schedule. Widget optimal.',
          confidence: 0.89
        };
      } else if (lowerQuery.includes('add') || lowerQuery.includes('create')) {
        return {
          uiForm: 'form',
          componentType: 'AppointmentForm',
          explanation: 'Creating new appointment. Form with pre-filled slots.',
          confidence: 0.91
        };
      } else {
        return {
          uiForm: 'chat',
          componentType: 'CalendarSummary',
          explanation: 'General schedule query. Conversational summary.',
          confidence: 0.86
        };
      }
    }

    // Weather queries
    if (lowerQuery.includes('weather')) {
      if (time >= 6 && time <= 10) {
        return {
          uiForm: 'widget',
          componentType: 'WeatherWidget',
          explanation: 'Morning weather check. Widget shows forecast + recommendations.',
          confidence: 0.93
        };
      } else {
        return {
          uiForm: 'chat',
          componentType: 'TextResponse',
          explanation: 'Non-morning weather query. Text response sufficient.',
          confidence: 0.88
        };
      }
    }

    // Default response
    return {
      uiForm: 'chat',
      componentType: 'ConversationalResponse',
      explanation: 'Unclear intent. Conversational approach allows clarification.',
      confidence: 0.75
    };
  };

  const generateUI = () => {
    if (!userQuery.trim()) {
      return;
    }
    const result = mockLLMDecision(userQuery, timeOfDay, expertiseLevel);
    setDecision(result);
  };

  const resetDemo = () => {
    setUserQuery('');
    setDecision(null);
  };

  const getUIFormColor = (form: UIForm) => {
    switch (form) {
      case 'chat': return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
      case 'form': return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
      case 'widget': return 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700';
      case 'wizard': return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
    }
  };

  const exampleQueries = [
    'Create a new budget',
    'What\'s my balance?',
    'Show my schedule today',
    'What\'s the weather like?'
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>UI Decision Layer</h1>
      <p className="lead">
        The UI Decision Layer is the core of Fidus's AI-Driven UI. It's the LLM-powered system that
        analyzes user context and decides which UI form to render.
      </p>

      <h2>What is the UI Decision Layer?</h2>
      <p>
        The UI Decision Layer is a service that sits between the backend domain logic and the frontend
        rendering system. When a user interacts with Fidus, the UI Decision Layer:
      </p>
      <ol>
        <li>Receives the user's query and context (time, location, user history, etc.)</li>
        <li>Analyzes the intent, complexity, urgency, and data requirements</li>
        <li>Decides the optimal UI form (chat, form, widget, or wizard)</li>
        <li>Returns metadata describing what to render and how</li>
      </ol>

      <h2>How It Works</h2>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6 not-prose">
        <h3 className="text-lg font-semibold mb-4">Decision Flow</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
            <div>
              <strong>User Input:</strong> Query, action, or proactive trigger
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
            <div>
              <strong>Context Analysis:</strong> LLM evaluates intent, urgency, complexity, user expertise
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
            <div>
              <strong>UI Form Decision:</strong> Choose between chat, form, widget, or wizard
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">4</div>
            <div>
              <strong>Component Selection:</strong> Map decision to specific component from registry
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">5</div>
            <div>
              <strong>Props Generation:</strong> Create component props with pre-filled data
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">6</div>
            <div>
              <strong>Response Metadata:</strong> Return UI metadata to frontend for rendering
            </div>
          </div>
        </div>
      </div>

      <h2>Interactive Demo</h2>
      <p>
        Try the mock UI Decision Layer below. Enter a query and adjust context parameters to see
        how the LLM decides which UI form to render.
      </p>

      <div className="bg-card border border-border rounded-lg p-6 my-6 not-prose">
        <div className="space-y-6">
          {/* User Query Input */}
          <div>
            <label htmlFor="query" className="block text-sm font-medium mb-2">
              User Query
            </label>
            <input
              id="query"
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="e.g., Create a new budget"
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {exampleQueries.map((query) => (
                <button
                  key={query}
                  onClick={() => setUserQuery(query)}
                  className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded border border-border"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Context Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-2">
                Time of Day: {timeOfDay}:00
              </label>
              <input
                id="time"
                type="range"
                min="0"
                max="23"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {timeOfDay >= 6 && timeOfDay <= 9 ? 'Morning' :
                 timeOfDay >= 10 && timeOfDay <= 17 ? 'Daytime' :
                 timeOfDay >= 18 && timeOfDay <= 22 ? 'Evening' : 'Night'}
              </div>
            </div>

            <div>
              <label htmlFor="expertise" className="block text-sm font-medium mb-2">
                User Expertise Level: {expertiseLevel}/10
              </label>
              <input
                id="expertise"
                type="range"
                min="1"
                max="10"
                value={expertiseLevel}
                onChange={(e) => setExpertiseLevel(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {expertiseLevel <= 3 ? 'Beginner' :
                 expertiseLevel <= 7 ? 'Intermediate' : 'Expert'}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-3">
            <Button onClick={generateUI} disabled={!userQuery.trim()}>
              Generate UI Decision
            </Button>
            <Button variant="secondary" onClick={resetDemo}>
              Reset
            </Button>
          </div>

          {/* Decision Output */}
          {decision && (
            <div className={`border-2 rounded-lg p-6 ${getUIFormColor(decision.uiForm)}`}>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">UI Form</div>
                  <div className="text-2xl font-bold capitalize">{decision.uiForm}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Component Type</div>
                  <div className="text-lg font-mono">{decision.componentType}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Confidence</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-background/50 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${decision.confidence * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-semibold">{(decision.confidence * 100).toFixed(0)}%</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">LLM Reasoning</div>
                  <div className="text-sm bg-background/50 rounded p-3 border border-border/50">
                    {decision.explanation}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <h2>Example Scenarios</h2>

      <h3>Scenario 1: Budget Creation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 not-prose">
        <div className="border border-border rounded-lg p-4 bg-card">
          <h4 className="text-sm font-semibold mb-2">Expert User</h4>
          <div className="text-sm text-muted-foreground mb-3">
            Query: "Create budget"<br />
            Expertise: 9/10
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 rounded p-3 text-xs">
            <strong>Decision: Form</strong><br />
            Expert knows parameters. Direct form is fastest.
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h4 className="text-sm font-semibold mb-2">Beginner User</h4>
          <div className="text-sm text-muted-foreground mb-3">
            Query: "Create budget"<br />
            Expertise: 2/10
          </div>
          <div className="bg-orange-100 dark:bg-orange-900/30 rounded p-3 text-xs">
            <strong>Decision: Wizard</strong><br />
            Beginner needs guidance. Multi-step wizard with explanations.
          </div>
        </div>
      </div>

      <h3>Scenario 2: Balance Check</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 not-prose">
        <div className="border border-border rounded-lg p-4 bg-card">
          <h4 className="text-sm font-semibold mb-2">Simple Query</h4>
          <div className="text-sm text-muted-foreground mb-3">
            Query: "What's my balance?"<br />
            Context: Quick check
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded p-3 text-xs">
            <strong>Decision: Chat</strong><br />
            Simple question. Text response: "Your balance is 2,450 EUR"
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h4 className="text-sm font-semibold mb-2">Detailed Query</h4>
          <div className="text-sm text-muted-foreground mb-3">
            Query: "Show my account balances with recent transactions"<br />
            Context: Detailed review
          </div>
          <div className="bg-purple-100 dark:bg-purple-900/30 rounded p-3 text-xs">
            <strong>Decision: Widget</strong><br />
            Complex data. Interactive widget with charts and transaction list.
          </div>
        </div>
      </div>

      <h3>Scenario 3: Morning Schedule</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 not-prose">
        <div className="border border-border rounded-lg p-4 bg-card">
          <h4 className="text-sm font-semibold mb-2">Morning Context</h4>
          <div className="text-sm text-muted-foreground mb-3">
            Query: "My schedule"<br />
            Time: 7:00 AM
          </div>
          <div className="bg-purple-100 dark:bg-purple-900/30 rounded p-3 text-xs">
            <strong>Decision: Widget</strong><br />
            Morning = likely checking today. CalendarDayWidget optimal.
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h4 className="text-sm font-semibold mb-2">Evening Context</h4>
          <div className="text-sm text-muted-foreground mb-3">
            Query: "My schedule"<br />
            Time: 8:00 PM
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded p-3 text-xs">
            <strong>Decision: Chat</strong><br />
            Evening = reviewing or planning. Conversational summary.
          </div>
        </div>
      </div>

      <h2>API Call Structure</h2>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// Request to UI Decision Layer
POST /api/ui-decision

{
  "userQuery": "Create a new budget for food",
  "context": {
    "userId": "user-123",
    "timestamp": "2025-10-29T14:30:00Z",
    "timezone": "Europe/Berlin",
    "location": {
      "type": "home",
      "coordinates": { "lat": 52.52, "lng": 13.405 }
    },
    "userHistory": {
      "expertiseLevel": 7,
      "recentInteractions": ["budget-view", "transaction-add"],
      "preferredUIForms": ["form", "widget"]
    },
    "currentActivity": "finance-review"
  }
}

// Response from UI Decision Layer
{
  "uiForm": "form",
  "componentType": "BudgetForm",
  "props": {
    "category": "food",
    "suggestedAmount": 500,
    "currency": "EUR",
    "period": "monthly"
  },
  "confidence": 0.92,
  "reasoning": "Expert user with clear intent. Pre-filled form is most efficient.",
  "context": {
    "urgency": "low",
    "complexity": "medium",
    "dataVolume": "small"
  }
}`}
      </pre>

      <h2>Integration with Component Registry</h2>
      <p>
        The UI Decision Layer works closely with the Component Registry. After deciding on a UI form,
        it looks up the specific component in the registry and generates appropriate props.
      </p>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6 not-prose">
        <h3 className="text-sm font-semibold mb-3">Decision → Registry → Component</h3>
        <div className="space-y-3 text-sm font-mono">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">Decision</div>
            <div>uiForm: "form", componentType: "BudgetForm"</div>
          </div>
          <div className="text-center text-muted-foreground">↓</div>
          <div className="flex items-center gap-2">
            <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">Registry</div>
            <div>Lookup "BudgetForm" → React component</div>
          </div>
          <div className="text-center text-muted-foreground">↓</div>
          <div className="flex items-center gap-2">
            <div className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs">Component</div>
            <div>&lt;BudgetForm category="food" amount=500 /&gt;</div>
          </div>
        </div>
      </div>

      <h2>Key Benefits</h2>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <ul className="space-y-2 text-sm">
          <li>✅ <strong>Context-Adaptive:</strong> Same query renders differently based on situation</li>
          <li>✅ <strong>User-Optimized:</strong> Considers user expertise and preferences</li>
          <li>✅ <strong>Time-Aware:</strong> Morning vs. evening influences UI decisions</li>
          <li>✅ <strong>Explainable:</strong> LLM provides reasoning for each decision</li>
          <li>✅ <strong>Evolvable:</strong> Improve prompts without code changes</li>
          <li>✅ <strong>Testable:</strong> Mock LLM for testing different scenarios</li>
        </ul>
      </div>

      <h2>Implementation Guidelines</h2>

      <h3>For Backend Developers</h3>
      <ul>
        <li>Don't hardcode UI forms in domain logic</li>
        <li>Pass rich context to UI Decision Layer (time, location, user history)</li>
        <li>Let LLM decide based on current situation</li>
        <li>Include confidence scores for debugging</li>
        <li>Log decisions for analysis and improvement</li>
      </ul>

      <h3>For Frontend Developers</h3>
      <ul>
        <li>Implement all UI forms (chat, form, widget, wizard)</li>
        <li>Build flexible components that accept dynamic props</li>
        <li>Respect the UI Decision Layer's choices</li>
        <li>Don't override decisions with frontend logic</li>
        <li>Provide feedback on decision quality (analytics)</li>
      </ul>

      <h2>Testing UI Decisions</h2>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`describe('UIDecisionLayer', () => {
  it('should choose form for expert user creating budget', async () => {
    const context = {
      userQuery: 'Create budget',
      userHistory: { expertiseLevel: 9 }
    };

    const decision = await uiDecisionLayer.decide(context);

    expect(decision.uiForm).toBe('form');
    expect(decision.componentType).toBe('BudgetForm');
    expect(decision.confidence).toBeGreaterThan(0.85);
  });

  it('should choose wizard for beginner user', async () => {
    const context = {
      userQuery: 'Create budget',
      userHistory: { expertiseLevel: 2 }
    };

    const decision = await uiDecisionLayer.decide(context);

    expect(decision.uiForm).toBe('wizard');
    expect(decision.componentType).toBe('BudgetWizard');
  });

  it('should choose widget for morning calendar check', async () => {
    const context = {
      userQuery: 'My schedule',
      timestamp: '2025-10-29T07:00:00Z'
    };

    const decision = await uiDecisionLayer.decide(context);

    expect(decision.uiForm).toBe('widget');
    expect(decision.componentType).toBe('CalendarDayWidget');
  });
});`}
      </pre>

      <h2>Related Documentation</h2>
      <ul>
        <li><a href="/architecture/component-registry">Component Registry</a> - How components are mapped and resolved</li>
        <li><a href="/architecture/api-response-schema">API Response Schema</a> - Structure of UI metadata</li>
        <li><a href="/foundations/ai-driven-ui">AI-Driven UI Paradigm</a> - Core principles</li>
      </ul>
    </div>
  );
}
