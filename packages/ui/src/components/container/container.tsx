import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const ContainerPropsSchema = z.object({
  size: z.enum(['sm', 'md', 'lg', 'xl', 'full']).default('lg'),
  padding: z.enum(['none', 'sm', 'md', 'lg']).default('md'),
  className: z.string().optional(),
  children: z.any(),
  as: z.enum(['div', 'section', 'article', 'main']).default('div').optional(),
});

export type ContainerProps = React.HTMLAttributes<HTMLElement> &
  z.infer<typeof ContainerPropsSchema>;

const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
    },
    padding: {
      none: 'px-0',
      sm: 'px-4',
      md: 'px-6',
      lg: 'px-8',
    },
  },
  defaultVariants: {
    size: 'lg',
    padding: 'md',
  },
});

export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  (props, ref) => {
    const {
      size = 'lg',
      padding = 'md',
      className,
      children,
      as: Component = 'div',
      ...rest
    } = props;

    return (
      <Component
        ref={ref as any}
        className={cn(containerVariants({ size, padding, className }))}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';
