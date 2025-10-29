import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const ListPropsSchema = z.object({
  variant: z.enum(['ordered', 'unordered', 'none']).default('unordered').optional(),
  spacing: z.enum(['none', 'sm', 'md', 'lg']).default('md').optional(),
  className: z.string().optional(),
  children: z.any(),
});

export type ListProps = React.HTMLAttributes<HTMLUListElement | HTMLOListElement> &
  z.infer<typeof ListPropsSchema>;

const listVariants = cva('', {
  variants: {
    variant: {
      ordered: 'list-decimal',
      unordered: 'list-disc',
      none: 'list-none',
    },
    spacing: {
      none: 'space-y-0',
      sm: 'space-y-1',
      md: 'space-y-2',
      lg: 'space-y-4',
    },
  },
  defaultVariants: {
    variant: 'unordered',
    spacing: 'md',
  },
});

export const List = React.forwardRef<
  HTMLUListElement | HTMLOListElement,
  ListProps
>((props, ref) => {
  const { variant = 'unordered', spacing = 'md', className, children, ...rest } = props;

  const Component = variant === 'ordered' ? 'ol' : 'ul';

  return (
    <Component
      ref={ref as any}
      className={cn(listVariants({ variant, spacing }), 'pl-6', className)}
      {...rest}
    >
      {children}
    </Component>
  );
});

List.displayName = 'List';

export const ListItemPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any(),
});

export type ListItemProps = React.LiHTMLAttributes<HTMLLIElement> &
  z.infer<typeof ListItemPropsSchema>;

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, children, ...props }, ref) => (
    <li ref={ref} className={cn('text-foreground', className)} {...props}>
      {children}
    </li>
  )
);

ListItem.displayName = 'ListItem';
