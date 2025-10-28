import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const DividerPropsSchema = z.object({
  orientation: z.enum(['horizontal', 'vertical']).default('horizontal').optional(),
  spacing: z.enum(['none', 'sm', 'md', 'lg']).default('md').optional(),
  className: z.string().optional(),
});

export type DividerProps = React.HTMLAttributes<HTMLHRElement> &
  z.infer<typeof DividerPropsSchema>;

const dividerVariants = cva('border-border', {
  variants: {
    orientation: {
      horizontal: 'w-full border-t',
      vertical: 'h-full border-l',
    },
    spacing: {
      none: '',
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      spacing: 'sm',
      className: 'my-2',
    },
    {
      orientation: 'horizontal',
      spacing: 'md',
      className: 'my-4',
    },
    {
      orientation: 'horizontal',
      spacing: 'lg',
      className: 'my-6',
    },
    {
      orientation: 'vertical',
      spacing: 'sm',
      className: 'mx-2',
    },
    {
      orientation: 'vertical',
      spacing: 'md',
      className: 'mx-4',
    },
    {
      orientation: 'vertical',
      spacing: 'lg',
      className: 'mx-6',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    spacing: 'md',
  },
});

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (props, ref) => {
    const {
      orientation = 'horizontal',
      spacing = 'md',
      className,
      ...rest
    } = props;

    return (
      <hr
        ref={ref}
        className={cn(dividerVariants({ orientation, spacing, className }))}
        {...rest}
      />
    );
  }
);

Divider.displayName = 'Divider';
