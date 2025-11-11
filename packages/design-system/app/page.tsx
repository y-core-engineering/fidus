'use client';

import { Button } from '@fidus/ui/button';;
import Link from 'next/link';
import { Code, Palette, Book, ArrowRight, Sparkles, Shield, Network, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="pt-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-primary bg-primary/5 text-black dark:text-white text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            AI-Driven Design System
          </div>
          <h1 className="mb-6 text-6xl font-bold tracking-tight">
            Fidus Design System
          </h1>
          <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
            Where the <strong>LLM decides the UI</strong>. Build privacy-first, context-adaptive interfaces
            that respond intelligently to user needs.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/getting-started/overview">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/architecture/ui-decision-layer">
              <Button variant="secondary" size="lg">
                Explore Architecture
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What Makes Fidus Unique */}
      <section>
        <div className="text-center mb-12">
          <h2 className="mb-4 text-4xl font-bold">
            What Makes Fidus Unique?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Fidus isn't just another component library. It's a fundamentally different approach
            to building user interfaces.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {/* AI-Driven UI Paradigm */}
          <div className="p-8 border-2 border-primary rounded-xl bg-gradient-to-br from-primary/5 to-transparent">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">AI-Driven UI Paradigm</h3>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              No fixed screens. No predetermined flows. The <strong>LLM analyzes user context</strong>
              (time, location, history, intent) and dynamically decides what UI to render—form, chat,
              widget, or wizard.
            </p>
            <Link href="/foundations/ai-driven-ui" className="inline-flex items-center text-primary font-medium hover:underline">
              Learn the paradigm
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* UI Decision Layer */}
          <div className="p-8 border-2 border-primary rounded-xl bg-gradient-to-br from-primary/5 to-transparent">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
              <Network className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">UI Decision Layer</h3>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              The backend doesn't just send data—it <strong>decides which UI component to render</strong>.
              LangGraph agents orchestrate the interface, bridging backend logic with frontend components
              through a unified API.
            </p>
            <Link href="/architecture/ui-decision-layer" className="inline-flex items-center text-primary font-medium hover:underline">
              Explore architecture
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Privacy-First */}
          <div className="p-8 border-2 border-border rounded-xl hover:border-primary transition-colors">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-success/20">
              <Shield className="h-7 w-7 text-success" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">Privacy-First Design</h3>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              Local-first data storage. End-to-end encryption. User owns and controls all data.
              GDPR-compliant by design. Privacy isn't a feature—it's the foundation.
            </p>
            <Link href="/foundations/privacy-ux" className="inline-flex items-center text-primary font-medium hover:underline">
              Privacy principles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Event-Driven Architecture */}
          <div className="p-8 border-2 border-border rounded-xl hover:border-primary transition-colors">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-warning/20">
              <Zap className="h-7 w-7 text-warning" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">Event-Driven & Real-Time</h3>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              WebSocket connections for real-time opportunities. Server-sent events for notifications.
              Proactive opportunities surface when relevant, not when hardcoded.
            </p>
            <Link href="/architecture/frontend-architecture" className="inline-flex items-center text-primary font-medium hover:underline">
              Frontend architecture
              <ArrowRight className="ml-2 h-4 w-4" />
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

      {/* Featured: Architecture & Patterns First */}
      <section>
        <h2 className="mb-8 text-center text-3xl font-bold">
          Core Architecture & Unique Patterns
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* UI Decision Layer - MOST IMPORTANT */}
          <Link
            href="/architecture/ui-decision-layer"
            className="group block p-6 border-2 border-primary rounded-lg hover:shadow-lg transition-all bg-gradient-to-br from-primary/5 to-transparent"
          >
            <div className="mb-3">
              <span className="inline-block px-3 py-1 text-xs font-bold rounded bg-primary text-black">
                ⭐ CORE ARCHITECTURE
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
              UI Decision Layer
            </h3>
            <p className="text-sm text-muted-foreground">
              How the backend decides which UI to render. The heart of Fidus's AI-driven approach.
            </p>
          </Link>

          {/* Opportunity Surface */}
          <Link
            href="/patterns/opportunity-surface"
            className="group block p-6 border-2 border-primary rounded-lg hover:shadow-lg transition-all bg-gradient-to-br from-primary/5 to-transparent"
          >
            <div className="mb-3">
              <span className="inline-block px-3 py-1 text-xs font-bold rounded bg-primary text-black">
                ⭐ UNIQUE PATTERN
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
              Opportunity Surface
            </h3>
            <p className="text-sm text-muted-foreground">
              Dynamic dashboard where opportunities appear based on context, not hardcoded rules.
            </p>
          </Link>

          {/* Opportunity Card */}
          <Link
            href="/components/opportunity-card"
            className="group block p-6 border-2 border-primary rounded-lg hover:shadow-lg transition-all bg-gradient-to-br from-primary/5 to-transparent"
          >
            <div className="mb-3">
              <span className="inline-block px-3 py-1 text-xs font-bold rounded bg-primary text-black">
                ⭐ UNIQUE COMPONENT
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
              Opportunity Card
            </h3>
            <p className="text-sm text-muted-foreground">
              The UI building block for the Opportunity Surface. Context-driven, user-dismissible.
            </p>
          </Link>

          {/* Component Registry */}
          <Link
            href="/architecture/component-registry"
            className="group block p-6 border border-border rounded-lg hover:border-primary transition-colors bg-card"
          >
            <div className="mb-3">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-primary/10 text-primary">
                Architecture
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
              Component Registry
            </h3>
            <p className="text-sm text-muted-foreground">
              Backend-Frontend bridge. Maps UI decisions to React components.
            </p>
          </Link>

          {/* API Response Schema */}
          <Link
            href="/architecture/api-response-schema"
            className="group block p-6 border border-border rounded-lg hover:border-primary transition-colors bg-card"
          >
            <div className="mb-3">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-primary/10 text-primary">
                Architecture
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
              API Response Schema
            </h3>
            <p className="text-sm text-muted-foreground">
              Structured format for UI metadata. How backend tells frontend what to render.
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
              Privacy-first onboarding flow with 8-step wizard. Builds trust from day one.
            </p>
          </Link>
        </div>

        {/* Button to view all components */}
        <div className="text-center mt-10">
          <Link href="/components">
            <Button variant="secondary" size="lg">
              View All Components
            </Button>
          </Link>
        </div>
      </section>

      {/* Recent Updates */}
      <section>
        <h2 className="mb-8 text-center text-3xl font-bold">
          Recent Updates
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="p-6 border-2 border-primary rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">@fidus/ui v1.7.1 - Tree-Shaking</h3>
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-success text-black">
                  Latest
                </span>
              </div>
              <span className="text-sm text-muted-foreground">2025-11-11</span>
            </div>
            <p className="text-muted-foreground mb-3">
              Phase 3 Tree-Shaking Optimization: 95% bundle size reduction for single component imports
              (from ~370KB to ~4KB). 47 subpath exports, automated export generation, React Hook Form
              integration docs. Production-ready tree-shaking with zero breaking changes.
            </p>
            <Link href="/getting-started/releases" className="inline-flex items-center text-primary font-medium hover:underline">
              View release details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold">@fidus/ui v1.6.0 - SSR Enhancements</h3>
              <span className="text-sm text-muted-foreground">2025-11-10</span>
            </div>
            <p className="text-muted-foreground">
              Phase 2 SSR Enhancements: 3 complete example projects (Next.js App Router, Pages Router, Vite),
              133 SSR compatibility tests (142% increase), comprehensive documentation for SSR integration.
              All 40+ components tested for server-side rendering safety.
            </p>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold">@fidus/ui v1.5.0 - SSR Optimization</h3>
              <span className="text-sm text-muted-foreground">2025-11-08</span>
            </div>
            <p className="text-muted-foreground">
              16 components now SSR-compatible. ~25-28% reduction in client-side JavaScript bundle.
              Improved Core Web Vitals for Next.js, Remix, and Gatsby applications.
            </p>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold">@fidus/ui v1.2.0 - Chat Components</h3>
              <span className="text-sm text-muted-foreground">2025-11-04</span>
            </div>
            <p className="text-muted-foreground">
              Chat UI components: MessageBubble with privacy badges, ChatInterface with streaming support,
              and ConfidenceIndicator for ML confidence visualization.
            </p>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold">Navigation Restructure</h3>
              <span className="text-sm text-muted-foreground">2025-10-29</span>
            </div>
            <p className="text-muted-foreground">
              Reorganized navigation hierarchy to match design concept. Components now properly
              grouped under dedicated section with nested categories.
            </p>
          </div>

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

          <div className="text-center mt-8">
            <Link href="/getting-started/releases">
              <Button variant="tertiary">
                View All Releases
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
