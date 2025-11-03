import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChatInterface } from './chat-interface';
import type { Message } from '../message-bubble';

describe('ChatInterface', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      role: 'user',
      content: 'Hello',
      timestamp: new Date('2025-11-03T10:00:00'),
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Hi there!',
      timestamp: new Date('2025-11-03T10:01:00'),
    },
  ];

  describe('Rendering', () => {
    it('should render chat interface', () => {
      const onSendMessage = vi.fn();
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
      expect(screen.getByTestId('message-list')).toBeInTheDocument();
      expect(screen.getByTestId('input-area')).toBeInTheDocument();
    });

    it('should render empty state when no messages', () => {
      const onSendMessage = vi.fn();
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      expect(screen.getByText('Start chatting')).toBeInTheDocument();
    });

    it('should render custom empty state title and message', () => {
      const onSendMessage = vi.fn();
      render(
        <ChatInterface
          messages={[]}
          onSendMessage={onSendMessage}
          emptyStateTitle="Custom Title"
          emptyStateMessage="Custom Message"
        />
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Message')).toBeInTheDocument();
    });

    it('should render messages when provided', () => {
      const onSendMessage = vi.fn();
      render(<ChatInterface messages={mockMessages} onSendMessage={onSendMessage} />);

      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });

    it('should render loading indicator when isLoading is true', () => {
      const onSendMessage = vi.fn();
      render(
        <ChatInterface messages={mockMessages} onSendMessage={onSendMessage} isLoading={true} />
      );

      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
      expect(screen.getByText('Thinking...')).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      const onSendMessage = vi.fn();
      render(
        <ChatInterface
          messages={[]}
          onSendMessage={onSendMessage}
          placeholder="Custom placeholder"
        />
      );

      const textarea = screen.getByTestId('message-input') as HTMLTextAreaElement;
      expect(textarea.placeholder).toBe('Custom placeholder');
    });
  });

  describe('User Input', () => {
    it('should update textarea value when typing', () => {
      const onSendMessage = vi.fn();
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      const textarea = screen.getByTestId('message-input') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Test message' } });

      expect(textarea.value).toBe('Test message');
    });

    it('should disable send button when input is empty', () => {
      const onSendMessage = vi.fn();
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      const sendButton = screen.getByTestId('send-button');
      expect(sendButton).toBeDisabled();
    });

    it('should enable send button when input has text', () => {
      const onSendMessage = vi.fn();
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      const textarea = screen.getByTestId('message-input');
      const sendButton = screen.getByTestId('send-button');

      fireEvent.change(textarea, { target: { value: 'Test message' } });

      expect(sendButton).not.toBeDisabled();
    });

    it('should disable inputs when isLoading is true', () => {
      const onSendMessage = vi.fn();
      render(
        <ChatInterface messages={[]} onSendMessage={onSendMessage} isLoading={true} />
      );

      const textarea = screen.getByTestId('message-input');
      const sendButton = screen.getByTestId('send-button');

      expect(textarea).toBeDisabled();
      expect(sendButton).toBeDisabled();
    });
  });

  describe('Sending Messages', () => {
    it('should call onSendMessage when send button is clicked', async () => {
      const onSendMessage = vi.fn();
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      const textarea = screen.getByTestId('message-input');
      const sendButton = screen.getByTestId('send-button');

      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(onSendMessage).toHaveBeenCalledWith('Test message');
      });
    });

    it('should clear input after sending message', async () => {
      const onSendMessage = vi.fn();
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      const textarea = screen.getByTestId('message-input') as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-button');

      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(textarea.value).toBe('');
      });
    });

    it('should not send empty messages', async () => {
      const onSendMessage = vi.fn();
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      const sendButton = screen.getByTestId('send-button');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(onSendMessage).not.toHaveBeenCalled();
      });
    });

    it('should not send messages with only whitespace', async () => {
      const onSendMessage = vi.fn();
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      const textarea = screen.getByTestId('message-input');
      const sendButton = screen.getByTestId('send-button');

      fireEvent.change(textarea, { target: { value: '   ' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(onSendMessage).not.toHaveBeenCalled();
      });
    });

    it('should send message on Enter key', async () => {
      const onSendMessage = vi.fn();
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      const textarea = screen.getByTestId('message-input');

      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

      await waitFor(() => {
        expect(onSendMessage).toHaveBeenCalledWith('Test message');
      });
    });

    it('should not send message on Shift+Enter', async () => {
      const onSendMessage = vi.fn();
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      const textarea = screen.getByTestId('message-input');

      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

      // Give it a moment to potentially trigger
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(onSendMessage).not.toHaveBeenCalled();
    });

    it('should handle async onSendMessage', async () => {
      const onSendMessage = vi.fn().mockResolvedValue(undefined);
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      const textarea = screen.getByTestId('message-input');
      const sendButton = screen.getByTestId('send-button');

      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(onSendMessage).toHaveBeenCalledWith('Test message');
      });
    });

    it('should restore input value on send error', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const onSendMessage = vi.fn().mockRejectedValue(new Error('Send failed'));
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      const textarea = screen.getByTestId('message-input') as HTMLTextAreaElement;
      const sendButton = screen.getByTestId('send-button');

      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(textarea.value).toBe('Test message');
      });

      consoleError.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on textarea', () => {
      const onSendMessage = vi.fn();
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      const textarea = screen.getByLabelText('Message input');
      expect(textarea).toBeInTheDocument();
    });

    it('should have aria-label on send button', () => {
      const onSendMessage = vi.fn();
      render(<ChatInterface messages={[]} onSendMessage={onSendMessage} />);

      const sendButton = screen.getByLabelText('Send message');
      expect(sendButton).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const onSendMessage = vi.fn();
      render(
        <ChatInterface messages={[]} onSendMessage={onSendMessage} className="custom-class" />
      );

      const chatInterface = screen.getByTestId('chat-interface');
      expect(chatInterface.className).toContain('custom-class');
    });

    it('should apply custom maxHeight', () => {
      const onSendMessage = vi.fn();
      render(
        <ChatInterface messages={[]} onSendMessage={onSendMessage} maxHeight="800px" />
      );

      const messageList = screen.getByTestId('message-list');
      expect(messageList.style.maxHeight).toBe('800px');
    });
  });
});
