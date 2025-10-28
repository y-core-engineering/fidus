'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cva } from 'class-variance-authority';
import { z } from 'zod';
import { Check, ChevronDown, X, Search } from 'lucide-react';
import { cn } from '../../lib/cn';

export const SelectOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  disabled: z.boolean().optional(),
});

export const SelectGroupSchema = z.object({
  label: z.string(),
  options: z.array(SelectOptionSchema),
});

export const SelectPropsSchema = z.object({
  label: z.string(),
  placeholder: z.string().optional(),
  value: z.string().optional(),
  defaultValue: z.string().optional(),
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  error: z.string().optional(),
  helperText: z.string().optional(),
  options: z.array(SelectOptionSchema).optional(),
  groups: z.array(SelectGroupSchema).optional(),
  multiple: z.boolean().optional(),
  searchable: z.boolean().optional(),
  clearable: z.boolean().optional(),
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

export type SelectOption = z.infer<typeof SelectOptionSchema>;
export type SelectGroup = z.infer<typeof SelectGroupSchema>;
export type SelectProps = z.infer<typeof SelectPropsSchema>;

const triggerVariants = cva(
  'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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

const contentVariants = cva(
  'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-border bg-background text-foreground shadow-md',
  {
    variants: {
      position: {
        popper:
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
      },
    },
    defaultVariants: {
      position: 'popper',
    },
  }
);

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (props, ref) => {
    const {
      label,
      placeholder = 'Select an option...',
      value,
      defaultValue,
      disabled,
      required,
      error,
      helperText,
      options = [],
      groups = [],
      searchable = false,
      clearable = false,
      onChange,
      onBlur,
      className,
    } = props;

    const [internalValue, setInternalValue] = React.useState(
      defaultValue || ''
    );
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);

    const currentValue = value !== undefined ? value : internalValue;
    const hasError = !!error;
    const state = hasError ? 'error' : 'default';

    // Flatten options from groups
    const allOptions = React.useMemo(() => {
      const flatOptions = [...options];
      groups.forEach((group) => {
        flatOptions.push(...group.options);
      });
      return flatOptions;
    }, [options, groups]);

    // Filter options based on search query
    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchQuery) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery, searchable]);

    const filteredGroups = React.useMemo(() => {
      if (!searchable || !searchQuery) return groups;
      return groups
        .map((group) => ({
          ...group,
          options: group.options.filter((option) =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((group) => group.options.length > 0);
    }, [groups, searchQuery, searchable]);

    const handleValueChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleValueChange('');
    };

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        setSearchQuery('');
        onBlur?.();
      }
    };

    const selectedOption = allOptions.find(
      (option) => option.value === currentValue
    );

    return (
      <div className={cn('w-full', className)}>
        {/* Label */}
        <label className="mb-1 block text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>

        {/* Select */}
        <SelectPrimitive.Root
          value={currentValue}
          onValueChange={handleValueChange}
          disabled={disabled}
          open={isOpen}
          onOpenChange={handleOpenChange}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            className={triggerVariants({ state })}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${label}-error`
                : helperText
                  ? `${label}-helper`
                  : undefined
            }
          >
            <SelectPrimitive.Value placeholder={placeholder}>
              {selectedOption?.label || placeholder}
            </SelectPrimitive.Value>
            <div className="flex items-center gap-1">
              {clearable && currentValue && !disabled && (
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
                  aria-label="Clear selection"
                >
                  <X className="h-4 w-4" />
                </div>
              )}
              <SelectPrimitive.Icon asChild>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectPrimitive.Icon>
            </div>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className={contentVariants({ position: 'popper' })}
              position="popper"
              sideOffset={4}
            >
              {/* Search Input */}
              {searchable && (
                <div className="border-b border-border p-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setSearchQuery('');
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              <SelectPrimitive.Viewport className="p-1">
                {/* Ungrouped Options */}
                {filteredOptions.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                      <SelectPrimitive.ItemIndicator>
                        <Check className="h-4 w-4" />
                      </SelectPrimitive.ItemIndicator>
                    </span>
                    <SelectPrimitive.ItemText>
                      {option.label}
                    </SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}

                {/* Grouped Options */}
                {filteredGroups.map((group) => (
                  <SelectPrimitive.Group key={group.label}>
                    <SelectPrimitive.Label className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      {group.label}
                    </SelectPrimitive.Label>
                    {group.options.map((option) => (
                      <SelectPrimitive.Item
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      >
                        <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                          <SelectPrimitive.ItemIndicator>
                            <Check className="h-4 w-4" />
                          </SelectPrimitive.ItemIndicator>
                        </span>
                        <SelectPrimitive.ItemText>
                          {option.label}
                        </SelectPrimitive.ItemText>
                      </SelectPrimitive.Item>
                    ))}
                  </SelectPrimitive.Group>
                ))}

                {/* No results */}
                {searchable &&
                  searchQuery &&
                  filteredOptions.length === 0 &&
                  filteredGroups.length === 0 && (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No results found
                    </div>
                  )}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

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

Select.displayName = 'Select';
