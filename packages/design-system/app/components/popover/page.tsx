'use client';

import { Popover, PopoverRoot, PopoverTrigger, PopoverContent, PopoverClose } from '@fidus/ui';
import { Button } from '@fidus/ui';
import { Info, HelpCircle, Calendar, User } from 'lucide-react';

export default function PopoverPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Popover</h1>
        <p className="text-lg text-muted-foreground">
          A floating content container that displays rich content or actions when triggered, anchored to a reference element.
        </p>
      </div>

      {/* Basic Popover */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Popover</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Popover trigger={<Button>Open Popover</Button>}>
              <div>
                <h3 className="mb-2 font-semibold">Popover Title</h3>
                <p className="text-sm text-muted-foreground">
                  This is a basic popover with custom content. You can put any content here.
                </p>
              </div>
            </Popover>
          </div>
        </div>
      </section>

      {/* Positions */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Positions</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap gap-4">
              <Popover
                trigger={<Button>Top</Button>}
                side="top"
              >
                <p className="text-sm">Popover positioned on top</p>
              </Popover>
              <Popover
                trigger={<Button>Bottom</Button>}
                side="bottom"
              >
                <p className="text-sm">Popover positioned on bottom</p>
              </Popover>
              <Popover
                trigger={<Button>Left</Button>}
                side="left"
              >
                <p className="text-sm">Popover positioned on left</p>
              </Popover>
              <Popover
                trigger={<Button>Right</Button>}
                side="right"
              >
                <p className="text-sm">Popover positioned on right</p>
              </Popover>
            </div>
          </div>
        </div>
      </section>

      {/* Without Arrow */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Without Arrow</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Popover
              trigger={<Button>No Arrow</Button>}
              showArrow={false}
            >
              <div>
                <h3 className="mb-2 font-semibold">No Arrow</h3>
                <p className="text-sm text-muted-foreground">
                  This popover doesn't have an arrow pointing to the trigger.
                </p>
              </div>
            </Popover>
          </div>
        </div>
      </section>

      {/* Rich Content */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Rich Content</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap gap-4">
              <Popover
                trigger={
                  <Button variant="secondary">
                    <Info className="mr-2 h-4 w-4" />
                    Information
                  </Button>
                }
              >
                <div className="space-y-2">
                  <h3 className="font-semibold">Additional Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Popovers can contain rich content including:
                  </p>
                  <ul className="list-inside list-disc text-sm text-muted-foreground">
                    <li>Multiple paragraphs</li>
                    <li>Lists and formatting</li>
                    <li>Images and icons</li>
                    <li>Interactive elements</li>
                  </ul>
                </div>
              </Popover>

              <Popover
                trigger={
                  <Button variant="secondary">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help
                  </Button>
                }
              >
                <div className="space-y-3">
                  <h3 className="font-semibold">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact our support team for assistance.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary">
                      Contact Support
                    </Button>
                    <PopoverClose asChild>
                      <Button size="sm" variant="secondary">
                        Close
                      </Button>
                    </PopoverClose>
                  </div>
                </div>
              </Popover>
            </div>
          </div>
        </div>
      </section>

      {/* Form in Popover */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Form in Popover</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <PopoverRoot>
              <PopoverTrigger asChild>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-4">
                  <h3 className="font-semibold">Schedule a Meeting</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <input
                      type="date"
                      className="w-full rounded border border-border px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <input
                      type="time"
                      className="w-full rounded border border-border px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <PopoverClose asChild>
                      <Button size="sm" variant="secondary">
                        Cancel
                      </Button>
                    </PopoverClose>
                    <Button size="sm">Schedule</Button>
                  </div>
                </div>
              </PopoverContent>
            </PopoverRoot>
          </div>
        </div>
      </section>

      {/* User Profile Card */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">User Profile Card</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Popover
              trigger={
                <Button variant="secondary">
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
              }
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">John Doe</h3>
                    <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                  </div>
                </div>
                <div className="space-y-1 border-t border-border pt-3">
                  <p className="text-sm">
                    <strong>Role:</strong> Developer
                  </p>
                  <p className="text-sm">
                    <strong>Team:</strong> Engineering
                  </p>
                  <p className="text-sm">
                    <strong>Location:</strong> San Francisco, CA
                  </p>
                </div>
                <Button size="sm" className="w-full">
                  View Full Profile
                </Button>
              </div>
            </Popover>
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
                  <td className="p-2 font-mono">trigger</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Trigger element (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">children</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Popover content</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">side</td>
                  <td className="p-2 font-mono text-xs">
                    'top' | 'bottom' | 'left' | 'right'
                  </td>
                  <td className="p-2 font-mono text-xs">'bottom'</td>
                  <td className="p-2">Position relative to trigger</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">align</td>
                  <td className="p-2 font-mono text-xs">'start' | 'center' | 'end'</td>
                  <td className="p-2 font-mono text-xs">'center'</td>
                  <td className="p-2">Alignment relative to trigger</td>
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
                  <td className="p-2 font-mono">PopoverRoot</td>
                  <td className="p-2">Root container component</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">PopoverTrigger</td>
                  <td className="p-2">Trigger element wrapper</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">PopoverContent</td>
                  <td className="p-2">Content container with positioning</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">PopoverClose</td>
                  <td className="p-2">Close button wrapper</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">Popover</td>
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
            <li>ARIA attributes: aria-haspopup, aria-expanded</li>
            <li>Keyboard navigation: Escape to close, Tab to navigate</li>
            <li>Focus management: Focus returns to trigger on close</li>
            <li>Portal rendering: Rendered at document body level</li>
            <li>Click outside: Clicking outside closes the popover</li>
            <li>Auto positioning: Adjusts position to stay in viewport</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
