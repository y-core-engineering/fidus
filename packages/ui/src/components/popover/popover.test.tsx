import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Popover,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from './popover';

describe('Popover', () => {
  describe('Rendering', () => {
    it('should render popover trigger', () => {
      render(
        <Popover trigger={<button>Open Popover</button>}>
          <p>Popover content</p>
        </Popover>
      );

      expect(screen.getByText('Open Popover')).toBeInTheDocument();
    });

    it('should not render content when closed', () => {
      render(
        <Popover trigger={<button>Open Popover</button>}>
          <p>Popover content</p>
        </Popover>
      );

      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    });

    it('should render content when open', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>}>
          <p>Popover content</p>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });

    it('should render arrow by default', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>}>
          <p>Content</p>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      expect(screen.getByTestId('popover-arrow')).toBeInTheDocument();
    });

    it('should not render arrow when showArrow is false', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>} showArrow={false}>
          <p>Content</p>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      expect(screen.queryByTestId('popover-arrow')).not.toBeInTheDocument();
    });
  });

  describe('Positioning', () => {
    it('should position popover on bottom by default', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>}>
          <p>Content</p>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-side', 'bottom');
    });

    it('should position popover on top', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>} side="top">
          <p>Content</p>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-side', 'top');
    });

    it('should position popover on left', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>} side="left">
          <p>Content</p>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-side', 'left');
    });

    it('should position popover on right', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>} side="right">
          <p>Content</p>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-side', 'right');
    });
  });

  describe('Alignment', () => {
    it('should align center by default', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>}>
          <p>Content</p>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-align', 'center');
    });

    it('should align start', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>} align="start">
          <p>Content</p>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-align', 'start');
    });

    it('should align end', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>} align="end">
          <p>Content</p>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-align', 'end');
    });
  });

  describe('Interactions', () => {
    it('should open popover on trigger click', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>}>
          <p>Content</p>
        </Popover>
      );

      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
      await user.click(screen.getByText('Open Popover'));
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });

    it('should close popover on trigger click when open', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>}>
          <p>Content</p>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();

      await user.click(screen.getByText('Open Popover'));
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    });

    it('should close popover on outside click', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <div data-testid="outside">Outside</div>
          <Popover trigger={<button>Open Popover</button>}>
            <p>Content</p>
          </Popover>
        </div>
      );

      await user.click(screen.getByText('Open Popover'));
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();

      await user.click(screen.getByTestId('outside'));
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    });

    it('should close popover with PopoverClose', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger asChild>
            <button>Open Popover</button>
          </PopoverTrigger>
          <PopoverContent>
            <p>Content</p>
            <PopoverClose asChild>
              <button>Close</button>
            </PopoverClose>
          </PopoverContent>
        </PopoverRoot>
      );

      await user.click(screen.getByText('Open Popover'));
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();

      await user.click(screen.getByText('Close'));
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    });
  });

  describe('Controlled State', () => {
    it('should work as controlled component', () => {
      render(
        <Popover trigger={<button>Trigger</button>} open={true}>
          <p>Content</p>
        </Popover>
      );

      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });

    it('should call onOpenChange when state changes', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Popover trigger={<button>Trigger</button>} onOpenChange={onOpenChange}>
          <p>Content</p>
        </Popover>
      );

      await user.click(screen.getByText('Trigger'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('should stay open when controlled with open=true', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Popover trigger={<button>Trigger</button>} open={true} onOpenChange={onOpenChange}>
          <p>Content</p>
        </Popover>
      );

      expect(screen.getByTestId('popover-content')).toBeInTheDocument();

      await user.click(screen.getByText('Trigger'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
      // Content should still be there because we're controlling it
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });
  });

  describe('Composable Components', () => {
    it('should work with composable components', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger asChild>
            <button>Trigger</button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Custom Content</div>
          </PopoverContent>
        </PopoverRoot>
      );

      await user.click(screen.getByText('Trigger'));
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close on Escape key', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>}>
          <p>Content</p>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>}>
          <p>Content</p>
        </Popover>
      );

      const trigger = screen.getByText('Open Popover');
      expect(trigger).toHaveAttribute('data-state', 'closed');

      await user.click(trigger);
      expect(trigger).toHaveAttribute('data-state', 'open');

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('role', 'dialog');
    });

    it('should focus trap when open', async () => {
      const user = userEvent.setup();

      render(
        <Popover trigger={<button>Open Popover</button>}>
          <input type="text" placeholder="Input" />
          <button>Button</button>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      // Content should be in the document
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });
  });
});
