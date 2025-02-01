import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getExplorePosts } from '../api/post';
import { searchUsers } from '../api/search';
import MobileBar from '../components/layout/MobileBar';
import SideBar from '../components/layout/SideBar';
import SearchModal from '../components/modals/SearchModal';
import PostGrid from '../components/shared/PostGrid';
import { useSearch } from '../hooks/useSearch';
import type { Post } from '../types/post';
import type { UserProfile } from '../types/user';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const { isSearchOpen, setIsSearchOpen } = useSearch();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getExplorePosts();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching explore posts:', err);
      }
    };

    void fetchPosts();
  }, []);

  useEffect(() => {
    const searchDebounced = setTimeout(() => {
      if (searchTerm.length > 0) {
        setIsLoading(true);
        setError(null);
        void (async () => {
          try {
            const results = await searchUsers(searchTerm);
            if (Array.isArray(results)) {
              setSearchResults(results);
            } else {
              setSearchResults([]);
            }
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : 'An error occurred while searching',
            );
            setSearchResults([]);
          } finally {
            setIsLoading(false);
          }
        })();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => {
      clearTimeout(searchDebounced);
    };
  }, [searchTerm]);

  const handleUserClick = (username: string) => {
    void navigate(`/${username}`);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
        }}
      />

      <div className="md:hidden sticky top-0 z-10 bg-white p-4 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {searchTerm.length > 0 && (
          <div className="absolute left-0 right-0 bg-white border-x border-b rounded-b-lg shadow-lg max-h-[calc(100vh-200px)] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Searching...</p>
              </div>
            ) : error != null ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2 p-2">
                {searchResults.map((user) => (
                  <div
                    key={user?.user_id}
                    onClick={() => {
                      handleUserClick(user?.username as string);
                    }}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <img
                      src={`https://waffle-instaclone.kro.kr/${user?.profile_image as string}`}
                      alt={user?.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{user?.username}</p>
                      <p className="text-sm text-gray-500">{user?.full_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No results found</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <PostGrid posts={posts} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-0 md:top-0 md:right-auto md:w-64 bg-white border-t md:border-r md:border-t-0">
        <SideBar
          onSearchClick={() => {
            setIsSearchOpen(true);
          }}
        />
        <MobileBar />
      </div>
    </div>
  );
};

export default ExplorePage;
