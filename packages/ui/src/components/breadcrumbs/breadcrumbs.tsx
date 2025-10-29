'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';
import { ChevronRight, Slash, Circle } from 'lucide-react';

// Zod schema for props validation
export const breadcrumbItemSchema = z.object({
  label: z.string(),
  href: z.string().optional(),
  icon: z.any().optional(),
});

export const BreadcrumbsPropsSchema = z.object({
  items: z.array(breadcrumbItemSchema).min(1),
  separator: z.enum(['slash', 'chevron', 'dot']).optional().default('chevron'),
  size: z.enum(['sm', 'md', 'lg']).optional().default('md'),
  maxItems: z.number().min(2).optional(),
  className: z.string().optional(),
});

export type BreadcrumbItem = z.infer<typeof breadcrumbItemSchema>;
export type BreadcrumbsProps = Partial<z.infer<typeof BreadcrumbsPropsSchema>> & { items: BreadcrumbItem[] };

const breadcrumbsVariants = cva('flex items-center flex-wrap', {
  variants: {
    size: {
      sm: 'text-sm gap-1',
      md: 'text-base gap-2',
      lg: 'text-lg gap-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const breadcrumbItemVariants = cva(
  'inline-flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
  {
    variants: {
      size: {
        sm: 'gap-1.5',
        md: 'gap-2',
        lg: 'gap-2.5',
      },
      isLink: {
        true: 'text-muted-foreground hover:text-foreground cursor-pointer',
        false: 'text-foreground font-medium',
      },
    },
    defaultVariants: {
      size: 'md',
      isLink: true,
    },
  }
);

const separatorVariants = cva('text-muted-foreground', {
  variants: {
    size: {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const getSeparatorIcon = (separator: 'slash' | 'chevron' | 'dot', size: 'sm' | 'md' | 'lg') => {
  const className = separatorVariants({ size });

  switch (separator) {
    case 'chevron':
      return <ChevronRight className={className} aria-hidden="true" />;
    case 'dot':
      return <Circle className={cn(className, 'fill-current')} aria-hidden="true" />;
    case 'slash':
      return <Slash className={className} aria-hidden="true" />;
  }
};

const truncateItems = (items: BreadcrumbItem[], maxItems: number): BreadcrumbItem[] => {
  if (items.length <= maxItems) {
    return items;
  }

  const firstItem = items[0];
  const lastItems = items.slice(-(maxItems - 1));

  return [firstItem, { label: '...', href: undefined }, ...lastItems];
};

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, separator = 'chevron', size = 'md', maxItems, className, ...props }, ref) => {
    const displayItems = maxItems ? truncateItems(items, maxItems) : items;
    const lastIndex = displayItems.length - 1;

    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn(breadcrumbsVariants({ size, className }))}
        data-test-id="breadcrumbs"
        {...props}
      >
        <ol className="flex items-center flex-wrap gap-inherit">
          {displayItems.map((item, index) => {
            const isLast = index === lastIndex;
            const isEllipsis = item.label === '...';
            const ItemContent = (
              <span
                className={cn(
                  breadcrumbItemVariants({
                    size,
                    isLink: !isLast && !isEllipsis && !!item.href,
                  })
                )}
              >
                {item.icon && <span className="inline-flex">{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            );

            return (
              <li key={`${item.label}-${index}`} className="inline-flex items-center gap-inherit">
                {item.href && !isLast && !isEllipsis ? (
                  <a
                    href={item.href}
                    data-test-id={`breadcrumb-item-${index}`}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                  >
                    {ItemContent}
                  </a>
                ) : (
                  <span
                    data-test-id={`breadcrumb-item-${index}`}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {ItemContent}
                  </span>
                )}
                {!isLast && (
                  <span data-test-id={`breadcrumb-separator-${index}`}>
                    {getSeparatorIcon(separator, size)}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';
