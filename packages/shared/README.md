# Fidus Shared

Shared types, schemas, and utilities used across Fidus packages.

## Purpose

This package provides:
- **TypeScript Types** - Shared type definitions
- **Zod Schemas** - Runtime validation schemas
- **Utility Functions** - Common helper functions
- **Constants** - Shared constants and enums

## Usage

Import from other packages:

```typescript
import { AppointmentSchema, type Appointment } from '@fidus/shared';
import { formatDuration, calculateTimeRange } from '@fidus/shared';
```

## Project Structure

```
src/
├── types/          # TypeScript type definitions
│   ├── calendar.ts # Calendar domain types
│   ├── finance.ts  # Finance domain types
│   └── ...         # Other domain types
├── schemas/        # Zod validation schemas
│   ├── calendar.ts # Calendar schemas
│   ├── finance.ts  # Finance schemas
│   └── ...         # Other schemas
└── utils/          # Utility functions
    ├── date.ts     # Date utilities
    ├── money.ts    # Money calculations
    └── ...         # Other utilities
```

## Development

### Building

```bash
# Build package
pnpm build

# Watch mode
pnpm dev
```

### Type Checking

```bash
pnpm typecheck
```

## Key Concepts

### Domain Types

Each domain has its own types file following DDD principles:

```typescript
// types/calendar.ts
export interface Appointment {
  id: string;
  tenantId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
```

### Validation Schemas

Zod schemas for runtime validation:

```typescript
// schemas/calendar.ts
import { z } from 'zod';

export const AppointmentSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  title: z.string().min(1).max(200),
  startTime: z.date(),
  endTime: z.date(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']),
});
```

### Utility Functions

Common utilities with proper typing:

```typescript
// utils/date.ts
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}
```

## Value Objects

This package implements shared Value Objects from the domain model:

- `Money` - Currency and amount
- `Email` - Validated email address
- `TimeRange` - Start and end time
- `Duration` - Time duration
- `RecurrencePattern` - Recurring event pattern

These ensure consistency across all packages.
