'use client';

import * as React from 'react';
import { z } from 'zod';
import { cva } from 'class-variance-authority';
import { Badge } from '../badge';
import { ProgressBar } from '../progress-bar';
import { Tooltip } from '../tooltip';
import { cn } from '../../lib/cn';

export const ConfidenceIndicatorPropsSchema = z.object({
  confidence: z.number().min(0).max(1),
  variant: z.enum(['minimal', 'detailed']).default('minimal').optional(),
  showTooltip: z.boolean().default(true).optional(),
  size: z.enum(['sm', 'md', 'lg']).default('md').optional(),
  className: z.string().optional(),
});

export type ConfidenceIndicatorProps = z.infer<typeof ConfidenceIndicatorPropsSchema>;

/**
 * Confidence level based on confidence score
 */
type ConfidenceLevel = 'uncertain' | 'learning' | 'confident' | 'very-confident';

/**
 * Get confidence level from score (0.0 - 1.0)
 */
function getConfidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.8) return 'very-confident';
  if (confidence >= 0.5) return 'confident';
  if (confidence >= 0.3) return 'learning';
  return 'uncertain';
}

/**
 * Get badge variant based on confidence level
 */
function getConfidenceBadgeVariant(
  level: ConfidenceLevel
): 'success' | 'info' | 'warning' | 'normal' {
  switch (level) {
    case 'very-confident':
      return 'success';
    case 'confident':
      return 'info';
    case 'learning':
      return 'warning';
    case 'uncertain':
      return 'normal';
  }
}

/**
 * Get progress bar variant based on confidence level
 */
function getProgressBarVariant(
  level: ConfidenceLevel
): 'success' | 'primary' | 'warning' | 'error' {
  switch (level) {
    case 'very-confident':
      return 'success';
    case 'confident':
      return 'primary';
    case 'learning':
      return 'warning';
    case 'uncertain':
      return 'error';
  }
}

/**
 * Get human-readable confidence level label
 */
function getConfidenceLevelLabel(level: ConfidenceLevel): string {
  switch (level) {
    case 'very-confident':
      return 'Very Confident';
    case 'confident':
      return 'Confident';
    case 'learning':
      return 'Learning';
    case 'uncertain':
      return 'Uncertain';
  }
}

/**
 * Get tooltip message based on confidence level
 */
function getTooltipMessage(level: ConfidenceLevel): string {
  switch (level) {
    case 'very-confident':
      return 'Very Confident - AI will auto-fill this preference';
    case 'confident':
      return 'Confident - AI will auto-suggest this preference';
    case 'learning':
      return 'Learning - AI is still learning this preference';
    case 'uncertain':
      return 'Uncertain - Not enough data to be confident';
  }
}

const confidenceIndicatorVariants = cva(
  'inline-flex items-center justify-center',
  {
    variants: {
      variant: {
        minimal: '',
        detailed: 'flex-col items-stretch gap-2 p-3 bg-background border border-border rounded-md min-w-[200px]',
      },
    },
    defaultVariants: {
      variant: 'minimal',
    },
  }
);

/**
 * ConfidenceIndicator Component
 *
 * Visualizes ML confidence scores with color-coded badges and progress bars.
 *
 * @example
 * ```tsx
 * // Minimal variant (badge only)
 * <ConfidenceIndicator confidence={0.8} variant="minimal" />
 *
 * // Detailed variant (progress bar + badge)
 * <ConfidenceIndicator confidence={0.65} variant="detailed" />
 *
 * // With tooltip
 * <ConfidenceIndicator confidence={0.45} showTooltip={true} />
 * ```
 */
export const ConfidenceIndicator = React.forwardRef<
  HTMLDivElement,
  ConfidenceIndicatorProps
>(({ confidence, variant = 'minimal', showTooltip = true, size = 'md', className }, ref) => {
  const level = getConfidenceLevel(confidence);
  const badgeVariant = getConfidenceBadgeVariant(level);
  const progressBarVariant = getProgressBarVariant(level);
  const percentage = Math.round(confidence * 100);
  const label = getConfidenceLevelLabel(level);
  const tooltipMessage = getTooltipMessage(level);

  const badgeContent = (
    <Badge
      variant={badgeVariant}
      size={size}
      data-testid="confidence-badge"
    >
      {percentage}%
    </Badge>
  );

  const content = (
    <div
      ref={ref}
      className={cn(confidenceIndicatorVariants({ variant }), className)}
      data-testid="confidence-indicator"
      data-level={level}
    >
      {variant === 'detailed' && (
        <>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Confidence
            </span>
            {badgeContent}
          </div>
          <div className="w-full">
            <ProgressBar
              value={percentage}
              variant={progressBarVariant}
              size={size}
              data-testid="confidence-progress"
            />
          </div>
          <div className="text-xs font-medium text-muted-foreground text-center mt-1">
            {label}
          </div>
        </>
      )}

      {variant === 'minimal' && badgeContent}
    </div>
  );

  if (showTooltip) {
    return (
      <Tooltip content={tooltipMessage} side="top">
        {content}
      </Tooltip>
    );
  }

  return content;
});

ConfidenceIndicator.displayName = 'ConfidenceIndicator';
