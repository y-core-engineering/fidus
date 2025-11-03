import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MessageBubble, type Message, type Suggestion } from './message-bubble';

describe('MessageBubble', () => {
  const baseUserMessage: Message = {
    id: '1',
    role: 'user',
    content: 'Hello, how are you?',
    timestamp: new Date('2025-11-03T10:00:00'),
  };

  const baseAssistantMessage: Message = {
    id: '2',
    role: 'assistant',
    content: 'I am doing well, thank you!',
    timestamp: new Date('2025-11-03T10:01:00'),
  };

  describe('Rendering', () => {
    it('should render user message correctly', () => {
      render(<MessageBubble {...baseUserMessage} />);

      expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
      expect(screen.getByTestId('message-bubble-1')).toBeInTheDocument();
    });

    it('should render assistant message correctly', () => {
      render(<MessageBubble {...baseAssistantMessage} />);

      expect(screen.getByText('I am doing well, thank you!')).toBeInTheDocument();
      expect(screen.getByTestId('message-bubble-2')).toBeInTheDocument();
    });

    it('should render user message with right alignment class', () => {
      render(<MessageBubble {...baseUserMessage} />);

      const messageElement = screen.getByTestId('message-bubble-1');
      expect(messageElement.className).toContain('flex-row-reverse');
    });

    it('should render assistant message with left alignment class', () => {
      render(<MessageBubble {...baseAssistantMessage} />);

      const messageElement = screen.getByTestId('message-bubble-2');
      expect(messageElement.className).toContain('flex-row');
    });

    it('should render with custom avatar fallback', () => {
      const messageWithAvatar: Message = {
        ...baseAssistantMessage,
        avatar: {
          fallback: 'Bot',
        },
      };

      render(<MessageBubble {...messageWithAvatar} />);

      // Avatar component truncates fallback to first 2 chars: 'Bot' → 'BO'
      expect(screen.getByText('BO')).toBeInTheDocument();
    });

    it('should render with default fallback when avatar not provided', () => {
      render(<MessageBubble {...baseUserMessage} />);

      // Avatar component truncates fallback to first 2 chars: 'You' → 'YO'
      expect(screen.getByText('YO')).toBeInTheDocument();
    });
  });

  describe('Timestamp Formatting', () => {
    it('should display "Just now" for recent messages', () => {
      const recentMessage: Message = {
        ...baseUserMessage,
        timestamp: new Date(Date.now() - 5000), // 5 seconds ago
      };

      render(<MessageBubble {...recentMessage} />);

      expect(screen.getByText('Just now')).toBeInTheDocument();
    });

    it('should display seconds for messages under a minute old', () => {
      const message: Message = {
        ...baseUserMessage,
        timestamp: new Date(Date.now() - 30000), // 30 seconds ago
      };

      render(<MessageBubble {...message} />);

      expect(screen.getByText(/\d+s ago/)).toBeInTheDocument();
    });

    it('should display minutes for messages under an hour old', () => {
      const message: Message = {
        ...baseUserMessage,
        timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      };

      render(<MessageBubble {...message} />);

      expect(screen.getByText(/2m ago/)).toBeInTheDocument();
    });

    it('should display hours for messages under a day old', () => {
      const message: Message = {
        ...baseUserMessage,
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      };

      render(<MessageBubble {...message} />);

      expect(screen.getByText(/2h ago/)).toBeInTheDocument();
    });

    it('should display days for older messages', () => {
      const message: Message = {
        ...baseUserMessage,
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
      };

      render(<MessageBubble {...message} />);

      expect(screen.getByText(/2d ago/)).toBeInTheDocument();
    });
  });

  describe('Suggestions', () => {
    const suggestions: Suggestion[] = [
      {
        id: 'sug-1',
        text: 'cappuccino',
        confidence: 0.8,
        onAccept: vi.fn(),
        onReject: vi.fn(),
      },
      {
        id: 'sug-2',
        text: 'morning',
        confidence: 0.65,
        onAccept: vi.fn(),
        onReject: vi.fn(),
      },
    ];

    it('should render suggestions for assistant messages', () => {
      const messageWithSuggestions: Message = {
        ...baseAssistantMessage,
        suggestions,
      };

      render(<MessageBubble {...messageWithSuggestions} />);

      expect(screen.getByText(/cappuccino \(80%\)/)).toBeInTheDocument();
      expect(screen.getByText(/morning \(65%\)/)).toBeInTheDocument();
    });

    it('should not render suggestions for user messages', () => {
      const userMessageWithSuggestions: Message = {
        ...baseUserMessage,
        suggestions,
      };

      render(<MessageBubble {...userMessageWithSuggestions} />);

      expect(screen.queryByText(/cappuccino/)).not.toBeInTheDocument();
    });

    it('should call onAccept when accept button is clicked', () => {
      const onAccept = vi.fn();
      const messageWithSuggestions: Message = {
        ...baseAssistantMessage,
        suggestions: [
          {
            id: 'sug-1',
            text: 'cappuccino',
            confidence: 0.8,
            onAccept,
            onReject: vi.fn(),
          },
        ],
      };

      render(<MessageBubble {...messageWithSuggestions} />);

      const acceptButton = screen.getByTestId('accept-sug-1');
      fireEvent.click(acceptButton);

      expect(onAccept).toHaveBeenCalledTimes(1);
    });

    it('should call onReject when reject button is clicked', () => {
      const onReject = vi.fn();
      const messageWithSuggestions: Message = {
        ...baseAssistantMessage,
        suggestions: [
          {
            id: 'sug-1',
            text: 'cappuccino',
            confidence: 0.8,
            onAccept: vi.fn(),
            onReject,
          },
        ],
      };

      render(<MessageBubble {...messageWithSuggestions} />);

      const rejectButton = screen.getByTestId('reject-sug-1');
      fireEvent.click(rejectButton);

      expect(onReject).toHaveBeenCalledTimes(1);
    });

    it('should render accept button with correct aria-label', () => {
      const messageWithSuggestions: Message = {
        ...baseAssistantMessage,
        suggestions: [suggestions[0]],
      };

      render(<MessageBubble {...messageWithSuggestions} />);

      const acceptButton = screen.getByLabelText('Accept suggestion');
      expect(acceptButton).toBeInTheDocument();
    });

    it('should render reject button with correct aria-label', () => {
      const messageWithSuggestions: Message = {
        ...baseAssistantMessage,
        suggestions: [suggestions[0]],
      };

      render(<MessageBubble {...messageWithSuggestions} />);

      const rejectButton = screen.getByLabelText('Reject suggestion');
      expect(rejectButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper data-testid', () => {
      render(<MessageBubble {...baseUserMessage} />);

      expect(screen.getByTestId('message-bubble-1')).toBeInTheDocument();
    });

    it('should render action buttons as semantic buttons', () => {
      const messageWithSuggestions: Message = {
        ...baseAssistantMessage,
        suggestions: [
          {
            id: 'sug-1',
            text: 'test',
            confidence: 0.8,
            onAccept: vi.fn(),
            onReject: vi.fn(),
          },
        ],
      };

      const { container } = render(<MessageBubble {...messageWithSuggestions} />);

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      render(<MessageBubble {...baseUserMessage} className="custom-class" />);

      const messageElement = screen.getByTestId('message-bubble-1');
      expect(messageElement.className).toContain('custom-class');
    });
  });
});
