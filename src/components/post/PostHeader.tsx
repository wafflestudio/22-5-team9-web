import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserInfo } from '../../hooks/useUserInfo';
import type { Post } from '../../types/post';
import EditPostModal from '../modals/EditPostModal';

interface PostHeaderProps {
  userId: number;
  isOwnPost: boolean;
  onDelete: () => void;
  post: Post;
  onEdit: (updatedPost: Post) => void;
}

const PostHeader = ({
  userId,
  isOwnPost,
  onDelete,
  post,
  onEdit,
}: PostHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { userInfo, loading } = useUserInfo(userId.toString());
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (userInfo?.username != null) {
      void navigate(`/${userInfo.username}`);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <div
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors p-2"
          onClick={handleProfileClick}
        >
          <img
            src={
              userInfo?.profile_image != null
                ? `https://waffle-instaclone.kro.kr/${userInfo.profile_image}`
                : '/placeholder.svg'
            }
            alt={userInfo?.username ?? 'User'}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold">
            {loading ? '...' : userInfo?.username}
          </span>
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
                        setIsEditModalOpen(true);
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
      {isEditModalOpen && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
          }}
          post={post}
          onEdit={onEdit}
        />
      )}
    </>
  );
};

export default PostHeader;
