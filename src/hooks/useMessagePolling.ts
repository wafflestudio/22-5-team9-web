import { useEffect, useRef } from 'react';

import { dmApi } from '../api/dm';
import type { Message } from '../types/message';
import { authenticatedFetch } from '../utils/auth';

export function useMessagePolling(
  userId: number | null,
  onNewMessages: (messages: Message[]) => void,
  onError?: (error: Error) => void,
) {
  const POLLING_INTERVAL = 3000;
  const lastMessageTimestamp = useRef<string | null>(null);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await authenticatedFetch('https://waffle-instaclone.kro.kr/api/user/profile');
        if (!response.ok) {
          throw new Error('Session validation failed');
        }
        return true;
      } catch (error) {
        console.error('Session validation error:', error);
        return false;
      }
    };
    // Skip polling if no valid userId
    if (userId === null) return;

    const pollMessages = async () => {
      try {
        // First validate session
        const isSessionValid = await validateSession();
        if (!isSessionValid) {
          throw new Error('Invalid session');
        }

        const [sent, received] = await Promise.all([
          dmApi.getSentMessages(),
          dmApi.getReceivedMessages(),
        ]);

        const conversationMessages = [...sent, ...received].filter((msg) => {
          const isNewMessage =
            lastMessageTimestamp.current === null ||
            new Date(msg.creation_date) >
              new Date(lastMessageTimestamp.current);
          return isNewMessage;
        });

        if (conversationMessages.length > 0) {
          const latestMessageDate = conversationMessages.reduce(
            (latest, msg) => {
              const msgDate = new Date(msg.creation_date);
              return msgDate > new Date(latest) ? msg.creation_date : latest;
            },
            conversationMessages[0]?.creation_date ?? new Date().toISOString(),
          );

          lastMessageTimestamp.current = latestMessageDate;
          onNewMessages(conversationMessages);
        }
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error('Failed to poll messages');
        console.error('Error polling messages:', err);
        // Check if the error is authentication related
        if (err.message.includes('token') || err.message.includes('auth') || err.message.includes('session')) {
          // Redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('isLoggedIn');
          window.location.href = '/';
        }
        onError?.(err);
      }
    };

    // Initial poll
    void pollMessages();

    // Set up polling interval
    const intervalId = setInterval(() => void pollMessages(), POLLING_INTERVAL);

    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [userId, onNewMessages, onError]);
}
