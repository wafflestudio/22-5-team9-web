import type { Comment } from '../../types/comment';

interface CommentSectionProps {
  comments: Comment[];
}

const CommentSection = ({ comments }: CommentSectionProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {comments.map((comment) => (
        <div key={comment.comment_id} className="flex space-x-2 p-4 border-b">
          <img
            src={''}
            alt={comment.user_id.toString()}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <span className="font-semibold mr-2">{comment.user_id}</span>
            <span>{comment.comment_text}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
