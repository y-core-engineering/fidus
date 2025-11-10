import * as React from 'react';
import { z } from 'zod';
import { Button } from '../button';
import { Stack } from '../stack';
import { cn } from '../../lib/cn';
import { AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

export const ErrorStatePropsSchema = z.object({
  title: z.string(),
  message: z.string(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
  errorCode: z.string().optional(),
  errorId: z.string().optional(),
  timestamp: z.string().optional(),
  technicalDetails: z.string().optional(),
  onRetry: z.function().args().returns(z.void()).optional(),
  onSecondaryAction: z.function().args().returns(z.void()).optional(),
  secondaryActionLabel: z.string().optional(),
  className: z.string().optional(),
});

export type ErrorStateProps = z.infer<typeof ErrorStatePropsSchema>;

/**
 * ErrorState Component
 *
 * Displays error messages following Fidus error UX guidelines:
 * - Privacy-safe messages
 * - Progressive disclosure (expandable technical details)
 * - Clear next steps
 * - Accessible and reassuring
 *
 * @example
 * ```tsx
 * // Network Error
 * <ErrorState
 *   title="Couldn't load your opportunities"
 *   message="We're having trouble connecting to the service."
 *   severity="medium"
 *   errorCode="CAL_SYNC_401"
 *   onRetry={() => refetch()}
 *   secondaryActionLabel="Work Offline"
 *   onSecondaryAction={() => setOfflineMode(true)}
 * />
 *
 * // Server Error with Error ID
 * <ErrorState
 *   title="Service Temporarily Unavailable"
 *   message="We're experiencing technical difficulties. Our team has been notified."
 *   severity="high"
 *   errorId="ERR_20250128_143215"
 *   onRetry={() => refetch()}
 *   secondaryActionLabel="Check Status Page"
 *   onSecondaryAction={() => window.open('https://status.fidus.ai')}
 * />
 * ```
 */
export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      title,
      message,
      severity = 'medium',
      errorCode,
      errorId,
      timestamp,
      technicalDetails,
      onRetry,
      onSecondaryAction,
      secondaryActionLabel,
      className,
    },
    ref
  ) => {
    // SSR-safe: Track client-side hydration
    const [isClient, setIsClient] = React.useState(false);
    const [showTechnicalDetails, setShowTechnicalDetails] = React.useState(false);

    React.useEffect(() => {
      setIsClient(true);
    }, []);

    const hasTechnicalInfo = errorCode || errorId || timestamp || technicalDetails;

    const severityIcons = {
      low: <AlertCircle className="text-warning" size={24} />,
      medium: <AlertCircle className="text-warning" size={24} />,
      high: <AlertCircle className="text-error" size={24} />,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'border border-border rounded-lg p-lg bg-background',
          className
        )}
        role="alert"
        aria-live="polite"
        data-testid="error-state"
      >
        <Stack direction="vertical" spacing="md">
          {/* Icon and Title */}
          <Stack direction="horizontal" spacing="sm" align="center">
            {severityIcons[severity]}
            <h3 className="font-semibold text-foreground">{title}</h3>
          </Stack>

          {/* Message */}
          <p className="text-muted-foreground">{message}</p>

          {/* Error ID (if provided) */}
          {errorId && (
            <div className="text-sm text-muted-foreground">
              <span className="font-mono">
                Error ID: {errorId}
              </span>
              <br />
              <span className="text-xs">
                (Reference this when contacting support)
              </span>
            </div>
          )}

          {/* Action Buttons */}
          {/* SSR-safe: Only show interactive buttons after client hydration */}
          {isClient && (onRetry || onSecondaryAction) && (
            <Stack direction="horizontal" spacing="sm">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  variant="primary"
                  size="md"
                  data-testid="retry-button"
                  aria-label="Try again"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Try Again
                </Button>
              )}
              {onSecondaryAction && secondaryActionLabel && (
                <Button
                  onClick={onSecondaryAction}
                  variant="secondary"
                  size="md"
                  data-testid="secondary-action-button"
                >
                  {secondaryActionLabel}
                </Button>
              )}
            </Stack>
          )}

          {/* Technical Details (expandable) */}
          {/* SSR-safe: Only show expandable technical details after client hydration */}
          {isClient && hasTechnicalInfo && (
            <div className="border-t border-border pt-md mt-md">
              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="toggle-technical-details"
                aria-expanded={showTechnicalDetails}
                aria-controls="technical-details"
              >
                {showTechnicalDetails ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
                Technical Details
              </button>

              {showTechnicalDetails && (
                <div
                  id="technical-details"
                  className="mt-sm p-md bg-muted rounded-md font-mono text-xs text-foreground"
                  data-testid="technical-details-content"
                >
                  <Stack direction="vertical" spacing="xs">
                    {errorCode && (
                      <div>
                        <span className="text-muted-foreground">Error Code:</span>{' '}
                        {errorCode}
                      </div>
                    )}
                    {timestamp && (
                      <div>
                        <span className="text-muted-foreground">Timestamp:</span>{' '}
                        {timestamp}
                      </div>
                    )}
                    {technicalDetails && (
                      <div className="mt-sm whitespace-pre-wrap">
                        {technicalDetails}
                      </div>
                    )}
                  </Stack>
                </div>
              )}
            </div>
          )}
        </Stack>
      </div>
    );
  }
);

ErrorState.displayName = 'ErrorState';
