# Responsive Design & Progressive Web App

**Version:** 1.0
**Date:** 2025-10-28
**Status:** Draft (Awaiting Human Review)
**Part of:** Fidus UX/UI Design
**Author:** AI-Generated

---

## Overview

This document defines how Fidus adapts across devices and implements Progressive Web App (PWA) capabilities.

**Foundation:** [AI-Driven UI Paradigm](00-ai-driven-ui-paradigm.md) | [Design System](05-design-system-components.md)

---

## Responsive Breakpoints

### Breakpoint System

```mermaid
graph LR
    Mobile[Mobile<br/>320-767px] --> Tablet[Tablet<br/>768-1023px]
    Tablet --> Desktop[Desktop<br/>1024-1439px]
    Desktop --> Wide[Wide Desktop<br/>1440px+]

    style Mobile fill:#ffd54f
    style Tablet fill:#90caf9
    style Desktop fill:#81c784
    style Wide fill:#e0e0e0
```

| Breakpoint | Width | Primary Device | Layout Strategy |
|------------|-------|----------------|-----------------|
| **Mobile** | 320-767px | Phones | Single column, stacked cards |
| **Tablet** | 768-1023px | Tablets | Adaptive columns, larger touch targets |
| **Desktop** | 1024-1439px | Laptops, desktops | Multi-column, full features |
| **Wide** | 1440px+ | Large monitors | Optimized spacing, max content width |

---

## Mobile-First Approach

### Design Philosophy

```mermaid
graph TB
    MobileFirst[Start: Mobile Design] --> Core[Define Core Features]
    Core --> Essential[Keep Only Essential UI]
    Essential --> Enhance[Progressively Enhance]

    Enhance --> Tablet[Tablet: Add Multi-Column]
    Tablet --> Desktop[Desktop: Add Advanced Features]
    Desktop --> Wide[Wide: Optimize Spacing]

    style MobileFirst fill:#81c784
```

**Principle:** Design for mobile first, enhance for larger screens.

---

## Component Responsiveness

### Opportunity Cards

**Mobile (320-767px):**

```
┌──────────────────────────────────┐
│ 💰 Budget Alert    🔒 Local   ✕ │  ← Full width
├──────────────────────────────────┤
│ Food: 95% spent                  │
│ 475 EUR / 500 EUR                │
│                                  │
│ 💡 3 days left in month          │
├──────────────────────────────────┤
│ [View Details]                   │  ← Stacked buttons
│ [Adjust Budget]                  │
└──────────────────────────────────┘
```

**Tablet (768-1023px):**

```
┌────────────────────────────────────────┐
│ 💰 Budget Alert        🔒 Local     ✕ │  ← 48px padding
├────────────────────────────────────────┤
│ Food Budget: 475 EUR / 500 EUR         │
│ █████████████████████░ 95%             │
│                                        │
│ 💡 3 days remaining in month           │
├────────────────────────────────────────┤
│ [View Details]  [Adjust Budget]        │  ← Side by side
└────────────────────────────────────────┘
```

**Desktop (1024px+):**

```
┌──────────────────────────────────────────┐
│ 💰 Budget Alert        🔒 Local       ✕ │
├──────────────────────────────────────────┤
│ ████████████████████░░ 95%               │
│                                          │
│ Food: 475 EUR / 500 EUR                  │
│ You've spent 95% with 3 days left.       │
│                                          │
│ 💡 You exceeded food budget in 2 of     │
│    last 3 months. Consider adjusting.    │
├──────────────────────────────────────────┤
│ [View Transactions]  Adjust Budget       │
└──────────────────────────────────────────┘
```

---

### Dashboard Layout

**Mobile: Stacked Cards**

```mermaid
graph TB
    Dashboard[Mobile Dashboard] --> Card1[Card 1<br/>Full Width]
    Card1 --> Card2[Card 2<br/>Full Width]
    Card2 --> Card3[Card 3<br/>Full Width]

    style Dashboard fill:#ffd54f
    style Card1 fill:#90caf9
    style Card2 fill:#fff176
    style Card3 fill:#ffd54f
```

**Tablet: 2-Column Grid**

```mermaid
graph TB
    Dashboard[Tablet Dashboard] --> Row1[Row 1]
    Row1 --> Card1[Card 1]
    Row1 --> Card2[Card 2]

    Dashboard --> Row2[Row 2]
    Row2 --> Card3[Card 3]
    Row2 --> Card4[Card 4]

    style Dashboard fill:#90caf9
    style Card1 fill:#81c784
    style Card2 fill:#fff176
    style Card3 fill:#ffd54f
    style Card4 fill:#90caf9
```

**Desktop: 3-Column Grid**

```mermaid
graph TB
    Dashboard[Desktop Dashboard] --> Row1[Row 1]
    Row1 --> Card1[Card 1]
    Row1 --> Card2[Card 2]
    Row1 --> Card3[Card 3]

    Dashboard --> Row2[Row 2]
    Row2 --> Card4[Card 4]
    Row2 --> Card5[Card 5]
    Row2 --> Card6[Card 6]

    style Dashboard fill:#81c784
```

---

### Forms

**Mobile: Single Column**

```
┌──────────────────────────────────┐
│ Create Budget        🔒 Local ✕  │
├──────────────────────────────────┤
│ Category *                       │
│ [Food                         ▼] │
│                                  │
│ Amount *                         │
│ [500                        EUR] │
│                                  │
│ Period *                         │
│ [● Monthly  ○ Weekly]            │
│                                  │
│ Start Date                       │
│ [Nov 1, 2024                 📅] │
├──────────────────────────────────┤
│          [Create Budget]         │  ← Full width
│             Cancel               │
└──────────────────────────────────┘
```

**Desktop: Two Column**

```
┌──────────────────────────────────────────┐
│ Create Budget              🔒 Local    ✕ │
├──────────────────────────────────────────┤
│ Category *            Amount *           │
│ [Food             ▼]  [500         EUR]  │
│                                          │
│ Period *              Start Date         │
│ [● Monthly ○ Weekly]  [Nov 1, 2024  📅]  │
├──────────────────────────────────────────┤
│              [Create Budget]             │
│                 Cancel                   │
└──────────────────────────────────────────┘
```

---

## Touch & Interaction

### Touch Targets

**Minimum touch target sizes (WCAG AA):**

```mermaid
graph LR
    Mobile[Mobile Touch Target] --> Size1[Minimum: 44x44px]
    Size1 --> Spacing[Spacing: 8px minimum]

    Desktop[Desktop Click Target] --> Size2[Minimum: 24x24px]
    Size2 --> Hover[Hover states]

    style Mobile fill:#ffd54f
    style Desktop fill:#81c784
```

| Element | Mobile | Desktop | Reasoning |
|---------|--------|---------|-----------|
| **Button** | 48px height | 40px height | Thumb-friendly vs. cursor precision |
| **Card X button** | 44x44px | 32x32px | Easy to tap vs. visual weight |
| **Swipe area** | Full card width | Not applicable | Gesture-based |
| **Form inputs** | 48px height | 40px height | Touch typing vs. keyboard |

---

### Gestures

**Mobile Gestures:**

```mermaid
graph TB
    Gestures[Mobile Gestures] --> Swipe[Swipe]
    Gestures --> Tap[Tap]
    Gestures --> LongPress[Long Press]
    Gestures --> Pull[Pull to Refresh]

    Swipe --> SwipeLeft[Swipe Left: Dismiss card]
    Swipe --> SwipeRight[Swipe Right: Dismiss card]
    Swipe --> SwipeDown[Swipe Down: Open dashboard]
    Swipe --> SwipeUp[Swipe Up: Close dashboard]

    Tap --> TapCard[Tap: Open card details]
    Tap --> TapButton[Tap: Activate button]

    LongPress --> Menu[Long Press: Context menu]

    Pull --> Refresh[Pull Down: Refresh opportunity surface]
```

**Desktop Alternatives:**

| Mobile Gesture | Desktop Equivalent |
|----------------|--------------------|
| Swipe Left/Right | Click X button |
| Swipe Down | Click Dashboard button or Cmd+D |
| Swipe Up | Click Back or Escape key |
| Long Press | Right-click |
| Pull to Refresh | Refresh button |

---

## Navigation Patterns

### Mobile Navigation

**Bottom Navigation Bar:**

```
┌────────────────────────────────┐
│                                │
│  [Main Content Area]           │
│                                │
│                                │
└────────────────────────────────┘
┌────────────────────────────────┐
│  [🏠]  [💬]  [🔔]  [⚙️]       │  ← Bottom nav
└────────────────────────────────┘
```

**Rationale:** Thumb-reachable on large phones

---

### Tablet Navigation

**Side Navigation (Optional):**

```
┌──────┬─────────────────────────┐
│ Nav  │                         │
│      │                         │
│ 🏠   │  [Main Content]         │
│ 💬   │                         │
│ 🔔   │                         │
│ ⚙️   │                         │
│      │                         │
└──────┴─────────────────────────┘
```

**Or:** Top navigation bar (more screen space)

---

### Desktop Navigation

**Top Bar + Dashboard Access:**

```
┌──────────────────────────────────────────┐
│ [Fidus Logo]        [🔔] [⚙️] [👤]      │  ← Top bar
├──────────────────────────────────────────┤
│                                          │
│  [Main Content with Dashboard Button]   │
│                                          │
└──────────────────────────────────────────┘
```

**Dashboard Always Accessible:** Swipe down (mobile), click button, or Cmd/Ctrl+D

---

## Progressive Web App (PWA)

### PWA Core Features

```mermaid
graph TB
    PWA[Progressive Web App] --> Offline[Offline Capability]
    PWA --> Install[Installable]
    PWA --> Push[Push Notifications]
    PWA --> Sync[Background Sync]
    PWA --> Shell[App Shell]

    Offline --> SW[Service Workers]
    Install --> Manifest[Web App Manifest]
    Push --> NotifAPI[Notifications API]
    Sync --> SyncAPI[Background Sync API]
    Shell --> Cache[Aggressive Caching]

    style PWA fill:#81c784
```

---

### Offline Capability

**Service Workers cache core functionality:**

```mermaid
graph TB
    UserRequest[User Request] --> SW{Service Worker<br/>Intercepts}

    SW --> CacheCheck{In Cache?}

    CacheCheck -->|Yes| FromCache[Serve from Cache<br/>Instant load]
    CacheCheck -->|No| Network{Network<br/>Available?}

    Network -->|Yes| Fetch[Fetch from Network<br/>+ Update cache]
    Network -->|No| OfflineUI[Show Offline UI<br/>Queue for sync]

    Fetch --> Return[Return to User]
    FromCache --> Return

    style FromCache fill:#81c784
    style OfflineUI fill:#ffd54f
```

**What's Cached:**
- App shell (HTML, CSS, JS)
- Core components
- Recent opportunity cards
- User's calendar (last 7 days)
- Budget data
- UI assets (icons, images)

**What Requires Network:**
- LLM queries (if local LLM unavailable)
- External service integration (Gmail, Google Calendar)
- Plugin marketplace
- Real-time updates

---

### Offline UI Indicator

**Top Banner:**

```
┌────────────────────────────────┐
│ ⚠️ Offline Mode                │
│ Some features limited.         │
│ Changes will sync when online. │
└────────────────────────────────┘
```

**Card Indication:**

```
┌──────────────────────────────────────────┐
│ 📅 Calendar               ⚠️ Offline  ✕ │
├──────────────────────────────────────────┤
│ Showing cached events (last synced 2h ago)│
│                                          │
│ Today - October 28                       │
│ • 10:00 AM - Team Standup                │
│ • 3:00 PM - Client Review                │
│                                          │
│ 💡 New events will appear when online   │
└──────────────────────────────────────────┘
```

---

### Background Sync

**Queued Actions:**

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Queue
    participant Network

    User->>App: Create calendar event (offline)
    App->>Queue: Add to sync queue
    App->>User: "✓ Event created (will sync)"

    Note over Queue: User goes online

    Queue->>Network: Sync queued actions
    Network-->>Queue: Success
    Queue->>App: Update UI
    App->>User: "✓ Event synced"
```

**Visual Feedback:**

```
┌────────────────────────────────┐
│ ✓ Event created                │
│ Will sync when online          │
│                                │
│ 2 pending actions              │
└────────────────────────────────┘
```

---

### Install to Home Screen

**Install Prompt:**

```
┌────────────────────────────────┐
│ 📱 Add Fidus to Home Screen    │
├────────────────────────────────┤
│ Get quick access and           │
│ work offline.                  │
│                                │
│ Benefits:                      │
│ • Faster loading               │
│ • Offline access               │
│ • Push notifications           │
│ • Native-like experience       │
│                                │
│          [Install]             │
│        Maybe Later             │
└────────────────────────────────┘
```

**Timing:** Show after 2-3 positive interactions (not immediately)

---

### Push Notifications

**Notification Types:**

```mermaid
graph TB
    Notifications[Push Notifications] --> Urgent[Urgent]
    Notifications --> Timely[Timely]
    Notifications --> Optional[Optional]

    Urgent --> U1[Meeting in 30 min, no alarm]
    Urgent --> U2[Double booking detected]

    Timely --> T1[Flight check-in available]
    Timely --> T2[Budget exceeded]

    Optional --> O1[Weekly summary]
    Optional --> O2[Plugin update available]

    style Urgent fill:#e57373
    style Timely fill:#fff176
    style Optional fill:#90caf9
```

**Notification UI:**

```
┌────────────────────────────────┐
│ Fidus                   now    │
│ ⚠️ Meeting in 30 Minutes       │
│                                │
│ Client Call - 2:00 PM          │
│ No alarm set • Traffic delay   │
│                                │
│ [Set Alarm]  [View Details]    │
└────────────────────────────────┘
```

**Rich Actions:** User can act directly from notification (native capability)

---

### App Shell Architecture

**Instant Loading:**

```mermaid
graph LR
    Load[User Opens App] --> Shell[App Shell<br/>< 100ms]
    Shell --> Content[Content Loads<br/>< 1 sec]

    Shell --> UI[Basic UI<br/>Header, Nav, Skeleton]
    Content --> Data[Opportunity Cards<br/>User Data]

    style Shell fill:#81c784
    style Content fill:#90caf9
```

**Skeleton Screen (Loading State):**

```
┌──────────────────────────────────────────┐
│ Fidus Logo          [🔔] [⚙️] [👤]      │
├──────────────────────────────────────────┤
│                                          │
│ ┌────────────────────────────────────┐   │
│ │ ▯▯▯▯▯▯▯▯         ▯▯▯         ✕    │   │  ← Skeleton
│ ├────────────────────────────────────┤   │     card
│ │ ▯▯▯▯▯▯▯▯▯▯▯▯▯▯                    │   │
│ │ ▯▯▯▯▯▯▯▯▯▯                        │   │
│ │                                    │   │
│ │ [▯▯▯▯▯▯▯]  ▯▯▯▯▯                  │   │
│ └────────────────────────────────────┘   │
│                                          │
│ ┌────────────────────────────────────┐   │
│ │ ▯▯▯▯▯▯▯▯         ▯▯▯         ✕    │   │
│ └────────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

**Real Content Replaces Skeletons:** Smooth transition (no jarring pop-in)

---

## Platform-Specific Adaptations

### iOS PWA

**Safe Areas:**

```css
/* Account for notch and home indicator */
.app-content {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

**iOS-Specific Features:**
- Add to Home Screen icon (180x180px)
- Splash screen
- Status bar styling
- No browser chrome when installed

---

### Android PWA

**Android-Specific Features:**
- Maskable icon (adaptive icon support)
- Notification badges
- Share target (receive shared content)
- Shortcuts (long-press app icon)

**Shortcuts:**

```json
{
  "shortcuts": [
    {
      "name": "Check Schedule",
      "url": "/schedule",
      "icons": [{ "src": "/icons/calendar.png", "sizes": "192x192" }]
    },
    {
      "name": "View Budget",
      "url": "/budget",
      "icons": [{ "src": "/icons/finance.png", "sizes": "192x192" }]
    }
  ]
}
```

---

### Desktop PWA

**Desktop Installation:**

```
┌────────────────────────────────┐
│ Install Fidus                  │
├────────────────────────────────┤
│ Install this app for:          │
│                                │
│ ✅ Faster performance          │
│ ✅ Native-like experience      │
│ ✅ Desktop notifications       │
│ ✅ Offline access              │
│                                │
│          [Install]             │
│        No Thanks               │
└────────────────────────────────┘
```

**Desktop Features:**
- Window controls (minimize, maximize, close)
- File handling (open .fidus files)
- Keyboard shortcuts (Cmd/Ctrl+D for dashboard)
- System tray integration (optional)

---

## Performance Optimization

### Lazy Loading

**Strategy:**

```mermaid
graph TB
    Init[App Initialization] --> Critical[Load Critical]
    Critical --> View[Current View]
    View --> Idle[Browser Idle]
    Idle --> PreloadNext[Preload Next Likely Views]

    Critical --> Shell[App Shell]
    Critical --> FirstCard[First Opportunity Card]

    style Critical fill:#81c784
```

**What Loads When:**

| Priority | Resources | Timing |
|----------|-----------|--------|
| **Critical** | App shell, fonts, first card | < 100ms |
| **High** | Visible cards, core JS | < 500ms |
| **Medium** | Below-fold content | < 1s |
| **Low** | Prefetch next views | When idle |

---

### Code Splitting

**By Route:**

```javascript
// Lazy load route components
const Settings = lazy(() => import('./Settings'));
const Calendar = lazy(() => import('./Calendar'));
const Finance = lazy(() => import('./Finance'));
```

**By Component Type:**

```javascript
// Load chart library only when needed
const BudgetChart = lazy(() => import('./BudgetChart'));
```

---

## Responsive Images

### Image Strategy

```mermaid
graph LR
    Image[Image Request] --> Device{Device<br/>Pixel Ratio}

    Device -->|1x| Standard[Load 1x image]
    Device -->|2x| Retina[Load 2x image]
    Device -->|3x| High[Load 3x image]

    Standard --> Format{Format<br/>Support}
    Retina --> Format
    High --> Format

    Format -->|Modern| WebP[Serve WebP]
    Format -->|Legacy| JPEG[Serve JPEG/PNG]

    style WebP fill:#81c784
```

**Markup:**

```html
<picture>
  <source
    srcset="image-320w.webp 320w, image-768w.webp 768w, image-1024w.webp 1024w"
    type="image/webp"
  />
  <img
    src="image-1024w.jpg"
    srcset="image-320w.jpg 320w, image-768w.jpg 768w, image-1024w.jpg 1024w"
    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
    alt="Budget chart"
  />
</picture>
```

---

## Deployment Editions

### Community Edition (Self-Hosted)

**PWA Focus:**
- Offline-first priority
- No cloud dependencies by default
- Install encouraged (no app store needed)
- Local sync only

---

### Cloud Edition

**Hybrid Approach:**
- Online/offline hybrid
- Cloud sync when available
- Optional native mobile apps (iOS, Android)
- PWA still primary

---

### Enterprise Edition

**Intranet PWA:**
- Custom PWA deployment on intranet
- Air-gapped mode support
- Custom service worker for enterprise proxy
- SSO integration

---

## Testing Strategy

### Device Testing Matrix

| Device Category | Test Devices | Key Tests |
|-----------------|--------------|-----------|
| **Mobile** | iPhone 12, Pixel 5 | Touch targets, gestures, offline |
| **Tablet** | iPad Air, Samsung Tab | Layout adaptation, keyboard |
| **Desktop** | Chrome, Firefox, Safari | Keyboard nav, PWA install |

---

### Responsive Testing

**Tools:**
- Browser DevTools (device emulation)
- Real device testing (BrowserStack)
- Lighthouse (PWA audit)
- WebPageTest (performance)

---

## Next Steps

Read next:
1. [08-privacy-trust-ux.md](08-privacy-trust-ux.md) - Privacy-transparent UI
2. [09-ai-llm-ux.md](09-ai-llm-ux.md) - AI-specific UX patterns
3. [11-accessibility.md](11-accessibility.md) - Accessibility guidelines

---

**End of Document**
