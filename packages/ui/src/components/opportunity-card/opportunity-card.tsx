'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';
import { X } from 'lucide-react';

// Zod schema for props validation
export const OpportunityCardPropsSchema = z.object({
  title: z.string(),
  icon: z.any().optional(),
  urgency: z.enum(['urgent', 'important', 'normal', 'low']).default('normal').optional(),
  privacyBadge: z.string().optional(),
  onClose: z.function().args().returns(z.void()).optional(),
  onDismiss: z.function().args().returns(z.void()).optional(),
  visual: z.any().optional(),
  context: z.string().optional(),
  primaryAction: z.object({
    label: z.string(),
    onClick: z.function().args().returns(z.void()),
  }).optional(),
  secondaryAction: z.object({
    label: z.string(),
    onClick: z.function().args().returns(z.void()),
  }).optional(),
  className: z.string().optional(),
  children: z.any(),
});

export type OpportunityCardProps = React.HTMLAttributes<HTMLDivElement> &
  z.infer<typeof OpportunityCardPropsSchema>;

const cardVariants = cva(
  'relative rounded-lg bg-card border transition-all duration-200',
  {
    variants: {
      urgency: {
        urgent: 'border-urgent shadow-md hover:shadow-lg',
        important: 'border-warning shadow-sm hover:shadow-md',
        normal: 'border-border shadow-sm hover:shadow-md',
        low: 'border-muted shadow-sm hover:shadow',
      },
    },
    defaultVariants: {
      urgency: 'normal',
    },
  }
);

const headerVariants = cva('flex items-center gap-2 px-4 py-3 border-b border-border', {
  variants: {
    urgency: {
      urgent: 'bg-urgent/5',
      important: 'bg-warning/5',
      normal: 'bg-background',
      low: 'bg-muted/30',
    },
  },
  defaultVariants: {
    urgency: 'normal',
  },
});

export const OpportunityCard = React.forwardRef<HTMLDivElement, OpportunityCardProps>(
  (props, ref) => {
    const {
      title,
      icon,
      urgency = 'normal',
      privacyBadge,
      onClose,
      onDismiss,
      visual,
      context,
      primaryAction,
      secondaryAction,
      className,
      children,
      ...rest
    } = props;

    const [isDismissing, setIsDismissing] = React.useState(false);
    const [touchStart, setTouchStart] = React.useState<number | null>(null);
    const [swipeOffset, setSwipeOffset] = React.useState(0);
    const [isSwiping, setIsSwiping] = React.useState(false);

    const minSwipeDistance = 50;

    const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStart(e.targetTouches[0].clientX);
      setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!touchStart || !isSwiping) return;

      const currentTouch = e.targetTouches[0].clientX;
      const diff = currentTouch - touchStart;

      // Only allow horizontal swipes (left or right)
      setSwipeOffset(diff);
    };

    const handleTouchEnd = () => {
      if (!touchStart || !isSwiping) {
        setIsSwiping(false);
        setSwipeOffset(0);
        return;
      }

      const absOffset = Math.abs(swipeOffset);

      if (absOffset > minSwipeDistance) {
        // Swipe distance exceeded - dismiss the card
        handleDismiss();
      } else {
        // Swipe distance too small - spring back
        setSwipeOffset(0);
        setIsSwiping(false);
        setTouchStart(null);
      }
    };

    const handleClose = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClose?.();
    };

    const handleDismiss = () => {
      setIsDismissing(true);
      setTimeout(() => {
        onDismiss?.();
      }, 250);
    };

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ urgency }),
          isDismissing && 'opacity-0 translate-x-full',
          className
        )}
        style={{
          transform: isSwiping && !isDismissing ? `translateX(${swipeOffset}px)` : undefined,
          transition: isSwiping ? 'none' : 'all 150ms ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        {...rest}
      >
        {/* Header */}
        <div className={cn(headerVariants({ urgency }))}>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <h3 className="flex-1 text-sm font-semibold text-foreground">{title}</h3>
          {privacyBadge && (
            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
              {privacyBadge}
            </span>
          )}
          {onClose && (
            <button
              type="button"
              onClick={handleClose}
              className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors"
              aria-label="Close card"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          {visual && <div className="mb-3">{visual}</div>}
          <div className="text-sm text-foreground">{children}</div>
          {context && (
            <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded p-2">
              <span>💡</span>
              <span>{context}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        {(primaryAction || secondaryAction) && (
          <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-muted/20">
            {primaryAction && (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded transition-colors"
              >
                {primaryAction.label}
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

OpportunityCard.displayName = 'OpportunityCard';
