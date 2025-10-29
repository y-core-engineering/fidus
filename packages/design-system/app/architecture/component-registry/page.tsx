export default function ComponentRegistryPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Component Registry</h1>
      <p className="lead">
        The Component Registry is the bridge between backend UI decisions and frontend React components.
        It maps component identifiers to actual implementations, enabling the AI-Driven UI system.
      </p>

      <h2>What is the Component Registry?</h2>
      <p>
        The Component Registry is a centralized mapping system that connects backend UI metadata with
        frontend React components. When the UI Decision Layer decides to render a "BudgetForm", the
        Component Registry knows exactly which React component to load and how to pass props to it.
      </p>

      <h2>Why It's Needed</h2>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold mb-4">Problem Without Registry</h3>
        <p className="text-sm mb-3">
          Backend and frontend are tightly coupled. Backend must know exact component names and imports.
        </p>
        <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
{`// Backend (BAD - hardcoded component name)
return {
  component: 'BudgetForm',  // What if renamed?
  importPath: '@fidus/ui/forms/BudgetForm'  // Coupling!
};

// Frontend (BAD - no validation)
const Component = require(response.importPath);  // Unsafe!
return <Component {...props} />;`}
        </pre>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold mb-4">Solution With Registry</h3>
        <p className="text-sm mb-3">
          Backend uses stable identifiers. Frontend controls component resolution and validation.
        </p>
        <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
{`// Backend (GOOD - stable identifier)
return {
  componentType: 'budget-form',  // Stable identifier
  props: { category: 'food', amount: 500 }
};

// Frontend (GOOD - validated lookup)
const registration = registry.get('budget-form');
const Component = registration.component;
return <Component {...props} />;  // Type-safe!`}
        </pre>
      </div>

      <h2>Registry Structure</h2>

      <p>
        The registry maintains a map of component identifiers to component metadata:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`interface ComponentRegistration {
  // Unique identifier (stable across versions)
  id: string;

  // Human-readable name
  name: string;

  // React component
  component: React.ComponentType<any>;

  // Zod schema for props validation
  propsSchema: z.ZodSchema;

  // Component category
  category: 'form' | 'widget' | 'card' | 'wizard';

  // Version (for backwards compatibility)
  version: string;

  // Optional description
  description?: string;
}

// Example registry
const registry = new Map<string, ComponentRegistration>([
  ['budget-form', {
    id: 'budget-form',
    name: 'Budget Form',
    component: BudgetForm,
    propsSchema: BudgetFormPropsSchema,
    category: 'form',
    version: '1.0.0',
    description: 'Form for creating and editing budgets'
  }],
  ['calendar-widget', {
    id: 'calendar-widget',
    name: 'Calendar Widget',
    component: CalendarWidget,
    propsSchema: CalendarWidgetPropsSchema,
    category: 'widget',
    version: '1.2.0',
    description: 'Interactive calendar display'
  }]
]);`}
      </pre>

      <h2>How Backend Uses It</h2>

      <p>
        The backend (UI Decision Layer) returns stable component identifiers:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// In UI Decision Layer (Python/FastAPI)
class UIDecisionResponse:
    ui_form: str  # 'form' | 'chat' | 'widget' | 'wizard'
    component_type: str  # Stable identifier: 'budget-form'
    props: dict  # Component props
    confidence: float
    reasoning: str

# Example response
{
  "ui_form": "form",
  "component_type": "budget-form",  # ← Registry lookup key
  "props": {
    "category": "food",
    "suggested_amount": 500,
    "currency": "EUR",
    "period": "monthly"
  },
  "confidence": 0.92,
  "reasoning": "Expert user with clear intent"
}`}
      </pre>

      <h2>How Frontend Uses It</h2>

      <p>
        The frontend looks up components and validates props:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { componentRegistry } from '@/lib/component-registry';

interface UIResponse {
  uiForm: string;
  componentType: string;
  props: Record<string, unknown>;
}

function DynamicUIRenderer({ response }: { response: UIResponse }) {
  // 1. Look up component in registry
  const registration = componentRegistry.get(response.componentType);

  if (!registration) {
    console.error(\`Component not found: \${response.componentType}\`);
    return <ErrorFallback message="Unknown component" />;
  }

  // 2. Validate props with Zod schema
  const validationResult = registration.propsSchema.safeParse(response.props);

  if (!validationResult.success) {
    console.error('Invalid props:', validationResult.error);
    return <ErrorFallback message="Invalid component props" />;
  }

  // 3. Render component with validated props
  const Component = registration.component;
  return <Component {...validationResult.data} />;
}`}
      </pre>

      <h2>Versioning Support</h2>

      <p>
        The registry supports component versioning for backwards compatibility:
      </p>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6 not-prose">
        <h3 className="text-sm font-semibold mb-3">Version Evolution</h3>
        <div className="space-y-4 text-sm">
          <div className="border-l-4 border-primary pl-4">
            <div className="font-semibold">v1.0.0 - Initial Release</div>
            <pre className="text-xs mt-2 bg-background p-2 rounded">
{`{
  id: 'budget-form',
  component: BudgetFormV1,
  propsSchema: z.object({
    category: z.string(),
    amount: z.number()
  })
}`}
            </pre>
          </div>

          <div className="border-l-4 border-secondary pl-4">
            <div className="font-semibold">v1.1.0 - Add Currency Support</div>
            <pre className="text-xs mt-2 bg-background p-2 rounded">
{`{
  id: 'budget-form',
  component: BudgetFormV1_1,
  propsSchema: z.object({
    category: z.string(),
    amount: z.number(),
    currency: z.string().optional()  // ← Backward compatible
  })
}`}
            </pre>
          </div>

          <div className="border-l-4 border-accent pl-4">
            <div className="font-semibold">v2.0.0 - Breaking Change</div>
            <pre className="text-xs mt-2 bg-background p-2 rounded">
{`// Register both versions
registry.set('budget-form', BudgetFormV2Registration);
registry.set('budget-form-v1', BudgetFormV1Registration);

// Backend can specify version
{
  componentType: 'budget-form-v1',  // Legacy clients
  // or
  componentType: 'budget-form'  // Latest version
}`}
            </pre>
          </div>
        </div>
      </div>

      <h2>Type Safety with TypeScript</h2>

      <p>
        The registry provides full type safety using TypeScript generics:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { z } from 'zod';

// Define props schema
const BudgetFormPropsSchema = z.object({
  category: z.string(),
  suggestedAmount: z.number().optional(),
  currency: z.enum(['EUR', 'USD', 'GBP']),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  onSubmit: z.function().optional()
});

// Infer TypeScript type from schema
type BudgetFormProps = z.infer<typeof BudgetFormPropsSchema>;

// Component with typed props
function BudgetForm(props: BudgetFormProps) {
  // TypeScript knows all props!
  return (
    <form>
      <input name="category" defaultValue={props.category} />
      {/* ... */}
    </form>
  );
}

// Register with schema
componentRegistry.register({
  id: 'budget-form',
  name: 'Budget Form',
  component: BudgetForm,
  propsSchema: BudgetFormPropsSchema,  // ← Runtime validation
  category: 'form',
  version: '1.0.0'
});`}
      </pre>

      <h2>Adding New Components</h2>

      <p>
        To add a new component to the registry:
      </p>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6 not-prose">
        <ol className="space-y-4 text-sm">
          <li>
            <strong>1. Create the React Component</strong>
            <pre className="text-xs mt-2 bg-background p-3 rounded overflow-x-auto">
{`// components/TransactionList.tsx
interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (id: string) => void;
}

export function TransactionList(props: TransactionListProps) {
  return (
    <div>
      {props.transactions.map(tx => (
        <TransactionCard key={tx.id} transaction={tx} />
      ))}
    </div>
  );
}`}
            </pre>
          </li>

          <li>
            <strong>2. Define Zod Schema</strong>
            <pre className="text-xs mt-2 bg-background p-3 rounded overflow-x-auto">
{`// components/TransactionList.schema.ts
import { z } from 'zod';

export const TransactionListPropsSchema = z.object({
  transactions: z.array(z.object({
    id: z.string(),
    amount: z.number(),
    category: z.string(),
    date: z.string(),
    merchant: z.string().optional()
  })),
  onTransactionClick: z.function().optional()
});`}
            </pre>
          </li>

          <li>
            <strong>3. Register Component</strong>
            <pre className="text-xs mt-2 bg-background p-3 rounded overflow-x-auto">
{`// lib/component-registry.ts
import { TransactionList } from '@/components/TransactionList';
import { TransactionListPropsSchema } from '@/components/TransactionList.schema';

componentRegistry.register({
  id: 'transaction-list',  // ← Stable identifier
  name: 'Transaction List',
  component: TransactionList,
  propsSchema: TransactionListPropsSchema,
  category: 'widget',
  version: '1.0.0',
  description: 'List of financial transactions'
});`}
            </pre>
          </li>

          <li>
            <strong>4. Update Backend Constants</strong>
            <pre className="text-xs mt-2 bg-background p-3 rounded overflow-x-auto">
{`# backend/constants.py
COMPONENT_TYPES = {
    'BUDGET_FORM': 'budget-form',
    'CALENDAR_WIDGET': 'calendar-widget',
    'TRANSACTION_LIST': 'transaction-list',  # ← Add here
}

# Now backend can use:
component_type = COMPONENT_TYPES['TRANSACTION_LIST']`}
            </pre>
          </li>
        </ol>
      </div>

      <h2>Error Handling</h2>

      <p>
        The registry provides robust error handling:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`class ComponentRegistry {
  get(id: string): ComponentRegistration | null {
    const registration = this.components.get(id);

    if (!registration) {
      console.error(\`Component not found in registry: \${id}\`);
      // Log to monitoring service
      logger.error('component_not_found', { componentId: id });
      return null;
    }

    return registration;
  }

  validate(id: string, props: unknown): ValidationResult {
    const registration = this.get(id);

    if (!registration) {
      return { success: false, error: 'Component not found' };
    }

    const result = registration.propsSchema.safeParse(props);

    if (!result.success) {
      console.error(\`Invalid props for \${id}:\`, result.error);
      // Log to monitoring service
      logger.error('invalid_component_props', {
        componentId: id,
        error: result.error
      });
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  }
}`}
      </pre>

      <h2>Registry Implementation</h2>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// lib/component-registry.ts
import { z } from 'zod';
import type { ComponentType } from 'react';

interface ComponentRegistration {
  id: string;
  name: string;
  component: ComponentType<any>;
  propsSchema: z.ZodSchema;
  category: 'form' | 'widget' | 'card' | 'wizard';
  version: string;
  description?: string;
}

class ComponentRegistry {
  private components = new Map<string, ComponentRegistration>();

  register(registration: ComponentRegistration): void {
    if (this.components.has(registration.id)) {
      console.warn(\`Component \${registration.id} already registered\`);
    }
    this.components.set(registration.id, registration);
  }

  get(id: string): ComponentRegistration | null {
    return this.components.get(id) || null;
  }

  getAll(): ComponentRegistration[] {
    return Array.from(this.components.values());
  }

  getByCategory(category: string): ComponentRegistration[] {
    return this.getAll().filter(c => c.category === category);
  }
}

export const componentRegistry = new ComponentRegistry();

// Register all components
componentRegistry.register({
  id: 'budget-form',
  name: 'Budget Form',
  component: BudgetForm,
  propsSchema: BudgetFormPropsSchema,
  category: 'form',
  version: '1.0.0'
});

componentRegistry.register({
  id: 'calendar-widget',
  name: 'Calendar Widget',
  component: CalendarWidget,
  propsSchema: CalendarWidgetPropsSchema,
  category: 'widget',
  version: '1.2.0'
});

// ... more registrations`}
      </pre>

      <h2>Benefits</h2>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <ul className="space-y-2 text-sm">
          <li>✅ <strong>Decoupling:</strong> Backend doesn't need to know React component details</li>
          <li>✅ <strong>Type Safety:</strong> Zod schemas ensure props are valid at runtime</li>
          <li>✅ <strong>Versioning:</strong> Support multiple component versions simultaneously</li>
          <li>✅ <strong>Validation:</strong> Catch invalid props before rendering</li>
          <li>✅ <strong>Centralized:</strong> Single source of truth for all UI components</li>
          <li>✅ <strong>Testable:</strong> Mock registry for testing</li>
        </ul>
      </div>

      <h2>Testing Components</h2>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`describe('ComponentRegistry', () => {
  it('should return registered component', () => {
    const registration = componentRegistry.get('budget-form');
    expect(registration).toBeDefined();
    expect(registration?.id).toBe('budget-form');
  });

  it('should validate valid props', () => {
    const result = componentRegistry.validate('budget-form', {
      category: 'food',
      suggestedAmount: 500,
      currency: 'EUR',
      period: 'monthly'
    });

    expect(result.success).toBe(true);
  });

  it('should reject invalid props', () => {
    const result = componentRegistry.validate('budget-form', {
      category: 123,  // Wrong type
      currency: 'INVALID'  // Not in enum
    });

    expect(result.success).toBe(false);
  });

  it('should return null for unknown component', () => {
    const registration = componentRegistry.get('unknown-component');
    expect(registration).toBeNull();
  });
});`}
      </pre>

      <h2>Related Documentation</h2>
      <ul>
        <li><a href="/architecture/ui-decision-layer">UI Decision Layer</a> - How components are chosen</li>
        <li><a href="/architecture/api-response-schema">API Response Schema</a> - Response structure</li>
        <li><a href="/foundations/ai-driven-ui">AI-Driven UI Paradigm</a> - Core principles</li>
      </ul>
    </div>
  );
}
