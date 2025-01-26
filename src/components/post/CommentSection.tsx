import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

import { deleteComment } from '../../api/comment';
import { useUserInfo } from '../../hooks/useUserInfo';
import type { Comment } from '../../types/comment';

interface CommentItemProps {
  comment: Comment;
  currentUserId: number;
  onCommentDelete: (commentId: number) => void;
}

const CommentItem = ({
  comment,
  currentUserId,
  onCommentDelete,
}: CommentItemProps) => {
  const { userInfo, loading } = useUserInfo(comment.user_id.toString());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isOwnComment = comment.user_id === currentUserId;

  const handleDelete = async () => {
    try {
      await deleteComment(comment.comment_id);
      onCommentDelete(comment.comment_id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className="flex space-x-2 p-4 border-b">
      <img
        src={
          userInfo?.profile_image != null
            ? `https://waffle-instaclone.kro.kr/${userInfo.profile_image}`
            : '/placeholder.svg'
        }
        alt={userInfo?.username ?? 'User'}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold mr-2">
            {loading ? '...' : userInfo?.username}
          </span>
          {isOwnComment && (
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
                    <button
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                      onClick={() => {
                        if (window.confirm('Delete this comment?')) {
                          void handleDelete();
                        }
                        setIsMenuOpen(false);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <span>{comment.comment_text}</span>
      </div>
    </div>
  );
};

interface CommentSectionProps {
  comments: Comment[];
  currentUserId: number;
  onCommentDelete: (commentId: number) => void;
}

const CommentSection = ({
  comments,
  currentUserId,
  onCommentDelete,
}: CommentSectionProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {comments.map((comment) => (
        <CommentItem
          key={comment.comment_id}
          comment={comment}
          currentUserId={currentUserId}
          onCommentDelete={onCommentDelete}
        />
      ))}
    </div>
  );
};

export default CommentSection;
