# Design System Website Konzept

**Version:** 1.0
**Date:** 2025-01-28
**Status:** ✅ Complete
**Owner:** UX/UI Team

---

## Table of Contents

1. [Overview](#overview)
2. [Purpose & Goals](#purpose--goals)
3. [Website Structure](#website-structure)
4. [Content Organization](#content-organization)
5. [Key Features](#key-features)
6. [Technology Stack](#technology-stack)
7. [Implementation Plan](#implementation-plan)
8. [Best Practices](#best-practices)

---

## 1. Overview

The Fidus Design System Website serves as the **single source of truth** for designers and developers building Fidus interfaces. It transforms our comprehensive Markdown documentation into an interactive, searchable, and maintainable web resource.

### Inspiration

Based on analysis of **Shopify Polaris**, industry-leading design systems (Material Design, Carbon Design System, Atlassian Design System), and adapted for Fidus's unique **AI-driven UI paradigm** and **privacy-first approach**.

### Target Audiences

| Audience | Primary Needs | Key Sections |
|----------|---------------|--------------|
| **Frontend Developers** | Component APIs, code examples, props | Components, Tokens, Code Playground |
| **UX/UI Designers** | Design patterns, guidelines, Figma assets | Foundations, Patterns, Resources |
| **Product Managers** | Understanding capabilities, constraints | Getting Started, Patterns, Glossary |
| **Backend Developers** | UI Decision Layer, API contracts | Architecture, UI Decision Layer |
| **QA Engineers** | Accessibility requirements, test patterns | Accessibility, Components |

---

## 2. Purpose & Goals

### Primary Goals

1. **Discoverability** - Developers and designers can quickly find what they need
2. **Consistency** - Ensure all Fidus UIs follow the same patterns
3. **Efficiency** - Reduce time spent on UI decisions and implementation
4. **Education** - Teach the AI-driven UI paradigm and privacy-first design
5. **Maintainability** - Single source of truth, easy to update

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Search Success Rate** | > 90% | Users find what they need within 3 clicks |
| **Time to First Useful Component** | < 2 minutes | From landing to copying code |
| **Adoption Rate** | > 80% | Team members using design system website |
| **Consistency Score** | > 95% | New UIs match design system patterns |
| **Documentation Freshness** | < 1 week | Time from code change to docs update |

---

## 3. Website Structure

### Navigation Hierarchy

```
📁 Fidus Design System
│
├─ 🏠 Home
│   ├─ What's New (Changelog highlights)
│   ├─ Quick Start Cards (Designers, Developers, PMs)
│   └─ Featured Components/Patterns
│
├─ 📖 Getting Started
│   ├─ Overview
│   ├─ For Designers (Figma setup, design principles)
│   ├─ For Developers (Installation, first component)
│   ├─ Design Philosophy (AI-Driven UI, Privacy-First)
│   └─ Contributing
│
├─ 🎨 Foundations
│   ├─ AI-Driven UI Paradigm ⭐ (Unique to Fidus)
│   ├─ Privacy & Trust UX ⭐ (Unique to Fidus)
│   ├─ Colors (Color system, tokens, usage)
│   ├─ Typography (Type scale, fonts, usage)
│   ├─ Spacing (Spacing scale, layout grid)
│   ├─ Icons (Icon library, 400+ icons)
│   ├─ Motion (Animation principles, timing)
│   ├─ Accessibility (WCAG 2.1 AA guidelines)
│   └─ Responsive Design (Breakpoints, mobile-first)
│
├─ 🧩 Components
│   ├─ Actions
│   │   ├─ Button (Primary, Secondary, Tertiary, Destructive)
│   │   ├─ Link
│   │   ├─ Icon Button
│   │   └─ Button Group
│   ├─ Forms & Inputs
│   │   ├─ Text Input
│   │   ├─ Text Area
│   │   ├─ Select
│   │   ├─ Checkbox
│   │   ├─ Radio Button
│   │   ├─ Toggle Switch
│   │   ├─ Date Picker
│   │   ├─ Time Picker
│   │   └─ File Upload
│   ├─ Feedback
│   │   ├─ Toast (Success, Error, Warning, Info)
│   │   ├─ Modal
│   │   ├─ Alert
│   │   ├─ Banner
│   │   └─ Progress Bar
│   ├─ Navigation
│   │   ├─ Header
│   │   ├─ Sidebar
│   │   ├─ Tabs
│   │   ├─ Breadcrumbs
│   │   └─ Pagination
│   ├─ Layout
│   │   ├─ Container
│   │   ├─ Grid
│   │   ├─ Stack
│   │   └─ Divider
│   ├─ Cards ⭐
│   │   ├─ Opportunity Card (Unique to Fidus)
│   │   ├─ Detail Card
│   │   └─ Empty Card
│   ├─ Data Display
│   │   ├─ Table
│   │   ├─ List
│   │   ├─ Badge
│   │   ├─ Chip
│   │   └─ Avatar
│   └─ Overlays
│       ├─ Dropdown
│       ├─ Popover
│       ├─ Tooltip
│       └─ Drawer
│
├─ 📐 Patterns
│   ├─ Onboarding (8-step wizard, privacy-first)
│   ├─ Search & Filtering (AI-powered, traditional)
│   ├─ Settings Interface (9 categories, privacy report)
│   ├─ Error States (6 categories, recovery patterns)
│   ├─ Empty States (5 patterns, educational)
│   ├─ Loading States (5 patterns, timing rules)
│   ├─ Form Validation (Real-time, async, cross-field)
│   ├─ Success & Confirmation (4 patterns, undo support)
│   ├─ Multi-Tenancy (Tenant switcher, management)
│   └─ Opportunity Surface ⭐ (Dynamic dashboard, unique)
│
├─ 🎭 Tokens
│   ├─ Color Tokens (Semantic colors, CSS variables)
│   ├─ Spacing Tokens (Spacing scale, usage)
│   ├─ Typography Tokens (Type scale, line heights)
│   ├─ Shadow Tokens (Elevation system)
│   └─ Motion Tokens (Timing, easing functions)
│
├─ 🏗️ Architecture ⭐ (Unique to Fidus)
│   ├─ UI Decision Layer (LLM-based component selection)
│   ├─ UI Component Registry (Backend-Frontend bridge)
│   ├─ API Response Schema (UI metadata structure)
│   ├─ Opportunity Surface Service (Dashboard management)
│   └─ Frontend Architecture (State management, real-time)
│
├─ 📝 Content Guidelines
│   ├─ Voice & Tone (Friendly, privacy-conscious, empowering)
│   ├─ Grammar & Mechanics (Title Case, punctuation)
│   ├─ Glossary (40+ standardized terms)
│   └─ Writing for Privacy (Privacy-safe messages)
│
└─ 📚 Resources
    ├─ Figma Library (Download link, setup guide)
    ├─ Code Playground (Live component editor)
    ├─ Downloads (Icons, logos, assets)
    ├─ Changelog (Version history, updates)
    ├─ Contributing (How to contribute)
    ├─ GitHub Repository (Source code link)
    └─ Support (Discord, GitHub Discussions)
```

---

## 4. Content Organization

### Page Structure Template

Every component/pattern page follows this structure:

```markdown
# Component Name

Brief description (1-2 sentences)

## Interactive Preview
[Live component with controls]

## When to Use
- ✅ Use when...
- ❌ Don't use when...

## Variants
[Visual examples of all variants]

## Props API
[Props table with types, defaults, descriptions]

## Code Examples
[React/TypeScript examples]

## Accessibility
[WCAG compliance, keyboard nav, screen reader]

## Do's and Don'ts
[Visual examples side-by-side]

## Related Components
[Links to related components]

## Resources
[Figma link, GitHub link]
```

### Example: Button Component Page

```markdown
# Button

Buttons allow users to take actions with a single tap or click.

┌──────────────────────────────────────────────────────────┐
│  Interactive Preview                      [Copy Code]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Variant:  [Primary ▾]                                  │
│  Size:     [Medium ▾]                                   │
│  Disabled: [ ]                                          │
│  Loading:  [ ]                                          │
│                                                          │
│  ┌────────────────┐                                     │
│  │ Click Me       │                                     │
│  └────────────────┘                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘

## When to Use

✅ **Use buttons when:**
- Triggering an action (submit form, save, delete)
- Navigating to a new context (open modal, start flow)
- Primary action is clear and distinct

❌ **Don't use buttons when:**
- Navigating to a new page (use Link instead)
- Triggering inline expansion (use disclosure pattern)

## Variants

Primary          Secondary        Tertiary         Destructive
┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐
│ Save       │   │ Cancel     │   │ Learn More │   │ Delete     │
└────────────┘   └────────────┘   └────────────┘   └────────────┘

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'destructive'` | `'primary'` | Visual style |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `disabled` | `boolean` | `false` | Disables interaction |
| `loading` | `boolean` | `false` | Shows loading spinner |
| `onClick` | `() => void` | required | Click handler |
| `children` | `ReactNode` | required | Button label |

## Code Examples

```tsx
import { Button } from '@fidus/design-system';

// Primary action
<Button variant="primary" onClick={handleSave}>
  Save Changes
</Button>

// With loading state
<Button variant="primary" loading={isLoading}>
  Saving...
</Button>

// Destructive action
<Button variant="destructive" onClick={handleDelete}>
  Delete Account
</Button>
```

## Accessibility

✅ **WCAG 2.1 AA Compliant**

- **Keyboard:** `Tab` to focus, `Enter` or `Space` to activate
- **Screen Reader:** "Button, [label], [state]"
- **Focus Indicator:** 2px blue outline on focus
- **Color Contrast:** Minimum 4.5:1 (AA)

**ARIA Attributes:**
```tsx
<button
  aria-label="Save changes"
  aria-busy={isLoading}
  aria-disabled={isDisabled}
>
```

## Do's and Don'ts

✅ DO                              ❌ DON'T
┌──────────────────────┐          ┌──────────────────────┐
│ [Save Changes]       │          │ [Click Here]         │
└──────────────────────┘          └──────────────────────┘
Use action-oriented labels        Avoid vague labels

✅ DO                              ❌ DON'T
┌──────────────────────┐          ┌──────────────────────┐
│ [Delete Account]     │          │ [Delete Account]     │
│ (Destructive style)  │          │ (Primary style)      │
└──────────────────────┘          └──────────────────────┘
Use destructive for permanent     Don't use primary for
actions                           destructive actions

## Related Components

- [Icon Button](./icon-button) - Button with only an icon
- [Link](./link) - For navigation
- [Button Group](./button-group) - Multiple related actions

## Resources

- [Figma Component](https://figma.com/...)
- [GitHub Source](https://github.com/...)
- [Storybook](https://storybook.fidus.dev/...)
```

---

## 5. Key Features

### 5.1 Interactive Component Playground

**Live Preview with Controls:**

```tsx
// Component Playground Structure
┌──────────────────────────────────────────────────────────┐
│  Button                                                  │
├──────────────────────────────────────────────────────────┤
│  [Preview] [Code] [Props]                               │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Controls:                                               │
│  Variant:  [Primary ▾]                                  │
│  Size:     [Medium ▾]                                   │
│  Label:    [Save Changes                           ]    │
│  Disabled: [ ]                                          │
│  Loading:  [ ]                                          │
│                                                          │
│  Preview:                                                │
│  ┌────────────────┐                                     │
│  │ Save Changes   │                                     │
│  └────────────────┘                                     │
│                                                          │
│  [Copy JSX]  [Open in CodeSandbox]                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Implementation:**

```tsx
// Using React Live or Sandpack
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

<LiveProvider code={buttonCode} scope={{ Button }}>
  <LivePreview />
  <LiveEditor />
  <LiveError />
</LiveProvider>
```

---

### 5.2 Smart Search

**Features:**
- Full-text search across all content
- Fuzzy matching for typos
- Keyboard shortcuts (⌘K / Ctrl+K)
- Recent searches
- Suggested searches based on role

**Search UI:**

```
┌──────────────────────────────────────────────────────────┐
│  🔍 Search design system...                     ⌘K      │
└──────────────────────────────────────────────────────────┘
                    ↓ (User types "but")
┌──────────────────────────────────────────────────────────┐
│  🔍 but                                         ⌘K      │
├──────────────────────────────────────────────────────────┤
│  Components                                              │
│  → Button (Primary action component)                     │
│  → Button Group (Multiple related actions)               │
│                                                          │
│  Patterns                                                │
│  → Form Validation (Real-time validation)                │
│                                                          │
│  Tokens                                                  │
│  → Color Tokens (--color-primary)                        │
└──────────────────────────────────────────────────────────┘
```

**Implementation:**
- **Algolia DocSearch** (free for open source)
- **Fuse.js** (lightweight alternative)

---

### 5.3 Code Snippets with Copy Button

**Every code example has:**
- Syntax highlighting (Prism.js or Shiki)
- Language indicator
- Copy button
- Line numbers (optional)

```tsx
┌──────────────────────────────────────────────────────────┐
│  TypeScript                                    [Copy]   │
├──────────────────────────────────────────────────────────┤
│  1  import { Button } from '@fidus/design-system';      │
│  2                                                       │
│  3  export function MyComponent() {                     │
│  4    return (                                          │
│  5      <Button variant="primary">                      │
│  6        Click Me                                      │
│  7      </Button>                                       │
│  8    );                                                │
│  9  }                                                   │
└──────────────────────────────────────────────────────────┘
```

---

### 5.4 Responsive Preview

**Test components at different breakpoints:**

```
┌──────────────────────────────────────────────────────────┐
│  Responsive Preview                                      │
├──────────────────────────────────────────────────────────┤
│  [📱 Mobile] [📲 Tablet] [💻 Desktop] [🖥️ Large Desktop] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Preview at: 375px width                                │
│  ┌────────────────┐                                     │
│  │  [Button]      │                                     │
│  │  Full width    │                                     │
│  └────────────────┘                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### 5.5 Accessibility Checker

**Built-in accessibility validation:**

```
┌──────────────────────────────────────────────────────────┐
│  Accessibility Report                                    │
├──────────────────────────────────────────────────────────┤
│  ✅ Color Contrast: 7.2:1 (AAA)                         │
│  ✅ Keyboard Accessible                                 │
│  ✅ Screen Reader Friendly                              │
│  ✅ Focus Indicators Present                            │
│  ⚠️ Missing ARIA Label (recommended)                    │
│                                                          │
│  [Run Full A11y Audit]                                  │
└──────────────────────────────────────────────────────────┘
```

**Implementation:**
- **axe-core** for automated testing
- **Pa11y** for CI integration

---

### 5.6 Design Tokens Inspector

**View and copy design tokens:**

```
┌──────────────────────────────────────────────────────────┐
│  Color Tokens                              [Export JSON] │
├──────────────────────────────────────────────────────────┤
│  Primary                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  --color-primary          #2563EB    ████████   [Copy] │
│  --color-primary-hover    #1E40AF    ████████   [Copy] │
│  --color-primary-light    #DBEAFE    ████████   [Copy] │
│                                                          │
│  Success                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  --color-success          #10B981    ████████   [Copy] │
│  --color-success-hover    #059669    ████████   [Copy] │
│  --color-success-light    #D1FAE5    ████████   [Copy] │
└──────────────────────────────────────────────────────────┘
```

---

### 5.7 Version Selector

**Support multiple versions:**

```
┌──────────────────────────────────────────────────────────┐
│  Fidus Design System      [v2.1.0 ▾]          🌓 ☰      │
├──────────────────────────────────────────────────────────┤
│  Version Dropdown:                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  v2.1.0 (latest) ✓                                       │
│  v2.0.0                                                  │
│  v1.9.0 (deprecated)                                     │
│                                                          │
│  [View Changelog] [Migration Guide]                      │
└──────────────────────────────────────────────────────────┘
```

---

### 5.8 AI-Driven Features ⭐ (Unique to Fidus)

**AI Component Recommender:**

```
┌──────────────────────────────────────────────────────────┐
│  🤖 AI Assistant                                   [✕]  │
├──────────────────────────────────────────────────────────┤
│  You: "I need to show an urgent notification"           │
│                                                          │
│  AI: Based on your need, I recommend:                   │
│                                                          │
│  1️⃣ **OpportunityCard** (Primary)                       │
│     For urgent, actionable items on the dashboard       │
│     ├─ Props: urgency="urgent", actions=[...]          │
│     └─ [View Component] [Copy Code]                    │
│                                                          │
│  2️⃣ **Toast** (Alternative)                             │
│     For temporary notifications                         │
│     └─ [View Component]                                │
│                                                          │
│  3️⃣ **Banner** (Alternative)                            │
│     For persistent page-level alerts                    │
│     └─ [View Component]                                │
└──────────────────────────────────────────────────────────┘
```

**Implementation:**
- Use Fidus's own LLM (Ollama or GPT-4)
- Context: Current page, user role, previous searches
- Training: Design system documentation corpus

---

### 5.9 Figma Integration

**Embed Figma Components:**

```
┌──────────────────────────────────────────────────────────┐
│  Button Component                                        │
├──────────────────────────────────────────────────────────┤
│  [Code] [Design] [Tokens]                               │
├──────────────────────────────────────────────────────────┤
│  Design Tab:                                             │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  [Embedded Figma Frame showing Button variants]   │ │
│  │                                                    │ │
│  │  [Open in Figma] [Download as PNG]                │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Design Specs:                                           │
│  - Height: 40px (medium)                                 │
│  - Padding: 12px 24px                                    │
│  - Border Radius: 8px                                    │
│  - Font: Inter 14px Medium                               │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Technology Stack

### Recommended: Nextra (Next.js + MDX)

**Why Nextra:**
1. ✅ **Next.js Integration** - You already use Next.js for Fidus Web
2. ✅ **MDX Support** - Markdown + React components
3. ✅ **Auto-Navigation** - Generated from file structure
4. ✅ **Search Built-in** - Flexsearch integration
5. ✅ **Live Previews** - Import actual components
6. ✅ **Fast** - Static generation, edge-ready

### Stack Details

```typescript
// Tech Stack
{
  "framework": "Next.js 14 (App Router)",
  "theme": "Nextra Theme Docs",
  "styling": "Tailwind CSS + CSS Modules",
  "components": {
    "live-preview": "react-live or Sandpack",
    "code-highlighting": "Shiki",
    "search": "Flexsearch (built-in) or Algolia",
    "diagrams": "Mermaid.js",
    "icons": "Lucide React"
  },
  "deployment": "Vercel",
  "domain": "design.fidus.ai or polaris.fidus.ai",
  "analytics": "Vercel Analytics (privacy-friendly)",
  "monitoring": "Vercel Speed Insights"
}
```

### Alternative Options

**Option 2: Docusaurus**
- ✅ Very mature, Facebook-backed
- ✅ Versioning built-in
- ❌ React only (not MDX)
- ❌ Separate from main Next.js app

**Option 3: VitePress**
- ✅ Extremely fast
- ✅ Vue-based
- ❌ Different framework from Fidus (Next.js)

---

## 7. Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Goals:**
- Set up Nextra project
- Create basic navigation structure
- Migrate 5 key documents

**Tasks:**
1. ✅ Install Nextra in monorepo
2. ✅ Configure theme and navigation
3. ✅ Create home page
4. ✅ Migrate key docs:
   - AI-Driven UI Paradigm (00-ai-driven-ui-paradigm.md → foundations/ai-driven-ui.mdx)
   - Privacy & Trust UX (03-privacy-trust-ux.md → foundations/privacy.mdx)
   - Design System Components (05-design-system-components.md → foundations/components.mdx)
   - Interaction Patterns (04-interaction-patterns.md → patterns/interactions.mdx)
   - Glossary (14-glossary.md → resources/glossary.mdx)
5. ✅ Deploy to Vercel
6. ✅ Set up custom domain (design.fidus.ai)

**Deliverable:** Basic design system website with 5 pages, navigable structure, deployed

---

### Phase 2: Components Library (Week 3-4)

**Goals:**
- Document all core components
- Add interactive previews
- Implement code playground

**Tasks:**
1. ✅ Set up component playground (react-live)
2. ✅ Create component page template
3. ✅ Document 15 core components:
   - Button, Link, Icon Button
   - Text Input, Select, Checkbox
   - Toast, Modal, Alert
   - Opportunity Card (unique)
   - Header, Sidebar, Tabs
   - Card, Badge, Avatar
4. ✅ Add props API tables
5. ✅ Add accessibility notes
6. ✅ Add do's and don'ts

**Deliverable:** 15 documented components with live previews and code examples

---

### Phase 3: Patterns & Advanced Features (Week 5-6)

**Goals:**
- Document UX patterns
- Add advanced features (search, AI assistant)
- Create resources section

**Tasks:**
1. ✅ Migrate pattern documentation:
   - Onboarding (12-onboarding-ux.md)
   - Search (16-search-patterns.md)
   - Settings (17-settings-ui.md)
   - Error States (14-error-edge-states.md)
   - Form Validation (from 04-interaction-patterns.md)
2. ✅ Implement smart search (Flexsearch or Algolia)
3. ✅ Add design tokens inspector
4. ✅ Create Figma library download page
5. ✅ Add changelog automation
6. ⚠️ (Optional) Implement AI component recommender

**Deliverable:** Complete pattern library, search functionality, resource downloads

---

### Phase 4: Architecture & Launch (Week 7-8)

**Goals:**
- Document architecture (unique to Fidus)
- Final polish and QA
- Public launch

**Tasks:**
1. ✅ Migrate architecture docs:
   - UI Decision Layer (08-ui-decision-layer.md)
   - Frontend Architecture (13-frontend-architecture.md)
2. ✅ Create architecture diagrams (Mermaid)
3. ✅ Add contributing guide
4. ✅ QA: Check all links, test all previews
5. ✅ Performance audit (Lighthouse)
6. ✅ Accessibility audit (axe-core)
7. ✅ Public announcement (blog post, Discord)

**Deliverable:** Full design system website, publicly available at design.fidus.ai

---

## 8. Best Practices

### 8.1 Content Writing

**Voice & Tone:**
- ✅ Clear and concise (no jargon unless necessary)
- ✅ Friendly but professional
- ✅ Action-oriented (tell users what to do)
- ✅ Privacy-conscious (highlight privacy benefits)

**Structure:**
- ✅ Start with "why" (when to use)
- ✅ Show visual examples early
- ✅ Code examples after concepts
- ✅ Accessibility at the end (but prominent)

**Example:**

```markdown
❌ BAD:
"The Button component implements the ActionInterface and
supports multiple visual variants through the variant prop."

✅ GOOD:
"Buttons let users take actions with a single click. Use the
primary variant for the main action, secondary for alternatives."
```

---

### 8.2 Code Examples

**Always include:**
1. ✅ Import statement
2. ✅ Minimal working example
3. ✅ Common use cases
4. ✅ Edge cases (optional, loading, error states)

**Example:**

```tsx
// ✅ GOOD: Complete, copy-pasteable
import { Button } from '@fidus/design-system';

export function SaveButton() {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await saveData();
    setLoading(false);
  };

  return (
    <Button
      variant="primary"
      loading={loading}
      onClick={handleSave}
    >
      Save Changes
    </Button>
  );
}
```

```tsx
// ❌ BAD: Incomplete, missing context
<Button variant="primary">Save</Button>
```

---

### 8.3 Visual Examples

**Use ASCII art for quick mockups:**

```
✅ DO                              ❌ DON'T
┌──────────────────────┐          ┌──────────────────────┐
│ [Reschedule Meeting] │          │ [Click Here]         │
└──────────────────────┘          └──────────────────────┘
```

**Use screenshots for complex UIs:**
- Full page layouts
- Multi-step flows
- Interactive states (hover, focus, active)

**Use Figma embeds for design specs:**
- Component anatomy
- Spacing specifications
- Color variations

---

### 8.4 Accessibility

**Every component MUST include:**

1. ✅ **WCAG Level** (AA or AAA)
2. ✅ **Keyboard Navigation** (Tab, Enter, Escape, Arrow keys)
3. ✅ **Screen Reader Experience** (what's announced)
4. ✅ **ARIA Attributes** (if applicable)
5. ✅ **Focus Management** (where focus goes)
6. ✅ **Color Contrast** (minimum ratios)

**Template:**

```markdown
## Accessibility

✅ **WCAG 2.1 AA Compliant**

### Keyboard Navigation
- `Tab` - Move focus to button
- `Enter` or `Space` - Activate button
- `Shift+Tab` - Move focus to previous element

### Screen Reader
Announces: "Button, [label], [state if disabled/loading]"

Example: "Button, Save changes, Loading"

### ARIA Attributes
```tsx
<button
  aria-label="Save changes to profile"
  aria-busy={isLoading}
  aria-disabled={isDisabled}
>
  Save Changes
</button>
```

### Focus Indicator
- 2px blue outline (`--color-focus`)
- Minimum contrast ratio: 4.5:1

### Color Contrast
- Button text: 7.2:1 (AAA)
- Disabled state: 3.5:1 (AA)
```

---

### 8.5 Maintenance

**Keep documentation fresh:**

1. **Automated Updates:**
   - ✅ Changelog auto-generated from git commits
   - ✅ Component props extracted from TypeScript types
   - ✅ Broken link checker in CI/CD

2. **Manual Reviews:**
   - ✅ Quarterly documentation audit
   - ✅ Update examples when APIs change
   - ✅ Review feedback from users

3. **Contribution Guidelines:**
   - ✅ PRs to code must include docs updates
   - ✅ New components must have full documentation
   - ✅ Docs PRs welcome from community

---

### 8.6 Performance

**Optimization targets:**

| Metric | Target | Measurement |
|--------|--------|-------------|
| **First Contentful Paint (FCP)** | < 1s | Lighthouse |
| **Largest Contentful Paint (LCP)** | < 2.5s | Lighthouse |
| **Time to Interactive (TTI)** | < 3s | Lighthouse |
| **Total Blocking Time (TBT)** | < 300ms | Lighthouse |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Lighthouse |

**Strategies:**
- ✅ Static generation (Next.js SSG)
- ✅ Edge deployment (Vercel Edge)
- ✅ Image optimization (Next.js Image)
- ✅ Code splitting (dynamic imports)
- ✅ Font optimization (next/font)

---

### 8.7 Analytics (Privacy-Friendly)

**Track (anonymously):**
- ✅ Page views
- ✅ Search queries (aggregated)
- ✅ Most viewed components
- ✅ Copy button usage
- ✅ 404 errors

**DO NOT track:**
- ❌ User identity
- ❌ IP addresses
- ❌ Personal information
- ❌ Cross-site tracking

**Recommended:**
- **Vercel Analytics** (privacy-friendly, no cookies)
- **Plausible** (open source, GDPR compliant)
- **Umami** (self-hosted option)

---

## 9. Launch Checklist

### Pre-Launch QA

- [ ] **Content:**
  - [ ] All links work (no 404s)
  - [ ] All images load
  - [ ] All code examples run
  - [ ] Spelling/grammar check
  - [ ] Privacy policy link present

- [ ] **Functionality:**
  - [ ] Search works (finds relevant results)
  - [ ] Copy buttons work
  - [ ] Live previews load
  - [ ] Navigation is logical
  - [ ] Mobile responsive

- [ ] **Performance:**
  - [ ] Lighthouse score > 90 (all categories)
  - [ ] Page load < 3s (3G connection)
  - [ ] Images optimized
  - [ ] Fonts optimized

- [ ] **Accessibility:**
  - [ ] axe-core: 0 violations
  - [ ] Keyboard navigation works
  - [ ] Screen reader tested
  - [ ] Color contrast AA compliant
  - [ ] Focus indicators visible

- [ ] **SEO:**
  - [ ] Meta descriptions
  - [ ] Open Graph tags
  - [ ] Sitemap generated
  - [ ] robots.txt configured

- [ ] **Legal:**
  - [ ] Privacy policy
  - [ ] Cookie notice (if using cookies)
  - [ ] License information
  - [ ] Attribution for open source

### Launch Day

1. ✅ Deploy to production (design.fidus.ai)
2. ✅ DNS configured, SSL active
3. ✅ Announce on:
   - Blog post (fidus.ai/blog)
   - Discord community
   - GitHub Discussions
   - LinkedIn (company page)
4. ✅ Monitor for issues (Vercel logs, Sentry)
5. ✅ Collect feedback (Discord, GitHub Issues)

### Post-Launch (Week 1)

1. ✅ Fix reported issues
2. ✅ Add most-requested missing docs
3. ✅ Iterate on search based on queries
4. ✅ Review analytics (most viewed pages)
5. ✅ Thank contributors

---

## 10. Future Enhancements

### Phase 5: Advanced Features (Post-Launch)

**AI Component Builder:**
```
User: "I need a form for creating appointments"

AI: Generated code based on design system:
```tsx
<Form onSubmit={handleSubmit}>
  <TextInput label="Title" required />
  <DatePicker label="Date" />
  <TimePicker label="Time" />
  <TextArea label="Notes" />
  <ButtonGroup>
    <Button variant="primary" type="submit">
      Create Appointment
    </Button>
    <Button variant="secondary" onClick={onCancel}>
      Cancel
    </Button>
  </ButtonGroup>
</Form>
```
```

**Component Comparison:**
```
[Button]  vs  [Link]  vs  [Icon Button]

When to use each:
- Button: Actions that change state
- Link: Navigation to new page
- Icon Button: Space-constrained actions
```

**Accessibility Audit Tool:**
```
Upload your code → Get accessibility report
- Color contrast issues
- Missing ARIA labels
- Keyboard navigation gaps
- Screen reader issues
```

**Theme Builder:**
```
Visual theme editor:
- Adjust colors
- Preview across components
- Export as CSS variables
- Generate Figma tokens
```

---

## Related Documentation

- [05-design-system-components.md](05-design-system-components.md) - Current design system docs
- [14-glossary.md](14-glossary.md) - Terminology standards
- [13-frontend-architecture.md](13-frontend-architecture.md) - Frontend architecture
- [COMPLETION-SUMMARY.md](COMPLETION-SUMMARY.md) - Documentation completion summary

---

## Appendix: Nextra Setup Guide

### Quick Start

```bash
# Create new package in monorepo
cd packages/
mkdir design-system-docs
cd design-system-docs

# Initialize
pnpm init

# Install dependencies
pnpm add next react react-dom nextra nextra-theme-docs
pnpm add -D typescript @types/node @types/react
```

### Configuration Files

**package.json:**
```json
{
  "name": "@fidus/design-system-docs",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "nextra": "^2.13.0",
    "nextra-theme-docs": "^2.13.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

**next.config.js:**
```javascript
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx'
})

module.exports = withNextra({
  // Next.js config
})
```

**theme.config.tsx:**
```tsx
import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>Fidus Design System</span>,
  project: {
    link: 'https://github.com/y-core-engineering/fidus',
  },
  docsRepositoryBase: 'https://github.com/y-core-engineering/fidus/tree/main/packages/design-system-docs',
  footer: {
    text: '© 2025 Y-Core Consulting GmbH. Licensed under Sustainable Use License.',
  },
  darkMode: true,
  primaryHue: 210, // Blue
  navigation: {
    prev: true,
    next: true
  },
  toc: {
    backToTop: true
  }
}

export default config
```

**pages/_meta.json:**
```json
{
  "index": "Introduction",
  "getting-started": "Getting Started",
  "foundations": "Foundations",
  "components": "Components",
  "patterns": "Patterns",
  "tokens": "Tokens",
  "architecture": "Architecture",
  "resources": "Resources"
}
```

### Deploy to Vercel

```bash
# Link to Vercel
vercel link

# Deploy
vercel --prod

# Set custom domain in Vercel dashboard
# design.fidus.ai → [your-project].vercel.app
```

---

**Document Status:** ✅ Complete
**Last Review:** 2025-01-28
**Next Review:** 2025-02-28 (after Phase 1 implementation)
