export default function AIDrivenUIPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>AI-Driven UI Paradigm</h1>
      <p className="lead">
        Fidus implements a fundamentally different UI paradigm than traditional applications.
        Instead of fixed screens and predetermined flows, Fidus uses an AI-Driven UI where the LLM
        dynamically decides what interface to present based on context.
      </p>

      <h2>The Paradigm Shift</h2>

      <h3>Traditional UI (What Fidus Is NOT)</h3>
      <p>Traditional applications have:</p>
      <ul>
        <li>
          <strong>Rigid Structure:</strong> User must navigate to "Calendar Screen" even for quick
          check
        </li>
        <li>
          <strong>Static Content:</strong> Dashboard shows same widgets regardless of context
        </li>
        <li>
          <strong>Predetermined Flows:</strong> App dictates "Step 1, Step 2, Step 3"
        </li>
        <li>
          <strong>User Must Seek:</strong> User navigates to features instead of features coming to
          user
        </li>
        <li>
          <strong>Hardcoded Logic:</strong> "Morning = show weather" coded in JavaScript
        </li>
      </ul>

      <h3>AI-Driven UI (What Fidus IS)</h3>
      <p>
        The LLM analyzes user context and decides the optimal UI form. The same user intent can
        result in different interfaces based on situation.
      </p>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
        <h4 className="text-sm font-semibold mb-4">Context-Driven UI Flow</h4>
        <ol className="text-sm space-y-2">
          <li>1. User provides context (query, action, or time-based trigger)</li>
          <li>2. LLM analyzes: intent, urgency, data complexity, user history</li>
          <li>3. LLM decides optimal UI form: Card, Form, Chat, Widget, or Wizard</li>
          <li>4. UI is rendered with appropriate content and actions</li>
          <li>5. User interacts or dismisses (swipe/X button)</li>
        </ol>
      </div>

      <p>
        <strong>Advantages:</strong>
      </p>
      <ul>
        <li>
          <strong>Contextually Adaptive:</strong> Interface changes based on situation
        </li>
        <li>
          <strong>LLM-Orchestrated:</strong> AI decides optimal UI form (form vs. chat vs. widget)
        </li>
        <li>
          <strong>Nothing Predetermined:</strong> Same query can render differently based on context
        </li>
        <li>
          <strong>User Empowered:</strong> User dismisses cards (swipe/X), no auto-hide
        </li>
        <li>
          <strong>Intelligent Surfacing:</strong> Opportunities appear when relevant
        </li>
      </ul>

      <h2>Core Principle: Context-Driven UI Rendering</h2>

      <h3>Example: "Show my budget"</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-border rounded-lg p-4 bg-card">
          <h4 className="text-sm font-semibold mb-2">Context 1: Stable Mid-Month</h4>
          <p className="text-sm text-muted-foreground mb-3">
            User has stable spending, mid-month
          </p>
          <div className="bg-muted/50 rounded p-3 text-xs">
            <strong>LLM Decision:</strong> Simple text response
            <br />
            <br />
            "Your October budget: 660 EUR spent of 1000 EUR (66%). You're on track!"
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h4 className="text-sm font-semibold mb-2">Context 2: Near Limit End-Month</h4>
          <p className="text-sm text-muted-foreground mb-3">User is 95% of budget, 3 days left</p>
          <div className="bg-muted/50 rounded p-3 text-xs">
            <strong>LLM Decision:</strong> OpportunityCard with urgency
            <br />
            <br />
            Shows visual progress bar, breakdown by category, and actions: "View Transactions",
            "Adjust Budget"
          </div>
        </div>
      </div>

      <h2>UI Form Types</h2>

      <h3>1. Opportunity Cards</h3>
      <p>
        <strong>When to use:</strong> Proactive surfacing of time-sensitive information
      </p>
      <ul>
        <li>Budget alerts (95% spent, 3 days left)</li>
        <li>Calendar conflicts (double bookings)</li>
        <li>Travel reminders (flight tomorrow, no hotel)</li>
        <li>Smart suggestions (recurring expense detected)</li>
      </ul>

      <h3>2. Inline Widgets</h3>
      <p>
        <strong>When to use:</strong> Embedded interactive elements in chat
      </p>
      <ul>
        <li>Calendar day view (quick schedule check)</li>
        <li>Budget charts (visual spending overview)</li>
        <li>Time slot selector (meeting scheduling)</li>
        <li>Quick action buttons (confirm/reschedule)</li>
      </ul>

      <h3>3. Dynamic Forms</h3>
      <p>
        <strong>When to use:</strong> Structured data input
      </p>
      <ul>
        <li>Adding new appointment (date, time, location)</li>
        <li>Creating budget (category, amount, period)</li>
        <li>Booking travel (dates, destination, preferences)</li>
        <li>Recording transaction (amount, category, date)</li>
      </ul>

      <h3>4. Conversational Wizards</h3>
      <p>
        <strong>When to use:</strong> Multi-step flows with decisions
      </p>
      <ul>
        <li>Trip planning (destination → dates → flights → hotels)</li>
        <li>Budget setup (categories → limits → alerts)</li>
        <li>Appointment rescheduling (find conflicts → suggest slots → confirm)</li>
        <li>Transaction categorization (unclear category, need details)</li>
      </ul>

      <h2>LLM Decision Factors</h2>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6">
        <h3 className="text-base font-semibold mb-4">The LLM considers:</h3>
        <ul className="space-y-3 text-sm">
          <li>
            <strong>Urgency:</strong> Time-sensitive issues get OpportunityCards
          </li>
          <li>
            <strong>Complexity:</strong> Simple queries get text, complex get widgets/forms
          </li>
          <li>
            <strong>Data Volume:</strong> Large datasets get interactive widgets
          </li>
          <li>
            <strong>User History:</strong> Previous interactions influence form choice
          </li>
          <li>
            <strong>Context:</strong> Time of day, recent activities, upcoming events
          </li>
          <li>
            <strong>Privacy Level:</strong> Sensitive data gets local-only badges
          </li>
        </ul>
      </div>

      <h2>User Control Principles</h2>

      <h3>1. User Dismisses, Never Auto-Hide</h3>
      <p>
        Cards remain visible until user explicitly dismisses them (swipe gesture or X button). No
        automatic hiding.
      </p>

      <h3>2. Swipe Gestures (Mobile)</h3>
      <p>Left or right swipe dismisses OpportunityCards on mobile devices.</p>

      <h3>3. Close Button (Desktop)</h3>
      <p>X button in top-right corner dismisses cards on desktop.</p>

      <h3>4. No Forced Flows</h3>
      <p>
        User can abandon any interaction at any time. Forms can be dismissed, wizards can be
        cancelled.
      </p>

      <h2>Privacy-First Integration</h2>

      <p>Every AI-driven UI element includes privacy indicators:</p>
      <ul>
        <li>
          <strong>🔒 Local:</strong> Data processed locally, never leaves device
        </li>
        <li>
          <strong>☁️ Cloud:</strong> Data synchronized to user's private cloud
        </li>
        <li>
          <strong>🔗 External:</strong> Data from third-party services (Google Calendar, banks)
        </li>
      </ul>

      <h2>Implementation Guidelines</h2>

      <h3>For Developers</h3>
      <ul>
        <li>Don't hardcode UI forms - let LLM decide</li>
        <li>Provide LLM with context: urgency, data complexity, user history</li>
        <li>Implement all UI forms: Cards, Widgets, Forms, Wizards</li>
        <li>Always include privacy badges on rendered UI</li>
        <li>Support both swipe (mobile) and X button (desktop) dismissal</li>
      </ul>

      <h3>For Designers</h3>
      <ul>
        <li>Design flexible components that adapt to different contexts</li>
        <li>Don't create fixed "screens" - create composable UI elements</li>
        <li>Consider how same data looks in Card vs. Widget vs. Chat</li>
        <li>Ensure all UI forms have consistent visual language</li>
        <li>Design for dismissal: clear close/swipe affordances</li>
      </ul>

      <h2>Examples in Practice</h2>

      <h3>Morning Routine</h3>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4 text-sm">
        <p className="mb-2">
          <strong>8:00 AM:</strong> LLM detects morning context
        </p>
        <p className="mb-2">
          <strong>Surfaces:</strong> OpportunityCard with today's calendar (3 meetings detected)
        </p>
        <p>
          <strong>User action:</strong> Taps "View Full Calendar" → navigates to calendar widget
        </p>
      </div>

      <h3>Budget Warning</h3>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4 text-sm">
        <p className="mb-2">
          <strong>Context:</strong> 95% of food budget spent, 3 days left in month
        </p>
        <p className="mb-2">
          <strong>Surfaces:</strong> OpportunityCard with "urgent" styling, progress bar, and
          actions
        </p>
        <p>
          <strong>User action:</strong> Taps "View Transactions" → opens inline widget showing
          recent food expenses
        </p>
      </div>

      <h3>Quick Calendar Check</h3>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4 text-sm">
        <p className="mb-2">
          <strong>Query:</strong> "What's my schedule today?"
        </p>
        <p className="mb-2">
          <strong>LLM Decision:</strong> Inline widget (not OpportunityCard - not urgent)
        </p>
        <p>
          <strong>Rendered:</strong> Compact calendar widget embedded in chat showing today's 3
          appointments
        </p>
      </div>

      <h2>Key Takeaways</h2>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <ul className="space-y-2 text-sm">
          <li>✅ LLM decides UI form based on context</li>
          <li>✅ Same query can render differently based on situation</li>
          <li>✅ User controls visibility (dismiss, never auto-hide)</li>
          <li>✅ Privacy indicators on all AI-driven UI</li>
          <li>✅ Contextual adaptation over predetermined flows</li>
          <li>✅ Flexible components over fixed screens</li>
        </ul>
      </div>
    </div>
  );
}
