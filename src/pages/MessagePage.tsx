import { Plus,Search } from 'lucide-react';
import { useState } from 'react';

import { searchUsers } from '../api/search';
import { ConversationList } from '../components/dm/ConversationList';
import { MessageThread } from '../components/dm/MessageThread';
import type { UserProfile } from '../types/user';

export default function MessagesPage() {
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query: string) => {
    if (query.length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const results = await searchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleUserSelect = (userId: number) => {
    setActiveUserId(userId);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            <button
              onClick={() => { setShowSearch(true); }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
          {showSearch && (
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  void handleSearch(e.target.value);
                }}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {showSearch && (searchQuery.length > 0) ? (
          <div className="flex-1 overflow-y-auto">
            {searching ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="divide-y">
                {searchResults.map((user) => (user != null) && (
                  <button
                    key={user.user_id}
                    onClick={() => { handleUserSelect(user.user_id); }}
                    className="w-full p-4 hover:bg-gray-50 flex items-center space-x-3 text-left"
                  >
                    <img
                      src={`https://waffle-instaclone.kro.kr/${user.profile_image}`}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.full_name}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">No users found</div>
            )}
          </div>
        ) : (
          <ConversationList onSelectConversation={setActiveUserId} />
        )}
      </div>
      
      <div className="w-2/3">
        {(activeUserId != null) ? (
          <MessageThread userId={activeUserId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}