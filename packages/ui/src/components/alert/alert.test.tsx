import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from './alert';

describe('Alert', () => {
  describe('Rendering', () => {
    it('should render alert with description', () => {
      render(<Alert description="Test alert description" />);

      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByTestId('alert-description')).toHaveTextContent('Test alert description');
    });

    it('should render alert with title', () => {
      render(<Alert title="Alert Title" description="Test alert" />);

      expect(screen.getByTestId('alert-title')).toHaveTextContent('Alert Title');
    });

    it('should render alert without title', () => {
      render(<Alert description="Test alert" />);

      expect(screen.queryByTestId('alert-title')).not.toBeInTheDocument();
    });

    it('should render alert with single action', () => {
      const onClick = vi.fn();
      render(<Alert description="Test alert" actions={[{ label: 'Action', onClick }]} />);

      expect(screen.getByTestId('alert-actions')).toBeInTheDocument();
      expect(screen.getByTestId('alert-action-0')).toHaveTextContent('Action');
    });

    it('should render alert with multiple actions', () => {
      const onClick1 = vi.fn();
      const onClick2 = vi.fn();
      render(
        <Alert
          description="Test alert"
          actions={[
            { label: 'Action 1', onClick: onClick1 },
            { label: 'Action 2', onClick: onClick2 },
          ]}
        />
      );

      expect(screen.getByTestId('alert-action-0')).toHaveTextContent('Action 1');
      expect(screen.getByTestId('alert-action-1')).toHaveTextContent('Action 2');
    });

    it('should render alert without actions', () => {
      render(<Alert description="Test alert" />);

      expect(screen.queryByTestId('alert-actions')).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render success variant', () => {
      render(<Alert variant="success" description="Success message" />);

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('border-green-200', 'bg-green-50');
    });

    it('should render error variant', () => {
      render(<Alert variant="error" description="Error message" />);

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('border-red-200', 'bg-red-50');
    });

    it('should render warning variant', () => {
      render(<Alert variant="warning" description="Warning message" />);

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('border-yellow-200', 'bg-yellow-50');
    });

    it('should render info variant', () => {
      render(<Alert variant="info" description="Info message" />);

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('border-blue-200', 'bg-blue-50');
    });

    it('should default to info variant', () => {
      render(<Alert description="Default message" />);

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('border-blue-200', 'bg-blue-50');
    });
  });

  describe('Icons', () => {
    it('should render success icon', () => {
      render(<Alert variant="success" description="Success" />);

      const icon = screen.getByTestId('alert-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('text-green-600');
    });

    it('should render error icon', () => {
      render(<Alert variant="error" description="Error" />);

      const icon = screen.getByTestId('alert-icon');
      expect(icon).toHaveClass('text-red-600');
    });

    it('should render warning icon', () => {
      render(<Alert variant="warning" description="Warning" />);

      const icon = screen.getByTestId('alert-icon');
      expect(icon).toHaveClass('text-yellow-600');
    });

    it('should render info icon', () => {
      render(<Alert variant="info" description="Info" />);

      const icon = screen.getByTestId('alert-icon');
      expect(icon).toHaveClass('text-blue-600');
    });
  });

  describe('Dismissible', () => {
    it('should render dismiss button when dismissible is true', () => {
      render(<Alert description="Test alert" dismissible />);

      expect(screen.getByTestId('alert-dismiss')).toBeInTheDocument();
    });

    it('should not render dismiss button when dismissible is false', () => {
      render(<Alert description="Test alert" dismissible={false} />);

      expect(screen.queryByTestId('alert-dismiss')).not.toBeInTheDocument();
    });

    it('should call onDismiss when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();

      render(<Alert description="Test alert" dismissible onDismiss={onDismiss} />);

      await user.click(screen.getByTestId('alert-dismiss'));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should hide alert when dismiss button is clicked', async () => {
      const user = userEvent.setup();

      render(<Alert description="Test alert" dismissible />);

      const alert = screen.getByTestId('alert');
      expect(alert).toBeInTheDocument();

      await user.click(screen.getByTestId('alert-dismiss'));
      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });

    it('should have aria-label on dismiss button', () => {
      render(<Alert description="Test alert" dismissible />);

      const dismissButton = screen.getByTestId('alert-dismiss');
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss alert');
    });
  });

  describe('Actions', () => {
    it('should call action onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<Alert description="Test alert" actions={[{ label: 'Action', onClick }]} />);

      await user.click(screen.getByTestId('alert-action-0'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call correct action when multiple actions exist', async () => {
      const user = userEvent.setup();
      const onClick1 = vi.fn();
      const onClick2 = vi.fn();

      render(
        <Alert
          description="Test alert"
          actions={[
            { label: 'Action 1', onClick: onClick1 },
            { label: 'Action 2', onClick: onClick2 },
          ]}
        />
      );

      await user.click(screen.getByTestId('alert-action-1'));
      expect(onClick1).not.toHaveBeenCalled();
      expect(onClick2).toHaveBeenCalledTimes(1);
    });

    it('should style action buttons based on variant', () => {
      const onClick = vi.fn();
      render(<Alert variant="success" description="Test" actions={[{ label: 'Action', onClick }]} />);

      const action = screen.getByTestId('alert-action-0');
      expect(action).toHaveClass('text-green-700');
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert"', () => {
      render(<Alert description="Test alert" />);

      expect(screen.getByTestId('alert')).toHaveAttribute('role', 'alert');
    });

    it('should be keyboard accessible for dismissal', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();

      render(<Alert description="Test alert" dismissible onDismiss={onDismiss} />);

      const dismissButton = screen.getByTestId('alert-dismiss');
      dismissButton.focus();
      await user.keyboard('{Enter}');

      expect(onDismiss).toHaveBeenCalled();
    });

    it('should be keyboard accessible for actions', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<Alert description="Test alert" actions={[{ label: 'Action', onClick }]} />);

      const action = screen.getByTestId('alert-action-0');
      action.focus();
      await user.keyboard('{Enter}');

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('should accept custom className', () => {
      render(<Alert description="Test alert" className="custom-class" />);

      expect(screen.getByTestId('alert')).toHaveClass('custom-class');
    });

    it('should merge custom className with variant classes', () => {
      render(<Alert variant="success" description="Test" className="custom-class" />);

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('custom-class', 'border-green-200');
    });
  });
});
