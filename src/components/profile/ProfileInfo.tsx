import { Settings } from 'lucide-react';
import { useEffect } from 'react';

import { useFollow } from '../../hooks/useFollow';
import FollowButton from '../shared/FollowButton';

type ProfileInfoProps = {
  userId: number;
  username: string;
  posts: number;
  followers: number;
  following: number;
  fullName: string;
  bio: string;
  isOwner: boolean;
};

const ProfileInfo = ({
  userId,
  username,
  posts,
  fullName,
  bio,
  isOwner,
}: ProfileInfoProps) => {
  const { isFollowing, followerStats, toggleFollow, fetchFollowerStats } =
    useFollow();

  useEffect(() => {
    void fetchFollowerStats();
  }, [userId, fetchFollowerStats]);

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <img
          src="https://placehold.co/32x32"
          alt={username}
          className="w-20 h-20 rounded-full mr-4"
        />
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h1 className="text-xl font-semibold mr-4">{username}</h1>
            {!isOwner && (
              <FollowButton
                userId={userId}
                isFollowing={isFollowing}
                onFollowChange={() => {
                  void toggleFollow(userId);
                }}
              />
            )}
            {isOwner && <Settings className="w-6 h-6" />}
          </div>
          <div className="flex space-x-4 text-sm">
            <span>
              <strong>{posts}</strong> posts
            </span>
            <span>
              <strong>{followerStats.follower_count}</strong> followers
            </span>
            <span>
              <strong>{followerStats.following_count}</strong> following
            </span>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <h2 className="font-semibold">{fullName}</h2>
        <p>{bio}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
