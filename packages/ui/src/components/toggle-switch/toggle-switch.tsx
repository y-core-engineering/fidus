import * as React from 'react';
import { cva } from 'class-variance-authority';
import { z } from 'zod';
import { cn } from '../../lib/cn';

export const ToggleSwitchPropsSchema = z.object({
  label: z.string().optional(),
  checked: z.boolean().optional(),
  defaultChecked: z.boolean().optional(),
  disabled: z.boolean().optional(),
  error: z.string().optional(),
  helperText: z.string().optional(),
  size: z.enum(['sm', 'md', 'lg']).default('md').optional(),
  labelPosition: z.enum(['left', 'right']).default('right').optional(),
  onChange: z
    .function()
    .args(z.boolean())
    .returns(z.void())
    .optional(),
  className: z.string().optional(),
});

export type ToggleSwitchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'onChange'
> &
  z.infer<typeof ToggleSwitchPropsSchema>;

const switchVariants = cva(
  'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      checked: {
        true: 'bg-primary focus:ring-primary',
        false: 'bg-muted focus:ring-muted',
      },
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-14',
      },
    },
    defaultVariants: {
      checked: false,
      size: 'md',
    },
  }
);

const thumbVariants = cva(
  'pointer-events-none inline-block transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
  {
    variants: {
      checked: {
        true: '',
        false: '',
      },
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    compoundVariants: [
      { checked: true, size: 'sm', class: 'translate-x-4' },
      { checked: true, size: 'md', class: 'translate-x-5' },
      { checked: true, size: 'lg', class: 'translate-x-7' },
      { checked: false, size: 'sm', class: 'translate-x-0' },
      { checked: false, size: 'md', class: 'translate-x-0' },
      { checked: false, size: 'lg', class: 'translate-x-0' },
    ],
    defaultVariants: {
      checked: false,
      size: 'md',
    },
  }
);

export const ToggleSwitch = React.forwardRef<
  HTMLInputElement,
  ToggleSwitchProps
>((props, ref) => {
  const {
    label,
    checked,
    defaultChecked = false,
    disabled,
    error,
    helperText,
    size = 'md',
    labelPosition = 'right',
    onChange,
    className,
    ...rest
  } = props;

  // SSR-safe: Track client-side hydration
  const [isClient, setIsClient] = React.useState(false);
  const [internalChecked, setInternalChecked] =
    React.useState(defaultChecked);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const inputRef = React.useRef<HTMLInputElement>(null);

  // Combine refs
  React.useImperativeHandle(ref, () => inputRef.current!);

  const isChecked = checked !== undefined ? checked : internalChecked;

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

  const handleClick = () => {
    if (!disabled) {
      const newChecked = !isChecked;
      if (checked === undefined) {
        setInternalChecked(newChecked);
      }
      onChange?.(newChecked);
    }
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <div
        className={cn(
          'flex items-center gap-3',
          labelPosition === 'left' && 'flex-row-reverse justify-end'
        )}
      >
        {/* Hidden Checkbox Input */}
        <input
          ref={inputRef}
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          role="switch"
          aria-checked={isChecked}
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

        {/* Switch Visual */}
        {/* SSR-safe: Render switch visual always, but animation depends on client state */}
        <div
          role="switch"
          aria-checked={isChecked}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={switchVariants({ checked: isChecked, size })}
        >
          <span className={thumbVariants({ checked: isClient ? isChecked : false, size })} />
        </div>

        {/* Label */}
        {label && (
          <label
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              disabled && 'cursor-not-allowed opacity-70'
            )}
            onClick={handleClick}
          >
            {label}
          </label>
        )}
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
});

ToggleSwitch.displayName = 'ToggleSwitch';
