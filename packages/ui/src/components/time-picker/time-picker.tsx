'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { z } from 'zod';
import { Clock, X } from 'lucide-react';
import { cn } from '../../lib/cn';

export const TimePickerPropsSchema = z.object({
  label: z.string(),
  placeholder: z.string().optional(),
  value: z.string().optional(),
  defaultValue: z.string().optional(),
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  error: z.string().optional(),
  helperText: z.string().optional(),
  format: z.enum(['12', '24']).optional(),
  minuteInterval: z.number().optional(),
  showClearButton: z.boolean().optional(),
  onChange: z
    .function()
    .args(z.string())
    .returns(z.void())
    .optional(),
  onBlur: z
    .function()
    .returns(z.void())
    .optional(),
  className: z.string().optional(),
});

export type TimePickerProps = z.infer<typeof TimePickerPropsSchema>;

const selectVariants = cva(
  'rounded-md border bg-background px-2 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-border focus:border-primary focus:ring-primary',
        error: 'border-error focus:border-error focus:ring-error',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

export const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (props, ref) => {
    const {
      label,
      value,
      defaultValue,
      disabled,
      required,
      error,
      helperText,
      format = '24',
      minuteInterval = 5,
      showClearButton = true,
      onChange,
      onBlur,
      className,
    } = props;

    const [internalValue, setInternalValue] = React.useState(
      defaultValue || ''
    );
    const [hour, setHour] = React.useState('');
    const [minute, setMinute] = React.useState('');
    const [period, setPeriod] = React.useState<'AM' | 'PM'>('AM');

    const currentValue = value !== undefined ? value : internalValue;
    const hasError = !!error;
    const state = hasError ? 'error' : 'default';
    const is12Hour = format === '12';

    // Parse time value (HH:mm or hh:mm AM/PM)
    React.useEffect(() => {
      if (!currentValue) {
        setHour('');
        setMinute('');
        setPeriod('AM');
        return;
      }

      try {
        const parts = currentValue.split(':');
        if (parts.length === 2) {
          const [h, m] = parts;
          let hourNum = parseInt(h, 10);

          if (is12Hour) {
            if (hourNum >= 12) {
              setPeriod('PM');
              hourNum = hourNum === 12 ? 12 : hourNum - 12;
            } else {
              setPeriod('AM');
              hourNum = hourNum === 0 ? 12 : hourNum;
            }
          }

          setHour(hourNum.toString().padStart(2, '0'));
          setMinute(m);
        }
      } catch (e) {
        // Invalid time format
      }
    }, [currentValue, is12Hour]);

    // Generate hour options
    const hourOptions = React.useMemo(() => {
      const max = is12Hour ? 12 : 23;
      const start = is12Hour ? 1 : 0;
      return Array.from({ length: max - start + 1 }, (_, i) =>
        (i + start).toString().padStart(2, '0')
      );
    }, [is12Hour]);

    // Generate minute options
    const minuteOptions = React.useMemo(() => {
      const interval = Number(minuteInterval);
      return Array.from({ length: 60 / interval }, (_, i) =>
        (i * interval).toString().padStart(2, '0')
      );
    }, [minuteInterval]);

    const updateTime = (
      newHour: string,
      newMinute: string,
      newPeriod: 'AM' | 'PM'
    ) => {
      if (!newHour || !newMinute) return;

      let h = parseInt(newHour, 10);

      if (is12Hour) {
        if (newPeriod === 'PM' && h !== 12) {
          h += 12;
        } else if (newPeriod === 'AM' && h === 12) {
          h = 0;
        }
      }

      const timeString = `${h.toString().padStart(2, '0')}:${newMinute}`;

      if (value === undefined) {
        setInternalValue(timeString);
      }
      onChange?.(timeString);
    };

    const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newHour = e.target.value;
      setHour(newHour);
      if (newHour && minute) {
        updateTime(newHour, minute, period);
      }
    };

    const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newMinute = e.target.value;
      setMinute(newMinute);
      if (hour && newMinute) {
        updateTime(hour, newMinute, period);
      }
    };

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newPeriod = e.target.value as 'AM' | 'PM';
      setPeriod(newPeriod);
      if (hour && minute) {
        updateTime(hour, minute, newPeriod);
      }
    };

    const handleClear = () => {
      setHour('');
      setMinute('');
      setPeriod('AM');
      if (value === undefined) {
        setInternalValue('');
      }
      onChange?.('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const select = e.currentTarget;
        const currentIndex = select.selectedIndex;
        const newIndex =
          e.key === 'ArrowUp'
            ? Math.max(0, currentIndex - 1)
            : Math.min(select.options.length - 1, currentIndex + 1);
        select.selectedIndex = newIndex;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };

    return (
      <div ref={ref} className={cn('w-full', className)}>
        {/* Label */}
        <label className="mb-1 block text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>

        {/* Time Inputs */}
        <div className="relative">
          <div className="flex items-center gap-2">
            {/* Hour Select */}
            <select
              value={hour}
              onChange={handleHourChange}
              onBlur={onBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className={cn(selectVariants({ state }), 'flex-1')}
              aria-label="Hour"
              aria-invalid={hasError}
              aria-describedby={
                error
                  ? `${label}-error`
                  : helperText
                    ? `${label}-helper`
                    : undefined
              }
            >
              <option value="">HH</option>
              {hourOptions.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>

            <span className="text-muted-foreground">:</span>

            {/* Minute Select */}
            <select
              value={minute}
              onChange={handleMinuteChange}
              onBlur={onBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className={cn(selectVariants({ state }), 'flex-1')}
              aria-label="Minute"
              aria-invalid={hasError}
            >
              <option value="">MM</option>
              {minuteOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Period Select (12-hour format) */}
            {is12Hour && (
              <select
                value={period}
                onChange={handlePeriodChange}
                onBlur={onBlur}
                disabled={disabled}
                className={cn(selectVariants({ state }), 'w-20')}
                aria-label="Period"
                aria-invalid={hasError}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            )}

            {/* Clear Button */}
            {showClearButton && currentValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Clear time"
                tabIndex={-1}
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Clock Icon */}
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Helper Text / Error */}
        <div className="mt-1 text-xs">
          {error && (
            <p
              id={`${label}-error`}
              className="text-error"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          )}
          {!error && helperText && (
            <p id={`${label}-helper`} className="text-muted-foreground">
              {helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';
