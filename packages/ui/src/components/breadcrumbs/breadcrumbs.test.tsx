import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Breadcrumbs } from './breadcrumbs';
import { Home } from 'lucide-react';

describe('Breadcrumbs', () => {
  const mockItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Category', href: '/products/category' },
    { label: 'Item' },
  ];

  describe('Rendering', () => {
    it('should render breadcrumbs with items', () => {
      render(<Breadcrumbs items={mockItems} />);

      expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('Home');
      expect(screen.getByTestId('breadcrumb-item-1')).toHaveTextContent('Products');
      expect(screen.getByTestId('breadcrumb-item-2')).toHaveTextContent('Category');
      expect(screen.getByTestId('breadcrumb-item-3')).toHaveTextContent('Item');
    });

    it('should render with custom className', () => {
      render(<Breadcrumbs items={mockItems} className="custom-class" />);

      expect(screen.getByTestId('breadcrumbs')).toHaveClass('custom-class');
    });

    it('should render breadcrumbs with icons', () => {
      const itemsWithIcon = [
        { label: 'Home', href: '/', icon: <Home data-testid="home-icon" /> },
        { label: 'Products', href: '/products' },
      ];

      render(<Breadcrumbs items={itemsWithIcon} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    it('should render single item breadcrumb', () => {
      render(<Breadcrumbs items={[{ label: 'Home' }]} />);

      expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('Home');
    });
  });

  describe('Separators', () => {
    it('should render chevron separator by default', () => {
      render(<Breadcrumbs items={mockItems} />);

      expect(screen.getByTestId('breadcrumb-separator-0')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb-separator-1')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb-separator-2')).toBeInTheDocument();
    });

    it('should render chevron separator explicitly', () => {
      render(<Breadcrumbs items={mockItems} separator="chevron" />);

      const separator = screen.getByTestId('breadcrumb-separator-0');
      expect(separator.querySelector('svg')).toBeInTheDocument();
    });

    it('should render slash separator', () => {
      render(<Breadcrumbs items={mockItems} separator="slash" />);

      const separator = screen.getByTestId('breadcrumb-separator-0');
      expect(separator.querySelector('svg')).toBeInTheDocument();
    });

    it('should render dot separator', () => {
      render(<Breadcrumbs items={mockItems} separator="dot" />);

      const separator = screen.getByTestId('breadcrumb-separator-0');
      expect(separator.querySelector('svg')).toBeInTheDocument();
    });

    it('should not render separator after last item', () => {
      render(<Breadcrumbs items={mockItems} />);

      expect(screen.queryByTestId('breadcrumb-separator-3')).not.toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<Breadcrumbs items={mockItems} size="sm" />);

      const breadcrumbs = screen.getByTestId('breadcrumbs');
      expect(breadcrumbs).toHaveClass('text-sm', 'gap-1');
    });

    it('should render medium size by default', () => {
      render(<Breadcrumbs items={mockItems} />);

      const breadcrumbs = screen.getByTestId('breadcrumbs');
      expect(breadcrumbs).toHaveClass('text-base', 'gap-2');
    });

    it('should render large size', () => {
      render(<Breadcrumbs items={mockItems} size="lg" />);

      const breadcrumbs = screen.getByTestId('breadcrumbs');
      expect(breadcrumbs).toHaveClass('text-lg', 'gap-3');
    });
  });

  describe('Truncation', () => {
    it('should not truncate when items less than maxItems', () => {
      render(<Breadcrumbs items={mockItems} maxItems={5} />);

      expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('Home');
      expect(screen.getByTestId('breadcrumb-item-1')).toHaveTextContent('Products');
      expect(screen.getByTestId('breadcrumb-item-2')).toHaveTextContent('Category');
      expect(screen.getByTestId('breadcrumb-item-3')).toHaveTextContent('Item');
    });

    it('should truncate when items exceed maxItems', () => {
      render(<Breadcrumbs items={mockItems} maxItems={3} />);

      expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('Home');
      expect(screen.getByTestId('breadcrumb-item-1')).toHaveTextContent('...');
      expect(screen.getByTestId('breadcrumb-item-2')).toHaveTextContent('Category');
      expect(screen.getByTestId('breadcrumb-item-3')).toHaveTextContent('Item');
    });

    it('should show first and last items when truncated', () => {
      const manyItems = [
        { label: 'First', href: '/' },
        { label: 'Second', href: '/second' },
        { label: 'Third', href: '/third' },
        { label: 'Fourth', href: '/fourth' },
        { label: 'Fifth', href: '/fifth' },
        { label: 'Last' },
      ];

      render(<Breadcrumbs items={manyItems} maxItems={3} />);

      expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('First');
      expect(screen.getByTestId('breadcrumb-item-1')).toHaveTextContent('...');
      expect(screen.getByTestId('breadcrumb-item-2')).toHaveTextContent('Fifth');
      expect(screen.getByTestId('breadcrumb-item-3')).toHaveTextContent('Last');
    });

    it('should not make ellipsis clickable', () => {
      render(<Breadcrumbs items={mockItems} maxItems={3} />);

      const ellipsis = screen.getByTestId('breadcrumb-item-1');
      expect(ellipsis.tagName).toBe('SPAN');
      expect(ellipsis.querySelector('a')).not.toBeInTheDocument();
    });
  });

  describe('Current Page', () => {
    it('should mark last item as current page', () => {
      render(<Breadcrumbs items={mockItems} />);

      const lastItem = screen.getByTestId('breadcrumb-item-3');
      expect(lastItem).toHaveAttribute('aria-current', 'page');
    });

    it('should not make last item a link', () => {
      render(<Breadcrumbs items={mockItems} />);

      const lastItem = screen.getByTestId('breadcrumb-item-3');
      expect(lastItem.tagName).toBe('SPAN');
      expect(lastItem.querySelector('a')).not.toBeInTheDocument();
    });

    it('should style last item differently', () => {
      render(<Breadcrumbs items={mockItems} />);

      const lastItem = screen.getByTestId('breadcrumb-item-3');
      expect(lastItem.querySelector('span')).toHaveClass('text-foreground', 'font-medium');
    });
  });

  describe('Links', () => {
    it('should render links for non-last items with href', () => {
      render(<Breadcrumbs items={mockItems} />);

      const firstItem = screen.getByTestId('breadcrumb-item-0');
      expect(firstItem.tagName).toBe('A');
      expect(firstItem).toHaveAttribute('href', '/');
    });

    it('should render all intermediate links', () => {
      render(<Breadcrumbs items={mockItems} />);

      expect(screen.getByTestId('breadcrumb-item-0')).toHaveAttribute('href', '/');
      expect(screen.getByTestId('breadcrumb-item-1')).toHaveAttribute('href', '/products');
      expect(screen.getByTestId('breadcrumb-item-2')).toHaveAttribute('href', '/products/category');
    });

    it('should be clickable', async () => {
      const user = userEvent.setup();

      render(<Breadcrumbs items={mockItems} />);

      const firstLink = screen.getByTestId('breadcrumb-item-0') as HTMLAnchorElement;
      await user.click(firstLink);

      // Link should remain in document (no navigation in test)
      expect(firstLink).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label="breadcrumb"', () => {
      render(<Breadcrumbs items={mockItems} />);

      expect(screen.getByTestId('breadcrumbs')).toHaveAttribute('aria-label', 'breadcrumb');
    });

    it('should have nav role', () => {
      render(<Breadcrumbs items={mockItems} />);

      const nav = screen.getByTestId('breadcrumbs');
      expect(nav.tagName).toBe('NAV');
    });

    it('should have ordered list structure', () => {
      render(<Breadcrumbs items={mockItems} />);

      const ol = screen.getByTestId('breadcrumbs').querySelector('ol');
      expect(ol).toBeInTheDocument();
    });

    it('should hide separator icons from screen readers', () => {
      render(<Breadcrumbs items={mockItems} />);

      const separator = screen.getByTestId('breadcrumb-separator-0').querySelector('svg');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });

    it('should be keyboard focusable', () => {
      render(<Breadcrumbs items={mockItems} />);

      const firstLink = screen.getByTestId('breadcrumb-item-0') as HTMLAnchorElement;
      firstLink.focus();

      expect(firstLink).toHaveFocus();
    });

    it('should have focus visible styles', () => {
      render(<Breadcrumbs items={mockItems} />);

      const firstLink = screen.getByTestId('breadcrumb-item-0');
      expect(firstLink).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle items without href', () => {
      const itemsWithoutHref = [
        { label: 'Home' },
        { label: 'Products' },
      ];

      render(<Breadcrumbs items={itemsWithoutHref} />);

      const firstItem = screen.getByTestId('breadcrumb-item-0');
      expect(firstItem.tagName).toBe('SPAN');
    });

    it('should handle mixed items with and without href', () => {
      const mixedItems = [
        { label: 'Home', href: '/' },
        { label: 'Products' },
        { label: 'Category', href: '/category' },
      ];

      render(<Breadcrumbs items={mixedItems} />);

      expect(screen.getByTestId('breadcrumb-item-0').tagName).toBe('A');
      expect(screen.getByTestId('breadcrumb-item-1').tagName).toBe('SPAN');
      expect(screen.getByTestId('breadcrumb-item-2').tagName).toBe('SPAN'); // Last item
    });

    it('should handle very long labels', () => {
      const longLabelItems = [
        { label: 'Home', href: '/' },
        {
          label: 'Very Long Category Name That Might Wrap',
          href: '/category',
        },
      ];

      render(<Breadcrumbs items={longLabelItems} />);

      expect(screen.getByTestId('breadcrumb-item-1')).toHaveTextContent(
        'Very Long Category Name That Might Wrap'
      );
    });
  });
});
