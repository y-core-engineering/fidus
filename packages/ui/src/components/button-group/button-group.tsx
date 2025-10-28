import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const ButtonGroupPropsSchema = z.object({
  orientation: z.enum(['horizontal', 'vertical']).default('horizontal'),
  className: z.string().optional(),
  children: z.any(),
});

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> &
  z.infer<typeof ButtonGroupPropsSchema>;

const buttonGroupVariants = cva('inline-flex', {
  variants: {
    orientation: {
      horizontal: 'flex-row [&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md [&>button:not(:last-child)]:border-r-0',
      vertical: 'flex-col [&>button]:rounded-none [&>button:first-child]:rounded-t-md [&>button:last-child]:rounded-b-md [&>button:not(:last-child)]:border-b-0',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (props, ref) => {
    const { orientation = 'horizontal', className, children, ...rest } = props;

    return (
      <div
        ref={ref}
        role="group"
        className={cn(buttonGroupVariants({ orientation, className }))}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';
