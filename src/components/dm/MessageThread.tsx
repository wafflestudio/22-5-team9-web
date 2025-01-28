import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import { useConversation } from '../../hooks/useConversation';
import { ErrorBanner } from '../shared/ErrorBanner';
import { LoadingSpinner, MessageSkeleton } from '../shared/LoadingStates';
import { MessageInput } from './MessageInput';
import { MessageItem } from './MessageItem';

interface MessageThreadProps {
  userId: number;
}

export function MessageThread({ userId }: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0, rootMargin: '100px' });
  
  const {
    messages,
    loading,
    error,
    hasMore,
    sending,
    sendMessage,
    loadMore,
    markAsRead
  } = useConversation(userId);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!loading && !sending) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, sending]);

  // Load more messages when scrolling up
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore().catch((err: unknown) => { console.error(err); });
    }
  }, [inView, hasMore, loading, loadMore]);

  // Mark messages as read
  useEffect(() => {
    const unreadMessages = messages
      .filter(msg => (msg.read === false) && msg.receiver_id === userId)
      .map(msg => msg.message_id);

    if (unreadMessages.length > 0) {
      markAsRead(unreadMessages).catch((err: unknown) => { console.error(err); });
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
      {(error != null) && (
        <ErrorBanner 
          message={error}
          onDismiss={() => {}} // Add error dismissal logic if needed
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
          } catch {
            // Error is handled by the hook and displayed in the error banner
          }
        }}
        sending={sending}
      />
    </div>
  );
}