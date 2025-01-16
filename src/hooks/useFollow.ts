import { useCallback,useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { FollowerStats } from '../types/follow';
import { useAuth } from './useAuth';

export function useFollow(initialIsFollowing: boolean = false) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerStats, setFollowerStats] = useState<FollowerStats>({ 
    follower_count: 0, 
    following_count: 0 
  });
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const fetchFollowerStats = useCallback(async (userId: number) => {
    try {
      const token = auth.getAccessToken();
      if (token == null) {
        throw new Error('No access token');
      }

      const response = await fetch(`http://3.34.185.81:8000/api/follower/follower_number`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          auth.handleLogout();
          void navigate('/');
        }
        throw new Error('Failed to fetch follower stats');
      }

      const stats = await response.json() as FollowerStats;
      setFollowerStats(stats);
    } catch (error) {
      console.error('Error fetching follower stats:', error);
    }
  }, [auth, navigate]);

  const toggleFollow = useCallback(async (userId: number) => {
    setLoading(true);
    try {
      const token = auth.getAccessToken();
      if (token == null) {
        throw new Error('No access token');
      }

      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const response = await fetch(`http://3.34.185.81:8000/api/follower/${endpoint}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ follow_id: userId })
      });

      if (!response.ok) {
        if (response.status === 401) {
          auth.handleLogout();
          void navigate('/');
        }
        throw new Error(`Failed to ${endpoint}`);
      }

      setIsFollowing(!isFollowing);
      void fetchFollowerStats(userId);
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  }, [isFollowing, auth, navigate, fetchFollowerStats]);

  return {
    isFollowing,
    followerStats,
    loading,
    toggleFollow,
    fetchFollowerStats
  };
}