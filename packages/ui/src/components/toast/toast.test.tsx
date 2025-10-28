import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, ToastProvider, ToastViewport } from './toast';

const ToastWrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    {children}
    <ToastViewport />
  </ToastProvider>
);

describe('Toast', () => {
  describe('Rendering', () => {
    it('should render toast with title', () => {
      render(
        <ToastWrapper>
          <Toast title="Test toast" open />
        </ToastWrapper>
      );

      expect(screen.getByTestId('toast')).toBeInTheDocument();
      expect(screen.getByTestId('toast-title')).toHaveTextContent('Test toast');
    });

    it('should render toast with description', () => {
      render(
        <ToastWrapper>
          <Toast title="Test toast" description="This is a description" open />
        </ToastWrapper>
      );

      expect(screen.getByTestId('toast-description')).toHaveTextContent('This is a description');
    });

    it('should render toast without description', () => {
      render(
        <ToastWrapper>
          <Toast title="Test toast" open />
        </ToastWrapper>
      );

      expect(screen.queryByTestId('toast-description')).not.toBeInTheDocument();
    });

    it('should render with action button', () => {
      const onAction = vi.fn();
      render(
        <ToastWrapper>
          <Toast title="Test toast" actionLabel="Undo" onAction={onAction} open />
        </ToastWrapper>
      );

      expect(screen.getByTestId('toast-action')).toHaveTextContent('Undo');
    });

    it('should render without action button when not provided', () => {
      render(
        <ToastWrapper>
          <Toast title="Test toast" open />
        </ToastWrapper>
      );

      expect(screen.queryByTestId('toast-action')).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render success variant', () => {
      render(
        <ToastWrapper>
          <Toast title="Success" variant="success" open />
        </ToastWrapper>
      );

      const toast = screen.getByTestId('toast');
      expect(toast).toHaveClass('border-green-200', 'bg-green-50');
    });

    it('should render error variant', () => {
      render(
        <ToastWrapper>
          <Toast title="Error" variant="error" open />
        </ToastWrapper>
      );

      const toast = screen.getByTestId('toast');
      expect(toast).toHaveClass('border-red-200', 'bg-red-50');
    });

    it('should render warning variant', () => {
      render(
        <ToastWrapper>
          <Toast title="Warning" variant="warning" open />
        </ToastWrapper>
      );

      const toast = screen.getByTestId('toast');
      expect(toast).toHaveClass('border-yellow-200', 'bg-yellow-50');
    });

    it('should render info variant', () => {
      render(
        <ToastWrapper>
          <Toast title="Info" variant="info" open />
        </ToastWrapper>
      );

      const toast = screen.getByTestId('toast');
      expect(toast).toHaveClass('border-blue-200', 'bg-blue-50');
    });

    it('should render default info variant when not specified', () => {
      render(
        <ToastWrapper>
          <Toast title="Default" open />
        </ToastWrapper>
      );

      const toast = screen.getByTestId('toast');
      expect(toast).toHaveClass('border-blue-200', 'bg-blue-50');
    });
  });

  describe('Icons', () => {
    it('should render success icon', () => {
      render(
        <ToastWrapper>
          <Toast title="Success" variant="success" open />
        </ToastWrapper>
      );

      const icon = screen.getByTestId('toast-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('text-green-600');
    });

    it('should render error icon', () => {
      render(
        <ToastWrapper>
          <Toast title="Error" variant="error" open />
        </ToastWrapper>
      );

      const icon = screen.getByTestId('toast-icon');
      expect(icon).toHaveClass('text-red-600');
    });

    it('should render warning icon', () => {
      render(
        <ToastWrapper>
          <Toast title="Warning" variant="warning" open />
        </ToastWrapper>
      );

      const icon = screen.getByTestId('toast-icon');
      expect(icon).toHaveClass('text-yellow-600');
    });

    it('should render info icon', () => {
      render(
        <ToastWrapper>
          <Toast title="Info" variant="info" open />
        </ToastWrapper>
      );

      const icon = screen.getByTestId('toast-icon');
      expect(icon).toHaveClass('text-blue-600');
    });
  });

  describe('Interactions', () => {
    it('should call onAction when action button is clicked', async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();

      render(
        <ToastWrapper>
          <Toast title="Test" actionLabel="Undo" onAction={onAction} open />
        </ToastWrapper>
      );

      await user.click(screen.getByTestId('toast-action'));
      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('should call onOpenChange when close button is clicked', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <ToastWrapper>
          <Toast title="Test" open onOpenChange={onOpenChange} />
        </ToastWrapper>
      );

      await user.click(screen.getByTestId('toast-close'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should render close button when dismissible is true', () => {
      render(
        <ToastWrapper>
          <Toast title="Test" dismissible open />
        </ToastWrapper>
      );

      expect(screen.getByTestId('toast-close')).toBeInTheDocument();
    });

    it('should not render close button when dismissible is false', () => {
      render(
        <ToastWrapper>
          <Toast title="Test" dismissible={false} open />
        </ToastWrapper>
      );

      expect(screen.queryByTestId('toast-close')).not.toBeInTheDocument();
    });
  });

  describe('Auto-dismiss', () => {
    it('should auto-dismiss after duration', async () => {
      const onOpenChange = vi.fn();

      render(
        <ToastWrapper>
          <Toast title="Test" duration={100} open onOpenChange={onOpenChange} />
        </ToastWrapper>
      );

      await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false), { timeout: 200 });
    });

    it('should respect custom duration', async () => {
      const onOpenChange = vi.fn();

      render(
        <ToastWrapper>
          <Toast title="Test" duration={50} open onOpenChange={onOpenChange} />
        </ToastWrapper>
      );

      await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false), { timeout: 100 });
    });
  });

  describe('Viewport', () => {
    it('should render viewport with top-right position', () => {
      render(
        <ToastProvider>
          <ToastViewport position="top-right" />
        </ToastProvider>
      );

      const viewport = screen.getByTestId('toast-viewport');
      expect(viewport).toHaveClass('top-0', 'right-0');
    });

    it('should render viewport with top-left position', () => {
      render(
        <ToastProvider>
          <ToastViewport position="top-left" />
        </ToastProvider>
      );

      const viewport = screen.getByTestId('toast-viewport');
      expect(viewport).toHaveClass('top-0', 'left-0');
    });

    it('should render viewport with bottom-right position', () => {
      render(
        <ToastProvider>
          <ToastViewport position="bottom-right" />
        </ToastProvider>
      );

      const viewport = screen.getByTestId('toast-viewport');
      expect(viewport).toHaveClass('bottom-0', 'right-0');
    });

    it('should render viewport with bottom-left position', () => {
      render(
        <ToastProvider>
          <ToastViewport position="bottom-left" />
        </ToastProvider>
      );

      const viewport = screen.getByTestId('toast-viewport');
      expect(viewport).toHaveClass('bottom-0', 'left-0');
    });

    it('should render viewport with top-center position', () => {
      render(
        <ToastProvider>
          <ToastViewport position="top-center" />
        </ToastProvider>
      );

      const viewport = screen.getByTestId('toast-viewport');
      expect(viewport).toHaveClass('top-0', 'left-1/2');
    });

    it('should render viewport with bottom-center position', () => {
      render(
        <ToastProvider>
          <ToastViewport position="bottom-center" />
        </ToastProvider>
      );

      const viewport = screen.getByTestId('toast-viewport');
      expect(viewport).toHaveClass('bottom-0', 'left-1/2');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <ToastWrapper>
          <Toast title="Test" open />
        </ToastWrapper>
      );

      const toast = screen.getByTestId('toast');
      expect(toast).toHaveAttribute('data-state', 'open');
    });

    it('should provide alt text for action button', () => {
      const onAction = vi.fn();
      render(
        <ToastWrapper>
          <Toast title="Test" actionLabel="Undo" onAction={onAction} open />
        </ToastWrapper>
      );

      const action = screen.getByTestId('toast-action');
      expect(action).toHaveAttribute('data-radix-collection-item');
    });
  });
});
