'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

// Zod schema for props validation
export const PaginationPropsSchema = z.object({
  currentPage: z.number().min(1),
  totalPages: z.number().min(1),
  onPageChange: z.function().args(z.number()).returns(z.void()),
  showFirstLast: z.boolean().optional().default(true),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
  variant: z.enum(['default', 'outlined']).default('default'),
  pageSize: z.number().optional(),
  pageSizeOptions: z.array(z.number()).optional(),
  onPageSizeChange: z.function().args(z.number()).returns(z.void()).optional(),
  className: z.string().optional(),
});

export type PaginationProps = Partial<z.infer<typeof PaginationPropsSchema>> & {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const paginationVariants = cva('flex items-center gap-1', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const pageButtonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-md',
  {
    variants: {
      variant: {
        default: 'hover:bg-muted',
        outlined: 'border border-border hover:bg-muted',
      },
      size: {
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
      },
      active: {
        true: '',
        false: 'text-muted-foreground',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        active: true,
        className: 'bg-primary text-primary-foreground hover:bg-primary/90',
      },
      {
        variant: 'outlined',
        active: true,
        className: 'bg-primary text-primary-foreground border-primary hover:bg-primary/90',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      active: false,
    },
  }
);

const getPageNumbers = (currentPage: number, totalPages: number): (number | 'ellipsis')[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
};

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      showFirstLast = true,
      size = 'md',
      variant = 'default',
      pageSize,
      pageSizeOptions = [10, 20, 50, 100],
      onPageSizeChange,
      className,
      ...props
    },
    ref
  ) => {
    const pageNumbers = getPageNumbers(currentPage, totalPages);

    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newPageSize = Number(event.target.value);
      if (onPageSizeChange) {
        onPageSizeChange(newPageSize);
      }
    };

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="pagination"
        className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}
        data-testid="pagination"
        {...props}
      >
        <div className={cn(paginationVariants({ size }))}>
          {showFirstLast && (
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={cn(pageButtonVariants({ variant, size }))}
              aria-label="Go to first page"
              data-testid="pagination-first"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(pageButtonVariants({ variant, size }))}
            aria-label="Go to previous page"
            data-testid="pagination-previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pageNumbers.map((pageNumber, index) =>
            pageNumber === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className={cn(pageButtonVariants({ variant, size }), 'cursor-default')}
                data-testid={`pagination-ellipsis-${index}`}
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            ) : (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                disabled={pageNumber === currentPage}
                className={cn(pageButtonVariants({ variant, size, active: pageNumber === currentPage }))}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={pageNumber === currentPage ? 'page' : undefined}
                data-testid={`pagination-page-${pageNumber}`}
              >
                {pageNumber}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(pageButtonVariants({ variant, size }))}
            aria-label="Go to next page"
            data-testid="pagination-next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {showFirstLast && (
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={cn(pageButtonVariants({ variant, size }))}
              aria-label="Go to last page"
              data-testid="pagination-last"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {pageSize && onPageSizeChange && (
          <div className="flex items-center gap-2" data-testid="pagination-page-size">
            <label htmlFor="page-size" className="text-sm text-muted-foreground">
              Items per page:
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="h-8 px-2 text-sm border border-border rounded-md bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              data-testid="pagination-page-size-select"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';
