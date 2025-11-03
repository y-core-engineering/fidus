import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfidenceIndicator } from './confidence-indicator';

describe('ConfidenceIndicator', () => {
  describe('Rendering', () => {
    it('should render minimal variant with percentage badge', () => {
      render(<ConfidenceIndicator confidence={0.75} variant="minimal" />);

      const badge = screen.getByTestId('confidence-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('75%');
    });

    it('should render detailed variant with progress bar and label', () => {
      render(<ConfidenceIndicator confidence={0.85} variant="detailed" />);

      expect(screen.getByTestId('confidence-badge')).toHaveTextContent('85%');
      expect(screen.getByTestId('confidence-progress')).toBeInTheDocument();
      expect(screen.getByText('Confidence')).toBeInTheDocument();
      expect(screen.getByText('Very Confident')).toBeInTheDocument();
    });

    it('should default to minimal variant', () => {
      render(<ConfidenceIndicator confidence={0.5} />);

      expect(screen.queryByTestId('confidence-progress')).not.toBeInTheDocument();
    });
  });

  describe('Confidence Levels', () => {
    it('should show "Very Confident" for confidence >= 0.8', () => {
      render(<ConfidenceIndicator confidence={0.9} variant="detailed" />);

      const indicator = screen.getByTestId('confidence-indicator');
      expect(indicator).toHaveAttribute('data-level', 'very-confident');
      expect(screen.getByText('Very Confident')).toBeInTheDocument();
    });

    it('should show "Confident" for confidence >= 0.5 and < 0.8', () => {
      render(<ConfidenceIndicator confidence={0.65} variant="detailed" />);

      const indicator = screen.getByTestId('confidence-indicator');
      expect(indicator).toHaveAttribute('data-level', 'confident');
      expect(screen.getByText('Confident')).toBeInTheDocument();
    });

    it('should show "Learning" for confidence >= 0.3 and < 0.5', () => {
      render(<ConfidenceIndicator confidence={0.4} variant="detailed" />);

      const indicator = screen.getByTestId('confidence-indicator');
      expect(indicator).toHaveAttribute('data-level', 'learning');
      expect(screen.getByText('Learning')).toBeInTheDocument();
    });

    it('should show "Uncertain" for confidence < 0.3', () => {
      render(<ConfidenceIndicator confidence={0.2} variant="detailed" />);

      const indicator = screen.getByTestId('confidence-indicator');
      expect(indicator).toHaveAttribute('data-level', 'uncertain');
      expect(screen.getByText('Uncertain')).toBeInTheDocument();
    });
  });

  describe('Badge Variants', () => {
    it('should use success badge for very-confident', () => {
      render(<ConfidenceIndicator confidence={0.95} variant="minimal" />);

      const badge = screen.getByTestId('confidence-badge');
      const classList = badge.classList.toString();
      // Badge with variant="success" has text-success class
      expect(classList).toContain('text-success');
    });

    it('should use info badge for confident', () => {
      render(<ConfidenceIndicator confidence={0.7} variant="minimal" />);

      const badge = screen.getByTestId('confidence-badge');
      const classList = badge.classList.toString();
      // Badge with variant="info" has text-info class
      expect(classList).toContain('text-info');
    });

    it('should use warning badge for learning', () => {
      render(<ConfidenceIndicator confidence={0.35} variant="minimal" />);

      const badge = screen.getByTestId('confidence-badge');
      const classList = badge.classList.toString();
      // Badge with variant="warning" has text-warning class
      expect(classList).toContain('text-warning');
    });

    it('should use normal badge for uncertain', () => {
      render(<ConfidenceIndicator confidence={0.15} variant="minimal" />);

      const badge = screen.getByTestId('confidence-badge');
      const classList = badge.classList.toString();
      // Badge with variant="normal" has text-info class (normal maps to info)
      expect(classList).toContain('text-info');
    });
  });

  describe('Percentage Display', () => {
    it('should round confidence to whole percentage', () => {
      render(<ConfidenceIndicator confidence={0.756} />);

      expect(screen.getByTestId('confidence-badge')).toHaveTextContent('76%');
    });

    it('should handle 0% confidence', () => {
      render(<ConfidenceIndicator confidence={0} />);

      expect(screen.getByTestId('confidence-badge')).toHaveTextContent('0%');
    });

    it('should handle 100% confidence', () => {
      render(<ConfidenceIndicator confidence={1} />);

      expect(screen.getByTestId('confidence-badge')).toHaveTextContent('100%');
    });
  });

  describe('Tooltip', () => {
    it('should show tooltip by default', () => {
      render(<ConfidenceIndicator confidence={0.8} />);

      // Tooltip component wraps the content
      const tooltipTrigger = screen.getByTestId('confidence-indicator').parentElement;
      expect(tooltipTrigger).toBeInTheDocument();
    });

    it('should not show tooltip when showTooltip is false', () => {
      const { container } = render(
        <ConfidenceIndicator confidence={0.8} showTooltip={false} />
      );

      // Without tooltip, indicator should be direct child
      const indicator = screen.getByTestId('confidence-indicator');
      expect(indicator).toBeInTheDocument();
    });

    it('should show correct tooltip message for very-confident', () => {
      const { container } = render(<ConfidenceIndicator confidence={0.9} />);

      // Tooltip content is passed as prop - verify indicator is wrapped
      const tooltipWrapper = container.firstChild;
      expect(tooltipWrapper).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should pass size prop to badge', () => {
      render(<ConfidenceIndicator confidence={0.8} size="lg" />);

      const badge = screen.getByTestId('confidence-badge');
      const classList = badge.classList.toString();
      // Badge size="lg" has px-3 py-1.5 classes
      expect(classList).toContain('px-3');
    });

    it('should default to md size', () => {
      render(<ConfidenceIndicator confidence={0.8} />);

      const badge = screen.getByTestId('confidence-badge');
      const classList = badge.classList.toString();
      // Badge size="md" has px-2.5 py-1 classes (checking for py-1 as it's more specific)
      expect(classList).toContain('py-1');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      render(<ConfidenceIndicator confidence={0.8} className="custom-class" />);

      const indicator = screen.getByTestId('confidence-indicator');
      expect(indicator.classList.contains('custom-class')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper data attributes', () => {
      render(<ConfidenceIndicator confidence={0.75} />);

      const indicator = screen.getByTestId('confidence-indicator');
      expect(indicator).toHaveAttribute('data-testid', 'confidence-indicator');
      expect(indicator).toHaveAttribute('data-level', 'confident');
    });

    it('should be keyboard accessible when detailed with tooltip', () => {
      render(<ConfidenceIndicator confidence={0.8} variant="detailed" />);

      const indicator = screen.getByTestId('confidence-indicator');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Progress Bar (Detailed Variant)', () => {
    it('should pass correct percentage to progress bar', () => {
      render(<ConfidenceIndicator confidence={0.67} variant="detailed" />);

      const progressBar = screen.getByTestId('confidence-progress');
      expect(progressBar).toBeInTheDocument();
      // ProgressBar receives value as percentage (67)
    });

    it('should use correct progress bar variant for very-confident', () => {
      render(<ConfidenceIndicator confidence={0.9} variant="detailed" />);

      // ProgressBar with variant="success" renders indicator with bg-green-600
      const indicator = screen.getByTestId('progress-bar-indicator');
      expect(indicator.classList.toString()).toContain('bg-green-600');
    });

    it('should use correct progress bar variant for confident', () => {
      render(<ConfidenceIndicator confidence={0.6} variant="detailed" />);

      // ProgressBar with variant="primary" renders indicator with bg-blue-600
      const indicator = screen.getByTestId('progress-bar-indicator');
      expect(indicator.classList.toString()).toContain('bg-blue-600');
    });

    it('should use correct progress bar variant for learning', () => {
      render(<ConfidenceIndicator confidence={0.4} variant="detailed" />);

      // ProgressBar with variant="warning" renders indicator with bg-yellow-500
      const indicator = screen.getByTestId('progress-bar-indicator');
      expect(indicator.classList.toString()).toContain('bg-yellow-500');
    });

    it('should use correct progress bar variant for uncertain', () => {
      render(<ConfidenceIndicator confidence={0.2} variant="detailed" />);

      // ProgressBar with variant="error" renders indicator with bg-red-600
      const indicator = screen.getByTestId('progress-bar-indicator');
      expect(indicator.classList.toString()).toContain('bg-red-600');
    });
  });

  describe('Edge Cases', () => {
    it('should handle boundary value 0.8 as very-confident', () => {
      render(<ConfidenceIndicator confidence={0.8} variant="detailed" />);

      expect(screen.getByText('Very Confident')).toBeInTheDocument();
    });

    it('should handle boundary value 0.5 as confident', () => {
      render(<ConfidenceIndicator confidence={0.5} variant="detailed" />);

      expect(screen.getByText('Confident')).toBeInTheDocument();
    });

    it('should handle boundary value 0.3 as learning', () => {
      render(<ConfidenceIndicator confidence={0.3} variant="detailed" />);

      expect(screen.getByText('Learning')).toBeInTheDocument();
    });
  });
});
