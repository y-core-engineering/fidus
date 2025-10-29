'use client';

import { IconButton, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { Search, Heart, Share2, Trash2 } from 'lucide-react';

export default function IconButtonPage() {
  const props = [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'tertiary' | 'error'",
      default: "'primary'",
      description: 'Visual style variant of the icon button',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the icon button',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Whether the button is disabled',
    },
    {
      name: 'aria-label',
      type: 'string',
      required: true,
      description: 'Accessible label for screen readers (required for accessibility)',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      required: true,
      description: 'Icon element (usually from lucide-react)',
    },
    {
      name: 'onClick',
      type: '() => void',
      description: 'Click event handler',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Icon Button</h1>
      <p className="lead">
        Icon buttons are compact buttons that display only an icon. They are used for
        secondary actions and toolbar controls where space is limited.
      </p>

      <h2>Variants</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md" align="center">
  <IconButton variant="primary" aria-label="Search">
    <Search className="h-5 w-5" />
  </IconButton>
  <IconButton variant="secondary" aria-label="Like">
    <Heart className="h-5 w-5" />
  </IconButton>
  <IconButton variant="tertiary" aria-label="Share">
    <Share2 className="h-5 w-5" />
  </IconButton>
  <IconButton variant="error" aria-label="Delete">
    <Trash2 className="h-5 w-5" />
  </IconButton>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" align="center">
          <IconButton variant="primary" aria-label="Search">
            <Search className="h-5 w-5" />
          </IconButton>
          <IconButton variant="secondary" aria-label="Like">
            <Heart className="h-5 w-5" />
          </IconButton>
          <IconButton variant="tertiary" aria-label="Share">
            <Share2 className="h-5 w-5" />
          </IconButton>
          <IconButton variant="error" aria-label="Delete">
            <Trash2 className="h-5 w-5" />
          </IconButton>
        </Stack>
      </ComponentPreview>

      <h2>Sizes</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md" align="center">
  <IconButton size="sm" aria-label="Search">
    <Search className="h-4 w-4" />
  </IconButton>
  <IconButton size="md" aria-label="Search">
    <Search className="h-5 w-5" />
  </IconButton>
  <IconButton size="lg" aria-label="Search">
    <Search className="h-6 w-6" />
  </IconButton>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" align="center">
          <IconButton size="sm" aria-label="Search">
            <Search className="h-4 w-4" />
          </IconButton>
          <IconButton size="md" aria-label="Search">
            <Search className="h-5 w-5" />
          </IconButton>
          <IconButton size="lg" aria-label="Search">
            <Search className="h-6 w-6" />
          </IconButton>
        </Stack>
      </ComponentPreview>

      <h2>States</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md" align="center">
  <IconButton aria-label="Search">
    <Search className="h-5 w-5" />
  </IconButton>
  <IconButton disabled aria-label="Search">
    <Search className="h-5 w-5" />
  </IconButton>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" align="center">
          <IconButton aria-label="Search">
            <Search className="h-5 w-5" />
          </IconButton>
          <IconButton disabled aria-label="Search">
            <Search className="h-5 w-5" />
          </IconButton>
        </Stack>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For toolbars and compact action bars</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For secondary actions next to primary content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When space is limited and the icon meaning is clear</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For repeated actions in lists or tables</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Always provide an aria-label for accessibility</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use widely recognized icons (search, close, delete, etc.)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Match icon size to button size (sm: h-4, md: h-5, lg: h-6)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Consider adding a tooltip for less common icons</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use consistent icon style throughout the application</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>aria-label is required for screen readers to describe the action</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>All icon buttons have proper focus states for keyboard navigation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Disabled buttons are marked with aria-disabled</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>The icon should be clearly recognizable and not ambiguous</span>
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
              <span>Use widely recognized icons that users will understand instantly</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Always provide descriptive aria-label attributes</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Add tooltips for icon buttons to improve discoverability</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use consistent icon sizes within the same context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use error variant for destructive actions like delete</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Stack direction="horizontal" spacing="sm">
  <IconButton variant="secondary" aria-label="Edit">
    <Search className="h-5 w-5" />
  </IconButton>
  <IconButton variant="error" aria-label="Delete">
    <Trash2 className="h-5 w-5" />
  </IconButton>
</Stack>`}
            >
              <Stack direction="horizontal" spacing="sm">
                <IconButton variant="secondary" aria-label="Edit">
                  <Search className="h-5 w-5" />
                </IconButton>
                <IconButton variant="error" aria-label="Delete">
                  <Trash2 className="h-5 w-5" />
                </IconButton>
              </Stack>
            </ComponentPreview>
          </div>
        </div>

        {/* Don'ts */}
        <div className="border-2 border-error bg-error/10 rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don't
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use obscure icons that require explanation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't omit aria-label - it's required for accessibility</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't mix icon sizes randomly in toolbars</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use icon buttons for primary page actions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use icons that look similar for different actions</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Stack direction="horizontal" spacing="sm">
  <IconButton variant="primary" size="lg" aria-label="Action 1">
    <Search className="h-6 w-6" />
  </IconButton>
  <IconButton variant="primary" size="sm" aria-label="Action 2">
    <Heart className="h-4 w-4" />
  </IconButton>
</Stack>`}
            >
              <Stack direction="horizontal" spacing="sm">
                <IconButton variant="primary" size="lg" aria-label="Action 1">
                  <Search className="h-6 w-6" />
                </IconButton>
                <IconButton variant="primary" size="sm" aria-label="Action 2">
                  <Heart className="h-4 w-4" />
                </IconButton>
              </Stack>
            </ComponentPreview>
          </div>
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
          <p className="text-sm text-muted-foreground">Full button with text label</p>
        </Link>
        <Link
          href="/components/button-group"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button Group
          </h3>
          <p className="text-sm text-muted-foreground">Group related buttons together</p>
        </Link>
        <Link
          href="/components/tooltip"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Tooltip
          </h3>
          <p className="text-sm text-muted-foreground">Add helpful hints to icon buttons</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/icon-button/icon-button.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/button/"
              external
              showIcon
            >
              ARIA: Button Pattern
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
