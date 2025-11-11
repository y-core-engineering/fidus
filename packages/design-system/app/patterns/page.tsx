'use client';

import { Link } from '@fidus/ui/link';;

interface PatternCategory {
  title: string;
  description: string;
  patterns: Array<{
    name: string;
    slug: string;
    description: string;
  }>;
}

export default function PatternsOverviewPage() {
  const categories: PatternCategory[] = [
    {
      title: 'AI-Driven Patterns',
      description: 'Patterns specific to AI-powered interactions',
      patterns: [
        {
          name: 'Opportunity Surface',
          slug: 'opportunity-surface',
          description: 'Dynamic dashboard with AI-suggested actions and proactive assistance',
        },
      ],
    },
    {
      title: 'User Feedback',
      description: 'Patterns for different application states',
      patterns: [
        {
          name: 'Empty States',
          slug: 'empty-states',
          description: 'Guide users when no content is available',
        },
        {
          name: 'Error States',
          slug: 'error-states',
          description: 'Handle and communicate errors gracefully',
        },
        {
          name: 'Loading States',
          slug: 'loading-states',
          description: 'Provide feedback during asynchronous operations',
        },
        {
          name: 'Success Confirmation',
          slug: 'success-confirmation',
          description: 'Confirm successful actions to users',
        },
      ],
    },
    {
      title: 'User Flows',
      description: 'Common user interaction patterns',
      patterns: [
        {
          name: 'Onboarding',
          slug: 'onboarding',
          description: 'Welcome and guide new users through setup',
        },
        {
          name: 'Form Validation',
          slug: 'form-validation',
          description: 'Validate user input and provide helpful feedback',
        },
        {
          name: 'Search & Filtering',
          slug: 'search-filtering',
          description: 'Help users find and filter content',
        },
        {
          name: 'Settings',
          slug: 'settings',
          description: 'Allow users to configure preferences and account settings',
        },
      ],
    },
    {
      title: 'Advanced Patterns',
      description: 'Complex interaction patterns',
      patterns: [
        {
          name: 'Multi-Tenancy',
          slug: 'multi-tenancy',
          description: 'Handle multiple workspaces or organizations',
        },
      ],
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Patterns</h1>
      <p className="lead">
        Reusable solutions to common design problems. These patterns combine components and
        foundations to create consistent user experiences across the Fidus ecosystem.
      </p>

      <div className="not-prose space-y-2xl mt-2xl">
        {categories.map((category) => (
          <section key={category.title}>
            <h2 className="text-2xl font-bold mb-sm">{category.title}</h2>
            <p className="text-muted-foreground mb-lg">{category.description}</p>
            <div className="grid sm:grid-cols-2 gap-md">
              {category.patterns.map((pattern) => (
                <Link
                  key={pattern.slug}
                  href={`/patterns/${pattern.slug}`}
                  className="group block p-lg border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-normal no-underline"
                >
                  <h3 className="text-lg font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
                    {pattern.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{pattern.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-2xl pt-2xl border-t border-border">
        <h2>Pattern Guidelines</h2>
        <div className="not-prose space-y-lg my-lg">
          <div>
            <h3 className="text-lg font-semibold mb-sm">Context-Aware</h3>
            <p className="text-muted-foreground">
              Patterns should adapt to user context, including time, location, activity, and
              historical behavior.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-sm">Privacy-Preserving</h3>
            <p className="text-muted-foreground">
              Always minimize data collection and clearly communicate how user data is used.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-sm">Accessible</h3>
            <p className="text-muted-foreground">
              Ensure all patterns work with assistive technologies and follow WCAG guidelines.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-sm">Composable</h3>
            <p className="text-muted-foreground">
              Patterns should be built from our component library and be easily customizable.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2xl">
        <h2>Related Resources</h2>
        <div className="not-prose my-lg">
          <ul className="space-y-md">
            <li>
              <Link variant="standalone" href="/components">
                Browse components →
              </Link>
            </li>
            <li>
              <Link variant="standalone" href="/foundations">
                View foundations →
              </Link>
            </li>
            <li>
              <Link variant="standalone" href="/getting-started/for-developers">
                Implementation guide →
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
