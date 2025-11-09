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
5. **Import Pattern**: Named imports from `@fidus/ui`

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

### Component Import Examples

```typescript
// ✅ Correct - Named imports
import { Button, TextInput, Modal } from '@fidus/ui';

// ❌ Wrong - Default import
import FidusUI from '@fidus/ui';

// ❌ Wrong - Wildcard import
import * as FidusUI from '@fidus/ui';
```

### Available Components by Category

**Forms**: Button, TextInput, TextArea, Checkbox, RadioButton, ToggleSwitch, Select, DatePicker, TimePicker, FileUpload
**Layout**: Container, Grid, Stack, Divider
**Display**: Table, List, Badge, Chip, Avatar, OpportunityCard, DetailCard, EmptyCard
**Feedback**: Toast, Modal, Alert, Banner, ProgressBar, Spinner, Skeleton
**Overlays**: Dropdown, Popover, Tooltip, Drawer
**Navigation**: Tabs, Breadcrumbs, Pagination, Header, Sidebar
**Chat**: MessageBubble, ChatInterface, ConfidenceIndicator

### TypeScript Usage

All components are fully typed. Import types:

```typescript
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

### Colors not working in v1.4.0 (CRITICAL BUG - FIXED in v1.4.1)

**Cause**: Tailwind CSS v3+ strips `hsl()` wrapper from color definitions, even when defined as strings. This causes CSS like `background-color: 45 100% 51%` (invalid) instead of `background-color: hsl(45 100% 51%)`.

**Solution**:
Update to `@fidus/ui@1.4.1` or later, which uses the `<alpha-value>` placeholder pattern:

```bash
npm install @fidus/ui@latest
```

**If you cannot upgrade immediately**, add this workaround to your global CSS:

```css
/* Temporary workaround for @fidus/ui@1.4.0 color bug */
@layer utilities {
  .bg-primary { background-color: hsl(var(--color-primary)) !important; }
  .text-primary { color: hsl(var(--color-primary)) !important; }
  .border-primary { border-color: hsl(var(--color-primary)) !important; }

  .bg-success { background-color: hsl(var(--color-success)) !important; }
  .text-success { color: hsl(var(--color-success)) !important; }

  .bg-error { background-color: hsl(var(--color-error)) !important; }
  .text-error { color: hsl(var(--color-error)) !important; }

  .bg-warning { background-color: hsl(var(--color-warning)) !important; }
  .text-warning { color: hsl(var(--color-warning)) !important; }

  /* Add other colors as needed... */
}
```

**Technical Details**:
- v1.4.0 used `'hsl(var(--color-primary))'` (string) which Tailwind CSS v3+ automatically optimizes away
- v1.4.1 uses `'hsl(var(--color-primary) / <alpha-value>)'` which Tailwind preserves for opacity support

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
