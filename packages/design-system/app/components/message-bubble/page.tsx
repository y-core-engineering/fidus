'use client';

import { MessageBubble, Link, Stack, type Message } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { Check, X } from 'lucide-react';

export default function MessageBubblePage() {
  const props = [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Unique identifier for the message',
    },
    {
      name: 'role',
      type: "'user' | 'assistant'",
      required: true,
      description: 'The role of the message sender (affects alignment and styling)',
    },
    {
      name: 'content',
      type: 'string',
      required: true,
      description: 'The text content of the message',
    },
    {
      name: 'timestamp',
      type: 'Date',
      required: true,
      description: 'When the message was sent (displayed as relative time)',
    },
    {
      name: 'avatar',
      type: '{ src?: string; fallback: string }',
      required: false,
      description: 'Avatar configuration with optional image source and fallback text',
    },
    {
      name: 'suggestions',
      type: 'Suggestion[]',
      required: false,
      description: 'Array of AI-suggested preference chips (only shown for assistant messages)',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      description: 'Additional CSS classes to apply',
    },
  ];

  const userMessage: Message = {
    id: '1',
    role: 'user',
    content: 'I always have cappuccino in the morning',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    avatar: { fallback: 'You' },
  };

  const assistantMessage: Message = {
    id: '2',
    role: 'assistant',
    content: "Got it! I'll remember that you prefer cappuccino in the morning.",
    timestamp: new Date(Date.now() - 240000), // 4 minutes ago
    avatar: { fallback: 'AI' },
  };

  const messageWithSuggestions: Message = {
    id: '3',
    role: 'assistant',
    content: 'Based on our conversation, I noticed some preferences.',
    timestamp: new Date(Date.now() - 60000), // 1 minute ago
    avatar: { fallback: 'AI' },
    suggestions: [
      {
        id: 'sug-1',
        text: 'cappuccino',
        confidence: 0.85,
        onAccept: () => console.log('Accepted: cappuccino'),
        onReject: () => console.log('Rejected: cappuccino'),
      },
      {
        id: 'sug-2',
        text: 'morning',
        confidence: 0.72,
        onAccept: () => console.log('Accepted: morning'),
        onReject: () => console.log('Rejected: morning'),
      },
    ],
  };

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Message Bubble</h1>
      <p className="lead">
        A chat message component with role-based alignment, avatar, timestamp, and optional AI suggestion chips for learning user preferences.
      </p>

      <h2>Roles</h2>
      <p>Messages are aligned based on their role: user messages on the right, assistant messages on the left.</p>

      <h3>User Message</h3>
      <ComponentPreview
        code={`<MessageBubble
  id="1"
  role="user"
  content="I always have cappuccino in the morning"
  timestamp={new Date()}
  avatar={{ fallback: 'You' }}
/>`}
      >
        <div className="max-w-lg">
          <MessageBubble {...userMessage} />
        </div>
      </ComponentPreview>

      <h3>Assistant Message</h3>
      <ComponentPreview
        code={`<MessageBubble
  id="2"
  role="assistant"
  content="Got it! I'll remember that."
  timestamp={new Date()}
  avatar={{ fallback: 'AI' }}
/>`}
      >
        <div className="max-w-lg">
          <MessageBubble {...assistantMessage} />
        </div>
      </ComponentPreview>

      <h2>Suggestions</h2>
      <p>
        Assistant messages can include suggestion chips with confidence scores. Users can accept or reject these suggestions to help the AI learn their preferences.
      </p>

      <ComponentPreview
        code={`<MessageBubble
  id="3"
  role="assistant"
  content="Based on our conversation, I noticed some preferences."
  timestamp={new Date()}
  suggestions={[
    {
      id: 'sug-1',
      text: 'cappuccino',
      confidence: 0.85,
      onAccept: () => console.log('Accepted'),
      onReject: () => console.log('Rejected'),
    },
  ]}
/>`}
      >
        <div className="max-w-lg">
          <MessageBubble {...messageWithSuggestions} />
        </div>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>In chat interfaces for displaying individual messages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When building conversational UI with user and AI messages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For AI systems that learn user preferences through conversation</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Always provide meaningful avatar fallback text (2 characters work best)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Only show suggestions on assistant messages, never on user messages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep suggestion text concise (1-3 words)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use confidence scores between 0.0 and 1.0 to indicate certainty</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Uses semantic HTML with proper ARIA labels</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Suggestion accept/reject buttons have descriptive aria-labels</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Timestamps update automatically to show relative time</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Avatar fallback text is always visible even if image fails to load</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do's and Don'ts</h2>

      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <Check className="h-5 w-5" /> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use clear, concise message content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide avatar fallback text (2 characters recommended)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show suggestions only on assistant messages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use accurate confidence scores for suggestions</span>
            </li>
          </ul>
        </div>

        <div className="border-2 border-error rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <X className="h-5 w-5" /> Don't
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't show suggestions on user messages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use overly long suggestion text (keep it 1-3 words)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't forget to provide onAccept/onReject handlers for suggestions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use confidence scores outside 0.0-1.0 range</span>
            </li>
          </ul>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/chat-interface"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Chat Interface
          </h3>
          <p className="text-sm text-muted-foreground">
            Complete chat layout with message list and input
          </p>
        </Link>

        <Link
          href="/components/avatar"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Avatar
          </h3>
          <p className="text-sm text-muted-foreground">User avatar with fallback</p>
        </Link>

        <Link
          href="/components/chip"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Chip
          </h3>
          <p className="text-sm text-muted-foreground">
            Tag component used for suggestions
          </p>
        </Link>

        <Link
          href="/components/confidence-indicator"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Confidence Indicator
          </h3>
          <p className="text-sm text-muted-foreground">
            Visual ML confidence score display
          </p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/message-bubble/message-bubble.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/feed/"
              external
              showIcon
            >
              ARIA: Feed Pattern
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/for-developers">
              Installation guide
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
