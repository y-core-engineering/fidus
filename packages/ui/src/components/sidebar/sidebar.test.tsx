import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar, SidebarRoot, SidebarItem } from './sidebar';
import { Home, Settings } from 'lucide-react';

describe('Sidebar', () => {
  const mockItems = [
    { id: '1', label: 'Home', href: '/', active: true, icon: <Home data-testid="home-icon" /> },
    { id: '2', label: 'Settings', href: '/settings', icon: <Settings data-testid="settings-icon" /> },
    { id: '3', label: 'Profile', href: '/profile' },
  ];

  const mockSections = [
    {
      id: 'main',
      title: 'Main',
      items: mockItems.slice(0, 2),
    },
    {
      id: 'account',
      title: 'Account',
      items: [mockItems[2]],
    },
  ];

  describe('Rendering', () => {
    it('should render sidebar', () => {
      render(<Sidebar items={mockItems} />);

      expect(screen.getByTestId('sidebar-root')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Sidebar items={mockItems} className="custom-class" />);

      expect(screen.getByTestId('sidebar-root')).toHaveClass('custom-class');
    });

    it('should render sidebar items', () => {
      render(<Sidebar items={mockItems} />);

      expect(screen.getByTestId('sidebar-item-1')).toHaveTextContent('Home');
      expect(screen.getByTestId('sidebar-item-2')).toHaveTextContent('Settings');
      expect(screen.getByTestId('sidebar-item-3')).toHaveTextContent('Profile');
    });

    it('should render sidebar sections', () => {
      render(<Sidebar sections={mockSections} />);

      expect(screen.getByTestId('sidebar-section-main')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-section-account')).toBeInTheDocument();
    });
  });

  describe('Position', () => {
    it('should render left position by default', () => {
      render(<Sidebar items={mockItems} />);

      const sidebar = screen.getByTestId('sidebar-root');
      expect(sidebar).toHaveClass('border-r');
    });

    it('should render right position', () => {
      render(<Sidebar items={mockItems} position="right" />);

      const sidebar = screen.getByTestId('sidebar-root');
      expect(sidebar).toHaveClass('border-l');
    });
  });

  describe('Width', () => {
    it('should render small width', () => {
      render(<Sidebar items={mockItems} width="sm" />);

      const sidebar = screen.getByTestId('sidebar-root');
      expect(sidebar).toHaveClass('w-60');
    });

    it('should render medium width by default', () => {
      render(<Sidebar items={mockItems} />);

      const sidebar = screen.getByTestId('sidebar-root');
      expect(sidebar).toHaveClass('w-70');
    });

    it('should render large width', () => {
      render(<Sidebar items={mockItems} width="lg" />);

      const sidebar = screen.getByTestId('sidebar-root');
      expect(sidebar).toHaveClass('w-80');
    });
  });

  describe('Collapsed State', () => {
    it('should not be collapsed by default', () => {
      render(<Sidebar items={mockItems} />);

      const sidebar = screen.getByTestId('sidebar-root');
      expect(sidebar).not.toHaveClass('w-16');
    });

    it('should render collapsed sidebar', () => {
      render(<Sidebar items={mockItems} collapsed />);

      const sidebar = screen.getByTestId('sidebar-root');
      expect(sidebar).toHaveClass('w-16');
    });

    it('should hide text when collapsed', () => {
      render(<Sidebar items={mockItems} collapsed />);

      const item = screen.getByTestId('sidebar-item-1');
      expect(item).not.toHaveTextContent('Home');
    });

    it('should show icons when collapsed', () => {
      render(<Sidebar items={mockItems} collapsed />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    it('should add title attribute when collapsed', () => {
      render(<Sidebar items={mockItems} collapsed />);

      const item = screen.getByTestId('sidebar-item-1');
      expect(item).toHaveAttribute('title', 'Home');
    });
  });

  describe('Active State', () => {
    it('should mark active item', () => {
      render(<Sidebar items={mockItems} />);

      const activeItem = screen.getByTestId('sidebar-item-1');
      expect(activeItem).toHaveClass('bg-muted', 'text-foreground');
    });

    it('should have aria-current on active item', () => {
      render(<Sidebar items={mockItems} />);

      const activeItem = screen.getByTestId('sidebar-item-1');
      expect(activeItem).toHaveAttribute('aria-current', 'page');
    });

    it('should not mark inactive items', () => {
      render(<Sidebar items={mockItems} />);

      const inactiveItem = screen.getByTestId('sidebar-item-2');
      expect(inactiveItem).toHaveClass('text-muted-foreground');
    });
  });

  describe('Nested Navigation', () => {
    const nestedItems = [
      {
        id: '1',
        label: 'Settings',
        children: [
          { id: '1-1', label: 'General', href: '/settings/general' },
          { id: '1-2', label: 'Security', href: '/settings/security' },
        ],
      },
      { id: '2', label: 'Profile', href: '/profile' },
    ];

    it('should render parent items with children', () => {
      render(<Sidebar items={nestedItems} />);

      expect(screen.getByTestId('sidebar-item-1')).toHaveTextContent('Settings');
    });

    it('should not show children by default', () => {
      render(<Sidebar items={nestedItems} />);

      expect(screen.queryByTestId('sidebar-item-1-1')).not.toBeInTheDocument();
    });

    it('should expand children on click', async () => {
      const user = userEvent.setup();

      render(<Sidebar items={nestedItems} />);

      await user.click(screen.getByTestId('sidebar-item-1'));

      expect(screen.getByTestId('sidebar-item-1-1')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-item-1-2')).toBeInTheDocument();
    });

    it('should collapse children on second click', async () => {
      const user = userEvent.setup();

      render(<Sidebar items={nestedItems} />);

      const parent = screen.getByTestId('sidebar-item-1');
      await user.click(parent);
      await user.click(parent);

      expect(screen.queryByTestId('sidebar-item-1-1')).not.toBeInTheDocument();
    });

    it('should style nested items differently', async () => {
      const user = userEvent.setup();

      render(<Sidebar items={nestedItems} />);

      await user.click(screen.getByTestId('sidebar-item-1'));

      const nestedItem = screen.getByTestId('sidebar-item-1-1');
      expect(nestedItem).toHaveClass('pl-10');
    });

    it('should show chevron icon on parent items', () => {
      render(<Sidebar items={nestedItems} />);

      const parent = screen.getByTestId('sidebar-item-1');
      expect(parent.querySelector('svg')).toBeInTheDocument();
    });

    it('should not show children when collapsed', async () => {
      const user = userEvent.setup();

      render(<Sidebar items={nestedItems} collapsed />);

      await user.click(screen.getByTestId('sidebar-item-1'));

      expect(screen.queryByTestId('sidebar-item-1-1')).not.toBeInTheDocument();
    });
  });

  describe('Sections', () => {
    it('should render section headers', () => {
      render(<Sidebar sections={mockSections} />);

      expect(screen.getByTestId('sidebar-section-header-main')).toHaveTextContent('Main');
      expect(screen.getByTestId('sidebar-section-header-account')).toHaveTextContent('Account');
    });

    it('should hide section headers when collapsed', () => {
      render(<Sidebar sections={mockSections} collapsed />);

      expect(screen.queryByTestId('sidebar-section-header-main')).not.toBeInTheDocument();
    });

    it('should render collapsible section', () => {
      const collapsibleSections = [
        {
          ...mockSections[0],
          collapsible: true,
        },
      ];

      render(<Sidebar sections={collapsibleSections} />);

      expect(screen.getByTestId('sidebar-section-toggle-main')).toBeInTheDocument();
    });

    it('should collapse section on header click', async () => {
      const user = userEvent.setup();
      const collapsibleSections = [
        {
          ...mockSections[0],
          collapsible: true,
        },
      ];

      render(<Sidebar sections={collapsibleSections} />);

      await user.click(screen.getByTestId('sidebar-section-header-main'));

      expect(screen.queryByTestId('sidebar-item-1')).not.toBeInTheDocument();
    });

    it('should render section with defaultCollapsed', () => {
      const collapsedSections = [
        {
          ...mockSections[0],
          collapsible: true,
          defaultCollapsed: true,
        },
      ];

      render(<Sidebar sections={collapsedSections} />);

      expect(screen.queryByTestId('sidebar-item-1')).not.toBeInTheDocument();
    });

    it('should expand section on header click when collapsed', async () => {
      const user = userEvent.setup();
      const collapsedSections = [
        {
          ...mockSections[0],
          collapsible: true,
          defaultCollapsed: true,
        },
      ];

      render(<Sidebar sections={collapsedSections} />);

      await user.click(screen.getByTestId('sidebar-section-header-main'));

      expect(screen.getByTestId('sidebar-item-1')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('should render item icons', () => {
      render(<Sidebar items={mockItems} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    });

    it('should render items without icons', () => {
      render(<Sidebar items={mockItems} />);

      const itemWithoutIcon = screen.getByTestId('sidebar-item-3');
      expect(itemWithoutIcon.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have nav role', () => {
      render(<Sidebar items={mockItems} />);

      const sidebar = screen.getByTestId('sidebar-root');
      expect(sidebar).toHaveAttribute('role', 'navigation');
    });

    it('should have aria-label', () => {
      render(<Sidebar items={mockItems} />);

      const sidebar = screen.getByTestId('sidebar-root');
      expect(sidebar).toHaveAttribute('aria-label', 'sidebar navigation');
    });

    it('should be keyboard focusable', () => {
      render(<Sidebar items={mockItems} />);

      const item = screen.getByTestId('sidebar-item-1') as HTMLAnchorElement;
      item.focus();

      expect(item).toHaveFocus();
    });

    it('should have focus visible styles', () => {
      render(<Sidebar items={mockItems} />);

      const item = screen.getByTestId('sidebar-item-1');
      expect(item).toHaveClass('focus-visible:ring-2');
    });

    it('should use aside tag', () => {
      render(<Sidebar items={mockItems} />);

      const sidebar = screen.getByTestId('sidebar-root');
      expect(sidebar.tagName).toBe('ASIDE');
    });
  });

  describe('Composable API', () => {
    it('should work with composable components', () => {
      render(
        <SidebarRoot>
          <SidebarItem item={mockItems[0]} />
          <SidebarItem item={mockItems[1]} />
        </SidebarRoot>
      );

      expect(screen.getByTestId('sidebar-root')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-item-1')).toBeInTheDocument();
    });

    it('should allow custom styling on composable components', () => {
      render(
        <SidebarRoot className="custom-root">
          <SidebarItem item={mockItems[0]} className="custom-item" />
        </SidebarRoot>
      );

      expect(screen.getByTestId('sidebar-root')).toHaveClass('custom-root');
      expect(screen.getByTestId('sidebar-item-1')).toHaveClass('custom-item');
    });
  });

  describe('Links', () => {
    it('should render items with href as links', () => {
      render(<Sidebar items={mockItems} />);

      const item = screen.getByTestId('sidebar-item-1') as HTMLAnchorElement;
      expect(item.tagName).toBe('A');
      expect(item).toHaveAttribute('href', '/');
    });

    it('should render items without href as divs', () => {
      const itemsWithoutHref = [{ id: '1', label: 'Item' }];

      render(<Sidebar items={itemsWithoutHref} />);

      const item = screen.getByTestId('sidebar-item-1');
      expect(item.tagName).toBe('DIV');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      render(<Sidebar items={[]} width="md" position="left" collapsed={false} />);

      expect(screen.getByTestId('sidebar-root')).toBeInTheDocument();
    });

    it('should handle empty sections array', () => {
      render(<Sidebar sections={[]} width="md" position="left" collapsed={false} />);

      expect(screen.getByTestId('sidebar-root')).toBeInTheDocument();
    });

    it('should handle deeply nested items', async () => {
      const user = userEvent.setup();
      const deeplyNested = [
        {
          id: '1',
          label: 'Level 1',
          children: [
            {
              id: '1-1',
              label: 'Level 2',
              href: '/level2',
            },
          ],
        },
      ];

      render(<Sidebar items={deeplyNested} width="md" position="left" collapsed={false} />);

      await user.click(screen.getByTestId('sidebar-item-1'));

      expect(screen.getByTestId('sidebar-item-1-1')).toBeInTheDocument();
    });
  });
});
