import { useCallback, useEffect, useState } from 'react';

import { dmApi } from '../api/dm';
import type { Conversation, Message } from '../types/message';
import { processMessagesIntoConversations } from '../types/message';
import { useMessagePolling } from './useMessagePolling';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Get current user ID on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token == null) {
      setError('No access token');
      setLoading(false);
      return;
    }

    fetch('https://waffle-instaclone.kro.kr/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        try {
          return JSON.parse(text) as { user_id: number };
        } catch {
          console.error('Failed to parse response:', text);
          throw new Error('Invalid response format');
        }
      })
      .then((data) => {
        setCurrentUserId(data.user_id);
      })
      .catch((err: unknown) => {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
        setLoading(false);
      });
  }, []);

  // Load conversations
  useEffect(() => {
    if (currentUserId == null) return;

    const loadConversations = async () => {
      try {
        setLoading(true);
        const [sent, received] = await Promise.all([
          dmApi.getSentMessages(),
          dmApi.getReceivedMessages()
        ]);
        
        const processedConversations = processMessagesIntoConversations(
          sent,
          received,
          currentUserId
        );
        
        const conversationsWithUsers = await Promise.all(
          processedConversations.map(async (conv) => {
            try {
              const response = await fetch(`https://waffle-instaclone.kro.kr/api/user/${conv.userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}` }
              });
              if (!response.ok) throw new Error('Failed to fetch user data');
              const userData = await response.json() as { username: string, profile_image: string };
              return {
                ...conv,
                username: userData.username,
                profileImage: userData.profile_image
              };
            } catch (err) {
              console.warn(`Could not load details for user ${conv.userId}:`, err);
              return conv;
            }
          })
        );

        setConversations(conversationsWithUsers);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    void loadConversations();
  }, [currentUserId]);

  // Handle new messages from polling
  const handleNewMessages = useCallback((newMessages: Message[]) => {
    if (currentUserId == null) return;

    setConversations(prevConversations => {
      const updatedConversations = [...prevConversations];

      newMessages.forEach(msg => {
        const partnerId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
        const conversationIndex = updatedConversations.findIndex(c => c.userId === partnerId);

        if (conversationIndex >= 0) {
          // Update existing conversation
          const conversation = updatedConversations[conversationIndex];
          if (conversation != null) {
            if (!(msg.read ?? false) && msg.receiver_id === currentUserId) {
              conversation.unreadCount += 1;
            }
            conversation.lastMessage = msg;
          }
        } else {
          // Create new conversation
          updatedConversations.push({
            userId: partnerId,
            username: `User ${partnerId}`, // Will be updated with real data
            profileImage: '', // Will be updated with real data
            lastMessage: msg,
            unreadCount: msg.receiver_id === currentUserId && !(msg.read ?? false) ? 1 : 0
          });
        }
      });

      return updatedConversations.sort((a, b) => {
        const dateA = a.lastMessage?.creation_date ?? '';
        const dateB = b.lastMessage?.creation_date ?? '';
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    });
  }, [currentUserId]);

  // Set up message polling
  useMessagePolling(currentUserId, handleNewMessages, (err) => {
    console.error('Polling error:', err);
  });

  return { conversations, loading, error };
}