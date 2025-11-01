'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { z } from 'zod';
import { cn } from '../../lib/cn';

// Zod Schema for ProgressBar props validation
export const ProgressBarPropsSchema = z.object({
  value: z.number().min(0).max(100).optional(),
  variant: z.enum(['primary', 'success', 'warning', 'error']).default('primary'),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
  showLabel: z.boolean().default(false),
  showPercentage: z.boolean().default(false),
  label: z.string().optional(),
  indeterminate: z.boolean().default(false),
});

export type ProgressBarProps = z.infer<typeof ProgressBarPropsSchema>;

// CVA Variants for ProgressBar
const progressBarRootVariants = cva('relative overflow-hidden rounded-full bg-gray-200', {
  variants: {
    size: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const progressBarIndicatorVariants = cva(
  'h-full w-full flex-1 transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600',
        success: 'bg-green-600',
        warning: 'bg-yellow-500',
        error: 'bg-red-600',
      },
      indeterminate: {
        true: 'animate-progress-indeterminate',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      indeterminate: false,
    },
  }
);

const progressBarLabelVariants = cva('mb-2 flex items-center justify-between text-sm font-medium', {
  variants: {
    variant: {
      primary: 'text-blue-900',
      success: 'text-green-900',
      warning: 'text-yellow-900',
      error: 'text-red-900',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export interface ProgressBarComponentProps extends VariantProps<typeof progressBarRootVariants> {
  value?: number;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  showPercentage?: boolean;
  label?: string;
  indeterminate?: boolean;
  className?: string;
}

export const ProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarComponentProps
>(
  (
    {
      value,
      variant = 'primary',
      size = 'md',
      showLabel = false,
      showPercentage = false,
      label,
      indeterminate = false,
      className,
      ...props
    },
    ref
  ) => {
    const displayValue = indeterminate ? undefined : value;
    const percentage = displayValue !== undefined ? Math.round(displayValue) : 0;

    return (
      <div className={cn('w-full', className)} data-testid="progress-bar-container">
        {(showLabel || showPercentage) && (
          <div className={cn(progressBarLabelVariants({ variant }))} data-testid="progress-bar-label-container">
            {showLabel && label && <span data-testid="progress-bar-label">{label}</span>}
            {showPercentage && !indeterminate && (
              <span data-testid="progress-bar-percentage">{percentage}%</span>
            )}
          </div>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          value={displayValue}
          className={cn(progressBarRootVariants({ size }))}
          data-testid="progress-bar-root"
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(progressBarIndicatorVariants({ variant, indeterminate }))}
            style={
              indeterminate
                ? undefined
                : {
                    transform: `translateX(-${100 - (displayValue || 0)}%)`,
                  }
            }
            data-testid="progress-bar-indicator"
          />
        </ProgressPrimitive.Root>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

// Circular Progress Variant
const circularProgressVariants = cva('relative inline-flex items-center justify-center', {
  variants: {
    size: {
      sm: 'h-12 w-12',
      md: 'h-16 w-16',
      lg: 'h-24 w-24',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const circularProgressStrokeVariants = cva('', {
  variants: {
    variant: {
      primary: 'stroke-blue-600',
      success: 'stroke-green-600',
      warning: 'stroke-yellow-500',
      error: 'stroke-red-600',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export interface CircularProgressProps extends VariantProps<typeof circularProgressVariants> {
  value?: number;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  indeterminate?: boolean;
  className?: string;
}

export const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ value = 0, variant = 'primary', size = 'md', showPercentage = false, indeterminate = false, className }, ref) => {
    const circumference = 2 * Math.PI * 45; // radius is 45
    const strokeDashoffset = indeterminate ? 0 : circumference - (value / 100) * circumference;

    const textSizeMap = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    return (
      <div ref={ref} className={cn(circularProgressVariants({ size }), className)} data-testid="circular-progress">
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="stroke-gray-200"
            strokeWidth="8"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            data-testid="circular-progress-background"
          />
          {/* Progress circle */}
          <circle
            className={cn(
              circularProgressStrokeVariants({ variant }),
              'transition-all duration-300 ease-in-out',
              indeterminate && 'animate-spin'
            )}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            data-testid="circular-progress-indicator"
          />
        </svg>
        {showPercentage && !indeterminate && (
          <span
            className={cn('absolute font-semibold text-gray-900', textSizeMap[size || 'md'])}
            data-testid="circular-progress-percentage"
          >
            {Math.round(value)}%
          </span>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';
