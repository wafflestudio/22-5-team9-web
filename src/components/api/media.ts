import type { Medium } from '../../types/media';
import { apiClient } from './client';

export const mediaApi = {
  upload: async (
    file: File,
    postId?: number,
    storyId?: number,
  ): Promise<Medium> => {
    const formData = new FormData();
    formData.append('file', file);
    if (postId != null) formData.append('post_id', postId.toString());
    if (storyId != null) formData.append('story_id', storyId.toString());

    return await apiClient.post('/medium/', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
      },
    });
  },

  getByPost: async (postId: number): Promise<Medium[]> => {
    return await apiClient.get(`/medium/post/${postId}`);
  },

  delete: async (imageId: number): Promise<void> => {
    await apiClient.delete(`/medium/${imageId}`);
  },
};
