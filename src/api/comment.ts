import type { Comment } from '../types/post';

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
