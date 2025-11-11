'use client';

import { Avatar } from '@fidus/ui/avatar';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
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
        code={`<Stack direction="horizontal" spacing="md" align="center">
  <Avatar
    src="https://i.pravatar.cc/150?img=2"
    alt="John Doe"
  />
  <div>
    <div className="font-semibold">John Doe</div>
    <div className="text-sm text-muted-foreground">john@example.com</div>
  </div>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md" align="center">
          <Avatar
            src="https://i.pravatar.cc/150?img=2"
            alt="John Doe"
          />
          <div>
            <div className="font-semibold">John Doe</div>
            <div className="text-sm text-muted-foreground">john@example.com</div>
          </div>
        </Stack>
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
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For user profiles and account menus</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For comment threads and activity feeds</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For team member lists</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For contact lists</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Always provide descriptive <code>alt</code> text for images</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use <code>fallback</code> for better UX when images fail to load</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use circle shape for user avatars (default)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use square shape for organizations or brands</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Match size to context (sm for lists, lg for profiles)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Ensure consistent sizing in lists</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Images include alt text for screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Initials are readable text, not background images</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Icon fallback uses semantic SVG with proper aria labels</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Sufficient color contrast for initials on background</span>
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
              <span>Use circle shape for user avatars</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide fallback names for initials</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use consistent sizes in lists</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Include descriptive alt text</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Stack direction="horizontal" spacing="md" align="center">
  <Avatar
    src="https://i.pravatar.cc/150?img=3"
    alt="Sarah Johnson"
    fallback="Sarah Johnson"
  />
  <div>
    <div className="font-semibold">Sarah Johnson</div>
    <div className="text-sm text-muted-foreground">Designer</div>
  </div>
</Stack>`}
            >
              <Stack direction="horizontal" spacing="md" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=3"
                  alt="Sarah Johnson"
                  fallback="Sarah Johnson"
                />
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">Designer</div>
                </div>
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
              <span>Mix different sizes in the same list</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use generic alt text like "avatar" or "profile"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use square avatars for people</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Leave alt text empty when using images</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Stack direction="horizontal" spacing="md" align="center">
  <Avatar size="xl" src="https://i.pravatar.cc/150?img=4" alt="avatar" />
  <Avatar size="sm" src="https://i.pravatar.cc/150?img=5" />
  <Avatar size="md" shape="square" fallback="John" />
</Stack>`}
            >
              <Stack direction="horizontal" spacing="md" align="center">
                <Avatar size="xl" src="https://i.pravatar.cc/150?img=4" alt="avatar" />
                <Avatar size="sm" src="https://i.pravatar.cc/150?img=5" />
                <Avatar size="md" shape="square" fallback="John" />
              </Stack>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/badge"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Badge
          </h3>
          <p className="text-sm text-muted-foreground">Use badges with avatars to show status or notifications</p>
        </Link>
        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">Combine avatars with buttons for user action menus</p>
        </Link>
        <Link
          href="/components/card"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Card
          </h3>
          <p className="text-sm text-muted-foreground">Display avatars within cards for user profiles</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/avatar/avatar.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/WCAG21/Understanding/images-of-text.html"
              external
              showIcon
            >
              WCAG: Images of Text
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
