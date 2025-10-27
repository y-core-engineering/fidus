# Calendar Domain - Detailed Model

**Version:** 1.1
**Date:** 2025-10-27
**Status:** Draft
**Context:** Calendar Context (Domain)

## Overview

The Calendar Domain manages all aspects of time-based scheduling, appointments, and availability for users. It is responsible for creating, updating, and managing appointments while detecting conflicts and providing availability information.

**Relationship to Bounded Context:**
- This **domain model** defines WHAT the Calendar Context does (aggregates, events, rules)
- The **CalendarSupervisor** (architecture) defines HOW it's implemented (LangGraph state machine, MCP integrations)

---

## Multi-Tenancy Considerations

The Calendar Context operates with **tenant-level isolation** and **user-level data**:

| **Tenant Type** | **Calendar Capabilities** |
|-----------------|-------------------------|
| **INDIVIDUAL** | Personal calendar, basic conflict detection |
| **FAMILY** | Shared family calendar, family member availability |
| **TEAM** | Team calendars, shared availability, meeting room booking |
| **COMPANY** | Department calendars, resource management, advanced scheduling |

**Tenant-Specific Features:**
- **Community Tier:** 1 calendar, basic sync (1 external calendar)
- **Cloud Tier:** 3 calendars, advanced sync (3 external calendars), smart scheduling
- **Enterprise Tier:** Unlimited calendars, meeting room management, delegation, advanced analytics

**Data Isolation:**
- All appointments scoped to `tenantId` and `userId`
- Availability queries respect tenant boundaries
- Shared calendars (family/team) use tenant-level permissions
- External calendar sync credentials tenant-isolated

---

## Domain Concepts

### Core Entities

#### 1. Appointment (Aggregate Root)

**Description:** A scheduled event in the user's calendar with a specific time slot, location, and participants.

**Invariants:**
- End time must be after start time
- Cannot modify cancelled appointments
- At least one participant (the owner) must be present
- Title cannot be empty

**State:**
```typescript
class Appointment {
  // Identity
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  // Core attributes
  private title: string;
  private description?: string;
  private timeSlot: TimeSlot; // Value Object
  private location?: Location; // Value Object

  // Participants
  private participants: Participant[] = [];
  private organizer: Participant;

  // External sync
  private externalId?: string;
  private externalProvider?: 'google' | 'outlook' | 'apple';

  // State
  private status: AppointmentStatus;
  private recurrence?: RecurrenceRule; // Value Object
  private reminder?: Reminder; // Value Object

  // Metadata
  private createdAt: Date;
  private updatedAt: Date;
}

enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}
```

**Commands:**

```typescript
// Create new appointment
create(data: CreateAppointmentData): AppointmentCreated {
  // Validate time slot
  if (!this.timeSlot.isValid()) {
    throw new Error('Invalid time slot');
  }

  // Set initial status
  this.status = AppointmentStatus.SCHEDULED;

  return new AppointmentCreated({
    appointmentId: this.id,
    userId: this.userId,
    title: this.title,
    startTime: this.timeSlot.start,
    endTime: this.timeSlot.end,
    location: this.location?.toString(),
    participants: this.participants.map(p => p.email.value)
  });
}

// Update appointment
update(changes: Partial<AppointmentData>): AppointmentUpdated {
  // Invariant: Cannot update cancelled appointment
  if (this.status === AppointmentStatus.CANCELLED) {
    throw new Error('Cannot update cancelled appointment');
  }

  // Apply changes
  if (changes.title) this.title = changes.title;
  if (changes.startTime || changes.endTime) {
    this.timeSlot = TimeSlot.create(
      changes.startTime || this.timeSlot.start,
      changes.endTime || this.timeSlot.end
    );
  }

  this.updatedAt = new Date();

  return new AppointmentUpdated({
    appointmentId: this.id,
    changes
  });
}

// Cancel appointment
cancel(reason?: string): AppointmentCancelled {
  if (this.status === AppointmentStatus.CANCELLED) {
    throw new Error('Appointment already cancelled');
  }

  this.status = AppointmentStatus.CANCELLED;

  return new AppointmentCancelled({
    appointmentId: this.id,
    cancelledAt: new Date(),
    reason
  });
}

// Confirm appointment
confirm(): AppointmentConfirmed {
  if (this.status !== AppointmentStatus.SCHEDULED) {
    throw new Error('Can only confirm scheduled appointments');
  }

  this.status = AppointmentStatus.CONFIRMED;

  return new AppointmentConfirmed({
    appointmentId: this.id,
    confirmedAt: new Date()
  });
}

// Add participant
addParticipant(email: EmailAddress): ParticipantAdded {
  // Check if already added
  if (this.participants.some(p => p.email.equals(email))) {
    throw new Error('Participant already added');
  }

  const participant = new Participant(email);
  this.participants.push(participant);

  return new ParticipantAdded({
    appointmentId: this.id,
    participantEmail: email.value
  });
}

// Remove participant
removeParticipant(email: EmailAddress): ParticipantRemoved {
  // Cannot remove organizer
  if (this.organizer.email.equals(email)) {
    throw new Error('Cannot remove organizer');
  }

  this.participants = this.participants.filter(
    p => !p.email.equals(email)
  );

  return new ParticipantRemoved({
    appointmentId: this.id,
    participantEmail: email.value
  });
}
```

**Queries:**

```typescript
// Check if conflicts with another appointment
conflictsWith(other: Appointment): boolean {
  return this.timeSlot.overlapsWith(other.timeSlot);
}

// Check if starts soon
startsSoon(threshold: number = 15): boolean {
  const now = new Date();
  const minutesUntilStart =
    (this.timeSlot.start.getTime() - now.getTime()) / (1000 * 60);
  return minutesUntilStart <= threshold && minutesUntilStart > 0;
}

// Check if all-day event
isAllDay(): boolean {
  return this.timeSlot.isAllDay();
}

// Get duration in minutes
getDurationMinutes(): number {
  return this.timeSlot.getDurationMinutes();
}
```

#### 2. Availability (Aggregate Root)

**Description:** Represents a user's available time slots for scheduling.

**Invariants:**
- Available slots cannot overlap
- Available time must be in the future
- Working hours must be consistent per day

**State:**
```typescript
class Availability {
  private readonly userId: string;
  private readonly tenantId: string;

  // Working hours per weekday
  private workingHours: Map<Weekday, WorkingHours>;

  // Explicit available slots
  private availableSlots: TimeSlot[] = [];

  // Blocked time (e.g., lunch, breaks)
  private blockedSlots: TimeSlot[] = [];

  // Preferences
  private preferences: AvailabilityPreferences;
}

interface WorkingHours {
  start: Time; // Value Object: { hour: number, minute: number }
  end: Time;
  isWorkingDay: boolean;
}

interface AvailabilityPreferences {
  minimumBookingNotice: number; // minutes
  maximumBookingAdvance: number; // days
  bufferBetweenAppointments: number; // minutes
  allowBackToBack: boolean;
}
```

**Commands:**

```typescript
// Set working hours for a day
setWorkingHours(
  weekday: Weekday,
  start: Time,
  end: Time
): WorkingHoursUpdated {
  // Validate times
  if (end.isBefore(start)) {
    throw new Error('End time must be after start time');
  }

  this.workingHours.set(weekday, {
    start,
    end,
    isWorkingDay: true
  });

  return new WorkingHoursUpdated({
    userId: this.userId,
    weekday,
    start: start.toString(),
    end: end.toString()
  });
}

// Block time slot
blockTimeSlot(slot: TimeSlot, reason: string): TimeSlotBlocked {
  // Check for overlaps
  if (this.hasOverlappingBlock(slot)) {
    throw new Error('Time slot overlaps with existing block');
  }

  this.blockedSlots.push(slot);

  return new TimeSlotBlocked({
    userId: this.userId,
    startTime: slot.start,
    endTime: slot.end,
    reason
  });
}

// Find available slots
findAvailableSlots(
  startDate: Date,
  endDate: Date,
  duration: number // minutes
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  // Iterate through each day
  let currentDate = startDate;
  while (currentDate <= endDate) {
    const weekday = this.getWeekday(currentDate);
    const workingHours = this.workingHours.get(weekday);

    if (workingHours?.isWorkingDay) {
      // Find slots within working hours that aren't blocked
      const daySlots = this.findDaySlots(
        currentDate,
        workingHours,
        duration
      );
      slots.push(...daySlots);
    }

    currentDate = this.addDays(currentDate, 1);
  }

  return slots;
}
```

### Value Objects

#### TimeSlot

```typescript
class TimeSlot {
  private constructor(
    public readonly start: Date,
    public readonly end: Date
  ) {}

  static create(start: Date, end: Date): TimeSlot {
    // Invariant: End must be after start
    if (end <= start) {
      throw new Error('End time must be after start time');
    }
    return new TimeSlot(start, end);
  }

  overlapsWith(other: TimeSlot): boolean {
    return this.start < other.end && this.end > other.start;
  }

  contains(time: Date): boolean {
    return time >= this.start && time < this.end;
  }

  getDurationMinutes(): number {
    return (this.end.getTime() - this.start.getTime()) / (1000 * 60);
  }

  isAllDay(): boolean {
    return this.getDurationMinutes() >= 24 * 60;
  }

  isValid(): boolean {
    return this.end > this.start;
  }

  toString(): string {
    return `${this.start.toISOString()} - ${this.end.toISOString()}`;
  }
}
```

#### Location

```typescript
class Location {
  private constructor(
    public readonly address?: string,
    public readonly coordinates?: Coordinates,
    public readonly type?: LocationType
  ) {}

  static createPhysical(address: string): Location {
    return new Location(address, undefined, LocationType.PHYSICAL);
  }

  static createVirtual(url: string): Location {
    return new Location(url, undefined, LocationType.VIRTUAL);
  }

  static createCoordinates(lat: number, lng: number): Location {
    return new Location(
      undefined,
      new Coordinates(lat, lng),
      LocationType.PHYSICAL
    );
  }

  isVirtual(): boolean {
    return this.type === LocationType.VIRTUAL;
  }

  toString(): string {
    return this.address || this.coordinates?.toString() || 'No location';
  }
}

enum LocationType {
  PHYSICAL = 'physical',
  VIRTUAL = 'virtual'
}

class Coordinates {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number
  ) {
    if (latitude < -90 || latitude > 90) {
      throw new Error('Invalid latitude');
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error('Invalid longitude');
    }
  }

  toString(): string {
    return `${this.latitude},${this.longitude}`;
  }
}
```

#### Participant

```typescript
class Participant {
  constructor(
    public readonly email: EmailAddress,
    public readonly status: ParticipantStatus = ParticipantStatus.PENDING,
    public readonly isOrganizer: boolean = false
  ) {}

  accept(): Participant {
    return new Participant(this.email, ParticipantStatus.ACCEPTED, this.isOrganizer);
  }

  decline(): Participant {
    return new Participant(this.email, ParticipantStatus.DECLINED, this.isOrganizer);
  }

  tentative(): Participant {
    return new Participant(this.email, ParticipantStatus.TENTATIVE, this.isOrganizer);
  }
}

enum ParticipantStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  TENTATIVE = 'tentative'
}
```

#### RecurrenceRule

```typescript
class RecurrenceRule {
  constructor(
    public readonly frequency: RecurrenceFrequency,
    public readonly interval: number = 1,
    public readonly until?: Date,
    public readonly count?: number,
    public readonly byDay?: Weekday[]
  ) {
    if (interval < 1) {
      throw new Error('Interval must be at least 1');
    }
    if (count && count < 1) {
      throw new Error('Count must be at least 1');
    }
  }

  static daily(): RecurrenceRule {
    return new RecurrenceRule(RecurrenceFrequency.DAILY);
  }

  static weekly(days: Weekday[]): RecurrenceRule {
    return new RecurrenceRule(
      RecurrenceFrequency.WEEKLY,
      1,
      undefined,
      undefined,
      days
    );
  }

  static monthly(): RecurrenceRule {
    return new RecurrenceRule(RecurrenceFrequency.MONTHLY);
  }

  generateOccurrences(
    startDate: Date,
    originalDuration: number
  ): TimeSlot[] {
    const occurrences: TimeSlot[] = [];
    let currentDate = startDate;
    let occurrenceCount = 0;

    while (
      (!this.until || currentDate <= this.until) &&
      (!this.count || occurrenceCount < this.count)
    ) {
      occurrences.push(
        TimeSlot.create(
          currentDate,
          new Date(currentDate.getTime() + originalDuration)
        )
      );

      currentDate = this.getNextOccurrence(currentDate);
      occurrenceCount++;
    }

    return occurrences;
  }

  private getNextOccurrence(current: Date): Date {
    switch (this.frequency) {
      case RecurrenceFrequency.DAILY:
        return this.addDays(current, this.interval);
      case RecurrenceFrequency.WEEKLY:
        return this.addDays(current, 7 * this.interval);
      case RecurrenceFrequency.MONTHLY:
        return this.addMonths(current, this.interval);
      case RecurrenceFrequency.YEARLY:
        return this.addYears(current, this.interval);
    }
  }
}

enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

enum Weekday {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}
```

#### Reminder

```typescript
class Reminder {
  constructor(
    public readonly method: ReminderMethod,
    public readonly minutesBefore: number
  ) {
    if (minutesBefore < 0) {
      throw new Error('Minutes before must be non-negative');
    }
  }

  static create(method: ReminderMethod, minutesBefore: number): Reminder {
    return new Reminder(method, minutesBefore);
  }

  getNotificationTime(appointmentStart: Date): Date {
    return new Date(
      appointmentStart.getTime() - this.minutesBefore * 60 * 1000
    );
  }
}

enum ReminderMethod {
  NOTIFICATION = 'notification',
  EMAIL = 'email',
  SMS = 'sms'
}
```

## Domain Events

### Appointment Events

```typescript
interface AppointmentCreated extends DomainEvent {
  eventType: 'AppointmentCreated';
  aggregateType: 'Appointment';
  payload: {
    appointmentId: string;
    userId: string;
    title: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    participants: string[];
    recurrence?: RecurrenceRule;
  };
}

interface AppointmentUpdated extends DomainEvent {
  eventType: 'AppointmentUpdated';
  aggregateType: 'Appointment';
  payload: {
    appointmentId: string;
    changes: Partial<AppointmentData>;
  };
}

interface AppointmentCancelled extends DomainEvent {
  eventType: 'AppointmentCancelled';
  aggregateType: 'Appointment';
  payload: {
    appointmentId: string;
    cancelledAt: Date;
    reason?: string;
  };
}

interface AppointmentConfirmed extends DomainEvent {
  eventType: 'AppointmentConfirmed';
  aggregateType: 'Appointment';
  payload: {
    appointmentId: string;
    confirmedAt: Date;
  };
}

interface AppointmentStartsSoon extends DomainEvent {
  eventType: 'AppointmentStartsSoon';
  aggregateType: 'Appointment';
  payload: {
    appointmentId: string;
    startTime: Date;
    minutesUntilStart: number;
    title: string;
    location?: string;
  };
}

interface ConflictDetected extends DomainEvent {
  eventType: 'ConflictDetected';
  aggregateType: 'Appointment';
  payload: {
    appointmentId1: string;
    appointmentId2: string;
    overlapStart: Date;
    overlapEnd: Date;
  };
}
```

### Availability Events

```typescript
interface WorkingHoursUpdated extends DomainEvent {
  eventType: 'WorkingHoursUpdated';
  aggregateType: 'Availability';
  payload: {
    userId: string;
    weekday: Weekday;
    start: string;
    end: string;
  };
}

interface TimeSlotBlocked extends DomainEvent {
  eventType: 'TimeSlotBlocked';
  aggregateType: 'Availability';
  payload: {
    userId: string;
    startTime: Date;
    endTime: Date;
    reason: string;
  };
}
```

## Proactive Triggers

The Calendar Context emits the following **Proactive Triggers** to the Proactivity Context. These are opportunities detected from calendar data that may warrant user notification:

**Terminology Clarification:**
- **Data Signals:** Pull-based state data exposed via MCP (e.g., `calendar.free_slots`)
- **Domain Events:** Push-based state changes (e.g., `AppointmentCreated`, `ConflictDetected`)
- **Proactive Triggers:** Derived opportunities from data analysis (below)

### 1. MISSING_ALARM
**Trigger:** Early morning appointment (before 9 AM) detected without a reminder
**Data:**
```typescript
{
  triggerType: 'MISSING_ALARM',
  opportunityType: OpportunityType.TIME_SENSITIVE,
  appointmentId: string,
  startTime: Date,
  title: string,
  confidence: number
}
```

### 2. TRAVEL_NEEDED
**Trigger:** Appointment location is different from user's current location
**Data:**
```typescript
{
  triggerType: 'TRAVEL_NEEDED',
  opportunityType: OpportunityType.TIME_SENSITIVE,
  appointmentId: string,
  appointmentLocation: string,
  appointmentTime: Date,
  estimatedTravelTime: number,
  confidence: number
}
```

### 3. DOUBLE_BOOKING
**Trigger:** Two appointments overlap
**Data:**
```typescript
{
  triggerType: 'DOUBLE_BOOKING',
  opportunityType: OpportunityType.URGENT,
  appointment1Id: string,
  appointment2Id: string,
  overlapDuration: number,
  confidence: 1.0 // Always certain
}
```

### 4. PREP_TIME_NEEDED
**Trigger:** Back-to-back appointments detected
**Data:**
```typescript
{
  triggerType: 'PREP_TIME_NEEDED',
  opportunityType: OpportunityType.OPTIMIZATION,
  appointment1Id: string,
  appointment2Id: string,
  gapMinutes: number,
  confidence: number
}
```

**Note:** These triggers are sent to the Proactivity Context which evaluates them against user preferences and creates Suggestions if appropriate.

## Business Rules

### Appointment Rules

1. **No Overlapping Appointments:** User cannot have two appointments at the same time
   - **Exception:** Multi-calendar scenarios (work + personal)

2. **Minimum Appointment Duration:** 15 minutes
   - **Rationale:** Shorter meetings are ineffective

3. **Maximum Appointment Duration:** 8 hours
   - **Rationale:** Longer than a work day

4. **Cancellation Window:** Appointments can be cancelled up to start time
   - **Note:** Past appointments cannot be cancelled, only marked as "no-show"

5. **Recurring Appointment Limit:** Maximum 365 occurrences
   - **Rationale:** Performance and reasonable use case

### Availability Rules

1. **Working Hours Range:** Between 00:00 and 24:00
   - **Validation:** End time must be after start time

2. **Minimum Booking Notice:** Configurable per user (default: 30 minutes)
   - **Prevents:** Last-minute scheduling chaos

3. **Buffer Time:** Configurable gap between appointments (default: 5 minutes)
   - **Purpose:** Travel, prep, bio breaks

## Integration Patterns

### External Calendar Sync (Anti-Corruption Layer)

```typescript
class GoogleCalendarACL {
  async importEvent(googleEventId: string): Promise<Appointment> {
    const googleEvent = await this.mcpClient.callTool('getEvent', {
      eventId: googleEventId
    });

    // Translate Google's model to our domain model
    return new Appointment(
      generateId(),
      this.userId,
      this.tenantId,
      googleEvent.summary,
      new Date(googleEvent.start.dateTime),
      new Date(googleEvent.end.dateTime)
    ).tap(appointment => {
      if (googleEvent.location) {
        appointment.setLocation(
          Location.createPhysical(googleEvent.location)
        );
      }

      if (googleEvent.attendees) {
        googleEvent.attendees.forEach(attendee => {
          appointment.addParticipant(
            EmailAddress.create(attendee.email)
          );
        });
      }

      // Store external ID for sync
      appointment.setExternalId(googleEventId, 'google');
    });
  }

  async exportEvent(appointment: Appointment): Promise<string> {
    // Translate our domain model to Google's format
    const googleEvent = {
      summary: appointment.getTitle(),
      start: {
        dateTime: appointment.getStartTime().toISOString()
      },
      end: {
        dateTime: appointment.getEndTime().toISOString()
      },
      location: appointment.getLocation()?.toString(),
      attendees: appointment.getParticipants().map(p => ({
        email: p.email.value
      }))
    };

    const result = await this.mcpClient.callTool('createEvent', googleEvent);
    return result.id;
  }
}
```

### Conflict Detection (Domain Service)

```typescript
class ConflictDetectionService {
  async detectConflicts(
    appointment: Appointment,
    existingAppointments: Appointment[]
  ): Promise<ConflictDetected[]> {
    const conflicts: ConflictDetected[] = [];

    for (const existing of existingAppointments) {
      if (appointment.conflictsWith(existing)) {
        conflicts.push(
          new ConflictDetected({
            appointmentId1: appointment.getId(),
            appointmentId2: existing.getId(),
            overlapStart: this.getOverlapStart(appointment, existing),
            overlapEnd: this.getOverlapEnd(appointment, existing)
          })
        );
      }
    }

    return conflicts;
  }
}
```

## Use Cases

### 1. Create Appointment

**Actor:** User (via Orchestrator)

**Flow:**
1. Orchestrator sends CreateAppointment command to Calendar Supervisor
2. Calendar Supervisor creates Appointment aggregate
3. Appointment validates invariants
4. AppointmentCreated event emitted
5. Conflict Detection Service checks for overlaps
6. If conflict: ConflictDetected event emitted → Signal sent to Proactivity
7. If no reminder: MISSING_ALARM signal sent to Proactivity
8. If travel needed: TRAVEL_NEEDED signal sent to Proactivity

### 2. Update Appointment

**Actor:** User (via Orchestrator)

**Flow:**
1. Orchestrator sends UpdateAppointment command
2. Calendar Supervisor loads Appointment aggregate
3. Appointment validates changes
4. AppointmentUpdated event emitted
5. Re-run conflict detection if time changed
6. Update external calendar if synced

### 3. Find Available Slots

**Actor:** User or Travel Context (looking for meeting times)

**Flow:**
1. Query sent to Calendar Supervisor
2. Load user's Availability aggregate
3. Load user's existing appointments
4. Calculate free slots within working hours
5. Exclude blocked time
6. Return available TimeSlots

### 4. Sync with External Calendar

**Actor:** System (scheduled job)

**Flow:**
1. Fetch events from external provider (via MCP)
2. GoogleCalendarACL translates events
3. Compare with existing appointments
4. Create/Update/Delete appointments as needed
5. Emit appropriate domain events

## Persistence

### Appointment Repository

```typescript
interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  findById(id: string): Promise<Appointment | null>;
  findByUserId(userId: string): Promise<Appointment[]>;
  findByTimeRange(
    userId: string,
    start: Date,
    end: Date
  ): Promise<Appointment[]>;
  delete(id: string): Promise<void>;
}
```

### Availability Repository

```typescript
interface AvailabilityRepository {
  save(availability: Availability): Promise<void>;
  findByUserId(userId: string): Promise<Availability | null>;
}
```

## Testing Strategy

### Unit Tests (Aggregates)

```typescript
describe('Appointment', () => {
  it('should create valid appointment', () => {
    const appointment = new Appointment(
      'id-1',
      'user-1',
      'tenant-1',
      'Team Meeting',
      new Date('2025-01-15T10:00:00Z'),
      new Date('2025-01-15T11:00:00Z')
    );

    expect(appointment.getTitle()).toBe('Team Meeting');
    expect(appointment.getStatus()).toBe(AppointmentStatus.SCHEDULED);
  });

  it('should detect conflict with overlapping appointment', () => {
    const appointment1 = createAppointment('10:00', '11:00');
    const appointment2 = createAppointment('10:30', '11:30');

    expect(appointment1.conflictsWith(appointment2)).toBe(true);
  });

  it('should not allow updating cancelled appointment', () => {
    const appointment = createAppointment('10:00', '11:00');
    appointment.cancel();

    expect(() => appointment.update({ title: 'New Title' }))
      .toThrow('Cannot update cancelled appointment');
  });
});
```

### Integration Tests (Event Flow)

```typescript
describe('Appointment Event Flow', () => {
  it('should emit ConflictDetected when overlap occurs', async () => {
    // Arrange
    const existing = await createAndSaveAppointment('10:00', '11:00');
    const newAppointment = createAppointment('10:30', '11:30');

    // Act
    await calendarSupervisor.createAppointment(newAppointment);

    // Assert
    const events = await eventStore.getEvents();
    expect(events).toContainEventType('ConflictDetected');
  });
});
```

## Performance Considerations

1. **Conflict Detection:** O(n) where n = number of appointments
   - **Optimization:** Index on userId + timeRange
   - **Caching:** Cache recent appointments in Redis

2. **Availability Calculation:** Can be expensive for large date ranges
   - **Limit:** Maximum 90 days look-ahead
   - **Optimization:** Pre-calculate availability slots daily

3. **Recurring Appointments:** Can generate many occurrences
   - **Limit:** Maximum 365 occurrences per rule
   - **Lazy Generation:** Generate on-demand, not upfront

## Future Considerations

1. **Multi-Calendar Support:** User has work + personal calendars
2. **Scheduling Links:** Shareable availability URLs (like Calendly)
3. **Meeting Room Booking:** Physical resource management
4. **Time Zone Handling:** Better support for global teams
5. **Smart Scheduling:** AI suggests optimal meeting times

---

**End of Document**
