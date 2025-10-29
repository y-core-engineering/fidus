import Link from 'next/link';

export default function ContributingPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Contributing Guide</h1>
        <p className="text-xl text-gray-600">
          How to contribute to Fidus Design System and help improve it for everyone
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Welcome Contributors</h2>
        <p className="mb-4">
          We welcome contributions to Fidus Design System from the community. Whether you are
          fixing bugs, adding new components, improving documentation, or suggesting enhancements,
          your contributions help make the design system better for everyone.
        </p>
        <p className="mb-4">
          This guide will help you understand how to contribute effectively and what standards
          we expect.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Code of Conduct</h2>
        <p className="mb-4">
          By participating in this project, you agree to abide by our code of conduct:
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">Our Standards</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Be respectful and inclusive in all interactions</li>
            <li>Welcome diverse perspectives and experiences</li>
            <li>Focus on what is best for the community</li>
            <li>Show empathy towards other contributors</li>
            <li>Accept constructive criticism gracefully</li>
            <li>Prioritize user privacy and security</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Unacceptable Behavior</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Harassment, discrimination, or offensive comments</li>
            <li>Personal attacks or trolling</li>
            <li>Sharing private information without consent</li>
            <li>Spam or off-topic content</li>
            <li>Any conduct that would be inappropriate in a professional setting</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How to Report Bugs</h2>

        <p className="mb-4">
          If you find a bug in a component or documentation, please report it through GitHub Issues.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Before Reporting</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Check if the issue has already been reported</li>
            <li>Verify you are using the latest version</li>
            <li>Try to reproduce the issue consistently</li>
            <li>Gather relevant information (browser, OS, version)</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Bug Report Template</h3>
          <div className="bg-gray-50 border rounded-lg p-6">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
{`**Component:** Button

**Version:** 1.2.3

**Description:**
Clear description of the bug and what you expected to happen.

**Steps to Reproduce:**
1. Import Button component
2. Set variant to "primary"
3. Click the button
4. Observe incorrect behavior

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Browser: Chrome 120
- OS: macOS 14
- React: 18.2
- Node: 20.10

**Code Example:**
\`\`\`tsx
<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
\`\`\`

**Screenshots:**
If applicable, add screenshots to help explain the problem.

**Additional Context:**
Any other relevant information.`}
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Feature Requests</h2>

        <p className="mb-4">
          We welcome ideas for new components, patterns, or enhancements to existing features.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Before Requesting</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Check if a similar feature has been requested</li>
            <li>Consider if it fits the design system philosophy</li>
            <li>Think about how it would benefit other users</li>
            <li>Prepare examples or mockups if possible</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Feature Request Template</h3>
          <div className="bg-gray-50 border rounded-lg p-6">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
{`**Feature Type:** New Component / Enhancement / Pattern

**Title:** Clear, descriptive title

**Problem Statement:**
What problem does this solve? Why is it needed?

**Proposed Solution:**
How would this feature work? Include details about:
- API design (props, events)
- Visual appearance
- Behavior and interactions
- Accessibility considerations

**Alternatives Considered:**
What other approaches did you consider?

**Use Cases:**
Specific examples of when this would be used

**Privacy Considerations:**
How does this relate to user privacy?

**Additional Context:**
Mockups, code examples, references to similar implementations`}
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Pull Request Guidelines</h2>

        <p className="mb-4">
          Ready to contribute code? Follow these guidelines to ensure your pull request can be
          reviewed and merged smoothly.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Before You Start</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Fork the repository and create a new branch</li>
            <li>For significant changes, open an issue first to discuss</li>
            <li>Read the architecture and design philosophy documentation</li>
            <li>Set up your development environment</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Development Setup</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto mb-4">
            <code>{`# Clone your fork
git clone https://github.com/YOUR_USERNAME/fidus.git
cd fidus

# Install dependencies
pnpm install

# Run tests
pnpm test

# Start development server
cd packages/design-system
pnpm dev`}</code>
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Code Standards</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Use TypeScript with strict type checking</li>
            <li>Never use <code className="bg-gray-100 px-2 py-1 rounded">any</code> type</li>
            <li>Avoid type casting with <code className="bg-gray-100 px-2 py-1 rounded">as</code></li>
            <li>Follow existing code style and conventions</li>
            <li>Use CSS variables for spacing and colors</li>
            <li>Never hardcode spacing values</li>
            <li>Include proper TypeScript types for all props</li>
            <li>Write clear, descriptive variable and function names</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Commit Messages</h3>
          <p className="mb-3">Use conventional commit format:</p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`feat(button): add loading state
fix(input): correct validation error display
docs(contributing): update PR guidelines
test(card): add accessibility tests
refactor(modal): simplify animation logic`}</code>
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Pull Request Checklist</h3>
          <div className="bg-gray-50 border rounded-lg p-6">
            <p className="mb-3 font-semibold">Before submitting, ensure:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" disabled />
                <span>All tests pass locally</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" disabled />
                <span>Code follows style guidelines</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" disabled />
                <span>TypeScript types are correct (no <code>any</code>)</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" disabled />
                <span>Documentation is updated</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" disabled />
                <span>Accessibility requirements met (WCAG 2.1 AA)</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" disabled />
                <span>Tests added for new functionality</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" disabled />
                <span>Privacy considerations addressed</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" disabled />
                <span>Component works with keyboard navigation</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" disabled />
                <span>Component is responsive</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Component Contribution Checklist</h2>

        <p className="mb-4">
          Contributing a new component? Here is everything you need to include:
        </p>

        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">1. Component Implementation</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>TypeScript component with strict types</li>
              <li>Props interface with JSDoc comments</li>
              <li>Variants and sizes as needed</li>
              <li>Disabled, loading, and error states</li>
              <li>Keyboard navigation support</li>
              <li>ARIA attributes for accessibility</li>
              <li>Responsive behavior</li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">2. Styling</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Use Tailwind CSS classes</li>
              <li>Use CSS variables for spacing and colors</li>
              <li>Never hardcode pixel values</li>
              <li>Support dark mode</li>
              <li>Proper focus states</li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">3. Tests</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Unit tests with Vitest</li>
              <li>Render tests for all variants</li>
              <li>Interaction tests (click, keyboard)</li>
              <li>Accessibility tests</li>
              <li>Test coverage above 80%</li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">4. Documentation</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Component page in design system site</li>
              <li>Description and use cases</li>
              <li>Props table with types and defaults</li>
              <li>Code examples for common scenarios</li>
              <li>Accessibility guidelines</li>
              <li>Do's and Don'ts</li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">5. Export</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Add to main index.ts exports</li>
              <li>Update package exports</li>
              <li>Add to component list in documentation</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Testing Requirements</h2>

        <p className="mb-4">
          All contributions must include tests. We use Vitest for component testing.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Example Test</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  it('should have correct ARIA attributes', () => {
    render(<Button aria-label="Submit form">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Submit form'
    );
  });

  it('should support keyboard navigation', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByText('Click me');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledOnce();
  });
});`}</code>
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Running Tests</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test Button.test.tsx`}</code>
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Documentation Requirements</h2>

        <p className="mb-4">
          Good documentation is essential. All components must have comprehensive documentation.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Documentation Page Structure</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Clear description of component purpose</li>
            <li>When to use and when not to use</li>
            <li>Interactive examples</li>
            <li>Props table with types, defaults, descriptions</li>
            <li>Variants and states</li>
            <li>Accessibility information</li>
            <li>Best practices</li>
            <li>Related components</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Review Process</h2>

        <p className="mb-4">
          After submitting a pull request, here is what happens:
        </p>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-4">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-1">Automated Checks</h3>
              <p className="text-gray-700 text-sm">
                CI runs tests, linting, and type checking
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-4">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-1">Code Review</h3>
              <p className="text-gray-700 text-sm">
                Maintainers review code quality, architecture, and adherence to guidelines
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-4">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-1">Design Review</h3>
              <p className="text-gray-700 text-sm">
                For UI components, designers review visual implementation and UX
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-4">
              4
            </div>
            <div>
              <h3 className="font-semibold mb-1">Accessibility Review</h3>
              <p className="text-gray-700 text-sm">
                Verify keyboard navigation, screen reader support, and WCAG compliance
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-4">
              5
            </div>
            <div>
              <h3 className="font-semibold mb-1">Feedback and Iteration</h3>
              <p className="text-gray-700 text-sm">
                Address feedback and make requested changes
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold mr-4">
              6
            </div>
            <div>
              <h3 className="font-semibold mb-1">Merge</h3>
              <p className="text-gray-700 text-sm">
                Once approved, your PR is merged and included in the next release
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Community Support</h2>

        <p className="mb-4">
          Need help with your contribution? Here is where to get support:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">GitHub Discussions</h3>
            <p className="text-sm text-gray-600 mb-3">
              Ask questions, share ideas, and get feedback from the community
            </p>
            <a
              href="https://github.com/y-core-engineering/fidus/discussions"
              className="text-blue-600 hover:underline text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join discussions →
            </a>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Discord</h3>
            <p className="text-sm text-gray-600 mb-3">
              Real-time chat with maintainers and contributors
            </p>
            <a
              href="https://discord.gg/fidus"
              className="text-blue-600 hover:underline text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord →
            </a>
          </div>
        </div>
      </section>

      <section className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">Thank You</h2>
        <p className="mb-4">
          Thank you for considering contributing to Fidus Design System. Your contributions help
          create better, more accessible, and more privacy-focused experiences for all users.
        </p>
        <p>
          We look forward to reviewing your contributions and working with you to make the design
          system even better.
        </p>
      </section>
    </div>
  );
}
