'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Zod schema for props validation
export const DetailCardPropsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  defaultExpanded: z.boolean().default(false).optional(),
  collapsible: z.boolean().default(true).optional(),
  header: z.any().optional(),
  footer: z.any().optional(),
  className: z.string().optional(),
  children: z.any(),
});

export type DetailCardProps = React.HTMLAttributes<HTMLDivElement> &
  z.infer<typeof DetailCardPropsSchema>;

const cardVariants = cva(
  'rounded-lg bg-card border border-border shadow-sm transition-shadow hover:shadow-md overflow-hidden'
);

const headerVariants = cva(
  'flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors',
  {
    variants: {
      collapsible: {
        true: 'cursor-pointer',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      collapsible: true,
    },
  }
);

export const DetailCard = React.forwardRef<HTMLDivElement, DetailCardProps>(
  (props, ref) => {
    const {
      title,
      subtitle,
      defaultExpanded = false,
      collapsible = true,
      header,
      footer,
      className,
      children,
      ...rest
    } = props;

    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

    const toggleExpanded = () => {
      if (collapsible) {
        setIsExpanded(!isExpanded);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (collapsible && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        toggleExpanded();
      }
    };

    return (
      <div ref={ref} className={cn(cardVariants(), className)} {...rest}>
        {/* Header */}
        <div
          className={cn(headerVariants({ collapsible }))}
          onClick={toggleExpanded}
          onKeyDown={handleKeyDown}
          role={collapsible ? 'button' : undefined}
          tabIndex={collapsible ? 0 : undefined}
          aria-expanded={collapsible ? isExpanded : undefined}
        >
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          {header && <div className="flex-shrink-0 mr-2">{header}</div>}
          {collapsible && (
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        {/* Body */}
        {(!collapsible || isExpanded) && (
          <div className="px-4 py-3 text-sm text-foreground">{children}</div>
        )}

        {/* Footer */}
        {footer && (!collapsible || isExpanded) && (
          <div className="px-4 py-3 border-t border-border bg-muted/20">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

DetailCard.displayName = 'DetailCard';
