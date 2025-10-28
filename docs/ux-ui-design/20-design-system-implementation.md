# Design System Website Implementation

**Version:** 1.0
**Date:** 2025-01-28
**Status:** ✅ Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Implementation Plan](#implementation-plan)
6. [Code Examples](#code-examples)
7. [Deployment Strategy](#deployment-strategy)
8. [Integration with Fidus](#integration-with-fidus)

---

## 1. Executive Summary

### Goal

Build the **Fidus Design System website** as a **standalone Next.js application** using the **exact same technologies** that will be used in the main Fidus application:

- Next.js 14 App Router
- React Server Components
- Tailwind CSS + CSS Variables
- TypeScript + Zod
- Component Registry Pattern
- UIDecisionLayer concepts

### Benefits

✅ **Proof of Concept** - Validate architecture before building main app
✅ **Component Library** - Real, working components (not just docs)
✅ **Living Documentation** - Code examples are actual production code
✅ **Architecture Validation** - Test tech stack in isolated environment
✅ **Design Validation** - Test UX patterns in isolation
✅ **Reusable Package** - Components become `@fidus/ui` package later

---

## 2. Architecture Overview

### Standalone Design System vs. Nextra

**Original Plan (from 18-design-system-website.md):**
```
Nextra (Next.js + MDX)
  ├─ Documentation pages (MDX)
  ├─ Component playground
  └─ Interactive examples
```

**Better Plan (this document):**
```
Custom Next.js App
  ├─ Documentation pages (RSC + MDX)
  ├─ Real Fidus components (from @fidus/ui)
  ├─ Interactive playground (same as production)
  └─ UIDecisionLayer demo (AI-driven UI showcase)
```

### Why Custom > Nextra?

| Aspect | Nextra | Custom Next.js App |
|--------|--------|-------------------|
| **Setup Complexity** | ⚡ Simple | 🔨 Moderate |
| **Component Reuse** | ⚠️ Demo components only | ✅ Real production components |
| **Tech Stack Match** | ⚠️ Different from production | ✅ 100% identical to Fidus |
| **UIDecisionLayer Demo** | ❌ Requires custom setup | ✅ Built-in from day 1 |
| **Architecture Practice** | ⚠️ Limited | ✅ Complete tech stack validation |
| **Future Migration** | ⚠️ Components must be rewritten | ✅ Copy-paste to Fidus |

**Recommendation:** Build custom Next.js app that **becomes the foundation** for Fidus.

**Note:** This document focuses on technical architecture and implementation details. It does not include time estimates or team coordination - Fidus is currently a two-person project (see CLAUDE.md).

---

## 3. Technology Stack

### Exact Same Stack as Fidus Production

```json
{
  "framework": "Next.js 14.2+ (App Router)",
  "runtime": "React 18+ (Server Components)",
  "language": "TypeScript 5.3+",
  "styling": {
    "framework": "Tailwind CSS 3.4+",
    "tokens": "CSS Variables (design tokens)",
    "methodology": "Utility-first"
  },
  "validation": "Zod 3.22+ (runtime + inference)",
  "state": {
    "server": "React Server Components (built-in)",
    "client": "Zustand 4.5+ (UI state only)",
    "forms": "React Hook Form 7.51+ + Zod"
  },
  "components": {
    "library": "Custom (@fidus/ui)",
    "headless": "Radix UI (complex patterns)",
    "icons": "Lucide React"
  },
  "documentation": {
    "content": "MDX (via @next/mdx)",
    "codeBlocks": "Shiki (syntax highlighting)",
    "playground": "Custom (Sandpack or custom)"
  },
  "search": "Algolia DocSearch or Flexsearch",
  "deployment": "Vercel (static export)"
}
```

### Additional Tools (Design System Specific)

```json
{
  "playground": "Sandpack (CodeSandbox embeds) or custom",
  "colorPicker": "react-colorful",
  "codeEditor": "@uiw/react-textarea-code-editor",
  "propsTable": "react-docgen-typescript (auto-generate)",
  "a11yTesting": "@axe-core/react (live audits)"
}
```

---

## 4. Project Structure

### Monorepo Integration

```
packages/
├── design-system/          # ⭐ NEW: Design System Website
│   ├── app/                # Next.js App Router
│   ├── components/         # Documentation-specific components
│   ├── content/            # MDX documentation files
│   ├── public/             # Static assets
│   ├── styles/             # Global styles
│   └── package.json
│
├── ui/                     # ⭐ NEW: Shared UI Components
│   ├── src/
│   │   ├── components/     # Production-ready components
│   │   │   ├── button/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── button.stories.tsx
│   │   │   │   ├── button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── opportunity-card/
│   │   │   └── ...
│   │   ├── registry/       # Component Registry
│   │   │   └── component-map.tsx
│   │   ├── hooks/          # Shared hooks
│   │   ├── utils/          # Shared utilities
│   │   └── index.ts        # Public API
│   ├── package.json
│   └── tsconfig.json
│
├── web/                    # (Future) Main Fidus App
├── api/                    # (Existing) Backend
├── cli/                    # (Existing) CLI
└── shared/                 # (Existing) Shared types
```

### Design System Website Structure

```
packages/design-system/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Homepage
│   ├── getting-started/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── foundations/
│   │   ├── ai-driven-ui/page.mdx
│   │   ├── privacy-ux/page.mdx
│   │   ├── colors/page.tsx           # Interactive color palette
│   │   ├── typography/page.tsx       # Font showcase
│   │   └── spacing/page.tsx          # Spacing scale
│   ├── components/
│   │   ├── [component]/              # Dynamic route
│   │   │   └── page.tsx              # Component detail page
│   │   └── page.tsx                  # Components overview
│   ├── patterns/
│   │   ├── onboarding/page.mdx
│   │   ├── search/page.mdx
│   │   └── ...
│   ├── architecture/
│   │   ├── ui-decision-layer/
│   │   │   └── page.tsx              # Interactive demo
│   │   └── component-registry/page.mdx
│   └── playground/
│       └── page.tsx                   # Live component playground
│
├── components/
│   ├── component-preview.tsx          # Component showcase
│   ├── code-block.tsx                 # Syntax highlighted code
│   ├── props-table.tsx                # Auto-generated props docs
│   ├── color-palette.tsx              # Color showcase
│   ├── playground.tsx                 # Interactive playground
│   └── navigation/
│       ├── sidebar.tsx
│       ├── header.tsx
│       └── search.tsx
│
├── content/
│   ├── components/                    # Component MDX files
│   │   ├── button.mdx
│   │   ├── opportunity-card.mdx
│   │   └── ...
│   └── patterns/                      # Pattern MDX files
│
├── lib/
│   ├── mdx.ts                         # MDX utilities
│   ├── metadata.ts                    # Component metadata
│   └── search.ts                      # Search index
│
├── styles/
│   ├── globals.css                    # Global styles + tokens
│   └── tailwind.css                   # Tailwind imports
│
├── public/
│   ├── fonts/
│   ├── images/
│   └── icons/
│
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. Implementation Plan

### Phase 1: Foundation

**Goal:** Set up project structure, design tokens, basic routing.

**Tasks:**

1. **Create Packages**
   ```bash
   # From monorepo root
   mkdir -p packages/design-system packages/ui
   ```

2. **Initialize Design System Package**
   ```bash
   cd packages/design-system
   pnpm create next-app@latest . --typescript --tailwind --app --no-src-dir
   ```

3. **Initialize UI Package**
   ```bash
   cd packages/ui
   pnpm init
   # Configure as shared package (see package.json example below)
   ```

4. **Set Up Design Tokens**
   - Create `styles/globals.css` with CSS variables
   - Configure Tailwind to use CSS variables
   - Test token system

5. **Basic Routing**
   - Homepage (`app/page.tsx`)
   - Foundations section (`app/foundations/`)
   - Components section (`app/components/`)

6. **Navigation Components**
   - Header with logo, search, theme toggle
   - Sidebar with collapsible sections
   - Mobile responsive

**Deliverable:** Empty design system website with navigation, design tokens, routing.

---

### Phase 2: Component Library Setup

**Goal:** Create first 5 production-ready components in `@fidus/ui`.

**Components:**

1. **Button** (`packages/ui/src/components/button/`)
   - 3 variants: primary, secondary, tertiary
   - 3 sizes: sm, md, lg
   - Loading state, disabled state
   - Icon support
   - Full TypeScript + Zod validation

2. **Badge** (`packages/ui/src/components/badge/`)
   - Urgency variants: urgent, medium, low
   - Domain variants: calendar, finance, travel, etc.
   - Size variants

3. **Card** (`packages/ui/src/components/card/`)
   - Base card component
   - Header, body, footer slots
   - Hover states

4. **OpportunityCard** (`packages/ui/src/components/opportunity-card/`)
   - Full implementation from 19-ui-implementation-recommendation.md
   - Action buttons
   - Urgency indicators
   - Swipe gestures (mobile)

5. **Input** (`packages/ui/src/components/input/`)
   - Text, email, password, number types
   - Validation states
   - Error messages
   - Label, helper text

**Tasks:**

1. Create component directory structure (see example below)
2. Implement each component with TypeScript
3. Add Zod schemas for props validation
4. Write unit tests (Vitest)
5. Create Storybook stories (optional)
6. Export from `@fidus/ui` package

**Deliverable:** Working `@fidus/ui` package with 5 components, tests, TypeScript types.

---

### Phase 3: Documentation Pages

**Goal:** Create documentation for components with interactive previews.

**Tasks:**

1. **Component Detail Page Template**
   - Overview section
   - Props API table (auto-generated)
   - Usage examples (code + preview)
   - Variants showcase
   - Accessibility notes
   - Source code link

2. **Implement ComponentPreview Component**
   - Live component rendering
   - Code view toggle
   - Copy code button
   - Responsive preview (mobile/tablet/desktop)

3. **Create Component Documentation**
   - `content/components/button.mdx`
   - `content/components/opportunity-card.mdx`
   - etc.

4. **Foundation Pages**
   - Colors (interactive palette)
   - Typography (font showcase)
   - Spacing (spacing scale)
   - AI-Driven UI (concept explanation)
   - Privacy UX (Fidus-specific)

**Deliverable:** Complete documentation for 5 components, foundation pages.

---

### Phase 4: Interactive Playground

**Goal:** Build interactive component playground.

**Features:**

1. **Component Selection**
   - Dropdown to choose component
   - Component renders in preview area

2. **Props Editor**
   - Form controls for each prop
   - Real-time updates
   - Type-safe editing (Zod validation)

3. **Code Generation**
   - Auto-generate React code
   - Copy to clipboard
   - Show TypeScript types

4. **Responsive Preview**
   - Mobile / Tablet / Desktop views
   - Rotate device

5. **Theme Toggle**
   - Light / Dark mode
   - Preview both themes

**Implementation:**

- Use Sandpack (CodeSandbox embeds) OR
- Custom playground with `eval` (safer with Zod validation)

**Deliverable:** Working playground at `/playground`.

---

### Phase 5: Advanced Features

**Goal:** Add UIDecisionLayer demo, search, and polish.

**Tasks:**

1. **UIDecisionLayer Demo**
   - Interactive demo showing AI-driven UI concept
   - Mock LLM responses
   - Live component switching
   - Explain how it works in Fidus

2. **Search**
   - Implement Flexsearch (client-side)
   - OR integrate Algolia DocSearch (hosted)
   - Index components, patterns, pages
   - Keyboard shortcuts (Cmd+K)

3. **Pattern Pages**
   - Onboarding flow (step-by-step)
   - Search interface (with filters)
   - Error states (all 6 categories)
   - Settings UI (9 categories)

4. **Accessibility Audit**
   - Run @axe-core/react
   - Fix all violations
   - Add keyboard navigation
   - Test with screen reader

5. **Performance Optimization**
   - Bundle analysis
   - Code splitting
   - Image optimization
   - Font optimization

**Deliverable:** Complete design system website with all features.

---

### Phase 6: Deployment & CI/CD

**Goal:** Deploy to production, set up CI/CD.

**Tasks:**

1. **Build Static Export**
   ```bash
   cd packages/design-system
   pnpm build
   # Generates static HTML in `out/` directory
   ```

2. **Deploy to Vercel**
   - Connect GitHub repo
   - Configure build settings
   - Set up custom domain (e.g., `design.fidus.ai`)

3. **CI/CD Pipeline**
   - GitHub Actions workflow
   - Run tests on PRs
   - Auto-deploy on merge to main

4. **Documentation**
   - Contributing guide
   - Component creation guide
   - Deployment guide

**Deliverable:** Live design system website at `design.fidus.ai`.

---

## 6. Code Examples

### 6.1 Package Configuration

#### `packages/ui/package.json`

```json
{
  "name": "@fidus/ui",
  "version": "0.1.0",
  "description": "Fidus UI Component Library",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./components/*": {
      "import": "./dist/components/*/index.mjs",
      "require": "./dist/components/*/index.js",
      "types": "./dist/components/*/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zod": "^3.22.4",
    "lucide-react": "^0.400.0",
    "@radix-ui/react-slot": "^1.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.3.3",
    "tsup": "^8.0.2",
    "vitest": "^1.6.0",
    "@testing-library/react": "^15.0.7"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

#### `packages/design-system/package.json`

```json
{
  "name": "@fidus/design-system",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@fidus/ui": "workspace:*",
    "@fidus/shared": "workspace:*",
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zod": "^3.22.4",
    "zustand": "^4.5.4",
    "@next/mdx": "^14.2.5",
    "@mdx-js/loader": "^3.0.1",
    "@mdx-js/react": "^3.0.1",
    "shiki": "^1.10.3",
    "lucide-react": "^0.400.0",
    "flexsearch": "^0.7.43",
    "react-colorful": "^5.6.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.4",
    "postcss": "^8.4.39",
    "autoprefixer": "^10.4.19"
  }
}
```

---

### 6.2 Design Tokens Setup

#### `packages/design-system/styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors - Semantic */
    --color-primary: 220 90% 56%;
    --color-primary-hover: 220 90% 48%;
    --color-primary-active: 220 90% 40%;

    --color-secondary: 220 15% 50%;
    --color-secondary-hover: 220 15% 40%;

    --color-success: 142 71% 45%;
    --color-warning: 38 92% 50%;
    --color-error: 0 84% 60%;
    --color-info: 199 89% 48%;

    /* Urgency Colors */
    --color-urgent: 0 84% 60%;        /* Red */
    --color-medium: 38 92% 50%;       /* Amber */
    --color-low: 199 89% 48%;         /* Blue */

    /* Domain Colors */
    --color-calendar: 220 90% 56%;    /* Blue */
    --color-finance: 142 71% 45%;     /* Green */
    --color-travel: 280 65% 60%;      /* Purple */
    --color-communication: 199 89% 48%; /* Cyan */
    --color-health: 0 84% 60%;        /* Red */
    --color-home: 38 92% 50%;         /* Amber */
    --color-shopping: 280 65% 60%;    /* Purple */
    --color-learning: 220 90% 56%;    /* Blue */

    /* Neutral Colors */
    --color-background: 0 0% 100%;
    --color-foreground: 222 47% 11%;
    --color-muted: 210 40% 96%;
    --color-muted-foreground: 215 16% 47%;
    --color-border: 214 32% 91%;

    /* Privacy Badge */
    --color-privacy-local: 142 71% 45%;    /* Green */
    --color-privacy-encrypted: 199 89% 48%; /* Blue */
    --color-privacy-anonymous: 280 65% 60%; /* Purple */

    /* Spacing */
    --spacing-xs: 0.25rem;   /* 4px */
    --spacing-sm: 0.5rem;    /* 8px */
    --spacing-md: 1rem;      /* 16px */
    --spacing-lg: 1.5rem;    /* 24px */
    --spacing-xl: 2rem;      /* 32px */
    --spacing-2xl: 3rem;     /* 48px */
    --spacing-3xl: 4rem;     /* 64px */

    /* Border Radius */
    --radius-sm: 0.25rem;    /* 4px */
    --radius-md: 0.5rem;     /* 8px */
    --radius-lg: 0.75rem;    /* 12px */
    --radius-xl: 1rem;       /* 16px */
    --radius-full: 9999px;   /* Full circle */

    /* Typography */
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-mono: 'Fira Code', 'Courier New', monospace;

    --font-size-xs: 0.75rem;    /* 12px */
    --font-size-sm: 0.875rem;   /* 14px */
    --font-size-md: 1rem;       /* 16px */
    --font-size-lg: 1.125rem;   /* 18px */
    --font-size-xl: 1.25rem;    /* 20px */
    --font-size-2xl: 1.5rem;    /* 24px */
    --font-size-3xl: 1.875rem;  /* 30px */
    --font-size-4xl: 2.25rem;   /* 36px */

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

    /* Z-Index */
    --z-base: 0;
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-modal: 300;
    --z-popover: 400;
    --z-tooltip: 500;
  }

  .dark {
    --color-background: 222 47% 11%;
    --color-foreground: 210 40% 98%;
    --color-muted: 217 33% 17%;
    --color-muted-foreground: 215 20% 65%;
    --color-border: 217 33% 17%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-family: var(--font-sans);
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-semibold tracking-tight;
  }

  code {
    font-family: var(--font-mono);
  }
}
```

#### `packages/design-system/tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../ui/src/**/*.{js,ts,jsx,tsx}', // Include @fidus/ui components
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--color-primary))',
        'primary-hover': 'hsl(var(--color-primary-hover))',
        secondary: 'hsl(var(--color-secondary))',
        success: 'hsl(var(--color-success))',
        warning: 'hsl(var(--color-warning))',
        error: 'hsl(var(--color-error))',
        info: 'hsl(var(--color-info))',

        urgent: 'hsl(var(--color-urgent))',
        medium: 'hsl(var(--color-medium))',
        low: 'hsl(var(--color-low))',

        background: 'hsl(var(--color-background))',
        foreground: 'hsl(var(--color-foreground))',
        muted: 'hsl(var(--color-muted))',
        'muted-foreground': 'hsl(var(--color-muted-foreground))',
        border: 'hsl(var(--color-border))',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        md: 'var(--font-size-md)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      zIndex: {
        base: 'var(--z-base)',
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

### 6.3 Button Component (Production-Ready)

#### `packages/ui/src/components/button/button.tsx`

```typescript
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { z } from 'zod';

// Zod schema for props validation
export const ButtonPropsSchema = z.object({
  variant: z.enum(['primary', 'secondary', 'tertiary']).default('primary'),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  asChild: z.boolean().optional(),
  children: z.any(),
  onClick: z.function().args(z.any()).returns(z.void()).optional(),
  className: z.string().optional(),
  type: z.enum(['button', 'submit', 'reset']).optional(),
});

export type ButtonProps = z.infer<typeof ButtonPropsSchema>;

const buttonVariants = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-secondary text-white hover:bg-secondary-hover',
  tertiary: 'bg-transparent text-primary border border-primary hover:bg-muted',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-md',
  lg: 'px-6 py-3 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    // Validate props at runtime
    const parsed = ButtonPropsSchema.safeParse(props);

    if (!parsed.success) {
      console.error('Invalid Button props:', parsed.error);
      return null;
    }

    const {
      variant = 'primary',
      size = 'md',
      disabled,
      loading,
      asChild,
      children,
      className,
      type = 'button',
      ...rest
    } = parsed.data;

    const Comp = asChild ? Slot : 'button';

    const classes = [
      'inline-flex items-center justify-center',
      'font-medium rounded-md',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      buttonVariants[variant],
      buttonSizes[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Comp
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={classes}
        {...rest}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
```

#### `packages/ui/src/components/button/button.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-primary');
  });

  it('applies size classes', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByText('Large');
    expect(button).toHaveClass('px-6', 'py-3');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('disables when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disables when disabled prop is true', () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### `packages/ui/src/components/button/index.ts`

```typescript
export { Button, ButtonPropsSchema } from './button';
export type { ButtonProps } from './button';
```

---

### 6.4 Component Documentation Page

#### `packages/design-system/app/components/button/page.tsx`

```typescript
import { Metadata } from 'next';
import { ComponentPreview } from '@/components/component-preview';
import { PropsTable } from '@/components/props-table';
import { CodeBlock } from '@/components/code-block';
import { Button } from '@fidus/ui/components/button';

export const metadata: Metadata = {
  title: 'Button | Fidus Design System',
  description: 'A versatile button component with multiple variants and sizes.',
};

export default function ButtonPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-4">Button</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A versatile button component with multiple variants and sizes.
      </p>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <ComponentPreview>
          <Button>Default Button</Button>
        </ComponentPreview>
      </section>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <CodeBlock language="bash">
          {`pnpm add @fidus/ui`}
        </CodeBlock>
      </section>

      {/* Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Usage</h2>
        <CodeBlock language="tsx">
          {`import { Button } from '@fidus/ui/components/button';

export function Example() {
  return (
    <Button variant="primary" size="md">
      Click me
    </Button>
  );
}`}
        </CodeBlock>
      </section>

      {/* Variants */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Variants</h2>

        <h3 className="text-xl font-medium mb-3">Primary</h3>
        <ComponentPreview>
          <Button variant="primary">Primary Button</Button>
        </ComponentPreview>

        <h3 className="text-xl font-medium mb-3 mt-6">Secondary</h3>
        <ComponentPreview>
          <Button variant="secondary">Secondary Button</Button>
        </ComponentPreview>

        <h3 className="text-xl font-medium mb-3 mt-6">Tertiary</h3>
        <ComponentPreview>
          <Button variant="tertiary">Tertiary Button</Button>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Sizes</h2>
        <ComponentPreview>
          <div className="flex gap-4 items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">States</h2>

        <h3 className="text-xl font-medium mb-3">Loading</h3>
        <ComponentPreview>
          <Button loading>Loading...</Button>
        </ComponentPreview>

        <h3 className="text-xl font-medium mb-3 mt-6">Disabled</h3>
        <ComponentPreview>
          <Button disabled>Disabled</Button>
        </ComponentPreview>
      </section>

      {/* Props API */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Props</h2>
        <PropsTable
          props={[
            {
              name: 'variant',
              type: "'primary' | 'secondary' | 'tertiary'",
              default: "'primary'",
              description: 'The visual style variant of the button.',
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: 'The size of the button.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Whether the button is disabled.',
            },
            {
              name: 'loading',
              type: 'boolean',
              default: 'false',
              description: 'Whether the button is in a loading state.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              required: true,
              description: 'The content of the button.',
            },
            {
              name: 'onClick',
              type: '(event: MouseEvent) => void',
              description: 'Callback when button is clicked.',
            },
          ]}
        />
      </section>

      {/* Accessibility */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Button is keyboard accessible (Tab, Enter, Space)</li>
          <li>Focus ring visible for keyboard navigation</li>
          <li>Disabled state prevents interaction and updates ARIA attributes</li>
          <li>Loading state announces "Loading..." to screen readers</li>
        </ul>
      </section>
    </div>
  );
}
```

---

### 6.5 Component Preview Helper

#### `packages/design-system/components/component-preview.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';

interface ComponentPreviewProps {
  children: React.ReactNode;
  code?: string;
  showCode?: boolean;
}

export function ComponentPreview({
  children,
  code,
  showCode = false,
}: ComponentPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [isCodeVisible, setIsCodeVisible] = useState(showCode);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Preview Area */}
      <div className="bg-muted p-8 flex items-center justify-center min-h-[200px]">
        {children}
      </div>

      {/* Controls */}
      {code && (
        <div className="bg-background border-t border-border">
          <div className="flex items-center justify-between px-4 py-2">
            <button
              onClick={() => setIsCodeVisible(!isCodeVisible)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Code2 size={16} />
              {isCodeVisible ? 'Hide' : 'Show'} Code
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Code Block */}
          {isCodeVisible && (
            <div className="border-t border-border">
              <pre className="p-4 overflow-x-auto bg-muted">
                <code className="text-sm font-mono">{code}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 7. Deployment Strategy

### 7.1 Vercel Deployment

**Advantages:**
- ✅ Zero-config Next.js deployment
- ✅ Automatic HTTPS
- ✅ CDN edge caching
- ✅ Preview deployments for PRs
- ✅ Custom domains

**Setup:**

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import `fidus` repository
   - Select `packages/design-system` as root directory

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: packages/design-system
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_SITE_URL=https://design.fidus.ai
   ```

4. **Custom Domain**
   - Add `design.fidus.ai` in Vercel dashboard
   - Configure DNS records:
     ```
     CNAME design.fidus.ai cname.vercel-dns.com
     ```

---

### 7.2 GitHub Actions CI/CD

#### `.github/workflows/design-system.yml`

```yaml
name: Design System CI/CD

on:
  push:
    branches: [main]
    paths:
      - 'packages/design-system/**'
      - 'packages/ui/**'
      - 'packages/shared/**'
  pull_request:
    branches: [main]
    paths:
      - 'packages/design-system/**'
      - 'packages/ui/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Type check
        run: pnpm --filter @fidus/design-system typecheck

      - name: Lint
        run: pnpm --filter @fidus/design-system lint

      - name: Test UI components
        run: pnpm --filter @fidus/ui test

      - name: Build
        run: pnpm --filter @fidus/design-system build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: packages/design-system
```

---

## 8. Integration with Fidus

### 8.1 Component Reuse Strategy

**The @fidus/ui package is the source of truth:**

```
┌──────────────────────────────────────────────────────────┐
│  @fidus/ui (Component Library)                          │
│  ────────────────────────────────────────               │
│  Production-ready components                             │
│  - Button, Card, Input, etc.                            │
│  - Zod schemas for validation                           │
│  - TypeScript types                                     │
│  - Unit tests                                           │
└───────────────┬──────────────────────────┬───────────────┘
                │                          │
                ▼                          ▼
    ┌─────────────────────┐    ┌──────────────────────┐
    │ @fidus/design-system│    │ @fidus/web (Future)  │
    │ (Documentation)     │    │ (Main Fidus App)     │
    │                     │    │                      │
    │ Imports and         │    │ Imports and          │
    │ documents           │    │ uses components      │
    │ components          │    │ in production        │
    └─────────────────────┘    └──────────────────────┘
```

**Benefits:**
1. ✅ Write components once, use everywhere
2. ✅ Documentation always in sync (uses real components)
3. ✅ Design system is living proof of production code
4. ✅ No duplication or drift

---

### 8.2 Migration to Fidus Web App

When ready to build the main Fidus application:

**Step 1: Create web package**
```bash
mkdir packages/web
cd packages/web
pnpm create next-app@latest . --typescript --tailwind --app
```

**Step 2: Add @fidus/ui dependency**
```json
{
  "dependencies": {
    "@fidus/ui": "workspace:*"
  }
}
```

**Step 3: Copy Tailwind config**
```bash
cp packages/design-system/tailwind.config.ts packages/web/
cp packages/design-system/styles/globals.css packages/web/styles/
```

**Step 4: Import components**
```typescript
// packages/web/app/page.tsx
import { Button } from '@fidus/ui/components/button';
import { OpportunityCard } from '@fidus/ui/components/opportunity-card';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <OpportunityCard {...props} />
    </div>
  );
}
```

**That's it!** Components work identically because they're the same code.

---

## 9. Summary

### What You Get

By building the design system website with production technologies:

1. **Standalone Design System Website**
   - Live at `design.fidus.ai`
   - Documentation + Interactive playground
   - Real components (not demos)

2. **@fidus/ui Component Library**
   - Production-ready components
   - Type-safe (TypeScript + Zod)
   - Tested (Vitest + Testing Library)
   - Reusable in main Fidus app

3. **Tech Stack Validation**
   - Proof that Next.js 14 + RSC works
   - Tailwind + CSS variables tested
   - Component Registry pattern validated
   - Architecture decisions confirmed

4. **Accelerated Fidus Development**
   - When building main app, just import `@fidus/ui`
   - No component rewriting
   - Design system already proven
   - All patterns validated in isolation

### Implementation Phases

| Phase | Deliverable |
|-------|-------------|
| **Phase 1** | Foundation (routing, tokens, navigation) |
| **Phase 2** | 5 components in @fidus/ui |
| **Phase 3** | Component documentation pages |
| **Phase 4** | Interactive playground |
| **Phase 5** | Advanced features (search, patterns) |
| **Phase 6** | Deployment + CI/CD |

---

## Next Steps

1. **Review architecture** and decide on approach
2. **Create packages** (design-system, ui)
3. **Start Phase 1** (foundation setup)
4. **Iterate and improve** based on learnings

---

## Related Documentation

- [18-design-system-website.md](18-design-system-website.md) - Original concept (Nextra-based)
- [19-ui-implementation-recommendation.md](19-ui-implementation-recommendation.md) - Tech stack rationale
- [05-design-system-components.md](05-design-system-components.md) - Component specifications
- [13-frontend-architecture.md](13-frontend-architecture.md) - Frontend architecture details

---

**Document Status:** ✅ Ready for Implementation
**Last Updated:** 2025-01-28
**Next Review:** After Phase 1 completion
