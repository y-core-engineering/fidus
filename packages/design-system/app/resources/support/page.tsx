'use client';

export default function SupportPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Support</h1>
      <p className="lead">
        Get help with the Fidus Design System. Choose the best channel for your question or issue.
      </p>

      <h2>Support Channels</h2>

      <div className="not-prose space-y-6 mb-8">
        <div className="p-6 bg-muted rounded-lg">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💬</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Discord Community</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Real-time chat with maintainers and community members. Best for quick questions and
                discussions.
              </p>
              <a
                href="https://discord.gg/fidus"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
              >
                Join Discord →
              </a>
            </div>
          </div>
        </div>

        <div className="p-6 bg-muted rounded-lg">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🐙</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">GitHub Discussions</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Threaded discussions for in-depth questions, feature proposals, and community
                conversation.
              </p>
              <a
                href="https://github.com/y-core-engineering/fidus/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
              >
                View Discussions →
              </a>
            </div>
          </div>
        </div>

        <div className="p-6 bg-muted rounded-lg">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🐛</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">GitHub Issues</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Bug reports and feature requests. Use this for specific, actionable problems or
                enhancement requests.
              </p>
              <a
                href="https://github.com/y-core-engineering/fidus/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
              >
                Report Issue →
              </a>
            </div>
          </div>
        </div>

        <div className="p-6 bg-muted rounded-lg">
          <div className="flex items-start gap-4">
            <div className="text-4xl">✉️</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground mb-3">
                For private inquiries, licensing questions, or sensitive matters.
              </p>
              <a
                href="mailto:support@fidus.ai"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>

      <h2>Discord Channels</h2>
      <p>
        Our Discord server has dedicated channels for different topics:
      </p>

      <table>
        <thead>
          <tr>
            <th>Channel</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>#general</strong>
            </td>
            <td>General discussion about Fidus</td>
          </tr>
          <tr>
            <td>
              <strong>#design</strong>
            </td>
            <td>Design system questions and feedback</td>
          </tr>
          <tr>
            <td>
              <strong>#development</strong>
            </td>
            <td>Code, architecture, and technical questions</td>
          </tr>
          <tr>
            <td>
              <strong>#help</strong>
            </td>
            <td>Get help with implementation issues</td>
          </tr>
          <tr>
            <td>
              <strong>#showcase</strong>
            </td>
            <td>Share what you've built with Fidus</td>
          </tr>
          <tr>
            <td>
              <strong>#announcements</strong>
            </td>
            <td>Release notes and important updates</td>
          </tr>
          <tr>
            <td>
              <strong>#contributors</strong>
            </td>
            <td>For active contributors to coordinate work</td>
          </tr>
        </tbody>
      </table>

      <h2>Before Asking for Help</h2>

      <h3>Search First</h3>
      <ul>
        <li>
          Check the <a href="/">documentation</a> - your question may already be answered
        </li>
        <li>
          Search{' '}
          <a
            href="https://github.com/y-core-engineering/fidus/discussions"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Discussions
          </a>{' '}
          for similar questions
        </li>
        <li>
          Search{' '}
          <a
            href="https://github.com/y-core-engineering/fidus/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Issues
          </a>{' '}
          for related bug reports
        </li>
        <li>Check Discord history in relevant channels</li>
      </ul>

      <h3>Provide Context</h3>
      <p>When asking for help, include:</p>
      <ul>
        <li>What you're trying to accomplish</li>
        <li>What you've tried so far</li>
        <li>Error messages or unexpected behavior</li>
        <li>Code snippets or screenshots</li>
        <li>Your environment (browser, OS, versions)</li>
      </ul>

      <h3>Create a Minimal Reproduction</h3>
      <p>For bugs, provide:</p>
      <ul>
        <li>Minimal code that reproduces the issue</li>
        <li>Step-by-step instructions</li>
        <li>Expected vs. actual behavior</li>
        <li>
          CodeSandbox or GitHub repo link (use the{' '}
          <a href="/resources/code-playground">Playground</a> to create reproductions)
        </li>
      </ul>

      <h2>Response Times</h2>
      <p>
        We strive to respond quickly, but please be patient:
      </p>
      <table>
        <thead>
          <tr>
            <th>Channel</th>
            <th>Typical Response Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Discord</td>
            <td>Minutes to hours (community-driven)</td>
          </tr>
          <tr>
            <td>GitHub Discussions</td>
            <td>1-2 business days</td>
          </tr>
          <tr>
            <td>GitHub Issues</td>
            <td>1-3 business days</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>2-5 business days</td>
          </tr>
        </tbody>
      </table>

      <h2>Common Questions</h2>

      <h3>Getting Started</h3>
      <ul>
        <li>
          <a href="/getting-started/overview">Overview</a> - Introduction to the design system
        </li>
        <li>
          <a href="/getting-started/for-designers">For Designers</a> - Figma setup and workflow
        </li>
        <li>
          <a href="/getting-started/for-developers">For Developers</a> - Installation and usage
        </li>
      </ul>

      <h3>Components</h3>
      <ul>
        <li>
          <a href="/components">Component Library</a> - Browse all components
        </li>
        <li>
          <a href="/resources/code-playground">Code Playground</a> - Experiment with components
        </li>
        <li>
          <a href="/foundations">Foundations</a> - Design tokens and principles
        </li>
      </ul>

      <h3>Contributing</h3>
      <ul>
        <li>
          <a href="/resources/contributing">Contributing Guide</a> - How to contribute
        </li>
        <li>
          <a href="/resources/github">GitHub Repository</a> - Source code and issues
        </li>
        <li>
          <a href="/resources/changelog">Changelog</a> - Version history
        </li>
      </ul>

      <h2>Report a Security Issue</h2>
      <p>
        If you discover a security vulnerability, please report it privately:
      </p>
      <ul>
        <li>
          <strong>Email:</strong> security@fidus.ai
        </li>
        <li>Do not create a public GitHub issue</li>
        <li>Include detailed reproduction steps</li>
        <li>We'll respond within 48 hours</li>
        <li>We'll coordinate disclosure timing with you</li>
      </ul>

      <h2>Enterprise Support</h2>
      <p>
        Need dedicated support for your organization?
      </p>
      <ul>
        <li>Priority response times</li>
        <li>Custom training sessions</li>
        <li>Architecture consulting</li>
        <li>Custom component development</li>
      </ul>
      <p>
        Contact us at{' '}
        <a href="mailto:enterprise@fidus.ai">enterprise@fidus.ai</a> for pricing and details.
      </p>

      <h2>Community Guidelines</h2>
      <p>
        Please follow these guidelines when asking for help:
      </p>
      <ul>
        <li>Be respectful and courteous</li>
        <li>Stay on topic in specific channels</li>
        <li>Don't spam or cross-post</li>
        <li>Don't DM maintainers directly (use public channels)</li>
        <li>Mark your question as resolved when answered</li>
        <li>Help others when you can</li>
      </ul>

      <h2>Feedback</h2>
      <p>
        We're always looking to improve! Share your feedback:
      </p>
      <ul>
        <li>What's working well?</li>
        <li>What could be better?</li>
        <li>What features are you missing?</li>
        <li>How can we improve documentation?</li>
      </ul>
      <p>
        Post in{' '}
        <a
          href="https://github.com/y-core-engineering/fidus/discussions"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Discussions
        </a>{' '}
        or the Discord #feedback channel.
      </p>

      <h2>Stay Updated</h2>
      <p>
        Get notified about new releases and important updates:
      </p>
      <ul>
        <li>
          <strong>GitHub:</strong>{' '}
          <a
            href="https://github.com/y-core-engineering/fidus"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch the repository
          </a>
        </li>
        <li>
          <strong>Discord:</strong> Join the #announcements channel
        </li>
        <li>
          <strong>RSS:</strong> Subscribe to the{' '}
          <a href="/resources/changelog">changelog feed</a>
        </li>
      </ul>
    </div>
  );
}
