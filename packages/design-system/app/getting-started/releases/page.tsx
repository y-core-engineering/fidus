'use client';

import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';
import { Badge } from '@fidus/ui/badge';
import { Divider } from '@fidus/ui/divider';
import { Container } from '@fidus/ui/container';;
import { Calendar, Package, GitBranch, CheckCircle2, Sparkles } from 'lucide-react';

export default function ReleasesPage() {
  return (
    <Container size="lg" padding="lg">
      <Stack direction="vertical" spacing="xl">
        {/* Header */}
        <Stack direction="vertical" spacing="md">
          <h1 className="text-4xl font-bold text-foreground">Release Notes</h1>
          <p className="text-lg text-muted-foreground">
            Track the evolution of @fidus/ui component library. All notable changes are documented here.
          </p>
        </Stack>

        <Divider />

        {/* Version 1.7.1 */}
        <Stack direction="vertical" spacing="lg" className="border-2 border-primary rounded-lg p-lg bg-gradient-to-br from-primary/5 to-transparent">
          <Stack direction="horizontal" spacing="md" align="center" className="flex-wrap">
            <h2 className="text-3xl font-bold text-foreground">v1.7.1</h2>
            <Badge variant="success">Latest</Badge>
            <Badge variant="info">
              <Sparkles className="w-3 h-3 mr-1" />
              Phase 3 Tree-Shaking
            </Badge>
          </Stack>

          <Stack direction="horizontal" spacing="md" align="center" className="text-sm text-muted-foreground flex-wrap">
            <Stack direction="horizontal" spacing="xs" align="center">
              <Calendar className="w-4 h-4" />
              <span>November 11, 2025</span>
            </Stack>
            <Stack direction="horizontal" spacing="xs" align="center">
              <GitBranch className="w-4 h-4" />
              <Link
                href="https://github.com/y-core-engineering/fidus/pull/70"
                target="_blank"
              >
                PR #70
              </Link>
            </Stack>
            <Stack direction="horizontal" spacing="xs" align="center">
              <Package className="w-4 h-4" />
              <Link
                href="https://www.npmjs.com/package/@fidus/ui"
                target="_blank"
              >
                NPM Package
              </Link>
            </Stack>
          </Stack>

          <Divider />

          {/* Tree-Shaking Configuration */}
          <Stack direction="vertical" spacing="md">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Tree-Shaking Configuration
            </h3>

            <Stack direction="vertical" spacing="sm" className="ml-7">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-3xl text-error">~370KB</span>
                  <span className="text-sm text-muted-foreground">before</span>
                </div>
                <span className="text-2xl">→</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-3xl text-success">~4KB</span>
                  <span className="text-sm text-muted-foreground">after</span>
                </div>
                <Badge variant="success">95% reduction</Badge>
              </div>

              <Stack direction="vertical" spacing="xs">
                <p className="text-sm text-muted-foreground">
                  ✅ <strong>47 subpath exports</strong> configured (45 components + index + tailwind)
                </p>
                <p className="text-sm text-muted-foreground">
                  ✅ <strong>sideEffects: false</strong> for aggressive tree-shaking
                </p>
                <p className="text-sm text-muted-foreground">
                  ✅ <strong>Automated export generation</strong> script at <code className="bg-muted px-1 py-0.5 rounded text-xs">scripts/generate-exports.ts</code>
                </p>
                <p className="text-sm text-muted-foreground">
                  ✅ <strong>Per-component bundles</strong> with TypeScript definitions (.d.ts, .d.mts)
                </p>
              </Stack>

              <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium mb-2">Recommended Usage:</p>
                <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
                  <code>{`// ✅ Optimized (production)
import { Button } from '@fidus/ui/button';
import { Stack } from '@fidus/ui/stack';
import { Alert } from '@fidus/ui/alert';

// ✅ Still works (development)
import { Button } from '@fidus/ui/button';
import { Stack } from '@fidus/ui/stack';
import { Alert } from '@fidus/ui/alert';;`}</code>
                </pre>
              </div>
            </Stack>
          </Stack>

          {/* Documentation */}
          <Stack direction="vertical" spacing="md">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Documentation & Integration
            </h3>

            <Stack direction="vertical" spacing="sm" className="ml-7 text-sm text-muted-foreground">
              <p>✅ Comprehensive tree-shaking guide in README with bundle size comparison</p>
              <p>✅ React Hook Form integration examples with basic validation</p>
              <p>✅ Zod schema validation examples for type-safe forms</p>
              <p>✅ Subpath import reference for all 45 components</p>
              <p>✅ Form component compatibility documentation</p>
            </Stack>
          </Stack>

          {/* Migration */}
          <Stack direction="vertical" spacing="md">
            <h3 className="text-xl font-semibold text-foreground">Migration</h3>
            <div className="ml-7 p-4 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm font-medium text-success-foreground">✅ Zero breaking changes</p>
              <p className="text-sm text-muted-foreground mt-2">
                Existing barrel imports continue to work. Gradually adopt subpath imports for production builds
                to benefit from tree-shaking. All components remain fully backward compatible.
              </p>
            </div>
          </Stack>
        </Stack>

        {/* Version 1.6.0 */}
        <Stack direction="vertical" spacing="lg" className="border border-border rounded-lg p-lg bg-card">
          <Stack direction="horizontal" spacing="md" align="center" className="flex-wrap">
            <h2 className="text-3xl font-bold text-foreground">v1.6.0</h2>
            <Badge variant="info">
              <Sparkles className="w-3 h-3 mr-1" />
              Phase 2 SSR Enhancements
            </Badge>
          </Stack>

          <Stack direction="horizontal" spacing="md" align="center" className="text-sm text-muted-foreground flex-wrap">
            <Stack direction="horizontal" spacing="xs" align="center">
              <Calendar className="w-4 h-4" />
              <span>November 10, 2025</span>
            </Stack>
            <Stack direction="horizontal" spacing="xs" align="center">
              <GitBranch className="w-4 h-4" />
              <Link
                href="https://github.com/y-core-engineering/fidus/pull/68"
                target="_blank"
              >
                PR #68
              </Link>
            </Stack>
            <Stack direction="horizontal" spacing="xs" align="center">
              <Package className="w-4 h-4" />
              <Link
                href="https://www.npmjs.com/package/@fidus/ui/v/1.6.0"
                target="_blank"
              >
                NPM Package
              </Link>
            </Stack>
          </Stack>

          <Divider />

          {/* Example Projects */}
          <Stack direction="vertical" spacing="md">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Example Projects (3 complete implementations)
            </h3>

            <Stack direction="vertical" spacing="sm" className="ml-7">
              <Stack direction="vertical" spacing="xs">
                <span className="font-medium">Next.js 14 App Router</span>
                <p className="text-sm text-muted-foreground">
                  Complete example at <code className="bg-muted px-1 py-0.5 rounded text-xs">/examples/nextjs-app-router</code> showcasing
                  15+ components with Tailwind CSS integration and comprehensive README.
                </p>
              </Stack>

              <Stack direction="vertical" spacing="xs">
                <span className="font-medium">Next.js Pages Router</span>
                <p className="text-sm text-muted-foreground">
                  Traditional SSR example at <code className="bg-muted px-1 py-0.5 rounded text-xs">/examples/nextjs-pages-router</code> demonstrating
                  server-side rendering with classic Next.js architecture.
                </p>
              </Stack>

              <Stack direction="vertical" spacing="xs">
                <span className="font-medium">Vite + React SPA</span>
                <p className="text-sm text-muted-foreground">
                  Client-side rendering example at <code className="bg-muted px-1 py-0.5 rounded text-xs">/examples/vite-react</code> showing
                  fast development workflow with Vite build tooling.
                </p>
              </Stack>
            </Stack>
          </Stack>

          {/* SSR Testing */}
          <Stack direction="vertical" spacing="md">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Comprehensive SSR Testing
            </h3>

            <Stack direction="vertical" spacing="sm" className="ml-7">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-2xl text-primary">133</span>
                <span className="text-sm text-muted-foreground">SSR compatibility tests (up from 55) - 142% increase</span>
              </div>
              <p className="text-sm text-muted-foreground">
                All 40+ components tested with <code className="bg-muted px-1 py-0.5 rounded text-xs">renderToString()</code> compatibility.
                Verified Portal components (Toast, Modal, Drawer) don't crash during SSR. 100% test pass rate across all component variants and edge cases.
              </p>
            </Stack>
          </Stack>

          {/* Documentation */}
          <Stack direction="vertical" spacing="md">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Documentation Improvements
            </h3>

            <Stack direction="vertical" spacing="sm" className="ml-7 text-sm text-muted-foreground">
              <p>✅ Examples README with quick-start guide and framework-specific notes</p>
              <p>✅ Updated @fidus/ui README with comprehensive SSR section</p>
              <p>✅ Component API usage patterns verified in real Next.js/Vite apps</p>
              <p>✅ SSR test suite documents expected behavior for all components</p>
            </Stack>
          </Stack>

          {/* Key Insights */}
          <Stack direction="vertical" spacing="md">
            <h3 className="text-xl font-semibold text-foreground">Key Insights</h3>
            <Stack direction="vertical" spacing="sm" className="ml-7 text-sm text-muted-foreground">
              <p>• Portal components (Radix UI) correctly return empty HTML in SSR (expected behavior)</p>
              <p>• Client-side components with <code className="bg-muted px-1 py-0.5 rounded text-xs">'use client'</code> still render structure safely in SSR</p>
              <p>• All 16 SSR-optimized components work seamlessly across frameworks</p>
            </Stack>
          </Stack>

          {/* Migration */}
          <Stack direction="vertical" spacing="md">
            <h3 className="text-xl font-semibold text-foreground">Migration</h3>
            <div className="ml-7 p-4 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm font-medium text-success-foreground">✅ No code changes required - this is a documentation and testing release</p>
              <p className="text-sm text-muted-foreground mt-2">
                Use example projects as reference for integrating @fidus/ui in your app. All existing features remain fully backward compatible.
              </p>
            </div>
          </Stack>
        </Stack>

        {/* Version 1.5.0 */}
        <Stack direction="vertical" spacing="lg" className="border border-border rounded-lg p-lg bg-card">
          <Stack direction="horizontal" spacing="md" align="center" className="flex-wrap">
            <h2 className="text-3xl font-bold text-foreground">v1.5.0</h2>
            <Badge variant="info">SSR Optimization</Badge>
          </Stack>

          <Stack direction="horizontal" spacing="md" align="center" className="text-sm text-muted-foreground flex-wrap">
            <Stack direction="horizontal" spacing="xs" align="center">
              <Calendar className="w-4 h-4" />
              <span>November 8, 2025</span>
            </Stack>
            <Stack direction="horizontal" spacing="xs" align="center">
              <GitBranch className="w-4 h-4" />
              <Link
                href="https://github.com/y-core-engineering/fidus/pull/67"
                target="_blank"
              >
                PR #67
              </Link>
            </Stack>
            <Stack direction="horizontal" spacing="xs" align="center">
              <Package className="w-4 h-4" />
              <Link
                href="https://www.npmjs.com/package/@fidus/ui/v/1.5.0"
                target="_blank"
              >
                NPM Package
              </Link>
            </Stack>
          </Stack>

          <Divider />

          <Stack direction="vertical" spacing="md">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              SSR-Optimized Components (16 total)
            </h3>

            <Stack direction="vertical" spacing="sm" className="ml-7 text-sm text-muted-foreground">
              <p><strong>Phase 1 (12 components):</strong> Alert, Banner, Chip, DetailCard, Checkbox, RadioButton, ToggleSwitch, ErrorState, ConfidenceIndicator, Avatar, Breadcrumbs, Pagination</p>
              <p><strong>Phase 2 (4 components):</strong> TextInput, TextArea, FileUpload, TimePicker</p>
              <p className="mt-2">~25-28% reduction in client-side JavaScript bundle. Improved Core Web Vitals (FCP, LCP, TTI) for Next.js 14+ App Router, Remix, and Gatsby.</p>
            </Stack>
          </Stack>
        </Stack>

        {/* Version 1.2.0 */}
        <Stack direction="vertical" spacing="lg" className="border border-border rounded-lg p-lg bg-card">
          <Stack direction="horizontal" spacing="md" align="center" className="flex-wrap">
            <h2 className="text-3xl font-bold text-foreground">v1.2.0</h2>
            <Badge variant="info">
              <Sparkles className="w-3 h-3 mr-1" />
              Chat UI Components
            </Badge>
          </Stack>

          <Stack direction="horizontal" spacing="md" align="center" className="text-sm text-muted-foreground flex-wrap">
            <Stack direction="horizontal" spacing="xs" align="center">
              <Calendar className="w-4 h-4" />
              <span>November 4, 2025</span>
            </Stack>
            <Stack direction="horizontal" spacing="xs" align="center">
              <GitBranch className="w-4 h-4" />
              <Link
                href="https://github.com/y-core-engineering/fidus/pull/45"
               
                target="_blank"
              >
                PR #45
              </Link>
            </Stack>
            <Stack direction="horizontal" spacing="xs" align="center">
              <Package className="w-4 h-4" />
              <Link
                href="https://www.npmjs.com/package/@fidus/ui/v/1.2.0"
               
                target="_blank"
              >
                NPM Package
              </Link>
            </Stack>
          </Stack>

          <Divider />

          {/* New Components */}
          <Stack direction="vertical" spacing="md">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              New Components
            </h3>

            <Stack direction="vertical" spacing="sm" className="ml-7">
              <Stack direction="vertical" spacing="xs">
                <Link href="/components/chat-interface" className="font-medium">
                  ChatInterface
                </Link>
                <p className="text-sm text-muted-foreground">
                  Complete chat layout with message streaming support, scrollable message list, auto-scroll behavior,
                  and textarea input with keyboard shortcuts (Enter to send, Shift+Enter for newline).
                </p>
              </Stack>

              <Stack direction="vertical" spacing="xs">
                <Link href="/components/message-bubble" className="font-medium">
                  MessageBubble
                </Link>
                <p className="text-sm text-muted-foreground">
                  Chat message component with role-based styling (user right, assistant left), avatars, timestamps,
                  and AI suggestion chips with privacy badges and tooltips.
                </p>
              </Stack>

              <Stack direction="vertical" spacing="xs">
                <Link href="/components/confidence-indicator" className="font-medium">
                  ConfidenceIndicator
                </Link>
                <p className="text-sm text-muted-foreground">
                  ML confidence visualization with color-coded badges (green for high confidence, blue for medium,
                  yellow for learning, gray for uncertain). Automatically integrated into MessageBubble suggestions.
                </p>
              </Stack>
            </Stack>
          </Stack>

          {/* Enhanced Components */}
          <Stack direction="vertical" spacing="md">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Enhanced Components
            </h3>

            <Stack direction="vertical" spacing="sm" className="ml-7">
              <Stack direction="vertical" spacing="xs">
                <Link href="/components/opportunity-card" className="font-medium">
                  OpportunityCard
                </Link>
                <p className="text-sm text-muted-foreground">
                  Now supports privacy badges array for displaying multiple privacy levels and data categories.
                </p>
              </Stack>
            </Stack>
          </Stack>

          {/* Build Improvements */}
          <Stack direction="vertical" spacing="md">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Build Improvements
            </h3>

            <Stack direction="vertical" spacing="sm" className="ml-7">
              <p className="text-sm text-muted-foreground">
                Fixed bundling configuration for react-markdown and remark-gfm dependencies, improving build performance
                and reducing bundle size.
              </p>
            </Stack>
          </Stack>

          {/* Technical Details */}
          <Stack direction="vertical" spacing="md">
            <h3 className="text-xl font-semibold text-foreground">Technical Details</h3>

            <Stack direction="vertical" spacing="sm" className="ml-7">
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>All components built with 100% Fidus UI primitives (Stack, Chip, Avatar, Button)</li>
                <li>Design tokens for consistent spacing (p-md, gap-sm, gap-xs)</li>
                <li>Comprehensive TypeScript types with Zod schemas for runtime validation</li>
                <li>72 new tests added (21 MessageBubble + 21 ChatInterface + 30 ConfidenceIndicator)</li>
                <li>Full accessibility support with ARIA labels and keyboard navigation</li>
                <li>CVA (class-variance-authority) for component variants</li>
              </ul>
            </Stack>
          </Stack>

          {/* Real-World Usage */}
          <Stack direction="vertical" spacing="md">
            <h3 className="text-xl font-semibold text-foreground">Real-World Usage</h3>

            <Stack direction="vertical" spacing="sm" className="ml-7">
              <p className="text-sm text-muted-foreground">
                These components are used in production in the{' '}
                <Link href="http://localhost:3000/fidus-memory" target="_blank">
                  Fidus Memory Prototype
                </Link>
                {' '}to provide conversational AI interactions with preference learning and context awareness.
              </p>
            </Stack>
          </Stack>
        </Stack>

        {/* Version 1.1.0 */}
        <Stack direction="vertical" spacing="lg" className="border border-border rounded-lg p-lg bg-card opacity-75">
          <Stack direction="horizontal" spacing="md" align="center" className="flex-wrap">
            <h2 className="text-2xl font-bold text-foreground">v1.1.0</h2>
            <Badge variant="info">Initial Chat Components</Badge>
          </Stack>

          <Stack direction="horizontal" spacing="md" align="center" className="text-sm text-muted-foreground flex-wrap">
            <Stack direction="horizontal" spacing="xs" align="center">
              <Calendar className="w-4 h-4" />
              <span>November 3, 2025</span>
            </Stack>
            <Stack direction="horizontal" spacing="xs" align="center">
              <GitBranch className="w-4 h-4" />
              <Link
                href="https://github.com/y-core-engineering/fidus/pull/39"
               
                target="_blank"
              >
                PR #39
              </Link>
            </Stack>
          </Stack>

          <Divider />

          <p className="text-sm text-muted-foreground">
            Initial implementation of chat UI components (MessageBubble, ChatInterface, ConfidenceIndicator)
            with basic functionality and comprehensive documentation.
          </p>
        </Stack>

        {/* Version 1.0.2 */}
        <Stack direction="vertical" spacing="lg" className="border border-border rounded-lg p-lg bg-card opacity-50">
          <Stack direction="horizontal" spacing="md" align="center" className="flex-wrap">
            <h2 className="text-2xl font-bold text-foreground">v1.0.2</h2>
            <Badge variant="info">Documentation</Badge>
          </Stack>

          <Stack direction="horizontal" spacing="md" align="center" className="text-sm text-muted-foreground flex-wrap">
            <Stack direction="horizontal" spacing="xs" align="center">
              <Calendar className="w-4 h-4" />
              <span>October 2025</span>
            </Stack>
          </Stack>

          <Divider />

          <p className="text-sm text-muted-foreground">
            Improved README documentation with component table. Reorganized component list into structured tables
            with descriptions for better readability and discoverability.
          </p>
        </Stack>

        {/* Version 1.0.1 */}
        <Stack direction="vertical" spacing="lg" className="border border-border rounded-lg p-lg bg-card opacity-50">
          <Stack direction="horizontal" spacing="md" align="center" className="flex-wrap">
            <h2 className="text-2xl font-bold text-foreground">v1.0.1</h2>
            <Badge variant="info">Bug Fixes</Badge>
          </Stack>

          <Stack direction="horizontal" spacing="md" align="center" className="text-sm text-muted-foreground flex-wrap">
            <Stack direction="horizontal" spacing="xs" align="center">
              <Calendar className="w-4 h-4" />
              <span>January 1, 2025</span>
            </Stack>
          </Stack>

          <Divider />

          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
            <li>Corrected README.md documentation with accurate component list (41 components)</li>
            <li>Removed false information from README.md (non-existent Discord link, CSS imports)</li>
            <li>Fixed GitHub Actions workflow permissions for GitHub Release creation</li>
          </ul>
        </Stack>

        {/* Version 1.0.0 */}
        <Stack direction="vertical" spacing="lg" className="border border-border rounded-lg p-lg bg-card opacity-50">
          <Stack direction="horizontal" spacing="md" align="center" className="flex-wrap">
            <h2 className="text-2xl font-bold text-foreground">v1.0.0</h2>
            <Badge variant="success">Initial Release</Badge>
          </Stack>

          <Stack direction="horizontal" spacing="md" align="center" className="text-sm text-muted-foreground flex-wrap">
            <Stack direction="horizontal" spacing="xs" align="center">
              <Calendar className="w-4 h-4" />
              <span>January 1, 2025</span>
            </Stack>
          </Stack>

          <Divider />

          <p className="text-sm text-muted-foreground mb-2">
            Initial component library setup with core components:
          </p>

          <Stack direction="vertical" spacing="xs" className="ml-4">
            <p className="text-sm text-muted-foreground">
              • Button, Card, Input, Select, Toast, Dialog, Dropdown Menu
            </p>
            <p className="text-sm text-muted-foreground">
              • Progress, Tabs, Tooltip, Calendar components
            </p>
            <p className="text-sm text-muted-foreground">
              • Responsive design with mobile-first approach
            </p>
            <p className="text-sm text-muted-foreground">
              • Zod validation schemas and comprehensive TypeScript types
            </p>
            <p className="text-sm text-muted-foreground">
              • npm package publishing infrastructure
            </p>
          </Stack>
        </Stack>

        {/* Footer */}
        <Stack direction="vertical" spacing="md" className="border-t border-border pt-lg">
          <h3 className="text-lg font-semibold text-foreground">View on GitHub</h3>
          <p className="text-sm text-muted-foreground">
            For complete changelog and technical details, see the{' '}
            <Link
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/CHANGELOG.md"
             
              target="_blank"
            >
              CHANGELOG.md
            </Link>
            {' '}in the @fidus/ui package repository.
          </p>
        </Stack>
      </Stack>
    </Container>
  );
}
