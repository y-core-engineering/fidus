'use client';

import * as React from 'react';
import { z } from 'zod';
import { cva } from 'class-variance-authority';
import { Avatar } from '../avatar';
import { Chip } from '../chip';
import { ConfidenceIndicator } from '../confidence-indicator';
import { cn } from '../../lib/cn';

/**
 * Suggestion for AI messages with learned preferences
 */
export const SuggestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  confidence: z.number().min(0).max(1),
  onAccept: z.function().args().returns(z.void()).optional(),
  onReject: z.function().args().returns(z.void()).optional(),
});

export type Suggestion = z.infer<typeof SuggestionSchema>;

/**
 * Message data structure
 */
export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  timestamp: z.date(),
  suggestions: z.array(SuggestionSchema).optional(),
  avatar: z
    .object({
      src: z.string().optional(),
      fallback: z.string(),
    })
    .optional(),
});

export type Message = z.infer<typeof MessageSchema>;

export interface MessageBubbleProps extends Message {
  className?: string;
}

/**
 * Format relative time from a date
 * Examples: "Just now", "2m ago", "5h ago", "2d ago"
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 10) {
    return 'Just now';
  }
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  return `${diffInDays}d ago`;
}

const messageBubbleVariants = cva(
  'flex gap-2 w-full items-start',
  {
    variants: {
      role: {
        user: 'flex-row-reverse',
        assistant: 'flex-row',
      },
    },
    defaultVariants: {
      role: 'assistant',
    },
  }
);

const messageTextVariants = cva(
  'p-3 rounded-lg max-w-[80%]',
  {
    variants: {
      role: {
        user: 'bg-primary text-black',
        assistant: 'bg-muted text-foreground',
      },
    },
    defaultVariants: {
      role: 'assistant',
    },
  }
);

/**
 * MessageBubble Component
 *
 * Displays a single chat message with role-based alignment (user right, AI left),
 * avatar, timestamp, and optional suggestion chips.
 *
 * @example
 * ```tsx
 * <MessageBubble
 *   id="msg-1"
 *   role="user"
 *   content="I always have cappuccino in the morning"
 *   timestamp={new Date()}
 * />
 *
 * <MessageBubble
 *   id="msg-2"
 *   role="assistant"
 *   content="Noted! I'll remember that."
 *   timestamp={new Date()}
 *   suggestions={[
 *     {
 *       id: "sug-1",
 *       text: "cappuccino",
 *       confidence: 0.8,
 *       onAccept: () => console.log('Accepted'),
 *       onReject: () => console.log('Rejected'),
 *     }
 *   ]}
 * />
 * ```
 */
export const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ id, role, content, timestamp, suggestions, avatar, className }, ref) => {
    const isUser = role === 'user';
    const defaultFallback = isUser ? 'You' : 'AI';

    return (
      <div
        ref={ref}
        data-testid={`message-bubble-${id}`}
        className={cn(messageBubbleVariants({ role }), className)}
      >
        {/* Avatar (only for assistant) */}
        {!isUser && (
          <div className="flex-shrink-0">
            <Avatar
              src={avatar?.src}
              fallback={avatar?.fallback || defaultFallback}
              size="sm"
            />
          </div>
        )}

        {/* Content Container */}
        <div className="flex flex-col gap-1 min-w-0">
          {/* Message Text */}
          <div className={messageTextVariants({ role })}>
            {content}
          </div>

          {/* Timestamp */}
          <div className={cn(
            'text-xs text-muted-foreground',
            isUser ? 'text-right' : 'text-left'
          )}>
            {formatRelativeTime(timestamp)}
          </div>

          {/* Suggestions (only for assistant messages) */}
          {!isUser && suggestions && suggestions.length > 0 && (
            <div className="flex flex-col gap-2 mt-1">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="flex items-center gap-2"
                >
                  <Chip size="sm" variant="outlined" className="flex items-center gap-1.5">
                    <span>{suggestion.text}</span>
                    <ConfidenceIndicator
                      confidence={suggestion.confidence}
                      variant="minimal"
                      size="sm"
                    />
                  </Chip>
                  {suggestion.onAccept && (
                    <button
                      onClick={suggestion.onAccept}
                      aria-label="Accept suggestion"
                      className="text-success hover:text-success/80 font-bold text-sm"
                      data-testid={`accept-${suggestion.id}`}
                    >
                      ✓
                    </button>
                  )}
                  {suggestion.onReject && (
                    <button
                      onClick={suggestion.onReject}
                      aria-label="Reject suggestion"
                      className="text-error hover:text-error/80 font-bold text-sm"
                      data-testid={`reject-${suggestion.id}`}
                    >
                      ✗
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar (only for user) */}
        {isUser && (
          <div className="flex-shrink-0">
            <Avatar
              src={avatar?.src}
              fallback={avatar?.fallback || defaultFallback}
              size="sm"
            />
          </div>
        )}
      </div>
    );
  }
);

MessageBubble.displayName = 'MessageBubble';
