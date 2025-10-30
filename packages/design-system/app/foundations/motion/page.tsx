'use client';

import { Button, Link, Stack, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, OpportunityCard, DetailCard, ModalRoot, ModalContent, ModalHeader, ModalTitle, ModalBody, Spinner, Skeleton } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { CodeBlock } from '../../../components/helpers/code-block';
import { useState } from 'react';

export default function MotionPage() {
  const [showFadeExample, setShowFadeExample] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showBudgetCard, setShowBudgetCard] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [animateEaseIn, setAnimateEaseIn] = useState(false);
  const [animateEaseOut, setAnimateEaseOut] = useState(false);
  const [animateEaseInOut, setAnimateEaseInOut] = useState(false);

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Motion & Animation</h1>
      <p className="lead">
        Motion in Fidus provides feedback, guides attention, and creates smooth transitions. All
        animations are purposeful, subtle, and respect user preferences for reduced motion.
      </p>

      <h2>Motion Principles</h2>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-md my-lg">
        <div className="bg-muted rounded-lg p-md">
          <h3 className="text-base font-semibold mb-sm">1. Purposeful</h3>
          <p className="text-sm">Every animation serves a purpose: feedback, guidance, or context.</p>
        </div>

        <div className="bg-muted rounded-lg p-md">
          <h3 className="text-base font-semibold mb-sm">2. Subtle</h3>
          <p className="text-sm">Animations are quick and understated, not distracting.</p>
        </div>

        <div className="bg-muted rounded-lg p-md">
          <h3 className="text-base font-semibold mb-sm">3. Consistent</h3>
          <p className="text-sm">Similar interactions have similar animations across the app.</p>
        </div>

        <div className="bg-muted rounded-lg p-md">
          <h3 className="text-base font-semibold mb-sm">4. Respectful</h3>
          <p className="text-sm">Honor prefers-reduced-motion for accessibility.</p>
        </div>
      </div>

      <h2>Timing Functions</h2>

      <p>We use CSS custom properties for consistent timing curves:</p>

      <div className="not-prose my-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Usage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-mono">--easing-accelerate</TableCell>
              <TableCell className="font-mono text-sm">cubic-bezier(0.4, 0, 1, 1)</TableCell>
              <TableCell className="text-muted-foreground">Elements exiting - starts slow, ends fast</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono">--easing-decelerate</TableCell>
              <TableCell className="font-mono text-sm">cubic-bezier(0, 0, 0.2, 1)</TableCell>
              <TableCell className="text-muted-foreground">Elements entering - starts fast, ends slow</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono">--easing-standard</TableCell>
              <TableCell className="font-mono text-sm">cubic-bezier(0.4, 0, 0.2, 1)</TableCell>
              <TableCell className="text-muted-foreground">Smooth transitions - balanced start and end</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <h3 className="mt-lg">Interactive Demos</h3>
      <p>Click "Animate" to see each easing curve in action:</p>

      <div className="not-prose space-y-md my-lg">
        <div className="border border-border rounded-lg p-md">
          <Stack direction="horizontal" justify="between" align="center" className="mb-sm">
            <div>
              <code className="text-sm font-semibold">--easing-accelerate</code>
              <p className="text-xs text-muted-foreground mt-xs">cubic-bezier(0.4, 0, 1, 1)</p>
            </div>
            <Button onClick={() => { setAnimateEaseIn(false); setTimeout(() => setAnimateEaseIn(true), 50); }}>
              Animate
            </Button>
          </Stack>
          <p className="text-sm text-muted-foreground mb-md">Elements exiting the screen - starts slow, ends fast</p>
          <div className="relative h-12 bg-muted rounded-md overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-16 bg-primary rounded-md"
              style={{
                transform: animateEaseIn ? 'translateX(300px)' : 'translateX(0)',
                transition: animateEaseIn ? 'transform 1s var(--easing-accelerate)' : 'none'
              }}
            />
          </div>
        </div>

        <div className="border border-border rounded-lg p-md">
          <Stack direction="horizontal" justify="between" align="center" className="mb-sm">
            <div>
              <code className="text-sm font-semibold">--easing-decelerate</code>
              <p className="text-xs text-muted-foreground mt-xs">cubic-bezier(0, 0, 0.2, 1)</p>
            </div>
            <Button onClick={() => { setAnimateEaseOut(false); setTimeout(() => setAnimateEaseOut(true), 50); }}>
              Animate
            </Button>
          </Stack>
          <p className="text-sm text-muted-foreground mb-md">Elements entering the screen - starts fast, ends slow</p>
          <div className="relative h-12 bg-muted rounded-md overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-16 bg-success rounded-md"
              style={{
                transform: animateEaseOut ? 'translateX(300px)' : 'translateX(0)',
                transition: animateEaseOut ? 'transform 1s var(--easing-decelerate)' : 'none'
              }}
            />
          </div>
        </div>

        <div className="border border-border rounded-lg p-md">
          <Stack direction="horizontal" justify="between" align="center" className="mb-sm">
            <div>
              <code className="text-sm font-semibold">--easing-standard</code>
              <p className="text-xs text-muted-foreground mt-xs">cubic-bezier(0.4, 0, 0.2, 1)</p>
            </div>
            <Button onClick={() => { setAnimateEaseInOut(false); setTimeout(() => setAnimateEaseInOut(true), 50); }}>
              Animate
            </Button>
          </Stack>
          <p className="text-sm text-muted-foreground mb-md">Elements moving within the screen - smooth start and end</p>
          <div className="relative h-12 bg-muted rounded-md overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-16 bg-warning rounded-md"
              style={{
                transform: animateEaseInOut ? 'translateX(300px)' : 'translateX(0)',
                transition: animateEaseInOut ? 'transform 1s var(--easing-standard)' : 'none'
              }}
            />
          </div>
        </div>
      </div>

      <h2>Duration Scale</h2>

      <div className="not-prose my-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Usage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-mono">--duration-fast</TableCell>
              <TableCell className="font-semibold">150ms</TableCell>
              <TableCell className="text-muted-foreground">Hover states, button presses</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono">--duration-normal</TableCell>
              <TableCell className="font-semibold">250ms</TableCell>
              <TableCell className="text-muted-foreground">Card dismissals, modals</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono">--duration-slow</TableCell>
              <TableCell className="font-semibold">350ms</TableCell>
              <TableCell className="text-muted-foreground">Page transitions, large movements</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <h2>Common Animations</h2>

      <h3>Fade In (Appearing)</h3>
      <p>Used when OpportunityCards or widgets appear on screen:</p>
      <div className="not-prose my-md">
        <ComponentPreview
          code={`<Button onClick={() => setShowFadeExample(!showFadeExample)}>
  {showFadeExample ? 'Hide Card' : 'Show Card'}
</Button>

{showFadeExample && (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
    <OpportunityCard
      title="New Opportunity"
      urgency="normal"
      context="Just appeared with smooth animation"
      primaryAction={{
        label: 'Take Action',
        onClick: () => console.log('Action taken')
      }}
    >
      <p>This OpportunityCard appears with a fade-in and slide-up animation.</p>
      <p className="text-sm text-muted-foreground mt-sm">
        Animation: opacity 0→1, translateY 8px→0, 300ms ease-out
      </p>
    </OpportunityCard>
  </div>
)}`}
        >
          <div className="space-y-md">
            <Button onClick={() => setShowFadeExample(!showFadeExample)}>
              {showFadeExample ? 'Hide Card' : 'Show Card'}
            </Button>
            {showFadeExample && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <OpportunityCard
                  title="New Opportunity"
                  urgency="normal"
                  context="Just appeared with smooth animation"
                  primaryAction={{
                    label: 'Take Action',
                    onClick: () => console.log('Action taken')
                  }}
                >
                  <p>This OpportunityCard appears with a fade-in and slide-up animation.</p>
                  <p className="text-sm text-muted-foreground mt-sm">
                    Animation: opacity 0→1, translateY 8px→0, 300ms ease-out
                  </p>
                </OpportunityCard>
              </div>
            )}
          </div>
        </ComponentPreview>
      </div>

      <h3>Hover Lift</h3>
      <p>Subtle elevation on interactive cards:</p>
      <div className="not-prose my-md">
        <ComponentPreview
          code={`<OpportunityCard
  title="Hover Over Me"
  urgency="low"
  context="Card has hover lift animation"
  className="transition-transform duration-150 hover:-translate-y-0.5"
  primaryAction={{
    label: 'View',
    onClick: () => console.log('Clicked')
  }}
>
  <p>Hover over this card to see it lift up slightly.</p>
  <p className="text-sm text-muted-foreground mt-sm">
    Animation: translateY -2px, shadow sm→md, 150ms ease
  </p>
</OpportunityCard>`}
        >
          <OpportunityCard
            title="Hover Over Me"
            urgency="low"
            context="Card has hover lift animation"
            className="transition-transform duration-150 hover:-translate-y-0.5 cursor-pointer"
            primaryAction={{
              label: 'View',
              onClick: () => console.log('Clicked')
            }}
          >
            <p>Hover over this card to see it lift up slightly.</p>
            <p className="text-sm text-muted-foreground mt-sm">
              Animation: translateY -2px, shadow sm→md, 150ms ease
            </p>
          </OpportunityCard>
        </ComponentPreview>
      </div>

      <h3>Expand/Collapse</h3>
      <p>Used in DetailCard and collapsible sections:</p>
      <div className="not-prose my-md">
        <ComponentPreview
          code={`<DetailCard
  title="Trip Details"
  subtitle="Click to expand/collapse"
  defaultExpanded={false}
  collapsible={true}
>
  <div className="space-y-sm">
    <p>This content expands and collapses smoothly.</p>
    <p className="text-sm text-muted-foreground">
      Animation: opacity 0→1, max-height transition, 250ms ease-in-out
    </p>
    <ul className="text-sm space-y-xs">
      <li>• Departure: 10:00 AM</li>
      <li>• Arrival: 2:30 PM</li>
      <li>• Duration: 4h 30min</li>
    </ul>
  </div>
</DetailCard>`}
        >
          <DetailCard
            title="Trip Details"
            subtitle="Click to expand/collapse"
            defaultExpanded={false}
            collapsible={true}
          >
            <div className="space-y-sm">
              <p>This content expands and collapses smoothly.</p>
              <p className="text-sm text-muted-foreground">
                Animation: opacity 0→1, max-height transition, 250ms ease-in-out
              </p>
              <ul className="text-sm space-y-xs">
                <li>• Departure: 10:00 AM</li>
                <li>• Arrival: 2:30 PM</li>
                <li>• Duration: 4h 30min</li>
              </ul>
            </div>
          </DetailCard>
        </ComponentPreview>
      </div>

      <h2>Swipe Gestures</h2>

      <p>
        OpportunityCards support swipe-to-dismiss on mobile. Try swiping the card below on a touch
        device, or use Chrome DevTools Device Emulation (F12 → Toggle device toolbar).
      </p>

      <div className="not-prose my-lg">
        <ComponentPreview
          code={`const [showCard, setShowCard] = useState(true);
const [showModal, setShowModal] = useState(false);

{showCard && (
  <OpportunityCard
    title="Budget Alert"
    urgency="important"
    context="Monthly spending update"
    onDismiss={() => setShowCard(false)}
    primaryAction={{
      label: 'View Details',
      onClick: () => setShowModal(true)
    }}
    secondaryAction={{
      label: 'Dismiss',
      onClick: () => setShowCard(false)
    }}
  >
    <p>You've spent 85% of your monthly food budget (€425 of €500).</p>
    <p className="text-sm text-muted-foreground mt-sm">
      Consider adjusting your spending or reviewing your budget allocation.
    </p>
  </OpportunityCard>
)}

<ModalRoot open={showModal} onOpenChange={setShowModal}>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Budget Details</ModalTitle>
    </ModalHeader>
    <ModalBody>
      <div className="space-y-md">
        <p>Your monthly food budget is €500.</p>
        <p>Current spending: €425 (85%)</p>
        <p>Remaining: €75 (15%)</p>
      </div>
    </ModalBody>
  </ModalContent>
</ModalRoot>`}
        >
          <div>
            {showBudgetCard && (
              <OpportunityCard
                title="Budget Alert"
                urgency="important"
                context="Monthly spending update"
                onDismiss={() => setShowBudgetCard(false)}
                primaryAction={{
                  label: 'View Details',
                  onClick: () => setShowDetailsModal(true)
                }}
                secondaryAction={{
                  label: 'Dismiss',
                  onClick: () => setShowBudgetCard(false)
                }}
              >
                <p>You&apos;ve spent 85% of your monthly food budget (€425 of €500).</p>
                <p className="text-sm text-muted-foreground mt-sm">
                  Consider adjusting your spending or reviewing your budget allocation.
                </p>
              </OpportunityCard>
            )}
            {!showBudgetCard && (
              <div className="text-center p-lg text-muted-foreground">
                <p>Card was dismissed.</p>
                <Button onClick={() => setShowBudgetCard(true)} className="mt-md">
                  Show Card Again
                </Button>
              </div>
            )}
            <ModalRoot open={showDetailsModal} onOpenChange={setShowDetailsModal}>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Budget Details</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-md">
                    <div className="flex justify-between">
                      <span className="font-medium">Monthly Budget:</span>
                      <span>€500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Current Spending:</span>
                      <span className="text-warning">€425 (85%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Remaining:</span>
                      <span className="text-success">€75 (15%)</span>
                    </div>
                    <div className="pt-md border-t border-border">
                      <h4 className="font-semibold mb-sm">Recent Transactions:</h4>
                      <ul className="space-y-xs text-sm">
                        <li>Grocery Store - €45</li>
                        <li>Restaurant - €32</li>
                        <li>Supermarket - €58</li>
                      </ul>
                    </div>
                  </div>
                </ModalBody>
              </ModalContent>
            </ModalRoot>
          </div>
        </ComponentPreview>
      </div>

      <div className="not-prose my-lg">
        <h3 className="text-lg font-semibold mb-md">Swipe Behavior</h3>
        <div className="grid gap-md">
          <div className="bg-muted rounded-lg p-md">
            <div className="font-medium mb-xs">1. Touch Start</div>
            <p className="text-sm text-muted-foreground">
              Card begins tracking finger position in real-time
            </p>
          </div>

          <div className="bg-muted rounded-lg p-md">
            <div className="font-medium mb-xs">2. Swiping (Distance &lt; 50px)</div>
            <p className="text-sm text-muted-foreground">
              Card follows finger with no transition delay - immediate feedback
            </p>
          </div>

          <div className="bg-muted rounded-lg p-md">
            <div className="font-medium mb-xs">3a. Release (Distance &lt; 50px)</div>
            <p className="text-sm text-muted-foreground">
              Card springs back to original position with 150ms ease-out transition
            </p>
          </div>

          <div className="bg-muted rounded-lg p-md">
            <div className="font-medium mb-xs">3b. Release (Distance &gt; 50px)</div>
            <p className="text-sm text-muted-foreground">
              Dismiss animation triggers - card slides out completely (250ms ease-in) and onDismiss callback fires
            </p>
          </div>
        </div>
      </div>

      <h2>Loading States</h2>

      <p>Loading states provide feedback during asynchronous operations. Fidus provides Spinner and Skeleton components for different loading scenarios.</p>

      <h3>Spinner</h3>
      <p>Used for short operations where exact progress cannot be tracked:</p>
      <div className="not-prose my-md">
        <ComponentPreview code={`import { Spinner, Stack } from '@fidus/ui';

<Stack direction="horizontal" spacing="lg" align="center">
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
</Stack>

{/* With descriptive text */}
<div className="flex items-center gap-sm">
  <Spinner size="sm" />
  <span className="text-sm text-muted-foreground">Loading budget data...</span>
</div>`}>
          <div className="space-y-lg">
            <div>
              <p className="text-sm font-medium mb-md">Sizes</p>
              <Stack direction="horizontal" spacing="lg" align="center">
                <Spinner size="sm" label="Loading small" />
                <Spinner size="md" label="Loading medium" />
                <Spinner size="lg" label="Loading large" />
              </Stack>
            </div>
            <div>
              <p className="text-sm font-medium mb-md">With Context</p>
              <div className="flex items-center gap-sm">
                <Spinner size="sm" label="Loading budget data" />
                <span className="text-sm text-muted-foreground">Loading budget data...</span>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </div>

      <h3>Skeleton Loader</h3>
      <p>Used for content loading to show the structure before data arrives:</p>
      <div className="not-prose my-md">
        <ComponentPreview code={`import { Skeleton } from '@fidus/ui';

{/* Text skeletons */}
<div className="space-y-sm">
  <Skeleton variant="text" width="100%" />
  <Skeleton variant="text" width="75%" />
  <Skeleton variant="text" width="50%" />
</div>

{/* Card skeleton */}
<div className="space-y-md">
  <div className="flex items-center gap-md">
    <Skeleton variant="circular" width="48px" height="48px" />
    <div className="flex-1 space-y-sm">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </div>
  </div>
</div>

{/* Rectangular skeleton */}
<Skeleton variant="rectangular" width="100%" height="200px" />`}>
          <div className="space-y-lg">
            <div>
              <p className="text-sm font-medium mb-md">Text Lines</p>
              <div className="space-y-sm">
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="75%" />
                <Skeleton variant="text" width="50%" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-md">Card Skeleton (List Item)</p>
              <div className="flex items-center gap-md">
                <Skeleton variant="circular" width="48px" height="48px" />
                <div className="flex-1 space-y-sm">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-md">Rectangular Block</p>
              <Skeleton variant="rectangular" width="100%" height="120px" />
            </div>
          </div>
        </ComponentPreview>
      </div>

      <h2>Implementation Examples</h2>

      <h3>Tailwind CSS Classes</h3>
      <div className="not-prose my-md">
        <CodeBlock
          language="tsx"
          code={`// Hover state
<button className="transition-colors duration-150 hover:bg-primary/90">

// Card appearing
<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

// Card dismissing (custom)
<div className="transition-all duration-250 opacity-0 translate-x-full">

// Respect reduced motion
<div className="transition-all duration-250 motion-reduce:transition-none">`}
        />
      </div>

      <h3>Custom Transitions</h3>
      <div className="not-prose my-md">
        <CodeBlock
          language="javascript"
          code={`// In Tailwind config
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
}`}
        />
      </div>

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use motion</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Providing feedback on user interactions (button presses, form submissions)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Guiding user attention to important changes (new opportunity card appears)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Creating smooth transitions between states (modal opening, panel expanding)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Indicating loading or processing states</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Enhancing perceived performance (skeleton loaders)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep animations subtle - they should enhance, not distract</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Match animation direction to element behavior (entering from top exits to top)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use consistent durations from the scale (150ms/250ms/400ms)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Test on lower-end devices - animations may feel different</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Avoid animating multiple elements simultaneously</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Prefer GPU-accelerated properties (transform, opacity)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Always respect user preferences for reduced motion</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Always respect prefers-reduced-motion media query</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use motion-reduce: utilities in Tailwind for reduced motion variants</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide instant state changes (no animation) when reduced motion is preferred</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Never convey information through motion alone - include text or icons</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Avoid infinite looping animations (except loading indicators)</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do&apos;s and Don&apos;ts</h2>

      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <span className="text-2xl">✓</span> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use 150ms for instant feedback (hover, press)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use 250ms for transitions (dismiss, modal)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use 400ms for large movements (page transition)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Always respect prefers-reduced-motion</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Animate transform and opacity for performance</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Keep animations purposeful and subtle</span>
            </li>
          </ul>
        </div>

        <div className="border-2 border-error bg-error/10 rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don&apos;t
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use auto-playing animations on page load</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Create long duration animations (&gt;500ms)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use complex 3D transforms</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Animate many elements at once</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Create purely decorative animations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Ignore user&apos;s reduced motion preference</span>
            </li>
          </ul>
        </div>
      </div>

      <h2>Accessibility: Reduced Motion</h2>

      <p>
        Always respect the <code>prefers-reduced-motion</code> media query. Users who enable this
        setting should see instant state changes without animations.
      </p>

      <div className="not-prose my-md">
        <CodeBlock
          language="css"
          code={`@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`}
        />
      </div>

      <h3>Tailwind Implementation</h3>
      <div className="not-prose my-md">
        <CodeBlock
          language="tsx"
          code={`<div className="transition-all duration-250 motion-reduce:transition-none">`}
        />
      </div>

      <h2>Performance</h2>

      <div className="not-prose space-y-lg my-lg">
        <div className="bg-muted rounded-lg p-lg">
          <h3 className="text-lg font-semibold mb-md">GPU-Accelerated Properties</h3>
          <p className="text-sm text-muted-foreground mb-md">Prefer these properties for smooth 60fps animations:</p>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span><code className="font-mono text-sm">transform</code> - translate, rotate, scale</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span><code className="font-mono text-sm">opacity</code> - fade in/out effects</span>
            </li>
          </ul>
        </div>

        <div className="bg-muted rounded-lg p-lg">
          <h3 className="text-lg font-semibold mb-md">Avoid Animating</h3>
          <p className="text-sm text-muted-foreground mb-md">These properties cause layout recalculation (expensive):</p>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">✗</span>
              <span><code className="font-mono text-sm">width</code>, <code className="font-mono text-sm">height</code> - Use transform: scale() instead</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">✗</span>
              <span><code className="font-mono text-sm">top</code>, <code className="font-mono text-sm">left</code>, <code className="font-mono text-sm">right</code>, <code className="font-mono text-sm">bottom</code> - Use transform: translate() instead</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">✗</span>
              <span><code className="font-mono text-sm">margin</code>, <code className="font-mono text-sm">padding</code> - Use transform or opacity</span>
            </li>
          </ul>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">Uses motion for hover and press states</p>
        </Link>

        <Link
          href="/components/modal"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Modal
          </h3>
          <p className="text-sm text-muted-foreground">Uses fade and scale animations</p>
        </Link>

        <Link
          href="/components/progress-bar"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            ProgressBar
          </h3>
          <p className="text-sm text-muted-foreground">Animated progress indicator</p>
        </Link>

        <Link
          href="/patterns/loading-states"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Loading States
          </h3>
          <p className="text-sm text-muted-foreground">Loading animations pattern</p>
        </Link>

        <Link
          href="/components/opportunity-card"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            OpportunityCard
          </h3>
          <p className="text-sm text-muted-foreground">Card with swipe gestures and transitions</p>
        </Link>

        <Link
          href="/components/toast"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Toast
          </h3>
          <p className="text-sm text-muted-foreground">Slide-in notification animations</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://web.dev/animations-guide/"
              external
              showIcon
            >
              Web.dev: Animations Guide
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html"
              external
              showIcon
            >
              WCAG 2.1: Animation from Interactions
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"
              external
              showIcon
            >
              MDN: prefers-reduced-motion
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://cubic-bezier.com/"
              external
              showIcon
            >
              Cubic-Bezier.com - Easing Function Generator
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/tokens/motion">
              Motion Design Tokens
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/for-developers">
              Installation guide
            </Link>
          </li>
        </ul>
      </div>

      <h2>Key Takeaways</h2>

      <div className="not-prose bg-primary/10 border border-primary/20 rounded-lg p-lg my-lg">
        <ul className="space-y-sm text-sm">
          <li>✅ Use 150ms for instant feedback (hover, press)</li>
          <li>✅ Use 250ms for transitions (dismiss, modal)</li>
          <li>✅ Use 400ms for large movements (page transition)</li>
          <li>✅ Always respect prefers-reduced-motion</li>
          <li>✅ Animate transform and opacity for performance</li>
          <li>✅ Keep animations purposeful and subtle</li>
        </ul>
      </div>
    </div>
  );
}
