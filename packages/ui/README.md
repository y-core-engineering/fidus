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

### Import Styles

Import the CSS variables in your app:

```tsx
// In your root component or _app.tsx
import '@fidus/ui/dist/styles.css';
```

Or if using Next.js:

```tsx
// app/layout.tsx or pages/_app.tsx
import '@fidus/ui/dist/styles.css';
```

## Available Components

- **Button** - Primary, secondary, tertiary, and destructive variants
- **Card** - Container with header, content, and footer
- **Input** - Text input with validation
- **Select** - Dropdown select with search
- **Toast** - Notification system
- **Dialog** - Modal dialogs
- **Dropdown Menu** - Contextual menus
- **Progress** - Progress indicators
- **Tabs** - Tabbed interfaces
- **Tooltip** - Contextual tooltips
- **Calendar** - Date picker with range support

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
<Button loading>Loading...</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@fidus/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Input

```tsx
import { Input } from '@fidus/ui';

<Input
  type="text"
  placeholder="Enter your name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
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

## Validation with Zod

Components include Zod schemas for runtime validation:

```tsx
import { ButtonPropsSchema } from '@fidus/ui';

const props = {
  variant: 'primary',
  size: 'md',
  children: 'Click Me'
};

// Validate props at runtime
const validatedProps = ButtonPropsSchema.parse(props);
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

## Documentation

Full documentation and interactive examples: [https://design.fidus.world](https://design.fidus.world)

## License

This project is licensed under the Sustainable Use License. See [LICENSE.md](../../LICENSE.md) for details.

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for contribution guidelines.

## Support

- **Issues**: [GitHub Issues](https://github.com/y-core-engineering/fidus/issues)
- **Discussions**: [GitHub Discussions](https://github.com/y-core-engineering/fidus/discussions)
- **Discord**: [Join our Discord](https://discord.gg/fidus)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.
