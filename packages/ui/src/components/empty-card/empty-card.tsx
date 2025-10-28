import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const EmptyCardPropsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.any().optional(),
  illustration: z.any().optional(),
  action: z.object({
    label: z.string(),
    onClick: z.function().args().returns(z.void()),
  }).optional(),
  secondaryAction: z.object({
    label: z.string(),
    onClick: z.function().args().returns(z.void()),
  }).optional(),
  size: z.enum(['sm', 'md', 'lg']).default('md').optional(),
  className: z.string().optional(),
});

export type EmptyCardProps = React.HTMLAttributes<HTMLDivElement> &
  z.infer<typeof EmptyCardPropsSchema>;

const cardVariants = cva(
  'flex flex-col items-center justify-center text-center rounded-lg bg-card border border-dashed border-border',
  {
    variants: {
      size: {
        sm: 'p-6 min-h-[200px]',
        md: 'p-8 min-h-[300px]',
        lg: 'p-12 min-h-[400px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const iconVariants = cva('text-muted-foreground mb-4', {
  variants: {
    size: {
      sm: 'h-8 w-8',
      md: 'h-12 w-12',
      lg: 'h-16 w-16',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const titleVariants = cva('font-semibold text-foreground mb-2', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const descriptionVariants = cva('text-muted-foreground mb-6', {
  variants: {
    size: {
      sm: 'text-xs max-w-xs',
      md: 'text-sm max-w-sm',
      lg: 'text-base max-w-md',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const EmptyCard = React.forwardRef<HTMLDivElement, EmptyCardProps>(
  (props, ref) => {
    const {
      title,
      description,
      icon,
      illustration,
      action,
      secondaryAction,
      size = 'md',
      className,
      ...rest
    } = props;

    return (
      <div ref={ref} className={cn(cardVariants({ size }), className)} {...rest}>
        {/* Illustration or Icon */}
        {illustration ? (
          <div className="mb-6">{illustration}</div>
        ) : icon ? (
          <div className={cn(iconVariants({ size }))}>{icon}</div>
        ) : null}

        {/* Title */}
        <h3 className={cn(titleVariants({ size }))}>{title}</h3>

        {/* Description */}
        {description && (
          <p className={cn(descriptionVariants({ size }))}>{description}</p>
        )}

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex items-center gap-3 mt-2">
            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded transition-colors"
              >
                {action.label}
              </button>
            )}
            {secondaryAction && (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded transition-colors"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

EmptyCard.displayName = 'EmptyCard';
