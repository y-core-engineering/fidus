import * as React from 'react';
import { cva } from 'class-variance-authority';
import { z } from 'zod';
import { Check, X } from 'lucide-react';
import { cn } from '../../lib/cn';

export const TextAreaPropsSchema = z.object({
  label: z.string(),
  placeholder: z.string().optional(),
  value: z.string().optional(),
  defaultValue: z.string().optional(),
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  error: z.string().optional(),
  helperText: z.string().optional(),
  showValidIcon: z.boolean().optional(),
  showErrorIcon: z.boolean().optional(),
  maxLength: z.number().optional(),
  showCharCount: z.boolean().default(true).optional(),
  rows: z.number().default(4).optional(),
  resize: z.enum(['none', 'vertical', 'horizontal', 'both']).default('vertical').optional(),
  onChange: z
    .function()
    .args(z.custom<React.ChangeEvent<HTMLTextAreaElement>>())
    .returns(z.void())
    .optional(),
  onBlur: z
    .function()
    .args(z.custom<React.FocusEvent<HTMLTextAreaElement>>())
    .returns(z.void())
    .optional(),
  onFocus: z
    .function()
    .args(z.custom<React.FocusEvent<HTMLTextAreaElement>>())
    .returns(z.void())
    .optional(),
  className: z.string().optional(),
});

export type TextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'onBlur' | 'onFocus'
> &
  z.infer<typeof TextAreaPropsSchema>;

const textAreaVariants = cva(
  'w-full rounded-md border bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-border focus:border-primary focus:ring-primary',
        error: 'border-error focus:border-error focus:ring-error',
        valid: 'border-success focus:border-success focus:ring-success',
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
      },
    },
    defaultVariants: {
      state: 'default',
      resize: 'vertical',
    },
  }
);

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    const {
      label,
      placeholder,
      value,
      defaultValue,
      disabled,
      required,
      error,
      helperText,
      showValidIcon = true,
      showErrorIcon = true,
      maxLength,
      showCharCount = true,
      rows = 4,
      resize = 'vertical',
      onChange,
      onBlur,
      onFocus,
      className,
      ...rest
    } = props;

    const [internalValue, setInternalValue] = React.useState(
      defaultValue || ''
    );
    const [isFocused, setIsFocused] = React.useState(false);

    const currentValue = value !== undefined ? value : internalValue;

    // Determine state
    const hasError = !!error;
    const isValid =
      !hasError && currentValue.length > 0 && !isFocused && showValidIcon;
    const state = hasError ? 'error' : isValid ? 'valid' : 'default';

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const charCount = currentValue.length;
    const showCount = showCharCount && maxLength;

    return (
      <div className={cn('w-full', className)}>
        {/* Label */}
        <label className="mb-1 block text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>

        {/* TextArea Container */}
        <div className="relative">
          {/* TextArea */}
          <textarea
            ref={ref}
            value={currentValue}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            rows={rows}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={textAreaVariants({ state, resize })}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${label}-error`
                : helperText
                  ? `${label}-helper`
                  : undefined
            }
            {...rest}
          />

          {/* Icons (top-right corner) */}
          {(isValid || hasError) && (
            <div className="absolute right-3 top-3">
              {/* Valid Icon */}
              {isValid && showValidIcon && (
                <Check className="h-5 w-5 text-success" aria-label="Valid" />
              )}

              {/* Error Icon */}
              {hasError && showErrorIcon && (
                <X className="h-5 w-5 text-error" aria-label="Error" />
              )}
            </div>
          )}
        </div>

        {/* Helper Text / Error / Char Count */}
        <div className="mt-1 flex items-center justify-between text-xs">
          <div>
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

          {showCount && (
            <p
              className={cn(
                'text-muted-foreground',
                charCount > maxLength! && 'text-error'
              )}
            >
              {charCount} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
