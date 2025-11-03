'use client';

import { ChatInterface, Alert, Stack, Container, ConfidenceIndicator, OpportunityCard, TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@fidus/ui';
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
  is_exception?: boolean;
}

interface RelatedPreference {
  key: string;
  value: string;
  sentiment: string;
  confidence: number;
}

interface PreferenceConflict {
  key: string;
  old_value: string;
  old_sentiment: string;
  old_confidence: number;
  new_value: string;
  new_sentiment: string;
  new_confidence: number;
  related_preferences?: RelatedPreference[];
}

interface AIConfig {
  model: string;
  provider: string;
  is_local: boolean;
}

export default function FidusMemoryPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [conflicts, setConflicts] = useState<PreferenceConflict[]>([]);
  const [aiConfig, setAiConfig] = useState<AIConfig | null>(null);

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

  const fetchAIConfig = async () => {
    try {
      const response = await fetch('/api/memory/config');
      if (response.ok) {
        const data = await response.json();
        setAiConfig(data);
      }
    } catch (error) {
      console.error('Error fetching AI config:', error);
    }
  };

  // Load preferences and AI config on initial mount
  useEffect(() => {
    fetchPreferences();
    fetchAIConfig();
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

              case 'preference_conflict':
                // Handle preference conflicts (sentiment changed)
                console.warn('Preference conflicts detected:', event.conflicts);
                setConflicts((prev) => [...prev, ...event.conflicts]);
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

  // Generate privacy badges based on AI config and context
  const getPrivacyBadges = (context: 'chat' | 'preferences' | 'conflict') => {
    if (!aiConfig) {
      // Fallback while loading
      return [
        {
          label: '🤖 AI',
          tooltip: 'Your data is analyzed using a language model.'
        },
        {
          label: '🔒 Local',
          tooltip: 'Your data is stored in-memory on the server and never leaves your local network.'
        }
      ];
    }

    if (aiConfig.is_local) {
      // Local AI (Ollama)
      const aiTooltip = context === 'chat'
        ? `Your messages are processed locally using ${aiConfig.model}. No data is sent to external services.`
        : `Your preferences are extracted locally using ${aiConfig.model}. No data is sent to external services.`;

      return [
        {
          label: '🤖 Local AI',
          tooltip: aiTooltip
        },
        {
          label: '🔒 Local',
          tooltip: context === 'chat'
            ? 'Your conversation history is stored in-memory on the server and never leaves your local network.'
            : 'Your preferences are stored in-memory on the server and never leave your local network.'
        }
      ];
    } else {
      // Cloud AI (OpenAI, Anthropic, etc.)
      const aiTooltip = context === 'chat'
        ? `Your messages are analyzed using ${aiConfig.provider}'s ${aiConfig.model} via encrypted API requests.`
        : `Your preferences are extracted using ${aiConfig.provider}'s ${aiConfig.model} via encrypted API requests.`;

      return [
        {
          label: '☁️ Cloud AI',
          tooltip: aiTooltip
        },
        {
          label: '🔒 Local',
          tooltip: context === 'chat'
            ? 'Your conversation history is stored in-memory on the server and never leaves your local network.'
            : 'Your preferences are stored in-memory on the server and never leave your local network.'
        }
      ];
    }
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
                privacyBadges={getPrivacyBadges('chat')}
              >
                {/* Preference Conflicts - rendered inside chat */}
                {conflicts.map((conflict, index) => {
                  const oldEmoji = conflict.old_sentiment === 'positive' ? '👍' : conflict.old_sentiment === 'negative' ? '👎' : '😐';
                  const newEmoji = conflict.new_sentiment === 'positive' ? '👍' : conflict.new_sentiment === 'negative' ? '👎' : '😐';
                  const hasRelated = conflict.related_preferences && conflict.related_preferences.length > 0;

                  return (
                    <OpportunityCard
                      key={`${conflict.key}-${index}`}
                      title={hasRelated ? "Inconsistent Preferences Detected" : "Preference Changed"}
                      icon={<span className="text-xl">{hasRelated ? '⚠️' : '🔄'}</span>}
                      urgency={hasRelated ? "important" : "normal"}
                      privacyBadges={getPrivacyBadges('conflict')}
                      onClose={() => {
                        // Remove this conflict from list
                        setConflicts((prev) => prev.filter((_, i) => i !== index));
                      }}
                      primaryAction={{
                        label: hasRelated ? 'Apply to All' : 'Keep New',
                        onClick: async () => {
                          try {
                            // Update main preference
                            const response = await fetch(`/api/memory/preferences/${encodeURIComponent(conflict.key)}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                key: conflict.key,
                                value: conflict.new_value,
                                sentiment: conflict.new_sentiment,
                                confidence: conflict.new_confidence
                              })
                            });

                            if (!response.ok) {
                              throw new Error('Failed to update preference');
                            }

                            // If related preferences exist, update them to match the general preference
                            if (hasRelated && conflict.related_preferences) {
                              for (const related of conflict.related_preferences) {
                                // Generate new value text based on sentiment to maintain consistency
                                const newValue = conflict.new_sentiment === 'positive'
                                  ? 'likes it'
                                  : conflict.new_sentiment === 'negative'
                                  ? 'dislikes it'
                                  : 'neutral about it';

                                // Update related preference to have the same sentiment as the general preference
                                await fetch(`/api/memory/preferences/${encodeURIComponent(related.key)}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    key: related.key,
                                    value: newValue,  // Update value to match new sentiment
                                    sentiment: conflict.new_sentiment,  // Apply general preference sentiment
                                    confidence: related.confidence  // Keep original confidence
                                  })
                                });
                              }
                            }

                            console.log('Accepted new preference:', conflict.new_value);
                            setConflicts((prev) => prev.filter((_, i) => i !== index));
                            await fetchPreferences();
                          } catch (error) {
                            console.error('Error updating preference:', error);
                            setError('Failed to update preference. Please try again.');
                          }
                        },
                      }}
                      secondaryAction={{
                        label: hasRelated ? 'Keep Exceptions' : 'Keep Old',
                        onClick: async () => {
                          try {
                            // If user chose "Keep Exceptions", mark all related preferences as exceptions
                            if (hasRelated && conflict.related_preferences) {
                              for (const related of conflict.related_preferences) {
                                await fetch(`/api/memory/preferences/${encodeURIComponent(related.key)}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    key: related.key,
                                    value: related.value,
                                    sentiment: related.sentiment,
                                    confidence: related.confidence,
                                    is_exception: true  // Mark as exception
                                  })
                                });
                              }
                            }

                            console.log('Kept old preference:', conflict.old_value);
                            setConflicts((prev) => prev.filter((_, i) => i !== index));
                            await fetchPreferences();
                          } catch (error) {
                            console.error('Error updating preferences:', error);
                            setError('Failed to update preferences. Please try again.');
                          }
                        },
                      }}
                      context={`${conflict.key}`}
                    >
                      <Stack spacing="md">
                        {(conflict.related_preferences && conflict.related_preferences.length > 0) ? (
                          <>
                            <p>I noticed you {conflict.new_sentiment === 'negative' ? "don't like" : "like"} <strong>{conflict.key.split('.').pop()}</strong> in general, but you have specific preferences that contradict this:</p>
                            <ul className="text-sm space-y-xs">
                              <li>• <strong>General:</strong> {newEmoji} {conflict.key.split('.').pop()}: {conflict.new_value} ({Math.round(conflict.new_confidence * 100)}%)</li>
                              {conflict.related_preferences.map((related, relIdx) => {
                                const relEmoji = related.sentiment === 'positive' ? '👍' : '👎';
                                const relKeyName = related.key.split('.').pop() || related.key;
                                return (
                                  <li key={relIdx}>• <strong>Specific:</strong> {relEmoji} {relKeyName}: {related.value} ({Math.round(related.confidence * 100)}%)</li>
                                );
                              })}
                            </ul>
                            <p className="text-sm text-muted-foreground mt-2">
                              Should your general preference apply to all types, or do you want to keep the specific exceptions?
                            </p>
                          </>
                        ) : (
                          <>
                            <p>Your preference changed:</p>
                            <ul className="text-sm space-y-xs">
                              <li>• <strong>Previously:</strong> {oldEmoji} {conflict.old_value} ({Math.round(conflict.old_confidence * 100)}%)</li>
                              <li>• <strong>Now:</strong> {newEmoji} {conflict.new_value} ({Math.round(conflict.new_confidence * 100)}%)</li>
                            </ul>
                          </>
                        )}
                      </Stack>
                    </OpportunityCard>
                  );
                })}
              </ChatInterface>
            </div>

            {/* Learned Preferences Sidebar */}
            <div className="bg-card border border-border rounded-lg shadow-lg flex flex-col" style={{ maxHeight: '600px' }}>
              <div className="flex items-center justify-between p-md border-b border-border flex-shrink-0">
                <h2 className="text-lg font-semibold text-foreground">
                  Learned Preferences
                </h2>
                <div className="flex items-center gap-1">
                  {getPrivacyBadges('preferences').map((badge, index) => (
                    badge.tooltip ? (
                      <TooltipProvider key={index}>
                        <TooltipRoot delayDuration={200}>
                          <TooltipTrigger asChild>
                            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded cursor-help">
                              {badge.label}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" showArrow={true}>
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
              </div>

              <div className="flex-1 overflow-y-auto p-md">
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
                            <div className="flex items-center gap-1">
                              <div className="text-xs font-medium text-muted-foreground">
                                {pref.key}
                              </div>
                              {pref.is_exception && (
                                <TooltipProvider>
                                  <TooltipRoot delayDuration={200}>
                                    <TooltipTrigger asChild>
                                      <span className="text-xs px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded cursor-help">
                                        Exception
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" showArrow={true}>
                                      This is a specific exception to a more general preference
                                    </TooltipContent>
                                  </TooltipRoot>
                                </TooltipProvider>
                              )}
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
