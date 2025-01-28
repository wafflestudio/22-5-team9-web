import type { Conversation } from '../../types/message';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center p-4 hover:bg-gray-50 w-full ${
        isActive ? 'bg-gray-100' : ''
      }`}
    >
      <img
        src={
          conversation.profileImage.length > 0
            ? conversation.profileImage
            : '/default-avatar.png'
        }
        alt={conversation.username}
        className="w-12 h-12 rounded-full mr-4"
      />
      <div className="flex-1 text-left">
        <h3 className="font-semibold">{conversation.username}</h3>
        {conversation.lastMessage != null && (
          <p className="text-sm text-gray-500 truncate">
            {conversation.lastMessage.text}
          </p>
        )}
      </div>
      {conversation.unreadCount > 0 && (
        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-2">
          {conversation.unreadCount}
        </span>
      )}
    </button>
  );
}
