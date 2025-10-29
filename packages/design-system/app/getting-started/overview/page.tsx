'use client';

import Link from 'next/link';

export default function OverviewPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Fidus Design System</h1>
        <p className="text-xl text-gray-600">
          A privacy-first, AI-driven component library for building contextual user experiences
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">What is Fidus Design System?</h2>
        <p className="mb-4">
          Fidus Design System is a comprehensive collection of reusable components, patterns, and guidelines
          for building the Fidus personal assistant application. It embodies our core principles of privacy,
          user control, and context-aware interactions.
        </p>
        <p className="mb-4">
          Unlike traditional design systems, Fidus embraces an AI-Driven UI paradigm where the interface
          adapts to user context, intent, and expertise level. Components are designed to be flexible
          and composable, supporting multiple presentation modes determined at runtime.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Principles</h2>

        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-lg font-semibold mb-2">Privacy-First Design</h3>
            <p>
              Every component and pattern prioritizes user privacy. Data stays on device when possible,
              encryption is the default, and users have complete control over their information.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-lg font-semibold mb-2">AI-Driven UI</h3>
            <p>
              The UI adapts to context rather than following predetermined flows. The same user query
              can produce different interfaces based on time, location, user expertise, and intent.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-lg font-semibold mb-2">User Control</h3>
            <p>
              Users explicitly control their experience. No auto-hiding elements, no forced workflows.
              Every action requires user consent, and dismissal is always available.
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="text-lg font-semibold mb-2">Context-Aware Components</h3>
            <p>
              Components understand their context and adapt their behavior accordingly. A calendar widget
              can appear in chat, as a dashboard card, or in a dedicated view based on user needs.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Component Categories</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Layout</h3>
            <p className="text-sm text-gray-600 mb-3">
              Structural components for organizing content
            </p>
            <Link href="/components/container" className="text-blue-600 hover:underline text-sm">
              View Layout Components →
            </Link>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Forms</h3>
            <p className="text-sm text-gray-600 mb-3">
              Input components with validation and accessibility
            </p>
            <Link href="/components/input" className="text-blue-600 hover:underline text-sm">
              View Form Components →
            </Link>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Data Display</h3>
            <p className="text-sm text-gray-600 mb-3">
              Components for presenting information
            </p>
            <Link href="/components/table" className="text-blue-600 hover:underline text-sm">
              View Data Components →
            </Link>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Feedback</h3>
            <p className="text-sm text-gray-600 mb-3">
              Alert, toast, and progress indicators
            </p>
            <Link href="/components/alert" className="text-blue-600 hover:underline text-sm">
              View Feedback Components →
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>

        <div className="bg-gray-50 border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">For Developers</h3>
          <p className="mb-4">
            Install the component library and start building:
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto mb-4">
            <code>npm install @fidus/ui</code>
          </pre>
          <Link href="/getting-started/for-developers" className="text-blue-600 hover:underline">
            Full Developer Guide →
          </Link>
        </div>

        <div className="bg-gray-50 border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">For Designers</h3>
          <p className="mb-4">
            Learn about design principles and component anatomy:
          </p>
          <Link href="/getting-started/for-designers" className="text-blue-600 hover:underline">
            Full Designer Guide →
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Core Concepts</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Opportunity Surface</h3>
            <p className="text-gray-600 mb-2">
              Rather than fixed dashboards, Fidus presents an Opportunity Surface where relevant cards
              appear based on user context. The LLM decides what to show, users control dismissal.
            </p>
            <Link href="/getting-started/design-philosophy" className="text-blue-600 hover:underline text-sm">
              Learn more about our philosophy →
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Dynamic Forms</h3>
            <p className="text-gray-600 mb-2">
              Forms adapt to user expertise. Beginners get wizards, experts get quick-entry forms,
              and everyone can use conversational input.
            </p>
            <Link href="/patterns/form-validation" className="text-blue-600 hover:underline text-sm">
              View form patterns →
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Context-Aware Rendering</h3>
            <p className="text-gray-600 mb-2">
              Components receive context and adapt their presentation. A budget widget might show
              a warning in morning planning sessions but a simple progress bar during the day.
            </p>
            <Link href="/foundations/ai-driven-ui" className="text-blue-600 hover:underline text-sm">
              Read about AI-Driven UI →
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/getting-started/for-developers"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Start Building</h3>
            <p className="text-sm text-gray-600">
              Install the library and create your first component
            </p>
          </Link>

          <Link
            href="/getting-started/design-philosophy"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Understand the Philosophy</h3>
            <p className="text-sm text-gray-600">
              Learn about AI-Driven UI and privacy-first design
            </p>
          </Link>

          <Link
            href="/components/button"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Explore Components</h3>
            <p className="text-sm text-gray-600">
              Browse the complete component library
            </p>
          </Link>
        </div>
      </section>

      <section className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">Contributing</h2>
        <p className="mb-4">
          Fidus Design System is open for community contributions. Whether you are fixing bugs,
          adding components, or improving documentation, we welcome your input.
        </p>
        <Link href="/getting-started/contributing" className="text-blue-600 hover:underline">
          Read the Contributing Guide →
        </Link>
      </section>
    </div>
  );
}
