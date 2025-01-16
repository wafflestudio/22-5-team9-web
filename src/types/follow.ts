export interface FollowerStats {
    follower_count: number;
    following_count: number;
  }
  
  export interface FollowerResponse {
    follower_ids: number[];
  }
  
  export interface FollowingResponse {
    following_ids: number[];
  }
  
  export interface FollowButtonProps {
    userId: number;
    isFollowing: boolean;
    onFollowChange: () => void;
  }