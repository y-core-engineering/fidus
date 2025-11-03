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
