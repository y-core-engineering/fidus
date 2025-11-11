'use client';

import Link from 'next/link';

export default function ForDevelopersPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Guide for Developers</h1>
        <p className="text-xl text-gray-600">
          Installation, setup, and your first component with Fidus Design System
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>

        <p className="mb-4">
          Install the Fidus UI component library using your preferred package manager:
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Using npm</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>npm install @fidus/ui</code>
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Using pnpm</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>pnpm add @fidus/ui</code>
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Using yarn</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>yarn add @fidus/ui</code>
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>

        <p className="mb-4">
          Fidus Design System requires the following dependencies in your project:
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li>React 18.0 or higher</li>
          <li>TypeScript 5.0 or higher (recommended)</li>
          <li>Tailwind CSS 3.0 or higher</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Note on Styling</h3>
          <p>
            Fidus components use Tailwind CSS for styling. If you do not have Tailwind CSS installed
            in your project, follow the Tailwind CSS installation guide for your framework.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Setup with Next.js</h2>

        <p className="mb-4">
          Here is how to set up Fidus Design System in a Next.js project:
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">1. Create a Next.js Project</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`npx create-next-app@latest my-fidus-app
cd my-fidus-app`}</code>
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">2. Install Fidus UI</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>npm install @fidus/ui</code>
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">3. Configure Tailwind CSS</h3>
          <p className="mb-3">
            Update your <code className="bg-gray-100 px-2 py-1 rounded">tailwind.config.js</code> to include Fidus components:
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // Include Fidus UI components
    './node_modules/@fidus/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Fidus design tokens
      spacing: {
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px
        'md': '1rem',      // 16px
        'lg': '1.5rem',    // 24px
        'xl': '2rem',      // 32px
        '2xl': '3rem',     // 48px
      },
    },
  },
  plugins: [],
}`}</code>
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">4. Add Global Styles</h3>
          <p className="mb-3">
            Create or update <code className="bg-gray-100 px-2 py-1 rounded">app/globals.css</code>:
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Fidus Design Tokens */
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --color-success: #16a34a;
  --color-warning: #f59e0b;
  --color-danger: #dc2626;

  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}`}</code>
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Your First Component</h2>

        <p className="mb-4">
          Let's create a simple page with a Button component:
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Import and Use Button</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`import { Button } from '@fidus/ui/button';;

export default function HomePage() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome to Fidus
      </h1>

      <div className="space-x-4">
        <Button variant="primary" onClick={handleClick}>
          Primary Button
        </Button>

        <Button variant="secondary" onClick={handleClick}>
          Secondary Button
        </Button>

        <Button variant="outline" onClick={handleClick}>
          Outline Button
        </Button>
      </div>
    </div>
  );
}`}</code>
          </pre>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Result</h3>
          <p className="mb-4">
            You should now see three styled buttons on your page. All buttons are fully accessible,
            support keyboard navigation, and follow Fidus design principles.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Importing Components</h2>

        <p className="mb-4">
          Fidus UI exports all components from the main package. You can import them individually
          or as a group:
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Named Imports (Recommended)</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`import { Button } from '@fidus/ui/button';
import { Card } from '@fidus/ui/card';
import { Alert } from '@fidus/ui/alert';;`}</code>
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Available Components</h3>
          <p className="mb-3">Core components available in the library:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>Layout: Container, Stack, Grid</li>
            <li>Forms: Button, Input, Textarea, Checkbox, Radio, Select, DatePicker, TimePicker</li>
            <li>Data Display: Card, Table, Badge, Avatar</li>
            <li>Feedback: Alert, Toast, Progress, Spinner</li>
            <li>Navigation: Tabs, Breadcrumbs</li>
            <li>Overlay: Modal, Dialog, Tooltip</li>
          </ul>
          <Link href="/components/button" className="text-blue-600 hover:underline text-sm mt-3 inline-block">
            Browse all components →
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">TypeScript Support</h2>

        <p className="mb-4">
          Fidus Design System is built with TypeScript and provides complete type definitions:
        </p>

        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto mb-4">
          <code>{`import { Button } from '@fidus/ui/button';;

// Component with typed props
interface MyComponentProps {
  onSubmit: () => void;
  disabled?: boolean;
}

export function MyComponent({ onSubmit, disabled }: MyComponentProps) {
  return (
    <Button
      variant="primary"
      size="large"
      onClick={onSubmit}
      disabled={disabled}
    >
      Submit
    </Button>
  );
}

// Using ButtonProps for custom wrappers
export function CustomButton(props: ButtonProps) {
  return <Button {...props} className="my-custom-class" />;
}`}</code>
        </pre>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Type Safety</h3>
          <p>
            All component props are fully typed, providing autocomplete and compile-time error checking.
            This helps catch issues early and improves developer experience.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Styling Components</h2>

        <p className="mb-4">
          Fidus components use Tailwind CSS and CSS variables for styling:
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Using CSS Variables</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`<div
  style={{
    padding: 'var(--spacing-md)',
    margin: 'var(--spacing-lg)',
    color: 'var(--color-primary)',
  }}
>
  Content with design tokens
</div>`}</code>
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Extending Component Styles</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`import { Button } from '@fidus/ui/button';;

// Add additional classes to components
<Button
  variant="primary"
  className="shadow-lg hover:shadow-xl transition-shadow"
>
  Custom Styled Button
</Button>`}</code>
          </pre>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Important: Never Hardcode Spacing</h3>
          <p className="mb-3">Always use CSS variables or Tailwind classes for spacing:</p>
          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm mb-2">
            <code>{`// ❌ BAD: Hardcoded values
<div style={{ padding: '16px', margin: '8px' }}>

// ✅ GOOD: CSS variables
<div style={{
  padding: 'var(--spacing-md)',
  margin: 'var(--spacing-sm)'
}}>

// ✅ GOOD: Tailwind classes
<div className="p-md m-sm">`}</code>
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Theme Configuration</h2>

        <p className="mb-4">
          Fidus supports light and dark themes out of the box:
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Setting Up Dark Mode</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  // ... rest of config
}

// In your root layout or theme provider
<html className={theme === 'dark' ? 'dark' : ''}>
  <body>{children}</body>
</html>`}</code>
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Dark Mode CSS Variables</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`/* globals.css */
:root {
  --color-background: #ffffff;
  --color-foreground: #000000;
}

.dark {
  --color-background: #0f172a;
  --color-foreground: #f1f5f9;
}`}</code>
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Form Example</h2>

        <p className="mb-4">
          Here is a complete example of a form using Fidus components:
        </p>

        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
          <code>{`import { useState } from 'react';
import { Button } from '@fidus/ui/button';
import { Alert } from '@fidus/ui/alert';;

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitted && (
        <Alert variant="success">
          Thank you! Your message has been sent.
        </Alert>
      )}

      <Input
        label="Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        required
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
        required
      />

      <Textarea
        label="Message"
        value={formData.message}
        onChange={(e) =>
          setFormData({ ...formData, message: e.target.value })
        }
        rows={5}
        required
      />

      <Button type="submit" variant="primary">
        Send Message
      </Button>
    </form>
  );
}`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Testing Components</h2>

        <p className="mb-4">
          Fidus components are designed to be easily testable with common testing libraries:
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Using Vitest and React Testing Library</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@fidus/ui/button';;
import { describe, it, expect, vi } from 'vitest';

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
});`}</code>
          </pre>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Test IDs</h3>
          <p>
            All Fidus components include <code className="bg-gray-100 px-2 py-1 rounded">data-test-id</code> attributes
            for easy selection in tests. Use single values without spaces:
          </p>
          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm mt-3">
            <code>{`// ✅ GOOD: Single value
<Button data-test-id="submit-button">Submit</Button>

// ❌ BAD: Multiple values
<Button data-test-id="submit button">Submit</Button>`}</code>
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/components/button"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Explore Components</h3>
            <p className="text-sm text-gray-600">
              Browse the complete component library
            </p>
          </Link>

          <Link
            href="/patterns/form-validation"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Learn Patterns</h3>
            <p className="text-sm text-gray-600">
              Common patterns and best practices
            </p>
          </Link>

          <Link
            href="/getting-started/design-philosophy"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Design Philosophy</h3>
            <p className="text-sm text-gray-600">
              Understand AI-Driven UI principles
            </p>
          </Link>
        </div>
      </section>

      <section className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
        <p className="mb-4">
          If you encounter issues or have questions about using Fidus Design System:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Check the component documentation for API details</li>
          <li>Review the patterns section for common use cases</li>
          <li>Visit the contributing guide to report bugs or request features</li>
        </ul>
        <Link href="/getting-started/contributing" className="text-blue-600 hover:underline mt-4 inline-block">
          View contributing guide →
        </Link>
      </section>
    </div>
  );
}
