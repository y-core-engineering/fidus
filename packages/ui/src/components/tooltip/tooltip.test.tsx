import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Tooltip,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from './tooltip';

describe('Tooltip', () => {
  describe('Rendering', () => {
    it('should render tooltip trigger', () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Hover me</button>
        </Tooltip>
      );

      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('should not render content initially', () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Hover me</button>
        </Tooltip>
      );

      expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
    });

    it('should render content on hover', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
      });
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });

    it('should render arrow by default', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        expect(screen.getByTestId('tooltip-arrow')).toBeInTheDocument();
      });
    });

    it('should not render arrow when showArrow is false', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" showArrow={false} delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
      });
      expect(screen.queryByTestId('tooltip-arrow')).not.toBeInTheDocument();
    });
  });

  describe('Positioning', () => {
    it('should position tooltip on top by default', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        const content = screen.getByTestId('tooltip-content');
        expect(content).toHaveAttribute('data-side', 'top');
      });
    });

    it('should position tooltip on bottom', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" side="bottom" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        const content = screen.getByTestId('tooltip-content');
        expect(content).toHaveAttribute('data-side', 'bottom');
      });
    });

    it('should position tooltip on left', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" side="left" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        const content = screen.getByTestId('tooltip-content');
        expect(content).toHaveAttribute('data-side', 'left');
      });
    });

    it('should position tooltip on right', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" side="right" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        const content = screen.getByTestId('tooltip-content');
        expect(content).toHaveAttribute('data-side', 'right');
      });
    });
  });

  describe('Alignment', () => {
    it('should align center by default', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        const content = screen.getByTestId('tooltip-content');
        expect(content).toHaveAttribute('data-align', 'center');
      });
    });

    it('should align start', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" align="start" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        const content = screen.getByTestId('tooltip-content');
        expect(content).toHaveAttribute('data-align', 'start');
      });
    });

    it('should align end', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" align="end" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        const content = screen.getByTestId('tooltip-content');
        expect(content).toHaveAttribute('data-align', 'end');
      });
    });
  });

  describe('Delay Duration', () => {
    it('should show tooltip after delay', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayDuration={100}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      // Should not be visible immediately
      expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();

      // Should be visible after delay
      await waitFor(() => {
        expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
      }, { timeout: 200 });
    });

    it('should show tooltip immediately with 0 delay', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
      });
    });
  });

  describe('Interactions', () => {
    it('should show tooltip on hover', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
      });
    });

    it('should hide tooltip on unhover', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
      });

      await user.unhover(screen.getByText('Hover me'));
      await waitFor(() => {
        expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
      });
    });

    it('should show tooltip on focus', async () => {
      render(
        <Tooltip content="Tooltip text" delayDuration={0}>
          <button>Focus me</button>
        </Tooltip>
      );

      const button = screen.getByText('Focus me');
      button.focus();

      await waitFor(() => {
        expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
      });
    });

    it('should hide tooltip on blur', async () => {
      render(
        <div>
          <Tooltip content="Tooltip text" delayDuration={0}>
            <button>Focus me</button>
          </Tooltip>
          <button>Other button</button>
        </div>
      );

      const button = screen.getByText('Focus me');
      button.focus();

      await waitFor(() => {
        expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
      });

      button.blur();
      await waitFor(() => {
        expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Controlled State', () => {
    it('should work as controlled component', () => {
      render(
        <Tooltip content="Tooltip text" open={true} delayDuration={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    });

    it('should call onOpenChange when state changes', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Tooltip content="Tooltip text" onOpenChange={onOpenChange} delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('Composable Components', () => {
    it('should work with composable components', async () => {
      const user = userEvent.setup();

      render(
        <TooltipProvider>
          <TooltipRoot delayDuration={0}>
            <TooltipTrigger asChild>
              <button>Trigger</button>
            </TooltipTrigger>
            <TooltipContent>Custom Content</TooltipContent>
          </TooltipRoot>
        </TooltipProvider>
      );

      await user.hover(screen.getByText('Trigger'));
      await waitFor(() => {
        expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
      });
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Hover me');
      expect(trigger).toHaveAttribute('data-state', 'closed');

      await user.hover(trigger);
      await waitFor(() => {
        expect(trigger).toHaveAttribute('data-state', 'open');
      });
    });

    it('should be keyboard accessible', async () => {
      render(
        <Tooltip content="Tooltip text" delayDuration={0}>
          <button>Focus me</button>
        </Tooltip>
      );

      const button = screen.getByText('Focus me');
      button.focus();

      await waitFor(() => {
        expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
      });
    });

    it('should have role="tooltip"', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        const content = screen.getByTestId('tooltip-content');
        expect(content).toHaveAttribute('role', 'tooltip');
      });
    });
  });
});
