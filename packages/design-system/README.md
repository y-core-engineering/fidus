# Fidus Design System

The official design system and component library for Fidus - a privacy-first AI personal assistant.

🌐 **Live Site:** [design.fidus.world](https://design.fidus.world)

📦 **NPM Package:** [@fidus/ui](https://www.npmjs.com/package/@fidus/ui)

---

## Overview

This is a standalone Next.js 14 application that serves as both:
- **Documentation website** - Comprehensive design system documentation
- **Component library showcase** - Interactive component previews
- **Living style guide** - Real production components, not demos

### Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Runtime:** React 18 (Server Components)
- **Language:** TypeScript 5.3+
- **Styling:** Tailwind CSS 3.4+ with CSS Variables
- **Components:** @fidus/ui (custom component library)
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm 8.x or later

### Installation

From the monorepo root:

```bash
# Install dependencies
pnpm install

# Start design system dev server
pnpm --filter @fidus/design-system dev
```

The design system will be available at [http://localhost:3001](http://localhost:3001)

### Development

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type check
pnpm typecheck

# Lint
pnpm lint
```

---

## Project Structure

```
packages/design-system/
├── app/                    # Next.js App Router
│   ├── foundations/        # Design foundations (colors, typography, etc.)
│   ├── components/         # Component documentation pages
│   ├── tokens/             # Design token pages
│   ├── getting-started/    # Getting started guides
│   └── patterns/           # Pattern documentation
├── components/             # Documentation-specific components
│   ├── helpers/            # Helper components (CodeBlock, TokenInspector)
│   └── navigation/         # Navigation (Sidebar, Header)
├── styles/                 # Global styles and CSS variables
│   └── globals.css         # Design tokens and global styles
├── public/                 # Static assets
├── vercel.json             # Vercel deployment configuration
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## Deployment

### Vercel Deployment

The design system is automatically deployed to Vercel on every push to `main`.

**Production URL:** https://design.fidus.world

#### Setup Instructions

1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import the `fidus` GitHub repository
   - Select `packages/design-system` as root directory

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: packages/design-system
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   Node Version: 20.x
   ```

3. **Add Environment Variables**

   In Vercel Dashboard → Project Settings → Environment Variables:

   ```
   NODE_ENV=production
   NEXT_PUBLIC_SITE_URL=https://design.fidus.world
   NEXT_PUBLIC_NPM_PACKAGE=@fidus/ui
   ```

4. **Configure Custom Domain**

   **DNS Configuration (at domain registrar):**
   ```
   Type    Name     Value                   TTL
   ──────────────────────────────────────────────
   CNAME   design   cname.vercel-dns.com    Auto
   ```

   **In Vercel Dashboard:**
   - Project Settings → Domains
   - Add Domain: `design.fidus.world`
   - Vercel automatically provisions SSL certificate

5. **Deployment Process**
   - Push to `main` branch triggers automatic deployment
   - Preview deployments created for all pull requests
   - Build logs available in Vercel dashboard

#### Regions

The design system is deployed to multiple regions for optimal performance:
- **fra1** - Frankfurt, Germany (Europe)
- **iad1** - Washington, D.C., USA (Americas)

#### Security Headers

The following security headers are automatically applied (configured in `vercel.json`):
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

### Required Variables

- `NEXT_PUBLIC_SITE_URL` - Base URL for the design system (e.g., https://design.fidus.world)
- `NEXT_PUBLIC_NPM_PACKAGE` - NPM package name (@fidus/ui)

### Optional Variables

- `NEXT_PUBLIC_ANALYTICS_ID` - Analytics tracking ID
- `NEXT_PUBLIC_ALGOLIA_APP_ID` - Algolia search app ID (for future search implementation)
- `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` - Algolia search API key
- `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` - Algolia search index name

---

## Architecture

### Domain Strategy

```
fidus.world
├── design.fidus.world  → Design System (this package)   [PRODUCTION]
├── app.fidus.world     → Main Fidus App                 [FUTURE]
├── api.fidus.world     → Backend API                    [FUTURE]
└── www.fidus.world     → Marketing Site                 [FUTURE]
```

### Component Reuse

The `@fidus/ui` package serves as the source of truth:

```
@fidus/ui (Component Library)
    ↓
    ├─→ @fidus/design-system (Documentation)
    └─→ @fidus/web (Main Fidus App - Future)
```

All components are production-ready and shared across packages.

---

## Features

### Current Features

✅ **Foundation Pages** - Colors, Typography, Spacing, Motion, Accessibility, Privacy UX, AI-Driven UI
✅ **Token Pages** - Color, Typography, Spacing, Shadow, Motion tokens
✅ **Component Documentation** - Interactive component previews with props tables
✅ **Code Examples** - Syntax-highlighted code blocks with copy functionality
✅ **Responsive Design** - Mobile-first, works across all devices
✅ **Dark Mode** - Automatic theme switching
✅ **Navigation** - Collapsible sidebar with category organization
✅ **Design Tokens** - CSS variables with interactive inspector

### Upcoming Features

⏳ **Interactive Playground** - Live component editor (Slice 8)
⏳ **Global Search** - Cmd+K search across all content (Slice 10)
⏳ **Pattern Documentation** - Onboarding, Multi-tenancy, Search patterns (Slices 6-7)
⏳ **Architecture Docs** - UIDecisionLayer, Component Registry demos (Slice 7)

---

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the monorepo root for contribution guidelines.

### Development Workflow

1. Create a feature branch from `main`
2. Make changes in `packages/design-system` or `packages/ui`
3. Test locally with `pnpm dev`
4. Ensure build succeeds with `pnpm build`
5. Run type check and lint: `pnpm typecheck && pnpm lint`
6. Create pull request to `main`
7. Preview deployment automatically created by Vercel
8. Merge after approval - auto-deploys to production

---

## Related Packages

- **[@fidus/ui](../ui)** - Component library (source components)
- **[@fidus/shared](../shared)** - Shared types and utilities
- **[@fidus/web](../web)** - Main Fidus application (future)

---

## Documentation

- **Implementation Plan:** [docs/ux-ui-design/20-design-system-implementation.md](../../docs/ux-ui-design/20-design-system-implementation.md)
- **Design System Concept:** [docs/ux-ui-design/18-design-system-website.md](../../docs/ux-ui-design/18-design-system-website.md)
- **Component Specifications:** [docs/ux-ui-design/05-design-system-components.md](../../docs/ux-ui-design/05-design-system-components.md)
- **Frontend Architecture:** [docs/arc/13-frontend-architecture.md](../../docs/arc/13-frontend-architecture.md)

---

## License

See [LICENSE.md](../../LICENSE.md) for licensing information.

---

## Support

- **Issues:** [GitHub Issues](https://github.com/y-core-engineering/fidus/issues)
- **Discussions:** [GitHub Discussions](https://github.com/y-core-engineering/fidus/discussions)
- **Discord:** [Fidus Discord Server](https://discord.gg/fidus)

---

**Built with ❤️ using Next.js 14, React 18, Tailwind CSS, and TypeScript**
