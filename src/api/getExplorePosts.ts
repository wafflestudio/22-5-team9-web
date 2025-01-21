import type { Post } from '../types/post';

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
