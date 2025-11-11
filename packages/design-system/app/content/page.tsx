'use client';

import { Link } from '@fidus/ui/link';;

interface ContentDoc {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export default function ContentOverviewPage() {
  const docs: ContentDoc[] = [
    {
      name: 'Writing for Privacy',
      slug: 'writing-for-privacy',
      description: 'Guidelines for writing UX copy that respects user privacy and builds trust',
      icon: '🔒',
    },
    {
      name: 'Glossary',
      slug: 'glossary',
      description: 'Common terms and definitions used throughout the Fidus ecosystem',
      icon: '📖',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Content Guidelines</h1>
      <p className="lead">
        Guidelines and resources for writing clear, helpful, and privacy-respecting content in
        the Fidus ecosystem.
      </p>

      <div className="not-prose mt-2xl">
        <div className="grid sm:grid-cols-2 gap-lg">
          {docs.map((doc) => (
            <Link
              key={doc.slug}
              href={`/content/${doc.slug}`}
              className="group block p-xl border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-normal no-underline"
            >
              <div className="text-4xl mb-md">{doc.icon}</div>
              <h3 className="text-xl font-semibold mb-sm group-hover:text-primary transition-colors duration-normal">
                {doc.name}
              </h3>
              <p className="text-sm text-muted-foreground">{doc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-2xl pt-2xl border-t border-border">
        <h2>Content Principles</h2>
        <div className="not-prose space-y-lg my-lg">
          <div>
            <h3 className="text-lg font-semibold mb-sm">Privacy-First Language</h3>
            <p className="text-muted-foreground">
              Use language that builds trust and clearly communicates how user data is handled.
              Avoid vague terms and be explicit about privacy controls.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-sm">Clear and Concise</h3>
            <p className="text-muted-foreground">
              Write in plain language that's easy to understand. Avoid jargon, technical terms,
              and unnecessary complexity.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-sm">Helpful and Informative</h3>
            <p className="text-muted-foreground">
              Provide context and guidance that helps users make informed decisions. Explain the
              "why" behind features and recommendations.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-sm">Respectful and Inclusive</h3>
            <p className="text-muted-foreground">
              Use inclusive language that respects all users. Avoid assumptions about technical
              knowledge, abilities, or background.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2xl">
        <h2>Voice and Tone</h2>
        <p>
          The Fidus voice is friendly, professional, and trustworthy. We're helpful without being
          condescending, clear without being cold, and confident without being arrogant.
        </p>
        <div className="not-prose my-lg">
          <div className="grid sm:grid-cols-2 gap-lg">
            <div className="p-lg border-2 border-success rounded-lg">
              <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
                <span className="text-2xl">✓</span> Do
              </h3>
              <ul className="space-y-sm text-sm">
                <li className="flex gap-sm">
                  <span className="text-success shrink-0">•</span>
                  <span>Use active voice and direct language</span>
                </li>
                <li className="flex gap-sm">
                  <span className="text-success shrink-0">•</span>
                  <span>Explain technical concepts in simple terms</span>
                </li>
                <li className="flex gap-sm">
                  <span className="text-success shrink-0">•</span>
                  <span>Be transparent about data usage and privacy</span>
                </li>
                <li className="flex gap-sm">
                  <span className="text-success shrink-0">•</span>
                  <span>Use consistent terminology from our glossary</span>
                </li>
              </ul>
            </div>

            <div className="p-lg border-2 border-error bg-error/10 rounded-lg">
              <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
                <span className="text-2xl">✗</span> Don't
              </h3>
              <ul className="space-y-sm text-sm">
                <li className="flex gap-sm">
                  <span className="text-error shrink-0">•</span>
                  <span>Use jargon or unexplained technical terms</span>
                </li>
                <li className="flex gap-sm">
                  <span className="text-error shrink-0">•</span>
                  <span>Make assumptions about user knowledge</span>
                </li>
                <li className="flex gap-sm">
                  <span className="text-error shrink-0">•</span>
                  <span>Hide or obscure privacy implications</span>
                </li>
                <li className="flex gap-sm">
                  <span className="text-error shrink-0">•</span>
                  <span>Use humor at the user's expense</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2xl">
        <h2>Related Resources</h2>
        <div className="not-prose my-lg">
          <ul className="space-y-md">
            <li>
              <Link variant="standalone" href="/foundations/privacy-ux">
                Privacy UX Foundation →
              </Link>
            </li>
            <li>
              <Link variant="standalone" href="/foundations/accessibility">
                Accessibility Guidelines →
              </Link>
            </li>
            <li>
              <Link variant="standalone" href="/getting-started/design-philosophy">
                Design Philosophy →
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
