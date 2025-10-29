import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar, CircularProgress } from './progress-bar';

describe('ProgressBar', () => {
  describe('Rendering', () => {
    it('should render progress bar', () => {
      render(<ProgressBar value={50} />);

      expect(screen.getByTestId('progress-bar-root')).toBeInTheDocument();
      expect(screen.getByTestId('progress-bar-indicator')).toBeInTheDocument();
    });

    it('should render progress bar with label', () => {
      render(<ProgressBar value={50} showLabel label="Loading" />);

      expect(screen.getByTestId('progress-bar-label')).toHaveTextContent('Loading');
    });

    it('should render progress bar with percentage', () => {
      render(<ProgressBar value={75} showPercentage />);

      expect(screen.getByTestId('progress-bar-percentage')).toHaveTextContent('75%');
    });

    it('should render progress bar without label', () => {
      render(<ProgressBar value={50} />);

      expect(screen.queryByTestId('progress-bar-label')).not.toBeInTheDocument();
    });

    it('should render progress bar without percentage', () => {
      render(<ProgressBar value={50} />);

      expect(screen.queryByTestId('progress-bar-percentage')).not.toBeInTheDocument();
    });

    it('should render both label and percentage', () => {
      render(<ProgressBar value={60} showLabel showPercentage label="Progress" />);

      expect(screen.getByTestId('progress-bar-label')).toHaveTextContent('Progress');
      expect(screen.getByTestId('progress-bar-percentage')).toHaveTextContent('60%');
    });
  });

  describe('Variants', () => {
    it('should render primary variant', () => {
      render(<ProgressBar value={50} variant="primary" />);

      const indicator = screen.getByTestId('progress-bar-indicator');
      expect(indicator).toHaveClass('bg-blue-600');
    });

    it('should render success variant', () => {
      render(<ProgressBar value={50} variant="success" />);

      const indicator = screen.getByTestId('progress-bar-indicator');
      expect(indicator).toHaveClass('bg-green-600');
    });

    it('should render warning variant', () => {
      render(<ProgressBar value={50} variant="warning" />);

      const indicator = screen.getByTestId('progress-bar-indicator');
      expect(indicator).toHaveClass('bg-yellow-500');
    });

    it('should render error variant', () => {
      render(<ProgressBar value={50} variant="error" />);

      const indicator = screen.getByTestId('progress-bar-indicator');
      expect(indicator).toHaveClass('bg-red-600');
    });

    it('should default to primary variant', () => {
      render(<ProgressBar value={50} />);

      const indicator = screen.getByTestId('progress-bar-indicator');
      expect(indicator).toHaveClass('bg-blue-600');
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<ProgressBar value={50} size="sm" />);

      expect(screen.getByTestId('progress-bar-root')).toHaveClass('h-1');
    });

    it('should render medium size', () => {
      render(<ProgressBar value={50} size="md" />);

      expect(screen.getByTestId('progress-bar-root')).toHaveClass('h-2');
    });

    it('should render large size', () => {
      render(<ProgressBar value={50} size="lg" />);

      expect(screen.getByTestId('progress-bar-root')).toHaveClass('h-3');
    });

    it('should default to medium size', () => {
      render(<ProgressBar value={50} />);

      expect(screen.getByTestId('progress-bar-root')).toHaveClass('h-2');
    });
  });

  describe('Values', () => {
    it('should display 0% progress', () => {
      render(<ProgressBar value={0} showPercentage />);

      expect(screen.getByTestId('progress-bar-percentage')).toHaveTextContent('0%');
    });

    it('should display 50% progress', () => {
      render(<ProgressBar value={50} showPercentage />);

      expect(screen.getByTestId('progress-bar-percentage')).toHaveTextContent('50%');
    });

    it('should display 100% progress', () => {
      render(<ProgressBar value={100} showPercentage />);

      expect(screen.getByTestId('progress-bar-percentage')).toHaveTextContent('100%');
    });

    it('should round decimal values', () => {
      render(<ProgressBar value={45.7} showPercentage />);

      expect(screen.getByTestId('progress-bar-percentage')).toHaveTextContent('46%');
    });
  });

  describe('Indeterminate', () => {
    it('should render indeterminate progress bar', () => {
      render(<ProgressBar indeterminate />);

      const indicator = screen.getByTestId('progress-bar-indicator');
      expect(indicator).toHaveClass('animate-progress-indeterminate');
    });

    it('should not show percentage when indeterminate', () => {
      render(<ProgressBar indeterminate showPercentage />);

      expect(screen.queryByTestId('progress-bar-percentage')).not.toBeInTheDocument();
    });

    it('should not be indeterminate by default', () => {
      render(<ProgressBar value={50} />);

      const indicator = screen.getByTestId('progress-bar-indicator');
      expect(indicator).not.toHaveClass('animate-progress-indeterminate');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ProgressBar value={50} />);

      const root = screen.getByTestId('progress-bar-root');
      expect(root).toHaveAttribute('data-value', '50');
      expect(root).toHaveAttribute('data-max', '100');
    });

    it('should have role progressbar', () => {
      render(<ProgressBar value={50} />);

      const root = screen.getByTestId('progress-bar-root');
      expect(root).toHaveAttribute('role', 'progressbar');
    });
  });
});

describe('CircularProgress', () => {
  describe('Rendering', () => {
    it('should render circular progress', () => {
      render(<CircularProgress value={50} />);

      expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
      expect(screen.getByTestId('circular-progress-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('circular-progress-background')).toBeInTheDocument();
    });

    it('should render with percentage', () => {
      render(<CircularProgress value={75} showPercentage />);

      expect(screen.getByTestId('circular-progress-percentage')).toHaveTextContent('75%');
    });

    it('should render without percentage', () => {
      render(<CircularProgress value={50} />);

      expect(screen.queryByTestId('circular-progress-percentage')).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render primary variant', () => {
      render(<CircularProgress value={50} variant="primary" />);

      const indicator = screen.getByTestId('circular-progress-indicator');
      expect(indicator).toHaveClass('stroke-blue-600');
    });

    it('should render success variant', () => {
      render(<CircularProgress value={50} variant="success" />);

      const indicator = screen.getByTestId('circular-progress-indicator');
      expect(indicator).toHaveClass('stroke-green-600');
    });

    it('should render warning variant', () => {
      render(<CircularProgress value={50} variant="warning" />);

      const indicator = screen.getByTestId('circular-progress-indicator');
      expect(indicator).toHaveClass('stroke-yellow-500');
    });

    it('should render error variant', () => {
      render(<CircularProgress value={50} variant="error" />);

      const indicator = screen.getByTestId('circular-progress-indicator');
      expect(indicator).toHaveClass('stroke-red-600');
    });

    it('should default to primary variant', () => {
      render(<CircularProgress value={50} />);

      const indicator = screen.getByTestId('circular-progress-indicator');
      expect(indicator).toHaveClass('stroke-blue-600');
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<CircularProgress value={50} size="sm" />);

      expect(screen.getByTestId('circular-progress')).toHaveClass('h-12', 'w-12');
    });

    it('should render medium size', () => {
      render(<CircularProgress value={50} size="md" />);

      expect(screen.getByTestId('circular-progress')).toHaveClass('h-16', 'w-16');
    });

    it('should render large size', () => {
      render(<CircularProgress value={50} size="lg" />);

      expect(screen.getByTestId('circular-progress')).toHaveClass('h-24', 'w-24');
    });

    it('should default to medium size', () => {
      render(<CircularProgress value={50} />);

      expect(screen.getByTestId('circular-progress')).toHaveClass('h-16', 'w-16');
    });
  });

  describe('Values', () => {
    it('should display 0% progress', () => {
      render(<CircularProgress value={0} showPercentage />);

      expect(screen.getByTestId('circular-progress-percentage')).toHaveTextContent('0%');
    });

    it('should display 50% progress', () => {
      render(<CircularProgress value={50} showPercentage />);

      expect(screen.getByTestId('circular-progress-percentage')).toHaveTextContent('50%');
    });

    it('should display 100% progress', () => {
      render(<CircularProgress value={100} showPercentage />);

      expect(screen.getByTestId('circular-progress-percentage')).toHaveTextContent('100%');
    });

    it('should round decimal values', () => {
      render(<CircularProgress value={67.8} showPercentage />);

      expect(screen.getByTestId('circular-progress-percentage')).toHaveTextContent('68%');
    });
  });

  describe('Indeterminate', () => {
    it('should render indeterminate circular progress', () => {
      render(<CircularProgress indeterminate />);

      const indicator = screen.getByTestId('circular-progress-indicator');
      expect(indicator).toHaveClass('animate-spin');
    });

    it('should not show percentage when indeterminate', () => {
      render(<CircularProgress indeterminate showPercentage />);

      expect(screen.queryByTestId('circular-progress-percentage')).not.toBeInTheDocument();
    });

    it('should not be indeterminate by default', () => {
      render(<CircularProgress value={50} />);

      const indicator = screen.getByTestId('circular-progress-indicator');
      expect(indicator).not.toHaveClass('animate-spin');
    });
  });
});
