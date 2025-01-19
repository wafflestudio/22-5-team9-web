import type {
  FollowerResponse,
  FollowerStats,
  FollowingResponse,
} from '../../types/follow';
import { apiClient } from './client';

export const followApi = {
  getStats: async (): Promise<FollowerStats> => {
    return await apiClient.get('/follower/follower_number');
  },

  getFollowers: async (): Promise<FollowerResponse> => {
    return await apiClient.get('/follower/followers');
  },

  getFollowing: async (): Promise<FollowingResponse> => {
    return await apiClient.get('/follower/following');
  },

  follow: async (userId: number): Promise<void> => {
    await apiClient.post('/follower/follow', { follow_id: userId });
  },

  unfollow: async (userId: number): Promise<void> => {
    await apiClient.post('/follower/unfollow', { follow_id: userId });
  },
};
