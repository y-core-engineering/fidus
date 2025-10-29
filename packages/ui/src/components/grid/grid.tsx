import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const GridPropsSchema = z.object({
  cols: z
    .enum(['1', '2', '3', '4', '6', '12'])
    .default('3')
    .optional(),
  gap: z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl']).default('md').optional(),
  className: z.string().optional(),
  children: z.any(),
});

export type GridProps = React.HTMLAttributes<HTMLDivElement> &
  z.infer<typeof GridPropsSchema>;

const gridVariants = cva('grid w-full', {
  variants: {
    cols: {
      '1': 'grid-cols-1',
      '2': 'grid-cols-1 md:grid-cols-2',
      '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      '6': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
      '12': 'grid-cols-4 md:grid-cols-6 lg:grid-cols-12',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-xs',
      sm: 'gap-sm',
      md: 'gap-md',
      lg: 'gap-lg',
      xl: 'gap-xl',
    },
  },
  defaultVariants: {
    cols: '3',
    gap: 'md',
  },
});

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (props, ref) => {
    const { cols = '3', gap = 'md', className, children, ...rest } = props;

    return (
      <div
        ref={ref}
        className={cn(gridVariants({ cols, gap, className }))}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';
