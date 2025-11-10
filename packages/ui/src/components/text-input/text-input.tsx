import * as React from 'react';
import { cva } from 'class-variance-authority';
import { z } from 'zod';
import { Check, X, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/cn';

export const TextInputPropsSchema = z.object({
  label: z.string(),
  type: z
    .enum(['text', 'email', 'password', 'number', 'search', 'tel', 'url'])
    .default('text')
    .optional(),
  placeholder: z.string().optional(),
  value: z.string().optional(),
  defaultValue: z.string().optional(),
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  error: z.string().optional(),
  helperText: z.string().optional(),
  showValidIcon: z.boolean().optional(),
  showErrorIcon: z.boolean().optional(),
  showPasswordToggle: z.boolean().optional(),
  maxLength: z.number().optional(),
  showCharCount: z.boolean().optional(),
  leadingIcon: z.any().optional(),
  trailingIcon: z.any().optional(),
  onChange: z
    .function()
    .args(z.custom<React.ChangeEvent<HTMLInputElement>>())
    .returns(z.void())
    .optional(),
  onBlur: z
    .function()
    .args(z.custom<React.FocusEvent<HTMLInputElement>>())
    .returns(z.void())
    .optional(),
  onFocus: z
    .function()
    .args(z.custom<React.FocusEvent<HTMLInputElement>>())
    .returns(z.void())
    .optional(),
  className: z.string().optional(),
});

export type TextInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'onBlur' | 'onFocus'
> &
  z.infer<typeof TextInputPropsSchema>;

const inputVariants = cva(
  'w-full rounded-md border bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-border focus:border-primary focus:ring-primary',
        error: 'border-error focus:border-error focus:ring-error',
        valid: 'border-success focus:border-success focus:ring-success',
      },
      hasPrefix: {
        true: 'pl-10',
        false: '',
      },
      hasSuffix: {
        true: 'pr-10',
        false: '',
      },
    },
    defaultVariants: {
      state: 'default',
      hasPrefix: false,
      hasSuffix: false,
    },
  }
);

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const {
      label,
      type = 'text',
      placeholder,
      value,
      defaultValue,
      disabled,
      required,
      error,
      helperText,
      showValidIcon = true,
      showErrorIcon = true,
      showPasswordToggle = true,
      maxLength,
      showCharCount = false,
      leadingIcon,
      trailingIcon,
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
    const [showPassword, setShowPassword] = React.useState(false);

    const currentValue = value !== undefined ? value : internalValue;
    const isPassword = type === 'password';
    const inputType =
      isPassword && showPassword && showPasswordToggle ? 'text' : type;

    // Determine state
    const hasError = !!error;
    const isValid =
      !hasError && currentValue.length > 0 && !isFocused && showValidIcon;
    const state = hasError ? 'error' : isValid ? 'valid' : 'default';

    // Calculate icons
    const hasSuffixIcon =
      (isPassword && showPasswordToggle) ||
      hasError ||
      isValid ||
      !!trailingIcon;
    const hasLeadingIcon = !!leadingIcon;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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

        {/* Input Container */}
        <div className="relative">
          {/* Leading Icon */}
          {leadingIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leadingIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            value={currentValue}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={inputVariants({
              state,
              hasPrefix: hasLeadingIcon,
              hasSuffix: hasSuffixIcon,
            })}
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

          {/* Suffix Icons */}
          {hasSuffixIcon && (
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
              {/* Custom Trailing Icon */}
              {trailingIcon && !hasError && !isValid && <div>{trailingIcon}</div>}

              {/* Valid Icon */}
              {isValid && showValidIcon && (
                <Check className="h-5 w-5 text-success" aria-label="Valid" />
              )}

              {/* Error Icon */}
              {hasError && showErrorIcon && (
                <X className="h-5 w-5 text-error" aria-label="Error" />
              )}

              {/* Password Toggle */}
              {isPassword && showPasswordToggle && !hasError && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
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

TextInput.displayName = 'TextInput';
