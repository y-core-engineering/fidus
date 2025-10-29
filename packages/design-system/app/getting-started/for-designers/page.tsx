'use client';

import Link from 'next/link';

export default function ForDesignersPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Guide for Designers</h1>
        <p className="text-xl text-gray-600">
          Everything designers need to know about working with Fidus Design System
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <p className="mb-4">
          Fidus Design System is built for designers who want to create privacy-first, context-aware
          user experiences. This guide will help you understand our unique approach to UI design and
          how to work effectively with the design system.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Figma Resources</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p className="mb-4">
            We are currently working on Figma component libraries and design templates. These resources
            will include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Complete component library with variants</li>
            <li>Design tokens (colors, spacing, typography)</li>
            <li>Layout templates and grids</li>
            <li>Icon library</li>
            <li>Example screens and flows</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            Check back soon or watch our GitHub repository for updates.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Design Principles</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Privacy-First Design</h3>
            <p className="mb-3">
              Every design decision must prioritize user privacy and control:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Make privacy controls prominent and accessible</li>
              <li>Use clear language to explain data usage</li>
              <li>Provide granular control over data sharing</li>
              <li>Default to most private settings</li>
              <li>Show encryption status visually</li>
            </ul>
            <Link href="/foundations/privacy-ux" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              Read Privacy UX Guidelines →
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">2. Context-Aware Design</h3>
            <p className="mb-3">
              Design components that adapt to user context, not fixed screens:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Think in terms of cards and widgets, not pages</li>
              <li>Design for multiple presentation modes</li>
              <li>Consider time, location, and user state</li>
              <li>Allow components to appear anywhere</li>
              <li>Design for dynamic relevance</li>
            </ul>
            <Link href="/foundations/ai-driven-ui" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              Read AI-Driven UI Guidelines →
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">3. User Control</h3>
            <p className="mb-3">
              Users must always be in control of their experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Every card or widget must be dismissible</li>
              <li>Never auto-hide important information</li>
              <li>Provide clear actions and outcomes</li>
              <li>Allow users to undo actions</li>
              <li>Respect user preferences and settings</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">4. Examples Over Rules</h3>
            <p className="mb-3">
              Show what might happen, do not prescribe what always happens:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Use language like "might show" or "could appear"</li>
              <li>Design for flexibility and variation</li>
              <li>Avoid rigid, predetermined flows</li>
              <li>Let context determine presentation</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Design Tokens</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Colors</h3>
          <p className="mb-4">
            Our color system is designed for accessibility and clarity:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="h-20 bg-blue-600 rounded-lg mb-2"></div>
              <p className="text-sm font-semibold">Primary</p>
              <p className="text-xs text-gray-600">Interactive elements</p>
            </div>
            <div>
              <div className="h-20 bg-gray-800 rounded-lg mb-2"></div>
              <p className="text-sm font-semibold">Secondary</p>
              <p className="text-xs text-gray-600">Supporting content</p>
            </div>
            <div>
              <div className="h-20 bg-green-600 rounded-lg mb-2"></div>
              <p className="text-sm font-semibold">Success</p>
              <p className="text-xs text-gray-600">Positive actions</p>
            </div>
            <div>
              <div className="h-20 bg-red-600 rounded-lg mb-2"></div>
              <p className="text-sm font-semibold">Danger</p>
              <p className="text-xs text-gray-600">Destructive actions</p>
            </div>
          </div>

          <Link href="/foundations/colors" className="text-blue-600 hover:underline text-sm">
            View full color system →
          </Link>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Spacing</h3>
          <p className="mb-4">
            Consistent spacing creates visual harmony and hierarchy:
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center">
              <div className="w-16 text-sm text-gray-600">XS (4px)</div>
              <div className="h-4 w-4 bg-blue-600 rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-sm text-gray-600">SM (8px)</div>
              <div className="h-4 w-8 bg-blue-600 rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-sm text-gray-600">MD (16px)</div>
              <div className="h-4 w-16 bg-blue-600 rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-sm text-gray-600">LG (24px)</div>
              <div className="h-4 w-24 bg-blue-600 rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-sm text-gray-600">XL (32px)</div>
              <div className="h-4 w-32 bg-blue-600 rounded"></div>
            </div>
          </div>

          <Link href="/foundations/spacing" className="text-blue-600 hover:underline text-sm">
            View spacing system →
          </Link>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Typography</h3>
          <p className="mb-4">
            Our typography scale ensures readability and hierarchy:
          </p>

          <div className="space-y-3 mb-4">
            <div>
              <div className="text-4xl font-bold mb-1">Heading 1</div>
              <p className="text-sm text-gray-600">36px / 2.25rem - Page titles</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">Heading 2</div>
              <p className="text-sm text-gray-600">30px / 1.875rem - Section titles</p>
            </div>
            <div>
              <div className="text-2xl font-semibold mb-1">Heading 3</div>
              <p className="text-sm text-gray-600">24px / 1.5rem - Subsections</p>
            </div>
            <div>
              <div className="text-base mb-1">Body Text</div>
              <p className="text-sm text-gray-600">16px / 1rem - Primary content</p>
            </div>
            <div>
              <div className="text-sm mb-1">Small Text</div>
              <p className="text-sm text-gray-600">14px / 0.875rem - Captions, labels</p>
            </div>
          </div>

          <Link href="/foundations/typography" className="text-blue-600 hover:underline text-sm">
            View typography system →
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Component Anatomy</h2>

        <p className="mb-4">
          Understanding component structure helps you design consistent, accessible interfaces:
        </p>

        <div className="border rounded-lg p-6 mb-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Common Component Parts</h3>

          <ul className="space-y-3">
            <li>
              <strong>Container:</strong> The outermost wrapper that defines spacing and layout
            </li>
            <li>
              <strong>Header:</strong> Title, description, and actions
            </li>
            <li>
              <strong>Body:</strong> Main content area
            </li>
            <li>
              <strong>Footer:</strong> Actions, metadata, or supplementary information
            </li>
            <li>
              <strong>Dismiss Control:</strong> X button or swipe gesture for closeable items
            </li>
            <li>
              <strong>Status Indicators:</strong> Loading, success, error states
            </li>
          </ul>
        </div>

        <Link href="/components/card" className="text-blue-600 hover:underline">
          See Card component as an example →
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Accessibility Guidelines</h2>

        <p className="mb-4">
          Designing for accessibility is non-negotiable. All designs must meet WCAG 2.1 Level AA standards:
        </p>

        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold mb-2">Color Contrast</h3>
            <p className="text-gray-700">
              Maintain a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.
              Never rely on color alone to convey information.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold mb-2">Keyboard Navigation</h3>
            <p className="text-gray-700">
              All interactive elements must be keyboard accessible. Design visible focus states
              and logical tab order.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold mb-2">Screen Reader Support</h3>
            <p className="text-gray-700">
              Include descriptive labels, use semantic HTML structure, and provide text alternatives
              for images and icons.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold mb-2">Touch Targets</h3>
            <p className="text-gray-700">
              Ensure interactive elements are at least 44x44 pixels for comfortable touch interaction.
            </p>
          </div>
        </div>

        <Link href="/foundations/accessibility" className="text-blue-600 hover:underline text-sm mt-4 inline-block">
          Read full accessibility guidelines →
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Working with Developers</h2>

        <p className="mb-4">
          Effective collaboration between designers and developers is key to successful implementation:
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Design Handoff</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Annotate designs with spacing values using design tokens</li>
              <li>Specify interactive states (hover, active, disabled)</li>
              <li>Document responsive behavior at different breakpoints</li>
              <li>Include accessibility requirements</li>
              <li>Provide example content and edge cases</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Communication</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Use component names from the design system</li>
              <li>Reference design tokens instead of hard values</li>
              <li>Collaborate on complex interactions early</li>
              <li>Review implementations together</li>
              <li>Iterate based on technical constraints</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Testing Together</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Test implementations across devices and browsers</li>
              <li>Verify accessibility with screen readers</li>
              <li>Check keyboard navigation flows</li>
              <li>Test with real content and edge cases</li>
              <li>Validate responsive behavior</li>
            </ul>
          </div>
        </div>

        <Link href="/getting-started/for-developers" className="text-blue-600 hover:underline text-sm mt-4 inline-block">
          View developer guide →
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Resources</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/foundations/ai-driven-ui"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">AI-Driven UI Paradigm</h3>
            <p className="text-sm text-gray-600">
              Understand our unique approach to adaptive interfaces
            </p>
          </Link>

          <Link
            href="/foundations/privacy-ux"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Privacy UX Guidelines</h3>
            <p className="text-sm text-gray-600">
              Learn how to design privacy-first experiences
            </p>
          </Link>

          <Link
            href="/components/button"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Component Library</h3>
            <p className="text-sm text-gray-600">
              Explore all available components
            </p>
          </Link>

          <Link
            href="/patterns/form-validation"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Design Patterns</h3>
            <p className="text-sm text-gray-600">
              Common patterns and best practices
            </p>
          </Link>
        </div>
      </section>

      <section className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">Questions or Feedback?</h2>
        <p className="mb-4">
          We welcome feedback from designers using the Fidus Design System. If you have questions,
          suggestions, or want to contribute to the design system, please reach out.
        </p>
        <Link href="/getting-started/contributing" className="text-blue-600 hover:underline">
          Learn how to contribute →
        </Link>
      </section>
    </div>
  );
}
