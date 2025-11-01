'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { z } from 'zod';
import { cn } from '../../lib/cn';

// Zod Schema for Alert props validation
export const AlertPropsSchema = z.object({
  variant: z.enum(['success', 'error', 'warning', 'info']).default('info'),
  dismissible: z.boolean().default(false),
  title: z.string().optional(),
  children: z.any(),
  actions: z.array(z.object({ label: z.string(), onClick: z.function() })).optional(),
  onDismiss: z.function().optional(),
});

export type AlertProps = z.infer<typeof AlertPropsSchema>;

// CVA Variants for Alert
const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-8 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
  {
    variants: {
      variant: {
        success: 'border-green-200 bg-green-50 text-green-900 [&>svg]:text-green-600',
        error: 'border-red-200 bg-red-50 text-red-900 [&>svg]:text-red-600',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 [&>svg]:text-yellow-600',
        info: 'border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

const alertIconVariants = cva('h-5 w-5 shrink-0', {
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

const alertActionVariants = cva(
  'inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        success: 'text-green-700 focus:ring-green-500',
        error: 'text-red-700 focus:ring-red-500',
        warning: 'text-yellow-700 focus:ring-yellow-500',
        info: 'text-blue-700 focus:ring-blue-500',
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

export interface AlertAction {
  label: string;
  onClick: () => void;
}

export interface AlertComponentProps extends VariantProps<typeof alertVariants> {
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: AlertAction[];
  className?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertComponentProps>(
  ({ variant = 'info', title, children, dismissible = false, onDismiss, actions, className, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const Icon = iconMap[variant || 'info'];

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    if (!isVisible) return null;

    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} data-testid="alert" {...props}>
        <Icon className={cn(alertIconVariants({ variant }))} data-testid="alert-icon" />
        <div className="flex-1">
          {title && (
            <h5 className="mb-1 font-semibold leading-none tracking-tight" data-testid="alert-title">
              {title}
            </h5>
          )}
          <div className="text-sm [&_p]:leading-relaxed" data-testid="alert-content">
            {children}
          </div>
          {actions && actions.length > 0 && (
            <div className="mt-3 flex gap-2" data-testid="alert-actions">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={cn(alertActionVariants({ variant }))}
                  data-testid={`alert-action-${index}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2"
            data-testid="alert-dismiss"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
