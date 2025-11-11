'use client';

import { TimePicker } from '@fidus/ui/time-picker';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { useState } from 'react';

export default function TimePickerPage() {
  const [time12, setTime12] = useState('');
  const [time24, setTime24] = useState('');
  const [meetingTime, setMeetingTime] = useState('14:30');

  const props = [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Time picker label text',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text (not typically used)',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled time value (HH:mm format)',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Uncontrolled default time (HH:mm format)',
    },
    {
      name: 'format',
      type: "'12' | '24'",
      default: "'24'",
      description: 'Time format (12-hour or 24-hour)',
    },
    {
      name: 'minuteInterval',
      type: 'number',
      default: '5',
      description: 'Minute increment (5, 15, 30, etc.)',
    },
    {
      name: 'showClearButton',
      type: 'boolean',
      default: 'true',
      description: 'Show X button to clear time',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether time picker is disabled',
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Whether time is required (shows * indicator)',
    },
    {
      name: 'error',
      type: 'string',
      description: 'Error message to display',
    },
    {
      name: 'helperText',
      type: 'string',
      description: 'Helper text below time picker',
    },
    {
      name: 'onChange',
      type: '(time: string) => void',
      description: 'Callback when time changes (HH:mm format)',
    },
    {
      name: 'onBlur',
      type: '() => void',
      description: 'Callback when picker loses focus',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Time Picker</h1>
      <p className="lead">
        A time selection component supporting 12-hour and 24-hour formats with customizable minute intervals and validation states.
      </p>

      <h2>Basic Time Picker (12-hour)</h2>
      <ComponentPreview code={`<TimePicker
  label="Appointment Time"
  format="12"
  value={time12}
  onChange={setTime12}
/>`}>
        <TimePicker
          label="Appointment Time"
          format="12"
          value={time12}
          onChange={setTime12}
        />
      </ComponentPreview>

      <h2>24-hour Format</h2>
      <ComponentPreview code={`<TimePicker
  label="Departure Time"
  format="24"
  value={time24}
  onChange={setTime24}
/>`}>
        <TimePicker
          label="Departure Time"
          format="24"
          value={time24}
          onChange={setTime24}
        />
      </ComponentPreview>

      <h2>With Default Value</h2>
      <ComponentPreview code={`<TimePicker
  label="Meeting Time"
  format="24"
  value={meetingTime}
  onChange={setMeetingTime}
  helperText="2:30 PM is pre-selected"
/>`}>
        <TimePicker
          label="Meeting Time"
          format="24"
          value={meetingTime}
          onChange={setMeetingTime}
          helperText="2:30 PM is pre-selected"
        />
      </ComponentPreview>

      <h2>States</h2>
      <ComponentPreview code={`<Stack direction="vertical" spacing="lg">
  <TimePicker
    label="With Helper Text"
    format="12"
    helperText="Select when you want to be reminded"
  />
  <TimePicker
    label="Error State"
    format="12"
    error="Please select a valid time"
  />
  <TimePicker
    label="Disabled"
    format="24"
    disabled
    value="09:00"
  />
</Stack>`}>
        <Stack direction="vertical" spacing="lg">
          <TimePicker
            label="With Helper Text"
            format="12"
            helperText="Select when you want to be reminded"
          />
          <TimePicker
            label="Error State"
            format="12"
            error="Please select a valid time"
          />
          <TimePicker
            label="Disabled"
            format="24"
            disabled
            value="09:00"
          />
        </Stack>
      </ComponentPreview>

      <h2>Minute Intervals</h2>
      <ComponentPreview code={`<Stack direction="vertical" spacing="lg">
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
</Stack>`}>
        <Stack direction="vertical" spacing="lg">
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
        </Stack>
      </ComponentPreview>

      <h2>Clear Button Variants</h2>
      <ComponentPreview code={`<Stack direction="vertical" spacing="lg">
  <TimePicker
    label="With Clear Button"
    format="12"
    defaultValue="10:30"
    showClearButton
    helperText="Click X to clear the time"
  />
  <TimePicker
    label="Without Clear Button"
    format="12"
    defaultValue="09:00"
    showClearButton={false}
    helperText="Time cannot be cleared"
  />
</Stack>`}>
        <Stack direction="vertical" spacing="lg">
          <TimePicker
            label="With Clear Button"
            format="12"
            defaultValue="10:30"
            showClearButton
            helperText="Click X to clear the time"
          />
          <TimePicker
            label="Without Clear Button"
            format="12"
            defaultValue="09:00"
            showClearButton={false}
            helperText="Time cannot be cleared"
          />
        </Stack>
      </ComponentPreview>

      <h2>Required Field</h2>
      <ComponentPreview code={`<TimePicker
  label="Check-in Time"
  format="24"
  required
  helperText="This field is required"
/>`}>
        <TimePicker
          label="Check-in Time"
          format="24"
          required
          helperText="This field is required"
        />
      </ComponentPreview>

      <h2>Combined Use Cases</h2>
      <ComponentPreview code={`<Stack direction="vertical" spacing="lg">
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
</Stack>`}>
        <Stack direction="vertical" spacing="lg">
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
        </Stack>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For scheduling appointments, meetings, or events</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When users need to select a specific time of day</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For setting reminders, alarms, or notifications</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When collecting business hours or availability windows</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use 12-hour format for consumer-facing applications in regions where it's common</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use 24-hour format for technical or international applications</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Set appropriate minute intervals based on use case (e.g., 30 min for meetings, 5 min for precise scheduling)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide clear labels that indicate what the time is for</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use helper text to provide context or examples (e.g., "Store opens at 9:00 AM")</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Allow clearing time for optional fields, disable clear button for required fields</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible (Tab, Arrow keys for navigation)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA attributes: aria-invalid, aria-describedby, aria-label</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Error messages announced with aria-live</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus indicators visible on select inputs</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Label properly associated with time picker</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Required fields indicated with * and aria-required</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Hour, minute, and period separately labeled for screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Clear button accessible via keyboard</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do's and Don'ts</h2>

      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        {/* Do's */}
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <span className="text-2xl">✓</span> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use appropriate time format based on user locale and context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Set minute intervals that match the precision needed</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide clear labels and helper text for context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show validation errors immediately when time is invalid</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use consistent time format throughout your application</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview code={`<TimePicker
  label="Meeting Start Time"
  format="12"
  minuteInterval={15}
  helperText="Select meeting start time"
/>`}>
              <TimePicker
                label="Meeting Start Time"
                format="12"
                minuteInterval={15}
                helperText="Select meeting start time"
              />
            </ComponentPreview>
          </div>
        </div>

        {/* Don'ts */}
        <div className="border-2 border-error bg-error/10 rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don't
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use 1-minute intervals unless absolutely necessary (overwhelming options)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't mix time formats (12h and 24h) in the same form</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use vague labels like "Time" without context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't allow clearing required time fields</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't forget to validate time ranges when using start/end times</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview code={`<TimePicker
  label="Time"
  format="12"
  minuteInterval={1}
/>`}>
              <TimePicker
                label="Time"
                format="12"
                minuteInterval={1}
              />
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/date-picker"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Date Picker
          </h3>
          <p className="text-sm text-muted-foreground">For selecting dates</p>
        </Link>
        <Link
          href="/components/input"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Input
          </h3>
          <p className="text-sm text-muted-foreground">For text and number input</p>
        </Link>
        <Link
          href="/components/select"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Select
          </h3>
          <p className="text-sm text-muted-foreground">For selecting from options</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/time-picker/time-picker.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/"
              external
              showIcon
            >
              ARIA: Spinbutton Pattern
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/for-developers">
              Installation guide
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
