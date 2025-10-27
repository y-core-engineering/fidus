# Ubiquitous Language

**Version:** 1.0
**Date:** 2025-10-27
**Status:** Draft

## Overview

This document defines the **Ubiquitous Language** for Fidus - the shared language used consistently by all stakeholders (business, developers, product owners). These terms are used consistently in code, documentation, and communication.

**Language:** English (Code Language = Ubiquitous Language)

## Principles

1. **One Term = One Meaning**: No synonyms, no ambiguities
2. **Code = Business**: Terms in code match business terms exactly
3. **Context-Specific**: Terms can have different meanings in different Bounded Contexts
4. **Evolutionary**: Language evolves with domain understanding

---

## Core Concepts (Core Domain)

### Agent
An **Agent** is an autonomous, AI-powered assistant that operates within a specific domain (e.g., Calendar, Finance) and performs tasks for the User.

**Avoid:** Bot, Assistant, Helper
**Code:** `Agent`

**Key Characteristics:**
- Autonomous decision-making
- Domain-specialized
- Learns from interactions
- Can act proactively

---

### Supervisor
A **Supervisor** is a specialized Agent for a specific business domain (e.g., Calendar Supervisor, Finance Supervisor). It coordinates Tools and makes decisions within its domain.

**Context:** A Supervisor is the technical implementation of a domain-specific Agent
**Code:** `Supervisor`, e.g., `CalendarSupervisor`, `FinanceSupervisor`

**Relationships:**
- A Supervisor IS-A Agent
- A Supervisor operates within exactly one Bounded Context
- A Supervisor uses Tools (MCP Tools)
- A Supervisor can emit Domain Events

---

### Orchestrator
The **Orchestrator** is the central coordinator that analyzes User requests and routes them to the appropriate Supervisors.

**Responsibilities:**
- Intent Detection (Which domain is meant?)
- Routing (To which Supervisor?)
- Multi-Domain Coordination (Multiple Supervisors simultaneously)
- Context Management

**Code:** `CentralOrchestrator`, `Orchestrator`

**Metaphor:** Like a conductor of an orchestra - coordinates but doesn't play instruments itself

---

### User
A **User** is a natural person who uses Fidus.

**Attributes:**
- Authenticated
- Has a Profile
- Belongs to a Tenant
- Has Preferences

**Code:** `User`

**Relationships:**
- User BELONGS-TO Tenant (1:1 or N:1)
- User HAS-ONE Profile
- User HAS-MANY Preferences

---

### Tenant
A **Tenant** is an organizational unit (e.g., company, family, individual) that uses Fidus. All data is tenant-isolated.

**Multi-Tenancy:** Multiple Tenants share the same infrastructure, but their data is strictly separated.

**Code:** `Tenant`

**Data Isolation Strategies:**
- Row-Level Security (PostgreSQL)
- Collection Filtering (Qdrant)
- Key Prefix (Redis: `tenant:{id}:*`)

---

### Profile
A User's **Profile** contains all information about the User: demographic data, preferences, inferred interests.

**Components:**
- **Explicit Preferences:** Actively set by User (e.g., language, timezone)
- **Inferred Preferences:** Derived by system (e.g., "User likes Italian food")
- **Context:** Current state (e.g., location, time of day)

**Code:** `UserProfile`, `Profile`

**Storage:**
- Graph Database (Neo4j) for relationships
- Vector Database (Qdrant) for semantic search

---

### Signal
A **Signal** is an event or data point that could trigger a proactive action.

**Examples:**
- Early morning appointment + no alarm set → Signal: "Suggest setting alarm"
- Flight in 2 days + no hotel booking → Signal: "Hotel missing"
- Low account balance + recurring charge tomorrow → Signal: "Warning"

**Code:** `Signal`

**Lifecycle:**
1. **Detected:** Signal recognized
2. **Evaluated:** Relevance assessed (Confidence Score)
3. **Acted:** Action suggested or executed
4. **Dismissed:** Signal discarded (not relevant enough)

**Attributes:**
- `type`: Signal type (e.g., `MISSING_ALARM`, `BUDGET_WARNING`)
- `confidence`: Relevance score (0.0 - 1.0)
- `source`: Where did this Signal come from?
- `context`: Contextual data
- `suggestedAction`: What should be done?

---

### Proactivity
**Proactivity** means Fidus makes suggestions on its own, without the User explicitly asking.

**Types:**
- **Opportunistic:** "I noticed that..."
- **Preventive:** "Heads up, tomorrow..."
- **Assistive:** "Should I... for you?"

**Code:** `ProactivityEngine`, `ProactiveSuggestion`

**Anti-Pattern:** Annoying notifications - Proactivity must be valuable, not disturbing

**Threshold:** Only suggest if confidence > 0.7

---

### Tool
A **Tool** is an executable function that a Supervisor can use (e.g., "Create Appointment", "Send Email").

**Implementation:** MCP (Model Context Protocol) Tool
**Code:** `Tool`, `MCPTool`

**Relationships:**
- A Tool BELONGS-TO a Plugin
- A Supervisor CAN-USE multiple Tools
- Tools are the "hands" of the Agent

**Characteristics:**
- Idempotent (where possible)
- Has clear input/output schema
- Can fail gracefully
- Logs execution for Audit

---

### Plugin
A **Plugin** is an extensible component that adds new functionality to Fidus.

**Plugin Types:**
1. **Supervisor Plugin:** Adds a new domain Supervisor
2. **Tool Plugin:** Adds new Tools (MCP Tools)
3. **Connector Plugin:** Integrates external services

**Code:** `Plugin`

**Lifecycle:**
1. **Discovered:** Plugin found in Registry
2. **Installed:** Plugin downloaded and installed
3. **Activated:** Plugin loaded and ready
4. **Deactivated:** Plugin stopped

**Manifest:**
```typescript
interface PluginManifest {
  name: string;
  version: string;
  type: 'supervisor' | 'tool' | 'connector';
  dependencies: Dependency[];
  permissions: Permission[];
}
```

---

### MCP (Model Context Protocol)
**MCP** is the standard protocol for integrating Tools and external services.

**Code:** `MCPServer`, `MCPClient`

**Concept:** Like HTTP for APIs, but for LLM-Tool integration

**Components:**
- **MCP Server:** Provides Tools
- **MCP Client:** Consumes Tools
- **Tool Schema:** JSON Schema defining inputs/outputs

---

### Permission
A **Permission** defines what a Plugin or User may do.

**Permission Types:**
1. **Service Permission:** Access to internal services (e.g., `userProfile.read`)
2. **Data Permission:** Access to data categories (e.g., `data.calendar`)
3. **LLM Permission:** Permission to use LLM (incl. token quota)

**Code:** `Permission`

**Examples:**
```typescript
{
  services: ['userProfile.read', 'calendar.write'],
  data: ['data.calendar', 'data.preferences'],
  llm: { allowed: true, quota: 10000 } // tokens per day
}
```

**Enforcement Points:**
- API Gateway (Service Permissions)
- Repository Layer (Data Permissions)
- LLM Proxy (LLM Permissions)

---

### Audit Log
An **Audit Log** is an immutable record of a decision made by the Agent.

**Purpose:**
- **EU AI Act Compliance:** Transparency about AI decisions
- **Debugging:** Why did the Agent do that?
- **Trust:** User can understand decisions

**Required Fields:**
- What was decided?
- Why? (Reasoning)
- Which Signals were used?
- Which LLM model?
- Was it proactive or reactive?
- Risk level (minimal, limited, high)

**Code:** `AuditLog`, `AIDecisionLog`

**Retention:** Minimum 6 months (EU AI Act requirement)

---

## Domain-Specific Terms

### Calendar Domain

#### Appointment
An **Appointment** is a scheduled event at a specific time.

**Attributes:**
- Title
- Start/End Time
- Participants (Contacts)
- Location (optional)
- Notes

**Code:** `Appointment`

**Relationships:**
- Appointment CAN-TRIGGER Trip (Travel Domain)
- Appointment CAN-TRIGGER Reminder (Proactivity)

**Domain Events:**
- `AppointmentCreated`
- `AppointmentUpdated`
- `AppointmentCancelled`
- `AppointmentStartsSoon` (15 min before)

---

#### Availability
**Availability** describes whether a User is free at a specific time.

**States:**
- **Free:** Available
- **Busy:** Occupied (has Appointment)
- **Tentative:** Tentatively booked
- **Out of Office:** Away

**Code:** `Availability`

**Use Case:** Scheduling meetings, conflict detection

---

#### Reminder
A **Reminder** is a notification about an upcoming Appointment.

**Types:**
- **Time-based:** "15 minutes before"
- **Location-based:** "When leaving office"
- **Context-based:** "When with Person X"

**Code:** `Reminder`

---

### Finance Domain

#### Transaction
A **Transaction** is a money movement (income or expense).

**Attributes:**
- Amount (Money Value Object)
- Currency
- Category
- Date
- Description
- Merchant (optional)

**Code:** `Transaction`

**Types:**
- **Income:** Money in
- **Expense:** Money out
- **Transfer:** Between own accounts

**Domain Events:**
- `TransactionRecorded`
- `TransactionCategorized`

---

#### Budget
A **Budget** is a defined amount of money for a Category within a time period.

**Example:** "Max. €500/month for restaurants"

**Code:** `Budget`

**Attributes:**
- Amount
- Category
- Period (monthly, weekly, yearly)
- Type (hard limit, soft target)

**Signal Trigger:** Budget exceeded → Warning Signal

**Domain Events:**
- `BudgetCreated`
- `BudgetExceeded`
- `BudgetNearlyExceeded` (80% threshold)

---

#### Category
A **Category** groups Transactions thematically (e.g., "Groceries", "Transport", "Entertainment").

**Code:** `Category`, `TransactionCategory`

**Hierarchy:**
- Can be nested (e.g., "Food" → "Groceries", "Restaurants")
- User can create custom categories

---

#### Account
An **Account** is a financial account (bank account, credit card, cash).

**Code:** `Account`, `FinancialAccount`

**Attributes:**
- Name
- Type (checking, savings, credit card)
- Balance
- Currency

---

### Travel Domain

#### Trip
A **Trip** is a planned location change with outbound and return journey.

**Components:**
- **Outbound:** Outbound journey/flight
- **Inbound:** Return journey/flight
- **Accommodation:** Lodging (optional)
- **Activities:** Planned activities

**Code:** `Trip`

**States:**
- **Planned:** Trip created, not booked
- **Booked:** All components confirmed
- **In Progress:** Currently traveling
- **Completed:** Trip finished

**Domain Events:**
- `TripPlanned`
- `TripBooked`
- `TripStarted`
- `TripCompleted`

---

#### Booking
A **Booking** is a confirmed reservation (flight, hotel, rental car).

**States:**
- **Confirmed:** Confirmed
- **Pending:** Awaiting confirmation
- **Cancelled:** Cancelled

**Code:** `Booking`

**Types:**
- Flight Booking
- Hotel Booking
- Car Rental Booking
- Activity Booking

**Attributes:**
- Booking Reference
- Confirmation Number
- Booking Date
- Service Provider
- Amount Paid

---

#### Itinerary
An **Itinerary** is a detailed travel plan with all Bookings and Activities.

**Code:** `Itinerary`

---

### Communication Domain

#### Message
A **Message** is text-based communication (email, chat, SMS).

**Code:** `Message`

**Attributes:**
- Sender (Contact)
- Recipients (Contacts)
- Subject (optional)
- Body
- Timestamp
- Channel (email, SMS, chat)

**Domain Events:**
- `MessageSent`
- `MessageReceived`
- `MessageRead`

---

#### Contact
A **Contact** is a person or organization in the User's address book.

**Code:** `Contact`

**Attributes:**
- Name
- Email Addresses
- Phone Numbers
- Organization (optional)
- Tags

**Relationships:**
- Contact CAN-PARTICIPATE-IN Appointments
- Contact CAN-BE-SENDER/RECIPIENT of Messages

---

#### Conversation
A **Conversation** is a thread of related Messages.

**Code:** `Conversation`, `MessageThread`

---

### Health Domain

#### Activity
A health **Activity** is a recorded physical activity (run, walk, workout).

**Code:** `HealthActivity`, `Activity`

**Attributes:**
- Type (run, walk, bike, swim, workout)
- Duration
- Distance (optional)
- Calories Burned
- Timestamp

---

#### Vital
A **Vital** is a health measurement (heart rate, weight, blood pressure).

**Code:** `Vital`, `HealthVital`

---

### Home Domain

#### Device
A **Device** is a smart home device (light, thermostat, camera).

**Code:** `HomeDevice`, `SmartDevice`

**Attributes:**
- Type
- Location (room)
- State (on/off, temperature, etc.)
- Manufacturer

---

#### Automation
An **Automation** is a rule-based action (e.g., "Turn on lights at sunset").

**Code:** `HomeAutomation`, `Automation`

---

### Shopping Domain

#### Shopping List
A **Shopping List** is a list of items to purchase.

**Code:** `ShoppingList`

---

#### Product
A **Product** is an item that can be purchased.

**Code:** `Product`

**Attributes:**
- Name
- Price
- Store/Merchant
- Category

---

### Learning Domain

#### Course
A **Course** is educational content (online course, book, tutorial).

**Code:** `Course`

---

#### Learning Goal
A **Learning Goal** is a skill or topic the User wants to learn.

**Code:** `LearningGoal`

---

## Technical Terms (with Business Context)

### Context
**Context** is the sum of all relevant information for a decision.

**Components:**
- User Profile
- Current Situation (time, location)
- Past Interactions
- Relevant documents/data

**Code:** `Context`, `ExecutionContext`

**Types:**
- **User Context:** Who is the User? Preferences?
- **Situational Context:** Where? When? What's happening?
- **Historical Context:** What happened before?

---

### Intent
An **Intent** is the recognized intention of the User based on their request.

**Example:**
- User says: "Book me an appointment tomorrow at 10am with Max"
- Intent: `CALENDAR_CREATE_APPOINTMENT`
- Domain: `Calendar`

**Code:** `Intent`, `UserIntent`

**Detection:** Detected by Orchestrator using LLM

**Confidence:** Intent detection includes confidence score (0.0 - 1.0)

---

### Reasoning
**Reasoning** is the explanation of why the Agent made a specific decision.

**Purpose:**
- Transparency (EU AI Act)
- Trust
- Debugging

**Code:** `Reasoning`, `DecisionReasoning`

**Format:** Human-readable text + structured data (Signals Used, Confidence Score)

**Example:**
```json
{
  "explanation": "I suggest setting an alarm because you have an early meeting tomorrow at 6am and typically wake up at 7am.",
  "signalsUsed": ["EARLY_APPOINTMENT", "TYPICAL_WAKE_TIME"],
  "confidence": 0.92
}
```

---

### Embedding
An **Embedding** is a vector representation of text that enables semantic similarity.

**Use Case:**
- User asks: "Italian restaurant tomorrow evening"
- System searches for similar past requests via Embedding

**Code:** `Embedding`, `VectorEmbedding`

**Technical:** 768-dimensional vector (e.g., via OpenAI text-embedding-3-small)

**Storage:** Vector Database (Qdrant)

---

### Preference
A **Preference** is a User's explicit or inferred choice.

**Code:** `Preference`

**Types:**
- **Explicit:** User-stated (e.g., "I prefer Italian food")
- **Inferred:** System-derived (e.g., "User orders Italian 70% of the time")

**Confidence:** Inferred preferences have confidence scores

---

## Anti-Patterns (Avoid)

### ❌ "Chatbot"
**Why not:** Too passive, too reactive. Fidus is proactive and intelligent.
**Use instead:** Agent, Supervisor

### ❌ "AI System"
**Why not:** Too technical, too abstract.
**Use instead:** Agent (for user communication)

### ❌ "Task"
**Why not:** Too generic, ambiguous.
**Use instead:** Context-specific: Appointment, Transaction, Trip, etc.

### ❌ "Request"
**Why not:** Too technical.
**Use instead:** User Intent, User Query

### ❌ "Notification"
**Why not:** Sounds like spam.
**Use instead:** Proactive Suggestion, Signal

### ❌ "Event" (without context)
**Why not:** Ambiguous - Domain Event? Calendar Event? System Event?
**Use instead:** Appointment (Calendar), Domain Event (DDD)

---

## Usage in Code

### Example 1: Class Names
```typescript
// ✅ Good
class CalendarSupervisor extends Supervisor { }
class Appointment { }
class ProactivityEngine { }
class UserProfile { }

// ❌ Bad
class CalendarBot { }
class Event { } // too generic
class NotificationService { }
class UserData { }
```

### Example 2: Method Names
```typescript
// ✅ Good
async detectIntent(userQuery: string): Promise<Intent>
async evaluateSignal(signal: Signal): Promise<number>
async createAppointment(details: AppointmentDetails): Promise<Appointment>
async recordTransaction(transaction: Transaction): Promise<void>

// ❌ Bad
async analyzeRequest(req: string): Promise<any>
async checkStuff(data: any): Promise<number>
async addEvent(details: any): Promise<any>
async saveData(data: any): Promise<void>
```

### Example 3: Domain Events
```typescript
// ✅ Good
class AppointmentCreated extends DomainEvent { }
class BudgetExceeded extends DomainEvent { }
class TripBooked extends DomainEvent { }
class MessageSent extends DomainEvent { }

// ❌ Bad
class CalendarEventHappened { }
class SomethingChanged { }
class DataUpdated { }
```

### Example 4: Value Objects
```typescript
// ✅ Good
class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: Currency
  ) {}
}

class EmailAddress {
  private constructor(private readonly value: string) {}

  static create(email: string): EmailAddress | Error {
    if (!isValidEmail(email)) return new Error('Invalid email');
    return new EmailAddress(email);
  }
}

// ❌ Bad
type Money = number; // loses currency context
type Email = string; // no validation
```

---

## Language Evolution

This Ubiquitous Language is **evolutionary**:

1. **New term discovered?** → Document here
2. **Term ambiguous?** → Clarify and make precise
3. **Term outdated?** → Mark as deprecated, plan migration
4. **Context conflict?** → Clarify Bounded Context

**Review Cycle:** Every 3 months or with major features

**Change Process:**
1. Propose term change (GitHub Issue/Discussion)
2. Team agreement
3. Update documentation
4. Update code (deprecation period)
5. Communication to all stakeholders

---

## Quick Reference

### Core Domain
- Agent, Supervisor, Orchestrator
- User, Tenant, Profile
- Signal, Proactivity
- Tool, Plugin, MCP
- Permission, Audit Log

### Calendar Domain
- Appointment, Availability, Reminder

### Finance Domain
- Transaction, Budget, Category, Account

### Travel Domain
- Trip, Booking, Itinerary

### Communication Domain
- Message, Contact, Conversation

### Technical Terms
- Context, Intent, Reasoning, Embedding, Preference

---

**End of Document**
