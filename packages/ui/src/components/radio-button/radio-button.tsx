'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { z } from 'zod';
import { cn } from '../../lib/cn';

export const RadioButtonPropsSchema = z.object({
  label: z.string(),
  value: z.string(),
  checked: z.boolean().optional(),
  disabled: z.boolean().optional(),
  name: z.string().optional(),
  onChange: z
    .function()
    .args(z.string())
    .returns(z.void())
    .optional(),
  className: z.string().optional(),
});

export type RadioButtonProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> &
  z.infer<typeof RadioButtonPropsSchema>;

const radioVariants = cva(
  'h-5 w-5 shrink-0 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center',
  {
    variants: {
      state: {
        default:
          'border-border bg-background hover:border-primary focus:ring-primary',
        checked:
          'border-primary bg-background hover:border-primary-hover focus:ring-primary',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

export const RadioButton = React.forwardRef<
  HTMLInputElement,
  RadioButtonProps
>((props, ref) => {
  const {
    label,
    value,
    checked = false,
    disabled,
    name,
    onChange,
    className,
    ...rest
  } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);

  // Combine refs
  React.useImperativeHandle(ref, () => inputRef.current!);

  const state = checked ? 'checked' : 'default';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onChange?.(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow selecting with Space key
    if (e.key === ' ' && !disabled) {
      e.preventDefault();
      onChange?.(value);
    }
  };

  return (
    <div className={cn('flex items-start gap-2', className)}>
      {/* Hidden Radio Input */}
      <input
        ref={inputRef}
        type="radio"
        value={value}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
        {...rest}
      />

      {/* Custom Radio Visual */}
      <div
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) {
            onChange?.(value);
          }
        }}
        onKeyDown={handleKeyDown}
        className={radioVariants({ state })}
      >
        {/* Inner Circle */}
        {checked && (
          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
        )}
      </div>

      {/* Label */}
      <label
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          disabled && 'cursor-not-allowed opacity-70'
        )}
        onClick={() => {
          if (!disabled) {
            onChange?.(value);
          }
        }}
      >
        {label}
      </label>
    </div>
  );
});

RadioButton.displayName = 'RadioButton';

// RadioGroup Component

export const RadioGroupPropsSchema = z.object({
  label: z.string().optional(),
  value: z.string().optional(),
  defaultValue: z.string().optional(),
  disabled: z.boolean().optional(),
  error: z.string().optional(),
  helperText: z.string().optional(),
  orientation: z.enum(['horizontal', 'vertical']).default('vertical').optional(),
  onChange: z
    .function()
    .args(z.string())
    .returns(z.void())
    .optional(),
  children: z.any(),
  className: z.string().optional(),
});

export type RadioGroupProps = z.infer<typeof RadioGroupPropsSchema>;

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (props, ref) => {
    const {
      label,
      value,
      defaultValue,
      disabled,
      error,
      helperText,
      orientation = 'vertical',
      onChange,
      children,
      className,
    } = props;

    const [internalValue, setInternalValue] = React.useState(
      defaultValue || ''
    );

    const currentValue = value !== undefined ? value : internalValue;

    const handleChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    return (
      <div ref={ref} className={cn('w-full', className)}>
        {/* Group Label */}
        {label && (
          <label className="mb-2 block text-sm font-medium text-foreground">
            {label}
          </label>
        )}

        {/* Radio Buttons */}
        <div
          role="radiogroup"
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${label}-error`
              : helperText
                ? `${label}-helper`
                : undefined
          }
          className={cn(
            'flex gap-4',
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
          )}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement<RadioButtonProps>(child) && child.type === RadioButton) {
              return React.cloneElement(child, {
                checked: child.props.value === currentValue,
                onChange: handleChange,
                disabled: disabled || child.props.disabled,
              });
            }
            return child;
          })}
        </div>

        {/* Helper Text / Error */}
        {(error || helperText) && (
          <div className="mt-2 text-xs">
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

RadioGroup.displayName = 'RadioGroup';
