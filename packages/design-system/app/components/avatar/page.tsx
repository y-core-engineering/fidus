'use client';

import { Avatar, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';

export default function AvatarPage() {
  const props = [
    {
      name: 'src',
      type: 'string',
      description: 'Image URL',
    },
    {
      name: 'alt',
      type: 'string',
      description: 'Alt text for image',
    },
    {
      name: 'fallback',
      type: 'string',
      description: 'Name for initials fallback',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg' | 'xl'",
      default: "'md'",
      description: 'Avatar size',
    },
    {
      name: 'shape',
      type: "'circle' | 'square'",
      default: "'circle'",
      description: 'Avatar shape',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Avatar</h1>
      <p className="lead">
        Visual representation of a user or entity. Supports images, initials fallback,
        and icon fallback with multiple sizes and shapes.
      </p>

      <h2>With Image</h2>
      <ComponentPreview
        code={`<Avatar
  src="https://i.pravatar.cc/150?img=1"
  alt="User Avatar"
/>`}
      >
        <Avatar
          src="https://i.pravatar.cc/150?img=1"
          alt="User Avatar"
        />
      </ComponentPreview>

      <h2>With Initials</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md">
  <Avatar fallback="John Doe" />
  <Avatar fallback="Jane Smith" />
  <Avatar fallback="Bob Wilson" />
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md">
          <Avatar fallback="John Doe" />
          <Avatar fallback="Jane Smith" />
          <Avatar fallback="Bob Wilson" />
        </Stack>
      </ComponentPreview>

      <h2>Icon Fallback</h2>
      <ComponentPreview
        code={`<Avatar />`}
      >
        <Avatar />
      </ComponentPreview>

      <h2>Sizes</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md" align="center">
  <Avatar size="sm" fallback="SM" />
  <Avatar size="md" fallback="MD" />
  <Avatar size="lg" fallback="LG" />
  <Avatar size="xl" fallback="XL" />
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" align="center">
          <Avatar size="sm" fallback="SM" />
          <Avatar size="md" fallback="MD" />
          <Avatar size="lg" fallback="LG" />
          <Avatar size="xl" fallback="XL" />
        </Stack>
      </ComponentPreview>

      <h2>Shapes</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md">
  <Avatar shape="circle" fallback="Circle" />
  <Avatar shape="square" fallback="Square" />
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md">
          <Avatar shape="circle" fallback="Circle" />
          <Avatar shape="square" fallback="Square" />
        </Stack>
      </ComponentPreview>

      <h2>In Context</h2>
      <ComponentPreview
        code={`<div className="flex items-center gap-3">
  <Avatar
    src="https://i.pravatar.cc/150?img=2"
    alt="John Doe"
  />
  <div>
    <div className="font-semibold">John Doe</div>
    <div className="text-sm text-muted-foreground">john@example.com</div>
  </div>
</div>`}
      >
        <div className="flex items-center gap-3">
          <Avatar
            src="https://i.pravatar.cc/150?img=2"
            alt="John Doe"
          />
          <div>
            <div className="font-semibold">John Doe</div>
            <div className="text-sm text-muted-foreground">john@example.com</div>
          </div>
        </div>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Fallback Behavior</h2>
      <p>The Avatar component has a three-tier fallback system:</p>
      <ol>
        <li><strong>Image:</strong> If <code>src</code> is provided and loads successfully</li>
        <li><strong>Initials:</strong> If image fails or <code>fallback</code> name is provided</li>
        <li><strong>Icon:</strong> If no image or fallback name is available</li>
      </ol>

      <h2>Usage Guidelines</h2>
      <h3>When to use</h3>
      <ul>
        <li>For user profiles and account menus</li>
        <li>For comment threads and activity feeds</li>
        <li>For team member lists</li>
        <li>For contact lists</li>
      </ul>

      <h3>Best practices</h3>
      <ul>
        <li>Always provide descriptive <code>alt</code> text for images</li>
        <li>Use <code>fallback</code> for better UX when images fail to load</li>
        <li>Use circle shape for user avatars (default)</li>
        <li>Use square shape for organizations or brands</li>
        <li>Match size to context (sm for lists, lg for profiles)</li>
        <li>Ensure consistent sizing in lists</li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>Images include alt text for screen readers</li>
        <li>Initials are readable text, not background images</li>
        <li>Icon fallback uses semantic SVG with proper aria labels</li>
        <li>Sufficient color contrast for initials on background</li>
      </ul>
    </div>
  );
}
