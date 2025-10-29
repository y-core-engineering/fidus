import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const StackPropsSchema = z.object({
  direction: z.enum(['horizontal', 'vertical']).default('vertical').optional(),
  spacing: z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').optional(),
  align: z.enum(['start', 'center', 'end', 'stretch']).default('stretch').optional(),
  justify: z.enum(['start', 'center', 'end', 'between', 'around']).default('start').optional(),
  wrap: z.boolean().default(false).optional(),
  className: z.string().optional(),
  children: z.any(),
});

export type StackProps = React.HTMLAttributes<HTMLDivElement> &
  z.infer<typeof StackPropsSchema>;

const stackVariants = cva('flex', {
  variants: {
    direction: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
    spacing: {
      none: 'gap-0',
      xs: 'gap-xs',
      sm: 'gap-sm',
      md: 'gap-md',
      lg: 'gap-lg',
      xl: 'gap-xl',
      '2xl': 'gap-2xl',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    direction: 'vertical',
    spacing: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
});

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => {
    const {
      direction = 'vertical',
      spacing = 'md',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      className,
      children,
      ...rest
    } = props;

    return (
      <div
        ref={ref}
        className={cn(
          stackVariants({ direction, spacing, align, justify, wrap, className })
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';
