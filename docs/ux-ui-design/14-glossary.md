# Glossary: Fidus Terminology

**Version:** 1.0
**Date:** 2025-10-28
**Status:** Draft (Awaiting Human Review)
**Part of:** Fidus UX/UI Design
**Author:** AI-Generated

---

## Purpose

This glossary defines standard terminology used across all Fidus documentation, code, and UI. **Use these exact terms** to maintain consistency.

---

## A

### AI-Driven UI

The paradigm where the **backend LLM decides what UI to render** based on context, rather than the frontend having fixed screens. The LLM chooses between Chat, Form, Wizard, or Widget modes.

**Usage:** "Fidus uses an AI-Driven UI where the orchestrator decides whether to show a form or a chat response."

**Related:** [AI-Driven UI Paradigm](00-ai-driven-ui-paradigm.md)

---

### Aggregate

A **DDD pattern** representing a cluster of domain objects treated as a single unit for data changes. Examples: `Appointment`, `Budget`, `Trip`.

**Usage:** "The Appointment aggregate enforces conflict detection rules."

**Related:** Domain-Driven Design, Bounded Context

---

### Action Metadata

Data in API responses describing **actions users can take** (buttons, links). Includes `id`, `label`, `type` (primary/secondary/destructive), and `intent` or `endpoint`.

**Usage:** "The opportunity card includes action metadata for 'View Details' and 'Dismiss'."

**Related:** [API Response Schema](../solution-architecture/14-api-response-schema.md)

---

### Auto-Dismiss

The behavior where a UI element **removes itself AFTER a user action is completed**, NOT based on a timeout.

**Critical Distinction:**
- ✅ **Action-Based Auto-Dismiss:** Card dismisses after user clicks a button (e.g., "Reschedule appointment" → card dismissed after successful reschedule)
- ❌ **Time-Based Auto-Hide:** Card disappears after 30 seconds (NEVER used for Dashboard Opportunity Cards)

**Fidus Rule:** Dashboard Opportunity Cards are **persistent** and **user-controlled**. They ONLY dismiss when:
1. User explicitly dismisses (swipe or X button)
2. User completes an action on the card (action-based auto-dismiss)
3. Opportunity is no longer relevant (e.g., double-booking resolved → conflict card removed)

**Exception:** OS-level notifications (toasts, push notifications) MAY auto-hide after a timeout per platform conventions. These are separate from Dashboard Opportunity Cards.

**Usage:** "The card auto-dismisses after the user clicks 'Mark as Done' (action-based), NOT after sitting idle for 30 seconds (time-based)."

**Related:** Opportunity Card, Dashboard, User-Controlled

---

## B

### Breakpoints (Responsive)

Standard **responsive design breakpoints** used across all Fidus UI components.

**Standard Breakpoints:**
- **Mobile:** < 640px (`sm` in Tailwind)
- **Tablet:** 640px - 1024px (`md` to `lg` in Tailwind)
- **Desktop:** ≥ 1024px (`lg+` in Tailwind)

**Form-Specific Breakpoints:**
- **Mobile:** Single column, full-width inputs
- **Tablet:** Single column, max-width 600px
- **Desktop:** Two columns for short fields, single column for long fields

**Usage:** "The form switches to two-column layout at the desktop breakpoint (1024px)."

**Related:** Responsive Design, Mobile-First

---

### Button Labels

**Capitalization Standard:** Use **Title Case** for button labels (capitalize first letter of each major word).

**Examples:**
- ✅ "View Details", "Reschedule Meeting", "Mark as Done"
- ❌ "view details", "Reschedule meeting", "Mark As Done"

**Exceptions:**
- Short prepositions (of, in, at, by) stay lowercase: "Sign in", "Log out", "Opt in"
- Articles (a, an, the) stay lowercase: "Add to Calendar"

**Usage:** Button labels should be action-oriented and use Title Case.

**Related:** Design System, Buttons

---

### Bounded Context

A **DDD term** for a distinct area of the domain with clear boundaries. In Fidus, each domain (Calendar, Finance, Travel, etc.) is a bounded context.

**Usage:** "The Finance bounded context handles all budget and transaction logic."

**Related:** Domain-Driven Design, Domain

---

## C

### Color System

Fidus uses a **CSS variable-based color system** defined in the design system.

**Single Source of Truth:** All color values are defined ONLY in [05-design-system-components.md](05-design-system-components.md#colors). Other documents reference these via CSS variable names.

**Standard Color Variables:**
- `--color-primary` - Brand blue (#2563EB)
- `--color-secondary` - Accent purple (#7C3AED)
- `--color-success` - Green (#10B981)
- `--color-warning` - Yellow (#F59E0B)
- `--color-error` - Red (#DC2626)
- `--color-bg-primary` - Background white (#FFFFFF)
- `--color-text-primary` - Text dark (#1F2937)

**Usage:** Use CSS variable names in code, NOT hex values. Example: `color: var(--color-primary)` instead of `color: #2563EB`.

**Rationale:** Single source prevents drift and maintenance issues.

**Related:** Design System, CSS Variables

---

### Chat Mode / Conversational UI

One of four **UI modes** in the AI-Driven UI. Used for **simple informational responses** where the user asks a question and receives a text answer with optional suggestions.

**Standard Term:** Use "Chat Mode" in technical docs and code. "Conversational UI" may be used in design discussions to emphasize the interactive nature.

**Usage:** "The user asked 'What's on my calendar today?' so the system responded in Chat Mode."

**Related:** UI Mode, Form Mode, Wizard Mode, Widget Mode

---

### Component Registry

A **frontend system** that maps `componentType` strings (from UI Metadata) to actual React components. Enables dynamic rendering based on backend decisions.

**Usage:** "The Component Registry maps 'opportunity_card' to the OpportunityCard React component."

**Related:** [Frontend Architecture](../solution-architecture/13-frontend-architecture.md)

---

### Context-Aware

A core principle of Fidus: the system **adapts UI and suggestions based on user context** (time of day, location, current activity, history).

**Usage:** "Fidus is context-aware — it shows traffic alerts in the morning when you're leaving for work."

**Related:** AI-Driven UI, Opportunity Surface

---

## D

### Dashboard / Opportunity Surface

The **main screen** showing dynamic opportunity cards.

**Terminology Standard:**
- **"Dashboard"** - Use in code, technical docs, and API endpoints (e.g., `/api/dashboard`)
- **"Opportunity Surface"** - Use in UX/UI design docs to emphasize the AI-driven, dynamic nature
- **"Home" or "Home Screen"** - Use in user-facing UI (top navigation, labels)

**Example:**
- Code: `DashboardPage.tsx`, `getDashboardOpportunities()`
- Design docs: "The Opportunity Surface displays AI-selected opportunities"
- User UI: "Home" navigation button

**Rationale:** "Dashboard" is familiar to developers; "Opportunity Surface" communicates the unique AI-driven paradigm in design discussions; "Home" is intuitive for end users.

**Usage:** "The Dashboard displays relevance-scored opportunity cards."

**Related:** Opportunity Surface, Opportunity Card

---

### Domain

A **life area** that Fidus helps manage. Eight domains: Calendar, Finance, Travel, Communication, Health, Home, Shopping, Learning.

**Usage:** "Users can activate the Travel domain to get trip planning assistance."

**Related:** Bounded Context, Domain Supervisor

---

### Domain Event

An **event published** when something significant happens in a domain (e.g., `AppointmentCreated`, `BudgetExceeded`). Other domains can subscribe to these events.

**Usage:** "When BudgetExceeded is emitted, the Proactivity domain creates an opportunity card."

**Related:** Event-Driven Architecture, Proactive Trigger

---

### Domain Supervisor

The **LangGraph state machine** implementing a bounded context's logic. Each domain has its own supervisor.

**Usage:** "The Calendar Supervisor detects conflicts and suggests alternatives."

**Related:** Supervisor, Orchestration Supervisor, LangGraph

---

## E

### Empty State

UI shown when there's **no data to display**. Should be helpful (suggest actions) not just say "No data."

**Usage:** "The empty state for Calendar shows suggestions like 'Schedule your first appointment'."

**Related:** [Error & Edge States](13-error-edge-states.md)

---

### Error State

UI shown when an **error occurs**. Should explain what happened, why, and offer recovery options.

**Usage:** "The error state for calendar service failure suggests trying Finance domain instead."

**Related:** [Error & Edge States](13-error-edge-states.md)

---

### Event Bus

The **infrastructure** for publishing and subscribing to domain events. Uses Redis Pub/Sub.

**Usage:** "Domain supervisors publish events to the Event Bus."

**Related:** Domain Event, Event-Driven Architecture

---

## F

### Form Mode

One of four **UI modes** in the AI-Driven UI. Used for **quick data entry** with 1-3 fields (e.g., "Schedule appointment").

**Usage:** "The system chose Form mode because the user needs to enter only 3 fields."

**Related:** UI Mode, Chat Mode, Wizard Mode, Widget Mode

---

## H

### Happy Path

The **expected flow** where everything works correctly. Error states handle deviations from the happy path.

**Usage:** "The happy path for scheduling shows a form, but if there's a conflict, we show alternatives."

**Related:** Error State, Edge Case

---

## I

### Intent

The **user's goal** extracted from their natural language input (e.g., `CALENDAR_CREATE`, `FINANCE_QUERY`).

**Usage:** "The orchestrator detected intent CALENDAR_CREATE from 'Schedule meeting tomorrow'."

**Related:** Intent Detection, Orchestration Supervisor

---

### Intent Detection

The process of **analyzing user input** to determine what the user wants to do and which domain should handle it.

**Usage:** "Intent detection routes 'Show my budget' to the Finance supervisor."

**Related:** Intent, Orchestration Supervisor

---

## L

### LLM

**Large Language Model** — the AI model that powers Fidus's natural language understanding and decision-making. Can be Local (Llama 3.1) or Cloud (OpenAI GPT-4).

**Standard Model Names:**
- **Local:** "Llama 3.1 8B" or "Ollama" (never "Llama3", "LLama", or "Lama")
- **Cloud OpenAI:** "GPT-4" or "GPT-3.5" (never "ChatGPT", "OpenAI API")
- **Cloud Anthropic:** "Claude 3.5 Sonnet" (never "Claude-3", "Anthropic API")

**Usage:** "Fidus can run with a local LLM (Llama 3.1 8B) for maximum privacy or cloud LLM (GPT-4) for more power."

**Related:** Local AI, Cloud AI

---

### Loading State

UI shown while **waiting for data or processing**. Uses skeletons, spinners, or progress bars.

**Usage:** "Show a loading state with a skeleton screen while fetching calendar events."

**Related:** [Error & Edge States](13-error-edge-states.md)

---

### Local AI

**LLM running entirely on the user's device**. Maximum privacy, no internet required, free forever. Example: Llama 3.1 8B.

**Usage:** "With Local AI, all requests are processed on your device — nothing leaves."

**Related:** Cloud AI, LLM, Privacy

---

## M

### Multi-Tenancy

The ability to **switch between different contexts** (Personal, Work, Family). Each tenant has isolated data.

**Usage:** "Users can switch tenants to separate personal and work calendars."

**Related:** Tenant, Tenant Switcher

---

## O

### Opportunity

A **proactive suggestion or alert** that Fidus surfaces to the user based on detected patterns or triggers.

**Usage:** "Fidus detected you're over budget and created an opportunity to review spending."

**Related:** Opportunity Card, Proactive Trigger

---

### Opportunity Card

A **widget on the Dashboard** representing an opportunity. Has a title, description, relevance score, and actions.

**Usage:** "The Dashboard shows opportunity cards sorted by relevance score."

**Related:** Dashboard, Opportunity Surface, Widget Mode

---

### Opportunity Surface

**Design term** for the Dashboard. Emphasizes that it's a dynamic, LLM-curated surface of opportunities, not a static widget dashboard.

**Standard Term:** Use "Dashboard" in code, "Opportunity Surface" in design docs.

**Usage:** "The Opportunity Surface adapts throughout the day based on context."

**Related:** Dashboard, Opportunity Card

---

### Opportunity Surface Service

**Backend service** that listens to proactive triggers, scores them for relevance, creates opportunity cards, and provides API for Dashboard.

**Usage:** "The Opportunity Surface Service manages card lifecycle (create, dismiss, act upon)."

**Related:** [Frontend Architecture](../solution-architecture/13-frontend-architecture.md)

---

### Orchestration Supervisor

The **main supervisor** that handles intent detection, routing to domain supervisors, and UI decision-making.

**Usage:** "The Orchestration Supervisor routes calendar requests to the Calendar Supervisor."

**Related:** Domain Supervisor, Supervisor, UI Decision Layer

---

## P

### Proactive Trigger

An **event** indicating an opportunity detected by a domain (e.g., `BUDGET_EXCEEDED`, `DOUBLE_BOOKING`). Consumed by Proactivity domain and Opportunity Surface Service.

**Usage:** "The Finance domain emits a BUDGET_EXCEEDED proactive trigger."

**Related:** Opportunity, Domain Event, Opportunity Surface Service

---

### Proactivity Domain

A **core domain** responsible for analyzing patterns across all domains and creating opportunities.

**Usage:** "The Proactivity domain detected that you're over budget and created an alert."

**Related:** Opportunity, Proactive Trigger

---

### Privacy Badge

A **UI indicator** showing the privacy level of data or actions: 🔒 Local, ☁️ Cloud, 🔐 Encrypted.

**Usage:** "Calendar queries show a 🔒 Local privacy badge because data never leaves the device."

**Related:** Privacy Metadata, Privacy-First

---

### Privacy Metadata

Data in API responses describing **where data is processed and stored**. Includes `level` (local/cloud/encrypted), `label`, and `tooltip`.

**Usage:** "Every API response includes privacy metadata for transparency."

**Related:** Privacy Badge, [API Response Schema](../solution-architecture/14-api-response-schema.md)

---

### Privacy-First

A core principle: **user privacy is the top priority**. Local processing by default, transparent about what data goes where.

**Usage:** "Fidus is privacy-first — all calendar data stays on your device."

**Related:** Local AI, Privacy Badge, Privacy Metadata

---

## R

### Relevance Score

A **0-100 score** indicating how important an opportunity is to the user right now. Higher score = shown first on Dashboard.

**Usage:** "Budget exceeded opportunities get a relevance score of 95 (very urgent)."

**Related:** Opportunity Card, Opportunity Surface Service

---

## S

### Supervisor

A **LangGraph state machine** that manages logic for a domain or the orchestration layer. Each supervisor is autonomous.

**Usage:** "The Calendar Supervisor manages appointment logic."

**Related:** Domain Supervisor, Orchestration Supervisor, LangGraph

---

### Swipe Gestures

**Standard swipe directions** for touch interactions:

- **Swipe Right** (→): Dismiss/Archive (e.g., dismiss opportunity card)
- **Swipe Left** (←): Delete/Remove (destructive action)
- **Swipe Down** (↓): Refresh/Pull-to-refresh
- **Swipe Up** (↑): Show more details/Expand

**Usage:** "Swipe right on a card to dismiss it."

**Related:** Touch Interactions, Mobile UX

---

## T

### Tenant

A **data isolation boundary**. Users can have multiple tenants (Personal, Work, Family) with separate data.

**Usage:** "Switch to the Work tenant to see your work calendar."

**Related:** Multi-Tenancy, Tenant Switcher

---

### Tenant Switcher

A **UI component** (usually in header) allowing users to switch between tenants.

**Icon Convention:**
- **Closed State:** 👤 (profile icon alone in header)
- **Open/Active State:** 👤▾ (with dropdown arrow when clicked)

**Usage:** "Click the tenant switcher (👤) to change from Personal to Work."

**Related:** Tenant, Multi-Tenancy

---

## U

### UI Decision Layer

A **component in the Orchestration Supervisor** that analyzes context and decides what UI mode to use (Chat, Form, Wizard, Widget).

**Usage:** "The UI Decision Layer chose Wizard mode because the request requires multiple steps."

**Related:** UI Mode, [Frontend Architecture](../solution-architecture/13-frontend-architecture.md)

---

### UI Metadata

**Data in API responses** describing what UI to render. Includes `mode`, `componentType`, `props`, `actions`, `privacy`.

**Usage:** "The backend returns UI metadata telling the frontend to render a chat bubble."

**Related:** [API Response Schema](../solution-architecture/14-api-response-schema.md), UI Decision Layer

---

### UI Mode

The **type of interface** the system decides to render. Four modes: **Chat**, **Form**, **Wizard**, **Widget**.

**Usage:** "The UI mode is chosen by the UI Decision Layer based on context."

**Related:** Chat Mode, Form Mode, Wizard Mode, Widget Mode

---

## W

### WCAG 2.1 AA

**Web Content Accessibility Guidelines** level AA compliance. All Fidus UI must meet this standard (4.5:1 contrast, keyboard navigation, screen reader support).

**Usage:** "All components are tested for WCAG 2.1 AA compliance."

**Related:** Accessibility, Screen Reader

---

### Widget Mode

One of four **UI modes** in the AI-Driven UI. Used for **proactive opportunities** shown as cards on the Dashboard.

**Usage:** "Budget alerts are rendered in Widget mode as opportunity cards."

**Related:** UI Mode, Opportunity Card, Opportunity Surface

---

### Wizard Mode

One of four **UI modes** in the AI-Driven UI. Used for **complex multi-step workflows** with >3 inputs or multiple domains.

**Usage:** "Planning a trip uses Wizard mode because it requires destination, dates, budget, and preferences."

**Related:** UI Mode, Chat Mode, Form Mode, Widget Mode

---

## Term Usage Guidelines

### Preferred Terms

Use these terms consistently:

| ✅ Use This | ❌ Not This |
|------------|-------------|
| Dashboard | Home Screen, Main View |
| Opportunity Card | Widget, Notification Card |
| Chat Mode | Chat UI, Conversational Mode |
| Proactive Trigger | Opportunity Trigger, Alert Trigger |
| Domain Supervisor | Domain Agent, Domain Service |
| UI Decision Layer | UI Selector, Mode Chooser |
| Privacy Badge | Privacy Indicator, Data Badge |
| Tenant Switcher | Account Switcher, Context Switcher |
| Local AI | On-Device AI, Offline AI |
| Cloud AI | Remote AI, Online AI |

### Context-Specific Terms

Some terms vary by context:

| Context | Technical Docs | Design Docs | User-Facing UI |
|---------|---------------|-------------|----------------|
| Main screen | Dashboard | Opportunity Surface | Dashboard |
| Tenant boundary | Tenant | Context | Account |
| LLM choice | UI Decision Layer | UI Orchestration | (not shown to user) |
| Alert card | Opportunity Card | Opportunity | Notification / Alert |

---

## Cross-References

For detailed definitions, see:

- **Architecture Terms**: [Architecture Overview](../architecture/01-overview.md)
- **DDD Terms**: [Domain Model](../domain-model/README.md)
- **UI Terms**: [AI-Driven UI Paradigm](00-ai-driven-ui-paradigm.md)
- **API Terms**: [API Response Schema](../solution-architecture/14-api-response-schema.md)

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-10-28 | 1.0 | Initial glossary with 40+ terms |

---

**Document Version:** 1.0
**Authors:** Documentation Team
**Review Status:** Draft - Pending Review
**Purpose:** Standardize terminology across all Fidus documentation and code
