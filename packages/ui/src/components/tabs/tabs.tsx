'use client';

import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const tabsPropsSchema = z.object({
  value: z.string().optional(),
  defaultValue: z.string().optional(),
  onValueChange: z.function().args(z.string()).returns(z.void()).optional(),
  orientation: z.enum(['horizontal', 'vertical']).default('horizontal'),
  variant: z.enum(['default', 'pills', 'underline']).default('default'),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
  fullWidth: z.boolean().optional(),
  className: z.string().optional(),
});

export type TabsRootProps = React.ComponentPropsWithoutRef<typeof RadixTabs.Root> & {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

export type TabsListProps = React.ComponentPropsWithoutRef<typeof RadixTabs.List> & {
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  orientation?: 'horizontal' | 'vertical';
};

export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger> & {
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
};

export type TabsContentProps = React.ComponentPropsWithoutRef<typeof RadixTabs.Content>;

export type TabItem = {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export type TabsConvenienceProps = TabsRootProps & {
  items: TabItem[];
};

const tabsListVariants = cva(
  'inline-flex items-center justify-start gap-1',
  {
    variants: {
      variant: {
        default: 'border-b border-border',
        pills: 'bg-muted p-1 rounded-lg',
        underline: '',
      },
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col border-r border-b-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      orientation: 'horizontal',
      fullWidth: false,
    },
  }
);

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground hover:text-foreground rounded-t-md',
        pills:
          'rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground',
        underline:
          'border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground hover:text-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
      fullWidth: {
        true: 'flex-1',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      fullWidth: false,
    },
  }
);

const tabsContentVariants = cva(
  'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
);

// Composable parts
export const TabsRoot = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Root>,
  TabsRootProps
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <RadixTabs.Root
    ref={ref}
    orientation={orientation}
    className={cn('w-full', className)}
    data-test-id="tabs-root"
    {...props}
  />
));
TabsRoot.displayName = 'TabsRoot';

export const TabsList = React.forwardRef<
  React.ElementRef<typeof RadixTabs.List>,
  TabsListProps
>(
  (
    {
      className,
      variant = 'default',
      fullWidth = false,
      orientation = 'horizontal',
      ...props
    },
    ref
  ) => (
    <RadixTabs.List
      ref={ref}
      className={cn(tabsListVariants({ variant, orientation, fullWidth, className }))}
      data-test-id="tabs-list"
      {...props}
    />
  )
);
TabsList.displayName = 'TabsList';

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Trigger>,
  TabsTriggerProps
>(({ className, variant = 'default', size = 'md', ...props }, ref) => (
  <RadixTabs.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size, className }))}
    data-test-id={`tabs-trigger-${props.value}`}
    {...props}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <RadixTabs.Content
    ref={ref}
    className={cn(tabsContentVariants({ className }))}
    data-test-id={`tabs-content-${props.value}`}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';

// Convenience wrapper
export const Tabs = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Root>,
  TabsConvenienceProps
>(
  (
    {
      items,
      variant = 'default',
      size = 'md',
      fullWidth = false,
      orientation = 'horizontal',
      className,
      ...props
    },
    ref
  ) => (
    <TabsRoot ref={ref} orientation={orientation} className={className} {...props}>
      <TabsList variant={variant} fullWidth={fullWidth} orientation={orientation}>
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            variant={variant}
            size={size}
            disabled={item.disabled}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          {item.content}
        </TabsContent>
      ))}
    </TabsRoot>
  )
);
Tabs.displayName = 'Tabs';
