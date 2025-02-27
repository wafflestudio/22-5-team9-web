import type { Post } from '../types/post';
import { authenticatedFetch } from '../utils/auth';

const fetchUserPosts = async (userId: number): Promise<Post[]> => {
  const response = await fetch(
    `https://waffle-instaclone.kro.kr/api/post/user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
      },
    },
  );
  return response.json() as Promise<Post[]>;
};

export const fetchFollowingPosts = async (
  userIds: number[],
): Promise<Post[]> => {
  try {
    const postsPromises = userIds.map((id) => fetchUserPosts(id));
    const postsArrays = await Promise.all(postsPromises);
    return postsArrays.flat();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const getExplorePosts = async () => {
  const response = await fetch(
    'https://waffle-instaclone.kro.kr/api/post/explore',
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch explore posts');
  }

  return (await response.json()) as Post[];
};

export const fetchPost = async (postId: string) => {
  const response = await authenticatedFetch(
    `https://waffle-instaclone.kro.kr/api/post/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
      },
    },
  );
  return response.json() as Promise<Post>;
};

export const createPost = async (imageFile: File, content?: string) => {
  const formData = new FormData();
  formData.append('media', imageFile);
  if (content != null && content.length > 0) {
    formData.append('post_text', content);
  }

  const result = await fetch('https://waffle-instaclone.kro.kr/api/post/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
    },
    body: formData,
  });

  if (!result.ok) {
    const errorData = await result.text();
    console.error('Post creation failed:', errorData);
    throw new Error(`Failed to create post: ${result.status} ${errorData}`);
  }

  return result.json() as Promise<Post>;
};

export const deletePost = async (postId: number): Promise<void> => {
  const response = await fetch(
    `https://waffle-instaclone.kro.kr/api/post/${postId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to delete post: ${response.status}`);
  }
};

export const editPost = async (postId: number, content: string) => {
  const formData = new FormData();
  formData.append('post_text', content);

  const response = await fetch(
    `https://waffle-instaclone.kro.kr/api/post/${postId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to edit post: ${response.status}`);
  }

  return response.json() as Promise<Post>;
};
