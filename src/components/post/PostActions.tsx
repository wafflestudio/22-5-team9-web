import { Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface PostActionsProps {
  likes: number[];
  currentUserId: number;
  onLikeToggle: () => void;
  onAddComment: (comment: string) => void;
}

const PostActions = ({
  likes,
  currentUserId,
  onLikeToggle,
  onAddComment,
}: PostActionsProps) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="border-t">
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <Heart
            className={`w-6 h-6 cursor-pointer ${
              likes.includes(currentUserId) ? 'fill-red-500 text-red-500' : ''
            }`}
            onClick={onLikeToggle}
          />
          <MessageCircle className="w-6 h-6" />
        </div>
        <p className="font-semibold mb-3">
          {likes.length.toLocaleString()} likes
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center px-4 py-3 border-t"
      >
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 border-none focus:ring-0 outline-none"
          value={newComment}
          onChange={(e) => {
            setNewComment(e.target.value);
          }}
        />
        <button
          type="submit"
          disabled={newComment.length === 0}
          className={`text-blue-500 font-semibold ${
            newComment.length === 0 ? 'opacity-50 cursor-default' : ''
          }`}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default PostActions;
