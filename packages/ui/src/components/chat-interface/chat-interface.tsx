'use client';

import * as React from 'react';
import { z } from 'zod';
import { MessageBubble, type Message } from '../message-bubble';
import { Button } from '../button';
import { Spinner } from '../spinner';
import { EmptyCard } from '../empty-card';
import { Stack } from '../stack';
import { cn } from '../../lib/cn';
import { MessageCircle } from 'lucide-react';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '../tooltip/tooltip';

export const ChatInterfacePropsSchema = z.object({
  messages: z.array(z.custom<Message>()),
  onSendMessage: z
    .function()
    .args(z.string())
    .returns(z.union([z.void(), z.promise(z.void())])),
  isLoading: z.boolean().optional(),
  placeholder: z.string().optional(),
  maxHeight: z.string().optional(),
  emptyStateTitle: z.string().optional(),
  emptyStateMessage: z.string().optional(),
  privacyBadges: z.array(z.object({
    label: z.string(),
    tooltip: z.string().optional(),
  })).optional(),
  className: z.string().optional(),
  children: z.any().optional(),
});

export type ChatInterfaceProps = z.infer<typeof ChatInterfacePropsSchema>;

/**
 * ChatInterface Component
 *
 * Complete chat layout with scrollable message list and input area.
 * Handles Enter vs Shift+Enter for sending vs newline, auto-scrolls on new messages,
 * and shows loading state during AI responses.
 *
 * @example
 * ```tsx
 * const [messages, setMessages] = useState<Message[]>([]);
 * const [isLoading, setIsLoading] = useState(false);
 *
 * const handleSendMessage = async (content: string) => {
 *   setIsLoading(true);
 *   // Send message to API
 *   const response = await sendMessageToAPI(content);
 *   setMessages([...messages, response]);
 *   setIsLoading(false);
 * };
 *
 * <ChatInterface
 *   messages={messages}
 *   onSendMessage={handleSendMessage}
 *   isLoading={isLoading}
 *   placeholder="Type a message..."
 * />
 * ```
 */
export const ChatInterface = React.forwardRef<HTMLDivElement, ChatInterfaceProps>(
  (
    {
      messages,
      onSendMessage,
      isLoading = false,
      placeholder = 'Type a message...',
      maxHeight = '600px',
      emptyStateTitle = 'Start chatting',
      emptyStateMessage = 'Type a message below to start teaching Fidus Memory about your preferences.',
      privacyBadges,
      className,
      children,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState('');
    const [isSending, setIsSending] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Focus input field on mount
    React.useEffect(() => {
      textareaRef.current?.focus();
    }, []);

    // Auto-scroll to bottom when new messages arrive and refocus input
    React.useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      // Refocus input after scrolling
      if (!isLoading && !isSending) {
        textareaRef.current?.focus();
      }
    }, [messages, isLoading, isSending]);

    const handleSend = React.useCallback(async () => {
      const trimmedValue = inputValue.trim();

      // Don't send empty messages
      if (!trimmedValue || isSending || isLoading) {
        return;
      }

      setIsSending(true);
      setInputValue('');

      try {
        await onSendMessage(trimmedValue);
      } catch (error) {
        console.error('Failed to send message:', error);
        // Restore input value on error
        setInputValue(trimmedValue);
      } finally {
        setIsSending(false);

        // Focus input after sending
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 0);
      }
    }, [inputValue, isSending, isLoading, onSendMessage]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter without Shift = send message
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
        // Shift + Enter = newline (default textarea behavior)
      },
      [handleSend]
    );

    const isDisabled = isSending || isLoading;
    const isSendButtonDisabled = isDisabled || !inputValue.trim();

    return (
      <Stack
        ref={ref}
        direction="vertical"
        spacing="none"
        className={cn(
          'bg-background border border-border rounded-lg',
          className
        )}
        data-testid="chat-interface"
      >
        {/* Message List */}
        <Stack
          direction="vertical"
          spacing="md"
          className="flex-1 overflow-y-auto p-md scroll-smooth"
          style={{ maxHeight }}
          data-testid="message-list"
        >
          {messages.length === 0 ? (
            /* Empty State */
            <EmptyCard
              title={emptyStateTitle}
              description={emptyStateMessage}
              icon={<MessageCircle />}
              size="sm"
            />
          ) : (
            /* Messages */
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} {...message} />
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <Stack
                  direction="horizontal"
                  spacing="sm"
                  align="center"
                  className="text-muted-foreground"
                  data-testid="loading-indicator"
                >
                  <Spinner size="sm" />
                  <span className="text-sm">Thinking...</span>
                </Stack>
              )}

              {/* Children (e.g., OpportunityCards) */}
              {children}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </>
          )}
        </Stack>

        {/* Input Area */}
        <Stack
          direction="vertical"
          spacing="sm"
          className="border-t border-border p-md"
          data-testid="input-area"
        >
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isDisabled}
            rows={3}
            className="w-full p-md rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="message-input"
            aria-label="Message input"
          />

          <Stack direction="horizontal" justify="between" align="center">
            {privacyBadges && privacyBadges.length > 0 && (
              <div className="flex items-center gap-1">
                {privacyBadges.map((badge, index) => (
                  badge.tooltip ? (
                    <TooltipProvider key={index}>
                      <TooltipRoot delayDuration={200}>
                        <TooltipTrigger asChild>
                          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded cursor-help">
                            {badge.label}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" showArrow={true}>
                          {badge.tooltip}
                        </TooltipContent>
                      </TooltipRoot>
                    </TooltipProvider>
                  ) : (
                    <span key={index} className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                      {badge.label}
                    </span>
                  )
                ))}
              </div>
            )}
            <Button
              onClick={handleSend}
              disabled={isSendButtonDisabled}
              variant="primary"
              size="md"
              data-testid="send-button"
              aria-label="Send message"
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Stack>
    );
  }
);

ChatInterface.displayName = 'ChatInterface';
