# Fidus Web

Next.js web application for the Fidus AI Assistant.

## Features

- **Modern React** - Next.js 14 with App Router
- **Type Safety** - Full TypeScript support
- **Styling** - Tailwind CSS with custom design system
- **State Management** - Zustand for global state
- **Data Fetching** - React Query for server state
- **Animations** - Framer Motion for smooth transitions
- **Forms** - React Hook Form with Zod validation
- **Charts** - Recharts for data visualization

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── (auth)/       # Authentication pages
│   ├── (dashboard)/  # Dashboard pages
│   └── api/          # API routes (BFF pattern)
├── components/       # React components
│   ├── ui/           # Base UI components
│   ├── calendar/     # Calendar components
│   ├── finance/      # Finance components
│   └── ...           # Other domain components
├── lib/              # Utility libraries
│   ├── api/          # API client
│   ├── utils/        # Helper functions
│   └── constants/    # Constants
├── hooks/            # Custom React hooks
└── types/            # TypeScript types
```

## Development

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit http://localhost:3000

### Building

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

### Code Quality

```bash
# Lint code
pnpm lint

# Type check
pnpm typecheck
```

## Environment Variables

Create a `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_SENTRY=false

# OAuth (for plugin connections)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your-client-id
```

## Design System

The application uses a custom design system based on Tailwind CSS with:

- **Color Palette** - Consistent brand colors
- **Typography** - Inter font family
- **Spacing** - 8px grid system
- **Components** - Reusable UI components in `components/ui/`
- **Dark Mode** - Full dark mode support

## Architecture

### Backend for Frontend (BFF)

API routes in `src/app/api/` provide a BFF layer:
- Session management
- Request aggregation
- Response transformation
- Client-side caching

### State Management

- **Server State** - React Query for API data
- **Client State** - Zustand for UI state
- **Form State** - React Hook Form for form management

### Component Patterns

- **Composition** - Small, reusable components
- **Server Components** - Default to server components
- **Client Components** - Only when needed for interactivity
- **Suspense** - Loading states with Suspense boundaries
