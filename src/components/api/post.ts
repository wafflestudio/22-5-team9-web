import type {
  Post,
  PostCreateRequest,
  PostEditRequest,
} from '../../types/post';
import { apiClient } from './client';

export const postApi = {
  create: async (data: PostCreateRequest): Promise<Post> => {
    const formData = new FormData();
    data.media.forEach((file) => {
      formData.append('media', file);
    });
    if (data.location != null) formData.append('location', data.location);
    if (data.post_text != null) formData.append('post_text', data.post_text);

    return await apiClient.post('/post/', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
      },
    });
  },

  getExplore: async (): Promise<Post[]> => {
    return await apiClient.get('/post/explore');
  },

  getPost: async (postId: number): Promise<Post> => {
    return await apiClient.get(`/post/${postId}`);
  },

  getUserPosts: async (userIdentifier: string | number): Promise<Post[]> => {
    return await apiClient.get(`/post/user/${userIdentifier}`);
  },

  editPost: async (postId: number, data: PostEditRequest): Promise<Post> => {
    return await apiClient.patch(`/post/${postId}`, data);
  },

  deletePost: async (postId: number): Promise<void> => {
    await apiClient.delete(`/post/${postId}`);
  },

  getFollowingPosts: async (): Promise<Post[]> => {
    return await apiClient.get('/post/posts/following');
  },
};
