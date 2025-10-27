# Domain Events

**Version:** 1.0
**Date:** 2025-10-27
**Status:** Draft

## Overview

This document defines all **Domain Events** in Fidus. Domain Events are immutable records of facts that have occurred in the domain. They are the primary mechanism for communication between Bounded Contexts.

## Principles

1. **Past Tense:** Events are named in past tense (e.g., `AppointmentCreated`, not `CreateAppointment`)
2. **Immutable:** Events cannot be changed once created
3. **Self-Contained:** Events contain all necessary information
4. **Time-Stamped:** Every event has a timestamp
5. **Causality:** Events can reference the event that caused them
6. **Versioned:** Events are versioned for backward compatibility

---

## Event Structure

### Base Domain Event

All domain events extend this base structure:

```typescript
interface DomainEvent {
  // Unique event ID
  eventId: string; // UUID

  // Event type (e.g., "AppointmentCreated")
  eventType: string;

  // Event version (for schema evolution)
  eventVersion: number;

  // When did this happen?
  occurredAt: Date;

  // Which aggregate emitted this event?
  aggregateId: string;
  aggregateType: string; // e.g., "Appointment"

  // Which user triggered this? (for audit)
  userId: string;
  tenantId: string;

  // Causation (which command caused this event?)
  causationId?: string; // ID of the command

  // Correlation (chain of related events)
  correlationId?: string; // ID to group related events

  // Event payload (specific to event type)
  payload: Record<string, any>;

  // Metadata
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    source?: string; // "web" | "mobile" | "api"
  };
}
```

### Example Event Instance

```typescript
{
  eventId: "evt_abc123",
  eventType: "AppointmentCreated",
  eventVersion: 1,
  occurredAt: "2025-10-27T14:30:00Z",
  aggregateId: "appt_xyz789",
  aggregateType: "Appointment",
  userId: "user_123",
  tenantId: "tenant_456",
  causationId: "cmd_create_appointment_001",
  correlationId: "corr_user_request_abc",
  payload: {
    title: "Team Meeting",
    startTime: "2025-10-28T10:00:00Z",
    endTime: "2025-10-28T11:00:00Z",
    location: "Conference Room A",
    participants: ["user_123", "user_456"]
  },
  metadata: {
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    source: "web"
  }
}
```

---

## Core Domain Events

### Orchestration Context

#### IntentDetected

**When:** Orchestrator detects user intent from request

```typescript
interface IntentDetected extends DomainEvent {
  eventType: 'IntentDetected';
  payload: {
    intent: string; // e.g., "CALENDAR_CREATE_APPOINTMENT"
    confidence: number; // 0.0 - 1.0
    userQuery: string; // Original user input
    detectedDomains: string[]; // ["calendar"]
    entities: Record<string, any>; // Extracted entities
  };
}
```

**Example:**
```typescript
{
  eventType: 'IntentDetected',
  payload: {
    intent: 'CALENDAR_CREATE_APPOINTMENT',
    confidence: 0.95,
    userQuery: 'Book me a meeting with John tomorrow at 2pm',
    detectedDomains: ['calendar'],
    entities: {
      participant: 'John',
      date: '2025-10-28',
      time: '14:00'
    }
  }
}
```

**Subscribers:** Audit Context

---

#### SupervisorRouted

**When:** Request routed to specific Supervisor

```typescript
interface SupervisorRouted extends DomainEvent {
  eventType: 'SupervisorRouted';
  payload: {
    supervisorId: string; // "calendar-supervisor"
    supervisorType: string; // "calendar"
    command: string; // "createAppointment"
    parameters: Record<string, any>;
  };
}
```

**Subscribers:** Audit Context

---

#### MultiDomainCoordinationStarted

**When:** Multiple Supervisors need to coordinate

```typescript
interface MultiDomainCoordinationStarted extends DomainEvent {
  eventType: 'MultiDomainCoordinationStarted';
  payload: {
    supervisors: string[]; // ["calendar", "travel"]
    coordinationStrategy: 'sequential' | 'parallel';
  };
}
```

**Subscribers:** Audit Context

---

#### OrchestrationCompleted

**When:** User request fully processed

```typescript
interface OrchestrationCompleted extends DomainEvent {
  eventType: 'OrchestrationCompleted';
  payload: {
    success: boolean;
    response: string; // Response to user
    executionTimeMs: number;
    supervisorsInvolved: string[];
  };
}
```

**Subscribers:** Audit Context, Profile Context (for learning)

---

### Proactivity Context

#### SignalDetected

**When:** A potential proactive opportunity is detected

```typescript
interface SignalDetected extends DomainEvent {
  eventType: 'SignalDetected';
  payload: {
    signalType: string; // "MISSING_ALARM" | "BUDGET_WARNING" | etc.
    confidence: number; // 0.0 - 1.0
    source: string; // Which context detected it
    context: Record<string, any>; // Contextual data
  };
}
```

**Example:**
```typescript
{
  eventType: 'SignalDetected',
  payload: {
    signalType: 'MISSING_ALARM',
    confidence: 0.88,
    source: 'proactivity-engine',
    context: {
      appointmentId: 'appt_xyz',
      appointmentTime: '2025-10-28T06:00:00Z',
      userTypicalWakeTime: '07:00'
    }
  }
}
```

**Subscribers:** Audit Context

---

#### OpportunityIdentified

**When:** Signal evaluated and deemed relevant enough to suggest

```typescript
interface OpportunityIdentified extends DomainEvent {
  eventType: 'OpportunityIdentified';
  payload: {
    opportunityType: string;
    suggestedAction: string;
    reasoning: string;
    confidence: number;
    relatedSignalId: string; // Reference to SignalDetected
  };
}
```

**Subscribers:** Orchestration Context, Audit Context

---

#### SuggestionPresented

**When:** Proactive suggestion shown to user

```typescript
interface SuggestionPresented extends DomainEvent {
  eventType: 'SuggestionPresented';
  payload: {
    suggestionId: string;
    suggestionText: string;
    opportunityId: string;
    presentedAt: Date;
  };
}
```

**Subscribers:** Audit Context

---

#### SuggestionAccepted

**When:** User accepts a proactive suggestion

```typescript
interface SuggestionAccepted extends DomainEvent {
  eventType: 'SuggestionAccepted';
  payload: {
    suggestionId: string;
    actionTaken: string; // "alarm_created" | "hotel_booked" | etc.
  };
}
```

**Subscribers:** Profile Context (learn preference), Audit Context

---

#### SuggestionDismissed

**When:** User rejects a proactive suggestion

```typescript
interface SuggestionDismissed extends DomainEvent {
  eventType: 'SuggestionDismissed';
  payload: {
    suggestionId: string;
    dismissalReason?: string; // "not_relevant" | "too_late" | etc.
  };
}
```

**Subscribers:** Profile Context (learn preference), Audit Context

---

## Supporting Domain Events

### Identity & Access Context

#### UserRegistered

```typescript
interface UserRegistered extends DomainEvent {
  eventType: 'UserRegistered';
  payload: {
    email: string;
    name: string;
    tenantId: string;
    registrationMethod: 'email' | 'oauth_google' | 'oauth_microsoft';
  };
}
```

**Subscribers:** Profile Context (create profile), Audit Context

---

#### UserAuthenticated

```typescript
interface UserAuthenticated extends DomainEvent {
  eventType: 'UserAuthenticated';
  payload: {
    authMethod: 'password' | 'oauth' | 'saml';
    sessionId: string;
  };
}
```

**Subscribers:** Audit Context

---

#### PermissionGranted

```typescript
interface PermissionGranted extends DomainEvent {
  eventType: 'PermissionGranted';
  payload: {
    targetUserId: string;
    permission: string; // "calendar.write" | "finance.read" | etc.
    grantedBy: string; // userId of admin
  };
}
```

**Subscribers:** Audit Context

---

### Profile Context

#### ProfileCreated

```typescript
interface ProfileCreated extends DomainEvent {
  eventType: 'ProfileCreated';
  payload: {
    name: string;
    timezone: string;
    language: string;
  };
}
```

**Subscribers:** Audit Context

---

#### PreferenceUpdated

```typescript
interface PreferenceUpdated extends DomainEvent {
  eventType: 'PreferenceUpdated';
  payload: {
    category: string; // "food" | "travel" | "notifications" | etc.
    key: string;
    value: any;
    isExplicit: boolean; // true = user-set, false = inferred
  };
}
```

**Subscribers:** All Domain Contexts (may adjust behavior), Audit Context

---

#### PreferenceInferred

```typescript
interface PreferenceInferred extends DomainEvent {
  eventType: 'PreferenceInferred';
  payload: {
    category: string;
    key: string;
    value: any;
    confidence: number; // 0.0 - 1.0
    inferredFrom: string; // "calendar_locations" | "transaction_patterns" | etc.
  };
}
```

**Subscribers:** Audit Context

---

### Plugin Context

#### PluginInstalled

```typescript
interface PluginInstalled extends DomainEvent {
  eventType: 'PluginInstalled';
  payload: {
    pluginId: string;
    pluginName: string;
    pluginVersion: string;
    pluginType: 'supervisor' | 'tool' | 'connector';
    installedBy: string; // userId
  };
}
```

**Subscribers:** Orchestration Context (register new supervisor), Audit Context

---

#### PluginActivated

```typescript
interface PluginActivated extends DomainEvent {
  eventType: 'PluginActivated';
  payload: {
    pluginId: string;
    pluginName: string;
  };
}
```

**Subscribers:** Orchestration Context

---

#### PluginDeactivated

```typescript
interface PluginDeactivated extends DomainEvent {
  eventType: 'PluginDeactivated';
  payload: {
    pluginId: string;
    reason?: string; // "user_request" | "dependency_missing" | "error"
  };
}
```

**Subscribers:** Orchestration Context, Audit Context

---

## Domain Context Events

### Calendar Context

#### AppointmentCreated

```typescript
interface AppointmentCreated extends DomainEvent {
  eventType: 'AppointmentCreated';
  aggregateType: 'Appointment';
  payload: {
    title: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    participants: string[]; // userIds or emails
    isRecurring: boolean;
    recurrenceRule?: string; // RFC 5545 RRULE
  };
}
```

**Subscribers:**
- Proactivity Context (check for travel needs, alarm needs)
- Travel Context (if location != home city)
- Audit Context

---

#### AppointmentUpdated

```typescript
interface AppointmentUpdated extends DomainEvent {
  eventType: 'AppointmentUpdated';
  aggregateType: 'Appointment';
  payload: {
    changes: {
      title?: string;
      startTime?: Date;
      endTime?: Date;
      location?: string;
      participants?: string[];
    };
    updatedBy: string; // userId
  };
}
```

**Subscribers:** Proactivity Context, Audit Context

---

#### AppointmentCancelled

```typescript
interface AppointmentCancelled extends DomainEvent {
  eventType: 'AppointmentCancelled';
  aggregateType: 'Appointment';
  payload: {
    reason?: string;
    cancelledBy: string; // userId
  };
}
```

**Subscribers:** Proactivity Context, Travel Context (cancel related bookings?), Audit Context

---

#### AppointmentStartsSoon

**When:** 15 minutes before appointment start

```typescript
interface AppointmentStartsSoon extends DomainEvent {
  eventType: 'AppointmentStartsSoon';
  aggregateType: 'Appointment';
  payload: {
    appointmentId: string;
    title: string;
    startTime: Date;
    location?: string;
    minutesUntilStart: number; // 15
  };
}
```

**Subscribers:** Proactivity Context (send reminder), Audit Context

---

#### ConflictDetected

**When:** Two appointments overlap

```typescript
interface ConflictDetected extends DomainEvent {
  eventType: 'ConflictDetected';
  payload: {
    appointment1Id: string;
    appointment2Id: string;
    overlapDuration: number; // minutes
  };
}
```

**Subscribers:** Proactivity Context (suggest resolution), Audit Context

---

### Finance Context

#### TransactionRecorded

```typescript
interface TransactionRecorded extends DomainEvent {
  eventType: 'TransactionRecorded';
  aggregateType: 'Transaction';
  payload: {
    amount: number;
    currency: string; // "EUR" | "USD" | etc.
    type: 'income' | 'expense' | 'transfer';
    category?: string;
    merchant?: string;
    date: Date;
    accountId: string;
  };
}
```

**Subscribers:**
- Proactivity Context (check budget)
- Shopping Context (learn patterns)
- Profile Context (infer preferences)
- Audit Context

---

#### TransactionCategorized

```typescript
interface TransactionCategorized extends DomainEvent {
  eventType: 'TransactionCategorized';
  aggregateType: 'Transaction';
  payload: {
    transactionId: string;
    category: string;
    categorizedBy: 'user' | 'ai';
    confidence?: number; // if categorized by AI
  };
}
```

**Subscribers:** Profile Context, Audit Context

---

#### BudgetCreated

```typescript
interface BudgetCreated extends DomainEvent {
  eventType: 'BudgetCreated';
  aggregateType: 'Budget';
  payload: {
    category: string;
    amount: number;
    currency: string;
    period: 'weekly' | 'monthly' | 'yearly';
    type: 'hard_limit' | 'soft_target';
  };
}
```

**Subscribers:** Proactivity Context, Audit Context

---

#### BudgetExceeded

```typescript
interface BudgetExceeded extends DomainEvent {
  eventType: 'BudgetExceeded';
  aggregateType: 'Budget';
  payload: {
    budgetId: string;
    category: string;
    budgetAmount: number;
    actualAmount: number;
    overageAmount: number;
    period: string; // "2025-10"
  };
}
```

**Subscribers:** Proactivity Context (warn user), Audit Context

---

#### BudgetNearlyExceeded

**When:** Budget reaches 80% threshold

```typescript
interface BudgetNearlyExceeded extends DomainEvent {
  eventType: 'BudgetNearlyExceeded';
  aggregateType: 'Budget';
  payload: {
    budgetId: string;
    category: string;
    budgetAmount: number;
    currentAmount: number;
    percentageUsed: number; // 80+
  };
}
```

**Subscribers:** Proactivity Context (early warning), Audit Context

---

### Travel Context

#### TripPlanned

```typescript
interface TripPlanned extends DomainEvent {
  eventType: 'TripPlanned';
  aggregateType: 'Trip';
  payload: {
    destination: string;
    startDate: Date;
    endDate: Date;
    purpose?: 'business' | 'leisure' | 'family';
  };
}
```

**Subscribers:** Calendar Context (block time), Proactivity Context, Audit Context

---

#### TripBooked

```typescript
interface TripBooked extends DomainEvent {
  eventType: 'TripBooked';
  aggregateType: 'Trip';
  payload: {
    tripId: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    bookings: {
      flight?: { confirmationNumber: string; cost: number };
      hotel?: { confirmationNumber: string; cost: number };
      car?: { confirmationNumber: string; cost: number };
    };
    totalCost: number;
    currency: string;
  };
}
```

**Subscribers:**
- Calendar Context (add to calendar)
- Finance Context (record transaction)
- Proactivity Context (packing list, check hotel)
- Audit Context

---

#### BookingConfirmed

```typescript
interface BookingConfirmed extends DomainEvent {
  eventType: 'BookingConfirmed';
  aggregateType: 'Booking';
  payload: {
    bookingType: 'flight' | 'hotel' | 'car' | 'activity';
    confirmationNumber: string;
    provider: string;
    cost: number;
    currency: string;
  };
}
```

**Subscribers:** Finance Context, Audit Context

---

#### TripStarted

**When:** Trip start date arrives

```typescript
interface TripStarted extends DomainEvent {
  eventType: 'TripStarted';
  aggregateType: 'Trip';
  payload: {
    tripId: string;
    destination: string;
  };
}
```

**Subscribers:** Proactivity Context (travel tips), Audit Context

---

#### TripCompleted

**When:** User returns from trip

```typescript
interface TripCompleted extends DomainEvent {
  eventType: 'TripCompleted';
  aggregateType: 'Trip';
  payload: {
    tripId: string;
    destination: string;
    duration: number; // days
  };
}
```

**Subscribers:** Profile Context (learn travel preferences), Audit Context

---

### Communication Context

#### MessageSent

```typescript
interface MessageSent extends DomainEvent {
  eventType: 'MessageSent';
  aggregateType: 'Message';
  payload: {
    recipients: string[]; // email addresses or user IDs
    subject?: string;
    channel: 'email' | 'sms' | 'chat';
    hasAttachments: boolean;
  };
}
```

**Subscribers:** Profile Context, Audit Context

---

#### MessageReceived

```typescript
interface MessageReceived extends DomainEvent {
  eventType: 'MessageReceived';
  aggregateType: 'Message';
  payload: {
    sender: string; // email or userId
    subject?: string;
    channel: 'email' | 'sms' | 'chat';
    priority?: 'urgent' | 'normal' | 'low';
    hasAttachments: boolean;
  };
}
```

**Subscribers:** Proactivity Context (if urgent), Audit Context

---

#### MessageRead

```typescript
interface MessageRead extends DomainEvent {
  eventType: 'MessageRead';
  aggregateType: 'Message';
  payload: {
    messageId: string;
    readAt: Date;
  };
}
```

**Subscribers:** Audit Context

---

#### ContactAdded

```typescript
interface ContactAdded extends DomainEvent {
  eventType: 'ContactAdded';
  aggregateType: 'Contact';
  payload: {
    name: string;
    emailAddresses: string[];
    phoneNumbers?: string[];
    organization?: string;
  };
}
```

**Subscribers:** Audit Context

---

### Health Context

#### ActivityRecorded

```typescript
interface ActivityRecorded extends DomainEvent {
  eventType: 'ActivityRecorded';
  aggregateType: 'HealthActivity';
  payload: {
    activityType: 'run' | 'walk' | 'bike' | 'swim' | 'workout';
    duration: number; // minutes
    distance?: number; // km
    caloriesBurned?: number;
    timestamp: Date;
  };
}
```

**Subscribers:** Profile Context, Proactivity Context, Audit Context

---

#### VitalRecorded

```typescript
interface VitalRecorded extends DomainEvent {
  eventType: 'VitalRecorded';
  aggregateType: 'Vital';
  payload: {
    vitalType: 'heart_rate' | 'weight' | 'blood_pressure' | 'sleep';
    value: number | Record<string, number>; // e.g., { systolic: 120, diastolic: 80 }
    unit: string;
    timestamp: Date;
  };
}
```

**Subscribers:** Proactivity Context (health trends), Audit Context

---

#### GoalAchieved

```typescript
interface GoalAchieved extends DomainEvent {
  eventType: 'GoalAchieved';
  aggregateType: 'HealthGoal';
  payload: {
    goalType: string; // "weekly_run_distance" | "daily_steps" | etc.
    targetValue: number;
    actualValue: number;
    achievedAt: Date;
  };
}
```

**Subscribers:** Proactivity Context (congratulate user), Audit Context

---

### Home Context

#### DeviceStateChanged

```typescript
interface DeviceStateChanged extends DomainEvent {
  eventType: 'DeviceStateChanged';
  aggregateType: 'HomeDevice';
  payload: {
    deviceId: string;
    deviceType: 'light' | 'thermostat' | 'lock' | 'camera' | 'speaker';
    previousState: any;
    newState: any;
    triggeredBy: 'user' | 'automation' | 'schedule';
  };
}
```

**Subscribers:** Proactivity Context, Audit Context

---

#### AutomationTriggered

```typescript
interface AutomationTriggered extends DomainEvent {
  eventType: 'AutomationTriggered';
  aggregateType: 'Automation';
  payload: {
    automationId: string;
    automationName: string;
    trigger: string; // "sunset" | "user_left_home" | etc.
    actionsExecuted: string[];
  };
}
```

**Subscribers:** Audit Context

---

### Shopping Context

#### ListCreated

```typescript
interface ListCreated extends DomainEvent {
  eventType: 'ListCreated';
  aggregateType: 'ShoppingList';
  payload: {
    listName: string;
    category?: 'groceries' | 'household' | 'other';
  };
}
```

**Subscribers:** Audit Context

---

#### ItemAdded

```typescript
interface ItemAdded extends DomainEvent {
  eventType: 'ItemAdded';
  aggregateType: 'ShoppingList';
  payload: {
    listId: string;
    itemName: string;
    quantity?: number;
    category?: string;
  };
}
```

**Subscribers:** Profile Context (learn shopping patterns), Audit Context

---

#### ItemPurchased

```typescript
interface ItemPurchased extends DomainEvent {
  eventType: 'ItemPurchased';
  aggregateType: 'ShoppingList';
  payload: {
    listId: string;
    itemId: string;
    itemName: string;
    purchasedAt: Date;
    price?: number;
    store?: string;
  };
}
```

**Subscribers:** Finance Context (if price provided), Audit Context

---

### Learning Context

#### CourseStarted

```typescript
interface CourseStarted extends DomainEvent {
  eventType: 'CourseStarted';
  aggregateType: 'Course';
  payload: {
    courseId: string;
    courseName: string;
    platform: string; // "Coursera" | "Udemy" | etc.
    estimatedDuration: number; // hours
    deadline?: Date;
  };
}
```

**Subscribers:** Calendar Context (block study time), Proactivity Context, Audit Context

---

#### CourseCompleted

```typescript
interface CourseCompleted extends DomainEvent {
  eventType: 'CourseCompleted';
  aggregateType: 'Course';
  payload: {
    courseId: string;
    courseName: string;
    completedAt: Date;
    certificateEarned: boolean;
  };
}
```

**Subscribers:** Proactivity Context (congratulate), Profile Context, Audit Context

---

#### ProgressMade

```typescript
interface ProgressMade extends DomainEvent {
  eventType: 'ProgressMade';
  aggregateType: 'Course';
  payload: {
    courseId: string;
    percentComplete: number;
    lessonsCompleted: number;
    totalLessons: number;
  };
}
```

**Subscribers:** Proactivity Context (encourage), Audit Context

---

## Event Versioning

As the system evolves, event schemas change. We use versioning to maintain backward compatibility.

### Version Strategy

```typescript
// Version 1
interface AppointmentCreated_v1 extends DomainEvent {
  eventVersion: 1;
  payload: {
    title: string;
    startTime: Date;
    endTime: Date;
  };
}

// Version 2 (added location)
interface AppointmentCreated_v2 extends DomainEvent {
  eventVersion: 2;
  payload: {
    title: string;
    startTime: Date;
    endTime: Date;
    location?: string; // NEW FIELD (optional for backward compatibility)
  };
}
```

### Upcasting

Subscribers can upcast old events to new version:

```typescript
class AppointmentEventHandler {
  handle(event: DomainEvent) {
    // Upcast if needed
    const currentEvent = this.upcast(event);

    // Now handle with current schema
    this.processAppointmentCreated(currentEvent);
  }

  private upcast(event: DomainEvent): AppointmentCreated_v2 {
    if (event.eventVersion === 1) {
      // Convert v1 to v2
      return {
        ...event,
        eventVersion: 2,
        payload: {
          ...event.payload,
          location: undefined // Default for missing field
        }
      };
    }
    return event as AppointmentCreated_v2;
  }
}
```

---

## Event Sourcing (Optional)

For critical aggregates, we can use **Event Sourcing** - storing events as the source of truth instead of current state.

### Example: Appointment Aggregate

```typescript
class Appointment {
  private id: string;
  private title: string;
  private startTime: Date;
  private endTime: Date;
  private changes: DomainEvent[] = [];

  // Reconstruct from events
  static fromEvents(events: DomainEvent[]): Appointment {
    const appointment = new Appointment();
    events.forEach(event => appointment.apply(event));
    return appointment;
  }

  // Apply event to rebuild state
  private apply(event: DomainEvent) {
    switch (event.eventType) {
      case 'AppointmentCreated':
        this.id = event.aggregateId;
        this.title = event.payload.title;
        this.startTime = new Date(event.payload.startTime);
        this.endTime = new Date(event.payload.endTime);
        break;

      case 'AppointmentUpdated':
        if (event.payload.changes.title) {
          this.title = event.payload.changes.title;
        }
        if (event.payload.changes.startTime) {
          this.startTime = new Date(event.payload.changes.startTime);
        }
        break;

      case 'AppointmentCancelled':
        // Mark as cancelled
        break;
    }
  }

  // Command: Update appointment
  update(changes: Partial<AppointmentData>): DomainEvent {
    const event: AppointmentUpdated = {
      eventId: generateId(),
      eventType: 'AppointmentUpdated',
      eventVersion: 1,
      occurredAt: new Date(),
      aggregateId: this.id,
      aggregateType: 'Appointment',
      userId: getCurrentUserId(),
      tenantId: getCurrentTenantId(),
      payload: { changes }
    };

    this.apply(event); // Update state
    this.changes.push(event); // Track for persistence

    return event;
  }

  // Get uncommitted changes
  getUncommittedChanges(): DomainEvent[] {
    return this.changes;
  }

  // Clear after saving
  markChangesAsCommitted() {
    this.changes = [];
  }
}
```

---

## Event Store

Events are stored in an append-only log (Event Store).

### Schema

```sql
CREATE TABLE event_store (
  event_id UUID PRIMARY KEY,
  event_type VARCHAR(255) NOT NULL,
  event_version INTEGER NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  aggregate_id VARCHAR(255) NOT NULL,
  aggregate_type VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  causation_id UUID,
  correlation_id UUID,
  payload JSONB NOT NULL,
  metadata JSONB,

  -- Indexing
  INDEX idx_aggregate (aggregate_id, aggregate_type),
  INDEX idx_occurred_at (occurred_at),
  INDEX idx_tenant (tenant_id),
  INDEX idx_event_type (event_type)
);
```

### Querying Events

```typescript
// Get all events for an aggregate
const events = await db.query(
  'SELECT * FROM event_store WHERE aggregate_id = $1 ORDER BY occurred_at ASC',
  [appointmentId]
);

// Rebuild aggregate from events
const appointment = Appointment.fromEvents(events);
```

---

## Event Bus

Events are published to an event bus for cross-context communication.

### Implementation: Redis Pub/Sub

```typescript
class EventBus {
  constructor(private redis: Redis) {}

  async publish(event: DomainEvent): Promise<void> {
    // Store in event store first
    await this.eventStore.append(event);

    // Then publish to subscribers
    const channel = `events.${event.eventType}`;
    await this.redis.publish(channel, JSON.stringify(event));

    // Also publish to wildcard channel for audit
    await this.redis.publish('events.*', JSON.stringify(event));
  }

  subscribe(eventType: string, handler: (event: DomainEvent) => void) {
    const channel = `events.${eventType}`;
    this.redis.subscribe(channel);
    this.redis.on('message', (ch, message) => {
      if (ch === channel) {
        const event = JSON.parse(message);
        handler(event);
      }
    });
  }

  subscribeAll(handler: (event: DomainEvent) => void) {
    this.redis.psubscribe('events.*');
    this.redis.on('pmessage', (pattern, channel, message) => {
      const event = JSON.parse(message);
      handler(event);
    });
  }
}
```

---

## Event Handling Patterns

### Idempotent Handlers

Event handlers must be idempotent (safe to process same event multiple times).

```typescript
class BudgetWarningHandler {
  async handle(event: BudgetExceeded) {
    // Check if already processed
    const processed = await db.query(
      'SELECT 1 FROM processed_events WHERE event_id = $1',
      [event.eventId]
    );

    if (processed.rows.length > 0) {
      // Already processed, skip
      return;
    }

    // Process event
    await this.sendBudgetWarning(event);

    // Mark as processed
    await db.query(
      'INSERT INTO processed_events (event_id, processed_at) VALUES ($1, $2)',
      [event.eventId, new Date()]
    );
  }
}
```

### Saga Pattern (Long-Running Processes)

For complex multi-step processes:

```typescript
// Example: Trip Booking Saga
class TripBookingSaga {
  async handle(event: DomainEvent) {
    switch (event.eventType) {
      case 'TripPlanned':
        // Step 1: Block calendar
        await this.calendarService.blockTime(event.payload);
        break;

      case 'FlightBooked':
        // Step 2: Book hotel
        await this.hotelService.findHotels(event.payload.destination);
        break;

      case 'HotelBooked':
        // Step 3: Record financial transaction
        await this.financeService.recordTransaction({
          amount: event.payload.totalCost,
          category: 'travel'
        });
        break;

      case 'BookingFailed':
        // Compensating action: rollback
        await this.rollbackBooking(event.payload);
        break;
    }
  }
}
```

---

## Summary

**Key Principles:**
- ✅ Events are immutable facts
- ✅ Named in past tense
- ✅ Self-contained (all info needed)
- ✅ Versioned for evolution
- ✅ Time-stamped and traceable
- ✅ Published to event bus for loose coupling
- ✅ Handlers are idempotent
- ✅ Stored in append-only event store

**Benefits:**
- Loose coupling between contexts
- Audit trail (EU AI Act compliance)
- Event Sourcing capability
- Temporal queries ("What happened at X time?")
- Replay capability (rebuild state from events)

---

**End of Document**
