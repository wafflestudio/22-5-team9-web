import { useCallback, useState } from 'react';

import { followApi } from '../components/api/follow';
import type { FollowerStats } from '../types/follow';

export function useFollow(initialIsFollowing = false) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerStats, setFollowerStats] = useState<FollowerStats>({
    follower_count: 0,
    following_count: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchFollowerStats = useCallback(async () => {
    try {
      const stats = await followApi.getStats();
      setFollowerStats(stats);
    } catch (error) {
      console.error('Error fetching follower stats:', error);
    }
  }, []);

  const toggleFollow = useCallback(
    async (userId: number) => {
      setLoading(true);
      try {
        if (isFollowing) {
          await followApi.unfollow(userId);
        } else {
          await followApi.follow(userId);
        }
        setIsFollowing(!isFollowing);
        void fetchFollowerStats();
      } catch (error) {
        console.error('Error toggling follow:', error);
      } finally {
        setLoading(false);
      }
    },
    [isFollowing, fetchFollowerStats],
  );

  return {
    isFollowing,
    followerStats,
    loading,
    toggleFollow,
    fetchFollowerStats,
  };
}
