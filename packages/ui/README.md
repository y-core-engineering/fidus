# @fidus/ui

Fidus UI Component Library - A modern, accessible React component library built with Radix UI primitives.

[![npm version](https://badge.fury.io/js/@fidus%2Fui.svg)](https://www.npmjs.com/package/@fidus/ui)
[![License](https://img.shields.io/badge/license-Sustainable%20Use-blue.svg)](../../LICENSE.md)

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
- **Button** - Primary, secondary, tertiary, and destructive variants
- **Link** - Styled navigation links
- **IconButton** - Icon-only button
- **ButtonGroup** - Grouped button layout

### Layout Components
- **Container** - Responsive container with max-width
- **Grid** - CSS Grid layout component
- **Stack** - Vertical/horizontal stack layout
- **Divider** - Visual separator

### Data Display Components
- **Table** - Data table with sorting and filtering
- **List** - Styled list component
- **Badge** - Status badges and labels
- **Chip** - Tag/chip component
- **Avatar** - User avatar component

### Card Components
- **OpportunityCard** - Contextual opportunity display
- **DetailCard** - Detailed information card
- **EmptyCard** - Empty state card

### Form Components (Basic)
- **TextInput** - Text input field
- **TextArea** - Multi-line text input
- **Checkbox** - Checkbox input
- **RadioButton** - Radio button input
- **ToggleSwitch** - Toggle switch

### Form Components (Advanced)
- **Select** - Dropdown select
- **DatePicker** - Date selection
- **TimePicker** - Time selection
- **FileUpload** - File upload component

### Feedback Components
- **Toast** - Notification system
- **Modal** - Modal dialogs
- **Alert** - Alert messages
- **Banner** - Page-level banners
- **ProgressBar** - Progress indicators
- **Spinner** - Loading spinner
- **Skeleton** - Loading skeleton

### Overlay Components
- **Dropdown** - Dropdown menus
- **Popover** - Popover component
- **Tooltip** - Contextual tooltips
- **Drawer** - Slide-out drawer

### Navigation Components
- **Tabs** - Tabbed interfaces
- **Breadcrumbs** - Breadcrumb navigation
- **Pagination** - Pagination component
- **Header** - Page header
- **Sidebar** - Navigation sidebar

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

## Theming

The component library uses CSS variables for theming. Override these in your global CSS:

```css
:root {
  /* Colors */
  --color-primary: #00ff94;
  --color-background: #000000;
  --color-foreground: #ffffff;

  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}
```

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
