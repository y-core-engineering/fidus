'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { z } from 'zod';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../lib/cn';

export const CheckboxPropsSchema = z.object({
  label: z.string().optional(),
  checked: z.boolean().optional(),
  defaultChecked: z.boolean().optional(),
  indeterminate: z.boolean().optional(),
  disabled: z.boolean().optional(),
  error: z.string().optional(),
  helperText: z.string().optional(),
  onChange: z
    .function()
    .args(z.boolean())
    .returns(z.void())
    .optional(),
  className: z.string().optional(),
});

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> &
  z.infer<typeof CheckboxPropsSchema>;

const checkboxVariants = cva(
  'h-5 w-5 shrink-0 rounded border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default:
          'border-border bg-background hover:border-primary focus:ring-primary',
        checked:
          'border-primary bg-primary text-white hover:bg-primary-hover focus:ring-primary',
        indeterminate:
          'border-primary bg-primary text-white hover:bg-primary-hover focus:ring-primary',
        error:
          'border-error bg-background hover:border-error focus:ring-error',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const {
      label,
      checked,
      defaultChecked,
      indeterminate = false,
      disabled,
      error,
      helperText,
      onChange,
      className,
      ...rest
    } = props;

    const [internalChecked, setInternalChecked] = React.useState(
      defaultChecked || false
    );

    const isChecked = checked !== undefined ? checked : internalChecked;
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    // Set indeterminate state on the actual input element
    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const state = error
      ? 'error'
      : indeterminate
        ? 'indeterminate'
        : isChecked
          ? 'checked'
          : 'default';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      if (checked === undefined) {
        setInternalChecked(newChecked);
      }
      onChange?.(newChecked);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      // Allow toggling with Space key
      if (e.key === ' ' && !disabled) {
        e.preventDefault();
        const newChecked = !isChecked;
        if (checked === undefined) {
          setInternalChecked(newChecked);
        }
        onChange?.(newChecked);
      }
    };

    return (
      <div className={cn('flex flex-col', className)}>
        <div className="flex items-start gap-2">
          {/* Hidden Checkbox Input */}
          <input
            ref={inputRef}
            type="checkbox"
            checked={isChecked}
            disabled={disabled}
            onChange={handleChange}
            className="sr-only"
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${label}-error`
                : helperText
                  ? `${label}-helper`
                  : undefined
            }
            {...rest}
          />

          {/* Custom Checkbox Visual */}
          <div
            role="checkbox"
            aria-checked={indeterminate ? 'mixed' : isChecked}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onClick={() => {
              if (!disabled) {
                const newChecked = !isChecked;
                if (checked === undefined) {
                  setInternalChecked(newChecked);
                }
                onChange?.(newChecked);
              }
            }}
            onKeyDown={handleKeyDown}
            className={checkboxVariants({ state })}
          >
            {/* Checkmark */}
            {isChecked && !indeterminate && (
              <Check className="h-4 w-4" strokeWidth={3} />
            )}

            {/* Indeterminate Mark */}
            {indeterminate && <Minus className="h-4 w-4" strokeWidth={3} />}
          </div>

          {/* Label */}
          {label && (
            <label
              className={cn(
                'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                disabled && 'cursor-not-allowed opacity-70'
              )}
              onClick={() => {
                if (!disabled) {
                  const newChecked = !isChecked;
                  if (checked === undefined) {
                    setInternalChecked(newChecked);
                  }
                  onChange?.(newChecked);
                }
              }}
            >
              {label}
            </label>
          )}
        </div>

        {/* Helper Text / Error */}
        {(error || helperText) && (
          <div className="ml-7 mt-1 text-xs">
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
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
