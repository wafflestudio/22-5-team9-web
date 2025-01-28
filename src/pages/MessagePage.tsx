import { useState } from 'react';

import { ConversationList } from '../components/dm/ConversationList';
import { MessageThread } from '../components/dm/MessageThread';

export default function MessagesPage() {
  const [activeUserId, setActiveUserId] = useState<number | null>(null);

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r">
        <ConversationList onSelectConversation={setActiveUserId} />
      </div>
      <div className="w-2/3">
        {activeUserId != null ? (
          <MessageThread userId={activeUserId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
