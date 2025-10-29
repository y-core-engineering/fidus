'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cva, type VariantProps } from 'class-variance-authority';
import { z } from 'zod';
import { cn } from '../../lib/cn';

// Zod Schema for Popover props validation
export const PopoverPropsSchema = z.object({
  trigger: z.any(),
  children: z.any(),
  side: z.enum(['top', 'bottom', 'left', 'right']).default('bottom'),
  align: z.enum(['start', 'center', 'end']).default('center'),
  open: z.boolean().optional(),
  onOpenChange: z.function().optional(),
  showArrow: z.boolean().default(true),
});

export type PopoverProps = z.infer<typeof PopoverPropsSchema>;

// CVA Variants for Popover
const popoverContentVariants = cva(
  'z-50 w-72 rounded-md border bg-white p-4 text-gray-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
);

const popoverArrowVariants = cva('fill-white', {
  variants: {
    side: {
      top: '',
      bottom: '',
      left: '',
      right: '',
    },
  },
  defaultVariants: {
    side: 'bottom',
  },
});

export const PopoverRoot = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverPortal = PopoverPrimitive.Portal;

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    VariantProps<typeof popoverContentVariants> {
  showArrow?: boolean;
}

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ className, align = 'center', sideOffset = 4, showArrow = true, side, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      side={side}
      className={cn(popoverContentVariants(), className)}
      data-test-id="popover-content"
      {...props}
    >
      {props.children}
      {showArrow && (
        <PopoverPrimitive.Arrow
          className={cn(popoverArrowVariants({ side }))}
          data-test-id="popover-arrow"
        />
      )}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));

PopoverContent.displayName = 'PopoverContent';

export const PopoverClose = PopoverPrimitive.Close;

// Convenience Popover component
export interface PopoverComponentProps extends VariantProps<typeof popoverContentVariants> {
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  showArrow?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Popover: React.FC<PopoverComponentProps> = ({
  trigger,
  children,
  side = 'bottom',
  align = 'center',
  showArrow = true,
  open,
  onOpenChange,
}) => {
  return (
    <PopoverRoot open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent side={side} align={align} showArrow={showArrow}>
        {children}
      </PopoverContent>
    </PopoverRoot>
  );
};
