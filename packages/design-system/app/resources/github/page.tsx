'use client';

export default function GitHubPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>GitHub</h1>
      <p className="lead">
        The Fidus Design System is open source and hosted on GitHub. Report issues, contribute
        code, or explore the source.
      </p>

      <div className="not-prose mb-8">
        <a
          href="https://github.com/y-core-engineering/fidus"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary-hover transition-colors"
        >
          View on GitHub →
        </a>
      </div>

      <h2>Repository Structure</h2>
      <p>
        Fidus is a monorepo containing multiple packages:
      </p>

      <div className="not-prose mb-8">
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`fidus/
├── packages/
│   ├── design-system/    # This design system website
│   ├── ui/               # Shared UI component library (@fidus/ui)
│   ├── web/              # Main Fidus app (coming soon)
│   ├── api/              # Backend (Python + FastAPI)
│   ├── cli/              # Command-line interface
│   └── shared/           # Shared types and utilities
├── docs/                 # Documentation
├── .github/              # GitHub workflows and templates
└── LICENSE.md            # Sustainable Use License`}</code>
        </pre>
      </div>

      <h2>Quick Links</h2>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <a
          href="https://github.com/y-core-engineering/fidus/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 bg-muted rounded-lg hover:bg-muted/80 transition-colors block"
        >
          <h3 className="text-lg font-semibold mb-2">🐛 Issues</h3>
          <p className="text-sm text-muted-foreground">
            Report bugs, request features, or track ongoing work
          </p>
        </a>

        <a
          href="https://github.com/y-core-engineering/fidus/pulls"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 bg-muted rounded-lg hover:bg-muted/80 transition-colors block"
        >
          <h3 className="text-lg font-semibold mb-2">🔀 Pull Requests</h3>
          <p className="text-sm text-muted-foreground">
            Review open PRs or submit your own contributions
          </p>
        </a>

        <a
          href="https://github.com/y-core-engineering/fidus/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 bg-muted rounded-lg hover:bg-muted/80 transition-colors block"
        >
          <h3 className="text-lg font-semibold mb-2">💬 Discussions</h3>
          <p className="text-sm text-muted-foreground">
            Ask questions, share ideas, and connect with the community
          </p>
        </a>

        <a
          href="https://github.com/y-core-engineering/fidus/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 bg-muted rounded-lg hover:bg-muted/80 transition-colors block"
        >
          <h3 className="text-lg font-semibold mb-2">📦 Releases</h3>
          <p className="text-sm text-muted-foreground">
            View release notes and download specific versions
          </p>
        </a>
      </div>

      <h2>Reporting Issues</h2>

      <h3>Bug Reports</h3>
      <p>Found a bug? Help us fix it by providing detailed information:</p>
      <ol>
        <li>
          <a
            href="https://github.com/y-core-engineering/fidus/issues/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Create a new issue
          </a>
        </li>
        <li>Use the bug report template</li>
        <li>Provide a clear title</li>
        <li>Include steps to reproduce</li>
        <li>Add screenshots or videos if relevant</li>
        <li>Mention your environment (browser, OS, version)</li>
      </ol>

      <h3>Feature Requests</h3>
      <p>Have an idea for a new component or feature?</p>
      <ol>
        <li>
          <a
            href="https://github.com/y-core-engineering/fidus/issues/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Create a new issue
          </a>
        </li>
        <li>Use the feature request template</li>
        <li>Describe the use case</li>
        <li>Explain the problem it solves</li>
        <li>Provide design examples if applicable</li>
      </ol>

      <h3>Issue Labels</h3>
      <p>Issues are organized with labels:</p>
      <div className="not-prose mb-6 space-y-2">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-error text-white rounded-md text-sm font-medium">
            bug
          </span>
          <span className="text-sm text-muted-foreground">Something isn't working</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-info text-white rounded-md text-sm font-medium">
            enhancement
          </span>
          <span className="text-sm text-muted-foreground">New feature or request</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-success text-white rounded-md text-sm font-medium">
            documentation
          </span>
          <span className="text-sm text-muted-foreground">
            Improvements or additions to docs
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-warning text-white rounded-md text-sm font-medium">
            good first issue
          </span>
          <span className="text-sm text-muted-foreground">Good for newcomers</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm font-medium">
            help wanted
          </span>
          <span className="text-sm text-muted-foreground">Extra attention is needed</span>
        </div>
      </div>

      <h2>Contributing Code</h2>
      <p>
        Want to contribute? See our <a href="/resources/contributing">Contributing Guide</a> for
        detailed instructions.
      </p>

      <h3>Quick Start</h3>
      <pre className="not-prose">
        <code>{`# Fork and clone
git clone https://github.com/YOUR_USERNAME/fidus.git

# Install dependencies
pnpm install

# Create a branch
git checkout -b feature/your-feature

# Make changes and test
pnpm test
pnpm lint
pnpm build

# Submit PR
git push -u origin feature/your-feature
gh pr create --web`}</code>
      </pre>

      <h2>GitHub Discussions</h2>
      <p>Use discussions for:</p>
      <ul>
        <li>
          <strong>Q&A:</strong> Ask questions about the design system
        </li>
        <li>
          <strong>Ideas:</strong> Share suggestions for improvements
        </li>
        <li>
          <strong>Show and Tell:</strong> Share projects built with Fidus
        </li>
        <li>
          <strong>General:</strong> Anything else related to Fidus
        </li>
      </ul>

      <h2>Repository Statistics</h2>
      <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-muted rounded-lg text-center">
          <div className="text-3xl font-bold mb-2">34+</div>
          <div className="text-sm text-muted-foreground">Components</div>
        </div>
        <div className="p-6 bg-muted rounded-lg text-center">
          <div className="text-3xl font-bold mb-2">80%+</div>
          <div className="text-sm text-muted-foreground">Test Coverage</div>
        </div>
        <div className="p-6 bg-muted rounded-lg text-center">
          <div className="text-3xl font-bold mb-2">100%</div>
          <div className="text-sm text-muted-foreground">TypeScript</div>
        </div>
      </div>

      <h2>Continuous Integration</h2>
      <p>
        All contributions go through automated checks:
      </p>
      <ul>
        <li>✅ Type checking (TypeScript)</li>
        <li>✅ Linting (ESLint)</li>
        <li>✅ Unit tests (Vitest + Testing Library)</li>
        <li>✅ Build verification</li>
        <li>✅ Accessibility tests (@axe-core/react)</li>
      </ul>

      <h2>Branches</h2>
      <table>
        <thead>
          <tr>
            <th>Branch</th>
            <th>Purpose</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>main</code>
            </td>
            <td>Stable, production-ready code</td>
            <td>Protected</td>
          </tr>
          <tr>
            <td>
              <code>develop</code>
            </td>
            <td>Integration branch for features</td>
            <td>Active development</td>
          </tr>
          <tr>
            <td>
              <code>feature/*</code>
            </td>
            <td>New features in progress</td>
            <td>Temporary</td>
          </tr>
          <tr>
            <td>
              <code>fix/*</code>
            </td>
            <td>Bug fixes in progress</td>
            <td>Temporary</td>
          </tr>
        </tbody>
      </table>

      <h2>Security</h2>
      <p>
        Found a security vulnerability? Please report it responsibly:
      </p>
      <ul>
        <li>
          <strong>Email:</strong> security@fidus.ai (not public GitHub issues)
        </li>
        <li>Include detailed reproduction steps</li>
        <li>We'll acknowledge within 48 hours</li>
        <li>We'll coordinate disclosure timing with you</li>
      </ul>

      <h2>License</h2>
      <p>
        Fidus is licensed under the{' '}
        <a
          href="https://github.com/y-core-engineering/fidus/blob/main/LICENSE.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sustainable Use License
        </a>
        :
      </p>
      <ul>
        <li>Free for personal use</li>
        <li>Free for small businesses (under $1M revenue)</li>
        <li>License required for larger organizations</li>
        <li>Contributions welcome under the same license</li>
      </ul>

      <h2>Star the Repository</h2>
      <p>
        If you find Fidus useful, please star the repository on GitHub! It helps us know the
        project is valuable and encourages continued development.
      </p>

      <div className="not-prose mb-8">
        <a
          href="https://github.com/y-core-engineering/fidus"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-muted border border-border rounded-lg font-medium hover:bg-muted/80 transition-colors"
        >
          <span>⭐</span>
          <span>Star on GitHub</span>
        </a>
      </div>

      <h2>Related Resources</h2>
      <ul>
        <li>
          <a href="/resources/contributing">Contributing Guide</a>
        </li>
        <li>
          <a href="/resources/support">Support</a>
        </li>
        <li>
          <a href="/content/glossary">Glossary</a>
        </li>
      </ul>
    </div>
  );
}
