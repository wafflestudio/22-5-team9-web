import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface PostHeaderProps {
  userId: number;
  isOwnPost: boolean;
  onDelete: () => void;
}

const PostHeader = ({ userId, isOwnPost, onDelete }: PostHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <img
          src={''}
          alt={userId.toString()}
          className="w-8 h-8 rounded-full"
        />
        <span className="font-semibold">{userId}</span>
      </div>
      <div className="relative">
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              {isOwnPost ? (
                <>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this post?',
                        )
                      ) {
                        onDelete();
                      }
                      setIsMenuOpen(false);
                    }}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  Report
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
