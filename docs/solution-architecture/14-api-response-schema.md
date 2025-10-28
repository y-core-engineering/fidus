# API Response Schema: UI Metadata Extension

**Document Status:** Draft
**Last Updated:** 2025-10-28
**Related Documents:**
- [Frontend Architecture](13-frontend-architecture.md)
- [UX/UI: AI-Driven UI Paradigm](../ux-ui-design/00-ai-driven-ui-paradigm.md)
- [Data Flows](05-data-flows.md)

---

## Table of Contents

- [Overview](#overview)
- [Response Structure](#response-structure)
- [UI Metadata Specification](#ui-metadata-specification)
- [Component Types](#component-types)
- [Action Metadata](#action-metadata)
- [Privacy Metadata](#privacy-metadata)
- [Error Responses](#error-responses)
- [Examples by Domain](#examples-by-domain)
- [Validation](#validation)

---

## Overview

This document defines the **API Response Schema** for Fidus, which extends traditional REST API responses with **UI Metadata**. This enables the **AI-Driven UI Paradigm** where the backend (LLM) decides what interface to render.

### Traditional API vs Fidus API

**Traditional API (What we DON'T do):**
```json
{
  "data": {
    "appointments": [...]
  }
}
```
Frontend decides: "I'll show this in a calendar grid"

**Fidus API (What we DO):**
```json
{
  "ui": {
    "mode": "chat",
    "componentType": "chat_bubble",
    "props": {...}
  },
  "data": {
    "appointments": [...]
  }
}
```
Backend decides: "Show this as a chat bubble with suggestions"

---

## Response Structure

### Base Response Schema

```typescript
interface OrchestrationResponse {
  // UI Metadata (NEW!)
  ui: UIMetadata;

  // Data Payload
  data: Record<string, unknown>;

  // Request Metadata
  metadata: ResponseMetadata;

  // Error (if any)
  error?: ErrorMetadata;
}
```

### UI Metadata

```typescript
interface UIMetadata {
  // UI Mode Selection
  mode: 'chat' | 'form' | 'wizard' | 'widget';

  // Component Selection
  componentType: string;

  // Component Props
  props: Record<string, unknown>;

  // Actions (buttons, links)
  actions?: ActionMetadata[];

  // Privacy Badge
  privacy?: PrivacyMetadata;

  // Accessibility
  accessibility?: AccessibilityMetadata;

  // Mode-specific metadata
  wizard?: WizardMetadata;
  widget?: WidgetMetadata;
}
```

### Response Metadata

```typescript
interface ResponseMetadata {
  // Intent Detection
  intent: string;
  confidence: number;
  domains: string[];

  // Processing
  processingTime: number;
  llmCalls: number;

  // Context
  conversationId?: string;
  turnNumber?: number;

  // Debugging (only in dev mode)
  debug?: {
    uiDecisionReason: string;
    supervisorPath: string[];
    tokensUsed: number;
  };
}
```

### Error Metadata

```typescript
interface ErrorMetadata {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  userMessage?: string;  // User-friendly error message
  recoverable: boolean;
  suggestedActions?: string[];
}
```

---

## UI Metadata Specification

### Mode: Chat

**When to use:** Simple queries, informational responses

```typescript
interface ChatUIMetadata {
  mode: 'chat';
  componentType: 'chat_bubble' | 'chat_suggestions';

  props: {
    text: string;
    suggestions?: string[];
    markdown?: boolean;
    showTimestamp?: boolean;
  };

  actions?: ActionMetadata[];
  privacy?: PrivacyMetadata;
}
```

**Example:**
```json
{
  "ui": {
    "mode": "chat",
    "componentType": "chat_bubble",
    "props": {
      "text": "You have 3 appointments today.",
      "suggestions": [
        "Show me details",
        "What's tomorrow look like?"
      ],
      "markdown": false,
      "showTimestamp": true
    },
    "privacy": {
      "level": "local",
      "label": "🔒 Local",
      "tooltip": "This data never leaves your device"
    }
  }
}
```

### Mode: Form

**When to use:** Quick data entry (1-3 fields), simple actions

```typescript
interface FormUIMetadata {
  mode: 'form';
  componentType: 'quick_form' | 'domain_form';

  props: {
    title: string;
    description?: string;
    fields: FormField[];
    submitLabel: string;
    cancelLabel?: string;
  };

  actions: ActionMetadata[];
  privacy?: PrivacyMetadata;
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'datetime' | 'select' | 'textarea' | 'checkbox';
  required: boolean;
  value?: unknown;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    errorMessage?: string;
  };
}
```

**Example:**
```json
{
  "ui": {
    "mode": "form",
    "componentType": "quick_form",
    "props": {
      "title": "Schedule Appointment",
      "description": "Fill in the details below",
      "fields": [
        {
          "id": "title",
          "label": "Title",
          "type": "text",
          "required": true,
          "placeholder": "e.g., Team meeting"
        },
        {
          "id": "startTime",
          "label": "Start Time",
          "type": "datetime",
          "required": true
        },
        {
          "id": "duration",
          "label": "Duration",
          "type": "select",
          "required": true,
          "value": "60",
          "options": [
            { "value": "30", "label": "30 minutes" },
            { "value": "60", "label": "1 hour" },
            { "value": "120", "label": "2 hours" }
          ]
        }
      ],
      "submitLabel": "Schedule"
    },
    "actions": [
      { "id": "submit", "label": "Schedule", "type": "primary" },
      { "id": "cancel", "label": "Cancel", "type": "secondary" }
    ],
    "privacy": {
      "level": "local",
      "label": "🔒 Local"
    }
  }
}
```

### Mode: Wizard

**When to use:** Multi-step processes, complex workflows

```typescript
interface WizardUIMetadata {
  mode: 'wizard';
  componentType: 'multi_step_wizard';

  props: {
    title: string;
    description?: string;
    steps: WizardStep[];
  };

  wizard: {
    currentStep: number;
    totalSteps: number;
    canGoBack: boolean;
    canSkip: boolean;
    progress?: number;  // 0-100
  };

  actions: ActionMetadata[];
  privacy?: PrivacyMetadata;
}

interface WizardStep {
  id: string;
  title: string;
  description?: string;
  fields?: FormField[];
  content?: string;  // For informational steps
}
```

**Example:**
```json
{
  "ui": {
    "mode": "wizard",
    "componentType": "multi_step_wizard",
    "props": {
      "title": "Plan Weekend Trip",
      "description": "Let's plan your perfect weekend getaway",
      "steps": [
        {
          "id": "destination",
          "title": "Choose Destination",
          "description": "Where would you like to go?",
          "fields": [
            {
              "id": "destination",
              "label": "Destination",
              "type": "text",
              "required": true
            }
          ]
        },
        {
          "id": "dates",
          "title": "Select Dates",
          "description": "When do you want to travel?",
          "fields": [
            {
              "id": "startDate",
              "label": "Start Date",
              "type": "date",
              "required": true
            },
            {
              "id": "endDate",
              "label": "End Date",
              "type": "date",
              "required": true
            }
          ]
        }
      ]
    },
    "wizard": {
      "currentStep": 1,
      "totalSteps": 4,
      "canGoBack": false,
      "canSkip": false,
      "progress": 25
    },
    "actions": [
      { "id": "next", "label": "Next", "type": "primary" },
      { "id": "cancel", "label": "Cancel", "type": "secondary" }
    ],
    "privacy": {
      "level": "cloud",
      "label": "☁️ Cloud",
      "tooltip": "Travel recommendations use cloud AI"
    }
  }
}
```

### Mode: Widget

**When to use:** Proactive suggestions, opportunity cards on dashboard

```typescript
interface WidgetUIMetadata {
  mode: 'widget';
  componentType: 'opportunity_card' | 'info_card' | 'action_card';

  props: {
    title: string;
    description: string;
    icon: string;
    variant: 'urgent' | 'important' | 'suggestion' | 'info';
  };

  widget: {
    relevanceScore: number;  // 0-100
    triggerType?: string;
    expiresAt?: string;  // ISO 8601
    dismissable: boolean;
  };

  actions: ActionMetadata[];
  privacy?: PrivacyMetadata;
}
```

**Example:**
```json
{
  "ui": {
    "mode": "widget",
    "componentType": "opportunity_card",
    "props": {
      "title": "Budget Alert: Food category exceeded",
      "description": "You've spent €1,250 of your €1,000 food budget this month.",
      "icon": "alert-circle",
      "variant": "urgent"
    },
    "widget": {
      "relevanceScore": 95,
      "triggerType": "BUDGET_EXCEEDED",
      "expiresAt": null,
      "dismissable": true
    },
    "actions": [
      {
        "id": "view_details",
        "label": "View Details",
        "type": "primary",
        "intent": "Show food budget details"
      },
      {
        "id": "adjust_budget",
        "label": "Adjust Budget",
        "type": "secondary",
        "intent": "Increase food budget to €1,500"
      }
    ],
    "privacy": {
      "level": "local",
      "label": "🔒 Local"
    }
  }
}
```

---

## Component Types

### Chat Components

| Component Type | Use Case | Props |
|---------------|----------|-------|
| `chat_bubble` | Simple text response | `text`, `suggestions`, `markdown` |
| `chat_suggestions` | Follow-up suggestions only | `suggestions` |

### Form Components

| Component Type | Use Case | Props |
|---------------|----------|-------|
| `quick_form` | Simple 1-3 field forms | `title`, `fields`, `submitLabel` |
| `domain_form` | Complex domain-specific forms | `title`, `fields`, `sections` |

### Wizard Components

| Component Type | Use Case | Props |
|---------------|----------|-------|
| `multi_step_wizard` | Multi-step workflows | `title`, `steps`, `wizard` |
| `progress_indicator` | Step progress display | `currentStep`, `totalSteps` |

### Widget Components

| Component Type | Use Case | Props |
|---------------|----------|-------|
| `opportunity_card` | Proactive opportunities | `title`, `description`, `variant` |
| `info_card` | Informational widgets | `title`, `description`, `icon` |
| `action_card` | Actionable suggestions | `title`, `description`, `actions` |

---

## Action Metadata

Actions represent buttons, links, or gestures users can perform.

```typescript
interface ActionMetadata {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'destructive' | 'link';

  // How to handle the action
  intent?: string;        // Send as new user request
  endpoint?: string;      // Direct API call (e.g., dismiss)
  params?: Record<string, unknown>;  // Parameters for API call

  // Visual
  icon?: string;
  disabled?: boolean;
  loading?: boolean;

  // Accessibility
  ariaLabel?: string;
}
```

### Action Types

| Type | Use Case | Visual Style | Example |
|------|----------|--------------|---------|
| `primary` | Main action | Yellow button | "Schedule", "Create" |
| `secondary` | Alternative action | Gray outline | "Cancel", "Skip" |
| `destructive` | Delete/remove action | Red button | "Delete", "Remove" |
| `link` | Navigate action | Text link | "Learn more", "View details" |

### Action Handling

**Intent-based action** (sends new request to orchestrator):
```json
{
  "id": "view_details",
  "label": "View Details",
  "type": "primary",
  "intent": "Show me details for the client call"
}
```

**Endpoint-based action** (direct API call):
```json
{
  "id": "dismiss",
  "label": "Dismiss",
  "type": "secondary",
  "endpoint": "/api/v1/opportunities/{opportunityId}/dismiss",
  "params": { "opportunityId": "abc123" }
}
```

---

## Privacy Metadata

Every response includes privacy information displayed as a badge.

```typescript
interface PrivacyMetadata {
  level: 'local' | 'cloud' | 'encrypted';
  label: string;
  tooltip: string;
  details?: {
    dataLocation?: string;
    encryption?: string;
    thirdParty?: boolean;
  };
}
```

### Privacy Levels

| Level | Badge | Meaning |
|-------|-------|---------|
| `local` | 🔒 Local | Data never leaves device, fully private |
| `cloud` | ☁️ Cloud | Uses cloud LLM, data encrypted in transit |
| `encrypted` | 🔐 Encrypted | End-to-end encrypted, even cloud can't read |

**Example:**
```json
{
  "privacy": {
    "level": "local",
    "label": "🔒 Local",
    "tooltip": "This data never leaves your device",
    "details": {
      "dataLocation": "Device storage only",
      "encryption": "AES-256",
      "thirdParty": false
    }
  }
}
```

---

## Error Responses

Errors also include UI metadata for proper rendering.

```typescript
interface ErrorResponse {
  ui: {
    mode: 'chat';
    componentType: 'error_message';
    props: {
      title: string;
      message: string;
      severity: 'error' | 'warning' | 'info';
      recoverable: boolean;
    };
    actions?: ActionMetadata[];
  };

  error: ErrorMetadata;

  metadata: ResponseMetadata;
}
```

**Example: Recoverable Error**
```json
{
  "ui": {
    "mode": "chat",
    "componentType": "error_message",
    "props": {
      "title": "Conflict Detected",
      "message": "You already have an appointment at 2:00 PM. Would you like to reschedule?",
      "severity": "warning",
      "recoverable": true
    },
    "actions": [
      {
        "id": "suggest_alternative",
        "label": "Suggest Alternative",
        "type": "primary",
        "intent": "Find free time slots today"
      },
      {
        "id": "force_schedule",
        "label": "Schedule Anyway",
        "type": "destructive"
      }
    ]
  },
  "error": {
    "code": "CALENDAR_CONFLICT",
    "message": "Appointment overlaps with existing appointment",
    "recoverable": true,
    "details": {
      "conflictingAppointmentId": "appt-456",
      "conflictingTitle": "Client call"
    }
  },
  "metadata": {
    "intent": "calendar_create",
    "confidence": 0.92,
    "domains": ["calendar"],
    "processingTime": 312
  }
}
```

**Example: Non-Recoverable Error**
```json
{
  "ui": {
    "mode": "chat",
    "componentType": "error_message",
    "props": {
      "title": "Service Unavailable",
      "message": "Calendar service is temporarily unavailable. Please try again in a few minutes.",
      "severity": "error",
      "recoverable": false
    }
  },
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Calendar supervisor is not responding",
    "recoverable": false
  },
  "metadata": {
    "intent": "calendar_query",
    "confidence": 0.95,
    "domains": ["calendar"],
    "processingTime": 5000
  }
}
```

---

## Examples by Domain

### Calendar Domain

**Query: "What's on my calendar today?"**

```json
{
  "ui": {
    "mode": "chat",
    "componentType": "chat_bubble",
    "props": {
      "text": "You have 3 appointments today:\n\n• 9:00 AM - Team standup (30 min)\n• 2:00 PM - Client call (1 hour)\n• 5:30 PM - Dentist (45 min)",
      "suggestions": [
        "Show me tomorrow's schedule",
        "Reschedule the dentist",
        "Add a new appointment"
      ],
      "markdown": true
    },
    "privacy": {
      "level": "local",
      "label": "🔒 Local"
    }
  },
  "data": {
    "appointments": [
      {
        "id": "1",
        "title": "Team standup",
        "startTime": "2025-10-28T09:00:00Z",
        "endTime": "2025-10-28T09:30:00Z"
      },
      {
        "id": "2",
        "title": "Client call",
        "startTime": "2025-10-28T14:00:00Z",
        "endTime": "2025-10-28T15:00:00Z"
      },
      {
        "id": "3",
        "title": "Dentist",
        "startTime": "2025-10-28T17:30:00Z",
        "endTime": "2025-10-28T18:15:00Z"
      }
    ]
  },
  "metadata": {
    "intent": "calendar_query",
    "confidence": 0.95,
    "domains": ["calendar"],
    "processingTime": 245,
    "llmCalls": 1
  }
}
```

**Action: "Schedule a meeting with John tomorrow at 10am"**

```json
{
  "ui": {
    "mode": "form",
    "componentType": "quick_form",
    "props": {
      "title": "Schedule Meeting",
      "description": "Confirm details for meeting with John",
      "fields": [
        {
          "id": "title",
          "label": "Title",
          "type": "text",
          "required": true,
          "value": "Meeting with John"
        },
        {
          "id": "startTime",
          "label": "Start Time",
          "type": "datetime",
          "required": true,
          "value": "2025-10-29T10:00:00Z"
        },
        {
          "id": "duration",
          "label": "Duration",
          "type": "select",
          "required": true,
          "value": "60",
          "options": [
            { "value": "30", "label": "30 minutes" },
            { "value": "60", "label": "1 hour" },
            { "value": "120", "label": "2 hours" }
          ]
        },
        {
          "id": "location",
          "label": "Location (optional)",
          "type": "text",
          "required": false,
          "placeholder": "e.g., Conference Room A"
        }
      ],
      "submitLabel": "Schedule"
    },
    "actions": [
      { "id": "submit", "label": "Schedule", "type": "primary" },
      { "id": "cancel", "label": "Cancel", "type": "secondary" }
    ],
    "privacy": {
      "level": "local",
      "label": "🔒 Local"
    }
  },
  "data": {},
  "metadata": {
    "intent": "calendar_create",
    "confidence": 0.92,
    "domains": ["calendar"],
    "processingTime": 312,
    "llmCalls": 2
  }
}
```

### Finance Domain

**Widget: Budget Exceeded Alert**

```json
{
  "ui": {
    "mode": "widget",
    "componentType": "opportunity_card",
    "props": {
      "title": "Budget Alert: Food category exceeded",
      "description": "You've spent €1,250 of your €1,000 food budget this month. Consider adjusting your budget or reducing spending.",
      "icon": "alert-circle",
      "variant": "urgent"
    },
    "widget": {
      "relevanceScore": 95,
      "triggerType": "BUDGET_EXCEEDED",
      "expiresAt": null,
      "dismissable": true
    },
    "actions": [
      {
        "id": "view_details",
        "label": "View Details",
        "type": "primary",
        "intent": "Show food budget details with recent transactions"
      },
      {
        "id": "adjust_budget",
        "label": "Adjust Budget",
        "type": "secondary",
        "intent": "Increase food budget to €1,500"
      },
      {
        "id": "dismiss",
        "label": "Dismiss",
        "type": "link",
        "endpoint": "/api/v1/opportunities/{id}/dismiss"
      }
    ],
    "privacy": {
      "level": "local",
      "label": "🔒 Local",
      "tooltip": "Budget data is stored locally on your device"
    }
  },
  "data": {
    "budget": {
      "id": "budget-food",
      "category": "FOOD",
      "limit": 1000,
      "spent": 1250,
      "currency": "EUR",
      "period": "monthly"
    }
  },
  "metadata": {
    "intent": "proactive_alert",
    "confidence": 1.0,
    "domains": ["finance"],
    "processingTime": 123,
    "llmCalls": 0
  }
}
```

### Travel Domain

**Wizard: Plan Weekend Trip**

```json
{
  "ui": {
    "mode": "wizard",
    "componentType": "multi_step_wizard",
    "props": {
      "title": "Plan Weekend Trip",
      "description": "Let's plan your perfect weekend getaway",
      "steps": [
        {
          "id": "destination",
          "title": "Choose Destination",
          "description": "Where would you like to go?",
          "fields": [
            {
              "id": "destination",
              "label": "Destination",
              "type": "text",
              "required": true,
              "placeholder": "e.g., Paris, Barcelona, Amsterdam"
            }
          ]
        },
        {
          "id": "dates",
          "title": "Select Dates",
          "description": "When do you want to travel?",
          "fields": [
            {
              "id": "startDate",
              "label": "Departure",
              "type": "date",
              "required": true
            },
            {
              "id": "endDate",
              "label": "Return",
              "type": "date",
              "required": true
            }
          ]
        },
        {
          "id": "budget",
          "title": "Set Budget",
          "description": "How much do you want to spend?",
          "fields": [
            {
              "id": "budget",
              "label": "Budget",
              "type": "number",
              "required": true,
              "placeholder": "e.g., 500"
            },
            {
              "id": "currency",
              "label": "Currency",
              "type": "select",
              "required": true,
              "value": "EUR",
              "options": [
                { "value": "EUR", "label": "EUR (€)" },
                { "value": "USD", "label": "USD ($)" },
                { "value": "GBP", "label": "GBP (£)" }
              ]
            }
          ]
        },
        {
          "id": "preferences",
          "title": "Preferences",
          "description": "Activities and accommodation",
          "fields": [
            {
              "id": "activities",
              "label": "Interests",
              "type": "select",
              "required": false,
              "options": [
                { "value": "culture", "label": "Culture & Museums" },
                { "value": "food", "label": "Food & Dining" },
                { "value": "nature", "label": "Nature & Outdoors" },
                { "value": "nightlife", "label": "Nightlife" }
              ]
            },
            {
              "id": "accommodation",
              "label": "Accommodation Type",
              "type": "select",
              "required": false,
              "options": [
                { "value": "hotel", "label": "Hotel" },
                { "value": "hostel", "label": "Hostel" },
                { "value": "airbnb", "label": "Airbnb" }
              ]
            }
          ]
        }
      ]
    },
    "wizard": {
      "currentStep": 1,
      "totalSteps": 4,
      "canGoBack": false,
      "canSkip": false,
      "progress": 0
    },
    "actions": [
      { "id": "next", "label": "Next", "type": "primary" },
      { "id": "cancel", "label": "Cancel", "type": "secondary" }
    ],
    "privacy": {
      "level": "cloud",
      "label": "☁️ Cloud",
      "tooltip": "Travel recommendations use cloud AI for better results"
    }
  },
  "data": {
    "currentStep": {
      "id": "destination",
      "title": "Choose Destination"
    }
  },
  "metadata": {
    "intent": "travel_plan",
    "confidence": 0.88,
    "domains": ["travel", "calendar", "finance"],
    "processingTime": 567,
    "llmCalls": 3
  }
}
```

---

## Validation

### Zod Schemas

```typescript
// packages/shared/src/schemas/ui-metadata.ts

import { z } from 'zod';

export const ActionMetadataSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['primary', 'secondary', 'destructive', 'link']),
  intent: z.string().optional(),
  endpoint: z.string().optional(),
  params: z.record(z.unknown()).optional(),
  icon: z.string().optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  ariaLabel: z.string().optional(),
});

export const PrivacyMetadataSchema = z.object({
  level: z.enum(['local', 'cloud', 'encrypted']),
  label: z.string(),
  tooltip: z.string(),
  details: z
    .object({
      dataLocation: z.string().optional(),
      encryption: z.string().optional(),
      thirdParty: z.boolean().optional(),
    })
    .optional(),
});

export const FormFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['text', 'number', 'date', 'datetime', 'select', 'textarea', 'checkbox']),
  required: z.boolean(),
  value: z.unknown().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
      errorMessage: z.string().optional(),
    })
    .optional(),
});

export const WizardMetadataSchema = z.object({
  currentStep: z.number(),
  totalSteps: z.number(),
  canGoBack: z.boolean(),
  canSkip: z.boolean(),
  progress: z.number().optional(),
});

export const WidgetMetadataSchema = z.object({
  relevanceScore: z.number().min(0).max(100),
  triggerType: z.string().optional(),
  expiresAt: z.string().optional(),
  dismissable: z.boolean(),
});

export const UIMetadataSchema = z.object({
  mode: z.enum(['chat', 'form', 'wizard', 'widget']),
  componentType: z.string(),
  props: z.record(z.unknown()),
  actions: z.array(ActionMetadataSchema).optional(),
  privacy: PrivacyMetadataSchema.optional(),
  accessibility: z
    .object({
      role: z.string().optional(),
      ariaLabel: z.string().optional(),
      ariaDescribedBy: z.string().optional(),
    })
    .optional(),
  wizard: WizardMetadataSchema.optional(),
  widget: WidgetMetadataSchema.optional(),
});

export const ResponseMetadataSchema = z.object({
  intent: z.string(),
  confidence: z.number(),
  domains: z.array(z.string()),
  processingTime: z.number(),
  llmCalls: z.number(),
  conversationId: z.string().optional(),
  turnNumber: z.number().optional(),
  debug: z
    .object({
      uiDecisionReason: z.string(),
      supervisorPath: z.array(z.string()),
      tokensUsed: z.number(),
    })
    .optional(),
});

export const ErrorMetadataSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
  userMessage: z.string().optional(),
  recoverable: z.boolean(),
  suggestedActions: z.array(z.string()).optional(),
});

export const OrchestrationResponseSchema = z.object({
  ui: UIMetadataSchema,
  data: z.record(z.unknown()),
  metadata: ResponseMetadataSchema,
  error: ErrorMetadataSchema.optional(),
});
```

### Backend Validation (Python)

```python
# packages/api/fidus/domain/orchestration/schemas.py

from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from enum import Enum


class UIMode(str, Enum):
    CHAT = "chat"
    FORM = "form"
    WIZARD = "wizard"
    WIDGET = "widget"


class ActionType(str, Enum):
    PRIMARY = "primary"
    SECONDARY = "secondary"
    DESTRUCTIVE = "destructive"
    LINK = "link"


class ActionMetadata(BaseModel):
    id: str
    label: str
    type: ActionType
    intent: Optional[str] = None
    endpoint: Optional[str] = None
    params: Optional[Dict[str, Any]] = None
    icon: Optional[str] = None
    disabled: Optional[bool] = None
    loading: Optional[bool] = None
    aria_label: Optional[str] = Field(None, alias="ariaLabel")


class PrivacyLevel(str, Enum):
    LOCAL = "local"
    CLOUD = "cloud"
    ENCRYPTED = "encrypted"


class PrivacyMetadata(BaseModel):
    level: PrivacyLevel
    label: str
    tooltip: str
    details: Optional[Dict[str, Any]] = None


class UIMetadata(BaseModel):
    mode: UIMode
    component_type: str = Field(..., alias="componentType")
    props: Dict[str, Any]
    actions: Optional[List[ActionMetadata]] = None
    privacy: Optional[PrivacyMetadata] = None
    accessibility: Optional[Dict[str, Any]] = None
    wizard: Optional[Dict[str, Any]] = None
    widget: Optional[Dict[str, Any]] = None

    class Config:
        allow_population_by_field_name = True


class ResponseMetadata(BaseModel):
    intent: str
    confidence: float
    domains: List[str]
    processing_time: int = Field(..., alias="processingTime")
    llm_calls: int = Field(..., alias="llmCalls")
    conversation_id: Optional[str] = Field(None, alias="conversationId")
    turn_number: Optional[int] = Field(None, alias="turnNumber")
    debug: Optional[Dict[str, Any]] = None

    class Config:
        allow_population_by_field_name = True


class ErrorMetadata(BaseModel):
    code: str
    message: str
    details: Optional[Dict[str, Any]] = None
    user_message: Optional[str] = Field(None, alias="userMessage")
    recoverable: bool
    suggested_actions: Optional[List[str]] = Field(None, alias="suggestedActions")

    class Config:
        allow_population_by_field_name = True


class OrchestrationResponse(BaseModel):
    ui: UIMetadata
    data: Dict[str, Any]
    metadata: ResponseMetadata
    error: Optional[ErrorMetadata] = None
```

---

## Conclusion

This API Response Schema enables the **AI-Driven UI Paradigm** by:

1. **Backend decides UI**: LLM chooses chat/form/wizard/widget based on context
2. **Frontend renders dynamically**: Component registry selects appropriate React component
3. **Type safety**: Zod (TypeScript) and Pydantic (Python) validation
4. **Privacy transparency**: Every response shows data privacy level
5. **Error recovery**: Errors include UI guidance and suggested actions

### Key Benefits

- **Consistency**: All API responses follow same structure
- **Flexibility**: Easy to add new component types and UI modes
- **Type Safety**: Full TypeScript and Python type coverage
- **Testability**: Well-defined schemas make testing easier
- **Documentation**: Schema serves as API documentation

### Next Steps

1. Implement `UIDecisionLayer` in Orchestration Supervisor
2. Update all domain supervisors to return UI metadata
3. Create frontend Component Registry
4. Write integration tests for UI decision logic

---

**Document Version:** 1.0
**Authors:** Architecture Team
**Review Status:** Draft - Pending Review
**Related PRs:** TBD
