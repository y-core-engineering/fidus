# @fidus/ui

Fidus UI Component Library - A modern, accessible React component library built with Radix UI primitives and Tailwind CSS.

[![npm version](https://badge.fury.io/js/@fidus%2Fui.svg)](https://www.npmjs.com/package/@fidus/ui)
[![License](https://img.shields.io/badge/license-Sustainable%20Use-blue.svg)](../../LICENSE.md)

---

## 🤖 AI Assistant Quick Reference

**This section is for AI coding assistants (Claude, GitHub Copilot, etc.) to quickly understand how to use this library.**

### Key Information for AI Assistants

1. **Package Name**: `@fidus/ui`
2. **Framework**: React 18+ with TypeScript
3. **Styling**: Tailwind CSS + CSS Variables
4. **Component Primitives**: Radix UI
5. **Import Pattern**:
   - **Production (Recommended)**: Subpath imports for tree-shaking → `import { Button } from '@fidus/ui/button'`
   - **Development**: Barrel imports for convenience → `import { Button } from '@fidus/ui'`

### Required Setup Steps (IMPORTANT!)

When helping users integrate `@fidus/ui` into a new project, **always** follow these steps:

1. **Install package**: `npm install @fidus/ui`
2. **Install Tailwind CSS** (if not already installed): `npm install -D tailwindcss postcss autoprefixer`
3. **Configure Tailwind** - Use the Fidus preset in `tailwind.config.ts`:
   ```typescript
   import fidusTailwindPreset from '@fidus/ui/tailwind';
   export default {
     presets: [fidusTailwindPreset],
     content: ['./src/**/*.{js,ts,jsx,tsx}', './node_modules/@fidus/ui/dist/**/*.{js,mjs}'],
   };
   ```
4. **Import CSS variables** - Add to root CSS file or layout:
   ```typescript
   import '@fidus/ui/styles.css';
   ```

### Common Mistakes to Avoid

- ❌ **Don't** import `@fidus/ui` without setting up Tailwind first
- ❌ **Don't** forget to import `@fidus/ui/styles.css` - components won't style correctly
- ❌ **Don't** use `import * as` - always use named imports
- ❌ **Don't** customize colors in `tailwind.config.ts` - override CSS variables instead
- ⚠️ **Tip**: Use subpath imports (`@fidus/ui/button`) instead of barrel imports (`@fidus/ui`) in production for 95% smaller bundles

### Component Import Examples

```typescript
// ✅ BEST - Subpath imports (production, 95% smaller bundles)
import { Button } from '@fidus/ui/button';
import { TextInput } from '@fidus/ui/text-input';
import { Modal } from '@fidus/ui/modal';

// ✅ OK - Barrel imports (development, convenient but larger bundles)
import { Button, TextInput, Modal } from '@fidus/ui';

// ❌ Wrong - Default import
import FidusUI from '@fidus/ui';

// ❌ Wrong - Wildcard import
import * as FidusUI from '@fidus/ui';
```

**Bundle Size Comparison:**
- Subpath import (`from '@fidus/ui/button'`): ~4KB
- Barrel import (`from '@fidus/ui'`): ~370KB
- **Recommendation**: Use subpath imports in production builds for 95% bundle size reduction

### Available Components by Category

**Forms**: Button, TextInput, TextArea, Checkbox, RadioButton, ToggleSwitch, Select, DatePicker, TimePicker, FileUpload
**Layout**: Container, Grid, Stack, Divider
**Display**: Table, List, Badge, Chip, Avatar, OpportunityCard, DetailCard, EmptyCard
**Feedback**: Toast, Modal, Alert, Banner, ProgressBar, Spinner, Skeleton
**Overlays**: Dropdown, Popover, Tooltip, Drawer
**Navigation**: Tabs, Breadcrumbs, Pagination, Header, Sidebar
**Chat**: MessageBubble, ChatInterface, ConfidenceIndicator

**All 45 components support subpath imports** for optimal tree-shaking. See the [Tree-Shaking section](#tree-shaking--bundle-optimization) for the complete list.

### TypeScript Usage

All components are fully typed. Import types:

```typescript
// Subpath imports (recommended)
import type { ButtonProps } from '@fidus/ui/button';
import type { ModalProps } from '@fidus/ui/modal';

// Barrel imports (also works)
import type { ButtonProps, ModalProps } from '@fidus/ui';
```

### Styling Pattern

- **CSS Variables**: Override in `:root` selector (see Theming section)
- **Tailwind Classes**: Use standard Tailwind utilities
- **Dark Mode**: Add `dark` class to root element
- **Custom Styles**: Pass `className` prop to any component

---

## Features

- 🎨 **Modern Design** - Clean, minimal design with dark mode support
- ♿ **Accessible** - WCAG 2.1 AA compliant with ARIA attributes
- 📱 **Responsive** - Mobile-first design with breakpoints
- 🔒 **Type Safe** - Written in TypeScript with comprehensive types
- 🎯 **Validated** - Zod schemas for runtime prop validation
- 🌳 **Tree-shakeable** - Optimized bundle size with ESM/CJS exports
- 🎭 **Customizable** - CSS variables for easy theming
- ⚡ **SSR Optimized** - 16 components work with Next.js, Remix, and other SSR frameworks
- 📚 **Production Ready** - 133+ SSR compatibility tests, 3 complete example projects

## Installation

```bash
npm install @fidus/ui
```

Or with pnpm:

```bash
pnpm add @fidus/ui
```

Or with yarn:

```bash
yarn add @fidus/ui
```

## Peer Dependencies

This library requires React 18 or higher:

```bash
npm install react react-dom
```

## Setup (Required for External Projects)

To use `@fidus/ui` in your project, you need to set up Tailwind CSS and import the required styles.

### 1. Install Tailwind CSS

If you haven't already, install Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Configure Tailwind

Update your `tailwind.config.ts` to use the Fidus preset:

```typescript
import type { Config } from 'tailwindcss';
import fidusTailwindPreset from '@fidus/ui/tailwind';

const config: Config = {
  presets: [fidusTailwindPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@fidus/ui/dist/**/*.{js,mjs}',
  ],
  // Your custom configuration...
};

export default config;
```

### 3. Import Styles

Import the Fidus UI styles in your root CSS or layout file:

```css
/* src/app/globals.css or src/index.css */
@import '@fidus/ui/styles.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Or import directly in your root layout/app file:

```typescript
// src/app/layout.tsx or src/main.tsx
import '@fidus/ui/styles.css';
import './globals.css';
```

### 4. Dark Mode (Optional)

The Fidus UI components support dark mode out of the box. To enable dark mode, add the `dark` class to your root element:

```tsx
// Add to your layout or app component
<html className="dark">
  {/* Your app */}
</html>
```

Or use a dynamic class based on user preference:

```tsx
const [isDark, setIsDark] = useState(false);

<html className={isDark ? 'dark' : ''}>
  {/* Your app */}
</html>
```

## Server-Side Rendering (SSR) Support

`@fidus/ui` has comprehensive SSR support for Next.js, Remix, Gatsby, and other SSR frameworks:

### SSR-Optimized Components (16 total)

These components render completely on the server with no client-side JavaScript required:

- **Forms**: TextInput, TextArea, FileUpload, TimePicker, Checkbox, RadioButton, ToggleSwitch
- **Display**: Alert, Banner, Chip, DetailCard, ErrorState, ConfidenceIndicator
- **Navigation**: Avatar, Breadcrumbs, Pagination

### SSR-Safe Components (All 40+ components)

All components are SSR-safe and won't crash during server-side rendering. Components using Radix UI primitives (Modal, Drawer, Toast, Tabs, ProgressBar, Select, DatePicker, Tooltip, Popover, Dropdown) require client-side JavaScript for interactivity but render safely in SSR.

### Example Projects

See complete working examples in the `/examples` directory:

- **[Next.js 14 App Router](/examples/nextjs-app-router)** - Modern Next.js with App Router
- **[Next.js Pages Router](/examples/nextjs-pages-router)** - Traditional Next.js SSR
- **[Vite + React](/examples/vite-react)** - Client-side rendering with Vite

Each example includes 15+ components, Tailwind CSS integration, and documentation.

### SSR Testing

All components have been tested with `renderToString()` compatibility:
- **133 SSR compatibility tests** covering all 40+ components
- Verified Portal components (Toast, Modal, Drawer) don't crash during SSR
- Tested client-side components (Tabs, ProgressBar, Chat) for SSR safety
- 100% test pass rate across all component variants and edge cases

### Benefits

- **Better SEO** - Content renders on the server for search engines
- **Faster Initial Loads** - ~25-28% reduction in client-side JavaScript bundle
- **Improved Core Web Vitals** - Better FCP, LCP, and TTI scores
- **Zero Breaking Changes** - Fully backward compatible

## Tree-Shaking & Bundle Optimization

`@fidus/ui` supports **tree-shaking** via subpath imports to dramatically reduce your bundle size.

### Bundle Size Comparison

| Import Style | Typical Bundle Impact |
|--------------|----------------------|
| Barrel import: `import { Button } from '@fidus/ui'` | Includes entire library (~370KB) |
| Subpath import: `import { Button } from '@fidus/ui/button'` | Only imports Button (~4KB) + shared deps |

### Recommended: Subpath Imports

For production builds, use subpath imports to include only what you need:

```typescript
// ✅ Tree-shaking optimized (recommended for production)
import { Button } from '@fidus/ui/button';
import { Stack } from '@fidus/ui/stack';
import { Alert } from '@fidus/ui/alert';
import { TextInput } from '@fidus/ui/text-input';
```

### Development: Barrel Imports

For development and prototyping, barrel imports are convenient:

```typescript
// 🚀 Fast development (imports everything)
import { Button, Stack, Alert, TextInput } from '@fidus/ui';
```

### All Available Subpaths

All 45+ components support subpath imports. Common ones include:

```typescript
// Forms
import { TextInput } from '@fidus/ui/text-input';
import { TextArea } from '@fidus/ui/text-area';
import { Checkbox } from '@fidus/ui/checkbox';
import { RadioButton } from '@fidus/ui/radio-button';
import { Select } from '@fidus/ui/select';
import { DatePicker } from '@fidus/ui/date-picker';

// Layout
import { Stack } from '@fidus/ui/stack';
import { Grid } from '@fidus/ui/grid';
import { Container } from '@fidus/ui/container';

// Display
import { Alert } from '@fidus/ui/alert';
import { Banner } from '@fidus/ui/banner';
import { Card } from '@fidus/ui/card';
import { Badge } from '@fidus/ui/badge';

// Navigation
import { Header } from '@fidus/ui/header';
import { Sidebar } from '@fidus/ui/sidebar';
import { Tabs } from '@fidus/ui/tabs';
import { Breadcrumbs } from '@fidus/ui/breadcrumbs';

// Feedback
import { Toast } from '@fidus/ui/toast';
import { Modal } from '@fidus/ui/modal';
import { Spinner } from '@fidus/ui/spinner';
import { ProgressBar } from '@fidus/ui/progress-bar';
```

See [package.json exports](https://github.com/y-core-engineering/fidus/blob/main/packages/ui/package.json) for the complete list.

## Form Validation

`@fidus/ui` form components work seamlessly with [React Hook Form](https://react-hook-form.com/).

### Basic Example

```typescript
import { useForm } from 'react-hook-form';
import { TextInput } from '@fidus/ui/text-input';
import { Button } from '@fidus/ui/button';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <TextInput
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email', { required: 'Email is required' })}
      />

      <TextInput
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password', { required: 'Password is required' })}
      />

      <Button type="submit">Login</Button>
    </form>
  );
}
```

### With Zod Schema Validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput } from '@fidus/ui/text-input';
import { Checkbox } from '@fidus/ui/checkbox';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  terms: z.boolean().refine((val) => val, 'You must accept terms'),
});

type FormData = z.infer<typeof schema>;

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <TextInput
        label="Email"
        error={errors.email?.message}
        {...register('email')}
      />

      <TextInput
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Checkbox
        label="I accept the terms and conditions"
        error={errors.terms?.message}
        {...register('terms')}
      />

      <Button type="submit">Sign Up</Button>
    </form>
  );
}
```

### Supported Form Components

All form components support `forwardRef` and work with React Hook Form:

- TextInput, TextArea, FileUpload, TimePicker
- Checkbox, RadioButton, ToggleSwitch
- Select, DatePicker, Dropdown

## Usage

### Basic Example

```tsx
import { Button } from '@fidus/ui';

function App() {
  return (
    <Button variant="primary" size="md" onClick={() => alert('Clicked!')}>
      Click Me
    </Button>
  );
}
```

## Available Components

### Action Components

| Component | Description |
|-----------|-------------|
| **Button** | Primary, secondary, tertiary, and destructive button variants |
| **Link** | Styled navigation links with hover states |
| **IconButton** | Icon-only button for compact actions |
| **ButtonGroup** | Grouped button layout for related actions |

### Layout Components

| Component | Description |
|-----------|-------------|
| **Container** | Responsive container with configurable max-width |
| **Grid** | CSS Grid layout component with responsive columns |
| **Stack** | Vertical or horizontal stack layout with spacing control |
| **Divider** | Visual separator line (horizontal or vertical) |

### Data Display Components

| Component | Description |
|-----------|-------------|
| **Table** | Data table with sorting, filtering, and pagination |
| **List** | Styled list component with variants |
| **Badge** | Status badges and labels for categorization |
| **Chip** | Tag/chip component for selections and filters |
| **Avatar** | User avatar with fallback initials |

### Card Components

| Component | Description |
|-----------|-------------|
| **OpportunityCard** | Contextual opportunity display with actions |
| **DetailCard** | Detailed information card with sections |
| **EmptyCard** | Empty state card with call-to-action |

### Form Components (Basic)

| Component | Description |
|-----------|-------------|
| **TextInput** | Single-line text input with validation states |
| **TextArea** | Multi-line text input with auto-resize |
| **Checkbox** | Checkbox input with indeterminate state |
| **RadioButton** | Radio button for mutually exclusive options |
| **ToggleSwitch** | Toggle switch for on/off states |

### Form Components (Advanced)

| Component | Description |
|-----------|-------------|
| **Select** | Dropdown select with search and multi-select |
| **DatePicker** | Date selection with calendar interface |
| **TimePicker** | Time selection with 12/24 hour format |
| **FileUpload** | File upload with drag-and-drop support |

### Feedback Components

| Component | Description |
|-----------|-------------|
| **Toast** | Notification system with auto-dismiss |
| **Modal** | Modal dialogs with overlay and focus management |
| **Alert** | Alert messages for info, success, warning, error |
| **Banner** | Page-level banners for important announcements |
| **ProgressBar** | Progress indicators for long-running operations |
| **Spinner** | Loading spinner with size variants |
| **Skeleton** | Loading skeleton for content placeholders |

### Overlay Components

| Component | Description |
|-----------|-------------|
| **Dropdown** | Dropdown menus with keyboard navigation |
| **Popover** | Popover component with positioning |
| **Tooltip** | Contextual tooltips on hover or focus |
| **Drawer** | Slide-out drawer from any edge |

### Navigation Components

| Component | Description |
|-----------|-------------|
| **Tabs** | Tabbed interfaces with keyboard navigation |
| **Breadcrumbs** | Breadcrumb navigation for hierarchical pages |
| **Pagination** | Pagination component for data sets |
| **Header** | Page header with logo and navigation |
| **Sidebar** | Collapsible navigation sidebar |

### Chat Components

| Component | Description |
|-----------|-------------|
| **MessageBubble** | Individual chat message display with role-based alignment and suggestions |
| **ChatInterface** | Complete chat layout with message list, input, and auto-scroll |
| **ConfidenceIndicator** | Visual ML confidence score display with color-coded progress bars |

## Component Examples

### Button

```tsx
import { Button } from '@fidus/ui';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button disabled>Disabled</Button>
```

### Toast

```tsx
import { useToast, ToastProvider } from '@fidus/ui';

function App() {
  return (
    <ToastProvider>
      <YourComponent />
    </ToastProvider>
  );
}

function YourComponent() {
  const { toast } = useToast();

  return (
    <Button onClick={() => toast({
      title: 'Success',
      description: 'Your action was completed',
      variant: 'success'
    })}>
      Show Toast
    </Button>
  );
}
```

### Table

```tsx
import { Table } from '@fidus/ui';

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
];

<Table data={data} columns={columns} />
```

### ChatInterface

```tsx
import { ChatInterface, type Message } from '@fidus/ui';

function ChatDemo() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
      avatar: { fallback: 'AI' }
    }
  ]);

  const handleSend = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      avatar: { fallback: 'U' }
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <ChatInterface
      messages={messages}
      onSendMessage={handleSend}
      placeholder="Type your message..."
    />
  );
}
```

### MessageBubble

```tsx
import { MessageBubble, type Message } from '@fidus/ui';

const message: Message = {
  id: '1',
  role: 'assistant',
  content: 'What would you like for dinner tonight?',
  timestamp: new Date(),
  avatar: { fallback: 'AI' },
  suggestions: [
    {
      id: 's1',
      text: 'Italian cuisine',
      confidence: 0.85,
      onAccept: () => console.log('Accepted Italian'),
      onReject: () => console.log('Rejected Italian')
    },
    {
      id: 's2',
      text: 'Thai food',
      confidence: 0.72,
      onAccept: () => console.log('Accepted Thai'),
      onReject: () => console.log('Rejected Thai')
    }
  ]
};

<MessageBubble {...message} />
```

### ConfidenceIndicator

```tsx
import { ConfidenceIndicator } from '@fidus/ui';

// Minimal variant (badge only)
<ConfidenceIndicator confidence={0.85} variant="minimal" />

// Detailed variant (progress bar + badge + label)
<ConfidenceIndicator confidence={0.65} variant="detailed" />

// With custom size
<ConfidenceIndicator confidence={0.45} size="lg" variant="detailed" />

// Without tooltip
<ConfidenceIndicator confidence={0.9} showTooltip={false} />
```

## Theming

The component library uses CSS variables for theming. The default theme is included in `@fidus/ui/styles.css`, but you can override any CSS variables in your own CSS:

```css
/* Override specific variables in your global CSS */
:root {
  /* Brand colors - HSL format: hue saturation lightness */
  --color-primary: 45 100% 51%;        /* Gold (#FFD700) */
  --color-primary-foreground: 0 0% 0%; /* Black text on gold */

  /* Semantic colors */
  --color-success: 122 39% 49%;        /* Green */
  --color-warning: 36 100% 50%;        /* Amber */
  --color-error: 4 90% 58%;            /* Red */

  /* Neutral colors */
  --color-background: 0 0% 100%;       /* White */
  --color-foreground: 0 0% 0%;         /* Black */
  --color-muted: 0 0% 96%;             /* Light gray */
  --color-border: 0 0% 88%;            /* Border gray */

  /* Spacing */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */

  /* Border radius */
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */

  /* Typography */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-md: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
}

/* Dark mode overrides */
.dark {
  --color-background: 0 0% 9%;        /* Dark gray */
  --color-foreground: 0 0% 98%;       /* Off-white */
  --color-muted: 0 0% 15%;            /* Darker gray */
  --color-border: 0 0% 18%;           /* Dark border */
}
```

**Note:** Colors use HSL format without `hsl()` wrapper. The format is `hue saturation% lightness%`. This allows Tailwind to modify opacity using the `/` syntax (e.g., `bg-primary/50`).

## TypeScript Support

All components are fully typed with TypeScript. Import types:

```tsx
import type { ButtonProps } from '@fidus/ui';

const CustomButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## Accessibility

All components follow WCAG 2.1 AA guidelines:

- Semantic HTML elements
- ARIA attributes for screen readers
- Keyboard navigation support
- Focus management
- Color contrast ratios > 4.5:1

## Troubleshooting

### Components have no styling / look broken

**Cause**: Missing Tailwind CSS configuration or CSS variables

**Solution**:
1. Verify Tailwind preset is imported in `tailwind.config.ts`:
   ```typescript
   import fidusTailwindPreset from '@fidus/ui/tailwind';
   ```
2. Verify `@fidus/ui/styles.css` is imported in your root file
3. Check that your build tool processes Tailwind CSS (PostCSS)

### TypeScript errors when importing components

**Cause**: Missing type definitions or incorrect import path

**Solution**:
1. Ensure `@fidus/ui` is installed: `npm list @fidus/ui`
2. Use named imports: `import { Button } from '@fidus/ui'`
3. Check TypeScript version is 5.0+

### Dark mode not working

**Cause**: Missing `dark` class on root element

**Solution**:
Add `dark` class to your root HTML element:
```tsx
<html className="dark">
```

### Custom colors not applying

**Cause**: Trying to override colors in Tailwind config instead of CSS variables

**Solution**:
Override CSS variables in your global CSS file, not in `tailwind.config.ts`:
```css
:root {
  --color-primary: 200 100% 50%; /* HSL format */
}
```

### Module not found: '@fidus/ui/tailwind'

**Cause**: Old version of `@fidus/ui` (< 1.4.0)

**Solution**:
Update to latest version: `npm install @fidus/ui@latest`

### Components not working in Next.js / SSR

**Cause**: Most components work in SSR, but some features require client-side JavaScript

**Solution**:
- Portal components (Toast, Modal, Drawer) need client-side JS for rendering
- Use 'use client' directive in your page/component if you need client-side interactivity
- See [example projects](/examples) for working SSR implementations
- Check [SSR Testing section](#ssr-testing) for expected behavior of each component

### Colors not working in v1.4.0 & v1.4.1 (CRITICAL BUG - FIXED in v1.4.2)

**Cause**: Tailwind CSS v3.4+ inconsistently strips `hsl()` wrapper from color definitions in certain build configurations, causing invalid CSS like `background-color: 45 100% 51%` instead of `background-color: hsl(45 100% 51%)`.

**Root Cause**:
- v1.4.0 used string pattern: `'hsl(var(--color-primary))'` - Tailwind always stripped this
- v1.4.1 used `<alpha-value>` placeholder: `'hsl(var(--color-primary) / <alpha-value>)'` - **Still stripped in some setups** (Next.js 14, Tailwind v3.4.18+)

**Solution**:
Update to `@fidus/ui@1.4.2` or later, which uses a **callback function pattern** that forces Tailwind to preserve `hsl()` in all configurations:

```bash
npm install @fidus/ui@latest
```

**If you cannot upgrade immediately**, add this workaround to your global CSS:

```css
/* Temporary workaround for @fidus/ui@1.4.0-1.4.1 color bug */
@layer utilities {
  .bg-primary { background-color: hsl(var(--color-primary) / 1) !important; }
  .text-primary { color: hsl(var(--color-primary) / 1) !important; }
  .border-primary { border-color: hsl(var(--color-primary) / 1) !important; }

  .bg-success { background-color: hsl(var(--color-success) / 1) !important; }
  .text-success { color: hsl(var(--color-success) / 1) !important; }

  .bg-error { background-color: hsl(var(--color-error) / 1) !important; }
  .text-error { color: hsl(var(--color-error) / 1) !important; }

  .bg-warning { background-color: hsl(var(--color-warning) / 1) !important; }
  .text-warning { color: hsl(var(--color-warning) / 1) !important; }

  /* Add other colors as needed... */
}
```

**Technical Details**:
- v1.4.0: `'hsl(var(--color-primary))'` (string) - Tailwind CSS v3+ strips wrapper
- v1.4.1: `'hsl(var(--color-primary) / <alpha-value>)'` - Still stripped in Next.js 14 + Tailwind v3.4.18+
- v1.4.2: Callback function `({ opacityValue }) => hsl(var(--color-primary) / ${opacityValue || 1})` - **Works universally**

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

This project is licensed under the Sustainable Use License. See [LICENSE.md](../../LICENSE.md) for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/y-core-engineering/fidus/issues)
- **Discussions**: [GitHub Discussions](https://github.com/y-core-engineering/fidus/discussions)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.
