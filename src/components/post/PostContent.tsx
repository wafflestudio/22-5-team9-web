import { useUserInfo } from '../../hooks/useUserInfo';

interface PostContentProps {
  userId: number;
  postText: string;
}

const PostContent = ({ userId, postText }: PostContentProps) => {
  const { userInfo, loading } = useUserInfo(userId.toString());

  return (
    <div className="p-4 border-b">
      <div className="flex space-x-2">
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
          <span>{postText}</span>
        </div>
      </div>
    </div>
  );
};

export default PostContent;
