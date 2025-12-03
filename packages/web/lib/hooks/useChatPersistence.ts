/**
 * Chat Persistence Hook
 *
 * Persists chat messages to sessionStorage so they survive navigation
 * within the same browser session. Messages are cleared when the tab is closed.
 */

import { useState, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface SerializedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO string for serialization
  status?: 'sending' | 'sent' | 'error';
}

const STORAGE_KEY = 'fidus_chat_messages';

/**
 * Custom hook for persisting chat messages across navigation
 */
export function useChatPersistence() {
  const [messages, setMessagesInternal] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load messages from sessionStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: SerializedMessage[] = JSON.parse(stored);
        // Convert ISO strings back to Date objects
        const restored: Message[] = parsed.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          // Reset any 'sending' status to 'error' (stale from previous session)
          status: msg.status === 'sending' ? 'error' : msg.status,
        }));
        setMessagesInternal(restored);
      }
    } catch (error) {
      console.error('Failed to restore chat messages:', error);
      // Clear corrupted data
      sessionStorage.removeItem(STORAGE_KEY);
    }

    setIsInitialized(true);
  }, []);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    try {
      // Convert Date objects to ISO strings for serialization
      const serialized: SerializedMessage[] = messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
      }));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.error('Failed to persist chat messages:', error);
    }
  }, [messages, isInitialized]);

  // Wrapper for setMessages that handles persistence
  const setMessages = useCallback(
    (updater: Message[] | ((prev: Message[]) => Message[])) => {
      setMessagesInternal(updater);
    },
    []
  );

  // Clear all messages (useful for "new chat" functionality)
  const clearMessages = useCallback(() => {
    setMessagesInternal([]);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    messages,
    setMessages,
    clearMessages,
    isInitialized,
  };
}
