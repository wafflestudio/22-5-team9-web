import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ConversationList } from '../components/dm/ConversationList';
import { MessageThread } from '../components/dm/MessageThread';
import MobileBar from '../components/layout/MobileBar';
import MobileHeader from '../components/layout/MobileHeader';
import SideBar from '../components/layout/SideBar';
import SearchModal from '../components/modals/SearchModal';
import { useSearch } from '../hooks/useSearch';

export default function MessagesPage() {
  const { userId } = useParams();
  const [activeUserId, setActiveUserId] = useState<number | null>(
    (userId != null) ? parseInt(userId) : null
  );
  const { isSearchOpen, setIsSearchOpen } = useSearch();

  useEffect(() => {
    if (userId != null) {
      setActiveUserId(parseInt(userId));
    }
  }, [userId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => { setIsSearchOpen(false); }}
      />
      
      <div className="flex-1 md:ml-64 flex flex-col">
        <div className="md:hidden">
          <MobileHeader />
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Conversations List */}
          <div className="w-full md:w-80 border-r bg-white">
            <ConversationList onSelectConversation={setActiveUserId} activeUserId={activeUserId} />
          </div>

          {/* Message Thread */}
          <div className="hidden md:flex flex-1 bg-white">
            {(activeUserId != null) ? (
              <MessageThread userId={activeUserId} />
            ) : (
              <div className="flex items-center justify-center w-full text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar and Mobile Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-0 md:top-0 md:right-auto md:w-64 bg-white border-t md:border-r md:border-t-0">
        <SideBar onSearchClick={() => { setIsSearchOpen(true); }} />
        <MobileBar />
      </div>
    </div>
  );
}
