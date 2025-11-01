'use client';

import {
  OpportunityCard,
  Button,
  DetailCard,
  TextInput,
  Alert,
  Badge,
} from '@fidus/ui';
import { useState, useEffect, useRef } from 'react';
import { CodeBlock } from '../../../components/helpers/code-block';

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
  const [isFormFilling, setIsFormFilling] = useState(false); // Shows "filling..." animation
  const [filledFields, setFilledFields] = useState<number>(0); // Number of filled fields
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
    // NOTE: Multi-turn dialogs handle their own LLM steps in the message animation loop
    const isMultiTurnDialog = current.chat && 'messages' in current.chat;

    if (current.chat && !isMultiTurnDialog) {
      // Single-turn dialog (old format) - show LLM steps once
      // Start hidden
      setLlmStep(-1);

      // Show "thinking..." indicator IMMEDIATELY after user message appears (200ms)
      setTimeout(() => setLlmStep(0), 200);

      // Then show steps faster (300ms between steps instead of 400ms)
      setTimeout(() => setLlmStep(1), 500);
      setTimeout(() => setLlmStep(2), 800);
      setTimeout(() => setLlmStep(3), 1100);
      setTimeout(() => setLlmStep(4), 1400);
      setTimeout(() => setLlmStep(5), 1700);
    } else if (current.card) {
      // For cards: start thinking immediately with indicator
      setLlmStep(0);

      // Faster steps for card scenes (250ms between steps)
      setTimeout(() => setLlmStep(1), 250);
      setTimeout(() => setLlmStep(2), 500);
      setTimeout(() => setLlmStep(3), 750);
      setTimeout(() => setLlmStep(4), 1000);
      setTimeout(() => setLlmStep(5), 1250);
    } else if (isMultiTurnDialog) {
      // Multi-turn dialog: LLM steps are handled per assistant message
      // Just hide the LLM steps initially
      setLlmStep(-1);
    }
  }, [currentIndex, current.chat, current.card]);

  // Initial load animation - trigger message animation for first scenario
  useEffect(() => {
    const initialScene = TIMELINE[0];

    if (initialScene.chat && initialScene.chat.messages) {
      const messages = initialScene.chat.messages;
      let currentDelay = 0;

      messages.forEach((msg, idx) => {
        setTimeout(() => {
          setVisibleMessageIndex(idx + 1);

          // Show typing indicator before assistant responses
          if (msg.type === 'assistant' && idx < messages.length) {
            setTimeout(() => setShowTyping(true), 100);
            setTimeout(() => {
              setShowTyping(false);
            }, 1700);
          }

          // Check if this message has a booking-form widget - trigger field filling animation
          if (msg.type === 'assistant' && msg.widget && msg.widget.type === 'booking-form' && msg.widget.data && 'fields' in msg.widget.data) {
            const fields = msg.widget.data.fields as string[];
            const numFields = fields.length;

            setTimeout(() => {
              setFilledFields(0);

              for (let fieldIdx = 0; fieldIdx < numFields; fieldIdx++) {
                setTimeout(() => {
                  setIsFormFilling(true);
                  setTimeout(() => {
                    setFilledFields(fieldIdx + 1);
                    setIsFormFilling(false);
                  }, 600);
                }, fieldIdx * 800);
              }
            }, 500);
          }
        }, currentDelay);

        const hasBookingForm = msg.type === 'assistant' && msg.widget && msg.widget.type === 'booking-form';
        const formFillingTime = hasBookingForm && msg.widget && msg.widget.data && 'fields' in msg.widget.data
          ? ((msg.widget.data.fields as string[]).length * 800 + 1000)
          : 0;

        if (msg.type === 'user') {
          currentDelay += 200;
        } else {
          currentDelay += 2000 + formFillingTime;
        }
      });
    }
  }, []); // Empty dependency array - only run on initial mount

  // Auto-advance through timeline with progressive animations
  useEffect(() => {
    const timer = setInterval(() => {
      // Reset animation states
      setShowTyping(false);
      setVisibleMessages(0);
      setShowWidget(false);
      setVisibleMessageIndex(0);
      setIsFormFilling(false);
      setFilledFields(0);

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
              // For user messages: show immediately and hide LLM process
              if (msg.type === 'user') {
                setTimeout(() => {
                  setVisibleMessageIndex(idx + 1);
                  setLlmStep(-1); // Hide LLM process when user is typing
                }, currentDelay);
              }

              // For assistant messages: show LLM process FIRST, then show message
              if (msg.type === 'assistant') {
                // Start LLM process animation BEFORE showing the message
                setTimeout(() => {
                  setLlmStep(-1); // Reset first
                }, currentDelay);

                setTimeout(() => {
                  setShowTyping(true);
                  setLlmStep(0); // Thinking
                }, currentDelay + 100);

                setTimeout(() => setLlmStep(1), currentDelay + 400);   // Input Source
                setTimeout(() => setLlmStep(2), currentDelay + 700);   // Context Analysis
                setTimeout(() => setLlmStep(3), currentDelay + 1000);  // Intent Detection
                setTimeout(() => setLlmStep(4), currentDelay + 1300);  // UI Form Selection
                setTimeout(() => setLlmStep(5), currentDelay + 1600);  // Complete

                // Hide typing and show message after LLM completes
                setTimeout(() => {
                  setShowTyping(false);
                  setVisibleMessageIndex(idx + 1);
                }, currentDelay + 1700);

                // Check if this message has a booking-form widget - trigger field filling animation
                if (msg.widget && msg.widget.type === 'booking-form' && msg.widget.data && 'fields' in msg.widget.data) {
                  const fields = msg.widget.data.fields as string[];
                  const numFields = fields.length;

                  // Start filling fields after assistant message appears (1700ms LLM + 500ms delay)
                  setTimeout(() => {
                    setFilledFields(0);

                    // Fill each field progressively
                    for (let fieldIdx = 0; fieldIdx < numFields; fieldIdx++) {
                      setTimeout(() => {
                        setIsFormFilling(true);
                        // Show typing animation for 600ms, then show filled field
                        setTimeout(() => {
                          setFilledFields(fieldIdx + 1);
                          setIsFormFilling(false);
                        }, 600);
                      }, fieldIdx * 800); // 800ms per field (600ms typing + 200ms gap)
                    }
                  }, currentDelay + 1700 + 500);
                }
              }

              // Timing between messages:
              // - User message appears immediately
              // - Then typing indicator (100ms)
              // - Then LLM thinks (1700ms, faster)
              // - Then assistant response appears
              // - Then pause before next user message (1000ms)
              // - For booking forms, add extra time for field filling animation
              const hasBookingForm = msg.type === 'assistant' && msg.widget && msg.widget.type === 'booking-form';
              const formFillingTime = hasBookingForm && msg.widget && msg.widget.data && 'fields' in msg.widget.data
                ? ((msg.widget.data.fields as string[]).length * 800 + 1000) // Field filling + pause
                : 0;

              if (msg.type === 'user') {
                currentDelay += 200; // Quick delay after user message
              } else {
                currentDelay += 2000 + formFillingTime; // LLM thinking time (1700ms) + typing indicator (100ms) + buffer (200ms) + form filling
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

            // 3. LLM thinks for ~1700ms (faster animation)
            // 4. After LLM completes, hide typing and show response
            setTimeout(() => {
              setShowTyping(false);
              setVisibleMessages(2);

              // Show widget after response (only for old single-turn format)
              if ('widget' in nextScene.chat && nextScene.chat.widget) {
                setTimeout(() => setShowWidget(true), 500);
              }
            }, 1900); // Typing visible during entire LLM process
          }
        } else if (nextScene.card) {
          // For cards (Signal/Event), LLM thinking happens first
          // Card is rendered when llmStep >= 5 (Rendering Complete)
          // No additional animation needed - card is always visible
        }
      }, 500);
    }, 20000); // 20 seconds per scene (increased for multi-turn dialogs with form filling)

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {/* Hero Section */}
      <div className="not-prose mb-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-md">AI-Driven UI Paradigm</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-lg max-w-3xl">
          Fidus doesn't have fixed screens or predetermined flows. Instead, an LLM analyzes context in real-time
          and dynamically decides what interface to render—creating situational UI that adapts to each moment.
        </p>

        <div className="grid md:grid-cols-3 gap-md mb-lg">
          <div className="p-md border border-border rounded-lg">
            <h3 className="text-lg font-semibold mb-sm">No Fixed Screens</h3>
            <p className="text-sm text-muted-foreground">
              The same user query can produce different UIs based on context, time, location, and user expertise.
            </p>
          </div>
          <div className="p-md border border-border rounded-lg">
            <h3 className="text-lg font-semibold mb-sm">LLM Decides UI Form</h3>
            <p className="text-sm text-muted-foreground">
              Chat, form, widget, wizard—the LLM chooses the best interface pattern for each situation.
            </p>
          </div>
          <div className="p-md border border-border rounded-lg">
            <h3 className="text-lg font-semibold mb-sm">Context-Adaptive</h3>
            <p className="text-sm text-muted-foreground">
              UI complexity adapts to user expertise, urgency, available time, and current activity.
            </p>
          </div>
        </div>
      </div>

      {/* Walkthrough: "A Day with Fidus" */}
      <h2 className="mb-md">A Day with Fidus</h2>
      <p className="lead mb-lg">
        Watch how the same AI assistant dynamically adapts its interface throughout the day based on context,
        user input, and real-time signals—without any fixed screens or predetermined flows.
      </p>

      {/* Mobile Phone Demo with Two-Column Layout */}
      <div className="not-prose my-lg md:my-xl">
        <div className="grid md:grid-cols-[380px_1fr] gap-8 items-start">
          {/* Left: Mobile Phone */}
          <div className="mx-auto w-full max-w-[90%] md:w-[380px] md:max-w-full shrink-0">
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
                                            <Button key={actionIdx} variant={actionIdx === 0 ? 'primary' : 'secondary'} size="sm">
                                              {action}
                                            </Button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Booking Form Widget with progressive field filling */}
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
                                          <div key={fieldIdx} className="relative">
                                            {fieldIdx < filledFields ? (
                                              // Filled field - show with animation
                                              <div className="w-full px-3 py-2 text-xs border border-border rounded bg-muted/50 text-foreground animate-in fade-in duration-300">
                                                {field}
                                              </div>
                                            ) : fieldIdx === filledFields && isFormFilling ? (
                                              // Currently filling - show typing animation
                                              <div className="w-full px-3 py-2 text-xs border border-primary/50 rounded bg-primary/5 flex items-center gap-2">
                                                <span className="text-muted-foreground">{field.split(':')[0]}:</span>
                                                <div className="flex gap-0.5">
                                                  <span className="w-1 h-1 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                  <span className="w-1 h-1 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                  <span className="w-1 h-1 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                              </div>
                                            ) : (
                                              // Empty field - waiting to be filled
                                              <div className="w-full px-3 py-2 text-xs border border-border rounded bg-muted/30 text-muted-foreground/50">
                                                {field.split(':')[0]}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      <Button
                                        className="w-full"
                                        disabled={filledFields < (msg.widget.data.fields?.length || 0)}
                                      >
                                        {msg.widget.data.action}
                                      </Button>
                                    </div>
                                  )}

                                  {/* Wizard Widget */}
                                  {msg.widget.type === 'wizard-step-1' && msg.widget.data && 'step' in msg.widget.data && (
                                    <div className="bg-card border border-border rounded-lg p-4">
                                      <p className="text-xs text-muted-foreground mb-2">{msg.widget.data.step}</p>
                                      <p className="text-sm font-semibold mb-3">{msg.widget.data.question}</p>
                                      <div className="grid grid-cols-2 gap-2">
                                        {msg.widget.data.options?.map((option: string, optionIdx: number) => (
                                          <Button key={optionIdx} variant="tertiary" size="sm">
                                            {option}
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Payment Options Widget */}
                                  {msg.widget.type === 'payment-options' && msg.widget.data && 'options' in msg.widget.data && (
                                    <div className="bg-card border border-border rounded-lg p-4">
                                      <div className="space-y-2">
                                        {msg.widget.data.options?.map((option: string, optionIdx: number) => (
                                          <Button key={optionIdx} variant="tertiary" className="w-full justify-between">
                                            <span>{option}</span>
                                            {option === 'Apple Pay' && <span className="text-lg"></span>}
                                            {option === 'Credit Card' && <span className="text-lg">💳</span>}
                                            {option === 'PayPal' && <span className="text-lg">🅿️</span>}
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Booking Confirmation Widget */}
                                  {msg.widget.type === 'booking-confirmation' && msg.widget.data && 'status' in msg.widget.data && 'hotel' in msg.widget.data && (
                                    <Alert variant="success" title={msg.widget.data.title}>
                                      <p className="text-sm font-semibold mb-2">{msg.widget.data.hotel}</p>
                                      <div className="space-y-1">
                                        {msg.widget.data.details?.map((detail: string, detailIdx: number) => (
                                          <p key={detailIdx} className="text-xs">
                                            {detail}
                                          </p>
                                        ))}
                                      </div>
                                      {'swipeable' in msg.widget.data && msg.widget.data.swipeable && (
                                        <div className="mt-3 pt-3 border-t border-green-200 flex items-center justify-center gap-2 text-xs">
                                          <span>👆</span>
                                          <span>Swipe to dismiss</span>
                                        </div>
                                      )}
                                    </Alert>
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
                                    <Button key={idx} variant={idx === 0 ? 'primary' : 'secondary'} size="sm">
                                      {action}
                                    </Button>
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
                              <Button className="w-full">
                                {widget.data.action}
                              </Button>
                            </div>
                          )}

                          {/* Wizard Widget */}
                          {widget.type === 'wizard-step-1' && widget.data && 'step' in widget.data && (
                            <div className="bg-card border border-border rounded-lg p-4">
                              <p className="text-xs text-muted-foreground mb-2">{widget.data.step}</p>
                              <p className="text-sm font-semibold mb-3">{widget.data.question}</p>
                              <div className="grid grid-cols-2 gap-2">
                                {widget.data.options?.map((option: string, idx: number) => (
                                  <Button key={idx} variant="tertiary" size="sm">
                                    {option}
                                  </Button>
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

      {/* Traditional vs AI-Driven Comparison */}
      <h2 className="mb-md">Traditional vs AI-Driven UI</h2>
      <p className="lead mb-lg">
        Understanding the fundamental difference between predetermined interfaces and context-adaptive UI.
      </p>

      <div className="not-prose mb-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left p-md bg-muted/30 font-semibold">Aspect</th>
                <th className="text-left p-md bg-muted/30 font-semibold">Traditional UI</th>
                <th className="text-left p-md bg-primary/10 font-semibold">AI-Driven UI (Fidus)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-md font-medium">Navigation</td>
                <td className="p-md text-sm">Fixed screens, user navigates to features</td>
                <td className="p-md text-sm bg-primary/5">No fixed screens, features surface contextually</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-md font-medium">UI Decisions</td>
                <td className="p-md text-sm">Hardcoded in JavaScript: if morning → show weather</td>
                <td className="p-md text-sm bg-primary/5">LLM analyzes context and decides UI form</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-md font-medium">Form Complexity</td>
                <td className="p-md text-sm">Same form for all users (expert and beginner)</td>
                <td className="p-md text-sm bg-primary/5">Adaptive: chat for beginners, quick form for experts</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-md font-medium">Dashboard</td>
                <td className="p-md text-sm">Static widgets, same for everyone</td>
                <td className="p-md text-sm bg-primary/5">Opportunity Surface with dynamic, context-relevant cards</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-md font-medium">User Control</td>
                <td className="p-md text-sm">Auto-hide notifications after X seconds</td>
                <td className="p-md text-sm bg-primary/5">User dismisses (swipe/X), no auto-hide</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-md font-medium">Response Format</td>
                <td className="p-md text-sm">Predetermined: "Create Budget" always shows form</td>
                <td className="p-md text-sm bg-primary/5">Context-dependent: text, form, widget, or wizard</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-md font-medium">Proactivity</td>
                <td className="p-md text-sm">Rule-based: if Friday 7am → show coffee budget alert</td>
                <td className="p-md text-sm bg-primary/5">Signal-based: LLM detects patterns and suggests</td>
              </tr>
              <tr>
                <td className="p-md font-medium">Extensibility</td>
                <td className="p-md text-sm">New UI requires code changes and deployment</td>
                <td className="p-md text-sm bg-primary/5">New components added to registry, LLM learns via RAG</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* New UI Patterns Section */}
      <h2 className="mb-md">New UI Patterns in AI-Driven Systems</h2>
      <p className="lead mb-lg">
        Fidus introduces 8 novel interaction patterns that emerge from context-aware, LLM-driven UI decisions.
        These patterns are fundamentally different from traditional UI paradigms.
      </p>

      {/* Pattern 1: Context-Driven UI Rendering */}
      <div className="not-prose mb-xl">
        <div className="border-l-4 border-primary pl-md mb-lg">
          <h3 className="text-xl font-bold mb-sm">1. Context-Driven UI Rendering</h3>
          <p className="text-muted-foreground mb-md">
            The LLM analyzes context (time, user history, data complexity, urgency) and dynamically selects
            the UI form—text response, widget, form, or wizard—at runtime. The same query produces different UIs in different contexts.
          </p>
        </div>

        <h4 className="text-base font-semibold mb-sm">Example: "Show my budget"</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md my-lg">
          <div className="border border-border rounded-lg p-md bg-card">
            <h5 className="text-sm font-semibold mb-sm">Context 1: Stable Mid-Month</h5>
            <p className="text-sm text-muted-foreground mb-sm">
              User has stable spending, mid-month, no concerns
            </p>
            <div className="bg-muted/50 rounded-md p-sm text-xs">
              <strong>LLM Decision:</strong> Simple text response
              <br />
              <br />
              &quot;Your October budget: 660 EUR spent of 1000 EUR (66%). You&apos;re on track!&quot;
            </div>
          </div>

          <div className="border border-border rounded-lg p-md bg-card">
            <h5 className="text-sm font-semibold mb-sm">Context 2: Near Limit, End-Month</h5>
            <p className="text-sm text-muted-foreground mb-sm">User is at 95% of budget, 3 days left in month</p>
            <div className="bg-muted/50 rounded-md p-sm text-xs">
              <strong>LLM Decision:</strong> OpportunityCard with urgency indicator
              <br />
              <br />
              Shows visual progress bar, breakdown by category, and action buttons: &quot;View Transactions&quot;,
              &quot;Adjust Budget&quot;
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-md text-sm">
          <strong>When to use:</strong> For all user queries where multiple UI forms are possible. Let the LLM decide based on:
          <ul className="mt-sm space-y-1 ml-md">
            <li>• <strong>Urgency:</strong> High urgency → OpportunityCard with visual emphasis</li>
            <li>• <strong>Data complexity:</strong> Large datasets → Interactive widgets</li>
            <li>• <strong>User expertise:</strong> Beginner → Conversational flow, Expert → Quick form</li>
            <li>• <strong>Time context:</strong> Morning vs evening affects UI presentation</li>
          </ul>
        </div>
      </div>

      {/* Pattern 2: Contextual Opportunity Surfacing */}
      <div className="not-prose mb-xl">
        <div className="border-l-4 border-primary pl-md mb-lg">
          <h3 className="text-xl font-bold mb-sm">2. Contextual Opportunity Surfacing (Proactive Cards)</h3>
          <p className="text-muted-foreground mb-md">
            The system proactively detects opportunities based on signals (calendar events, budget thresholds, weather patterns)
            and surfaces relevant, dismissible cards on the Opportunity Surface (Dashboard). No fixed widgets—only context-relevant cards.
          </p>
        </div>

        <h4 className="text-base font-semibold mb-sm">Examples of Opportunity Cards</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md my-lg">
          <div className="border border-border rounded-lg p-md bg-card">
            <Badge variant="urgent" className="mb-sm">Urgent</Badge>
            <h5 className="text-sm font-semibold mb-sm">Budget Alert</h5>
            <p className="text-xs text-muted-foreground mb-sm">
              Detected: 95% of food budget spent, 3 days left in month
            </p>
            <div className="flex gap-2 mt-sm">
              <Button variant="primary" size="sm">View Details</Button>
              <Button variant="secondary" size="sm">Dismiss</Button>
            </div>
          </div>

          <div className="border border-border rounded-lg p-md bg-card">
            <Badge variant="info" className="mb-sm">Suggestion</Badge>
            <h5 className="text-sm font-semibold mb-sm">Travel Booking</h5>
            <p className="text-xs text-muted-foreground mb-sm">
              You have a flight to Berlin tomorrow, but no hotel booked
            </p>
            <div className="flex gap-2 mt-sm">
              <Button variant="primary" size="sm">Find Hotels</Button>
              <Button variant="secondary" size="sm">Dismiss</Button>
            </div>
          </div>

          <div className="border border-border rounded-lg p-md bg-card">
            <Badge variant="normal" className="mb-sm">Pattern Detected</Badge>
            <h5 className="text-sm font-semibold mb-sm">Recurring Expense</h5>
            <p className="text-xs text-muted-foreground mb-sm">
              Coffee purchases every Monday at 9am—create recurring budget?
            </p>
            <div className="flex gap-2 mt-sm">
              <Button variant="primary" size="sm">Create Budget</Button>
              <Button variant="secondary" size="sm">Dismiss</Button>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-md text-sm">
          <strong>When to use:</strong> For proactive suggestions that are contextually relevant right now. Key characteristics:
          <ul className="mt-sm space-y-1 ml-md">
            <li>• <strong>User controls dismissal:</strong> Swipe or X button, never auto-hide timers</li>
            <li>• <strong>Signal-based:</strong> Triggered by data signals, not hardcoded rules</li>
            <li>• <strong>Urgency levels:</strong> Urgent (red), Suggestion (blue), Pattern (neutral)</li>
            <li>• <strong>Actionable:</strong> Always include 1-2 action buttons for immediate response</li>
          </ul>
        </div>
      </div>

      {/* Pattern 3: Adaptive Form Complexity */}
      <div className="not-prose mb-xl">
        <div className="border-l-4 border-primary pl-md mb-lg">
          <h3 className="text-xl font-bold mb-sm">3. Adaptive Form Complexity</h3>
          <p className="text-muted-foreground mb-md">
            Instead of one-size-fits-all forms, the LLM adapts form complexity based on user expertise and intent clarity.
            Expert users with clear intent get quick forms; beginners get conversational wizards.
          </p>
        </div>

        <h4 className="text-base font-semibold mb-sm">Example: Budget Creation</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md my-lg">
          <div className="border border-border rounded-lg p-md bg-card">
            <h5 className="text-sm font-semibold mb-sm">Expert User, Clear Intent</h5>
            <p className="text-sm text-muted-foreground mb-sm">
              Query: &quot;Create food budget 500 EUR monthly&quot;
            </p>
            <div className="bg-muted/50 rounded-md p-sm text-xs space-y-2">
              <div><strong>LLM Decision:</strong> Quick form with pre-filled values</div>
              <div className="space-y-1 pt-2">
                <div className="flex justify-between"><span>Category:</span><span>Food ✓</span></div>
                <div className="flex justify-between"><span>Amount:</span><span>500 EUR ✓</span></div>
                <div className="flex justify-between"><span>Period:</span><span>Monthly ✓</span></div>
              </div>
              <Button variant="primary" size="sm" className="w-full mt-2">Create Budget</Button>
            </div>
          </div>

          <div className="border border-border rounded-lg p-md bg-card">
            <h5 className="text-sm font-semibold mb-sm">Beginner User, Unclear Intent</h5>
            <p className="text-sm text-muted-foreground mb-sm">
              Query: &quot;I want to save money&quot;
            </p>
            <div className="bg-muted/50 rounded-md p-sm text-xs space-y-2">
              <div><strong>LLM Decision:</strong> Conversational wizard</div>
              <div className="pt-2 space-y-2">
                <div className="bg-background p-2 rounded">
                  <strong>Assistant:</strong> I can help! What area would you like to budget for?
                </div>
                <div className="flex gap-1 flex-wrap">
                  <Button variant="tertiary" size="sm">Food</Button>
                  <Button variant="tertiary" size="sm">Transport</Button>
                  <Button variant="tertiary" size="sm">Entertainment</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-md text-sm">
          <strong>When to use:</strong> For any data input task. LLM analyzes:
          <ul className="mt-sm space-y-1 ml-md">
            <li>• <strong>User expertise:</strong> Track past interactions to classify as beginner/intermediate/expert</li>
            <li>• <strong>Intent clarity:</strong> Parse query for completeness (all fields vs partial)</li>
            <li>• <strong>Task complexity:</strong> Simple tasks → form, complex → wizard, ambiguous → chat</li>
            <li>• <strong>User preference:</strong> Learn if user prefers forms vs conversation over time</li>
          </ul>
        </div>
      </div>

      {/* Pattern 4: Dynamic Search & Filtering */}
      <div className="not-prose mb-xl">
        <div className="border-l-4 border-primary pl-md mb-lg">
          <h3 className="text-xl font-bold mb-sm">4. Dynamic Search & Filtering (Context-Based Filters)</h3>
          <p className="text-muted-foreground mb-md">
            Instead of showing all possible filter options upfront, the LLM suggests relevant filters based on context,
            query intent, and data distribution. Filters adapt to what&apos;s actually useful right now.
          </p>
        </div>

        <h4 className="text-base font-semibold mb-sm">Example: Transaction Search</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md my-lg">
          <div className="border border-border rounded-lg p-md bg-card">
            <h5 className="text-sm font-semibold mb-sm">Query: &quot;Show my transactions&quot;</h5>
            <p className="text-sm text-muted-foreground mb-sm">
              No specific context
            </p>
            <div className="bg-muted/50 rounded-md p-sm text-xs">
              <strong>LLM Suggested Filters:</strong>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="normal">This Month</Badge>
                <Badge variant="normal">Large Amounts (&gt;100 EUR)</Badge>
                <Badge variant="normal">Uncategorized</Badge>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg p-md bg-card">
            <h5 className="text-sm font-semibold mb-sm">Query: &quot;Why is my food budget high?&quot;</h5>
            <p className="text-sm text-muted-foreground mb-sm">
              Specific category context
            </p>
            <div className="bg-muted/50 rounded-md p-sm text-xs">
              <strong>LLM Suggested Filters:</strong>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="normal">Food Category</Badge>
                <Badge variant="normal">Last 7 Days</Badge>
                <Badge variant="normal">Top Merchants</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-md text-sm">
          <strong>When to use:</strong> For search, filtering, and data exploration interfaces. LLM considers:
          <ul className="mt-sm space-y-1 ml-md">
            <li>• <strong>Query context:</strong> Extract category, time, amount hints from user query</li>
            <li>• <strong>Data distribution:</strong> Suggest filters that actually narrow results meaningfully</li>
            <li>• <strong>User patterns:</strong> Learn frequently-used filter combinations</li>
            <li>• <strong>Progressive disclosure:</strong> Show 3-4 relevant filters first, &quot;More filters&quot; for rest</li>
          </ul>
        </div>
      </div>

      {/* Pattern 5: Generated Form Inputs */}
      <div className="not-prose mb-xl">
        <div className="border-l-4 border-primary pl-md mb-lg">
          <h3 className="text-xl font-bold mb-sm">5. Generated Form Inputs (LLM-Suggested Fields)</h3>
          <p className="text-muted-foreground mb-md">
            The LLM analyzes user intent and suggests not just form fields, but also pre-filled values, smart defaults,
            and contextually-relevant field options based on history and patterns.
          </p>
        </div>

        <h4 className="text-base font-semibold mb-sm">Example: Appointment Creation</h4>

        <div className="border border-border rounded-lg p-md bg-card my-lg max-w-xl mx-auto">
          <h5 className="text-sm font-semibold mb-sm">Query: &quot;Schedule dentist appointment&quot;</h5>
          <div className="bg-muted/50 rounded-md p-md text-xs space-y-3">
            <div>
              <strong>LLM-Generated Form:</strong>
            </div>
            <div className="space-y-2 pt-2">
              <div>
                <div className="text-muted-foreground mb-1">Title:</div>
                <div className="bg-background p-2 rounded border border-border">
                  Dentist Appointment <span className="text-muted-foreground">(suggested)</span>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Location:</div>
                <div className="bg-background p-2 rounded border border-border">
                  Dr. Schmidt Dental, Main St 42 <span className="text-muted-foreground">(from history)</span>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Duration:</div>
                <div className="flex gap-2">
                  <Button variant="tertiary" size="sm">30 min</Button>
                  <Button variant="primary" size="sm">60 min</Button>
                  <Button variant="tertiary" size="sm">90 min</Button>
                </div>
                <div className="text-muted-foreground mt-1">(Based on past dentist appointments)</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Suggested Times:</div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="normal">Tomorrow 10:00</Badge>
                  <Badge variant="normal">Friday 14:00</Badge>
                  <Badge variant="normal">Next Monday 9:00</Badge>
                </div>
                <div className="text-muted-foreground mt-1">(Considering your calendar and dentist hours)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-md text-sm">
          <strong>When to use:</strong> For forms where historical data or context can improve input accuracy:
          <ul className="mt-sm space-y-1 ml-md">
            <li>• <strong>Repeat actions:</strong> Pre-fill based on previous similar entries</li>
            <li>• <strong>Smart defaults:</strong> Analyze patterns (e.g., dentist appointments usually 60 min)</li>
            <li>• <strong>Option generation:</strong> Create relevant options from calendar, contacts, locations</li>
            <li>• <strong>Validation:</strong> LLM can catch inconsistencies (e.g., appointment duration vs type)</li>
          </ul>
        </div>
      </div>

      {/* Pattern 6: Smart Action Buttons */}
      <div className="not-prose mb-xl">
        <div className="border-l-4 border-primary pl-md mb-lg">
          <h3 className="text-xl font-bold mb-sm">6. Smart Action Buttons (Generated from Context)</h3>
          <p className="text-muted-foreground mb-md">
            Action buttons aren&apos;t hardcoded—the LLM generates contextually relevant actions based on data state,
            user permissions, and current context. Same data entity shows different actions in different situations.
          </p>
        </div>

        <h4 className="text-base font-semibold mb-sm">Example: Calendar Event Actions</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md my-lg">
          <div className="border border-border rounded-lg p-md bg-card">
            <h5 className="text-sm font-semibold mb-sm">Context: Upcoming Event (2 hours away)</h5>
            <div className="bg-muted/50 rounded-md p-sm text-xs mb-3">
              <div className="font-semibold mb-1">Team Meeting</div>
              <div className="text-muted-foreground">Today 14:00 - 15:00</div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm">Join Now</Button>
              <Button variant="secondary" size="sm">Get Directions</Button>
            </div>
          </div>

          <div className="border border-border rounded-lg p-md bg-card">
            <h5 className="text-sm font-semibold mb-sm">Context: Past Event (completed yesterday)</h5>
            <div className="bg-muted/50 rounded-md p-sm text-xs mb-3">
              <div className="font-semibold mb-1">Team Meeting</div>
              <div className="text-muted-foreground">Yesterday 14:00 - 15:00</div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm">Add Notes</Button>
              <Button variant="secondary" size="sm">Schedule Follow-up</Button>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-md text-sm">
          <strong>When to use:</strong> For any data display where actions depend on state and context:
          <ul className="mt-sm space-y-1 ml-md">
            <li>• <strong>Time-dependent:</strong> Past events → review actions, upcoming → preparation actions</li>
            <li>• <strong>State-dependent:</strong> Pending budget → approve/reject, exceeded → adjust/view details</li>
            <li>• <strong>Permission-aware:</strong> Only show actions user has permission to execute</li>
            <li>• <strong>Context-specific:</strong> On mobile → &quot;Get Directions&quot;, on desktop → &quot;Open in Maps&quot;</li>
          </ul>
        </div>
      </div>

      {/* Pattern 7: Progressive Disclosure */}
      <div className="not-prose mb-xl">
        <div className="border-l-4 border-primary pl-md mb-lg">
          <h3 className="text-xl font-bold mb-sm">7. Progressive Disclosure (Based on User Expertise)</h3>
          <p className="text-muted-foreground mb-md">
            Information and options are revealed progressively based on user expertise level and interaction patterns.
            Beginners see simplified views; experts see advanced options immediately.
          </p>
        </div>

        <h4 className="text-base font-semibold mb-sm">Example: Budget Configuration</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md my-lg">
          <div className="border border-border rounded-lg p-md bg-card">
            <h5 className="text-sm font-semibold mb-sm">Beginner View</h5>
            <div className="bg-muted/50 rounded-md p-md text-xs space-y-3">
              <div>
                <div className="font-semibold mb-2">Essential Settings</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Monthly Limit:</span>
                    <span className="font-mono">1000 EUR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Category:</span>
                    <span>Food & Dining</span>
                  </div>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="w-full">Show More Options</Button>
            </div>
          </div>

          <div className="border border-border rounded-lg p-md bg-card">
            <h5 className="text-sm font-semibold mb-sm">Expert View</h5>
            <div className="bg-muted/50 rounded-md p-md text-xs space-y-3">
              <div>
                <div className="font-semibold mb-2">All Settings</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Monthly Limit:</span>
                    <span className="font-mono">1000 EUR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Category:</span>
                    <span>Food & Dining</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Alert Threshold:</span>
                    <span>80%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rollover:</span>
                    <span>Enabled</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Auto-categorization:</span>
                    <span>ML-based</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-md text-sm">
          <strong>When to use:</strong> For configuration screens and data-heavy displays:
          <ul className="mt-sm space-y-1 ml-md">
            <li>• <strong>User classification:</strong> Track feature usage to classify beginner/intermediate/expert</li>
            <li>• <strong>Essential first:</strong> Always show 3-5 most important options immediately</li>
            <li>• <strong>Contextual expansion:</strong> &quot;Show Advanced&quot; only appears if relevant</li>
            <li>• <strong>Learn preferences:</strong> If user always expands, start showing advanced by default</li>
          </ul>
        </div>
      </div>

      {/* Pattern 8: Temporal UI */}
      <div className="not-prose mb-xl">
        <div className="border-l-4 border-primary pl-md mb-lg">
          <h3 className="text-xl font-bold mb-sm">8. Temporal UI (Time-Sensitive Elements)</h3>
          <p className="text-muted-foreground mb-md">
            UI elements that appear, transform, or disappear based on time context. Not rule-based (&quot;every morning show X&quot;),
            but LLM-driven relevance decisions that consider time as one of many signals.
          </p>
        </div>

        <h4 className="text-base font-semibold mb-sm">Examples of Time-Context UI Changes</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md my-lg">
          <div className="border border-border rounded-lg p-md bg-card">
            <Badge variant="info" className="mb-sm">Morning (7-9 AM)</Badge>
            <h5 className="text-sm font-semibold mb-sm">Today&apos;s Overview Card</h5>
            <div className="bg-muted/50 rounded-md p-sm text-xs space-y-2">
              <div><strong>Might include:</strong></div>
              <ul className="space-y-1 ml-md">
                <li>• Weather for commute</li>
                <li>• First appointment time</li>
                <li>• Traffic conditions</li>
                <li>• Breakfast budget reminder</li>
              </ul>
            </div>
          </div>

          <div className="border border-border rounded-lg p-md bg-card">
            <Badge variant="info" className="mb-sm">Work Hours (9-5 PM)</Badge>
            <h5 className="text-sm font-semibold mb-sm">Focus Mode Active</h5>
            <div className="bg-muted/50 rounded-md p-sm text-xs space-y-2">
              <div><strong>Might include:</strong></div>
              <ul className="space-y-1 ml-md">
                <li>• Next meeting countdown</li>
                <li>• Urgent tasks only</li>
                <li>• Minimal notifications</li>
                <li>• Quick expense logging</li>
              </ul>
            </div>
          </div>

          <div className="border border-border rounded-lg p-md bg-card">
            <Badge variant="info" className="mb-sm">Evening (6-10 PM)</Badge>
            <h5 className="text-sm font-semibold mb-sm">Reflection & Planning</h5>
            <div className="bg-muted/50 rounded-md p-sm text-xs space-y-2">
              <div><strong>Might include:</strong></div>
              <ul className="space-y-1 ml-md">
                <li>• Today&apos;s spending summary</li>
                <li>• Tomorrow&apos;s agenda</li>
                <li>• Uncategorized transactions</li>
                <li>• Meal planning suggestions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-md text-sm">
          <strong>When to use:</strong> For dashboard and opportunity surfacing, NOT fixed schedules:
          <ul className="mt-sm space-y-1 ml-md">
            <li>• <strong>LLM decides relevance:</strong> Time is ONE signal, not the only signal</li>
            <li>• <strong>User patterns matter:</strong> Night owl users don&apos;t get morning cards at 7am</li>
            <li>• <strong>Override capability:</strong> User can always request any information regardless of time</li>
            <li>• <strong>Examples not rules:</strong> Document as &quot;might show&quot; not &quot;always shows&quot;</li>
          </ul>
        </div>
      </div>

      {/* UI Form Decision Matrix */}
      <h2 className="mb-md">UI Form Decision Matrix</h2>
      <p className="lead mb-lg">
        The LLM chooses UI form based on multiple context signals. This matrix shows typical mappings,
        but remember: these are examples, not rules. The LLM weighs all factors dynamically.
      </p>

      <div className="not-prose mb-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left p-sm bg-muted/30 font-semibold">User Query</th>
                <th className="text-left p-sm bg-muted/30 font-semibold">Context Signals</th>
                <th className="text-left p-sm bg-muted/30 font-semibold">User Level</th>
                <th className="text-left p-sm bg-primary/10 font-semibold">LLM Decision → UI Form</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-sm align-top">&quot;Show my budget&quot;</td>
                <td className="p-sm align-top text-xs">
                  <div>• Mid-month</div>
                  <div>• 66% spent</div>
                  <div>• On track</div>
                </td>
                <td className="p-sm align-top">Any</td>
                <td className="p-sm align-top bg-primary/5">
                  <strong>Text Response</strong>
                  <div className="text-xs text-muted-foreground mt-1">
                    &quot;Your October budget: 660 EUR of 1000 EUR (66%). You&apos;re on track!&quot;
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-sm align-top">&quot;Show my budget&quot;</td>
                <td className="p-sm align-top text-xs">
                  <div>• End of month</div>
                  <div>• 95% spent</div>
                  <div>• 3 days left</div>
                </td>
                <td className="p-sm align-top">Any</td>
                <td className="p-sm align-top bg-primary/5">
                  <strong>OpportunityCard</strong>
                  <div className="text-xs text-muted-foreground mt-1">
                    Visual card with urgency indicator, progress bar, category breakdown, actions
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-sm align-top">&quot;Create food budget 500 EUR monthly&quot;</td>
                <td className="p-sm align-top text-xs">
                  <div>• Complete intent</div>
                  <div>• All params present</div>
                </td>
                <td className="p-sm align-top">Expert</td>
                <td className="p-sm align-top bg-primary/5">
                  <strong>Quick Form (pre-filled)</strong>
                  <div className="text-xs text-muted-foreground mt-1">
                    Form with all fields pre-filled from query, one-click submit
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-sm align-top">&quot;I want to save money&quot;</td>
                <td className="p-sm align-top text-xs">
                  <div>• Vague intent</div>
                  <div>• Missing params</div>
                </td>
                <td className="p-sm align-top">Beginner</td>
                <td className="p-sm align-top bg-primary/5">
                  <strong>Conversational Wizard</strong>
                  <div className="text-xs text-muted-foreground mt-1">
                    Step-by-step guided conversation with option buttons
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-sm align-top">&quot;Schedule dentist&quot;</td>
                <td className="p-sm align-top text-xs">
                  <div>• Previous visits exist</div>
                  <div>• Calendar available</div>
                </td>
                <td className="p-sm align-top">Intermediate</td>
                <td className="p-sm align-top bg-primary/5">
                  <strong>Form with Smart Suggestions</strong>
                  <div className="text-xs text-muted-foreground mt-1">
                    Form with location from history, duration from past visits, suggested time slots
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-sm align-top">&quot;Show my transactions&quot;</td>
                <td className="p-sm align-top text-xs">
                  <div>• No specific query</div>
                  <div>• Large dataset</div>
                </td>
                <td className="p-sm align-top">Any</td>
                <td className="p-sm align-top bg-primary/5">
                  <strong>Widget with Dynamic Filters</strong>
                  <div className="text-xs text-muted-foreground mt-1">
                    Transaction list with LLM-suggested filters (This Month, Large Amounts, Uncategorized)
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-sm align-top">&quot;Why is my food budget high?&quot;</td>
                <td className="p-sm align-top text-xs">
                  <div>• Specific category</div>
                  <div>• Analysis needed</div>
                </td>
                <td className="p-sm align-top">Any</td>
                <td className="p-sm align-top bg-primary/5">
                  <strong>Widget with Context Filters</strong>
                  <div className="text-xs text-muted-foreground mt-1">
                    Transaction widget pre-filtered to Food category, Last 7 Days, Top Merchants
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-sm align-top">&quot;Plan trip to Paris&quot;</td>
                <td className="p-sm align-top text-xs">
                  <div>• Multi-step task</div>
                  <div>• Many decisions</div>
                </td>
                <td className="p-sm align-top">Beginner</td>
                <td className="p-sm align-top bg-primary/5">
                  <strong>Multi-Step Wizard</strong>
                  <div className="text-xs text-muted-foreground mt-1">
                    Dates → Flights → Hotels → Activities (step-by-step with confirmations)
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-sm align-top">&quot;Book Paris Apr 5-12&quot;</td>
                <td className="p-sm align-top text-xs">
                  <div>• Clear params</div>
                  <div>• Multi-step task</div>
                </td>
                <td className="p-sm align-top">Expert</td>
                <td className="p-sm align-top bg-primary/5">
                  <strong>Inline Widget Sequence</strong>
                  <div className="text-xs text-muted-foreground mt-1">
                    Flight options → Hotel options → Quick actions (Book All, Compare)
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-sm align-top">(No query - Morning 7am)</td>
                <td className="p-sm align-top text-xs">
                  <div>• Time: 7:00 AM</div>
                  <div>• Workday</div>
                  <div>• Commute pattern</div>
                </td>
                <td className="p-sm align-top">Any</td>
                <td className="p-sm align-top bg-primary/5">
                  <strong>Proactive Card</strong>
                  <div className="text-xs text-muted-foreground mt-1">
                    Today&apos;s Overview: Weather, first meeting, traffic, budget reminder
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-md mt-lg text-sm">
          <div className="flex gap-2 items-start">
            <span className="text-warning text-lg">⚠️</span>
            <div>
              <strong>Important:</strong> This matrix shows typical examples, not deterministic rules.
              The LLM considers ALL context signals simultaneously and may choose different UI forms
              based on factors not shown here (user preferences, recent history, device type, etc.).
            </div>
          </div>
        </div>
      </div>

      {/* UI Decision Layer Architecture */}
      <h2 className="mb-md">UI Decision Layer Architecture</h2>
      <p className="lead mb-lg">
        The LLM-based UI Decision Layer is the brain of Fidus&apos;s adaptive interface. It receives context,
        consults the Component Registry via RAG, and returns structured UI decisions—NOT hardcoded rules.
      </p>

      <div className="not-prose mb-xl">
        <h3 className="text-lg font-semibold mb-md">How It Works</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
          <div className="border border-border rounded-lg p-md bg-card">
            <div className="text-2xl mb-sm">1️⃣</div>
            <h4 className="text-sm font-semibold mb-sm">Context Gathering</h4>
            <p className="text-xs text-muted-foreground">
              System collects: user query, time, location, calendar state, budget status, user expertise level, device type, recent interactions
            </p>
          </div>

          <div className="border border-border rounded-lg p-md bg-card">
            <div className="text-2xl mb-sm">2️⃣</div>
            <h4 className="text-sm font-semibold mb-sm">LLM + RAG Decision</h4>
            <p className="text-xs text-muted-foreground">
              LLM receives context + Component Registry (via RAG). It analyzes signals and selects optimal UI form from available components
            </p>
          </div>

          <div className="border border-border rounded-lg p-md bg-card">
            <div className="text-2xl mb-sm">3️⃣</div>
            <h4 className="text-sm font-semibold mb-sm">Structured Response</h4>
            <p className="text-xs text-muted-foreground">
              LLM returns JSON schema with UI form type, component name, pre-filled data, and rendering instructions
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-md">Component Registry (RAG Knowledge Base)</h3>
        <p className="text-sm mb-md">
          The Component Registry is a structured knowledge base that the LLM queries via RAG to understand
          available UI components, their use cases, and required props.
        </p>

        <div className="mb-lg">
          <div className="text-xs font-mono mb-sm text-muted-foreground">Example: Component Registry Entry</div>
          <CodeBlock
            language="json"
            code={`{
  "componentName": "OpportunityCard",
  "description": "Proactive card for time-sensitive opportunities",
  "whenToUse": [
    "Urgent alerts (budget exceeded, calendar conflict)",
    "Time-sensitive suggestions (flight soon, no hotel)",
    "Pattern-based recommendations (recurring expense detected)"
  ],
  "requiredProps": {
    "urgency": "urgent | important | normal",
    "title": "string",
    "description": "string",
    "actions": "Array<{ label: string, action: string }>"
  },
  "examples": [
    "Budget alert: 95% spent, 3 days left in month",
    "Travel reminder: Flight tomorrow at 9am, no hotel booked"
  ]
}`}
          />
        </div>

        <h3 className="text-lg font-semibold mb-md">Example: LLM Prompt with Context</h3>
        <div className="mb-lg">
          <div className="text-xs font-mono mb-sm text-muted-foreground">System Prompt to LLM</div>
          <CodeBlock
            language="typescript"
            code={`You are the UI Decision Layer for Fidus, a privacy-first AI assistant.

TASK: Analyze the user query and context, then decide which UI form to render.

CONTEXT:
- User Query: "Show my budget"
- Time: 2024-10-28 14:30 (Monday afternoon, work hours)
- User Level: Intermediate (used Fidus for 3 months)
- Budget Status:
  - Category: Food & Dining
  - Limit: 1000 EUR/month
  - Spent: 950 EUR (95%)
  - Days Left: 3
  - Trend: 15% over average daily spending
- Device: Mobile (iPhone)
- Recent Activity: User checked budget 3 times today

AVAILABLE COMPONENTS (from Component Registry):
1. Text Response - Simple text answer
2. OpportunityCard - Urgent/proactive alerts with actions
3. BudgetWidget - Visual budget display with chart
4. DetailCard - Detailed breakdown with sections

DECISION CRITERIA:
- Urgency: Is this time-sensitive?
- Data Complexity: Simple vs complex data?
- User Expertise: Beginner (explain) vs Expert (concise)?
- Context: Does context suggest specific UI form?

Respond with structured JSON UI decision.`}
          />
        </div>

        <h3 className="text-lg font-semibold mb-md">Example: LLM Response (Structured JSON)</h3>
        <div className="mb-lg">
          <div className="text-xs font-mono mb-sm text-muted-foreground">LLM Output</div>
          <CodeBlock
            language="json"
            code={`{
  "uiDecision": {
    "reasoning": "User is at 95% of budget with only 3 days left, AND has checked budget 3 times today, indicating concern. This is urgent and actionable. OpportunityCard is best fit.",

    "selectedComponent": "OpportunityCard",

    "props": {
      "urgency": "urgent",
      "title": "Budget Alert: Food & Dining",
      "description": "You've spent 950 EUR of 1000 EUR (95%). Only 3 days left in October.",
      "visualData": {
        "progress": 95,
        "breakdown": [
          { "category": "Restaurants", "amount": 450, "percentage": 47 },
          { "category": "Groceries", "amount": 350, "percentage": 37 },
          { "category": "Coffee/Snacks", "amount": 150, "percentage": 16 }
        ]
      },
      "actions": [
        { "label": "View Transactions", "action": "navigate:transactions?category=food", "variant": "primary" },
        { "label": "Adjust Budget", "action": "navigate:budget/edit", "variant": "secondary" }
      ],
      "dismissible": true
    },

    "alternativeConsidered": "BudgetWidget was considered, but OpportunityCard better conveys urgency and provides immediate actions."
  }
}`}
          />
        </div>

        <h3 className="text-lg font-semibold mb-md">Key Architecture Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="border-l-4 border-primary pl-md">
            <h4 className="text-sm font-semibold mb-sm">✅ What the LLM Does</h4>
            <ul className="text-xs space-y-1">
              <li>• Analyzes ALL context signals simultaneously</li>
              <li>• Queries Component Registry via RAG</li>
              <li>• Reasons about urgency, complexity, user level</li>
              <li>• Selects optimal component from registry</li>
              <li>• Pre-fills props with context data</li>
              <li>• Provides reasoning for decision (explainability)</li>
            </ul>
          </div>

          <div className="border-l-4 border-error pl-md">
            <h4 className="text-sm font-semibold mb-sm">❌ What the LLM Does NOT Do</h4>
            <ul className="text-xs space-y-1">
              <li>• Follow hardcoded if/else rules</li>
              <li>• Use predetermined time-based triggers</li>
              <li>• Ignore context in favor of defaults</li>
              <li>• Generate UI components from scratch</li>
              <li>• Make decisions without Component Registry</li>
              <li>• Skip reasoning/explainability</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Examples Collection */}
      <h2 className="mb-md">Key Examples: See AI-Driven UI in Action</h2>
      <p className="lead mb-lg">
        These are the most impactful examples that demonstrate the paradigm shift from traditional to AI-driven UI.
        Each example shows how the same user intent produces different interfaces based on context.
      </p>

      <div className="not-prose mb-xl">
        <div className="grid grid-cols-1 gap-md">
          {/* Example 1: A Day with Fidus */}
          <div className="border-2 border-primary/20 rounded-lg p-lg bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-start gap-md">
              <div className="text-3xl">🌅</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-sm">1. A Day with Fidus — Interactive Phone Demo</h3>
                <p className="text-sm text-muted-foreground mb-md">
                  Watch realistic scenarios throughout a day where Fidus adapts its UI based on time, context, and user activity.
                  The phone demo cycles through multiple scenarios automatically, showing budget queries, calendar conflicts,
                  travel bookings, and proactive suggestions—all rendered differently based on context.
                </p>
                <div className="bg-muted/50 rounded-md p-sm text-xs mb-md">
                  <strong>What you&apos;ll see:</strong>
                  <ul className="mt-2 space-y-1 ml-md">
                    <li>• Same query (&quot;Show budget&quot;) → different UIs (text vs urgent card)</li>
                    <li>• Flight cards with primary/secondary button hierarchy</li>
                    <li>• Form filling animation with progressive field reveal</li>
                    <li>• Booking confirmation with swipeable dismissal</li>
                    <li>• Dashboard showing the completed booking</li>
                  </ul>
                </div>
                <a
                  href="#walkthrough-phone-demo"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <span>↑ Scroll to Interactive Demo</span>
                  <span>↑</span>
                </a>
              </div>
            </div>
          </div>

          {/* Example 2: Context-Driven Rendering */}
          <div className="border-2 border-primary/20 rounded-lg p-lg bg-gradient-to-br from-info/5 to-transparent">
            <div className="flex items-start gap-md">
              <div className="text-3xl">🎯</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-sm">2. Context-Driven UI Rendering Pattern</h3>
                <p className="text-sm text-muted-foreground mb-md">
                  The foundation of AI-driven UI: the LLM analyzes context signals (time, urgency, data complexity, user expertise)
                  and dynamically selects the UI form. See the budget query example showing text response vs OpportunityCard
                  based on budget status and timing.
                </p>
                <div className="bg-muted/50 rounded-md p-sm text-xs mb-md">
                  <strong>Key insight:</strong> The same user query produces completely different UIs:
                  <ul className="mt-2 space-y-1 ml-md">
                    <li>• Mid-month, 66% spent → Simple text: &quot;You&apos;re on track!&quot;</li>
                    <li>• End-month, 95% spent → Urgent card with actions and breakdown</li>
                  </ul>
                </div>
                <a
                  href="#pattern-1-context-driven"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <span>↓ Jump to Pattern #1</span>
                  <span>↓</span>
                </a>
              </div>
            </div>
          </div>

          {/* Example 3: Adaptive Form Complexity */}
          <div className="border-2 border-primary/20 rounded-lg p-lg bg-gradient-to-br from-success/5 to-transparent">
            <div className="flex items-start gap-md">
              <div className="text-3xl">📝</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-sm">3. Adaptive Form Complexity Pattern</h3>
                <p className="text-sm text-muted-foreground mb-md">
                  Forms adapt to user expertise and intent clarity. Expert users with complete parameters get quick pre-filled forms,
                  while beginners with vague requests get conversational wizards. The budget creation example shows both extremes.
                </p>
                <div className="bg-muted/50 rounded-md p-sm text-xs mb-md">
                  <strong>The contrast:</strong>
                  <ul className="mt-2 space-y-1 ml-md">
                    <li>• Expert: &quot;Create food budget 500 EUR monthly&quot; → Quick form, one click</li>
                    <li>• Beginner: &quot;I want to save money&quot; → Guided conversation with options</li>
                  </ul>
                </div>
                <a
                  href="#pattern-3-adaptive-forms"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <span>↓ Jump to Pattern #3</span>
                  <span>↓</span>
                </a>
              </div>
            </div>
          </div>

          {/* Example 4: UI Decision Matrix */}
          <div className="border-2 border-primary/20 rounded-lg p-lg bg-gradient-to-br from-warning/5 to-transparent">
            <div className="flex items-start gap-md">
              <div className="text-3xl">🧠</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-sm">4. UI Form Decision Matrix — LLM Decision Mapping</h3>
                <p className="text-sm text-muted-foreground mb-md">
                  A comprehensive table showing 10 real-world scenarios where user query + context signals + user level
                  map to specific UI forms. This matrix illustrates the complexity of context-aware UI decisions and emphasizes
                  that these are examples, not deterministic rules.
                </p>
                <div className="bg-muted/50 rounded-md p-sm text-xs mb-md">
                  <strong>Why it matters:</strong> Shows that AI-driven UI decisions consider multiple factors simultaneously—
                  not just one rule like &quot;if morning then show weather.&quot; The LLM weighs urgency, user level, data complexity,
                  and context to choose the optimal UI form.
                </div>
                <a
                  href="#decision-matrix"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <span>↓ Jump to Decision Matrix</span>
                  <span>↓</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-md mt-lg text-sm">
          <div className="flex gap-2 items-start">
            <span className="text-info text-lg">💡</span>
            <div>
              <strong>Pro tip:</strong> Start with the Interactive Phone Demo to see the paradigm in action,
              then dive into specific patterns to understand the underlying principles. The Decision Matrix
              ties everything together with concrete examples.
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Architecture */}
      <h2 className="mb-md">Implementation Architecture</h2>
      <p className="lead mb-lg">
        How do you actually build an AI-driven UI system? This section provides developer guidance on designing,
        implementing, and extending the context-adaptive interface architecture.
      </p>

      <div className="not-prose mb-xl">
        <h3 className="text-lg font-semibold mb-md">What Gets Designed & Built</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
          <div className="border border-border rounded-lg p-md bg-card">
            <h4 className="text-sm font-semibold mb-sm text-primary">1. Component Registry</h4>
            <p className="text-xs text-muted-foreground mb-sm">
              A structured knowledge base (JSON/YAML) documenting all available UI components:
            </p>
            <ul className="text-xs space-y-1 ml-md">
              <li>• Component name and description</li>
              <li>• When to use (conditions)</li>
              <li>• Required props and types</li>
              <li>• Example scenarios</li>
              <li>• Visual examples (screenshots)</li>
            </ul>
            <div className="mt-sm text-xs font-mono bg-muted/50 p-2 rounded">
              /registry/components/
              <br />
              ├─ OpportunityCard.json
              <br />
              ├─ BudgetWidget.json
              <br />
              └─ DetailCard.json
            </div>
          </div>

          <div className="border border-border rounded-lg p-md bg-card">
            <h4 className="text-sm font-semibold mb-sm text-primary">2. Domain Context Schemas</h4>
            <p className="text-xs text-muted-foreground mb-sm">
              TypeScript/Zod schemas defining context structure for each domain:
            </p>
            <ul className="text-xs space-y-1 ml-md">
              <li>• User state (expertise level, preferences)</li>
              <li>• Domain data (budget, calendar, travel)</li>
              <li>• Temporal context (time, location)</li>
              <li>• Recent activity history</li>
              <li>• Device and platform info</li>
            </ul>
            <div className="mt-sm text-xs font-mono bg-muted/50 p-2 rounded">
              /schemas/context/
              <br />
              ├─ BudgetContext.ts
              <br />
              ├─ CalendarContext.ts
              <br />
              └─ UserContext.ts
            </div>
          </div>

          <div className="border border-border rounded-lg p-md bg-card">
            <h4 className="text-sm font-semibold mb-sm text-primary">3. UI Decision Prompts</h4>
            <p className="text-xs text-muted-foreground mb-sm">
              System prompts for the LLM that include:
            </p>
            <ul className="text-xs space-y-1 ml-md">
              <li>• Role definition (UI Decision Layer)</li>
              <li>• Decision criteria (urgency, complexity, etc.)</li>
              <li>• Component Registry reference (RAG)</li>
              <li>• Output format (structured JSON schema)</li>
              <li>• Examples of good decisions</li>
            </ul>
            <div className="mt-sm text-xs font-mono bg-muted/50 p-2 rounded">
              /prompts/
              <br />
              ├─ ui-decision-layer.md
              <br />
              └─ component-registry-rag.md
            </div>
          </div>

          <div className="border border-border rounded-lg p-md bg-card">
            <h4 className="text-sm font-semibold mb-sm text-primary">4. Response Templates</h4>
            <p className="text-xs text-muted-foreground mb-sm">
              Zod schemas for LLM response validation:
            </p>
            <ul className="text-xs space-y-1 ml-md">
              <li>• UI decision structure</li>
              <li>• Component name (enum)</li>
              <li>• Props (typed by component)</li>
              <li>• Reasoning field (explainability)</li>
              <li>• Alternatives considered</li>
            </ul>
            <div className="mt-sm text-xs font-mono bg-muted/50 p-2 rounded">
              /schemas/responses/
              <br />
              ├─ UIDecisionSchema.ts
              <br />
              └─ ComponentPropsSchema.ts
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-md">Where to Work in the Codebase</h3>

        <div className="bg-muted/30 border border-border rounded-lg p-md mb-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md text-xs">
            <div>
              <div className="font-semibold mb-2 text-sm">🎯 Core Supervisor (Orchestration)</div>
              <div className="font-mono bg-background p-2 rounded mb-2">
                packages/api/fidus/domain/
                <br />
                └─ orchestration/
              </div>
              <div className="text-muted-foreground">
                Orchestration supervisor (core, built-in) receives user query, gathers context, calls UI Decision Layer (LLM),
                and returns structured UI response with component + props.
              </div>
            </div>

            <div>
              <div className="font-semibold mb-2 text-sm">🔌 External Domain Supervisors (MCP)</div>
              <div className="font-mono bg-background p-2 rounded mb-2">
                External MCP Servers
                <br />
                (added by admin at runtime)
              </div>
              <div className="text-muted-foreground">
                Domain supervisors (Calendar, Finance, Travel, etc.) are external MCP servers.
                Admin adds/removes them at runtime via MCP plugin system—not hardcoded in core.
              </div>
            </div>

            <div>
              <div className="font-semibold mb-2 text-sm">🤖 UI Decision Agent (LLM Layer)</div>
              <div className="font-mono bg-background p-2 rounded mb-2">
                packages/api/fidus/agents/
                <br />
                └─ ui_decision_agent.py
              </div>
              <div className="text-muted-foreground">
                LLM agent that receives context + Component Registry (RAG), applies decision criteria,
                returns structured JSON with component + props.
              </div>
            </div>

            <div>
              <div className="font-semibold mb-2 text-sm">🎨 Dynamic UI Renderer (Frontend)</div>
              <div className="font-mono bg-background p-2 rounded mb-2">
                packages/web/components/
                <br />
                └─ dynamic-renderer.tsx
              </div>
              <div className="text-muted-foreground">
                Dynamic renderer receives UI decision JSON, validates props, renders the selected
                component with pre-filled data.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-md mb-lg text-sm">
          <div className="flex gap-2 items-start">
            <span className="text-info text-lg">💡</span>
            <div>
              <strong>Core vs. External Architecture:</strong> Fidus has a minimal core (Orchestration + Proactivity supervisors)
              and external domain supervisors (Calendar, Finance, Travel) that are MCP servers added dynamically by admins.
              This allows extending Fidus with new domains without modifying core code.
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-md">Adding New UI Components</h3>

        <div className="border-l-4 border-primary pl-md mb-lg bg-primary/5 p-md rounded-r-lg">
          <ol className="text-sm space-y-md">
            <li>
              <strong>1. Build the Component</strong>
              <div className="text-xs text-muted-foreground mt-1">
                Create React component in <code className="font-mono">packages/web/components/</code> or
                add to <code className="font-mono">@fidus/ui</code> if reusable.
              </div>
            </li>
            <li>
              <strong>2. Document in Component Registry</strong>
              <div className="text-xs text-muted-foreground mt-1">
                Create JSON entry with: name, description, whenToUse, requiredProps, examples.
                This becomes RAG knowledge for the LLM.
              </div>
            </li>
            <li>
              <strong>3. Add to Dynamic Renderer</strong>
              <div className="text-xs text-muted-foreground mt-1">
                Update <code className="font-mono">DynamicRenderer.tsx</code> to handle new component name
                and validate its props with Zod schema.
              </div>
            </li>
            <li>
              <strong>4. Test with Context Variations</strong>
              <div className="text-xs text-muted-foreground mt-1">
                Write tests that provide different contexts to UI Decision Layer and verify it selects
                the new component when appropriate.
              </div>
            </li>
            <li>
              <strong>5. Update Documentation</strong>
              <div className="text-xs text-muted-foreground mt-1">
                Add example to this page under relevant pattern section, showing when LLM would choose this component.
              </div>
            </li>
          </ol>
        </div>

        <h3 className="text-lg font-semibold mb-md">Do&apos;s and Don&apos;ts</h3>

        <div className="not-prose grid md:grid-cols-2 gap-lg">
          {/* Do's */}
          <div className="border-2 border-success rounded-lg p-lg">
            <h4 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
              <span className="text-2xl">✓</span> Do
            </h4>
            <ul className="space-y-md text-sm">
              <li className="flex gap-sm">
                <span className="text-success shrink-0">•</span>
                <span>
                  <strong>Let the LLM decide:</strong> Provide context and Component Registry, let LLM choose UI form based on reasoning.
                </span>
              </li>
              <li className="flex gap-sm">
                <span className="text-success shrink-0">•</span>
                <span>
                  <strong>Use structured outputs:</strong> Validate LLM responses with Zod schemas to ensure type-safe component rendering.
                </span>
              </li>
              <li className="flex gap-sm">
                <span className="text-success shrink-0">•</span>
                <span>
                  <strong>Document components thoroughly:</strong> Component Registry is LLM&apos;s knowledge base—clear docs = better decisions.
                </span>
              </li>
              <li className="flex gap-sm">
                <span className="text-success shrink-0">•</span>
                <span>
                  <strong>Test context variations:</strong> Test same query with different contexts to verify adaptive behavior.
                </span>
              </li>
              <li className="flex gap-sm">
                <span className="text-success shrink-0">•</span>
                <span>
                  <strong>Track LLM reasoning:</strong> Log reasoning field from UI decisions for debugging and improving prompts.
                </span>
              </li>
            </ul>
          </div>

          {/* Don'ts */}
          <div className="border-2 border-error rounded-lg p-lg">
            <h4 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
              <span className="text-2xl">✗</span> Don&apos;t
            </h4>
            <ul className="space-y-md text-sm">
              <li className="flex gap-sm">
                <span className="text-error shrink-0">•</span>
                <span>
                  <strong>Hardcode UI logic:</strong> Avoid <code className="text-xs">if (morning) show weather</code>—let LLM decide based on full context.
                </span>
              </li>
              <li className="flex gap-sm">
                <span className="text-error shrink-0">•</span>
                <span>
                  <strong>Skip Component Registry:</strong> LLM can&apos;t choose components it doesn&apos;t know about via RAG.
                </span>
              </li>
              <li className="flex gap-sm">
                <span className="text-error shrink-0">•</span>
                <span>
                  <strong>Use auto-hide timers:</strong> User controls dismissal—never <code className="text-xs">setTimeout(hide, 3000)</code>.
                </span>
              </li>
              <li className="flex gap-sm">
                <span className="text-error shrink-0">•</span>
                <span>
                  <strong>Create fixed screens:</strong> No <code className="text-xs">CalendarScreen.tsx</code>—create <code className="text-xs">CalendarWidget.tsx</code> that appears contextually.
                </span>
              </li>
              <li className="flex gap-sm">
                <span className="text-error shrink-0">•</span>
                <span>
                  <strong>Ignore reasoning field:</strong> LLM reasoning helps debug bad decisions and improve prompts over time.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
