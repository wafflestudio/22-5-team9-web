import { useCallback, useEffect, useState } from 'react';

import { dmApi } from '../api/dm';
import type { Message } from '../types/message';
import { useMessagePolling } from './useMessagePolling';

const MESSAGES_PER_PAGE = 20;

export function useConversation(recipientId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [sending, setSending] = useState(false);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const [sent, received] = await Promise.all([
          dmApi.getSentMessages(),
          dmApi.getReceivedMessages()
        ]);

        const conversationMessages = [...sent, ...received]
          .filter(msg => 
            msg.sender_id === recipientId || msg.receiver_id === recipientId
          )
          .sort((a, b) => 
            new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
          );

        const paginatedMessages = conversationMessages.slice(0, MESSAGES_PER_PAGE);
        setMessages(paginatedMessages);
        setHasMore(conversationMessages.length > MESSAGES_PER_PAGE);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    void loadMessages();
  }, [recipientId]);

  // Handle new messages from polling
  const handleNewMessages = useCallback((newMessages: Message[]) => {
    setMessages(prevMessages => {
      const messageMap = new Map([...prevMessages, ...newMessages]
        .map(msg => [msg.message_id, msg]));
      return Array.from(messageMap.values())
        .sort((a, b) => 
          new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
        );
    });
  }, []);

  // Set up message polling
  useMessagePolling(recipientId, handleNewMessages, (err) => {
    setError(err.message);
  });

  const loadMore = async () => {
    if (!hasMore || loading) return;
    
    try {
      setLoading(true);
      // Fetch only the next page of messages for this conversation
      const nextMessages = await dmApi.getConversationMessages({
        recipientId,
        offset: page * MESSAGES_PER_PAGE,
        limit: MESSAGES_PER_PAGE
      });

      setMessages(prev => [...prev, ...nextMessages]);
      setHasMore(nextMessages.length === MESSAGES_PER_PAGE);
      setPage(p => p + 1);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more messages');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text: string): Promise<void> => {
    try {
      setSending(true);
      const newMessage = await dmApi.sendMessage({
        receiver_id: recipientId,
        text
      });
      
      setMessages(prev => [newMessage, ...prev]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (messageIds: number[]): Promise<void> => {
    try {
      await dmApi.markMessagesAsRead(messageIds);
      
      // Update local message states
      setMessages(prev => prev.map(msg => 
        messageIds.includes(msg.message_id) ? { ...msg, read: true } : msg
      ));
    } catch (err) {
      console.error('Error marking messages as read:', err);
      // Don't surface this error to the user as it's not critical
    }
  };

  return {
    messages,
    loading,
    error,
    hasMore,
    sending,
    sendMessage,
    loadMore,
    markAsRead
  };
}