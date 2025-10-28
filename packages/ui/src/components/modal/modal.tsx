'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { z } from 'zod';
import { cn } from '../../lib/cn';

// Zod Schema for Modal props validation
export const modalPropsSchema = z.object({
  variant: z.enum(['confirmation', 'form', 'fullscreen']).default('form'),
  size: z.enum(['sm', 'md', 'lg', 'xl', 'fullscreen']).default('md'),
  dismissible: z.boolean().default(true),
  closeOnBackdropClick: z.boolean().default(true),
  closeOnEscape: z.boolean().default(true),
  title: z.string(),
  description: z.string().optional(),
  children: z.any(),
});

export type ModalProps = z.infer<typeof modalPropsSchema>;

// CVA Variants for Modal
const modalOverlayVariants = cva(
  'fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
);

const modalContentVariants = cva(
  'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
  {
    variants: {
      size: {
        sm: 'max-w-sm rounded-lg',
        md: 'max-w-md rounded-lg',
        lg: 'max-w-lg rounded-lg',
        xl: 'max-w-xl rounded-lg',
        fullscreen: 'h-full max-h-screen w-full max-w-full rounded-none',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface ModalRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const ModalRoot: React.FC<ModalRootProps> = ({ open, onOpenChange, children }) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
};

export const ModalTrigger = DialogPrimitive.Trigger;

export interface ModalContentProps extends VariantProps<typeof modalContentVariants> {
  children: React.ReactNode;
  dismissible?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(
  (
    { size = 'md', dismissible = true, closeOnBackdropClick = true, closeOnEscape = true, children, className, ...props },
    ref
  ) => {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={cn(modalOverlayVariants())} data-test-id="modal-overlay" />
        <DialogPrimitive.Content
          ref={ref}
          onEscapeKeyDown={(e) => {
            if (!closeOnEscape) {
              e.preventDefault();
            }
          }}
          onPointerDownOutside={(e) => {
            if (!closeOnBackdropClick) {
              e.preventDefault();
            }
          }}
          className={cn(modalContentVariants({ size }), className)}
          data-test-id="modal-content"
          {...props}
        >
          {children}
          {dismissible && (
            <DialogPrimitive.Close
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none"
              data-test-id="modal-close"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  }
);

ModalContent.displayName = 'ModalContent';

export interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} data-test-id="modal-header">
      {children}
    </div>
  );
};

export interface ModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  ModalTitleProps
>(({ children, className, ...props }, ref) => {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      data-test-id="modal-title"
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  );
});

ModalTitle.displayName = 'ModalTitle';

export interface ModalDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  ModalDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-gray-600', className)}
      data-test-id="modal-description"
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  );
});

ModalDescription.displayName = 'ModalDescription';

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => {
  return (
    <div className={cn('py-4', className)} data-test-id="modal-body">
      {children}
    </div>
  );
};

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => {
  return (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} data-test-id="modal-footer">
      {children}
    </div>
  );
};

// Convenience component that combines all parts
export interface ModalComponentProps extends VariantProps<typeof modalContentVariants> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dismissible?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

export const Modal: React.FC<ModalComponentProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  dismissible = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) => {
  return (
    <ModalRoot open={open} onOpenChange={onOpenChange}>
      <ModalContent
        size={size}
        dismissible={dismissible}
        closeOnBackdropClick={closeOnBackdropClick}
        closeOnEscape={closeOnEscape}
      >
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {description && <ModalDescription>{description}</ModalDescription>}
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </ModalRoot>
  );
};
