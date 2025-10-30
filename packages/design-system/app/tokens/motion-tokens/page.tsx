'use client';

import { useState } from 'react';
import { TokenDisplay } from '../../../components/helpers/color-swatch';
import { Link, Stack, Button } from '@fidus/ui';

export default function MotionTokensPage() {
  const [isAnimating1, setIsAnimating1] = useState(false);
  const [isAnimating2, setIsAnimating2] = useState(false);
  const [isAnimating3, setIsAnimating3] = useState(false);

  const durationTokens = [
    {
      name: 'Fast',
      variable: '--duration-fast',
      value: '150ms',
      description: 'Quick transitions for hover states and small UI changes',
    },
    {
      name: 'Normal',
      variable: '--duration-normal',
      value: '250ms',
      description: 'Standard duration for most transitions and animations',
    },
    {
      name: 'Slow',
      variable: '--duration-slow',
      value: '350ms',
      description: 'Slower transitions for complex animations and page changes',
    },
  ];

  const easingTokens = [
    {
      name: 'Standard',
      variable: '--easing-standard',
      value: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      description: 'Balanced easing for most animations',
    },
    {
      name: 'Decelerate',
      variable: '--easing-decelerate',
      value: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      description: 'Slow out - for elements entering the screen',
    },
    {
      name: 'Accelerate',
      variable: '--easing-accelerate',
      value: 'cubic-bezier(0.4, 0.0, 1, 1)',
      description: 'Speed up - for elements exiting the screen',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Motion Tokens</h1>
      <p className="lead">
        Animation timing and easing functions for smooth, consistent motion across the design system.
        Motion provides feedback, guides attention, and creates polish.
      </p>

      <h2>Duration Tokens</h2>
      <p>
        Three timing options for different animation needs. Faster for micro-interactions,
        slower for complex transitions.
      </p>
      <div className="not-prose space-y-4 mb-8">
        {durationTokens.map((duration) => (
          <TokenDisplay
            key={duration.variable}
            name={duration.name}
            variable={duration.variable}
            value={duration.value}
            description={duration.description}
          />
        ))}
      </div>

      <h3>Duration Comparison</h3>
      <div className="not-prose mb-8 space-y-6">
        <div>
          <Stack direction="horizontal" spacing="md" className="mb-2">
            <span className="text-sm text-muted-foreground w-24">Fast (150ms)</span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAnimating1(!isAnimating1)}
            >
              Trigger
            </Button>
          </Stack>
          <div className="relative h-16 bg-muted rounded-lg overflow-hidden">
            <div
              className="absolute top-4 w-12 h-8 bg-primary rounded-md transition-all"
              style={{
                left: isAnimating1 ? 'calc(100% - 64px)' : '16px',
                transitionDuration: 'var(--duration-fast)',
                transitionTimingFunction: 'var(--easing-standard)',
              }}
            />
          </div>
        </div>

        <div>
          <Stack direction="horizontal" spacing="md" className="mb-2">
            <span className="text-sm text-muted-foreground w-24">Normal (250ms)</span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAnimating2(!isAnimating2)}
            >
              Trigger
            </Button>
          </Stack>
          <div className="relative h-16 bg-muted rounded-lg overflow-hidden">
            <div
              className="absolute top-4 w-12 h-8 bg-primary rounded-md transition-all"
              style={{
                left: isAnimating2 ? 'calc(100% - 64px)' : '16px',
                transitionDuration: 'var(--duration-normal)',
                transitionTimingFunction: 'var(--easing-standard)',
              }}
            />
          </div>
        </div>

        <div>
          <Stack direction="horizontal" spacing="md" className="mb-2">
            <span className="text-sm text-muted-foreground w-24">Slow (350ms)</span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAnimating3(!isAnimating3)}
            >
              Trigger
            </Button>
          </Stack>
          <div className="relative h-16 bg-muted rounded-lg overflow-hidden">
            <div
              className="absolute top-4 w-12 h-8 bg-primary rounded-md transition-all"
              style={{
                left: isAnimating3 ? 'calc(100% - 64px)' : '16px',
                transitionDuration: 'var(--duration-slow)',
                transitionTimingFunction: 'var(--easing-standard)',
              }}
            />
          </div>
        </div>
      </div>

      <h2>Easing Functions</h2>
      <p>
        Cubic bezier curves that define the acceleration and deceleration of animations.
        Different curves create different feelings of motion.
      </p>
      <div className="not-prose space-y-4 mb-8">
        {easingTokens.map((easing) => (
          <TokenDisplay
            key={easing.variable}
            name={easing.name}
            variable={easing.variable}
            value={easing.value}
            description={easing.description}
          />
        ))}
      </div>

      <h3>Easing Curve Visualization</h3>
      <div className="not-prose mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="mb-2 text-sm font-semibold">Standard</div>
            <svg viewBox="0 0 100 100" className="w-full h-24 bg-muted rounded-md">
              <path
                d="M 0 100 C 40 100, 20 0, 100 0"
                fill="none"
                stroke="hsl(var(--color-primary))"
                strokeWidth="2"
              />
            </svg>
            <p className="text-xs text-muted-foreground mt-2">Balanced acceleration</p>
          </div>
          <div className="text-center">
            <div className="mb-2 text-sm font-semibold">Decelerate</div>
            <svg viewBox="0 0 100 100" className="w-full h-24 bg-muted rounded-md">
              <path
                d="M 0 100 C 0 100, 20 0, 100 0"
                fill="none"
                stroke="hsl(var(--color-primary))"
                strokeWidth="2"
              />
            </svg>
            <p className="text-xs text-muted-foreground mt-2">Slow ending (enter)</p>
          </div>
          <div className="text-center">
            <div className="mb-2 text-sm font-semibold">Accelerate</div>
            <svg viewBox="0 0 100 100" className="w-full h-24 bg-muted rounded-md">
              <path
                d="M 0 100 C 40 100, 100 0, 100 0"
                fill="none"
                stroke="hsl(var(--color-primary))"
                strokeWidth="2"
              />
            </svg>
            <p className="text-xs text-muted-foreground mt-2">Fast ending (exit)</p>
          </div>
        </div>
      </div>

      <h2>Usage in Code</h2>
      <p>
        Always use motion tokens for consistent animation timing:
      </p>
      <pre className="not-prose">
        <code>{`/* ✅ CORRECT: Use motion tokens */
.button {
  transition: background-color var(--duration-fast) var(--easing-standard);
}

.modal {
  animation: slideIn var(--duration-normal) var(--easing-decelerate);
}

/* ❌ WRONG: Don't hardcode timing */
.button {
  transition: background-color 200ms ease-in-out;
}

.modal {
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}`}</code>
      </pre>

      <h3>Tailwind CSS Classes</h3>
      <pre className="not-prose">
        <code>{`<div className="transition-colors duration-fast ease-standard">
  Fast color transition
</div>

<div className="transition-all duration-normal">
  Standard transition
</div>

<div className="animate-in slide-in-from-bottom duration-slow">
  Slow entrance animation
</div>`}</code>
      </pre>

      <h2>Common Animation Patterns</h2>

      <h3>Fade In</h3>
      <pre className="not-prose">
        <code>{`@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn var(--duration-normal) var(--easing-standard);
}`}</code>
      </pre>

      <h3>Slide In</h3>
      <pre className="not-prose">
        <code>{`@keyframes slideIn {
  from {
    transform: translateY(16px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-in {
  animation: slideIn var(--duration-normal) var(--easing-decelerate);
}`}</code>
      </pre>

      <h3>Scale In</h3>
      <pre className="not-prose">
        <code>{`@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.scale-in {
  animation: scaleIn var(--duration-normal) var(--easing-standard);
}`}</code>
      </pre>

      <h2>Component Guidelines</h2>
      <table>
        <thead>
          <tr>
            <th>Interaction</th>
            <th>Duration</th>
            <th>Easing</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hover state</td>
            <td>fast</td>
            <td>standard</td>
            <td>Button background color</td>
          </tr>
          <tr>
            <td>Focus state</td>
            <td>fast</td>
            <td>standard</td>
            <td>Input border highlight</td>
          </tr>
          <tr>
            <td>Toggle switch</td>
            <td>normal</td>
            <td>standard</td>
            <td>Checkbox check animation</td>
          </tr>
          <tr>
            <td>Dropdown open</td>
            <td>normal</td>
            <td>decelerate</td>
            <td>Menu sliding down</td>
          </tr>
          <tr>
            <td>Modal enter</td>
            <td>normal</td>
            <td>decelerate</td>
            <td>Dialog fade and scale in</td>
          </tr>
          <tr>
            <td>Modal exit</td>
            <td>fast</td>
            <td>accelerate</td>
            <td>Dialog fade and scale out</td>
          </tr>
          <tr>
            <td>Page transition</td>
            <td>slow</td>
            <td>standard</td>
            <td>Route change animation</td>
          </tr>
          <tr>
            <td>Toast appear</td>
            <td>normal</td>
            <td>decelerate</td>
            <td>Notification slide in</td>
          </tr>
        </tbody>
      </table>

      <h2>Best Practices</h2>
      <ul>
        <li>Default to <code>duration-normal</code> (250ms) for most animations</li>
        <li>Use <code>duration-fast</code> (150ms) for micro-interactions like hover states</li>
        <li>Use <code>duration-slow</code> (350ms) sparingly for complex transitions</li>
        <li>Use <code>easing-standard</code> for most animations</li>
        <li>Use <code>easing-decelerate</code> for elements entering the screen</li>
        <li>Use <code>easing-accelerate</code> for elements exiting the screen</li>
        <li>Avoid animations longer than 500ms - they feel sluggish</li>
        <li>Respect <code>prefers-reduced-motion</code> for accessibility</li>
        <li>Don't animate layout properties (width, height) - use transforms instead</li>
        <li>Keep animations purposeful - not just decorative</li>
      </ul>

      <h2>Accessibility</h2>
      <p>
        Always respect user motion preferences:
      </p>
      <pre className="not-prose">
        <code>{`@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`}</code>
      </pre>
      <ul>
        <li>Users can disable animations in their OS settings</li>
        <li>Motion can trigger vestibular disorders - always provide static alternatives</li>
        <li>Animations should enhance, not obstruct functionality</li>
        <li>Loading animations are exempt from motion reduction (they convey state)</li>
      </ul>

      <h2>Animation Principles</h2>
      <p>
        Our motion system is built on four core principles that guide when and how to animate:
      </p>

      <h3>Purpose Over Polish</h3>
      <p>
        Animations should communicate state changes and guide user attention, not just add visual
        decoration. Every animation must serve a functional purpose - whether that's confirming an
        action, directing focus to new content, or showing a transition between states. If you can't
        explain why an animation exists beyond "it looks nice," it probably shouldn't be there.
      </p>

      <h3>Consistency</h3>
      <p>
        Use the same duration and easing for similar interactions across the application for
        predictable behavior. When users see a button hover animation, they form expectations about
        how other interactive elements will behave. Breaking these expectations creates cognitive
        load. Consistent motion patterns build user confidence and make the interface feel cohesive.
      </p>

      <h3>Hierarchy</h3>
      <p>
        More important elements get more noticeable animations. Modals use slower, more prominent
        animations than tooltips. A critical notification might slide in with a bounce, while a
        subtle state change gets a quick fade. This hierarchy helps users understand what demands
        their immediate attention versus what can wait.
      </p>

      <h3>Performance</h3>
      <p>
        Prefer transforms and opacity changes (GPU-accelerated) over animating layout properties
        like width and height. Animating layout properties forces the browser to recalculate styles,
        layout, and paint - an expensive operation that causes jank. Transforms and opacity changes
        are handled by the GPU compositor, ensuring smooth 60fps animations even on lower-end devices.
      </p>
      <pre className="not-prose">
        <code>{`/* ✅ GOOD: GPU-accelerated */
.element {
  transform: translateX(100px);
  opacity: 0;
  transition: transform var(--duration-normal), opacity var(--duration-normal);
}

/* ❌ BAD: Triggers layout recalculation */
.element {
  width: 200px;
  left: 100px;
  transition: width var(--duration-normal), left var(--duration-normal);
}`}</code>
      </pre>

      <h2>Related Tokens</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/tokens/color-tokens"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Color Tokens
          </h3>
          <p className="text-sm text-muted-foreground">Colors for animated state changes</p>
        </Link>
        <Link
          href="/tokens/shadow-tokens"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Shadow Tokens
          </h3>
          <p className="text-sm text-muted-foreground">Elevation transitions and shadow animations</p>
        </Link>
        <Link
          href="/tokens/spacing-tokens"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Spacing Tokens
          </h3>
          <p className="text-sm text-muted-foreground">Transform distances for slide animations</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/design-system/app/tokens/motion-tokens/page.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API"
              external
              showIcon
            >
              Web Animations API Documentation
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://web.dev/animations/"
              external
              showIcon
            >
              Animation Performance Best Practices
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
