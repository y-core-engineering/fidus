# Fidus UI - Next.js Pages Router Example

This example demonstrates how to use `@fidus/ui` components in a Next.js application using the Pages Router (traditional Next.js routing).

## Features

- Next.js 14 with Pages Router
- TypeScript support
- Tailwind CSS integration with Fidus UI preset
- SSR-optimized components (no provider required)
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
cd examples/nextjs-pages-router
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

Note: This example runs on port 3001 to avoid conflicts with the App Router example.

### Build

Build the application for production:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Project Structure

```
nextjs-pages-router/
├── src/
│   ├── pages/
│   │   ├── _app.tsx        # Custom App with @fidus/ui styles
│   │   ├── _document.tsx   # Custom Document
│   │   └── index.tsx       # Home page with component showcase
│   └── styles/
│       └── globals.css     # Global styles with Tailwind directives
├── package.json
├── tsconfig.json
├── tailwind.config.ts      # Tailwind config with Fidus preset
├── postcss.config.js
└── next.config.js
```

## Key Configuration

### 1. Package Dependencies

```json
{
  "dependencies": {
    "@fidus/ui": "workspace:*",
    "next": "14.2.18",
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
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@fidus/ui/**/*.{js,ts,jsx,tsx}',
  ],
}
```

### 3. Import Styles

In `_app.tsx`:

```typescript
import '@fidus/ui/styles.css'
import '@/styles/globals.css'
```

### 4. Next.js Configuration

```javascript
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@fidus/ui'],
}
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

Unlike some UI libraries, `@fidus/ui` v1.5.0+ does not require a centralized provider. Components are SSR-optimized and work standalone:

```tsx
// ❌ NOT needed
<FidusUIProvider>
  <App />
</FidusUIProvider>

// ✅ Components work directly
<Button variant="primary">Click me</Button>
```

### Pages Router vs App Router

The main differences when using Pages Router:

1. **Style imports** go in `_app.tsx` instead of `layout.tsx`
2. **Page metadata** uses `<Head>` component instead of Metadata API
3. **All pages are client-side by default** - no need for `'use client'` directive

### TypeScript Support

Full TypeScript support is included out of the box. All components are fully typed with comprehensive prop interfaces.

## Differences from App Router

| Feature | Pages Router | App Router |
|---------|--------------|------------|
| Style imports | `_app.tsx` | `layout.tsx` |
| Metadata | `<Head>` component | Metadata API |
| Client components | Default | Need `'use client'` |
| File structure | `pages/` directory | `app/` directory |

## Troubleshooting

### Components not styled correctly

Make sure you've imported both the Fidus UI styles and your globals.css in `_app.tsx`:

```tsx
import '@fidus/ui/styles.css'
import '@/styles/globals.css'
```

### Tailwind classes not working

Verify that your `tailwind.config.ts`:
1. Includes the Fidus preset
2. Has correct content paths including `node_modules/@fidus/ui/**/*.{js,ts,jsx,tsx}`

### Build errors with @fidus/ui

Ensure `transpilePackages: ['@fidus/ui']` is set in `next.config.js`.

### Path alias not working

Check that `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Learn More

- [@fidus/ui Documentation](../../packages/ui/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Pages Router](https://nextjs.org/docs/pages)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

SEE LICENSE IN LICENSE.md
