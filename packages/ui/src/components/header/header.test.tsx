import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from './header';
import { Search, User } from 'lucide-react';

describe('Header', () => {
  describe('Rendering', () => {
    it('should render header', () => {
      render(<Header />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('header-container')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Header className="custom-class" />);

      expect(screen.getByTestId('header')).toHaveClass('custom-class');
    });
  });

  describe('Logo', () => {
    it('should render logo with text', () => {
      render(<Header logo={{ text: 'My App' }} />);

      expect(screen.getByTestId('header-logo')).toBeInTheDocument();
      expect(screen.getByTestId('header-logo-text')).toHaveTextContent('My App');
    });

    it('should render logo with image', () => {
      render(<Header logo={{ image: '/logo.png', text: 'My App' }} />);

      expect(screen.getByTestId('header-logo-image')).toBeInTheDocument();
      expect(screen.getByTestId('header-logo-image')).toHaveAttribute('src', '/logo.png');
      expect(screen.getByTestId('header-logo-image')).toHaveAttribute('alt', 'My App');
    });

    it('should render logo with only image', () => {
      render(<Header logo={{ image: '/logo.png' }} />);

      expect(screen.getByTestId('header-logo-image')).toBeInTheDocument();
      expect(screen.queryByTestId('header-logo-text')).not.toBeInTheDocument();
    });

    it('should use default href for logo', () => {
      render(<Header logo={{ text: 'My App' }} />);

      expect(screen.getByTestId('header-logo')).toHaveAttribute('href', '/');
    });

    it('should use custom href for logo', () => {
      render(<Header logo={{ text: 'My App', href: '/home' }} />);

      expect(screen.getByTestId('header-logo')).toHaveAttribute('href', '/home');
    });

    it('should not render logo when not provided', () => {
      render(<Header />);

      expect(screen.queryByTestId('header-logo')).not.toBeInTheDocument();
    });
  });

  describe('Navigation Items', () => {
    const mockItems = [
      { label: 'Home', href: '/', active: true },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ];

    it('should render navigation items', () => {
      render(<Header items={mockItems} />);

      expect(screen.getByTestId('header-nav')).toBeInTheDocument();
      expect(screen.getByTestId('header-nav-item-0')).toHaveTextContent('Home');
      expect(screen.getByTestId('header-nav-item-1')).toHaveTextContent('About');
      expect(screen.getByTestId('header-nav-item-2')).toHaveTextContent('Contact');
    });

    it('should render navigation items with correct hrefs', () => {
      render(<Header items={mockItems} />);

      expect(screen.getByTestId('header-nav-item-0')).toHaveAttribute('href', '/');
      expect(screen.getByTestId('header-nav-item-1')).toHaveAttribute('href', '/about');
      expect(screen.getByTestId('header-nav-item-2')).toHaveAttribute('href', '/contact');
    });

    it('should mark active item', () => {
      render(<Header items={mockItems} />);

      expect(screen.getByTestId('header-nav-item-0')).toHaveAttribute('aria-current', 'page');
      expect(screen.getByTestId('header-nav-item-1')).not.toHaveAttribute('aria-current');
    });

    it('should render navigation items with icons', () => {
      const itemsWithIcons = [
        { label: 'Search', href: '/search', icon: <Search data-testid="search-icon" /> },
        { label: 'Profile', href: '/profile', icon: <User data-testid="user-icon" /> },
      ];

      render(<Header items={itemsWithIcons} />);

      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    });

    it('should not render navigation when items empty', () => {
      render(<Header items={[]} />);

      expect(screen.queryByTestId('header-nav')).not.toBeInTheDocument();
    });

    it('should have navigation role', () => {
      render(<Header items={mockItems} />);

      const nav = screen.getByTestId('header-nav');
      expect(nav).toHaveAttribute('role', 'navigation');
    });
  });

  describe('Actions', () => {
    it('should render action buttons', () => {
      const actions = (
        <>
          <button data-testid="search-button">Search</button>
          <button data-testid="user-button">User</button>
        </>
      );

      render(<Header actions={actions} />);

      expect(screen.getByTestId('header-actions')).toBeInTheDocument();
      expect(screen.getByTestId('search-button')).toBeInTheDocument();
      expect(screen.getByTestId('user-button')).toBeInTheDocument();
    });

    it('should not render actions when not provided', () => {
      render(<Header />);

      expect(screen.queryByTestId('header-actions')).not.toBeInTheDocument();
    });
  });

  describe('Mobile Menu Button', () => {
    it('should render mobile menu button when onMobileMenuClick provided', () => {
      render(<Header onMobileMenuClick={vi.fn()} />);

      expect(screen.getByTestId('header-mobile-menu-button')).toBeInTheDocument();
    });

    it('should not render mobile menu button when onMobileMenuClick not provided', () => {
      render(<Header />);

      expect(screen.queryByTestId('header-mobile-menu-button')).not.toBeInTheDocument();
    });

    it('should call onMobileMenuClick when clicked', async () => {
      const user = userEvent.setup();
      const onMobileMenuClick = vi.fn();

      render(<Header onMobileMenuClick={onMobileMenuClick} />);

      await user.click(screen.getByTestId('header-mobile-menu-button'));

      expect(onMobileMenuClick).toHaveBeenCalledTimes(1);
    });

    it('should have aria-label', () => {
      render(<Header onMobileMenuClick={vi.fn()} />);

      expect(screen.getByTestId('header-mobile-menu-button')).toHaveAttribute(
        'aria-label',
        'Open mobile menu'
      );
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<Header size="sm" />);

      const header = screen.getByTestId('header');
      expect(header).toHaveClass('h-14');
    });

    it('should render medium size by default', () => {
      render(<Header />);

      const header = screen.getByTestId('header');
      expect(header).toHaveClass('h-16');
    });

    it('should render large size', () => {
      render(<Header size="lg" />);

      const header = screen.getByTestId('header');
      expect(header).toHaveClass('h-20');
    });
  });

  describe('Sticky', () => {
    it('should not be sticky by default', () => {
      render(<Header />);

      const header = screen.getByTestId('header');
      expect(header).not.toHaveClass('sticky');
    });

    it('should render sticky header', () => {
      render(<Header sticky />);

      const header = screen.getByTestId('header');
      expect(header).toHaveClass('sticky', 'top-0', 'z-50');
    });
  });

  describe('Transparent', () => {
    it('should not be transparent by default', () => {
      render(<Header />);

      const header = screen.getByTestId('header');
      expect(header).toHaveClass('bg-background', 'border-border');
    });

    it('should render transparent header', () => {
      render(<Header transparent />);

      const header = screen.getByTestId('header');
      expect(header).toHaveClass('bg-transparent', 'border-transparent');
    });
  });

  describe('Accessibility', () => {
    it('should have header tag', () => {
      render(<Header />);

      const header = screen.getByTestId('header');
      expect(header.tagName).toBe('HEADER');
    });

    it('should be keyboard focusable on logo', () => {
      render(<Header logo={{ text: 'My App' }} />);

      const logo = screen.getByTestId('header-logo');
      logo.focus();

      expect(logo).toHaveFocus();
    });

    it('should be keyboard focusable on navigation items', () => {
      render(<Header items={[{ label: 'Home', href: '/' }]} />);

      const navItem = screen.getByTestId('header-nav-item-0');
      navItem.focus();

      expect(navItem).toHaveFocus();
    });

    it('should have focus visible styles on logo', () => {
      render(<Header logo={{ text: 'My App' }} />);

      const logo = screen.getByTestId('header-logo');
      expect(logo).toHaveClass('focus-visible:ring-2');
    });

    it('should have focus visible styles on navigation items', () => {
      render(<Header items={[{ label: 'Home', href: '/' }]} />);

      const navItem = screen.getByTestId('header-nav-item-0');
      expect(navItem).toHaveClass('focus-visible:ring-2');
    });

    it('should have focus visible styles on mobile menu button', () => {
      render(<Header onMobileMenuClick={vi.fn()} />);

      const button = screen.getByTestId('header-mobile-menu-button');
      expect(button).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('Complex Layouts', () => {
    it('should render complete header with all features', () => {
      const mockItems = [
        { label: 'Home', href: '/', active: true },
        { label: 'About', href: '/about' },
      ];

      const actions = (
        <>
          <button data-testid="search-button">Search</button>
          <button data-testid="user-button">User</button>
        </>
      );

      render(
        <Header
          logo={{ text: 'My App', image: '/logo.png' }}
          items={mockItems}
          actions={actions}
          sticky
          size="lg"
          onMobileMenuClick={vi.fn()}
        />
      );

      expect(screen.getByTestId('header-logo')).toBeInTheDocument();
      expect(screen.getByTestId('header-nav')).toBeInTheDocument();
      expect(screen.getByTestId('header-actions')).toBeInTheDocument();
      expect(screen.getByTestId('header-mobile-menu-button')).toBeInTheDocument();
    });

    it('should render minimal header with only logo', () => {
      render(<Header logo={{ text: 'My App' }} />);

      expect(screen.getByTestId('header-logo')).toBeInTheDocument();
      expect(screen.queryByTestId('header-nav')).not.toBeInTheDocument();
      expect(screen.queryByTestId('header-actions')).not.toBeInTheDocument();
      expect(screen.queryByTestId('header-mobile-menu-button')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      render(<Header items={[]} />);

      expect(screen.queryByTestId('header-nav')).not.toBeInTheDocument();
    });

    it('should handle logo with empty string text', () => {
      render(<Header logo={{ text: '' }} />);

      expect(screen.getByTestId('header-logo')).toBeInTheDocument();
      expect(screen.getByTestId('header-logo-text')).toHaveTextContent('');
    });
  });
});
