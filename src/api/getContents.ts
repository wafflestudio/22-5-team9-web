import type { Comment, Post } from '../types/post';

export const fetchUserPosts = async (userId: number): Promise<Post[]> => {
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
  const response = await fetch(
    `https://waffle-instaclone.kro.kr/api/post/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
      },
    },
  );
  return response.json() as Promise<Post>;
};

export const fetchComments = async (postId: string) => {
  const response = await fetch(
    `https://waffle-instaclone.kro.kr/api/comment/list/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
      },
    },
  );
  return response.json() as Promise<Comment[]>;
};
