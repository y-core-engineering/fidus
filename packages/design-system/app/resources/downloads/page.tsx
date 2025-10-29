'use client';

export default function DownloadsPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Downloads</h1>
      <p className="lead">
        Download design assets, icons, logos, and resources for the Fidus Design System.
      </p>

      <h2>Design Files</h2>

      <div className="not-prose space-y-4 mb-8">
        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Figma Library</h3>
            <p className="text-sm text-muted-foreground">
              Complete design system with components, tokens, and patterns
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download
          </a>
        </div>

        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Sketch Library</h3>
            <p className="text-sm text-muted-foreground">
              Design system for Sketch (limited support)
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download
          </a>
        </div>

        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Adobe XD Library</h3>
            <p className="text-sm text-muted-foreground">
              Design system for Adobe XD (limited support)
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download
          </a>
        </div>
      </div>

      <h2>Icons</h2>

      <div className="not-prose space-y-4 mb-8">
        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Lucide React Icons</h3>
            <p className="text-sm text-muted-foreground">
              Open-source icon library used throughout Fidus (recommended)
            </p>
          </div>
          <a
            href="https://lucide.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            View Library
          </a>
        </div>

        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Icon Set (SVG)</h3>
            <p className="text-sm text-muted-foreground">
              All icons used in Fidus as individual SVG files
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download
          </a>
        </div>

        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Icon Font</h3>
            <p className="text-sm text-muted-foreground">
              Web font format for icons (not recommended for React)
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download
          </a>
        </div>
      </div>

      <h2>Logos and Brand Assets</h2>

      <div className="not-prose space-y-4 mb-8">
        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Fidus Logo Pack</h3>
            <p className="text-sm text-muted-foreground">
              Logo in multiple formats: SVG, PNG, PDF
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download
          </a>
        </div>

        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Brand Guidelines</h3>
            <p className="text-sm text-muted-foreground">
              Official brand identity guidelines (PDF)
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download
          </a>
        </div>
      </div>

      <h2>Fonts</h2>

      <div className="not-prose space-y-4 mb-8">
        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Inter (Sans Serif)</h3>
            <p className="text-sm text-muted-foreground">
              Primary UI font - free and open source
            </p>
          </div>
          <a
            href="https://fonts.google.com/specimen/Inter"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Get Font
          </a>
        </div>

        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Fira Code (Monospace)</h3>
            <p className="text-sm text-muted-foreground">
              Code font with ligatures - free and open source
            </p>
          </div>
          <a
            href="https://fonts.google.com/specimen/Fira+Code"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Get Font
          </a>
        </div>
      </div>

      <h2>Design Tokens</h2>

      <div className="not-prose space-y-4 mb-8">
        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">CSS Variables</h3>
            <p className="text-sm text-muted-foreground">
              Complete token system as CSS custom properties
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download
          </a>
        </div>

        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Tailwind Config</h3>
            <p className="text-sm text-muted-foreground">
              Tailwind configuration with all design tokens
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download
          </a>
        </div>

        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Style Dictionary</h3>
            <p className="text-sm text-muted-foreground">
              Token definitions for multiple platforms (JSON)
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download
          </a>
        </div>
      </div>

      <h2>Code Examples</h2>

      <div className="not-prose space-y-4 mb-8">
        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Component Starters</h3>
            <p className="text-sm text-muted-foreground">
              Example implementations of common patterns
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download
          </a>
        </div>

        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Next.js Template</h3>
            <p className="text-sm text-muted-foreground">
              Starter template with design system integrated
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download
          </a>
        </div>
      </div>

      <h2>Documentation</h2>

      <div className="not-prose space-y-4 mb-8">
        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Design System PDF</h3>
            <p className="text-sm text-muted-foreground">
              Complete documentation as offline PDF
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download
          </a>
        </div>

        <div className="p-6 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Component Specifications</h3>
            <p className="text-sm text-muted-foreground">
              Technical specs for all components (Markdown)
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download
          </a>
        </div>
      </div>

      <h2>Installation</h2>

      <h3>NPM Package</h3>
      <p>
        Install the Fidus UI component library:
      </p>
      <pre className="not-prose">
        <code>npm install @fidus/ui</code>
      </pre>

      <h3>CDN (Not Recommended)</h3>
      <p>
        For prototyping only - use NPM for production:
      </p>
      <pre className="not-prose">
        <code>{`<link rel="stylesheet" href="https://cdn.fidus.ai/v1/styles.css" />
<script src="https://cdn.fidus.ai/v1/components.js"></script>`}</code>
      </pre>

      <h2>License</h2>
      <p>
        All design assets and code are released under the{' '}
        <a href="https://github.com/y-core-engineering/fidus/blob/main/LICENSE.md">
          Sustainable Use License
        </a>
        .
      </p>
      <ul>
        <li>Free for personal use</li>
        <li>Free for small businesses (under $1M revenue)</li>
        <li>License required for larger organizations</li>
        <li>Contributions welcome</li>
      </ul>

      <h2>Version History</h2>
      <p>
        See the <a href="/resources/changelog">Changelog</a> for version-specific downloads and
        release notes.
      </p>

      <h2>Need Help?</h2>
      <p>
        Having trouble with downloads? Contact us:
      </p>
      <ul>
        <li>
          <a href="/resources/support">Support</a> - Discord and GitHub Discussions
        </li>
        <li>
          <a href="/resources/github">GitHub</a> - Report issues
        </li>
        <li>Email: design@fidus.ai</li>
      </ul>
    </div>
  );
}
