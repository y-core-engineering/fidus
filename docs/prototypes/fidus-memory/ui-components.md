# Fidus Memory - UI Component Analysis

**Version:** 1.0
**Date:** 2025-11-03
**Related:** [Fidus Memory Implementation Plan](./fidus-memory-implementation-plan.md)

---

## Executive Summary

This document analyzes the existing @fidus/ui component library (v1.0.2, 41 components) to determine what components can be reused for Fidus Memory and what new components need to be created.

**Conclusion:** We can reuse **~90% of existing components** from @fidus/ui. We need to add **3 new components**:
1. `ChatInterface` - Complete chat layout with message list and input
2. `MessageBubble` - Individual chat message display
3. `ConfidenceIndicator` - Visual confidence score display

---

## Fidus Memory UI Requirements

Based on the implementation plan, the Fidus Memory interface requires:

### Main Chat View
- Chat message list (scrollable history)
- Message bubbles (user vs AI, with timestamps)
- Text input with send button
- Real-time message streaming (optional for v1)
- Suggestion chips (when AI offers learned preferences)

### Preference Viewer (Sidebar)
- Grouped preference cards by domain
- Confidence score visualization
- Metadata display (learned date, reinforcement count)
- "Delete All Memories" button

### Layout
- Desktop-optimized (mobile later)
- Split-screen: Chat (left) + Preferences (right, collapsible)
- Header with title and controls

---

## Component Reuse Analysis

### ✅ Existing Components We Can Use

| Component | Use Case | Status |
|-----------|----------|--------|
| **Button** | Send message, Delete All, Show/Hide Preferences | ✅ Ready |
| **Badge** | Confidence score badge (High/Medium/Low) | ✅ Ready |
| **Card** (DetailCard) | Preference cards in sidebar | ✅ Ready |
| **ProgressBar** | Confidence score visualization | ✅ Ready |
| **TextInput** | Chat input field | ✅ Ready |
| **Stack** | Layout for preference groups | ✅ Ready |
| **Divider** | Visual separation in sidebar | ✅ Ready |
| **Container** | Page-level layout | ✅ Ready |
| **Modal** | Confirmation dialog for "Delete All" | ✅ Ready |
| **Toast** | Success/error notifications | ✅ Ready |
| **Skeleton** | Loading placeholders | ✅ Ready |
| **Spinner** | Loading indicator for AI response | ✅ Ready |
| **Tooltip** | Explain confidence scores | ✅ Ready |
| **EmptyCard** | "No preferences yet" empty state | ✅ Ready |

**Total Reusable:** 14 components

---

## ❌ Missing Components (Need to Create)

### 1. ChatInterface

**Purpose:** Complete chat layout with message list and input area

**Features:**
- Scrollable message list (auto-scroll to bottom on new message)
- Message input with multi-line support (Shift+Enter for newline, Enter to send)
- Send button (disabled while sending)
- Loading indicator during AI response
- Empty state ("Start chatting to teach Fidus Memory about your preferences")

**Props:**
```typescript
interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void | Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
  maxHeight?: string;
  emptyStateMessage?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: Suggestion[];
}

interface Suggestion {
  id: string;
  text: string;
  confidence: number;
  onAccept: () => void;
  onReject: () => void;
}
```

**Implementation Notes:**
- Use existing `TextArea` component for input
- Use existing `Button` component for send button
- Use existing `Spinner` component for loading state
- Use existing `EmptyCard` for empty state
- New: `MessageBubble` component for each message (see below)

**Composition:**
```tsx
<ChatInterface>
  <MessageList>
    {messages.map(msg => <MessageBubble key={msg.id} {...msg} />)}
  </MessageList>
  <MessageInput>
    <TextArea />
    <Button>Send</Button>
  </MessageInput>
</ChatInterface>
```

---

### 2. MessageBubble

**Purpose:** Display a single chat message (user or AI)

**Features:**
- User message: Right-aligned, primary color background
- AI message: Left-aligned, neutral background
- Timestamp (relative time: "Just now", "2 minutes ago")
- Avatar icon (user vs bot)
- Suggestion chips (for AI messages with learned preferences)
- Markdown support (not optional)

**Props:**
```typescript
interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: Suggestion[];
  avatar?: {
    src?: string;
    fallback: string; // Initials or icon
  };
}
```

**Visual Design:**
```
User Message:
+-----------------------------------------+
|                         "I always have  |
|                         cappuccino in   | [User Avatar]
|                         the morning"    |
|                         2 min ago    ---+
+-----------------------------------------+

AI Message:
+-----------------------------------------+
| [AI Avatar]  "Noted! Cappuccino in the  |
|              morning seems to be        |
|              important to you."         |
|              Just now                   |
|                                         |
|  [Chip: cappuccino (confidence: 80%)]  |
+-----------------------------------------+
```

**Composition:**
- Use existing `Avatar` component
- Use existing `Chip` component for suggestions
- New: Custom bubble styling with Tailwind

---

### 3. ConfidenceIndicator

**Purpose:** Visualize preference confidence score with intuitive design

**Features:**
- Percentage display (0-100%)
- Color-coded by confidence level:
  - 0-30% (Uncertain): Gray/Yellow
  - 30-50% (Learning): Blue
  - 50-80% (Confident): Green
  - 80-100% (Very Confident): Dark Green
- Progress bar visualization
- Tooltip with explanation ("High confidence - AI will auto-suggest")

**Props:**
```typescript
interface ConfidenceIndicatorProps {
  confidence: number; // 0.0 - 1.0
  variant?: 'minimal' | 'detailed'; // minimal = badge only, detailed = bar + badge
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

**Visual Design:**

**Minimal Variant:**
```
[80%]  ← Badge only
```

**Detailed Variant:**
```
Confidence: 80%
[████████████████--------] High
```

**Composition:**
- Use existing `Badge` component
- Use existing `ProgressBar` component
- Use existing `Tooltip` component
- New: Custom confidence color mapping

---

## Component Implementation Priority

### Phase 1: Core Chat (Week 2)
1. **MessageBubble** - Required for displaying messages
2. **ChatInterface** - Main chat layout
3. Test with mock data

### Phase 2: Preferences (Week 2-3)
4. **ConfidenceIndicator** - Needed for preference visualization
5. Integrate with existing cards and layout components
6. Build PreferenceViewer using existing Stack + Card

### Phase 3: Polish (Week 3)
7. Suggestion chips in MessageBubble
8. Markdown rendering (optional)
9. Real-time streaming (optional)

---

## Detailed Component Specifications

### ChatInterface Component

**File:** `packages/ui/src/components/chat-interface/chat-interface.tsx`

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '../button/button';
import { TextArea } from '../text-area/text-area';
import { Spinner } from '../spinner/spinner';
import { EmptyCard } from '../empty-card/empty-card';
import { MessageBubble, type Message } from '../message-bubble/message-bubble';
import './chat-interface.css';

export interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void | Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
  maxHeight?: string;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = 'Type a message...',
  maxHeight = '600px',
  emptyStateTitle = 'Start a Conversation',
  emptyStateMessage = 'Chat with Fidus Memory to teach it about your preferences',
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');

    await onSendMessage(message);

    // Focus back on input
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-interface" style={{ maxHeight }}>
      {/* Message List */}
      <div className="chat-interface__messages">
        {messages.length === 0 ? (
          <div className="chat-interface__empty">
            <EmptyCard
              title={emptyStateTitle}
              message={emptyStateMessage}
              icon="💬"
            />
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} {...message} />
            ))}
            {isLoading && (
              <div className="chat-interface__loading">
                <Spinner size="sm" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="chat-interface__input">
        <TextArea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
          maxRows={6}
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          size="md"
          variant="primary"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
```

**CSS:** `packages/ui/src/components/chat-interface/chat-interface.css`

```css
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.chat-interface__messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.chat-interface__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.chat-interface__loading {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  color: var(--color-text-secondary);
}

.chat-interface__input {
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-md);
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-end;
}

.chat-interface__input textarea {
  flex: 1;
}
```

---

### MessageBubble Component

**File:** `packages/ui/src/components/message-bubble/message-bubble.tsx`

```typescript
'use client';

import { Avatar } from '../avatar/avatar';
import { Chip } from '../chip/chip';
import './message-bubble.css';

export interface Suggestion {
  id: string;
  text: string;
  confidence: number;
  onAccept?: () => void;
  onReject?: () => void;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: Suggestion[];
  avatar?: {
    src?: string;
    fallback: string;
  };
}

export interface MessageBubbleProps extends Message {}

export function MessageBubble({
  role,
  content,
  timestamp,
  suggestions = [],
  avatar = {
    fallback: role === 'user' ? 'You' : 'AI',
  },
}: MessageBubbleProps) {
  const isUser = role === 'user';

  const relativeTime = formatRelativeTime(timestamp);

  return (
    <div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--assistant'}`}>
      {!isUser && (
        <div className="message-bubble__avatar">
          <Avatar src={avatar.src} fallback={avatar.fallback} size="sm" />
        </div>
      )}

      <div className="message-bubble__content">
        <div className="message-bubble__text">{content}</div>

        {suggestions.length > 0 && (
          <div className="message-bubble__suggestions">
            {suggestions.map((suggestion) => (
              <Chip
                key={suggestion.id}
                label={suggestion.text}
                variant="outlined"
                onDelete={suggestion.onReject}
                onClick={suggestion.onAccept}
              />
            ))}
          </div>
        )}

        <div className="message-bubble__timestamp">{relativeTime}</div>
      </div>

      {isUser && (
        <div className="message-bubble__avatar">
          <Avatar src={avatar.src} fallback={avatar.fallback} size="sm" />
        </div>
      )}
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return 'Just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
```

**CSS:** `packages/ui/src/components/message-bubble/message-bubble.css`

```css
.message-bubble {
  display: flex;
  gap: var(--spacing-sm);
  max-width: 70%;
}

.message-bubble--user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-bubble--assistant {
  align-self: flex-start;
}

.message-bubble__avatar {
  flex-shrink: 0;
}

.message-bubble__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.message-bubble__text {
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  word-wrap: break-word;
}

.message-bubble--user .message-bubble__text {
  background-color: var(--color-primary);
  color: var(--color-background);
}

.message-bubble--assistant .message-bubble__text {
  background-color: var(--color-surface);
  color: var(--color-foreground);
}

.message-bubble__suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  padding: 0 var(--spacing-sm);
}

.message-bubble__timestamp {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  padding: 0 var(--spacing-sm);
}

.message-bubble--user .message-bubble__timestamp {
  text-align: right;
}
```

---

### ConfidenceIndicator Component

**File:** `packages/ui/src/components/confidence-indicator/confidence-indicator.tsx`

```typescript
'use client';

import { Badge } from '../badge/badge';
import { ProgressBar } from '../progress-bar/progress-bar';
import { Tooltip } from '../tooltip/tooltip';
import './confidence-indicator.css';

export interface ConfidenceIndicatorProps {
  confidence: number; // 0.0 - 1.0
  variant?: 'minimal' | 'detailed';
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceIndicator({
  confidence,
  variant = 'detailed',
  showTooltip = true,
  size = 'md',
}: ConfidenceIndicatorProps) {
  const percentage = Math.round(confidence * 100);
  const level = getConfidenceLevel(confidence);
  const badgeVariant = getConfidenceBadgeVariant(confidence);

  const badge = (
    <Badge variant={badgeVariant} size={size}>
      {percentage}%
    </Badge>
  );

  if (variant === 'minimal') {
    return showTooltip ? (
      <Tooltip content={getTooltipMessage(confidence)}>{badge}</Tooltip>
    ) : (
      badge
    );
  }

  // Detailed variant
  return (
    <div className={`confidence-indicator confidence-indicator--${size}`}>
      <div className="confidence-indicator__header">
        <span className="confidence-indicator__label">Confidence</span>
        {showTooltip ? (
          <Tooltip content={getTooltipMessage(confidence)}>{badge}</Tooltip>
        ) : (
          badge
        )}
      </div>

      <ProgressBar
        value={percentage}
        max={100}
        variant={badgeVariant as any}
        size={size}
        showLabel={false}
      />

      <span className="confidence-indicator__level">{level}</span>
    </div>
  );
}

function getConfidenceLevel(confidence: number): string {
  if (confidence >= 0.8) return 'Very Confident';
  if (confidence >= 0.5) return 'Confident';
  if (confidence >= 0.3) return 'Learning';
  return 'Uncertain';
}

function getConfidenceBadgeVariant(confidence: number): 'success' | 'warning' | 'info' | 'default' {
  if (confidence >= 0.8) return 'success';
  if (confidence >= 0.5) return 'info';
  if (confidence >= 0.3) return 'warning';
  return 'default';
}

function getTooltipMessage(confidence: number): string {
  if (confidence >= 0.8) {
    return 'Very Confident - AI will auto-fill this preference';
  }
  if (confidence >= 0.5) {
    return 'Confident - AI will auto-suggest this preference';
  }
  if (confidence >= 0.3) {
    return 'Learning - AI is still learning this preference';
  }
  return 'Uncertain - Not enough data to be confident';
}
```

**CSS:** `packages/ui/src/components/confidence-indicator/confidence-indicator.css`

```css
.confidence-indicator {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.confidence-indicator__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.confidence-indicator__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.confidence-indicator__level {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-align: right;
}

/* Size variants */
.confidence-indicator--sm {
  font-size: 0.75rem;
}

.confidence-indicator--md {
  font-size: 0.875rem;
}

.confidence-indicator--lg {
  font-size: 1rem;
}
```

---

## Testing Strategy

### Unit Tests

**ChatInterface Tests:**
```typescript
describe('ChatInterface', () => {
  it('should render empty state when no messages', () => {
    render(<ChatInterface messages={[]} onSendMessage={jest.fn()} />);
    expect(screen.getByText(/Start a Conversation/i)).toBeInTheDocument();
  });

  it('should send message on Enter key', async () => {
    const onSend = jest.fn();
    render(<ChatInterface messages={[]} onSendMessage={onSend} />);

    const input = screen.getByPlaceholderText(/Type a message/i);
    await userEvent.type(input, 'Hello{Enter}');

    expect(onSend).toHaveBeenCalledWith('Hello');
  });

  it('should not send empty messages', async () => {
    const onSend = jest.fn();
    render(<ChatInterface messages={[]} onSendMessage={onSend} />);

    const button = screen.getByRole('button', { name: /Send/i });
    await userEvent.click(button);

    expect(onSend).not.toHaveBeenCalled();
  });

  it('should disable input while loading', () => {
    render(<ChatInterface messages={[]} onSendMessage={jest.fn()} isLoading />);

    const input = screen.getByPlaceholderText(/Type a message/i);
    const button = screen.getByRole('button', { name: /Send/i });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});
```

**MessageBubble Tests:**
```typescript
describe('MessageBubble', () => {
  it('should render user message right-aligned', () => {
    const message: Message = {
      id: '1',
      role: 'user',
      content: 'Hello',
      timestamp: new Date(),
    };

    const { container } = render(<MessageBubble {...message} />);
    expect(container.querySelector('.message-bubble--user')).toBeInTheDocument();
  });

  it('should render AI message left-aligned with avatar', () => {
    const message: Message = {
      id: '2',
      role: 'assistant',
      content: 'Hi there!',
      timestamp: new Date(),
    };

    render(<MessageBubble {...message} />);
    expect(screen.getByText('AI')).toBeInTheDocument(); // Avatar fallback
  });

  it('should render suggestions as chips', () => {
    const message: Message = {
      id: '3',
      role: 'assistant',
      content: 'Your usual?',
      timestamp: new Date(),
      suggestions: [
        { id: 's1', text: 'cappuccino', confidence: 0.8 },
      ],
    };

    render(<MessageBubble {...message} />);
    expect(screen.getByText('cappuccino')).toBeInTheDocument();
  });

  it('should format relative time correctly', () => {
    const now = new Date();
    const message: Message = {
      id: '4',
      role: 'user',
      content: 'Test',
      timestamp: new Date(now.getTime() - 30000), // 30 seconds ago
    };

    render(<MessageBubble {...message} />);
    expect(screen.getByText(/30s ago/i)).toBeInTheDocument();
  });
});
```

**ConfidenceIndicator Tests:**
```typescript
describe('ConfidenceIndicator', () => {
  it('should display percentage correctly', () => {
    render(<ConfidenceIndicator confidence={0.75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should show correct confidence level', () => {
    const { rerender } = render(<ConfidenceIndicator confidence={0.9} />);
    expect(screen.getByText('Very Confident')).toBeInTheDocument();

    rerender(<ConfidenceIndicator confidence={0.6} />);
    expect(screen.getByText('Confident')).toBeInTheDocument();

    rerender(<ConfidenceIndicator confidence={0.4} />);
    expect(screen.getByText('Learning')).toBeInTheDocument();

    rerender(<ConfidenceIndicator confidence={0.2} />);
    expect(screen.getByText('Uncertain')).toBeInTheDocument();
  });

  it('should render minimal variant without progress bar', () => {
    const { container } = render(<ConfidenceIndicator confidence={0.8} variant="minimal" />);
    expect(container.querySelector('.progress-bar')).not.toBeInTheDocument();
  });

  it('should show tooltip on hover', async () => {
    render(<ConfidenceIndicator confidence={0.85} showTooltip />);

    const badge = screen.getByText('85%');
    await userEvent.hover(badge);

    expect(screen.getByText(/Very Confident - AI will auto-fill/i)).toBeInTheDocument();
  });
});
```

---

## Integration with Fidus Memory Frontend

### PreferenceViewer Component (Using Existing + New Components)

```typescript
// packages/web/app/fidus-memory/components/preference-viewer.tsx

'use client';

import { Stack } from '@fidus/ui';
import { DetailCard } from '@fidus/ui';
import { Divider } from '@fidus/ui';
import { ConfidenceIndicator } from '@fidus/ui';
import { EmptyCard } from '@fidus/ui';

interface Preference {
  id: string;
  domain: string;
  key: string;
  value: string;
  confidence: number;
  learned_at: string;
  reinforcement_count: number;
}

interface PreferenceViewerProps {
  preferences: Preference[];
}

export function PreferenceViewer({ preferences }: PreferenceViewerProps) {
  if (preferences.length === 0) {
    return (
      <EmptyCard
        title="No Preferences Yet"
        message="Start chatting with Fidus Memory to teach it about your preferences"
        icon="🧠"
      />
    );
  }

  // Group by domain
  const grouped = preferences.reduce((acc, pref) => {
    if (!acc[pref.domain]) {
      acc[pref.domain] = [];
    }
    acc[pref.domain].push(pref);
    return acc;
  }, {} as Record<string, Preference[]>);

  return (
    <Stack spacing="lg">
      <div>
        <h2 className="text-xl font-semibold">Learned Preferences</h2>
        <p className="text-sm text-gray-600 mt-1">
          {preferences.length} preferences across {Object.keys(grouped).length} domains
        </p>
      </div>

      <Divider />

      {Object.entries(grouped).map(([domain, prefs]) => (
        <Stack key={domain} spacing="md">
          <h3 className="text-lg font-medium capitalize">{domain}</h3>

          {prefs.map((pref) => (
            <DetailCard
              key={pref.id}
              title={pref.key}
              description={pref.value}
            >
              <ConfidenceIndicator
                confidence={pref.confidence}
                variant="detailed"
                size="sm"
              />

              <p className="text-xs text-gray-500 mt-2">
                Learned {new Date(pref.learned_at).toLocaleDateString()} •
                Reinforced {pref.reinforcement_count}x
              </p>
            </DetailCard>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
```

---

## Summary

### Components to Add to @fidus/ui

| Component | LOC (est.) | Priority | Status |
|-----------|-----------|----------|--------|
| **ChatInterface** | ~150 | High | ⏳ TODO |
| **MessageBubble** | ~100 | High | ⏳ TODO |
| **ConfidenceIndicator** | ~80 | Medium | ⏳ TODO |

**Total New Code:** ~330 lines (component logic + styles + tests)

### Timeline

- **Week 2 Day 1-2:** Create MessageBubble + tests
- **Week 2 Day 3-4:** Create ChatInterface + tests
- **Week 2 Day 5:** Create ConfidenceIndicator + tests
- **Week 3 Day 1:** Integration with Fidus Memory frontend
- **Week 3 Day 2:** Polish and bug fixes

---

## Next Steps

1. ✅ **Implementation Plan Created** (this document)
2. ⏳ **Create Component Branch** - `feature/fidus-memory-chat-components`
3. ⏳ **Implement MessageBubble** - Start with simplest component
4. ⏳ **Implement ChatInterface** - Build on MessageBubble
5. ⏳ **Implement ConfidenceIndicator** - Reuse existing Badge + ProgressBar
6. ⏳ **Write Tests** - Unit tests for each component (>80% coverage)
7. ⏳ **Update @fidus/ui README** - Document new components
8. ⏳ **Publish New Version** - @fidus/ui v1.1.0

---

**End of UI Component Analysis**

**Related Documents:**
- [Fidus Memory Implementation Plan](./fidus-memory-implementation-plan.md)
- [@fidus/ui README](../packages/ui/README.md)
- [AI-Driven UI Paradigm](./ux-ui-design/00-ai-driven-ui-paradigm.md)
