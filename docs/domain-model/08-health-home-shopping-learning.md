# Health, Home, Shopping & Learning Domains - Detailed Models

**Version:** 1.1
**Date:** 2025-10-27
**Status:** Draft
**Contexts:** Health, Home, Shopping, Learning (Domain)

## Overview

This document covers four domain contexts that, while distinct, share similar patterns and complexity levels. Each is presented with its core aggregates, value objects, domain events, and business rules.

**Relationship to Bounded Contexts:**
- These **domain models** define WHAT each Context does (aggregates, events, rules)
- The corresponding **Supervisors** (architecture) define HOW they're implemented (LangGraph state machines, API integrations)

---

# 1. Health Domain

## Overview

The Health Domain manages health-related information including appointments, medications, fitness activities, and health metrics tracking.

## Multi-Tenancy Considerations

The Health Context operates with **tenant-level isolation** and **user-level health data**:

| **Tenant Type** | **Health Capabilities** |
|-----------------|------------------------|
| **INDIVIDUAL** | Personal health records, medication tracking, fitness logging |
| **FAMILY** | Family health records, shared medication reminders, parental access to children's health data |
| **TEAM** | Wellness programs, team fitness challenges, health benefits tracking |
| **COMPANY** | Corporate wellness programs, HIPAA compliance, aggregated health analytics, EAP integration |

**Tenant-Specific Features:**
- **Community Tier:** Basic health tracking, manual entry
- **Cloud Tier:** Wearable integration (Apple Health, Fitbit), medication reminders
- **Enterprise Tier:** HIPAA compliance, EHR integration, wellness program management

**Data Isolation:**
- All health records scoped to `tenantId` and `userId`
- HIPAA-compliant encryption for health data
- Family sharing requires explicit consent
- No cross-tenant health data sharing

## Core Entities

### HealthAppointment (Aggregate Root)

**Description:** Medical appointments with healthcare providers.

**Invariants:**
- Must have a healthcare provider
- Appointment date cannot be in the past (for new appointments)
- Cannot overlap with other health appointments

**State:**
```typescript
class HealthAppointment {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private provider: HealthcareProvider; // Value Object
  private appointmentType: AppointmentType;
  private scheduledAt: Date;
  private duration: number; // minutes
  private location: Location;
  private status: HealthAppointmentStatus;

  private reasonForVisit?: string;
  private notes?: string;
  private followUpRequired: boolean = false;

  private createdAt: Date;
  private updatedAt: Date;
}

enum AppointmentType {
  GENERAL_CHECKUP = 'general_checkup',
  SPECIALIST = 'specialist',
  DENTIST = 'dentist',
  OPTICAL = 'optical',
  MENTAL_HEALTH = 'mental_health',
  PHYSICAL_THERAPY = 'physical_therapy',
  VACCINATION = 'vaccination',
  LAB_TEST = 'lab_test',
  FOLLOW_UP = 'follow_up'
}

enum HealthAppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}
```

### Medication (Aggregate Root)

**Description:** Prescription or over-the-counter medication being taken.

**Invariants:**
- Must have a name and dosage
- Frequency must be valid
- Start date must be before end date (if applicable)

**State:**
```typescript
class Medication {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private name: string;
  private genericName?: string;
  private dosage: Dosage; // Value Object
  private frequency: MedicationFrequency; // Value Object
  private prescribedBy?: string; // Doctor name
  private prescriptionNumber?: string;

  private startDate: Date;
  private endDate?: Date;
  private refillsRemaining: number = 0;

  private instructions?: string;
  private sideEffects: string[] = [];
  private isActive: boolean = true;

  private adherenceLog: MedicationLog[] = [];

  private createdAt: Date;
  private updatedAt: Date;
}
```

**Commands:**

```typescript
// Record medication taken
recordTaken(takenAt: Date): MedicationTaken {
  const log = new MedicationLog(takenAt, true);
  this.adherenceLog.push(log);

  return new MedicationTaken({
    medicationId: this.id,
    takenAt,
    dosage: this.dosage.toString()
  });
}

// Record missed dose
recordMissed(missedAt: Date): MedicationMissed {
  const log = new MedicationLog(missedAt, false);
  this.adherenceLog.push(log);

  return new MedicationMissed({
    medicationId: this.id,
    missedAt
  });
}

// Get adherence rate
getAdherenceRate(days: number = 30): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const recentLogs = this.adherenceLog.filter(log =>
    log.timestamp >= cutoff
  );

  if (recentLogs.length === 0) return 100;

  const taken = recentLogs.filter(log => log.taken).length;
  return (taken / recentLogs.length) * 100;
}
```

### HealthMetric (Aggregate Root)

**Description:** Quantifiable health measurement (weight, blood pressure, heart rate, etc.).

**State:**
```typescript
class HealthMetric {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private type: MetricType;
  private value: number;
  private unit: string;
  private measuredAt: Date;
  private source: MetricSource;

  private notes?: string;

  private createdAt: Date;
}

enum MetricType {
  WEIGHT = 'weight',
  HEIGHT = 'height',
  BLOOD_PRESSURE_SYSTOLIC = 'blood_pressure_systolic',
  BLOOD_PRESSURE_DIASTOLIC = 'blood_pressure_diastolic',
  HEART_RATE = 'heart_rate',
  BLOOD_GLUCOSE = 'blood_glucose',
  BODY_TEMPERATURE = 'body_temperature',
  OXYGEN_SATURATION = 'oxygen_saturation',
  STEPS = 'steps',
  SLEEP_HOURS = 'sleep_hours',
  CALORIES_CONSUMED = 'calories_consumed',
  CALORIES_BURNED = 'calories_burned'
}

enum MetricSource {
  MANUAL = 'manual',
  WEARABLE = 'wearable',
  SMART_SCALE = 'smart_scale',
  MEDICAL_DEVICE = 'medical_device'
}
```

## Value Objects

### HealthcareProvider

```typescript
class HealthcareProvider {
  constructor(
    public readonly name: string,
    public readonly specialty: string,
    public readonly phone?: PhoneNumber,
    public readonly email?: EmailAddress,
    public readonly location?: Location
  ) {}
}
```

### Dosage

```typescript
class Dosage {
  constructor(
    public readonly amount: number,
    public readonly unit: DosageUnit
  ) {
    if (amount <= 0) {
      throw new Error('Dosage amount must be positive');
    }
  }

  toString(): string {
    return `${this.amount} ${this.unit}`;
  }
}

enum DosageUnit {
  MG = 'mg',
  ML = 'ml',
  TABLET = 'tablet',
  CAPSULE = 'capsule',
  DROP = 'drop',
  SPRAY = 'spray',
  PATCH = 'patch'
}
```

### MedicationFrequency

```typescript
class MedicationFrequency {
  constructor(
    public readonly timesPerDay: number,
    public readonly scheduleType: ScheduleType,
    public readonly specificTimes?: Date[]
  ) {
    if (timesPerDay < 0) {
      throw new Error('Frequency must be non-negative');
    }
  }

  static daily(): MedicationFrequency {
    return new MedicationFrequency(1, ScheduleType.DAILY);
  }

  static twiceDaily(): MedicationFrequency {
    return new MedicationFrequency(2, ScheduleType.DAILY);
  }

  static asNeeded(): MedicationFrequency {
    return new MedicationFrequency(0, ScheduleType.AS_NEEDED);
  }
}

enum ScheduleType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  AS_NEEDED = 'as_needed',
  SPECIFIC_TIMES = 'specific_times'
}
```

## Domain Events

```typescript
interface HealthAppointmentScheduled extends DomainEvent {
  eventType: 'HealthAppointmentScheduled';
  payload: {
    appointmentId: string;
    userId: string;
    provider: string;
    appointmentType: AppointmentType;
    scheduledAt: Date;
    location: string;
  };
}

interface MedicationPrescribed extends DomainEvent {
  eventType: 'MedicationPrescribed';
  payload: {
    medicationId: string;
    userId: string;
    name: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    startDate: Date;
  };
}

interface MedicationTaken extends DomainEvent {
  eventType: 'MedicationTaken';
  payload: {
    medicationId: string;
    takenAt: Date;
    dosage: string;
  };
}

interface MedicationMissed extends DomainEvent {
  eventType: 'MedicationMissed';
  payload: {
    medicationId: string;
    missedAt: Date;
  };
}

interface HealthMetricRecorded extends DomainEvent {
  eventType: 'HealthMetricRecorded';
  payload: {
    metricId: string;
    userId: string;
    type: MetricType;
    value: number;
    unit: string;
    measuredAt: Date;
  };
}
```

## Proactive Triggers

The Health Context emits the following **Proactive Triggers** to the Proactivity Context:

**Terminology Clarification:**
- **Data Signals:** Pull-based state data exposed via MCP (e.g., `health.next_appointment`, `health.medication_schedule`)
- **Domain Events:** Push-based state changes (e.g., `AppointmentScheduled`, `MedicationTaken`)
- **Proactive Triggers:** Derived opportunities from health data analysis (below)

### 1. APPOINTMENT_REMINDER
```typescript
{
  triggerType: 'APPOINTMENT_REMINDER',
  appointmentId: string,
  provider: string,
  appointmentType: AppointmentType,
  scheduledAt: Date,
  hoursUntil: number,
  confidence: 1.0
}
```

### 2. MEDICATION_DUE
```typescript
{
  triggerType: 'MEDICATION_DUE',
  medicationId: string,
  medicationName: string,
  dosage: string,
  dueAt: Date,
  confidence: 1.0
}
```

### 3. LOW_ADHERENCE
```typescript
{
  triggerType: 'LOW_ADHERENCE',
  medicationId: string,
  medicationName: string,
  adherenceRate: number,
  daysTracked: number,
  confidence: number
}
```

### 4. ABNORMAL_METRIC
```typescript
{
  triggerType: 'ABNORMAL_METRIC',
  metricType: MetricType,
  value: number,
  normalRange: { min: number, max: number },
  confidence: number
}
```

---

# 2. Home Domain

## Overview

The Home Domain manages smart home devices, maintenance tasks, utilities, and home automation.

## Multi-Tenancy Considerations

The Home Context operates with **tenant-level home management**:

| **Tenant Type** | **Home Capabilities** |
|-----------------|----------------------|
| **INDIVIDUAL** | Single home, basic device control, maintenance tracking |
| **FAMILY** | Shared home management, family access controls, automation routines |
| **TEAM** | Office building management, shared spaces, access control |
| **COMPANY** | Facility management, multi-location, energy analytics, security compliance |

**Tenant-Specific Features:**
- **Community Tier:** 5 devices, basic automation
- **Cloud Tier:** 25 devices, advanced automation, energy tracking
- **Enterprise Tier:** Unlimited devices, facility management, compliance reporting

**Data Isolation:**
- All devices scoped to `tenantId` and home location
- Family members share device control with permissions
- Automation routines tenant-isolated

## Core Entities

### Device (Aggregate Root)

**Description:** A smart home device (thermostat, light, camera, etc.).

**State:**
```typescript
class Device {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private name: string;
  private type: DeviceType;
  private manufacturer: string;
  private model: string;

  private location: string; // Room name
  private status: DeviceStatus;
  private isOnline: boolean = true;

  private capabilities: DeviceCapability[];
  private currentState: Record<string, any>;

  private lastCommunicationAt?: Date;
  private firmwareVersion?: string;

  private createdAt: Date;
  private updatedAt: Date;
}

enum DeviceType {
  LIGHT = 'light',
  THERMOSTAT = 'thermostat',
  LOCK = 'lock',
  CAMERA = 'camera',
  SPEAKER = 'speaker',
  SENSOR = 'sensor',
  PLUG = 'plug',
  GARAGE_DOOR = 'garage_door',
  DOORBELL = 'doorbell',
  VACUUM = 'vacuum'
}

enum DeviceStatus {
  ACTIVE = 'active',
  IDLE = 'idle',
  OFFLINE = 'offline',
  ERROR = 'error'
}

enum DeviceCapability {
  ON_OFF = 'on_off',
  BRIGHTNESS = 'brightness',
  COLOR = 'color',
  TEMPERATURE = 'temperature',
  LOCK_UNLOCK = 'lock_unlock',
  MOTION_DETECTION = 'motion_detection',
  VIDEO_STREAM = 'video_stream'
}
```

**Commands:**

```typescript
// Control device
control(command: DeviceCommand): DeviceControlled {
  if (!this.isOnline) {
    throw new Error('Device is offline');
  }

  // Apply command to state
  this.currentState = { ...this.currentState, ...command.state };
  this.lastCommunicationAt = new Date();

  return new DeviceControlled({
    deviceId: this.id,
    command: command.action,
    newState: this.currentState
  });
}

// Report offline
goOffline(): DeviceWentOffline {
  this.isOnline = false;
  this.status = DeviceStatus.OFFLINE;

  return new DeviceWentOffline({
    deviceId: this.id,
    deviceName: this.name,
    lastSeenAt: this.lastCommunicationAt
  });
}
```

### MaintenanceTask (Aggregate Root)

**Description:** Scheduled or ad-hoc home maintenance task.

**State:**
```typescript
class MaintenanceTask {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private title: string;
  private description?: string;
  private category: MaintenanceCategory;
  private priority: TaskPriority;

  private dueDate?: Date;
  private isRecurring: boolean = false;
  private recurrencePattern?: RecurrencePattern;

  private status: TaskStatus;
  private completedAt?: Date;

  private estimatedCost?: Money;
  private actualCost?: Money;

  private assignedTo?: string; // Service provider
  private notes: string[] = [];

  private createdAt: Date;
  private updatedAt: Date;
}

enum MaintenanceCategory {
  HVAC = 'hvac',
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  APPLIANCES = 'appliances',
  LAWN_GARDEN = 'lawn_garden',
  CLEANING = 'cleaning',
  PEST_CONTROL = 'pest_control',
  ROOF_GUTTERS = 'roof_gutters',
  PAINTING = 'painting',
  GENERAL = 'general'
}

enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue'
}
```

### Automation (Aggregate Root)

**Description:** Automated rule that triggers device actions.

**State:**
```typescript
class Automation {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private name: string;
  private description?: string;

  private trigger: AutomationTrigger;
  private conditions: AutomationCondition[] = [];
  private actions: AutomationAction[] = [];

  private isEnabled: boolean = true;
  private lastTriggeredAt?: Date;
  private triggerCount: number = 0;

  private createdAt: Date;
  private updatedAt: Date;
}

interface AutomationTrigger {
  type: TriggerType;
  deviceId?: string;
  time?: Date;
  event?: string;
}

enum TriggerType {
  TIME = 'time',
  DEVICE_STATE_CHANGE = 'device_state_change',
  LOCATION = 'location',
  SUNRISE_SUNSET = 'sunrise_sunset',
  MANUAL = 'manual'
}

interface AutomationCondition {
  type: ConditionType;
  deviceId?: string;
  operator: ConditionOperator;
  value: any;
}

enum ConditionType {
  DEVICE_STATE = 'device_state',
  TIME_RANGE = 'time_range',
  DAY_OF_WEEK = 'day_of_week',
  TEMPERATURE = 'temperature',
  PRESENCE = 'presence'
}

enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than'
}

interface AutomationAction {
  deviceId: string;
  command: string;
  parameters: Record<string, any>;
}
```

## Domain Events

```typescript
interface DeviceAdded extends DomainEvent {
  eventType: 'DeviceAdded';
  payload: {
    deviceId: string;
    userId: string;
    name: string;
    type: DeviceType;
    location: string;
  };
}

interface DeviceControlled extends DomainEvent {
  eventType: 'DeviceControlled';
  payload: {
    deviceId: string;
    command: string;
    newState: Record<string, any>;
  };
}

interface DeviceWentOffline extends DomainEvent {
  eventType: 'DeviceWentOffline';
  payload: {
    deviceId: string;
    deviceName: string;
    lastSeenAt?: Date;
  };
}

interface MaintenanceTaskCreated extends DomainEvent {
  eventType: 'MaintenanceTaskCreated';
  payload: {
    taskId: string;
    userId: string;
    title: string;
    category: MaintenanceCategory;
    dueDate?: Date;
  };
}

interface AutomationTriggered extends DomainEvent {
  eventType: 'AutomationTriggered';
  payload: {
    automationId: string;
    triggeredAt: Date;
    actionsExecuted: number;
  };
}
```

## Proactive Triggers

The Home Context emits the following **Proactive Triggers** to the Proactivity Context:

**Terminology Clarification:**
- **Data Signals:** Pull-based state data exposed via MCP (e.g., `home.device_status`, `home.energy_usage`)
- **Domain Events:** Push-based state changes (e.g., `DeviceStatusChanged`, `MaintenanceScheduled`)
- **Proactive Triggers:** Derived opportunities from home data analysis (below)

### 1. DEVICE_OFFLINE
```typescript
{
  triggerType: 'DEVICE_OFFLINE',
  deviceId: string,
  deviceName: string,
  deviceType: DeviceType,
  offlineSince: Date,
  confidence: 1.0
}
```

### 2. MAINTENANCE_DUE
```typescript
{
  triggerType: 'MAINTENANCE_DUE',
  taskId: string,
  title: string,
  category: MaintenanceCategory,
  dueDate: Date,
  daysOverdue?: number,
  confidence: 1.0
}
```

### 3. UNUSUAL_ENERGY_USAGE
```typescript
{
  triggerType: 'UNUSUAL_ENERGY_USAGE',
  deviceId?: string,
  currentUsage: number,
  averageUsage: number,
  deviationPercentage: number,
  confidence: number
}
```

---

# 3. Shopping Domain

## Overview

The Shopping Domain manages shopping lists, price tracking, product recommendations, and purchase history.

## Multi-Tenancy Considerations

The Shopping Context operates with **user-level and family-level shopping**:

| **Tenant Type** | **Shopping Capabilities** |
|-----------------|-------------------------|
| **INDIVIDUAL** | Personal shopping lists, price tracking, purchase history |
| **FAMILY** | Shared family shopping lists, collaborative list management, household inventory |
| **TEAM** | Office supplies, team purchasing, expense tracking |
| **COMPANY** | Corporate procurement, vendor management, purchase approval workflows |

**Tenant-Specific Features:**
- **Community Tier:** 3 shopping lists, manual entry
- **Cloud Tier:** 10 lists, price tracking, smart recommendations
- **Enterprise Tier:** Unlimited lists, procurement integration, vendor management

**Data Isolation:**
- Shopping lists scoped to `tenantId` and creator
- Shared lists use tenant-level permissions
- Purchase history tenant-isolated

## Core Entities

### ShoppingList (Aggregate Root)

**Description:** Collection of items to purchase.

**State:**
```typescript
class ShoppingList {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private name: string;
  private category: ListCategory;
  private items: ShoppingItem[] = [];

  private estimatedTotal: Money;
  private actualTotal?: Money;

  private status: ListStatus;
  private dueDate?: Date;

  private createdAt: Date;
  private updatedAt: Date;
}

enum ListCategory {
  GROCERIES = 'groceries',
  HOUSEHOLD = 'household',
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  GIFTS = 'gifts',
  GENERAL = 'general'
}

enum ListStatus {
  ACTIVE = 'active',
  SHOPPING = 'shopping',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}
```

**Commands:**

```typescript
// Add item to list
addItem(item: ShoppingItem): ItemAddedToList {
  // Check for duplicates
  const existing = this.items.find(i =>
    i.product.name.toLowerCase() === item.product.name.toLowerCase()
  );

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    this.items.push(item);
  }

  this.updateEstimatedTotal();

  return new ItemAddedToList({
    listId: this.id,
    itemName: item.product.name,
    quantity: item.quantity,
    estimatedPrice: item.estimatedPrice?.amount
  });
}

// Mark item as purchased
purchaseItem(itemId: string, actualPrice: Money): ItemPurchased {
  const item = this.items.find(i => i.id === itemId);
  if (!item) {
    throw new Error('Item not found in list');
  }

  item.purchased = true;
  item.actualPrice = actualPrice;

  this.updateActualTotal();

  // Check if all items purchased
  if (this.allItemsPurchased()) {
    this.status = ListStatus.COMPLETED;
  }

  return new ItemPurchased({
    listId: this.id,
    itemId,
    itemName: item.product.name,
    actualPrice: actualPrice.amount
  });
}

private allItemsPurchased(): boolean {
  return this.items.every(item => item.purchased);
}

private updateEstimatedTotal(): void {
  const total = this.items.reduce((sum, item) => {
    const itemTotal = item.estimatedPrice?.amount || 0;
    return sum + (itemTotal * item.quantity);
  }, 0);

  this.estimatedTotal = Money.create(total, 'EUR');
}
```

### ShoppingItem

```typescript
class ShoppingItem {
  constructor(
    public readonly id: string,
    public readonly product: Product,
    public quantity: number,
    public estimatedPrice?: Money,
    public actualPrice?: Money,
    public purchased: boolean = false,
    public notes?: string
  ) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
  }
}
```

### Product (Aggregate Root)

**Description:** Product with price tracking and recommendations.

**State:**
```typescript
class Product {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private name: string;
  private brand?: string;
  private category: ProductCategory;
  private description?: string;

  private currentPrice?: Money;
  private priceHistory: PricePoint[] = [];

  private preferredRetailers: string[] = [];
  private barcode?: string;
  private imageUrl?: string;

  private createdAt: Date;
  private updatedAt: Date;
}

enum ProductCategory {
  FOOD_BEVERAGE = 'food_beverage',
  PERSONAL_CARE = 'personal_care',
  HOUSEHOLD_SUPPLIES = 'household_supplies',
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  TOYS_GAMES = 'toys_games',
  OTHER = 'other'
}

interface PricePoint {
  retailer: string;
  price: Money;
  recordedAt: Date;
  url?: string;
}
```

## Domain Events

```typescript
interface ShoppingListCreated extends DomainEvent {
  eventType: 'ShoppingListCreated';
  payload: {
    listId: string;
    userId: string;
    name: string;
    category: ListCategory;
  };
}

interface ItemAddedToList extends DomainEvent {
  eventType: 'ItemAddedToList';
  payload: {
    listId: string;
    itemName: string;
    quantity: number;
    estimatedPrice?: number;
  };
}

interface ItemPurchased extends DomainEvent {
  eventType: 'ItemPurchased';
  payload: {
    listId: string;
    itemId: string;
    itemName: string;
    actualPrice: number;
  };
}

interface PriceDropDetected extends DomainEvent {
  eventType: 'PriceDropDetected';
  payload: {
    productId: string;
    productName: string;
    oldPrice: number;
    newPrice: number;
    dropPercentage: number;
    retailer: string;
  };
}
```

## Proactive Triggers

The Shopping Context emits the following **Proactive Triggers** to the Proactivity Context:

**Terminology Clarification:**
- **Data Signals:** Pull-based state data exposed via MCP (e.g., `shopping.list_items`, `shopping.price_alerts`)
- **Domain Events:** Push-based state changes (e.g., `ItemAddedToList`, `PurchaseCompleted`)
- **Proactive Triggers:** Derived opportunities from shopping data analysis (below)

### 1. PRICE_DROP
```typescript
{
  triggerType: 'PRICE_DROP',
  productId: string,
  productName: string,
  oldPrice: number,
  newPrice: number,
  dropPercentage: number,
  retailer: string,
  confidence: 1.0
}
```

### 2. LOW_STOCK
```typescript
{
  triggerType: 'LOW_STOCK',
  productId: string,
  productName: string,
  currentQuantity: number,
  usualQuantity: number,
  confidence: number
}
```

### 3. RECURRING_PURCHASE_DUE
```typescript
{
  triggerType: 'RECURRING_PURCHASE_DUE',
  productId: string,
  productName: string,
  lastPurchasedAt: Date,
  averageCycleDays: number,
  confidence: number
}
```

---

# 4. Learning Domain

## Overview

The Learning Domain manages courses, learning goals, progress tracking, and study schedules.

## Multi-Tenancy Considerations

The Learning Context operates with **individual and organizational learning**:

| **Tenant Type** | **Learning Capabilities** |
|-----------------|-------------------------|
| **INDIVIDUAL** | Personal courses, learning goals, progress tracking |
| **FAMILY** | Family learning plans, educational goals for children |
| **TEAM** | Team skill development, certifications, knowledge sharing |
| **COMPANY** | Corporate training programs, compliance training, skill gap analysis, LMS integration |

**Tenant-Specific Features:**
- **Community Tier:** 3 active courses, basic progress tracking
- **Cloud Tier:** 10 courses, smart study scheduling, progress analytics
- **Enterprise Tier:** Unlimited courses, LMS integration, certification tracking, compliance reporting

**Data Isolation:**
- Learning records scoped to `tenantId` and `userId`
- Course progress tenant-isolated
- Corporate training visible to administrators only

## Core Entities

### Course (Aggregate Root)

**Description:** Educational course or learning program.

**State:**
```typescript
class Course {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private title: string;
  private description?: string;
  private provider: string;
  private instructor?: string;

  private category: CourseCategory;
  private difficulty: CourseDifficulty;
  private estimatedDuration: number; // hours

  private enrolledAt?: Date;
  private startedAt?: Date;
  private completedAt?: Date;

  private progress: number = 0; // 0-100
  private status: CourseStatus;

  private modules: CourseModule[] = [];
  private certificate?: Certificate;

  private createdAt: Date;
  private updatedAt: Date;
}

enum CourseCategory {
  PROGRAMMING = 'programming',
  BUSINESS = 'business',
  DESIGN = 'design',
  MARKETING = 'marketing',
  LANGUAGES = 'languages',
  SCIENCE = 'science',
  PERSONAL_DEVELOPMENT = 'personal_development',
  OTHER = 'other'
}

enum CourseDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

enum CourseStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  DROPPED = 'dropped'
}
```

**Commands:**

```typescript
// Start course
start(): CourseStarted {
  if (this.status !== CourseStatus.NOT_STARTED) {
    throw new Error('Course already started');
  }

  this.status = CourseStatus.IN_PROGRESS;
  this.startedAt = new Date();

  return new CourseStarted({
    courseId: this.id,
    userId: this.userId,
    title: this.title,
    startedAt: this.startedAt
  });
}

// Update progress
updateProgress(moduleId: string, completed: boolean): ProgressUpdated {
  const module = this.modules.find(m => m.id === moduleId);
  if (!module) {
    throw new Error('Module not found');
  }

  module.completed = completed;
  this.recalculateProgress();

  // Check if course completed
  if (this.progress === 100 && this.status !== CourseStatus.COMPLETED) {
    this.status = CourseStatus.COMPLETED;
    this.completedAt = new Date();
  }

  return new ProgressUpdated({
    courseId: this.id,
    moduleId,
    moduleTitle: module.title,
    newProgress: this.progress,
    completed: this.status === CourseStatus.COMPLETED
  });
}

private recalculateProgress(): void {
  const completedModules = this.modules.filter(m => m.completed).length;
  this.progress = (completedModules / this.modules.length) * 100;
}
```

### LearningGoal (Aggregate Root)

**Description:** Personal learning objective with target date.

**State:**
```typescript
class LearningGoal {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private title: string;
  private description?: string;
  private category: CourseCategory;
  private targetDate: Date;

  private milestones: Milestone[] = [];
  private relatedCourses: string[] = []; // Course IDs

  private status: GoalStatus;
  private progress: number = 0; // 0-100

  private createdAt: Date;
  private updatedAt: Date;
}

enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
  ON_HOLD = 'on_hold'
}

interface Milestone {
  id: string;
  title: string;
  dueDate?: Date;
  completed: boolean;
  completedAt?: Date;
}
```

### StudySession (Aggregate Root)

**Description:** Tracked study or practice session.

**State:**
```typescript
class StudySession {
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  private courseId?: string;
  private goalId?: string;

  private startTime: Date;
  private endTime?: Date;
  private duration?: number; // minutes

  private topics: string[] = [];
  private notes?: string;
  private effectiveness: number = 0; // 1-5 rating

  private createdAt: Date;
}
```

## Domain Events

```typescript
interface CourseEnrolled extends DomainEvent {
  eventType: 'CourseEnrolled';
  payload: {
    courseId: string;
    userId: string;
    title: string;
    provider: string;
    enrolledAt: Date;
  };
}

interface CourseStarted extends DomainEvent {
  eventType: 'CourseStarted';
  payload: {
    courseId: string;
    userId: string;
    title: string;
    startedAt: Date;
  };
}

interface ProgressUpdated extends DomainEvent {
  eventType: 'ProgressUpdated';
  payload: {
    courseId: string;
    moduleId: string;
    moduleTitle: string;
    newProgress: number;
    completed: boolean;
  };
}

interface GoalCreated extends DomainEvent {
  eventType: 'GoalCreated';
  payload: {
    goalId: string;
    userId: string;
    title: string;
    targetDate: Date;
  };
}

interface MilestoneCompleted extends DomainEvent {
  eventType: 'MilestoneCompleted';
  payload: {
    goalId: string;
    milestoneId: string;
    milestoneTitle: string;
    completedAt: Date;
  };
}
```

## Proactive Triggers

The Learning Context emits the following **Proactive Triggers** to the Proactivity Context:

**Terminology Clarification:**
- **Data Signals:** Pull-based state data exposed via MCP (e.g., `learning.course_progress`, `learning.study_schedule`)
- **Domain Events:** Push-based state changes (e.g., `CourseEnrolled`, `ModuleCompleted`)
- **Proactive Triggers:** Derived opportunities from learning data analysis (below)

### 1. STUDY_SESSION_DUE
```typescript
{
  triggerType: 'STUDY_SESSION_DUE',
  courseId: string,
  courseTitle: string,
  daysSinceLastSession: number,
  recommendedDuration: number,
  confidence: number
}
```

### 2. GOAL_DEADLINE_APPROACHING
```typescript
{
  triggerType: 'GOAL_DEADLINE_APPROACHING',
  goalId: string,
  goalTitle: string,
  targetDate: Date,
  daysRemaining: number,
  progress: number,
  confidence: 1.0
}
```

### 3. COURSE_RECOMMENDATION
```typescript
{
  triggerType: 'COURSE_RECOMMENDATION',
  courseId: string,
  courseTitle: string,
  category: CourseCategory,
  reasoning: string,
  confidence: number
}
```

---

## Cross-Domain Integration

All four domains integrate with:

1. **Calendar Context:** Schedule appointments, study sessions, maintenance
2. **Finance Context:** Track expenses (healthcare, home maintenance, purchases, courses)
3. **Proactivity Context:** Emit signals for timely suggestions
4. **Audit Context:** Log all user decisions and actions

## Common Patterns

### Event-Driven Communication

All domains use domain events to communicate:
- Events published to Redis Pub/Sub
- Subscribers react asynchronously
- Event Store maintains complete history

### Anti-Corruption Layers

Each domain protects itself from external systems:
- Health: Medical records APIs
- Home: Smart device protocols (Zigbee, Z-Wave, Wi-Fi)
- Shopping: Retailer APIs
- Learning: Course provider APIs (Udemy, Coursera, etc.)

---

**End of Document**
