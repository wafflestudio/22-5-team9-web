export interface FollowerStats {
  follower_count: number;
  following_count: number;
}

export interface FollowButtonProps {
  userId: number;
  isFollowing: boolean;
  onFollowChange: () => void;
}
