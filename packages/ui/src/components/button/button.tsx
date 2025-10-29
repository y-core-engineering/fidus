import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const ButtonPropsSchema = z.object({
  variant: z.enum(['primary', 'secondary', 'tertiary', 'destructive']).optional().default('primary'),
  size: z.enum(['sm', 'md', 'lg']).optional().default('md'),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  asChild: z.boolean().optional(),
  className: z.string().optional(),
  type: z.enum(['button', 'submit', 'reset']).optional(),
  children: z.any(),
  onClick: z.function().args(z.any()).returns(z.void()).optional(),
});

export type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> &
  Omit<z.infer<typeof ButtonPropsSchema>, 'variant' | 'size'> & {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
  };

const buttonVariants = cva(
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
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-md',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = 'primary',
      size = 'md',
      disabled,
      loading,
      asChild,
      children,
      className,
      type = 'button',
      ...rest
    } = props;

    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...rest}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
