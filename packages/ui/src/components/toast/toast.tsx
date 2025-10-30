'use client';

import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { z } from 'zod';
import { cn } from '../../lib/cn';

// Zod Schema for Toast props validation
export const ToastPropsSchema = z.object({
  variant: z.enum(['success', 'error', 'warning', 'info']).default('info'),
  position: z
    .enum(['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'])
    .default('top-right'),
  duration: z.number().min(1000).max(10000).default(5000),
  dismissible: z.boolean().default(true),
  title: z.string(),
  description: z.string().optional(),
  actionLabel: z.string().optional(),
  onAction: z.function().optional(),
});

export type ToastProps = z.infer<typeof ToastPropsSchema>;

// CVA Variants for Toast
const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg transition-all',
  {
    variants: {
      variant: {
        success: 'border-green-200 bg-green-50 text-green-900',
        error: 'border-red-200 bg-red-50 text-red-900',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
        info: 'border-blue-200 bg-blue-50 text-blue-900',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

const toastIconVariants = cva('h-5 w-5 shrink-0', {
  variants: {
    variant: {
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

const toastActionVariants = cva(
  'inline-flex h-8 shrink-0 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
        info: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

// Icon mapping
const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export interface ToastComponentProps extends VariantProps<typeof toastVariants> {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
}

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastComponentProps
>(
  (
    {
      variant = 'info',
      title,
      description,
      actionLabel,
      onAction,
      dismissible = true,
      open,
      onOpenChange,
      duration = 5000,
      ...props
    },
    ref
  ) => {
    const Icon = iconMap[variant || 'info'];

    return (
      <ToastPrimitive.Root
        ref={ref}
        open={open}
        onOpenChange={onOpenChange}
        duration={duration}
        className={cn(toastVariants({ variant }))}
        data-test-id="toast"
        {...props}
      >
        <Icon className={cn(toastIconVariants({ variant }))} data-test-id="toast-icon" />
        <div className="flex flex-1 flex-col gap-1">
          <ToastPrimitive.Title
            className="text-sm font-semibold leading-none"
            data-test-id="toast-title"
          >
            {title}
          </ToastPrimitive.Title>
          {description && (
            <ToastPrimitive.Description
              className="text-sm opacity-90"
              data-test-id="toast-description"
            >
              {description}
            </ToastPrimitive.Description>
          )}
          {actionLabel && onAction && (
            <ToastPrimitive.Action
              altText={actionLabel}
              onClick={onAction}
              className={cn(toastActionVariants({ variant }), 'mt-2 self-start')}
              data-test-id="toast-action"
            >
              {actionLabel}
            </ToastPrimitive.Action>
          )}
        </div>
        {dismissible && (
          <ToastPrimitive.Close
            className="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2"
            data-test-id="toast-close"
          >
            <X className="h-4 w-4" />
          </ToastPrimitive.Close>
        )}
      </ToastPrimitive.Root>
    );
  }
);

Toast.displayName = 'Toast';

// Toast Viewport for positioning
const viewportVariants = cva('fixed z-[300] flex max-h-screen w-full flex-col gap-2 p-4', {
  variants: {
    position: {
      'top-right': 'top-0 right-0 items-end',
      'top-left': 'top-0 left-0 items-start',
      'bottom-right': 'bottom-0 right-0 items-end',
      'bottom-left': 'bottom-0 left-0 items-start',
      'top-center': 'top-0 left-1/2 -translate-x-1/2 items-center',
      'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 items-center',
    },
  },
  defaultVariants: {
    position: 'top-right',
  },
});

export interface ToastViewportProps extends VariantProps<typeof viewportVariants> {}

export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  ToastViewportProps
>(({ position = 'top-right', ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(viewportVariants({ position }))}
    data-test-id="toast-viewport"
    {...props}
  />
));

ToastViewport.displayName = 'ToastViewport';

export const ToastProvider = ToastPrimitive.Provider;
