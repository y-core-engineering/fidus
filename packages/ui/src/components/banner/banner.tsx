'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { cn } from '../../lib/cn';

// Zod Schema for Banner props validation
export const BannerPropsSchema = z.object({
  variant: z.enum(['info', 'warning', 'error']).default('info'),
  message: z.string(),
  actionLabel: z.string().optional(),
  onAction: z.function().optional(),
  dismissible: z.boolean().default(true),
  sticky: z.boolean().default(false),
  onDismiss: z.function().optional(),
});

export type BannerProps = z.infer<typeof BannerPropsSchema>;

// CVA Variants for Banner
const bannerVariants = cva(
  'flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-all',
  {
    variants: {
      variant: {
        info: 'bg-blue-600 text-white',
        warning: 'bg-yellow-500 text-gray-900',
        error: 'bg-red-600 text-white',
      },
      sticky: {
        true: 'sticky top-0 z-50 shadow-md',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'info',
      sticky: false,
    },
  }
);

const bannerActionVariants = cva(
  'inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        info: 'bg-white/20 text-white hover:bg-white/30 focus:ring-white',
        warning: 'bg-gray-900/20 text-gray-900 hover:bg-gray-900/30 focus:ring-gray-900',
        error: 'bg-white/20 text-white hover:bg-white/30 focus:ring-white',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

const bannerIconVariants = cva('h-5 w-5 shrink-0', {
  variants: {
    variant: {
      info: 'text-white',
      warning: 'text-gray-900',
      error: 'text-white',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

// Icon mapping
const iconMap = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
};

export interface BannerComponentProps extends VariantProps<typeof bannerVariants> {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const Banner = React.forwardRef<HTMLDivElement, BannerComponentProps>(
  (
    {
      variant = 'info',
      sticky = false,
      message,
      actionLabel,
      onAction,
      dismissible = true,
      onDismiss,
      className,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const Icon = iconMap[variant || 'info'];

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        role="banner"
        className={cn(bannerVariants({ variant, sticky }), className)}
        data-test-id="banner"
        {...props}
      >
        <Icon className={cn(bannerIconVariants({ variant }))} data-test-id="banner-icon" />
        <div className="flex-1 text-left" data-test-id="banner-message">
          {message}
        </div>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className={cn(bannerActionVariants({ variant }))}
            data-test-id="banner-action"
          >
            {actionLabel}
          </button>
        )}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-2 rounded-md p-1 opacity-80 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2"
            data-test-id="banner-dismiss"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Banner.displayName = 'Banner';
