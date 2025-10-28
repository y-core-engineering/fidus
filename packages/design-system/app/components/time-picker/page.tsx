'use client';

import { TimePicker } from '@fidus/ui';
import { useState } from 'react';

export default function TimePickerPage() {
  const [time12, setTime12] = useState('');
  const [time24, setTime24] = useState('');
  const [meetingTime, setMeetingTime] = useState('14:30');

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Time Picker</h1>
        <p className="text-lg text-muted-foreground">
          A time selection component supporting 12-hour and 24-hour formats with customizable minute intervals and validation states.
        </p>
      </div>

      {/* Basic Example (12-hour) */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Time Picker (12-hour)</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TimePicker
              label="Appointment Time"
              format="12"
              value={time12}
              onChange={setTime12}
            />
          </div>
        </div>
      </section>

      {/* 24-hour Format */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">24-hour Format</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TimePicker
              label="Departure Time"
              format="24"
              value={time24}
              onChange={setTime24}
            />
          </div>
        </div>
      </section>

      {/* With Default Value */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Default Value</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TimePicker
              label="Meeting Time"
              format="24"
              value={meetingTime}
              onChange={setMeetingTime}
              helperText="2:30 PM is pre-selected"
            />
          </div>
        </div>
      </section>

      {/* With Helper Text */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Helper Text</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TimePicker
              label="Reminder Time"
              format="12"
              helperText="Select when you want to be reminded"
            />
          </div>
        </div>
      </section>

      {/* Error State */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Error State</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TimePicker
              label="Start Time"
              format="12"
              error="Please select a valid time"
            />
          </div>
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Disabled State</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TimePicker
              label="System Time"
              format="24"
              disabled
              value="09:00"
            />
          </div>
        </div>
      </section>

      {/* Minute Intervals */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Minute Intervals</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <TimePicker
              label="5-minute Intervals"
              format="12"
              minuteInterval={5}
              helperText="Select time in 5-minute increments"
            />
            <TimePicker
              label="15-minute Intervals"
              format="12"
              minuteInterval={15}
              helperText="Select time in 15-minute increments"
            />
            <TimePicker
              label="30-minute Intervals"
              format="12"
              minuteInterval={30}
              helperText="Select time in 30-minute increments"
            />
          </div>
        </div>
      </section>

      {/* With Clear Button */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Clear Button</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TimePicker
              label="Optional Time"
              format="12"
              defaultValue="10:30"
              showClearButton
              helperText="Click X to clear the time"
            />
          </div>
        </div>
      </section>

      {/* Without Clear Button */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Without Clear Button</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TimePicker
              label="Required Time"
              format="12"
              defaultValue="09:00"
              showClearButton={false}
              helperText="Time cannot be cleared"
            />
          </div>
        </div>
      </section>

      {/* Required Field */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Required Field</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TimePicker
              label="Check-in Time"
              format="24"
              required
              helperText="This field is required"
            />
          </div>
        </div>
      </section>

      {/* Combined Use Cases */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Combined Use Cases</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <TimePicker
              label="Office Hours Start"
              format="12"
              minuteInterval={30}
              defaultValue="09:00"
              helperText="Business hours start time"
            />
            <TimePicker
              label="Office Hours End"
              format="12"
              minuteInterval={30}
              defaultValue="17:00"
              helperText="Business hours end time"
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
                  <td className="p-2">Time picker label text (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">placeholder</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Placeholder text (not typically used)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">value</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Controlled time value (HH:mm format)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">defaultValue</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Uncontrolled default time (HH:mm format)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">format</td>
                  <td className="p-2 font-mono text-xs">&apos;12&apos; | &apos;24&apos;</td>
                  <td className="p-2 font-mono text-xs">&apos;24&apos;</td>
                  <td className="p-2">Time format (12-hour or 24-hour)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">minuteInterval</td>
                  <td className="p-2 font-mono text-xs">number</td>
                  <td className="p-2 font-mono text-xs">5</td>
                  <td className="p-2">Minute increment (5, 15, 30, etc.)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showClearButton</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Show X button to clear time</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">disabled</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether time picker is disabled</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">required</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether time is required (shows * indicator)</td>
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
                  <td className="p-2">Helper text below time picker</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onChange</td>
                  <td className="p-2 font-mono text-xs">(time: string) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Callback when time changes (HH:mm format)</td>
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
            <li>Keyboard accessible (Tab, Arrow keys for navigation)</li>
            <li>ARIA attributes: aria-invalid, aria-describedby, aria-label</li>
            <li>Error messages announced with aria-live</li>
            <li>Focus indicators visible on select inputs</li>
            <li>Label properly associated with time picker</li>
            <li>Required fields indicated with * and aria-required</li>
            <li>Arrow keys for quick value changes in selects</li>
            <li>Clear button accessible via keyboard</li>
            <li>Hour, minute, and period separately labeled for screen readers</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
