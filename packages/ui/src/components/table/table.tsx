import * as React from 'react';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const TablePropsSchema = z.object({
  className: z.string().optional(),
  children: z.any(),
});

export type TableProps = React.TableHTMLAttributes<HTMLTableElement> &
  z.infer<typeof TablePropsSchema>;

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

export const TableHeaderPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any(),
});

export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement> &
  z.infer<typeof TableHeaderPropsSchema>;

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('border-b', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

export const TableBodyPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any(),
});

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement> &
  z.infer<typeof TableBodyPropsSchema>;

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));
TableBody.displayName = 'TableBody';

export const TableFooterPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any(),
});

export type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement> &
  z.infer<typeof TableFooterPropsSchema>;

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('border-t bg-muted/50 font-medium', className)}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

export const TableRowPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any(),
});

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> &
  z.infer<typeof TableRowPropsSchema>;

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export const TableHeadPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any(),
});

export type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement> &
  z.infer<typeof TableHeadPropsSchema>;

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

export const TableCellPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any(),
});

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> &
  z.infer<typeof TableCellPropsSchema>;

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

export const TableCaptionPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any(),
});

export type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement> &
  z.infer<typeof TableCaptionPropsSchema>;

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';
