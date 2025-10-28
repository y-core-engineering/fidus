'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { z } from 'zod';
import { cn } from '../../lib/cn';

// Zod Schema for Drawer props validation
export const drawerPropsSchema = z.object({
  side: z.enum(['left', 'right', 'bottom']).default('right'),
  title: z.string(),
  description: z.string().optional(),
  children: z.any(),
  footer: z.any().optional(),
  dismissible: z.boolean().default(true),
  open: z.boolean().optional(),
  onOpenChange: z.function().optional(),
});

export type DrawerProps = z.infer<typeof drawerPropsSchema>;

// CVA Variants for Drawer
const drawerOverlayVariants = cva(
  'fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
);

const drawerContentVariants = cva(
  'fixed z-50 flex flex-col gap-4 border bg-white p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right: 'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
        bottom: 'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

export const DrawerRoot = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerPortal = DialogPrimitive.Portal;
export const DrawerClose = DialogPrimitive.Close;

export interface DrawerOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

export const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DrawerOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(drawerOverlayVariants(), className)}
    data-test-id="drawer-overlay"
    {...props}
  />
));

DrawerOverlay.displayName = 'DrawerOverlay';

export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof drawerContentVariants> {
  dismissible?: boolean;
}

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ side = 'right', dismissible = true, className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(drawerContentVariants({ side }), className)}
      data-test-id="drawer-content"
      {...props}
    >
      {children}
      {dismissible && (
        <DialogPrimitive.Close
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none"
          data-test-id="drawer-close"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DrawerPortal>
));

DrawerContent.displayName = 'DrawerContent';

export interface DrawerHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 text-left', className)} data-test-id="drawer-header">
      {children}
    </div>
  );
};

export interface DrawerTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DrawerTitleProps
>(({ children, className, ...props }, ref) => {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      data-test-id="drawer-title"
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  );
});

DrawerTitle.displayName = 'DrawerTitle';

export interface DrawerDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DrawerDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-gray-600', className)}
      data-test-id="drawer-description"
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  );
});

DrawerDescription.displayName = 'DrawerDescription';

export interface DrawerBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerBody: React.FC<DrawerBodyProps> = ({ children, className }) => {
  return (
    <div className={cn('flex-1 overflow-y-auto', className)} data-test-id="drawer-body">
      {children}
    </div>
  );
};

export interface DrawerFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerFooter: React.FC<DrawerFooterProps> = ({ children, className }) => {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      data-test-id="drawer-footer"
    >
      {children}
    </div>
  );
};

// Convenience Drawer component
export interface DrawerComponentProps extends VariantProps<typeof drawerContentVariants> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dismissible?: boolean;
}

export const Drawer: React.FC<DrawerComponentProps> = ({
  open,
  onOpenChange,
  side = 'right',
  title,
  description,
  children,
  footer,
  dismissible = true,
}) => {
  return (
    <DrawerRoot open={open} onOpenChange={onOpenChange}>
      <DrawerContent side={side} dismissible={dismissible}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <DrawerBody>{children}</DrawerBody>
        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </DrawerRoot>
  );
};
