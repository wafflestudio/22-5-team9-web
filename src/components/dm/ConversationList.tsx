
import { useState } from 'react';

import { useConversations } from '../../hooks/useConversations';
import type { Conversation } from '../../types/message';
import { LoadingSpinner } from '../shared/LoadingStates';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  onSelectConversation: (userId: number) => void;
}

export function ConversationList({ onSelectConversation }: ConversationListProps) {
  const { conversations, loading, error } = useConversations();
  const [activeUserId, setActiveUserId] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (error != null) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No conversations yet
      </div>
    );
  }

  const handleConversationClick = (conversation: Conversation) => {
    setActiveUserId(conversation.userId);
    onSelectConversation(conversation.userId);
  };

  return (
    <div className="flex flex-col">
      {conversations.map((conversation) => (
        <ConversationItem 
          key={conversation.userId}
          conversation={conversation}
          isActive={conversation.userId === activeUserId}
          onClick={() => { handleConversationClick(conversation); }}
        />
      ))}
    </div>
  );
}