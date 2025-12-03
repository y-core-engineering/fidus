'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const CardPropsSchema = z.object({
  variant: z.enum(['default', 'outlined', 'elevated']).default('default').optional(),
  interactive: z.boolean().default(false).optional(),
  selected: z.boolean().default(false).optional(),
  padding: z.enum(['none', 'sm', 'md', 'lg']).default('md').optional(),
  className: z.string().optional(),
  onClick: z.function().args().returns(z.void()).optional(),
  children: z.any(),
});

export type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> &
  z.infer<typeof CardPropsSchema>;

const cardVariants = cva(
  'rounded-lg bg-card transition-all',
  {
    variants: {
      variant: {
        default: 'border border-border shadow-sm',
        outlined: 'border border-border',
        elevated: 'shadow-md',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-md hover:border-primary/50',
        false: '',
      },
      selected: {
        true: 'ring-2 ring-primary border-primary',
        false: '',
      },
      padding: {
        none: 'p-0',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: false,
      selected: false,
      padding: 'md',
    },
  }
);

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => {
    const {
      variant = 'default',
      interactive = false,
      selected = false,
      padding = 'md',
      className,
      onClick,
      children,
      ...rest
    } = props;

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (interactive && onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, interactive, selected, padding }), className)}
        onClick={interactive ? onClick : undefined}
        onKeyDown={interactive ? handleKeyDown : undefined}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// CardHeader Component
export const CardHeaderPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any(),
});

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> &
  z.infer<typeof CardHeaderPropsSchema>;

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5', className)}
      {...rest}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

// CardTitle Component
export const CardTitlePropsSchema = z.object({
  className: z.string().optional(),
  children: z.any(),
});

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> &
  z.infer<typeof CardTitlePropsSchema>;

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...rest }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-foreground', className)}
      {...rest}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

// CardDescription Component
export const CardDescriptionPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any(),
});

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> &
  z.infer<typeof CardDescriptionPropsSchema>;

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...rest }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...rest}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

// CardContent Component
export const CardContentPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any(),
});

export type CardContentProps = React.HTMLAttributes<HTMLDivElement> &
  z.infer<typeof CardContentPropsSchema>;

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...rest }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...rest}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

// CardFooter Component
export const CardFooterPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any(),
});

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement> &
  z.infer<typeof CardFooterPropsSchema>;

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4', className)}
      {...rest}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';
