'use client';

import { Link } from '@fidus/ui/link';;

interface ArchitectureDoc {
  name: string;
  slug: string;
  description: string;
  category: string;
}

export default function ArchitectureOverviewPage() {
  const docs: ArchitectureDoc[] = [
    {
      name: 'UI Decision Layer',
      slug: 'ui-decision-layer',
      description: 'How the AI determines which UI components to render based on context',
      category: 'Core Architecture',
    },
    {
      name: 'Opportunity Surface Service',
      slug: 'opportunity-surface-service',
      description: 'Backend service that generates and prioritizes AI-driven opportunities',
      category: 'Core Architecture',
    },
    {
      name: 'Component Registry',
      slug: 'component-registry',
      description: 'Runtime registry of available UI components and their capabilities',
      category: 'Implementation',
    },
    {
      name: 'API Response Schema',
      slug: 'api-response-schema',
      description: 'Standardized schema for AI-driven UI responses from the backend',
      category: 'Implementation',
    },
    {
      name: 'Frontend Architecture',
      slug: 'frontend-architecture',
      description: 'Overall frontend architecture and data flow patterns',
      category: 'Implementation',
    },
  ];

  const coreArchitectureDocs = docs.filter((doc) => doc.category === 'Core Architecture');
  const implementationDocs = docs.filter((doc) => doc.category === 'Implementation');

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Architecture</h1>
      <p className="lead">
        Technical architecture documentation for the Fidus Design System, with a focus on our
        AI-driven UI paradigm and implementation patterns.
      </p>

      <div className="not-prose mt-2xl space-y-2xl">
        <section>
          <h2 className="text-2xl font-bold mb-sm">Core Architecture</h2>
          <p className="text-muted-foreground mb-lg">
            Foundational architectural concepts and patterns
          </p>
          <div className="grid sm:grid-cols-2 gap-md">
            {coreArchitectureDocs.map((doc) => (
              <Link
                key={doc.slug}
                href={`/architecture/${doc.slug}`}
                className="group block p-lg border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-normal no-underline"
              >
                <h3 className="text-lg font-semibold mb-sm group-hover:text-primary transition-colors duration-normal">
                  {doc.name}
                </h3>
                <p className="text-sm text-muted-foreground">{doc.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-sm">Implementation</h2>
          <p className="text-muted-foreground mb-lg">
            Implementation details and technical specifications
          </p>
          <div className="grid sm:grid-cols-2 gap-md">
            {implementationDocs.map((doc) => (
              <Link
                key={doc.slug}
                href={`/architecture/${doc.slug}`}
                className="group block p-lg border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-normal no-underline"
              >
                <h3 className="text-lg font-semibold mb-sm group-hover:text-primary transition-colors duration-normal">
                  {doc.name}
                </h3>
                <p className="text-sm text-muted-foreground">{doc.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-2xl pt-2xl border-t border-border">
        <h2>AI-Driven UI Paradigm</h2>
        <p>
          The Fidus Design System is built around an AI-driven UI paradigm where the interface
          adapts dynamically to user context, goals, and behavior. Instead of fixed screens and
          routes, the system uses context-aware components that are selected and configured at
          runtime.
        </p>
        <div className="not-prose my-lg">
          <Link variant="standalone" href="/foundations/ai-driven-ui">
            Learn more about AI-Driven UI →
          </Link>
        </div>
      </div>

      <div className="mt-2xl">
        <h2>Key Architectural Principles</h2>
        <div className="not-prose space-y-lg my-lg">
          <div>
            <h3 className="text-lg font-semibold mb-sm">Context-Aware Rendering</h3>
            <p className="text-muted-foreground">
              Components are selected and configured based on user context (time, location,
              activity, history) rather than predefined routes.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-sm">Component Registry</h3>
            <p className="text-muted-foreground">
              A runtime registry maintains available components and their capabilities, allowing
              the AI to select appropriate UI elements.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-sm">Opportunity-Driven</h3>
            <p className="text-muted-foreground">
              The backend generates contextual opportunities that drive UI suggestions and
              proactive assistance.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-sm">Privacy-First</h3>
            <p className="text-muted-foreground">
              All architectural decisions prioritize user privacy, with minimal data collection
              and transparent processing.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2xl">
        <h2>Related Documentation</h2>
        <div className="not-prose my-lg">
          <ul className="space-y-md">
            <li>
              <Link variant="standalone" href="/foundations/ai-driven-ui">
                AI-Driven UI Foundation →
              </Link>
            </li>
            <li>
              <Link variant="standalone" href="/patterns/opportunity-surface">
                Opportunity Surface Pattern →
              </Link>
            </li>
            <li>
              <Link variant="standalone" href="/getting-started/for-developers">
                Developer Guide →
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
