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
    <div className="flex space-x-2 p-3 md:p-4 border-b last:border-b-0">
      <img
        src={
          userInfo?.profile_image != null
            ? `https://waffle-instaclone.kro.kr/${userInfo.profile_image}`
            : '/placeholder.svg'
        }
        alt={userInfo?.username ?? 'User'}
        className="w-7 h-7 md:w-8 md:h-8 rounded-full flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-sm md:text-base mr-2">
              {loading ? '...' : userInfo?.username}
            </span>
            <span className="text-sm md:text-base break-words">
              {comment.comment_text}
            </span>
          </div>
          {isOwnComment && (
            <div className="relative ml-2 flex-shrink-0">
              <button
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 md:w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <button
                      className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
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
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {comments.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 text-sm md:text-base">
          No comments yet
        </div>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.comment_id}
            comment={comment}
            currentUserId={currentUserId}
            onCommentDelete={onCommentDelete}
          />
        ))
      )}
    </div>
  );
};

export default CommentSection;
