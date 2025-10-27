# Travel Domain - Detailed Model

**Version:** 1.1
**Date:** 2025-10-27
**Status:** Draft
**Context:** Travel Context (Domain)

## Overview

The Travel Domain manages all aspects of trip planning, bookings, itineraries, and travel-related logistics. It coordinates with Calendar, Finance, and other contexts to provide a seamless travel experience.

**Relationship to Bounded Context:**
- This **domain model** defines WHAT the Travel Context does (aggregates, events, rules)
- The **TravelSupervisor** (architecture) defines HOW it's implemented (LangGraph state machine, booking API integrations)

---

## Multi-Tenancy Considerations

The Travel Context operates with **tenant-level isolation** and **user-level travel data**:

| **Tenant Type** | **Travel Capabilities** |
|-----------------|-------------------------|
| **INDIVIDUAL** | Personal trips, simple itineraries, basic booking tracking |
| **FAMILY** | Family trips, shared itineraries, group bookings |
| **TEAM** | Business travel, expense tracking, approval workflows, travel policies |
| **COMPANY** | Corporate travel management, negotiated rates, policy enforcement, travel analytics |

**Tenant-Specific Features:**
- **Community Tier:** 2 active trips, manual booking entry, basic itineraries
- **Cloud Tier:** 10 active trips, booking API integration, smart recommendations, real-time updates
- **Enterprise Tier:** Unlimited trips, corporate travel integrations (Concur, SAP), policy compliance, approval workflows, travel analytics

**Data Isolation:**
- All trips scoped to `tenantId` and `userId`
- Booking data tenant-isolated
- Travel documents encrypted per-user with tenant-specific keys
- Shared trips (family/team) use tenant-level permissions

---

## Domain Concepts

### Core Entities

#### 1. Trip (Aggregate Root)

**Description:** A complete travel plan from departure to return, potentially including multiple destinations and bookings.

**Invariants:**
- Return date must be after departure date
- At least one destination required
- Cannot modify completed trips
- All bookings must fall within trip dates

**State:**
```typescript
class Trip {
  // Identity
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  // Core attributes
  private title: string;
  private purpose: TripPurpose;
  private startDate: Date;
  private endDate: Date;

  // Destinations
  private destinations: Destination[] = [];
  private currentDestinationIndex: number = 0;

  // Bookings
  private bookingIds: string[] = []; // References to Booking aggregates

  // Participants
  private travelers: Traveler[] = [];

  // Planning
  private status: TripStatus;
  private budget?: Money; // Optional trip budget
  private actualCost: Money;

  // Documents
  private documents: TravelDocument[] = [];

  // Metadata
  private createdAt: Date;
  private updatedAt: Date;
}

enum TripPurpose {
  BUSINESS = 'business',
  LEISURE = 'leisure',
  MIXED = 'mixed',
  FAMILY = 'family',
  EDUCATION = 'education',
  OTHER = 'other'
}

enum TripStatus {
  PLANNING = 'planning',
  BOOKED = 'booked',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

**Commands:**

```typescript
// Plan new trip
plan(data: PlanTripData): TripPlanned {
  // Validate dates
  if (this.endDate <= this.startDate) {
    throw new Error('End date must be after start date');
  }

  // Validate destinations
  if (this.destinations.length === 0) {
    throw new Error('At least one destination required');
  }

  this.status = TripStatus.PLANNING;
  this.actualCost = Money.zero(Currency.create('EUR'));

  return new TripPlanned({
    tripId: this.id,
    userId: this.userId,
    title: this.title,
    purpose: this.purpose,
    startDate: this.startDate,
    endDate: this.endDate,
    destinations: this.destinations.map(d => d.location.toString())
  });
}

// Add destination
addDestination(destination: Destination): DestinationAdded {
  // Validate destination dates within trip dates
  if (destination.arrivalDate < this.startDate ||
      destination.departureDate > this.endDate) {
    throw new Error('Destination dates must be within trip dates');
  }

  this.destinations.push(destination);

  return new DestinationAdded({
    tripId: this.id,
    location: destination.location.toString(),
    arrivalDate: destination.arrivalDate,
    departureDate: destination.departureDate
  });
}

// Add booking
addBooking(bookingId: string, booking: Booking): BookingAddedToTrip {
  // Validate booking dates within trip dates
  if (!this.isWithinTripDates(booking.getStartDate(), booking.getEndDate())) {
    throw new Error('Booking dates must be within trip dates');
  }

  this.bookingIds.push(bookingId);
  this.actualCost = this.actualCost.add(booking.getCost());

  // Check if fully booked
  if (this.isFullyBooked()) {
    this.status = TripStatus.BOOKED;
  }

  return new BookingAddedToTrip({
    tripId: this.id,
    bookingId,
    bookingType: booking.getType(),
    cost: booking.getCost().amount
  });
}

// Start trip
start(): TripStarted {
  if (this.status !== TripStatus.BOOKED) {
    throw new Error('Can only start booked trips');
  }

  this.status = TripStatus.IN_PROGRESS;
  this.currentDestinationIndex = 0;

  return new TripStarted({
    tripId: this.id,
    startedAt: new Date(),
    firstDestination: this.destinations[0].location.toString()
  });
}

// Move to next destination
moveToNextDestination(): DestinationReached {
  if (this.currentDestinationIndex >= this.destinations.length - 1) {
    throw new Error('Already at last destination');
  }

  this.currentDestinationIndex++;
  const currentDestination = this.destinations[this.currentDestinationIndex];

  return new DestinationReached({
    tripId: this.id,
    location: currentDestination.location.toString(),
    reachedAt: new Date()
  });
}

// Complete trip
complete(): TripCompleted {
  if (this.status !== TripStatus.IN_PROGRESS) {
    throw new Error('Can only complete in-progress trips');
  }

  this.status = TripStatus.COMPLETED;

  return new TripCompleted({
    tripId: this.id,
    completedAt: new Date(),
    totalCost: this.actualCost.amount,
    destinationsVisited: this.destinations.length
  });
}

// Cancel trip
cancel(reason?: string): TripCancelled {
  if (this.status === TripStatus.COMPLETED) {
    throw new Error('Cannot cancel completed trip');
  }

  this.status = TripStatus.CANCELLED;

  return new TripCancelled({
    tripId: this.id,
    cancelledAt: new Date(),
    reason,
    refundAmount: this.calculateRefund()
  });
}

// Add travel document
addDocument(document: TravelDocument): DocumentAddedToTrip {
  // Check for duplicates
  if (this.hasDocument(document.type, document.documentNumber)) {
    throw new Error('Document already added');
  }

  this.documents.push(document);

  return new DocumentAddedToTrip({
    tripId: this.id,
    documentType: document.type,
    documentNumber: document.documentNumber,
    expiryDate: document.expiryDate
  });
}
```

**Queries:**

```typescript
// Get current destination
getCurrentDestination(): Destination | null {
  if (this.status !== TripStatus.IN_PROGRESS) {
    return null;
  }
  return this.destinations[this.currentDestinationIndex];
}

// Check if fully booked
isFullyBooked(): boolean {
  // Heuristic: Has flight/train AND accommodation
  const bookingTypes = this.bookingIds.map(id =>
    this.getBookingType(id)
  );

  const hasTransport = bookingTypes.some(t =>
    t === BookingType.FLIGHT || t === BookingType.TRAIN
  );
  const hasAccommodation = bookingTypes.some(t =>
    t === BookingType.ACCOMMODATION
  );

  return hasTransport && hasAccommodation;
}

// Check if within budget
isWithinBudget(): boolean {
  if (!this.budget) return true;
  return this.actualCost.amount <= this.budget.amount;
}

// Check if budget exceeded
isBudgetExceeded(): boolean {
  if (!this.budget) return false;
  return this.actualCost.amount > this.budget.amount;
}

// Get remaining budget
getRemainingBudget(): Money | null {
  if (!this.budget) return null;
  const remaining = this.budget.amount - this.actualCost.amount;
  return Money.create(
    Math.max(0, remaining),
    this.budget.currency.code
  );
}

// Get trip duration in days
getDurationDays(): number {
  const diff = this.endDate.getTime() - this.startDate.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Check if document exists
hasDocument(type: DocumentType, number: string): boolean {
  return this.documents.some(d =>
    d.type === type && d.documentNumber === number
  );
}

// Check for expiring documents
getExpiringDocuments(withinDays: number = 30): TravelDocument[] {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + withinDays);

  return this.documents.filter(d =>
    d.expiryDate && d.expiryDate <= threshold
  );
}
```

#### 2. Booking (Aggregate Root)

**Description:** A confirmed reservation for travel services (flight, hotel, car rental, etc.).

**Invariants:**
- Booking must have a confirmation number
- Cost must be positive
- Cannot modify confirmed bookings without cancellation
- Check-in date before check-out date (for accommodations)

**State:**
```typescript
class Booking {
  // Identity
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;
  private readonly tripId?: string; // Optional link to Trip

  // Core attributes
  private type: BookingType;
  private confirmationNumber: string;
  private provider: string;
  private cost: Money;

  // Dates
  private startDate: Date;
  private endDate: Date;

  // Details (type-specific)
  private details: BookingDetails;

  // Status
  private status: BookingStatus;
  private cancellationPolicy?: CancellationPolicy;

  // Documents
  private attachments: string[] = []; // URLs to tickets, vouchers, etc.

  // Metadata
  private bookedAt: Date;
  private updatedAt: Date;
}

enum BookingType {
  FLIGHT = 'flight',
  TRAIN = 'train',
  BUS = 'bus',
  ACCOMMODATION = 'accommodation',
  CAR_RENTAL = 'car_rental',
  ACTIVITY = 'activity',
  OTHER = 'other'
}

enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

type BookingDetails =
  | FlightDetails
  | AccommodationDetails
  | CarRentalDetails
  | ActivityDetails;
```

**Commands:**

```typescript
// Book travel service
book(data: BookTravelData): TravelBooked {
  // Validate cost
  if (this.cost.amount <= 0) {
    throw new Error('Booking cost must be positive');
  }

  // Validate dates
  if (this.endDate <= this.startDate) {
    throw new Error('End date must be after start date');
  }

  this.status = BookingStatus.CONFIRMED;
  this.bookedAt = new Date();

  return new TravelBooked({
    bookingId: this.id,
    userId: this.userId,
    tripId: this.tripId,
    type: this.type,
    provider: this.provider,
    confirmationNumber: this.confirmationNumber,
    cost: this.cost.amount,
    currency: this.cost.currency.code,
    startDate: this.startDate,
    endDate: this.endDate
  });
}

// Check in
checkIn(): BookingCheckedIn {
  if (this.status !== BookingStatus.CONFIRMED) {
    throw new Error('Can only check in to confirmed bookings');
  }

  this.status = BookingStatus.CHECKED_IN;

  return new BookingCheckedIn({
    bookingId: this.id,
    type: this.type,
    checkedInAt: new Date()
  });
}

// Cancel booking
cancel(reason?: string): BookingCancelled {
  if (this.status === BookingStatus.COMPLETED) {
    throw new Error('Cannot cancel completed booking');
  }

  const refund = this.calculateRefund();
  this.status = BookingStatus.CANCELLED;

  return new BookingCancelled({
    bookingId: this.id,
    cancelledAt: new Date(),
    reason,
    refundAmount: refund.amount
  });
}

// Add attachment
addAttachment(url: string, type: AttachmentType): AttachmentAdded {
  this.attachments.push(url);

  return new AttachmentAdded({
    bookingId: this.id,
    attachmentUrl: url,
    attachmentType: type
  });
}
```

**Queries:**

```typescript
// Check if refundable
isRefundable(): boolean {
  if (!this.cancellationPolicy) return false;
  return this.cancellationPolicy.isRefundable(new Date());
}

// Calculate refund amount
calculateRefund(): Money {
  if (!this.cancellationPolicy) {
    return Money.zero(this.cost.currency);
  }

  const refundPercentage = this.cancellationPolicy.getRefundPercentage(
    new Date()
  );
  return this.cost.multiply(refundPercentage / 100);
}

// Check if starts soon
startsSoon(thresholdHours: number = 24): boolean {
  const now = new Date();
  const hoursUntilStart =
    (this.startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilStart <= thresholdHours && hoursUntilStart > 0;
}
```

### Value Objects

#### Destination

```typescript
class Destination {
  constructor(
    public readonly location: Location,
    public readonly arrivalDate: Date,
    public readonly departureDate: Date,
    public readonly accommodation?: string,
    public readonly notes?: string
  ) {
    if (departureDate <= arrivalDate) {
      throw new Error('Departure must be after arrival');
    }
  }

  getDurationDays(): number {
    const diff = this.departureDate.getTime() - this.arrivalDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  includes(date: Date): boolean {
    return date >= this.arrivalDate && date <= this.departureDate;
  }
}
```

#### Location

```typescript
class Location {
  constructor(
    public readonly city: string,
    public readonly country: string,
    public readonly countryCode: string, // ISO 3166-1 alpha-2
    public readonly coordinates?: Coordinates,
    public readonly timezone?: string
  ) {
    if (!city || !country) {
      throw new Error('City and country are required');
    }
  }

  static create(city: string, country: string): Location {
    return new Location(city, country, this.getCountryCode(country));
  }

  toString(): string {
    return `${this.city}, ${this.country}`;
  }

  equals(other: Location): boolean {
    return (
      this.city.toLowerCase() === other.city.toLowerCase() &&
      this.countryCode === other.countryCode
    );
  }

  private static getCountryCode(country: string): string {
    // Simple mapping - in production, use a proper library
    const countryCodeMap: Record<string, string> = {
      'Germany': 'DE',
      'United States': 'US',
      'United Kingdom': 'GB',
      'France': 'FR',
      'Spain': 'ES',
      'Italy': 'IT',
      // ... more countries
    };
    return countryCodeMap[country] || 'XX';
  }
}
```

#### Traveler

```typescript
class Traveler {
  constructor(
    public readonly name: string,
    public readonly email: EmailAddress,
    public readonly dateOfBirth?: Date,
    public readonly passportNumber?: string,
    public readonly nationality?: string
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error('Traveler name is required');
    }
  }

  isAdult(): boolean {
    if (!this.dateOfBirth) return true;
    const age = this.getAge();
    return age >= 18;
  }

  getAge(): number {
    if (!this.dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  equals(other: Traveler): boolean {
    return this.email.equals(other.email);
  }
}
```

#### TravelDocument

```typescript
class TravelDocument {
  constructor(
    public readonly type: DocumentType,
    public readonly documentNumber: string,
    public readonly issueDate: Date,
    public readonly expiryDate?: Date,
    public readonly issuingCountry?: string
  ) {
    if (!documentNumber || documentNumber.trim().length === 0) {
      throw new Error('Document number is required');
    }
  }

  isExpired(): boolean {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
  }

  isExpiringSoon(withinDays: number = 180): boolean {
    if (!this.expiryDate) return false;
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + withinDays);
    return this.expiryDate <= threshold;
  }

  isValid(): boolean {
    return !this.isExpired();
  }
}

enum DocumentType {
  PASSPORT = 'passport',
  VISA = 'visa',
  ID_CARD = 'id_card',
  DRIVERS_LICENSE = 'drivers_license',
  VACCINATION_CERTIFICATE = 'vaccination_certificate',
  TRAVEL_INSURANCE = 'travel_insurance'
}
```

#### FlightDetails

```typescript
class FlightDetails {
  constructor(
    public readonly airline: string,
    public readonly flightNumber: string,
    public readonly departure: FlightLeg,
    public readonly arrival: FlightLeg,
    public readonly cabin: CabinClass,
    public readonly seatNumber?: string
  ) {}
}

class FlightLeg {
  constructor(
    public readonly airport: Airport,
    public readonly terminal?: string,
    public readonly gate?: string,
    public readonly dateTime: Date
  ) {}
}

class Airport {
  constructor(
    public readonly code: string, // IATA code (e.g., "FRA", "JFK")
    public readonly name: string,
    public readonly city: string,
    public readonly country: string
  ) {
    if (code.length !== 3) {
      throw new Error('Airport code must be 3 characters');
    }
  }

  toString(): string {
    return `${this.code} - ${this.name}`;
  }
}

enum CabinClass {
  ECONOMY = 'economy',
  PREMIUM_ECONOMY = 'premium_economy',
  BUSINESS = 'business',
  FIRST = 'first'
}
```

#### AccommodationDetails

```typescript
class AccommodationDetails {
  constructor(
    public readonly name: string,
    public readonly address: string,
    public readonly checkInDate: Date,
    public readonly checkOutDate: Date,
    public readonly roomType: string,
    public readonly guestCount: number,
    public readonly amenities: string[] = []
  ) {
    if (checkOutDate <= checkInDate) {
      throw new Error('Check-out must be after check-in');
    }
    if (guestCount < 1) {
      throw new Error('Guest count must be at least 1');
    }
  }

  getNights(): number {
    const diff = this.checkOutDate.getTime() - this.checkInDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
```

#### CancellationPolicy

```typescript
class CancellationPolicy {
  constructor(
    public readonly rules: CancellationRule[]
  ) {
    if (rules.length === 0) {
      throw new Error('At least one cancellation rule required');
    }
  }

  isRefundable(cancellationDate: Date): boolean {
    const refundPercentage = this.getRefundPercentage(cancellationDate);
    return refundPercentage > 0;
  }

  getRefundPercentage(cancellationDate: Date): number {
    // Find applicable rule (rules are sorted by daysBeforeStart descending)
    const sortedRules = [...this.rules].sort((a, b) =>
      b.daysBeforeStart - a.daysBeforeStart
    );

    for (const rule of sortedRules) {
      const deadline = this.getDeadline(rule.daysBeforeStart);
      if (cancellationDate <= deadline) {
        return rule.refundPercentage;
      }
    }

    // If no rule matches, no refund
    return 0;
  }

  private getDeadline(daysBeforeStart: number): Date {
    const deadline = new Date(this.bookingStartDate);
    deadline.setDate(deadline.getDate() - daysBeforeStart);
    return deadline;
  }
}

interface CancellationRule {
  daysBeforeStart: number;
  refundPercentage: number; // 0-100
}
```

## Domain Events

### Trip Events

```typescript
interface TripPlanned extends DomainEvent {
  eventType: 'TripPlanned';
  aggregateType: 'Trip';
  payload: {
    tripId: string;
    userId: string;
    title: string;
    purpose: TripPurpose;
    startDate: Date;
    endDate: Date;
    destinations: string[];
  };
}

interface DestinationAdded extends DomainEvent {
  eventType: 'DestinationAdded';
  aggregateType: 'Trip';
  payload: {
    tripId: string;
    location: string;
    arrivalDate: Date;
    departureDate: Date;
  };
}

interface BookingAddedToTrip extends DomainEvent {
  eventType: 'BookingAddedToTrip';
  aggregateType: 'Trip';
  payload: {
    tripId: string;
    bookingId: string;
    bookingType: BookingType;
    cost: number;
  };
}

interface TripStarted extends DomainEvent {
  eventType: 'TripStarted';
  aggregateType: 'Trip';
  payload: {
    tripId: string;
    startedAt: Date;
    firstDestination: string;
  };
}

interface DestinationReached extends DomainEvent {
  eventType: 'DestinationReached';
  aggregateType: 'Trip';
  payload: {
    tripId: string;
    location: string;
    reachedAt: Date;
  };
}

interface TripCompleted extends DomainEvent {
  eventType: 'TripCompleted';
  aggregateType: 'Trip';
  payload: {
    tripId: string;
    completedAt: Date;
    totalCost: number;
    destinationsVisited: number;
  };
}

interface TripCancelled extends DomainEvent {
  eventType: 'TripCancelled';
  aggregateType: 'Trip';
  payload: {
    tripId: string;
    cancelledAt: Date;
    reason?: string;
    refundAmount: number;
  };
}
```

### Booking Events

```typescript
interface TravelBooked extends DomainEvent {
  eventType: 'TravelBooked';
  aggregateType: 'Booking';
  payload: {
    bookingId: string;
    userId: string;
    tripId?: string;
    type: BookingType;
    provider: string;
    confirmationNumber: string;
    cost: number;
    currency: string;
    startDate: Date;
    endDate: Date;
  };
}

interface BookingCheckedIn extends DomainEvent {
  eventType: 'BookingCheckedIn';
  aggregateType: 'Booking';
  payload: {
    bookingId: string;
    type: BookingType;
    checkedInAt: Date;
  };
}

interface BookingCancelled extends DomainEvent {
  eventType: 'BookingCancelled';
  aggregateType: 'Booking';
  payload: {
    bookingId: string;
    cancelledAt: Date;
    reason?: string;
    refundAmount: number;
  };
}

interface FlightStatusChanged extends DomainEvent {
  eventType: 'FlightStatusChanged';
  aggregateType: 'Booking';
  payload: {
    bookingId: string;
    flightNumber: string;
    oldStatus: string;
    newStatus: string; // on-time, delayed, cancelled
    delayMinutes?: number;
  };
}
```

## Proactive Triggers

The Travel Context emits the following **Proactive Triggers** to the Proactivity Context. These are opportunities detected from travel data that may warrant user notification:

**Terminology Clarification:**
- **Data Signals:** Pull-based state data exposed via MCP (e.g., `travel.trip_status`, `travel.next_flight`)
- **Domain Events:** Push-based state changes (e.g., `TripPlanned`, `BookingConfirmed`)
- **Proactive Triggers:** Derived opportunities from travel analysis (below)

### 1. DEPARTURE_SOON
**Trigger:** Flight/train departure within 24 hours
**Data:**
```typescript
{
  triggerType: 'DEPARTURE_SOON',
  opportunityType: OpportunityType.TIME_SENSITIVE,
  bookingId: string,
  type: BookingType,
  departureTime: Date,
  hoursUntilDeparture: number,
  location: string,
  confidence: 1.0
}
```

### 2. CHECK_IN_AVAILABLE
**Trigger:** Online check-in window opened (typically 24-48h before)
**Data:**
```typescript
{
  triggerType: 'CHECK_IN_AVAILABLE',
  opportunityType: OpportunityType.TIME_SENSITIVE,
  bookingId: string,
  flightNumber: string,
  departureTime: Date,
  checkInUrl?: string,
  confidence: 1.0
}
```

### 3. DOCUMENT_EXPIRING
**Trigger:** Passport/visa expiring within 6 months
**Data:**
```typescript
{
  triggerType: 'DOCUMENT_EXPIRING',
  opportunityType: OpportunityType.URGENT,
  documentType: DocumentType,
  documentNumber: string,
  expiryDate: Date,
  daysUntilExpiry: number,
  confidence: 1.0
}
```

### 4. VISA_REQUIRED
**Trigger:** Trip to country requiring visa
**Data:**
```typescript
{
  triggerType: 'VISA_REQUIRED',
  opportunityType: OpportunityType.TIME_SENSITIVE,
  tripId: string,
  destination: string,
  countryCode: string,
  travelDate: Date,
  confidence: number
}
```

### 5. TRIP_BUDGET_EXCEEDED
**Trigger:** Trip spending exceeds planned budget
**Data:**
```typescript
{
  triggerType: 'TRIP_BUDGET_EXCEEDED',
  opportunityType: OpportunityType.URGENT,
  tripId: string,
  budget: number,
  actualCost: number,
  overage: number,
  confidence: 1.0
}
```

### 6. WEATHER_ALERT
**Trigger:** Severe weather at destination
**Data:**
```typescript
{
  triggerType: 'WEATHER_ALERT',
  opportunityType: OpportunityType.TIME_SENSITIVE,
  tripId: string,
  location: string,
  alertType: string,
  severity: string,
  startDate: Date,
  endDate: Date,
  confidence: number
}
```

**Note:** These triggers are sent to the Proactivity Context which evaluates them against user preferences and creates Suggestions if appropriate.

## Business Rules

### Trip Rules

1. **Date Validation:** End date must be after start date
2. **Destination Requirement:** At least one destination required
3. **Booking Dates:** All bookings must fall within trip dates
4. **Budget Tracking:** If budget set, track all booking costs
5. **Document Validation:** Passport must be valid for 6+ months beyond return date

### Booking Rules

1. **Confirmation Required:** All bookings must have confirmation number
2. **Positive Cost:** Booking cost must be positive
3. **Date Order:** End date/time must be after start date/time
4. **Cancellation Window:** Respect cancellation policy deadlines
5. **Check-in Timing:** Can only check in within allowed window

## Integration Patterns

### Flight Booking API (Anti-Corruption Layer)

```typescript
class AmadeusACL {
  async bookFlight(flightOffer: any): Promise<Booking> {
    const amadeusBooking = await this.mcpClient.callTool(
      'amadeus_create_booking',
      { offer: flightOffer }
    );

    // Translate Amadeus model to our domain model
    const flightDetails = new FlightDetails(
      amadeusBooking.carrier,
      amadeusBooking.flightNumber,
      new FlightLeg(
        new Airport(
          amadeusBooking.departure.iataCode,
          amadeusBooking.departure.airportName,
          amadeusBooking.departure.city,
          amadeusBooking.departure.country
        ),
        amadeusBooking.departure.terminal,
        undefined,
        new Date(amadeusBooking.departure.at)
      ),
      new FlightLeg(
        new Airport(
          amadeusBooking.arrival.iataCode,
          amadeusBooking.arrival.airportName,
          amadeusBooking.arrival.city,
          amadeusBooking.arrival.country
        ),
        amadeusBooking.arrival.terminal,
        undefined,
        new Date(amadeusBooking.arrival.at)
      ),
      this.mapCabinClass(amadeusBooking.cabin)
    );

    return new Booking(
      generateId(),
      this.userId,
      this.tenantId,
      this.tripId,
      BookingType.FLIGHT,
      amadeusBooking.pnr,
      amadeusBooking.carrier,
      Money.create(amadeusBooking.price.total, amadeusBooking.price.currency),
      new Date(amadeusBooking.departure.at),
      new Date(amadeusBooking.arrival.at),
      flightDetails
    );
  }
}
```

## Use Cases

### 1. Plan Trip

**Actor:** User

**Flow:**
1. User specifies destinations and dates
2. Create Trip aggregate
3. Emit TripPlanned event
4. Calendar Context: Block dates
5. Proactivity Context: Check visa requirements
6. Proactivity Context: Check document expiry

### 2. Book Flight

**Actor:** User

**Flow:**
1. User searches for flights (via MCP - Amadeus)
2. User selects flight
3. Create Booking aggregate
4. Emit TravelBooked event
5. Finance Context: Record transaction
6. Trip aggregate: Add booking
7. Calendar Context: Add departure/arrival appointments

### 3. Check-In Reminder

**Actor:** Proactivity Context

**Flow:**
1. Monitor TravelBooked events
2. 24 hours before flight: Emit CHECK_IN_AVAILABLE signal
3. Orchestrator presents suggestion to user
4. User confirms check-in
5. Update Booking status to CHECKED_IN

### 4. Document Expiry Check

**Actor:** Proactivity Context (scheduled)

**Flow:**
1. Periodically scan all TravelDocuments
2. Find documents expiring within 6 months
3. Emit DOCUMENT_EXPIRING signal
4. Orchestrator presents warning to user

## Persistence

### Trip Repository

```typescript
interface TripRepository {
  save(trip: Trip): Promise<void>;
  findById(id: string): Promise<Trip | null>;
  findByUserId(userId: string): Promise<Trip[]>;
  findActive(userId: string): Promise<Trip[]>;
  findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Trip[]>;
}
```

### Booking Repository

```typescript
interface BookingRepository {
  save(booking: Booking): Promise<void>;
  findById(id: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByTripId(tripId: string): Promise<Booking[]>;
  findUpcoming(
    userId: string,
    withinHours: number
  ): Promise<Booking[]>;
}
```

## Testing Strategy

### Unit Tests

```typescript
describe('Trip', () => {
  it('should not allow bookings outside trip dates', () => {
    const trip = createTrip('2025-06-01', '2025-06-10');
    const booking = createBooking('2025-05-20', '2025-05-25');

    expect(() => trip.addBooking(booking.id, booking))
      .toThrow('Booking dates must be within trip dates');
  });

  it('should calculate remaining budget correctly', () => {
    const trip = createTripWithBudget(2000);
    trip.addBooking(createBookingWithCost(500));
    trip.addBooking(createBookingWithCost(300));

    expect(trip.getRemainingBudget()?.amount).toBe(1200);
  });
});
```

## Performance Considerations

1. **Trip Search:** Index on userId + startDate + endDate
2. **Booking Lookups:** Index on tripId, userId, startDate
3. **Document Expiry:** Scheduled job runs daily, not on every query
4. **Flight Status:** Cache flight status for 5 minutes

## Future Considerations

1. **Multi-City Trips:** Better support for complex itineraries
2. **Group Travel:** Coordinate bookings for multiple travelers
3. **Travel Recommendations:** AI suggests destinations based on preferences
4. **Points/Miles Tracking:** Loyalty program integration
5. **Travel Insurance:** Automated insurance recommendations
6. **Packing Lists:** Generate smart packing lists based on destination/weather
7. **Real-Time Notifications:** Push notifications for flight delays, gate changes

---

**End of Document**
