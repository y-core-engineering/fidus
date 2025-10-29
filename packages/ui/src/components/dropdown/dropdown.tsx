'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronRight } from 'lucide-react';
import { z } from 'zod';
import { cn } from '../../lib/cn';

// Zod Schema for Dropdown props validation
export const DropdownPropsSchema = z.object({
  trigger: z.any(),
  items: z.array(
    z.union([
      z.object({
        type: z.literal('item'),
        label: z.string(),
        icon: z.any().optional(),
        onClick: z.function().optional(),
        disabled: z.boolean().optional(),
      }),
      z.object({
        type: z.literal('separator'),
      }),
      z.object({
        type: z.literal('checkbox'),
        label: z.string(),
        checked: z.boolean(),
        onCheckedChange: z.function(),
      }),
      z.object({
        type: z.literal('radio'),
        value: z.string(),
        label: z.string(),
      }),
    ])
  ),
});

export type DropdownProps = z.infer<typeof DropdownPropsSchema>;

// CVA Variants for Dropdown
const dropdownContentVariants = cva(
  'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
);

const dropdownItemVariants = cva(
  'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:bg-gray-100',
        destructive: 'text-red-600 hover:bg-red-50 focus:bg-red-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const DropdownRoot = DropdownMenuPrimitive.Root;
export const DropdownTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownGroup = DropdownMenuPrimitive.Group;
export const DropdownPortal = DropdownMenuPrimitive.Portal;
export const DropdownSub = DropdownMenuPrimitive.Sub;
export const DropdownRadioGroup = DropdownMenuPrimitive.RadioGroup;

export interface DropdownContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
  sideOffset?: number;
}

export const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownContentProps
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(dropdownContentVariants(), className)}
      data-test-id="dropdown-content"
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

DropdownContent.displayName = 'DropdownContent';

export interface DropdownItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>,
    VariantProps<typeof dropdownItemVariants> {
  icon?: React.ReactNode;
}

export const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownItemProps
>(({ className, variant, icon, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(dropdownItemVariants({ variant }), className)}
    data-test-id="dropdown-item"
    {...props}
  >
    {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
    {children}
  </DropdownMenuPrimitive.Item>
));

DropdownItem.displayName = 'DropdownItem';

export interface DropdownCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> {}

export const DropdownCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    data-test-id="dropdown-checkbox-item"
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" data-test-id="dropdown-checkbox-indicator" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));

DropdownCheckboxItem.displayName = 'DropdownCheckboxItem';

export interface DropdownRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> {}

export const DropdownRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownRadioItemProps
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    data-test-id="dropdown-radio-item"
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <div className="h-2 w-2 rounded-full bg-current" data-test-id="dropdown-radio-indicator" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));

DropdownRadioItem.displayName = 'DropdownRadioItem';

export interface DropdownLabelProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> {}

export const DropdownLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  DropdownLabelProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', className)}
    data-test-id="dropdown-label"
    {...props}
  />
));

DropdownLabel.displayName = 'DropdownLabel';

export const DropdownSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-gray-200', className)}
    data-test-id="dropdown-separator"
    {...props}
  />
));

DropdownSeparator.displayName = 'DropdownSeparator';

export interface DropdownSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> {}

export const DropdownSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownSubTriggerProps
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100 data-[state=open]:bg-gray-100',
      className
    )}
    data-test-id="dropdown-sub-trigger"
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));

DropdownSubTrigger.displayName = 'DropdownSubTrigger';

export interface DropdownSubContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> {}

export const DropdownSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownSubContentProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    data-test-id="dropdown-sub-content"
    {...props}
  />
));

DropdownSubContent.displayName = 'DropdownSubContent';

// Convenience Dropdown component
export interface DropdownComponentProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dropdown: React.FC<DropdownComponentProps> = ({ trigger, children, open, onOpenChange }) => {
  return (
    <DropdownRoot open={open} onOpenChange={onOpenChange}>
      <DropdownTrigger asChild>{trigger}</DropdownTrigger>
      <DropdownContent>{children}</DropdownContent>
    </DropdownRoot>
  );
};
