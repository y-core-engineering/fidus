# Fidus UX/UI Design

**Version:** 1.0
**Date:** 2025-10-28
**Status:** Draft (Awaiting Human Review)
**Author:** AI-Generated

---

## Overview

This directory contains the complete **UX/UI Design** for Fidus - a privacy-first AI personal assistant built on an **AI-Driven UI Paradigm** where the LLM dynamically decides what interface to present based on user context.

**Critical:** Fidus does NOT use traditional fixed screens. The interface adapts contextually.

---

## Quick Start

### Must Read First

**[00-ai-driven-ui-paradigm.md](00-ai-driven-ui-paradigm.md)** - THE FOUNDATION

Explains how Fidus UI works:
- LLM decides UI form (not hardcoded)
- Dashboard = Opportunity Surface (dynamic cards)
- User controls dismissal (swipe/X, no auto-hide)
- Nothing predetermined (examples, not rules)

### Then Read

1. **[01-design-philosophy-principles.md](01-design-philosophy-principles.md)** - Core design principles
2. **[02-user-personas-journeys.md](02-user-personas-journeys.md)** - Who uses Fidus and how
3. **[03-information-architecture.md](03-information-architecture.md)** - Content organization

---

## Complete Document Set

### Foundation Documents

| Document | Lines | Status | Purpose |
|----------|-------|--------|---------|
| **00-ai-driven-ui-paradigm.md** | 826 | ✅ Complete | Foundation - paradigm explanation |
| **01-design-philosophy-principles.md** | 834 | ✅ Complete | Core design principles |
| **02-user-personas-journeys.md** | 723 | ✅ Complete | User personas & context-driven journeys |
| **03-information-architecture.md** | 478 | ✅ Complete | Contextual layers IA |

### Interaction & Pattern Documents

| Document | Lines | Status | Purpose |
|----------|-------|--------|---------|
| **04-interaction-patterns.md** | 1,887 | ✅ Complete | Core interaction patterns (4 types) |
| **05-design-system-components.md** | 1,042 | ✅ Complete | Component library & design tokens |
| **06-contextual-ui-patterns.md** | 1,263 | ✅ Complete | Situational UI for 14 domains |

### Platform & Technical Documents

| Document | Lines | Status | Purpose |
|----------|-------|--------|---------|
| **07-responsive-pwa.md** | 799 | ✅ Complete | Responsive design & PWA capabilities |
| **08-privacy-trust-ux.md** | 874 | ✅ Complete | Privacy-transparent UX patterns |
| **09-ai-llm-ux.md** | 789 | ✅ Complete | AI/LLM-specific UX patterns |
| **10-multi-tenancy-ux.md** | 816 | ✅ Complete | Multi-user/family/team/company UX |
| **11-accessibility.md** | 829 | ✅ Complete | WCAG 2.1 AA compliance guidelines |

### Navigation

| Document | Lines | Status | Purpose |
|----------|-------|--------|---------|
| **README.md** | ~140 | ✅ Complete | Navigation & overview (this file) |

---

**Total:** ~11,300 lines of comprehensive UX/UI design documentation

**Status:** ✅ **COMPLETE** - All 12 documents finished

---

## Key Design Decisions

### 1. LLM Decides UI Form

Same query → different UIs based on context:
- Budget normal → Text response
- Budget exceeded → Widget with chart
- User planning → Form with suggestions

### 2. Dashboard = Opportunity Surface

NOT static widgets. Dynamic cards based on:
- Time (morning vs evening)
- Location (home vs office)
- User history
- Supervisor signals

### 3. User Controls Dismissal

Cards stay visible until user swipes or clicks X. NO auto-hide timeout.

### 4. Nothing Predetermined

Design shows EXAMPLES ("In situation X, might show Y"), NOT RULES ("Always show X").

---

## Brand Alignment

All design aligns with [Fidus Brand Identity](../branding/fidus-brand-identity-en.md):
- **Trustworthy:** Transparency (show what system does)
- **Loyal:** Privacy-first (local processing default)
- **Reliable:** Consistent patterns
- **Discreet:** User controls visibility
- **Visual:** Yellow/Black brutalist theme

---

## Document Reading Order

**For Designers:**
1. Start with **00-ai-driven-ui-paradigm.md** (understand the foundation)
2. Read **01-design-philosophy-principles.md** (6 core principles)
3. Review **02-user-personas-journeys.md** (who uses Fidus)
4. Study **04-interaction-patterns.md** (4 core patterns)
5. Explore **06-contextual-ui-patterns.md** (14 domain examples)
6. Reference **05-design-system-components.md** (component library)

**For Developers:**
1. **00-ai-driven-ui-paradigm.md** (critical paradigm shift)
2. **04-interaction-patterns.md** (implementation patterns)
3. **05-design-system-components.md** (design tokens, components)
4. **09-ai-llm-ux.md** (LLM as UI orchestrator)
5. **07-responsive-pwa.md** (responsive & PWA implementation)

**For Accessibility Reviewers:**
1. **11-accessibility.md** (WCAG 2.1 AA compliance)
2. **05-design-system-components.md** (accessible components)
3. **04-interaction-patterns.md** (keyboard navigation)

---

## Next Steps

**Design Complete ✅ - Ready for Implementation**

1. ✅ All 12 design documents completed (~11,300 lines)
2. 🔄 Human review and feedback
3. 📋 Prototype key flows
4. 🧪 User testing with early adopters
5. 👨‍💻 Developer handoff
6. 🎨 Design system implementation (components)
7. ♿ Accessibility audit (WCAG 2.1 AA)
8. 📱 PWA implementation

---

## Questions?

- **GitHub Discussions:** https://github.com/y-core-engineering/fidus/discussions (Design category)
- **Discord:** https://discord.gg/fidus (#design channel)
- **Email:** design@fidus.ai

---

**End of README**
