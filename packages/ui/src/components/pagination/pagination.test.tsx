import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn(),
  };

  describe('Rendering', () => {
    it('should render pagination component', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Pagination {...defaultProps} className="custom-class" />);

      expect(screen.getByTestId('pagination')).toHaveClass('custom-class');
    });

    it('should render previous and next buttons', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByTestId('pagination-previous')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-next')).toBeInTheDocument();
    });

    it('should render first and last buttons by default', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByTestId('pagination-first')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-last')).toBeInTheDocument();
    });

    it('should not render first and last buttons when showFirstLast is false', () => {
      render(<Pagination {...defaultProps} showFirstLast={false} />);

      expect(screen.queryByTestId('pagination-first')).not.toBeInTheDocument();
      expect(screen.queryByTestId('pagination-last')).not.toBeInTheDocument();
    });
  });

  describe('Page Numbers', () => {
    it('should render all page numbers when totalPages <= 7', () => {
      render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);

      expect(screen.getByTestId('pagination-page-1')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-2')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-3')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-4')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-5')).toBeInTheDocument();
    });

    it('should show ellipsis when totalPages > 7', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByTestId('pagination-ellipsis-4')).toBeInTheDocument();
    });

    it('should show correct pages at beginning', () => {
      render(<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />);

      expect(screen.getByTestId('pagination-page-1')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-2')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-3')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-4')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-10')).toBeInTheDocument();
    });

    it('should show correct pages in middle', () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);

      expect(screen.getByTestId('pagination-page-1')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-4')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-5')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-6')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-10')).toBeInTheDocument();
    });

    it('should show correct pages at end', () => {
      render(<Pagination currentPage={10} totalPages={10} onPageChange={vi.fn()} />);

      expect(screen.getByTestId('pagination-page-1')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-7')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-8')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-9')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-10')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<Pagination {...defaultProps} size="sm" />);

      const button = screen.getByTestId('pagination-page-1');
      expect(button).toHaveClass('h-8', 'w-8', 'text-sm');
    });

    it('should render medium size by default', () => {
      render(<Pagination {...defaultProps} />);

      const button = screen.getByTestId('pagination-page-1');
      expect(button).toHaveClass('h-10', 'w-10', 'text-base');
    });

    it('should render large size', () => {
      render(<Pagination {...defaultProps} size="lg" />);

      const button = screen.getByTestId('pagination-page-1');
      expect(button).toHaveClass('h-12', 'w-12', 'text-lg');
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Pagination {...defaultProps} variant="default" />);

      const button = screen.getByTestId('pagination-page-2');
      expect(button).toHaveClass('hover:bg-muted');
    });

    it('should render outlined variant', () => {
      render(<Pagination {...defaultProps} variant="outlined" />);

      const button = screen.getByTestId('pagination-page-2');
      expect(button).toHaveClass('border', 'border-border');
    });
  });

  describe('Interaction', () => {
    it('should call onPageChange when page number clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

      await user.click(screen.getByTestId('pagination-page-3'));

      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('should call onPageChange when next button clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

      await user.click(screen.getByTestId('pagination-next'));

      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('should call onPageChange when previous button clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

      await user.click(screen.getByTestId('pagination-previous'));

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange when first button clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);

      await user.click(screen.getByTestId('pagination-first'));

      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('should call onPageChange when last button clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

      await user.click(screen.getByTestId('pagination-last'));

      expect(onPageChange).toHaveBeenCalledWith(10);
    });

    it('should not call onPageChange when clicking current page', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

      await user.click(screen.getByTestId('pagination-page-3'));

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should not call onPageChange when clicking ellipsis', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

      const ellipsis = screen.getByTestId('pagination-ellipsis-4');
      await user.click(ellipsis);

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Disabled States', () => {
    it('should disable previous and first buttons on first page', () => {
      render(<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />);

      expect(screen.getByTestId('pagination-previous')).toBeDisabled();
      expect(screen.getByTestId('pagination-first')).toBeDisabled();
    });

    it('should disable next and last buttons on last page', () => {
      render(<Pagination currentPage={10} totalPages={10} onPageChange={vi.fn()} />);

      expect(screen.getByTestId('pagination-next')).toBeDisabled();
      expect(screen.getByTestId('pagination-last')).toBeDisabled();
    });

    it('should disable current page button', () => {
      render(<Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} />);

      expect(screen.getByTestId('pagination-page-3')).toBeDisabled();
    });

    it('should enable all navigation buttons on middle pages', () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);

      expect(screen.getByTestId('pagination-previous')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-next')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-first')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-last')).not.toBeDisabled();
    });
  });

  describe('Page Size Selector', () => {
    it('should render page size selector when pageSize provided', () => {
      render(
        <Pagination
          {...defaultProps}
          pageSize={10}
          onPageSizeChange={vi.fn()}
        />
      );

      expect(screen.getByTestId('pagination-page-size')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-size-select')).toBeInTheDocument();
    });

    it('should not render page size selector when pageSize not provided', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.queryByTestId('pagination-page-size')).not.toBeInTheDocument();
    });

    it('should render default page size options', () => {
      render(
        <Pagination
          {...defaultProps}
          pageSize={10}
          onPageSizeChange={vi.fn()}
        />
      );

      const select = screen.getByTestId('pagination-page-size-select') as HTMLSelectElement;
      const options = Array.from(select.options).map(o => Number(o.value));

      expect(options).toEqual([10, 20, 50, 100]);
    });

    it('should render custom page size options', () => {
      render(
        <Pagination
          {...defaultProps}
          pageSize={5}
          pageSizeOptions={[5, 15, 25]}
          onPageSizeChange={vi.fn()}
        />
      );

      const select = screen.getByTestId('pagination-page-size-select') as HTMLSelectElement;
      const options = Array.from(select.options).map(o => Number(o.value));

      expect(options).toEqual([5, 15, 25]);
    });

    it('should show current page size as selected', () => {
      render(
        <Pagination
          {...defaultProps}
          pageSize={20}
          onPageSizeChange={vi.fn()}
        />
      );

      const select = screen.getByTestId('pagination-page-size-select') as HTMLSelectElement;
      expect(select.value).toBe('20');
    });

    it('should call onPageSizeChange when page size changed', async () => {
      const user = userEvent.setup();
      const onPageSizeChange = vi.fn();

      render(
        <Pagination
          {...defaultProps}
          pageSize={10}
          onPageSizeChange={onPageSizeChange}
        />
      );

      const select = screen.getByTestId('pagination-page-size-select');
      await user.selectOptions(select, '50');

      expect(onPageSizeChange).toHaveBeenCalledWith(50);
    });
  });

  describe('Accessibility', () => {
    it('should have role="navigation"', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByTestId('pagination')).toHaveAttribute('role', 'navigation');
    });

    it('should have aria-label="pagination"', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByTestId('pagination')).toHaveAttribute('aria-label', 'pagination');
    });

    it('should have aria-label on navigation buttons', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByTestId('pagination-first')).toHaveAttribute('aria-label', 'Go to first page');
      expect(screen.getByTestId('pagination-previous')).toHaveAttribute('aria-label', 'Go to previous page');
      expect(screen.getByTestId('pagination-next')).toHaveAttribute('aria-label', 'Go to next page');
      expect(screen.getByTestId('pagination-last')).toHaveAttribute('aria-label', 'Go to last page');
    });

    it('should have aria-label on page buttons', () => {
      render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);

      expect(screen.getByTestId('pagination-page-2')).toHaveAttribute('aria-label', 'Go to page 2');
    });

    it('should have aria-current on current page', () => {
      render(<Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />);

      expect(screen.getByTestId('pagination-page-3')).toHaveAttribute('aria-current', 'page');
    });

    it('should be keyboard focusable', () => {
      render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);

      const button = screen.getByTestId('pagination-page-2');
      button.focus();

      expect(button).toHaveFocus();
    });

    it('should have focus visible styles', () => {
      render(<Pagination {...defaultProps} />);

      const button = screen.getByTestId('pagination-page-1');
      expect(button).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single page', () => {
      render(<Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />);

      expect(screen.getByTestId('pagination-previous')).toBeDisabled();
      expect(screen.getByTestId('pagination-next')).toBeDisabled();
      expect(screen.getByTestId('pagination-page-1')).toBeInTheDocument();
    });

    it('should handle two pages', () => {
      render(<Pagination currentPage={1} totalPages={2} onPageChange={vi.fn()} />);

      expect(screen.getByTestId('pagination-page-1')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-page-2')).toBeInTheDocument();
    });
  });
});
