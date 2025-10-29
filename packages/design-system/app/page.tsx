'use client';

import { Button } from '@fidus/ui';
import Link from 'next/link';
import { Code, Palette, Book, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="pt-12">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-6xl font-bold tracking-tight">
            Fidus Design System
          </h1>
          <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive design system for building privacy-first, AI-driven user interfaces.
            Built with React, TypeScript, and Tailwind CSS.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/getting-started/overview">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/components">
              <Button variant="secondary" size="lg">
                View Components
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Start Cards */}
      <section>
        <h2 className="mb-8 text-center text-3xl font-bold">
          Quick Start
        </h2>
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {/* For Designers */}
          <Link
            href="/getting-started/for-designers"
            className="group block p-6 border border-border rounded-lg hover:border-primary transition-colors bg-card"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
              For Designers
            </h3>
            <p className="mb-4 text-muted-foreground">
              Learn about design principles, token usage, and AI-driven UI paradigms.
            </p>
            <div className="flex items-center text-primary">
              <span className="text-sm font-medium">Learn more</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Link>

          {/* For Developers */}
          <Link
            href="/getting-started/for-developers"
            className="group block p-6 border border-border rounded-lg hover:border-primary transition-colors bg-card"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
              For Developers
            </h3>
            <p className="mb-4 text-muted-foreground">
              Installation guide, component APIs, and code examples to get started quickly.
            </p>
            <div className="flex items-center text-primary">
              <span className="text-sm font-medium">Learn more</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Link>

          {/* For Product Managers */}
          <Link
            href="/getting-started/overview"
            className="group block p-6 border border-border rounded-lg hover:border-primary transition-colors bg-card"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Book className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
              Overview
            </h3>
            <p className="mb-4 text-muted-foreground">
              Understand capabilities, constraints, and the overall design philosophy.
            </p>
            <div className="flex items-center text-primary">
              <span className="text-sm font-medium">Learn more</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Components & Patterns */}
      <section>
        <h2 className="mb-8 text-center text-3xl font-bold">
          Featured Components & Patterns
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Opportunity Card */}
          <Link
            href="/components/opportunity-card"
            className="group block p-6 border border-border rounded-lg hover:border-primary transition-colors bg-card"
          >
            <div className="mb-3">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-primary/10 text-primary">
                Component
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
              Opportunity Card
            </h3>
            <p className="text-sm text-muted-foreground">
              Unique to Fidus: Dynamic cards for the AI-driven opportunity surface.
            </p>
          </Link>

          {/* Button */}
          <Link
            href="/components/button"
            className="group block p-6 border border-border rounded-lg hover:border-primary transition-colors bg-card"
          >
            <div className="mb-3">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-primary/10 text-primary">
                Component
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
              Button
            </h3>
            <p className="text-sm text-muted-foreground">
              Versatile button component with multiple variants and states.
            </p>
          </Link>

          {/* Modal */}
          <Link
            href="/components/modal"
            className="group block p-6 border border-border rounded-lg hover:border-primary transition-colors bg-card"
          >
            <div className="mb-3">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-primary/10 text-primary">
                Component
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
              Modal
            </h3>
            <p className="text-sm text-muted-foreground">
              Accessible modal dialog for focused interactions.
            </p>
          </Link>

          {/* Onboarding Pattern */}
          <Link
            href="/patterns/onboarding"
            className="group block p-6 border border-border rounded-lg hover:border-primary transition-colors bg-card"
          >
            <div className="mb-3">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-success/10 text-success">
                Pattern
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
              Onboarding
            </h3>
            <p className="text-sm text-muted-foreground">
              Privacy-first onboarding flow with 8-step wizard.
            </p>
          </Link>

          {/* Search & Filtering Pattern */}
          <Link
            href="/patterns/search-filtering"
            className="group block p-6 border border-border rounded-lg hover:border-primary transition-colors bg-card"
          >
            <div className="mb-3">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-success/10 text-success">
                Pattern
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
              Search & Filtering
            </h3>
            <p className="text-sm text-muted-foreground">
              AI-powered search with traditional filtering options.
            </p>
          </Link>

          {/* Settings Pattern */}
          <Link
            href="/patterns/settings"
            className="group block p-6 border border-border rounded-lg hover:border-primary transition-colors bg-card"
          >
            <div className="mb-3">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-success/10 text-success">
                Pattern
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
              Settings Interface
            </h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive settings with 9 categories and privacy report.
            </p>
          </Link>
        </div>
      </section>

      {/* Recent Updates */}
      <section>
        <h2 className="mb-8 text-center text-3xl font-bold">
          Recent Updates
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold">Global Search Implementation</h3>
              <span className="text-sm text-muted-foreground">2025-01-29</span>
            </div>
            <p className="text-muted-foreground">
              Added comprehensive search functionality with keyboard shortcuts (⌘K),
              category filtering, and recent searches.
            </p>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold">Form Components Complete</h3>
              <span className="text-sm text-muted-foreground">2025-01-28</span>
            </div>
            <p className="text-muted-foreground">
              Implemented all 9 form components: Text Input, Text Area, Checkbox,
              Radio Button, Toggle Switch, Select, Date Picker, Time Picker, and File Upload.
            </p>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold">Pattern Documentation</h3>
              <span className="text-sm text-muted-foreground">2025-01-27</span>
            </div>
            <p className="text-muted-foreground">
              Completed documentation for 10 UX patterns including Onboarding,
              Search & Filtering, and Multi-Tenancy.
            </p>
          </div>

          <div className="text-center mt-8">
            <Link href="/resources/contributing">
              <Button variant="tertiary">
                View Full Changelog
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
