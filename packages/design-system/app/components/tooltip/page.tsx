'use client';

import { Tooltip, TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@fidus/ui';
import { Button } from '@fidus/ui';
import { Info, HelpCircle, Settings, Save, Share } from 'lucide-react';

export default function TooltipPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Tooltip</h1>
        <p className="text-lg text-muted-foreground">
          A small popup that displays informative text when users hover over or focus on an element, providing additional context without cluttering the interface.
        </p>
      </div>

      {/* Basic Tooltip */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Tooltip</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Tooltip content="This is a helpful tooltip">
              <Button>Hover me</Button>
            </Tooltip>
          </div>
        </div>
      </section>

      {/* Positions */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Positions</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap gap-4">
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
            </div>
          </div>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Icons</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap items-center gap-4">
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
            </div>
          </div>
        </div>
      </section>

      {/* Delay Duration */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Delay Duration</h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Instant (0ms delay)</p>
              <Tooltip content="Appears immediately" delayDuration={0}>
                <Button>Instant</Button>
              </Tooltip>
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Default (200ms delay)</p>
              <Tooltip content="Default delay timing">
                <Button>Default</Button>
              </Tooltip>
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Slow (500ms delay)</p>
              <Tooltip content="Appears after half a second" delayDuration={500}>
                <Button>Slow</Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </section>

      {/* Without Arrow */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Without Arrow</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Tooltip content="Tooltip without an arrow pointer" showArrow={false}>
              <Button>No Arrow</Button>
            </Tooltip>
          </div>
        </div>
      </section>

      {/* Interactive Content */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">On Different Elements</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <Tooltip content="This is a text element">
                <span className="cursor-help underline decoration-dotted">Hover over this text</span>
              </Tooltip>
            </div>
            <div className="flex items-center gap-4">
              <Tooltip content="Information icon">
                <Info className="h-5 w-5 cursor-help text-blue-600" />
              </Tooltip>
              <Tooltip content="This badge has a tooltip">
                <span className="cursor-help rounded-full bg-blue-600 px-3 py-1 text-xs text-white">
                  Badge
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </section>

      {/* Composable API */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Composable API</h2>
          <div className="rounded-lg border border-border bg-card p-6">
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
          </div>
        </div>
      </section>

      {/* Setup Instructions */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Setup</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="mb-4 text-sm text-muted-foreground">
              For optimal performance, wrap your application with TooltipProvider:
            </p>
            <pre className="rounded bg-gray-100 p-4 text-sm">
              <code>{`import { TooltipProvider } from '@fidus/ui';

function App() {
  return (
    <TooltipProvider>
      <YourApp />
    </TooltipProvider>
  );
}`}</code>
            </pre>
            <p className="mt-4 text-sm text-muted-foreground">
              The convenience Tooltip component includes its own provider, so it works standalone.
              However, using a global provider improves performance when you have many tooltips.
            </p>
          </div>
        </div>
      </section>

      {/* Props Table */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Props (Convenience API)</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-left font-semibold">Prop</th>
                  <th className="p-2 text-left font-semibold">Type</th>
                  <th className="p-2 text-left font-semibold">Default</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">content</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Tooltip text content (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">children</td>
                  <td className="p-2 font-mono text-xs">ReactElement</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Trigger element (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">side</td>
                  <td className="p-2 font-mono text-xs">
                    'top' | 'bottom' | 'left' | 'right'
                  </td>
                  <td className="p-2 font-mono text-xs">'top'</td>
                  <td className="p-2">Position relative to trigger</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">align</td>
                  <td className="p-2 font-mono text-xs">'start' | 'center' | 'end'</td>
                  <td className="p-2 font-mono text-xs">'center'</td>
                  <td className="p-2">Alignment relative to trigger</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">delayDuration</td>
                  <td className="p-2 font-mono text-xs">number (0-2000)</td>
                  <td className="p-2 font-mono text-xs">200</td>
                  <td className="p-2">Delay before showing (ms)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showArrow</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Whether to show arrow pointer</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">open</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Controlled open state</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onOpenChange</td>
                  <td className="p-2 font-mono text-xs">(open: boolean) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Open state change handler</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Composable Parts */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Composable Parts</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-left font-semibold">Component</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">TooltipProvider</td>
                  <td className="p-2">Global provider for optimal performance</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">TooltipRoot</td>
                  <td className="p-2">Root container component</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">TooltipTrigger</td>
                  <td className="p-2">Trigger element wrapper</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">TooltipContent</td>
                  <td className="p-2">Content container with positioning</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">Tooltip</td>
                  <td className="p-2">Convenience wrapper component</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Accessibility</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>ARIA attributes: aria-describedby for screen readers</li>
            <li>Keyboard accessible: Focus triggers tooltip, Escape closes</li>
            <li>Hover and focus: Works with both mouse and keyboard</li>
            <li>Portal rendering: Rendered at document body level</li>
            <li>Auto positioning: Adjusts to stay within viewport</li>
            <li>Respects prefers-reduced-motion for animations</li>
            <li>Important: Use for supplementary info only, not critical content</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
