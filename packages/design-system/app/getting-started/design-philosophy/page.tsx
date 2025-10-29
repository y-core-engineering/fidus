import Link from 'next/link';

export default function DesignPhilosophyPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Design Philosophy</h1>
        <p className="text-xl text-gray-600">
          Core principles that guide Fidus Design System and make it unique
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          Fidus Design System is built on a foundation of principles that prioritize user privacy,
          context-awareness, and adaptive interfaces. Unlike traditional design systems that prescribe
          fixed layouts and predetermined flows, Fidus embraces an AI-Driven UI paradigm where the
          interface adapts to user needs in real-time.
        </p>
        <p className="mb-4">
          This philosophy influences every aspect of the design system, from component design to
          interaction patterns to documentation style.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">AI-Driven UI Paradigm</h2>

        <p className="mb-4">
          The cornerstone of Fidus Design System is the AI-Driven UI Paradigm. This represents a
          fundamental shift from traditional interface design.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Core Concept</h3>
          <p className="mb-3">
            The UI is NOT predetermined. Instead:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>The LLM analyzes user context (time, location, history, intent)</li>
            <li>The LLM decides which UI form to render (chat, form, widget, wizard)</li>
            <li>The same user query can produce different UIs in different contexts</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Traditional UI vs AI-Driven UI</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6 bg-red-50">
              <h4 className="font-semibold mb-3 text-red-900">Traditional Approach</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Fixed screens (Calendar Screen, Finance Screen)</li>
                <li>Predetermined routes and navigation</li>
                <li>Static dashboard with permanent widgets</li>
                <li>Hardcoded "if X then Y" logic</li>
                <li>Auto-hiding notifications</li>
                <li>One-size-fits-all forms</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6 bg-green-50">
              <h4 className="font-semibold mb-3 text-green-900">AI-Driven Approach</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Contextual widgets and cards</li>
                <li>Context-based rendering</li>
                <li>Dynamic Opportunity Surface</li>
                <li>LLM-driven "based on context" logic</li>
                <li>User-dismissed content</li>
                <li>Adaptive forms (wizard, quick-entry, chat)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">What This Means for Design</h3>
          <p className="mb-3">When designing for Fidus:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Design components, not screens</li>
            <li>Think in terms of context and relevance</li>
            <li>Show examples of possible presentations</li>
            <li>Allow for multiple rendering modes</li>
            <li>Let the LLM decide what to show when</li>
          </ul>
        </div>

        <Link href="/foundations/ai-driven-ui" className="text-blue-600 hover:underline">
          Read full AI-Driven UI documentation →
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Privacy-First Design</h2>

        <p className="mb-4">
          Privacy is not an afterthought in Fidus. It is a core design principle that influences
          every decision we make.
        </p>

        <div className="space-y-6">
          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Data Stays Local</h3>
            <p className="text-gray-700">
              Whenever possible, data is processed and stored locally on the user's device. Only
              when absolutely necessary is data sent to servers, and always with encryption.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Encryption by Default</h3>
            <p className="text-gray-700">
              All sensitive data is encrypted at rest and in transit. Users do not need to enable
              encryption; it is the default state.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Granular Control</h3>
            <p className="text-gray-700">
              Users have fine-grained control over what data is collected, how it is used, and when
              it is shared. Privacy settings are prominent and easy to understand.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Transparent Processing</h3>
            <p className="text-gray-700">
              Users can see what data the AI is using to make decisions. Processing is visible and
              explainable, not hidden in a black box.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">No Dark Patterns</h3>
            <p className="text-gray-700">
              We never use design tricks to coerce users into sharing more data. Consent is explicit,
              informed, and easy to withdraw.
            </p>
          </div>
        </div>

        <Link href="/foundations/privacy-ux" className="text-blue-600 hover:underline mt-6 inline-block">
          Read Privacy UX guidelines →
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Opportunity Surface Concept</h2>

        <p className="mb-4">
          Instead of a traditional dashboard with fixed widgets, Fidus presents an Opportunity Surface
          where relevant cards appear dynamically based on user context.
        </p>

        <div className="bg-gray-50 border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">How It Works</h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              <strong>Context Analysis:</strong> The LLM analyzes current time, location, calendar,
              recent activities, and user preferences
            </li>
            <li>
              <strong>Opportunity Scoring:</strong> Potential opportunities are scored based on
              relevance and urgency
            </li>
            <li>
              <strong>Dynamic Rendering:</strong> High-scoring opportunities are rendered as cards
              on the Opportunity Surface
            </li>
            <li>
              <strong>User Control:</strong> Users can dismiss cards, snooze them, or take action
            </li>
            <li>
              <strong>Learning:</strong> The system learns from user interactions to improve future
              recommendations
            </li>
          </ol>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Example Opportunities</h3>
          <p className="mb-3">
            The Opportunity Surface might show cards like:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Upcoming appointment with suggested preparation tasks</li>
            <li>Budget alert when approaching spending limit</li>
            <li>Travel recommendation based on calendar gap and weather</li>
            <li>Bill payment reminder three days before due date</li>
            <li>Recipe suggestion based on ingredients expiring soon</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Key Difference</h3>
          <p>
            Unlike traditional notifications that auto-dismiss or widgets that are always visible,
            Opportunity Cards remain until the user explicitly dismisses them. This ensures users
            never miss important information while maintaining full control.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">User Control Principles</h2>

        <p className="mb-4">
          User control is paramount in Fidus. We believe users should always be in charge of their
          experience.
        </p>

        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Explicit Actions</h3>
            <p className="text-gray-700">
              Every action requires explicit user consent. No automatic changes to user data or
              settings without permission.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Always Dismissible</h3>
            <p className="text-gray-700">
              Every card, widget, or overlay can be dismissed by the user. We never force content
              to stay visible or use attention-grabbing animations.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">No Auto-Hide</h3>
            <p className="text-gray-700">
              We never use timers to automatically hide important information. Users decide when
              they are done with content.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Undo Actions</h3>
            <p className="text-gray-700">
              Whenever possible, actions can be undone. This reduces anxiety and encourages
              exploration.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Clear Communication</h3>
            <p className="text-gray-700">
              We use clear, plain language to explain what actions will do and what consequences
              they have. No confusing jargon or technical terms.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Context-Aware Components</h2>

        <p className="mb-4">
          Components in Fidus are designed to understand and adapt to their context.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">What is Context?</h3>
          <p className="mb-3">Context includes:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Time of day, day of week, season</li>
            <li>User's current location</li>
            <li>Current activity and calendar state</li>
            <li>Recent user actions and history</li>
            <li>User expertise level</li>
            <li>Device type and capabilities</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Adaptive Behavior Example</h3>
          <p className="mb-3">A budget widget might adapt its presentation based on context:</p>
          <div className="bg-gray-50 border rounded-lg p-6">
            <ul className="space-y-3 text-sm text-gray-700">
              <li>
                <strong>Morning planning session:</strong> Show detailed breakdown with recommendations
                for the day ahead
              </li>
              <li>
                <strong>During work day:</strong> Show simple progress bar with current spending
              </li>
              <li>
                <strong>Near budget limit:</strong> Show prominent warning with actionable suggestions
              </li>
              <li>
                <strong>End of month:</strong> Show summary and comparison to previous months
              </li>
              <li>
                <strong>On mobile:</strong> Show compact view optimized for quick glance
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Design Implication</h3>
          <p>
            When designing components, think about different contexts where they might appear and
            how they should adapt. Design for flexibility rather than prescribing a single
            presentation mode.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Examples Over Rules</h2>

        <p className="mb-4">
          Because Fidus uses AI to determine UI presentation, we cannot prescribe exact rules for
          when components appear. Instead, we provide examples of possible presentations.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Language Matters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-red-900">Avoid</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>"Always shows weather in the morning"</li>
                  <li>"Calendar widget appears on dashboard"</li>
                  <li>"Budget alert triggers at 80%"</li>
                  <li>"Form automatically switches to wizard"</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-green-900">Use</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>"Might show weather during morning routine"</li>
                  <li>"Calendar widget could appear when relevant"</li>
                  <li>"Budget alert may appear when nearing limit"</li>
                  <li>"Form might adapt to wizard for beginners"</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Documentation Style</h3>
            <p className="mb-3">
              In documentation, show concrete examples of when a component might appear, but avoid
              stating absolute rules:
            </p>
            <div className="bg-gray-50 border rounded-lg p-6">
              <p className="mb-3">
                <strong>Example:</strong> "The travel planning card might appear on the Opportunity
                Surface when:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-4">
                <li>The user has a gap in their calendar longer than 3 days</li>
                <li>Weather conditions are favorable at potential destinations</li>
                <li>The user has shown interest in travel in the past</li>
                <li>Budget allows for discretionary spending</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                Note: The LLM weighs these factors and makes a contextual decision. This is not
                a deterministic rule.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Implementation Guidelines</h2>

        <p className="mb-4">
          These principles translate into specific implementation practices:
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Component Design</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Create reusable components, not page-specific layouts</li>
              <li>Support multiple variants and presentation modes</li>
              <li>Accept context as props and adapt rendering</li>
              <li>Include dismissal controls</li>
              <li>Make all states visible and accessible</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">2. State Management</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Store user preferences and dismissals</li>
              <li>Track context changes and trigger re-evaluation</li>
              <li>Maintain user control over all state changes</li>
              <li>Provide undo/redo for state modifications</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">3. AI Integration</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Pass rich context to LLM for decision-making</li>
              <li>Render based on LLM response, not hardcoded logic</li>
              <li>Handle multiple possible UI forms gracefully</li>
              <li>Log decisions for learning and improvement</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">4. Privacy Implementation</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Process data locally whenever possible</li>
              <li>Encrypt sensitive data before storage or transmission</li>
              <li>Provide clear privacy controls in UI</li>
              <li>Allow users to view and delete their data</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Further Reading</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/foundations/ai-driven-ui"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">AI-Driven UI Details</h3>
            <p className="text-sm text-gray-600">
              Deep dive into the AI-Driven UI paradigm and implementation
            </p>
          </Link>

          <Link
            href="/foundations/privacy-ux"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Privacy UX Guidelines</h3>
            <p className="text-sm text-gray-600">
              Comprehensive guide to privacy-first design patterns
            </p>
          </Link>

          <Link
            href="/patterns/form-validation"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Design Patterns</h3>
            <p className="text-sm text-gray-600">
              Common patterns showing philosophy in practice
            </p>
          </Link>

          <Link
            href="/components/card"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Component Examples</h3>
            <p className="text-sm text-gray-600">
              See components implementing these principles
            </p>
          </Link>
        </div>
      </section>

      <section className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">Questions or Feedback?</h2>
        <p className="mb-4">
          These principles are living guidelines that evolve as we learn. If you have questions,
          suggestions, or want to discuss the philosophy, we welcome your input.
        </p>
        <Link href="/getting-started/contributing" className="text-blue-600 hover:underline">
          Join the conversation →
        </Link>
      </section>
    </div>
  );
}
