# Technology Decisions

**Version:** 1.0
**Date:** 2025-10-27
**Status:** Draft (Awaiting Human Review)
**Part of:** Fidus Solution Architecture
**Author:** AI-Generated

---

## Table of Contents

1. [Overview](#overview)
2. [Decision Framework](#decision-framework)
3. [Programming Languages](#programming-languages)
4. [Backend Technology Stack](#backend-technology-stack)
5. [Frontend Technology Stack](#frontend-technology-stack)
6. [Database & Caching](#database--caching)
7. [Event Bus & Message Broker](#event-bus--message-broker)
8. [LLM Infrastructure](#llm-infrastructure)
9. [MCP (Model Context Protocol)](#mcp-model-context-protocol)
10. [LangGraph & Agent Framework](#langgraph--agent-framework)
11. [Authentication & Authorization](#authentication--authorization)
12. [Observability Stack](#observability-stack)
13. [Deployment & Infrastructure](#deployment--infrastructure)
14. [Development Tools](#development-tools)
15. [Alternative Technologies Considered](#alternative-technologies-considered)
16. [Technology Roadmap](#technology-roadmap)

---

## Overview

This document details all major technology decisions made for the Fidus system, including the rationale, alternatives considered, and trade-offs. Each decision is evaluated against the project's core principles: **Privacy-First**, **LLM-Driven Logic**, **Domain Isolation**, **Event-Driven Architecture**, and **Proactive Intelligence**.

### Decision Status

| Component | Technology | Status | Confidence |
|-----------|-----------|--------|------------|
| **Backend Language** | Python | ✅ Final | High |
| **Frontend Framework** | Next.js 14 | ✅ Final | High |
| **Database** | PostgreSQL | ✅ Final | High |
| **Cache** | Redis | ✅ Final | High |
| **Event Bus** | BullMQ + Redis Pub/Sub | ✅ Final | High |
| **LLM Framework** | LangGraph | ✅ Final | High |
| **Local LLM** | Ollama | ✅ Final | Medium |
| **Cloud LLM** | OpenAI | ✅ Final | High |
| **MCP Transport** | HTTP + SSE | ✅ Final | High |
| **Auth Provider** | Auth0 / Keycloak | 🟡 Evaluation | Medium |
| **Observability** | Prometheus + Grafana | ✅ Final | High |
| **Container Runtime** | Docker | ✅ Final | High |
| **Orchestration** | Docker Compose / Kubernetes | 🟡 Evaluation | Medium |

**Legend:**
- ✅ **Final:** Decision is final for MVP
- 🟡 **Evaluation:** Under evaluation, may change
- 🔴 **Blocked:** Blocked by external factors

---

## Decision Framework

All technology decisions are evaluated against the following criteria:

### 1. Alignment with Core Principles

```mermaid
flowchart LR
    Tech[Technology<br/>Candidate]

    Tech --> P1{Privacy-First?}
    Tech --> P2{LLM-Driven?}
    Tech --> P3{Domain Isolated?}
    Tech --> P4{Event-Driven?}
    Tech --> P5{Proactive?}

    P1 -->|Yes| Score1[+10]
    P1 -->|No| Reject1[Reject]

    P2 -->|Yes| Score2[+8]
    P2 -->|Neutral| Score2b[+0]

    P3 -->|Yes| Score3[+7]
    P3 -->|No| Reject3[Reject]

    P4 -->|Yes| Score4[+6]
    P4 -->|Neutral| Score4b[+0]

    P5 -->|Yes| Score5[+5]
    P5 -->|Neutral| Score5b[+0]

    Score1 --> Total[Total Score]
    Score2 --> Total
    Score3 --> Total
    Score4 --> Total
    Score5 --> Total

    Total -->|Score >= 25| Accept[Accept Technology]
    Total -->|Score < 25| Reconsider[Reconsider or Reject]

    style Accept fill:#90be6d
    style Reject1 fill:#f94144
    style Reject3 fill:#f94144
```

### 2. Maturity & Community

- **Maturity:** Production-ready (not beta)
- **Community:** Active community (>1000 stars on GitHub, or equivalent)
- **Documentation:** Comprehensive docs and examples
- **Support:** Commercial support available (for critical components)

### 3. Performance & Scalability

- **Latency:** Can meet target latency (<2s for user queries)
- **Throughput:** Can handle target load (1000 req/s for MVP)
- **Scalability:** Can scale horizontally
- **Resource Efficiency:** Reasonable CPU/memory usage

### 4. Developer Experience

- **Learning Curve:** Team can learn in <2 weeks
- **Tooling:** IDE support, linters, formatters available
- **Debugging:** Good debugging and profiling tools
- **Testing:** Easy to write automated tests

### 5. Operational Complexity

- **Setup:** Can be set up in <1 hour
- **Monitoring:** Integrates with standard monitoring tools
- **Maintenance:** Low maintenance overhead
- **Debugging:** Easy to troubleshoot in production

### 6. Cost

- **Licensing:** Open-source or affordable licensing
- **Infrastructure:** Runs on commodity hardware
- **Team Training:** Minimal training costs
- **Support:** Support costs (if needed)

---

## Programming Languages

### Backend: Python 3.11+

**Decision:** Use **Python 3.11+** for all backend services (API, agents, workers).

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **LLM Ecosystem** | Python is the lingua franca of LLM development. LangChain, LangGraph, Transformers, and all major LLM libraries are Python-first. |
| **LangGraph** | LangGraph (our agent framework) is Python-only. |
| **Data Science** | Future ML features (opportunity detection, personalization) benefit from Python's ML ecosystem. |
| **Type Safety** | Python 3.11+ with `mypy --strict` provides strong type checking. |
| **Async Support** | `asyncio` and `async/await` enable high-concurrency agent coordination. |
| **Community** | Massive community, extensive libraries for every domain. |
| **Performance** | Good enough for MVP (P99 latency <2s). Can optimize hotspots with Rust/C++ extensions later. |

**Alternatives Considered:**

| Language | Pros | Cons | Verdict |
|----------|------|------|---------|
| **TypeScript (Node.js)** | Full-stack consistency, fast, strong types | Poor LLM library support, no LangGraph | ❌ Rejected |
| **Go** | Fast, great for concurrency, simple | No LLM ecosystem, no LangGraph | ❌ Rejected |
| **Rust** | Blazing fast, memory safe | Steep learning curve, poor LLM library support | ❌ Rejected (for now) |
| **Java/Kotlin** | Enterprise-ready, strong types | Verbose, no LangGraph, slower development | ❌ Rejected |

**Code Example (Type Hints):**

```python
from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class Appointment(BaseModel):
    """Calendar appointment aggregate."""

    id: str = Field(..., description="Unique appointment ID")
    tenant_id: str = Field(..., description="Tenant isolation")
    title: str = Field(..., min_length=1, max_length=200)
    start: datetime
    end: datetime
    location: Optional[str] = None
    participants: List[str] = Field(default_factory=list)

    def conflicts_with(self, other: Appointment) -> bool:
        """Check if this appointment overlaps with another."""
        return (
            self.tenant_id == other.tenant_id
            and self.start < other.end
            and self.end > other.start
        )
```

**Key Points:**
- ✅ Use Pydantic for data validation and serialization
- ✅ Use type hints everywhere (`mypy --strict` enforced in CI)
- ✅ Use `async/await` for I/O-bound operations
- ✅ Use structured logging (structlog)

---

### Frontend: TypeScript 5.x

**Decision:** Use **TypeScript 5.x** for all frontend code (web UI, CLI).

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Type Safety** | TypeScript catches bugs at compile time. Critical for complex UIs. |
| **IDE Support** | Excellent autocomplete, refactoring, and navigation. |
| **Ecosystem** | Largest frontend ecosystem (npm). All libraries have TypeScript types. |
| **Team Familiarity** | Most frontend developers know TypeScript. |
| **Next.js Support** | Next.js is TypeScript-first. |
| **Code Quality** | Enforces consistent code style and reduces runtime errors. |

**Alternatives Considered:**

| Language | Pros | Cons | Verdict |
|----------|------|------|---------|
| **JavaScript** | Simpler, no compilation step | No type safety, error-prone | ❌ Rejected |
| **ReScript** | ML-like syntax, excellent type system | Small community, steep learning curve | ❌ Rejected |
| **Elm** | No runtime errors, functional | Very different paradigm, small community | ❌ Rejected |

**TypeScript Configuration:**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**Key Points:**
- ✅ Use `strict: true` for maximum type safety
- ✅ Use Zod for runtime validation (complements TypeScript)
- ✅ Use ESLint + Prettier for code quality
- ✅ Use Vitest for unit testing

---

## Backend Technology Stack

### Framework: FastAPI

**Decision:** Use **FastAPI** as the backend web framework.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Performance** | FastAPI is one of the fastest Python frameworks (comparable to Node.js). |
| **Async Support** | Native `async/await` support for high-concurrency scenarios. |
| **Type Safety** | Uses Pydantic for data validation (type-safe). |
| **Auto Documentation** | Auto-generates OpenAPI (Swagger) docs from code. |
| **Dependency Injection** | Built-in DI system simplifies testing and architecture. |
| **WebSockets/SSE** | First-class support for real-time communication (SSE for MCP). |
| **Community** | Large community, well-maintained, used by Netflix, Uber, etc. |

**Alternatives Considered:**

| Framework | Pros | Cons | Verdict |
|-----------|------|------|---------|
| **Django** | Batteries-included, ORM, admin panel | Synchronous, slower, heavyweight | ❌ Rejected |
| **Flask** | Simple, lightweight | No async, manual setup, less opinionated | ❌ Rejected |
| **Starlette** | Minimal, fast | Too low-level, manual work | ❌ Rejected |
| **Litestar** | Fast, modern, type-safe | Smaller community, newer | ⚠️ Consider later |

**FastAPI Example:**

```python
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import List


app = FastAPI(title="Fidus API", version="1.0.0")


class AppointmentCreate(BaseModel):
    title: str
    start: datetime
    end: datetime


class AppointmentResponse(BaseModel):
    id: str
    title: str
    start: datetime
    end: datetime


@app.post("/appointments", response_model=AppointmentResponse)
async def create_appointment(
    appointment: AppointmentCreate,
    user_id: str = Depends(get_current_user_id),
    tenant_id: str = Depends(get_tenant_id)
) -> AppointmentResponse:
    """Create a new calendar appointment."""
    # Business logic here
    result = await calendar_service.create_appointment(
        user_id=user_id,
        tenant_id=tenant_id,
        data=appointment
    )
    return result
```

**Key Points:**
- ✅ Use dependency injection for all services
- ✅ Use Pydantic models for request/response validation
- ✅ Use `async def` for all route handlers
- ✅ Use middleware for auth, logging, error handling

---

### ORM: SQLAlchemy 2.x (Async)

**Decision:** Use **SQLAlchemy 2.x** with async support for database access.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Maturity** | SQLAlchemy is the most mature Python ORM (15+ years). |
| **Async Support** | SQLAlchemy 2.x has first-class async support. |
| **Type Safety** | Type-safe query builder (better than raw SQL). |
| **Migrations** | Alembic (from SQLAlchemy team) for migrations. |
| **Flexibility** | Supports both ORM and raw SQL when needed. |
| **Multi-Database** | Can switch between PostgreSQL, MySQL, SQLite. |

**Alternatives Considered:**

| ORM | Pros | Cons | Verdict |
|-----|------|------|---------|
| **Django ORM** | Simple, beginner-friendly | Tied to Django, less flexible | ❌ Rejected |
| **Tortoise ORM** | Async-first, Django-like API | Smaller community, less mature | ❌ Rejected |
| **Prisma** | Type-safe, auto-generated client | TypeScript-first, Python support is beta | ❌ Rejected |
| **Peewee** | Simple, lightweight | No async support | ❌ Rejected |

**SQLAlchemy Example:**

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, String, DateTime, ForeignKey, select


Base = declarative_base()


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True)
    tenant_id = Column(String, nullable=False, index=True)
    title = Column(String(200), nullable=False)
    start = Column(DateTime(timezone=True), nullable=False)
    end = Column(DateTime(timezone=True), nullable=False)

    # Relationships
    participants = relationship("AppointmentParticipant", back_populates="appointment")


class AppointmentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def find_by_id(self, appointment_id: str, tenant_id: str) -> Appointment | None:
        """Find appointment by ID (tenant-isolated)."""
        query = select(Appointment).where(
            Appointment.id == appointment_id,
            Appointment.tenant_id == tenant_id
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def find_conflicts(
        self,
        tenant_id: str,
        start: datetime,
        end: datetime
    ) -> List[Appointment]:
        """Find appointments that overlap with given time range."""
        query = select(Appointment).where(
            Appointment.tenant_id == tenant_id,
            Appointment.start < end,
            Appointment.end > start
        )
        result = await self.session.execute(query)
        return list(result.scalars().all())
```

**Key Points:**
- ✅ Use async engine (`create_async_engine`)
- ✅ Use `AsyncSession` for all database operations
- ✅ Use repository pattern (not direct ORM access)
- ✅ Use Alembic for schema migrations

---

### API Documentation: OpenAPI (Swagger)

**Decision:** Use **OpenAPI 3.1** (auto-generated by FastAPI) for API documentation.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Auto-Generated** | FastAPI generates OpenAPI schema from code (no manual maintenance). |
| **Interactive UI** | Swagger UI for testing APIs in browser. |
| **Standard** | OpenAPI is the industry standard for REST APIs. |
| **Code Generation** | Can generate client SDKs in any language. |
| **Validation** | OpenAPI schema validates requests/responses. |

**Alternatives Considered:**

| Tool | Pros | Cons | Verdict |
|------|------|------|---------|
| **GraphQL** | Flexible queries, type-safe | Overhead for simple CRUD, learning curve | ❌ Rejected (for now) |
| **gRPC** | Fast, type-safe, streaming | Not web-friendly, requires code generation | ❌ Rejected |
| **tRPC** | Type-safe, no code generation | TypeScript-only, new | ❌ Rejected |

**FastAPI OpenAPI Integration:**

```python
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi


app = FastAPI()


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Fidus API",
        version="1.0.0",
        description="Privacy-first AI personal assistant API",
        routes=app.routes,
    )

    # Add custom security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
```

**Key Points:**
- ✅ Auto-generated from code (single source of truth)
- ✅ Interactive Swagger UI at `/docs`
- ✅ ReDoc UI at `/redoc` (alternative view)
- ✅ OpenAPI schema at `/openapi.json`

---

## Frontend Technology Stack

### Framework: Next.js 14 (App Router)

**Decision:** Use **Next.js 14** with **App Router** for the web frontend.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Performance** | Server Components reduce client-side JavaScript (faster load times). |
| **SEO** | SSR (Server-Side Rendering) for better SEO (if public pages added later). |
| **Developer Experience** | File-based routing, hot reload, TypeScript support out of the box. |
| **React 18** | Uses latest React features (Server Components, Suspense, Streaming). |
| **API Routes** | Built-in API routes (can proxy to FastAPI). |
| **Image Optimization** | Next.js Image component optimizes images automatically. |
| **Community** | Largest React framework community (Vercel-backed). |

**Alternatives Considered:**

| Framework | Pros | Cons | Verdict |
|-----------|------|------|---------|
| **Vite + React** | Fast dev server, simple | No SSR, no file-based routing | ❌ Rejected |
| **Remix** | Excellent data loading, nested routes | Smaller community, newer | ⚠️ Consider later |
| **SvelteKit** | Faster than React, less boilerplate | Smaller ecosystem, team unfamiliar | ❌ Rejected |
| **Solid Start** | Fast, reactive | Very small community, immature | ❌ Rejected |

**Next.js App Router Example:**

```typescript
// app/appointments/page.tsx (Server Component by default)
import { getAppointments } from '@/lib/api/appointments';
import { AppointmentList } from '@/components/AppointmentList';

interface AppointmentsPageProps {
  searchParams: { date?: string };
}

export default async function AppointmentsPage({
  searchParams
}: AppointmentsPageProps) {
  // Fetch data on server (no client-side loading state needed)
  const appointments = await getAppointments({
    date: searchParams.date || new Date().toISOString()
  });

  return (
    <div>
      <h1>Appointments</h1>
      <AppointmentList appointments={appointments} />
    </div>
  );
}
```

**Key Points:**
- ✅ Use Server Components by default (add `'use client'` only when needed)
- ✅ Use App Router (not Pages Router)
- ✅ Use TypeScript for all components
- ✅ Use CSS Modules or Tailwind CSS for styling

---

### UI Library: shadcn/ui (Radix UI)

**Decision:** Use **shadcn/ui** (built on Radix UI primitives) for UI components.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Ownership** | Copy components into codebase (not npm dependency). Full control. |
| **Accessibility** | Built on Radix UI (WAI-ARIA compliant). |
| **Customization** | Easy to customize (just edit the component file). |
| **No Runtime** | No JavaScript shipped for most components (server-rendered). |
| **Design System** | Consistent design tokens (CSS variables). |
| **TypeScript** | Fully typed components. |

**Alternatives Considered:**

| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| **Material UI** | Comprehensive, battle-tested | Heavy, opinionated design, large bundle | ❌ Rejected |
| **Chakra UI** | Good DX, accessible | Runtime CSS-in-JS (performance cost) | ❌ Rejected |
| **Ant Design** | Enterprise-ready, many components | Opinionated design, large bundle | ❌ Rejected |
| **Headless UI** | Unstyled, flexible | Need to style everything manually | ⚠️ shadcn/ui uses similar approach |

**shadcn/ui Example:**

```bash
# Install shadcn/ui CLI
npx shadcn-ui@latest init

# Add components (copies files to your project)
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add calendar
```

```typescript
// components/ui/button.tsx (in your codebase, customizable)
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

**Key Points:**
- ✅ Components are in your codebase (full ownership)
- ✅ Easy to customize (just edit the file)
- ✅ Accessible by default (Radix UI primitives)
- ✅ Design tokens via CSS variables

---

### State Management: Zustand + React Query

**Decision:** Use **Zustand** for client state and **React Query (TanStack Query)** for server state.

**Rationale:**

| Factor | Zustand (Client State) | React Query (Server State) |
|--------|------------------------|----------------------------|
| **Simplicity** | Minimal boilerplate | Declarative data fetching |
| **Bundle Size** | 1KB gzipped | 13KB gzipped |
| **TypeScript** | Excellent TypeScript support | Full TypeScript support |
| **DevTools** | Redux DevTools compatible | Dedicated DevTools |
| **Learning Curve** | Very easy | Easy |
| **Performance** | Fast, optimized re-renders | Automatic caching, deduplication |

**Alternatives Considered:**

| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| **Redux Toolkit** | Industry standard, powerful | More boilerplate, steeper learning curve | ❌ Rejected (overkill for Fidus) |
| **Jotai** | Atomic state, simple | Less mature, smaller community | ⚠️ Consider later |
| **Recoil** | Facebook-backed, atomic | Development stalled, uncertain future | ❌ Rejected |
| **Context API** | Built-in, no dependency | Performance issues with frequent updates | ❌ Rejected (for global state) |

**Zustand Example (Client State):**

```typescript
// stores/useThemeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Usage in component
function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  return <button onClick={toggleTheme}>Toggle {theme}</button>;
}
```

**React Query Example (Server State):**

```typescript
// hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointments, createAppointment } from '@/lib/api/appointments';

export function useAppointments(date: string) {
  return useQuery({
    queryKey: ['appointments', date],
    queryFn: () => getAppointments({ date }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

// Usage in component
function AppointmentForm() {
  const { data: appointments, isLoading } = useAppointments('2025-11-04');
  const createMutation = useCreateAppointment();

  const handleSubmit = (data: AppointmentCreate) => {
    createMutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Key Points:**
- ✅ Use Zustand for UI state (theme, sidebar open/closed, etc.)
- ✅ Use React Query for server data (appointments, transactions, etc.)
- ✅ Don't mix server and client state
- ✅ Use React Query's caching to reduce API calls

---

### Styling: Tailwind CSS

**Decision:** Use **Tailwind CSS** for styling.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Utility-First** | Fast development, no context switching (HTML + CSS in one place). |
| **Customization** | Fully customizable via `tailwind.config.js`. |
| **Performance** | PurgeCSS removes unused styles (small bundle). |
| **Consistency** | Design system built-in (spacing, colors, typography). |
| **Developer Experience** | Excellent IDE support (IntelliSense). |
| **Community** | Huge community, extensive plugins. |

**Alternatives Considered:**

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **CSS Modules** | Scoped styles, no naming conflicts | Manual class naming, no design system | ❌ Rejected |
| **Styled Components** | CSS-in-JS, dynamic styles | Runtime cost, SSR complexity | ❌ Rejected |
| **Emotion** | Performant CSS-in-JS | Still runtime cost | ❌ Rejected |
| **Vanilla Extract** | Zero-runtime CSS-in-JS | More setup, less mature | ⚠️ Consider later |

**Tailwind Configuration:**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... other color definitions
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

**Key Points:**
- ✅ Use Tailwind for all styling (no CSS files)
- ✅ Use design tokens via CSS variables
- ✅ Use `@apply` directive sparingly (prefer utilities)
- ✅ Use Tailwind plugins for animations, typography, etc.

---

## Database & Caching

### Primary Database: PostgreSQL 16

**Decision:** Use **PostgreSQL 16** as the primary database.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Maturity** | PostgreSQL is 30+ years old, battle-tested. |
| **Features** | JSON/JSONB, full-text search, GIS, advanced indexing. |
| **Performance** | Excellent performance for read-heavy and write-heavy workloads. |
| **ACID** | Full ACID compliance (strong consistency). |
| **Extensions** | Rich extension ecosystem (pg_trgm for fuzzy search, PostGIS for geo, etc.). |
| **Community** | Massive community, extensive documentation. |
| **Open Source** | Truly open-source (not controlled by a single company). |

**Alternatives Considered:**

| Database | Pros | Cons | Verdict |
|----------|------|------|---------|
| **MySQL** | Popular, fast | Less feature-rich than PostgreSQL | ❌ Rejected |
| **MongoDB** | Flexible schema, JSON-native | No transactions (pre-4.0), eventual consistency | ❌ Rejected |
| **CockroachDB** | Distributed, PostgreSQL-compatible | Overkill for MVP, more complex | ⚠️ Consider for Cloud Edition |
| **SQLite** | Embedded, zero-config | Not suitable for multi-user production | ❌ Rejected |

**PostgreSQL Schema Example:**

```sql
-- Tenant table (multi-tenancy)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    plan VARCHAR(50) NOT NULL, -- FREE, STARTER, PRO, ENTERPRISE
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL, -- ADMIN, USER
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    INDEX idx_users_tenant (tenant_id),
    INDEX idx_users_email (email)
);

-- Appointment table (Calendar domain)
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location VARCHAR(500),
    visibility VARCHAR(20) NOT NULL DEFAULT 'PRIVATE', -- PRIVATE, FAMILY, PUBLIC
    external_id VARCHAR(200), -- For synced external calendars
    external_provider VARCHAR(50), -- google_calendar, outlook, etc.
    metadata JSONB, -- Flexible additional data
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    INDEX idx_appointments_tenant (tenant_id),
    INDEX idx_appointments_owner (owner_id),
    INDEX idx_appointments_time (start_time, end_time),
    INDEX idx_appointments_external (external_provider, external_id)
);

-- Event store (event sourcing)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    aggregate_id UUID NOT NULL,
    aggregate_type VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    metadata JSONB,
    version INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    INDEX idx_events_tenant (tenant_id),
    INDEX idx_events_aggregate (aggregate_id, version),
    INDEX idx_events_type (event_type),
    INDEX idx_events_created (created_at)
);

-- Full-text search on appointments
CREATE INDEX idx_appointments_fulltext ON appointments
USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
```

**Key Points:**
- ✅ Use UUID for primary keys (globally unique, no coordination needed)
- ✅ Use `TIMESTAMPTZ` for all timestamps (timezone-aware)
- ✅ Use JSONB for flexible metadata
- ✅ Use indexes for all foreign keys and query filters
- ✅ Use `ON DELETE CASCADE` for tenant isolation

---

### Cache: Redis 7.x

**Decision:** Use **Redis 7.x** for caching and session storage.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Performance** | In-memory storage, <1ms latency for most operations. |
| **Data Structures** | Strings, hashes, lists, sets, sorted sets, streams. |
| **Persistence** | Optional persistence (RDB snapshots + AOF log). |
| **Pub/Sub** | Built-in pub/sub for real-time events. |
| **TTL** | Automatic key expiration (perfect for caching). |
| **Atomic Operations** | INCR, DECR, etc. for counters and rate limiting. |
| **Community** | Huge community, battle-tested. |

**Alternatives Considered:**

| Technology | Pros | Cons | Verdict |
|------------|------|------|---------|
| **Memcached** | Simple, fast | Limited data structures, no persistence | ❌ Rejected |
| **Valkey** | Redis fork, community-driven | New, uncertain future | ⚠️ Monitor development |
| **DragonflyDB** | Faster than Redis, compatible | New, less mature | ⚠️ Consider later |

**Redis Use Cases in Fidus:**

| Use Case | Redis Data Structure | TTL | Example Key |
|----------|---------------------|-----|-------------|
| **Session Storage** | Hash | 24 hours | `session:{session_id}` |
| **LangGraph State** | Hash | 24 hours | `langgraph:{agent}:{session_id}:state` |
| **User Cache** | Hash | 1 hour | `user:{user_id}` |
| **Budget Cache** | Hash | 5 minutes | `budget:{budget_id}` |
| **Rate Limiting** | String (counter) | 1 minute | `ratelimit:{user_id}:{endpoint}` |
| **Event Pub/Sub** | Pub/Sub | N/A | `events:calendar:appointment.created` |
| **Idempotency Keys** | String | 24 hours | `idempotency:{event_id}` |
| **Coordination Context** | Hash | 1 hour | `coordination:{coordination_id}` |

**Redis Configuration Example:**

```python
from redis.asyncio import Redis
from typing import Any, Optional


class CacheService:
    def __init__(self, redis: Redis):
        self.redis = redis

    async def get(self, key: str) -> Optional[str]:
        """Get value from cache."""
        return await self.redis.get(key)

    async def set(
        self,
        key: str,
        value: str,
        ttl: int = 300
    ) -> None:
        """Set value in cache with TTL (default 5 minutes)."""
        await self.redis.setex(key, ttl, value)

    async def hget_all(self, key: str) -> dict[str, str]:
        """Get all fields from hash."""
        return await self.redis.hgetall(key)

    async def hset(
        self,
        key: str,
        mapping: dict[str, Any],
        ttl: Optional[int] = None
    ) -> None:
        """Set hash fields."""
        await self.redis.hset(key, mapping=mapping)
        if ttl:
            await self.redis.expire(key, ttl)

    async def delete(self, key: str) -> None:
        """Delete key from cache."""
        await self.redis.delete(key)

    async def publish(self, channel: str, message: str) -> None:
        """Publish message to pub/sub channel."""
        await self.redis.publish(channel, message)
```

**Key Points:**
- ✅ Use Redis for caching (not primary data store)
- ✅ Always set TTL on cache keys (prevent memory leak)
- ✅ Use hashes for structured data
- ✅ Use pub/sub for real-time events (non-critical)

---

## Event Bus & Message Broker

### Event Bus: BullMQ + Redis Pub/Sub

**Decision:** Use **BullMQ** for critical events and **Redis Pub/Sub** for fast, non-critical events.

**Rationale:**

| Feature | BullMQ (Critical Events) | Redis Pub/Sub (Fast Events) |
|---------|--------------------------|------------------------------|
| **Delivery Guarantee** | At-least-once | At-most-once |
| **Persistence** | Persisted in Redis | Not persisted |
| **Retries** | Automatic retries with backoff | No retries |
| **Ordering** | FIFO within queue | No ordering guarantees |
| **Concurrency** | Configurable workers | All subscribers notified |
| **Use Case** | Domain events, sagas, workflows | Real-time UI updates, notifications |
| **Latency** | 10-50ms | <5ms |

**When to Use Each:**

| Event Type | Bus | Reason |
|------------|-----|--------|
| **AppointmentCreated** | BullMQ | Critical, must be processed by all agents |
| **TransactionRecorded** | BullMQ | Critical, affects budgets |
| **BudgetExceeded** | BullMQ | Critical, must trigger alerts |
| **UserPresenceChanged** | Redis Pub/Sub | Non-critical, real-time UI only |
| **TypingIndicator** | Redis Pub/Sub | Non-critical, ephemeral |
| **ProgressUpdate** | Redis Pub/Sub | Non-critical, UI feedback |

**Alternatives Considered:**

| Technology | Pros | Cons | Verdict |
|------------|------|------|---------|
| **RabbitMQ** | Feature-rich, mature | Separate service, more complex | ❌ Rejected (overkill) |
| **Kafka** | High throughput, event streaming | Heavy, complex, overkill for MVP | ❌ Rejected |
| **NATS** | Lightweight, fast | Smaller community, less mature | ⚠️ Consider later |
| **AWS SQS/SNS** | Managed, scalable | Vendor lock-in, not self-hostable | ❌ Rejected |

**BullMQ Example:**

```typescript
// eventBus.ts
import { Queue, Worker, QueueEvents } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null,
});

// Create queue
const eventQueue = new Queue('domain-events', { connection });

// Publish event
export async function publishEvent(eventType: string, payload: any): Promise<void> {
  await eventQueue.add(eventType, payload, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
}

// Subscribe to events
export function subscribeToEvents(
  eventType: string,
  handler: (payload: any) => Promise<void>
): Worker {
  return new Worker(
    'domain-events',
    async (job) => {
      if (job.name === eventType) {
        await handler(job.data);
      }
    },
    {
      connection,
      concurrency: 5,
    }
  );
}

// Usage
await publishEvent('calendar.appointment.created', {
  appointment_id: 'apt-123',
  tenant_id: 'tenant-456',
  title: 'Team Meeting',
});

const worker = subscribeToEvents('calendar.appointment.created', async (payload) => {
  console.log('Appointment created:', payload);
  // Process event...
});
```

**Redis Pub/Sub Example:**

```python
import asyncio
from redis.asyncio import Redis


class PubSubService:
    def __init__(self, redis: Redis):
        self.redis = redis

    async def publish(self, channel: str, message: dict) -> None:
        """Publish message to channel (fire-and-forget)."""
        await self.redis.publish(channel, json.dumps(message))

    async def subscribe(
        self,
        channel: str,
        handler: Callable[[dict], Awaitable[None]]
    ) -> None:
        """Subscribe to channel and handle messages."""
        pubsub = self.redis.pubsub()
        await pubsub.subscribe(channel)

        async for message in pubsub.listen():
            if message['type'] == 'message':
                data = json.loads(message['data'])
                await handler(data)


# Usage
pubsub = PubSubService(redis)

# Publish
await pubsub.publish('ui:progress', {
    'session_id': 'sess-123',
    'progress': 0.5,
    'message': 'Processing...'
})

# Subscribe
async def handle_progress(data: dict):
    print(f"Progress: {data['progress']}")

await pubsub.subscribe('ui:progress', handle_progress)
```

**Key Points:**
- ✅ Use BullMQ for critical events (must be processed)
- ✅ Use Redis Pub/Sub for real-time UI updates
- ✅ Make all event handlers idempotent
- ✅ Use retries for transient failures

---

## LLM Infrastructure

### Local LLM: Ollama

**Decision:** Use **Ollama** for running local LLMs (default for Free and Starter plans).

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Privacy** | LLM runs locally, no data sent to cloud. |
| **Ease of Use** | Simple CLI (`ollama run llama3`), no complex setup. |
| **Model Management** | Automatic model download and version management. |
| **Performance** | Optimized inference (llama.cpp backend). |
| **API Compatibility** | OpenAI-compatible API (easy to swap). |
| **Community** | Large community, many pre-quantized models. |
| **Cost** | Free, no API costs. |

**Alternatives Considered:**

| Technology | Pros | Cons | Verdict |
|------------|------|------|---------|
| **llama.cpp** | Fastest inference, most control | Manual setup, no API | ❌ Rejected (Ollama uses this internally) |
| **LocalAI** | OpenAI-compatible, many models | Less optimized than Ollama | ⚠️ Consider as fallback |
| **vLLM** | Very fast, production-grade | Complex setup, overkill for MVP | ⚠️ Consider for Cloud Edition |
| **LM Studio** | GUI, easy to use | Desktop app, not server-friendly | ❌ Rejected |

**Ollama Integration:**

```python
from openai import AsyncOpenAI


class LLMService:
    def __init__(self, provider: str = "ollama"):
        if provider == "ollama":
            self.client = AsyncOpenAI(
                base_url="http://localhost:11434/v1",
                api_key="ollama"  # Ollama doesn't need real API key
            )
            self.model = "llama3.1:8b"
        elif provider == "openai":
            self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            self.model = "gpt-4"

    async def complete(
        self,
        messages: list[dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """Generate completion."""
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content

    async def complete_structured(
        self,
        messages: list[dict[str, str]],
        schema: dict
    ) -> dict:
        """Generate structured output (JSON)."""
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            response_format={"type": "json_schema", "json_schema": schema}
        )
        return json.loads(response.choices[0].message.content)
```

**Recommended Models:**

| Model | Size | Use Case | Speed | Quality |
|-------|------|----------|-------|---------|
| **Llama 3.1 8B** | 4.7GB (Q4) | General tasks, fast inference | ⚡⚡⚡ | ⭐⭐⭐ |
| **Llama 3.1 70B** | 40GB (Q4) | Complex reasoning, high quality | ⚡ | ⭐⭐⭐⭐⭐ |
| **Mistral 7B** | 4.1GB (Q4) | Fast inference, good quality | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| **Gemma 2 9B** | 5.5GB (Q4) | Google model, balanced | ⚡⚡ | ⭐⭐⭐⭐ |

**Key Points:**
- ✅ Ollama is default LLM provider for privacy
- ✅ OpenAI-compatible API (easy to swap providers)
- ✅ Use quantized models (Q4) for speed vs. quality balance
- ✅ GPU acceleration supported (NVIDIA, AMD, Apple Silicon)

---

### Cloud LLM: OpenAI GPT-4

**Decision:** Use **OpenAI GPT-4** as cloud LLM option (for Pro/Enterprise plans or users who opt in).

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Quality** | GPT-4 is state-of-the-art for reasoning and comprehension. |
| **API Maturity** | OpenAI API is mature, well-documented, reliable. |
| **Structured Outputs** | Supports JSON mode and function calling. |
| **Speed** | Fast inference (<2s for most requests). |
| **Cost** | Reasonable cost ($0.01-0.03 per 1K tokens). |
| **Privacy Proxy** | Fidus Privacy Proxy anonymizes data before sending. |

**Alternatives Considered:**

| Provider | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Anthropic Claude** | Excellent reasoning, 200K context | More expensive, less flexible API | ⚠️ Add as alternative |
| **Google Gemini** | Free tier, multimodal | Inconsistent quality, less reliable | ⚠️ Add as alternative |
| **Mistral API** | European provider, GDPR-compliant | Smaller models, less capable | ⚠️ Add as alternative |
| **Azure OpenAI** | Enterprise SLA, compliance | More expensive, complex setup | ⚠️ Consider for Enterprise |

**OpenAI Integration:**

```python
from openai import AsyncOpenAI
from typing import Any


class OpenAIService:
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)

    async def complete(
        self,
        messages: list[dict[str, str]],
        model: str = "gpt-4-turbo",
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """Generate completion."""
        response = await self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content

    async def complete_with_functions(
        self,
        messages: list[dict[str, str]],
        functions: list[dict[str, Any]],
        function_call: str = "auto"
    ) -> dict:
        """Generate completion with function calling."""
        response = await self.client.chat.completions.create(
            model="gpt-4-turbo",
            messages=messages,
            functions=functions,
            function_call=function_call
        )

        message = response.choices[0].message

        if message.function_call:
            return {
                "type": "function_call",
                "name": message.function_call.name,
                "arguments": json.loads(message.function_call.arguments)
            }
        else:
            return {
                "type": "text",
                "content": message.content
            }
```

**Cost Estimation (OpenAI GPT-4 Turbo):**

| Usage Level | Requests/Day | Tokens/Request | Cost/Day | Cost/Month |
|-------------|--------------|----------------|----------|------------|
| **Light User** | 10 | 1000 | $0.30 | $9 |
| **Medium User** | 50 | 1500 | $2.25 | $67.50 |
| **Heavy User** | 200 | 2000 | $12 | $360 |
| **Enterprise** | 1000 | 2500 | $75 | $2,250 |

**Key Points:**
- ✅ Use OpenAI as cloud LLM option (user opts in)
- ✅ Privacy Proxy anonymizes PII before sending
- ✅ Track token usage for cost management
- ✅ Fallback to Ollama if OpenAI unavailable

---

## MCP (Model Context Protocol)

### Transport: HTTP + Server-Sent Events (SSE)

**Decision:** Use **HTTP + SSE** as the MCP transport layer.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Standard** | HTTP is universally supported, works with all firewalls/proxies. |
| **Bidirectional** | SSE for server→client streaming, HTTP POST for client→server. |
| **Simple** | No WebSocket complexity (connection management, reconnects). |
| **Persistent** | SSE connections are persistent (no reconnect overhead). |
| **JSON-RPC** | MCP uses JSON-RPC over HTTP + SSE (standard, well-defined). |
| **Browser-Friendly** | Works in browsers without special libraries. |

**Alternatives Considered:**

| Transport | Pros | Cons | Verdict |
|-----------|------|------|---------|
| **WebSockets** | True bidirectional | More complex, harder to debug | ❌ Rejected |
| **gRPC** | Fast, streaming | Not browser-friendly, complex | ❌ Rejected |
| **stdin/stdout** | Simple for local agents | Not network-capable | ✅ Use for local dev only |

**MCP SSE Example (Server Side - FastAPI):**

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse
import asyncio
import json


app = FastAPI()


@app.get("/sse")
async def sse_endpoint():
    """Server-Sent Events endpoint for MCP."""

    async def event_generator():
        # Keep connection alive
        while True:
            # Wait for messages from agent
            message = await agent_message_queue.get()

            # Send JSON-RPC response
            yield {
                "event": "message",
                "data": json.dumps({
                    "jsonrpc": "2.0",
                    "id": message["id"],
                    "result": message["result"]
                })
            }

    return EventSourceResponse(event_generator())


@app.post("/messages")
async def receive_message(request: dict):
    """Receive JSON-RPC request from client."""
    # Handle MCP request
    if request["method"] == "tools/call":
        result = await handle_tool_call(request["params"])
        return {
            "jsonrpc": "2.0",
            "id": request["id"],
            "result": result
        }
```

**MCP SSE Example (Client Side - Orchestrator):**

```python
import aiohttp
import json
from typing import AsyncIterator


class MCPClient:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = None
        self.sse_task = None

    async def connect(self):
        """Establish SSE connection."""
        self.session = aiohttp.ClientSession()
        self.sse_task = asyncio.create_task(self._listen_sse())

    async def _listen_sse(self):
        """Listen to SSE events."""
        async with self.session.get(f"{self.base_url}/sse") as response:
            async for line in response.content:
                if line.startswith(b"data: "):
                    data = json.loads(line[6:])
                    await self._handle_message(data)

    async def call_tool(self, tool_name: str, arguments: dict) -> dict:
        """Call agent tool via JSON-RPC."""
        request = {
            "jsonrpc": "2.0",
            "id": str(uuid.uuid4()),
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments
            }
        }

        async with self.session.post(
            f"{self.base_url}/messages",
            json=request
        ) as response:
            return await response.json()
```

**Key Points:**
- ✅ Use HTTP + SSE for MCP transport (standard)
- ✅ Use JSON-RPC 2.0 for all messages
- ✅ Keep SSE connection alive (heartbeat every 30s)
- ✅ Reconnect automatically if SSE connection drops

---

## LangGraph & Agent Framework

### Agent Framework: LangGraph

**Decision:** Use **LangGraph** for all agent reasoning and state machines.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **LLM-Native** | Designed for LLM-based agents (not generic state machines). |
| **Graph-Based** | Explicit state machine graphs (easy to visualize and debug). |
| **Persistence** | Built-in checkpointing (state persists across requests). |
| **Streaming** | Supports streaming responses (progress updates). |
| **LangChain Integration** | Works with LangChain tools and chains. |
| **Type Safety** | Full TypeScript and Python type support. |
| **Community** | Growing community, backed by LangChain team. |

**Alternatives Considered:**

| Framework | Pros | Cons | Verdict |
|-----------|------|------|---------|
| **CrewAI** | Multi-agent orchestration | Less flexible, opinionated | ❌ Rejected |
| **AutoGPT** | Autonomous agents | Too experimental, unstable | ❌ Rejected |
| **Semantic Kernel** | Microsoft-backed, multi-language | Less mature, smaller community | ❌ Rejected |
| **LlamaIndex** | RAG-focused, good docs | Not designed for agents | ❌ Rejected (use for RAG only) |

**LangGraph Example (Calendar Agent):**

```python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint import MemorySaver
from typing import TypedDict, Literal
from datetime import datetime


class CalendarState(TypedDict):
    """State for Calendar agent."""
    user_message: str
    intent: Literal["create", "query", "update", "delete"]
    extracted_data: dict
    appointments: list[dict]
    response: str


class CalendarAgent:
    def __init__(self):
        self.graph = StateGraph(CalendarState)
        self._build_graph()
        self.checkpointer = MemorySaver()
        self.app = self.graph.compile(checkpointer=self.checkpointer)

    def _build_graph(self):
        """Build state machine graph."""
        # Add nodes (reasoning steps)
        self.graph.add_node("detect_intent", self.detect_intent)
        self.graph.add_node("extract_data", self.extract_data)
        self.graph.add_node("create_appointment", self.create_appointment)
        self.graph.add_node("query_appointments", self.query_appointments)
        self.graph.add_node("generate_response", self.generate_response)

        # Add edges
        self.graph.set_entry_point("detect_intent")
        self.graph.add_conditional_edges(
            "detect_intent",
            self.route_by_intent,
            {
                "create": "extract_data",
                "query": "query_appointments",
            }
        )
        self.graph.add_edge("extract_data", "create_appointment")
        self.graph.add_edge("create_appointment", "generate_response")
        self.graph.add_edge("query_appointments", "generate_response")
        self.graph.add_edge("generate_response", END)

    async def detect_intent(self, state: CalendarState) -> CalendarState:
        """Detect user intent using LLM."""
        prompt = f"Classify this message: {state['user_message']}"
        intent = await self.llm.complete(prompt)
        return {**state, "intent": intent}

    def route_by_intent(self, state: CalendarState) -> str:
        """Route to appropriate node based on intent."""
        return state["intent"]

    async def extract_data(self, state: CalendarState) -> CalendarState:
        """Extract structured data from user message."""
        prompt = f"Extract appointment details: {state['user_message']}"
        data = await self.llm.complete_structured(prompt)
        return {**state, "extracted_data": data}

    async def create_appointment(self, state: CalendarState) -> CalendarState:
        """Create appointment in database."""
        appointment = await self.repository.create(state["extracted_data"])
        return {**state, "appointments": [appointment]}

    async def query_appointments(self, state: CalendarState) -> CalendarState:
        """Query appointments from database."""
        appointments = await self.repository.find_by_date(datetime.now())
        return {**state, "appointments": appointments}

    async def generate_response(self, state: CalendarState) -> CalendarState:
        """Generate natural language response."""
        prompt = f"Respond to user: {state['user_message']}\nAppointments: {state['appointments']}"
        response = await self.llm.complete(prompt)
        return {**state, "response": response}

    async def invoke(self, user_message: str, session_id: str) -> str:
        """Invoke agent with user message."""
        initial_state = {
            "user_message": user_message,
            "intent": None,
            "extracted_data": {},
            "appointments": [],
            "response": ""
        }

        # Run graph with checkpointing
        result = await self.app.ainvoke(
            initial_state,
            config={"configurable": {"thread_id": session_id}}
        )

        return result["response"]
```

**LangGraph Visualization:**

```mermaid
graph TD
    Start([Start]) --> DetectIntent[Detect Intent<br/>LLM]
    DetectIntent --> RouteIntent{Route by Intent}

    RouteIntent -->|create| ExtractData[Extract Data<br/>LLM]
    RouteIntent -->|query| QueryDB[Query Appointments<br/>DB]

    ExtractData --> CreateAppt[Create Appointment<br/>DB]
    CreateAppt --> GenResponse[Generate Response<br/>LLM]
    QueryDB --> GenResponse

    GenResponse --> End([End])

    style DetectIntent fill:#90be6d
    style ExtractData fill:#90be6d
    style GenResponse fill:#90be6d
    style CreateAppt fill:#4ecdc4
    style QueryDB fill:#4ecdc4
```

**Key Points:**
- ✅ Use LangGraph for all agent reasoning
- ✅ Define explicit state machines (nodes + edges)
- ✅ Use checkpointing for multi-turn conversations
- ✅ Use streaming for long-running operations

---

## Authentication & Authorization

### Identity Provider: Auth0 / Keycloak

**Decision:** Support both **Auth0** (cloud) and **Keycloak** (self-hosted) as identity providers.

**Rationale:**

| Factor | Auth0 (Cloud) | Keycloak (Self-Hosted) |
|--------|---------------|------------------------|
| **Setup** | 5 minutes (SaaS) | 1 hour (self-host) |
| **Cost** | Free tier → $25/month | Free (infrastructure costs only) |
| **Scalability** | Auto-scales | Manual scaling |
| **Privacy** | Data in Auth0 cloud | Full control |
| **Maintenance** | Zero maintenance | Manual updates |
| **Features** | Enterprise features (SSO, MFA) | All features included |
| **Compliance** | SOC 2, GDPR | Full control |

**Use Cases:**

- **Auth0:** Free Tier, Starter Plan (ease of use)
- **Keycloak:** Pro, Enterprise, Community Edition (privacy)

**Alternatives Considered:**

| Provider | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Firebase Auth** | Easy setup, generous free tier | Google lock-in, limited self-hosting | ❌ Rejected |
| **Supabase Auth** | Open-source, self-hostable | Smaller community, PostgreSQL-only | ⚠️ Consider as alternative |
| **Ory** | Modern, cloud-native | Complex setup, smaller community | ⚠️ Consider for Cloud Edition |

**Auth0 Integration:**

```python
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> dict:
    """Verify JWT token and extract user info."""
    token = credentials.credentials

    try:
        # Verify JWT signature and expiry
        payload = jwt.decode(
            token,
            key=AUTH0_PUBLIC_KEY,
            algorithms=["RS256"],
            audience=AUTH0_AUDIENCE,
            issuer=AUTH0_ISSUER
        )

        return {
            "user_id": payload["sub"],
            "email": payload["email"],
            "tenant_id": payload["tenant_id"],
            "roles": payload.get("roles", []),
            "scopes": payload.get("scope", "").split()
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/appointments")
async def get_appointments(
    user: dict = Depends(get_current_user)
):
    """Get appointments (requires authentication)."""
    appointments = await calendar_service.get_appointments(
        user_id=user["user_id"],
        tenant_id=user["tenant_id"]
    )
    return appointments
```

**Keycloak Integration:**

```typescript
// keycloak.ts
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'fidus',
  clientId: 'fidus-web',
});

export async function initKeycloak(): Promise<void> {
  const authenticated = await keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
  });

  if (!authenticated) {
    throw new Error('Authentication failed');
  }
}

export function getAccessToken(): string {
  return keycloak.token || '';
}

export function getUserInfo(): {
  sub: string;
  email: string;
  name: string;
} {
  return keycloak.tokenParsed as any;
}
```

**Key Points:**
- ✅ Support both Auth0 and Keycloak
- ✅ Use OAuth 2.0 / OpenID Connect
- ✅ Use JWT for session tokens
- ✅ Use scope-based authorization

---

## Observability Stack

### Metrics: Prometheus

**Decision:** Use **Prometheus** for metrics collection and alerting.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Standard** | Industry standard for metrics (CNCF graduated project). |
| **Pull Model** | Prometheus scrapes /metrics endpoints (simple to implement). |
| **PromQL** | Powerful query language for metrics analysis. |
| **Alerting** | Built-in alerting (Alertmanager). |
| **Integration** | Works with Grafana, Kubernetes, Docker, etc. |
| **Self-Hosted** | Fully self-hostable (no vendor lock-in). |

**Alternatives Considered:**

| Tool | Pros | Cons | Verdict |
|------|------|------|---------|
| **Datadog** | Comprehensive, easy setup | Expensive, cloud-only | ❌ Rejected |
| **New Relic** | APM included | Expensive | ❌ Rejected |
| **InfluxDB** | Time-series optimized | Push model (more complex) | ❌ Rejected |
| **VictoriaMetrics** | Prometheus-compatible, faster | Smaller community | ⚠️ Consider for scale |

**Prometheus Metrics Example:**

```python
from prometheus_client import Counter, Histogram, Gauge, generate_latest


# Define metrics
http_requests_total = Counter(
    'fidus_http_requests_total',
    'Total HTTP requests',
    ['method', 'path', 'status']
)

http_request_duration_seconds = Histogram(
    'fidus_http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'path']
)

agent_requests_total = Counter(
    'fidus_agent_requests_total',
    'Total agent requests',
    ['agent', 'tool', 'status']
)

active_sessions = Gauge(
    'fidus_active_sessions',
    'Number of active user sessions'
)


# Middleware to track metrics
@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = time.time() - start_time

    http_requests_total.labels(
        method=request.method,
        path=request.url.path,
        status=response.status_code
    ).inc()

    http_request_duration_seconds.labels(
        method=request.method,
        path=request.url.path
    ).observe(duration)

    return response


# Metrics endpoint
@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type="text/plain")
```

**Key Points:**
- ✅ Use Prometheus for all metrics
- ✅ Expose /metrics endpoint on all services
- ✅ Use labels for dimensions (agent, status, etc.)
- ✅ Use histograms for latency (P50, P95, P99)

---

### Visualization: Grafana

**Decision:** Use **Grafana** for metrics visualization and dashboards.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Integration** | Native Prometheus integration (no configuration needed). |
| **Dashboards** | Powerful dashboard builder with templates. |
| **Alerting** | Built-in alerting (can replace Prometheus Alertmanager). |
| **Plugins** | Extensive plugin ecosystem (Loki, Tempo, etc.). |
| **Open Source** | Free, self-hostable. |

**Grafana Dashboard Example:**

```json
{
  "dashboard": {
    "title": "Fidus Overview",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(fidus_http_requests_total[5m])",
            "legendFormat": "{{method}} {{path}}"
          }
        ],
        "type": "graph"
      },
      {
        "title": "P95 Latency",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(fidus_http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "P95"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(fidus_http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ],
        "type": "graph"
      }
    ]
  }
}
```

**Key Points:**
- ✅ Use Grafana for visualization
- ✅ Create dashboards for each domain agent
- ✅ Set up alerts for critical metrics
- ✅ Use variables for multi-tenant dashboards

---

### Logging: Structured Logging (structlog)

**Decision:** Use **structlog** for structured logging in Python and **pino** in TypeScript.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Structured** | JSON logs (easy to parse and query). |
| **Context** | Attach context to all log entries (tenant_id, user_id, etc.). |
| **Performance** | Fast (structured logs are cheaper to process). |
| **Integration** | Works with ELK stack, Loki, CloudWatch, etc. |

**structlog Example:**

```python
import structlog


# Configure structlog
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()


# Usage
logger.info(
    "appointment_created",
    tenant_id="tenant-123",
    user_id="user-456",
    appointment_id="apt-789",
    title="Team Meeting"
)

# Output (JSON):
# {
#   "event": "appointment_created",
#   "level": "info",
#   "timestamp": "2025-10-27T14:30:00.000Z",
#   "tenant_id": "tenant-123",
#   "user_id": "user-456",
#   "appointment_id": "apt-789",
#   "title": "Team Meeting"
# }
```

**Key Points:**
- ✅ Use structured logging (JSON)
- ✅ Include context (tenant_id, user_id) in all logs
- ✅ Use log levels correctly (DEBUG, INFO, WARNING, ERROR)
- ✅ Never log sensitive data (passwords, tokens, PII)

---

## Deployment & Infrastructure

### Containerization: Docker

**Decision:** Use **Docker** for all services.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Standard** | Industry standard for containerization. |
| **Reproducibility** | Same environment everywhere (dev, staging, prod). |
| **Isolation** | Each service runs in its own container. |
| **Ecosystem** | Huge ecosystem (Docker Hub, Docker Compose, etc.). |

**Dockerfile Example (Backend):**

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run application
CMD ["uvicorn", "fidus.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml Example:**

```yaml
version: '3.8'

services:
  api:
    build: ./packages/api
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://fidus:fidus@postgres:5432/fidus
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  web:
    build: ./packages/web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000

  postgres:
    image: postgres:16
    environment:
      - POSTGRES_DB=fidus
      - POSTGRES_USER=fidus
      - POSTGRES_PASSWORD=fidus
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    volumes:
      - redis_data:/data

  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama

volumes:
  postgres_data:
  redis_data:
  ollama_data:
```

**Key Points:**
- ✅ Use Docker for all services
- ✅ Use multi-stage builds to reduce image size
- ✅ Use Docker Compose for local development
- ✅ Use .dockerignore to exclude unnecessary files

---

### Orchestration: Docker Compose / Kubernetes

**Decision:** Use **Docker Compose** for Community Edition and **Kubernetes** for Cloud/Enterprise.

**Rationale:**

| Edition | Orchestration | Reason |
|---------|--------------|--------|
| **Community** | Docker Compose | Simple, single-server deployment |
| **Cloud** | Kubernetes (K8s) | Multi-server, auto-scaling |
| **Enterprise** | Kubernetes (K8s) | High availability, load balancing |

**Alternatives Considered:**

| Tool | Pros | Cons | Verdict |
|------|------|------|---------|
| **Docker Swarm** | Simpler than K8s | Less feature-rich, smaller community | ❌ Rejected |
| **Nomad** | Simple, flexible | Smaller community | ⚠️ Consider for Cloud Edition |
| **ECS (AWS)** | Managed, simple | AWS lock-in | ❌ Rejected |

**Kubernetes Deployment Example:**

```yaml
# kubernetes/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fidus-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fidus-api
  template:
    metadata:
      labels:
        app: fidus-api
    spec:
      containers:
      - name: api
        image: fidus/api:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: fidus-secrets
              key: database-url
        - name: REDIS_URL
          value: redis://redis:6379
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: fidus-api
spec:
  selector:
    app: fidus-api
  ports:
  - protocol: TCP
    port: 8000
    targetPort: 8000
  type: ClusterIP
```

**Key Points:**
- ✅ Docker Compose for simple deployments
- ✅ Kubernetes for production (Cloud/Enterprise)
- ✅ Use Helm charts for K8s deployment
- ✅ Use namespaces for tenant isolation (Enterprise)

---

## Development Tools

### Monorepo: pnpm Workspaces

**Decision:** Use **pnpm workspaces** for monorepo management.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Speed** | Faster than npm/yarn (symlinks instead of copying). |
| **Disk Space** | Saves disk space (shared dependencies). |
| **Workspaces** | Native workspace support (no Lerna needed). |
| **Strict** | Enforces proper dependency declaration. |

**pnpm-workspace.yaml:**

```yaml
packages:
  - 'packages/*'
```

**package.json (Root):**

```json
{
  "name": "fidus",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "pnpm --filter @fidus/web dev",
    "build": "pnpm --recursive build",
    "test": "pnpm --recursive test",
    "lint": "pnpm --recursive lint"
  }
}
```

**Key Points:**
- ✅ Use pnpm for monorepo
- ✅ Use `--filter` to run commands in specific packages
- ✅ Use `--recursive` to run commands in all packages
- ✅ Share dependencies across packages

---

### CI/CD: GitHub Actions

**Decision:** Use **GitHub Actions** for CI/CD.

**Rationale:**

| Factor | Justification |
|--------|--------------|
| **Integration** | Native GitHub integration (no setup). |
| **Free Tier** | Generous free tier for public repos. |
| **Ecosystem** | Huge action marketplace. |
| **Flexibility** | YAML-based, flexible workflows. |

**.github/workflows/ci.yml:**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
```

**Key Points:**
- ✅ Use GitHub Actions for CI/CD
- ✅ Run lint, test, build on every PR
- ✅ Use caching to speed up builds
- ✅ Deploy automatically on main branch merge

---

## Alternative Technologies Considered

### Summary Table

| Category | Chosen Technology | Alternatives Considered | Why Alternatives Rejected |
|----------|------------------|------------------------|---------------------------|
| **Backend Language** | Python 3.11+ | TypeScript, Go, Rust | No LangGraph support, poor LLM ecosystem |
| **Frontend Framework** | Next.js 14 | Remix, SvelteKit, Vite+React | Smaller community, less mature |
| **Database** | PostgreSQL 16 | MySQL, MongoDB, CockroachDB | Less feature-rich, overkill for MVP |
| **Cache** | Redis 7.x | Memcached, Valkey, DragonflyDB | Limited features, too new |
| **Event Bus** | BullMQ + Redis Pub/Sub | RabbitMQ, Kafka, NATS | Overkill, too complex |
| **LLM Framework** | LangGraph | CrewAI, AutoGPT, Semantic Kernel | Less flexible, too experimental |
| **Local LLM** | Ollama | llama.cpp, LocalAI, vLLM | Too low-level, complex setup |
| **Cloud LLM** | OpenAI GPT-4 | Claude, Gemini, Mistral | Less mature API, more expensive |
| **Auth Provider** | Auth0 / Keycloak | Firebase, Supabase, Ory | Lock-in, smaller community |
| **Monitoring** | Prometheus + Grafana | Datadog, New Relic, InfluxDB | Expensive, vendor lock-in |
| **Container Runtime** | Docker | Podman, LXC | Less mature tooling |
| **Orchestration** | Docker Compose / K8s | Swarm, Nomad, ECS | Less feature-rich, lock-in |

---

## Technology Roadmap

### MVP (Q1 2026)

| Component | Technology | Status |
|-----------|-----------|--------|
| Backend | Python 3.11 + FastAPI | ✅ Final |
| Frontend | Next.js 14 + TypeScript | ✅ Final |
| Database | PostgreSQL 16 | ✅ Final |
| Cache | Redis 7.x | ✅ Final |
| Event Bus | BullMQ + Redis Pub/Sub | ✅ Final |
| LLM | Ollama (local) + OpenAI (cloud) | ✅ Final |
| Auth | Auth0 / Keycloak | ✅ Final |
| Deployment | Docker Compose | ✅ Final |

### Post-MVP (Q2-Q3 2026)

| Feature | Technology Candidate | Rationale |
|---------|---------------------|-----------|
| **Distributed Tracing** | OpenTelemetry + Jaeger | Better debugging for multi-agent flows |
| **Advanced Analytics** | ClickHouse | Fast analytics for usage patterns |
| **Vector Search** | Qdrant or Weaviate | Semantic search for appointments, messages |
| **Real-Time Sync** | WebSockets (Socket.io) | Real-time UI updates for multi-user |
| **Mobile App** | React Native or Flutter | Native mobile experience |
| **Plugin Marketplace** | Custom registry + sandboxing | Community-contributed agents |

### Cloud Edition (Q4 2026)

| Feature | Technology | Rationale |
|---------|-----------|-----------|
| **Orchestration** | Kubernetes | Auto-scaling, high availability |
| **Load Balancing** | Nginx or Traefik | Distribute traffic across agents |
| **Distributed LLM** | vLLM or TGI | Faster inference for cloud |
| **Multi-Region** | Kubernetes Federation | Deploy agents globally |
| **CDN** | CloudFlare or Fastly | Faster asset delivery |

---

## Conclusion

All technology decisions for Fidus have been carefully evaluated against the project's core principles: **Privacy-First**, **LLM-Driven Logic**, **Domain Isolation**, **Event-Driven Architecture**, and **Proactive Intelligence**.

### Key Decisions Summary

1. **Python + FastAPI** for backend (LLM ecosystem)
2. **TypeScript + Next.js** for frontend (type safety + performance)
3. **PostgreSQL + Redis** for data storage (mature + fast)
4. **BullMQ + Redis Pub/Sub** for event bus (reliable + fast)
5. **Ollama + OpenAI** for LLMs (privacy + quality)
6. **LangGraph** for agents (LLM-native state machines)
7. **Auth0 / Keycloak** for auth (ease of use + privacy)
8. **Prometheus + Grafana** for observability (standard + self-hosted)
9. **Docker + Kubernetes** for deployment (standard + scalable)

### Next Steps

For implementation details, see:
- [03-component-architecture.md](03-component-architecture.md) - Component designs
- [05-data-flows.md](05-data-flows.md) - Data flow patterns
- [07-security-compliance.md](07-security-compliance.md) - Security implementations

---

**Version History:**
- v1.0 (2025-10-27): Initial comprehensive technology decisions documentation

---

**End of Technology Decisions Document**
