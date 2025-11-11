'use client';

import { DatePicker } from '@fidus/ui/date-picker';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { useState } from 'react';

export default function DatePickerPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [birthday, setBirthday] = useState<Date | undefined>(new Date());

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

  const props = [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Date picker label text',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "'Pick a date'",
      description: 'Placeholder text when no date selected',
    },
    {
      name: 'value',
      type: 'Date | null',
      description: 'Controlled date value',
    },
    {
      name: 'defaultValue',
      type: 'Date',
      description: 'Uncontrolled default date',
    },
    {
      name: 'dateFormat',
      type: 'string',
      default: "'PPP'",
      description: 'Date format string (date-fns format)',
    },
    {
      name: 'minDate',
      type: 'Date',
      description: 'Minimum selectable date',
    },
    {
      name: 'maxDate',
      type: 'Date',
      description: 'Maximum selectable date',
    },
    {
      name: 'disabledDates',
      type: 'Date[]',
      default: '[]',
      description: 'Array of specific dates to disable',
    },
    {
      name: 'showClearButton',
      type: 'boolean',
      default: 'true',
      description: 'Show X button to clear selected date',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether date picker is disabled',
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Whether date is required (shows * indicator)',
    },
    {
      name: 'error',
      type: 'string',
      description: 'Error message to display',
    },
    {
      name: 'helperText',
      type: 'string',
      description: 'Helper text below date picker',
    },
    {
      name: 'onChange',
      type: '(date: Date | null) => void',
      description: 'Callback when date changes',
    },
    {
      name: 'onBlur',
      type: '() => void',
      description: 'Callback when picker loses focus',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Date Picker</h1>
      <p className="lead">
        A calendar-based date selection component with support for constraints, custom formatting, and validation states.
      </p>

      <h2>Basic Date Picker</h2>
      <ComponentPreview code={`<DatePicker label="Select Date" placeholder="Pick a date" />`}>
        <DatePicker label="Select Date" placeholder="Pick a date" />
      </ComponentPreview>

      <h2>With Default Value</h2>
      <ComponentPreview
        code={`<DatePicker
  label="Birthday"
  placeholder="Select your birthday"
  value={birthday}
  onChange={(date) => setBirthday(date ?? undefined)}
  helperText="Today is pre-selected"
/>`}
      >
        <DatePicker
          label="Birthday"
          placeholder="Select your birthday"
          value={birthday}
          onChange={(date) => setBirthday(date ?? undefined)}
          helperText="Today is pre-selected"
        />
      </ComponentPreview>

      <h2>With Helper Text</h2>
      <ComponentPreview
        code={`<DatePicker
  label="Appointment Date"
  placeholder="Choose appointment date"
  helperText="Select your preferred appointment date"
/>`}
      >
        <DatePicker
          label="Appointment Date"
          placeholder="Choose appointment date"
          helperText="Select your preferred appointment date"
        />
      </ComponentPreview>

      <h2>States</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <DatePicker
    label="Event Date"
    placeholder="Pick event date"
    error="Please select a valid date"
  />
  <DatePicker
    label="Launch Date"
    placeholder="Not available"
    disabled
    value={today}
  />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <DatePicker
            label="Event Date"
            placeholder="Pick event date"
            error="Please select a valid date"
          />
          <DatePicker
            label="Launch Date"
            placeholder="Not available"
            disabled
            value={today}
          />
        </Stack>
      </ComponentPreview>

      <h2>Date Constraints</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <DatePicker
    label="Start Date"
    placeholder="Select start date"
    minDate={tomorrow}
    helperText="Cannot select dates before tomorrow"
  />
  <DatePicker
    label="Date of Birth"
    placeholder="Select date of birth"
    maxDate={minAge}
    helperText="Must be at least 18 years old"
  />
  <DatePicker
    label="Delivery Date"
    placeholder="Choose delivery date"
    minDate={tomorrow}
    maxDate={nextWeek}
    helperText="Available for next 7 days only"
  />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <DatePicker
            label="Start Date"
            placeholder="Select start date"
            minDate={tomorrow}
            helperText="Cannot select dates before tomorrow"
          />
          <DatePicker
            label="Date of Birth"
            placeholder="Select date of birth"
            maxDate={minAge}
            helperText="Must be at least 18 years old"
          />
          <DatePicker
            label="Delivery Date"
            placeholder="Choose delivery date"
            minDate={tomorrow}
            maxDate={nextWeek}
            helperText="Available for next 7 days only"
          />
        </Stack>
      </ComponentPreview>

      <h2>Disabled Specific Dates</h2>
      <ComponentPreview
        code={`<DatePicker
  label="Meeting Date"
  placeholder="Select meeting date"
  disabledDates={disabledWeekends}
  helperText="Weekends are disabled"
/>`}
      >
        <DatePicker
          label="Meeting Date"
          placeholder="Select meeting date"
          disabledDates={disabledWeekends}
          helperText="Weekends are disabled"
        />
      </ComponentPreview>

      <h2>Custom Date Format</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
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
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
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
        </Stack>
      </ComponentPreview>

      <h2>Clear Button</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <DatePicker
    label="Flexible Date"
    placeholder="Optional date"
    value={selectedDate}
    onChange={(date) => setSelectedDate(date ?? undefined)}
    showClearButton
    helperText="Click X to clear the selected date"
  />
  <DatePicker
    label="Required Date"
    placeholder="Must select a date"
    defaultValue={today}
    showClearButton={false}
    helperText="Date cannot be cleared"
  />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <DatePicker
            label="Flexible Date"
            placeholder="Optional date"
            value={selectedDate}
            onChange={(date) => setSelectedDate(date ?? undefined)}
            showClearButton
            helperText="Click X to clear the selected date"
          />
          <DatePicker
            label="Required Date"
            placeholder="Must select a date"
            defaultValue={today}
            showClearButton={false}
            helperText="Date cannot be cleared"
          />
        </Stack>
      </ComponentPreview>

      <h2>Required Field</h2>
      <ComponentPreview
        code={`<DatePicker
  label="Registration Date"
  placeholder="Select registration date"
  required
  helperText="This field is required"
/>`}
      >
        <DatePicker
          label="Registration Date"
          placeholder="Select registration date"
          required
          helperText="This field is required"
        />
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
              <span>For selecting single dates in forms (appointments, birthdays, deadlines)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When users need a visual calendar to help them choose dates</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When date constraints need to be clearly communicated (min/max dates)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When specific dates need to be disabled (weekends, holidays, blocked dates)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use clear labels that indicate what the date represents</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide helper text to clarify date constraints or format requirements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use minDate/maxDate to prevent selection of invalid dates</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show clear button for optional date fields</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use appropriate date format for your locale and context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Disable the picker when the field is not editable in current context</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible (Tab, Arrow keys, Enter, Escape)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA attributes: aria-invalid, aria-describedby, aria-required</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Error messages announced with aria-live</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus indicators visible on trigger and calendar</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Label properly associated with date picker</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Calendar navigation with arrow keys for date selection</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Disabled dates clearly indicated visually and programmatically</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Selected date highlighted with distinct styling</span>
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
              <span>Use date constraints (minDate/maxDate) to prevent invalid selections</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide clear helper text explaining date requirements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use appropriate date format for your locale</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show clear button for optional date fields</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Disable specific dates when they're unavailable (weekends, holidays)</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<DatePicker
  label="Appointment Date"
  placeholder="Select date"
  minDate={tomorrow}
  helperText="Available dates start tomorrow"
/>`}
            >
              <DatePicker
                label="Appointment Date"
                placeholder="Select date"
                minDate={tomorrow}
                helperText="Available dates start tomorrow"
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
              <span>Don't allow selection of invalid dates without constraints</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use vague labels like "Date" or "Pick date"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use date picker for very distant past dates (use text input)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't hide date format requirements - show them in helper text</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't force users to clear required date fields</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<DatePicker
  label="Date"
  placeholder="Pick a date"
/>`}
            >
              <DatePicker label="Date" placeholder="Pick a date" />
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/time-picker"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Time Picker
          </h3>
          <p className="text-sm text-muted-foreground">For selecting specific times</p>
        </Link>
        <Link
          href="/components/input"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Input
          </h3>
          <p className="text-sm text-muted-foreground">For text-based date entry</p>
        </Link>
        <Link
          href="/components/select"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Select
          </h3>
          <p className="text-sm text-muted-foreground">For choosing from predefined options</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/date-picker/date-picker.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/"
              external
              showIcon
            >
              ARIA: Date Picker Dialog Pattern
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
