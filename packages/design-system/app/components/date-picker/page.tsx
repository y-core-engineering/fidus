'use client';

import { DatePicker } from '@fidus/ui';
import { useState } from 'react';

export default function DatePickerPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(new Date());

  // Date constraints
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const minAge = new Date(today);
  minAge.setFullYear(minAge.getFullYear() - 18);

  // Disabled weekends
  const disabledWeekends: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    if (date.getDay() === 0 || date.getDay() === 6) {
      disabledWeekends.push(date);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Date Picker</h1>
        <p className="text-lg text-muted-foreground">
          A calendar-based date selection component with support for constraints, custom formatting, and validation states.
        </p>
      </div>

      {/* Basic Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Date Picker</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DatePicker
              label="Select Date"
              placeholder="Pick a date"
            />
          </div>
        </div>
      </section>

      {/* With Default Value */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Default Value (Today)</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DatePicker
              label="Birthday"
              placeholder="Select your birthday"
              value={birthday}
              onChange={setBirthday}
              helperText="Today is pre-selected"
            />
          </div>
        </div>
      </section>

      {/* With Helper Text */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Helper Text</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DatePicker
              label="Appointment Date"
              placeholder="Choose appointment date"
              helperText="Select your preferred appointment date"
            />
          </div>
        </div>
      </section>

      {/* Error State */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Error State</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DatePicker
              label="Event Date"
              placeholder="Pick event date"
              error="Please select a valid date"
            />
          </div>
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Disabled State</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DatePicker
              label="Launch Date"
              placeholder="Not available"
              disabled
              value={today}
            />
          </div>
        </div>
      </section>

      {/* Min Date Constraint */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Min Date Constraint</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DatePicker
              label="Start Date"
              placeholder="Select start date"
              minDate={tomorrow}
              helperText="Cannot select dates before tomorrow"
            />
          </div>
        </div>
      </section>

      {/* Max Date Constraint */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Max Date Constraint</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DatePicker
              label="Date of Birth"
              placeholder="Select date of birth"
              maxDate={minAge}
              helperText="Must be at least 18 years old"
            />
          </div>
        </div>
      </section>

      {/* Date Range Constraint */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Date Range Constraint</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DatePicker
              label="Delivery Date"
              placeholder="Choose delivery date"
              minDate={tomorrow}
              maxDate={nextWeek}
              helperText="Available for next 7 days only"
            />
          </div>
        </div>
      </section>

      {/* Disabled Specific Dates */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Disabled Specific Dates</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DatePicker
              label="Meeting Date"
              placeholder="Select meeting date"
              disabledDates={disabledWeekends}
              helperText="Weekends are disabled"
            />
          </div>
        </div>
      </section>

      {/* Custom Date Format */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Custom Date Format</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <DatePicker
              label="Short Format"
              placeholder="MM/DD/YYYY"
              dateFormat="MM/dd/yyyy"
              defaultValue={today}
            />
            <DatePicker
              label="Long Format"
              placeholder="Full date"
              dateFormat="EEEE, MMMM do, yyyy"
              defaultValue={today}
            />
            <DatePicker
              label="ISO Format"
              placeholder="YYYY-MM-DD"
              dateFormat="yyyy-MM-dd"
              defaultValue={today}
            />
          </div>
        </div>
      </section>

      {/* With Clear Button */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Clear Button</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DatePicker
              label="Flexible Date"
              placeholder="Optional date"
              value={selectedDate}
              onChange={setSelectedDate}
              showClearButton
              helperText="Click X to clear the selected date"
            />
          </div>
        </div>
      </section>

      {/* Without Clear Button */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Without Clear Button</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DatePicker
              label="Required Date"
              placeholder="Must select a date"
              defaultValue={today}
              showClearButton={false}
              helperText="Date cannot be cleared"
            />
          </div>
        </div>
      </section>

      {/* Required Field */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Required Field</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <DatePicker
              label="Registration Date"
              placeholder="Select registration date"
              required
              helperText="This field is required"
            />
          </div>
        </div>
      </section>

      {/* Props Table */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Props</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-left font-semibold">Prop</th>
                  <th className="p-2 text-left font-semibold">Type</th>
                  <th className="p-2 text-left font-semibold">Default</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">label</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Date picker label text (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">placeholder</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 font-mono text-xs">&apos;Pick a date&apos;</td>
                  <td className="p-2">Placeholder text when no date selected</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">value</td>
                  <td className="p-2 font-mono text-xs">Date</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Controlled date value</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">defaultValue</td>
                  <td className="p-2 font-mono text-xs">Date</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Uncontrolled default date</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">dateFormat</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 font-mono text-xs">&apos;PPP&apos;</td>
                  <td className="p-2">Date format string (date-fns format)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">minDate</td>
                  <td className="p-2 font-mono text-xs">Date</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Minimum selectable date</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">maxDate</td>
                  <td className="p-2 font-mono text-xs">Date</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Maximum selectable date</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">disabledDates</td>
                  <td className="p-2 font-mono text-xs">Date[]</td>
                  <td className="p-2 font-mono text-xs">[]</td>
                  <td className="p-2">Array of specific dates to disable</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showClearButton</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Show X button to clear selected date</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">disabled</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether date picker is disabled</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">required</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether date is required (shows * indicator)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">error</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Error message to display</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">helperText</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Helper text below date picker</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onChange</td>
                  <td className="p-2 font-mono text-xs">(date: Date | null) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Callback when date changes</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onBlur</td>
                  <td className="p-2 font-mono text-xs">() =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Callback when picker loses focus</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Accessibility</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Keyboard accessible (Tab, Arrow keys, Enter, Escape)</li>
            <li>ARIA attributes: aria-invalid, aria-describedby</li>
            <li>Error messages announced with aria-live</li>
            <li>Focus indicators visible on trigger and calendar</li>
            <li>Label properly associated with date picker</li>
            <li>Required fields indicated with * and aria-required</li>
            <li>Today and Clear shortcuts for quick access</li>
            <li>Calendar navigation with arrow keys</li>
            <li>Disabled dates clearly indicated visually</li>
            <li>Selected date highlighted with distinct styling</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
