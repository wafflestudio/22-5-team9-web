import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import { useConversation } from '../../hooks/useConversation';
import { authenticatedFetch } from '../../utils/auth';
import { ErrorBanner } from '../shared/ErrorBanner';
import { LoadingSpinner, MessageSkeleton } from '../shared/LoadingStates';
import { MessageInput } from './MessageInput';
import { MessageItem } from './MessageItem';

interface MessageThreadProps {
  userId: number;
}

interface ProfileResponse {
  user_id: number;
  username: string;
  [key: string]: unknown;
}

export function MessageThread({ userId }: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const {
    messages,
    loading,
    error,
    hasMore,
    sending,
    sendMessage,
    loadMore,
    markAsRead,
  } = useConversation(userId);

  // Add session validation
  useEffect(() => {
    const validateSession = async () => {
      try {
        console.log('Validating session...');
        const token = localStorage.getItem('access_token');
        console.log('Current token:', token);
        
        const response = await authenticatedFetch('https://waffle-instaclone.kro.kr/api/user/profile');
        const data = (await response.json()) as ProfileResponse;
        console.log('Session validation response:', data);
        
        if (!response.ok) {
          throw new Error('Session validation failed');
        }
      } catch (err) {
        console.error('Session validation error:', err);
        // Redirect to login if validation fails
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/';
      }
    };

    void validateSession();
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!loading && !sending) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, sending]);

  // Load more messages when scrolling up
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore().catch((err: unknown) => {
        console.error('Error loading more messages:', err);
      });
    }
  }, [inView, hasMore, loading, loadMore]);

  // Mark messages as read
  useEffect(() => {
    const unreadMessages = messages
      .filter((msg) => msg.read === false && msg.receiver_id === userId)
      .map((msg) => msg.message_id);

    if (unreadMessages.length > 0) {
      markAsRead(unreadMessages).catch((err: unknown) => {
        console.error('Error marking messages as read:', err);
      });
    }
  }, [messages, userId, markAsRead]);

  if (loading && messages.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <MessageSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {error != null && (
        <ErrorBanner
          message={error}
          onDismiss={() => {
            window.location.reload();
          }}
        />
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {hasMore && (
          <div ref={loadMoreRef} className="h-8">
            {loading && <LoadingSpinner />}
          </div>
        )}

        {messages.map((message) => (
          <MessageItem
            key={message.message_id}
            message={message}
            isOwnMessage={message.sender_id === userId}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={async (text) => {
          try {
            await sendMessage(text);
          } catch (err) {
            console.error('Error sending message:', err);
            // Check if error is auth-related
            if (err instanceof Error && 
                (err.message.includes('token') || 
                 err.message.includes('auth') || 
                 err.message.includes('session'))) {
              window.location.href = '/';
            }
          }
        }}
        sending={sending}
      />
    </div>
  );
}
