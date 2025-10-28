import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dropdown,
  DropdownRoot,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  DropdownCheckboxItem,
  DropdownRadioItem,
  DropdownRadioGroup,
  DropdownSubTrigger,
  DropdownSubContent,
  DropdownSub,
} from './dropdown';

describe('Dropdown', () => {
  describe('Rendering', () => {
    it('should render dropdown trigger', () => {
      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownItem>Item 1</DropdownItem>
        </Dropdown>
      );

      expect(screen.getByText('Open Menu')).toBeInTheDocument();
    });

    it('should not render content when closed', () => {
      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownItem>Item 1</DropdownItem>
        </Dropdown>
      );

      expect(screen.queryByTestId('dropdown-content')).not.toBeInTheDocument();
    });

    it('should render content when open', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownItem>Item 1</DropdownItem>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
    });

    it('should render multiple items', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownItem>Item 1</DropdownItem>
          <DropdownItem>Item 2</DropdownItem>
          <DropdownItem>Item 3</DropdownItem>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('DropdownItem', () => {
    it('should render dropdown item', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownItem>Test Item</DropdownItem>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      expect(screen.getByTestId('dropdown-item')).toHaveTextContent('Test Item');
    });

    it('should call onClick when item is clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownItem onClick={onClick}>Test Item</DropdownItem>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      await user.click(screen.getByText('Test Item'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render item with icon', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownItem icon={<span data-testid="test-icon">📁</span>}>With Icon</DropdownItem>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownItem disabled onClick={onClick}>
            Disabled Item
          </DropdownItem>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      const item = screen.getByText('Disabled Item');
      expect(item).toHaveAttribute('data-disabled');
    });
  });

  describe('DropdownSeparator', () => {
    it('should render separator', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownItem>Item 1</DropdownItem>
          <DropdownSeparator />
          <DropdownItem>Item 2</DropdownItem>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      expect(screen.getByTestId('dropdown-separator')).toBeInTheDocument();
    });
  });

  describe('DropdownLabel', () => {
    it('should render label', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownLabel>Section Label</DropdownLabel>
          <DropdownItem>Item 1</DropdownItem>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      expect(screen.getByTestId('dropdown-label')).toHaveTextContent('Section Label');
    });
  });

  describe('DropdownCheckboxItem', () => {
    it('should render checkbox item', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownCheckboxItem checked={false}>Checkbox Item</DropdownCheckboxItem>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      expect(screen.getByTestId('dropdown-checkbox-item')).toHaveTextContent('Checkbox Item');
    });

    it('should show indicator when checked', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownCheckboxItem checked>Checked Item</DropdownCheckboxItem>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      expect(screen.getByTestId('dropdown-checkbox-indicator')).toBeInTheDocument();
    });

    it('should call onCheckedChange when clicked', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
            Checkbox
          </DropdownCheckboxItem>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      await user.click(screen.getByText('Checkbox'));
      expect(onCheckedChange).toHaveBeenCalled();
    });
  });

  describe('DropdownRadioItem', () => {
    it('should render radio item', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownRadioGroup value="option1">
            <DropdownRadioItem value="option1">Option 1</DropdownRadioItem>
          </DropdownRadioGroup>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      expect(screen.getByTestId('dropdown-radio-item')).toHaveTextContent('Option 1');
    });

    it('should show indicator when selected', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownRadioGroup value="option1">
            <DropdownRadioItem value="option1">Selected Option</DropdownRadioItem>
          </DropdownRadioGroup>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      expect(screen.getByTestId('dropdown-radio-indicator')).toBeInTheDocument();
    });

    it('should call onValueChange when radio item is selected', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownRadioGroup value="option1" onValueChange={onValueChange}>
            <DropdownRadioItem value="option1">Option 1</DropdownRadioItem>
            <DropdownRadioItem value="option2">Option 2</DropdownRadioItem>
          </DropdownRadioGroup>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      await user.click(screen.getByText('Option 2'));
      expect(onValueChange).toHaveBeenCalledWith('option2');
    });
  });

  describe('Sub-menus', () => {
    it('should render sub-menu trigger', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownSub>
            <DropdownSubTrigger>More Options</DropdownSubTrigger>
            <DropdownSubContent>
              <DropdownItem>Sub Item</DropdownItem>
            </DropdownSubContent>
          </DropdownSub>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      expect(screen.getByTestId('dropdown-sub-trigger')).toHaveTextContent('More Options');
    });

    it('should render sub-menu content when hovering trigger', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownSub>
            <DropdownSubTrigger>More Options</DropdownSubTrigger>
            <DropdownSubContent>
              <DropdownItem>Sub Item</DropdownItem>
            </DropdownSubContent>
          </DropdownSub>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      await user.hover(screen.getByTestId('dropdown-sub-trigger'));

      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(screen.getByTestId('dropdown-sub-content')).toBeInTheDocument();
    });
  });

  describe('Composable Components', () => {
    it('should work with composable components', async () => {
      const user = userEvent.setup();

      render(
        <DropdownRoot>
          <DropdownTrigger asChild>
            <button>Trigger</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Item</DropdownItem>
          </DropdownContent>
        </DropdownRoot>
      );

      await user.click(screen.getByText('Trigger'));
      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
    });
  });

  describe('Controlled State', () => {
    it('should work as controlled component', async () => {
      const onOpenChange = vi.fn();

      render(
        <Dropdown trigger={<button>Open Menu</button>} open={true} onOpenChange={onOpenChange}>
          <DropdownItem>Item 1</DropdownItem>
        </Dropdown>
      );

      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
    });

    it('should call onOpenChange when state changes', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Dropdown trigger={<button>Open Menu</button>} onOpenChange={onOpenChange}>
          <DropdownItem>Item 1</DropdownItem>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate items with arrow keys', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownItem>Item 1</DropdownItem>
          <DropdownItem>Item 2</DropdownItem>
          <DropdownItem>Item 3</DropdownItem>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      await user.keyboard('{ArrowDown}');
      // Focus should move to first item
      expect(screen.getByText('Item 1')).toHaveFocus();
    });

    it('should close on Escape key', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          <DropdownItem>Item 1</DropdownItem>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));
      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByTestId('dropdown-content')).not.toBeInTheDocument();
    });
  });
});
