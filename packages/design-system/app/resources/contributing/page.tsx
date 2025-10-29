'use client';

export default function ContributingPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Contributing</h1>
      <p className="lead">
        Help us improve the Fidus Design System! Contributions are welcome from designers,
        developers, and documentation writers.
      </p>

      <div className="not-prose mb-8 p-6 bg-primary/10 border border-primary rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Before You Start</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Read the full{' '}
          <a
            href="https://github.com/y-core-engineering/fidus/blob/main/CONTRIBUTING.md"
            className="text-primary underline hover:no-underline"
          >
            CONTRIBUTING.md
          </a>{' '}
          in the GitHub repository for complete guidelines.
        </p>
      </div>

      <h2>Ways to Contribute</h2>

      <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🎨 Design</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Propose new components</li>
            <li>Improve existing patterns</li>
            <li>Create design examples</li>
            <li>Improve accessibility</li>
          </ul>
        </div>
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">💻 Code</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Build new components</li>
            <li>Fix bugs</li>
            <li>Improve accessibility</li>
            <li>Write tests</li>
          </ul>
        </div>
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📚 Documentation</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Write guides</li>
            <li>Improve examples</li>
            <li>Fix typos</li>
            <li>Add translations</li>
          </ul>
        </div>
      </div>

      <h2>Getting Started</h2>

      <h3>1. Set Up Your Environment</h3>
      <pre className="not-prose">
        <code>{`# Clone the repository
git clone https://github.com/y-core-engineering/fidus.git
cd fidus

# Install dependencies
pnpm install

# Start design system development server
cd packages/design-system
pnpm dev`}</code>
      </pre>

      <h3>2. Create a Branch</h3>
      <pre className="not-prose">
        <code>{`# Create a new branch for your work
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description

# Or for documentation
git checkout -b docs/what-you-document`}</code>
      </pre>

      <h3>3. Make Your Changes</h3>
      <ul>
        <li>Follow the code style guidelines below</li>
        <li>Write clear, descriptive commit messages</li>
        <li>Add tests for new features</li>
        <li>Update documentation as needed</li>
      </ul>

      <h3>4. Test Your Changes</h3>
      <pre className="not-prose">
        <code>{`# Run tests
pnpm test

# Run linter
pnpm lint

# Type check
pnpm typecheck

# Build to verify no errors
pnpm build > build.log 2>&1
tail -n 30 build.log`}</code>
      </pre>

      <h3>5. Submit a Pull Request</h3>
      <pre className="not-prose">
        <code>{`# Push your branch
git push -u origin feature/your-feature-name

# Create PR via GitHub CLI
gh pr create --web

# Or create manually on GitHub`}</code>
      </pre>

      <h2>Code Style Guidelines</h2>

      <h3>TypeScript/React</h3>
      <ul>
        <li>Use TypeScript strict mode</li>
        <li>Never use <code>any</code> type - use proper types or <code>unknown</code></li>
        <li>Avoid type casting with <code>as</code> - use type guards</li>
        <li>Use functional components with hooks</li>
        <li>Add JSDoc comments for complex logic</li>
      </ul>

      <div className="not-prose mb-6">
        <div className="p-4 bg-muted rounded-lg mb-2">
          <p className="text-sm text-muted-foreground mb-2">✅ Good:</p>
          <pre className="text-xs overflow-x-auto">
            <code>{`interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant, size, children }: ButtonProps) {
  return <button className={\`btn-\${variant} btn-\${size}\`}>{children}</button>;
}`}</code>
          </pre>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">❌ Bad:</p>
          <pre className="text-xs overflow-x-auto">
            <code>{`export function Button(props: any) {
  return <button className="button">{props.children}</button>;
}`}</code>
          </pre>
        </div>
      </div>

      <h3>CSS/Styling</h3>
      <ul>
        <li>Use Tailwind CSS utility classes</li>
        <li>Use CSS variables for tokens (never hardcode colors/spacing)</li>
        <li>Follow mobile-first responsive design</li>
        <li>Ensure WCAG 2.1 AA contrast ratios</li>
      </ul>

      <div className="not-prose mb-6">
        <div className="p-4 bg-muted rounded-lg mb-2">
          <p className="text-sm text-muted-foreground mb-2">✅ Good:</p>
          <pre className="text-xs overflow-x-auto">
            <code>{`<button className="px-md py-sm bg-primary text-primary-foreground rounded-md">
  Click Me
</button>`}</code>
          </pre>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">❌ Bad:</p>
          <pre className="text-xs overflow-x-auto">
            <code>{`<button style={{ padding: '16px 8px', backgroundColor: '#FFD700' }}>
  Click Me
</button>`}</code>
          </pre>
        </div>
      </div>

      <h3>File Naming</h3>
      <ul>
        <li>Components: <code>PascalCase.tsx</code> (e.g., <code>Button.tsx</code>)</li>
        <li>
          Utilities: <code>kebab-case.ts</code> (e.g., <code>format-date.ts</code>)
        </li>
        <li>Tests: <code>ComponentName.test.tsx</code></li>
        <li>
          Pages: <code>page.tsx</code> (Next.js convention)
        </li>
      </ul>

      <h2>Component Checklist</h2>
      <p>When adding a new component, ensure you've completed all items:</p>

      <h3>Implementation</h3>
      <ul>
        <li>✅ Component code with TypeScript types</li>
        <li>✅ Zod schema for prop validation</li>
        <li>✅ Multiple variants/sizes as needed</li>
        <li>✅ Dark mode support</li>
        <li>✅ Responsive design (mobile/tablet/desktop)</li>
        <li>✅ Accessibility (ARIA, keyboard nav, focus states)</li>
      </ul>

      <h3>Tests</h3>
      <ul>
        <li>✅ Unit tests (Vitest + Testing Library)</li>
        <li>✅ Test all variants and states</li>
        <li>✅ Test accessibility features</li>
        <li>✅ Test keyboard interactions</li>
        <li>✅ Achieve &gt;80% code coverage</li>
      </ul>

      <h3>Documentation</h3>
      <ul>
        <li>✅ Component page with examples</li>
        <li>✅ Props table with descriptions</li>
        <li>✅ Usage guidelines (when to use, best practices)</li>
        <li>✅ Code examples for common use cases</li>
        <li>✅ Accessibility notes</li>
      </ul>

      <h3>Design</h3>
      <ul>
        <li>✅ Visual design examples</li>
        <li>✅ All states documented (default, hover, active, disabled, error)</li>
        <li>✅ Responsive layout guidelines</li>
        <li>✅ Dark mode variant</li>
      </ul>

      <h2>Pull Request Guidelines</h2>

      <h3>PR Title Format</h3>
      <p>
        Use conventional commit format (see{' '}
        <code>.github/pull_request_title_conventions.md</code>):
      </p>
      <ul>
        <li>
          <code>feat(component): add new Button component</code>
        </li>
        <li>
          <code>fix(badge): correct color contrast for urgency variants</code>
        </li>
        <li>
          <code>docs(tokens): update color token documentation</code>
        </li>
        <li>
          <code>refactor(modal): simplify focus trap logic</code>
        </li>
      </ul>

      <h3>PR Description</h3>
      <p>Include in your PR description:</p>
      <ul>
        <li>What changes were made and why</li>
        <li>Screenshots/videos for UI changes</li>
        <li>Testing instructions</li>
        <li>Related issues (e.g., "Fixes #123")</li>
        <li>Breaking changes (if any)</li>
      </ul>

      <h3>Review Process</h3>
      <ol>
        <li>Automated checks run (tests, lint, typecheck, build)</li>
        <li>Maintainer reviews code and design</li>
        <li>Feedback is provided (if needed)</li>
        <li>Once approved, PR is merged by a maintainer</li>
      </ol>

      <h2>Code of Conduct</h2>
      <ul>
        <li>Be respectful and inclusive</li>
        <li>Welcome newcomers and help them learn</li>
        <li>Focus on constructive feedback</li>
        <li>Respect maintainer decisions</li>
        <li>Report inappropriate behavior to the team</li>
      </ul>

      <h2>License</h2>
      <p>
        By contributing, you agree that your contributions will be licensed under the{' '}
        <a href="https://github.com/y-core-engineering/fidus/blob/main/LICENSE.md">
          Sustainable Use License
        </a>
        .
      </p>

      <h2>Recognition</h2>
      <p>Contributors are recognized in several ways:</p>
      <ul>
        <li>Listed in the project README</li>
        <li>Credited in release notes</li>
        <li>Special role in Discord community</li>
        <li>Swag for significant contributions</li>
      </ul>

      <h2>Questions?</h2>
      <ul>
        <li>
          <strong>Discord:</strong> Ask in #contributors channel
        </li>
        <li>
          <strong>GitHub Discussions:</strong> Start a discussion
        </li>
        <li>
          <strong>Email:</strong> dev@fidus.ai
        </li>
      </ul>

      <h2>Related Resources</h2>
      <ul>
        <li>
          <a href="/resources/github">GitHub Repository</a>
        </li>
        <li>
          <a href="/resources/support">Support</a>
        </li>
        <li>
          <a href="/getting-started/for-developers">Developer Guide</a>
        </li>
      </ul>
    </div>
  );
}
