'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { cva } from 'class-variance-authority';
import { z } from 'zod';
import { Calendar, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import 'react-day-picker/dist/style.css';

export const DatePickerPropsSchema = z.object({
  label: z.string(),
  placeholder: z.string().optional(),
  value: z.date().optional(),
  defaultValue: z.date().optional(),
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  error: z.string().optional(),
  helperText: z.string().optional(),
  mode: z.enum(['single', 'range']).optional(),
  minDate: z.date().optional(),
  maxDate: z.date().optional(),
  disabledDates: z.array(z.date()).optional(),
  dateFormat: z.string().optional(),
  showClearButton: z.boolean().optional(),
  onChange: z
    .function()
    .args(z.date().nullable())
    .returns(z.void())
    .optional(),
  onBlur: z
    .function()
    .returns(z.void())
    .optional(),
  className: z.string().optional(),
});

export type DatePickerProps = z.infer<typeof DatePickerPropsSchema>;

const triggerVariants = cva(
  'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-border focus:border-primary focus:ring-primary',
        error: 'border-error focus:border-error focus:ring-error',
      },
      hasValue: {
        true: 'text-foreground',
        false: 'text-muted-foreground',
      },
    },
    defaultVariants: {
      state: 'default',
      hasValue: false,
    },
  }
);

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (props, ref) => {
    const {
      label,
      placeholder = 'Pick a date',
      value,
      defaultValue,
      disabled,
      required,
      error,
      helperText,
      // mode = 'single',
      minDate,
      maxDate,
      disabledDates = [],
      dateFormat = 'PPP',
      showClearButton = true,
      onChange,
      onBlur,
      className,
    } = props;

    const [internalValue, setInternalValue] = React.useState<Date | undefined>(
      defaultValue
    );
    const [isOpen, setIsOpen] = React.useState(false);

    const currentValue = value !== undefined ? value : internalValue;
    const hasError = !!error;
    const state = hasError ? 'error' : 'default';

    const handleSelect = (date: Date | undefined) => {
      if (value === undefined) {
        setInternalValue(date);
      }
      onChange?.(date || null);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleSelect(undefined);
    };

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        onBlur?.();
      }
    };

    const handleTodayClick = () => {
      handleSelect(new Date());
      setIsOpen(false);
    };

    const handleClearClick = () => {
      handleSelect(undefined);
      setIsOpen(false);
    };

    const isDateDisabled = (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      if (disabledDates.some((d) => d.getTime() === date.getTime()))
        return true;
      return false;
    };

    const displayValue = currentValue
      ? format(currentValue, dateFormat)
      : placeholder;

    return (
      <div className={cn('w-full', className)}>
        {/* Label */}
        <label className="mb-1 block text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>

        {/* Popover */}
        <PopoverPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverPrimitive.Trigger
            ref={ref}
            disabled={disabled}
            className={triggerVariants({
              state,
              hasValue: !!currentValue,
            })}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${label}-error`
                : helperText
                  ? `${label}-helper`
                  : undefined
            }
          >
            <span className="flex-1 truncate text-left">{displayValue}</span>
            <div className="flex items-center gap-1">
              {showClearButton && currentValue && !disabled && (
                <div
                  role="button"
                  tabIndex={-1}
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleClear(e as unknown as React.MouseEvent);
                    }
                  }}
                  className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  aria-label="Clear date"
                >
                  <X className="h-4 w-4" />
                </div>
              )}
              <Calendar className="h-4 w-4 opacity-50" />
            </div>
          </PopoverPrimitive.Trigger>

          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="start"
              sideOffset={4}
              className="z-50 rounded-md border border-border bg-background p-0 shadow-md outline-none"
            >
              {/* Shortcuts */}
              <div className="flex gap-2 border-b border-border p-2">
                <button
                  type="button"
                  onClick={handleTodayClick}
                  className="rounded-md px-3 py-1 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={handleClearClick}
                  className="rounded-md px-3 py-1 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Clear
                </button>
              </div>

              {/* Calendar */}
              <div className="p-3">
                <DayPicker
                  mode="single"
                  selected={currentValue}
                  onSelect={handleSelect}
                  disabled={isDateDisabled}
                  className="rdp-custom"
                  classNames={{
                    months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                    month: 'space-y-4',
                    caption: 'flex justify-center pt-1 relative items-center',
                    caption_label: 'text-sm font-medium',
                    nav: 'space-x-1 flex items-center',
                    nav_button:
                      'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md transition-colors hover:bg-accent',
                    nav_button_previous: 'absolute left-1',
                    nav_button_next: 'absolute right-1',
                    table: 'w-full border-collapse space-y-1',
                    head_row: 'flex',
                    head_cell:
                      'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                    row: 'flex w-full mt-2',
                    cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                    day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors',
                    day_range_end: 'day-range-end',
                    day_selected:
                      'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                    day_today: 'bg-accent text-accent-foreground',
                    day_outside:
                      'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                    day_disabled: 'text-muted-foreground opacity-50',
                    day_range_middle:
                      'aria-selected:bg-accent aria-selected:text-accent-foreground',
                    day_hidden: 'invisible',
                  }}
                />
              </div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>

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

DatePicker.displayName = 'DatePicker';
