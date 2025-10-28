import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const BadgePropsSchema = z.object({
  variant: z
    .enum(['urgent', 'important', 'normal', 'low', 'success', 'warning', 'error', 'info'])
    .default('normal')
    .optional(),
  size: z.enum(['sm', 'md', 'lg']).default('md').optional(),
  className: z.string().optional(),
  children: z.any(),
});

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  z.infer<typeof BadgePropsSchema>;

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        urgent: 'bg-urgent/10 text-urgent border border-urgent/20',
        important: 'bg-warning/10 text-warning border border-warning/20',
        normal: 'bg-info/10 text-info border border-info/20',
        low: 'bg-muted text-muted-foreground border border-border',
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        error: 'bg-error/10 text-error border border-error/20',
        info: 'bg-info/10 text-info border border-info/20',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-md',
      },
    },
    defaultVariants: {
      variant: 'normal',
      size: 'md',
    },
  }
);

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (props, ref) => {
    const { variant = 'normal', size = 'md', className, children, ...rest } = props;

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...rest}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
