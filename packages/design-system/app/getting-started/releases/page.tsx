'use client';

import { Link, Stack, Badge, Divider, Container } from '@fidus/ui';
import { Calendar, Package, GitBranch, CheckCircle2, Sparkles } from 'lucide-react';

export default function ReleasesPage() {
  return (
    <Container size="lg" className="p-lg">
      <Stack direction="column" gap="xl">
        {/* Header */}
        <Stack direction="column" gap="md">
          <h1 className="text-4xl font-bold text-foreground">Release Notes</h1>
          <p className="text-lg text-muted-foreground">
            Track the evolution of @fidus/ui component library. All notable changes are documented here.
          </p>
        </Stack>

        <Divider />

        {/* Version 1.2.0 */}
        <Stack direction="column" gap="lg" className="border border-border rounded-lg p-lg bg-card">
          <Stack direction="row" gap="md" align="center" className="flex-wrap">
            <h2 className="text-3xl font-bold text-foreground">v1.2.0</h2>
            <Badge variant="success">Latest</Badge>
            <Badge variant="secondary">
              <Sparkles className="w-3 h-3 mr-1" />
              Chat UI Components
            </Badge>
          </Stack>

          <Stack direction="row" gap="md" align="center" className="text-sm text-muted-foreground flex-wrap">
            <Stack direction="row" gap="xs" align="center">
              <Calendar className="w-4 h-4" />
              <span>November 4, 2025</span>
            </Stack>
            <Stack direction="row" gap="xs" align="center">
              <GitBranch className="w-4 h-4" />
              <Link
                href="https://github.com/y-core-engineering/fidus/pull/45"
                variant="primary"
                target="_blank"
              >
                PR #45
              </Link>
            </Stack>
            <Stack direction="row" gap="xs" align="center">
              <Package className="w-4 h-4" />
              <Link
                href="https://www.npmjs.com/package/@fidus/ui/v/1.2.0"
                variant="primary"
                target="_blank"
              >
                NPM Package
              </Link>
            </Stack>
          </Stack>

          <Divider />

          {/* New Components */}
          <Stack direction="column" gap="md">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              New Components
            </h3>

            <Stack direction="column" gap="sm" className="ml-7">
              <Stack direction="column" gap="xs">
                <Link href="/components/chat-interface" variant="primary" className="font-medium">
                  ChatInterface
                </Link>
                <p className="text-sm text-muted-foreground">
                  Complete chat layout with message streaming support, scrollable message list, auto-scroll behavior,
                  and textarea input with keyboard shortcuts (Enter to send, Shift+Enter for newline).
                </p>
              </Stack>

              <Stack direction="column" gap="xs">
                <Link href="/components/message-bubble" variant="primary" className="font-medium">
                  MessageBubble
                </Link>
                <p className="text-sm text-muted-foreground">
                  Chat message component with role-based styling (user right, assistant left), avatars, timestamps,
                  and AI suggestion chips with privacy badges and tooltips.
                </p>
              </Stack>

              <Stack direction="column" gap="xs">
                <Link href="/components/confidence-indicator" variant="primary" className="font-medium">
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
          <Stack direction="column" gap="md">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Enhanced Components
            </h3>

            <Stack direction="column" gap="sm" className="ml-7">
              <Stack direction="column" gap="xs">
                <Link href="/components/opportunity-card" variant="primary" className="font-medium">
                  OpportunityCard
                </Link>
                <p className="text-sm text-muted-foreground">
                  Now supports privacy badges array for displaying multiple privacy levels and data categories.
                </p>
              </Stack>
            </Stack>
          </Stack>

          {/* Build Improvements */}
          <Stack direction="column" gap="md">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Build Improvements
            </h3>

            <Stack direction="column" gap="sm" className="ml-7">
              <p className="text-sm text-muted-foreground">
                Fixed bundling configuration for react-markdown and remark-gfm dependencies, improving build performance
                and reducing bundle size.
              </p>
            </Stack>
          </Stack>

          {/* Technical Details */}
          <Stack direction="column" gap="md">
            <h3 className="text-xl font-semibold text-foreground">Technical Details</h3>

            <Stack direction="column" gap="sm" className="ml-7">
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
          <Stack direction="column" gap="md">
            <h3 className="text-xl font-semibold text-foreground">Real-World Usage</h3>

            <Stack direction="column" gap="sm" className="ml-7">
              <p className="text-sm text-muted-foreground">
                These components are used in production in the{' '}
                <Link href="http://localhost:3000/fidus-memory" variant="primary" target="_blank">
                  Fidus Memory Prototype
                </Link>
                {' '}to provide conversational AI interactions with preference learning and context awareness.
              </p>
            </Stack>
          </Stack>
        </Stack>

        {/* Version 1.1.0 */}
        <Stack direction="column" gap="lg" className="border border-border rounded-lg p-lg bg-card opacity-75">
          <Stack direction="row" gap="md" align="center" className="flex-wrap">
            <h2 className="text-2xl font-bold text-foreground">v1.1.0</h2>
            <Badge variant="secondary">Initial Chat Components</Badge>
          </Stack>

          <Stack direction="row" gap="md" align="center" className="text-sm text-muted-foreground flex-wrap">
            <Stack direction="row" gap="xs" align="center">
              <Calendar className="w-4 h-4" />
              <span>November 3, 2025</span>
            </Stack>
            <Stack direction="row" gap="xs" align="center">
              <GitBranch className="w-4 h-4" />
              <Link
                href="https://github.com/y-core-engineering/fidus/pull/39"
                variant="primary"
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
        <Stack direction="column" gap="lg" className="border border-border rounded-lg p-lg bg-card opacity-50">
          <Stack direction="row" gap="md" align="center" className="flex-wrap">
            <h2 className="text-2xl font-bold text-foreground">v1.0.2</h2>
            <Badge variant="secondary">Documentation</Badge>
          </Stack>

          <Stack direction="row" gap="md" align="center" className="text-sm text-muted-foreground flex-wrap">
            <Stack direction="row" gap="xs" align="center">
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
        <Stack direction="column" gap="lg" className="border border-border rounded-lg p-lg bg-card opacity-50">
          <Stack direction="row" gap="md" align="center" className="flex-wrap">
            <h2 className="text-2xl font-bold text-foreground">v1.0.1</h2>
            <Badge variant="secondary">Bug Fixes</Badge>
          </Stack>

          <Stack direction="row" gap="md" align="center" className="text-sm text-muted-foreground flex-wrap">
            <Stack direction="row" gap="xs" align="center">
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
        <Stack direction="column" gap="lg" className="border border-border rounded-lg p-lg bg-card opacity-50">
          <Stack direction="row" gap="md" align="center" className="flex-wrap">
            <h2 className="text-2xl font-bold text-foreground">v1.0.0</h2>
            <Badge variant="success">Initial Release</Badge>
          </Stack>

          <Stack direction="row" gap="md" align="center" className="text-sm text-muted-foreground flex-wrap">
            <Stack direction="row" gap="xs" align="center">
              <Calendar className="w-4 h-4" />
              <span>January 1, 2025</span>
            </Stack>
          </Stack>

          <Divider />

          <p className="text-sm text-muted-foreground mb-2">
            Initial component library setup with core components:
          </p>

          <Stack direction="column" gap="xs" className="ml-4">
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
        <Stack direction="column" gap="md" className="border-t border-border pt-lg">
          <h3 className="text-lg font-semibold text-foreground">View on GitHub</h3>
          <p className="text-sm text-muted-foreground">
            For complete changelog and technical details, see the{' '}
            <Link
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/CHANGELOG.md"
              variant="primary"
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
