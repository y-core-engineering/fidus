'use client';

import { IconButton } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { Search, Heart, Share2, Trash2 } from 'lucide-react';

export default function IconButtonPage() {
  const props = [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'tertiary' | 'destructive'",
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
        code={`<div className="flex items-center gap-4">
  <IconButton variant="primary" aria-label="Search">
    <Search className="h-5 w-5" />
  </IconButton>
  <IconButton variant="secondary" aria-label="Like">
    <Heart className="h-5 w-5" />
  </IconButton>
  <IconButton variant="tertiary" aria-label="Share">
    <Share2 className="h-5 w-5" />
  </IconButton>
  <IconButton variant="destructive" aria-label="Delete">
    <Trash2 className="h-5 w-5" />
  </IconButton>
</div>`}
      >
        <div className="flex items-center gap-4">
          <IconButton variant="primary" aria-label="Search">
            <Search className="h-5 w-5" />
          </IconButton>
          <IconButton variant="secondary" aria-label="Like">
            <Heart className="h-5 w-5" />
          </IconButton>
          <IconButton variant="tertiary" aria-label="Share">
            <Share2 className="h-5 w-5" />
          </IconButton>
          <IconButton variant="destructive" aria-label="Delete">
            <Trash2 className="h-5 w-5" />
          </IconButton>
        </div>
      </ComponentPreview>

      <h2>Sizes</h2>
      <ComponentPreview
        code={`<div className="flex items-center gap-4">
  <IconButton size="sm" aria-label="Search">
    <Search className="h-4 w-4" />
  </IconButton>
  <IconButton size="md" aria-label="Search">
    <Search className="h-5 w-5" />
  </IconButton>
  <IconButton size="lg" aria-label="Search">
    <Search className="h-6 w-6" />
  </IconButton>
</div>`}
      >
        <div className="flex items-center gap-4">
          <IconButton size="sm" aria-label="Search">
            <Search className="h-4 w-4" />
          </IconButton>
          <IconButton size="md" aria-label="Search">
            <Search className="h-5 w-5" />
          </IconButton>
          <IconButton size="lg" aria-label="Search">
            <Search className="h-6 w-6" />
          </IconButton>
        </div>
      </ComponentPreview>

      <h2>States</h2>
      <ComponentPreview
        code={`<div className="flex items-center gap-4">
  <IconButton aria-label="Search">
    <Search className="h-5 w-5" />
  </IconButton>
  <IconButton disabled aria-label="Search">
    <Search className="h-5 w-5" />
  </IconButton>
</div>`}
      >
        <div className="flex items-center gap-4">
          <IconButton aria-label="Search">
            <Search className="h-5 w-5" />
          </IconButton>
          <IconButton disabled aria-label="Search">
            <Search className="h-5 w-5" />
          </IconButton>
        </div>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <h3>When to use</h3>
      <ul>
        <li>For toolbars and compact action bars</li>
        <li>For secondary actions next to primary content</li>
        <li>When space is limited and the icon meaning is clear</li>
        <li>For repeated actions in lists or tables</li>
      </ul>

      <h3>Best practices</h3>
      <ul>
        <li>Always provide an aria-label for accessibility</li>
        <li>Use widely recognized icons (search, close, delete, etc.)</li>
        <li>Match icon size to button size (sm: h-4, md: h-5, lg: h-6)</li>
        <li>Consider adding a tooltip for less common icons</li>
        <li>Use consistent icon style throughout the application</li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>aria-label is required for screen readers to describe the action</li>
        <li>All icon buttons have proper focus states for keyboard navigation</li>
        <li>Disabled buttons are marked with aria-disabled</li>
        <li>The icon should be clearly recognizable and not ambiguous</li>
      </ul>
    </div>
  );
}
