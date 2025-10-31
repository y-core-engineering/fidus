import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const SpinnerPropsSchema = z.object({
  size: z.enum(['sm', 'md', 'lg']).default('md').optional(),
  className: z.string().optional(),
  label: z.string().optional(),
});

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> &
  z.infer<typeof SpinnerPropsSchema>;

const spinnerVariants = cva(
  'animate-spin rounded-full border-muted border-t-primary',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-4',
        lg: 'h-12 w-12 border-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (props, ref) => {
    const { size = 'md', className, label = 'Loading', ...rest } = props;

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(spinnerVariants({ size, className }))}
        {...rest}
      >
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
