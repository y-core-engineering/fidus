# Component Page Template

This document defines the standard structure and patterns for all component documentation pages in the Fidus Design System. The Button component serves as the reference implementation.

## File Structure

Each component page should follow this structure:

```tsx
'use client';

import { ComponentName, Link, Stack /* other components */ } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
// Icons if needed
import { IconName } from 'lucide-react';

export default function ComponentNamePage() {
  // Props definition array
  const props = [
    {
      name: 'propName',
      type: 'string | number',
      default: "'default'",
      required: true, // optional
      description: 'Description of the prop',
    },
    // ... more props
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {/* Content sections */}
    </div>
  );
}
```

## Required Sections (in order)

### 1. Title and Lead Description
```tsx
<h1>Component Name</h1>
<p className="lead">
  Brief description of what the component does and when to use it.
</p>
```

### 2. Visual Examples
Show all variants, sizes, states with `ComponentPreview`:

```tsx
<h2>Variants</h2>
<ComponentPreview code={`<Component variant="primary">Example</Component>`}>
  <Component variant="primary">Example</Component>
</ComponentPreview>
```

### 3. Props Table
```tsx
<h2>Props</h2>
<PropsTable props={props} />
```

### 4. Usage Guidelines
```tsx
<h2>Usage Guidelines</h2>
<div className="not-prose space-y-lg my-lg">
  <div>
    <h3 className="text-lg font-semibold mb-md">When to use</h3>
    <ul className="space-y-sm text-sm">
      <li className="flex gap-sm">
        <span className="text-muted-foreground shrink-0">•</span>
        <span>Use case description</span>
      </li>
    </ul>
  </div>

  <div>
    <h3 className="text-lg font-semibold mb-md">Best practices</h3>
    <ul className="space-y-sm text-sm">
      <li className="flex gap-sm">
        <span className="text-muted-foreground shrink-0">•</span>
        <span>Best practice description</span>
      </li>
    </ul>
  </div>

  <div>
    <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
    <ul className="space-y-sm text-sm">
      <li className="flex gap-sm">
        <span className="text-muted-foreground shrink-0">•</span>
        <span>Accessibility feature</span>
      </li>
    </ul>
  </div>
</div>
```

### 5. Do's and Don'ts
```tsx
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
        <span>Do this good practice</span>
      </li>
    </ul>
    <div className="mt-md p-md bg-success/10 rounded-md">
      <ComponentPreview code={`<GoodExample />`}>
        <GoodExample />
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
        <span>Don't do this anti-pattern</span>
      </li>
    </ul>
    <div className="mt-md p-md bg-error/20 rounded-md">
      <ComponentPreview code={`<BadExample />`}>
        <BadExample />
      </ComponentPreview>
    </div>
  </div>
</div>
```

### 6. Related Components
```tsx
<h2>Related Components</h2>
<div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
  <Link
    href="/components/related-component"
    className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
  >
    <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
      Related Component
    </h3>
    <p className="text-sm text-muted-foreground">Brief description</p>
  </Link>
  {/* More related components */}
</div>
```

### 7. Resources
```tsx
<h2>Resources</h2>
<div className="not-prose my-lg">
  <ul className="space-y-md">
    <li>
      <Link
        variant="standalone"
        href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/component-name/component-name.tsx"
        external
        showIcon
      >
        View source on GitHub
      </Link>
    </li>
    <li>
      <Link
        variant="standalone"
        href="https://www.w3.org/WAI/ARIA/apg/patterns/component-pattern/"
        external
        showIcon
      >
        ARIA: Component Pattern
      </Link>
    </li>
    <li>
      <Link variant="standalone" href="/getting-started/for-developers">
        Installation guide
      </Link>
    </li>
  </ul>
</div>
```

## Design System Rules

### ✅ ALWAYS Use

#### 1. Components from @fidus/ui
```tsx
import { Button, Link, Stack, Badge, /* etc */ } from '@fidus/ui';
```

**Never use:**
- `<a>` tags → Use `<Link>` from `@fidus/ui`
- `<div className="flex...">` → Use `<Stack>` from `@fidus/ui`

#### 2. Spacing Tokens (NEVER hardcoded values)
```tsx
// ✅ CORRECT
gap-xs     // 4px
gap-sm     // 8px
gap-md     // 16px
gap-lg     // 24px
gap-xl     // 32px
gap-2xl    // 48px
gap-3xl    // 64px

// Same for: space-y-*, space-x-*, p-*, px-*, py-*, m-*, mt-*, mb-*, ml-*, mr-*

// ❌ WRONG
gap-2, gap-4, gap-6, p-3, p-6, space-y-3
```

#### 3. Stack Component for Layouts
```tsx
// ✅ CORRECT
<Stack direction="horizontal" spacing="md" align="center">
  <Button>One</Button>
  <Button>Two</Button>
</Stack>

// ❌ WRONG
<div className="flex items-center gap-md">
  <Button>One</Button>
  <Button>Two</Button>
</div>
```

#### 4. Link Component
```tsx
// ✅ CORRECT - External links
<Link variant="standalone" href="https://example.com" external showIcon>
  External Link
</Link>

// ✅ CORRECT - Internal links
<Link variant="standalone" href="/path">
  Internal Link
</Link>

// ✅ CORRECT - Card links (no underline)
<Link href="/path" className="... no-underline">
  Card Content
</Link>

// ❌ WRONG
<a href="..." target="_blank" className="text-primary hover:underline">
  Link
</a>
```

#### 5. Color Tokens
```tsx
// ✅ CORRECT
text-error        // Red (for destructive/errors)
text-success      // Green (for success)
text-warning      // Orange/Yellow (for warnings)
text-info         // Blue (for info)
text-primary      // Brand color
text-muted-foreground
border-border
bg-background

// ❌ WRONG
text-destructive  // This doesn't exist in color tokens!
text-red-500      // Don't use Tailwind color scales
```

#### 6. Transitions
```tsx
// ✅ CORRECT
transition-colors duration-normal

// ❌ WRONG
transition-all  // Too broad, less performant
```

#### 7. Border Radius
```tsx
// ✅ CORRECT
rounded-sm   // 4px
rounded-md   // 8px
rounded-lg   // 12px
rounded-xl   // 16px
rounded-full // Circle/pill

// ❌ WRONG
rounded  // Too vague, use explicit size
```

### ❌ NEVER Use

1. **Hardcoded spacing values**: `gap-2`, `gap-4`, `p-3`, `space-y-6`
2. **Manual flexbox**: `<div className="flex items-center gap-4">`
3. **Plain anchor tags**: `<a href="...">`
4. **transition-all**: Use `transition-colors` or `transition-transform`
5. **destructive color**: Use `error` instead
6. **Tailwind color scales**: `text-red-500`, `bg-blue-100`

## Checklist for Each Component Page

Before marking a component page as complete, verify:

- [ ] Imports `Link`, `Stack`, and component from `@fidus/ui`
- [ ] All spacing uses tokens (`gap-md`, `p-lg`, `space-y-sm`)
- [ ] All flexbox layouts use `<Stack>`
- [ ] All links use `<Link variant="standalone">`
- [ ] Related Components links have `no-underline`
- [ ] Colors use tokens (`error`, `success`, `border`, `primary`)
- [ ] Transitions use `transition-colors duration-normal`
- [ ] Border radius is explicit (`rounded-md`, not `rounded`)
- [ ] Has "Do's and Don'ts" section with examples
- [ ] Has "Related Components" section (minimum 2-3 links)
- [ ] Has "Resources" section (GitHub, ARIA, Installation)

## Common Patterns

### List Items with Bullets
```tsx
<li className="flex gap-sm">
  <span className="text-muted-foreground shrink-0">•</span>
  <span>List item content</span>
</li>
```

### Section Headers
```tsx
<h3 className="text-lg font-semibold mb-md">Section Title</h3>
```

### Icon in Text
```tsx
<h3 className="... flex items-center gap-sm">
  <span>✓</span> Text
</h3>
```

### Grid Layouts
```tsx
// 2 columns on medium screens
<div className="grid md:grid-cols-2 gap-lg">

// 3 columns on large screens
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-md">
```

## Reference Implementation

See [packages/design-system/app/components/button/page.tsx](packages/design-system/app/components/button/page.tsx) for the complete reference implementation.

## Questions?

If you're unsure about a pattern, check the Button component first. If it's not covered there, ask before implementing.
