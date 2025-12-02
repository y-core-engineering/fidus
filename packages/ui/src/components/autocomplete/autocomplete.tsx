'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { z } from 'zod';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '../../lib/cn';

export const AutocompletePropsSchema = z.object({
  label: z.string(),
  placeholder: z.string().optional(),
  value: z.string().optional(),
  suggestions: z.array(z.string()),
  disabled: z.boolean().optional(),
  error: z.string().optional(),
  helperText: z.string().optional(),
  maxSuggestions: z.number().optional(),
  allowCustomValue: z.boolean().optional(),
  clearable: z.boolean().optional(),
  onChange: z.function().args(z.string()).returns(z.void()).optional(),
  onSelect: z.function().args(z.string()).returns(z.void()).optional(),
  onClear: z.function().returns(z.void()).optional(),
  className: z.string().optional(),
});

export type AutocompleteProps = z.infer<typeof AutocompletePropsSchema> & {
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const inputVariants = cva(
  'w-full rounded-md border bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-border focus:border-primary focus:ring-primary',
        error: 'border-error focus:border-error focus:ring-error',
      },
      hasSuffix: {
        true: 'pr-16',
        false: 'pr-10',
      },
    },
    defaultVariants: {
      state: 'default',
      hasSuffix: false,
    },
  }
);

const suggestionItemVariants = cva(
  'relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors',
  {
    variants: {
      highlighted: {
        true: 'bg-primary/10 text-primary',
        false: 'hover:bg-muted',
      },
      selected: {
        true: 'font-medium',
        false: '',
      },
    },
    defaultVariants: {
      highlighted: false,
      selected: false,
    },
  }
);

export const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (props, ref) => {
    const {
      label,
      placeholder = 'Type to search...',
      value: controlledValue,
      suggestions,
      disabled = false,
      error,
      helperText,
      maxSuggestions = 10,
      allowCustomValue = true,
      clearable = true,
      onChange,
      onSelect,
      onClear,
      onKeyDown,
      className,
    } = props;

    const [internalValue, setInternalValue] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

    // Filter suggestions based on input
    const filteredSuggestions = React.useMemo(() => {
      if (!currentValue.trim()) return suggestions.slice(0, maxSuggestions);

      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(currentValue.toLowerCase())
      );
      return filtered.slice(0, maxSuggestions);
    }, [suggestions, currentValue, maxSuggestions]);

    // Update value
    const updateValue = (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateValue(e.target.value);
      setIsOpen(true);
      setHighlightedIndex(-1);
    };

    // Handle suggestion selection
    const handleSelect = (suggestion: string) => {
      updateValue(suggestion);
      onSelect?.(suggestion);
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    };

    // Handle clear
    const handleClear = () => {
      updateValue('');
      onClear?.();
      inputRef.current?.focus();
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);

      if (e.defaultPrevented) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev < filteredSuggestions.length - 1 ? prev + 1 : 0
            );
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredSuggestions.length - 1
            );
          }
          break;

        case 'Enter':
          if (isOpen && highlightedIndex >= 0) {
            e.preventDefault();
            handleSelect(filteredSuggestions[highlightedIndex]);
          } else if (allowCustomValue && currentValue.trim()) {
            onSelect?.(currentValue.trim());
            setIsOpen(false);
          }
          break;

        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;

        case 'Tab':
          setIsOpen(false);
          break;
      }
    };

    // Handle focus
    const handleFocus = () => {
      setIsOpen(true);
    };

    // Handle blur
    const handleBlur = () => {
      // Delay closing to allow click on suggestions
      setTimeout(() => {
        if (!listRef.current?.contains(document.activeElement)) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      }, 150);
    };

    // Scroll highlighted item into view
    React.useEffect(() => {
      if (highlightedIndex >= 0 && listRef.current) {
        const items = listRef.current.querySelectorAll('[data-suggestion-item]');
        const highlightedItem = items[highlightedIndex] as HTMLElement;
        if (highlightedItem) {
          highlightedItem.scrollIntoView({ block: 'nearest' });
        }
      }
    }, [highlightedIndex]);

    const hasError = !!error;
    const showClear = clearable && currentValue && !disabled;
    const showSuggestions = isOpen && filteredSuggestions.length > 0 && !disabled;

    return (
      <div className={cn('relative w-full', className)}>
        {/* Label */}
        {label && (
          <label className="mb-1 block text-sm font-medium text-foreground">
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={currentValue}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={inputVariants({
              state: hasError ? 'error' : 'default',
              hasSuffix: !!showClear,
            })}
            role="combobox"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-invalid={hasError}
            aria-describedby={
              error ? `${label}-error` : helperText ? `${label}-helper` : undefined
            }
            data-testid="autocomplete-input"
          />

          {/* Suffix Icons */}
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {/* Clear Button */}
            {showClear && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Clear input"
                tabIndex={-1}
                data-testid="autocomplete-clear"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Dropdown Indicator */}
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform',
                isOpen && 'rotate-180'
              )}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <ul
            ref={listRef}
            role="listbox"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background py-1 shadow-lg"
            data-testid="autocomplete-suggestions"
          >
            {filteredSuggestions.map((suggestion, index) => {
              const isHighlighted = index === highlightedIndex;
              const isSelected = suggestion.toLowerCase() === currentValue.toLowerCase();

              return (
                <li
                  key={suggestion}
                  role="option"
                  aria-selected={isSelected}
                  data-suggestion-item
                  className={suggestionItemVariants({
                    highlighted: isHighlighted,
                    selected: isSelected,
                  })}
                  onClick={() => handleSelect(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  data-testid={`autocomplete-option-${index}`}
                >
                  {suggestion}
                  {isSelected && (
                    <Check className="ml-auto h-4 w-4 text-primary" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* No Suggestions Message */}
        {isOpen && filteredSuggestions.length === 0 && currentValue.trim() && !disabled && (
          <div
            className="absolute z-50 mt-1 w-full rounded-md border bg-background p-3 text-sm text-muted-foreground shadow-lg"
            data-testid="autocomplete-no-results"
          >
            {allowCustomValue ? (
              <>Press Enter to add &quot;{currentValue.trim()}&quot;</>
            ) : (
              'No results found'
            )}
          </div>
        )}

        {/* Helper Text / Error */}
        {(error || helperText) && (
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
        )}
      </div>
    );
  }
);

Autocomplete.displayName = 'Autocomplete';
