import { useNavigate } from 'react-router-dom';

import { useConversations } from '../../hooks/useConversations';
import type { Conversation } from '../../types/message';
import { LoadingSpinner } from '../shared/LoadingStates';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  onSelectConversation: (userId: number) => void;
  activeUserId?: number | null;
}

export function ConversationList({
  onSelectConversation,
  activeUserId
}: ConversationListProps) {
  const navigate = useNavigate();
  const { conversations, loading, error } = useConversations();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (error != null) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">No conversations yet</div>
    );
  }

  const handleConversationClick = (conversation: Conversation) => {
    onSelectConversation(conversation.userId);
    void navigate(`/messages/${conversation.userId}`, { replace: true });
  };

  return (
    <div className="flex flex-col">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.userId}
          conversation={conversation}
          isActive={conversation.userId === activeUserId}
          onClick={() => {
            handleConversationClick(conversation);
          }}
        />
      ))}
    </div>
  );
}
