'use client';

export default function GlossaryPage() {
  const terms = [
    {
      letter: 'A',
      terms: [
        {
          term: 'AI-Driven UI',
          definition:
            'The paradigm where the backend LLM decides what UI to render based on context, rather than the frontend having fixed screens. The LLM chooses between Chat, Form, Wizard, or Widget modes.',
        },
        {
          term: 'Aggregate',
          definition:
            'A DDD pattern representing a cluster of domain objects treated as a single unit for data changes. Examples: Appointment, Budget, Trip.',
        },
        {
          term: 'Action Metadata',
          definition:
            'Data in API responses describing actions users can take (buttons, links). Includes id, label, type, and intent or endpoint.',
        },
      ],
    },
    {
      letter: 'B',
      terms: [
        {
          term: 'Bounded Context',
          definition:
            'A DDD term for a distinct area of the domain with clear boundaries. In Fidus, each domain (Calendar, Finance, Travel, etc.) is a bounded context.',
        },
        {
          term: 'Breakpoints',
          definition:
            'Responsive design breakpoints: Mobile (< 640px), Tablet (640px-1024px), Desktop (≥ 1024px).',
        },
      ],
    },
    {
      letter: 'C',
      terms: [
        {
          term: 'Chat Mode',
          definition:
            'One of four UI modes in the AI-Driven UI. Used for simple informational responses where the user asks a question and receives a text answer.',
        },
        {
          term: 'Component Registry',
          definition:
            'A frontend system that maps componentType strings (from UI Metadata) to actual React components. Enables dynamic rendering based on backend decisions.',
        },
        {
          term: 'Context-Aware',
          definition:
            'A core principle of Fidus: the system adapts UI and suggestions based on user context (time of day, location, current activity, history).',
        },
      ],
    },
    {
      letter: 'D',
      terms: [
        {
          term: 'Dashboard',
          definition:
            'The main screen showing dynamic opportunity cards. Also called "Opportunity Surface" in design docs and "Home" in user-facing UI.',
        },
        {
          term: 'Domain',
          definition:
            'A life area that Fidus helps manage. Eight domains: Calendar, Finance, Travel, Communication, Health, Home, Shopping, Learning.',
        },
        {
          term: 'Domain Event',
          definition:
            'An event published when something significant happens in a domain (e.g., AppointmentCreated, BudgetExceeded). Other domains can subscribe to these events.',
        },
        {
          term: 'Domain Supervisor',
          definition:
            "The LangGraph state machine implementing a bounded context's logic. Each domain has its own supervisor.",
        },
      ],
    },
    {
      letter: 'E',
      terms: [
        {
          term: 'Empty State',
          definition:
            "UI shown when there's no data to display. Should be helpful (suggest actions) not just say \"No data.\"",
        },
        {
          term: 'Error State',
          definition:
            'UI shown when an error occurs. Should explain what happened, why, and offer recovery options.',
        },
        {
          term: 'Event Bus',
          definition:
            'The infrastructure for publishing and subscribing to domain events. Uses Redis Pub/Sub.',
        },
      ],
    },
    {
      letter: 'F',
      terms: [
        {
          term: 'Form Mode',
          definition:
            'One of four UI modes in the AI-Driven UI. Used for quick data entry with 1-3 fields (e.g., "Schedule appointment").',
        },
      ],
    },
    {
      letter: 'I',
      terms: [
        {
          term: 'Intent',
          definition:
            "The user's goal extracted from their natural language input (e.g., CALENDAR_CREATE, FINANCE_QUERY).",
        },
        {
          term: 'Intent Detection',
          definition:
            'The process of analyzing user input to determine what the user wants to do and which domain should handle it.',
        },
      ],
    },
    {
      letter: 'L',
      terms: [
        {
          term: 'LLM',
          definition:
            "Large Language Model - the AI model that powers Fidus's natural language understanding and decision-making. Can be Local (Llama 3.1) or Cloud (GPT-4).",
        },
        {
          term: 'Loading State',
          definition:
            'UI shown while waiting for data or processing. Uses skeletons, spinners, or progress bars.',
        },
        {
          term: 'Local AI',
          definition:
            "LLM running entirely on the user's device. Maximum privacy, no internet required, free forever. Example: Llama 3.1 8B.",
        },
      ],
    },
    {
      letter: 'M',
      terms: [
        {
          term: 'Multi-Tenancy',
          definition:
            'The ability to switch between different contexts (Personal, Work, Family). Each tenant has isolated data.',
        },
      ],
    },
    {
      letter: 'O',
      terms: [
        {
          term: 'Opportunity',
          definition:
            'A proactive suggestion or alert that Fidus surfaces to the user based on detected patterns or triggers.',
        },
        {
          term: 'Opportunity Card',
          definition:
            'A widget on the Dashboard representing an opportunity. Has a title, description, relevance score, and actions.',
        },
        {
          term: 'Opportunity Surface',
          definition:
            "Design term for the Dashboard. Emphasizes that it's a dynamic, LLM-curated surface of opportunities, not a static widget dashboard.",
        },
        {
          term: 'Opportunity Surface Service',
          definition:
            'Backend service that listens to proactive triggers, scores them for relevance, creates opportunity cards, and provides API for Dashboard.',
        },
        {
          term: 'Orchestration Supervisor',
          definition:
            'The main supervisor that handles intent detection, routing to domain supervisors, and UI decision-making.',
        },
      ],
    },
    {
      letter: 'P',
      terms: [
        {
          term: 'Proactive Trigger',
          definition:
            'An event indicating an opportunity detected by a domain (e.g., BUDGET_EXCEEDED, DOUBLE_BOOKING). Consumed by Proactivity domain and Opportunity Surface Service.',
        },
        {
          term: 'Proactivity Domain',
          definition:
            'A core domain responsible for analyzing patterns across all domains and creating opportunities.',
        },
        {
          term: 'Privacy Badge',
          definition:
            'A UI indicator showing the privacy level of data or actions: 🔒 Local, ☁️ Cloud, 🔐 Encrypted.',
        },
        {
          term: 'Privacy Metadata',
          definition:
            'Data in API responses describing where data is processed and stored. Includes level (local/cloud/encrypted), label, and tooltip.',
        },
        {
          term: 'Privacy-First',
          definition:
            'A core principle: user privacy is the top priority. Local processing by default, transparent about what data goes where.',
        },
      ],
    },
    {
      letter: 'R',
      terms: [
        {
          term: 'Relevance Score',
          definition:
            'A 0-100 score indicating how important an opportunity is to the user right now. Higher score = shown first on Dashboard.',
        },
      ],
    },
    {
      letter: 'S',
      terms: [
        {
          term: 'Supervisor',
          definition:
            'A LangGraph state machine that manages logic for a domain or the orchestration layer. Each supervisor is autonomous.',
        },
        {
          term: 'Swipe Gestures',
          definition:
            'Standard swipe directions: Right (dismiss), Left (delete), Down (refresh), Up (expand).',
        },
      ],
    },
    {
      letter: 'T',
      terms: [
        {
          term: 'Tenant',
          definition:
            'A data isolation boundary. Users can have multiple tenants (Personal, Work, Family) with separate data.',
        },
        {
          term: 'Tenant Switcher',
          definition:
            'A UI component (usually in header) allowing users to switch between tenants. Icon: 👤',
        },
      ],
    },
    {
      letter: 'U',
      terms: [
        {
          term: 'UI Decision Layer',
          definition:
            'A component in the Orchestration Supervisor that analyzes context and decides what UI mode to use (Chat, Form, Wizard, Widget).',
        },
        {
          term: 'UI Metadata',
          definition:
            'Data in API responses describing what UI to render. Includes mode, componentType, props, actions, privacy.',
        },
        {
          term: 'UI Mode',
          definition:
            'The type of interface the system decides to render. Four modes: Chat, Form, Wizard, Widget.',
        },
      ],
    },
    {
      letter: 'W',
      terms: [
        {
          term: 'WCAG 2.1 AA',
          definition:
            'Web Content Accessibility Guidelines level AA compliance. All Fidus UI must meet this standard (4.5:1 contrast, keyboard navigation, screen reader support).',
        },
        {
          term: 'Widget Mode',
          definition:
            'One of four UI modes in the AI-Driven UI. Used for proactive opportunities shown as cards on the Dashboard.',
        },
        {
          term: 'Wizard Mode',
          definition:
            'One of four UI modes in the AI-Driven UI. Used for complex multi-step workflows with >3 inputs or multiple domains.',
        },
      ],
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Glossary</h1>
      <p className="lead">
        Standard terminology used across all Fidus documentation, code, and UI.
        Use these exact terms to maintain consistency.
      </p>

      <div className="not-prose">
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            This glossary contains 40+ terms that define the Fidus vocabulary. When writing
            documentation or UI text, always use these standardized terms.
          </p>
        </div>

        {terms.map((section) => (
          <div key={section.letter} className="mb-12">
            <h2 className="text-3xl font-bold mb-6 pb-2 border-b border-border">
              {section.letter}
            </h2>
            <dl className="space-y-6">
              {section.terms.map((item) => (
                <div key={item.term}>
                  <dt className="text-lg font-semibold text-foreground mb-2">
                    {item.term}
                  </dt>
                  <dd className="text-md text-muted-foreground ml-0 pl-4 border-l-2 border-primary">
                    {item.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <h2>Usage Guidelines</h2>

      <h3>Preferred Terms</h3>
      <p>Use these terms consistently:</p>
      <table>
        <thead>
          <tr>
            <th>✅ Use This</th>
            <th>❌ Not This</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dashboard</td>
            <td>Home Screen, Main View</td>
          </tr>
          <tr>
            <td>Opportunity Card</td>
            <td>Widget, Notification Card</td>
          </tr>
          <tr>
            <td>Chat Mode</td>
            <td>Chat UI, Conversational Mode</td>
          </tr>
          <tr>
            <td>Proactive Trigger</td>
            <td>Opportunity Trigger, Alert Trigger</td>
          </tr>
          <tr>
            <td>Domain Supervisor</td>
            <td>Domain Agent, Domain Service</td>
          </tr>
          <tr>
            <td>UI Decision Layer</td>
            <td>UI Selector, Mode Chooser</td>
          </tr>
          <tr>
            <td>Privacy Badge</td>
            <td>Privacy Indicator, Data Badge</td>
          </tr>
          <tr>
            <td>Tenant Switcher</td>
            <td>Account Switcher, Context Switcher</td>
          </tr>
          <tr>
            <td>Local AI</td>
            <td>On-Device AI, Offline AI</td>
          </tr>
          <tr>
            <td>Cloud AI</td>
            <td>Remote AI, Online AI</td>
          </tr>
        </tbody>
      </table>

      <h3>Context-Specific Terms</h3>
      <p>Some terms vary by context:</p>
      <table>
        <thead>
          <tr>
            <th>Context</th>
            <th>Technical Docs</th>
            <th>Design Docs</th>
            <th>User-Facing UI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Main screen</td>
            <td>Dashboard</td>
            <td>Opportunity Surface</td>
            <td>Dashboard</td>
          </tr>
          <tr>
            <td>Tenant boundary</td>
            <td>Tenant</td>
            <td>Context</td>
            <td>Account</td>
          </tr>
          <tr>
            <td>LLM choice</td>
            <td>UI Decision Layer</td>
            <td>UI Orchestration</td>
            <td>(not shown to user)</td>
          </tr>
          <tr>
            <td>Alert card</td>
            <td>Opportunity Card</td>
            <td>Opportunity</td>
            <td>Notification / Alert</td>
          </tr>
        </tbody>
      </table>

      <h2>Standard Model Names</h2>
      <p>Use these exact names for AI models:</p>
      <ul>
        <li>
          <strong>Local:</strong> "Llama 3.1 8B" or "Ollama" (never "Llama3", "LLama", or "Lama")
        </li>
        <li>
          <strong>Cloud OpenAI:</strong> "GPT-4" or "GPT-3.5" (never "ChatGPT", "OpenAI API")
        </li>
        <li>
          <strong>Cloud Anthropic:</strong> "Claude 3.5 Sonnet" (never "Claude-3", "Anthropic API")
        </li>
      </ul>

      <h2>Related Documentation</h2>
      <ul>
        <li>
          <a href="/foundations/ai-driven-ui">AI-Driven UI Paradigm</a> - Core UI concepts
        </li>
        <li>
          <a href="/content/voice-tone">Voice and Tone</a> - Writing guidelines
        </li>
        <li>
          <a href="/content/grammar-mechanics">Grammar and Mechanics</a> - Style rules
        </li>
      </ul>
    </div>
  );
}
