import type { FollowButtonProps } from '../../types/follow';

const FollowButton = ({ isFollowing, onFollowChange }: FollowButtonProps) => {
  return (
    <button
      onClick={() => {
        onFollowChange();
      }}
      className={`px-6 py-2 rounded-md text-sm font-semibold ${
        isFollowing
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
