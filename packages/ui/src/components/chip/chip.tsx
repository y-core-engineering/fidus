'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';
import { X } from 'lucide-react';

// Zod schema for props validation
export const ChipPropsSchema = z.object({
  variant: z.enum(['filled', 'outlined']).default('filled').optional(),
  size: z.enum(['sm', 'md', 'lg']).default('md').optional(),
  dismissible: z.boolean().default(false).optional(),
  onDismiss: z.function().args().returns(z.void()).optional(),
  className: z.string().optional(),
  children: z.any(),
});

export type ChipProps = React.HTMLAttributes<HTMLDivElement> &
  z.infer<typeof ChipPropsSchema>;

const chipVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        filled: 'bg-muted text-foreground',
        outlined: 'bg-transparent text-foreground border border-border',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-md',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
    },
  }
);

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>((props, ref) => {
  const {
    variant = 'filled',
    size = 'md',
    dismissible = false,
    onDismiss,
    className,
    children,
    ...rest
  } = props;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss?.();
  };

  return (
    <div
      ref={ref}
      className={cn(chipVariants({ variant, size, className }))}
      {...rest}
    >
      <span>{children}</span>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
          aria-label="Remove"
        >
          <X className={cn(size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} />
        </button>
      )}
    </div>
  );
});

Chip.displayName = 'Chip';
