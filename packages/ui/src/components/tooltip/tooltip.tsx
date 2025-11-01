'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cva, type VariantProps } from 'class-variance-authority';
import { z } from 'zod';
import { cn } from '../../lib/cn';

// Zod Schema for Tooltip props validation
export const TooltipPropsSchema = z.object({
  content: z.string(),
  children: z.any(),
  side: z.enum(['top', 'bottom', 'left', 'right']).default('top'),
  align: z.enum(['start', 'center', 'end']).default('center'),
  delayDuration: z.number().min(0).max(2000).default(200),
  open: z.boolean().optional(),
  onOpenChange: z.function().optional(),
  showArrow: z.boolean().default(true),
});

export type TooltipProps = z.infer<typeof TooltipPropsSchema>;

// CVA Variants for Tooltip
const tooltipContentVariants = cva(
  'z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
);

const tooltipArrowVariants = cva('fill-gray-900');

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipPortal = TooltipPrimitive.Portal;

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipContentVariants> {
  showArrow?: boolean;
}

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, showArrow = true, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipContentVariants(), className)}
      data-testid="tooltip-content"
      {...props}
    >
      {props.children}
      {showArrow && (
        <TooltipPrimitive.Arrow
          className={cn(tooltipArrowVariants())}
          data-testid="tooltip-arrow"
        />
      )}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = 'TooltipContent';

// Convenience Tooltip component
export interface TooltipComponentProps {
  content: string;
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  showArrow?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Tooltip: React.FC<TooltipComponentProps> = ({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 200,
  showArrow = true,
  open,
  onOpenChange,
}) => {
  return (
    <TooltipProvider>
      <TooltipRoot open={open} onOpenChange={onOpenChange} delayDuration={delayDuration}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align} showArrow={showArrow}>
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
};
