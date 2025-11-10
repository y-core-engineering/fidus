# Fidus UI - Next.js App Router Example

This example demonstrates how to use `@fidus/ui` components in a Next.js application using the App Router (Next.js 13+).

## Features

- Next.js 14 with App Router
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
cd examples/nextjs-app-router
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
nextjs-app-router/
├── src/
│   └── app/
│       ├── layout.tsx       # Root layout with @fidus/ui styles
│       ├── page.tsx         # Main page with component showcase
│       └── globals.css      # Global styles with Tailwind directives
├── package.json
├── tsconfig.json
├── tailwind.config.ts       # Tailwind config with Fidus preset
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
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@fidus/ui/**/*.{js,ts,jsx,tsx}',
  ],
}
```

### 3. Import Styles

In `layout.tsx`:

```typescript
import '@fidus/ui/styles.css'
import './globals.css'
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

### Client Components

Since many components use interactive features, you'll need to mark pages or components with `'use client'` directive when using hooks or event handlers:

```tsx
'use client'

import { Button } from '@fidus/ui'
import { useState } from 'react'

export default function MyPage() {
  const [count, setCount] = useState(0)
  return <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>
}
```

### TypeScript Support

Full TypeScript support is included out of the box. All components are fully typed with comprehensive prop interfaces.

## Troubleshooting

### Components not styled correctly

Make sure you've imported both the Fidus UI styles and your globals.css in the root layout:

```tsx
import '@fidus/ui/styles.css'
import './globals.css'
```

### Tailwind classes not working

Verify that your `tailwind.config.ts`:
1. Includes the Fidus preset
2. Has correct content paths including `node_modules/@fidus/ui/**/*.{js,ts,jsx,tsx}`

### Build errors with @fidus/ui

Ensure `transpilePackages: ['@fidus/ui']` is set in `next.config.js`.

## Learn More

- [@fidus/ui Documentation](../../packages/ui/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

SEE LICENSE IN LICENSE.md
