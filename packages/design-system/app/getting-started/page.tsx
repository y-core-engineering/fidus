'use client';

import { Link } from '@fidus/ui/link';;

interface GettingStartedPage {
  name: string;
  slug: string;
  description: string;
  audience: string;
}

export default function GettingStartedOverviewPage() {
  const pages: GettingStartedPage[] = [
    {
      name: 'Overview',
      slug: 'overview',
      description: 'Introduction to the Fidus Design System and its core concepts',
      audience: 'Everyone',
    },
    {
      name: 'For Developers',
      slug: 'for-developers',
      description: 'Installation, setup, and implementation guides for developers',
      audience: 'Developers',
    },
    {
      name: 'For Designers',
      slug: 'for-designers',
      description: 'Design resources, Figma files, and design guidelines',
      audience: 'Designers',
    },
    {
      name: 'Design Philosophy',
      slug: 'design-philosophy',
      description: 'Core principles and values that guide the Fidus Design System',
      audience: 'Everyone',
    },
    {
      name: 'Contributing',
      slug: 'contributing',
      description: 'How to contribute components, patterns, and improvements',
      audience: 'Contributors',
    },
    {
      name: 'Releases',
      slug: 'releases',
      description: 'Release notes, changelog, and version history',
      audience: 'Everyone',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Getting Started</h1>
      <p className="lead">
        Welcome to the Fidus Design System! Whether you're a developer, designer, or contributor,
        we have resources to help you get started quickly.
      </p>

      <div className="not-prose mt-2xl">
        <div className="grid sm:grid-cols-2 gap-lg">
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={`/getting-started/${page.slug}`}
              className="group block p-lg border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-normal no-underline"
            >
              <div className="flex items-start justify-between mb-sm">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-normal">
                  {page.name}
                </h3>
                <span className="text-xs px-sm py-xs bg-muted rounded-full shrink-0 ml-sm">
                  {page.audience}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{page.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-2xl pt-2xl border-t border-border">
        <h2>Quick Start</h2>
        <div className="not-prose space-y-lg my-lg">
          <div>
            <h3 className="text-lg font-semibold mb-sm">Developers</h3>
            <p className="text-muted-foreground mb-md">
              Install the UI package and start building:
            </p>
            <div className="bg-muted p-md rounded-lg font-mono text-sm">
              npm install @fidus/ui
            </div>
            <div className="mt-md">
              <Link variant="standalone" href="/getting-started/for-developers">
                View full developer guide →
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-sm">Designers</h3>
            <p className="text-muted-foreground mb-md">
              Get started with our Figma design resources:
            </p>
            <div className="mt-md">
              <Link variant="standalone" href="/getting-started/for-designers">
                View designer resources →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2xl">
        <h2>Explore the System</h2>
        <div className="not-prose my-lg">
          <ul className="space-y-md">
            <li>
              <Link variant="standalone" href="/foundations">
                Foundations →
              </Link>
              <p className="text-sm text-muted-foreground mt-xs">
                Core principles, colors, typography, and spacing
              </p>
            </li>
            <li>
              <Link variant="standalone" href="/components">
                Components →
              </Link>
              <p className="text-sm text-muted-foreground mt-xs">
                Reusable UI components with examples and code
              </p>
            </li>
            <li>
              <Link variant="standalone" href="/patterns">
                Patterns →
              </Link>
              <p className="text-sm text-muted-foreground mt-xs">
                Common design patterns and user flows
              </p>
            </li>
            <li>
              <Link variant="standalone" href="/tokens">
                Design Tokens →
              </Link>
              <p className="text-sm text-muted-foreground mt-xs">
                Design decisions as code
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
