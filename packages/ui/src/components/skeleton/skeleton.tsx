import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const SkeletonPropsSchema = z.object({
  variant: z.enum(['text', 'circular', 'rectangular']).default('rectangular').optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  className: z.string().optional(),
});

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> &
  z.infer<typeof SkeletonPropsSchema>;

const skeletonVariants = cva('animate-pulse bg-muted', {
  variants: {
    variant: {
      text: 'rounded h-4',
      circular: 'rounded-full',
      rectangular: 'rounded',
    },
  },
  defaultVariants: {
    variant: 'rectangular',
  },
});

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (props, ref) => {
    const { variant = 'rectangular', width, height, className, style, ...rest } = props;

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn(skeletonVariants({ variant, className }))}
        style={{
          width,
          height,
          ...style,
        }}
        {...rest}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';
