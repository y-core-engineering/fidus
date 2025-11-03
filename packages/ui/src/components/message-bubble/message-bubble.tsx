'use client';

import * as React from 'react';
import { z } from 'zod';
import { cva } from 'class-variance-authority';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar } from '../avatar';
import { Chip } from '../chip';
import { ConfidenceIndicator } from '../confidence-indicator';
import { Stack } from '../stack';
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
  status: z.enum(['sending', 'sent', 'error']).optional(),
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

const messageTextVariants = cva(
  'p-3 rounded-lg break-words',
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
  ({ id, role, content, timestamp, status, suggestions, avatar, className }, ref) => {
    const isUser = role === 'user';
    const defaultFallback = isUser ? 'You' : 'AI';

    return (
      <Stack
        ref={ref}
        data-testid={`message-bubble-${id}`}
        direction="horizontal"
        spacing="sm"
        align="start"
        className={cn(isUser && 'flex-row-reverse', 'w-full', className)}
      >
        {/* Avatar */}
        <Avatar
          src={avatar?.src}
          fallback={avatar?.fallback || defaultFallback}
          size="sm"
          className="flex-shrink-0"
        />

        {/* Content Container */}
        <Stack direction="vertical" spacing="xs" className="flex-1 max-w-[85%]">
          {/* Message Text */}
          <div className={cn(messageTextVariants({ role }), 'prose prose-sm max-w-none')}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Style links to inherit color
                a: ({ node, ...props }) => (
                  <a {...props} className="underline hover:opacity-80" />
                ),
                // Style code blocks
                code: ({ node, inline, ...props }: any) => (
                  inline ? (
                    <code {...props} className="bg-black/10 px-1 py-0.5 rounded text-sm" />
                  ) : (
                    <code {...props} className="block bg-black/10 p-2 rounded text-sm overflow-x-auto" />
                  )
                ),
                // Style lists
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc list-inside my-2" />
                ),
                ol: ({ node, ...props }) => (
                  <ol {...props} className="list-decimal list-inside my-2" />
                ),
                // Style paragraphs
                p: ({ node, ...props }) => (
                  <p {...props} className="mb-2 last:mb-0" />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* Timestamp with Status Indicator */}
          <div className={cn(
            'text-xs text-muted-foreground flex items-center gap-1',
            isUser ? 'flex-row-reverse' : 'flex-row'
          )}>
            <span>{formatRelativeTime(timestamp)}</span>
            {isUser && status && (
              <span className="flex items-center">
                {status === 'sending' && (
                  <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {status === 'sent' && (
                  <svg className="h-3 w-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {status === 'error' && (
                  <svg className="h-3 w-3 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </span>
            )}
          </div>

          {/* Suggestions (only for assistant messages) */}
          {!isUser && suggestions && suggestions.length > 0 && (
            <Stack direction="vertical" spacing="sm" className="mt-1">
              {suggestions.map((suggestion) => (
                <Stack
                  key={suggestion.id}
                  direction="horizontal"
                  spacing="sm"
                  align="center"
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
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    );
  }
);

MessageBubble.displayName = 'MessageBubble';
