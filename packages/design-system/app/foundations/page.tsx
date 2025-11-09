'use client';

import { Link } from '@fidus/ui';

interface Foundation {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export default function FoundationsOverviewPage() {
  const foundations: Foundation[] = [
    {
      name: 'AI-Driven UI',
      slug: 'ai-driven-ui',
      description: 'Core principles for context-aware, dynamic interfaces that adapt to user needs',
      icon: '🤖',
    },
    {
      name: 'Privacy UX',
      slug: 'privacy-ux',
      description: 'Privacy-first design patterns that build trust and transparency',
      icon: '🔒',
    },
    {
      name: 'Accessibility',
      slug: 'accessibility',
      description: 'Guidelines for creating inclusive experiences for all users',
      icon: '♿️',
    },
    {
      name: 'Colors',
      slug: 'colors',
      description: 'Color palette, semantic tokens, and usage guidelines',
      icon: '🎨',
    },
    {
      name: 'Typography',
      slug: 'typography',
      description: 'Type scale, font families, and text hierarchy',
      icon: '📝',
    },
    {
      name: 'Spacing',
      slug: 'spacing',
      description: 'Consistent spacing system for layout and components',
      icon: '📏',
    },
    {
      name: 'Icons',
      slug: 'icons',
      description: 'Icon library, usage guidelines, and best practices',
      icon: '✨',
    },
    {
      name: 'Motion',
      slug: 'motion',
      description: 'Animation principles and timing guidelines',
      icon: '🎬',
    },
    {
      name: 'Responsive Design',
      slug: 'responsive-design',
      description: 'Breakpoints and responsive layout strategies',
      icon: '📱',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Foundations</h1>
      <p className="lead">
        The core principles and design tokens that form the foundation of the Fidus Design System.
        These guidelines ensure consistency, accessibility, and a cohesive user experience across
        all products.
      </p>

      <div className="not-prose mt-2xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          {foundations.map((foundation) => (
            <Link
              key={foundation.slug}
              href={`/foundations/${foundation.slug}`}
              className="group block p-xl border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-normal no-underline"
            >
              <div className="text-4xl mb-md">{foundation.icon}</div>
              <h3 className="text-xl font-semibold mb-sm group-hover:text-primary transition-colors duration-normal">
                {foundation.name}
              </h3>
              <p className="text-sm text-muted-foreground">{foundation.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-2xl pt-2xl border-t border-border">
        <h2>Design Principles</h2>
        <div className="not-prose space-y-lg my-lg">
          <div>
            <h3 className="text-lg font-semibold mb-sm">Privacy-First</h3>
            <p className="text-muted-foreground">
              Every design decision prioritizes user privacy and data protection. We make privacy
              the default, not an afterthought.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-sm">AI-Driven</h3>
            <p className="text-muted-foreground">
              Our interfaces adapt to user context and behavior, providing proactive assistance
              without being intrusive.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-sm">Accessible by Default</h3>
            <p className="text-muted-foreground">
              We build inclusive experiences that work for everyone, regardless of ability or
              device.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-sm">Consistent & Predictable</h3>
            <p className="text-muted-foreground">
              Users should feel confident and in control. Consistent patterns reduce cognitive
              load and build trust.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2xl">
        <h2>Related Resources</h2>
        <div className="not-prose my-lg">
          <ul className="space-y-md">
            <li>
              <Link variant="standalone" href="/tokens">
                View design tokens →
              </Link>
            </li>
            <li>
              <Link variant="standalone" href="/getting-started/for-designers">
                Getting started for designers →
              </Link>
            </li>
            <li>
              <Link variant="standalone" href="/patterns">
                Browse patterns →
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
