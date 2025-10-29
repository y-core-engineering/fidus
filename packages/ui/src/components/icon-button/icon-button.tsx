import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const IconButtonPropsSchema = z.object({
  variant: z.enum(['primary', 'secondary', 'tertiary', 'destructive']).optional().default('primary'),
  size: z.enum(['sm', 'md', 'lg']).optional().default('md'),
  disabled: z.boolean().optional(),
  className: z.string().optional(),
  type: z.enum(['button', 'submit', 'reset']).optional(),
  'aria-label': z.string(),
  children: z.any(),
  onClick: z.function().args(z.any()).returns(z.void()).optional(),
});

export type IconButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> &
  Omit<z.infer<typeof IconButtonPropsSchema>, 'variant' | 'size'> & {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
  };

const iconButtonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-black hover:bg-primary-hover active:bg-primary-active shadow-sm',
        secondary:
          'bg-black text-primary border-2 border-primary hover:bg-black/90',
        tertiary:
          'bg-transparent text-foreground border border-border hover:bg-muted',
        destructive:
          'bg-error text-white hover:bg-error/90 shadow-sm',
      },
      size: {
        sm: 'h-8 w-8 p-1.5',
        md: 'h-10 w-10 p-2',
        lg: 'h-12 w-12 p-2.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    const {
      variant = 'primary',
      size = 'md',
      disabled,
      children,
      className,
      type = 'button',
      'aria-label': ariaLabel,
      ...rest
    } = props;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(iconButtonVariants({ variant, size, className }))}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
