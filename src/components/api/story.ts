import type { Story, StoryViewer } from '../../types/story';
import { apiClient } from './client';

export const storyApi = {
  create: async (files: File[]): Promise<Story> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const accessToken = localStorage.getItem('access_token');
    return await apiClient.post('/story/', formData, {
      headers:
        accessToken != null ? { Authorization: `Bearer ${accessToken}` } : {},
    });
  },

  get: async (storyId: number): Promise<Story> => {
    return await apiClient.get(`/story/${storyId}`);
  },

  getUserStories: async (userId: number): Promise<Story[]> => {
    return await apiClient.get(`/story/list/${userId}`);
  },

  delete: async (storyId: number): Promise<void> => {
    await apiClient.delete(`/story/${storyId}`);
  },

  edit: async (storyId: number, files: File[]): Promise<Story> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    const accessToken = localStorage.getItem('access_token');
    return await apiClient.patch(`/story/edit/${storyId}`, formData, {
      headers:
        accessToken != null ? { Authorization: `Bearer ${accessToken}` } : {},
    });
  },

  getViewers: async (storyId: number): Promise<StoryViewer[]> => {
    return await apiClient.get(`/story/${storyId}/viewers`);
  },
};
