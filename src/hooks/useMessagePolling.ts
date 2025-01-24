import { useEffect, useRef } from 'react';

import { dmApi } from '../api/dm';
import type { Message } from '../types/message';

export function useMessagePolling(
  userId: number | null,
  onNewMessages: (messages: Message[]) => void,
  onError?: (error: Error) => void
) {
  const POLLING_INTERVAL = 3000;
  const lastMessageTimestamp = useRef<string | null>(null);

  useEffect(() => {
    // Skip polling if no valid userId
    if (userId === null) return;

    const pollMessages = async () => {
      try {
        const [sent, received] = await Promise.all([
          dmApi.getSentMessages(),
          dmApi.getReceivedMessages()
        ]);

        const conversationMessages = [...sent, ...received]
          .filter(msg => {
            const isRelevantParticipant = msg.sender_id === userId || msg.receiver_id === userId;
            const isNewMessage = lastMessageTimestamp.current === null || 
              new Date(msg.creation_date) > new Date(lastMessageTimestamp.current);
            return isRelevantParticipant && isNewMessage;
          });

        if (conversationMessages.length > 0) {
          const latestMessageDate = conversationMessages.reduce(
            (latest, msg) => {
              const msgDate = new Date(msg.creation_date);
              return msgDate > new Date(latest) ? msg.creation_date : latest;
            },
            conversationMessages[0]?.creation_date ?? new Date().toISOString()
          );
          
          lastMessageTimestamp.current = latestMessageDate;
          onNewMessages(conversationMessages);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to poll messages');
        console.error('Error polling messages:', err);
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