'use client';

import { ChatInterface, Alert, Stack, Container, ConfidenceIndicator } from '@fidus/ui';
import { useState, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface Preference {
  key: string;
  value: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export default function FidusMemoryPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [preferences, setPreferences] = useState<Preference[]>([]);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/memory/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  // Load preferences on initial mount
  useEffect(() => {
    fetchPreferences();
  }, []);

  const handleSendMessage = async (content: string): Promise<void> => {
    // Clear any previous errors
    setError(null);

    // Add user message with 'sending' status
    const userMessageId = crypto.randomUUID();
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content,
      timestamp: new Date(),
      status: 'sending',
    };
    setMessages((prev) => [...prev, userMessage]);

    // Set loading state
    setIsLoading(true);

    try {
      // Call backend with SSE streaming
      const response = await fetch('/api/memory/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'user-1', message: content }),
      });

      if (!response.ok) {
        // Handle different HTTP errors with privacy-safe messages
        if (response.status === 500) {
          throw new Error('Service temporarily unavailable. Our team has been notified. Please try again in a moment.');
        } else if (response.status === 401 || response.status === 403) {
          throw new Error('Authentication error. Please refresh the page and try again.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment before trying again.');
        } else {
          throw new Error('Something went wrong. Please check your connection and try again.');
        }
      }

      // Read SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response stream available');
      }

      let botMessageId: string | null = null;
      let botMessageContent = '';
      let acknowledged = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode chunk and split by lines
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue;

          const data = line.slice(6); // Remove "data: " prefix
          try {
            const event = JSON.parse(data);

            switch (event.type) {
              case 'acknowledged':
                // Update user message to 'sent' immediately
                acknowledged = true;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === userMessageId ? { ...msg, status: 'sent' as const } : msg
                  )
                );
                break;

              case 'preferences_updated':
                // Fetch updated preferences
                await fetchPreferences();
                break;

              case 'token':
                // Create or update assistant message
                if (!botMessageId) {
                  botMessageId = crypto.randomUUID();
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: botMessageId!,
                      role: 'assistant',
                      content: event.content,
                      timestamp: new Date(),
                    },
                  ]);
                  botMessageContent = event.content;
                } else {
                  botMessageContent += event.content;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === botMessageId
                        ? { ...msg, content: botMessageContent }
                        : msg
                    )
                  );
                }
                break;

              case 'done':
                // Stream complete
                setIsLoading(false);
                setRetryCount(0);
                break;

              case 'error':
                throw new Error(event.message || 'Stream error');
            }
          } catch (parseError) {
            console.error('Error parsing SSE event:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Set error message for Alert component
      const errorMsg = error instanceof Error
        ? error.message
        : 'Failed to send message. Please check your connection and try again.';
      setError(errorMsg);

      // Update user message status to 'error'
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessageId ? { ...msg, status: 'error' as const } : msg
        )
      );

      setRetryCount((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Container size="xl" padding="lg" className="py-xl">
        <Stack direction="vertical" spacing="lg">
          {/* Header */}
          <Stack direction="vertical" spacing="sm" className="text-center">
            <h1 className="text-4xl font-bold text-foreground">
              Fidus Memory
            </h1>
            <p className="text-muted-foreground">
              Your privacy-first conversational learning agent
            </p>
          </Stack>

          {/* Error Alert (if any) */}
          {error && (
            <Alert
              variant="error"
              title="Couldn't send message"
              dismissible={true}
              onDismiss={handleDismissError}
            >
              {error}
              {retryCount > 1 && (
                <p className="mt-2 text-sm">
                  Attempted {retryCount} times. If this persists, please check your internet connection or try again later.
                </p>
              )}
            </Alert>
          )}

          {/* Main Content: Chat + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            {/* Chat Interface */}
            <div className="lg:col-span-2 shadow-lg rounded-lg overflow-hidden">
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                placeholder="Tell me about your preferences..."
                isLoading={isLoading}
                maxHeight="600px"
                emptyStateTitle="Start a conversation"
                emptyStateMessage="Tell me about your preferences, habits, or anything you'd like me to remember. I'll learn from our conversation and help you in the future."
              />
            </div>

            {/* Learned Preferences Sidebar */}
            <div className="bg-card border border-border rounded-lg p-md shadow-lg">
              <h2 className="text-lg font-semibold text-foreground mb-md">
                Learned Preferences
              </h2>

              {preferences.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No preferences learned yet. Start chatting to teach me about your preferences!
                </p>
              ) : (
                <Stack direction="vertical" spacing="sm">
                  {preferences.map((pref, index) => {
                    const sentimentEmoji = pref.sentiment === 'positive' ? '👍' : pref.sentiment === 'negative' ? '👎' : '😐';
                    const sentimentColor = pref.sentiment === 'positive' ? 'text-green-600' : pref.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600';

                    return (
                      <div
                        key={index}
                        className="bg-background border border-border rounded-md p-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs font-medium text-muted-foreground">
                            {pref.key}
                          </div>
                          <span className={`text-sm ${sentimentColor}`}>
                            {sentimentEmoji}
                          </span>
                        </div>
                        <div className="text-sm text-foreground mb-1">
                          {pref.value}
                        </div>
                        <div className="flex items-center justify-end">
                          <ConfidenceIndicator
                            confidence={pref.confidence}
                            variant="minimal"
                            size="sm"
                            showTooltip={true}
                          />
                        </div>
                      </div>
                    );
                  })}
                </Stack>
              )}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              🔒 Your conversations are processed securely.
              {' '}
              <a href="/privacy" className="text-primary hover:underline">
                Learn more about privacy
              </a>
            </p>
          </div>
        </Stack>
      </Container>
    </div>
  );
}
