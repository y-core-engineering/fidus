import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsRoot, TabsList, TabsTrigger, TabsContent } from './tabs';

describe('Tabs', () => {
  const mockItems = [
    { value: 'tab1', label: 'Tab 1', content: 'Content 1' },
    { value: 'tab2', label: 'Tab 2', content: 'Content 2' },
    { value: 'tab3', label: 'Tab 3', content: 'Content 3' },
  ];

  describe('Rendering', () => {
    it('should render tabs with items', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" />);

      expect(screen.getByTestId('tabs-root')).toBeInTheDocument();
      expect(screen.getByTestId('tabs-list')).toBeInTheDocument();
      expect(screen.getByTestId('tabs-trigger-tab1')).toBeInTheDocument();
      expect(screen.getByTestId('tabs-trigger-tab2')).toBeInTheDocument();
      expect(screen.getByTestId('tabs-trigger-tab3')).toBeInTheDocument();
    });

    it('should render tab labels correctly', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" />);

      expect(screen.getByTestId('tabs-trigger-tab1')).toHaveTextContent('Tab 1');
      expect(screen.getByTestId('tabs-trigger-tab2')).toHaveTextContent('Tab 2');
      expect(screen.getByTestId('tabs-trigger-tab3')).toHaveTextContent('Tab 3');
    });

    it('should render active tab content', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" />);

      expect(screen.getByTestId('tabs-content-tab1')).toHaveTextContent('Content 1');
      expect(screen.getByTestId('tabs-content-tab1')).toBeVisible();
    });

    it('should render with custom className', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" className="custom-class" />);

      expect(screen.getByTestId('tabs-root')).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" variant="default" />);

      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('border-b', 'border-border');
    });

    it('should render pills variant', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" variant="pills" />);

      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('bg-muted', 'rounded-lg');
    });

    it('should render underline variant', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" variant="underline" />);

      const trigger = screen.getByTestId('tabs-trigger-tab1');
      expect(trigger).toHaveClass('border-b-2');
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" size="sm" />);

      const trigger = screen.getByTestId('tabs-trigger-tab1');
      expect(trigger).toHaveClass('h-8', 'px-3', 'text-sm');
    });

    it('should render medium size', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" size="md" />);

      const trigger = screen.getByTestId('tabs-trigger-tab1');
      expect(trigger).toHaveClass('h-10', 'px-4', 'text-base');
    });

    it('should render large size', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" size="lg" />);

      const trigger = screen.getByTestId('tabs-trigger-tab1');
      expect(trigger).toHaveClass('h-12', 'px-6', 'text-lg');
    });
  });

  describe('Orientation', () => {
    it('should render horizontal orientation by default', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" />);

      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('flex-row');
    });

    it('should render horizontal orientation explicitly', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" orientation="horizontal" />);

      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('flex-row');
    });

    it('should render vertical orientation', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" orientation="vertical" />);

      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('flex-col', 'border-r');
    });
  });

  describe('Full Width', () => {
    it('should not be full width by default', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" />);

      const list = screen.getByTestId('tabs-list');
      expect(list).not.toHaveClass('w-full');
    });

    it('should render full width tabs', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" fullWidth />);

      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('w-full');
    });
  });

  describe('Interaction - Controlled', () => {
    it('should switch tabs on click', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<Tabs items={mockItems} value="tab1" onValueChange={onValueChange} />);

      await user.click(screen.getByTestId('tabs-trigger-tab2'));

      expect(onValueChange).toHaveBeenCalledWith('tab2');
    });

    it('should display correct content when controlled', () => {
      const { rerender } = render(<Tabs items={mockItems} value="tab1" />);

      expect(screen.getByTestId('tabs-content-tab1')).toBeVisible();

      rerender(<Tabs items={mockItems} value="tab2" />);

      expect(screen.getByTestId('tabs-content-tab2')).toBeVisible();
    });
  });

  describe('Interaction - Uncontrolled', () => {
    it('should switch tabs in uncontrolled mode', async () => {
      const user = userEvent.setup();

      render(<Tabs items={mockItems} defaultValue="tab1" />);

      expect(screen.getByTestId('tabs-content-tab1')).toBeVisible();

      await user.click(screen.getByTestId('tabs-trigger-tab2'));

      expect(screen.getByTestId('tabs-content-tab2')).toBeVisible();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate tabs with ArrowRight', async () => {
      const user = userEvent.setup();

      render(<Tabs items={mockItems} defaultValue="tab1" />);

      const trigger1 = screen.getByTestId('tabs-trigger-tab1');
      trigger1.focus();

      await user.keyboard('{ArrowRight}');

      expect(screen.getByTestId('tabs-trigger-tab2')).toHaveFocus();
    });

    it('should navigate tabs with ArrowLeft', async () => {
      const user = userEvent.setup();

      render(<Tabs items={mockItems} defaultValue="tab2" />);

      const trigger2 = screen.getByTestId('tabs-trigger-tab2');
      trigger2.focus();

      await user.keyboard('{ArrowLeft}');

      expect(screen.getByTestId('tabs-trigger-tab1')).toHaveFocus();
    });

    it('should navigate vertical tabs with ArrowDown', async () => {
      const user = userEvent.setup();

      render(<Tabs items={mockItems} defaultValue="tab1" orientation="vertical" />);

      const trigger1 = screen.getByTestId('tabs-trigger-tab1');
      trigger1.focus();

      await user.keyboard('{ArrowDown}');

      expect(screen.getByTestId('tabs-trigger-tab2')).toHaveFocus();
    });

    it('should navigate vertical tabs with ArrowUp', async () => {
      const user = userEvent.setup();

      render(<Tabs items={mockItems} defaultValue="tab2" orientation="vertical" />);

      const trigger2 = screen.getByTestId('tabs-trigger-tab2');
      trigger2.focus();

      await user.keyboard('{ArrowUp}');

      expect(screen.getByTestId('tabs-trigger-tab1')).toHaveFocus();
    });
  });

  describe('Disabled State', () => {
    it('should render disabled tab', () => {
      const itemsWithDisabled = [
        ...mockItems,
        { value: 'tab4', label: 'Tab 4', content: 'Content 4', disabled: true },
      ];

      render(<Tabs items={itemsWithDisabled} defaultValue="tab1" />);

      const trigger4 = screen.getByTestId('tabs-trigger-tab4');
      expect(trigger4).toBeDisabled();
    });

    it('should not switch to disabled tab on click', async () => {
      const user = userEvent.setup();
      const itemsWithDisabled = [
        ...mockItems,
        { value: 'tab4', label: 'Tab 4', content: 'Content 4', disabled: true },
      ];

      render(<Tabs items={itemsWithDisabled} defaultValue="tab1" />);

      await user.click(screen.getByTestId('tabs-trigger-tab4'));

      expect(screen.getByTestId('tabs-content-tab1')).toBeVisible();
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA roles', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" />);

      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveAttribute('role', 'tablist');

      const trigger = screen.getByTestId('tabs-trigger-tab1');
      expect(trigger).toHaveAttribute('role', 'tab');

      const content = screen.getByTestId('tabs-content-tab1');
      expect(content).toHaveAttribute('role', 'tabpanel');
    });

    it('should have aria-selected on active tab', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" />);

      const trigger1 = screen.getByTestId('tabs-trigger-tab1');
      expect(trigger1).toHaveAttribute('aria-selected', 'true');

      const trigger2 = screen.getByTestId('tabs-trigger-tab2');
      expect(trigger2).toHaveAttribute('aria-selected', 'false');
    });

    it('should have aria-controls linking tab to panel', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" />);

      const trigger1 = screen.getByTestId('tabs-trigger-tab1');
      const content1 = screen.getByTestId('tabs-content-tab1');

      const controlsId = trigger1.getAttribute('aria-controls');
      expect(content1).toHaveAttribute('id', controlsId);
    });

    it('should be keyboard focusable', () => {
      render(<Tabs items={mockItems} defaultValue="tab1" />);

      const trigger1 = screen.getByTestId('tabs-trigger-tab1');
      trigger1.focus();

      expect(trigger1).toHaveFocus();
    });
  });

  describe('Composable API', () => {
    it('should work with composable components', () => {
      render(
        <TabsRoot defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </TabsRoot>
      );

      expect(screen.getByTestId('tabs-root')).toBeInTheDocument();
      expect(screen.getByTestId('tabs-trigger-tab1')).toBeInTheDocument();
      expect(screen.getByTestId('tabs-content-tab1')).toHaveTextContent('Content 1');
    });

    it('should allow custom styling on composable components', () => {
      render(
        <TabsRoot defaultValue="tab1" className="custom-root">
          <TabsList className="custom-list">
            <TabsTrigger value="tab1" className="custom-trigger">
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="custom-content">
            Content 1
          </TabsContent>
        </TabsRoot>
      );

      expect(screen.getByTestId('tabs-root')).toHaveClass('custom-root');
      expect(screen.getByTestId('tabs-list')).toHaveClass('custom-list');
      expect(screen.getByTestId('tabs-trigger-tab1')).toHaveClass('custom-trigger');
      expect(screen.getByTestId('tabs-content-tab1')).toHaveClass('custom-content');
    });
  });
});
