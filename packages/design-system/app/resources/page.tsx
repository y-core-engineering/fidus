'use client';

import { Link } from '@fidus/ui';

interface Resource {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export default function ResourcesOverviewPage() {
  const resources: Resource[] = [
    {
      name: 'Contributing',
      slug: 'contributing',
      description: 'Learn how to contribute to the Fidus Design System',
      icon: '🤝',
    },
    {
      name: 'Code Playground',
      slug: 'code-playground',
      description: 'Interactive environment to experiment with components',
      icon: '🎮',
    },
    {
      name: 'GitHub',
      slug: 'github',
      description: 'View source code, report issues, and contribute',
      icon: '💻',
    },
    {
      name: 'Support',
      slug: 'support',
      description: 'Get help and connect with the community',
      icon: '💬',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Resources</h1>
      <p className="lead">
        Tools, guides, and community resources to help you get the most out of the Fidus Design
        System.
      </p>

      <div className="not-prose mt-2xl">
        <div className="grid sm:grid-cols-2 gap-lg">
          {resources.map((resource) => (
            <Link
              key={resource.slug}
              href={`/resources/${resource.slug}`}
              className="group block p-xl border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-normal no-underline"
            >
              <div className="text-4xl mb-md">{resource.icon}</div>
              <h3 className="text-xl font-semibold mb-sm group-hover:text-primary transition-colors duration-normal">
                {resource.name}
              </h3>
              <p className="text-sm text-muted-foreground">{resource.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-2xl pt-2xl border-t border-border">
        <h2>Quick Links</h2>
        <div className="not-prose my-lg">
          <ul className="space-y-md">
            <li>
              <Link
                variant="standalone"
                href="https://github.com/y-core-engineering/fidus"
                external
                showIcon
              >
                Fidus on GitHub
              </Link>
            </li>
            <li>
              <Link
                variant="standalone"
                href="https://www.npmjs.com/package/@fidus/ui"
                external
                showIcon
              >
                @fidus/ui on npm
              </Link>
            </li>
            <li>
              <Link variant="standalone" href="/getting-started/for-developers">
                Developer documentation
              </Link>
            </li>
            <li>
              <Link variant="standalone" href="/getting-started/for-designers">
                Designer documentation
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-2xl">
        <h2>Community</h2>
        <p>
          Join our community to ask questions, share feedback, and connect with other developers
          and designers using the Fidus Design System.
        </p>
        <div className="not-prose my-lg">
          <ul className="space-y-md">
            <li>
              <Link
                variant="standalone"
                href="https://github.com/y-core-engineering/fidus/discussions"
                external
                showIcon
              >
                GitHub Discussions
              </Link>
            </li>
            <li>
              <Link
                variant="standalone"
                href="https://github.com/y-core-engineering/fidus/issues"
                external
                showIcon
              >
                Report an issue
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
