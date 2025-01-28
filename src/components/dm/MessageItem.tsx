import { useState } from 'react';

import type { Message } from '../../types/message';

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  onDelete?: () => void;
}

export function MessageItem({
  message,
  isOwnMessage,
  onDelete,
}: MessageItemProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => {
        setShowActions(true);
      }}
      onMouseLeave={() => {
        setShowActions(false);
      }}
    >
      <div
        className={`relative max-w-[70%] px-4 py-2 rounded-lg ${
          isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
        }`}
      >
        <p>{message.text}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {new Date(message.creation_date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>

        {showActions && isOwnMessage && onDelete != null && (
          <button
            onClick={onDelete}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
