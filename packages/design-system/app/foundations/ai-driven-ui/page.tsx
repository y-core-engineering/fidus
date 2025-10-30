'use client';

import { OpportunityCard } from '@fidus/ui';
import { useState, useEffect, useRef } from 'react';

// Timeline data - complex scenarios showing different UI forms
const TIMELINE = [
  // Scenario 1: Complete booking flow with form filling, payment, and dashboard (11 messages)
  {
    time: '8:15',
    period: 'AM',
    title: 'Morning',
    icon: '☕',
    context: 'Complete hotel booking flow',
    inputSource: 'User Request',
    inputDetail: 'Multi-turn conversation → Form filling → Payment → Confirmation → Dashboard',
    chat: {
      messages: [
        { type: 'user', content: 'Help me plan a weekend trip to Munich' },
        { type: 'assistant', content: 'I found 3 options: 1) Stay near Marienplatz (€180/night), 2) Schwabing district (€120/night), or 3) Near Olympic Park (€95/night). Which area interests you?', widget: null },
        { type: 'user', content: 'Schwabing sounds good' },
        {
          type: 'assistant',
          content: 'Great choice! Hotel München Palace (Schwabing): €120/night, 4.2★. Please fill in your booking details:',
          widget: {
            type: 'booking-form',
            data: {
              hotel: 'Hotel München Palace',
              pricePerNight: '€120',
              rating: '4.2★',
              fields: ['Check-in: Nov 15', 'Check-out: Nov 17', 'Guests: 2'],
              action: 'Book Now'
            }
          }
        },
        {
          type: 'user',
          content: 'Book it',
          typingEffect: true // Special flag for showing form submission
        },
        {
          type: 'assistant',
          content: 'How would you like to pay?',
          widget: {
            type: 'payment-options',
            data: {
              options: ['Apple Pay', 'Credit Card', 'PayPal']
            }
          }
        },
        { type: 'user', content: 'Apple Pay' },
        {
          type: 'assistant',
          content: '✓ Payment confirmed! Your booking is complete.',
          widget: {
            type: 'booking-confirmation',
            data: {
              status: 'success',
              title: 'Booking Confirmed',
              hotel: 'Hotel München Palace',
              details: ['Nov 15-17, 2024 (2 nights)', '2 Guests', 'Total: €240', 'Paid with Apple Pay'],
              swipeable: true
            }
          }
        }
      ]
    },
    // After swipe, show dashboard with booking
    dashboardAfterSwipe: {
      booking: {
        hotel: 'Hotel München Palace',
        dates: 'Nov 15-17',
        location: 'Munich, Schwabing',
        price: '€240'
      }
    }
  },
  // Scenario 2: Proactive card based on pattern detection
  {
    time: '9:30',
    period: 'AM',
    title: 'Commute',
    icon: '🚗',
    context: 'Recurring Friday coffee expense detected',
    inputSource: 'Signal',
    inputDetail: 'Pattern recognition: Weekly expense at same location',
    card: {
      type: 'normal',
      title: 'Recurring Expense Detected',
      content: 'You spend €4.50 at Café Central every Friday. Create a recurring budget entry?',
      primary: 'Add to Budget',
      secondary: 'Ignore'
    }
  },
  // Scenario 3: Flight booking conversation (4 messages)
  {
    time: '2:00',
    period: 'PM',
    title: 'Afternoon',
    icon: '✈️',
    context: 'User books flight with confirmation',
    inputSource: 'User Request',
    inputDetail: 'Widget → Action → Confirmation',
    chat: {
      messages: [
        { type: 'user', content: 'Book the 10:30 AM flight to Munich on Friday' },
        {
          type: 'assistant',
          content: 'Found Lufthansa LH2134 (10:30 AM, €89). Shall I book it?',
          widget: {
            type: 'flight-card',
            data: {
              airline: 'Lufthansa LH2134',
              departure: '10:30 AM',
              arrival: '11:45 AM',
              price: '€89',
              actions: ['Book Now', 'Compare Prices']
            }
          }
        },
        { type: 'user', content: 'Book it' },
        {
          type: 'assistant',
          content: '✓ Booked! Lufthansa LH2134 on Friday 10:30 AM. Confirmation sent to your email. Added to calendar.',
          widget: {
            type: 'confirmation',
            data: {
              status: 'success',
              title: 'Flight Booked',
              details: ['Confirmation: LH2134-XY789', 'Calendar updated', 'Email sent']
            }
          }
        }
      ]
    }
  },
  // Scenario 4: Budget threshold with contextual actions
  {
    time: '6:45',
    period: 'PM',
    title: 'Evening',
    icon: '🍕',
    context: 'Dining budget at 92%, weekend ahead',
    inputSource: 'Event',
    inputDetail: 'BudgetThresholdWarning + ContextualTiming',
    card: {
      type: 'important',
      title: 'Weekend Budget Watch',
      content: 'Dining budget: €368/€400 (92%). You have €32 left for Fri-Sun. Plan accordingly?',
      primary: 'View Meals',
      secondary: 'Adjust'
    }
  },
  // Scenario 5: Meeting scheduling wizard conversation (4 messages)
  {
    time: '7:20',
    period: 'PM',
    title: 'Evening',
    icon: '📅',
    context: 'User schedules meeting via wizard',
    inputSource: 'User Request',
    inputDetail: 'Wizard → Confirmation',
    chat: {
      messages: [
        { type: 'user', content: 'Schedule team meeting next week' },
        {
          type: 'assistant',
          content: 'I need a few details. Which day works best?',
          widget: {
            type: 'wizard-step-1',
            data: {
              step: '1 of 3',
              question: 'Which day?',
              options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            }
          }
        },
        { type: 'user', content: 'Wednesday afternoon, 1 hour' },
        {
          type: 'assistant',
          content: '✓ Team meeting scheduled: Wednesday 2:00-3:00 PM. Invites sent to 4 participants.',
          widget: {
            type: 'confirmation',
            data: {
              status: 'success',
              title: 'Meeting Scheduled',
              details: ['Wed 2:00-3:00 PM', '4 participants', 'Calendar invites sent']
            }
          }
        }
      ]
    }
  }
];

export default function AIDrivenUIPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [showWidget, setShowWidget] = useState(false);
  const [llmStep, setLlmStep] = useState(-1); // -1=hidden, 0=thinking, 1-5=steps visible
  const [visibleMessageIndex, setVisibleMessageIndex] = useState(0); // For multi-turn dialogs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const current = TIMELINE[currentIndex];

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated before scrolling
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [visibleMessages, showWidget, showTyping, visibleMessageIndex]);

  // LLM thinking animation - steps appear sequentially
  useEffect(() => {
    // For chat scenes: wait for user message to appear first
    // For card scenes: start thinking immediately
    if (current.chat) {
      // Start hidden
      setLlmStep(-1);

      // Show "thinking..." indicator IMMEDIATELY after user message appears (300ms)
      setTimeout(() => setLlmStep(0), 300);

      // Then show steps (thinking indicator visible for 500ms before first step)
      setTimeout(() => setLlmStep(1), 800);
      setTimeout(() => setLlmStep(2), 1200);
      setTimeout(() => setLlmStep(3), 1600);
      setTimeout(() => setLlmStep(4), 2000);
      setTimeout(() => setLlmStep(5), 2400);
    } else {
      // For cards: start thinking immediately with indicator
      setLlmStep(0);

      // Thinking indicator visible for 500ms before first step
      setTimeout(() => setLlmStep(1), 500);
      setTimeout(() => setLlmStep(2), 900);
      setTimeout(() => setLlmStep(3), 1300);
      setTimeout(() => setLlmStep(4), 1700);
      setTimeout(() => setLlmStep(5), 2100);
    }
  }, [currentIndex, current.chat]);

  // Auto-advance through timeline with progressive animations
  useEffect(() => {
    const timer = setInterval(() => {
      // Reset animation states
      setShowTyping(false);
      setVisibleMessages(0);
      setShowWidget(false);
      setVisibleMessageIndex(0);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % TIMELINE.length);

        // Trigger progressive animations for chat scenes
        const nextIndex = (currentIndex + 1) % TIMELINE.length;
        const nextScene = TIMELINE[nextIndex];

        if (nextScene.chat) {
          // Check if this is a multi-turn dialog (messages array) or single turn (query/response)
          if (nextScene.chat.messages) {
            // Multi-turn dialog - progressively show messages
            const messages = nextScene.chat.messages;
            let currentDelay = 0;

            messages.forEach((msg, idx) => {
              setTimeout(() => {
                setVisibleMessageIndex(idx + 1);

                // Show typing indicator before assistant responses
                if (msg.type === 'assistant' && idx < messages.length) {
                  setTimeout(() => setShowTyping(true), 100);
                  // LLM thinking time before showing assistant response
                  setTimeout(() => {
                    setShowTyping(false);
                  }, 2500);
                }
              }, currentDelay);

              // Timing between messages:
              // - User message appears immediately
              // - Then typing indicator (100ms)
              // - Then LLM thinks (2500ms)
              // - Then assistant response appears
              // - Then pause before next user message (1000ms)
              if (msg.type === 'user') {
                currentDelay += 200; // Quick delay after user message
              } else {
                currentDelay += 2800; // LLM thinking time + typing indicator
              }
            });
          } else {
            // Single-turn dialog (old format)
            // 1. Show user message IMMEDIATELY (before LLM thinking)
            setVisibleMessages(1);

            // 2. Show typing indicator immediately after user message (LLM is thinking)
            setTimeout(() => {
              setShowTyping(true);
            }, 200);

            // 3. LLM thinks for ~2500ms (300ms + 2000ms steps + 200ms buffer)
            // 4. After LLM completes, hide typing and show response
            setTimeout(() => {
              setShowTyping(false);
              setVisibleMessages(2);

              // Show widget after response (only for old single-turn format)
              if ('widget' in nextScene.chat && nextScene.chat.widget) {
                setTimeout(() => setShowWidget(true), 500);
              }
            }, 2700); // Typing visible during entire LLM process
          }
        } else if (nextScene.card) {
          // For cards (Signal/Event), LLM thinking happens first
          // Card is rendered when llmStep >= 5 (Rendering Complete)
          // No additional animation needed - card is always visible
        }
      }, 500);
    }, 12000); // 12 seconds per scene (increased for multi-turn dialogs)

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>AI-Driven UI Paradigm</h1>
      <p className="lead">
        Fidus implements a fundamentally different UI paradigm. Instead of fixed screens and predetermined flows,
        the LLM dynamically decides what interface to present based on context, creating situational UI that adapts
        to each moment.
      </p>

      {/* Mobile Phone Demo with Two-Column Layout */}
      <div className="not-prose my-lg md:my-xl">
        <div className="grid md:grid-cols-[380px_1fr] gap-8 items-start">
          {/* Left: Mobile Phone */}
          <div className="mx-auto w-[380px] max-w-full shrink-0">
            <div className="relative bg-gradient-to-br from-primary/5 via-background to-muted/20 rounded-[2.5rem] overflow-hidden border-8 border-foreground/20 shadow-2xl h-[780px]">
            {/* Mobile Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground/90 rounded-b-2xl z-30" />

            {/* Status Bar - Time changes with scenes */}
            <div className="absolute top-2 left-0 right-0 flex justify-between items-center px-8 z-20 text-xs text-muted-foreground">
              <span className="transition-all duration-500">{current.time.replace(':', ':')} {current.period === 'AM' ? 'AM' : 'PM'}</span>
              <div className="flex gap-1 items-center">
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Time Display */}
            <div className="absolute top-8 left-4 z-20">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{current.time}</span>
                <span className="text-xl font-medium text-muted-foreground">{current.period}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">{current.icon}</span>
                <span className="text-xs font-medium text-muted-foreground">{current.title}</span>
              </div>
            </div>

            {/* Content Area with auto-scroll */}
            <div
              ref={scrollContainerRef}
              className="absolute inset-0 pt-24 pb-32 px-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* Dashboard view for Card scenes */}
              {current.card && (
                <div className="space-y-4 mt-20">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/50 rounded-lg p-2.5 border border-border">
                      <div className="text-xs text-muted-foreground mb-0.5">Calendar</div>
                      <div className="text-sm font-semibold">3 events</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2.5 border border-border">
                      <div className="text-xs text-muted-foreground mb-0.5">Budget</div>
                      <div className="text-sm font-semibold">€475/500</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2.5 border border-border">
                      <div className="text-xs text-muted-foreground mb-0.5">Tasks</div>
                      <div className="text-sm font-semibold">5 open</div>
                    </div>
                  </div>

                  {/* Opportunities Section */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Opportunities</h3>

                    {/* Opportunity Surface - Card appears after LLM thinking */}
                    {llmStep >= 5 ? (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <OpportunityCard
                          title={current.card.title}
                          urgency={current.card.type as 'urgent' | 'important' | 'normal' | 'low'}
                          context="AI-Generated"
                          primaryAction={{
                            label: current.card.primary,
                            onClick: () => {}
                          }}
                          secondaryAction={{
                            label: current.card.secondary,
                            onClick: () => {}
                          }}
                        >
                          <p className="text-sm">{current.card.content}</p>
                        </OpportunityCard>
                      </div>
                    ) : (
                      // Empty state before LLM completes - shows dashboard skeleton
                      <div className="bg-muted/30 rounded-lg p-4 border border-dashed border-border">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span>Analyzing your day...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Render Chat with progressive animation */}
              {current.chat && (
                <div className="space-y-3 mt-20">
                  {/* Multi-turn dialog (messages array) */}
                  {current.chat.messages ? (
                    <>
                      {current.chat.messages.slice(0, visibleMessageIndex).map((msg, idx) => (
                        <div key={idx}>
                          {msg.type === 'user' ? (
                            <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
                                <p className="text-sm">{msg.content}</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-muted/80 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
                                  <p className="text-sm">{msg.content}</p>
                                </div>
                              </div>
                              {/* Show widget if present in assistant message */}
                              {msg.widget && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-2">
                                  {/* Flight Card Widget */}
                                  {msg.widget.type === 'flight-card' && msg.widget.data && 'airline' in msg.widget.data && (
                                    <div className="bg-card border border-border rounded-lg p-4">
                                      <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xl">✈️</span>
                                        <div>
                                          <p className="text-sm font-semibold">{msg.widget.data.airline}</p>
                                          <p className="text-xs text-muted-foreground">{msg.widget.data.departure} → {msg.widget.data.arrival}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <p className="text-lg font-bold text-primary">{msg.widget.data.price}</p>
                                        <div className="flex gap-2">
                                          {msg.widget.data.actions?.map((action: string, actionIdx: number) => (
                                            <button key={actionIdx} className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90">
                                              {action}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Booking Form Widget */}
                                  {msg.widget.type === 'booking-form' && msg.widget.data && 'hotel' in msg.widget.data && (
                                    <div className="bg-card border border-border rounded-lg p-4">
                                      <div className="flex items-start justify-between mb-3">
                                        <div>
                                          <p className="text-sm font-semibold">{msg.widget.data.hotel}</p>
                                          <p className="text-xs text-muted-foreground">{msg.widget.data.pricePerNight} · {msg.widget.data.rating}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 mb-3">
                                        {msg.widget.data.fields?.map((field: string, fieldIdx: number) => (
                                          <div key={fieldIdx} className="w-full px-3 py-2 text-xs border border-border rounded bg-muted/50 text-foreground">
                                            {field}
                                          </div>
                                        ))}
                                      </div>
                                      <button className="w-full px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90">
                                        {msg.widget.data.action}
                                      </button>
                                    </div>
                                  )}

                                  {/* Wizard Widget */}
                                  {msg.widget.type === 'wizard-step-1' && msg.widget.data && 'step' in msg.widget.data && (
                                    <div className="bg-card border border-border rounded-lg p-4">
                                      <p className="text-xs text-muted-foreground mb-2">{msg.widget.data.step}</p>
                                      <p className="text-sm font-semibold mb-3">{msg.widget.data.question}</p>
                                      <div className="grid grid-cols-2 gap-2">
                                        {msg.widget.data.options?.map((option: string, optionIdx: number) => (
                                          <button key={optionIdx} className="px-3 py-2 text-xs font-medium border border-border rounded hover:bg-muted">
                                            {option}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Payment Options Widget */}
                                  {msg.widget.type === 'payment-options' && msg.widget.data && 'options' in msg.widget.data && (
                                    <div className="bg-card border border-border rounded-lg p-4">
                                      <div className="space-y-2">
                                        {msg.widget.data.options?.map((option: string, optionIdx: number) => (
                                          <button key={optionIdx} className="w-full px-4 py-3 text-sm font-medium border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 flex items-center justify-between">
                                            <span>{option}</span>
                                            {option === 'Apple Pay' && <span className="text-lg"></span>}
                                            {option === 'Credit Card' && <span className="text-lg">💳</span>}
                                            {option === 'PayPal' && <span className="text-lg">🅿️</span>}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Booking Confirmation Widget */}
                                  {msg.widget.type === 'booking-confirmation' && msg.widget.data && 'status' in msg.widget.data && 'hotel' in msg.widget.data && (
                                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">✓</span>
                                        <p className="text-sm font-bold text-success">{msg.widget.data.title}</p>
                                      </div>
                                      <p className="text-sm font-semibold mb-2">{msg.widget.data.hotel}</p>
                                      <div className="space-y-1">
                                        {msg.widget.data.details?.map((detail: string, detailIdx: number) => (
                                          <p key={detailIdx} className="text-xs text-muted-foreground flex items-center gap-2">
                                            <span className="text-success">•</span>
                                            {detail}
                                          </p>
                                        ))}
                                      </div>
                                      {'swipeable' in msg.widget.data && msg.widget.data.swipeable && (
                                        <div className="mt-3 pt-3 border-t border-success/20 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                          <span>👆</span>
                                          <span>Swipe to dismiss</span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Confirmation Widget */}
                                  {msg.widget.type === 'confirmation' && msg.widget.data && 'status' in msg.widget.data && (
                                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                                      <div className="flex items-center gap-2 mb-3">
                                        <span className="text-2xl">✓</span>
                                        <p className="text-sm font-bold text-success">{msg.widget.data.title}</p>
                                      </div>
                                      <div className="space-y-1">
                                        {msg.widget.data.details?.map((detail: string, detailIdx: number) => (
                                          <p key={detailIdx} className="text-xs text-muted-foreground flex items-center gap-2">
                                            <span className="text-success">•</span>
                                            {detail}
                                          </p>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}

                      {/* Typing indicator for multi-turn */}
                      {showTyping && (
                        <div className="flex justify-start animate-in fade-in duration-200">
                          <div className="bg-muted/80 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Single-turn dialog (old format) */}
                      {/* User message - appears first */}
                      {visibleMessages >= 1 && 'query' in current.chat && typeof current.chat.query === 'string' && (
                        <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
                            <p className="text-sm">{current.chat.query}</p>
                          </div>
                        </div>
                      )}

                      {/* Typing indicator */}
                      {showTyping && (
                        <div className="flex justify-start animate-in fade-in duration-200">
                          <div className="bg-muted/80 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Assistant response - appears after typing */}
                      {visibleMessages >= 2 && 'response' in current.chat && typeof current.chat.response === 'string' && (
                        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className="bg-muted/80 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
                            <p className="text-sm">{current.chat.response}</p>
                          </div>
                        </div>
                      )}

                      {/* Widget appears after response */}
                      {'widget' in current.chat && current.chat.widget && typeof current.chat.widget === 'object' && 'type' in current.chat.widget && showWidget && (() => {
                        const widget = current.chat.widget as { type: string; data: any };
                        return (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                          {/* Flight Card Widget */}
                          {widget.type === 'flight-card' && widget.data && 'airline' in widget.data && (
                            <div className="bg-card border border-border rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl">✈️</span>
                                <div>
                                  <p className="text-sm font-semibold">{widget.data.airline}</p>
                                  <p className="text-xs text-muted-foreground">{widget.data.departure} → {widget.data.arrival}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-lg font-bold text-primary">{widget.data.price}</p>
                                <div className="flex gap-2">
                                  {widget.data.actions?.map((action: string, idx: number) => (
                                    <button key={idx} className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90">
                                      {action}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Booking Form Widget */}
                          {widget.type === 'booking-form' && widget.data && 'hotel' in widget.data && (
                            <div className="bg-card border border-border rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <p className="text-sm font-semibold">{widget.data.hotel}</p>
                                  <p className="text-xs text-muted-foreground">{widget.data.pricePerNight} · {widget.data.rating}</p>
                                </div>
                              </div>
                              <div className="space-y-2 mb-3">
                                {widget.data.fields?.map((field: string, idx: number) => (
                                  <div key={idx} className="w-full px-3 py-2 text-xs border border-border rounded bg-muted/50 text-foreground">
                                    {field}
                                  </div>
                                ))}
                              </div>
                              <button className="w-full px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90">
                                {widget.data.action}
                              </button>
                            </div>
                          )}

                          {/* Wizard Widget */}
                          {widget.type === 'wizard-step-1' && widget.data && 'step' in widget.data && (
                            <div className="bg-card border border-border rounded-lg p-4">
                              <p className="text-xs text-muted-foreground mb-2">{widget.data.step}</p>
                              <p className="text-sm font-semibold mb-3">{widget.data.question}</p>
                              <div className="grid grid-cols-2 gap-2">
                                {widget.data.options?.map((option: string, idx: number) => (
                                  <button key={idx} className="px-3 py-2 text-xs font-medium border border-border rounded hover:bg-muted">
                                    {option}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Confirmation Widget */}
                          {widget.type === 'confirmation' && widget.data && 'status' in widget.data && (
                            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">✓</span>
                                <p className="text-sm font-bold text-success">{widget.data.title}</p>
                              </div>
                              <div className="space-y-1">
                                {widget.data.details?.map((detail: string, idx: number) => (
                                  <p key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span className="text-success">•</span>
                                    {detail}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="absolute bottom-14 left-0 right-0 px-4 pb-3 bg-gradient-to-t from-background via-background to-transparent">
              <div className="flex items-center gap-2 bg-muted/90 backdrop-blur-sm border border-border rounded-full px-4 py-3 shadow-lg">
                <span className="text-lg">💬</span>
                <input
                  type="text"
                  placeholder="Ask Fidus anything..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  readOnly
                />
                <button className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                  →
                </button>
              </div>
            </div>

              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-muted-foreground/40 rounded-full" />
            </div>
          </div>

          {/* Right: LLM Decision Process Panel */}
          <div className="hidden md:block">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold">LLM Decision Process</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Real-time context analysis</p>
                </div>
              </div>

              <div className="space-y-3 bg-muted/30 rounded-xl p-4 border border-border min-h-[400px]">
                {/* Thinking Indicator - visible throughout entire LLM process */}
                {llmStep >= 0 && llmStep < 5 && (
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10 animate-pulse">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <p className="text-sm md:text-base font-medium text-muted-foreground">Analyzing context...</p>
                  </div>
                )}

                {/* Step 0: Input Source */}
                {llmStep >= 1 && (
                  <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                        <span className="text-base">📥</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm md:text-base font-bold mb-2">Input Source Detected</p>
                        <div className="space-y-1 text-xs md:text-sm">
                          <p className="font-semibold text-purple-700 dark:text-purple-300">
                            {current.inputSource}
                          </p>
                          <p className="text-muted-foreground">
                            {current.inputDetail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Context Analysis */}
                {llmStep >= 2 && (
                  <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm md:text-base font-bold mb-2">Analyzing Context</p>
                        <div className="space-y-1.5 text-xs md:text-sm">
                          <div className="flex items-start gap-2">
                            <span>⏰</span>
                            <span className="text-muted-foreground">Time: <strong className="text-foreground">{current.time} {current.period}</strong></span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span>📍</span>
                            <span className="text-muted-foreground">Situation: <strong className="text-foreground">{current.context}</strong></span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span>🎯</span>
                            <span className="text-muted-foreground">Type: <strong className="text-foreground">{current.card ? 'Proactive Alert' : 'Chat Query'}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Intent Detection */}
                {llmStep >= 3 && (
                  <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm md:text-base font-bold mb-2">Detecting Intent</p>
                        <div className="text-xs md:text-sm">
                          <p className="text-muted-foreground">
                            User needs: <strong className="text-foreground">
                              {current.card ? `${current.card.type.charAt(0).toUpperCase() + current.card.type.slice(1)} notification` : 'Informational response'}
                            </strong>
                          </p>
                          {current.card && (
                            <p className="text-xs mt-1 text-amber-700 dark:text-amber-300">⚠️ Action required</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: UI Form Selection */}
                {llmStep >= 4 && (
                  <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm md:text-base font-bold mb-2">Selecting UI Form</p>
                        <div className="bg-green-500/20 rounded-md px-3 py-2 text-xs md:text-sm font-semibold text-green-800 dark:text-green-200">
                          {current.card
                            ? `✓ ${current.card.type.toUpperCase()} OpportunityCard`
                            : current.chat
                              ? `✓ Chat response ${('widget' in current.chat && current.chat.widget) || ('messages' in current.chat) ? '+ embedded widget' : '(text only)'}`
                              : '✓ Dynamic UI'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Rendering */}
                {llmStep >= 5 && (
                  <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 scale-in">
                    <div className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg border-2 border-emerald-500/30 shadow-lg">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center shrink-0">
                        <span className="text-base font-bold text-emerald-700 dark:text-emerald-300">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm md:text-base font-bold mb-2 text-emerald-700 dark:text-emerald-300">Rendering Complete</p>
                        <div className="text-xs md:text-sm text-muted-foreground">
                          <p>UI components assembled and displayed to user</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="bg-muted/20 rounded-lg p-3 text-xs md:text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Time:</span>
                  <span className="font-medium">~230ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LLM Tokens:</span>
                  <span className="font-medium">~450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="font-medium">95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {TIMELINE.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <p className="text-center text-xs md:text-sm text-muted-foreground mt-4">
          Watch how Fidus adapts throughout the day — automatic loop, no interaction needed
        </p>
      </div>

      <h2>The Paradigm Shift</h2>

      <h3>Traditional UI (What Fidus Is NOT)</h3>
      <p>Traditional applications have:</p>
      <ul>
        <li>
          <strong>Rigid Structure:</strong> User must navigate to "Calendar Screen" even for quick
          check
        </li>
        <li>
          <strong>Static Content:</strong> Dashboard shows same widgets regardless of context
        </li>
        <li>
          <strong>Predetermined Flows:</strong> App dictates "Step 1, Step 2, Step 3"
        </li>
        <li>
          <strong>User Must Seek:</strong> User navigates to features instead of features coming to
          user
        </li>
        <li>
          <strong>Hardcoded Logic:</strong> "Morning = show weather" coded in JavaScript
        </li>
      </ul>

      <h3>AI-Driven UI (What Fidus IS)</h3>
      <p>
        The LLM analyzes user context and decides the optimal UI form. The same user intent can
        result in different interfaces based on situation.
      </p>

      <div className="not-prose bg-muted/30 border border-border rounded-lg p-lg my-lg">
        <h4 className="text-sm font-semibold mb-md">Context-Driven UI Flow</h4>
        <ol className="text-sm space-y-sm">
          <li>User provides context (query, action, or time-based trigger)</li>
          <li>LLM analyzes: intent, urgency, data complexity, user history</li>
          <li>LLM decides optimal UI form: Card, Form, Chat, Widget, or Wizard</li>
          <li>UI is rendered with appropriate content and actions</li>
          <li>User interacts or dismisses (swipe/X button)</li>
        </ol>
      </div>

      <p>
        <strong>Advantages:</strong>
      </p>
      <ul>
        <li>
          <strong>Contextually Adaptive:</strong> Interface changes based on situation
        </li>
        <li>
          <strong>LLM-Orchestrated:</strong> AI decides optimal UI form (form vs. chat vs. widget)
        </li>
        <li>
          <strong>Nothing Predetermined:</strong> Same query can render differently based on context
        </li>
        <li>
          <strong>User Empowered:</strong> User dismisses cards (swipe/X), no auto-hide
        </li>
        <li>
          <strong>Intelligent Surfacing:</strong> Opportunities appear when relevant
        </li>
      </ul>

      <h2>Core Principle: Context-Driven UI Rendering</h2>

      <h3>Example: "Show my budget"</h3>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-md my-lg">
        <div className="border border-border rounded-lg p-md bg-card">
          <h4 className="text-sm font-semibold mb-sm">Context 1: Stable Mid-Month</h4>
          <p className="text-sm text-muted-foreground mb-sm">
            User has stable spending, mid-month
          </p>
          <div className="not-prose bg-muted/50 rounded-md p-sm text-xs">
            <strong>LLM Decision:</strong> Simple text response
            <br />
            <br />
            "Your October budget: 660 EUR spent of 1000 EUR (66%). You're on track!"
          </div>
        </div>

        <div className="border border-border rounded-lg p-md bg-card">
          <h4 className="text-sm font-semibold mb-sm">Context 2: Near Limit End-Month</h4>
          <p className="text-sm text-muted-foreground mb-sm">User is 95% of budget, 3 days left</p>
          <div className="not-prose bg-muted/50 rounded-md p-sm text-xs">
            <strong>LLM Decision:</strong> OpportunityCard with urgency
            <br />
            <br />
            Shows visual progress bar, breakdown by category, and actions: "View Transactions",
            "Adjust Budget"
          </div>
        </div>
      </div>

      <h2>UI Form Types</h2>

      <h3>1. Opportunity Cards</h3>
      <p>
        <strong>When to use:</strong> Proactive surfacing of time-sensitive information
      </p>
      <ul>
        <li>Budget alerts (95% spent, 3 days left)</li>
        <li>Calendar conflicts (double bookings)</li>
        <li>Travel reminders (flight tomorrow, no hotel)</li>
        <li>Smart suggestions (recurring expense detected)</li>
      </ul>

      <h3>2. Inline Widgets</h3>
      <p>
        <strong>When to use:</strong> Embedded interactive elements in chat
      </p>
      <ul>
        <li>Calendar day view (quick schedule check)</li>
        <li>Budget charts (visual spending overview)</li>
        <li>Time slot selector (meeting scheduling)</li>
        <li>Quick action buttons (confirm/reschedule)</li>
      </ul>

      <h3>3. Dynamic Forms</h3>
      <p>
        <strong>When to use:</strong> Structured data input
      </p>
      <ul>
        <li>Adding new appointment (date, time, location)</li>
        <li>Creating budget (category, amount, period)</li>
        <li>Booking travel (dates, destination, preferences)</li>
        <li>Recording transaction (amount, category, date)</li>
      </ul>

      <h3>4. Conversational Wizards</h3>
      <p>
        <strong>When to use:</strong> Multi-step flows with decisions
      </p>
      <ul>
        <li>Trip planning (destination → dates → flights → hotels)</li>
        <li>Budget setup (categories → limits → alerts)</li>
        <li>Appointment rescheduling (find conflicts → suggest slots → confirm)</li>
        <li>Transaction categorization (unclear category, need details)</li>
      </ul>

      <h2>LLM Decision Factors</h2>

      <div className="not-prose bg-muted/30 border border-border rounded-lg p-lg my-lg">
        <h3 className="text-base font-semibold mb-md">The LLM considers:</h3>
        <ul className="space-y-sm text-sm">
          <li>
            <strong>Urgency:</strong> Time-sensitive issues get OpportunityCards
          </li>
          <li>
            <strong>Complexity:</strong> Simple queries get text, complex get widgets/forms
          </li>
          <li>
            <strong>Data Volume:</strong> Large datasets get interactive widgets
          </li>
          <li>
            <strong>User History:</strong> Previous interactions influence form choice
          </li>
          <li>
            <strong>Context:</strong> Time of day, recent activities, upcoming events
          </li>
          <li>
            <strong>Privacy Level:</strong> Sensitive data gets local-only badges
          </li>
        </ul>
      </div>

      <h2>User Control Principles</h2>

      <h3>1. User Dismisses, Never Auto-Hide</h3>
      <p>
        Cards remain visible until user explicitly dismisses them (swipe gesture or X button). No
        automatic hiding.
      </p>

      <h3>2. Swipe Gestures (Mobile)</h3>
      <p>Left or right swipe dismisses OpportunityCards on mobile devices.</p>

      <h3>3. Close Button (Desktop)</h3>
      <p>X button in top-right corner dismisses cards on desktop.</p>

      <h3>4. No Forced Flows</h3>
      <p>
        User can abandon any interaction at any time. Forms can be dismissed, wizards can be
        cancelled.
      </p>

      <h2>Privacy-First Integration</h2>

      <p>Every AI-driven UI element includes privacy indicators:</p>
      <ul>
        <li>
          <strong>🔒 Local:</strong> Data processed locally, never leaves device
        </li>
        <li>
          <strong>☁️ Cloud:</strong> Data synchronized to user's private cloud
        </li>
        <li>
          <strong>🔗 External:</strong> Data from third-party services (Google Calendar, banks)
        </li>
      </ul>

      <h2>Implementation Guidelines</h2>

      <h3>For Developers</h3>
      <ul>
        <li>Don't hardcode UI forms - let LLM decide</li>
        <li>Provide LLM with context: urgency, data complexity, user history</li>
        <li>Implement all UI forms: Cards, Widgets, Forms, Wizards</li>
        <li>Always include privacy badges on rendered UI</li>
        <li>Support both swipe (mobile) and X button (desktop) dismissal</li>
      </ul>

      <h3>For Designers</h3>
      <ul>
        <li>Design flexible components that adapt to different contexts</li>
        <li>Don't create fixed "screens" - create composable UI elements</li>
        <li>Consider how same data looks in Card vs. Widget vs. Chat</li>
        <li>Ensure all UI forms have consistent visual language</li>
        <li>Design for dismissal: clear close/swipe affordances</li>
      </ul>

      <h2>Examples in Practice</h2>

      <h3>Morning Routine</h3>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md text-sm">
        <p className="mb-sm">
          <strong>8:00 AM:</strong> LLM detects morning context
        </p>
        <p className="mb-sm">
          <strong>Surfaces:</strong> OpportunityCard with today's calendar (3 meetings detected)
        </p>
        <p>
          <strong>User action:</strong> Taps "View Full Calendar" → navigates to calendar widget
        </p>
      </div>

      <h3>Budget Warning</h3>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md text-sm">
        <p className="mb-sm">
          <strong>Context:</strong> 95% of food budget spent, 3 days left in month
        </p>
        <p className="mb-sm">
          <strong>Surfaces:</strong> OpportunityCard with "urgent" styling, progress bar, and
          actions
        </p>
        <p>
          <strong>User action:</strong> Taps "View Transactions" → opens inline widget showing
          recent food expenses
        </p>
      </div>

      <h3>Quick Calendar Check</h3>
      <div className="not-prose bg-muted/30 border border-border rounded-lg p-md my-md text-sm">
        <p className="mb-sm">
          <strong>Query:</strong> "What's my schedule today?"
        </p>
        <p className="mb-sm">
          <strong>LLM Decision:</strong> Inline widget (not OpportunityCard - not urgent)
        </p>
        <p>
          <strong>Rendered:</strong> Compact calendar widget embedded in chat showing today's 3
          appointments
        </p>
      </div>

      <h2>Key Takeaways</h2>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-lg my-lg">
        <ul className="space-y-sm text-sm">
          <li>✅ LLM decides UI form based on context</li>
          <li>✅ Same query can render differently based on situation</li>
          <li>✅ User controls visibility (dismiss, never auto-hide)</li>
          <li>✅ Privacy indicators on all AI-driven UI</li>
          <li>✅ Contextual adaptation over predetermined flows</li>
          <li>✅ Flexible components over fixed screens</li>
        </ul>
      </div>
    </div>
  );
}
