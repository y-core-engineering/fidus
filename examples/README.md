# Fidus UI Examples

This directory contains example projects demonstrating how to use `@fidus/ui` components in different frameworks and setups.

## Available Examples

### 1. Next.js App Router (`/nextjs-app-router`)
- **Framework**: Next.js 14 with App Router
- **Port**: 3000
- **Features**:
  - Server-side rendering (SSR)
  - TypeScript
  - Tailwind CSS integration
  - Comprehensive component showcase

[View Documentation](./nextjs-app-router/README.md)

### 2. Next.js Pages Router (`/nextjs-pages-router`)
- **Framework**: Next.js 14 with Pages Router
- **Port**: 3001
- **Features**:
  - Traditional Next.js routing
  - TypeScript
  - Tailwind CSS integration
  - Comprehensive component showcase

[View Documentation](./nextjs-pages-router/README.md)

### 3. Vite + React (`/vite-react`)
- **Framework**: Vite 5 + React 18
- **Port**: 3002
- **Features**:
  - Lightning-fast HMR
  - TypeScript
  - Tailwind CSS integration
  - Comprehensive component showcase

[View Documentation](./vite-react/README.md)

## Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0

### Installation

From the repository root:

```bash
pnpm install
```

### Running Examples

#### Next.js App Router
```bash
cd examples/nextjs-app-router
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000)

#### Next.js Pages Router
```bash
cd examples/nextjs-pages-router
pnpm dev
```
Open [http://localhost:3001](http://localhost:3001)

#### Vite + React
```bash
cd examples/vite-react
pnpm dev
```
Open [http://localhost:3002](http://localhost:3002)

## Building Examples

Build all examples:
```bash
# From repository root
pnpm build
```

Build individual examples:
```bash
cd examples/[example-name]
pnpm build
```

## What's Showcased

All examples include demonstrations of:

### Buttons
- Primary, Secondary, Tertiary, Destructive variants
- Different sizes (sm, md, lg)
- Disabled states

### Alerts
- Info, Success, Warning, Error variants
- Dismissible and non-dismissible options

### Banners
- Info, Warning, Error variants
- Sticky positioning option
- Action buttons

### Form Inputs
- TextInput with labels and validation
- TextArea for multi-line input
- TimePicker for time selection
- FileUpload with drag-and-drop

### Interactive Controls
- Checkbox with labels
- ToggleSwitch for on/off states
- RadioButton groups

### Chips
- Filled and Outlined variants
- Different sizes
- Dismissible chips

### Cards
- DetailCard for structured information
- OpportunityCard with urgency levels

### Layout
- Stack for flexible layouts (horizontal/vertical)
- Container with responsive sizing

## Key Features

### No Provider Required
Unlike many UI libraries, `@fidus/ui` v1.5.0+ does not require a centralized provider:

```tsx
// ❌ NOT needed
<FidusUIProvider>
  <App />
</FidusUIProvider>

// ✅ Components work directly
<Button variant="primary">Click me</Button>
```

### SSR-Optimized
All components are optimized for server-side rendering:
- No hydration mismatches
- Proper SSR support out of the box
- Client-side features activated after hydration

### TypeScript Support
Full TypeScript support with:
- Comprehensive prop interfaces
- Type-safe variants and sizes
- IntelliSense support

### Tailwind CSS Integration
Easy integration with Tailwind CSS:
```typescript
import fidusTailwindPreset from '@fidus/ui/tailwind'

export default {
  presets: [fidusTailwindPreset],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
}
```

## Common Setup Pattern

All examples follow a similar setup pattern:

1. **Install dependencies**
   ```json
   {
     "dependencies": {
       "@fidus/ui": "workspace:*"
     }
   }
   ```

2. **Import styles**
   ```tsx
   import '@fidus/ui/styles.css'
   ```

3. **Configure Tailwind**
   ```typescript
   import fidusTailwindPreset from '@fidus/ui/tailwind'
   ```

4. **Use components**
   ```tsx
   import { Button, Alert, Stack } from '@fidus/ui'
   ```

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Make sure `@fidus/ui` is built: `cd packages/ui && pnpm build`
2. Clear cache and reinstall: `pnpm clean && pnpm install`
3. Check that all peer dependencies are installed

### Components Not Styled

If components appear unstyled:
1. Verify `@fidus/ui/styles.css` is imported
2. Check Tailwind config includes the Fidus preset
3. Ensure global CSS with Tailwind directives is imported

### TypeScript Errors

If you see TypeScript errors:
1. Make sure TypeScript version is >= 5.0
2. Check that `@fidus/ui` is properly built
3. Restart your TypeScript server

## Framework-Specific Notes

### Next.js (Both Routers)
- Add `transpilePackages: ['@fidus/ui']` to `next.config.js`
- Import styles in root layout (_app.tsx for Pages Router)
- Use `'use client'` directive for interactive pages in App Router

### Vite + React
- No special configuration needed
- Extremely fast HMR
- Smaller bundle sizes than Next.js

## Contributing

When adding new examples:
1. Follow the existing project structure
2. Include comprehensive README
3. Add to this main README
4. Ensure build and dev scripts work
5. Test all components render correctly

## License

SEE LICENSE IN LICENSE.md
