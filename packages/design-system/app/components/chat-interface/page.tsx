'use client';

import { ChatInterface, Link, type Message } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

export default function ChatInterfacePage() {
  const props = [
    {
      name: 'messages',
      type: 'Message[]',
      required: true,
      description: 'Array of messages to display in the chat',
    },
    {
      name: 'onSendMessage',
      type: '(content: string) => void | Promise<void>',
      required: true,
      description: 'Callback fired when user sends a message',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "'Type your message...'",
      required: false,
      description: 'Placeholder text for the message input',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      default: 'false',
      required: false,
      description: 'Show loading indicator and disable input',
    },
    {
      name: 'maxHeight',
      type: 'string',
      default: "'600px'",
      required: false,
      description: 'Maximum height of the message list area',
    },
    {
      name: 'emptyStateTitle',
      type: 'string',
      default: "'No messages yet'",
      required: false,
      description: 'Title shown when message list is empty',
    },
    {
      name: 'emptyStateMessage',
      type: 'string',
      default: "'Start a conversation...'",
      required: false,
      description: 'Message shown when message list is empty',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      description: 'Additional CSS classes to apply',
    },
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(Date.now() - 600000),
      avatar: { fallback: 'AI' },
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      avatar: { fallback: 'You' },
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand. Let me help you with that.',
        timestamp: new Date(),
        avatar: { fallback: 'AI' },
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Chat Interface</h1>
      <p className="lead">
        A complete chat interface with message list, auto-scroll, and textarea input. Handles Enter/Shift+Enter for sending messages.
      </p>

      <h2>Interactive Example</h2>
      <p>Try sending a message in the chat below:</p>

      <ComponentPreview
        code={`const [messages, setMessages] = useState<Message[]>([]);

const handleSend = async (content: string) => {
  const newMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content,
    timestamp: new Date(),
    avatar: { fallback: 'You' }
  };
  setMessages(prev => [...prev, newMessage]);
};

<ChatInterface
  messages={messages}
  onSendMessage={handleSend}
  placeholder="Type your message..."
/>`}
      >
        <div className="max-w-2xl">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder="Type your message..."
          />
        </div>
      </ComponentPreview>

      <h2>Empty State</h2>
      <p>When no messages exist, the chat shows an empty state with customizable text:</p>

      <ComponentPreview
        code={`<ChatInterface
  messages={[]}
  onSendMessage={handleSend}
  emptyStateTitle="Start a Conversation"
  emptyStateMessage="Send a message to begin chatting with the AI assistant."
/>`}
      >
        <div className="max-w-2xl">
          <ChatInterface
            messages={[]}
            onSendMessage={() => {}}
            emptyStateTitle="Start a Conversation"
            emptyStateMessage="Send a message to begin chatting with the AI assistant."
          />
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
              <span>For conversational AI interfaces</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Customer support chat systems</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Any real-time messaging interface</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Set isLoading={'{'}true{'}'} while waiting for AI responses</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Handle async onSendMessage callbacks properly</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide meaningful empty state messages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Adjust maxHeight based on available screen space</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Keyboard shortcuts</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span><strong>Enter</strong>: Send message</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span><strong>Shift + Enter</strong>: New line in message</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Textarea has descriptive aria-label</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Send button is properly labeled for screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Loading state provides visual feedback</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Auto-scrolls to latest message for better UX</span>
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
              <span>Show loading state while fetching AI responses</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Handle errors gracefully in onSendMessage</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide helpful empty state messages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Clear input after successful message send</span>
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
              <span>Don't allow sending empty messages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't forget to disable input during loading</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't ignore async errors in onSendMessage</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use overly aggressive maxHeight (consider mobile)</span>
            </li>
          </ul>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/message-bubble"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Message Bubble
          </h3>
          <p className="text-sm text-muted-foreground">
            Individual chat message component
          </p>
        </Link>

        <Link
          href="/components/text-area"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Text Area
          </h3>
          <p className="text-sm text-muted-foreground">
            Multi-line text input component
          </p>
        </Link>

        <Link
          href="/components/spinner"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Spinner
          </h3>
          <p className="text-sm text-muted-foreground">
            Loading indicator component
          </p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/chat-interface/chat-interface.tsx"
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
