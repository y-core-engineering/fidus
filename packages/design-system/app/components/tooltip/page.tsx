'use client';

import { Tooltip, TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@fidus/ui/tooltip';
import { Button } from '@fidus/ui/button';
import { Stack } from '@fidus/ui/stack';
import { Link } from '@fidus/ui/link';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { Info, HelpCircle, Settings, Save, Share } from 'lucide-react';

export default function TooltipPage() {
  const props = [
    {
      name: 'content',
      type: 'string',
      required: true,
      description: 'Tooltip text content',
    },
    {
      name: 'children',
      type: 'ReactElement',
      required: true,
      description: 'Trigger element',
    },
    {
      name: 'side',
      type: "'top' | 'bottom' | 'left' | 'right'",
      default: "'top'",
      description: 'Position relative to trigger',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end'",
      default: "'center'",
      description: 'Alignment relative to trigger',
    },
    {
      name: 'delayDuration',
      type: 'number',
      default: '200',
      description: 'Delay before showing (ms), range 0-2000',
    },
    {
      name: 'showArrow',
      type: 'boolean',
      default: 'true',
      description: 'Whether to show arrow pointer',
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'Controlled open state',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Open state change handler',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Tooltip</h1>
      <p className="lead">
        A small popup that displays informative text when users hover over or focus on an element, providing additional context without cluttering the interface.
      </p>

      <h2>Basic Example</h2>
      <ComponentPreview code={`<Tooltip content="This is a helpful tooltip">
  <Button>Hover me</Button>
</Tooltip>`}>
        <Tooltip content="This is a helpful tooltip">
          <Button>Hover me</Button>
        </Tooltip>
      </ComponentPreview>

      <h2>Positions</h2>
      <ComponentPreview code={`<Stack direction="horizontal" spacing="md" wrap>
  <Tooltip content="Tooltip on top" side="top">
    <Button>Top</Button>
  </Tooltip>
  <Tooltip content="Tooltip on bottom" side="bottom">
    <Button>Bottom</Button>
  </Tooltip>
  <Tooltip content="Tooltip on left" side="left">
    <Button>Left</Button>
  </Tooltip>
  <Tooltip content="Tooltip on right" side="right">
    <Button>Right</Button>
  </Tooltip>
</Stack>`}>
        <Stack direction="horizontal" spacing="md" wrap>
          <Tooltip content="Tooltip on top" side="top">
            <Button>Top</Button>
          </Tooltip>
          <Tooltip content="Tooltip on bottom" side="bottom">
            <Button>Bottom</Button>
          </Tooltip>
          <Tooltip content="Tooltip on left" side="left">
            <Button>Left</Button>
          </Tooltip>
          <Tooltip content="Tooltip on right" side="right">
            <Button>Right</Button>
          </Tooltip>
        </Stack>
      </ComponentPreview>

      <h2>With Icons</h2>
      <ComponentPreview code={`<Stack direction="horizontal" spacing="md" wrap align="center">
  <Tooltip content="Get more information">
    <Button variant="secondary" size="sm">
      <Info className="h-4 w-4" />
    </Button>
  </Tooltip>
  <Tooltip content="Need help? Click for documentation">
    <Button variant="secondary" size="sm">
      <HelpCircle className="h-4 w-4" />
    </Button>
  </Tooltip>
  <Tooltip content="Open settings panel">
    <Button variant="secondary" size="sm">
      <Settings className="h-4 w-4" />
    </Button>
  </Tooltip>
</Stack>`}>
        <Stack direction="horizontal" spacing="md" wrap align="center">
          <Tooltip content="Get more information">
            <Button variant="secondary" size="sm">
              <Info className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Need help? Click for documentation">
            <Button variant="secondary" size="sm">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Open settings panel">
            <Button variant="secondary" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Save your changes">
            <Button variant="primary" size="sm">
              <Save className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Share with others">
            <Button variant="secondary" size="sm">
              <Share className="h-4 w-4" />
            </Button>
          </Tooltip>
        </Stack>
      </ComponentPreview>

      <h2>Delay Duration</h2>
      <ComponentPreview code={`<Stack spacing="lg">
  <div>
    <p className="text-sm text-muted-foreground mb-sm">Instant (0ms delay)</p>
    <Tooltip content="Appears immediately" delayDuration={0}>
      <Button>Instant</Button>
    </Tooltip>
  </div>
  <div>
    <p className="text-sm text-muted-foreground mb-sm">Default (200ms delay)</p>
    <Tooltip content="Default delay timing">
      <Button>Default</Button>
    </Tooltip>
  </div>
  <div>
    <p className="text-sm text-muted-foreground mb-sm">Slow (500ms delay)</p>
    <Tooltip content="Appears after half a second" delayDuration={500}>
      <Button>Slow</Button>
    </Tooltip>
  </div>
</Stack>`}>
        <Stack spacing="lg">
          <div>
            <p className="text-sm text-muted-foreground mb-sm">Instant (0ms delay)</p>
            <Tooltip content="Appears immediately" delayDuration={0}>
              <Button>Instant</Button>
            </Tooltip>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-sm">Default (200ms delay)</p>
            <Tooltip content="Default delay timing">
              <Button>Default</Button>
            </Tooltip>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-sm">Slow (500ms delay)</p>
            <Tooltip content="Appears after half a second" delayDuration={500}>
              <Button>Slow</Button>
            </Tooltip>
          </div>
        </Stack>
      </ComponentPreview>

      <h2>Without Arrow</h2>
      <ComponentPreview code={`<Tooltip content="Tooltip without an arrow pointer" showArrow={false}>
  <Button>No Arrow</Button>
</Tooltip>`}>
        <Tooltip content="Tooltip without an arrow pointer" showArrow={false}>
          <Button>No Arrow</Button>
        </Tooltip>
      </ComponentPreview>

      <h2>Composable API</h2>
      <ComponentPreview code={`<TooltipProvider>
  <TooltipRoot>
    <TooltipTrigger asChild>
      <Button>Custom Tooltip</Button>
    </TooltipTrigger>
    <TooltipContent side="top">
      Built with composable parts for advanced use cases
    </TooltipContent>
  </TooltipRoot>
</TooltipProvider>`}>
        <TooltipProvider>
          <TooltipRoot>
            <TooltipTrigger asChild>
              <Button>Custom Tooltip</Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Built with composable parts for advanced use cases
            </TooltipContent>
          </TooltipRoot>
        </TooltipProvider>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Composable Parts</h2>
      <div className="not-prose my-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-sm text-left font-semibold">Component</th>
                <th className="p-sm text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-sm font-mono">TooltipProvider</td>
                <td className="p-sm">Global provider for optimal performance</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-sm font-mono">TooltipRoot</td>
                <td className="p-sm">Root container component</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-sm font-mono">TooltipTrigger</td>
                <td className="p-sm">Trigger element wrapper</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-sm font-mono">TooltipContent</td>
                <td className="p-sm">Content container with positioning</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-sm font-mono">Tooltip</td>
                <td className="p-sm">Convenience wrapper component</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To provide supplementary information about an element without cluttering the interface</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For icon-only buttons that need text labels for clarity</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To show full text when displaying truncated content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For keyboard shortcuts or additional context about an action</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep tooltip text concise and informative (ideally under 10 words)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use tooltips for supplementary information only - never for critical content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Position tooltips to avoid covering related content or actionable elements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Ensure tooltip triggers are keyboard-accessible for screen reader users</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use global TooltipProvider for better performance with multiple tooltips</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Uses aria-describedby to associate tooltip with trigger element</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible - focus triggers tooltip, Escape key closes it</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Works with both mouse hover and keyboard focus</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Respects prefers-reduced-motion for animations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Automatically adjusts positioning to stay within viewport</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do's and Don'ts</h2>

      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        {/* Do's */}
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <span className="text-2xl">✓</span> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use concise, helpful text that adds value</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide tooltips for icon-only buttons</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show keyboard shortcuts in tooltips</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use appropriate delay duration for context</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview code={`<Tooltip content="Save (Ctrl+S)">
  <Button variant="primary">
    <Save className="h-4 w-4" />
  </Button>
</Tooltip>`}>
              <Tooltip content="Save (Ctrl+S)">
                <Button variant="primary">
                  <Save className="h-4 w-4" />
                </Button>
              </Tooltip>
            </ComponentPreview>
          </div>
        </div>

        {/* Don'ts */}
        <div className="border-2 border-error rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don't
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use tooltips for critical information or actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Include long paragraphs or complex content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Repeat visible text exactly in tooltip</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use tooltips on mobile without touch consideration</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview code={`<Tooltip content="This is a very long tooltip with way too much information that should probably be displayed in a different component like a popover or modal dialog instead of cramming it all into a tooltip that users might not even see">
  <Button>Bad Example</Button>
</Tooltip>`}>
              <Tooltip content="This is a very long tooltip with way too much information that should probably be displayed in a different component like a popover or modal dialog instead of cramming it all into a tooltip that users might not even see">
                <Button>Bad Example</Button>
              </Tooltip>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/popover"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Popover
          </h3>
          <p className="text-sm text-muted-foreground">For interactive content and complex information</p>
        </Link>
        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">Common trigger element for tooltips</p>
        </Link>
        <Link
          href="/components/badge"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Badge
          </h3>
          <p className="text-sm text-muted-foreground">Use with tooltips to provide additional context</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/tooltip/tooltip.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/"
              external
              showIcon
            >
              ARIA: Tooltip Pattern
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/for-developers">
              Installation guide
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
