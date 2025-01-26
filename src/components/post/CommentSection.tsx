import { useUserInfo } from '../../hooks/useUserInfo';
import type { Comment } from '../../types/comment';

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const { userInfo, loading } = useUserInfo(comment.user_id.toString());

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
      <div>
        <span className="font-semibold mr-2">
          {loading ? '...' : userInfo?.username}
        </span>
        <span>{comment.comment_text}</span>
      </div>
    </div>
  );
};

interface CommentSectionProps {
  comments: Comment[];
}

const CommentSection = ({ comments }: CommentSectionProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {comments.map((comment) => (
        <CommentItem key={comment.comment_id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentSection;
