# Fidus UI - Vite + React Example

This example demonstrates how to use `@fidus/ui` components in a Vite + React application.

## Features

- Vite 5 for fast development and optimized builds
- React 18
- TypeScript support
- Tailwind CSS integration with Fidus UI preset
- No provider required for components
- Comprehensive component showcase

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0

### Installation

From the repository root:

```bash
pnpm install
```

### Development

Start the development server:

```bash
cd examples/vite-react
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

Note: This example runs on port 3002 to avoid conflicts with the Next.js examples.

### Build

Build the application for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Project Structure

```
vite-react/
├── src/
│   ├── App.tsx              # Main App component with showcase
│   ├── main.tsx             # Entry point with @fidus/ui styles
│   ├── index.css            # Global styles with Tailwind directives
│   └── vite-env.d.ts        # Vite type definitions
├── index.html               # HTML template
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind config with Fidus preset
├── postcss.config.js
└── .eslintrc.cjs
```

## Key Configuration

### 1. Package Dependencies

```json
{
  "dependencies": {
    "@fidus/ui": "workspace:*",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

### 2. Tailwind Configuration

```typescript
import fidusTailwindPreset from '@fidus/ui/tailwind'

const config: Config = {
  presets: [fidusTailwindPreset],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@fidus/ui/**/*.{js,ts,jsx,tsx}',
  ],
}
```

### 3. Import Styles

In `main.tsx`:

```typescript
import '@fidus/ui/styles.css'
import './index.css'
```

### 4. Vite Configuration

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## Components Showcased

This example includes demonstrations of the following components:

- **Buttons**: Primary, Secondary, Success, Danger variants
- **Alerts**: Info, Success, Warning, Error variants
- **Banner**: Information banner
- **Form Inputs**: TextInput, TextArea, TimePicker, FileUpload
- **Interactive Controls**: Checkbox, ToggleSwitch, RadioButton
- **Chips**: Various color variants
- **Cards**: DetailCard, OpportunityCard
- **Layout**: Stack, Container

## Important Notes

### No Provider Required

Unlike some UI libraries, `@fidus/ui` v1.5.0+ does not require a centralized provider. Components work standalone:

```tsx
// ❌ NOT needed
<FidusUIProvider>
  <App />
</FidusUIProvider>

// ✅ Components work directly
<Button variant="primary">Click me</Button>
```

### Hot Module Replacement (HMR)

Vite provides instant HMR for a great development experience. Changes to your code will be reflected immediately in the browser without full page reloads.

### TypeScript Support

Full TypeScript support is included out of the box. All components are fully typed with comprehensive prop interfaces.

### Path Aliases

The project is configured with path aliases for cleaner imports:

```tsx
// Instead of
import Component from '../../components/Component'

// You can use
import Component from '@/components/Component'
```

## Differences from Next.js Examples

| Feature | Vite + React | Next.js |
|---------|--------------|---------|
| Framework | Client-side only | SSR + Client-side |
| Routing | Manual (e.g., React Router) | Built-in |
| Entry point | `main.tsx` | `_app.tsx` or `layout.tsx` |
| Build tool | Vite | Next.js |
| HMR speed | Extremely fast | Fast |

## Troubleshooting

### Components not styled correctly

Make sure you've imported both the Fidus UI styles and your index.css in `main.tsx`:

```tsx
import '@fidus/ui/styles.css'
import './index.css'
```

### Tailwind classes not working

Verify that your `tailwind.config.ts`:
1. Includes the Fidus preset
2. Has correct content paths including:
   - `./index.html`
   - `./src/**/*.{js,ts,jsx,tsx}`
   - `./node_modules/@fidus/ui/**/*.{js,ts,jsx,tsx}`

### Build errors

If you encounter build errors:
1. Clear the Vite cache: `rm -rf node_modules/.vite`
2. Reinstall dependencies: `pnpm install`
3. Try building again: `pnpm build`

### Path alias not working

Check that `vite.config.ts` has the path alias configuration and `tsconfig.json` has the matching paths configuration.

## Performance Tips

1. **Tree Shaking**: Vite automatically removes unused code in production builds
2. **Code Splitting**: Use dynamic imports for large components
3. **Asset Optimization**: Vite optimizes images and other assets automatically

## Learn More

- [@fidus/ui Documentation](../../packages/ui/README.md)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

SEE LICENSE IN LICENSE.md
