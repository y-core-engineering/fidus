'use client';

import { Popover, PopoverRoot, PopoverTrigger, PopoverContent, PopoverClose } from '@fidus/ui/popover';
import { Button } from '@fidus/ui/button';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { Info, HelpCircle, Calendar, User, X } from 'lucide-react';

export default function PopoverPage() {
  const convenienceProps = [
    {
      name: 'trigger',
      type: 'ReactNode',
      required: true,
      description: 'Trigger element that opens the popover',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Content to display in the popover',
    },
    {
      name: 'side',
      type: "'top' | 'bottom' | 'left' | 'right'",
      default: "'bottom'",
      description: 'Position of popover relative to trigger',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end'",
      default: "'center'",
      description: 'Alignment of popover relative to trigger',
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
      description: 'Callback when open state changes',
    },
  ];

  const composableParts = [
    {
      name: 'PopoverRoot',
      type: 'Component',
      description: 'Root container component for composable API',
    },
    {
      name: 'PopoverTrigger',
      type: 'Component',
      description: 'Trigger element wrapper (use with asChild)',
    },
    {
      name: 'PopoverContent',
      type: 'Component',
      description: 'Content container with positioning logic',
    },
    {
      name: 'PopoverClose',
      type: 'Component',
      description: 'Close button wrapper (use with asChild)',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Popover</h1>
      <p className="lead">
        A floating content container that displays rich content or actions when triggered,
        anchored to a reference element with automatic positioning.
      </p>

      <h2>Basic Popover</h2>
      <ComponentPreview
        code={`<Popover trigger={<Button>Open Popover</Button>}>
  <div>
    <h3 className="mb-sm font-semibold">Popover Title</h3>
    <p className="text-sm text-muted-foreground">
      This is a basic popover with custom content.
    </p>
  </div>
</Popover>`}
      >
        <Popover trigger={<Button>Open Popover</Button>}>
          <div>
            <h3 className="mb-sm font-semibold">Popover Title</h3>
            <p className="text-sm text-muted-foreground">
              This is a basic popover with custom content. You can put any content here.
            </p>
          </div>
        </Popover>
      </ComponentPreview>

      <h2>Positions</h2>
      <p>Popover can be positioned on any side of the trigger element.</p>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md" wrap>
  <Popover trigger={<Button>Top</Button>} side="top">
    <p className="text-sm">Positioned on top</p>
  </Popover>
  <Popover trigger={<Button>Bottom</Button>} side="bottom">
    <p className="text-sm">Positioned on bottom</p>
  </Popover>
  <Popover trigger={<Button>Left</Button>} side="left">
    <p className="text-sm">Positioned on left</p>
  </Popover>
  <Popover trigger={<Button>Right</Button>} side="right">
    <p className="text-sm">Positioned on right</p>
  </Popover>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" wrap>
          <Popover trigger={<Button>Top</Button>} side="top">
            <p className="text-sm">Positioned on top</p>
          </Popover>
          <Popover trigger={<Button>Bottom</Button>} side="bottom">
            <p className="text-sm">Positioned on bottom</p>
          </Popover>
          <Popover trigger={<Button>Left</Button>} side="left">
            <p className="text-sm">Positioned on left</p>
          </Popover>
          <Popover trigger={<Button>Right</Button>} side="right">
            <p className="text-sm">Positioned on right</p>
          </Popover>
        </Stack>
      </ComponentPreview>

      <h2>Without Arrow</h2>
      <p>Remove the arrow pointer by setting <code>showArrow</code> to false.</p>
      <ComponentPreview
        code={`<Popover
  trigger={<Button>No Arrow</Button>}
  showArrow={false}
>
  <div>
    <h3 className="mb-sm font-semibold">No Arrow</h3>
    <p className="text-sm text-muted-foreground">
      This popover doesn't have an arrow.
    </p>
  </div>
</Popover>`}
      >
        <Popover
          trigger={<Button>No Arrow</Button>}
          showArrow={false}
        >
          <div>
            <h3 className="mb-sm font-semibold">No Arrow</h3>
            <p className="text-sm text-muted-foreground">
              This popover doesn't have an arrow pointing to the trigger.
            </p>
          </div>
        </Popover>
      </ComponentPreview>

      <h2>Rich Content</h2>
      <p>Popovers can contain complex content including lists, buttons, and interactive elements.</p>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md" wrap>
  <Popover
    trigger={
      <Button variant="secondary">
        <Info className="mr-sm h-4 w-4" />
        Information
      </Button>
    }
  >
    <Stack spacing="sm">
      <h3 className="font-semibold">Additional Information</h3>
      <p className="text-sm text-muted-foreground">
        Popovers can contain rich content including:
      </p>
      <ul className="space-y-xs text-sm text-muted-foreground">
        <li className="flex gap-xs">
          <span className="shrink-0">•</span>
          <span>Multiple paragraphs</span>
        </li>
        <li className="flex gap-xs">
          <span className="shrink-0">•</span>
          <span>Lists and formatting</span>
        </li>
        <li className="flex gap-xs">
          <span className="shrink-0">•</span>
          <span>Interactive elements</span>
        </li>
      </ul>
    </Stack>
  </Popover>

  <Popover
    trigger={
      <Button variant="secondary">
        <HelpCircle className="mr-sm h-4 w-4" />
        Help
      </Button>
    }
  >
    <Stack spacing="md">
      <h3 className="font-semibold">Need Help?</h3>
      <p className="text-sm text-muted-foreground">
        Contact our support team for assistance.
      </p>
      <Stack direction="horizontal" spacing="sm">
        <Button size="sm" variant="primary">
          Contact Support
        </Button>
        <PopoverClose asChild>
          <Button size="sm" variant="secondary">
            Close
          </Button>
        </PopoverClose>
      </Stack>
    </Stack>
  </Popover>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" wrap>
          <Popover
            trigger={
              <Button variant="secondary">
                <Info className="mr-sm h-4 w-4" />
                Information
              </Button>
            }
          >
            <Stack spacing="sm">
              <h3 className="font-semibold">Additional Information</h3>
              <p className="text-sm text-muted-foreground">
                Popovers can contain rich content including:
              </p>
              <ul className="space-y-xs text-sm text-muted-foreground">
                <li className="flex gap-xs">
                  <span className="shrink-0">•</span>
                  <span>Multiple paragraphs</span>
                </li>
                <li className="flex gap-xs">
                  <span className="shrink-0">•</span>
                  <span>Lists and formatting</span>
                </li>
                <li className="flex gap-xs">
                  <span className="shrink-0">•</span>
                  <span>Interactive elements</span>
                </li>
              </ul>
            </Stack>
          </Popover>

          <Popover
            trigger={
              <Button variant="secondary">
                <HelpCircle className="mr-sm h-4 w-4" />
                Help
              </Button>
            }
          >
            <Stack spacing="md">
              <h3 className="font-semibold">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                Contact our support team for assistance.
              </p>
              <Stack direction="horizontal" spacing="sm">
                <Button size="sm" variant="primary">
                  Contact Support
                </Button>
                <PopoverClose asChild>
                  <Button size="sm" variant="secondary">
                    Close
                  </Button>
                </PopoverClose>
              </Stack>
            </Stack>
          </Popover>
        </Stack>
      </ComponentPreview>

      <h2>Form in Popover</h2>
      <p>Use the composable API for more complex interactions like forms.</p>
      <ComponentPreview
        code={`<PopoverRoot>
  <PopoverTrigger asChild>
    <Button>
      <Calendar className="mr-sm h-4 w-4" />
      Schedule Meeting
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <Stack spacing="md">
      <h3 className="font-semibold">Schedule a Meeting</h3>
      <Stack spacing="sm">
        <label className="text-sm font-medium">Date</label>
        <input
          type="date"
          className="w-full rounded-md border border-border px-md py-sm text-sm"
        />
      </Stack>
      <Stack spacing="sm">
        <label className="text-sm font-medium">Time</label>
        <input
          type="time"
          className="w-full rounded-md border border-border px-md py-sm text-sm"
        />
      </Stack>
      <Stack direction="horizontal" spacing="sm">
        <PopoverClose asChild>
          <Button size="sm" variant="secondary">
            Cancel
          </Button>
        </PopoverClose>
        <Button size="sm">Schedule</Button>
      </Stack>
    </Stack>
  </PopoverContent>
</PopoverRoot>`}
      >
        <PopoverRoot>
          <PopoverTrigger asChild>
            <Button>
              <Calendar className="mr-sm h-4 w-4" />
              Schedule Meeting
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Stack spacing="md">
              <h3 className="font-semibold">Schedule a Meeting</h3>
              <Stack spacing="sm">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  className="w-full rounded-md border border-border px-md py-sm text-sm"
                />
              </Stack>
              <Stack spacing="sm">
                <label className="text-sm font-medium">Time</label>
                <input
                  type="time"
                  className="w-full rounded-md border border-border px-md py-sm text-sm"
                />
              </Stack>
              <Stack direction="horizontal" spacing="sm">
                <PopoverClose asChild>
                  <Button size="sm" variant="secondary">
                    Cancel
                  </Button>
                </PopoverClose>
                <Button size="sm">Schedule</Button>
              </Stack>
            </Stack>
          </PopoverContent>
        </PopoverRoot>
      </ComponentPreview>

      <h2>User Profile Card</h2>
      <p>A common pattern for displaying user information in a popover.</p>
      <ComponentPreview
        code={`<Popover
  trigger={
    <Button variant="secondary">
      <User className="mr-sm h-4 w-4" />
      View Profile
    </Button>
  }
>
  <Stack spacing="md">
    <Stack direction="horizontal" spacing="md" align="center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <User className="h-6 w-6" />
      </div>
      <div>
        <h3 className="font-semibold">John Doe</h3>
        <p className="text-sm text-muted-foreground">john.doe@example.com</p>
      </div>
    </Stack>
    <Stack spacing="xs" className="border-t border-border pt-md">
      <p className="text-sm">
        <strong>Role:</strong> Developer
      </p>
      <p className="text-sm">
        <strong>Team:</strong> Engineering
      </p>
      <p className="text-sm">
        <strong>Location:</strong> San Francisco, CA
      </p>
    </Stack>
    <Button size="sm" className="w-full">
      View Full Profile
    </Button>
  </Stack>
</Popover>`}
      >
        <Popover
          trigger={
            <Button variant="secondary">
              <User className="mr-sm h-4 w-4" />
              View Profile
            </Button>
          }
        >
          <Stack spacing="md">
            <Stack direction="horizontal" spacing="md" align="center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">John Doe</h3>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
              </div>
            </Stack>
            <Stack spacing="xs" className="border-t border-border pt-md">
              <p className="text-sm">
                <strong>Role:</strong> Developer
              </p>
              <p className="text-sm">
                <strong>Team:</strong> Engineering
              </p>
              <p className="text-sm">
                <strong>Location:</strong> San Francisco, CA
              </p>
            </Stack>
            <Button size="sm" className="w-full">
              View Full Profile
            </Button>
          </Stack>
        </Popover>
      </ComponentPreview>

      <h2>Props (Convenience API)</h2>
      <PropsTable props={convenienceProps} />

      <h2>Composable Parts</h2>
      <p>For more control, use the composable API with individual components.</p>
      <PropsTable props={composableParts} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Display contextual information or actions related to a trigger element</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show additional details without navigating away from the current page</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Present forms or actions in a compact, focused interface</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Display user profiles, help text, or tooltips with rich content</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep content concise and focused on the trigger context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use appropriate positioning to avoid blocking important content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide a clear way to close the popover (close button or outside click)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use the composable API for complex interactions with multiple interactive elements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Consider using Tooltip for simple, non-interactive content</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Proper ARIA attributes (aria-haspopup, aria-expanded) are automatically applied</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard navigation: Press Escape to close, Tab to navigate between elements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus management: Focus returns to trigger element when popover closes</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Portal rendering: Content is rendered at document body level for proper layering</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Automatic positioning adjusts to stay within viewport boundaries</span>
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
              <span>Use popovers for contextual information and actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Keep content focused and relevant to the trigger</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide clear close actions for complex popovers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use appropriate positioning to avoid blocking content</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Popover
  trigger={<Button size="sm">Quick Actions</Button>}
>
  <Stack spacing="sm">
    <h3 className="font-semibold text-sm">Actions</h3>
    <Stack spacing="xs">
      <Button variant="tertiary" size="sm" className="justify-start">
        Edit
      </Button>
      <Button variant="tertiary" size="sm" className="justify-start">
        Share
      </Button>
      <Button variant="tertiary" size="sm" className="justify-start">
        Archive
      </Button>
    </Stack>
  </Stack>
</Popover>`}
            >
              <Popover
                trigger={<Button size="sm">Quick Actions</Button>}
              >
                <Stack spacing="sm">
                  <h3 className="font-semibold text-sm">Actions</h3>
                  <Stack spacing="xs">
                    <Button variant="tertiary" size="sm" className="justify-start">
                      Edit
                    </Button>
                    <Button variant="tertiary" size="sm" className="justify-start">
                      Share
                    </Button>
                    <Button variant="tertiary" size="sm" className="justify-start">
                      Archive
                    </Button>
                  </Stack>
                </Stack>
              </Popover>
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
              <span>Don't overload popovers with too much content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use popovers for critical information that must be seen</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't nest popovers inside other popovers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use popovers when a simple tooltip would suffice</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Popover
  trigger={<Button size="sm">View Details</Button>}
>
  <div className="max-w-md">
    <h3 className="font-semibold mb-sm">Too Much Content</h3>
    <p className="text-xs text-muted-foreground mb-sm">
      This popover contains way too much information that would be
      better suited for a dedicated page or modal dialog. It includes
      multiple sections, long paragraphs, and extensive details that
      make the popover hard to scan and overwhelming for users.
    </p>
    <Stack spacing="xs" className="mb-sm">
      <input className="w-full px-sm py-xs border rounded-md text-xs" />
      <input className="w-full px-sm py-xs border rounded-md text-xs" />
      <input className="w-full px-sm py-xs border rounded-md text-xs" />
    </Stack>
    <p className="text-xs">And even more content below...</p>
  </div>
</Popover>`}
            >
              <Popover
                trigger={<Button size="sm" variant="secondary">View Details</Button>}
              >
                <div className="max-w-md">
                  <h3 className="font-semibold mb-sm">Too Much Content</h3>
                  <p className="text-xs text-muted-foreground mb-sm">
                    This popover contains way too much information that would be
                    better suited for a dedicated page or modal dialog.
                  </p>
                  <Stack spacing="xs" className="mb-sm">
                    <input className="w-full px-sm py-xs border rounded-md text-xs" placeholder="Field 1" />
                    <input className="w-full px-sm py-xs border rounded-md text-xs" placeholder="Field 2" />
                    <input className="w-full px-sm py-xs border rounded-md text-xs" placeholder="Field 3" />
                  </Stack>
                  <p className="text-xs">And even more content below...</p>
                </div>
              </Popover>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/tooltip"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Tooltip
          </h3>
          <p className="text-sm text-muted-foreground">
            Simple hover information for UI elements
          </p>
        </Link>

        <Link
          href="/components/dropdown-menu"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Dropdown Menu
          </h3>
          <p className="text-sm text-muted-foreground">
            Action menus triggered by a button
          </p>
        </Link>

        <Link
          href="/components/dialog"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Dialog
          </h3>
          <p className="text-sm text-muted-foreground">
            Modal dialogs for focused interactions
          </p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/popover/popover.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.radix-ui.com/primitives/docs/components/popover"
              external
              showIcon
            >
              Radix UI Popover Documentation
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
