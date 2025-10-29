'use client';

import { useState, useMemo } from 'react';
import {
  Button,
  Stack,
  TextInput,
  Select,
  ProgressBar,
  Alert,
  Badge
} from '@fidus/ui';
import { Calendar, TrendingUp, DollarSign, Clock } from 'lucide-react';

type UIForm = 'chat' | 'form' | 'widget' | 'wizard';

interface UIDecision {
  uiForm: UIForm;
  componentType: string;
  explanation: string;
  confidence: number;
  props?: Record<string, unknown>;
}

interface UserContext {
  query: string;
  timeOfDay: number;
  expertiseLevel: number;
  location?: string;
  deviceType?: 'mobile' | 'desktop';
}

// ===== EXAMPLE COMPONENTS (These would be in your real component library) =====

function BudgetWidget({ category = 'Food', spent = 450, limit = 500, currency = 'EUR' }: any) {
  const percentage = (spent / limit) * 100;
  const remaining = limit - spent;
  const isNearLimit = percentage > 90;
  const isWarning = percentage > 75 && percentage <= 90;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <Stack direction="vertical" spacing="md">
        <div className="flex items-start justify-between">
          <Stack direction="vertical" spacing="xs">
            <h3 className="text-lg font-semibold">{category} Budget</h3>
            <p className="text-sm text-muted-foreground">October 2025</p>
          </Stack>
          <DollarSign className="h-5 w-5 text-primary" />
        </div>

        <Stack direction="vertical" spacing="sm">
          <div className="flex justify-between text-sm">
            <span>Spent</span>
            <span className="font-medium">{spent} {currency}</span>
          </div>
          <ProgressBar
            value={percentage}
            variant={isNearLimit ? 'error' : isWarning ? 'warning' : 'default'}
            size="sm"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Budget limit</span>
            <span>{limit} {currency}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>Remaining</span>
            <Badge variant={remaining < 50 ? 'destructive' : 'success'}>
              {remaining} {currency}
            </Badge>
          </div>
        </Stack>

        <Stack direction="horizontal" spacing="sm">
          <Button size="sm" variant="secondary">View Details</Button>
          <Button size="sm" variant="outline">Adjust Budget</Button>
        </Stack>
      </Stack>
    </div>
  );
}

function BudgetForm({ category = '', amount = 0 }: any) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <Stack direction="vertical" spacing="lg">
        <h3 className="text-lg font-semibold">Create Budget</h3>

        <Select
          label="Category"
          value={category || 'food'}
          options={[
            { value: 'food', label: 'Food & Groceries' },
            { value: 'transport', label: 'Transport' },
            { value: 'entertainment', label: 'Entertainment' },
            { value: 'utilities', label: 'Utilities' }
          ]}
        />

        <TextInput
          label="Monthly Amount (EUR)"
          type="number"
          defaultValue={String(amount || 500)}
          placeholder="500"
        />

        <TextInput
          label="Start Date"
          type="date"
        />

        <Stack direction="horizontal" spacing="sm">
          <Button>Create Budget</Button>
          <Button variant="secondary">Cancel</Button>
        </Stack>
      </Stack>
    </div>
  );
}

function BudgetWizard() {
  const [step, setStep] = useState(1);
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <Stack direction="vertical" spacing="lg">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Budget Creation Wizard</h3>
            <Badge variant="secondary">Step {step} of 3</Badge>
          </div>
          <ProgressBar value={(step / 3) * 100} size="sm" />
        </div>

        {step === 1 && (
          <Stack direction="vertical" spacing="md">
            <Alert variant="info">
              Let's create your first budget! A budget helps you track and limit spending in specific categories.
            </Alert>
            <Select
              label="What do you want to budget for?"
              options={[
                { value: 'food', label: 'Food & Groceries' },
                { value: 'transport', label: 'Transportation' },
                { value: 'entertainment', label: 'Entertainment' }
              ]}
            />
          </Stack>
        )}

        <Stack direction="horizontal" spacing="sm">
          {step > 1 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>}
          <Button onClick={() => step < 3 ? setStep(step + 1) : null}>
            {step < 3 ? 'Next' : 'Create Budget'}
          </Button>
        </Stack>
      </Stack>
    </div>
  );
}

function CalendarDayWidget() {
  const appointments = [
    { time: '09:00', title: 'Team Standup', duration: '30 min' },
    { time: '11:00', title: 'Client Meeting', duration: '1 hour' },
    { time: '14:30', title: 'Code Review', duration: '45 min' },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <Stack direction="vertical" spacing="md">
        <div className="flex items-start justify-between">
          <Stack direction="vertical" spacing="xs">
            <h3 className="text-lg font-semibold">Today's Schedule</h3>
            <p className="text-sm text-muted-foreground">Tuesday, October 29, 2025</p>
          </Stack>
          <Calendar className="h-5 w-5 text-primary" />
        </div>

        <Stack direction="vertical" spacing="sm">
          {appointments.map((apt, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <Badge variant="secondary" className="min-w-[50px]">{apt.time}</Badge>
              <Stack direction="vertical" spacing="xs" className="flex-1">
                <div className="font-medium text-sm">{apt.title}</div>
                <div className="text-xs text-muted-foreground">{apt.duration}</div>
              </Stack>
            </div>
          ))}
        </Stack>

        <Stack direction="horizontal" spacing="sm">
          <Button size="sm">Add Appointment</Button>
          <Button size="sm" variant="outline">View Week</Button>
        </Stack>
      </Stack>
    </div>
  );
}

function ConversationalResponse({ message }: any) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <Stack direction="vertical" spacing="md">
        <div className="flex gap-3">
          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">
            F
          </div>
          <div className="flex-1">
            <p className="text-sm leading-relaxed">{message}</p>
          </div>
        </div>
        <Stack direction="horizontal" spacing="sm">
          <Button size="sm" variant="outline">Ask follow-up</Button>
          <Button size="sm" variant="outline">Show details</Button>
        </Stack>
      </Stack>
    </div>
  );
}

function TextResponse({ message }: any) {
  return (
    <Alert variant="info" description={message} />
  );
}

// ===== COMPONENT REGISTRY =====

const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  'BudgetWidget': BudgetWidget,
  'BudgetForm': BudgetForm,
  'BudgetWizard': BudgetWizard,
  'CalendarDayWidget': CalendarDayWidget,
  'ConversationalResponse': ConversationalResponse,
  'TextResponse': TextResponse,
};

// ===== UI DECISION LAYER SERVICE =====

class UIDecisionLayerService {
  /**
   * Analyzes context and decides which UI form to render.
   * In production, this would call an LLM. For the demo, we use heuristics.
   */
  decide(context: UserContext): UIDecision {
    const { query, timeOfDay, expertiseLevel } = context;
    const lowerQuery = query.toLowerCase();

    // Budget-related queries
    if (lowerQuery.includes('budget')) {
      if (lowerQuery.includes('create') || lowerQuery.includes('new')) {
        // Expert users get direct form
        if (expertiseLevel >= 7) {
          return {
            uiForm: 'form',
            componentType: 'BudgetForm',
            explanation: 'Expert user with clear intent. Direct form is most efficient.',
            confidence: 0.92,
            props: { category: 'food', amount: 500 }
          };
        }
        // Beginners get wizard
        else if (expertiseLevel <= 3) {
          return {
            uiForm: 'wizard',
            componentType: 'BudgetWizard',
            explanation: 'Beginner user needs guidance. Multi-step wizard with explanations.',
            confidence: 0.88
          };
        }
        // Intermediate users get conversational
        else {
          return {
            uiForm: 'chat',
            componentType: 'ConversationalResponse',
            explanation: 'Intermediate user. Conversational flow allows questions.',
            confidence: 0.85,
            props: {
              message: "I'll help you create a budget! What category would you like to budget for? (e.g., Food, Transport, Entertainment)"
            }
          };
        }
      }
      // Viewing budget
      else if (lowerQuery.includes('show') || lowerQuery.includes('check')) {
        return {
          uiForm: 'widget',
          componentType: 'BudgetWidget',
          explanation: 'Query requests data display. Interactive widget shows overview with actions.',
          confidence: 0.90,
          props: { category: 'Food', spent: 450, limit: 500, currency: 'EUR' }
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
          confidence: 0.95,
          props: { message: 'Your current balance is 2,450 EUR across all accounts.' }
        };
      } else {
        return {
          uiForm: 'widget',
          componentType: 'BudgetWidget',
          explanation: 'Detailed query. Widget provides interactive breakdown.',
          confidence: 0.87,
          props: { category: 'Total Balance', spent: 2450, limit: 5000, currency: 'EUR' }
        };
      }
    }

    // Schedule/calendar queries
    if (lowerQuery.includes('schedule') || lowerQuery.includes('calendar') || lowerQuery.includes('meeting')) {
      // Morning = likely checking today's schedule
      if (timeOfDay >= 6 && timeOfDay <= 9) {
        return {
          uiForm: 'widget',
          componentType: 'CalendarDayWidget',
          explanation: 'Morning context. User likely checking today\'s schedule. Widget optimal.',
          confidence: 0.89
        };
      }
      // Creating appointment
      else if (lowerQuery.includes('add') || lowerQuery.includes('create')) {
        return {
          uiForm: 'form',
          componentType: 'ConversationalResponse',
          explanation: 'Creating new appointment. Conversational form with smart suggestions.',
          confidence: 0.91,
          props: {
            message: "I'll help you schedule that. What would you like to add to your calendar?"
          }
        };
      }
      // General schedule query
      else {
        return {
          uiForm: 'chat',
          componentType: 'ConversationalResponse',
          explanation: 'General schedule query. Conversational summary with follow-up options.',
          confidence: 0.86,
          props: {
            message: "You have 3 appointments today: Team Standup at 9:00 AM, Client Meeting at 11:00 AM, and Code Review at 2:30 PM. Would you like to see details for any of these?"
          }
        };
      }
    }

    // Weather queries
    if (lowerQuery.includes('weather')) {
      if (timeOfDay >= 6 && timeOfDay <= 10) {
        return {
          uiForm: 'widget',
          componentType: 'ConversationalResponse',
          explanation: 'Morning weather check. Widget would show forecast + outfit recommendations.',
          confidence: 0.93,
          props: {
            message: "It's 15°C and partly cloudy in Berlin. Light jacket recommended. No rain expected today."
          }
        };
      } else {
        return {
          uiForm: 'chat',
          componentType: 'TextResponse',
          explanation: 'Non-morning weather query. Text response sufficient.',
          confidence: 0.88,
          props: {
            message: "Current weather in Berlin: 15°C, partly cloudy."
          }
        };
      }
    }

    // Default: conversational
    return {
      uiForm: 'chat',
      componentType: 'ConversationalResponse',
      explanation: 'Unclear intent. Conversational approach allows clarification.',
      confidence: 0.75,
      props: {
        message: "I'm not sure what you're looking for. Could you provide more details?"
      }
    };
  }

  /**
   * Resolves the component from the registry and returns it.
   */
  resolveComponent(componentType: string): React.ComponentType<any> | null {
    return COMPONENT_REGISTRY[componentType] || null;
  }
}

// ===== MAIN PAGE COMPONENT =====

type DecisionPhase = 'idle' | 'thinking' | 'decided' | 'expanded';

export default function UIDecisionLayerPage() {
  const [userQuery, setUserQuery] = useState('');
  const [timeOfDay, setTimeOfDay] = useState(12);
  const [expertiseLevel, setExpertiseLevel] = useState(5);
  const [decision, setDecision] = useState<UIDecision | null>(null);
  const [phase, setPhase] = useState<DecisionPhase>('idle');
  const [thinkingStep, setThinkingStep] = useState(0);
  const [experimentalTimeOfDay, setExperimentalTimeOfDay] = useState(12);
  const [experimentalExpertise, setExperimentalExpertise] = useState(5);
  const [experimentalDecision, setExperimentalDecision] = useState<UIDecision | null>(null);

  const uiDecisionLayer = useMemo(() => new UIDecisionLayerService(), []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Calculate scores for UI forms based on context
  const calculateScores = (context: UserContext) => {
    const { expertiseLevel, timeOfDay, query } = context;
    const lowerQuery = query.toLowerCase();

    // Determine intent clarity and complexity
    const hasCreateIntent = lowerQuery.includes('create') || lowerQuery.includes('new');
    const hasViewIntent = lowerQuery.includes('show') || lowerQuery.includes('check') || lowerQuery.includes('my');
    const intentClarity = (hasCreateIntent || hasViewIntent) ? 98 : 60;
    const queryComplexity = query.length < 20 ? 'low' : query.length < 40 ? 'medium' : 'high';

    // Context factors with weights
    const expertiseScore = expertiseLevel * 5; // 0-50
    const morningBonus = (timeOfDay >= 6 && timeOfDay <= 9) ? 25 :
                        (timeOfDay >= 10 && timeOfDay <= 17) ? 10 : -5;
    const intentScore = intentClarity > 90 ? 40 : 20;
    const complexityScore = queryComplexity === 'low' ? 35 : queryComplexity === 'medium' ? 20 : 10;

    // UI Form scores
    const formScore = {
      expert: expertiseLevel >= 7 ? 45 : expertiseLevel >= 4 ? 10 : -20,
      time: morningBonus,
      intent: hasCreateIntent ? 40 : hasViewIntent ? -10 : 20,
      complexity: complexityScore,
      history: 15,
      total: 0
    };
    formScore.total = formScore.expert + formScore.time + formScore.intent + formScore.complexity + formScore.history;

    const widgetScore = {
      expert: expertiseLevel >= 7 ? 30 : 20,
      time: morningBonus,
      intent: hasViewIntent ? 40 : hasCreateIntent ? -20 : 10,
      complexity: queryComplexity === 'low' ? 20 : 10,
      history: 10,
      total: 0
    };
    widgetScore.total = widgetScore.expert + widgetScore.time + widgetScore.intent + widgetScore.complexity + widgetScore.history;

    const chatScore = {
      expert: expertiseLevel <= 3 ? 30 : expertiseLevel <= 6 ? 15 : 10,
      time: timeOfDay >= 6 && timeOfDay <= 9 ? -15 : 0,
      intent: intentClarity < 90 ? 30 : 20,
      complexity: queryComplexity === 'high' ? 20 : -10,
      history: 5,
      total: 0
    };
    chatScore.total = chatScore.expert + chatScore.time + chatScore.intent + chatScore.complexity + chatScore.history;

    const wizardScore = {
      expert: expertiseLevel <= 3 ? 40 : expertiseLevel <= 6 ? 10 : -30,
      time: 5,
      intent: hasCreateIntent ? 30 : 10,
      complexity: queryComplexity === 'high' ? 35 : queryComplexity === 'medium' ? 20 : -25,
      history: -10,
      total: 0
    };
    wizardScore.total = wizardScore.expert + wizardScore.time + wizardScore.intent + wizardScore.complexity + wizardScore.history;

    return {
      factors: {
        expertise: { value: expertiseLevel, score: expertiseScore, weight: 'High' },
        timeOfDay: { value: timeOfDay, score: morningBonus, weight: 'Medium' },
        intentClarity: { value: intentClarity, score: intentScore, weight: 'High' },
        complexity: { value: queryComplexity, score: complexityScore, weight: 'Medium' },
      },
      forms: {
        form: formScore,
        widget: widgetScore,
        chat: chatScore,
        wizard: wizardScore,
      }
    };
  };

  const generateUI = async () => {
    if (!userQuery.trim()) return;

    // Start thinking animation
    setPhase('thinking');
    setThinkingStep(0);
    setDecision(null);

    await sleep(100);
    setThinkingStep(1);
    await sleep(600);
    setThinkingStep(2);
    await sleep(600);
    setThinkingStep(3);
    await sleep(600);
    setThinkingStep(4);
    await sleep(400);

    const context: UserContext = {
      query: userQuery,
      timeOfDay,
      expertiseLevel,
      location: 'Berlin',
      deviceType: 'desktop'
    };

    const result = uiDecisionLayer.decide(context);
    setDecision(result);
    setExperimentalTimeOfDay(timeOfDay);
    setExperimentalExpertise(expertiseLevel);
    setExperimentalDecision(result);
    setPhase('decided');
  };

  const resetDemo = () => {
    setUserQuery('');
    setDecision(null);
    setPhase('idle');
    setThinkingStep(0);
  };

  const updateExperimentalContext = (newTimeOfDay: number, newExpertise: number) => {
    const context: UserContext = {
      query: userQuery,
      timeOfDay: newTimeOfDay,
      expertiseLevel: newExpertise,
      location: 'Berlin',
      deviceType: 'desktop'
    };
    const result = uiDecisionLayer.decide(context);
    setExperimentalDecision(result);
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
    'Show my budget',
    'What\'s my balance?',
    'My schedule today',
  ];

  // Dynamically render the component - use experimental decision if it exists, otherwise use original
  const activeDecision = experimentalDecision || decision;
  const RenderedComponent = activeDecision ? uiDecisionLayer.resolveComponent(activeDecision.componentType) : null;

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>UI Decision Layer</h1>
      <p className="lead">
        The UI Decision Layer is the core of Fidus's AI-Driven UI. It analyzes user context
        and dynamically decides which UI form to render—then actually renders it.
      </p>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 my-6 not-prose">
        <p className="text-sm mb-0">
          <strong>⚠️ Note:</strong> This demo uses a <em>mock decision service</em> with heuristics.
          In production, the UIDecisionLayer calls an LLM (GPT-4, Claude, etc.) to make context-aware decisions.
          The architecture and component rendering work exactly as in production.
        </p>
      </div>

      <h2>Why This Matters: Real Examples</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="text-sm font-semibold mb-2">1. Expert vs Beginner</h4>
          <p className="text-xs text-muted-foreground mb-3">
            <strong>Query:</strong> "Create a budget"
          </p>
          <ul className="text-xs space-y-1 list-none p-0">
            <li>• <strong>Expert (9/10):</strong> → Form (fast, no handholding)</li>
            <li>• <strong>Beginner (2/10):</strong> → Wizard (guided, explained)</li>
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="text-sm font-semibold mb-2">2. Time-Sensitive vs Planning</h4>
          <p className="text-xs text-muted-foreground mb-3">
            <strong>Query:</strong> "My schedule"
          </p>
          <ul className="text-xs space-y-1 list-none p-0">
            <li>• <strong>Morning (7 AM):</strong> → Today's widget (urgent)</li>
            <li>• <strong>Sunday:</strong> → Week calendar (planning)</li>
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="text-sm font-semibold mb-2">3. Context from History</h4>
          <p className="text-xs text-muted-foreground mb-3">
            <strong>Query:</strong> "Show budget"
          </p>
          <ul className="text-xs space-y-1 list-none p-0">
            <li>• <strong>Recently overspent:</strong> → Alert + advice</li>
            <li>• <strong>On track:</strong> → Simple widget</li>
            <li>• <strong>First time:</strong> → Tutorial + setup wizard</li>
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="text-sm font-semibold mb-2">4. No Fixed Navigation</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Traditional app: Finance tab → Always same screen
          </p>
          <ul className="text-xs space-y-1 list-none p-0">
            <li>• <strong>Urgent:</strong> Budget alert card</li>
            <li>• <strong>Normal:</strong> Spending trends</li>
            <li>• <strong>Empty state:</strong> Setup prompt</li>
          </ul>
        </div>
      </div>

      <h2>How It Works</h2>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6 not-prose">
        <h3 className="text-lg font-semibold mb-4">Decision → Registry → Render</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
            <div>
              <strong>Collect Context:</strong> User query, time, location, expertise, device type, user history
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
            <div>
              <strong>LLM Decision:</strong> Analyze context → Choose UI form (chat/form/widget/wizard) + component type
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
            <div>
              <strong>Registry Lookup:</strong> Resolve component from Component Registry
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">4</div>
            <div>
              <strong>Dynamic Render:</strong> Render component with generated props
            </div>
          </div>
        </div>
      </div>

      <h2>Interactive Demo</h2>
      <p>
        Enter a query and adjust context to see how the UI Decision Layer chooses AND RENDERS
        the appropriate UI component.
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
              onKeyDown={(e) => e.key === 'Enter' && generateUI()}
              placeholder="e.g., Create a new budget"
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {exampleQueries.map((query) => (
                <button
                  key={query}
                  onClick={() => setUserQuery(query)}
                  className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded border border-border transition-colors"
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
                {timeOfDay >= 6 && timeOfDay <= 9 ? '🌅 Morning' :
                 timeOfDay >= 10 && timeOfDay <= 17 ? '☀️ Daytime' :
                 timeOfDay >= 18 && timeOfDay <= 22 ? '🌆 Evening' : '🌙 Night'}
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
                {expertiseLevel <= 3 ? '🌱 Beginner' :
                 expertiseLevel <= 7 ? '📈 Intermediate' : '🚀 Expert'}
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

          {/* Thinking Animation */}
          {phase === 'thinking' && (
            <div className="border-2 border-primary/30 rounded-lg p-6 bg-primary/5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                  <h3 className="text-lg font-semibold">Analyzing Request...</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className={`flex items-start gap-3 transition-opacity ${thinkingStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="flex-shrink-0">
                      {thinkingStep >= 2 ? '✓' : '⏳'}
                    </div>
                    <div className="flex-1">
                      <strong>① Parsing Query</strong>
                      {thinkingStep >= 2 && (
                        <div className="mt-1 text-muted-foreground">
                          "{userQuery}"<br />
                          → Intent: {userQuery.toLowerCase().includes('create') ? 'CREATE' : userQuery.toLowerCase().includes('show') ? 'VIEW' : 'QUERY'} | Domain: {userQuery.toLowerCase().includes('budget') ? 'FINANCE' : userQuery.toLowerCase().includes('schedule') ? 'CALENDAR' : 'GENERAL'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 transition-opacity ${thinkingStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="flex-shrink-0">
                      {thinkingStep >= 3 ? '✓' : thinkingStep >= 2 ? '⏳' : '○'}
                    </div>
                    <div className="flex-1">
                      <strong>② Evaluating User Context</strong>
                      {thinkingStep >= 3 && (
                        <div className="mt-1 text-muted-foreground space-y-1">
                          <div>• Expertise: {expertiseLevel}/10 → {expertiseLevel >= 7 ? 'Power User' : expertiseLevel >= 4 ? 'Intermediate' : 'Beginner'} Profile</div>
                          <div>• Time: {timeOfDay}:00 → {timeOfDay >= 6 && timeOfDay <= 9 ? 'Morning (time-sensitive)' : 'Standard'}</div>
                          <div>• Device: Desktop → Full capabilities available</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 transition-opacity ${thinkingStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="flex-shrink-0">
                      {thinkingStep >= 4 ? '✓' : thinkingStep >= 3 ? '⏳' : '○'}
                    </div>
                    <div className="flex-1">
                      <strong>③ Scoring UI Options</strong>
                      {thinkingStep >= 4 && decision && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="text-xs min-w-[60px]">Form:</div>
                            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                              <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${decision.uiForm === 'form' ? decision.confidence * 100 : 40}%` }} />
                            </div>
                            <div className="text-xs min-w-[40px] text-right">{decision.uiForm === 'form' ? (decision.confidence * 100).toFixed(0) : '40'}%</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs min-w-[60px]">Widget:</div>
                            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                              <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${decision.uiForm === 'widget' ? decision.confidence * 100 : 30}%` }} />
                            </div>
                            <div className="text-xs min-w-[40px] text-right">{decision.uiForm === 'widget' ? (decision.confidence * 100).toFixed(0) : '30'}%</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs min-w-[60px]">Chat:</div>
                            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                              <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${decision.uiForm === 'chat' ? decision.confidence * 100 : 25}%` }} />
                            </div>
                            <div className="text-xs min-w-[40px] text-right">{decision.uiForm === 'chat' ? (decision.confidence * 100).toFixed(0) : '25'}%</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs min-w-[60px]">Wizard:</div>
                            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                              <div className="bg-orange-500 h-full transition-all duration-500" style={{ width: `${decision.uiForm === 'wizard' ? decision.confidence * 100 : 15}%` }} />
                            </div>
                            <div className="text-xs min-w-[40px] text-right">{decision.uiForm === 'wizard' ? (decision.confidence * 100).toFixed(0) : '15'}%</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 transition-opacity ${thinkingStep >= 4 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="flex-shrink-0">
                      {thinkingStep >= 4 ? '✓' : '○'}
                    </div>
                    <div className="flex-1">
                      <strong>④ Decision</strong>
                      {thinkingStep >= 4 && decision && (
                        <div className="mt-1 text-muted-foreground">
                          Selected: <span className="font-semibold capitalize">{decision.uiForm}</span> ({(decision.confidence * 100).toFixed(0)}% confidence)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Decision Summary (Collapsed) */}
          {phase === 'decided' && decision && (
            <div className="space-y-4">
              <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">🧠</div>
                    <div className="flex-1">
                      <div className="font-semibold">Decision Complete</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Selected: <span className="capitalize font-medium">{decision.uiForm}</span> ({(decision.confidence * 100).toFixed(0)}% confidence)
                      </div>
                      <div className="text-sm">
                        <strong>Component:</strong> {decision.componentType}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {decision.explanation}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPhase('expanded')}
                    className="ml-4"
                  >
                    View Detailed Analysis ↓
                  </Button>
                </div>
              </div>

              {/* Rendered Component */}
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">RENDERED UI</span>
                  <span className="text-muted-foreground font-normal">
                    This is what the user sees:
                    {experimentalDecision && experimentalDecision.uiForm !== decision.uiForm && (
                      <span className="text-primary ml-2">(Updated based on experimental context)</span>
                    )}
                  </span>
                </h4>
                {RenderedComponent && <RenderedComponent {...(activeDecision.props || {})} />}
              </div>
            </div>
          )}

          {/* Decision Analysis (Expanded) */}
          {phase === 'expanded' && decision && (
            <div className="space-y-4">
              <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🧠</div>
                    <div>
                      <div className="font-semibold">Decision Complete</div>
                      <div className="text-sm text-muted-foreground">
                        Selected: <span className="capitalize font-medium">{decision.uiForm}</span> ({(decision.confidence * 100).toFixed(0)}% confidence)
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPhase('decided')}
                  >
                    Collapse ↑
                  </Button>
                </div>
              </div>

              {/* Decision Matrix */}
              <div className="border border-border rounded-lg p-6 bg-card">
                <h3 className="text-lg font-semibold mb-4">🎯 Decision Matrix</h3>

                {(() => {
                  const scores = calculateScores({
                    query: userQuery,
                    timeOfDay: experimentalTimeOfDay,
                    expertiseLevel: experimentalExpertise,
                    location: 'Berlin',
                    deviceType: 'desktop'
                  });

                  const sortedForms = Object.entries(scores.forms)
                    .sort(([, a], [, b]) => b.total - a.total);

                  const maxScore = Math.max(...Object.values(scores.forms).map(f => f.total));

                  return (
                    <>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-3">Context Factor Analysis:</h4>
                          <div className="bg-muted/30 rounded-lg p-4">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="text-left py-2 pr-4">Factor</th>
                                  <th className="text-left py-2 pr-4">Value</th>
                                  <th className="text-left py-2 pr-4">Weight</th>
                                  <th className="text-right py-2">Score</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-border/50">
                                  <td className="py-2 pr-4">User Expertise</td>
                                  <td className="py-2 pr-4">{experimentalExpertise}/10</td>
                                  <td className="py-2 pr-4">{scores.factors.expertise.weight}</td>
                                  <td className="py-2 text-right">
                                    <Badge variant={scores.factors.expertise.score > 30 ? 'success' : 'secondary'}>
                                      +{scores.factors.expertise.score}
                                    </Badge>
                                  </td>
                                </tr>
                                <tr className="border-b border-border/50">
                                  <td className="py-2 pr-4">Time of Day</td>
                                  <td className="py-2 pr-4">{experimentalTimeOfDay}:00</td>
                                  <td className="py-2 pr-4">{scores.factors.timeOfDay.weight}</td>
                                  <td className="py-2 text-right">
                                    <Badge variant={scores.factors.timeOfDay.score > 0 ? 'success' : 'destructive'}>
                                      {scores.factors.timeOfDay.score > 0 ? '+' : ''}{scores.factors.timeOfDay.score}
                                    </Badge>
                                  </td>
                                </tr>
                                <tr className="border-b border-border/50">
                                  <td className="py-2 pr-4">Intent Clarity</td>
                                  <td className="py-2 pr-4">{scores.factors.intentClarity.value}%</td>
                                  <td className="py-2 pr-4">{scores.factors.intentClarity.weight}</td>
                                  <td className="py-2 text-right">
                                    <Badge variant="success">+{scores.factors.intentClarity.score}</Badge>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 pr-4">Query Complexity</td>
                                  <td className="py-2 pr-4 capitalize">{scores.factors.complexity.value}</td>
                                  <td className="py-2 pr-4">{scores.factors.complexity.weight}</td>
                                  <td className="py-2 text-right">
                                    <Badge variant="success">+{scores.factors.complexity.score}</Badge>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold mb-3">UI Form Score Breakdown:</h4>
                          <div className="bg-muted/30 rounded-lg p-4">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="text-left py-2 pr-4">Form</th>
                                  <th className="text-center py-2 px-2">Expert</th>
                                  <th className="text-center py-2 px-2">Time</th>
                                  <th className="text-center py-2 px-2">Intent</th>
                                  <th className="text-center py-2 px-2">Complex</th>
                                  <th className="text-center py-2 px-2">History</th>
                                  <th className="text-right py-2 pl-4 font-semibold">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sortedForms.map(([formName, formScore], idx) => (
                                  <tr key={formName} className={`border-b border-border/50 ${idx === 0 ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                                    <td className="py-2 pr-4 font-medium capitalize flex items-center gap-2">
                                      {formName}
                                      {idx === 0 && <span className="text-xs">✓</span>}
                                    </td>
                                    <td className="py-2 px-2 text-center text-xs">{formScore.expert > 0 ? '+' : ''}{formScore.expert}</td>
                                    <td className="py-2 px-2 text-center text-xs">{formScore.time > 0 ? '+' : ''}{formScore.time}</td>
                                    <td className="py-2 px-2 text-center text-xs">{formScore.intent > 0 ? '+' : ''}{formScore.intent}</td>
                                    <td className="py-2 px-2 text-center text-xs">{formScore.complexity > 0 ? '+' : ''}{formScore.complexity}</td>
                                    <td className="py-2 px-2 text-center text-xs">{formScore.history > 0 ? '+' : ''}{formScore.history}</td>
                                    <td className="py-2 pl-4 text-right font-semibold">{formScore.total}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                          <h4 className="text-sm font-semibold mb-2">💡 Key Decision Drivers:</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {experimentalExpertise >= 7 && (
                              <li>• <strong>Expert user ({experimentalExpertise}/10)</strong> → Prefers direct, efficient interfaces</li>
                            )}
                            {experimentalExpertise <= 3 && (
                              <li>• <strong>Beginner user ({experimentalExpertise}/10)</strong> → Benefits from guided workflows</li>
                            )}
                            {experimentalTimeOfDay >= 6 && experimentalTimeOfDay <= 9 && (
                              <li>• <strong>Morning time ({experimentalTimeOfDay}:00)</strong> → User likely time-constrained</li>
                            )}
                            {userQuery.toLowerCase().includes('create') && (
                              <li>• <strong>Clear CREATE intent</strong> → Action-oriented UI preferred</li>
                            )}
                          </ul>
                        </div>

                        {/* Experimental Sliders */}
                        <div className="border-t border-border pt-4">
                          <h4 className="text-sm font-semibold mb-3">🔬 Experiment: What If Context Changed?</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Try adjusting context to see how scores change in real-time:
                          </p>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Expertise Level: {experimentalExpertise}/10
                                {experimentalExpertise !== expertiseLevel && (
                                  <span className="text-xs text-primary ml-2">(Modified from {expertiseLevel}/10)</span>
                                )}
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={experimentalExpertise}
                                onChange={(e) => {
                                  const newVal = Number(e.target.value);
                                  setExperimentalExpertise(newVal);
                                  updateExperimentalContext(experimentalTimeOfDay, newVal);
                                }}
                                className="w-full"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Time of Day: {experimentalTimeOfDay}:00
                                {experimentalTimeOfDay !== timeOfDay && (
                                  <span className="text-xs text-primary ml-2">(Modified from {timeOfDay}:00)</span>
                                )}
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="23"
                                value={experimentalTimeOfDay}
                                onChange={(e) => {
                                  const newVal = Number(e.target.value);
                                  setExperimentalTimeOfDay(newVal);
                                  updateExperimentalContext(newVal, experimentalExpertise);
                                }}
                                className="w-full"
                              />
                            </div>

                            {experimentalDecision && experimentalDecision.uiForm !== decision.uiForm && (
                              <div className="space-y-2">
                                <Alert
                                  variant="success"
                                  description={`Decision Changed! With this context, the optimal UI form is now ${experimentalDecision.uiForm} (${(experimentalDecision.confidence * 100).toFixed(0)}% confidence)`}
                                />
                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                                  <div className="text-sm">
                                    <strong className="text-primary">Why this changed:</strong>
                                    <div className="mt-1 text-muted-foreground">{experimentalDecision.explanation}</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setExperimentalTimeOfDay(timeOfDay);
                                setExperimentalExpertise(expertiseLevel);
                                setExperimentalDecision(decision);
                              }}
                            >
                              Reset to Original Context
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Rendered Component */}
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">RENDERED UI</span>
                  <span className="text-muted-foreground font-normal">
                    This is what the user sees:
                    {experimentalDecision && experimentalDecision.uiForm !== decision.uiForm && (
                      <span className="text-primary ml-2">(Updated based on experimental context)</span>
                    )}
                  </span>
                </h4>
                {RenderedComponent && <RenderedComponent {...(activeDecision.props || {})} />}
              </div>
            </div>
          )}
        </div>
      </div>

      <h2>Key Principles</h2>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <ul className="space-y-2 text-sm mb-0">
          <li>✅ <strong>Context-Adaptive:</strong> Same query → Different UI based on situation</li>
          <li>✅ <strong>Dynamic Rendering:</strong> Components rendered at runtime, not hardcoded routes</li>
          <li>✅ <strong>Component Registry:</strong> Centralized mapping of component types to React components</li>
          <li>✅ <strong>Props Generation:</strong> LLM generates appropriate props (pre-filled forms, data)</li>
          <li>✅ <strong>Explainable:</strong> Every decision includes reasoning</li>
          <li>✅ <strong>User-Optimized:</strong> Expertise level influences UI complexity</li>
        </ul>
      </div>

      <h2>Real-World Examples</h2>

      <h3 className="text-lg font-semibold mt-6">Same Intent, Different Context = Different UI</h3>
      <p>
        The power of AI-Driven UI is that the <strong>same user intent</strong> produces{' '}
        <strong>different interfaces</strong> based on context:
      </p>

      <div className="space-y-4 my-6 not-prose">
        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
          <h4 className="text-sm font-semibold mb-2">Scenario 1: "I need to budget for groceries"</h4>
          <div className="space-y-2 text-xs">
            <div>
              <strong>Context:</strong> Morning (8 AM), Expert user (9/10), on desktop
            </div>
            <div>
              <strong>Decision:</strong> Direct Form with pre-filled category "Food"
            </div>
            <div className="text-muted-foreground">
              <strong>Why:</strong> Expert users in the morning want speed. Skip explanations, show fields.
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
          <h4 className="text-sm font-semibold mb-2">Scenario 2: "I need to budget for groceries"</h4>
          <div className="space-y-2 text-xs">
            <div>
              <strong>Context:</strong> Evening (8 PM), Beginner (2/10), on mobile
            </div>
            <div>
              <strong>Decision:</strong> Conversational Wizard
            </div>
            <div className="text-muted-foreground">
              <strong>Why:</strong> Beginner needs guidance. Evening = less time pressure. Mobile = step-by-step better.
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
          <h4 className="text-sm font-semibold mb-2">Scenario 3: "I need to budget for groceries"</h4>
          <div className="space-y-2 text-xs">
            <div>
              <strong>Context:</strong> Afternoon (2 PM), Intermediate (5/10), just overspent last month
            </div>
            <div>
              <strong>Decision:</strong> Chat with suggestions based on history
            </div>
            <div className="text-muted-foreground">
              <strong>Why:</strong> User history suggests they struggle with budgets. Offer personalized advice first.
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-6">Context-Aware Proactivity</h3>
      <p>The UI Decision Layer doesn't just react—it adapts proactively:</p>

      <div className="my-4 not-prose">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>Morning commute (7:30 AM):</strong> "My schedule" → Shows{' '}
            <strong>today's appointments as widget</strong> (time-sensitive)
          </li>
          <li>
            <strong>Planning session (Sunday afternoon):</strong> "My schedule" → Shows{' '}
            <strong>calendar view</strong> (week overview)
          </li>
          <li>
            <strong>After meeting invite:</strong> "My schedule" → Shows{' '}
            <strong>conflict checker form</strong> (action-oriented)
          </li>
        </ul>
      </div>

      <h3 className="text-lg font-semibold mt-6">No Fixed Screens, Only Opportunities</h3>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4 not-prose">
        <div className="space-y-3 text-sm">
          <div>
            <strong>Traditional UI:</strong> User clicks "Finance" → Always sees the same dashboard
          </div>
          <div>
            <strong>AI-Driven UI:</strong> User opens Fidus → LLM decides what's relevant NOW:
            <ul className="mt-2 space-y-1 text-xs ml-4">
              <li>• Budget overage? → Show alert card</li>
              <li>• Upcoming bill? → Show payment reminder</li>
              <li>• Nothing urgent? → Show spending trends</li>
            </ul>
          </div>
          <div className="text-muted-foreground text-xs pt-2 border-t border-border mt-2">
            The dashboard is an <strong>Opportunity Surface</strong>, not a fixed layout.
          </div>
        </div>
      </div>

      <h2>Implementation in Production</h2>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// Backend: UI Decision Layer Service
class UIDecisionLayerService {
  async decide(context: UserContext): Promise<UIDecision> {
    // Call LLM with context
    const llmResponse = await this.llm.chat({
      messages: [
        {
          role: 'system',
          content: 'You are a UI decision engine. Analyze context and decide optimal UI form.'
        },
        {
          role: 'user',
          content: JSON.stringify(context)
        }
      ]
    });

    // Parse LLM response
    return {
      uiForm: llmResponse.uiForm,
      componentType: llmResponse.componentType,
      props: llmResponse.props,
      confidence: llmResponse.confidence,
      explanation: llmResponse.reasoning
    };
  }
}

// Frontend: Dynamic Rendering
function DynamicUI({ decision }: { decision: UIDecision }) {
  const Component = ComponentRegistry.get(decision.componentType);

  if (!Component) {
    console.error(\`Component \${decision.componentType} not found\`);
    return <ErrorFallback />;
  }

  return <Component {...decision.props} />;
}`}
      </pre>

      <h2>Related Documentation</h2>
      <ul>
        <li><a href="/architecture/component-registry">Component Registry</a> - Component mapping and resolution</li>
        <li><a href="/architecture/api-response-schema">API Response Schema</a> - Structure of UI metadata</li>
        <li><a href="/foundations/ai-driven-ui">AI-Driven UI Paradigm</a> - Core principles and philosophy</li>
      </ul>
    </div>
  );
}
