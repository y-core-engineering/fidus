import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Banner } from './banner';

describe('Banner', () => {
  describe('Rendering', () => {
    it('should render banner with message', () => {
      render(<Banner message="Test banner message" />);

      expect(screen.getByTestId('banner')).toBeInTheDocument();
      expect(screen.getByTestId('banner-message')).toHaveTextContent('Test banner message');
    });

    it('should render banner with action button', () => {
      const onAction = vi.fn();
      render(<Banner message="Test message" actionLabel="Learn More" onAction={onAction} />);

      expect(screen.getByTestId('banner-action')).toHaveTextContent('Learn More');
    });

    it('should render banner without action button', () => {
      render(<Banner message="Test message" />);

      expect(screen.queryByTestId('banner-action')).not.toBeInTheDocument();
    });

    it('should render dismiss button when dismissible is true', () => {
      render(<Banner message="Test message" dismissible />);

      expect(screen.getByTestId('banner-dismiss')).toBeInTheDocument();
    });

    it('should not render dismiss button when dismissible is false', () => {
      render(<Banner message="Test message" dismissible={false} />);

      expect(screen.queryByTestId('banner-dismiss')).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render info variant', () => {
      render(<Banner variant="info" message="Info message" />);

      const banner = screen.getByTestId('banner');
      expect(banner).toHaveClass('bg-blue-600', 'text-white');
    });

    it('should render warning variant', () => {
      render(<Banner variant="warning" message="Warning message" />);

      const banner = screen.getByTestId('banner');
      expect(banner).toHaveClass('bg-yellow-500', 'text-gray-900');
    });

    it('should render error variant', () => {
      render(<Banner variant="error" message="Error message" />);

      const banner = screen.getByTestId('banner');
      expect(banner).toHaveClass('bg-red-600', 'text-white');
    });

    it('should default to info variant', () => {
      render(<Banner message="Default message" />);

      const banner = screen.getByTestId('banner');
      expect(banner).toHaveClass('bg-blue-600', 'text-white');
    });
  });

  describe('Icons', () => {
    it('should render info icon', () => {
      render(<Banner variant="info" message="Info" />);

      const icon = screen.getByTestId('banner-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('text-white');
    });

    it('should render warning icon', () => {
      render(<Banner variant="warning" message="Warning" />);

      const icon = screen.getByTestId('banner-icon');
      expect(icon).toHaveClass('text-gray-900');
    });

    it('should render error icon', () => {
      render(<Banner variant="error" message="Error" />);

      const icon = screen.getByTestId('banner-icon');
      expect(icon).toHaveClass('text-white');
    });
  });

  describe('Sticky Positioning', () => {
    it('should apply sticky positioning when sticky is true', () => {
      render(<Banner message="Test message" sticky />);

      const banner = screen.getByTestId('banner');
      expect(banner).toHaveClass('sticky', 'top-0', 'z-50');
    });

    it('should not apply sticky positioning when sticky is false', () => {
      render(<Banner message="Test message" sticky={false} />);

      const banner = screen.getByTestId('banner');
      expect(banner).not.toHaveClass('sticky');
    });

    it('should default to non-sticky', () => {
      render(<Banner message="Test message" />);

      const banner = screen.getByTestId('banner');
      expect(banner).not.toHaveClass('sticky');
    });
  });

  describe('Interactions', () => {
    it('should call onAction when action button is clicked', async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();

      render(<Banner message="Test message" actionLabel="Action" onAction={onAction} />);

      await user.click(screen.getByTestId('banner-action'));
      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('should call onDismiss when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();

      render(<Banner message="Test message" dismissible onDismiss={onDismiss} />);

      await user.click(screen.getByTestId('banner-dismiss'));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should hide banner when dismiss button is clicked', async () => {
      const user = userEvent.setup();

      render(<Banner message="Test message" dismissible />);

      const banner = screen.getByTestId('banner');
      expect(banner).toBeInTheDocument();

      await user.click(screen.getByTestId('banner-dismiss'));
      expect(screen.queryByTestId('banner')).not.toBeInTheDocument();
    });
  });

  describe('Action Button Styling', () => {
    it('should style action button for info variant', () => {
      const onAction = vi.fn();
      render(<Banner variant="info" message="Test" actionLabel="Action" onAction={onAction} />);

      const action = screen.getByTestId('banner-action');
      expect(action).toHaveClass('bg-white/20', 'text-white');
    });

    it('should style action button for warning variant', () => {
      const onAction = vi.fn();
      render(<Banner variant="warning" message="Test" actionLabel="Action" onAction={onAction} />);

      const action = screen.getByTestId('banner-action');
      expect(action).toHaveClass('bg-gray-900/20', 'text-gray-900');
    });

    it('should style action button for error variant', () => {
      const onAction = vi.fn();
      render(<Banner variant="error" message="Test" actionLabel="Action" onAction={onAction} />);

      const action = screen.getByTestId('banner-action');
      expect(action).toHaveClass('bg-white/20', 'text-white');
    });
  });

  describe('Accessibility', () => {
    it('should have role="banner"', () => {
      render(<Banner message="Test message" />);

      expect(screen.getByTestId('banner')).toHaveAttribute('role', 'banner');
    });

    it('should have aria-label on dismiss button', () => {
      render(<Banner message="Test message" dismissible />);

      const dismissButton = screen.getByTestId('banner-dismiss');
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss banner');
    });

    it('should be keyboard accessible for dismissal', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();

      render(<Banner message="Test message" dismissible onDismiss={onDismiss} />);

      const dismissButton = screen.getByTestId('banner-dismiss');
      dismissButton.focus();
      await user.keyboard('{Enter}');

      expect(onDismiss).toHaveBeenCalled();
    });

    it('should be keyboard accessible for actions', async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();

      render(<Banner message="Test message" actionLabel="Action" onAction={onAction} />);

      const action = screen.getByTestId('banner-action');
      action.focus();
      await user.keyboard('{Enter}');

      expect(onAction).toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('should accept custom className', () => {
      render(<Banner message="Test message" className="custom-class" />);

      expect(screen.getByTestId('banner')).toHaveClass('custom-class');
    });

    it('should merge custom className with variant classes', () => {
      render(<Banner variant="warning" message="Test" className="custom-class" />);

      const banner = screen.getByTestId('banner');
      expect(banner).toHaveClass('custom-class', 'bg-yellow-500');
    });
  });

  describe('Full Width', () => {
    it('should have full width by default', () => {
      render(<Banner message="Test message" />);

      const banner = screen.getByTestId('banner');
      expect(banner).toHaveClass('w-full');
    });
  });
});
