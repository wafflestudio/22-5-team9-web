import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { searchUsers } from '../../api/search';
import type { UserProfile } from '../../types/user';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current != null &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className="fixed left-0 top-0 h-full w-[397px] bg-white shadow-lg animate-slide-in"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Search</h2>
            <button
              onClick={onClose}
              className="hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

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
              autoFocus
            />
          </div>

          <div
            className="mt-6 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Searching...</p>
              </div>
            ) : error != null ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : searchTerm.length > 0 ? (
              searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((user) => (
                    <div
                      key={user?.user_id}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <img
                        src={`https://waffle-instaclone.kro.kr/${user?.profile_image as string}`}
                        alt={user?.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{user?.username}</p>
                        <p className="text-sm text-gray-500">
                          {user?.full_name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No results found</p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Recent searches</p>
                <p className="mt-2 text-sm text-gray-400">No recent searches</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
